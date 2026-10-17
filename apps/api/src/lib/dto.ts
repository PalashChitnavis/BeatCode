import type { Prisma, User } from "@prisma/client";
import type { PublicUserDTO, SubmissionDTO, TestResultDTO, UserDTO } from "@beatcode/shared";

export const toUserDTO = (user: User): UserDTO => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt.toISOString(),
});

export const publicUserSelect = { id: true, name: true, avatarUrl: true, createdAt: true } as const;

export const toPublicUserDTO = (
  user: Pick<User, "id" | "name" | "avatarUrl" | "createdAt">,
): PublicUserDTO => ({
  id: user.id,
  name: user.name,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt.toISOString(),
});

export const submissionInclude = {
  problem: { select: { slug: true, title: true } },
  user: { select: publicUserSelect },
} satisfies Prisma.SubmissionInclude;

type SubmissionWithRelations = Prisma.SubmissionGetPayload<{ include: typeof submissionInclude }>;

export const toSubmissionDTO = (s: SubmissionWithRelations): SubmissionDTO => ({
  id: s.id,
  kind: s.kind,
  status: s.status,
  language: s.language,
  code: s.code,
  stdin: s.stdin,
  verdict: s.verdict,
  stdout: s.stdout,
  stderr: s.stderr,
  compileOutput: s.compileOutput,
  runtimeMs: s.runtimeMs,
  passedCount: s.passedCount,
  totalCount: s.totalCount,
  testResults: (s.testResults as TestResultDTO[] | null) ?? null,
  problem: s.problem,
  user: s.user ? toPublicUserDTO(s.user) : null,
  createdAt: s.createdAt.toISOString(),
});
