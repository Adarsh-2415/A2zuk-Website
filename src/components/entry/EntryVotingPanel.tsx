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

      {/* 4 & 5. Live Vote Count & Primary Vote/Share Controls */}
      <div className="animate-hero-cta w-full max-w-md flex flex-col gap-3">
        <EntryVoteControl
          contestSlug={entry.contestSlug}
          entryCode={entry.slug}
          displayName={entry.displayName}
          initialVoteCount={entry.voteCount ?? 0}
          isVotingOpen={isVotingOpen}
        />

        {/* Tactile Community Cheer Button */}
        {!isPending && (
          <div className="pt-1">
            <SendCheerButton
              displayName={entry.displayName}
              contestSlug={entry.contestSlug}
            />
          </div>
        )}

        {/* 1-Tap WhatsApp Sharing Card for Parents and Supporters */}
        <div className="pt-2">
          <WhatsAppShareCard
            babyName={entry.displayName}
            isPending={isPending}
          />
        </div>

        {/* Voting policy explanation */}
        <div className="mt-1 pt-3 border-t border-[#EFECE4] text-[11px] sm:text-xs text-[#5A6D61] leading-relaxed">
          <strong className="font-semibold text-[#1B382B]">Contest voting policy:</strong> Maximum 5 votes per voter per calendar day across all entries (resets at midnight IST).
        </div>

        {/* In-Hero "Got a baby too?" Bridge Card */}
        <div className="mt-2 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#D4E865]/20 via-[#FAF8F5] to-[#D4E865]/10 border border-[#D4E865]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#1B382B] flex items-center gap-1.5">
              <span>👶</span>
              <span>Inspired by {entry.displayName}?</span>
            </p>
            <p className="text-[11px] text-[#4A5D52] mt-0.5">
              Enter your baby into the contest • 100% Free
            </p>
          </div>
          <Link
            href={`/contests/${entry.contestSlug}/submit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#1B382B] bg-[#D4E865] hover:bg-[#C7DC58] hover:-translate-y-0.5 active:scale-95 transition-all shadow-2xs shrink-0 group"
          >
            <span>Enter contest</span>
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
