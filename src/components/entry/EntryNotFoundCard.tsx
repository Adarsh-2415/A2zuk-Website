import Link from "next/link";
import { Contest } from "@/types/contest";

interface EntryNotFoundCardProps {
  contest: Contest;
  entrySlug: string;
}

export default function EntryNotFoundCard({
  contest,
  entrySlug,
}: EntryNotFoundCardProps) {
  return (
    <section
      aria-labelledby="entry-not-found-heading"
      className="w-full max-w-2xl mx-auto rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-8 sm:p-12 text-center shadow-xs my-6"
    >
      {/* Icon emblem */}
      <div
        className="w-16 h-16 rounded-full bg-[#F8D7C8]/40 border border-[#F8D7C8] flex items-center justify-center text-[#F2653B] mx-auto mb-5 select-none"
        aria-hidden="true"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 9v2m0 4h.01"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1
        id="entry-not-found-heading"
        className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight mb-3"
      >
        Contestant entry not found
      </h1>

      {/* Truthful message */}
      <p className="text-[#4A5D52] text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8">
        We couldn&apos;t find an entry matching <span className="font-semibold text-[#1B382B]">&ldquo;{entrySlug}&rdquo;</span> in {contest.title}. The link may be incorrect, or the entry may no longer be available.
      </p>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/contests/${contest.slug}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span>← Back to {contest.title}</span>
        </Link>

        <Link
          href="/contests"
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold text-[#5A6D61] hover:text-[#1B382B] hover:bg-black/[0.04] transition-colors"
        >
          <span>View all contests</span>
        </Link>
      </div>
    </section>
  );
}
