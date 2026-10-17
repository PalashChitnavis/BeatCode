import type { AuthResponse, LoginInput, RegisterInput, UserDTO } from "@beatcode/shared";
import { api } from "@/lib/api";
import { env } from "@/lib/env";

export const authApi = {
  register: (input: RegisterInput) => api.post<AuthResponse>("/auth/register", input).then((r) => r.data),
  login: (input: LoginInput) => api.post<AuthResponse>("/auth/login", input).then((r) => r.data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get<UserDTO>("/auth/me").then((r) => r.data),
  providers: () => api.get<{ google: boolean }>("/auth/providers").then((r) => r.data),
  googleUrl: (returnTo: string) => `${env.apiBase}/auth/google?returnTo=${encodeURIComponent(returnTo)}`,
};
