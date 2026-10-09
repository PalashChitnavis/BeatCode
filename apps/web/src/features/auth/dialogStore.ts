import { create } from "zustand";

type Mode = "login" | "register";

interface AuthDialogState {
  open: boolean;
  mode: Mode;
  /** Why the dialog was opened, e.g. "Sign in to submit solutions". */
  reason: string | null;
  show: (options?: { mode?: Mode; reason?: string }) => void;
  close: () => void;
  setMode: (mode: Mode) => void;
}

export const useAuthDialog = create<AuthDialogState>()((set) => ({
  open: false,
  mode: "login",
  reason: null,
  show: (options) => set({ open: true, mode: options?.mode ?? "login", reason: options?.reason ?? null }),
  close: () => set({ open: false }),
  setMode: (mode) => set({ mode }),
}));
