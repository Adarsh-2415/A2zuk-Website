import { randomBytes, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { extractClientIp, hashWithIpSalt } from "@/lib/security/hash";
import { sendModerationAlertEmail } from "@/lib/email/gmail";
import {
  PhotoProcessingError,
  sanitizeSubmissionPhoto,
} from "@/lib/media/photo-processor";
import { submissionSchema } from "@/lib/validation/submission";

const PENDING_PHOTO_BUCKET = "contest-photos-pending";
const MAX_SUBMISSIONS_PER_IP_PER_HOUR = 5;

function buildPublicCode(displayName: string): string {
  const base = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  const suffix = randomBytes(2).toString("hex");
  return `${base || "entry"}-${suffix}`;
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid multipart form submission." },
      { status: 400 },
    );
  }

  const rawPayload = {
    contestSlug: String(formData.get("contestSlug") ?? ""),
    guardianName: String(formData.get("guardianName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    childDisplayName: String(formData.get("childDisplayName") ?? ""),
    childDateOfBirth: String(formData.get("childDateOfBirth") ?? ""),
    ageCategory: String(formData.get("ageCategory") ?? ""),
    consentGuardian: formData.get("consentGuardian") === "true",
    consentSharing: formData.get("consentSharing") === "true",
    consentRules: formData.get("consentRules") === "true",
  };

  const parsed = submissionSchema.safeParse(rawPayload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        error: firstIssue?.message || "Please check all required form fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const photoEntry = formData.get("photo");
  if (!(photoEntry instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Please upload a photo of your child." },
      { status: 400 },
    );
  }

  let sanitizedPhoto;
  try {
    const rawBuffer = Buffer.from(await photoEntry.arrayBuffer());
    sanitizedPhoto = await sanitizeSubmissionPhoto(rawBuffer);
  } catch (err) {
    if (err instanceof PhotoProcessingError) {
      return NextResponse.json(
        { ok: false, error: err.message, code: err.code },
        { status: err.statusCode },
      );
    }
    return NextResponse.json(
      { ok: false, error: "Unable to process uploaded photo." },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const clientIp = extractClientIp(request.headers);
  const consentIpHash = hashWithIpSalt(clientIp);

  // Optional: link entry to verified parent Google account if signed in
  let authUserId: string | null = null;
  try {
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    authUserId = user?.id ?? null;
  } catch {
    // Graceful fallback to unlinked entry if session read fails
    authUserId = null;
  }

  // Basic per-IP submission rate limiting (1-hour rolling window)
  const oneHourAgoIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: recentCount, error: rateLimitError } = await supabase
    .from("entry_private_details")
    .select("entry_id", { count: "exact", head: true })
    .eq("consent_ip_hash", consentIpHash)
    .gte("created_at", oneHourAgoIso);

  if (!rateLimitError && (recentCount ?? 0) >= MAX_SUBMISSIONS_PER_IP_PER_HOUR) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Too many submissions from your network recently. Please try again later.",
      },
      { status: 429 },
    );
  }

  const pendingPhotoPath = `${parsed.data.contestSlug}/${randomUUID()}.${sanitizedPhoto.extension}`;

  const { error: uploadError } = await supabase.storage
    .from(PENDING_PHOTO_BUCKET)
    .upload(pendingPhotoPath, sanitizedPhoto.buffer, {
      contentType: sanitizedPhoto.contentType,
      upsert: false,
    });

  if (uploadError) {
    console.error("[POST /api/submissions] Storage upload failed:", uploadError.message);
    return NextResponse.json(
      { ok: false, error: "Unable to upload photo right now. Please try again." },
      { status: 500 },
    );
  }

  // Attempt atomic DB insert; retry once if generated public_code collides.
  let rpcData: { entry_id: string; public_code: string; status: string }[] | null =
    null;
  let rpcErrorMessage: string | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const publicCode = buildPublicCode(parsed.data.childDisplayName);
    const { data, error } = await supabase.rpc("submit_entry", {
      p_contest_slug: parsed.data.contestSlug,
      p_public_code: publicCode,
      p_baby_name: parsed.data.childDisplayName,
      p_age_category: parsed.data.ageCategory,
      p_city: "",
      p_state: "",
      p_caption: "",
      p_pending_photo_path: pendingPhotoPath,
      p_guardian_name: parsed.data.guardianName,
      p_guardian_email: parsed.data.email,
      p_guardian_phone: parsed.data.phone,
      p_child_dob: parsed.data.childDateOfBirth,
      p_consent_guardian: parsed.data.consentGuardian,
      p_consent_sharing: parsed.data.consentSharing,
      p_consent_rules: parsed.data.consentRules,
      p_consent_ip_hash: consentIpHash,
      p_user_id: authUserId,
    });

    if (!error && data && data.length > 0) {
      rpcData = data;
      rpcErrorMessage = null;
      break;
    }

    rpcErrorMessage = error?.message ?? "Submission failed.";
    if (!rpcErrorMessage.includes("duplicate key")) {
      break;
    }
  }

  if (!rpcData || rpcData.length === 0) {
    // Roll back uploaded pending photo so no orphaned Storage object remains.
    await supabase.storage
      .from(PENDING_PHOTO_BUCKET)
      .remove([pendingPhotoPath]);

    const isClientRuleError =
      rpcErrorMessage?.includes("Contest is not currently accepting") ||
      rpcErrorMessage?.includes("Contest not found") ||
      rpcErrorMessage?.includes("consents are required");

    return NextResponse.json(
      {
        ok: false,
        error: isClientRuleError
          ? rpcErrorMessage
          : "Unable to complete your submission right now. Please try again.",
      },
      { status: isClientRuleError ? 400 : 500 },
    );
  }

  // Generate 7-day signed photo URL for email preview & dispatch email notification asynchronously
  supabase.storage
    .from(PENDING_PHOTO_BUCKET)
    .createSignedUrl(pendingPhotoPath, 7 * 24 * 3600)
    .then(({ data: signedPhoto }) => {
      sendModerationAlertEmail({
        entryId: rpcData[0].entry_id,
        babyName: parsed.data.childDisplayName,
        ageCategory: parsed.data.ageCategory,
        city: "",
        guardianName: parsed.data.guardianName,
        guardianEmail: parsed.data.email,
        photoSignedUrl: signedPhoto?.signedUrl || "",
        contestSlug: parsed.data.contestSlug,
      }).catch((emailErr) => {
        console.error(
          "[POST /api/submissions] Background moderation email failed:",
          emailErr,
        );
      });
    })
    .catch((err) => {
      console.error(
        "[POST /api/submissions] Failed to generate signed photo URL for email:",
        err,
      );
    });

  return NextResponse.json(
    {
      ok: true,
      publicCode: rpcData[0].public_code,
      status: rpcData[0].status,
      contestSlug: parsed.data.contestSlug,
    },
    { status: 201 },
  );
}

