import { defineConfig } from "prisma/config";

// The Prisma CLI does not read .env when a config file is present.
try {
  process.loadEnvFile();
} catch {
  // No .env file; rely on the real environment.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
