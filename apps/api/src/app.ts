import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";
import { redis } from "./config/redis";
import { optionalAuth } from "./middleware/auth";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimit";
import { authRouter } from "./modules/auth/auth.routes";
import { leaderboardRouter } from "./modules/leaderboard/leaderboard.routes";
import { problemsRouter } from "./modules/problems/problems.routes";
import { roomsRouter } from "./modules/rooms/rooms.routes";
import { submissionsRouter } from "./modules/submissions/submissions.routes";
import { meRouter, usersRouter } from "./modules/users/users.routes";

export function createApp() {
  const app = express();

  app.set("trust proxy", env.TRUST_PROXY);
  app.disable("x-powered-by");

  app.use(helmet());
  app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
  app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url?.startsWith("/healthz") ?? false } }));
  app.use(express.json({ limit: "256kb" }));
  app.use(cookieParser());

  app.get("/healthz", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/readyz", async (_req, res) => {
    try {
      await Promise.all([prisma.$queryRaw`SELECT 1`, redis.ping()]);
      res.json({ status: "ready" });
    } catch {
      res.status(503).json({ status: "unavailable" });
    }
  });

  const api = express.Router();
  // Mounted before optionalAuth: a stale access token must not block refreshing it.
  api.use("/auth", authRouter);
  api.use(optionalAuth, apiLimiter);
  api.use("/problems", problemsRouter);
  api.use("/submissions", submissionsRouter);
  api.use("/me", meRouter);
  api.use("/users", usersRouter);
  api.use("/leaderboard", leaderboardRouter);
  api.use("/rooms", roomsRouter);
  app.use("/api/v1", api);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
