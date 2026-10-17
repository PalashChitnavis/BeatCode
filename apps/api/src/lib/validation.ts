import type { z } from "zod";
import { badRequest } from "./errors";

/** Parses untrusted input, throwing a 400 with per-field messages on failure. */
export function parseInput<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "_";
      fields[key] ??= issue.message;
    }
    throw badRequest(Object.values(fields)[0] ?? "Invalid request", { fields });
  }
  return result.data;
}
