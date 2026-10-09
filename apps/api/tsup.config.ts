import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  sourcemap: true,
  clean: true,
  // The shared workspace package ships TypeScript source, so it is bundled in.
  noExternal: ["@beatcode/shared"],
});
