import { createHash } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../../config/env";
import { badRequest } from "../../lib/errors";
import { signOAuthState, verifyOAuthState } from "../../lib/jwt";
import { randomToken, safeEqual } from "../../lib/tokens";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const jwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export const redirectUri = () => `${env.API_ORIGIN}/api/v1/auth/google/callback`;

/** Builds the consent URL plus a signed cookie value holding state, PKCE verifier and return path. */
export async function createAuthorizationRequest(returnTo: string) {
  const state = randomToken(16);
  const verifier = randomToken(48);
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  const url = new URL(AUTH_URL);
  url.search = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  return { url: url.toString(), cookie: await signOAuthState({ state, verifier, returnTo }) };
}

export async function handleCallback(params: { code?: string; state?: string; cookie?: string }) {
  if (!params.code || !params.state || !params.cookie) throw badRequest("Invalid OAuth callback");

  const stored = await verifyOAuthState(params.cookie).catch(() => {
    throw badRequest("Sign-in request expired, please try again");
  });
  if (typeof stored.state !== "string" || !safeEqual(stored.state, params.state)) {
    throw badRequest("Invalid OAuth state");
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: params.code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri(),
      grant_type: "authorization_code",
      code_verifier: String(stored.verifier),
    }),
  });
  if (!response.ok) throw badRequest("Google sign-in failed");
  const { id_token: idToken } = (await response.json()) as { id_token?: string };
  if (!idToken) throw badRequest("Google sign-in failed");

  const { payload } = await jwtVerify(idToken, jwks, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: env.GOOGLE_CLIENT_ID,
  });
  if (!payload.email || payload.email_verified !== true) {
    throw badRequest("Your Google account email is not verified");
  }

  return {
    profile: {
      sub: payload.sub!,
      email: String(payload.email).toLowerCase(),
      name: String(payload.name ?? payload.email),
      picture: typeof payload.picture === "string" ? payload.picture : undefined,
    },
    returnTo: typeof stored.returnTo === "string" ? stored.returnTo : "/",
  };
}
