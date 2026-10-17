import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type {
  Page,
  ProblemDetailDTO,
  ProblemListQuery,
  ProblemSolutionDTO,
  ProblemSummaryDTO,
  SubmissionDTO,
  UserStatsDTO,
} from "@beatcode/shared";
import { api } from "@/lib/api";

export const problemKeys = {
  all: ["problems"] as const,
  list: (query: Partial<ProblemListQuery>) => ["problems", "list", query] as const,
  detail: (slug: string) => ["problems", "detail", slug] as const,
  solutions: (slug: string) => ["problems", "solutions", slug] as const,
  submissions: (slug: string, scope: "me" | "accepted") => ["problems", "submissions", slug, scope] as const,
  stats: ["me", "stats"] as const,
};

export const useProblems = (query: Partial<ProblemListQuery>) =>
  useQuery({
    queryKey: problemKeys.list(query),
    queryFn: () => api.get<Page<ProblemSummaryDTO>>("/problems", { params: query }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });

export const useProblem = (slug: string) =>
  useQuery({
    queryKey: problemKeys.detail(slug),
    queryFn: () => api.get<ProblemDetailDTO>(`/problems/${slug}`).then((r) => r.data),
  });

export const useSolutions = (slug: string, enabled: boolean) =>
  useQuery({
    queryKey: problemKeys.solutions(slug),
    queryFn: () => api.get<ProblemSolutionDTO[]>(`/problems/${slug}/solutions`).then((r) => r.data),
    enabled,
    staleTime: Infinity,
  });

export const useProblemSubmissions = (slug: string, scope: "me" | "accepted", enabled: boolean) =>
  useQuery({
    queryKey: problemKeys.submissions(slug, scope),
    queryFn: () =>
      api.get<SubmissionDTO[]>(`/problems/${slug}/submissions`, { params: { scope } }).then((r) => r.data),
    enabled,
  });

export const useMyStats = (enabled: boolean) =>
  useQuery({
    queryKey: problemKeys.stats,
    queryFn: () => api.get<UserStatsDTO>("/me/stats").then((r) => r.data),
    enabled,
  });
