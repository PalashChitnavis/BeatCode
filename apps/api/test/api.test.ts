import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { JudgeJob } from "@beatcode/shared";

const enqueued: JudgeJob[] = [];
vi.mock("../src/modules/submissions/judge.queue", () => ({
  enqueueJudgeJob: async (job: JudgeJob) => {
    enqueued.push(job);
  },
}));

const { createApp } = await import("../src/app");
const { prisma } = await import("../src/config/prisma");
const { redis } = await import("../src/config/redis");
const { applyJudgeResult } = await import("../src/modules/submissions/submissions.service");
const { buildProblem } = await import("../prisma/problems/build");
const { problems } = await import("../prisma/problems/catalog");

const app = createApp();

async function register(name = "Ada", email = "ada@example.com") {
  const agent = request.agent(app);
  const res = await agent.post("/api/v1/auth/register").send({ name, email, password: "correct horse" });
  expect(res.status).toBe(201);
  return { agent, token: res.body.accessToken as string, user: res.body.user };
}

beforeAll(async () => {
  await prisma.problem.deleteMany();
  for (const def of problems.slice(0, 2)) {
    const { problem, languages, testCases } = buildProblem(def);
    await prisma.problem.create({
      data: { ...problem, languages: { create: languages }, testCases: { create: testCases } },
    });
  }
});

beforeEach(async () => {
  enqueued.length = 0;
  await prisma.submission.deleteMany();
  await prisma.userProblem.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
  redis.disconnect();
});

describe("auth", () => {
  it("registers, never exposes the password hash, and returns the current user", async () => {
    const { token, user } = await register();
    expect(user).toMatchObject({ name: "Ada", email: "ada@example.com" });
    expect(user).not.toHaveProperty("passwordHash");

    const me = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe("ada@example.com");
  });

  it("validates input and rejects duplicate emails", async () => {
    const bad = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "A", email: "x", password: "1" });
    expect(bad.status).toBe(400);
    expect(bad.body.error.details.fields).toHaveProperty("email");

    await register();
    const dup = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Ada", email: "ADA@example.com", password: "correct horse" });
    expect(dup.status).toBe(409);
  });

  it("uses one message for unknown emails and wrong passwords", async () => {
    await register();
    const wrong = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "ada@example.com", password: "nope" });
    const unknown = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "who@example.com", password: "nope" });
    expect(wrong.status).toBe(401);
    expect(unknown.body.error.message).toBe(wrong.body.error.message);
  });

  it("rotates refresh tokens and revokes every session when an old one is reused", async () => {
    const { agent } = await register();
    const firstCookie = (
      await agent.post("/api/v1/auth/login").send({
        email: "ada@example.com",
        password: "correct horse",
      })
    ).headers["set-cookie"];

    const refreshed = await agent.post("/api/v1/auth/refresh");
    expect(refreshed.status).toBe(200);
    expect(refreshed.body.accessToken).toBeTruthy();

    // Replaying the pre-rotation cookie is treated as theft.
    const replay = await request(app).post("/api/v1/auth/refresh").set("Cookie", String(firstCookie));
    expect(replay.status).toBe(401);
    const afterRevoke = await agent.post("/api/v1/auth/refresh");
    expect(afterRevoke.status).toBe(401);
  });

  it("rejects requests with a forged token", async () => {
    const res = await request(app).get("/api/v1/me/stats").set("Authorization", "Bearer not.a.jwt");
    expect(res.status).toBe(401);
  });
});

