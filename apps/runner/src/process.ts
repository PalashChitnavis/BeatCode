import { spawn } from "node:child_process";

export interface ProcessResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  durationMs: number;
  /** Killed by the host-side watchdog. */
  timedOut: boolean;
  /** stdout exceeded the capture limit and the process was killed. */
  outputLimitExceeded: boolean;
}

export interface RunOptions {
  stdin?: string;
  timeoutMs: number;
  maxStdoutBytes?: number;
  maxStderrBytes?: number;
}

/** Spawns a process with argument arrays (no shell), bounded output and a hard timeout. */
export function runProcess(command: string, args: string[], options: RunOptions): Promise<ProcessResult> {
  const maxStdout = options.maxStdoutBytes ?? 64 * 1024;
  const maxStderr = options.maxStderrBytes ?? 16 * 1024;

  return new Promise((resolve, reject) => {
    const started = performance.now();
    const child = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let timedOut = false;
    let outputLimitExceeded = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, options.timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      if (stdoutBytes + chunk.length > maxStdout) {
        stdout.push(chunk.subarray(0, maxStdout - stdoutBytes));
        stdoutBytes = maxStdout;
        if (!outputLimitExceeded) {
          outputLimitExceeded = true;
          child.kill("SIGKILL");
        }
        return;
      }
      stdout.push(chunk);
      stdoutBytes += chunk.length;
    });
    child.stderr.on("data", (chunk: Buffer) => {
      if (stderrBytes >= maxStderr) return;
      stderr.push(chunk.subarray(0, maxStderr - stderrBytes));
      stderrBytes += Math.min(chunk.length, maxStderr - stderrBytes);
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({
        exitCode,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
        durationMs: Math.round(performance.now() - started),
        timedOut,
        outputLimitExceeded,
      });
    });

    // The program may exit without reading its input; that is not an error.
    child.stdin.on("error", () => {});
    child.stdin.end(options.stdin ?? "");
  });
}
