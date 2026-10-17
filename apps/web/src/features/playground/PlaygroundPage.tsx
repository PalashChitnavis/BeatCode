import { Play } from "lucide-react";
import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import type { Language } from "@beatcode/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { JudgingIndicator, PlaygroundResultView } from "@/features/submissions/ResultView";
import { CodeEditor } from "@/features/workspace/CodeEditor";
import { EditorToolbar } from "@/features/workspace/EditorToolbar";
import { useDrafts } from "@/features/workspace/drafts";
import { HELLO_WORLD } from "@/features/workspace/templates";
import { useRunner } from "@/features/workspace/useRunner";
import { useAuthStatus } from "@/features/auth/hooks";
import { useMediaQuery } from "@/lib/hooks";

const SCOPE = "playground";

export function PlaygroundPage() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const language: Language = useDrafts((s) => s.language[SCOPE]) ?? "python";
  const draft = useDrafts((s) => s.code[`${SCOPE}:${language}`]);
  const { setCode, clearCode, setLanguage } = useDrafts.getState();
  const [stdin, setStdin] = useState("");
  const runner = useRunner();
  const anonymous = useAuthStatus() === "anonymous";

  const code = draft ?? HELLO_WORLD[language];
  const run = () => runner.run({ kind: "PLAYGROUND", language, code, stdin });
  const direction = wide ? "horizontal" : "vertical";
  const handle = direction === "horizontal" ? "w-1.5" : "h-1.5";

  return (
    <PanelGroup direction={direction} autoSaveId={`playground-${direction}`} className="h-full">
      <Panel defaultSize={60} minSize={25} className="flex flex-col">
        <EditorToolbar
          language={language}
          onLanguageChange={(l) => setLanguage(SCOPE, l)}
          onReset={() => clearCode(SCOPE, language)}
        >
          <Button size="sm" onClick={run} loading={runner.running} title="Run (Ctrl+Enter)">
            {!runner.running && <Play />} Run
          </Button>
        </EditorToolbar>
        <div className="min-h-0 flex-1">
          <CodeEditor
            language={language}
            value={code}
            onChange={(v) => setCode(SCOPE, language, v)}
            onRun={run}
          />
        </div>
      </Panel>
      <PanelResizeHandle className={`${handle} bg-border/40 hover:bg-primary/40`} />
      <Panel defaultSize={40} minSize={20}>
        <PanelGroup direction="vertical" autoSaveId="playground-io">
          <Panel defaultSize={35} minSize={15} className="flex flex-col gap-2 p-4">
            <label htmlFor="stdin" className="text-sm font-medium">
              Input <span className="font-normal text-muted-foreground">(stdin)</span>
            </label>
            <Textarea
              id="stdin"
              className="min-h-0 flex-1"
              placeholder="Type input for your program here"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
            />
          </Panel>
          <PanelResizeHandle className="h-1.5 bg-border/40 hover:bg-primary/40" />
          <Panel defaultSize={65} minSize={15} className="overflow-y-auto p-4">
            <p className="mb-3 text-sm font-medium">Output</p>
            {runner.running ? (
              <JudgingIndicator />
            ) : runner.result ? (
              <PlaygroundResultView submission={runner.result} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Press Run to execute your code.
                {anonymous && " Sign in to keep a history of your runs."}
              </p>
            )}
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}