describe("problems", () => {
  it("lists problems and hides hidden tests and solutions from the detail view", async () => {
    const list = await request(app).get("/api/v1/problems?difficulty=EASY");
    expect(list.status).toBe(200);
    expect(list.body.total).toBe(2);
    expect(list.body.items[0]).toMatchObject({ slug: "sum-of-array", progress: null });

    const detail = await request(app).get("/api/v1/problems/sum-of-array");
    expect(detail.body.samples).toHaveLength(3);
    expect(detail.body.samples[0].input).toBe("nums = [1, 2, 3]");
    expect(Object.keys(detail.body.starterCode).sort()).toEqual(["c", "cpp", "java", "python"]);
    expect(JSON.stringify(detail.body)).not.toContain("driverCode");
    expect(JSON.stringify(detail.body)).not.toContain("referenceSolution");

    const solutions = await request(app).get("/api/v1/problems/sum-of-array/solutions");
    expect(solutions.status).toBe(401);
  });

  it("returns 404 for unknown problems", async () => {
    const res = await request(app).get("/api/v1/problems/nope");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

describe("submissions", () => {
  it("lets guests use the playground but not submit", async () => {
    const run = await request(app)
      .post("/api/v1/submissions")
      .send({ kind: "PLAYGROUND", language: "python", code: "print(1)", stdin: "" });
    expect(run.status).toBe(202);
    expect(enqueued[0]).toMatchObject({ kind: "PLAYGROUND", source: "print(1)" });

    const submit = await request(app)
      .post("/api/v1/submissions")
      .send({ kind: "SUBMIT", language: "python", code: "x", problemSlug: "sum-of-array" });
    expect(submit.status).toBe(401);
  });

  it("judges against hidden tests, records progress, and updates stats and the leaderboard", async () => {
    const { token, user } = await register();
    const auth = { Authorization: `Bearer ${token}` };

    const runRes = await request(app)
      .post("/api/v1/submissions")
      .set(auth)
      .send({ kind: "RUN", language: "python", code: "class Solution: pass", problemSlug: "sum-of-array" });
    expect(runRes.status).toBe(202);
    expect(enqueued[0]!.tests).toHaveLength(3);

    const submitRes = await request(app).post("/api/v1/submissions").set(auth).send({
      kind: "SUBMIT",
      language: "python",
      code: "class Solution: pass",
      problemSlug: "sum-of-array",
    });
    const job = enqueued[1]!;
    expect(job.tests).toHaveLength(8);
    expect(job.source).toContain("BeatCode driver");

    await applyJudgeResult({
      submissionId: submitRes.body.id,
      verdict: "ACCEPTED",
      stdout: null,
      stderr: null,
      compileOutput: null,
      runtimeMs: 12,
      passedCount: 8,
      totalCount: 8,
      testResults: [],
    });
    // Applying the same result twice must not double count.
    await applyJudgeResult({
      submissionId: submitRes.body.id,
      verdict: "ACCEPTED",
      stdout: null,
      stderr: null,
      compileOutput: null,
      runtimeMs: 12,
      passedCount: 8,
      totalCount: 8,
      testResults: [],
    });

    const submission = await request(app).get(`/api/v1/submissions/${submitRes.body.id}`).set(auth);
    expect(submission.body).toMatchObject({ status: "DONE", verdict: "ACCEPTED", passedCount: 8 });

    const stats = await request(app).get("/api/v1/me/stats").set(auth);
    expect(stats.body).toEqual({
      solved: { EASY: 1, MEDIUM: 0, HARD: 0 },
      total: { EASY: 2, MEDIUM: 0, HARD: 0 },
    });

    const progress = await prisma.userProblem.findFirstOrThrow({ where: { userId: user.id } });
    expect(progress).toMatchObject({ status: "SOLVED", attempts: 1 });

    const leaderboard = await request(app).get("/api/v1/leaderboard");
    expect(leaderboard.body.items[0]).toMatchObject({ rank: 1, solved: 1, easy: 1, user: { id: user.id } });

    const list = await request(app).get("/api/v1/problems").set(auth);
    expect(list.body.items.find((p: { slug: string }) => p.slug === "sum-of-array").progress).toBe("SOLVED");

    const mine = await request(app).get("/api/v1/me/submissions?kind=SUBMIT").set(auth);
    expect(mine.body.items).toHaveLength(1);
  });

  it("hides one user's submissions from another", async () => {
    const ada = await register();
    const bob = await register("Bob", "bob@example.com");
    const res = await request(app)
      .post("/api/v1/submissions")
      .set("Authorization", `Bearer ${ada.token}`)
      .send({ kind: "PLAYGROUND", language: "c", code: "int main(){}" });

    const asBob = await request(app)
      .get(`/api/v1/submissions/${res.body.id}`)
      .set("Authorization", `Bearer ${bob.token}`);
    expect(asBob.status).toBe(404);
  });

  it("limits how many runs a user can have pending", async () => {
    const { token } = await register();
    const send = () =>
      request(app)
        .post("/api/v1/submissions")
        .set("Authorization", `Bearer ${token}`)
        .send({ kind: "PLAYGROUND", language: "python", code: "print(1)" });
    for (let i = 0; i < 3; i++) expect((await send()).status).toBe(202);
    expect((await send()).status).toBe(429);
  });
});
