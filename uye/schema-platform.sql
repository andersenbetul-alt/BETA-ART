-- QBLOGG yazar platformu — P0 şema (schema.sql'den SONRA çalıştırın)
-- Model: davetli/küratörlü (docs/yazar-platformu.md §3-4, kullanıcı kararı 24.08.2026).
-- Editoryal kapı: approved (yazar) ve status='yayinda' (yazı) yalnız yönetici
-- tarafından verilir; yazarın her düzenlemesi yazıyı yeniden inceleme kuyruğuna düşürür.

-- 1) Yazar profili (profiles'a 1:1; yazar girişten sonra kendi başvurusunu açar).
create table if not exists public.authors (
  id uuid primary key references public.profiles (id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,60}$'),
  display_name text not null,
  bio text not null default '',
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- approved yalnız yönetici değiştirir (Supabase SQL editörü veya service_role).
-- auth.role(): istemci oturumlarında 'anon'/'authenticated'; SQL editöründe boş.
create or replace function public.authors_guard()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.approved is distinct from old.approved
     and coalesce(auth.role(), '') not in ('service_role', '') then
    raise exception 'approved alanini yalniz yonetici degistirebilir';
  end if;
  return new;
end;
$$;

drop trigger if exists authors_guard_upd on public.authors;
create trigger authors_guard_upd
  before update on public.authors
  for each row execute function public.authors_guard();

-- 2) Kitap vitrini. Bağlantılar yalnız https (javascript: enjeksiyonuna kapı yok).
create table if not exists public.books (
  id bigint generated always as identity primary key,
  author_id uuid not null references public.authors (id) on delete cascade,
  title text not null,
  description text not null,
  cover_url text check (cover_url is null or cover_url ~ '^https://'),
  buy_url text check (buy_url is null or buy_url ~ '^https://'),
  category text,
  created_at timestamptz not null default now()
);

-- 3) Yazar yazıları. Yayın akışı: taslak → incelemede → yayinda.
create table if not exists public.author_posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references public.authors (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9-]{3,80}$'),
  title text not null,
  summary text not null default '',
  body_md text not null,
  status text not null default 'taslak'
    check (status in ('taslak', 'incelemede', 'yayinda')),
  published_at date,
  created_at timestamptz not null default now(),
  unique (author_id, slug)
);

-- 4) Niyet katmanı (küratörlü keşif: "kullanıcı kitap adı değil dert arar").
-- Yazımı yalnız yönetici yapar (RLS'de yazma politikası bilinçli olarak yok).
create table if not exists public.intents (
  id text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  label text not null,
  position int not null default 0
);

create table if not exists public.book_intents (
  book_id bigint not null references public.books (id) on delete cascade,
  intent_id text not null references public.intents (id) on delete cascade,
  position int not null default 0,   -- niyet içi küratoryal sıra
  primary key (book_id, intent_id)
);

-- 5) RLS.
alter table public.authors enable row level security;
alter table public.books enable row level security;
alter table public.author_posts enable row level security;
alter table public.intents enable row level security;
alter table public.book_intents enable row level security;

-- Yazar: onaylılar herkese görünür; yazar kendi satırını her durumda görür.
create policy "yazar: onaylilar ve kendi satiri"
  on public.authors for select
  using (approved or auth.uid() = id);

-- Başvuru: giriş yapan kullanıcı kendi yazar kaydını approved=false açar.
create policy "yazar: kendi basvurusu"
  on public.authors for insert
  with check (auth.uid() = id and approved = false);

create policy "yazar: kendi profili guncelle"
  on public.authors for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Kitap: onaylı yazarın kitapları herkese; sahibi kendininkini her durumda görür/yönetir.
create policy "kitap: onayli yazarin vitrini"
  on public.books for select
  using (
    auth.uid() = author_id
    or exists (select 1 from public.authors a where a.id = author_id and a.approved)
  );

create policy "kitap: sahibi ekler"
  on public.books for insert
  with check (auth.uid() = author_id);

create policy "kitap: sahibi gunceller"
  on public.books for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "kitap: sahibi siler"
  on public.books for delete
  using (auth.uid() = author_id);

-- Yazı: yayında + onaylı yazar → herkese; sahibi kendi taslaklarını görür.
create policy "yazi: yayindakiler ve kendi taslaklari"
  on public.author_posts for select
  using (
    auth.uid() = author_id
    or (
      status = 'yayinda'
      and exists (select 1 from public.authors a where a.id = author_id and a.approved)
    )
  );

-- Editoryal kapı RLS'in kendisinde: sahibi yalnız taslak/incelemede yazabilir.
-- 'yayinda' durumunu yalnız yönetici (service_role, RLS'i aşar) verir; yazarın
-- yayındaki yazıyı düzenlemesi with check gereği durumu inceleme kuyruğuna döndürür.
create policy "yazi: sahibi ekler (inceleme kuyruguna)"
  on public.author_posts for insert
  with check (auth.uid() = author_id and status in ('taslak', 'incelemede'));

create policy "yazi: sahibi gunceller (inceleme kuyruguna)"
  on public.author_posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id and status in ('taslak', 'incelemede'));

create policy "yazi: sahibi siler"
  on public.author_posts for delete
  using (auth.uid() = author_id);

-- Niyetler: okuma herkese; yazma politikası yok (küratörlük yönetici işi).
create policy "niyet: herkes okur"
  on public.intents for select using (true);

create policy "niyet-kitap: herkes okur"
  on public.book_intents for select using (true);

-- Yönetici işlemleri (SQL editöründen):
--   yazar onayı:   update public.authors set approved = true where slug = '...';
--   yazı yayını:   update public.author_posts
--                    set status = 'yayinda', published_at = current_date
--                    where id = ...;
--   niyet ekleme:  insert into public.intents (id, label, position) values (...);
