import "server-only";
import { createClient as createServerUserClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BabyAgeCategory, EntryStatus } from "@/types/entry";

const PUBLIC_PHOTO_BUCKET = "contest-photos-public";
const PENDING_PHOTO_BUCKET = "contest-photos-pending";

export interface UserProfileEntry {
  id: string;
  publicCode: string;
  babyName: string;
  ageCategory: BabyAgeCategory;
  city: string;
  state: string;
  status: EntryStatus;
  voteCount: number;
  photoUrl?: string;
  contestTitle: string;
  contestSlug: string;
  createdAt: string;
}

export interface UserProfilePayload {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
  };
  privateDetails?: {
    guardianName?: string | null;
    phone?: string | null;
    addressStreet?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
  } | null;
  entries: UserProfileEntry[];
}

export async function getUserProfileData(): Promise<UserProfilePayload | null> {
  const userClient = await createServerUserClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    return null;
  }

  const admin = createAdminClient();

  // Fetch entries submitted by this user
  const { data: rawEntries, error: entriesError } = await admin
    .from("entries")
    .select(`
      id,
      public_code,
      baby_name,
      age_category,
      city,
      state,
      status,
      vote_count,
      pending_photo_path,
      public_photo_path,
      created_at,
      contests!inner (
        title,
        slug
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (entriesError) {
    console.error("[getUserProfileData] Error fetching entries:", entriesError.message);
  }

  const entriesList = rawEntries ?? [];

  // Fetch private details from latest entry if available
  let privateDetails: UserProfilePayload["privateDetails"] = null;
  if (entriesList.length > 0) {
    const latestEntryId = entriesList[0].id;
    const { data: privRow } = await admin
      .from("entry_private_details")
      .select("guardian_name, guardian_phone, address_street, pincode")
      .eq("entry_id", latestEntryId)
      .maybeSingle();

    if (privRow) {
      privateDetails = {
        guardianName: privRow.guardian_name,
        phone: privRow.guardian_phone,
        addressStreet: privRow.address_street,
        city: entriesList[0].city,
        state: entriesList[0].state,
        pincode: privRow.pincode,
      };
    }
  }

  // Resolve photo URLs (signed for pending, public for published)
  const formattedEntries: UserProfileEntry[] = await Promise.all(
    entriesList.map(async (row) => {
      const contest = row.contests as { title: string; slug: string };
      let photoUrl: string | undefined = undefined;

      if (row.status === "published" && row.public_photo_path) {
        const { data: pubData } = admin.storage
          .from(PUBLIC_PHOTO_BUCKET)
          .getPublicUrl(row.public_photo_path);
        photoUrl = pubData.publicUrl;
      } else if (row.pending_photo_path) {
        const { data: signedData } = await admin.storage
          .from(PENDING_PHOTO_BUCKET)
          .createSignedUrl(row.pending_photo_path, 900); // 15 mins
        photoUrl = signedData?.signedUrl;
      }

      return {
        id: row.id,
        publicCode: row.public_code,
        babyName: row.baby_name,
        ageCategory: row.age_category as BabyAgeCategory,
        city: row.city,
        state: row.state,
        status: row.status as EntryStatus,
        voteCount: row.vote_count,
        photoUrl,
        contestTitle: contest.title,
        contestSlug: contest.slug,
        createdAt: row.created_at,
      };
    }),
  );

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Parent";

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return {
    user: {
      id: user.id,
      email: user.email ?? "",
      name: fullName,
      avatarUrl,
    },
    privateDetails,
    entries: formattedEntries,
  };
}

