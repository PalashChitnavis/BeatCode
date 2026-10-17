import type { Prisma } from "@prisma/client";
import type {
  Language,
  Page,
  ProblemDetailDTO,
  ProblemListQuery,
  ProblemSolutionDTO,
  ProblemSummaryDTO,
  ProgressStatus,
  SubmissionDTO,
} from "@beatcode/shared";
import { prisma } from "../../config/prisma";
import { notFound } from "../../lib/errors";
import { submissionInclude, toSubmissionDTO } from "../../lib/dto";

async function progressFor(userId: string | undefined, problemIds: string[]) {
  if (!userId || problemIds.length === 0) return new Map<string, ProgressStatus>();
  const rows = await prisma.userProblem.findMany({
    where: { userId, problemId: { in: problemIds } },
    select: { problemId: true, status: true },
  });
  return new Map(rows.map((row) => [row.problemId, row.status]));
}

export async function listProblems(
  query: ProblemListQuery,
  userId?: string,
): Promise<Page<ProblemSummaryDTO>> {
  const where: Prisma.ProblemWhereInput = {
    isPublished: true,
    difficulty: query.difficulty,
    tags: query.tag ? { has: query.tag } : undefined,
    title: query.search ? { contains: query.search, mode: "insensitive" } : undefined,
  };
  const [total, problems] = await prisma.$transaction([
    prisma.problem.count({ where }),
    prisma.problem.findMany({
      where,
      orderBy: { number: "asc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: { id: true, slug: true, title: true, difficulty: true, tags: true },
    }),
  ]);
  const progress = await progressFor(
    userId,
    problems.map((p) => p.id),
  );
  return {
    items: problems.map((p) => ({ ...p, progress: progress.get(p.id) ?? null })),
    page: query.page,
    pageSize: query.pageSize,
    total,
  };
}

async function findPublished(slug: string) {
  const problem = await prisma.problem.findFirst({ where: { slug, isPublished: true } });
  if (!problem) throw notFound("Problem not found");
  return problem;
}

export async function getProblem(slug: string, userId?: string): Promise<ProblemDetailDTO> {
  const problem = await prisma.problem.findFirst({
    where: { slug, isPublished: true },
    include: {
      languages: { select: { language: true, starterCode: true } },
      testCases: { where: { isSample: true }, orderBy: { order: "asc" } },
    },
  });
  if (!problem) throw notFound("Problem not found");
  const progress = await progressFor(userId, [problem.id]);

  return {
    id: problem.id,
    slug: problem.slug,
    title: problem.title,
    difficulty: problem.difficulty,
    tags: problem.tags,
    progress: progress.get(problem.id) ?? null,
    description: problem.description,
    inputFormat: problem.inputFormat,
    constraints: problem.constraints,
    samples: problem.testCases.map((t) => ({
      input: t.displayInput,
      expectedOutput: t.expectedOutput,
      explanation: t.explanation,
    })),
    starterCode: Object.fromEntries(problem.languages.map((l) => [l.language, l.starterCode])) as Record<
      Language,
      string
    >,
  };
}

export async function getSolutions(slug: string): Promise<ProblemSolutionDTO[]> {
  const problem = await findPublished(slug);
  const languages = await prisma.problemLanguage.findMany({
    where: { problemId: problem.id },
    select: { language: true, referenceSolution: true },
  });
  return languages.map((l) => ({ language: l.language, code: l.referenceSolution }));
}

export async function listProblemSubmissions(
  slug: string,
  scope: "me" | "accepted",
  userId: string,
): Promise<SubmissionDTO[]> {
  const problem = await findPublished(slug);
  if (scope === "me") {
    const rows = await prisma.submission.findMany({
      where: { problemId: problem.id, userId, kind: "SUBMIT" },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: submissionInclude,
    });
    return rows.map(toSubmissionDTO);
  }
  // Most recent accepted solution of each user.
  const rows = await prisma.submission.findMany({
    where: { problemId: problem.id, kind: "SUBMIT", verdict: "ACCEPTED", userId: { not: null } },
    distinct: ["userId"],
    orderBy: [{ userId: "asc" }, { createdAt: "desc" }],
    take: 50,
    include: submissionInclude,
  });
  return rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(toSubmissionDTO);
}

/** Everything the judge needs for one problem/language. Hidden tests never leave the server except here. */
export async function getJudgeData(slug: string, language: Language, samplesOnly: boolean) {
  const problem = await prisma.problem.findFirst({
    where: { slug, isPublished: true },
    include: {
      languages: { where: { language } },
      testCases: { where: samplesOnly ? { isSample: true } : undefined, orderBy: { order: "asc" } },
    },
  });
  if (!problem) throw notFound("Problem not found");
  const lang = problem.languages[0];
  if (!lang) throw notFound(`This problem is not available in ${language}`);
  return { problem, driverCode: lang.driverCode, testCases: problem.testCases };
}
