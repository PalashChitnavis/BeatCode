import { randomUUID } from "node:crypto";
import { config, logger } from "./config";
import type { LanguageConfig } from "./languages";
import { runProcess, type ProcessResult, type RunOptions } from "./process";

/** Upper bound on a sandbox's lifetime; it removes itself even if the runner crashes. */
const MAX_LIFETIME_SECONDS = 300;

/**
 * A throwaway container with no network, a read-only root filesystem, a small tmpfs
 * work directory, a non-root user, no capabilities and memory/CPU/process limits.
 */
export class Sandbox {
  private constructor(readonly name: string) {}

  static async create(language: LanguageConfig): Promise<Sandbox> {
    const name = `bc-sandbox-${randomUUID()}`;
    const memory = `${language.memoryMb}m`;
    const result = await runProcess(
      config.DOCKER_BIN,
      [
        "run",
        "--detach",
        "--rm",
        "--name",
        name,
        "--label",
        "beatcode.sandbox=1",
        "--network",
        "none",
        "--read-only",
        "--tmpfs",
        "/work:rw,exec,nosuid,size=64m,mode=1777",
        "--tmpfs",
        "/tmp:rw,exec,nosuid,size=64m,mode=1777",
        "--memory",
        memory,
        "--memory-swap",
        memory,
        "--cpus",
        "1",
        "--pids-limit",
        "128",
        "--cap-drop",
        "ALL",
        "--security-opt",
        "no-new-privileges",
        "--user",
        "10001:10001",
        "--workdir",
        "/work",
        language.image,
        "sleep",
        String(MAX_LIFETIME_SECONDS),
      ],
      { timeoutMs: 30_000 },
    );
    if (result.exitCode !== 0) {
      throw new Error(`failed to start sandbox: ${result.stderr.trim() || "unknown error"}`);
    }
    return new Sandbox(name);
  }

  async writeFile(fileName: string, content: string): Promise<void> {
    // fileName comes from LANGUAGE_CONFIG, never from user input.
    const result = await runProcess(
      config.DOCKER_BIN,
      ["exec", "-i", this.name, "sh", "-c", `cat > /work/${fileName}`],
      { stdin: content, timeoutMs: 10_000 },
    );
    if (result.exitCode !== 0) throw new Error(`failed to write ${fileName}: ${result.stderr.trim()}`);
  }

  /** Runs a command inside the sandbox; `timeout` inside the container enforces the limit. */
  exec(command: string[], options: RunOptions): Promise<ProcessResult> {
    const seconds = Math.max(1, Math.ceil(options.timeoutMs / 1000));
    return runProcess(
      config.DOCKER_BIN,
      ["exec", "-i", this.name, "timeout", "-s", "KILL", String(seconds), ...command],
      // Host-side watchdog in case docker itself hangs.
      { ...options, timeoutMs: seconds * 1000 + 5000 },
    );
  }

  async destroy(): Promise<void> {
    try {
      await runProcess(config.DOCKER_BIN, ["rm", "--force", this.name], { timeoutMs: 15_000 });
    } catch (error) {
      logger.warn({ err: error, name: this.name }, "failed to remove sandbox");
    }
  }
}

export async function checkImages(images: string[]) {
  for (const image of new Set(images)) {
    const result = await runProcess(config.DOCKER_BIN, ["image", "inspect", image], { timeoutMs: 10_000 });
    if (result.exitCode !== 0) {
      logger.warn(`sandbox image "${image}" is missing; build it with "npm run images:build"`);
    }
  }
}
