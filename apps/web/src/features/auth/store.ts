import { create } from "zustand";
import type { AuthResponse, UserDTO } from "@beatcode/shared";
import { safeStorage } from "@/lib/utils";

/**
 * Non-sensitive hint that this browser has signed in before, so anonymous visitors
 * skip the refresh request (and its expected 401) on page load.
 */
const SESSION_HINT = "beatcode-has-session";
export const hasSessionHint = () => safeStorage.getItem(SESSION_HINT) === "1";

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthState {
  status: AuthStatus;
  user: UserDTO | null;
  /** Kept in memory only, never in localStorage, so injected scripts cannot read a stored copy. */
  accessToken: string | null;
  setSession: (session: AuthResponse) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  status: "loading",
  user: null,
  accessToken: null,
  setSession: ({ user, accessToken }) => {
    safeStorage.setItem(SESSION_HINT, "1");
    set({ status: "authenticated", user, accessToken });
  },
  clearSession: () => {
    safeStorage.removeItem(SESSION_HINT);
    set({ status: "anonymous", user: null, accessToken: null });
  },
}));
