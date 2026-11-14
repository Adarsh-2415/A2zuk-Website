-- =============================================================================
-- A2ZUK Phase 1: Initial Database Schema, Integrity Triggers & RPC Functions
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. Core Tables
-- -----------------------------------------------------------------------------

CREATE TABLE public.contests (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'upcoming', 'ended')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  cover_image text NOT NULL,
  accent text NOT NULL CHECK (accent IN ('hero', 'peach', 'lavender', 'sage')),
  is_featured boolean NOT NULL DEFAULT false,
  prize_pool integer CHECK (prize_pool IS NULL OR prize_pool >= 0),
  total_winners integer CHECK (total_winners IS NULL OR total_winners >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_contest_dates CHECK (end_date >= start_date)
);

CREATE TABLE public.contest_prizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id text NOT NULL REFERENCES public.contests(id) ON DELETE RESTRICT,
  rank_from integer NOT NULL CHECK (rank_from >= 1),
  rank_to integer NOT NULL CHECK (rank_to >= rank_from),
  label text NOT NULL,
  amount_inr integer NOT NULL CHECK (amount_inr >= 0),
  badge text,
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contest_id, display_order)
);

CREATE TABLE public.admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  role text NOT NULL DEFAULT 'moderator' CHECK (role IN ('moderator', 'super_admin')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id text NOT NULL REFERENCES public.contests(id) ON DELETE RESTRICT,
  public_code text NOT NULL UNIQUE,
  baby_name text NOT NULL,
  age_category text NOT NULL CHECK (age_category IN ('under-6-months', 'under-12-months', 'up-to-24-months')),
  city text NOT NULL,
  state text NOT NULL,
  caption text NOT NULL,
  pending_photo_path text NOT NULL,
  public_photo_path text,
  photo_sync_status text NOT NULL DEFAULT 'synced' CHECK (photo_sync_status IN ('synced', 'pending_publish_copy', 'pending_unpublish_delete')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected', 'flagged', 'removed')),
  vote_count integer NOT NULL DEFAULT 0 CHECK (vote_count >= 0),
  reviewed_by uuid REFERENCES public.admin_profiles(id) ON DELETE RESTRICT,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contest_winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id text NOT NULL REFERENCES public.contests(id) ON DELETE RESTRICT,
  entry_id uuid NOT NULL REFERENCES public.entries(id) ON DELETE RESTRICT,
  rank integer NOT NULL CHECK (rank >= 1),
  prize_amount_inr integer NOT NULL CHECK (prize_amount_inr >= 0),
  announced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contest_id, rank),
  UNIQUE (contest_id, entry_id)
);

CREATE TABLE public.entry_private_details (
  entry_id uuid PRIMARY KEY REFERENCES public.entries(id) ON DELETE RESTRICT,
  guardian_name text,
  guardian_email text,
  guardian_phone text,
  child_dob date,
  consent_guardian boolean NOT NULL,
  consent_sharing boolean NOT NULL,
  consent_rules boolean NOT NULL,
  consent_ip_hash text NOT NULL,
  consented_at timestamptz NOT NULL DEFAULT now(),
  purged_at timestamptz,
  purge_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_entry_pii_state CHECK (
    (
      purged_at IS NULL
      AND guardian_name IS NOT NULL
      AND guardian_email IS NOT NULL
      AND guardian_phone IS NOT NULL
      AND child_dob IS NOT NULL
    )
    OR
    (
      purged_at IS NOT NULL
      AND guardian_name IS NULL
      AND guardian_email IS NULL
      AND guardian_phone IS NULL
      AND child_dob IS NULL
    )
  )
);

CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES public.entries(id) ON DELETE RESTRICT,
  contest_id text NOT NULL REFERENCES public.contests(id) ON DELETE RESTRICT,
  voter_token_hash text NOT NULL,
  ip_hash text NOT NULL,
  user_agent_hash text,
  vote_date_ist date NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Kolkata')::date),
  status text NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'quarantined', 'invalidated')),
  quarantine_reason text,
  reviewed_by uuid REFERENCES public.admin_profiles(id) ON DELETE RESTRICT,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entry_id, voter_token_hash, vote_date_ist)
);

