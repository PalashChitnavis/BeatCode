import { ROOM_CAPACITY, ROOM_CODE_LENGTH, type RoomDTO } from "@beatcode/shared";
import type { Room, User } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { notFound } from "../../lib/errors";
import { publicUserSelect, toPublicUserDTO } from "../../lib/dto";
import { randomRoomCode } from "../../lib/tokens";
import { participantCount } from "../../realtime/roomState";

const ROOM_TTL_MS = 24 * 60 * 60 * 1000;

const toRoomDTO = (
  room: Room & { host: Pick<User, "id" | "name" | "avatarUrl" | "createdAt"> },
): RoomDTO => ({
  code: room.code,
  host: toPublicUserDTO(room.host),
  participants: participantCount(room.code),
  capacity: ROOM_CAPACITY,
  createdAt: room.createdAt.toISOString(),
  expiresAt: room.expiresAt.toISOString(),
});

export async function createRoom(hostId: string): Promise<RoomDTO> {
  const room = await prisma.room.create({
    data: { code: randomRoomCode(ROOM_CODE_LENGTH), hostId, expiresAt: new Date(Date.now() + ROOM_TTL_MS) },
    include: { host: { select: publicUserSelect } },
  });
  return toRoomDTO(room);
}

export async function getActiveRoom(code: string): Promise<RoomDTO> {
  const room = await prisma.room.findUnique({
    where: { code },
    include: { host: { select: publicUserSelect } },
  });
  if (!room || room.expiresAt < new Date()) throw notFound("This room does not exist or has expired");
  return toRoomDTO(room);
}

/** Keeps a room alive for another day whenever someone joins it. */
export async function touchRoom(code: string) {
  await prisma.room.update({ where: { code }, data: { expiresAt: new Date(Date.now() + ROOM_TTL_MS) } });
}

export async function deleteExpiredRooms() {
  await prisma.room.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}
