import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Language } from "@beatcode/shared";
import { safeStorage } from "@/lib/utils";

interface DraftsState {
  /** Unsaved code keyed by "<scope>:<language>", e.g. "problem:two-sum:cpp". */
  code: Record<string, string>;
  /** Last language used per scope. */
  language: Record<string, Language>;
  setCode: (scope: string, language: Language, code: string) => void;
  clearCode: (scope: string, language: Language) => void;
  setLanguage: (scope: string, language: Language) => void;
}

export const useDrafts = create<DraftsState>()(
  persist(
    (set) => ({
      code: {},
      language: {},
      setCode: (scope, language, code) =>
        set((s) => ({ code: { ...s.code, [`${scope}:${language}`]: code } })),
      clearCode: (scope, language) =>
        set((s) => {
          const next = { ...s.code };
          delete next[`${scope}:${language}`];
          return { code: next };
        }),
      setLanguage: (scope, language) => set((s) => ({ language: { ...s.language, [scope]: language } })),
    }),
    { name: "beatcode-drafts", storage: createJSONStorage(() => safeStorage) },
  ),
);
