-- NAVIAR — auth and application data in one Postgres.
--
-- Supabase owns auth.users. Application data lives in `public` and references
-- auth.users directly, so deletes cascade and RLS policies compare against
-- auth.uid() with no ID synchronisation between systems.

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is
  'Application-side user record. One row per auth.users row.';

alter table public.profiles enable row level security;

-- auth.uid() is wrapped in a scalar subquery so Postgres evaluates it once per
-- statement rather than once per row. On large tables the difference is large.
create policy "profiles: read own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: update own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Rows are created by the trigger below, never by clients. With RLS enabled
-- and no permissive insert policy, direct inserts are denied — which is the
-- intent, not an oversight.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
