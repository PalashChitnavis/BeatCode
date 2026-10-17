import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env";

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const stateSecret = new TextEncoder().encode(env.OAUTH_STATE_SECRET);
const ISSUER = "beatcode";

export interface AccessTokenClaims {
  sub: string;
  name: string;
}

export async function signAccessToken(claims: AccessTokenClaims): Promise<string> {
  return new SignJWT({ name: claims.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuer(ISSUER)
    .setAudience("beatcode:access")
    .setIssuedAt()
    .setExpirationTime(env.ACCESS_TOKEN_TTL)
    .sign(accessSecret);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenClaims> {
  const { payload } = await jwtVerify(token, accessSecret, {
    issuer: ISSUER,
    audience: "beatcode:access",
    algorithms: ["HS256"],
  });
  return { sub: payload.sub!, name: String(payload.name ?? "") };
}

/** Short-lived signed blob carrying OAuth state and the PKCE verifier between redirect and callback. */
export async function signOAuthState(data: Record<string, string>): Promise<string> {
  return new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience("beatcode:oauth")
    .setExpirationTime("10m")
    .sign(stateSecret);
}

export async function verifyOAuthState(token: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(token, stateSecret, { issuer: ISSUER, audience: "beatcode:oauth" });
  return payload;
}
