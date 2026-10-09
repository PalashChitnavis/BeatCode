import { Clock } from "lucide-react";
import { useState } from "react";
import type { SubmissionDTO, TestResultDTO } from "@beatcode/shared";
import { VerdictText } from "@/components/badges";
import { Spinner } from "@/components/states";
import { cn } from "@/lib/utils";

export function OutputBlock({ label, value, tone }: { label: string; value: string; tone?: "error" }) {
  return (
    <div className="grid gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <pre
        className={cn(
          "max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted/60 px-3 py-2 font-mono text-xs",
          tone === "error" && "bg-destructive/10 text-destructive",
        )}
      >
        {value === "" ? <span className="italic text-muted-foreground">(empty)</span> : value}
      </pre>
    </div>
  );
}

function TestCaseTabs({ results }: { results: TestResultDTO[] }) {
  const [active, setActive] = useState(0);
  const current = results[Math.min(active, results.length - 1)];
  if (!current) return null;
  return (
    <div className="grid gap-3">
      {results.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {results.map((r, i) => (
            <button
              key={r.index}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium",
                i === active ? "bg-muted" : "text-muted-foreground hover:bg-muted/60",
              )}
            >
              <span className={cn("size-1.5 rounded-full", r.passed ? "bg-easy" : "bg-hard")} />
              Case {r.index + 1}
            </button>
          ))}
        </div>
      )}
      <OutputBlock label="Input" value={current.input} />
      <OutputBlock label="Output" value={current.actualOutput} />
      <OutputBlock label="Expected" value={current.expectedOutput} />
      {current.stderr && <OutputBlock label="Error" value={current.stderr} tone="error" />}
    </div>
  );
}

export function JudgingIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner className="size-4" /> Running your code…
    </div>
  );
}

/** Verdict summary plus per-test details for RUN and SUBMIT results. */
export function JudgeResultView({ submission }: { submission: SubmissionDTO }) {
  const { verdict, kind } = submission;
  if (!verdict) return null;
  const results = submission.testResults ?? [];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <VerdictText verdict={verdict} className="text-lg" />
        {submission.totalCount !== null && (
          <span className="text-sm text-muted-foreground">
            {submission.passedCount} / {submission.totalCount} test cases passed
          </span>
        )}
        {submission.runtimeMs !== null && verdict === "ACCEPTED" && (
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="size-3.5" /> {submission.runtimeMs} ms
          </span>
        )}
      </div>

      {verdict === "COMPILE_ERROR" && submission.compileOutput && (
        <OutputBlock label="Compiler output" value={submission.compileOutput} tone="error" />
      )}
      {verdict === "INTERNAL_ERROR" && submission.stderr && (
        <OutputBlock label="Details" value={submission.stderr} tone="error" />
      )}
      {kind === "SUBMIT" && verdict !== "ACCEPTED" && results.length > 0 && (
        <p className="text-sm font-medium">Failing test case</p>
      )}
      {results.length > 0 && <TestCaseTabs results={results} />}
    </div>
  );
}

/** stdout / stderr view for playground runs. */
export function PlaygroundResultView({ submission }: { submission: SubmissionDTO }) {
  const { verdict } = submission;
  return (
    <div className="grid gap-3">
      {verdict && verdict !== "ACCEPTED" && <VerdictText verdict={verdict} />}
      {verdict === "COMPILE_ERROR" ? (
        <OutputBlock label="Compiler output" value={submission.compileOutput ?? ""} tone="error" />
      ) : (
        <>
          <OutputBlock label="Output" value={submission.stdout ?? ""} />
          {submission.stderr && <OutputBlock label="Errors" value={submission.stderr} tone="error" />}
        </>
      )}
      {submission.runtimeMs !== null && (
        <p className="text-xs text-muted-foreground">Finished in {submission.runtimeMs} ms</p>
      )}
    </div>
  );
}
