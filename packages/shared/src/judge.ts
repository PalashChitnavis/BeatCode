import type { Language, SubmissionKind, Verdict } from "./enums";
import type { TestResultDTO } from "./types";

/** Queue names shared between the API (producer/consumer) and the runner. */
export const JUDGE_QUEUE = "judge";
export const JUDGE_RESULTS_QUEUE = "judge-results";

export interface JudgeTest {
  input: string;
  expectedOutput: string;
  /** Human-readable input echoed back in test results. */
  display: string;
}

/** Self-contained job: the runner never touches the database. */
export interface JudgeJob {
  submissionId: string;
  kind: SubmissionKind;
  language: Language;
  /** Full source to compile, i.e. user code plus the problem driver when judging. */
  source: string;
  /** PLAYGROUND only. */
  stdin?: string;
  /** RUN / SUBMIT only. */
  tests?: JudgeTest[];
  timeLimitMs: number;
  /** SUBMIT stops at the first failing test; RUN reports every sample. */
  stopOnFirstFailure: boolean;
}

export interface JudgeResult {
  submissionId: string;
  verdict: Verdict;
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  runtimeMs: number | null;
  passedCount: number | null;
  totalCount: number | null;
  testResults: TestResultDTO[] | null;
}

/** Output comparison used by the judge: ignores trailing whitespace on each line and at the end. */
export function normalizeOutput(output: string): string {
  return output
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trimEnd();
}
