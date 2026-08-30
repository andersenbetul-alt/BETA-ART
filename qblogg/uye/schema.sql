-- QBLOGG üye sistemi — v1 şema (Supabase SQL editöründe çalıştırın)
-- Kapsam: Q Brief Pro üyeliği. Auth'u Supabase yönetir (auth.users);
-- burada yalnız profil, üyelik durumu ve brief arşivi tutulur.
-- Kaynak desen: engine/schema-billing.sql (sadeleştirilmiş uyarlama).

-- 1) Profil: auth.users'a birebir bağlı.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  -- free: kayıtlı ama ödemesiz · active: Q Brief Pro aktif · lapsed: süresi dolmuş
  plan_status text not null default 'free'
    check (plan_status in ('free', 'active', 'lapsed')),
  plan_renews_at date,
  created_at timestamptz not null default now()
);

-- Yeni kullanıcı doğrulanınca profil otomatik açılır.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) Q Brief arşivi.
create table if not exists public.briefs (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  summary text not null,          -- herkese görünen 1-2 cümle
  body_md text not null,          -- yalnız aktif üyeye görünen gövde (markdown)
  published_at date not null default current_date,
  is_sample boolean not null default false  -- true: girişsiz de tam okunur (tanıtım)
);

-- 3) Satır düzeyi güvenlik (RLS).
alter table public.profiles enable row level security;
alter table public.briefs enable row level security;

-- Profil: herkes yalnız kendi satırını görür/günceller (plan alanları hariç —
-- plan_status'u yalnız service_role değiştirir, o yüzden update policy yok).
create policy "profil: kendi satırını oku"
  on public.profiles for select
  using (auth.uid() = id);

-- Brief listesi (başlık+özet) girişli herkese açık; örnek brief'ler herkese.
create policy "brief: liste ve örnekler"
  on public.briefs for select
  using (
    is_sample
    or (
      auth.uid() is not null
      and exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.plan_status = 'active'
      )
    )
  );

-- NOT: gövdeyi (body_md) aktif olmayan üyeden gizlemek için uygulama,
-- listelemede yalnız başlık/özet kolonlarını çeker; RLS zaten aktif
-- olmayan üyeye satırı hiç vermez (örnekler hariç). Ödeme durumu
-- güncellemesi (Stripe webhook → plan_status) v2'de edge function ile
-- bağlanacak; v1'de service_role anahtarıyla elle güncellenir.
