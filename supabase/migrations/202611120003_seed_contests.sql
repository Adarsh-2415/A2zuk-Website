-- =============================================================================
-- A2ZUK Phase 1: Idempotent Seed for Contests & Approved Prize Structure
-- =============================================================================

INSERT INTO public.contests (
  id,
  slug,
  title,
  description,
  status,
  start_date,
  end_date,
  cover_image,
  accent,
  is_featured,
  prize_pool,
  total_winners
)
VALUES
  (
    'contest-001',
    'baby-photo-contest-1',
    'Baby Photo Contest #1',
    'Celebrate your little star''s cutest giggles, brightest smiles, and sweetest everyday moments in A2ZUK''s flagship nationwide family contest.',
    'active',
    '2026-10-01',
    '2026-11-15',
    '/images/contests/contest-001.jpg',
    'peach',
    true,
    27500,
    13
  ),
  (
    'contest-002',
    'toddler-play-giggles',
    'Toddler Play & Giggles Contest',
    'A joyful showcase of curious toddlers exploring their world, playing with favorite toys, and sharing unforgettable family laughs.',
    'upcoming',
    '2026-11-20',
    '2026-12-25',
    '/images/contests/contest-002.jpg',
    'lavender',
    false,
    NULL,
    NULL
  ),
  (
    'contest-003',
    'little-explorers-dress-up',
    'Little Explorers Dress-Up Contest',
    'Festive outfits, traditional ethnic wear, or adorable everyday styles — share your child''s most charming look with the A2ZUK community.',
    'upcoming',
    '2027-01-05',
    '2027-02-15',
    '/images/contests/contest-003.jpg',
    'hero',
    false,
    NULL,
    NULL
  ),
  (
    'contest-004',
    'newborn-first-smiles',
    'Newborn First Smiles Contest',
    'Tender sleepy grins, tiny yawns, and precious early milestones from our very first edition of A2ZUK celebrations.',
    'ended',
    '2026-08-01',
    '2026-09-20',
    '/images/contests/contest-004.jpg',
    'sage',
    false,
    NULL,
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- Approved ₹27,500 prize pool across 13 winning positions for Baby Photo Contest #1
INSERT INTO public.contest_prizes (
  contest_id,
  rank_from,
  rank_to,
  label,
  amount_inr,
  badge,
  display_order
)
VALUES
  ('contest-001', 1, 1, '1st Prize', 10000, 'Grand Winner', 1),
  ('contest-001', 2, 2, '2nd Prize', 5000, 'Runner-Up', 2),
  ('contest-001', 3, 3, '3rd Prize', 2500, '3rd Place', 3),
  ('contest-001', 4, 13, '4th – 13th Prize', 1000, 'Top 13 Winner', 4)
ON CONFLICT (contest_id, display_order) DO NOTHING;

