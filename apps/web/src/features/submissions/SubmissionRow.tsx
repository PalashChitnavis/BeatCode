import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { LANGUAGE_LABELS, type SubmissionDTO } from "@beatcode/shared";
import { VerdictText } from "@/components/badges";
import { CodeBlock } from "@/components/CodeBlock";
import { UserAvatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/states";
import { cn, formatDateTime, timeAgo } from "@/lib/utils";
import { JudgeResultView, PlaygroundResultView } from "./ResultView";

/** Collapsible submission summary with code and result details. */
export function SubmissionRow({
  submission,
  showUser,
  showProblem,
}: {
  submission: SubmissionDTO;
  showUser?: boolean;
  showProblem?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted/40"
        aria-expanded={open}
      >
        {showUser && submission.user && (
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar
              name={submission.user.name}
              src={submission.user.avatarUrl}
              seed={submission.user.id}
              className="size-6"
            />
            <span className="truncate font-medium">{submission.user.name}</span>
          </span>
        )}
        {submission.status === "PENDING" ? (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Spinner className="size-4" /> Judging
          </span>
        ) : submission.kind === "PLAYGROUND" ? (
          <span className="font-medium">
            {submission.verdict === "ACCEPTED" ? (
              "Ran successfully"
            ) : (
              <VerdictText verdict={submission.verdict!} />
            )}
          </span>
        ) : (
          <VerdictText verdict={submission.verdict!} />
        )}
        {showProblem && submission.problem && (
          <span className="truncate text-muted-foreground">{submission.problem.title}</span>
        )}
        <span className="ml-auto rounded bg-muted px-2 py-0.5 text-xs">
          {LANGUAGE_LABELS[submission.language]}
        </span>
        {submission.runtimeMs !== null && (
          <span className="hidden w-16 text-right text-xs text-muted-foreground sm:inline">
            {submission.runtimeMs} ms
          </span>
        )}
        <span
          className="hidden w-24 text-right text-xs text-muted-foreground sm:inline"
          title={formatDateTime(submission.createdAt)}
        >
          {timeAgo(submission.createdAt)}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="grid gap-4 px-4 pb-4">
          <CodeBlock code={submission.code} language={submission.language} />
          {submission.status === "DONE" &&
            (submission.kind === "PLAYGROUND" ? (
              <>
                {submission.stdin ? (
                  <pre className="rounded-md bg-muted/60 px-3 py-2 font-mono text-xs">{submission.stdin}</pre>
                ) : null}
                <PlaygroundResultView submission={submission} />
              </>
            ) : (
              <JudgeResultView submission={submission} />
            ))}
        </div>
      )}
    </div>
  );
}
