import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";
import { JUDGE_QUEUE, JUDGE_RESULTS_QUEUE, type JudgeJob, type JudgeResult } from "@beatcode/shared";
import { config, logger } from "./config";
import { judge } from "./judge";
import { LANGUAGE_CONFIG } from "./languages";
import { checkImages } from "./sandbox";

const connection = () => new Redis(config.REDIS_URL, { maxRetriesPerRequest: null });

const results = new Queue<JudgeResult>(JUDGE_RESULTS_QUEUE, {
  connection: connection(),
  defaultJobOptions: { attempts: 5, backoff: { type: "exponential", delay: 1000 }, removeOnComplete: true },
});

await checkImages(Object.values(LANGUAGE_CONFIG).map((l) => l.image));

const worker = new Worker<JudgeJob>(
  JUDGE_QUEUE,
  async (job) => {
    const started = Date.now();
    const result = await judge(job.data);
    await results.add("result", result, { jobId: job.data.submissionId });
    logger.info(
      {
        submissionId: job.data.submissionId,
        language: job.data.language,
        verdict: result.verdict,
        ms: Date.now() - started,
      },
      "judged",
    );
  },
  { connection: connection(), concurrency: config.CONCURRENCY },
);

worker.on("failed", (job, err) => logger.error({ err, jobId: job?.id }, "judge job failed"));
logger.info(`runner started with concurrency ${config.CONCURRENCY}`);

async function shutdown(signal: string) {
  logger.info({ signal }, "shutting down; finishing in-flight jobs");
  await worker.close();
  await results.close();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
