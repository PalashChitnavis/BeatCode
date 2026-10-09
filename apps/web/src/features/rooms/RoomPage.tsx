import { Copy, LogOut, Play, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { MonacoBinding } from "y-monaco";
import type { editor } from "monaco-editor";
import type { Language, SubmissionDTO, UserDTO } from "@beatcode/shared";
import { RequireAuth } from "@/app/RequireAuth";
import { ErrorState, LoadingState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { useCurrentUser } from "@/features/auth/hooks";
import { JudgingIndicator, PlaygroundResultView } from "@/features/submissions/ResultView";
import { CodeEditor } from "@/features/workspace/CodeEditor";
import { EditorToolbar } from "@/features/workspace/EditorToolbar";
import { HELLO_WORLD } from "@/features/workspace/templates";
import { useRunner } from "@/features/workspace/useRunner";
import { useMediaQuery } from "@/lib/hooks";
import { RemoteCursorStyles } from "./RemoteCursorStyles";
import { setYText, useRoomSession, useYMapValue, useYText } from "./useRoomSession";
import { VideoPanel } from "./VideoPanel";

/** The last run's result, shared with everyone in the room. */
interface SharedOutput {
  by: string;
  submission: SubmissionDTO;
}

function Room({ code, user }: { code: string; user: UserDTO }) {
  const session = useRoomSession(code, user);
  const { doc, awareness } = session;
  const wide = useMediaQuery("(min-width: 1024px)");

  const meta = doc.getMap<unknown>("meta");
  const codeText = doc.getText("code");
  const stdinText = doc.getText("stdin");
  const language = useYMapValue<Language>(meta, "language") ?? "cpp";
  const runningBy = useYMapValue<string>(meta, "runningBy");
  const output = useYMapValue<SharedOutput>(meta, "output");
  const stdin = useYText(stdinText);

  // The first person in a fresh room seeds it with a starter program.
  useEffect(() => {
    if (session.status !== "joined" || meta.has("language") || session.participants.length > 1) return;
    doc.transact(() => {
      meta.set("language", "cpp");
      if (codeText.length === 0) codeText.insert(0, HELLO_WORLD.cpp);
    });
  }, [session.status, session.participants.length, doc, meta, codeText]);

  const bindingRef = useRef<MonacoBinding | null>(null);
  useEffect(() => () => bindingRef.current?.destroy(), []);
  const bindEditor = (instance: editor.IStandaloneCodeEditor) => {
    bindingRef.current?.destroy();
    bindingRef.current = new MonacoBinding(codeText, instance.getModel()!, new Set([instance]), awareness);
  };

  const runner = useRunner((submission) => {
    doc.transact(() => {
      meta.set("output", { by: user.name, submission } satisfies SharedOutput);
      meta.delete("runningBy");
    });
  });
  const run = () => {
    if (runningBy) return;
    meta.set("runningBy", user.name);
    runner.run(
      { kind: "PLAYGROUND", language, code: codeText.toString(), stdin: stdinText.toString() },
      { onError: () => meta.delete("runningBy") },
    );
  };

  const changeLanguage = (next: Language) => {
    doc.transact(() => {
      // Swap in the new starter only if the code is still the untouched starter of the old language.
      if (codeText.toString() === HELLO_WORLD[language]) setYText(codeText, HELLO_WORLD[next]);
      meta.set("language", next);
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Room link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  if (session.status === "error") {
    return (
      <div className="grid h-full place-items-center">
        <div className="grid justify-items-center gap-3">
          <ErrorState error={new Error(session.error ?? "Could not join this room")} />
          <Button variant="outline" asChild>
            <Link to="/rooms">Back to rooms</Link>
          </Button>
        </div>
      </div>
    );
  }
  if (session.status === "connecting" && session.participants.length === 0)
    return <LoadingState className="h-full" />;

  const peer = session.participants.find((p) => p.userId !== user.id) ?? null;
  const direction = wide ? "horizontal" : "vertical";

  return (
    <div className="flex h-full flex-col">
      <RemoteCursorStyles awareness={awareness} />
      <div className="flex h-12 shrink-0 items-center gap-3 border-b px-4">
        <Users className="size-4 text-muted-foreground" />
        <span className="font-mono text-sm">{code}</span>
        <Button variant="ghost" size="icon-sm" onClick={copyLink} aria-label="Copy room link">
          <Copy />
        </Button>
        <div className="flex -space-x-2">
          {session.participants.map((p) => (
            <UserAvatar
              key={p.socketId}
              name={p.name}
              src={p.avatarUrl}
              seed={p.userId}
              className="size-7 ring-2 ring-background"
            />
          ))}
        </div>
        {session.status === "connecting" && (
          <span className="text-xs text-muted-foreground">Reconnecting…</span>
        )}
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link to="/rooms">
            <LogOut /> Leave
          </Link>
        </Button>
      </div>

      <PanelGroup direction={direction} autoSaveId={`room-${direction}`} className="min-h-0 flex-1">
        <Panel defaultSize={62} minSize={30} className="flex flex-col">
          <EditorToolbar
            language={language}
            onLanguageChange={changeLanguage}
            onReset={() => setYText(codeText, HELLO_WORLD[language])}
          >
            <Button size="sm" onClick={run} loading={Boolean(runningBy)}>
              {!runningBy && <Play />} Run
            </Button>
          </EditorToolbar>
          <div className="min-h-0 flex-1">
            <CodeEditor language={language} onMount={bindEditor} onRun={run} />
          </div>
        </Panel>
        <PanelResizeHandle
          className={`${direction === "horizontal" ? "w-1.5" : "h-1.5"} bg-border/40 hover:bg-primary/40`}
        />
        <Panel
          defaultSize={38}
          minSize={20}
          className="flex min-w-0 flex-col gap-4 overflow-y-auto p-4 [&>*]:shrink-0"
        >
          <VideoPanel peer={peer} />
          <div className="grid gap-2">
            <label htmlFor="room-stdin" className="text-sm font-medium">
              Input <span className="font-normal text-muted-foreground">(shared)</span>
            </label>
            <Textarea
              id="room-stdin"
              rows={4}
              value={stdin}
              onChange={(e) => setYText(stdinText, e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">
              Output{" "}
              {output && <span className="font-normal text-muted-foreground">· run by {output.by}</span>}
            </p>
            {runningBy ? (
              <JudgingIndicator />
            ) : output ? (
              <PlaygroundResultView submission={output.submission} />
            ) : (
              <p className="text-sm text-muted-foreground">Run the code to see output here.</p>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export function RoomPage() {
  const { code = "" } = useParams();
  const user = useCurrentUser();
  return (
    <RequireAuth reason="Sign in to join code rooms">
      {/* Remount per room so each gets a fresh Yjs document. */}
      {user && <Room key={code} code={code} user={user} />}
    </RequireAuth>
  );
}
