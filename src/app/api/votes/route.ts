import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { extractClientIp, hashWithIpSalt } from "@/lib/security/hash";
import { getIstDateString } from "@/lib/security/voter-token";
import { castVoteSchema } from "@/lib/validation/vote";

const IP_DAILY_QUARANTINE_THRESHOLD = 25;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 },
    );
  }

  const parsed = castVoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message || "Invalid vote request.",
      },
      { status: 400 },
    );
  }

  // Check voter's verified Google account session
  let user: { id: string } | null = null;
  try {
    const userClient = await createClient();
    const { data } = await userClient.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        requiresAuth: true,
        error: "Please sign in with Google to cast your vote.",
      },
      { status: 401 },
    );
  }

  const { contestSlug, entryCode } = parsed.data;
  const supabase = createAdminClient();

  const { data: entryRow, error: entryError } = await supabase
    .from("entries")
    .select("id, status, user_id, contests!inner(slug, status)")
    .eq("public_code", entryCode)
    .eq("contests.slug", contestSlug)
    .eq("status", "published")
    .maybeSingle();

  if (entryError) {
    return NextResponse.json(
      { ok: false, error: "Unable to process vote right now." },
      { status: 500 },
    );
  }

  if (!entryRow) {
    return NextResponse.json(
      { ok: false, error: "Contestant entry not found or not open for voting." },
      { status: 404 },
    );
  }

  const clientIp = extractClientIp(request.headers);
  const ipHash = hashWithIpSalt(clientIp);
  const userAgent = request.headers.get("user-agent")?.trim() ?? "";
  const userAgentHash = userAgent ? hashWithIpSalt(userAgent) : null;
  const todayIst = getIstDateString();

  // Check IP-level daily velocity; high-volume IPs are quarantined for review
  const { count: ipVotesToday } = await supabase
    .from("votes")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("vote_date_ist", todayIst);

  const shouldQuarantine =
    (ipVotesToday ?? 0) >= IP_DAILY_QUARANTINE_THRESHOLD;

  const { data: rpcData, error: rpcError } = await supabase.rpc("cast_vote", {
    p_entry_id: entryRow.id,
    p_voter_token_hash: null,
    p_ip_hash: ipHash,
    p_user_agent_hash: userAgentHash,
    p_initial_status: shouldQuarantine ? "quarantined" : "valid",
    p_quarantine_reason: shouldQuarantine ? "ip_daily_velocity" : null,
    p_user_id: user.id,
  });

  if (rpcError || !rpcData || rpcData.length === 0) {
    const msg = rpcError?.message ?? "Unable to record vote.";
    let status = 400;
    if (
      msg.includes("already voted for this contestant") ||
      msg.includes("already cast your official vote") ||
      msg.includes("Already voted") ||
      msg.includes("idx_votes_unique_user_entry") ||
      msg.includes("idx_votes_unique_user_contest")
    ) {
      status = 409;
    } else if (msg.includes("Parents cannot vote")) {
      status = 403;
    } else if (msg.includes("Entry not found")) {
      status = 404;
    }

    return NextResponse.json({ ok: false, error: msg }, { status });
  }

  const voteResult = rpcData[0];

  revalidatePath(`/contests/${contestSlug}/entries/${entryCode}`);
  revalidatePath(`/contests/${contestSlug}`);
  revalidatePath("/");

  return NextResponse.json({
    ok: true,
    voteId: voteResult.vote_id,
    voteStatus: voteResult.vote_status,
    voteDateIst: voteResult.vote_date_ist,
    votesUsedToday: voteResult.votes_used_today,
    votesRemainingToday: voteResult.votes_remaining_today,
    newVoteCount: voteResult.new_vote_count,
  });
}

