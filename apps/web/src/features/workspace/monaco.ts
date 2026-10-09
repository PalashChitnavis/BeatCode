import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

// Bundle Monaco locally instead of loading it from a CDN. Only the core editor worker is
// needed because C, C++, Java and Python use Monaco's built-in syntax highlighting.
self.MonacoEnvironment = { getWorker: () => new EditorWorker() };
loader.config({ monaco });

monaco.editor.defineTheme("beatcode-dark", {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: { "editor.background": "#1d1f25", "editorGutter.background": "#1d1f25" },
});
monaco.editor.defineTheme("beatcode-light", {
  base: "vs",
  inherit: true,
  rules: [],
  colors: { "editor.background": "#ffffff" },
});

export { monaco };
