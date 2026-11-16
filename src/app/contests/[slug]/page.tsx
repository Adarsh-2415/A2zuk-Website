import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { formatContestDate, getContestDateLabel } from "@/lib/contests/format";
import {
  getContestBySlug,
  getContestWinners,
  getPublicContestSlugs,
} from "@/lib/queries/contests";
import { ContestCoverImage } from "@/components/contests/ContestCoverImage";
import { ContestStatusBadge } from "@/components/contests/ContestStatusBadge";
import { PrizePoolSection } from "@/components/contests/PrizePoolSection";
import { ContestEntriesGallery } from "@/components/contests/ContestEntriesGallery";
import { getPublishedEntriesByContest } from "@/lib/queries/entries";

export async function generateStaticParams() {
  const slugs = await getPublicContestSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface ContestDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ContestDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const contest = await getContestBySlug(slug);

  if (!contest) {
    return {
      title: "Contest Not Found | A2ZUK",
    };
  }

  return {
    title: `${contest.title} | A2ZUK`,
    description: contest.shortDescription,
    alternates: {
      canonical: `/contests/${contest.slug}`,
    },
    openGraph: {
      title: `${contest.title} | A2ZUK`,
      description: contest.shortDescription,
      url: `/contests/${contest.slug}`,
      siteName: "A2ZUK",
      type: "website",
    },
  };
}

