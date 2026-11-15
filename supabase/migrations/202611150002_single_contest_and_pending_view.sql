-- =============================================================================
-- A2ZUK Phase 2: Single Active Contest & Archived Dummy Contests
-- =============================================================================

-- 1. Update the status check constraint to permit 'archived'
ALTER TABLE public.contests
  DROP CONSTRAINT IF EXISTS contests_status_check;

ALTER TABLE public.contests
  ADD CONSTRAINT contests_status_check CHECK (status IN ('active', 'upcoming', 'ended', 'archived'));

-- 2. Archive the 3 dummy contests so only Baby Photo Contest #1 remains active
UPDATE public.contests
SET status = 'archived', is_featured = false
WHERE slug IN (
  'toddler-play-giggles',
  'little-explorers-dress-up',
  'newborn-first-smiles'
);

-- 3. Ensure Baby Photo Contest #1 is active and featured
UPDATE public.contests
SET status = 'active', is_featured = true
WHERE slug = 'baby-photo-contest-1';
