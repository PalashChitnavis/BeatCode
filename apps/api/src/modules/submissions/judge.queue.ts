import { Queue, Worker } from "bullmq";
import { JUDGE_QUEUE, JUDGE_RESULTS_QUEUE, type JudgeJob, type JudgeResult } from "@beatcode/shared";
import { createRedis } from "../../config/redis";
import { logger } from "../../config/logger";

let queue: Queue<JudgeJob> | null = null;

function judgeQueue() {
  queue ??= new Queue<JudgeJob>(JUDGE_QUEUE, {
    connection: createRedis(),
    defaultJobOptions: {
      attempts: 2,
      backoff: { type: "fixed", delay: 1000 },
      removeOnComplete: true,
      removeOnFail: 100,
    },
  });
  return queue;
}

export async function enqueueJudgeJob(job: JudgeJob) {
  await judgeQueue().add("judge", job, { jobId: job.submissionId });
}

/** Consumes verdicts published by the runner. Durable: results wait in Redis if the API is down. */
export function startResultsWorker(handler: (result: JudgeResult) => Promise<void>) {
  const worker = new Worker<JudgeResult>(JUDGE_RESULTS_QUEUE, (job) => handler(job.data), {
    connection: createRedis(),
    concurrency: 10,
  });
  worker.on("failed", (job, err) => logger.error({ err, jobId: job?.id }, "failed to store judge result"));
  return worker;
}

export async function closeJudgeQueue() {
  await queue?.close();
}
