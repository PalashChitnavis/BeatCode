import { useEffect, useState, useSyncExternalStore } from "react";
import * as Y from "yjs";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates,
} from "y-protocols/awareness";
import type { RoomParticipant, UserDTO } from "@beatcode/shared";
import { colorFor } from "@/lib/format";
import { getSocket } from "@/lib/socket";

/** Marks changes that came from the server so they are not echoed back. */
const REMOTE = Symbol("remote");

export type RoomStatus = "connecting" | "joined" | "error";

export interface RoomSession {
  status: RoomStatus;
  error: string | null;
  doc: Y.Doc;
  awareness: Awareness;
  participants: RoomParticipant[];
}

/**
 * Joins a collaborative room and keeps a local Yjs document in sync over Socket.IO.
 * Rejoins (and re-sends local state) automatically after reconnecting.
 */
export function useRoomSession(code: string, user: UserDTO): RoomSession {
  const [{ doc, awareness }] = useState(() => {
    const doc = new Y.Doc();
    return { doc, awareness: new Awareness(doc) };
  });
  const [status, setStatus] = useState<RoomStatus>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);

  useEffect(() => {
    const socket = getSocket();
    awareness.setLocalStateField("user", { name: user.name, color: colorFor(user.id) });

    const broadcastAwareness = () =>
      socket.emit("awareness:update", encodeAwarenessUpdate(awareness, [doc.clientID]));

    const onDocUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin !== REMOTE) socket.emit("yjs:update", update);
    };
    const onAwarenessChange = (
      { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
      origin: unknown,
    ) => {
      if (origin === REMOTE) return;
      socket.emit("awareness:update", encodeAwarenessUpdate(awareness, [...added, ...updated, ...removed]));
    };
    const onRemoteUpdate = (update: Uint8Array) => Y.applyUpdate(doc, new Uint8Array(update), REMOTE);
    const onRemoteAwareness = (update: Uint8Array) =>
      applyAwarenessUpdate(awareness, new Uint8Array(update), REMOTE);
    const onParticipants = (list: RoomParticipant[]) => {
      setParticipants(list);
      // Let newcomers see our cursor straight away.
      broadcastAwareness();
    };

    const join = () => {
      setStatus("connecting");
      socket.emit("room:join", code, (response) => {
        if (!response.ok) {
          setError(response.error);
          setStatus("error");
          return;
        }
        Y.applyUpdate(doc, new Uint8Array(response.data.state), REMOTE);
        // Push anything edited locally while disconnected; merging is idempotent.
        socket.emit("yjs:update", Y.encodeStateAsUpdate(doc));
        setParticipants(response.data.participants);
        setError(null);
        setStatus("joined");
        broadcastAwareness();
      });
    };

    doc.on("update", onDocUpdate);
    awareness.on("update", onAwarenessChange);
    socket.on("yjs:update", onRemoteUpdate);
    socket.on("awareness:update", onRemoteAwareness);
    socket.on("room:participants", onParticipants);
    socket.on("connect", join);
    if (socket.connected) join();

    return () => {
      removeAwarenessStates(awareness, [doc.clientID], "local");
      socket.emit("room:leave");
      doc.off("update", onDocUpdate);
      awareness.off("update", onAwarenessChange);
      socket.off("yjs:update", onRemoteUpdate);
      socket.off("awareness:update", onRemoteAwareness);
      socket.off("room:participants", onParticipants);
      socket.off("connect", join);
    };
  }, [code, user.id, user.name, doc, awareness]);

  return { status, error, doc, awareness, participants };
}

/** Subscribes a component to one key of a shared Y.Map. */
export function useYMapValue<T>(map: Y.Map<unknown>, key: string): T | undefined {
  return useSyncExternalStore(
    (onChange) => {
      const observer = (event: Y.YMapEvent<unknown>) => {
        if (event.keysChanged.has(key)) onChange();
      };
      map.observe(observer);
      return () => map.unobserve(observer);
    },
    () => map.get(key) as T | undefined,
  );
}

/** Subscribes a component to the contents of a shared Y.Text. */
export function useYText(text: Y.Text): string {
  return useSyncExternalStore(
    (onChange) => {
      text.observe(onChange);
      return () => text.unobserve(onChange);
    },
    () => text.toString(),
  );
}

/** Replaces a Y.Text's content with a minimal edit (common prefix/suffix kept), so concurrent typing merges well. */
export function setYText(text: Y.Text, next: string) {
  const current = text.toString();
  if (current === next) return;
  let start = 0;
  while (start < current.length && start < next.length && current[start] === next[start]) start++;
  let endCurrent = current.length;
  let endNext = next.length;
  while (endCurrent > start && endNext > start && current[endCurrent - 1] === next[endNext - 1]) {
    endCurrent--;
    endNext--;
  }
  text.doc!.transact(() => {
    if (endCurrent > start) text.delete(start, endCurrent - start);
    if (endNext > start) text.insert(start, next.slice(start, endNext));
  });
}
