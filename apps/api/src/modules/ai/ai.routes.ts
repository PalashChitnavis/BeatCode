import { Router, type Response } from "express";
import { aiChatSchema, type AiStreamEvent } from "@beatcode/shared";
import { parseInput } from "../../lib/validation";
import { currentUser, requireAuth } from "../../middleware/auth";
import { aiLimiter } from "../../middleware/rateLimit";
import { getStatus, prepareChat } from "./ai.service";
import { ProviderError } from "./providers";
import { refundQuestion } from "./quota";

export const aiRouter = Router();
aiRouter.use(requireAuth);

aiRouter.get("/status", async (req, res) => {
  res.json(await getStatus(currentUser(req).id));
});

const send = (res: Response, event: AiStreamEvent) => res.write(`data: ${JSON.stringify(event)}\n\n`);

/** Streams the tutor's answer as server-sent events. Errors before streaming starts are plain JSON. */
aiRouter.post("/chat", aiLimiter, async (req, res) => {
  const userId = currentUser(req).id;
  const input = parseInput(aiChatSchema, req.body);
  const { provider, system, messages, remaining } = await prepareChat(input, userId);

  const abort = new AbortController();
  res.on("close", () => abort.abort());
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
    // Stops nginx from buffering the stream.
    "x-accel-buffering": "no",
  });
  res.flushHeaders();

  let received = false;
  try {
    for await (const text of provider.stream({ system, messages, signal: abort.signal })) {
      received = true;
      send(res, { type: "delta", text });
    }
    if (!received) throw new ProviderError("Empty response");
    send(res, { type: "done", remainingToday: remaining });
  } catch (err) {
    if (abort.signal.aborted) return;
    req.log.warn({ err, provider: provider.name }, "AI provider failed");
    if (!received) await refundQuestion(userId);
    send(res, {
      type: "error",
      message:
        err instanceof ProviderError && err.quotaExceeded
          ? "The AI tutor is busy (free quota reached). Please wait a minute and try again."
          : "The AI tutor could not answer right now. Please try again.",
    });
  } finally {
    res.end();
  }
});
