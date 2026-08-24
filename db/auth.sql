-- =============================================================================
-- Supabase Auth entegrasyonu + satır seviyesi güvenlik (RLS)
--
-- Uygulama sırası:
--   schema.sql -> auth.sql -> seed.sql -> functions.sql
--
-- VARSAYIM: auth ve uygulama verisi AYNI Postgres örneğinde (Supabase'in kendi
-- veritabanı). Bu, standart Supabase kurulumudur ve aşağıdaki her şey buna
-- dayanır: auth.users'a foreign key, auth.uid() ile RLS. Auth ve uygulama
-- verisi ayrı veritabanlarında olsaydı ikisi de mümkün olmazdı — bkz.
-- docs/auth-architecture.md, "Tek veritabanı kararı".
--
-- NEDEN RLS ZORUNLU: Supabase veritabanını PostgREST üzerinden internete açar.
-- RLS olmadan, giriş yapmış HERHANGİ bir kullanıcı tüm ödemeleri, faturaları
-- ve abonelikleri okuyabilir. Bu tabloların hepsi kişisel ve finansal veri
-- taşıyor. RLS burada bir iyileştirme değil, sızıntı ile arasındaki tek engel.
-- =============================================================================

-- =============================================================================
-- 1. KİMLİK: auth.users doğruluk kaynağıdır
-- =============================================================================

-- account.id artık auth.users.id ile aynı UUID'dir. Kimlik (e-posta, parola,
-- OAuth) Supabase'in işi; account bizim fatura/profil kaydımız.
--
-- Not: bu 1:1 bir eşlemedir — bir kullanıcı, bir hesap. Bir şirketin birden
-- fazla kullanıcısı olması gerektiğinde araya account_member tablosu girer
-- (bkz. bölüm 6); o güne kadar bu yapı basit ve doğru.

alter table account
  add constraint account_id_fk_auth_users
  foreign key (id) references auth.users(id) on delete cascade;

comment on column account.email is
  'auth.users.email''in kopyası. Doğruluk kaynağı auth.users; buradaki kopya
   fatura ve raporlama için tutulur, trigger ile senkronlanır.';

-- Kayıt olan her kullanıcı için otomatik hesap kaydı.
-- security definer gerekli: trigger auth şemasında çalışır, account'a yazar.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.account (id, email, name, billing_country)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    -- Ülke kayıt sırasında bilinmiyorsa NO varsayılır; vergi hesabı öncesi
    -- kullanıcıya doğrulatılmalı (fatura ülkesi yanlışsa KDV yanlış olur).
    coalesce(upper(new.raw_user_meta_data->>'billing_country'), 'NO')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- E-posta değişirse kopyayı güncel tut.
create or replace function handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.account set email = new.email, updated_at = now() where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function handle_user_email_change();

-- =============================================================================
-- 2. RLS: her tabloda açık, politikasız tablo = erişilemez tablo
-- =============================================================================

alter table account            enable row level security;
alter table product            enable row level security;
alter table price              enable row level security;
alter table provider_ref       enable row level security;
alter table checkout_session   enable row level security;
alter table "order"            enable row level security;
alter table order_item         enable row level security;
alter table payment            enable row level security;
alter table refund             enable row level security;
alter table subscription       enable row level security;
alter table subscription_event enable row level security;
alter table entitlement        enable row level security;
alter table credit_grant       enable row level security;
alter table credit_operation   enable row level security;
alter table credit_consumption enable row level security;
alter table credit_allocation  enable row level security;
alter table invoice            enable row level security;
alter table invoice_line       enable row level security;
alter table webhook_event      enable row level security;
alter table reconciliation_run enable row level security;

-- =============================================================================
-- 3. KATALOG: herkes okur, kimse yazmaz
-- =============================================================================

create policy product_read_active on product
  for select using (active);

create policy price_read_active on price
  for select using (active);

create policy credit_operation_read on credit_operation
  for select using (active);

-- =============================================================================
-- 4. KULLANICI VERİSİ: yalnızca kendi satırları, yalnızca OKUMA
--
-- Temel kural: kullanıcı fatura verisini OKUR, asla YAZMAZ. Ödeme, hak ve
-- kredi kayıtları webhook yolundan (service_role) doğar. Kullanıcıya yazma
-- izni vermek, kendine kredi tanımlamasına veya erişim açmasına izin vermektir.
-- =============================================================================

