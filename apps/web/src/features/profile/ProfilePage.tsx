import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Trophy } from "lucide-react";
import { Link, useParams } from "react-router";
import type { ProfileDTO } from "@beatcode/shared";
import { DifficultyBadge } from "@/components/badges";
import { PageContainer } from "@/components/PageContainer";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { UserAvatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/features/problems/StatsCard";
import { api } from "@/lib/api";
import { formatDateTime, timeAgo } from "@/lib/utils";

export function ProfilePage() {
  const { userId = "" } = useParams();
  const profile = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => api.get<ProfileDTO>(`/users/${userId}/profile`).then((r) => r.data),
  });

  if (profile.isPending) return <LoadingState className="min-h-[60vh]" />;
  if (profile.isError)
    return <ErrorState className="min-h-[60vh]" error={profile.error} onRetry={() => profile.refetch()} />;
  const { user, stats, rank, recentSolved } = profile.data;

  return (
    <PageContainer className="max-w-4xl">
      <div className="mb-8 flex flex-wrap items-center gap-5">
        <UserAvatar name={user.name} src={user.avatarUrl} seed={user.id} className="size-20 text-2xl" />
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" /> Joined {formatDateTime(user.createdAt).split(",")[0]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="size-4" /> {rank ? `Rank #${rank}` : "Unranked"}
            </span>
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
        <StatsCard stats={stats} />
        <Card>
          <CardHeader>
            <CardTitle>Recently solved</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentSolved.length === 0 ? (
              <EmptyState title="No problems solved yet" />
            ) : (
              recentSolved.map((item) => (
                <Link
                  key={item.slug}
                  to={`/problems/${item.slug}`}
                  className="flex items-center gap-3 border-t px-5 py-3 text-sm hover:bg-muted/40"
                >
                  <span className="font-medium">{item.title}</span>
                  <DifficultyBadge difficulty={item.difficulty} />
                  <span className="ml-auto text-xs text-muted-foreground">{timeAgo(item.solvedAt)}</span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
