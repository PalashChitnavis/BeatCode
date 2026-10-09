function parseIceServers(raw: string | undefined): RTCIceServer[] {
  const fallback = [{ urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] }];
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/** API origin; empty means same origin (the Vite dev proxy or a reverse proxy in front of both). */
const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const env = {
  apiUrl,
  apiBase: `${apiUrl}/api/v1`,
  iceServers: parseIceServers(import.meta.env.VITE_ICE_SERVERS),
};
