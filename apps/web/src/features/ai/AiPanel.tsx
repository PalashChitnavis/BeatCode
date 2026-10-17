import { useQueryClient } from "@tanstack/react-query";
import { Bot, Eraser, SendHorizontal, Sparkles, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import {
  AI_MAX_HISTORY,
  AI_MAX_MESSAGE_LENGTH,
  AI_MODE_LABELS,
  AI_MODES,
  LANGUAGES,
  type AiMode,
  type AiStatusDTO,
  type Language,
} from "@beatcode/shared";
import { RequireAuth } from "@/app/RequireAuth";
import { CodeBlock } from "@/components/CodeBlock";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useAuthStatus } from "@/features/auth/hooks";
import { errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { aiKeys, streamAiChat, useAiStatus } from "./api";
import { aiAborts, useAiChats, type AiChatMessage } from "./store";

const SUGGESTIONS: Record<AiMode, string[]> = {
  hint: ["Give me a small hint to get started", "I'm stuck, what should I think about next?"],
  approach: ["What's a good approach for this problem?", "Which data structure fits here?"],
  debug: ["Why is my code failing?", "Is there an edge case I'm missing?"],
  complexity: ["What's the time complexity of my code?", "Is my solution fast enough?"],
};

const ALIASES: Record<string, Language> = { "c++": "cpp", py: "python", python3: "python" };

/** Renders fenced code with the app's highlighter when the language is one we support. */
function MarkdownCode({ className, children, ...props }: ComponentProps<"code">) {
  const raw = /language-([\w+]+)/.exec(className ?? "")?.[1]?.toLowerCase();
  const language = raw && (ALIASES[raw] ?? (LANGUAGES as readonly string[]).find((l) => l === raw));
  const text = String(children).replace(/\n$/, "");
  if (language) return <CodeBlock code={text} language={language as Language} />;
  // Fenced block in a language we don't highlight.
  if (className || text.includes("\n")) {
    return (
      <pre>
        <code>{text}</code>
      </pre>
    );
  }
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

function Message({ message, streaming }: { message: AiChatMessage; streaming: boolean }) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
        {message.content}
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Bot className="mt-1 size-4 shrink-0 text-muted-foreground" />
      <div
        className={cn("prose-problem prose-ai min-w-0 flex-1 text-sm", message.error && "text-destructive")}
      >
        {message.content ? (
          <ReactMarkdown components={{ pre: ({ children }) => <>{children}</>, code: MarkdownCode }}>
            {message.content}
          </ReactMarkdown>
        ) : (
          streaming && <span className="animate-pulse text-muted-foreground">Thinking…</span>
        )}
      </div>
    </div>
  );
}

/** Earlier turns to send back, skipping failed answers and the questions that caused them. */
function history(chat: AiChatMessage[]) {
  const turns: AiChatMessage[] = [];
  for (let i = 0; i + 1 < chat.length; i += 2) {
    const [question, answer] = [chat[i]!, chat[i + 1]!];
    if (question.role === "user" && answer.role === "assistant" && !answer.error && answer.content) {
      turns.push(question, answer);
    }
  }
  return turns.slice(-AI_MAX_HISTORY);
}

interface AiPanelProps {
  slug: string;
  language: Language;
  code: string;
  /** Latest run or submission, so the tutor can see the verdict and failing test. */
  submissionId?: string;
}

