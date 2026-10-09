import type { Difficulty, DifficultyCount, ProfileDTO, UserStatsDTO } from "@beatcode/shared";
import { prisma } from "../../config/prisma";
import { notFound } from "../../lib/errors";
import { publicUserSelect, toPublicUserDTO } from "../../lib/dto";
import { getUserRank } from "../leaderboard/leaderboard.service";

const emptyCount = (): DifficultyCount => ({ EASY: 0, MEDIUM: 0, HARD: 0 });

export async function getUserStats(userId: string): Promise<UserStatsDTO> {
  const [totals, solved] = await Promise.all([
    prisma.problem.groupBy({ by: ["difficulty"], where: { isPublished: true }, _count: { _all: true } }),
    prisma.$queryRaw<{ difficulty: Difficulty; count: number }[]>`
      SELECT p.difficulty, COUNT(*)::int AS count
      FROM "UserProblem" up JOIN "Problem" p ON p.id = up."problemId"
      WHERE up."userId" = ${userId} AND up.status = 'SOLVED' AND p."isPublished"
      GROUP BY p.difficulty`,
  ]);
  const stats: UserStatsDTO = { solved: emptyCount(), total: emptyCount() };
  for (const row of totals) stats.total[row.difficulty] = row._count._all;
  for (const row of solved) stats.solved[row.difficulty] = row.count;
  return stats;
}

export async function getProfile(userId: string): Promise<ProfileDTO> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  if (!user) throw notFound("User not found");

  const [stats, rank, recent] = await Promise.all([
    getUserStats(userId),
    getUserRank(userId),
    prisma.userProblem.findMany({
      where: { userId, status: "SOLVED", problem: { isPublished: true } },
      orderBy: { firstSolvedAt: "desc" },
      take: 10,
      include: { problem: { select: { slug: true, title: true, difficulty: true } } },
    }),
  ]);

  return {
    user: toPublicUserDTO(user),
    stats,
    rank,
    recentSolved: recent.map((r) => ({
      slug: r.problem.slug,
      title: r.problem.title,
      difficulty: r.problem.difficulty,
      solvedAt: (r.firstSolvedAt ?? r.updatedAt).toISOString(),
    })),
  };
}
