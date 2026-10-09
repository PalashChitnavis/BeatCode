/**
 * Generates starter code, judge drivers and stdin for function-style problems,
 * so every problem gets consistent signatures across all languages.
 */
import type { Language } from "@beatcode/shared";

export type ParamType = "int" | "int[]";

export interface Signature {
  fn: string;
  params: { name: string; type: ParamType }[];
  returns: "int";
}

export type Arg = number | number[];

export function formatStdin(signature: Signature, args: Arg[]): string {
  return (
    signature.params
      .map((param, i) => {
        const value = args[i];
        if (param.type === "int[]") {
          const arr = value as number[];
          return `${arr.length}\n${arr.join(" ")}`;
        }
        return String(value);
      })
      .join("\n") + "\n"
  );
}

export function formatDisplay(signature: Signature, args: Arg[]): string {
  return signature.params
    .map((param, i) => {
      const value = args[i];
      return `${param.name} = ${Array.isArray(value) ? `[${value.join(", ")}]` : value}`;
    })
    .join(", ");
}

const cParams = (s: Signature) =>
  s.params
    .map((p) => (p.type === "int[]" ? `int* ${p.name}, int ${p.name}Size` : `int ${p.name}`))
    .join(", ");
const cppParams = (s: Signature) =>
  s.params.map((p) => (p.type === "int[]" ? `vector<int>& ${p.name}` : `int ${p.name}`)).join(", ");
const javaParams = (s: Signature) =>
  s.params.map((p) => (p.type === "int[]" ? `int[] ${p.name}` : `int ${p.name}`)).join(", ");
const pyParams = (s: Signature) =>
  s.params.map((p) => `${p.name}: ${p.type === "int[]" ? "List[int]" : "int"}`).join(", ");

export function starterCode(language: Language, s: Signature): string {
  switch (language) {
    case "c":
      return `#include <stdio.h>\n#include <stdlib.h>\n\nint ${s.fn}(${cParams(s)}) {\n    \n}\n`;
    case "cpp":
      return `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ${s.fn}(${cppParams(s)}) {\n        \n    }\n};\n`;
    case "java":
      return `import java.util.*;\n\nclass Solution {\n    public int ${s.fn}(${javaParams(s)}) {\n        \n    }\n}\n`;
    case "python":
      return `from typing import List\n\nclass Solution:\n    def ${s.fn}(self, ${pyParams(s)}) -> int:\n        pass\n`;
  }
}

export function driverCode(language: Language, s: Signature): string {
  const names = s.params.map((p) => p.name);
  switch (language) {
    case "c": {
      const reads = s.params
        .map((p) =>
          p.type === "int[]"
            ? `    int ${p.name}Size = 0;\n    if (scanf("%d", &${p.name}Size) != 1) return 1;\n` +
              `    int* ${p.name} = (int*)malloc(sizeof(int) * (${p.name}Size > 0 ? ${p.name}Size : 1));\n` +
              `    for (int i = 0; i < ${p.name}Size; i++) if (scanf("%d", &${p.name}[i]) != 1) return 1;\n`
            : `    int ${p.name} = 0;\n    if (scanf("%d", &${p.name}) != 1) return 1;\n`,
        )
        .join("");
      const args = s.params.map((p) => (p.type === "int[]" ? `${p.name}, ${p.name}Size` : p.name)).join(", ");
      return `\n/* ---- BeatCode driver ---- */\n#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n${reads}    printf("%d\\n", ${s.fn}(${args}));\n    return 0;\n}\n`;
    }
    case "cpp": {
      const reads = s.params
        .map((p) =>
          p.type === "int[]"
            ? `    int ${p.name}Size = 0;\n    std::cin >> ${p.name}Size;\n    std::vector<int> ${p.name}(${p.name}Size);\n    for (int i = 0; i < ${p.name}Size; i++) std::cin >> ${p.name}[i];\n`
            : `    int ${p.name} = 0;\n    std::cin >> ${p.name};\n`,
        )
        .join("");
      return `\n// ---- BeatCode driver ----\n#include <iostream>\n#include <vector>\nint main() {\n    std::ios::sync_with_stdio(false);\n    std::cin.tie(nullptr);\n${reads}    Solution solution;\n    std::cout << solution.${s.fn}(${names.join(", ")}) << "\\n";\n    return 0;\n}\n`;
    }
    case "java": {
      const reads = s.params
        .map((p) =>
          p.type === "int[]"
            ? `        int ${p.name}Size = Integer.parseInt(__tokens[__pos++]);\n        int[] ${p.name} = new int[${p.name}Size];\n        for (int i = 0; i < ${p.name}Size; i++) ${p.name}[i] = Integer.parseInt(__tokens[__pos++]);\n`
            : `        int ${p.name} = Integer.parseInt(__tokens[__pos++]);\n`,
        )
        .join("");
      return `\n// ---- BeatCode driver ----\npublic class Main {\n    public static void main(String[] args) throws java.io.IOException {\n        String[] __tokens = new String(System.in.readAllBytes()).trim().split("\\\\s+");\n        int __pos = 0;\n${reads}        System.out.println(new Solution().${s.fn}(${names.join(", ")}));\n    }\n}\n`;
    }
    case "python": {
      const reads = s.params
        .map((p) =>
          p.type === "int[]"
            ? `${p.name} = [__next_int() for _ in range(__next_int())]\n`
            : `${p.name} = __next_int()\n`,
        )
        .join("");
      return `\n# ---- BeatCode driver ----\nimport sys as __sys\n__tokens = __sys.stdin.read().split()\n__pos = 0\n\n\ndef __next_int():\n    global __pos\n    value = int(__tokens[__pos])\n    __pos += 1\n    return value\n\n\n${reads}print(Solution().${s.fn}(${names.join(", ")}))\n`;
    }
  }
}
