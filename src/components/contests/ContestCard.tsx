import Link from "next/link";
import { Contest } from "@/types/contest";
import { getContestDateLabel } from "@/lib/contests/format";
import { ContestCoverImage } from "./ContestCoverImage";
import { ContestStatusBadge } from "./ContestStatusBadge";

interface ContestCardProps {
  contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
  const dateLabel = getContestDateLabel(contest);

  return (
    <article className="group h-full flex flex-col justify-between rounded-3xl bg-white border border-[#EFECE4] p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div>
        {/* 1. Cover Image (16:9 Aspect Ratio) */}
        <div className="mb-4">
          <ContestCoverImage contest={contest} />
        </div>

        {/* 2. Status Badge & Optional Featured Label */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <ContestStatusBadge status={contest.status} />
            {contest.prizeStructure && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D4E865] text-[#1B382B]">
                <span>🏆</span>
                <span>{contest.prizeStructure.formattedTotalPool}</span>
              </span>
            )}
          </div>

          {/* Date Label */}
          {dateLabel && (
            <span className="text-xs font-medium text-[#5A6D61]">
              {dateLabel}
            </span>
          )}
        </div>

        {/* 3. Contest Title (Max 2 lines clamped) */}
        <h3 className="text-lg sm:text-xl font-bold text-[#1B382B] group-hover:text-[#234E3D] transition-colors duration-200 line-clamp-2 mb-2 leading-snug">
          <Link
            href={`/contests/${contest.slug}`}
            className="focus-visible:outline-none focus-visible:underline"
          >
            {contest.title}
          </Link>
        </h3>

        {/* 4. Short Description (2-3 lines clamped) */}
        <p className="text-sm text-[#4A5D52] line-clamp-2 leading-relaxed mb-4">
          {contest.shortDescription}
        </p>
      </div>

      {/* 5. Card Footer & Details CTA */}
      <div className="pt-4 border-t border-[#F5F2EA] flex items-center justify-between">
        <span className="text-xs text-[#5A6D61]">
          {contest.status === "active" ? "Participation Open" : contest.status === "upcoming" ? "Coming Soon" : "Contest Closed"}
        </span>

        {/* 6. CTA Button */}
        <Link
          href={`/contests/${contest.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] active:scale-95 transition-all duration-200 shadow-sm group/btn"
          aria-label={`View details for ${contest.title}`}
        >
          <span>View Contest</span>
          <svg
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
