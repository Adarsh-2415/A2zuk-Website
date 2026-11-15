-- =============================================================================
-- A2ZUK Phase 3: Official Election Voting System ("One Person, One Vote Per Contest")
-- =============================================================================

-- 1. Deduplicate test votes from earlier testing (keep the earliest vote for each user in each contest)
DELETE FROM public.votes
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY contest_id, user_id
             ORDER BY created_at ASC
           ) as rnum
    FROM public.votes
    WHERE user_id IS NOT NULL
      AND status IN ('valid', 'quarantined')
  ) t
  WHERE t.rnum > 1
);

-- 2. Recalculate entry vote tallies to accurately reflect deduplicated ballots
DO $$
BEGIN
  PERFORM set_config('app.allow_vote_count_mutation', 'true', true);
  
  UPDATE public.entries e
  SET vote_count = COALESCE(
    (SELECT count(*)::integer FROM public.votes v WHERE v.entry_id = e.id AND v.status = 'valid'),
    0
  );
END $$;

-- 3. Create unique index: 1 vote per contest per verified Google account
DROP INDEX IF EXISTS public.idx_votes_unique_user_contest;
CREATE UNIQUE INDEX idx_votes_unique_user_contest
  ON public.votes (contest_id, user_id)
  WHERE status IN ('valid', 'quarantined') AND user_id IS NOT NULL;

-- 4. Update cast_vote RPC with official Election rules
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
  -- Election rule: Voter MUST be authenticated with a verified Google account
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required. Please sign in with Google to cast your official vote.';
  END IF;

  IF p_initial_status NOT IN ('valid', 'quarantined') THEN
    RAISE EXCEPTION 'Invalid initial vote status: %', p_initial_status;
  END IF;

  -- Fetch entry & contest details
  SELECT e.contest_id, e.status, e.user_id, e.vote_count, c.status, c.start_date, c.end_date
  INTO v_contest_id, v_entry_status, v_entry_user_id, v_current_vote_count, v_contest_status, v_contest_start, v_contest_end
  FROM public.entries e
  JOIN public.contests c ON c.id = e.contest_id
  WHERE e.id = p_entry_id
  FOR UPDATE OF e;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contestant entry not found.';
  END IF;

  -- Serialization advisory lock per voter per contest to prevent concurrent double-voting
  v_lock_key := 'election_voter:' || p_user_id::text || ':' || v_contest_id;
  PERFORM pg_advisory_xact_lock(hashtextextended(v_lock_key, 0));

  IF v_entry_status <> 'published' THEN
    RAISE EXCEPTION 'Entry is currently under moderation and not open for voting.';
  END IF;

  IF v_contest_status <> 'active' OR v_vote_date_ist < v_contest_start OR v_vote_date_ist > v_contest_end THEN
    RAISE EXCEPTION 'Contest is not active for voting.';
  END IF;

  -- Rule 1: Anti-Self-Vote — Parents cannot vote for their own child
  IF v_entry_user_id IS NOT NULL AND v_entry_user_id = p_user_id THEN
    RAISE EXCEPTION 'Parents cannot vote for their own child. Please share your entry to invite family and friends to vote!';
  END IF;

  -- Rule 2: Election Principle — Exactly 1 vote per contest forever
  IF EXISTS (
    SELECT 1 FROM public.votes v
    WHERE v.contest_id = v_contest_id
      AND v.user_id = p_user_id
      AND v.status IN ('valid', 'quarantined')
  ) THEN
    RAISE EXCEPTION 'You have already cast your official vote in this contest. Each verified Google account receives exactly 1 vote per contest.';
  END IF;

  -- Record permanent sealed ballot
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
    'oauth_verified',
    p_user_id,
    p_ip_hash,
    p_user_agent_hash,
    v_vote_date_ist,
    p_initial_status,
    p_quarantine_reason
  )
  RETURNING id INTO v_inserted_vote_id;

  -- Increment entry vote tally if status is valid
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
    1::integer,
    0::integer,
    v_current_vote_count;
END;
$$;

-- Secure execution permissions
REVOKE ALL ON FUNCTION public.cast_vote(
  uuid, text, text, text, text, text, uuid
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.cast_vote(
  uuid, text, text, text, text, text, uuid
) TO service_role;
