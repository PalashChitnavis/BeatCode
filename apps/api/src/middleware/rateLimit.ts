import { rateLimit, type Options } from "express-rate-limit";
import { RedisStore, type RedisReply } from "rate-limit-redis";
import { env } from "../config/env";
import { redis } from "../config/redis";
import { tooManyRequests } from "../lib/errors";

function limiter(prefix: string, options: Partial<Options>) {
  return rateLimit({
    standardHeaders: "draft-8",
    legacyHeaders: false,
    // Signed-in users are limited per account, guests per IP.
    keyGenerator: (req) => req.user?.id ?? req.ip ?? "unknown",
    store:
      env.NODE_ENV === "test"
        ? undefined
        : new RedisStore({
            prefix: `rl:${prefix}:`,
            sendCommand: (command: string, ...args: string[]) =>
              redis.call(command, ...args) as Promise<RedisReply>,
          }),
    handler: (_req, _res, next) => next(tooManyRequests("Too many requests, please slow down")),
    skip: () => env.NODE_ENV === "test",
    ...options,
  });
}

export const authLimiter = limiter("auth", { windowMs: 15 * 60_000, limit: 20 });
export const submissionLimiter = limiter("submit", { windowMs: 60_000, limit: 20 });
export const roomLimiter = limiter("room", { windowMs: 60 * 60_000, limit: 30 });
export const apiLimiter = limiter("api", { windowMs: 60_000, limit: 300 });
export const aiLimiter = limiter("ai", { windowMs: 60_000, limit: 6 });
