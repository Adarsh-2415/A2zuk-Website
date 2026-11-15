import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contestSlug = searchParams.get("contestSlug")?.trim() ?? "baby-photo-contest-1";
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
      hasVotedInContest: false,
      hasVotedForThisEntry: false,
      votedForEntryCode: null,
      votedForBabyName: null,
      isParentOwner: false,
    });
  }

  const supabase = createAdminClient();

  // Find contest id
  const { data: contestRow } = await supabase
    .from("contests")
    .select("id, status")
    .eq("slug", contestSlug)
    .maybeSingle();

  if (!contestRow) {
    return NextResponse.json(
      { ok: false, error: "Contest not found." },
      { status: 404 },
    );
  }

  // Check if the current user is the parent owner of this entry
  let isParentOwner = false;
  if (entryCode) {
    const { data: currentEntry } = await supabase
      .from("entries")
      .select("id, user_id")
      .eq("public_code", entryCode)
      .eq("contest_id", contestRow.id)
      .maybeSingle();

    if (currentEntry?.user_id && currentEntry.user_id === user.id) {
      isParentOwner = true;
    }
  }

  // Check if voter has cast their 1 official vote in this contest
  const { data: existingVote, error: voteError } = await supabase
    .from("votes")
    .select(
      `
      id,
      entry_id,
      entries!inner (
        public_code,
        baby_name
      )
    `,
    )
    .eq("contest_id", contestRow.id)
    .eq("user_id", user.id)
    .in("status", ["valid", "quarantined"])
    .maybeSingle();

  if (voteError) {
    console.error("[votes/status] Error querying votes:", voteError.message);
  }

  const hasVotedInContest = Boolean(existingVote);
  const typedEntry = existingVote?.entries as unknown as
    | { public_code: string; baby_name: string }
    | undefined;

  const votedForEntryCode = typedEntry?.public_code ?? null;
  const votedForBabyName = typedEntry?.baby_name ?? null;
  const hasVotedForThisEntry = Boolean(
    entryCode && votedForEntryCode && entryCode === votedForEntryCode,
  );

  return NextResponse.json({
    ok: true,
    isAuthenticated: true,
    userEmail: user.email,
    hasVotedInContest,
    hasVotedForThisEntry,
    votedForEntryCode,
    votedForBabyName,
    isParentOwner,
  });
}
