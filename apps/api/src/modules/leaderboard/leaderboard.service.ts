import { Prisma } from "@prisma/client";
import type { LeaderboardEntryDTO, Page, PageQuery } from "@beatcode/shared";
import { prisma } from "../../config/prisma";

interface Row {
  rank: number;
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
}

/** Solved counts per user, ranked by total solved, then by harder problems. */
const rankedCte = Prisma.sql`
  WITH solved AS (
    SELECT up."userId",
           COUNT(*)::int AS solved,
           (COUNT(*) FILTER (WHERE p.difficulty = 'EASY'))::int AS easy,
           (COUNT(*) FILTER (WHERE p.difficulty = 'MEDIUM'))::int AS medium,
           (COUNT(*) FILTER (WHERE p.difficulty = 'HARD'))::int AS hard,
           MAX(up."firstSolvedAt") AS "lastSolvedAt"
    FROM "UserProblem" up
    JOIN "Problem" p ON p.id = up."problemId"
    WHERE up.status = 'SOLVED' AND p."isPublished"
    GROUP BY up."userId"
  ),
  ranked AS (
    SELECT RANK() OVER (ORDER BY s.solved DESC, s.hard DESC, s.medium DESC)::int AS rank,
           u.id, u.name, u."avatarUrl", u."createdAt",
           s.solved, s.easy, s.medium, s.hard, s."lastSolvedAt"
    FROM solved s
    JOIN "User" u ON u.id = s."userId"
  )`;

const toEntry = (row: Row): LeaderboardEntryDTO => ({
  rank: row.rank,
  user: { id: row.id, name: row.name, avatarUrl: row.avatarUrl, createdAt: row.createdAt.toISOString() },
  solved: row.solved,
  easy: row.easy,
  medium: row.medium,
  hard: row.hard,
});

export async function getLeaderboard(query: PageQuery): Promise<Page<LeaderboardEntryDTO>> {
  const offset = (query.page - 1) * query.pageSize;
  const [rows, [count]] = await Promise.all([
    prisma.$queryRaw<Row[]>`${rankedCte}
      SELECT * FROM ranked
      ORDER BY rank, "lastSolvedAt" ASC, id
      LIMIT ${query.pageSize} OFFSET ${offset}`,
    prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(DISTINCT up."userId")::int AS total
      FROM "UserProblem" up JOIN "Problem" p ON p.id = up."problemId"
      WHERE up.status = 'SOLVED' AND p."isPublished"`,
  ]);
  return { items: rows.map(toEntry), page: query.page, pageSize: query.pageSize, total: count?.total ?? 0 };
}

export async function getUserRank(userId: string): Promise<number | null> {
  const rows = await prisma.$queryRaw<{ rank: number }[]>`${rankedCte}
    SELECT rank FROM ranked WHERE id = ${userId}`;
  return rows[0]?.rank ?? null;
}
