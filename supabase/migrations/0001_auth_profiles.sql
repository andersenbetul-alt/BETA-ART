-- 0001_auth_profiles.sql
-- Application-owned user data, colocated with Supabase Auth in one Postgres.
-- auth.users is managed by Supabase and must never be written to directly;
-- public.profiles is the application's own 1:1 extension of it.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text        not null,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint profiles_display_name_length
    check (display_name is null or char_length(display_name) between 1 and 64)
);

comment on table public.profiles is
  'Application profile, 1:1 with auth.users. Cascades on user deletion.';

create index if not exists profiles_email_idx on public.profiles (lower(email));

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Provision a profile whenever Supabase Auth creates a user.
--
-- SECURITY DEFINER is required: the trigger fires in the auth schema's
-- context, which has no rights on public.profiles. search_path is pinned
-- to defeat search_path hijacking, which is the standard attack against
-- SECURITY DEFINER functions.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The backend API uses the service_role key, which BYPASSES RLS entirely.
-- These policies are therefore defense in depth, not the primary control:
-- they ensure that if an anon or authenticated key ever reaches this table
-- (a leaked client key, a future direct-from-client feature), rows are not
-- readable or writable by the wrong user. Enabling RLS without policies
-- denies all non-service access by default, which is the desired floor.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No INSERT policy: profiles are created only by the on_auth_user_created
-- trigger. No DELETE policy: removal happens via cascade from auth.users.
