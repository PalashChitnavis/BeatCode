import type { Language } from "@beatcode/shared";
import { config } from "./config";

export interface LanguageConfig {
  image: string;
  /** File the source is written to inside the sandbox. */
  file: string;
  compile?: string[];
  run: string[];
  /** Slower runtimes get proportionally more time per test. */
  timeMultiplier: number;
  memoryMb: number;
}

const image = (name: string) => `${config.IMAGE_PREFIX}-${name}`;

export const LANGUAGE_CONFIG: Record<Language, LanguageConfig> = {
  c: {
    image: image("cpp"),
    file: "main.c",
    compile: ["gcc", "-O2", "-std=c17", "-o", "main", "main.c", "-lm"],
    run: ["./main"],
    timeMultiplier: 1,
    memoryMb: 256,
  },
  cpp: {
    image: image("cpp"),
    file: "main.cpp",
    compile: ["g++", "-O2", "-std=c++17", "-o", "main", "main.cpp"],
    run: ["./main"],
    timeMultiplier: 1,
    memoryMb: 256,
  },
  java: {
    image: image("java"),
    file: "Main.java",
    compile: ["javac", "-J-Xmx256m", "-encoding", "UTF-8", "Main.java"],
    run: ["java", "-Xss64m", "-Xmx256m", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1", "-cp", ".", "Main"],
    timeMultiplier: 2,
    memoryMb: 512,
  },
  python: {
    image: image("python"),
    file: "main.py",
    run: ["python3", "main.py"],
    timeMultiplier: 3,
    memoryMb: 256,
  },
};
