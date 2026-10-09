import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Plus, Users, Video } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { roomCodeSchema } from "@beatcode/shared";
import { RequireAuth } from "@/app/RequireAuth";
import { PageContainer, PageHeader } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/api";
import { roomsApi } from "./api";

export function RoomsPage() {
  const navigate = useNavigate();
  const [codeInput, setCodeInput] = useState("");

  const create = useMutation({
    mutationFn: roomsApi.create,
    onSuccess: (room) => navigate(`/rooms/${room.code}`),
    onError: (error) => toast.error(errorMessage(error)),
  });
  const join = useMutation({
    mutationFn: (code: string) => roomsApi.get(code),
    onSuccess: (room) => {
      if (room.participants >= room.capacity) toast.error("This room is full");
      else navigate(`/rooms/${room.code}`);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const onJoin = (event: FormEvent) => {
    event.preventDefault();
    // Accept either a bare code or a pasted room link.
    const raw = codeInput.trim().split("/").filter(Boolean).pop() ?? "";
    const parsed = roomCodeSchema.safeParse(raw);
    if (!parsed.success) return toast.error("Enter a valid room code or link");
    join.mutate(parsed.data);
  };

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader
        title="Code rooms"
        description="Pair program in a shared editor with live cursors and a video call."
      />
      <RequireAuth reason="Sign in to host or join code rooms">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="size-4" /> Host a room
              </CardTitle>
              <CardDescription>
                Create a private room and share its link with one other person.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => create.mutate()} loading={create.isPending}>
                Create room
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="size-4" /> Join a room
              </CardTitle>
              <CardDescription>Paste the room code or link you were sent.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onJoin} className="flex gap-2">
                <Input
                  placeholder="e.g. k7m2qx9a"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  aria-label="Room code"
                />
                <Button type="submit" variant="secondary" loading={join.isPending}>
                  Join
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
          <p className="flex gap-2">
            <Users className="size-4 shrink-0" /> Edits merge in real time, so you can both type at once
            without overwriting each other.
          </p>
          <p className="flex gap-2">
            <Video className="size-4 shrink-0" /> Video and audio go directly between your browsers.
          </p>
        </div>
      </RequireAuth>
    </PageContainer>
  );
}
