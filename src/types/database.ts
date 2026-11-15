export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ContestStatus = "active" | "upcoming" | "ended" | "archived";
export type ContestAccent = "hero" | "peach" | "lavender" | "sage";
export type BabyAgeCategory =
  | "under-6-months"
  | "under-12-months"
  | "up-to-24-months";
export type EntryStatus =
  | "pending"
  | "published"
  | "rejected"
  | "flagged"
  | "removed";
export type PhotoSyncStatus =
  | "synced"
  | "pending_publish_copy"
  | "pending_unpublish_delete";
export type VoteStatus = "valid" | "quarantined" | "invalidated";
export type ReportStatus = "open" | "reviewed" | "dismissed" | "action_taken";
export type AdminRole = "moderator" | "super_admin";

export interface Database {
  public: {
    Tables: {
      contests: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          status: ContestStatus;
          start_date: string;
          end_date: string;
          cover_image: string;
          accent: ContestAccent;
          is_featured: boolean;
          prize_pool: number | null;
          total_winners: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          slug: string;
          title: string;
          description: string;
          status: ContestStatus;
          start_date: string;
          end_date: string;
          cover_image: string;
          accent: ContestAccent;
          is_featured?: boolean;
          prize_pool?: number | null;
          total_winners?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          status?: ContestStatus;
          start_date?: string;
          end_date?: string;
          cover_image?: string;
          accent?: ContestAccent;
          is_featured?: boolean;
          prize_pool?: number | null;
          total_winners?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contest_prizes: {
        Row: {
          id: string;
          contest_id: string;
          rank_from: number;
          rank_to: number;
          label: string;
          amount_inr: number;
          badge: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          contest_id: string;
          rank_from: number;
          rank_to: number;
          label: string;
          amount_inr: number;
          badge?: string | null;
          display_order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          contest_id?: string;
          rank_from?: number;
          rank_to?: number;
          label?: string;
          amount_inr?: number;
          badge?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contest_prizes_contest_id_fkey";
            columns: ["contest_id"];
            isOneToOne: false;
            referencedRelation: "contests";
            referencedColumns: ["id"];
          },
        ];
      };
      contest_winners: {
        Row: {
          id: string;
          contest_id: string;
          entry_id: string;
          rank: number;
          prize_amount_inr: number;
          announced_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contest_id: string;
          entry_id: string;
          rank: number;
          prize_amount_inr: number;
          announced_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          contest_id?: string;
          entry_id?: string;
          rank?: number;
          prize_amount_inr?: number;
          announced_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contest_winners_contest_id_fkey";
            columns: ["contest_id"];
            isOneToOne: false;
            referencedRelation: "contests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contest_winners_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: false;
            referencedRelation: "entries";
            referencedColumns: ["id"];
          },
        ];
      };
      entries: {
        Row: {
          id: string;
          contest_id: string;
          public_code: string;
          baby_name: string;
          age_category: BabyAgeCategory;
          city: string;
          state: string;
          caption: string;
          pending_photo_path: string;
          public_photo_path: string | null;
          photo_sync_status: PhotoSyncStatus;
          status: EntryStatus;
          vote_count: number;
          user_id: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contest_id: string;
          public_code: string;
          baby_name: string;
          age_category: BabyAgeCategory;
          city: string;
          state: string;
          caption: string;
          pending_photo_path: string;
          public_photo_path?: string | null;
          photo_sync_status?: PhotoSyncStatus;
          status?: EntryStatus;
          vote_count?: number;
          user_id?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contest_id?: string;
          public_code?: string;
          baby_name?: string;
          age_category?: BabyAgeCategory;
          city?: string;
          state?: string;
          caption?: string;
          pending_photo_path?: string;
          public_photo_path?: string | null;
          photo_sync_status?: PhotoSyncStatus;
          status?: EntryStatus;
          vote_count?: number;
          user_id?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entries_contest_id_fkey";
            columns: ["contest_id"];
            isOneToOne: false;
            referencedRelation: "contests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entries_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "admin_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      entry_private_details: {
        Row: {
          entry_id: string;
          guardian_name: string | null;
          guardian_email: string | null;
          guardian_phone: string | null;
          child_dob: string | null;
          consent_guardian: boolean;
          consent_sharing: boolean;
          consent_rules: boolean;
          consent_ip_hash: string;
          consented_at: string;
          purged_at: string | null;
          purge_reason: string | null;
          address_street: string | null;
          pincode: string | null;
          created_at: string;
        };
        Insert: {
          entry_id: string;
          guardian_name: string | null;
          guardian_email: string | null;
          guardian_phone: string | null;
          child_dob: string | null;
          consent_guardian: boolean;
          consent_sharing: boolean;
          consent_rules: boolean;
          consent_ip_hash: string;
          consented_at?: string;
          purged_at?: string | null;
          purge_reason?: string | null;
          address_street?: string | null;
          pincode?: string | null;
          created_at?: string;
        };
        Update: {
          entry_id?: string;
          guardian_name?: string | null;
          guardian_email?: string | null;
          guardian_phone?: string | null;
          child_dob?: string | null;
          consent_guardian?: boolean;
          consent_sharing?: boolean;
          consent_rules?: boolean;
          consent_ip_hash?: string;
          consented_at?: string;
          purged_at?: string | null;
          purge_reason?: string | null;
          address_street?: string | null;
          pincode?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entry_private_details_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: true;
            referencedRelation: "entries";
            referencedColumns: ["id"];
          },
        ];
      };
      votes: {
        Row: {
          id: string;
          entry_id: string;
          contest_id: string;
          user_id: string | null;
          voter_token_hash: string | null;
          ip_hash: string;
          user_agent_hash: string | null;
          vote_date_ist: string;
          status: VoteStatus;
          quarantine_reason: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          contest_id: string;
          user_id?: string | null;
          voter_token_hash?: string | null;
          ip_hash: string;
          user_agent_hash?: string | null;
          vote_date_ist?: string;
          status?: VoteStatus;
          quarantine_reason?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          entry_id?: string;
          contest_id?: string;
          user_id?: string | null;
          voter_token_hash?: string | null;
          ip_hash?: string;
          user_agent_hash?: string | null;
          vote_date_ist?: string;
          status?: VoteStatus;
          quarantine_reason?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "votes_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: false;
            referencedRelation: "entries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_contest_id_fkey";
            columns: ["contest_id"];
            isOneToOne: false;
            referencedRelation: "contests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "admin_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      entry_reports: {
        Row: {
          id: string;
          entry_id: string;
          reason: string;
          details: string | null;
          reporter_ip_hash: string;
          status: ReportStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          resolution_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          reason: string;
          details?: string | null;
          reporter_ip_hash: string;
          status?: ReportStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          resolution_note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          entry_id?: string;
          reason?: string;
          details?: string | null;
          reporter_ip_hash?: string;
          status?: ReportStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          resolution_note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entry_reports_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: false;
            referencedRelation: "entries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entry_reports_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "admin_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          role: AdminRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          role?: AdminRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          role?: AdminRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string | null;
          action: string;
          target_type: string;
          target_id: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          action: string;
          target_type: string;
          target_id: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          action?: string;
          target_type?: string;
          target_id?: string;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "admin_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_active_admin: {
        Args: {
          required_role?: string | null;
        };
        Returns: boolean;
      };
      cast_vote: {
        Args: {
          p_entry_id: string;
          p_voter_token_hash?: string | null;
          p_ip_hash: string;
          p_user_agent_hash?: string | null;
          p_initial_status?: VoteStatus;
          p_quarantine_reason?: string | null;
          p_user_id?: string | null;
        };
        Returns: {
          vote_id: string;
          vote_status: VoteStatus;
          vote_date_ist: string;
          votes_used_today: number;
          votes_remaining_today: number;
          new_vote_count: number;
        }[];
      };
      admin_review_vote: {
        Args: {
          p_vote_id: string;
          p_new_status: VoteStatus;
          p_admin_id: string;
          p_reason?: string | null;
        };
        Returns: {
          vote_id: string;
          old_status: VoteStatus;
          new_status: VoteStatus;
          new_vote_count: number;
        }[];
      };
      admin_moderate_entry: {
        Args: {
          p_entry_id: string;
          p_new_status: EntryStatus;
          p_admin_id: string;
          p_public_photo_path?: string | null;
          p_photo_sync_status?: PhotoSyncStatus | null;
          p_rejection_reason?: string | null;
        };
        Returns: {
          entry_id: string;
          old_status: EntryStatus;
          new_status: EntryStatus;
          photo_sync_status: PhotoSyncStatus;
        }[];
      };
      purge_entry_pii: {
        Args: {
          p_entry_id: string;
          p_reason: string;
          p_admin_id?: string | null;
        };
        Returns: boolean;
      };
      submit_entry: {
        Args: {
          p_contest_slug: string;
          p_public_code: string;
          p_baby_name: string;
          p_age_category: BabyAgeCategory;
          p_city: string;
          p_state: string;
          p_caption: string;
          p_pending_photo_path: string;
          p_guardian_name: string;
          p_guardian_email: string;
          p_guardian_phone: string;
          p_child_dob: string;
          p_consent_guardian: boolean;
          p_consent_sharing: boolean;
          p_consent_rules: boolean;
          p_consent_ip_hash: string;
          p_user_id?: string | null;
          p_address_street?: string | null;
          p_pincode?: string | null;
        };
        Returns: {
          entry_id: string;
          public_code: string;
          status: EntryStatus;
        }[];
      };
      run_pii_retention_purge: {
        Args: {
          p_rejected_days?: number;
          p_ended_days?: number;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

