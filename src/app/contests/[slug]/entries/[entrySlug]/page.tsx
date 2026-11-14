import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContestBySlug } from "@/lib/queries/contests";
import { getContestEntryForViewer } from "@/lib/queries/entries";
import EntryHeroPhoto from "@/components/entry/EntryHeroPhoto";
import EntryVotingPanel from "@/components/entry/EntryVotingPanel";
import EntryNotFoundCard from "@/components/entry/EntryNotFoundCard";
import EntryPendingPublicCard from "@/components/entry/EntryPendingPublicCard";
import ParentInReviewBanner from "@/components/entry/ParentInReviewBanner";
import ContestantChallengeStudio from "@/components/entry/ContestantChallengeStudio";

interface EntryPageProps {
  params: Promise<{ slug: string; entrySlug: string }>;
}

export async function generateMetadata({
  params,
}: EntryPageProps): Promise<Metadata> {
  const { slug, entrySlug } = await params;
  const contest = await getContestBySlug(slug);

  if (!contest) {
    return {
      title: "Contest Not Found | A2ZUK",
    };
  }

  const { entry, displayStatus } = await getContestEntryForViewer(slug, entrySlug);

  if (displayStatus === "not_found" || !entry) {
    if (displayStatus === "pending_public_waiting") {
      return {
        title: `Entry Under Review | ${contest.title} | A2ZUK`,
        description: `This contestant entry is currently undergoing moderation in ${contest.title}.`,
        robots: {
          index: false,
          follow: false,
        },
      };
    }
    return {
      title: `Entry Not Found | ${contest.title} | A2ZUK`,
      description: `Contestant entry not found in ${contest.title}.`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  if (displayStatus === "pending_parent_preview") {
    return {
      title: `[In Review] ${entry.displayName} | ${contest.title} | A2ZUK`,
      description: `Private preview for ${entry.displayName}. Entry is currently under review.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${entry.displayName} | ${contest.title} | A2ZUK`,
    description: entry.publicDescription || `Support ${entry.displayName} in ${contest.title} on Littlejoy.`,
    alternates: {
      canonical: `/contests/${contest.slug}/entries/${entry.slug}`,
    },
    openGraph: {
      title: `${entry.displayName} | ${contest.title}`,
      description: entry.publicDescription || `Support ${entry.displayName} in ${contest.title}.`,
      url: `/contests/${contest.slug}/entries/${entry.slug}`,
      siteName: "A2ZUK",
      type: "website",
    },
  };
}

async function ContestEntryContent({
  params,
}: {
  params: Promise<{ slug: string; entrySlug: string }>;
}) {
  const { slug, entrySlug } = await params;
  const contest = await getContestBySlug(slug);

  // If the parent contest does not exist, trigger standard 404
  if (!contest) {
    notFound();
  }

  // Look up contestant entry with authenticated parent fallback
  const { entry, displayStatus } = await getContestEntryForViewer(slug, entrySlug);

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="text-xs sm:text-sm text-[#5A6D61] flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap animate-hero-badge"
      >
        <Link href="/" className="hover:text-[#1B382B] transition-colors shrink-0">
          Home
        </Link>
        <span aria-hidden="true" className="shrink-0">/</span>
        <Link href="/contests" className="hover:text-[#1B382B] transition-colors shrink-0">
          Contests
        </Link>
        <span aria-hidden="true" className="shrink-0">/</span>
        <Link
          href={`/contests/${contest.slug}`}
          className="hover:text-[#1B382B] transition-colors truncate max-w-[140px] sm:max-w-[220px]"
        >
          {contest.title}
        </Link>
        <span aria-hidden="true" className="shrink-0">/</span>
        <span className="font-semibold text-[#1B382B] truncate max-w-[140px] sm:max-w-[220px]">
          {entry
            ? entry.displayName
            : displayStatus === "pending_public_waiting"
              ? "Entry Under Review"
              : "Entry Not Found"}
        </span>
      </nav>

      {/* Case 1: Entry not found or invalid */}
      {displayStatus === "not_found" && (
        <EntryNotFoundCard contest={contest} entrySlug={entrySlug} />
      )}

      {/* Case 2: Entry is pending and visitor is NOT the parent owner */}
      {displayStatus === "pending_public_waiting" && (
        <EntryPendingPublicCard contest={contest} entrySlug={entrySlug} />
      )}

      {/* Case 3: Entry is found (either published or private parent preview) */}
      {entry && (
        <>
          {/* Private reassurance banner if parent is viewing their pending entry */}
          {displayStatus === "pending_parent_preview" && (
            <ParentInReviewBanner
              babyName={entry.displayName}
              contestTitle={contest.title}
              contestSlug={contest.slug}
            />
          )}

          {/* Art-directed Two-Column Hero Showcase Card */}
          <section className="w-full rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-6 sm:p-10 lg:p-12 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Contestant Portrait Artwork */}
              <div className="lg:col-span-5 w-full">
                <EntryHeroPhoto entry={entry} />
              </div>

              {/* Right Column: Identity, Voting Action, and Policy */}
              <div className="lg:col-span-7 flex flex-col items-start w-full">
                <EntryVotingPanel
                  entry={entry}
                  contestTitle={contest.title}
                  contestStatus={contest.status}
                />
              </div>
            </div>
          </section>

          {/* Interactive Friendly Family Challenge & Live Card Previewer Studio (published only) */}
          {displayStatus === "published" && (
            <ContestantChallengeStudio
              challengerName={entry.displayName}
              contestSlug={contest.slug}
            />
          )}

          {/* 3-Step Journey & Community Trust Badges */}
          <section className="w-full rounded-2xl sm:rounded-3xl bg-white border border-[#EFECE4] p-6 sm:p-8 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5]">
                <span className="text-xl shrink-0">📸</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1B382B]">1. Snap or Pick a Photo</h4>
                  <p className="text-[11px] text-[#5A6D61] mt-0.5">Any candid smartphone photo of that joyful little moment.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5]">
                <span className="text-xl shrink-0">🏷️</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1B382B]">2. Free Instant Registration</h4>
                  <p className="text-[11px] text-[#5A6D61] mt-0.5">Under 6m, under 12m, or up to 24m. Takes 60 seconds.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5]">
                <span className="text-xl shrink-0">💌</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1B382B]">3. Share & Gather Votes</h4>
                  <p className="text-[11px] text-[#5A6D61] mt-0.5">Share your baby&apos;s personal voting page on WhatsApp with family.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EFECE4] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#5A6D61]">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#234E3D]">🔒</span>
                  <span>Safe & Private Moderation</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#234E3D]">🏆</span>
                  <span>₹27,500 Prize Pool (13 Winners)</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#234E3D]">🎁</span>
                  <span>Digital Keepsake Certificate</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#234E3D]">✨</span>
                  <span>100% Free Entry</span>
                </span>
              </div>

              <Link
                href={`/contests/${contest.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#234E3D] hover:underline shrink-0"
              >
                <span>← Back to {contest.title}</span>
              </Link>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default function ContestEntryPage({ params }: EntryPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Centered Main Page Container */}
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Shared Header */}
        <Suspense fallback={<div className="h-[72px]" aria-hidden="true" />}>
          <Header />
        </Suspense>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 sm:space-y-8 pb-16 sm:pb-24 pt-2 sm:pt-4">
          <Suspense
            fallback={
              <div className="space-y-6" aria-busy="true">
                <div className="h-5 w-64 rounded-full bg-[#EFECE4] animate-pulse" />
                <div className="h-96 rounded-[36px] bg-white border border-[#EFECE4] animate-pulse" />
              </div>
            }
          >
            <ContestEntryContent params={params} />
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

