import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().default(4000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  WEB_ORIGIN: z.url(),
  API_ORIGIN: z.url(),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  OAUTH_STATE_SECRET: z.string().min(32, "OAUTH_STATE_SECRET must be at least 32 characters"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),
  /** Number of reverse proxies in front of the API, used to resolve the client IP. */
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  /** "gemini" uses the Gemini API free tier, "ollama" a local model, "none" turns the AI tutor off. */
  AI_PROVIDER: z.enum(["gemini", "ollama", "none"]).default("gemini"),
  GEMINI_API_KEY: z.string().optional().default(""),
  GEMINI_MODEL: z.string().min(1).default("gemini-3.5-flash-lite"),
  OLLAMA_URL: z.url().default("http://localhost:11434"),
  OLLAMA_MODEL: z.string().min(1).default("qwen2.5-coder:7b"),
  /** Questions each user may ask per day. */
  AI_DAILY_LIMIT_PER_USER: z.coerce.number().int().min(0).default(25),
  /** Questions all users together may ask per day; keep it below the provider's free daily quota. */
  AI_DAILY_LIMIT_GLOBAL: z.coerce.number().int().min(0).default(200),
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().int().min(64).max(8192).default(1024),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment configuration:\n" + z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === "production",
  googleEnabled: Boolean(parsed.data.GOOGLE_CLIENT_ID && parsed.data.GOOGLE_CLIENT_SECRET),
  aiEnabled:
    parsed.data.AI_PROVIDER === "ollama" ||
    (parsed.data.AI_PROVIDER === "gemini" && Boolean(parsed.data.GEMINI_API_KEY)),
};
