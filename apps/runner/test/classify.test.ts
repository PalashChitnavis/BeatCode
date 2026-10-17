import { describe, expect, it } from "vitest";
import { normalizeOutput } from "@beatcode/shared";
import { classifyRun } from "../src/judge";
import type { ProcessResult } from "../src/process";

const result = (overrides: Partial<ProcessResult>): ProcessResult => ({
  exitCode: 0,
  stdout: "",
  stderr: "",
  durationMs: 10,
  timedOut: false,
  outputLimitExceeded: false,
  ...overrides,
});

describe("classifyRun", () => {
  it("accepts a clean exit", () => {
    expect(classifyRun(result({}), 1000)).toBeNull();
  });

  it("reports a time limit when the run hits the limit", () => {
    expect(classifyRun(result({ exitCode: 137, durationMs: 1050 }), 1000)?.verdict).toBe(
      "TIME_LIMIT_EXCEEDED",
    );
    expect(classifyRun(result({ timedOut: true }), 1000)?.verdict).toBe("TIME_LIMIT_EXCEEDED");
  });

  it("treats an early SIGKILL as running out of memory", () => {
    expect(classifyRun(result({ exitCode: 137, durationMs: 200 }), 1000)?.verdict).toBe(
      "MEMORY_LIMIT_EXCEEDED",
    );
  });

  it("recognises language-level out of memory errors", () => {
    const run = result({ exitCode: 1, stderr: "java.lang.OutOfMemoryError: Java heap space" });
    expect(classifyRun(run, 1000)?.verdict).toBe("MEMORY_LIMIT_EXCEEDED");
  });

  it("reports runtime errors and output floods", () => {
    expect(classifyRun(result({ exitCode: 1 }), 1000)?.verdict).toBe("RUNTIME_ERROR");
    expect(classifyRun(result({ outputLimitExceeded: true, exitCode: 137 }), 1000)).toEqual({
      verdict: "RUNTIME_ERROR",
      message: "Output limit exceeded",
    });
  });
});

describe("normalizeOutput", () => {
  it("ignores trailing whitespace and CRLF line endings", () => {
    expect(normalizeOutput("1 2 \r\n3\n\n")).toBe(normalizeOutput("1 2\n3"));
  });

  it("keeps meaningful differences", () => {
    expect(normalizeOutput("12")).not.toBe(normalizeOutput("1 2"));
  });
});
