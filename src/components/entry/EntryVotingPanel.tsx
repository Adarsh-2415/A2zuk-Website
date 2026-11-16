import Link from "next/link";
import type { ContestStatus } from "@/types/contest";
import { PublicContestantEntry } from "@/types/entry";
import EntryVoteControl from "./EntryVoteControl";
import SendCheerButton from "./SendCheerButton";
import WhatsAppShareCard from "./WhatsAppShareCard";

interface EntryVotingPanelProps {
  entry: PublicContestantEntry;
  contestTitle?: string;
  contestStatus?: ContestStatus;
  isOwner?: boolean;
}

function formatAgeCategory(category: PublicContestantEntry["ageCategory"]): string {
  switch (category) {
    case "under-6-months":
      return "Under 6 Months";
    case "under-12-months":
      return "Under 12 Months";
    case "up-to-24-months":
      return "Up to 24 Months";
    default:
      return "Baby Category";
  }
}

export default function EntryVotingPanel({
  entry,
  contestTitle,
  contestStatus = "active",
  isOwner = false,
}: EntryVotingPanelProps) {
  const categoryLabel = formatAgeCategory(entry.ageCategory);
  const isPending = entry.isParentPreview || entry.status === "pending";
  const isVotingOpen = contestStatus === "active" && !isPending;

  return (
    <div className="flex flex-col items-start w-full">
      {/* 1. Category Tag & Contest Context */}
      <div className="animate-hero-badge flex flex-wrap items-center gap-2.5 mb-3">
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#234E3D]/10 text-[#234E3D] border border-[#234E3D]/15">
          {categoryLabel}
        </span>
        {contestTitle && (
          <span className="text-xs font-medium text-[#5A6D61] truncate max-w-[260px]">
            {contestTitle}
          </span>
        )}
        {isOwner && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FAF8F5] text-[#1B382B] border border-[#E8DFC8]">
            <span>👤</span>
            <span>Parent View</span>
          </span>
        )}
      </div>

      {/* 2. Contestant Name (H1) */}
      <h1 className="animate-hero-title text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1B382B] tracking-tight leading-[1.12] mb-3">
        {entry.displayName}
      </h1>

      {/* 3. Optional Approved Description */}
      {entry.publicDescription && (
        <p className="animate-hero-desc text-[#4A5D52] text-base sm:text-lg leading-relaxed mb-6 font-normal max-w-xl">
          {entry.publicDescription}
        </p>
      )}

      {/* 4 & 5. Smart Controls: Parent View vs Voter View */}
      <div className="animate-hero-cta w-full max-w-md flex flex-col gap-3">
        {isOwner ? (
          /* =======================================================
             PARENT (OWNER) VIEW:
             - Parent cannot vote for their own child
             - Show Live Campaign Stats & Votes
             - Show WhatsApp Share Card (Locked if pending, Unlocked if approved)
             ======================================================= */
          <div className="space-y-3 w-full">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5A6D61] uppercase tracking-wider">
                  Contestant Campaign Stats
                </span>
                {isPending ? (
                  <span className="text-[10px] font-bold text-[#92400E] bg-[#FEF3C7] border border-[#FCD34D] px-2 py-0.5 rounded-full">
                    ⏳ In Review
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#234E3D] bg-[#234E3D]/10 border border-[#234E3D]/20 px-2 py-0.5 rounded-full">
                    ✅ Live on Leaderboard
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#1B382B] tracking-tight">
                  {entry.voteCount ?? 0}
                </span>
                <span className="text-xs font-semibold text-[#5A6D61]">
                  {(entry.voteCount ?? 0) === 1 ? "Verified Vote" : "Verified Votes"}
                </span>
              </div>

              <p className="text-[11px] text-[#5A6D61] leading-relaxed pt-1 border-t border-[#EFECE4]">
                {isPending
                  ? "Voting will open automatically once moderation checks pass. Parents cannot cast votes for their own child."
                  : "Parents cannot cast votes for their own child. Share your baby's page with friends and family to gain support!"}
              </p>
            </div>

            {/* Parent WhatsApp Sharing Card */}
            <WhatsAppShareCard
              babyName={entry.displayName}
              isPending={isPending}
            />

            {/* Quick link to parent dashboard */}
            <div className="pt-1 text-center">
              <Link
                href="/profile"
                className="text-xs font-bold text-[#234E3D] hover:underline inline-flex items-center gap-1"
              >
                <span>View all your entries in My Profile</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* =======================================================
             VOTER (PUBLIC) VIEW:
             - Can vote when approved & contest is active
             - Can send cheers
             - Hidden parent campaign share card
             ======================================================= */
          <div className="space-y-3 w-full">
            {isPending ? (
              <div className="p-5 rounded-2xl bg-[#FEF3C7]/40 border border-[#FCD34D]/60 space-y-2 text-center">
                <span className="text-2xl">⏳</span>
                <h3 className="text-sm font-bold text-[#92400E]">
                  Voting Opening Soon
                </h3>
                <p className="text-xs text-[#78350F] leading-relaxed">
                  This contestant entry is currently undergoing moderation. Voting will unlock as soon as our moderators approve it!
                </p>
              </div>
            ) : (
              <>
                <EntryVoteControl
                  contestSlug={entry.contestSlug}
                  entryCode={entry.slug}
                  displayName={entry.displayName}
                  initialVoteCount={entry.voteCount ?? 0}
                  isVotingOpen={isVotingOpen}
                />

                {/* Tactile Community Cheer Button */}
                <div className="pt-1">
                  <SendCheerButton
                    displayName={entry.displayName}
                    contestSlug={entry.contestSlug}
                  />
                </div>

                {/* Voting policy explanation */}
                <div className="mt-1 pt-3 border-t border-[#EFECE4] text-[11px] sm:text-xs text-[#5A6D61] leading-relaxed">
                  <strong className="font-semibold text-[#1B382B]">Official voting rule:</strong> Exactly 1 vote per contestant per verified Google account. Support your favourite babies freely and fairly!
                </div>

                {/* In-Hero "Got a baby too?" Bridge Card */}
                <div className="mt-2 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#D4E865]/20 via-[#FAF8F5] to-[#D4E865]/10 border border-[#D4E865]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#1B382B] flex items-center gap-1.5">
                      <span>👶</span>
                      <span>Inspired by {entry.displayName}?</span>
                    </p>
                    <p className="text-[11px] text-[#4A5D52] mt-0.5">
                      Participate in the contest • 100% Free
                    </p>
                  </div>
                  <Link
                    href={`/contests/${entry.contestSlug}/submit`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#1B382B] bg-[#D4E865] hover:bg-[#C7DC58] hover:-translate-y-0.5 active:scale-95 transition-all shadow-2xs shrink-0 group"
                  >
                    <span>Participate Now</span>
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
