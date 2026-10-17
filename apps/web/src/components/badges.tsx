import { CheckCircle2, XCircle } from "lucide-react";
import { VERDICT_LABELS, type Difficulty, type Verdict } from "@beatcode/shared";
import { difficultyLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const difficultyStyles: Record<Difficulty, string> = {
  EASY: "text-easy bg-easy/12",
  MEDIUM: "text-medium bg-medium/12",
  HARD: "text-hard bg-hard/12",
};

export function DifficultyBadge({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
        difficultyStyles[difficulty],
        className,
      )}
    >
      {difficultyLabel(difficulty)}
    </span>
  );
}

export function VerdictText({ verdict, className }: { verdict: Verdict; className?: string }) {
  const accepted = verdict === "ACCEPTED";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold",
        accepted ? "text-easy" : "text-hard",
        className,
      )}
    >
      {accepted ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
      {VERDICT_LABELS[verdict]}
    </span>
  );
}
