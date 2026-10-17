import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { RtcSignal } from "@beatcode/shared";
import { env } from "@/lib/env";
import { getSocket } from "@/lib/socket";

export type CallState = "idle" | "outgoing" | "incoming" | "connected";

/**
 * One-to-one video call over WebRTC with signaling relayed by the API.
 * A fresh RTCPeerConnection is created per call and fully torn down on hang-up.
 */
export function useVideoCall(peerSocketId: string | null) {
  const [state, setState] = useState<CallState>("idle");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localRef = useRef<MediaStream | null>(null);
  const pendingOffer = useRef<{ from: string; sdp: string } | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  const send = useCallback(
    (to: string, signal: RtcSignal) => getSocket().emit("rtc:signal", { to, signal }),
    [],
  );

  const cleanup = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    localRef.current?.getTracks().forEach((t) => t.stop());
    localRef.current = null;
    pendingOffer.current = null;
    pendingCandidates.current = [];
    setLocalStream(null);
    setRemoteStream(null);
    setMicOn(true);
    setCameraOn(true);
    setState("idle");
  }, []);

  const createPeer = useCallback(
    (to: string) => {
      const pc = new RTCPeerConnection({ iceServers: env.iceServers });
      pc.onicecandidate = (event) => {
        if (event.candidate) send(to, { type: "candidate", candidate: event.candidate.toJSON() });
      };
      pc.ontrack = (event) => setRemoteStream(event.streams[0] ?? null);
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed") {
          toast.error("The call connection failed");
          cleanup();
        }
      };
      pcRef.current = pc;
      return pc;
    },
    [send, cleanup],
  );

  const getMedia = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localRef.current = stream;
    setLocalStream(stream);
    return stream;
  }, []);

  const flushCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;
    for (const candidate of pendingCandidates.current) await pc.addIceCandidate(candidate).catch(() => {});
    pendingCandidates.current = [];
  }, []);

  const start = useCallback(async () => {
    if (!peerSocketId) return;
    try {
      const stream = await getMedia();
      const pc = createPeer(peerSocketId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      send(peerSocketId, { type: "offer", sdp: offer.sdp ?? "" });
      setState("outgoing");
    } catch {
      toast.error("Could not access your camera or microphone");
      cleanup();
    }
  }, [peerSocketId, getMedia, createPeer, send, cleanup]);

  const accept = useCallback(async () => {
    const offer = pendingOffer.current;
    if (!offer) return;
    try {
      const stream = await getMedia();
      const pc = createPeer(offer.from);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      await pc.setRemoteDescription({ type: "offer", sdp: offer.sdp });
      await flushCandidates();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      send(offer.from, { type: "answer", sdp: answer.sdp ?? "" });
      pendingOffer.current = null;
      setState("connected");
    } catch {
      toast.error("Could not access your camera or microphone");
      send(offer.from, { type: "decline" });
      cleanup();
    }
  }, [getMedia, createPeer, flushCandidates, send, cleanup]);

  const decline = useCallback(() => {
    if (pendingOffer.current) send(pendingOffer.current.from, { type: "decline" });
    cleanup();
  }, [send, cleanup]);

  const hangUp = useCallback(() => {
    if (peerSocketId) send(peerSocketId, { type: "hangup" });
    cleanup();
  }, [peerSocketId, send, cleanup]);

  const toggleMic = useCallback(() => {
    const next = !micOn;
    localRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
    setMicOn(next);
  }, [micOn]);

  const toggleCamera = useCallback(() => {
    const next = !cameraOn;
    localRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
    setCameraOn(next);
  }, [cameraOn]);

  useEffect(() => {
    const socket = getSocket();
    const onSignal = async ({ from, signal }: { from: string; signal: RtcSignal }) => {
      switch (signal.type) {
        case "offer":
          if (pcRef.current) return send(from, { type: "decline" });
          pendingOffer.current = { from, sdp: signal.sdp };
          setState("incoming");
          break;
        case "answer":
          await pcRef.current?.setRemoteDescription({ type: "answer", sdp: signal.sdp });
          await flushCandidates();
          setState("connected");
          break;
        case "candidate": {
          const candidate = signal.candidate as RTCIceCandidateInit;
          if (pcRef.current?.remoteDescription)
            await pcRef.current.addIceCandidate(candidate).catch(() => {});
          else pendingCandidates.current.push(candidate);
          break;
        }
        case "decline":
          toast.info("Call declined");
          cleanup();
          break;
        case "hangup":
          toast.info("Call ended");
          cleanup();
          break;
      }
    };
    socket.on("rtc:signal", onSignal);
    return () => {
      socket.off("rtc:signal", onSignal);
    };
  }, [send, flushCandidates, cleanup]);

  // End the call if the other participant leaves, and on unmount.
  useEffect(() => {
    if (!peerSocketId) cleanup();
  }, [peerSocketId, cleanup]);
  useEffect(() => cleanup, [cleanup]);

  return {
    state,
    localStream,
    remoteStream,
    micOn,
    cameraOn,
    start,
    accept,
    decline,
    hangUp,
    toggleMic,
    toggleCamera,
  };
}
