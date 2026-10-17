import { useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { CloudUpload, FileText, History, Lightbulb, Play, Sparkles, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useParams } from "react-router";
import { toast } from "sonner";
import type { Language, SubmissionDTO } from "@beatcode/shared";
import { ErrorState, LoadingState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiPanel } from "@/features/ai/AiPanel";
import { useAiChats } from "@/features/ai/store";
import { useAuthDialog } from "@/features/auth/dialogStore";
import { useAuthStatus } from "@/features/auth/hooks";
import { JudgeResultView, JudgingIndicator, OutputBlock } from "@/features/submissions/ResultView";
import { submissionKeys } from "@/features/submissions/api";
import { CodeEditor } from "@/features/workspace/CodeEditor";
import { EditorToolbar } from "@/features/workspace/EditorToolbar";
import { useDrafts } from "@/features/workspace/drafts";
import { useRunner } from "@/features/workspace/useRunner";
import { useMediaQuery } from "@/lib/hooks";
import { problemKeys, useProblem } from "./api";
import { ProblemDescription, ProblemSubmissionsPanel, SolutionsPanel } from "./ProblemSidePanels";

const DEFAULT_LANGUAGE: Language = "cpp";

function ResizeHandle({ direction }: { direction: "horizontal" | "vertical" }) {
  return (
    <PanelResizeHandle
      className={
        direction === "horizontal"
          ? "w-1.5 bg-border/40 transition-colors hover:bg-primary/40 data-[resize-handle-state=drag]:bg-primary/60"
          : "h-1.5 bg-border/40 transition-colors hover:bg-primary/40 data-[resize-handle-state=drag]:bg-primary/60"
      }
    />
  );
}

export function ProblemPage() {
  const { slug = "" } = useParams();
  const problem = useProblem(slug);
  const queryClient = useQueryClient();
  const wide = useMediaQuery("(min-width: 1024px)");
  const authenticated = useAuthStatus() === "authenticated";
  const showAuth = useAuthDialog((s) => s.show);

  const scope = `problem:${slug}`;
  const language = useDrafts((s) => s.language[scope]) ?? DEFAULT_LANGUAGE;
  const draft = useDrafts((s) => s.code[`${scope}:${language}`]);
  const { setCode, clearCode, setLanguage } = useDrafts.getState();
  const [consoleTab, setConsoleTab] = useState("testcases");
  const [leftTab, setLeftTab] = useState("description");

  const onDone = useCallback(
    (submission: SubmissionDTO) => {
      if (submission.kind !== "SUBMIT") return;
      void queryClient.invalidateQueries({ queryKey: problemKeys.all });
      void queryClient.invalidateQueries({ queryKey: problemKeys.stats });
      void queryClient.invalidateQueries({ queryKey: submissionKeys.mine() });
      if (submission.verdict === "ACCEPTED") {
        void confetti({ particleCount: 140, spread: 80, origin: { y: 0.7 } });
        toast.success("Accepted! Nicely done.");
      }
    },
    [queryClient],
  );
  const runner = useRunner(onDone);

  if (problem.isPending) return <LoadingState className="h-full" />;
  if (problem.isError)
    return <ErrorState className="h-full" error={problem.error} onRetry={() => problem.refetch()} />;

  const data = problem.data;
  const code = draft ?? data.starterCode[language] ?? "";

  const run = (kind: "RUN" | "SUBMIT") => {
    if (!authenticated) {
      showAuth({ reason: kind === "RUN" ? "Sign in to run your code" : "Sign in to submit solutions" });
      return;
    }
    setConsoleTab("result");
    runner.run({ kind, language, code, problemSlug: slug });
  };

  const askAiWhy = (submission: SubmissionDTO) => {
    const verdict = submission.verdict === "COMPILE_ERROR" ? "a compile error" : "this verdict";
    useAiChats.getState().queue(slug, { mode: "debug", text: `Why does my code get ${verdict}?` });
    setLeftTab("ai");
  };

  const direction = wide ? "horizontal" : "vertical";

  return (
    <PanelGroup direction={direction} autoSaveId={`problem-${direction}`} className="h-full">
      <Panel defaultSize={45} minSize={20} className="flex flex-col">
        <Tabs value={leftTab} onValueChange={setLeftTab} className="flex min-h-0 flex-1 flex-col">
          <div className="overflow-x-auto border-b px-2 py-1.5">
            <TabsList className="bg-transparent">
              <TabsTrigger value="description">
                <FileText /> Description
              </TabsTrigger>
              <TabsTrigger value="solutions">
                <Lightbulb /> Solutions
              </TabsTrigger>
              <TabsTrigger value="submissions">
                <History /> Submissions
              </TabsTrigger>
              <TabsTrigger value="community">
                <Users /> Community
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Sparkles /> AI Help
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <TabsContent value="description">
              <ProblemDescription problem={data} />
            </TabsContent>
            <TabsContent value="solutions">
              <SolutionsPanel slug={slug} />
            </TabsContent>
            <TabsContent value="submissions">
              <ProblemSubmissionsPanel slug={slug} scope="me" />
            </TabsContent>
            <TabsContent value="community">
              <ProblemSubmissionsPanel slug={slug} scope="accepted" />
            </TabsContent>
            <TabsContent value="ai" className="h-full">
              <AiPanel slug={slug} language={language} code={code} submissionId={runner.result?.id} />
            </TabsContent>
          </div>
        </Tabs>
      </Panel>

      <ResizeHandle direction={direction} />

      <Panel defaultSize={55} minSize={30}>
        <PanelGroup direction="vertical" autoSaveId="problem-editor">
          <Panel defaultSize={65} minSize={20} className="flex flex-col">
            <EditorToolbar
              language={language}
              onLanguageChange={(l) => setLanguage(scope, l)}
              onReset={() => clearCode(scope, language)}
            >
              <Button
                size="sm"
                variant="secondary"
                onClick={() => run("RUN")}
                disabled={runner.running}
                loading={runner.runningKind === "RUN"}
                title="Run sample tests (Ctrl+Enter)"
              >
                <Play /> Run
              </Button>
              <Button
                size="sm"
                onClick={() => run("SUBMIT")}
                disabled={runner.running}
                loading={runner.runningKind === "SUBMIT"}
              >
                <CloudUpload /> Submit
              </Button>
            </EditorToolbar>
            <div className="min-h-0 flex-1">
              <CodeEditor
                language={language}
                value={code}
                onChange={(value) => setCode(scope, language, value)}
                onRun={() => run("RUN")}
              />
            </div>
          </Panel>

          <ResizeHandle direction="vertical" />

          <Panel defaultSize={35} minSize={10} className="flex flex-col">
            <Tabs value={consoleTab} onValueChange={setConsoleTab} className="flex min-h-0 flex-1 flex-col">
              <div className="border-b px-2 py-1.5">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="testcases">Test cases</TabsTrigger>
                  <TabsTrigger value="result">Result</TabsTrigger>
                </TabsList>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <TabsContent value="testcases" className="grid gap-4">
                  {data.samples.map((sample, i) => (
                    <div key={i} className="grid gap-2">
                      <p className="text-xs font-semibold">Case {i + 1}</p>
                      <OutputBlock label="Input" value={sample.input} />
                      <OutputBlock label="Expected" value={sample.expectedOutput} />
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="result">
                  {runner.running ? (
                    <JudgingIndicator />
                  ) : runner.result ? (
                    <div className="grid gap-4">
                      <JudgeResultView submission={runner.result} />
                      {runner.result.verdict !== "ACCEPTED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="justify-self-start"
                          onClick={() => askAiWhy(runner.result!)}
                        >
                          <Sparkles /> Ask AI why
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Run your code to see results here.</p>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}
