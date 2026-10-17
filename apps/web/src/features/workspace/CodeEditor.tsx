import Editor, { type OnMount } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import type { Language } from "@beatcode/shared";
import { Spinner } from "@/components/states";
import { resolveTheme, useSettings } from "@/features/settings/store";
import type { editor } from "monaco-editor";
import "./monaco";

type StandaloneEditor = editor.IStandaloneCodeEditor;

interface CodeEditorProps {
  language: Language;
  /** Omit for uncontrolled editors whose content is managed elsewhere (e.g. by Yjs). */
  value?: string;
  onChange?: (value: string) => void;
  onMount?: (editor: StandaloneEditor) => void;
  onRun?: () => void;
  readOnly?: boolean;
}

export function CodeEditor({ language, value, onChange, onMount, onRun, readOnly }: CodeEditorProps) {
  const { theme, fontSize, tabSize, wordWrap, minimap } = useSettings();
  const editorRef = useRef<StandaloneEditor | null>(null);
  const onRunRef = useRef(onRun);
  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  useEffect(() => {
    editorRef.current?.getModel()?.updateOptions({ tabSize, insertSpaces: true });
  }, [tabSize]);

  const handleMount: OnMount = (editor, monacoApi) => {
    editorRef.current = editor;
    editor.getModel()?.updateOptions({ tabSize, insertSpaces: true });
    // Ctrl/Cmd + Enter runs the code.
    editor.addCommand(monacoApi.KeyMod.CtrlCmd | monacoApi.KeyCode.Enter, () => onRunRef.current?.());
    onMount?.(editor);
  };

  return (
    <Editor
      language={language}
      value={value}
      onChange={(next) => onChange?.(next ?? "")}
      onMount={handleMount}
      theme={resolveTheme(theme) === "dark" ? "beatcode-dark" : "beatcode-light"}
      loading={<Spinner />}
      options={{
        fontSize,
        fontFamily: "'JetBrains Mono', monospace",
        fontLigatures: true,
        wordWrap: wordWrap ? "on" : "off",
        minimap: { enabled: minimap },
        readOnly,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 12 },
        renderLineHighlight: "line",
        smoothScrolling: true,
        tabSize,
      }}
    />
  );
}
