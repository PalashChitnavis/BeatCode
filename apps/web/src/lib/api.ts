import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorBody, AuthResponse } from "@beatcode/shared";
import { useAuthStore } from "@/features/auth/store";
import { env } from "./env";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = axios.create({ baseURL: env.apiBase, withCredentials: true, timeout: 30_000 });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

/** Exchanges the refresh cookie for a new access token. Concurrent callers share one request. */
export function refreshSession(): Promise<string | null> {
  refreshing ??= axios
    .post<AuthResponse>(`${env.apiBase}/auth/refresh`, null, { withCredentials: true })
    .then(({ data }) => {
      useAuthStore.getState().setSession(data);
      return data.accessToken;
    })
    .catch(() => {
      useAuthStore.getState().clearSession();
      return null;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(undefined, async (error: AxiosError<ApiErrorBody>) => {
  const config = error.config as RetriableConfig | undefined;
  const isAuthCall = config?.url?.startsWith("/auth/");
  if (error.response?.status === 401 && config && !config._retried && !isAuthCall) {
    config._retried = true;
    if (await refreshSession()) return api(config);
  }
  throw toApiError(error);
});

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.error) {
      const fields = (body.error.details as { fields?: Record<string, string> } | undefined)?.fields;
      return new ApiError(body.error.message, error.response!.status, body.error.code, fields);
    }
    if (!error.response) return new ApiError("Cannot reach the server. Check your connection.", 0, "NETWORK");
    return new ApiError(error.message, error.response.status, "UNKNOWN");
  }
  return new ApiError("Something went wrong", 0, "UNKNOWN");
}

export const errorMessage = (error: unknown) => toApiError(error).message;
