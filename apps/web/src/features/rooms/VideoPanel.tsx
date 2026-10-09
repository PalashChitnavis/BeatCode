import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import { useEffect, useRef } from "react";
import type { RoomParticipant } from "@beatcode/shared";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import { useVideoCall } from "./useVideoCall";

function VideoTile({
  stream,
  muted,
  label,
  className,
}: {
  stream: MediaStream | null;
  muted?: boolean;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <div className={`relative overflow-hidden rounded-lg bg-black ${className ?? ""}`}>
      <video ref={ref} autoPlay playsInline muted={muted} className="size-full object-cover" />
      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
        {label}
      </span>
    </div>
  );
}

export function VideoPanel({ peer }: { peer: RoomParticipant | null }) {
  const call = useVideoCall(peer?.socketId ?? null);

  if (call.state === "idle") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
        {peer ? (
          <span className="flex min-w-0 items-center gap-2 text-sm">
            <UserAvatar name={peer.name} src={peer.avatarUrl} seed={peer.userId} className="size-7" />
            <span className="truncate">{peer.name} is here</span>
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Share the link to invite someone.</span>
        )}
        <Button size="sm" variant="secondary" disabled={!peer} onClick={() => void call.start()}>
          <Video /> Call
        </Button>
      </div>
    );
  }

  if (call.state === "incoming") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/50 bg-primary/5 p-3">
        <span className="text-sm font-medium">{peer?.name ?? "Your partner"} is calling…</span>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => void call.accept()}>
            <Phone /> Accept
          </Button>
          <Button size="sm" variant="destructive" onClick={call.decline}>
            Decline
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        {call.state === "outgoing" && !call.remoteStream ? (
          <div className="flex size-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
            Calling {peer?.name}…
          </div>
        ) : (
          <VideoTile stream={call.remoteStream} label={peer?.name ?? "Partner"} className="size-full" />
        )}
        <VideoTile
          stream={call.localStream}
          muted
          label="You"
          className="absolute bottom-2 right-2 aspect-video w-1/3 border border-white/20"
        />
      </div>
      <div className="flex justify-center gap-2">
        <Button
          size="icon-sm"
          variant={call.micOn ? "secondary" : "destructive"}
          onClick={call.toggleMic}
          aria-label={call.micOn ? "Mute" : "Unmute"}
        >
          {call.micOn ? <Mic /> : <MicOff />}
        </Button>
        <Button
          size="icon-sm"
          variant={call.cameraOn ? "secondary" : "destructive"}
          onClick={call.toggleCamera}
          aria-label={call.cameraOn ? "Turn camera off" : "Turn camera on"}
        >
          {call.cameraOn ? <Video /> : <VideoOff />}
        </Button>
        <Button size="sm" variant="destructive" onClick={call.hangUp}>
          <PhoneOff /> End
        </Button>
      </div>
    </div>
  );
}
