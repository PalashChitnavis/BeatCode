import { DIFFICULTIES, type UserStatsDTO } from "@beatcode/shared";
import { difficultyLabel } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const barColor = { EASY: "bg-easy", MEDIUM: "bg-medium", HARD: "bg-hard" } as const;

export function StatsCard({ stats, loading }: { stats?: UserStatsDTO; loading?: boolean }) {
  const solved = stats ? DIFFICULTIES.reduce((sum, d) => sum + stats.solved[d], 0) : 0;
  const total = stats ? DIFFICULTIES.reduce((sum, d) => sum + stats.total[d], 0) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your progress</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading || !stats ? (
          <Skeleton className="h-28" />
        ) : (
          <>
            <p className="text-3xl font-bold">
              {solved}
              <span className="text-base font-normal text-muted-foreground"> / {total} solved</span>
            </p>
            {DIFFICULTIES.map((d) => {
              const value = stats.solved[d];
              const max = stats.total[d];
              return (
                <div key={d} className="grid gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{difficultyLabel(d)}</span>
                    <span className="font-medium">
                      {value}/{max}
                    </span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-label={`${difficultyLabel(d)} solved`}
                    aria-valuenow={value}
                    aria-valuemax={max}
                  >
                    <div
                      className={`h-full rounded-full ${barColor[d]}`}
                      style={{ width: `${max ? (value / max) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </CardContent>
    </Card>
  );
}
