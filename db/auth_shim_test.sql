-- Supabase'in auth şemasının yerel testler için minimal taklidi.
-- ÜRETİMDE KULLANILMAZ — Supabase bunları kendisi sağlar.
-- Amacı: auth.sql'deki trigger'ların ve RLS politikalarının gerçekten
-- çalıştığını Supabase'e deploy etmeden doğrulamak.

create schema if not exists auth;

create table if not exists auth.users (
  id                  uuid primary key default gen_random_uuid(),
  email               text unique not null,
  raw_user_meta_data  jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now()
);

-- Supabase'de auth.uid() JWT'den gelir. Testte oturum değişkeninden okuruz.
create or replace function auth.uid()
returns uuid
language sql stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

-- service_role taklidi: RLS'i baypas eden rol
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role bypassrls;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated;
  end if;
end $$;

grant usage on schema public, auth to authenticated, service_role;
grant select on all tables in schema public to authenticated;
grant update on public.account to authenticated;
grant all on all tables in schema public to service_role;
