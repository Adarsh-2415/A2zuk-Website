import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyModerationToken } from "@/lib/security/moderation-token";
import {
  sendParentEntryApprovedEmail,
  sendParentEntryRejectedEmail,
} from "@/lib/email/gmail";

const PENDING_PHOTO_BUCKET = "contest-photos-pending";
const PUBLIC_PHOTO_BUCKET = "contest-photos-public";

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

  const token = typeof body === "object" && body !== null && "token" in body
    ? String((body as { token: unknown }).token)
    : "";

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Missing moderation token." },
      { status: 400 },
    );
  }

  const payload = verifyModerationToken(token);
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        error: "This moderation link is invalid or has expired (valid for 7 days).",
      },
      { status: 401 },
    );
  }

  const { entryId, action } = payload;
  const admin = createAdminClient();

  // Fetch the current entry
  const { data: entry, error: entryError } = await admin
    .from("entries")
    .select("id, public_code, baby_name, status, pending_photo_path, contests!inner(slug)")
    .eq("id", entryId)
    .maybeSingle();

  if (entryError || !entry) {
    return NextResponse.json(
      { ok: false, error: "Contestant entry not found." },
      { status: 404 },
    );
  }

  const contestSlug = (entry.contests as { slug: string }).slug;

  // Fetch private guardian details to notify parent
  const { data: privateDetails } = await admin
    .from("entry_private_details")
    .select("guardian_name, guardian_email")
    .eq("entry_id", entry.id)
    .maybeSingle();

  // Idempotency: If already moderated to target state
  if (entry.status === "published" && action === "approve") {
    return NextResponse.json({
      ok: true,
      status: "published",
      alreadyProcessed: true,
      message: `${entry.baby_name}'s entry is already approved and live!`,
      publicUrl: `/contests/${contestSlug}/entries/${entry.public_code}`,
    });
  }

  if (entry.status === "rejected" && action === "reject") {
    return NextResponse.json({
      ok: true,
      status: "rejected",
      alreadyProcessed: true,
      message: `${entry.baby_name}'s entry was already rejected.`,
    });
  }

  // 1. APPROVE ACTION
  if (action === "approve") {
    // Copy photo from pending bucket to public bucket
    if (entry.pending_photo_path) {
      const { data: fileBlob, error: downloadError } = await admin.storage
        .from(PENDING_PHOTO_BUCKET)
        .download(entry.pending_photo_path);

      if (downloadError || !fileBlob) {
        console.error("[Moderate API] Error downloading pending photo:", downloadError);
        return NextResponse.json(
          { ok: false, error: "Failed to retrieve pending photo file from storage." },
          { status: 500 },
        );
      }

      const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());
      const contentType = fileBlob.type || "image/webp";

      const { error: uploadError } = await admin.storage
        .from(PUBLIC_PHOTO_BUCKET)
        .upload(entry.pending_photo_path, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error("[Moderate API] Error copying photo to public bucket:", uploadError);
        return NextResponse.json(
          { ok: false, error: "Failed to publish photo to public storage bucket." },
          { status: 500 },
        );
      }
    }

    // Update database record to 'published'
    const { error: updateError } = await admin
      .from("entries")
      .update({
        status: "published",
        public_photo_path: entry.pending_photo_path,
        photo_sync_status: "synced",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", entry.id);

    if (updateError) {
      console.error("[Moderate API] Error updating entry status:", updateError);
      return NextResponse.json(
        { ok: false, error: "Failed to update entry status in database." },
        { status: 500 },
      );
    }

    // Purge pending photo to clean up private storage
    if (entry.pending_photo_path) {
      await admin.storage
        .from(PENDING_PHOTO_BUCKET)
        .remove([entry.pending_photo_path]);
    }

    // Revalidate public pages so live photo and entry appear instantly
    revalidatePath("/");
    revalidatePath(`/contests/${contestSlug}`);
    revalidatePath(`/contests/${contestSlug}/entries/${entry.public_code}`);

    // Dispatch approval email to parent
    if (privateDetails?.guardian_email) {
      try {
        await sendParentEntryApprovedEmail({
          babyName: entry.baby_name,
          guardianName: privateDetails.guardian_name || "Parent",
          guardianEmail: privateDetails.guardian_email,
          contestSlug,
          publicCode: entry.public_code,
        });
      } catch (emailErr) {
        console.error(
          "[Moderate API] Failed to send parent approval email:",
          emailErr,
        );
      }
    }

    return NextResponse.json({
      ok: true,
      status: "published",
      message: `🎉 Success! ${entry.baby_name}'s photo is approved and now live on the contest leaderboard!`,
      publicUrl: `/contests/${contestSlug}/entries/${entry.public_code}`,
    });
  }

  // 2. REJECT ACTION
  if (action === "reject") {
    const { error: updateError } = await admin
      .from("entries")
      .update({
        status: "rejected",
        rejection_reason: "Rejected via 1-click email moderation",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", entry.id);

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: "Failed to update rejection status." },
        { status: 500 },
      );
    }

    // Remove pending photo
    if (entry.pending_photo_path) {
      await admin.storage
        .from(PENDING_PHOTO_BUCKET)
        .remove([entry.pending_photo_path]);
    }

    revalidatePath("/");
    revalidatePath(`/contests/${contestSlug}`);
    revalidatePath(`/contests/${contestSlug}/entries/${entry.public_code}`);

    // Dispatch rejection/revision email to parent
    if (privateDetails?.guardian_email) {
      try {
        await sendParentEntryRejectedEmail({
          babyName: entry.baby_name,
          guardianName: privateDetails.guardian_name || "Parent",
          guardianEmail: privateDetails.guardian_email,
          contestSlug,
          rejectionReason: "Quality or safety review guidelines",
        });
      } catch (emailErr) {
        console.error(
          "[Moderate API] Failed to send parent rejection email:",
          emailErr,
        );
      }
    }

    return NextResponse.json({
      ok: true,
      status: "rejected",
      message: `${entry.baby_name}'s entry has been marked as rejected.`,
    });
  }

  return NextResponse.json(
    { ok: false, error: "Invalid moderation action." },
    { status: 400 },
  );
}

