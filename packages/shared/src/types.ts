import type {
  Difficulty,
  Language,
  ProgressStatus,
  SubmissionKind,
  SubmissionStatus,
  Verdict,
} from "./enums";

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface PublicUserDTO {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserDTO;
}

export interface DifficultyCount {
  EASY: number;
  MEDIUM: number;
  HARD: number;
}

export interface UserStatsDTO {
  solved: DifficultyCount;
  total: DifficultyCount;
}

export interface ProfileDTO {
  user: PublicUserDTO;
  stats: UserStatsDTO;
  rank: number | null;
  recentSolved: { slug: string; title: string; difficulty: Difficulty; solvedAt: string }[];
}

export interface ProblemSummaryDTO {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  /** Present only for signed-in users. */
  progress: ProgressStatus | null;
}

export interface SampleTestDTO {
  input: string;
  expectedOutput: string;
  explanation: string | null;
}

export interface ProblemDetailDTO extends ProblemSummaryDTO {
  description: string;
  constraints: string[];
  inputFormat: string;
  samples: SampleTestDTO[];
  starterCode: Record<Language, string>;
}

export interface ProblemSolutionDTO {
  language: Language;
  code: string;
}

export interface TestResultDTO {
  index: number;
  passed: boolean;
  verdict: Verdict;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stderr: string;
  runtimeMs: number;
}

export interface SubmissionDTO {
  id: string;
  kind: SubmissionKind;
  status: SubmissionStatus;
  language: Language;
  code: string;
  stdin: string | null;
  verdict: Verdict | null;
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  runtimeMs: number | null;
  passedCount: number | null;
  totalCount: number | null;
  testResults: TestResultDTO[] | null;
  problem: { slug: string; title: string } | null;
  user: PublicUserDTO | null;
  createdAt: string;
}

export interface CreateSubmissionResponse {
  id: string;
  status: SubmissionStatus;
}

export interface LeaderboardEntryDTO {
  rank: number;
  user: PublicUserDTO;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface RoomDTO {
  code: string;
  host: PublicUserDTO;
  participants: number;
  capacity: number;
  createdAt: string;
  expiresAt: string;
}

export interface AiStatusDTO {
  enabled: boolean;
  /** Questions the signed-in user can still ask today. */
  remainingToday: number;
  dailyLimit: number;
}

/** Server-sent events streamed by POST /ai/chat. */
export type AiStreamEvent =
  | { type: "delta"; text: string }
  | { type: "done"; remainingToday: number }
  | { type: "error"; message: string };
