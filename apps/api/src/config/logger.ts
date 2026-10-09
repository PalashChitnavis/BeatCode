import { pino } from "pino";
import { env } from "./env";

export const logger = pino({
  level: env.NODE_ENV === "test" ? "silent" : env.LOG_LEVEL,
  redact: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.passwordHash"],
  transport: env.isProduction ? undefined : { target: "pino-pretty", options: { singleLine: true } },
});
