import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyModerationToken } from "@/lib/security/moderation-token";
import ModerationActionView from "@/components/moderation/ModerationActionView";

export const metadata: Metadata = {
  title: "Contest Moderation | A2ZUK",
  robots: { index: false, follow: false },
};

interface ModeratePageProps {
  searchParams: Promise<{ token?: string }>;
}

async function ModerateContent({ searchParams }: ModeratePageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-3xl border border-[#EFECE4] shadow-sm space-y-4">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-xl font-bold text-[#1B382B]">Missing Moderation Token</h2>
        <p className="text-xs sm:text-sm text-[#5A6D61]">
          No moderation token was provided. Please use the button directly from your notification email.
        </p>
      </div>
    );
  }

  const payload = verifyModerationToken(token);
  if (!payload) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-3xl border border-[#EFECE4] shadow-sm space-y-4">
        <span className="text-4xl">⏳</span>
        <h2 className="text-xl font-bold text-[#1B382B]">Expired or Invalid Link</h2>
        <p className="text-xs sm:text-sm text-[#5A6D61]">
          This link has expired (valid for 7 days) or the signature is invalid.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-full text-xs font-bold bg-[#234E3D] text-white"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: entry } = await admin
    .from("entries")
    .select(`
      id,
      baby_name,
      age_category,
      city,
      status,
      public_code,
      pending_photo_path,
      public_photo_path,
      contests!inner (
        slug,
        title
      )
    `)
    .eq("id", payload.entryId)
    .maybeSingle();

  if (!entry) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-3xl border border-[#EFECE4] shadow-sm space-y-4">
        <span className="text-4xl">🔍</span>
        <h2 className="text-xl font-bold text-[#1B382B]">Entry Not Found</h2>
        <p className="text-xs sm:text-sm text-[#5A6D61]">
          The contestant entry referenced by this token could not be found.
        </p>
      </div>
    );
  }

  // Get preview photo URL
  let photoUrl: string | undefined = undefined;
  if (entry.status === "published" && entry.public_photo_path) {
    const { data: pubData } = admin.storage
      .from("contest-photos-public")
      .getPublicUrl(entry.public_photo_path);
    photoUrl = pubData.publicUrl;
  } else if (entry.pending_photo_path) {
    const { data: signedData } = await admin.storage
      .from("contest-photos-pending")
      .createSignedUrl(entry.pending_photo_path, 900); // 15 mins
    photoUrl = signedData?.signedUrl;
  }

  const contest = entry.contests as { slug: string; title: string };

  return (
    <ModerationActionView
      token={token}
      action={payload.action}
      babyName={entry.baby_name}
      ageCategory={entry.age_category}
      city={entry.city}
      currentStatus={entry.status}
      photoUrl={photoUrl}
      contestTitle={contest.title}
      contestSlug={contest.slug}
      publicCode={entry.public_code}
    />
  );
}

export default function ModeratePage({ searchParams }: ModeratePageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        <Suspense fallback={<div className="h-[72px]" />}>
          <Header />
        </Suspense>

        <main className="flex-1 py-10 sm:py-16">
          <Suspense
            fallback={
              <div className="max-w-md mx-auto p-12 bg-white rounded-3xl border border-[#EFECE4] animate-pulse h-96" />
            }
          >
            <ModerateContent searchParams={searchParams} />
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
}

