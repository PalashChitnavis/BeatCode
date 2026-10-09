import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LoginInput, RegisterInput } from "@beatcode/shared";
import { queryClient } from "@/lib/queryClient";
import { authApi } from "./api";
import { useAuthStore } from "./store";
import { useAuthDialog } from "./dialogStore";

export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useAuthStatus = () => useAuthStore((s) => s.status);

function onSignedIn(data: Awaited<ReturnType<typeof authApi.login>>) {
  useAuthStore.getState().setSession(data);
  useAuthDialog.getState().close();
  // Cached lists now need per-user fields such as progress.
  void queryClient.invalidateQueries();
  toast.success(`Welcome, ${data.user.name}`);
}

export const useLogin = () =>
  useMutation({ mutationFn: (input: LoginInput) => authApi.login(input), onSuccess: onSignedIn });

export const useRegister = () =>
  useMutation({ mutationFn: (input: RegisterInput) => authApi.register(input), onSuccess: onSignedIn });

export const useLogout = () =>
  useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      useAuthStore.getState().clearSession();
      queryClient.clear();
      toast.success("Signed out");
    },
  });

export const useAuthProviders = () =>
  useQuery({ queryKey: ["auth", "providers"], queryFn: authApi.providers, staleTime: Infinity });
