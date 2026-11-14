import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAuthorizedCronRequest(request: Request): boolean {
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret || expectedSecret.length < 16) {
    return false;
  }

  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return false;
  }

  const provided = authHeader.slice("Bearer ".length).trim();
  const providedBuf = Buffer.from(provided, "utf8");
  const expectedBuf = Buffer.from(expectedSecret, "utf8");

  if (providedBuf.length !== expectedBuf.length) {
    return false;
  }

  return timingSafeEqual(providedBuf, expectedBuf);
}

async function handlePiiRetentionCron(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("run_pii_retention_purge", {
    p_rejected_days: 30,
    p_ended_days: 60,
  });

  if (error) {
    console.error("[cron/pii-retention] RPC failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "PII retention purge failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    purgedCount: data ?? 0,
  });
}

export async function GET(request: Request) {
  return handlePiiRetentionCron(request);
}

export async function POST(request: Request) {
  return handlePiiRetentionCron(request);
}

