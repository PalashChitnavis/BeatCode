import { env } from "../../config/env";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  system: string;
  messages: ChatMessage[];
  signal: AbortSignal;
}

/** A language model that streams its reply as text chunks. */
export interface LLMProvider {
  name: string;
  stream(request: ChatRequest): AsyncGenerator<string>;
}

/** Raised for upstream failures; `quotaExceeded` means the free tier is used up for now. */
export class ProviderError extends Error {
  constructor(
    message: string,
    readonly quotaExceeded = false,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

async function* lines(body: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of body) {
    buffer += decoder.decode(chunk, { stream: true });
    let newline: number;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      yield buffer.slice(0, newline).trimEnd();
      buffer = buffer.slice(newline + 1);
    }
  }
  if (buffer.trim()) yield buffer.trim();
}

async function ensureOk(res: Response, provider: string) {
  if (res.ok && res.body) return res.body;
  const detail = (await res.text().catch(() => "")).slice(0, 500);
  throw new ProviderError(`${provider} responded ${res.status}: ${detail}`, res.status === 429);
}

/**
 * Gemini API over plain REST. With a key from a project that has no billing account this is the
 * free tier: requests over the quota fail with 429 instead of being charged.
 */
function gemini(apiKey: string, model: string): LLMProvider {
  return {
    name: "gemini",
    async *stream({ system, messages, signal }) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
      const res = await fetch(url, {
        method: "POST",
        signal,
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: { maxOutputTokens: env.AI_MAX_OUTPUT_TOKENS, temperature: 0.4 },
        }),
      });
      for await (const line of lines(await ensureOk(res, "Gemini"))) {
        if (!line.startsWith("data:")) continue;
        const event = JSON.parse(line.slice(5)) as {
          candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
        };
        for (const part of event.candidates?.[0]?.content?.parts ?? []) {
          if (part.text && !part.thought) yield part.text;
        }
      }
    },
  };
}

/** A model served by a local Ollama instance: no API key and no cost. */
function ollama(baseUrl: string, model: string): LLMProvider {
  return {
    name: "ollama",
    async *stream({ system, messages, signal }) {
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
        method: "POST",
        signal,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model,
          stream: true,
          messages: [{ role: "system", content: system }, ...messages],
          options: { num_predict: env.AI_MAX_OUTPUT_TOKENS, temperature: 0.4 },
        }),
      });
      for await (const line of lines(await ensureOk(res, "Ollama"))) {
        if (!line) continue;
        const event = JSON.parse(line) as { message?: { content?: string }; error?: string };
        if (event.error) throw new ProviderError(`Ollama: ${event.error}`);
        if (event.message?.content) yield event.message.content;
      }
    },
  };
}

let provider: LLMProvider | null | undefined;

/** The configured provider, or null when the AI tutor is turned off. */
export function getProvider(): LLMProvider | null {
  if (provider !== undefined) return provider;
  if (!env.aiEnabled) provider = null;
  else if (env.AI_PROVIDER === "ollama") provider = ollama(env.OLLAMA_URL, env.OLLAMA_MODEL);
  else provider = gemini(env.GEMINI_API_KEY, env.GEMINI_MODEL);
  return provider;
}
