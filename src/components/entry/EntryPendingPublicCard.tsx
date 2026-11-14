import Link from "next/link";
import type { Contest } from "@/types/contest";

interface EntryPendingPublicCardProps {
  contest: Contest;
  entrySlug: string;
}

export default function EntryPendingPublicCard({
  contest,
  entrySlug,
}: EntryPendingPublicCardProps) {
  return (
    <section
      role="region"
      aria-label="Contest entry under review"
      className="w-full rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-8 sm:p-12 text-center shadow-xs space-y-6 max-w-2xl mx-auto my-6"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F5] border border-[#EFECE4] flex items-center justify-center text-3xl shadow-2xs">
        ⏳
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
          Verification in Progress
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight">
          This entry is currently under review
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6D61] max-w-md mx-auto leading-relaxed">
          This contestant photo has been safely submitted and is being checked by our community moderators. Once approved, voting will open right here!
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] text-xs text-[#5A6D61] max-w-md mx-auto">
        <p>
          Are you the parent who submitted this entry? Please{" "}
          <Link
            href={`/contests/${contest.slug}/submit`}
            className="font-bold text-[#234E3D] underline"
          >
            sign in with your Google account
          </Link>{" "}
          to view your private live preview.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/contests/${contest.slug}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#234E3D] hover:bg-[#1A3B2E] text-white transition-all shadow-sm"
        >
          <span>Browse Active Contestants</span>
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
