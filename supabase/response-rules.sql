-- Beyond the Badge: delete, one response per person, open/closed, flood limit.
-- Your SQL Editor runs one statement at a time: paste each numbered block on
-- its own and click Run. Nothing here changes or removes existing responses.

-- 1. Organizers can delete responses (spam, tests, duplicates)
create policy "organizers delete responses" on public.thanksgiving_responses
  for delete to authenticated using (public.is_organizer());

-- 2.
grant delete on public.thanksgiving_responses to authenticated;

-- 3. What the sign-up page may know before showing the form: only whether
--    responses are open, and whether it's one response per person
create or replace function public.response_rules() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'open', coalesce((select (data->>'open')::boolean from public.page_settings where id = 1), true),
    'oneEach', coalesce((select (data->>'oneEach')::boolean from public.page_settings where id = 1), true));
$$;

-- 4.
grant execute on function public.response_rules() to anon, authenticated;

-- 5. The database checks every new response, so the page can't be bypassed:
--    closed -> refused; more than 30 in a minute -> refused (spam scripts);
--    one per person -> refused if the same name or email already answered
--    since the last "Start a new round"
create or replace function public.check_new_response() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  cfg jsonb := coalesce((select data from public.page_settings where id = 1), '{}'::jsonb);
  since timestamptz := coalesce(nullif(cfg->>'roundStart', '')::timestamptz, '-infinity');
  who text := lower(regexp_replace(btrim(coalesce(new.name, '')), '\s+', ' ', 'g'));
begin
  if coalesce((cfg->>'open')::boolean, true) = false then
    raise exception 'responses_closed';
  end if;
  if (select count(*) from public.thanksgiving_responses where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'too_many';
  end if;
  if coalesce((cfg->>'oneEach')::boolean, true) and exists (
    select 1 from public.thanksgiving_responses r
    where r.created_at >= since
      and (lower(regexp_replace(btrim(coalesce(r.name, '')), '\s+', ' ', 'g')) = who
           or (new.email is not null and new.email <> '' and lower(r.email) = lower(new.email)))
  ) then
    raise exception 'already_responded';
  end if;
  return new;
end;
$$;

-- 6.
revoke execute on function public.check_new_response() from public, anon, authenticated;

-- 7.
create trigger check_new_response before insert on public.thanksgiving_responses
  for each row execute function public.check_new_response();
