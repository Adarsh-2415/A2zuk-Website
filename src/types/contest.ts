export type ContestStatus = "active" | "upcoming" | "ended";

export interface Contest {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  status: ContestStatus;
  startDate?: string; // ISO format e.g. "2026-10-01"
  endDate?: string;   // ISO format e.g. "2026-11-15"
  coverVariant: "peach" | "lavender" | "sage" | "hero";
  coverImageUrl?: string;
  isFeatured?: boolean;
  prizeStructure?: ContestPrizeStructure;
}

export interface PrizePosition {
  rank: string;
  title: string;
  amount: number;
  formattedAmount: string;
  winnersCount: number;
}

export interface ContestPrizeStructure {
  totalPool: number;
  formattedTotalPool: string;
  totalWinners: number;
  positions: PrizePosition[];
}
