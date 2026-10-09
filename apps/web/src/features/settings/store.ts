import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeStorage } from "@/lib/utils";

export type Theme = "dark" | "light" | "system";

interface SettingsState {
  theme: Theme;
  fontSize: number;
  tabSize: 2 | 4;
  wordWrap: boolean;
  minimap: boolean;
  update: (patch: Partial<Omit<SettingsState, "update">>) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      fontSize: 14,
      tabSize: 4,
      wordWrap: false,
      minimap: false,
      update: (patch) => set(patch),
    }),
    { name: "beatcode-settings", storage: createJSONStorage(() => safeStorage) },
  ),
);

export function resolveTheme(theme: Theme): "dark" | "light" {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
