import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anon = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const runTag = `test-${randomBytes(4).toString("hex")}`;
const createdEntryIds = [];
const uploadedPendingPaths = [];

async function runTests() {
  console.log(`\nStarting live Supabase verification (${runTag})...\n`);

  // ---------------------------------------------------------------------------
  // Test 1: Atomic submit_entry RPC & validation
  // ---------------------------------------------------------------------------
  const pendingPath = `baby-photo-contest-1/${runTag}-pending.webp`;
  const { data: submitOk, error: submitOkErr } = await admin.rpc(
    "submit_entry",
    {
      p_contest_slug: "baby-photo-contest-1",
      p_public_code: `${runTag}-pending`,
      p_baby_name: "Test Pending Baby",
      p_age_category: "under-6-months",
      p_city: "",
      p_state: "",
      p_caption: "",
      p_pending_photo_path: pendingPath,
      p_guardian_name: "Test Guardian",
      p_guardian_email: "guardian@example.com",
      p_guardian_phone: "9876543210",
      p_child_dob: "2026-08-01",
      p_consent_guardian: true,
      p_consent_sharing: true,
      p_consent_rules: true,
      p_consent_ip_hash: `${runTag}_ip_hash`,
    },
  );
  assert.ifError(submitOkErr);
  assert.equal(submitOk?.length, 1, "submit_entry should return 1 row");
  const pendingEntryId = submitOk[0].entry_id;
  createdEntryIds.push(pendingEntryId);
  assert.equal(submitOk[0].status, "pending");

  // Inactive/upcoming contest must reject
  const { error: upcomingErr } = await admin.rpc("submit_entry", {
    p_contest_slug: "toddler-play-giggles",
    p_public_code: `${runTag}-upcoming`,
    p_baby_name: "Test Upcoming",
    p_age_category: "under-12-months",
    p_city: "",
    p_state: "",
    p_caption: "",
    p_pending_photo_path: pendingPath,
    p_guardian_name: "Test Guardian",
    p_guardian_email: "guardian@example.com",
    p_guardian_phone: "9876543210",
    p_child_dob: "2026-01-01",
    p_consent_guardian: true,
    p_consent_sharing: true,
    p_consent_rules: true,
    p_consent_ip_hash: `${runTag}_ip_hash`,
  });
  assert.ok(upcomingErr, "submit_entry must reject upcoming contests");

  // Missing consent must reject
  const { error: consentErr } = await admin.rpc("submit_entry", {
    p_contest_slug: "baby-photo-contest-1",
    p_public_code: `${runTag}-noconsent`,
    p_baby_name: "Test No Consent",
    p_age_category: "under-6-months",
    p_city: "",
    p_state: "",
    p_caption: "",
    p_pending_photo_path: pendingPath,
    p_guardian_name: "Test Guardian",
    p_guardian_email: "guardian@example.com",
    p_guardian_phone: "9876543210",
    p_child_dob: "2026-08-01",
    p_consent_guardian: false,
    p_consent_sharing: true,
    p_consent_rules: true,
    p_consent_ip_hash: `${runTag}_ip_hash`,
  });
  assert.ok(consentErr, "submit_entry must reject missing guardian consent");
  console.log("✓ Test 1 passed: submit_entry atomic RPC & validation");

  // ---------------------------------------------------------------------------
  // Test 2: Storage bucket isolation
  // ---------------------------------------------------------------------------
  // 1x1 WebP valid binary
  const tinyWebp = Buffer.from(
    "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",
    "base64",
  );
  const { error: uploadErr } = await admin.storage
    .from("contest-photos-pending")
    .upload(pendingPath, tinyWebp, { contentType: "image/webp", upsert: false });
  assert.ifError(uploadErr);
  uploadedPendingPaths.push(pendingPath);

  const { data: anonDownload, error: anonDownloadErr } = await anon.storage
    .from("contest-photos-pending")
    .download(pendingPath);
  assert.ok(
    anonDownloadErr && !anonDownload,
    "anon must NOT be able to download from contest-photos-pending",
  );
  console.log("✓ Test 2 passed: contest-photos-pending isolated from anon");

  // ---------------------------------------------------------------------------
  // Test 3: trg_guard_entries_vote_count tamper protection
  // ---------------------------------------------------------------------------
  const { error: tamperErr } = await admin
    .from("entries")
    .update({ vote_count: 999 })
    .eq("id", pendingEntryId);
  assert.ok(
    tamperErr &&
      tamperErr.message.includes("Direct modification of entries.vote_count"),
    "Direct UPDATE of entries.vote_count must be blocked by trigger",
  );
  console.log("✓ Test 3 passed: trg_guard_entries_vote_count blocks tampering");

  // ---------------------------------------------------------------------------
  // Test 4: cast_vote 5-vote daily IST limit, duplicate guard & concurrency lock
  // ---------------------------------------------------------------------------
  const publishedIds = [];
  for (let i = 1; i <= 6; i += 1) {
    const { data: row, error: insErr } = await admin
      .from("entries")
      .insert({
        contest_id: "contest-001",
        public_code: `${runTag}-pub-${i}`,
        baby_name: `Test Star ${i}`,
        age_category: "under-6-months",
        city: "",
        state: "",
        caption: "",
        pending_photo_path: pendingPath,
        status: "published",
      })
      .select("id")
      .single();
    assert.ifError(insErr);
    publishedIds.push(row.id);
    createdEntryIds.push(row.id);
  }

  const voterHashA = `${runTag}_voter_a`;
  const { data: vote1, error: vote1Err } = await admin.rpc("cast_vote", {
    p_entry_id: publishedIds[0],
    p_voter_token_hash: voterHashA,
    p_ip_hash: `${runTag}_ip_a`,
    p_user_agent_hash: null,
    p_initial_status: "valid",
    p_quarantine_reason: null,
  });
  assert.ifError(vote1Err);
  assert.equal(vote1[0].new_vote_count, 1);

  // Duplicate vote on same entry today must fail
  const { error: dupVoteErr } = await admin.rpc("cast_vote", {
    p_entry_id: publishedIds[0],
    p_voter_token_hash: voterHashA,
    p_ip_hash: `${runTag}_ip_a`,
    p_user_agent_hash: null,
    p_initial_status: "valid",
    p_quarantine_reason: null,
  });
  assert.ok(
    dupVoteErr && dupVoteErr.message.includes("Already voted"),
    "Duplicate vote on same entry today must fail",
  );

  // Concurrency test: 6 simultaneous votes for a fresh voter across 6 entries -> max 5 succeed
  const voterHashB = `${runTag}_voter_b`;
  const raceResults = await Promise.all(
    publishedIds.map((entryId) =>
      admin.rpc("cast_vote", {
        p_entry_id: entryId,
        p_voter_token_hash: voterHashB,
        p_ip_hash: `${runTag}_ip_b`,
        p_user_agent_hash: null,
        p_initial_status: "valid",
        p_quarantine_reason: null,
      }),
    ),
  );
  const succeeded = raceResults.filter((r) => !r.error);
  const rejected = raceResults.filter((r) => Boolean(r.error));
  assert.equal(succeeded.length, 5, "Exactly 5 concurrent votes must succeed");
  assert.equal(rejected.length, 1, "6th concurrent vote must be rejected");
  assert.ok(
    rejected[0].error.message.includes("Daily limit of 5 votes"),
    "6th concurrent vote must fail with daily limit error",
  );

  // Quarantined vote must NOT increment entries.vote_count
  const { data: beforeQuarantine } = await admin
    .from("entries")
    .select("vote_count")
    .eq("id", publishedIds[5])
    .single();
  const { data: qRes, error: qErr } = await admin.rpc("cast_vote", {
    p_entry_id: publishedIds[5],
    p_voter_token_hash: `${runTag}_voter_q`,
    p_ip_hash: `${runTag}_ip_q`,
    p_user_agent_hash: null,
    p_initial_status: "quarantined",
    p_quarantine_reason: "test_quarantine",
  });
  assert.ifError(qErr);
  assert.equal(qRes[0].vote_status, "quarantined");
  assert.equal(qRes[0].new_vote_count, beforeQuarantine.vote_count);
  console.log(
    "✓ Test 4 passed: cast_vote 5-vote IST limit, concurrency lock, duplicate & quarantine guards",
  );

  // ---------------------------------------------------------------------------
  // Test 5: RLS & RPC permission isolation for anon role
  // ---------------------------------------------------------------------------
  for (const table of [
    "entry_private_details",
    "votes",
    "admin_profiles",
    "audit_logs",
    "entry_reports",
  ]) {
    const { data } = await anon.from(table).select("*").limit(5);
    assert.equal(
      data?.length ?? 0,
      0,
      `anon must read 0 rows from ${table}`,
    );
  }

  // Pending entry must be invisible to anon
  const { data: anonPending } = await anon
    .from("entries")
    .select("id")
    .eq("id", pendingEntryId);
  assert.equal(
    anonPending?.length ?? 0,
    0,
    "anon must NOT see pending entries",
  );

  // Restricted RPCs must be denied to anon
  const { error: anonRpcErr } = await anon.rpc("cast_vote", {
    p_entry_id: publishedIds[0],
    p_voter_token_hash: "x",
    p_ip_hash: "y",
  });
  assert.ok(anonRpcErr, "anon must NOT be allowed to execute cast_vote");
  console.log("✓ Test 5 passed: RLS & RPC permission isolation for anon");

  // ---------------------------------------------------------------------------
  // Test 6: purge_entry_pii & run_pii_retention_purge
  // ---------------------------------------------------------------------------
  const { data: purgedOk, error: purgeErr } = await admin.rpc(
    "purge_entry_pii",
    {
      p_entry_id: pendingEntryId,
      p_reason: "test_verification_purge",
      p_admin_id: null,
    },
  );
  assert.ifError(purgeErr);
  assert.equal(purgedOk, true, "purge_entry_pii should return true");

  const { data: purgedRow, error: purgedReadErr } = await admin
    .from("entry_private_details")
    .select("*")
    .eq("entry_id", pendingEntryId)
    .single();
  assert.ifError(purgedReadErr);
  assert.equal(purgedRow.guardian_name, null);
  assert.equal(purgedRow.guardian_email, null);
  assert.equal(purgedRow.guardian_phone, null);
  assert.equal(purgedRow.child_dob, null);
  assert.ok(purgedRow.purged_at, "purged_at must be populated");
  assert.equal(purgedRow.consent_guardian, true);
  assert.equal(purgedRow.consent_sharing, true);
  assert.equal(purgedRow.consent_rules, true);

  const { data: batchCount, error: batchErr } = await admin.rpc(
    "run_pii_retention_purge",
    { p_rejected_days: 30, p_ended_days: 60 },
  );
  assert.ifError(batchErr);
  assert.equal(typeof batchCount, "number");
  console.log("✓ Test 6 passed: purge_entry_pii & run_pii_retention_purge");
}

try {
  await runTests();
  console.log("\nALL LIVE DATABASE & SECURITY CHECKS PASSED!\n");
} finally {
  console.log("Cleaning up test fixtures...");
  if (uploadedPendingPaths.length > 0) {
    await admin.storage
      .from("contest-photos-pending")
      .remove(uploadedPendingPaths);
  }
  if (createdEntryIds.length > 0) {
    await admin
      .from("audit_logs")
      .delete()
      .in("target_id", createdEntryIds);
    await admin.from("votes").delete().in("entry_id", createdEntryIds);
    await admin
      .from("entry_private_details")
      .delete()
      .in("entry_id", createdEntryIds);
    await admin.from("entries").delete().in("id", createdEntryIds);
  }
  console.log("Cleanup complete.");
}

