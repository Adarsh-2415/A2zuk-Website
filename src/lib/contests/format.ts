import type { Contest, ContestStatus } from "@/types/contest";

/**
 * Approved default sorting rule:
 * 1. Active contests (earliest ending date first)
 * 2. Upcoming contests (earliest starting date first)
 * 3. Ended contests (most recently ended first)
 */
export function sortContests(contests: Contest[]): Contest[] {
  const statusPriority: Record<ContestStatus, number> = {
    active: 1,
    upcoming: 2,
    ended: 3,
  };

  return [...contests].sort((a, b) => {
    const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
    if (priorityDiff !== 0) return priorityDiff;

    if (a.status === "active") {
      if (!a.endDate && !b.endDate) return 0;
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    }

    if (a.status === "upcoming") {
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }

    if (a.status === "ended") {
      if (!a.endDate && !b.endDate) return 0;
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    }

    return 0;
  });
}

/**
 * Formats an ISO date string into readable British English (e.g., "15 Nov 2026")
 */
export function formatContestDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Returns formatted status date display string
 */
export function getContestDateLabel(contest: Contest): string {
  if (contest.status === "active" && contest.endDate) {
    return `Ends ${formatContestDate(contest.endDate)}`;
  }
  if (contest.status === "upcoming" && contest.startDate) {
    return `Starts ${formatContestDate(contest.startDate)}`;
  }
  if (contest.status === "ended" && contest.endDate) {
    return `Ended ${formatContestDate(contest.endDate)}`;
  }
  return "";
}

/**
 * Formats an integer amount in INR (e.g. 27500 -> "₹27,500")
 */
export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

