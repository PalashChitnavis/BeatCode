import type { SubmissionDTO } from "./types";

export interface RoomParticipant {
  socketId: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
}

export type RtcSignal =
  | { type: "offer"; sdp: string }
  | { type: "answer"; sdp: string }
  | { type: "candidate"; candidate: unknown }
  | { type: "hangup" }
  | { type: "decline" };

export type Ack<T> = (response: { ok: true; data: T } | { ok: false; error: string }) => void;

export interface ServerToClientEvents {
  "submission:update": (submission: SubmissionDTO) => void;
  "room:participants": (participants: RoomParticipant[]) => void;
  "yjs:update": (update: Uint8Array) => void;
  "awareness:update": (update: Uint8Array) => void;
  "rtc:signal": (payload: { from: string; signal: RtcSignal }) => void;
}

export interface ClientToServerEvents {
  "submission:subscribe": (submissionId: string, ack: Ack<null>) => void;
  "submission:unsubscribe": (submissionId: string) => void;
  "room:join": (code: string, ack: Ack<{ state: Uint8Array; participants: RoomParticipant[] }>) => void;
  "room:leave": () => void;
  "yjs:update": (update: Uint8Array) => void;
  "awareness:update": (update: Uint8Array) => void;
  "rtc:signal": (payload: { to: string; signal: RtcSignal }) => void;
}
