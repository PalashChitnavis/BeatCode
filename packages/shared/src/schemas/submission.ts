import { z } from "zod";
import { LANGUAGES, SUBMISSION_KINDS } from "../enums";
import { MAX_CODE_LENGTH, MAX_STDIN_LENGTH } from "../limits";
import { cursorQuerySchema } from "./common";

const code = z.string().min(1, "Code is empty").max(MAX_CODE_LENGTH, "Code is too long");
const language = z.enum(LANGUAGES);

export const createSubmissionSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("PLAYGROUND"),
    language,
    code,
    stdin: z.string().max(MAX_STDIN_LENGTH, "Input is too long").default(""),
  }),
  z.object({
    kind: z.enum(["RUN", "SUBMIT"]),
    language,
    code,
    problemSlug: z.string().min(1).max(100),
  }),
]);
export type CreateSubmissionInput = z.input<typeof createSubmissionSchema>;

export const submissionListQuerySchema = cursorQuerySchema.extend({
  kind: z.enum(SUBMISSION_KINDS).optional(),
});
export type SubmissionListQuery = z.infer<typeof submissionListQuerySchema>;
