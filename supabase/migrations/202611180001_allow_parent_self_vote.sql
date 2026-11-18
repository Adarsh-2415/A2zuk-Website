-- Migration: Allow Parents to Vote for Their Own Child
-- File: supabase/migrations/202611180001_allow_parent_self_vote.sql

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
  v_entry_user_id uuid;
  v_current_vote_count integer;
  v_inserted_vote_id uuid;
  v_lock_key text;
BEGIN
  -- 1. Authentication Check: Voter MUST be authenticated with a verified Google account
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required. Please sign in with Google to cast your official vote.';
  END IF;

  IF p_initial_status NOT IN ('valid', 'quarantined') THEN
    RAISE EXCEPTION 'Invalid initial vote status: %', p_initial_status;
  END IF;

  -- 2. Fetch entry & contest details
  SELECT e.contest_id, e.status, e.user_id, e.vote_count, c.status, c.start_date, c.end_date
  INTO v_contest_id, v_entry_status, v_entry_user_id, v_current_vote_count, v_contest_status, v_contest_start, v_contest_end
  FROM public.entries e
  JOIN public.contests c ON c.id = e.contest_id
  WHERE e.id = p_entry_id
  FOR UPDATE OF e;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contestant entry not found.';
  END IF;

  -- 3. Serialization advisory lock per voter per entry to prevent rapid double-voting
  v_lock_key := 'voter_entry:' || p_user_id::text || ':' || p_entry_id::text;
  PERFORM pg_advisory_xact_lock(hashtextextended(v_lock_key, 0));

  IF v_entry_status <> 'published' THEN
    RAISE EXCEPTION 'Entry is currently under moderation and not open for voting.';
  END IF;

  IF v_contest_status <> 'active' OR v_vote_date_ist < v_contest_start OR v_vote_date_ist > v_contest_end THEN
    RAISE EXCEPTION 'Contest is not active for voting.';
  END IF;

  -- 4. 1 Vote Per Contestant Principle:
  -- Each verified Google account (including parents) can cast 1 vote per baby.
  IF EXISTS (
    SELECT 1 FROM public.votes v
    WHERE v.entry_id = p_entry_id
      AND v.user_id = p_user_id
      AND v.status IN ('valid', 'quarantined')
  ) THEN
    RAISE EXCEPTION 'You have already voted for this contestant. Each verified Google account can cast 1 vote per baby.';
  END IF;

  -- 5. Record vote
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
    COALESCE(p_voter_token_hash, 'voter_uid:' || p_user_id::text),
    p_user_id,
    p_ip_hash,
    p_user_agent_hash,
    v_vote_date_ist,
    p_initial_status,
    p_quarantine_reason
  )
  RETURNING id INTO v_inserted_vote_id;

  -- 6. Update entry vote count atomically (bypassing vote guard trigger safely)
  PERFORM set_config('app.allow_vote_count_mutation', 'true', true);

  UPDATE public.entries e
  SET vote_count = (
    SELECT count(*)::integer
    FROM public.votes v
    WHERE v.entry_id = p_entry_id
      AND v.status = 'valid'
  ),
  updated_at = now()
  WHERE e.id = p_entry_id;

  -- 7. Return response
  RETURN QUERY
  SELECT
    v_inserted_vote_id AS vote_id,
    p_initial_status AS vote_status,
    v_vote_date_ist AS vote_date_ist,
    1 AS votes_used_today,
    0 AS votes_remaining_today,
    (
      SELECT e.vote_count
      FROM public.entries e
      WHERE e.id = p_entry_id
    ) AS new_vote_count;
END;
$$;
