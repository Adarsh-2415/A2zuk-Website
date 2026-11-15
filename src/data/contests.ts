import { Contest, ContestStatus } from "@/types/contest";

/**
 * Authoritative contest records for A2ZUK.
 * Real contest records are preserved; demonstration cycles are isolated
 * to verify lifecycle states (active, upcoming, ended) and sorting rules.
 */
export const CONTESTS: Contest[] = [
  {
    id: "contest-001",
    slug: "baby-photo-contest-1",
    title: "Baby Photo Contest #1",
    shortDescription:
      "Celebrate your little one's big story. Share their happiest smile, let your community cheer them on, and participate in our inaugural online baby photo contest.",
    status: "active",
    startDate: "2026-10-01",
    endDate: "2026-11-15",
    coverVariant: "peach",
    isFeatured: true,
    prizeStructure: {
      totalPool: 27500,
      formattedTotalPool: "₹27,500",
      totalWinners: 13,
      positions: [
        {
          rank: "1st Place",
          title: "Grand Winner",
          amount: 10000,
          formattedAmount: "₹10,000",
          winnersCount: 1,
        },
        {
          rank: "2nd Place",
          title: "1st Runner-Up",
          amount: 5000,
          formattedAmount: "₹5,000",
          winnersCount: 1,
        },
        {
          rank: "3rd Place",
          title: "2nd Runner-Up",
          amount: 2500,
          formattedAmount: "₹2,500",
          winnersCount: 1,
        },
        {
          rank: "4th – 13th Place",
          title: "Top 10 Finalists",
          amount: 1000,
          formattedAmount: "₹1,000 each",
          winnersCount: 10,
        },
      ],
    },
  },
];

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
    archived: 4,
  };

  return [...contests].sort((a, b) => {
    // 1. Group by status priority
    const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
    if (priorityDiff !== 0) return priorityDiff;

    // 2. Intra-status sorting with safe date handling
    if (a.status === "active") {
      // Earliest ending date first
      if (!a.endDate && !b.endDate) return 0;
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    }

    if (a.status === "upcoming") {
      // Earliest starting date first
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }

    if (a.status === "ended") {
      // Most recently ended first (latest endDate first)
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
  if (contest.status === "active") {
    return "";
  }
  if (contest.status === "upcoming" && contest.startDate) {
    return `Starts ${formatContestDate(contest.startDate)}`;
  }
  if (contest.status === "ended" && contest.endDate) {
    return `Ended ${formatContestDate(contest.endDate)}`;
  }
  return "";
}
