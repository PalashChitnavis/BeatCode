import type { Server as HttpServer } from "node:http";
import { Server, type Socket } from "socket.io";
import * as Y from "yjs";
import {
  ROOM_CAPACITY,
  roomCodeSchema,
  type Ack,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@beatcode/shared";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { prisma } from "../config/prisma";
import { appEvents } from "../lib/events";
import { verifyAccessToken } from "../lib/jwt";
import { getSubmission, loadSubmission } from "../modules/submissions/submissions.service";
import { getActiveRoom, touchRoom } from "../modules/rooms/rooms.service";
import { getLiveRoom, loadRoom, removeParticipant, scheduleSave } from "./roomState";

interface SocketData {
  user?: { id: string; name: string };
  roomCode?: string;
}

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

const MAX_UPDATE_BYTES = 512 * 1024;
const submissionChannel = (id: string) => `submission:${id}`;
const roomChannel = (code: string) => `room:${code}`;

const fail = <T>(ack: Ack<T> | undefined, error: string) =>
  typeof ack === "function" && ack({ ok: false, error });
const isBinary = (value: unknown): value is Uint8Array =>
  value instanceof Uint8Array && value.byteLength > 0 && value.byteLength <= MAX_UPDATE_BYTES;

export function createSocketServer(httpServer: HttpServer): AppServer {
  const io: AppServer = new Server(httpServer, {
    cors: { origin: env.WEB_ORIGIN, credentials: true },
    maxHttpBufferSize: MAX_UPDATE_BYTES,
  });

  // Guests may connect (to follow playground runs); rooms require a signed-in user.
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (typeof token !== "string" || !token) return next();
    try {
      const claims = await verifyAccessToken(token);
      socket.data.user = { id: claims.sub, name: claims.name };
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    registerSubmissionHandlers(socket);
    registerRoomHandlers(io, socket);
  });

  appEvents.on("submission:done", async (submissionId) => {
    try {
      const submission = await loadSubmission(submissionId);
      if (submission) io.to(submissionChannel(submissionId)).emit("submission:update", submission);
    } catch (error) {
      logger.error({ err: error, submissionId }, "failed to broadcast submission result");
    }
  });

  return io;
}

function registerSubmissionHandlers(socket: AppSocket) {
  socket.on("submission:subscribe", async (submissionId, ack) => {
    if (typeof submissionId !== "string") return fail(ack, "Invalid submission id");
    try {
      // getSubmission enforces ownership.
      await getSubmission(submissionId, socket.data.user?.id);
      await socket.join(submissionChannel(submissionId));
      ack?.({ ok: true, data: null });
    } catch {
      fail(ack, "Submission not found");
    }
  });

  socket.on("submission:unsubscribe", (submissionId) => {
    if (typeof submissionId === "string") void socket.leave(submissionChannel(submissionId));
  });
}

function registerRoomHandlers(io: AppServer, socket: AppSocket) {
  const leave = async () => {
    const code = socket.data.roomCode;
    if (!code) return;
    socket.data.roomCode = undefined;
    await socket.leave(roomChannel(code));
    const participants = await removeParticipant(code, socket.id);
    io.to(roomChannel(code)).emit("room:participants", participants);
  };

  socket.on("room:join", async (rawCode, ack) => {
    const user = socket.data.user;
    if (!user) return fail(ack, "Sign in to join rooms");
    const parsed = roomCodeSchema.safeParse(rawCode);
    if (!parsed.success) return fail(ack, "Invalid room code");
    const code = parsed.data;

    try {
      await leave();
      await getActiveRoom(code);
      const room = await loadRoom(code);
      if (room.participants.size >= ROOM_CAPACITY) return fail(ack, "This room is full");

      const profile = await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, avatarUrl: true },
      });
      room.participants.set(socket.id, {
        socketId: socket.id,
        userId: user.id,
        name: profile?.name ?? user.name,
        avatarUrl: profile?.avatarUrl ?? null,
      });
      socket.data.roomCode = code;
      await socket.join(roomChannel(code));
      await touchRoom(code);

      const participants = [...room.participants.values()];
      ack({ ok: true, data: { state: Y.encodeStateAsUpdate(room.doc), participants } });
      socket.to(roomChannel(code)).emit("room:participants", participants);
    } catch (error) {
      logger.warn({ err: error, code }, "room join failed");
      fail(ack, error instanceof Error ? error.message : "Could not join room");
    }
  });

  socket.on("room:leave", () => void leave());
  socket.on("disconnect", () => void leave());

  socket.on("yjs:update", (update) => {
    const code = socket.data.roomCode;
    const room = code ? getLiveRoom(code) : undefined;
    if (!code || !room || !isBinary(update)) return;
    try {
      Y.applyUpdate(room.doc, new Uint8Array(update), socket.id);
      socket.to(roomChannel(code)).emit("yjs:update", update);
      scheduleSave(code);
    } catch (error) {
      logger.warn({ err: error, code }, "rejected malformed yjs update");
    }
  });

  socket.on("awareness:update", (update) => {
    const code = socket.data.roomCode;
    if (code && isBinary(update)) socket.to(roomChannel(code)).emit("awareness:update", update);
  });

  // WebRTC signaling is relayed only between participants of the same room.
  socket.on("rtc:signal", (payload) => {
    const code = socket.data.roomCode;
    const room = code ? getLiveRoom(code) : undefined;
    if (!room || typeof payload?.to !== "string" || !room.participants.has(payload.to)) return;
    io.to(payload.to).emit("rtc:signal", { from: socket.id, signal: payload.signal });
  });
}
