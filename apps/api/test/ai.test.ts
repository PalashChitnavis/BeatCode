import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { AiStreamEvent } from "@beatcode/shared";
import type * as Providers from "../src/modules/ai/providers";
import type { ChatRequest, LLMProvider } from "../src/modules/ai/providers";

const fake = vi.hoisted(() => ({
  enabled: true,
  chunks: ["Try ", "a running sum."] as string[],
  fail: null as Error | null,
  last: null as ChatRequest | null,
}));

vi.mock("../src/modules/ai/providers", async (importOriginal) => {
  const actual = await importOriginal<typeof Providers>();
  const provider: LLMProvider = {
    name: "fake",
    async *stream(req) {
      fake.last = req;
      if (fake.fail) throw fake.fail;
      yield* fake.chunks;
    },
  };
  return { ...actual, getProvider: () => (fake.enabled ? provider : null) };
});

const { createApp } = await import("../src/app");
const { prisma } = await import("../src/config/prisma");
const { redis } = await import("../src/config/redis");
const { ProviderError } = await import("../src/modules/ai/providers");
const { buildProblem } = await import("../prisma/problems/build");
const { problems } = await import("../prisma/problems/catalog");

const app = createApp();
const slug = problems[0]!.slug;

async function register(email: string) {
  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({ name: "Ada", email, password: "correct horse" });
  expect(res.status).toBe(201);
  return { auth: { Authorization: `Bearer ${res.body.accessToken}` }, userId: res.body.user.id as string };
}

function events(text: string): AiStreamEvent[] {
  return text
    .split("\n\n")
    .filter((block) => block.startsWith("data: "))
    .map((block) => JSON.parse(block.slice(6)));
}

const ask = (content: string, extra: Record<string, unknown> = {}) => ({
  problemSlug: slug,
  language: "cpp",
  mode: "hint",
  code: "int solve() { return 0; }",
  messages: [{ role: "user", content }],
  ...extra,
});

beforeAll(async () => {
  await prisma.problem.deleteMany();
  const { problem, languages, testCases } = buildProblem(problems[0]!);
  await prisma.problem.create({
    data: { ...problem, languages: { create: languages }, testCases: { create: testCases } },
  });
});

beforeEach(async () => {
  Object.assign(fake, { enabled: true, chunks: ["Try ", "a running sum."], fail: null, last: null });
  await prisma.submission.deleteMany();
  await prisma.user.deleteMany();
  const keys = await redis.keys("ai:quota:*");
  if (keys.length > 0) await redis.del(...keys);
});

afterAll(async () => {
  await prisma.$disconnect();
  redis.disconnect();
});

describe("ai tutor", () => {
  it("requires sign-in and reports when it is not configured", async () => {
    expect((await request(app).get("/api/v1/ai/status")).status).toBe(401);

    const { auth } = await register("ada@example.com");
    fake.enabled = false;
    const status = await request(app).get("/api/v1/ai/status").set(auth);
    expect(status.body).toMatchObject({ enabled: false });
    const chat = await request(app).post("/api/v1/ai/chat").set(auth).send(ask("help"));
    expect(chat.status).toBe(503);
  });

  it("streams an answer and counts it against the daily budget", async () => {
    const { auth } = await register("ada@example.com");
    const res = await request(app).post("/api/v1/ai/chat").set(auth).send(ask("Where do I start?"));
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/event-stream");
    expect(events(res.text)).toEqual([
      { type: "delta", text: "Try " },
      { type: "delta", text: "a running sum." },
      { type: "done", remainingToday: 24 },
    ]);
    const status = await request(app).get("/api/v1/ai/status").set(auth);
    expect(status.body).toEqual({ enabled: true, remainingToday: 24, dailyLimit: 25 });
  });

  it("never sends hidden tests or reference solutions to the model", async () => {
    const { auth } = await register("ada@example.com");
    await request(app).post("/api/v1/ai/chat").set(auth).send(ask("help")).expect(200);

    const system = fake.last!.system;
    const stored = await prisma.problem.findUniqueOrThrow({
      where: { slug },
      include: { testCases: true, languages: true },
    });
    expect(system).toContain(stored.title);
    expect(system).toContain("int solve() { return 0; }");
    for (const test of stored.testCases.filter((t) => t.isSample))
      expect(system).toContain(test.displayInput);
    for (const test of stored.testCases.filter((t) => !t.isSample)) expect(system).not.toContain(test.input);
    for (const lang of stored.languages) expect(system).not.toContain(lang.referenceSolution);
  });

  it("includes the user's own last result but ignores someone else's", async () => {
    const owner = await register("ada@example.com");
    const other = await register("bob@example.com");
    const problem = await prisma.problem.findUniqueOrThrow({ where: { slug } });
    const submission = await prisma.submission.create({
      data: {
        userId: owner.userId,
        problemId: problem.id,
        kind: "RUN",
        status: "DONE",
        language: "cpp",
        code: "x",
        verdict: "COMPILE_ERROR",
        compileOutput: "error: expected ';' before '}' token",
      },
    });
    const body = ask("why?", { mode: "debug", submissionId: submission.id });

    await request(app).post("/api/v1/ai/chat").set(other.auth).send(body).expect(200);
    expect(fake.last!.system).not.toContain("expected ';'");

    await request(app).post("/api/v1/ai/chat").set(owner.auth).send(body).expect(200);
    expect(fake.last!.system).toContain("expected ';'");
    expect(fake.last!.system).toContain("Compile Error");
  });

  it("validates the conversation", async () => {
    const { auth } = await register("ada@example.com");
    const endsWithAssistant = ask("hi", {
      messages: [
        { role: "user", content: "hi" },
        { role: "assistant", content: "hello" },
      ],
    });
    expect((await request(app).post("/api/v1/ai/chat").set(auth).send(endsWithAssistant)).status).toBe(400);
    expect(
      (
        await request(app)
          .post("/api/v1/ai/chat")
          .set(auth)
          .send(ask("x".repeat(2001)))
      ).status,
    ).toBe(400);
    expect(
      (
        await request(app)
          .post("/api/v1/ai/chat")
          .set(auth)
          .send(ask("hi", { problemSlug: "nope" }))
      ).status,
    ).toBe(404);
  });

  it("refunds the question when the provider fails and stops at the daily limit", async () => {
    const { auth, userId } = await register("ada@example.com");
    fake.fail = new ProviderError("429", true);
    const failed = await request(app).post("/api/v1/ai/chat").set(auth).send(ask("help"));
    expect(events(failed.text)).toEqual([{ type: "error", message: expect.stringContaining("free quota") }]);
    expect((await request(app).get("/api/v1/ai/status").set(auth)).body.remainingToday).toBe(25);

    Object.assign(fake, { fail: null, last: null });
    const day = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());
    await redis.set(`ai:quota:user:${userId}:${day}`, 25);
    const limited = await request(app).post("/api/v1/ai/chat").set(auth).send(ask("help"));
    expect(limited.status).toBe(429);
    expect(fake.last).toBeNull();
  });
});
