-- Migration: Extend active contest end date to allow ongoing submissions and voting
-- File: supabase/migrations/202611160001_extend_contest_end_date.sql

UPDATE public.contests
SET 
  end_date = '2027-12-31',
  status = 'active',
  updated_at = now()
WHERE slug = 'baby-photo-contest-1';