function AiChat({ slug, language, code, submissionId, status }: AiPanelProps & { status: AiStatusDTO }) {
  const queryClient = useQueryClient();
  const chat = useAiChats((s) => s.chats[slug]) ?? [];
  const pending = useAiChats((s) => s.pending[slug]);
  const streaming = useAiChats((s) => s.streaming[slug] ?? false);
  const { append, updateLast, clear, queue, setStreaming } = useAiChats.getState();
  const [mode, setMode] = useState<AiMode>("hint");
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const lastContent = chat.at(-1)?.content;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [chat.length, lastContent]);

  const send = useCallback(
    async (text: string, askMode: AiMode) => {
      const question = text.trim();
      if (!question || useAiChats.getState().streaming[slug]) return;
      const messages = [
        ...history(useAiChats.getState().chats[slug] ?? []),
        { role: "user" as const, content: question },
      ];
      append(slug, { role: "user", content: question });
      append(slug, { role: "assistant", content: "" });
      setDraft("");
      setStreaming(slug, true);
      const controller = new AbortController();
      aiAborts.set(slug, controller);

      try {
        await streamAiChat(
          { problemSlug: slug, language, code, mode: askMode, submissionId, messages },
          (event) => {
            if (event.type === "delta") updateLast(slug, (m) => ({ ...m, content: m.content + event.text }));
            else if (event.type === "error")
              updateLast(slug, () => ({ role: "assistant", content: event.message, error: true }));
            else
              queryClient.setQueryData<AiStatusDTO>(aiKeys.status, (s) =>
                s ? { ...s, remainingToday: event.remainingToday } : s,
              );
          },
          controller.signal,
        );
      } catch (error) {
        if (controller.signal.aborted) {
          updateLast(slug, (m) => (m.content ? m : { ...m, content: "_Stopped._", error: true }));
        } else {
          updateLast(slug, () => ({ role: "assistant", content: errorMessage(error), error: true }));
        }
      } finally {
        setStreaming(slug, false);
        aiAborts.delete(slug);
        void queryClient.invalidateQueries({ queryKey: aiKeys.status });
      }
    },
    [slug, language, code, submissionId, append, updateLast, setStreaming, queryClient],
  );

  // Questions queued from the result panel ("Ask AI why").
  useEffect(() => {
    // Read from the store, not the render, so a question is never sent twice.
    const question = useAiChats.getState().pending[slug];
    if (!question || streaming) return;
    queue(slug, undefined);
    setMode(question.mode);
    void send(question.text, question.mode);
  }, [pending, streaming, slug, queue, send]);

  const outOfQuestions = status.remainingToday <= 0;

  return (
    <div className="flex h-full min-h-80 flex-col">
      <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-2">
        {AI_MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              m === mode
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {AI_MODE_LABELS[m]}
          </button>
        ))}
        {chat.length > 0 && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto"
            title="Clear conversation"
            disabled={streaming}
            onClick={() => clear(slug)}
          >
            <Eraser />
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {chat.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Sparkles className="size-8 text-primary" />
            <p className="font-medium">Stuck? Ask the AI tutor.</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              It sees the problem, your code and your last result, and guides you without giving away the full
              solution.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS[mode].map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  disabled={outOfQuestions}
                  onClick={() => send(s, mode)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {chat.map((message, i) => (
              <Message key={i} message={message} streaming={streaming && i === chat.length - 1} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="grid gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft, mode);
        }}
      >
        <div className="flex items-end gap-2">
          <Textarea
            rows={2}
            value={draft}
            maxLength={AI_MAX_MESSAGE_LENGTH}
            disabled={outOfQuestions}
            placeholder={
              outOfQuestions ? "No questions left today" : `Ask for ${AI_MODE_LABELS[mode].toLowerCase()}…`
            }
            className="font-sans"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(draft, mode);
              }
            }}
          />
          {streaming ? (
            <Button
              type="button"
              size="icon"
              variant="outline"
              title="Stop"
              onClick={() => aiAborts.get(slug)?.abort()}
            >
              <Square />
            </Button>
          ) : (
            <Button type="submit" size="icon" title="Send" disabled={!draft.trim() || outOfQuestions}>
              <SendHorizontal />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {status.remainingToday} of {status.dailyLimit} questions left today · Your code and question are
          sent to an AI provider, so don&apos;t include secrets. Answers can be wrong.
        </p>
      </form>
    </div>
  );
}

export function AiPanel(props: AiPanelProps) {
  const authenticated = useAuthStatus() === "authenticated";
  const status = useAiStatus(authenticated);

  return (
    <RequireAuth reason="Sign in to ask the AI tutor">
      {status.isPending ? (
        <LoadingState />
      ) : status.isError ? (
        <ErrorState error={status.error} onRetry={() => status.refetch()} />
      ) : !status.data.enabled ? (
        <EmptyState icon={<Bot />} title="The AI tutor is not set up">
          Set <code>GEMINI_API_KEY</code> (or <code>AI_PROVIDER=ollama</code>) on the API to enable it.
        </EmptyState>
      ) : (
        <AiChat {...props} status={status.data} />
      )}
    </RequireAuth>
  );
}
