-- =============================================================================
-- A2ZUK: Link Entries and Votes to Verified Google Accounts (auth.users)
-- =============================================================================

-- 1. Add user_id column to entries (tracks guardian Google account ownership)
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_entries_user_id
  ON public.entries (user_id);

-- 2. Add user_id column to votes (enforces 1-person-5-votes/day IST at DB level)
ALTER TABLE public.votes
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT;

-- Make voter_token_hash optional now that verified user_id is the primary identity
ALTER TABLE public.votes
  ALTER COLUMN voter_token_hash DROP NOT NULL;

-- Enforce strictly 1 vote per user per entry per IST calendar day
CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_entry_user_date
  ON public.votes (entry_id, user_id, vote_date_ist)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_votes_user_date
  ON public.votes (user_id, vote_date_ist)
  WHERE user_id IS NOT NULL;

-- 3. Update submit_entry RPC to accept and record verified parent user_id
CREATE OR REPLACE FUNCTION public.submit_entry(
  p_contest_slug text,
  p_public_code text,
  p_baby_name text,
  p_age_category text,
  p_city text,
  p_state text,
  p_caption text,
  p_pending_photo_path text,
  p_guardian_name text,
  p_guardian_email text,
  p_guardian_phone text,
  p_child_dob date,
  p_consent_guardian boolean,
  p_consent_sharing boolean,
  p_consent_rules boolean,
  p_consent_ip_hash text,
  p_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  entry_id uuid,
  public_code text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_today_ist date := (now() AT TIME ZONE 'Asia/Kolkata')::date;
  v_contest_id text;
  v_contest_status text;
  v_contest_start date;
  v_contest_end date;
  v_entry_id uuid;
BEGIN
  IF NOT p_consent_guardian OR NOT p_consent_sharing OR NOT p_consent_rules THEN
    RAISE EXCEPTION 'All parent/guardian consents are required.';
  END IF;

  IF p_age_category NOT IN ('under-6-months', 'under-12-months', 'up-to-24-months') THEN
    RAISE EXCEPTION 'Invalid age category: %', p_age_category;
  END IF;

  SELECT c.id, c.status, c.start_date, c.end_date
  INTO v_contest_id, v_contest_status, v_contest_start, v_contest_end
  FROM public.contests c
  WHERE c.slug = p_contest_slug;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contest not found.';
  END IF;

  IF v_contest_status <> 'active'
     OR v_today_ist < v_contest_start
     OR v_today_ist > v_contest_end THEN
    RAISE EXCEPTION 'Contest is not currently accepting submissions.';
  END IF;

  INSERT INTO public.entries (
    contest_id,
    public_code,
    baby_name,
    age_category,
    city,
    state,
    caption,
    pending_photo_path,
    public_photo_path,
    photo_sync_status,
    status,
    vote_count,
    user_id
  )
  VALUES (
    v_contest_id,
    p_public_code,
    p_baby_name,
    p_age_category,
    COALESCE(p_city, ''),
    COALESCE(p_state, ''),
    COALESCE(p_caption, ''),
    p_pending_photo_path,
    NULL,
    'synced',
    'pending',
    0,
    p_user_id
  )
  RETURNING id INTO v_entry_id;

  INSERT INTO public.entry_private_details (
    entry_id,
    guardian_name,
    guardian_email,
    guardian_phone,
    child_dob,
    consent_guardian,
    consent_sharing,
    consent_rules,
    consent_ip_hash
  )
  VALUES (
    v_entry_id,
    p_guardian_name,
    p_guardian_email,
    p_guardian_phone,
    p_child_dob,
    p_consent_guardian,
    p_consent_sharing,
    p_consent_rules,
    p_consent_ip_hash
  );

  INSERT INTO public.audit_logs (
    actor_id,
    actor_email,
    action,
    target_type,
    target_id,
    metadata
  )
  VALUES (
    NULL,
    NULL,
    'entry.submitted',
    'entry',
    v_entry_id::text,
    jsonb_build_object(
      'contest_id', v_contest_id,
      'public_code', p_public_code,
      'age_category', p_age_category,
      'user_id', p_user_id
    )
  );

  RETURN QUERY
  SELECT v_entry_id, p_public_code, 'pending'::text;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_entry(
  text, text, text, text, text, text, text, text, text, text, text, date, boolean, boolean, boolean, text, uuid
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.submit_entry(
  text, text, text, text, text, text, text, text, text, text, text, date, boolean, boolean, boolean, text, uuid
) TO service_role;

-- 4. Update cast_vote RPC to enforce 5 votes/day IST strictly by verified user_id
CREATE OR REPLACE FUNCTION public.cast_vote(
  p_entry_id uuid,
  p_voter_token_hash text,
  p_ip_hash text,
  p_user_agent_hash text DEFAULT NULL,
  p_initial_status text DEFAULT 'valid',
  p_quarantine_reason text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
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
  v_lock_key text;
BEGIN
  IF p_initial_status NOT IN ('valid', 'quarantined') THEN
    RAISE EXCEPTION 'Invalid initial vote status: %', p_initial_status;
  END IF;

  -- Build serialization lock key: prefer verified user_id, fallback to voter_token_hash
  IF p_user_id IS NOT NULL THEN
    v_lock_key := 'voter_uid:' || p_user_id::text || ':' || v_vote_date_ist::text;
  ELSE
    v_lock_key := 'voter:' || COALESCE(p_voter_token_hash, 'anon') || ':' || v_vote_date_ist::text;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(v_lock_key, 0));

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

  -- Duplicate check for today (IST)
  IF p_user_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.votes v
      WHERE v.entry_id = p_entry_id
        AND v.user_id = p_user_id
        AND v.vote_date_ist = v_vote_date_ist
    ) THEN
      RAISE EXCEPTION 'Already voted for this entry today (IST).';
    END IF;

    SELECT count(*)::integer
    INTO v_votes_today
    FROM public.votes v
    WHERE v.user_id = p_user_id
      AND v.vote_date_ist = v_vote_date_ist
      AND v.status IN ('valid', 'quarantined');
  ELSE
    IF EXISTS (
      SELECT 1 FROM public.votes v
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
  END IF;

  IF v_votes_today >= 5 THEN
    RAISE EXCEPTION 'Daily limit of 5 votes per voter (IST) reached.';
  END IF;

  INSERT INTO public.votes (
    entry_id,
    contest_id,
    voter_token_hash,
    user_id,
    ip_hash,
    user_agent_hash,
    vote_date_ist,
    status,
    quarantine_reason
  )
  VALUES (
    p_entry_id,
    v_contest_id,
    COALESCE(p_voter_token_hash, 'oauth_verified'),
    p_user_id,
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

REVOKE ALL ON FUNCTION public.cast_vote(
  uuid, text, text, text, text, text, uuid
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.cast_vote(
  uuid, text, text, text, text, text, uuid
) TO service_role;

