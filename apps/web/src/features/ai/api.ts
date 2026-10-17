import { useQuery } from "@tanstack/react-query";
import type { AiChatInput, AiStatusDTO, AiStreamEvent, ApiErrorBody } from "@beatcode/shared";
import { useAuthStore } from "@/features/auth/store";
import { ApiError, api, refreshSession } from "@/lib/api";
import { env } from "@/lib/env";

export const aiKeys = { status: ["ai", "status"] as const };

export const useAiStatus = (enabled: boolean) =>
  useQuery({
    queryKey: aiKeys.status,
    queryFn: () => api.get<AiStatusDTO>("/ai/status").then((r) => r.data),
    enabled,
  });

function post(input: AiChatInput, signal: AbortSignal) {
  const token = useAuthStore.getState().accessToken;
  return fetch(`${env.apiBase}/ai/chat`, {
    method: "POST",
    credentials: "include",
    signal,
    headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(input),
  });
}

/**
 * Asks the tutor a question and calls `onEvent` for each streamed event. Uses fetch rather than
 * axios (or EventSource) because the answer arrives as a stream on a POST request.
 */
export async function streamAiChat(
  input: AiChatInput,
  onEvent: (event: AiStreamEvent) => void,
  signal: AbortSignal,
) {
  let res = await post(input, signal).catch((err: unknown) => {
    if (signal.aborted) throw err;
    throw new ApiError("Cannot reach the server. Check your connection.", 0, "NETWORK");
  });
  if (res.status === 401 && (await refreshSession())) res = await post(input, signal);

  if (!res.ok || !res.body) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      body?.error.message ?? "Something went wrong",
      res.status,
      body?.error.code ?? "UNKNOWN",
    );
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    let end: number;
    while ((end = buffer.indexOf("\n\n")) >= 0) {
      const block = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      if (block.startsWith("data: ")) onEvent(JSON.parse(block.slice(6)) as AiStreamEvent);
    }
  }
}
