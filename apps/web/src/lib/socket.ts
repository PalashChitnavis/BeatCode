import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@beatcode/shared";
import { useAuthStore } from "@/features/auth/store";
import { refreshSession } from "./api";
import { env } from "./env";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

/** Lazily creates the shared connection. The token is read on every (re)connect. */
export function getSocket(): AppSocket {
  if (socket) return socket;
  socket = io(env.apiUrl || undefined, {
    withCredentials: true,
    auth: (cb) => cb({ token: useAuthStore.getState().accessToken ?? "" }),
  });
  socket.on("connect_error", async (error) => {
    if (error.message === "unauthorized" && (await refreshSession())) socket?.connect();
  });

  // Reconnect with the new identity when the user signs in or out.
  let userId = useAuthStore.getState().user?.id;
  useAuthStore.subscribe((state) => {
    if (state.user?.id === userId) return;
    userId = state.user?.id;
    socket?.disconnect().connect();
  });
  return socket;
}
