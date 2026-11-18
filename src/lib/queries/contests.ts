import { cacheLife } from "next/cache";
import type {
  Contest,
  ContestPrizeStructure,
  PrizePosition,
} from "@/types/contest";
import type { Database } from "@/types/database";
import { formatInr, sortContests } from "@/lib/contests/format";
import { createPublicClient } from "@/lib/supabase/public";

type ContestRow = Database["public"]["Tables"]["contests"]["Row"];
type ContestPrizeRow = Database["public"]["Tables"]["contest_prizes"]["Row"];

interface ContestWithPrizesRow extends ContestRow {
  contest_prizes?: ContestPrizeRow[] | null;
}

export interface ContestWinnerSummary {
  id: string;
  rank: number;
  prizeAmountInr: number;
  formattedPrizeAmount: string;
  announcedAt: string;
  entry: {
    publicCode: string;
    displayName: string;
    city: string;
    state: string;
    voteCount: number;
    photoUrl?: string;
  };
}

function mapContestRow(row: ContestWithPrizesRow): Contest {
  const prizes = [...(row.contest_prizes ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );

  let prizeStructure: ContestPrizeStructure | undefined;
  if (
    row.prize_pool !== null &&
    row.total_winners !== null &&
    prizes.length > 0
  ) {
    const positions: PrizePosition[] = prizes.map((p) => ({
      rank: p.label,
      title: p.badge || p.label,
      amount: p.amount_inr,
      formattedAmount: formatInr(p.amount_inr),
      winnersCount: p.rank_to - p.rank_from + 1,
    }));

    prizeStructure = {
      totalPool: row.prize_pool,
      formattedTotalPool: formatInr(row.prize_pool),
      totalWinners: row.total_winners,
      positions,
    };
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.description,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    coverVariant: row.accent,
    coverImageUrl: row.cover_image,
    isFeatured: row.is_featured,
    prizeStructure,
  };
}

const CONTEST_SELECT = `
  id,
  slug,
  title,
  description,
  status,
  start_date,
  end_date,
  cover_image,
  accent,
  is_featured,
  prize_pool,
  total_winners,
  created_at,
  updated_at,
  contest_prizes (
    id,
    contest_id,
    rank_from,
    rank_to,
    label,
    amount_inr,
    badge,
    display_order,
    created_at
  )
`;

const DUMMY_CONTEST_SLUGS = new Set([
  "toddler-play-giggles",
  "little-explorers-dress-up",
  "newborn-first-smiles",
]);

export async function getPublicContests(): Promise<Contest[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("contests")
      .select(CONTEST_SELECT)
      .neq("status", "archived");

    if (error) {
      console.error("[getPublicContests] Supabase error:", error.message);
      return [];
    }

    const mapped = (data ?? [])
      .map((row) => mapContestRow(row as unknown as ContestWithPrizesRow))
      .filter(
        (c) =>
          !DUMMY_CONTEST_SLUGS.has(c.slug) &&
          c.status !== "archived",
      );

    return sortContests(mapped);
  } catch (err) {
    console.error("[getPublicContests] Unexpected error:", err);
    return [];
  }
}

export async function getFeaturedContest(): Promise<Contest | null> {
  "use cache";
  cacheLife("minutes");
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("contests")
    .select(CONTEST_SELECT)
    .eq("is_featured", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[getFeaturedContest] Supabase error:", error.message);
    return null;
  }

  if (!data) return null;
  return mapContestRow(data as unknown as ContestWithPrizesRow);
}

export async function getContestBySlug(slug: string): Promise<Contest | null> {
  "use cache";
  cacheLife("minutes");
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("contests")
    .select(CONTEST_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[getContestBySlug] Supabase error:", error.message);
    throw new Error("Unable to load contest details right now.");
  }

  if (!data) return null;
  return mapContestRow(data as unknown as ContestWithPrizesRow);
}

export async function getPublicContestSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("contests").select("slug");
    if (error || !data || data.length === 0) {
      return ["baby-photo-contest-1"];
    }
    const slugs = data
      .map((row) => row.slug)
      .filter((slug) => !DUMMY_CONTEST_SLUGS.has(slug));
    return slugs.length > 0 ? slugs : ["baby-photo-contest-1"];
  } catch {
    return ["baby-photo-contest-1"];
  }
}

export async function getContestWinners(
  contestId: string,
  contestStatus: Contest["status"],
): Promise<ContestWinnerSummary[]> {
  "use cache";
  cacheLife("minutes");
  if (contestStatus !== "ended") {
    return [];
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("contest_winners")
    .select(
      `
      id,
      rank,
      prize_amount_inr,
      announced_at,
      entries!inner (
        public_code,
        baby_name,
        city,
        state,
        vote_count,
        public_photo_path,
        status
      )
    `,
    )
    .eq("contest_id", contestId)
    .eq("entries.status", "published")
    .order("rank", { ascending: true });

  if (error) {
    console.error("[getContestWinners] Supabase error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const entry = row.entries as unknown as {
      public_code: string;
      baby_name: string;
      city: string;
      state: string;
      vote_count: number;
      public_photo_path: string | null;
    };

    let photoUrl: string | undefined;
    if (entry.public_photo_path && entry.public_photo_path.trim() !== "") {
      const { data: storageData } = supabase.storage
        .from("contest-photos-public")
        .getPublicUrl(entry.public_photo_path);
      photoUrl = storageData.publicUrl;
    }

    return {
      id: row.id,
      rank: row.rank,
      prizeAmountInr: row.prize_amount_inr,
      formattedPrizeAmount: formatInr(row.prize_amount_inr),
      announcedAt: row.announced_at,
      entry: {
        publicCode: entry.public_code,
        displayName: entry.baby_name,
        city: entry.city,
        state: entry.state,
        voteCount: entry.vote_count,
        photoUrl,
      },
    };
  });
}

