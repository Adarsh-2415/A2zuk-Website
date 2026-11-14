import { ContestStatus } from "@/types/contest";

interface ContestStatusBadgeProps {
  status: ContestStatus;
  className?: string;
}

export function ContestStatusBadge({ status, className = "" }: ContestStatusBadgeProps) {
  if (status === "active") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#234E3D]/10 text-[#234E3D] border border-[#234E3D]/20 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#234E3D] animate-pulse" aria-hidden="true" />
        Active
      </span>
    );
  }

  if (status === "upcoming") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#F8D7C8]/70 text-[#9A461E] border border-[#F2653B]/20 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F2653B]" aria-hidden="true" />
        Upcoming
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#EFECE4] text-[#5A6D61] border border-[#E5E0D5] ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#5A6D61]" aria-hidden="true" />
      Ended
    </span>
  );
}