create policy account_read_own on account
  for select using (id = auth.uid());

-- Kendi profilini güncelleyebilir — ama HER sütunu değil.
--
-- RLS politikaları sütun bazında kısıtlama yapmaz; bunu sütun seviyesinde
-- GRANT ile yaparız. Aksi halde kullanıcı kendi `vat_validated_at` alanını
-- doldurup sahte bir VAT numarasını "doğrulanmış" gösterebilir ve reverse
-- charge ile KDV'den kaçabilir. Bu teorik değil: politika sütun kısıtı
-- olmadan yazıldığında testte tam olarak bu gerçekleşti (bkz. db/test_auth.sql
-- V1). Doğrulama dış bir servisin işidir (VIES); kullanıcı beyan eder,
-- sunucu doğrular.
create policy account_update_own on account
  for update using (id = auth.uid())
  with check (id = auth.uid());

revoke update on account from authenticated;
grant update (name, company_name, org_number, vat_number, billing_country)
  on account to authenticated;

-- vat_validated_at, type, currency, email, id, created_at: yalnızca service_role.
comment on column account.billing_country is
  'Kullanıcı beyan eder ve vergi hesabını doğrudan etkiler. Ödeme sağlayıcısının
   kart ülkesiyle çapraz kontrol edilmeli; tek başına güvenilmez.';

create policy checkout_read_own on checkout_session
  for select using (account_id = auth.uid());

create policy order_read_own on "order"
  for select using (account_id = auth.uid());

create policy order_item_read_own on order_item
  for select using (exists (
    select 1 from "order" o where o.id = order_item.order_id and o.account_id = auth.uid()));

create policy payment_read_own on payment
  for select using (account_id = auth.uid());

create policy refund_read_own on refund
  for select using (exists (
    select 1 from payment p where p.id = refund.payment_id and p.account_id = auth.uid()));

create policy subscription_read_own on subscription
  for select using (account_id = auth.uid());

create policy subscription_event_read_own on subscription_event
  for select using (exists (
    select 1 from subscription s
     where s.id = subscription_event.subscription_id and s.account_id = auth.uid()));

create policy entitlement_read_own on entitlement
  for select using (account_id = auth.uid());

create policy credit_grant_read_own on credit_grant
  for select using (account_id = auth.uid());

create policy credit_consumption_read_own on credit_consumption
  for select using (account_id = auth.uid());

create policy credit_allocation_read_own on credit_allocation
  for select using (exists (
    select 1 from credit_consumption c
     where c.id = credit_allocation.consumption_id and c.account_id = auth.uid()));

create policy invoice_read_own on invoice
  for select using (account_id = auth.uid());

create policy invoice_line_read_own on invoice_line
  for select using (exists (
    select 1 from invoice i where i.id = invoice_line.invoice_id and i.account_id = auth.uid()));

-- =============================================================================
-- 5. YALNIZCA SERVICE_ROLE: kullanıcıya hiç açılmaz
--
-- Bu tablolarda politika YOKTUR. RLS açık + politika yok = normal kullanıcı
-- için tamamen erişilemez. service_role RLS'i baypas eder, webhook işleyici
-- oradan yazar.
--
--   webhook_event      — ham sağlayıcı payload'ı, başka hesapların verisi
--   reconciliation_run — mutabakat farkları, iç operasyon
--   provider_ref       — sağlayıcı kimlik eşlemesi, sızması gereksiz
-- =============================================================================

comment on table webhook_event is
  'service_role dışında erişilemez: RLS açık, politika yok. Ham sağlayıcı
   payload''ı başka hesapların verisini içerebilir.';

-- =============================================================================
-- 6. İLERİDE: şirket başına çoklu kullanıcı
--
-- Bir şirketin birden fazla kişisi aynı hesabı görmesi gerektiğinde:
--   create table account_member (account_id, user_id, role, primary key(...));
-- ve yukarıdaki her politikada `= auth.uid()` yerine
--   `in (select account_id from account_member where user_id = auth.uid())`
-- kullanılır. Politikalar tek kalıpta yazıldığı için bu değişiklik mekaniktir.
-- Bugün yapılmıyor: B2B müşteri yokken erken soyutlama.
-- =============================================================================
