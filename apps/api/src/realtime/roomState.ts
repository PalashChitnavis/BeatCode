import * as Y from "yjs";
import type { RoomParticipant } from "@beatcode/shared";
import { prisma } from "../config/prisma";
import { logger } from "../config/logger";

interface LiveRoom {
  doc: Y.Doc;
  participants: Map<string, RoomParticipant>;
  saveTimer: NodeJS.Timeout | null;
}

const SAVE_DEBOUNCE_MS = 5000;

/**
 * Live collaborative rooms held in memory by this API instance. The Yjs document is
 * persisted to Postgres (debounced, and when the last participant leaves).
 */
const rooms = new Map<string, LiveRoom>();

export const participantCount = (code: string) => rooms.get(code)?.participants.size ?? 0;

export async function loadRoom(code: string): Promise<LiveRoom> {
  const existing = rooms.get(code);
  if (existing) return existing;

  const doc = new Y.Doc();
  const record = await prisma.room.findUnique({ where: { code }, select: { state: true } });
  if (record?.state) Y.applyUpdate(doc, new Uint8Array(record.state));

  // Another join may have loaded the room while we awaited the database.
  const raced = rooms.get(code);
  if (raced) return raced;

  const room: LiveRoom = { doc, participants: new Map(), saveTimer: null };
  rooms.set(code, room);
  return room;
}

export const getLiveRoom = (code: string) => rooms.get(code);

async function persist(code: string, room: LiveRoom) {
  if (room.saveTimer) clearTimeout(room.saveTimer);
  room.saveTimer = null;
  try {
    await prisma.room.update({
      where: { code },
      data: { state: Buffer.from(Y.encodeStateAsUpdate(room.doc)) },
    });
  } catch (error) {
    logger.error({ err: error, code }, "failed to persist room state");
  }
}

export function scheduleSave(code: string) {
  const room = rooms.get(code);
  if (!room || room.saveTimer) return;
  room.saveTimer = setTimeout(() => void persist(code, room), SAVE_DEBOUNCE_MS);
}

export async function removeParticipant(code: string, socketId: string) {
  const room = rooms.get(code);
  if (!room) return [];
  room.participants.delete(socketId);
  if (room.participants.size === 0) {
    rooms.delete(code);
    await persist(code, room);
    room.doc.destroy();
  }
  return [...room.participants.values()];
}

export async function persistAllRooms() {
  await Promise.all([...rooms.entries()].map(([code, room]) => persist(code, room)));
}
