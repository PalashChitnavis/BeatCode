import type { NextFunction, Request, Response } from "express";
import { unauthorized } from "../lib/errors";
import { verifyAccessToken } from "../lib/jwt";

function bearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  return header?.startsWith("Bearer ") ? header.slice(7) : null;
}

/** Attaches req.user when a valid token is sent; rejects only if a token is present but invalid. */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = bearerToken(req);
  if (!token) return next();
  try {
    const claims = await verifyAccessToken(token);
    req.user = { id: claims.sub, name: claims.name };
    next();
  } catch {
    next(unauthorized("Session expired"));
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  await optionalAuth(req, res, (err?: unknown) => {
    if (err) return next(err);
    if (!req.user) return next(unauthorized());
    next();
  });
}

/** Narrows req.user inside handlers mounted behind requireAuth. */
export function currentUser(req: Request) {
  if (!req.user) throw unauthorized();
  return req.user;
}
