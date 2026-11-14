import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { cookies } from "next/headers";

export const VOTER_COOKIE_NAME = "a2zuk_vt";
const VOTER_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

function getVoteTokenSecret(): string {
  const secret = process.env.VOTE_TOKEN_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "VOTE_TOKEN_SECRET environment variable is missing or too short.",
    );
  }
  return secret;
}

function signVoterId(voterId: string): string {
  return createHmac("sha256", getVoteTokenSecret())
    .update(voterId)
    .digest("hex");
}

export function hashVoterToken(voterId: string): string {
  return createHmac("sha256", getVoteTokenSecret())
    .update(`voter_hash:${voterId}`)
    .digest("hex");
}

export function serializeSignedVoterCookie(voterId: string): string {
  return `${voterId}.${signVoterId(voterId)}`;
}

export function verifySignedVoterCookie(rawCookie?: string | null): string | null {
  if (!rawCookie) return null;
  const parts = rawCookie.split(".");
  if (parts.length !== 2) return null;

  const [voterId, providedSig] = parts;
  if (!voterId || !providedSig) return null;

  const expectedSig = signVoterId(voterId);
  const providedBuf = Buffer.from(providedSig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");

  if (providedBuf.length !== expectedBuf.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuf, expectedBuf)) {
    return null;
  }

  return voterId;
}

export function getIstDateString(date = new Date()): string {
  // Asia/Kolkata is UTC+05:30 with no DST
  const istMs = date.getTime() + 5.5 * 60 * 60 * 1000;
  return new Date(istMs).toISOString().slice(0, 10);
}

export function readVoterIdFromCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): string | null {
  const raw = cookieStore.get(VOTER_COOKIE_NAME)?.value;
  return verifySignedVoterCookie(raw);
}

export function createVoterCookieOptions() {
  return {
    name: VOTER_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: VOTER_COOKIE_MAX_AGE_SECONDS,
  };
}

export function issueNewVoterId(): string {
  return randomUUID();
}

