import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type {
  CreateSubmissionInput,
  CreateSubmissionResponse,
  CursorPage,
  SubmissionDTO,
  SubmissionKind,
} from "@beatcode/shared";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

export const submissionKeys = {
  detail: (id: string) => ["submissions", "detail", id] as const,
  mine: (kind?: SubmissionKind) => ["submissions", "mine", kind ?? "ALL"] as const,
};

export const createSubmission = (input: CreateSubmissionInput) =>
  api.post<CreateSubmissionResponse>("/submissions", input).then((r) => r.data);

/** Follows a submission until it is judged: pushed over the socket, with polling as a fallback. */
export function useSubmission(id: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;
    const socket = getSocket();
    const onUpdate = (submission: SubmissionDTO) => {
      if (submission.id === id) queryClient.setQueryData(submissionKeys.detail(id), submission);
    };
    const subscribe = () => socket.emit("submission:subscribe", id, () => {});
    socket.on("submission:update", onUpdate);
    socket.on("connect", subscribe);
    if (socket.connected) subscribe();
    return () => {
      socket.off("submission:update", onUpdate);
      socket.off("connect", subscribe);
      socket.emit("submission:unsubscribe", id);
    };
  }, [id, queryClient]);

  return useQuery({
    queryKey: submissionKeys.detail(id ?? ""),
    queryFn: () => api.get<SubmissionDTO>(`/submissions/${id}`).then((r) => r.data),
    enabled: Boolean(id),
    refetchInterval: (query) => (query.state.data?.status === "DONE" ? false : 2000),
  });
}

export const useMySubmissions = (kind?: SubmissionKind) =>
  useInfiniteQuery({
    queryKey: submissionKeys.mine(kind),
    queryFn: ({ pageParam }) =>
      api
        .get<CursorPage<SubmissionDTO>>("/me/submissions", { params: { kind, cursor: pageParam, limit: 20 } })
        .then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
