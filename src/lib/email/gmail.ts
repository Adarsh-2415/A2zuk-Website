import "server-only";
import nodemailer from "nodemailer";
import { createModerationToken } from "@/lib/security/moderation-token";

interface ModerationEmailParams {
  entryId: string;
  babyName: string;
  ageCategory: string;
  city?: string;
  guardianName: string;
  guardianEmail: string;
  photoSignedUrl: string;
  contestSlug: string;
}

function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

function formatCategory(category: string): string {
  switch (category) {
    case "under-6-months":
      return "Under 6 Months";
    case "under-12-months":
      return "Under 12 Months";
    case "up-to-24-months":
      return "Up to 24 Months";
    default:
      return category;
  }
}

/**
 * Creates a Nodemailer transporter using Gmail SMTP.
 */
function createGmailTransporter() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim().replace(/\s+/g, "");

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/**
 * Sends a 1-click moderation email to the admin with photo and Approve/Reject action buttons.
 */
export async function sendModerationAlertEmail(params: ModerationEmailParams): Promise<boolean> {
  const transporter = createGmailTransporter();
  const adminEmail = process.env.ADMIN_MODERATION_EMAIL?.trim() || process.env.GMAIL_USER?.trim();

  if (!transporter || !adminEmail) {
    console.warn(
      "[Gmail SMTP] Credentials not configured in .env.local (GMAIL_USER / GMAIL_APP_PASSWORD). Skipping email alert.",
    );
    return false;
  }

  const siteUrl = getSiteUrl();
  const approveToken = createModerationToken(params.entryId, "approve");
  const rejectToken = createModerationToken(params.entryId, "reject");

  const approveUrl = `${siteUrl}/moderate?token=${encodeURIComponent(approveToken)}`;
  const rejectUrl = `${siteUrl}/moderate?token=${encodeURIComponent(rejectToken)}`;

  const categoryLabel = formatCategory(params.ageCategory);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contest Entry Moderation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #1B382B; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #EFECE4; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .header { background: #234E3D; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #D4E865; }
    .body { padding: 24px; }
    .photo-container { text-align: center; margin-bottom: 20px; }
    .photo { max-width: 100%; max-height: 380px; border-radius: 16px; object-fit: cover; border: 1px solid #EFECE4; }
    .details { background: #FAF8F5; border-radius: 16px; padding: 16px; margin-bottom: 24px; border: 1px solid #EFECE4; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #E5E1D8; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .label { color: #5A6D61; font-weight: 500; }
    .value { color: #1B382B; font-weight: 700; }
    .actions { display: table; width: 100%; margin-top: 24px; text-align: center; }
    .btn { display: inline-block; padding: 14px 28px; border-radius: 9999px; font-size: 14px; font-weight: 700; text-decoration: none; margin: 6px; }
    .btn-approve { background: #234E3D; color: #ffffff !important; }
    .btn-reject { background: #FEE2E2; color: #DC2626 !important; border: 1px solid #FECACA; }
    .footer { text-align: center; padding: 16px; font-size: 11px; color: #5A6D61; border-top: 1px solid #F5F2EA; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🍼 New Contest Submission</h1>
      <p>A2ZUK Baby Photo Contest Moderation</p>
    </div>
    
    <div class="body">
      <div class="photo-container">
        <img src="${params.photoSignedUrl}" alt="${params.babyName}" class="photo" />
      </div>

      <div class="details">
        <div class="row">
          <span class="label">Baby Name:</span>
          <span class="value">${params.babyName}</span>
        </div>
        <div class="row">
          <span class="label">Age Category:</span>
          <span class="value">${categoryLabel}</span>
        </div>
        ${
          params.city
            ? `<div class="row"><span class="label">City:</span><span class="value">${params.city}</span></div>`
            : ""
        }
        <div class="row">
          <span class="label">Parent / Guardian:</span>
          <span class="value">${params.guardianName}</span>
        </div>
        <div class="row">
          <span class="label">Verified Google Email:</span>
          <span class="value">${params.guardianEmail}</span>
        </div>
        <div class="row">
          <span class="label">Status:</span>
          <span class="value" style="color: #D97706;">Pending Review</span>
        </div>
      </div>

      <p style="text-align: center; font-size: 13px; color: #5A6D61; margin: 0 0 16px;">
        Tap a button below to review and publish this entry:
      </p>

      <div class="actions">
        <a href="${approveUrl}" class="btn btn-approve">
          ✅ Approve &amp; Publish Entry
        </a>
        <a href="${rejectUrl}" class="btn btn-reject">
          ❌ Reject Entry
        </a>
      </div>
    </div>

    <div class="footer">
      🔒 Secure cryptographic links valid for 7 days.<br/>
      Protected with single-use action verification.
    </div>
  </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"A2ZUK Contest" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: `🍼 [Action Needed] New Entry: ${params.babyName} (${categoryLabel})`,
      html: htmlContent,
    });
    console.log(`[Gmail SMTP] Moderation email dispatched successfully for entry ${params.entryId}`);
    return true;
  } catch (err) {
    console.error("[Gmail SMTP] Failed to send email alert:", err);
    return false;
  }
}

