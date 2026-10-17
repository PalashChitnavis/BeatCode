import { defineConfig } from "tsup";

export default defineConfig({
  // The seed is bundled too so production images can seed without TypeScript tooling.
  entry: { server: "src/server.ts", seed: "prisma/seed.ts" },
  format: ["esm"],
  platform: "node",
  target: "node22",
  sourcemap: true,
  clean: true,
  // The shared workspace package ships TypeScript source, so it is bundled in.
  noExternal: ["@beatcode/shared"],
});