async function ContestDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contest = await getContestBySlug(slug);

  if (!contest) {
    notFound();
  }

  const [winners, publishedEntries] = await Promise.all([
    contest.status === "ended"
      ? getContestWinners(contest.id, contest.status)
      : Promise.resolve([]),
    contest.status !== "upcoming"
      ? getPublishedEntriesByContest(contest.id, contest.slug)
      : Promise.resolve([]),
  ]);

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
        <span className="font-semibold text-[#1B382B] truncate max-w-xs sm:max-w-md">
          {contest.title}
        </span>
      </nav>

      {/* Hero Showcase Card */}
      <section className="w-full rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cover Artwork Column */}
          <div className="lg:col-span-5 w-full">
            <ScrollReveal direction="up">
              <ContestCoverImage contest={contest} className="aspect-[16/10] sm:aspect-[16/9] shadow-sm" />
            </ScrollReveal>
          </div>

          {/* Contest Overview Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <ScrollReveal direction="up" delayMs={100}>
              {/* Status & Date */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <ContestStatusBadge status={contest.status} />
                {contest.isFeatured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#D4E865] text-[#1B382B]">
                    Featured
                  </span>
                )}
                {contest.prizeStructure && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#234E3D]/10 text-[#234E3D] border border-[#234E3D]/15">
                    <span>🏆</span>
                    <span>{contest.prizeStructure.formattedTotalPool} Prize Pool</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-bold text-[#1B382B] tracking-tight leading-[1.15] mb-4">
                {contest.title}
              </h1>

              {/* Description */}
              <p className="text-[#4A5D52] text-base sm:text-lg leading-relaxed mb-8">
                {contest.shortDescription}
              </p>

              {/* Primary Call to Action */}
              <div className="flex flex-wrap items-center gap-4">
                {contest.status === "active" ? (
                  <Link
                    href={`/contests/${contest.slug}/submit`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <span>Submit an Entry</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : contest.status === "upcoming" ? (
                  <span className="inline-flex items-center px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold text-[#5A6D61] bg-[#FAF8F5] border border-[#EFECE4]">
                    Opening Soon on {formatContestDate(contest.startDate)}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold text-[#5A6D61] bg-[#FAF8F5] border border-[#EFECE4]">
                    Contest Concluded
                  </span>
                )}

                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-semibold text-[#1B382B] hover:text-[#234E3D] hover:bg-black/[0.04] transition-colors"
                >
                  <span>How it works</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Awards & Prizes Section */}
      {contest.prizeStructure && (
        <ScrollReveal direction="up">
          <PrizePoolSection prizeStructure={contest.prizeStructure} />
        </ScrollReveal>
      )}

      {/* Official Guidelines & Fair Play Rules Card */}
      <ScrollReveal direction="up">
        <section
          aria-label="Contest rules and guidelines"
          className="w-full rounded-[24px] sm:rounded-[32px] bg-white border border-[#EFECE4] p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#EFECE4]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2653B]">
                Official Contest Rules
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B382B] tracking-tight mt-0.5">
                Eligibility &amp; Fair Play Standards
              </h2>
            </div>
            <Link
              href="/how-it-works"
              className="text-xs font-semibold text-[#234E3D] hover:underline inline-flex items-center gap-1"
            >
              <span>View full guide</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] space-y-1.5">
              <span className="text-2xl" aria-hidden="true">👶</span>
              <h3 className="font-bold text-sm text-[#1B382B]">Age Limit: Up to 24 Months</h3>
              <p className="text-xs text-[#5A6D61] leading-relaxed">
                Open to all babies from newborn up to 2 years old, organized into 3 balanced age categories.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] space-y-1.5">
              <span className="text-2xl" aria-hidden="true">🎟️</span>
              <h3 className="font-bold text-sm text-[#1B382B]">100% Free Entry</h3>
              <p className="text-xs text-[#5A6D61] leading-relaxed">
                Zero entry fee, zero hidden costs, and absolutely no paid votes. Every participant has equal standing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] space-y-1.5">
              <span className="text-2xl" aria-hidden="true">🗳️</span>
              <h3 className="font-bold text-sm text-[#1B382B]">1 Vote Per Baby</h3>
              <p className="text-xs text-[#5A6D61] leading-relaxed">
                Verified with 1-click Google sign-in. Voters can support multiple babies, with 1 permanent vote per baby.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] space-y-1.5">
              <span className="text-2xl" aria-hidden="true">🛡️</span>
              <h3 className="font-bold text-sm text-[#1B382B]">Anti-Self-Vote &amp; Safety</h3>
              <p className="text-xs text-[#5A6D61] leading-relaxed">
                Parents share their baby’s page with loved ones. Automated anti-bot audits ensure 100% genuine tallies.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Published Contest Entries Gallery */}
      {contest.status !== "upcoming" && (
        <ContestEntriesGallery
          entries={publishedEntries}
          contestSlug={contest.slug}
          isActiveContest={contest.status === "active"}
        />
      )}

      {/* Finalized Winners (Only shown when contest ended and winners are finalized in DB) */}
      {contest.status === "ended" && winners.length > 0 && (
        <section
          aria-labelledby="winners-heading"
          className="w-full rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-6 sm:p-10 shadow-xs"
        >
          <h2
            id="winners-heading"
            className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight mb-6"
          >
            Official Contest Winners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {winners.map((winner) => (
              <Link
                key={winner.id}
                href={`/contests/${contest.slug}/entries/${winner.entry.publicCode}`}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] hover:border-[#234E3D]/30 transition-colors flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4E865] text-[#1B382B]">
                    Rank #{winner.rank}
                  </span>
                  <span className="text-sm font-bold text-[#234E3D]">
                    {winner.formattedPrizeAmount}
                  </span>
                </div>
                <p className="text-lg font-bold text-[#1B382B]">
                  {winner.entry.displayName}
                </p>
                <p className="text-xs text-[#5A6D61]">
                  {winner.entry.city}, {winner.entry.state} • {winner.entry.voteCount} votes
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function ContestDetailPage({
  params,
}: ContestDetailPageProps) {
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
              <div className="space-y-8" aria-busy="true">
                <div className="h-5 w-48 rounded-full bg-[#EFECE4] animate-pulse" />
                <div className="h-96 rounded-[36px] bg-white border border-[#EFECE4] animate-pulse" />
              </div>
            }
          >
            <ContestDetailContent params={params} />
          </Suspense>

          {/* Timeline & Guidelines Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#EFECE4] shadow-xs">
              <span className="w-8 h-8 rounded-full bg-[#234E3D]/10 text-[#234E3D] flex items-center justify-center font-bold text-xs mb-3">
                01
              </span>
              <h3 className="font-bold text-[#1B382B] text-base mb-1">Eligibility</h3>
              <p className="text-xs sm:text-sm text-[#4A5D52] leading-relaxed">
                Open to parents and legal guardians submitting original photos with appropriate parental consent.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EFECE4] shadow-xs">
              <span className="w-8 h-8 rounded-full bg-[#234E3D]/10 text-[#234E3D] flex items-center justify-center font-bold text-xs mb-3">
                02
              </span>
              <h3 className="font-bold text-[#1B382B] text-base mb-1">Voting Rules</h3>
              <p className="text-xs sm:text-sm text-[#4A5D52] leading-relaxed">
                Each verified Google account receives 1 official vote in total for the contest. Once cast, your ballot is permanently recorded.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EFECE4] shadow-xs">
              <span className="w-8 h-8 rounded-full bg-[#234E3D]/10 text-[#234E3D] flex items-center justify-center font-bold text-xs mb-3">
                03
              </span>
              <h3 className="font-bold text-[#1B382B] text-base mb-1">Automated Checks</h3>
              <p className="text-xs sm:text-sm text-[#4A5D52] leading-relaxed">
                Entries are reviewed by automated moderation checks before appearing in the public gallery.
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
