import type { Difficulty } from "@beatcode/shared";

export const difficultyLabel = (d: Difficulty) => d.charAt(0) + d.slice(1).toLowerCase();

/** Deterministic colour per user so the same person always looks the same. */
export function colorFor(seed: string) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return `oklch(0.65 0.14 ${Math.abs(hash) % 360})`;
}
