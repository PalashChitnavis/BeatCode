import type { User } from "@prisma/client";
import type { LoginInput, RegisterInput } from "@beatcode/shared";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";
import { logger } from "../../config/logger";
import { conflict, unauthorized } from "../../lib/errors";
import { signAccessToken } from "../../lib/jwt";
import { hashPassword, verifyPassword } from "../../lib/password";
import { randomToken, safeEqual, sha256 } from "../../lib/tokens";
import { toUserDTO } from "../../lib/dto";

export interface ClientMeta {
  userAgent?: string;
  ip?: string;
}

export interface IssuedSession {
  accessToken: string;
  /** Opaque "<sessionId>.<secret>" value; only its hash is stored. */
  refreshToken: string;
  refreshExpiresAt: Date;
  user: ReturnType<typeof toUserDTO>;
}

const refreshTtlMs = () => env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

async function issueSession(user: User, meta: ClientMeta): Promise<IssuedSession> {
  const secret = randomToken();
  const expiresAt = new Date(Date.now() + refreshTtlMs());
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: sha256(secret),
      userAgent: meta.userAgent?.slice(0, 255),
      ip: meta.ip,
      expiresAt,
    },
  });
  return {
    accessToken: await signAccessToken({ sub: user.id, name: user.name }),
    refreshToken: `${session.id}.${secret}`,
    refreshExpiresAt: expiresAt,
    user: toUserDTO(user),
  };
}

export async function register(input: RegisterInput, meta: ClientMeta) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw conflict(
      existing.passwordHash
        ? "An account with this email already exists"
        : "This email is registered with Google. Sign in with Google instead.",
    );
  }
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash: await hashPassword(input.password) },
  });
  return issueSession(user, meta);
}

export async function login(input: LoginInput, meta: ClientMeta) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  // Same message whether the email or the password is wrong, to avoid account enumeration.
  if (!user?.passwordHash || !(await verifyPassword(input.password, user.passwordHash))) {
    throw unauthorized("Invalid email or password");
  }
  return issueSession(user, meta);
}

function parseRefreshToken(raw: string | undefined) {
  const [sessionId, secret] = raw?.split(".") ?? [];
  return sessionId && secret ? { sessionId, secret } : null;
}

/**
 * Rotates the refresh token. Presenting an already-rotated token means it was copied,
 * so every session of that user is revoked.
 */
export async function refresh(raw: string | undefined, meta: ClientMeta) {
  const parsed = parseRefreshToken(raw);
  if (!parsed) throw unauthorized("No active session");

  const session = await prisma.session.findUnique({
    where: { id: parsed.sessionId },
    include: { user: true },
  });
  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    throw unauthorized("Session expired");
  }
  if (!safeEqual(session.tokenHash, sha256(parsed.secret))) {
    logger.warn({ userId: session.userId }, "refresh token reuse detected; revoking all sessions");
    await prisma.session.updateMany({
      where: { userId: session.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw unauthorized("Session expired");
  }

  const secret = randomToken();
  const expiresAt = new Date(Date.now() + refreshTtlMs());
  await prisma.session.update({
    where: { id: session.id },
    data: { tokenHash: sha256(secret), expiresAt, lastUsedAt: new Date(), ip: meta.ip },
  });
  return {
    accessToken: await signAccessToken({ sub: session.user.id, name: session.user.name }),
    refreshToken: `${session.id}.${secret}`,
    refreshExpiresAt: expiresAt,
    user: toUserDTO(session.user),
  } satisfies IssuedSession;
}

export async function logout(raw: string | undefined) {
  const parsed = parseRefreshToken(raw);
  if (!parsed) return;
  await prisma.session.updateMany({
    where: { id: parsed.sessionId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw unauthorized();
  return toUserDTO(user);
}

/** Finds or creates the user for a verified Google identity. */
export async function signInWithGoogle(
  profile: { sub: string; email: string; name: string; picture?: string },
  meta: ClientMeta,
) {
  const account = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider: "GOOGLE", providerAccountId: profile.sub } },
    include: { user: true },
  });
  if (account) return issueSession(account.user, meta);

  // Google has verified the email, so it is safe to link it to an existing account.
  const user = await prisma.user.upsert({
    where: { email: profile.email },
    create: {
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.picture,
      accounts: { create: { provider: "GOOGLE", providerAccountId: profile.sub } },
    },
    update: {
      avatarUrl: profile.picture,
      accounts: { create: { provider: "GOOGLE", providerAccountId: profile.sub } },
    },
  });
  return issueSession(user, meta);
}
