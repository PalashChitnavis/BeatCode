import type { RoomDTO } from "@beatcode/shared";
import { api } from "@/lib/api";

export const roomsApi = {
  create: () => api.post<RoomDTO>("/rooms").then((r) => r.data),
  get: (code: string) => api.get<RoomDTO>(`/rooms/${code}`).then((r) => r.data),
};
