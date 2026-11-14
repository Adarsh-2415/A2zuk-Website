import { ContestPrizeStructure } from "@/types/contest";

interface PrizePoolSectionProps {
  prizeStructure: ContestPrizeStructure;
  className?: string;
}

export function PrizePoolSection({
  prizeStructure,
  className = "",
}: PrizePoolSectionProps) {
  const first = prizeStructure.positions.find((p) => p.rank.includes("1st"));
  const second = prizeStructure.positions.find((p) => p.rank.includes("2nd"));
  const third = prizeStructure.positions.find((p) => p.rank.includes("3rd"));
  const finalists = prizeStructure.positions.find((p) => p.rank.includes("4th"));

  return (
    <section
      aria-labelledby="prizes-heading"
      className={`w-full rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-6 sm:p-10 lg:p-12 shadow-xs ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#234E3D]/10 text-[#234E3D] border border-[#234E3D]/15 mb-3">
            <span>🏆</span>
            <span>Awards &amp; Recognition</span>
          </span>
          <h2
            id="prizes-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B382B] tracking-tight"
          >
            {prizeStructure.formattedTotalPool} Prize Pool
          </h2>
          <p className="text-sm sm:text-base text-[#5A6D61] mt-1.5">
            Recognising {prizeStructure.totalWinners} winning positions in this contest cycle.
          </p>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#D4E865] text-[#1B382B]">
            {prizeStructure.totalWinners} Winning Positions
          </span>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {/* 1st Place Card */}
        {first && (
          <div className="p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D4E865]/25 via-[#FAF8F5] to-white border-2 border-[#D4E865] shadow-xs flex flex-col justify-between order-1 md:order-2">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4E865] text-[#1B382B]">
                {first.rank}
              </span>
              <span className="text-2xl select-none" aria-hidden="true">🥇</span>
            </div>
            <h3 className="text-sm font-bold text-[#234E3D] mb-1">
              {first.title}
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-[#1B382B] tracking-tight">
              {first.formattedAmount}
            </p>
            <p className="text-xs text-[#5A6D61] mt-2 font-medium">
              1 Winner
            </p>
          </div>
        )}

        {/* 2nd Place Card */}
        {second && (
          <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-[#EFECE4] shadow-xs flex flex-col justify-between order-2 md:order-1">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#234E3D]/10 text-[#234E3D]">
                {second.rank}
              </span>
              <span className="text-2xl select-none" aria-hidden="true">🥈</span>
            </div>
            <h3 className="text-sm font-bold text-[#234E3D] mb-1">
              {second.title}
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight">
              {second.formattedAmount}
            </p>
            <p className="text-xs text-[#5A6D61] mt-2 font-medium">
              1 Winner
            </p>
          </div>
        )}

        {/* 3rd Place Card */}
        {third && (
          <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-[#EFECE4] shadow-xs flex flex-col justify-between order-3">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#234E3D]/10 text-[#234E3D]">
                {third.rank}
              </span>
              <span className="text-2xl select-none" aria-hidden="true">🥉</span>
            </div>
            <h3 className="text-sm font-bold text-[#234E3D] mb-1">
              {third.title}
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight">
              {third.formattedAmount}
            </p>
            <p className="text-xs text-[#5A6D61] mt-2 font-medium">
              1 Winner
            </p>
          </div>
        )}
      </div>

      {/* Ranks 4th – 13th Strip */}
      {finalists && (
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-[#EFECE4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#EFECE4] flex items-center justify-center text-lg shrink-0 shadow-2xs">
              ⭐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#234E3D]/10 text-[#234E3D]">
                  {finalists.rank}
                </span>
                <span className="text-xs font-bold text-[#1B382B]">
                  {finalists.title}
                </span>
              </div>
              <p className="text-xs text-[#5A6D61] mt-1">
                10 positions awarded ₹1,000 each (₹10,000 subtotal)
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xl sm:text-2xl font-bold text-[#1B382B]">
              {finalists.formattedAmount}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
