import { EventEmitter } from "node:events";

interface AppEvents {
  "submission:done": [submissionId: string];
}

/** In-process events that decouple domain services from the realtime layer. */
export const appEvents = new EventEmitter<AppEvents>();
