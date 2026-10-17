export const LANGUAGES = ["c", "cpp", "java", "python"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  c: "C",
  cpp: "C++",
  java: "Java",
  python: "Python",
};

export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/**
 * PLAYGROUND runs arbitrary code against user-supplied stdin.
 * RUN judges a problem against its sample tests only; SUBMIT judges against every test.
 */
export const SUBMISSION_KINDS = ["PLAYGROUND", "RUN", "SUBMIT"] as const;
export type SubmissionKind = (typeof SUBMISSION_KINDS)[number];

export const SUBMISSION_STATUSES = ["PENDING", "DONE"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const VERDICTS = [
  "ACCEPTED",
  "WRONG_ANSWER",
  "TIME_LIMIT_EXCEEDED",
  "MEMORY_LIMIT_EXCEEDED",
  "RUNTIME_ERROR",
  "COMPILE_ERROR",
  "INTERNAL_ERROR",
] as const;
export type Verdict = (typeof VERDICTS)[number];

export const VERDICT_LABELS: Record<Verdict, string> = {
  ACCEPTED: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  MEMORY_LIMIT_EXCEEDED: "Memory Limit Exceeded",
  RUNTIME_ERROR: "Runtime Error",
  COMPILE_ERROR: "Compile Error",
  INTERNAL_ERROR: "Internal Error",
};

export const PROGRESS_STATUSES = ["ATTEMPTED", "SOLVED"] as const;
export type ProgressStatus = (typeof PROGRESS_STATUSES)[number];

/** How much the AI tutor is allowed to reveal, from a gentle nudge to explaining a bug in the user's code. */
export const AI_MODES = ["hint", "approach", "debug", "complexity"] as const;
export type AiMode = (typeof AI_MODES)[number];

export const AI_MODE_LABELS: Record<AiMode, string> = {
  hint: "Hint",
  approach: "Approach",
  debug: "Debug my code",
  complexity: "Complexity",
};
