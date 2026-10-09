import { z } from "zod";
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from "../limits";

export const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(PAGE_SIZE_MAX).default(PAGE_SIZE_DEFAULT),
});
export type PageQuery = z.infer<typeof pageQuerySchema>;

export const cursorQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(PAGE_SIZE_MAX).default(PAGE_SIZE_DEFAULT),
});
export type CursorQuery = z.infer<typeof cursorQuerySchema>;
