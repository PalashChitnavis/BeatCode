import { CheckCircle2, CircleDashed, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { DIFFICULTIES, type Difficulty } from "@beatcode/shared";
import { DifficultyBadge } from "@/components/badges";
import { difficultyLabel } from "@/lib/format";
import { PageContainer, PageHeader } from "@/components/PageContainer";
import { Pagination } from "@/components/Pagination";
import { EmptyState, ErrorState } from "@/components/states";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStatus } from "@/features/auth/hooks";
import { useMyStats, useProblems } from "./api";
import { StatsCard } from "./StatsCard";

const PAGE_SIZE = 20;

export function ProblemsPage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") ?? 1) || 1;
  const difficulty = (params.get("difficulty") as Difficulty | null) ?? undefined;
  const search = params.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(search);
  const authenticated = useAuthStatus() === "authenticated";

  const problems = useProblems({ page, pageSize: PAGE_SIZE, difficulty, search: search || undefined });
  const stats = useMyStats(authenticated);

  const setParam = useCallback(
    (key: string, value: string | undefined) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          if (key !== "page") next.delete("page");
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  // Debounce typing into the URL.
  useEffect(() => {
    const id = setTimeout(() => {
      if (searchInput.trim() !== search) setParam("search", searchInput.trim() || undefined);
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput, search, setParam]);

  return (
    <PageContainer>
      <PageHeader
        title="Problems"
        description="Pick a problem, write a solution, and get judged against hidden tests."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="grid content-start gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-56 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search problems"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search problems"
              />
            </div>
            <Select
              value={difficulty ?? "ALL"}
              onValueChange={(v) => setParam("difficulty", v === "ALL" ? undefined : v)}
            >
              <SelectTrigger className="w-40" aria-label="Difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All difficulties</SelectItem>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {difficultyLabel(d)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="overflow-hidden">
            {problems.isError ? (
              <ErrorState error={problems.error} onRetry={() => problems.refetch()} />
            ) : problems.isPending ? (
              <div className="grid gap-2 p-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : problems.data.items.length === 0 ? (
              <EmptyState icon={<Search />} title="No problems match your filters" />
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40 text-left text-muted-foreground">
                  <tr>
                    <th className="w-14 px-4 py-3 font-medium">
                      <span className="sr-only">Status</span>
                    </th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Tags</th>
                    <th className="w-28 px-4 py-3 font-medium">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.data.items.map((problem) => (
                    <tr key={problem.id} className="border-b last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3">
                        {problem.progress === "SOLVED" ? (
                          <CheckCircle2 className="size-4 text-easy" aria-label="Solved" />
                        ) : problem.progress === "ATTEMPTED" ? (
                          <CircleDashed className="size-4 text-medium" aria-label="Attempted" />
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/problems/${problem.slug}`} className="font-medium hover:text-primary">
                          {problem.title}
                        </Link>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {problem.tags.join(", ")}
                      </td>
                      <td className="px-4 py-3">
                        <DifficultyBadge difficulty={problem.difficulty} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
          {problems.data && (
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={problems.data.total}
              onPageChange={(p) => setParam("page", String(p))}
            />
          )}
        </div>

        <aside>
          {authenticated ? (
            <StatsCard stats={stats.data} loading={stats.isPending} />
          ) : (
            <Card className="p-5 text-sm text-muted-foreground">
              Sign in to track which problems you have solved.
            </Card>
          )}
        </aside>
      </div>
    </PageContainer>
  );
}
