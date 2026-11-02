-- Beyond the Badge: one-time database setup.
-- Supabase dashboard > SQL Editor > New query > paste this file > Run.
-- Safe to run again; it only adds what is missing and never deletes responses.
--
-- BEFORE RUNNING: replace you@example.com in step 2 with the email address
-- you will sign in with (add more lines for more organizers).

-- 1. Responses: optional email, and every question saved with its answer -----
alter table public.thanksgiving_responses add column if not exists email text;
alter table public.thanksgiving_responses add column if not exists answers jsonb;
grant insert (email, answers) on public.thanksgiving_responses to anon, authenticated;

-- 2. Who is an organizer (only these emails can open the settings page) -----
create table if not exists public.organizers (email text primary key);
insert into public.organizers (email) values
  ('you@example.com')
on conflict do nothing;
alter table public.organizers enable row level security;

create or replace function public.is_organizer() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.organizers where lower(email) = lower(auth.jwt() ->> 'email'));
$$;
revoke execute on function public.is_organizer() from public, anon;
grant execute on function public.is_organizer() to authenticated;

-- 3. Settings saved in the database, so they are the same on every device ---
create table if not exists public.page_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.page_settings enable row level security;
drop policy if exists "organizers manage settings" on public.page_settings;
create policy "organizers manage settings" on public.page_settings
  for all to authenticated using (public.is_organizer()) with check (public.is_organizer());
grant select, insert, update on public.page_settings to authenticated;

-- 4. Responses: anyone can submit, only organizers can read ------------------
alter table public.thanksgiving_responses enable row level security;
drop policy if exists "anyone can submit" on public.thanksgiving_responses;
create policy "anyone can submit" on public.thanksgiving_responses
  for insert to anon, authenticated with check (true);
drop policy if exists "organizers read responses" on public.thanksgiving_responses;
create policy "organizers read responses" on public.thanksgiving_responses
  for select to authenticated using (public.is_organizer());
grant select on public.thanksgiving_responses to authenticated;

-- AFTER RUNNING:
--   Authentication > Users > Add user > Create new user: your email and a
--   password, with "Auto Confirm User" ticked. Then, to stop strangers making
--   accounts: Authentication > Sign In / Providers > turn off
--   "Allow new users to sign up". (Accounts that are not organizers can't
--   see anything anyway; this just keeps the user list clean.)
