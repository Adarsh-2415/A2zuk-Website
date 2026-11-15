export type BabyAgeCategory =
  | "under-6-months"
  | "under-12-months"
  | "up-to-24-months";

export interface SubmissionFormData {
  guardianName: string;
  email: string;
  phone: string;
  addressStreet: string;
  city: string;
  state: string;
  pincode: string;
  childDisplayName: string;
  childDateOfBirth: string;
  ageCategory: BabyAgeCategory | "";
  photo: File | null;
  consentGuardian: boolean;
  consentSharing: boolean;
  consentRules: boolean;
}

export type SubmissionFormErrors = Partial<Record<keyof SubmissionFormData, string>>;

export type PhotoValidationError =
  | "FILE_TOO_LARGE"
  | "INVALID_FORMAT"
  | "EMPTY_FILE"
  | null;

export type EntryStatus = "pending" | "published" | "rejected" | "flagged" | "removed";

export interface PublicContestantEntry {
  slug: string;
  displayName: string;
  ageCategory: BabyAgeCategory;
  contestSlug: string;
  photoUrl?: string;
  photoAlt?: string;
  publicDescription?: string;
  voteCount?: number | null;
  status?: EntryStatus;
  isParentPreview?: boolean;
  isOwner?: boolean;
}

export type EntryDisplayStatus =
  | "published"
  | "pending_parent_preview"
  | "pending_public_waiting"
  | "not_found";

export interface ContestEntryDisplayResult {
  entry: PublicContestantEntry | null;
  displayStatus: EntryDisplayStatus;
  isOwner?: boolean;
}

