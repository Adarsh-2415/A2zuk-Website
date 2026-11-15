-- =============================================================================
-- A2ZUK Phase 1: Address Fields & Enhanced Parent Profile Support
-- =============================================================================

-- 1. Add private address fields to entry_private_details table
ALTER TABLE public.entry_private_details
  ADD COLUMN IF NOT EXISTS address_street text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS pincode text DEFAULT NULL;

-- 2. Update submit_entry RPC to accept and record address fields
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
  p_user_id uuid DEFAULT NULL,
  p_address_street text DEFAULT NULL,
  p_pincode text DEFAULT NULL
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

  -- Insert public contestant row
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

  -- Insert private PII details (including address)
  INSERT INTO public.entry_private_details (
    entry_id,
    guardian_name,
    guardian_email,
    guardian_phone,
    child_dob,
    consent_guardian,
    consent_sharing,
    consent_rules,
    consent_ip_hash,
    address_street,
    pincode
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
    p_consent_ip_hash,
    p_address_street,
    p_pincode
  );

  -- Log submission in audit log
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
      'user_id', p_user_id,
      'city', p_city,
      'state', p_state
    )
  );

  RETURN QUERY
  SELECT v_entry_id, p_public_code, 'pending'::text;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_entry(
  text, text, text, text, text, text, text, text, text, text, text, date, boolean, boolean, boolean, text, uuid, text, text
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.submit_entry(
  text, text, text, text, text, text, text, text, text, text, text, date, boolean, boolean, boolean, text, uuid, text, text
) TO service_role;

