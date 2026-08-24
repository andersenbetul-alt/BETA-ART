-- Authentication foundation: user profiles bound to Supabase auth.users,
-- with row-level security so a user can only ever read or modify their own row.
--
-- Supabase owns the `auth` schema; application tables live in `public` and
-- reference auth.users(id). Because both live in the same database, we get
-- referential integrity and RLS keyed on auth.uid() -- neither is possible
-- when application data sits in a separate Postgres instance.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
-- One row per authenticated user. auth.users is managed by Supabase and must
-- not be written to directly; profiles is where application-owned user data
-- belongs. ON DELETE CASCADE ties profile lifetime to the account, so deleting
-- a user through Supabase cleans up application data rather than orphaning it.

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- Guard against empty-string display names, which sort and compare
  -- differently from NULL and produce confusing UI.
  constraint display_name_not_blank
    check (display_name is null or length(trim(display_name)) > 0)
);

comment on table public.profiles is
  'Application-owned user data, one row per auth.users account.';

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- RLS is the actual authorization boundary. Without it, any client holding the
-- anon key could read every row via PostgREST -- the table being in `public`
-- makes it reachable, and only RLS decides who sees what.

alter table public.profiles enable row level security;

-- Force RLS for the table owner too. Without this, a connection running as the
-- owning role bypasses every policy below, which quietly defeats the boundary
-- for anything using the service role or running as owner.
alter table public.profiles force row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- Both USING and WITH CHECK are required on UPDATE: USING decides which rows
-- are visible to update, WITH CHECK validates the row after modification.
-- Omitting WITH CHECK would let a user reassign their row's id to another
-- user's id, moving the row out from under themselves.
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Deliberately no DELETE policy: profiles are removed by cascade when the
-- account is deleted through Supabase, not by clients deleting rows directly.

-- ---------------------------------------------------------------------------
-- Column-level grants
-- ---------------------------------------------------------------------------
-- RLS decides which rows; grants decide which columns. Without restricting
-- UPDATE to specific columns, a user could rewrite their own id, created_at,
-- or email -- with email diverging from the verified value in auth.users.

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (id, email, display_name, avatar_url) on public.profiles to authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
-- Set server-side rather than trusting a client-supplied timestamp.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Profile provisioning on signup
-- ---------------------------------------------------------------------------
-- Creating the profile in a trigger rather than in application code means it
-- happens for every signup path -- email/password, magic link, and every OAuth
-- provider -- including signups that never touch our backend.
--
-- SECURITY DEFINER is required: the inserting context during signup is not the
-- new user, so the RLS insert policy above would reject it. `set search_path`
-- is mandatory with SECURITY DEFINER -- without it, a caller-controlled
-- search_path can resolve unqualified names to attacker-supplied objects that
-- then execute as the function owner.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    -- OAuth providers populate raw_user_meta_data with differing key names;
    -- fall back across the common ones, then to NULL rather than a blank
    -- string (which the display_name_not_blank constraint rejects).
    nullif(trim(coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'user_name',
      ''
    )), ''),
    nullif(trim(coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture',
      ''
    )), '')
  )
  -- A retried or duplicated signup event must not fail account creation.
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Restrict who can call the SECURITY DEFINER function directly. The trigger
-- invokes it regardless; clients have no reason to.
revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Keep profile email in step with the verified address
-- ---------------------------------------------------------------------------
-- auth.users.email is the source of truth; profiles.email is a denormalised
-- copy for querying. Without this, an email change in Supabase leaves the
-- profile copy stale, and application code silently uses the old address.

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
     set email = new.email
   where id = new.id;
  return new;
end;
$$;

revoke all on function public.handle_user_email_change() from public, anon, authenticated;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();
