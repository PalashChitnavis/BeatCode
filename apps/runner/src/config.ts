import { pino } from "pino";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  CONCURRENCY: z.coerce.number().int().min(1).max(32).default(2),
  IMAGE_PREFIX: z.string().default("beatcode-runner"),
  DOCKER_BIN: z.string().default("docker"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment configuration:\n" + z.prettifyError(parsed.error));
  process.exit(1);
}
export const config = parsed.data;

export const logger = pino({
  level: config.NODE_ENV === "test" ? "silent" : config.LOG_LEVEL,
  transport:
    config.NODE_ENV === "production" ? undefined : { target: "pino-pretty", options: { singleLine: true } },
});
