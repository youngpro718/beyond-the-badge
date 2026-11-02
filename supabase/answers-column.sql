-- Optional, run once in Supabase (SQL Editor > New query > Run).
-- Adds a column that keeps every question with its answer, so edited or extra
-- questions are stored exactly as they were asked. The sign-up page works
-- without it: until this runs, answers go into the four original columns.
alter table public.thanksgiving_responses add column if not exists answers jsonb;

-- Let the public sign-up page fill the new column (it can already insert rows).
grant insert (answers) on public.thanksgiving_responses to anon;
