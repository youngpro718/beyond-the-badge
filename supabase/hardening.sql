-- Beyond the Badge: tightening, run after setup.sql.
-- Your SQL Editor runs one statement at a time: paste and Run each block on its own.
-- None of these touch any response.

-- 1. Size limit on the email column (like the limits on the other columns)
alter table public.thanksgiving_responses
  add constraint thanksgiving_responses_email_check check (email is null or length(email) <= 320);

-- 2. Size limit on the answers column
alter table public.thanksgiving_responses
  add constraint thanksgiving_responses_answers_check check (answers is null or (jsonb_typeof(answers) = 'array' and octet_length(answers::text) <= 100000));

-- 3. Nobody needs direct access to the organizer list (the organizer check reads it on its own)
revoke all on public.organizers from anon, authenticated;

-- 4. Visitors need nothing from the settings table
revoke all on public.page_settings from anon;

-- 5. Organizers only read and save settings
revoke delete, truncate, references, trigger on public.page_settings from authenticated;
