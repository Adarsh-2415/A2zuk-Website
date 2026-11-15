import { cacheLife } from "next/cache";
import type {
  BabyAgeCategory,
  PublicContestantEntry,
  ContestEntryDisplayResult,
} from "@/types/entry";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerUserClient } from "@/lib/supabase/server";

const PUBLIC_PHOTO_BUCKET = "contest-photos-public";
const PENDING_PHOTO_BUCKET = "contest-photos-pending";

const PUBLIC_ENTRY_COLUMNS = `
  id,
  contest_id,
  public_code,
  baby_name,
  age_category,
  city,
  state,
  caption,
  public_photo_path,
  vote_count,
  created_at
`;

interface PublicEntryRow {
  id: string;
  contest_id: string;
  public_code: string;
  baby_name: string;
  age_category: BabyAgeCategory;
  city: string;
  state: string;
  caption: string;
  public_photo_path: string | null;
  vote_count: number;
  created_at: string;
}

function buildPublicPhotoUrl(
  supabase: ReturnType<typeof createPublicClient>,
  publicPhotoPath: string | null,
): string | undefined {
  if (!publicPhotoPath || publicPhotoPath.trim() === "") {
    return undefined;
  }
  const { data } = supabase.storage
    .from(PUBLIC_PHOTO_BUCKET)
    .getPublicUrl(publicPhotoPath);
  return data.publicUrl;
}

function mapPublicEntry(
  supabase: ReturnType<typeof createPublicClient>,
  row: PublicEntryRow,
  contestSlug: string,
): PublicContestantEntry {
  return {
    slug: row.public_code,
    displayName: row.baby_name,
    ageCategory: row.age_category,
    contestSlug,
    photoUrl: buildPublicPhotoUrl(supabase, row.public_photo_path),
    photoAlt: `Contest photo of ${row.baby_name}`,
    publicDescription: row.caption,
    voteCount: row.vote_count,
  };
}

export async function getHomepagePublishedEntries(
  limit = 3,
): Promise<PublicContestantEntry[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("entries")
      .select(
        `
        ${PUBLIC_ENTRY_COLUMNS},
        contests!inner (
          slug
        )
      `,
      )
      .eq("status", "published")
      .order("vote_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error(
        "[getHomepagePublishedEntries] Supabase error:",
        error.message,
      );
      return [];
    }

    return (data ?? []).map((row) => {
      const typed = row as unknown as PublicEntryRow & {
        contests: { slug: string };
      };
      return mapPublicEntry(supabase, typed, typed.contests.slug);
    });
  } catch (err) {
    console.error("[getHomepagePublishedEntries] Unexpected error:", err);
    return [];
  }
}

