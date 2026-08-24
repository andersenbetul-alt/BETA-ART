-- Local-only stand-in for the parts of Supabase this schema depends on, so
-- the migration can be applied and its RLS policies exercised offline.
-- Supabase provides these in a real project; never run this against one.
create schema if not exists auth;

create table auth.users (
  id                  uuid primary key default gen_random_uuid(),
  email               text unique,
  raw_user_meta_data  jsonb not null default '{}'::jsonb
);

-- auth.uid() reads the JWT claim; locally we read a session GUC instead.
create function auth.uid() returns uuid
language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
