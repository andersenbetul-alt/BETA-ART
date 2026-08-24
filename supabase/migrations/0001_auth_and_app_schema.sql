-- BETA ART / Cobban — authentication and application data.
--
-- Identity lives in Supabase's `auth` schema (auth.users), which Supabase
-- manages. Application data lives in `public` and references auth.users by
-- foreign key. Both are the same PostgreSQL database — that is what makes
-- auth.uid() usable inside RLS policies.
--
-- Every table here has RLS enabled. Postgres denies all access to an
-- RLS-enabled table with no matching policy, so the default is closed.

-- ---------------------------------------------------------------- profiles
-- One row per authenticated user. Holds the role, because auth.users is
-- Supabase-managed and should not be altered.

create type public.user_role as enum ('owner', 'collector');

create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  role         public.user_role not null default 'collector',
  display_name text,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper: is the caller the site owner? SECURITY DEFINER so the policy can
-- read profiles without recursing through profiles' own RLS.
create function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

create policy profiles_select_own on public.profiles
  for select using (id = auth.uid() or public.is_owner());

create policy profiles_update_own on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Note: no INSERT policy. Profiles are created by a trigger on auth.users,
-- so a client cannot forge one.
--
-- RLS decides WHICH ROWS you may update, never WHICH COLUMNS. Left at that,
-- `profiles_update_own` lets any user set role='owner' on their own row —
-- verified: a collector self-promoted with a single UPDATE. Two guards, so
-- neither is load-bearing alone.

-- Guard 1: column-level privileges. Clients may only write display_name.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke update on public.profiles from authenticated;
    grant update (display_name) on public.profiles to authenticated;
  end if;
end $$;

-- Guard 2: reject role changes unless the caller is already the owner.
-- Survives a careless re-GRANT.
create function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() is null outside an end-user session — service_role, psql, a
  -- migration. That path is already privileged, and it is the only way to
  -- create the FIRST owner: blocking it unconditionally deadlocks bootstrap
  -- (nobody is owner, so nobody can promote anyone).
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_owner() then
    raise exception 'role may only be changed by the site owner';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- ------------------------------------------------------------------- works
-- The artworks. Public visitors see published rows only; the owner sees all.

create table public.works (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  year       int,
  medium     text,
  published  boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.works enable row level security;

create policy works_public_read on public.works
  for select using (published or public.is_owner());

create policy works_owner_write on public.works
  for all using (public.is_owner()) with check (public.is_owner());

-- --------------------------------------------------------------- inquiries
-- Contact-led sales (see BUSINESS.md, models A and C): a signed-in collector
-- asks about a work; only they and the owner can read it.

create table public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  work_id    uuid not null references public.works (id) on delete cascade,
  author_id  uuid not null references auth.users (id) on delete cascade,
  message    text not null check (length(message) between 1 and 4000),
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

create policy inquiries_insert_own on public.inquiries
  for insert with check (author_id = auth.uid());

create policy inquiries_read_own on public.inquiries
  for select using (author_id = auth.uid() or public.is_owner());

-- ----------------------------------------------------------------- trigger
-- Create a profile whenever Supabase creates a user. Always 'collector' —
-- the owner role is granted manually, never by signup.

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
