-- =============================================================================
-- A2ZUK Phase 1: Row Level Security (RLS), Function Grants & Storage Policies
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Enable RLS on All Application Tables
-- -----------------------------------------------------------------------------

ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_private_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Prevent direct table-level UPDATE on entries from anon/authenticated roles.
REVOKE UPDATE ON public.entries FROM anon, authenticated;

-- -----------------------------------------------------------------------------
-- 2. Strict Function Execution Permissions
-- -----------------------------------------------------------------------------

REVOKE ALL ON FUNCTION public.is_active_admin(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_active_admin(text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.cast_vote(uuid, text, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cast_vote(uuid, text, text, text, text, text) TO service_role;

REVOKE ALL ON FUNCTION public.admin_review_vote(uuid, text, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_review_vote(uuid, text, uuid, text) TO service_role;

REVOKE ALL ON FUNCTION public.admin_moderate_entry(uuid, text, uuid, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_moderate_entry(uuid, text, uuid, text, text, text) TO service_role;

REVOKE ALL ON FUNCTION public.purge_entry_pii(uuid, text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_entry_pii(uuid, text, uuid) TO service_role;

-- -----------------------------------------------------------------------------
-- 3. RLS Policies
-- -----------------------------------------------------------------------------

-- Contests
CREATE POLICY "Public can read contests"
  ON public.contests
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Super admins can manage contests"
  ON public.contests
  FOR ALL
  TO authenticated
  USING (public.is_active_admin('super_admin'))
  WITH CHECK (public.is_active_admin('super_admin'));

-- Contest Prizes
CREATE POLICY "Public can read contest prizes"
  ON public.contest_prizes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Super admins can manage contest prizes"
  ON public.contest_prizes
  FOR ALL
  TO authenticated
  USING (public.is_active_admin('super_admin'))
  WITH CHECK (public.is_active_admin('super_admin'));

-- Contest Winners
CREATE POLICY "Public can read contest winners"
  ON public.contest_winners
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Super admins can manage contest winners"
  ON public.contest_winners
  FOR ALL
  TO authenticated
  USING (public.is_active_admin('super_admin'))
  WITH CHECK (public.is_active_admin('super_admin'));

-- Entries (public sees only published; admins see all; mutations via service_role RPCs)
CREATE POLICY "Public can read published entries"
  ON public.entries
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Active admins can read all entries"
  ON public.entries
  FOR SELECT
  TO authenticated
  USING (public.is_active_admin());

-- Entry Private Details (strictly admin-only; never public)
CREATE POLICY "Active admins can read entry private details"
  ON public.entry_private_details
  FOR SELECT
  TO authenticated
  USING (public.is_active_admin());

-- Votes (strictly admin-only read; mutations via cast_vote / admin_review_vote)
CREATE POLICY "Active admins can read votes"
  ON public.votes
  FOR SELECT
  TO authenticated
  USING (public.is_active_admin());

-- Entry Reports (admins can read and update; public submits via server API)
CREATE POLICY "Active admins can read entry reports"
  ON public.entry_reports
  FOR SELECT
  TO authenticated
  USING (public.is_active_admin());

CREATE POLICY "Active admins can update entry reports"
  ON public.entry_reports
  FOR UPDATE
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- Admin Profiles
CREATE POLICY "Admins can read own profile or super admins read all"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_active_admin('super_admin'));

CREATE POLICY "Super admins can insert admin profiles"
  ON public.admin_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_active_admin('super_admin'));

CREATE POLICY "Super admins can update admin profiles"
  ON public.admin_profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_active_admin('super_admin'))
  WITH CHECK (public.is_active_admin('super_admin'));

CREATE POLICY "Super admins can delete admin profiles"
  ON public.admin_profiles
  FOR DELETE
  TO authenticated
  USING (public.is_active_admin('super_admin'));

-- Audit Logs (append-only via service_role / SECURITY DEFINER RPCs; admins can read)
CREATE POLICY "Active admins can read audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_active_admin());

-- -----------------------------------------------------------------------------
-- 4. Supabase Storage Buckets & Object Policies
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'contest-photos-pending',
    'contest-photos-pending',
    false,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'contest-photos-public',
    'contest-photos-public',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  )
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Active admins can read pending contest photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'contest-photos-pending'
    AND public.is_active_admin()
  );

CREATE POLICY "Public can read published contest photos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'contest-photos-public');

