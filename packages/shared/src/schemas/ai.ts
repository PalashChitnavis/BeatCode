import { z } from "zod";
import { AI_MODES, LANGUAGES } from "../enums";
import { AI_MAX_HISTORY, AI_MAX_MESSAGE_LENGTH, MAX_CODE_LENGTH } from "../limits";

const message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .trim()
    .min(1)
    .max(AI_MAX_MESSAGE_LENGTH * 4),
});

export const aiChatSchema = z
  .object({
    problemSlug: z.string().min(1).max(100),
    language: z.enum(LANGUAGES),
    mode: z.enum(AI_MODES),
    code: z.string().max(MAX_CODE_LENGTH, "Code is too long").default(""),
    /** Latest run or submission of this problem; the server loads it and checks it belongs to the user. */
    submissionId: z.uuid().optional(),
    /** Earlier turns of this conversation followed by the new question. */
    messages: z
      .array(message)
      .min(1)
      .max(AI_MAX_HISTORY + 1),
  })
  .refine((input) => input.messages.at(-1)?.role === "user", {
    message: "The last message must be a question",
    path: ["messages"],
  })
  .refine((input) => (input.messages.at(-1)?.content.length ?? 0) <= AI_MAX_MESSAGE_LENGTH, {
    message: `Questions are limited to ${AI_MAX_MESSAGE_LENGTH} characters`,
    path: ["messages"],
  });
export type AiChatInput = z.input<typeof aiChatSchema>;
