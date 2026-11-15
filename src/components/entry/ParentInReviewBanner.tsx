import Link from "next/link";

interface ParentInReviewBannerProps {
  babyName: string;
  contestTitle: string;
  contestSlug: string;
}

export default function ParentInReviewBanner({
  babyName,
  contestTitle,
  contestSlug,
}: ParentInReviewBannerProps) {
  return (
    <div
      role="region"
      aria-label="Submission status notice"
      className="w-full rounded-2xl sm:rounded-3xl bg-linear-to-r from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FDE68A]/30 border-2 border-[#F59E0B]/40 p-5 sm:p-7 shadow-sm text-[#1B382B] space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#F59E0B]/20 text-[#B45309] flex items-center justify-center font-bold text-sm shrink-0">
            ⏳
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                Private Parent Preview
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                In Review
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1B382B] mt-0.5">
              {babyName}&apos;s entry is safely received!
            </h2>
          </div>
        </div>

        <Link
          href={`/contests/${contestSlug}`}
          className="self-start sm:self-auto text-xs font-bold text-[#B45309] hover:text-[#78350F] hover:underline"
        >
          View {contestTitle} →
        </Link>
      </div>

      <p className="text-xs sm:text-sm text-[#78350F] leading-relaxed">
        Our team is conducting a quick safety and quality review of your submission. As soon as it is approved, voting will unlock immediately and {babyName} will appear on the public contest leaderboard!
      </p>

      <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#92400E]">
        <span className="flex items-center gap-1.5">
          <span>🔒</span> Private to you while pending
        </span>
        <span className="flex items-center gap-1.5">
          <span>⚡</span> Fast 1-click email approval enabled
        </span>
        <span className="flex items-center gap-1.5">
          <span>🔒</span> Action buttons unlocked upon approval
        </span>
      </div>
    </div>
  );
}

