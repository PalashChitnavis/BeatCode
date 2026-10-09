import { Redis } from "ioredis";
import { env } from "./env";

/** Creates a connection suitable for BullMQ (which requires maxRetriesPerRequest: null). */
export function createRedis() {
  return new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });
}

export const redis = createRedis();
