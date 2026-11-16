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
  // If explicitly set with a custom domain (e.g. https://a2zuk.in)
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  // Vercel production system variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
  }
  const url = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? "https://a2zuk.in" : "http://localhost:3000");
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
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    tls: {
      // Prevents local Windows antivirus/firewall proxy SSL interception (SELF_SIGNED_CERT_IN_CHAIN)
      rejectUnauthorized: false,
    },
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
        ${params.city
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

export interface ParentSubmissionReceivedEmailParams {
  babyName: string;
  guardianName: string;
  guardianEmail: string;
  ageCategory: string;
  city?: string;
  contestSlug: string;
  publicCode: string;
}

/**
 * Dispatches a confirmation email to the parent immediately after entry submission,
 * letting them know their entry was received and is under review.
 */
export async function sendParentSubmissionReceivedEmail(
  params: ParentSubmissionReceivedEmailParams,
): Promise<boolean> {
  const transporter = createGmailTransporter();
  const parentEmail = params.guardianEmail?.trim();

  if (!transporter || !parentEmail) {
    console.warn("[Gmail SMTP] Transporter or parent email missing. Skipping submission received email.");
    return false;
  }

  const siteUrl = getSiteUrl();
  const categoryLabel = formatCategory(params.ageCategory);
  const entryPreviewUrl = `${siteUrl}/contests/${params.contestSlug}/entries/${params.publicCode}`;
  const profileUrl = `${siteUrl}/profile`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Submission Received - A2ZUK Baby Contest</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #1B382B; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #EFECE4; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .header { background: #234E3D; color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 8px 0 0; font-size: 14px; color: #D4E865; }
    .body { padding: 28px 24px; line-height: 1.6; }
    .greeting { font-size: 16px; font-weight: 600; color: #1B382B; margin-bottom: 12px; }
    .intro { font-size: 14px; color: #4A5D52; margin-bottom: 20px; }
    .details { background: #FAF8F5; border-radius: 16px; padding: 18px; margin-bottom: 24px; border: 1px solid #EFECE4; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #E5E1D8; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .label { color: #5A6D61; font-weight: 500; }
    .value { color: #1B382B; font-weight: 700; }
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 9999px; background: #FEF3C7; color: #92400E; font-weight: 700; font-size: 12px; }
    .notice-box { background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 14px; padding: 16px; margin: 20px 0; font-size: 13px; color: #166534; }
    .actions { text-align: center; margin-top: 28px; }
    .btn { display: inline-block; padding: 13px 26px; border-radius: 9999px; font-size: 14px; font-weight: 700; text-decoration: none; margin: 6px; }
    .btn-primary { background: #234E3D; color: #ffffff !important; }
    .btn-secondary { background: #EFECE4; color: #1B382B !important; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #7A8E81; border-top: 1px solid #F5F2EA; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🍼 Entry Received!</h1>
      <p>Thank you for participating in A2ZUK Baby Photo Contest</p>
    </div>
    
    <div class="body">
      <div class="greeting">Hello ${params.guardianName},</div>
      <p class="intro">
        Thank you for submitting <strong>${params.babyName}</strong> to the contest! We are thrilled to welcome your little star to the A2ZUK family.
      </p>

      <div class="details">
        <div class="row">
          <span class="label">Baby Name:</span>
          <span class="value">${params.babyName}</span>
        </div>
        <div class="row">
          <span class="label">Age Category:</span>
          <span class="value">${categoryLabel}</span>
        </div>
        ${params.city
      ? `<div class="row"><span class="label">City:</span><span class="value">${params.city}</span></div>`
      : ""
    }
        <div class="row">
          <span class="label">Current Status:</span>
          <span class="status-badge">⏳ Under Verification</span>
        </div>
      </div>

      <div class="notice-box">
        <strong>What happens next?</strong><br/>
        Our team reviews every photo to ensure safety and quality standards. As soon as your entry is approved, you will receive another email with your public link to start sharing with relatives on WhatsApp!
      </div>

      <p style="font-size: 13px; color: #5A6D61; text-align: center; margin-bottom: 16px;">
        You can preview your baby's entry or check your submission anytime in your parent dashboard:
      </p>

      <div class="actions">
        <a href="${entryPreviewUrl}" class="btn btn-primary">
          👀 Preview Baby's Entry Page
        </a>
        <a href="${profileUrl}" class="btn btn-secondary">
          👤 My Profile Dashboard
        </a>
      </div>
    </div>

    <div class="footer">
      Sent with love from the A2ZUK Baby Photo Contest Team.<br/>
      If you did not submit this entry, please contact support.
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Hello ${params.guardianName},

Thank you for submitting ${params.babyName} to the A2ZUK Baby Photo Contest!

Entry Details:
- Baby Name: ${params.babyName}
- Category: ${categoryLabel}
- Status: Under Verification

What happens next?
Our team reviews each photo for safety and quality. The moment your entry is approved, you will receive an email notification with your live contest link to share with friends and family on WhatsApp!

Preview your entry: ${entryPreviewUrl}
My Profile Dashboard: ${profileUrl}

Best regards,
A2ZUK Baby Photo Contest Team
  `.trim();

  try {
    await transporter.sendMail({
      from: `"A2ZUK Baby Contest" <${process.env.GMAIL_USER}>`,
      to: parentEmail,
      subject: `🍼 We received ${params.babyName}'s entry! - A2ZUK Baby Photo Contest`,
      html: htmlContent,
      text: textContent,
    });
    console.log(`[Gmail SMTP] Submission confirmation sent to parent ${parentEmail} for baby ${params.babyName}`);
    return true;
  } catch (err) {
    console.error("[Gmail SMTP] Failed to send submission confirmation to parent:", err);
    return false;
  }
}

export interface ParentEntryApprovedEmailParams {
  babyName: string;
  guardianName: string;
  guardianEmail: string;
  contestSlug: string;
  publicCode: string;
}

/**
 * Dispatches an approval celebration email to the parent with their live link
 * and an instant 1-click WhatsApp share button.
 */
export async function sendParentEntryApprovedEmail(
  params: ParentEntryApprovedEmailParams,
): Promise<boolean> {
  const transporter = createGmailTransporter();
  const parentEmail = params.guardianEmail?.trim();

  if (!transporter || !parentEmail) {
    console.warn("[Gmail SMTP] Transporter or parent email missing. Skipping approved email.");
    return false;
  }

  const siteUrl = getSiteUrl();
  const entryLiveUrl = `${siteUrl}/contests/${params.contestSlug}/entries/${params.publicCode}`;
  const whatsappShareText = encodeURIComponent(
    `🍼 Support little ${params.babyName} in the A2ZUK Baby Photo Contest! View the photo and cast your official vote here: ${entryLiveUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappShareText}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Entry is Approved! - A2ZUK Baby Contest</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #1B382B; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #EFECE4; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .header { background: #234E3D; color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 8px 0 0; font-size: 14px; color: #D4E865; }
    .body { padding: 28px 24px; line-height: 1.6; }
    .greeting { font-size: 16px; font-weight: 600; color: #1B382B; margin-bottom: 12px; }
    .celebration { font-size: 15px; color: #234E3D; font-weight: 500; margin-bottom: 20px; }
    .share-box { background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 18px; padding: 20px; text-align: center; margin: 24px 0; }
    .share-box h3 { margin: 0 0 8px; color: #166534; font-size: 16px; font-weight: 700; }
    .share-box p { margin: 0 0 16px; font-size: 13px; color: #15803D; }
    .btn-wa { display: inline-block; padding: 14px 28px; border-radius: 9999px; font-size: 15px; font-weight: 700; text-decoration: none; background: #25D366; color: #ffffff !important; box-shadow: 0 4px 12px rgba(37,211,102,0.3); }
    .actions { text-align: center; margin-top: 20px; }
    .btn-page { display: inline-block; padding: 12px 24px; border-radius: 9999px; font-size: 14px; font-weight: 600; text-decoration: none; background: #234E3D; color: #ffffff !important; }
    .rules-reminder { font-size: 12px; color: #5A6D61; text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px dashed #EFECE4; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #7A8E81; border-top: 1px solid #F5F2EA; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🎉 Congratulations!</h1>
      <p>${params.babyName}'s Photo is Approved &amp; Live!</p>
    </div>
    
    <div class="body">
      <div class="greeting">Hello ${params.guardianName},</div>
      <p class="celebration">
        Great news! <strong>${params.babyName}</strong>'s entry has passed verification and is now officially live on the A2ZUK Baby Photo Contest leaderboard!
      </p>

      <div class="share-box">
        <h3>📲 Share with Loved Ones on WhatsApp</h3>
        <p>
          Gather support for ${params.babyName}! Every family member and friend gets 1 official vote in the contest.
        </p>
        <a href="${whatsappUrl}" class="btn-wa" target="_blank">
          Share to WhatsApp Now 💬
        </a>
      </div>

      <div class="actions">
        <a href="${entryLiveUrl}" class="btn-page">
          👀 View ${params.babyName}'s Contest Page
        </a>
      </div>

      <div class="rules-reminder">
        💡 <strong>Fair Voting Rule:</strong> Each person receives 1 permanent vote verified via Google Sign-In. Encourage everyone in your family circle to cast their ballot for ${params.babyName}!
      </div>
    </div>

    <div class="footer">
      Sent with love from the A2ZUK Baby Photo Contest Team.<br/>
      Need assistance? Reply directly to this email.
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Congratulations ${params.guardianName}!

Great news! ${params.babyName}'s photo is approved and now officially LIVE on the A2ZUK Baby Photo Contest leaderboard!

View the live contest page:
${entryLiveUrl}

Share on WhatsApp:
${whatsappUrl}

Reminder: Every friend and relative receives 1 official vote in the contest. Start gathering support for ${params.babyName} today!

Best regards,
A2ZUK Baby Photo Contest Team
  `.trim();

  try {
    await transporter.sendMail({
      from: `"A2ZUK Baby Contest" <${process.env.GMAIL_USER}>`,
      to: parentEmail,
      subject: `🎉 Hooray! ${params.babyName}'s photo is now LIVE on A2ZUK!`,
      html: htmlContent,
      text: textContent,
    });
    console.log(`[Gmail SMTP] Approval email sent to parent ${parentEmail} for baby ${params.babyName}`);
    return true;
  } catch (err) {
    console.error("[Gmail SMTP] Failed to send approval email to parent:", err);
    return false;
  }
}

export interface ParentEntryRejectedEmailParams {
  babyName: string;
  guardianName: string;
  guardianEmail: string;
  contestSlug: string;
  rejectionReason?: string;
}

/**
 * Dispatches a polite, respectful rejection notification to the parent,
 * explaining guidelines and inviting them to submit a fresh photo.
 */
export async function sendParentEntryRejectedEmail(
  params: ParentEntryRejectedEmailParams,
): Promise<boolean> {
  const transporter = createGmailTransporter();
  const parentEmail = params.guardianEmail?.trim();

  if (!transporter || !parentEmail) {
    console.warn("[Gmail SMTP] Transporter or parent email missing. Skipping rejection email.");
    return false;
  }

  const siteUrl = getSiteUrl();
  const submitUrl = `${siteUrl}/contests/${params.contestSlug}/submit`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Entry Status Update - A2ZUK Baby Contest</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #1B382B; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #EFECE4; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .header { background: #431407; color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 8px 0 0; font-size: 13px; color: #FED7AA; }
    .body { padding: 28px 24px; line-height: 1.6; }
    .greeting { font-size: 16px; font-weight: 600; color: #1B382B; margin-bottom: 12px; }
    .message { font-size: 14px; color: #4A5D52; margin-bottom: 20px; }
    .guidelines-box { background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 16px; padding: 18px; margin: 20px 0; font-size: 13px; color: #9A3412; }
    .guidelines-box ul { margin: 8px 0 0; padding-left: 20px; }
    .guidelines-box li { margin-bottom: 6px; }
    .actions { text-align: center; margin-top: 28px; }
    .btn-submit { display: inline-block; padding: 13px 26px; border-radius: 9999px; font-size: 14px; font-weight: 700; text-decoration: none; background: #234E3D; color: #ffffff !important; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #7A8E81; border-top: 1px solid #F5F2EA; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Update on Your Entry</h1>
      <p>A2ZUK Baby Photo Contest</p>
    </div>
    
    <div class="body">
      <div class="greeting">Hello ${params.guardianName},</div>
      <p class="message">
        Thank you for taking the time to participate in the A2ZUK Baby Photo Contest. During our routine photo quality and safety verification, our team was unfortunately unable to approve the submitted photo of <strong>${params.babyName}</strong> for the public gallery.
      </p>

      <div class="guidelines-box">
        <strong>Common reasons an entry cannot be published:</strong>
        <ul>
          <li>The photograph is blurry, dark, or low-resolution.</li>
          <li>Multiple individuals or adults appear clearly in the frame.</li>
          <li>Heavy filters, digital stickers, or overlaid text are present on the image.</li>
        </ul>
      </div>

      <p class="message">
        Don&apos;t worry! You are warmly invited to submit a clear, vibrant photo of <strong>${params.babyName}</strong> so your little star can be featured on the leaderboard.
      </p>

      <div class="actions">
        <a href="${submitUrl}" class="btn-submit">
          📸 Submit a New Photo for ${params.babyName}
        </a>
      </div>
    </div>

    <div class="footer">
      Sent from the A2ZUK Baby Photo Contest Team.<br/>
      If you have questions regarding this decision, feel free to reply directly to this email.
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Hello ${params.guardianName},

Thank you for participating in the A2ZUK Baby Photo Contest. During our routine photo quality and safety review, our team was unfortunately unable to approve the submitted photo of ${params.babyName} for the public gallery.

Common reasons include blurry/dark photos, multiple faces in the frame, or digital filters/stickers.

You are warmly invited to submit a clear, fresh photo of ${params.babyName}:
${submitUrl}

Best regards,
A2ZUK Baby Photo Contest Team
  `.trim();

  try {
    await transporter.sendMail({
      from: `"A2ZUK Baby Contest" <${process.env.GMAIL_USER}>`,
      to: parentEmail,
      subject: `Update regarding ${params.babyName}'s entry - A2ZUK Baby Photo Contest`,
      html: htmlContent,
      text: textContent,
    });
    console.log(`[Gmail SMTP] Rejection notice sent to parent ${parentEmail} for baby ${params.babyName}`);
    return true;
  } catch (err) {
    console.error("[Gmail SMTP] Failed to send rejection notice to parent:", err);
    return false;
  }
}

