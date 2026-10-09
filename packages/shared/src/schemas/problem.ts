import { z } from "zod";
import { DIFFICULTIES } from "../enums";
import { pageQuerySchema } from "./common";

export const problemListQuerySchema = pageQuerySchema.extend({
  difficulty: z.enum(DIFFICULTIES).optional(),
  search: z.string().trim().max(100).optional(),
  tag: z.string().trim().max(50).optional(),
});
export type ProblemListQuery = z.infer<typeof problemListQuerySchema>;

export const problemSubmissionsQuerySchema = z.object({
  scope: z.enum(["me", "accepted"]).default("me"),
});
