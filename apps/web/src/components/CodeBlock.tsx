import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import c from "react-syntax-highlighter/dist/esm/languages/prism/c";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Language } from "@beatcode/shared";

SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("python", python);

export function CodeBlock({ code, language }: { code: string; language: Language }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      customStyle={{ margin: 0, borderRadius: "0.5rem", fontSize: "0.8125rem", maxHeight: "28rem" }}
      codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
