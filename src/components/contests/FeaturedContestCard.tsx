import Link from "next/link";
import { Contest } from "@/types/contest";
import { getContestDateLabel } from "@/lib/contests/format";
import { ContestCoverImage } from "./ContestCoverImage";
import { ContestStatusBadge } from "./ContestStatusBadge";

interface FeaturedContestCardProps {
  contest: Contest;
}

export function FeaturedContestCard({ contest }: FeaturedContestCardProps) {
  const dateLabel = getContestDateLabel(contest);

  return (
    <article className="group w-full rounded-3xl bg-white border border-[#EFECE4] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Cover Image (~45% on Desktop) */}
        <div className="lg:col-span-5 w-full">
          <ContestCoverImage contest={contest} className="aspect-[16/10] sm:aspect-[16/9]" />
        </div>

        {/* Content (~55% on Desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-between items-start">
          <div className="w-full">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#D4E865] text-[#1B382B] shadow-xs">
                Featured Contest
              </span>
              <ContestStatusBadge status={contest.status} />
              {dateLabel && (
                <span className="text-xs font-semibold text-[#5A6D61] ml-auto">
                  {dateLabel}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1B382B] group-hover:text-[#234E3D] transition-colors duration-200 mb-3 tracking-tight">
              <Link
                href={`/contests/${contest.slug}`}
                className="focus-visible:outline-none focus-visible:underline"
              >
                {contest.title}
              </Link>
            </h3>

            {/* Description */}
            <p className="text-base text-[#4A5D52] leading-relaxed mb-6">
              {contest.shortDescription}
            </p>
          </div>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#F5F2EA] w-full">
            <Link
              href={`/contests/${contest.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md group/btn"
            >
              <span>View Contest</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <span className="text-xs text-[#5A6D61] font-medium">
              Accepting submissions & community votes
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
