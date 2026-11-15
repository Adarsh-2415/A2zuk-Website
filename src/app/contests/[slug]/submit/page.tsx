import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getContestBySlug, getPublicContestSlugs } from "@/lib/queries/contests";
import { createClient as createServerUserClient } from "@/lib/supabase/server";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { EntrySubmitForm } from "@/components/submission/EntrySubmitForm";

export async function generateStaticParams() {
  const slugs = await getPublicContestSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface SubmitPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SubmitPageProps): Promise<Metadata> {
  const { slug } = await params;
  const contest = await getContestBySlug(slug);

  if (!contest) {
    return {
      title: "Contest Not Found | A2ZUK",
    };
  }

  return {
    title: `Submit Entry — ${contest.title} | A2ZUK`,
    description: `Submit your baby's photo entry in ${contest.title}. Complete the simple entry form and share their little smile with family and community.`,
  };
}

async function SubmitEntryContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contest = await getContestBySlug(slug);

  // Check if user is signed in with Google
  let user: { id: string } | null = null;
  try {
    const userClient = await createServerUserClient();
    const { data } = await userClient.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  // Requirement: Only Baby Photo Contest #1 allows access to the submission form.
  const isSubmissionOpen =
    contest && contest.slug === "baby-photo-contest-1" && contest.status === "active";

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-[#5A6D61] flex items-center gap-2">
        <Link href="/" className="hover:text-[#1B382B] transition-colors">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/contests" className="hover:text-[#1B382B] transition-colors">
          Contests
        </Link>
        <span aria-hidden="true">/</span>
        {contest ? (
          <Link href={`/contests/${contest.slug}`} className="hover:text-[#1B382B] transition-colors truncate max-w-xs">
            {contest.title}
          </Link>
        ) : (
          <span>Contest</span>
        )}
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-[#1B382B]">Submit Entry</span>
      </nav>

      {/* Conditional Gate: Only Baby Photo Contest #1 accepts submissions */}
      {!isSubmissionOpen ? (
        <div className="w-full py-16 text-center">
          <div className="max-w-lg mx-auto p-8 rounded-3xl bg-white border border-[#EFECE4] shadow-xs space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#5A6D61]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1B382B]">Submissions Not Available</h1>
            <p className="text-sm text-[#4A5D52] leading-relaxed">
              Submissions are currently restricted to the active inaugural contest (Baby Photo Contest #1). Other contest cycles are development lifecycle demonstrations and are not open for entry.
            </p>
            <div className="pt-2">
              <Link
                href="/contests/baby-photo-contest-1/submit"
                className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] transition-colors"
              >
                Go to Baby Photo Contest #1
              </Link>
            </div>
          </div>
        </div>
      ) : !user ? (
        /* Mandatory Google Sign-in Gate */
        <div className="w-full py-10 sm:py-16 text-center">
          <div className="max-w-md mx-auto p-8 sm:p-10 rounded-[32px] bg-white border border-[#EFECE4] shadow-xs space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#234E3D]/10 text-[#234E3D] flex items-center justify-center text-3xl shadow-2xs">
              🌟
            </div>
            <div>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#234E3D]/10 text-[#234E3D] mb-2">
                100% Free Entry
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight">
                Participate in {contest.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#5A6D61] mt-2 leading-relaxed">
                Please sign in with your Google account to register. Your verified name and email will be linked automatically.
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center">
              <GoogleSignInButton
                redirectTo={`/contests/${contest.slug}/submit`}
                label="Sign in with Google to Continue"
                className="w-full shadow-sm"
              />
            </div>

            <div className="pt-4 border-t border-[#F5F2EA] flex flex-wrap justify-center gap-3 text-[11px] text-[#5A6D61]">
              <span>🔒 Zero Passwords Required</span>
              <span>•</span>
              <span>⚡ Fast 1-Click Verification</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Submission Flow (Manages Guidance Card in form state & centers Checking/Celebration screens) */}
          <ScrollReveal direction="up">
            <EntrySubmitForm contestSlug={contest.slug} />
          </ScrollReveal>

          {/* Bottom Peach Banner */}
          <ScrollReveal direction="up" delayMs={150}>
            <div className="w-full rounded-2xl sm:rounded-3xl bg-[#FAD5C0] p-6 sm:p-8 text-center sm:text-left shadow-2xs">
              <p className="text-base sm:text-lg font-bold text-[#1B382B] tracking-tight">
                Your photo. Your family’s moment. Shared with care.
              </p>
            </div>
          </ScrollReveal>
        </>
      )}
    </>
  );
}

export default function SubmitEntryPage({ params }: SubmitPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Centered Main Page Container */}
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Shared Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 space-y-8 sm:space-y-12 pb-16 sm:pb-24 pt-2 sm:pt-4">
          <Suspense
            fallback={
              <div className="space-y-6" aria-busy="true">
                <div className="h-5 w-56 rounded-full bg-[#EFECE4] animate-pulse" />
                <div className="h-96 rounded-3xl bg-white border border-[#EFECE4] animate-pulse" />
              </div>
            }
          >
            <SubmitEntryContent params={params} />
          </Suspense>
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </div>
  );
}
