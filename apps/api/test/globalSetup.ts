import { execSync } from "node:child_process";

/** Applies migrations to the (dedicated) test database. Tests clean up their own rows. */
export default function setup() {
  const url = process.env.TEST_DATABASE_URL ?? "postgresql://beatcode:beatcode@localhost:5432/beatcode_test";
  execSync("npx prisma migrate deploy", { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
}
