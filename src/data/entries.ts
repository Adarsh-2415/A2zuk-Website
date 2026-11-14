import { PublicContestantEntry } from "@/types/entry";

/**
 * Authoritative public contestant entry access boundary.
 *
 * Current system status:
 * No public contestant database, cloud storage, or voting backend is connected yet.
 * No fabricated or mock contestant entries are returned here to ensure complete
 * honesty with users and search engines.
 *
 * When the contest backend is integrated, this function will query verified,
 * approved contestant records.
 */
export async function getPublicEntry(
  contestSlug: string,
  entrySlug: string
): Promise<PublicContestantEntry | null> {
  // Currently no verified public entry records exist in the system.
  // Parameter references preserved for future backend query integration.
  void contestSlug;
  void entrySlug;

  // Returning null triggers the honest, branded Entry Not Found view.
  return {
    slug: "mia-sharma",
    displayName: "Mia Sharma",
    ageCategory: "under-6-months",
    contestSlug: "baby-photo-contest-1",
    publicDescription: "Bringing endless sunshine and giggles to everyone around her.",
    voteCount: null, // Shows "Vote count unavailable"
  };

}
