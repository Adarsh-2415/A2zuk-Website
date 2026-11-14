-- =============================================================================
-- A2ZUK Phase 4.5: Automated PII Retention Purge & Optional pg_cron Schedule
-- =============================================================================

CREATE OR REPLACE FUNCTION public.run_pii_retention_purge(
  p_rejected_days integer DEFAULT 30,
  p_ended_days integer DEFAULT 60
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_today_ist date := (now() AT TIME ZONE 'Asia/Kolkata')::date;
  v_entry_id uuid;
  v_purged_count integer := 0;
BEGIN
  IF p_rejected_days < 0 OR p_ended_days < 0 THEN
    RAISE EXCEPTION 'Retention day thresholds must be non-negative.';
  END IF;

  -- 1. Purge rejected/removed entries older than p_rejected_days
  FOR v_entry_id IN
    SELECT e.id
    FROM public.entries e
    JOIN public.entry_private_details epd ON epd.entry_id = e.id
    WHERE epd.purged_at IS NULL
      AND e.status IN ('rejected', 'removed')
      AND e.updated_at < (now() - make_interval(days => p_rejected_days))
  LOOP
    IF public.purge_entry_pii(v_entry_id, 'retention_policy_rejected_or_removed', NULL) THEN
      v_purged_count := v_purged_count + 1;
    END IF;
  END LOOP;

  -- 2. Purge non-winning entries from ended contests older than p_ended_days
  FOR v_entry_id IN
    SELECT e.id
    FROM public.entries e
    JOIN public.contests c ON c.id = e.contest_id
    JOIN public.entry_private_details epd ON epd.entry_id = e.id
    WHERE epd.purged_at IS NULL
      AND c.status = 'ended'
      AND c.end_date < (v_today_ist - p_ended_days)
      AND NOT EXISTS (
        SELECT 1
        FROM public.contest_winners cw
        WHERE cw.entry_id = e.id
      )
  LOOP
    IF public.purge_entry_pii(v_entry_id, 'retention_policy_contest_ended', NULL) THEN
      v_purged_count := v_purged_count + 1;
    END IF;
  END LOOP;

  RETURN v_purged_count;
END;
$$;

REVOKE ALL ON FUNCTION public.run_pii_retention_purge(integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.run_pii_retention_purge(integer, integer)
  TO service_role;

-- Optional pg_cron schedule (runs daily at 03:00 IST / 21:30 UTC if pg_cron is enabled)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('a2zuk-daily-pii-retention')
    WHERE EXISTS (
      SELECT 1 FROM cron.job WHERE jobname = 'a2zuk-daily-pii-retention'
    );

    PERFORM cron.schedule(
      'a2zuk-daily-pii-retention',
      '30 21 * * *',
      $cron$SELECT public.run_pii_retention_purge(30, 60);$cron$
    );
  END IF;
END;
$$;

