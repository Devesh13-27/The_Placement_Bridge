-- Fixes duplicate camp/visit rows for the same posting+college, and adds a
-- DB-level constraint so it can't happen again. Run this once in the
-- Supabase SQL editor against your existing project.

-- 1. Remove duplicates, keeping only the most recently created active
--    (proposed/confirmed) row per (posting_id, college_id).
delete from camps_visits cv
using camps_visits newer
where cv.posting_id = newer.posting_id
  and cv.college_id = newer.college_id
  and cv.status in ('proposed', 'confirmed')
  and newer.status in ('proposed', 'confirmed')
  and cv.created_at < newer.created_at;

-- 2. Prevent it from happening again: only one active camp/visit per
--    posting+college at a time.
create unique index if not exists camps_visits_one_active_per_posting_college
  on camps_visits (posting_id, college_id)
  where status in ('proposed', 'confirmed');
