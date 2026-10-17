import type { CookieOptions, Request, Response } from "express";
import { loginSchema, registerSchema, type AuthResponse } from "@beatcode/shared";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { notFound } from "../../lib/errors";
import { parseInput } from "../../lib/validation";
import { currentUser } from "../../middleware/auth";
import * as auth from "./auth.service";
import * as google from "./google";

const REFRESH_COOKIE = "bc_refresh";
const OAUTH_COOKIE = "bc_oauth";

const baseCookie = (): CookieOptions => ({
  httpOnly: true,
  secure: env.isProduction || env.COOKIE_SAMESITE === "none",
  sameSite: env.COOKIE_SAMESITE,
});

const meta = (req: Request): auth.ClientMeta => ({ userAgent: req.get("user-agent"), ip: req.ip });

function sendSession(res: Response, session: auth.IssuedSession, status = 200) {
  res.cookie(REFRESH_COOKIE, session.refreshToken, {
    ...baseCookie(),
    path: "/api/v1/auth",
    expires: session.refreshExpiresAt,
  });
  const body: AuthResponse = { accessToken: session.accessToken, user: session.user };
  res.status(status).json(body);
}

/** Only allow same-site relative paths so the callback cannot be used as an open redirect. */
const safeReturnTo = (value: unknown) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";

export async function register(req: Request, res: Response) {
  const input = parseInput(registerSchema, req.body);
  sendSession(res, await auth.register(input, meta(req)), 201);
}

export async function login(req: Request, res: Response) {
  const input = parseInput(loginSchema, req.body);
  sendSession(res, await auth.login(input, meta(req)));
}

export async function refresh(req: Request, res: Response) {
  try {
    sendSession(res, await auth.refresh(req.cookies?.[REFRESH_COOKIE], meta(req)));
  } catch (error) {
    res.clearCookie(REFRESH_COOKIE, { ...baseCookie(), path: "/api/v1/auth" });
    throw error;
  }
}

export async function logout(req: Request, res: Response) {
  await auth.logout(req.cookies?.[REFRESH_COOKIE]);
  res.clearCookie(REFRESH_COOKIE, { ...baseCookie(), path: "/api/v1/auth" });
  res.status(204).end();
}

export async function me(req: Request, res: Response) {
  res.json(await auth.getCurrentUser(currentUser(req).id));
}

export function providers(_req: Request, res: Response) {
  res.json({ google: env.googleEnabled });
}

export async function googleStart(req: Request, res: Response) {
  if (!env.googleEnabled) throw notFound("Google sign-in is not configured");
  const { url, cookie } = await google.createAuthorizationRequest(safeReturnTo(req.query.returnTo));
  res.cookie(OAUTH_COOKIE, cookie, {
    ...baseCookie(),
    // The callback is a top-level navigation from Google, so lax is sufficient.
    sameSite: "lax",
    path: "/api/v1/auth/google",
    maxAge: 10 * 60 * 1000,
  });
  res.redirect(url);
}

export async function googleCallback(req: Request, res: Response) {
  const callbackUrl = new URL("/auth/callback", env.WEB_ORIGIN);
  res.clearCookie(OAUTH_COOKIE, { ...baseCookie(), sameSite: "lax", path: "/api/v1/auth/google" });

  if (typeof req.query.error === "string") {
    callbackUrl.searchParams.set("error", "Google sign-in was cancelled");
    return res.redirect(callbackUrl.toString());
  }

  try {
    const { profile, returnTo } = await google.handleCallback({
      code: typeof req.query.code === "string" ? req.query.code : undefined,
      state: typeof req.query.state === "string" ? req.query.state : undefined,
      cookie: req.cookies?.[OAUTH_COOKIE],
    });
    const session = await auth.signInWithGoogle(profile, meta(req));
    res.cookie(REFRESH_COOKIE, session.refreshToken, {
      ...baseCookie(),
      path: "/api/v1/auth",
      expires: session.refreshExpiresAt,
    });
    callbackUrl.searchParams.set("returnTo", safeReturnTo(returnTo));
  } catch (error) {
    logger.warn({ err: error }, "google sign-in failed");
    callbackUrl.searchParams.set("error", "Google sign-in failed, please try again");
  }
  res.redirect(callbackUrl.toString());
}
