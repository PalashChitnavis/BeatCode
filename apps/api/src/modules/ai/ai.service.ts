import type { AiStatusDTO, TestResultDTO, aiChatSchema } from "@beatcode/shared";
import type { z } from "zod";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";
import { notFound, serviceUnavailable, tooManyRequests } from "../../lib/errors";
import { buildSystemPrompt } from "./prompt";
import { getProvider } from "./providers";
import { remainingToday, reserveQuestion } from "./quota";

type ChatInput = z.output<typeof aiChatSchema>;

export async function getStatus(userId: string): Promise<AiStatusDTO> {
  return {
    enabled: getProvider() !== null,
    remainingToday: await remainingToday(userId),
    dailyLimit: env.AI_DAILY_LIMIT_PER_USER,
  };
}

/** Validates access, spends one question from the user's budget and returns what to send the model. */
export async function prepareChat(input: ChatInput, userId: string) {
  const provider = getProvider();
  if (!provider) throw serviceUnavailable("The AI tutor is not configured on this server");

  // Only the statement and sample tests: hidden tests and reference solutions are never selected.
  const problem = await prisma.problem.findFirst({
    where: { slug: input.problemSlug, isPublished: true },
    select: {
      id: true,
      title: true,
      difficulty: true,
      description: true,
      inputFormat: true,
      constraints: true,
      testCases: {
        where: { isSample: true },
        orderBy: { order: "asc" },
        select: { displayInput: true, expectedOutput: true, explanation: true },
      },
    },
  });
  if (!problem) throw notFound("Problem not found");

  const submission = input.submissionId
    ? await prisma.submission.findFirst({
        where: { id: input.submissionId, userId, problemId: problem.id, status: "DONE" },
        select: {
          kind: true,
          verdict: true,
          passedCount: true,
          totalCount: true,
          compileOutput: true,
          stderr: true,
          testResults: true,
        },
      })
    : null;

  const reservation = await reserveQuestion(userId);
  if (!reservation.ok) {
    throw tooManyRequests(
      reservation.reason === "user"
        ? `You have used all ${env.AI_DAILY_LIMIT_PER_USER} AI questions for today. Come back tomorrow!`
        : "The AI tutor has reached its free daily limit. Please try again tomorrow.",
    );
  }

  const system = buildSystemPrompt({
    mode: input.mode,
    language: input.language,
    code: input.code,
    problem: { ...problem, samples: problem.testCases },
    result: submission
      ? { ...submission, testResults: (submission.testResults as TestResultDTO[] | null) ?? null }
      : null,
  });
  return { provider, system, messages: input.messages, remaining: reservation.remaining };
}
