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
      hasVotedForThisEntry: false,
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

  let isParentOwner = false;
  let hasVotedForThisEntry = false;

  if (entryCode) {
    const { data: currentEntry } = await supabase
      .from("entries")
      .select("id, user_id")
      .eq("public_code", entryCode)
      .eq("contest_id", contestRow.id)
      .maybeSingle();

    if (currentEntry) {
      if (currentEntry.user_id && currentEntry.user_id === user.id) {
        isParentOwner = true;
      }

      // Option B: Check if this user has already cast a vote for THIS specific entry
      const { data: existingVote } = await supabase
        .from("votes")
        .select("id")
        .eq("entry_id", currentEntry.id)
        .eq("user_id", user.id)
        .in("status", ["valid", "quarantined"])
        .maybeSingle();

      hasVotedForThisEntry = Boolean(existingVote);
    }
  }

  return NextResponse.json({
    ok: true,
    isAuthenticated: true,
    userEmail: user.email,
    hasVotedForThisEntry,
    isParentOwner,
  });
}
