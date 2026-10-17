import type { Prisma } from "@prisma/client";
import {
  MAX_PENDING_SUBMISSIONS_PER_USER,
  type CreateSubmissionResponse,
  type CursorPage,
  type JudgeResult,
  type SubmissionDTO,
  type SubmissionListQuery,
  type createSubmissionSchema,
} from "@beatcode/shared";
import type { z } from "zod";
import { prisma } from "../../config/prisma";
import { logger } from "../../config/logger";
import { AppError, notFound, tooManyRequests, unauthorized } from "../../lib/errors";
import { submissionInclude, toSubmissionDTO } from "../../lib/dto";
import { appEvents } from "../../lib/events";
import { getJudgeData } from "../problems/problems.service";
import { enqueueJudgeJob } from "./judge.queue";

type CreateInput = z.output<typeof createSubmissionSchema>;

/** A submission still pending after this long is assumed lost and closed with an internal error. */
const STALE_AFTER_MS = 5 * 60 * 1000;

export async function createSubmission(
  input: CreateInput,
  userId?: string,
): Promise<CreateSubmissionResponse> {
  if (input.kind !== "PLAYGROUND" && !userId) throw unauthorized("Sign in to run and submit solutions");

  if (userId) {
    const pending = await prisma.submission.count({ where: { userId, status: "PENDING" } });
    if (pending >= MAX_PENDING_SUBMISSIONS_PER_USER) {
      throw tooManyRequests("Please wait for your previous runs to finish");
    }
  }

  let submissionId: string;
  if (input.kind === "PLAYGROUND") {
    const submission = await prisma.submission.create({
      data: { kind: "PLAYGROUND", language: input.language, code: input.code, stdin: input.stdin, userId },
    });
    submissionId = submission.id;
    await enqueue(submissionId, () =>
      enqueueJudgeJob({
        submissionId,
        kind: "PLAYGROUND",
        language: input.language,
        source: input.code,
        stdin: input.stdin,
        timeLimitMs: 5000,
        stopOnFirstFailure: true,
      }),
    );
  } else {
    const { problem, driverCode, testCases } = await getJudgeData(
      input.problemSlug,
      input.language,
      input.kind === "RUN",
    );
    const submission = await prisma.submission.create({
      data: { kind: input.kind, language: input.language, code: input.code, userId, problemId: problem.id },
    });
    submissionId = submission.id;
    await enqueue(submissionId, () =>
      enqueueJudgeJob({
        submissionId,
        kind: input.kind,
        language: input.language,
        source: `${input.code}\n${driverCode}`,
        tests: testCases.map((t) => ({
          input: t.input,
          expectedOutput: t.expectedOutput,
          display: t.displayInput,
        })),
        timeLimitMs: problem.timeLimitMs,
        stopOnFirstFailure: input.kind === "SUBMIT",
      }),
    );
  }
  return { id: submissionId, status: "PENDING" };
}

async function enqueue(submissionId: string, add: () => Promise<void>) {
  try {
    await add();
  } catch (error) {
    logger.error({ err: error, submissionId }, "failed to enqueue judge job");
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: "DONE",
        verdict: "INTERNAL_ERROR",
        stderr: "The judge is unavailable",
        judgedAt: new Date(),
      },
    });
    throw new AppError(503, "JUDGE_UNAVAILABLE", "The judge is unavailable, please try again shortly");
  }
}

/** Internal lookup without access checks; callers must authorize. */
export async function loadSubmission(id: string): Promise<SubmissionDTO | null> {
  const submission = await prisma.submission.findUnique({ where: { id }, include: submissionInclude });
  return submission ? toSubmissionDTO(submission) : null;
}

export async function getSubmission(id: string, userId?: string): Promise<SubmissionDTO> {
  const submission = await prisma.submission.findUnique({ where: { id }, include: submissionInclude });
  // Guest runs are reachable by their unguessable id; account-owned ones only by their owner.
  if (!submission || (submission.userId && submission.userId !== userId))
    throw notFound("Submission not found");
  return toSubmissionDTO(submission);
}

export async function listUserSubmissions(
  userId: string,
  query: SubmissionListQuery,
): Promise<CursorPage<SubmissionDTO>> {
  const rows = await prisma.submission.findMany({
    where: { userId, kind: query.kind },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: query.limit + 1,
    ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    include: submissionInclude,
  });
  const hasMore = rows.length > query.limit;
  const items = hasMore ? rows.slice(0, query.limit) : rows;
  return { items: items.map(toSubmissionDTO), nextCursor: hasMore ? items[items.length - 1]!.id : null };
}

/** Stores a verdict from the runner and updates the user's progress. Idempotent. */
export async function applyJudgeResult(result: JudgeResult) {
  const applied = await prisma.$transaction(async (tx) => {
    const { count } = await tx.submission.updateMany({
      where: { id: result.submissionId, status: "PENDING" },
      data: {
        status: "DONE",
        verdict: result.verdict,
        stdout: result.stdout,
        stderr: result.stderr,
        compileOutput: result.compileOutput,
        runtimeMs: result.runtimeMs,
        passedCount: result.passedCount,
        totalCount: result.totalCount,
        testResults: (result.testResults ?? undefined) as Prisma.InputJsonValue | undefined,
        judgedAt: new Date(),
      },
    });
    if (count === 0) return false;

    const submission = await tx.submission.findUniqueOrThrow({ where: { id: result.submissionId } });
    if (submission.kind === "SUBMIT" && submission.userId && submission.problemId) {
      await recordProgress(tx, submission.userId, submission.problemId, result.verdict === "ACCEPTED");
    }
    return true;
  });
  if (applied) appEvents.emit("submission:done", result.submissionId);
}

async function recordProgress(
  tx: Prisma.TransactionClient,
  userId: string,
  problemId: string,
  solved: boolean,
) {
  const key = { userId_problemId: { userId, problemId } };
  const existing = await tx.userProblem.findUnique({ where: key });
  if (!existing) {
    await tx.userProblem.create({
      data: {
        userId,
        problemId,
        attempts: 1,
        status: solved ? "SOLVED" : "ATTEMPTED",
        firstSolvedAt: solved ? new Date() : null,
      },
    });
    return;
  }
  const firstSolve = solved && existing.status !== "SOLVED";
  await tx.userProblem.update({
    where: key,
    data: {
      attempts: { increment: 1 },
      ...(firstSolve ? { status: "SOLVED", firstSolvedAt: new Date() } : {}),
    },
  });
}

export async function closeStaleSubmissions() {
  const stale = await prisma.submission.findMany({
    where: { status: "PENDING", createdAt: { lt: new Date(Date.now() - STALE_AFTER_MS) } },
    select: { id: true },
    take: 100,
  });
  for (const { id } of stale) {
    await applyJudgeResult({
      submissionId: id,
      verdict: "INTERNAL_ERROR",
      stdout: null,
      stderr: "The judge did not respond in time",
      compileOutput: null,
      runtimeMs: null,
      passedCount: null,
      totalCount: null,
      testResults: null,
    });
  }
  if (stale.length > 0) logger.warn({ count: stale.length }, "closed stale submissions");
}
