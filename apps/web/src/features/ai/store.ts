import { create } from "zustand";
import type { AiMode } from "@beatcode/shared";

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
  /** Set on an assistant message whose answer failed. */
  error?: boolean;
}

interface AiChatState {
  /** Conversations per problem slug, kept for the browser session only. */
  chats: Record<string, AiChatMessage[]>;
  /** A question queued from elsewhere on the page (e.g. "Ask AI why"), sent when the panel opens. */
  pending: Record<string, { mode: AiMode; text: string } | undefined>;
  /** Problems with an answer in flight. Lives here so switching tabs doesn't lose the stream. */
  streaming: Record<string, boolean>;
  append: (slug: string, message: AiChatMessage) => void;
  updateLast: (slug: string, update: (message: AiChatMessage) => AiChatMessage) => void;
  clear: (slug: string) => void;
  queue: (slug: string, question: { mode: AiMode; text: string } | undefined) => void;
  setStreaming: (slug: string, streaming: boolean) => void;
}

/** Abort handles for answers in flight, by problem slug. */
export const aiAborts = new Map<string, AbortController>();

export const useAiChats = create<AiChatState>()((set) => ({
  chats: {},
  pending: {},
  streaming: {},
  append: (slug, message) =>
    set((s) => ({ chats: { ...s.chats, [slug]: [...(s.chats[slug] ?? []), message] } })),
  updateLast: (slug, update) =>
    set((s) => {
      const chat = s.chats[slug] ?? [];
      const last = chat.at(-1);
      if (!last) return s;
      return { chats: { ...s.chats, [slug]: [...chat.slice(0, -1), update(last)] } };
    }),
  clear: (slug) => set((s) => ({ chats: { ...s.chats, [slug]: [] } })),
  queue: (slug, question) => set((s) => ({ pending: { ...s.pending, [slug]: question } })),
  setStreaming: (slug, streaming) => set((s) => ({ streaming: { ...s.streaming, [slug]: streaming } })),
}));
