import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { refreshSession } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { hasSessionHint, useAuthStore } from "@/features/auth/store";
import { resolveTheme, useSettings } from "@/features/settings/store";

let bootstrapped = false;

/** Restores the session from the refresh cookie once per page load. */
function AuthBootstrap() {
  useEffect(() => {
    if (bootstrapped) return;
    bootstrapped = true;
    if (hasSessionHint()) void refreshSession();
    else useAuthStore.getState().clearSession();
  }, []);
  return null;
}

function useThemeClass() {
  const theme = useSettings((s) => s.theme);
  useEffect(() => {
    const apply = () => document.documentElement.classList.toggle("dark", resolveTheme(theme) === "dark");
    apply();
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  return resolveTheme(theme);
}

export function Providers({ children }: { children: ReactNode }) {
  const theme = useThemeClass();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      {children}
      <Toaster theme={theme} position="bottom-right" richColors closeButton />
    </QueryClientProvider>
  );
}
