import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export interface ModerationTokenPayload {
  entryId: string;
  action: "approve" | "reject";
  exp: number; // Unix timestamp in seconds
}

function getModerationSecret(): string {
  const secret =
    process.env.MODERATION_SECRET ||
    process.env.VOTE_TOKEN_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret || secret.trim().length < 16) {
    throw new Error(
      "MODERATION_SECRET is not configured or is too short. Please set MODERATION_SECRET in your environment.",
    );
  }
  return secret.trim();
}

/**
 * Creates a tamper-proof HMAC-SHA256 signed token for 1-click email moderation.
 * Token format: base64url(payload) + "." + hex(hmac)
 * Valid for 7 days by default.
 */
export function createModerationToken(
  entryId: string,
  action: "approve" | "reject",
  expiresInSeconds = 7 * 24 * 60 * 60, // 7 days
): string {
  const secret = getModerationSecret();
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload: ModerationTokenPayload = { entryId, action, exp };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payloadB64).digest("hex");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed moderation token.
 * Returns the payload if signature is valid and token is unexpired; otherwise null.
 */
export function verifyModerationToken(token: string): ModerationTokenPayload | null {
  try {
    const secret = getModerationSecret();
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadB64, providedSigHex] = parts;
    const expectedSigHex = createHmac("sha256", secret).update(payloadB64).digest("hex");

    const providedBuf = Buffer.from(providedSigHex, "hex");
    const expectedBuf = Buffer.from(expectedSigHex, "hex");

    if (
      providedBuf.length !== expectedBuf.length ||
      !timingSafeEqual(providedBuf, expectedBuf)
    ) {
      return null;
    }

    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson) as ModerationTokenPayload;

    if (!payload.entryId || !["approve", "reject"].includes(payload.action)) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== "number" || payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

