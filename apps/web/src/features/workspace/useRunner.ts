import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CreateSubmissionInput, SubmissionDTO } from "@beatcode/shared";
import { errorMessage } from "@/lib/api";
import { createSubmission, useSubmission } from "@/features/submissions/api";

/** Creates a submission and tracks it until a verdict arrives. */
export function useRunner(onDone?: (submission: SubmissionDTO) => void) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const notified = useRef<string | null>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const mutation = useMutation({
    mutationFn: (input: CreateSubmissionInput) => createSubmission(input),
    onSuccess: ({ id }) => setActiveId(id),
    onError: (error) => toast.error(errorMessage(error)),
  });
  const submission = useSubmission(activeId);
  const result = submission.data;

  useEffect(() => {
    if (result?.status === "DONE" && notified.current !== result.id) {
      notified.current = result.id;
      onDoneRef.current?.(result);
    }
  }, [result]);

  const running = mutation.isPending || (Boolean(activeId) && result?.status !== "DONE");

  return {
    run: mutation.mutate,
    running,
    /** Which kind of run is in flight, so the right button shows a spinner. */
    runningKind: running ? mutation.variables?.kind : undefined,
    result: result?.status === "DONE" ? result : undefined,
  };
}
