import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getIstDateString } from "@/lib/security/voter-token";

const DAILY_VOTE_LIMIT = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contestSlug = searchParams.get("contestSlug")?.trim() ?? "";
  const entryCode = searchParams.get("entryCode")?.trim() ?? "";

  // Check if voter is authenticated with Google
  let user: { id: string; email?: string } | null = null;
  try {
    const userClient = await createClient();
    const { data } = await userClient.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  if (!user) {
    return NextResponse.json({
      ok: true,
      isAuthenticated: false,
      votesUsedToday: 0,
      votesRemainingToday: DAILY_VOTE_LIMIT,
      hasVotedForEntry: false,
      dailyLimit: DAILY_VOTE_LIMIT,
    });
  }

  const supabase = createAdminClient();
  const todayIst = getIstDateString();

  const { data: todayVotes, error } = await supabase
    .from("votes")
    .select("entry_id")
    .eq("user_id", user.id)
    .eq("vote_date_ist", todayIst)
    .in("status", ["valid", "quarantined"]);

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Unable to check voting status." },
      { status: 500 },
    );
  }

  const votesUsedToday = todayVotes?.length ?? 0;
  let hasVotedForEntry = false;

  if (contestSlug && entryCode && votesUsedToday > 0) {
    const { data: entryRow } = await supabase
      .from("entries")
      .select("id, contests!inner(slug)")
      .eq("public_code", entryCode)
      .eq("contests.slug", contestSlug)
      .eq("status", "published")
      .maybeSingle();

    if (entryRow) {
      hasVotedForEntry = (todayVotes ?? []).some(
        (v) => v.entry_id === entryRow.id,
      );
    }
  }

  return NextResponse.json({
    ok: true,
    isAuthenticated: true,
    userEmail: user.email,
    votesUsedToday,
    votesRemainingToday: Math.max(0, DAILY_VOTE_LIMIT - votesUsedToday),
    hasVotedForEntry,
    dailyLimit: DAILY_VOTE_LIMIT,
  });
}

