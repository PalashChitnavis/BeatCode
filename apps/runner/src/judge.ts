import {
  normalizeOutput,
  type JudgeJob,
  type JudgeResult,
  type TestResultDTO,
  type Verdict,
} from "@beatcode/shared";
import { logger } from "./config";
import { LANGUAGE_CONFIG } from "./languages";
import type { ProcessResult } from "./process";
import { Sandbox } from "./sandbox";

const COMPILE_TIMEOUT_MS = 20_000;
const PREVIEW_CHARS = 1000;

const preview = (text: string, max = PREVIEW_CHARS) => (text.length > max ? `${text.slice(0, max)}…` : text);

const SIGKILL_EXIT = 137;

/** Maps a finished run to a failure verdict, or null if the program exited normally. */
export function classifyRun(
  result: ProcessResult,
  limitMs: number,
): { verdict: Verdict; message?: string } | null {
  if (result.timedOut || result.durationMs >= limitMs) return { verdict: "TIME_LIMIT_EXCEEDED" };
  if (result.outputLimitExceeded) return { verdict: "RUNTIME_ERROR", message: "Output limit exceeded" };
  if (result.exitCode === 0) return null;
  if (/OutOfMemoryError|MemoryError|std::bad_alloc/.test(result.stderr))
    return { verdict: "MEMORY_LIMIT_EXCEEDED" };
  // `timeout -s KILL` and the kernel OOM killer both end the process with SIGKILL.
  if (result.exitCode === SIGKILL_EXIT || result.exitCode === 124) {
    return result.durationMs >= limitMs * 0.9
      ? { verdict: "TIME_LIMIT_EXCEEDED" }
      : { verdict: "MEMORY_LIMIT_EXCEEDED" };
  }
  return { verdict: "RUNTIME_ERROR", message: `Process exited with code ${result.exitCode}` };
}

const emptyResult = (submissionId: string, verdict: Verdict): JudgeResult => ({
  submissionId,
  verdict,
  stdout: null,
  stderr: null,
  compileOutput: null,
  runtimeMs: null,
  passedCount: null,
  totalCount: null,
  testResults: null,
});

export async function judge(job: JudgeJob): Promise<JudgeResult> {
  const language = LANGUAGE_CONFIG[job.language];
  const limitMs = job.timeLimitMs * language.timeMultiplier;
  let sandbox: Sandbox | null = null;

  try {
    sandbox = await Sandbox.create(language);
    await sandbox.writeFile(language.file, job.source);

    if (language.compile) {
      const compiled = await sandbox.exec(language.compile, { timeoutMs: COMPILE_TIMEOUT_MS });
      if (compiled.exitCode !== 0 || compiled.timedOut) {
        return {
          ...emptyResult(job.submissionId, "COMPILE_ERROR"),
          compileOutput:
            preview((compiled.stderr || compiled.stdout).trim(), 8000) || "Compilation timed out",
        };
      }
    }

    if (job.kind === "PLAYGROUND") {
      const run = await sandbox.exec(language.run, { stdin: job.stdin ?? "", timeoutMs: limitMs });
      const failure = classifyRun(run, limitMs);
      return {
        ...emptyResult(job.submissionId, failure?.verdict ?? "ACCEPTED"),
        stdout: run.stdout,
        stderr: [run.stderr, failure?.message].filter(Boolean).join("\n") || null,
        runtimeMs: run.durationMs,
      };
    }

    const tests = job.tests ?? [];
    const results: TestResultDTO[] = [];
    let passedCount = 0;
    let maxRuntime = 0;
    let verdict: Verdict = "ACCEPTED";

    for (const [index, test] of tests.entries()) {
      const run = await sandbox.exec(language.run, { stdin: test.input, timeoutMs: limitMs });
      maxRuntime = Math.max(maxRuntime, run.durationMs);
      const failure = classifyRun(run, limitMs);
      const testVerdict: Verdict =
        failure?.verdict ??
        (normalizeOutput(run.stdout) === normalizeOutput(test.expectedOutput) ? "ACCEPTED" : "WRONG_ANSWER");
      const passed = testVerdict === "ACCEPTED";

      if (passed) passedCount++;
      else if (verdict === "ACCEPTED") verdict = testVerdict;

      // RUN reports every sample; SUBMIT keeps only the first failing hidden test.
      if (job.kind === "RUN" || !passed) {
        results.push({
          index,
          passed,
          verdict: testVerdict,
          input: preview(test.display),
          expectedOutput: preview(test.expectedOutput),
          actualOutput: preview(run.stdout),
          stderr: preview([run.stderr, failure?.message].filter(Boolean).join("\n"), 4000),
          runtimeMs: run.durationMs,
        });
      }
      if (!passed && job.stopOnFirstFailure) break;
    }

    return {
      ...emptyResult(job.submissionId, verdict),
      runtimeMs: maxRuntime,
      passedCount,
      totalCount: tests.length,
      testResults: results,
    };
  } catch (error) {
    logger.error({ err: error, submissionId: job.submissionId }, "judge failed");
    return { ...emptyResult(job.submissionId, "INTERNAL_ERROR"), stderr: "The judge encountered an error" };
  } finally {
    await sandbox?.destroy();
  }
}
