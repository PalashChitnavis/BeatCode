import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Crown, Trophy } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import type { LeaderboardEntryDTO, Page } from "@beatcode/shared";
import { PageContainer, PageHeader } from "@/components/PageContainer";
import { Pagination } from "@/components/Pagination";
import { EmptyState, ErrorState } from "@/components/states";
import { UserAvatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/features/auth/hooks";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;
const crownColor = ["text-yellow-400", "text-zinc-300", "text-amber-600"];

export function LeaderboardPage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") ?? 1) || 1;
  const me = useCurrentUser();
  const leaderboard = useQuery({
    queryKey: ["leaderboard", page],
    queryFn: () =>
      api
        .get<Page<LeaderboardEntryDTO>>("/leaderboard", { params: { page, pageSize: PAGE_SIZE } })
        .then((r) => r.data),
    placeholderData: keepPreviousData,
  });

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader
        title="Leaderboard"
        description="Ranked by problems solved, with harder problems breaking ties."
      />
      <Card className="overflow-hidden">
        {leaderboard.isError ? (
          <ErrorState error={leaderboard.error} onRetry={() => leaderboard.refetch()} />
        ) : leaderboard.isPending ? (
          <div className="grid gap-2 p-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-11" />
            ))}
          </div>
        ) : leaderboard.data.items.length === 0 ? (
          <EmptyState icon={<Trophy />} title="No one is on the board yet">
            Solve a problem to claim the top spot.
          </EmptyState>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="w-16 px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="w-20 px-4 py-3 text-right font-medium">Solved</th>
                <th className="hidden w-40 px-4 py-3 text-right font-medium sm:table-cell">
                  Easy · Med · Hard
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.data.items.map((entry) => (
                <tr
                  key={entry.user.id}
                  className={cn(
                    "border-b last:border-0 hover:bg-muted/40",
                    entry.user.id === me?.id && "bg-primary/5",
                  )}
                >
                  <td className="px-4 py-3 font-semibold">
                    <span className="inline-flex items-center gap-1">
                      {entry.rank <= 3 && <Crown className={cn("size-4", crownColor[entry.rank - 1])} />}
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/u/${entry.user.id}`} className="flex items-center gap-3 hover:text-primary">
                      <UserAvatar name={entry.user.name} src={entry.user.avatarUrl} seed={entry.user.id} />
                      <span className="font-medium">{entry.user.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{entry.solved}</td>
                  <td className="hidden px-4 py-3 text-right text-muted-foreground sm:table-cell">
                    <span className="text-easy">{entry.easy}</span> ·{" "}
                    <span className="text-medium">{entry.medium}</span> ·{" "}
                    <span className="text-hard">{entry.hard}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {leaderboard.data && (
        <div className="mt-4">
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={leaderboard.data.total}
            onPageChange={(p) => setParams({ page: String(p) })}
          />
        </div>
      )}
    </PageContainer>
  );
}
