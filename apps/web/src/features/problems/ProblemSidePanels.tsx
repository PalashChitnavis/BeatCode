import { Eye, History, Users } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { LANGUAGE_LABELS, type ProblemDetailDTO } from "@beatcode/shared";
import { DifficultyBadge } from "@/components/badges";
import { CodeBlock } from "@/components/CodeBlock";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/app/RequireAuth";
import { SubmissionRow } from "@/features/submissions/SubmissionRow";
import { useAuthStatus } from "@/features/auth/hooks";
import { useProblemSubmissions, useSolutions } from "./api";

export function ProblemDescription({ problem }: { problem: ProblemDetailDTO }) {
  return (
    <article className="grid gap-5 p-5">
      <div className="grid gap-3">
        <h1 className="text-xl font-bold">{problem.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="prose-problem text-sm">
        <ReactMarkdown>{problem.description}</ReactMarkdown>
      </div>
      {problem.samples.map((sample, i) => (
        <div key={i} className="grid gap-2">
          <p className="text-sm font-semibold">Example {i + 1}</p>
          <div className="grid gap-1 rounded-lg border-l-2 border-border bg-muted/40 px-4 py-3 font-mono text-xs">
            <p>
              <span className="font-semibold">Input:</span> {sample.input}
            </p>
            <p>
              <span className="font-semibold">Output:</span> {sample.expectedOutput}
            </p>
            {sample.explanation && (
              <p className="font-sans text-muted-foreground">
                <span className="font-semibold text-foreground">Explanation:</span> {sample.explanation}
              </p>
            )}
          </div>
        </div>
      ))}
      {problem.constraints.length > 0 && (
        <div className="grid gap-2">
          <p className="text-sm font-semibold">Constraints</p>
          <ul className="list-disc pl-5 font-mono text-xs leading-6">
            {problem.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export function SolutionsPanel({ slug }: { slug: string }) {
  const [revealed, setRevealed] = useState(false);
  const authenticated = useAuthStatus() === "authenticated";
  const solutions = useSolutions(slug, revealed && authenticated);

  return (
    <RequireAuth reason="Sign in to view solutions">
      {!revealed ? (
        <EmptyState icon={<Eye />} title="Try it yourself first">
          <p className="mb-3">Reference solutions are hidden to avoid spoilers.</p>
          <Button variant="outline" size="sm" onClick={() => setRevealed(true)}>
            Show solutions
          </Button>
        </EmptyState>
      ) : solutions.isPending ? (
        <LoadingState />
      ) : solutions.isError ? (
        <ErrorState error={solutions.error} onRetry={() => solutions.refetch()} />
      ) : (
        <div className="grid gap-5 p-5">
          {solutions.data.map((s) => (
            <div key={s.language} className="grid gap-2">
              <p className="text-sm font-semibold">{LANGUAGE_LABELS[s.language]}</p>
              <CodeBlock code={s.code} language={s.language} />
            </div>
          ))}
        </div>
      )}
    </RequireAuth>
  );
}

export function ProblemSubmissionsPanel({ slug, scope }: { slug: string; scope: "me" | "accepted" }) {
  const authenticated = useAuthStatus() === "authenticated";
  const submissions = useProblemSubmissions(slug, scope, authenticated);

  return (
    <RequireAuth
      reason={scope === "me" ? "Sign in to see your submissions" : "Sign in to see accepted solutions"}
    >
      {submissions.isPending ? (
        <LoadingState />
      ) : submissions.isError ? (
        <ErrorState error={submissions.error} onRetry={() => submissions.refetch()} />
      ) : submissions.data.length === 0 ? (
        <EmptyState
          icon={scope === "me" ? <History /> : <Users />}
          title={scope === "me" ? "No submissions yet" : "No accepted solutions yet"}
        >
          {scope === "accepted" && "Be the first to solve it."}
        </EmptyState>
      ) : (
        <div>
          {submissions.data.map((s) => (
            <SubmissionRow key={s.id} submission={s} showUser={scope === "accepted"} />
          ))}
        </div>
      )}
    </RequireAuth>
  );
}
