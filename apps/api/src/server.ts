import { createServer } from "node:http";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";
import { redis } from "./config/redis";
import { createApp } from "./app";
import { createSocketServer } from "./realtime/socket";
import { persistAllRooms } from "./realtime/roomState";
import { closeJudgeQueue, startResultsWorker } from "./modules/submissions/judge.queue";
import { applyJudgeResult, closeStaleSubmissions } from "./modules/submissions/submissions.service";
import { deleteExpiredRooms } from "./modules/rooms/rooms.service";

const httpServer = createServer(createApp());
const io = createSocketServer(httpServer);
const resultsWorker = startResultsWorker(applyJudgeResult);

const maintenance = setInterval(() => {
  closeStaleSubmissions().catch((err) => logger.error({ err }, "stale submission sweep failed"));
  deleteExpiredRooms().catch((err) => logger.error({ err }, "expired room cleanup failed"));
}, 60_000);

httpServer.listen(env.PORT, () => {
  logger.info(`API listening on http://localhost:${env.PORT}`);
});

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, "shutting down");
  clearInterval(maintenance);
  const force = setTimeout(() => process.exit(1), 10_000);
  force.unref();

  await new Promise<void>((resolve) => io.close(() => resolve()));
  await persistAllRooms();
  await resultsWorker.close();
  await closeJudgeQueue();
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
