process.env.NODE_ENV = "test";
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? "postgresql://beatcode:beatcode@localhost:5432/beatcode_test";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.WEB_ORIGIN = "http://localhost:5173";
process.env.API_ORIGIN = "http://localhost:4000";
process.env.JWT_ACCESS_SECRET = "test-access-secret-that-is-long-enough-123";
process.env.OAUTH_STATE_SECRET = "test-oauth-secret-that-is-long-enough-1234";