export async function getPublicEntryByCode(
  contestSlug: string,
  entryCode: string,
): Promise<PublicContestantEntry | null> {
  "use cache";
  cacheLife("minutes");
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("entries")
      .select(
        `
        ${PUBLIC_ENTRY_COLUMNS},
        contests!inner (
          slug
        )
      `,
      )
      .eq("status", "published")
      .eq("public_code", entryCode)
      .eq("contests.slug", contestSlug)
      .maybeSingle();

    if (error) {
      console.error("[getPublicEntryByCode] Supabase error:", error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    const typed = data as unknown as PublicEntryRow & {
      contests: { slug: string };
    };
    return mapPublicEntry(supabase, typed, typed.contests.slug);
  } catch (err) {
    console.error("[getPublicEntryByCode] Unexpected error:", err);
    return null;
  }
}

/**
 * Resolves an entry for display on the contestant detail route.
 * 1. If published: returns public entry data and identifies whether caller is the parent owner.
 * 2. If pending & caller is the authenticated parent owner: creates a safe temporary signed URL from the pending bucket and marks isParentPreview: true, isOwner: true.
 * 3. If pending & caller is a stranger/unauthenticated: returns displayStatus: "pending_public_waiting" so no private data leaks.
 * 4. Otherwise: returns displayStatus: "not_found".
 */
export async function getContestEntryForViewer(
  contestSlug: string,
  entryCode: string,
): Promise<ContestEntryDisplayResult> {
  // Step 1: Check published entries
  try {
    const publicEntry = await getPublicEntryByCode(contestSlug, entryCode);
    if (publicEntry) {
      let isOwner = false;
      try {
        const userClient = await createServerUserClient();
        const {
          data: { user },
        } = await userClient.auth.getUser();
        if (user?.id) {
          const admin = createAdminClient();
          const { data: check } = await admin
            .from("entries")
            .select("user_id")
            .eq("public_code", entryCode)
            .maybeSingle();
          if (check?.user_id && check.user_id === user.id) {
            isOwner = true;
          }
        }
      } catch {
        isOwner = false;
      }

      return {
        entry: {
          ...publicEntry,
          status: "published",
          isOwner,
        },
        displayStatus: "published",
        isOwner,
      };
    }
  } catch {
    // If public fetch errored, proceed to check pending owner state
  }

  // Step 2: Check database for pending entry
  try {
    const admin = createAdminClient();
    const { data: rawEntry } = await admin
      .from("entries")
      .select(
        `
        id,
        contest_id,
        public_code,
        baby_name,
        age_category,
        city,
        state,
        caption,
        pending_photo_path,
        public_photo_path,
        vote_count,
        status,
        user_id,
        contests!inner (
          slug
        )
      `,
      )
      .eq("public_code", entryCode)
      .eq("contests.slug", contestSlug)
      .maybeSingle();

    if (!rawEntry) {
      return {
        entry: null,
        displayStatus: "not_found",
        isOwner: false,
      };
    }

    // If entry status is pending, verify if caller is the authenticated parent owner
    if (rawEntry.status === "pending") {
      let currentUserId: string | null = null;
      try {
        const userClient = await createServerUserClient();
        const {
          data: { user },
        } = await userClient.auth.getUser();
        currentUserId = user?.id ?? null;
      } catch {
        currentUserId = null;
      }

      const isOwner = Boolean(
        currentUserId && rawEntry.user_id && currentUserId === rawEntry.user_id,
      );

      if (isOwner) {
        // Generate secure 15-minute signed URL from private bucket
        let signedPhotoUrl: string | undefined = undefined;
        if (rawEntry.pending_photo_path) {
          const { data: signed } = await admin.storage
            .from(PENDING_PHOTO_BUCKET)
            .createSignedUrl(rawEntry.pending_photo_path, 900); // 15 mins
          signedPhotoUrl = signed?.signedUrl;
        }

        return {
          entry: {
            slug: rawEntry.public_code,
            displayName: rawEntry.baby_name,
            ageCategory: rawEntry.age_category,
            contestSlug,
            photoUrl: signedPhotoUrl,
            photoAlt: `Private preview photo of ${rawEntry.baby_name}`,
            publicDescription: rawEntry.caption,
            voteCount: rawEntry.vote_count,
            status: "pending",
            isParentPreview: true,
            isOwner: true,
          },
          displayStatus: "pending_parent_preview",
          isOwner: true,
        };
      }

      // Safe state for unauthenticated or non-parent viewers
      return {
        entry: null,
        displayStatus: "pending_public_waiting",
        isOwner: false,
      };
    }

    // Non-published, non-pending statuses (e.g. rejected or removed)
    return {
      entry: null,
      displayStatus: "not_found",
      isOwner: false,
    };
  } catch (err) {
    console.error("[getContestEntryForViewer] Error checking pending entry:", err);
    return {
      entry: null,
      displayStatus: "not_found",
      isOwner: false,
    };
  }
}

export async function getPublishedEntryParams(): Promise<
  { slug: string; entrySlug: string }[]
> {
  "use cache";
  cacheLife("minutes");
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("entries")
      .select(
        `
        public_code,
        contests!inner (
          slug
        )
      `,
      )
      .eq("status", "published")
      .limit(50);

    if (error || !data) return [];

    return data.map((row) => {
      const typed = row as unknown as {
        public_code: string;
        contests: { slug: string };
      };
      return {
        slug: typed.contests.slug,
        entrySlug: typed.public_code,
      };
    });
  } catch {
    return [];
  }
}

export interface GalleryEntryItem extends PublicContestantEntry {
  createdAt: string;
}

export async function getPublishedEntriesByContest(
  contestId: string,
  contestSlug: string,
  limit = 60,
): Promise<GalleryEntryItem[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("entries")
      .select(PUBLIC_ENTRY_COLUMNS)
      .eq("contest_id", contestId)
      .eq("status", "published")
      .order("vote_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error(
        "[getPublishedEntriesByContest] Supabase error:",
        error.message,
      );
      return [];
    }

    return (data ?? []).map((row) => {
      const typed = row as unknown as PublicEntryRow;
      return {
        ...mapPublicEntry(supabase, typed, contestSlug),
        createdAt: typed.created_at,
      };
    });
  } catch (err) {
    console.error("[getPublishedEntriesByContest] Unexpected error:", err);
    return [];
  }
}