CREATE TABLE public.entry_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES public.entries(id) ON DELETE RESTRICT,
  reason text NOT NULL,
  details text,
  reporter_ip_hash text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'dismissed', 'action_taken')),
  reviewed_by uuid REFERENCES public.admin_profiles(id) ON DELETE RESTRICT,
  reviewed_at timestamptz,
  resolution_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.admin_profiles(id) ON DELETE RESTRICT,
  actor_email text,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 2. Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_contest_prizes_contest_order
  ON public.contest_prizes (contest_id, display_order);

CREATE INDEX idx_entries_contest_status_votes
  ON public.entries (contest_id, status, vote_count DESC, created_at DESC);

CREATE INDEX idx_entries_photo_sync_status
  ON public.entries (photo_sync_status)
  WHERE photo_sync_status <> 'synced';

CREATE INDEX idx_votes_voter_date
  ON public.votes (voter_token_hash, vote_date_ist);

CREATE INDEX idx_votes_entry_status
  ON public.votes (entry_id, status);

CREATE INDEX idx_votes_ip_date
  ON public.votes (ip_hash, vote_date_ist);

CREATE INDEX idx_entry_reports_status_created
  ON public.entry_reports (status, created_at DESC);

CREATE INDEX idx_audit_logs_target
  ON public.audit_logs (target_type, target_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 3. Timestamp & Integrity Trigger Functions
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_contests_updated_at
  BEFORE UPDATE ON public.contests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_entries_updated_at
  BEFORE UPDATE ON public.entries
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.guard_entries_vote_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.vote_count IS DISTINCT FROM OLD.vote_count
     AND COALESCE(current_setting('app.allow_vote_count_mutation', true), '') <> 'true' THEN
    RAISE EXCEPTION 'Direct modification of entries.vote_count is forbidden. Use vote ledger RPCs.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_guard_entries_vote_count
  BEFORE UPDATE ON public.entries
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_entries_vote_count();

CREATE OR REPLACE FUNCTION public.guard_last_super_admin()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_remaining_super_admins integer;
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.role = 'super_admin' AND OLD.is_active THEN
      SELECT count(*) INTO v_remaining_super_admins
      FROM public.admin_profiles
      WHERE role = 'super_admin' AND is_active = true AND id <> OLD.id;

      IF v_remaining_super_admins = 0 THEN
        RAISE EXCEPTION 'Cannot delete the last active super_admin.';
      END IF;
    END IF;
    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.role = 'super_admin' AND OLD.is_active
       AND (NEW.role <> 'super_admin' OR NOT NEW.is_active) THEN
      SELECT count(*) INTO v_remaining_super_admins
      FROM public.admin_profiles
      WHERE role = 'super_admin' AND is_active = true AND id <> OLD.id;

      IF v_remaining_super_admins = 0 THEN
        RAISE EXCEPTION 'Cannot deactivate or demote the last active super_admin.';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_guard_last_super_admin
  BEFORE UPDATE OR DELETE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_last_super_admin();

-- -----------------------------------------------------------------------------
-- 4. RLS Helper & Privileged RPC Functions
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_active_admin(required_role text DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles ap
    WHERE ap.id = auth.uid()
      AND ap.is_active = true
      AND (
        required_role IS NULL
        OR ap.role = required_role
        OR ap.role = 'super_admin'
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.cast_vote(
  p_entry_id uuid,
  p_voter_token_hash text,
  p_ip_hash text,
  p_user_agent_hash text DEFAULT NULL,
  p_initial_status text DEFAULT 'valid',
  p_quarantine_reason text DEFAULT NULL
)
RETURNS TABLE (
  vote_id uuid,
  vote_status text,
  vote_date_ist date,
  votes_used_today integer,
  votes_remaining_today integer,
  new_vote_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_vote_date_ist date := (now() AT TIME ZONE 'Asia/Kolkata')::date;
  v_contest_id text;
  v_contest_status text;
  v_contest_start date;
  v_contest_end date;
  v_entry_status text;
  v_current_vote_count integer;
  v_votes_today integer;
  v_inserted_vote_id uuid;
BEGIN
  IF p_initial_status NOT IN ('valid', 'quarantined') THEN
    RAISE EXCEPTION 'Invalid initial vote status: %', p_initial_status;
  END IF;

  -- Serialize concurrent vote requests for the same voter + IST calendar day.
  PERFORM pg_advisory_xact_lock(
    hashtextextended('voter:' || p_voter_token_hash || ':' || v_vote_date_ist::text, 0)
  );

  SELECT e.contest_id, e.status, e.vote_count, c.status, c.start_date, c.end_date
  INTO v_contest_id, v_entry_status, v_current_vote_count, v_contest_status, v_contest_start, v_contest_end
  FROM public.entries e
  JOIN public.contests c ON c.id = e.contest_id
  WHERE e.id = p_entry_id
  FOR UPDATE OF e;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Entry not found.';
  END IF;

  IF v_entry_status <> 'published' THEN
    RAISE EXCEPTION 'Entry is not open for voting.';
  END IF;

  IF v_contest_status <> 'active' OR v_vote_date_ist < v_contest_start OR v_vote_date_ist > v_contest_end THEN
    RAISE EXCEPTION 'Contest is not active for voting.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.votes v
    WHERE v.entry_id = p_entry_id
      AND v.voter_token_hash = p_voter_token_hash
      AND v.vote_date_ist = v_vote_date_ist
  ) THEN
    RAISE EXCEPTION 'Already voted for this entry today (IST).';
  END IF;

  SELECT count(*)::integer
  INTO v_votes_today
  FROM public.votes v
  WHERE v.voter_token_hash = p_voter_token_hash
    AND v.vote_date_ist = v_vote_date_ist
    AND v.status IN ('valid', 'quarantined');

  IF v_votes_today >= 5 THEN
    RAISE EXCEPTION 'Daily limit of 5 votes per voter (IST) reached.';
  END IF;

  INSERT INTO public.votes (
    entry_id,
    contest_id,
    voter_token_hash,
    ip_hash,
    user_agent_hash,
    vote_date_ist,
    status,
    quarantine_reason
  )
  VALUES (
    p_entry_id,
    v_contest_id,
    p_voter_token_hash,
    p_ip_hash,
    p_user_agent_hash,
    v_vote_date_ist,
    p_initial_status,
    p_quarantine_reason
  )
  RETURNING id INTO v_inserted_vote_id;

  IF p_initial_status = 'valid' THEN
    PERFORM set_config('app.allow_vote_count_mutation', 'true', true);
    UPDATE public.entries
    SET vote_count = public.entries.vote_count + 1
    WHERE id = p_entry_id
    RETURNING public.entries.vote_count INTO v_current_vote_count;
  END IF;

  RETURN QUERY
  SELECT
    v_inserted_vote_id,
    p_initial_status,
    v_vote_date_ist,
    v_votes_today + 1,
    GREATEST(0, 5 - (v_votes_today + 1)),
    v_current_vote_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_review_vote(
  p_vote_id uuid,
  p_new_status text,
  p_admin_id uuid,
  p_reason text DEFAULT NULL
)
RETURNS TABLE (
  vote_id uuid,
  old_status text,
  new_status text,
  new_vote_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_entry_id uuid;
  v_old_status text;
  v_new_vote_count integer;
  v_admin_email text;
BEGIN
  IF p_new_status NOT IN ('valid', 'quarantined', 'invalidated') THEN
    RAISE EXCEPTION 'Invalid target vote status: %', p_new_status;
  END IF;

  SELECT ap.email INTO v_admin_email
  FROM public.admin_profiles ap
  WHERE ap.id = p_admin_id AND ap.is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Active admin profile required.';
  END IF;

  SELECT v.entry_id, v.status
  INTO v_entry_id, v_old_status
  FROM public.votes v
  WHERE v.id = p_vote_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Vote not found.';
  END IF;

  SELECT e.vote_count
  INTO v_new_vote_count
  FROM public.entries e
  WHERE e.id = v_entry_id
  FOR UPDATE;

  UPDATE public.votes
  SET status = p_new_status,
      quarantine_reason = COALESCE(p_reason, quarantine_reason),
      reviewed_by = p_admin_id,
      reviewed_at = now()
  WHERE id = p_vote_id;

  IF v_old_status = 'valid' AND p_new_status <> 'valid' THEN
    PERFORM set_config('app.allow_vote_count_mutation', 'true', true);
    UPDATE public.entries
    SET vote_count = GREATEST(0, public.entries.vote_count - 1)
    WHERE id = v_entry_id
    RETURNING public.entries.vote_count INTO v_new_vote_count;
  ELSIF v_old_status <> 'valid' AND p_new_status = 'valid' THEN
    PERFORM set_config('app.allow_vote_count_mutation', 'true', true);
    UPDATE public.entries
    SET vote_count = public.entries.vote_count + 1
    WHERE id = v_entry_id
    RETURNING public.entries.vote_count INTO v_new_vote_count;
  END IF;

  INSERT INTO public.audit_logs (
    actor_id,
    actor_email,
    action,
    target_type,
    target_id,
    metadata
  )
  VALUES (
    p_admin_id,
    v_admin_email,
    'vote.review',
    'vote',
    p_vote_id::text,
    jsonb_build_object(
      'entry_id', v_entry_id,
      'old_status', v_old_status,
      'new_status', p_new_status,
      'reason', p_reason
    )
  );

  RETURN QUERY
  SELECT p_vote_id, v_old_status, p_new_status, v_new_vote_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_moderate_entry(
  p_entry_id uuid,
  p_new_status text,
  p_admin_id uuid,
  p_public_photo_path text DEFAULT NULL,
  p_photo_sync_status text DEFAULT NULL,
  p_rejection_reason text DEFAULT NULL
)
RETURNS TABLE (
  entry_id uuid,
  old_status text,
  new_status text,
  photo_sync_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_old_status text;
  v_final_sync_status text;
  v_admin_email text;
BEGIN
  IF p_new_status NOT IN ('pending', 'published', 'rejected', 'flagged', 'removed') THEN
    RAISE EXCEPTION 'Invalid target entry status: %', p_new_status;
  END IF;

  IF p_photo_sync_status IS NOT NULL
     AND p_photo_sync_status NOT IN ('synced', 'pending_publish_copy', 'pending_unpublish_delete') THEN
    RAISE EXCEPTION 'Invalid photo_sync_status: %', p_photo_sync_status;
  END IF;

  SELECT ap.email INTO v_admin_email
  FROM public.admin_profiles ap
  WHERE ap.id = p_admin_id AND ap.is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Active admin profile required.';
  END IF;

  SELECT e.status
  INTO v_old_status
  FROM public.entries e
  WHERE e.id = p_entry_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Entry not found.';
  END IF;

  UPDATE public.entries
  SET status = p_new_status,
      public_photo_path = CASE
        WHEN p_new_status = 'published' THEN COALESCE(p_public_photo_path, public.entries.public_photo_path)
        WHEN p_new_status IN ('flagged', 'removed', 'rejected') THEN NULL
        ELSE public.entries.public_photo_path
      END,
      photo_sync_status = COALESCE(p_photo_sync_status, public.entries.photo_sync_status),
      reviewed_by = p_admin_id,
      reviewed_at = now(),
      rejection_reason = CASE
        WHEN p_rejection_reason IS NOT NULL THEN p_rejection_reason
        WHEN p_new_status = 'published' THEN NULL
        ELSE public.entries.rejection_reason
      END
  WHERE id = p_entry_id
  RETURNING public.entries.photo_sync_status INTO v_final_sync_status;

  INSERT INTO public.audit_logs (
    actor_id,
    actor_email,
    action,
    target_type,
    target_id,
    metadata
  )
  VALUES (
    p_admin_id,
    v_admin_email,
    'entry.moderate',
    'entry',
    p_entry_id::text,
    jsonb_build_object(
      'old_status', v_old_status,
      'new_status', p_new_status,
      'photo_sync_status', v_final_sync_status,
      'rejection_reason', p_rejection_reason
    )
  );

  RETURN QUERY
  SELECT p_entry_id, v_old_status, p_new_status, v_final_sync_status;
END;
$$;

CREATE OR REPLACE FUNCTION public.purge_entry_pii(
  p_entry_id uuid,
  p_reason text,
  p_admin_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_admin_email text;
BEGIN
  IF p_admin_id IS NOT NULL THEN
    SELECT ap.email INTO v_admin_email
    FROM public.admin_profiles ap
    WHERE ap.id = p_admin_id AND ap.is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Active admin profile required when p_admin_id is provided.';
    END IF;
  END IF;

  UPDATE public.entry_private_details
  SET guardian_name = NULL,
      guardian_email = NULL,
      guardian_phone = NULL,
      child_dob = NULL,
      purged_at = now(),
      purge_reason = p_reason
  WHERE entry_id = p_entry_id
    AND purged_at IS NULL;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  INSERT INTO public.audit_logs (
    actor_id,
    actor_email,
    action,
    target_type,
    target_id,
    metadata
  )
  VALUES (
    p_admin_id,
    v_admin_email,
    'entry_pii.purge',
    'entry',
    p_entry_id::text,
    jsonb_build_object('reason', p_reason)
  );

  RETURN true;
END;
$$;

