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

-- account.id KENDI kimligidir; auth.users'a ayri bir sutunla baglanir.
--
-- NEDEN 1:1 aynı UUID DEĞİL: hesabın ve girişin yaşam döngüsü farklıdır.
-- Kullanıcı GDPR gereği silinme talep edebilir; ama fatura ve ödeme kayıtları
-- muhasebe mevzuatı gereği yıllarca saklanmalıdır. account.id = auth.users.id
-- + on delete cascade kurulduğunda ilk silme talebi muhasebe verisini de
-- götürür. Ayrı sütun + on delete set null bunu ayırır: giriş silinir, kayıt
-- kalır, hesap anonimleştirilir.
alter table account
  add column if not exists auth_user_id uuid unique
  references auth.users(id) on delete set null;

comment on column account.auth_user_id is
  'auth.users bağlantısı. Kullanıcı silinince null olur; hesap ve ona bağlı
   mali kayıtlar silinmez, anonymize_account() ile anonimleştirilir.';

-- auth.uid() -> account.id çevirisi. stable: planlayıcı sorgu başına bir kez
-- değerlendirir, her satırda alt sorgu çalıştırmaz.
create or replace function current_account_id()
returns uuid
language sql stable
security definer
set search_path = public
as $$
  select id from account where auth_user_id = auth.uid();
$$;

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
  insert into public.account (auth_user_id, email, name, billing_country)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    -- Ülke kayıt sırasında bilinmiyorsa NO varsayılır; vergi hesabı öncesi
    -- kullanıcıya doğrulatılmalı (fatura ülkesi yanlışsa KDV yanlış olur).
    coalesce(upper(new.raw_user_meta_data->>'billing_country'), 'NO')
  )
  on conflict (auth_user_id) do nothing;
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
    update public.account set email = new.email, updated_at = now()
     where auth_user_id = new.id;
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
  for select using (auth_user_id = auth.uid());

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
  for update using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

revoke update on account from authenticated;
grant update (name, company_name, org_number, vat_number, billing_country)
  on account to authenticated;

-- vat_validated_at, type, currency, email, id, created_at: yalnızca service_role.
comment on column account.billing_country is
  'Kullanıcı beyan eder ve vergi hesabını doğrudan etkiler. Ödeme sağlayıcısının
   kart ülkesiyle çapraz kontrol edilmeli; tek başına güvenilmez.';

create policy checkout_read_own on checkout_session
  for select using (account_id = current_account_id());

create policy order_read_own on "order"
  for select using (account_id = current_account_id());

create policy order_item_read_own on order_item
  for select using (exists (
    select 1 from "order" o where o.id = order_item.order_id and o.account_id = current_account_id()));

create policy payment_read_own on payment
  for select using (account_id = current_account_id());

create policy refund_read_own on refund
  for select using (exists (
    select 1 from payment p where p.id = refund.payment_id and p.account_id = current_account_id()));

create policy subscription_read_own on subscription
  for select using (account_id = current_account_id());

create policy subscription_event_read_own on subscription_event
  for select using (exists (
    select 1 from subscription s
     where s.id = subscription_event.subscription_id and s.account_id = current_account_id()));

create policy entitlement_read_own on entitlement
  for select using (account_id = current_account_id());

create policy credit_grant_read_own on credit_grant
  for select using (account_id = current_account_id());

create policy credit_consumption_read_own on credit_consumption
  for select using (account_id = current_account_id());

create policy credit_allocation_read_own on credit_allocation
  for select using (exists (
    select 1 from credit_consumption c
     where c.id = credit_allocation.consumption_id and c.account_id = current_account_id()));

create policy invoice_read_own on invoice
  for select using (account_id = current_account_id());

create policy invoice_line_read_own on invoice_line
  for select using (exists (
    select 1 from invoice i where i.id = invoice_line.invoice_id and i.account_id = current_account_id()));

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

-- =============================================================================
-- 7. GDPR SİLME: kişisel veri gider, mali kayıt kalır
--
-- Çatışma: GDPR kullanıcıya silinme hakkı verir; muhasebe mevzuatı fatura ve
-- ödeme kayıtlarının saklanmasını zorunlu kılar. İkisi de yasal yükümlülük.
--
-- Çözüm silmek değil, ANONİMLEŞTİRMEK: kişiyi tanımlayan alanlar temizlenir,
-- tutar/tarih/vergi bilgisi olduğu gibi kalır. Fatura hâlâ denetlenebilir,
-- ama kime ait olduğu okunamaz.
--
-- Saklama süresi ülkeye göre değişir (Norveç'te muhasebe kayıtları için uzun).
-- Süre dolduğunda gerçek silme ayrı bir işin konusudur; bu fonksiyon o günü
-- beklemeden GDPR talebini karşılar.
-- =============================================================================

create or replace function anonymize_account(p_account uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_n integer;
begin
  update account set
    email           = 'anonim+' || replace(p_account::text, '-', '') || '@silinmis.invalid',
    name            = null,
    company_name    = null,
    org_number      = null,
    vat_number      = null,
    vat_validated_at = null,
    auth_user_id    = null,      -- giriş bağlantısı kopar
    updated_at      = now()
  where id = p_account;

  get diagnostics v_n = row_count;
  if v_n = 0 then
    raise exception 'anonymize_account: hesap bulunamadı: %', p_account;
  end if;

  -- Erişim ve abonelikler kapanır: silinmiş kullanıcı hizmet almamalı.
  update entitlement set revoked_at = coalesce(revoked_at, now()),
                         revoke_reason = coalesce(revoke_reason, 'account_anonymized')
   where account_id = p_account and revoked_at is null;

  update subscription set status = 'canceled', canceled_at = coalesce(canceled_at, now())
   where account_id = p_account and status in ('active','trialing','past_due','paused');

  -- order, payment, invoice, refund: DOKUNULMAZ. Tutar, tarih ve vergi
  -- bilgisi muhasebe için gerekli; artık kime ait olduğu okunamıyor.
end;
$$;

revoke all on function anonymize_account(uuid) from public, authenticated;

comment on function anonymize_account(uuid) is
  'GDPR silme talebi. Kişisel alanları temizler, erişimi kapatır, mali
   kayıtlara dokunmaz. Yalnızca service_role çağırabilir.';
