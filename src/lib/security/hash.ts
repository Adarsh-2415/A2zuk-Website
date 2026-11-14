import "server-only";
import { createHmac } from "node:crypto";

function getIpHashSalt(): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt || salt.length < 16) {
    throw new Error("IP_HASH_SALT environment variable is missing or too short.");
  }
  return salt;
}

export function hashWithIpSalt(value: string): string {
  return createHmac("sha256", getIpHashSalt()).update(value).digest("hex");
}

export function extractClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

