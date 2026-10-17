import { describe, expect, it } from "vitest";
import type { JudgeJob } from "@beatcode/shared";
import { judge } from "../src/judge";

/** Requires Docker and the sandbox images: RUN_SANDBOX_TESTS=1 npm test */
const enabled = process.env.RUN_SANDBOX_TESTS === "1";

const playground = (language: JudgeJob["language"], source: string, stdin = ""): JudgeJob => ({
  submissionId: "test",
  kind: "PLAYGROUND",
  language,
  source,
  stdin,
  timeLimitMs: 2000,
  stopOnFirstFailure: true,
});

describe.runIf(enabled)("sandboxed judge", { timeout: 60_000 }, () => {
  it("runs C++ with stdin", async () => {
    const result = await judge(
      playground("cpp", "#include <iostream>\nint main(){int a,b;std::cin>>a>>b;std::cout<<a+b;}", "2 3"),
    );
    expect(result.verdict).toBe("ACCEPTED");
    expect(result.stdout).toBe("5");
  });

  it("runs Java and Python", async () => {
    const java = await judge(
      playground(
        "java",
        'public class Main { public static void main(String[] a) { System.out.println("hi"); } }',
      ),
    );
    expect(java.stdout?.trim()).toBe("hi");
    const python = await judge(playground("python", "print(input()[::-1])", "abc"));
    expect(python.stdout?.trim()).toBe("cba");
  });

  it("reports compile errors", async () => {
    const result = await judge(playground("c", "int main( { return 0; }"));
    expect(result.verdict).toBe("COMPILE_ERROR");
    expect(result.compileOutput).toContain("error");
  });

  it("stops infinite loops", async () => {
    const result = await judge(playground("python", "while True:\n    pass"));
    expect(result.verdict).toBe("TIME_LIMIT_EXCEEDED");
  });

  it("enforces the memory limit", async () => {
    const result = await judge(playground("python", "x = bytearray(600 * 1024 * 1024)"));
    expect(result.verdict).toBe("MEMORY_LIMIT_EXCEEDED");
  });

  it("has no network access", async () => {
    const result = await judge(
      playground("python", "import socket\nsocket.create_connection(('1.1.1.1', 80), timeout=2)"),
    );
    expect(result.verdict).toBe("RUNTIME_ERROR");
    expect(result.stderr).toMatch(/unreachable|Errno/i);
  });

  it("judges tests and stops at the first failure on submit", async () => {
    const result = await judge({
      submissionId: "test",
      kind: "SUBMIT",
      language: "python",
      source: "print(int(input()) * 2)",
      tests: [
        { input: "1\n", expectedOutput: "2", display: "1" },
        { input: "2\n", expectedOutput: "5", display: "2" },
        { input: "3\n", expectedOutput: "6", display: "3" },
      ],
      timeLimitMs: 2000,
      stopOnFirstFailure: true,
    });
    expect(result.verdict).toBe("WRONG_ANSWER");
    expect(result.passedCount).toBe(1);
    expect(result.testResults).toHaveLength(1);
    expect(result.testResults?.[0]).toMatchObject({ index: 1, expectedOutput: "5", actualOutput: "4\n" });
  });
});
