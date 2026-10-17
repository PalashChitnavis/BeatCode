import { env } from "../../config/env";
import { redis } from "../../config/redis";

/**
 * Daily question budgets, kept in Redis. Days follow Pacific time because that is when the
 * Gemini free tier resets, so the global cap lines up with the provider's own daily quota.
 */
function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());
}

const userKey = (userId: string) => `ai:quota:user:${userId}:${today()}`;
const globalKey = () => `ai:quota:global:${today()}`;
const TTL_SECONDS = 2 * 24 * 60 * 60;

// Increments both counters only if neither is at its limit. Returns the user's new count, or
// -1 when the user is out of questions and -2 when the whole site is.
const RESERVE = `
local user = tonumber(redis.call("GET", KEYS[1]) or "0")
local global = tonumber(redis.call("GET", KEYS[2]) or "0")
if user >= tonumber(ARGV[1]) then return -1 end
if global >= tonumber(ARGV[2]) then return -2 end
redis.call("INCR", KEYS[2])
redis.call("EXPIRE", KEYS[2], ARGV[3])
local count = redis.call("INCR", KEYS[1])
redis.call("EXPIRE", KEYS[1], ARGV[3])
return count
`;

export type Reservation = { ok: true; remaining: number } | { ok: false; reason: "user" | "global" };

export async function reserveQuestion(userId: string): Promise<Reservation> {
  const result = (await redis.eval(
    RESERVE,
    2,
    userKey(userId),
    globalKey(),
    env.AI_DAILY_LIMIT_PER_USER,
    env.AI_DAILY_LIMIT_GLOBAL,
    TTL_SECONDS,
  )) as number;
  if (result === -1) return { ok: false, reason: "user" };
  if (result === -2) return { ok: false, reason: "global" };
  return { ok: true, remaining: Math.max(0, env.AI_DAILY_LIMIT_PER_USER - result) };
}

/** Gives the user their question back when the answer failed before any of it arrived. */
export async function refundQuestion(userId: string) {
  await redis.decr(userKey(userId));
}

export async function remainingToday(userId: string) {
  const used = Number((await redis.get(userKey(userId))) ?? 0);
  return Math.max(0, env.AI_DAILY_LIMIT_PER_USER - used);
}
