-- =============================================================================
-- BETA / Future Human — merkezi ödeme altyapısı şeması (PostgreSQL 14+)
--
-- TEMEL İLKE
--   Stripe, Vipps ve fatura birer *tahsilat kanalıdır*, muhasebe defteri değil.
--   Erişim (entitlement), abonelik ve kredi doğruluğunun tek kaynağı bu şemadır.
--   "Kullanıcı premium mu?" sorusu asla Stripe'a sorulmaz; entitlement'a sorulur.
--
--   Bunun nedeni: aynı planı Stripe'tan da Vipps'ten de satacaksınız. İki
--   sağlayıcının abonelik modeli birbirinin aynısı değil. Doğruluk kaynağını
--   sağlayıcıya bırakırsanız, iki farklı gerçek ortaya çıkar.
--
-- PARA
--   Tutarlar her zaman TAM SAYI ve minor unit (øre/cent). Float yok.
--   Her tutar yanında currency taşır. Kur dönüşümü sunum katmanının işi değildir.
-- =============================================================================

create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. HESAP
--   Tek hesap: kişi de şirket de aynı tabloda. B2B alanları null olabilir.
-- =============================================================================

create type account_type as enum ('person', 'company');

create table account (
  id             uuid primary key default gen_random_uuid(),
  email          text        not null,
  name           text,
  type           account_type not null default 'person',

  -- B2B / fatura
  company_name   text,
  org_number     text,                    -- Norveç org.nr / diğer ülkelerde şirket no
  vat_number     text,                    -- AB VAT no (reverse charge için)
  vat_validated_at timestamptz,           -- VIES/benzeri doğrulama zamanı; null = doğrulanmamış

  -- vergi ve para birimi
  billing_country char(2)    not null,    -- ISO 3166-1 alpha-2, örn. 'NO'
  currency        char(3)    not null default 'NOK',

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create unique index account_email_key on account (lower(email));
create index account_org_number_idx on account (org_number) where org_number is not null;

comment on column account.vat_validated_at is
  'Reverse charge yalnızca doğrulanmış VAT numarasıyla uygulanır. Null ise VAT tahsil edilir.';

-- =============================================================================
-- 2. KATALOG
--   Blog Pro, rapor, kurs, danışmanlık, Curiosity Engine planları, kredi paketi —
--   hepsi product. Fiyat ayrı tabloda: fiyat değişince eski satırlar bozulmasın.
-- =============================================================================

create type product_kind as enum (
  'one_time',      -- e-kitap, rapor, kurs
  'subscription',  -- Blog Pro, Curiosity Engine planları, membership
  'credit_pack',   -- +1.000 credits
  'service'        -- danışmanlık, AI setup (genelde fatura ile)
);

create table product (
  id           uuid primary key default gen_random_uuid(),
  slug         text        not null unique,   -- 'blog-pro', 'curiosity-starter'
  name         text        not null,
  kind         product_kind not null,
  description  text,

  -- Satın alındığında hangi erişimi açar (bkz. entitlement.feature_key).
  -- Null ise erişim açmaz (örn. saf kredi paketi).
  feature_key  text,

  -- Abonelik ürünleri için dönem başına verilen kredi (yoksa null)
  credits_per_period integer,

  active       boolean     not null default true,
  created_at   timestamptz not null default now()
);

create type price_interval as enum ('month', 'year');
create type tax_behavior   as enum ('inclusive', 'exclusive');

create table price (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid        not null references product(id),
  currency      char(3)     not null,
  amount_minor  bigint      not null check (amount_minor >= 0),

  -- null = tek seferlik satın alma
  interval      price_interval,

  -- Norveç B2C fiyatları KDV DAHİL gösterilir; B2B hariç. Bu alan sunumun değil,
  -- hesaplamanın girdisidir: yanlış kurulursa her satırda vergi hatası olur.
  tax_behavior  tax_behavior not null default 'inclusive',

  active        boolean     not null default true,
  created_at    timestamptz not null default now()
);

create index price_product_idx on price (product_id) where active;

-- Kendi kayıtlarımızı sağlayıcıdaki karşılıklarına bağlar.
-- Aynı ürünün Stripe'ta price_..., Vipps'te başka bir kimliği olur.
create table provider_ref (
  id           uuid primary key default gen_random_uuid(),
  entity_type  text        not null,   -- 'product' | 'price' | 'account' | 'subscription'
  entity_id    uuid        not null,
  provider     text        not null,   -- 'stripe' | 'vipps' | 'klarna' | 'paddle'
  provider_id  text        not null,
  created_at   timestamptz not null default now(),
  unique (provider, entity_type, provider_id)
);

create index provider_ref_entity_idx on provider_ref (entity_type, entity_id);

-- =============================================================================
-- 3. CHECKOUT VE SİPARİŞ
-- =============================================================================

create type payment_provider as enum ('stripe', 'vipps', 'klarna', 'invoice', 'manual');

create type checkout_status as enum ('created', 'redirected', 'completed', 'expired', 'canceled', 'failed');

create table checkout_session (
  id               uuid primary key default gen_random_uuid(),
  account_id       uuid        references account(id),  -- misafir checkout'ta null olabilir
  provider         payment_provider not null,
  provider_session_id text,

  currency         char(3)     not null,
  amount_minor     bigint      not null,

  -- Aynı "BUY" tıklamasının iki oturum açmasını engeller.
  idempotency_key  text        not null unique,

  status           checkout_status not null default 'created',
  return_url       text,
  created_at       timestamptz not null default now(),
  expires_at       timestamptz,
  completed_at     timestamptz
);

create index checkout_provider_idx on checkout_session (provider, provider_session_id);

create type order_status as enum (
  'pending', 'paid', 'partially_refunded', 'refunded', 'canceled', 'failed'
);

create table "order" (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid        not null references account(id),
  checkout_id   uuid        references checkout_session(id),
  status        order_status not null default 'pending',

  currency      char(3)     not null,
  subtotal_minor bigint     not null,   -- vergi hariç
  tax_minor     bigint      not null default 0,
  total_minor   bigint      not null,

  -- Vergi kararının o anki gerekçesi. Sonradan kural değişse bile
  -- geçmiş sipariş neden öyle hesaplandı, kayıtta durur.
  tax_country   char(2),
  tax_reason    text,                   -- 'no_b2c_mva' | 'eu_reverse_charge' | 'outside_scope'

  placed_at     timestamptz not null default now()
);

create index order_account_idx on "order" (account_id, placed_at desc);

create table order_item (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid        not null references "order"(id) on delete cascade,
  price_id      uuid        not null references price(id),
  quantity      integer     not null default 1 check (quantity > 0),

  -- Fiyat sonradan değişse bile sipariş anındaki tutar burada donar.
  unit_amount_minor bigint  not null,
  tax_rate_bp   integer     not null default 0,   -- baz puan: 2500 = %25
  tax_minor     bigint      not null default 0,
  total_minor   bigint      not null
);

create index order_item_order_idx on order_item (order_id);

-- =============================================================================
-- 4. ÖDEME VE İADE
-- =============================================================================

create type payment_status as enum (
  'pending', 'authorized', 'captured', 'failed', 'canceled', 'refunded', 'charged_back'
);

create table payment (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid        references "order"(id),
  account_id    uuid        not null references account(id),
  provider      payment_provider not null,
  provider_payment_id text,

  status        payment_status not null default 'pending',
  currency      char(3)     not null,
  amount_minor  bigint      not null,

  -- Sağlayıcı ücreti: kâr hesabı için lazım, tahmin edilmez, webhook'tan okunur.
  fee_minor     bigint,

  method        text,                    -- 'card' | 'vipps' | 'apple_pay' | 'klarna' | 'bank_transfer'
  captured_at   timestamptz,
  created_at    timestamptz not null default now(),

  unique (provider, provider_payment_id)
);

create index payment_account_idx on payment (account_id, created_at desc);

create table refund (
  id            uuid primary key default gen_random_uuid(),
  payment_id    uuid        not null references payment(id),
  provider_refund_id text,
  amount_minor  bigint      not null check (amount_minor > 0),
  reason        text,
  created_at    timestamptz not null default now(),
  unique (payment_id, provider_refund_id)
);

-- =============================================================================
-- 5. ABONELİK
--   Doğruluk kaynağı burasıdır. Stripe/Vipps yalnızca tahsilatı yürütür.
-- =============================================================================

create type subscription_status as enum (
  'trialing', 'active', 'past_due', 'paused', 'canceled', 'expired'
);

create table subscription (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid        not null references account(id),
  product_id    uuid        not null references product(id),
  price_id      uuid        not null references price(id),

  provider      payment_provider not null,
  provider_subscription_id text,

  status        subscription_status not null default 'active',
  current_period_start timestamptz not null,
  current_period_end   timestamptz not null,
  cancel_at_period_end boolean not null default false,

  started_at    timestamptz not null default now(),
  canceled_at   timestamptz,
  ended_at      timestamptz,

  unique (provider, provider_subscription_id)
);

create index subscription_account_idx on subscription (account_id);
create index subscription_renewal_idx on subscription (current_period_end)
  where status in ('active', 'trialing', 'past_due');

-- Durum geçişlerinin denetim izi. "Bu abonelik neden iptal oldu?" sorusu
-- destek ekibinin en sık sorduğu sorudur; cevabı burada durur.
create table subscription_event (
  id            uuid primary key default gen_random_uuid(),
  subscription_id uuid      not null references subscription(id) on delete cascade,
  from_status   subscription_status,
  to_status     subscription_status not null,
  reason        text,
  webhook_event_id uuid,
  created_at    timestamptz not null default now()
);

create index subscription_event_sub_idx on subscription_event (subscription_id, created_at desc);

-- =============================================================================
-- 6. ERİŞİM (ENTITLEMENT)
--   "Premium Access = TRUE" bir kullanıcı sütunu DEĞİLDİR.
--   Erişim daima bir kaynağa (sipariş/abonelik) bağlı, süreli ve iptal edilebilir
--   olmalıdır. Boolean sütun, iade ve chargeback günü geri alınamaz.
-- =============================================================================

create type entitlement_source as enum ('order', 'subscription', 'manual', 'trial');

create table entitlement (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid        not null references account(id),
  feature_key   text        not null,   -- 'blog_pro' | 'curiosity.creator' | 'course.ai101'

  source_type   entitlement_source not null,
  source_id     uuid,                   -- order.id veya subscription.id

  granted_at    timestamptz not null default now(),
  expires_at    timestamptz,            -- null = süresiz (satın alınmış kurs/rapor)
  revoked_at    timestamptz,            -- iade/chargeback sonrası doldurulur
  revoke_reason text
);

create index entitlement_lookup_idx on entitlement (account_id, feature_key)
  where revoked_at is null;

comment on table entitlement is
  'Erişim sorgusu: revoked_at is null and (expires_at is null or expires_at > now()).';

-- =============================================================================
-- 7. KREDİ SİSTEMİ
--   Sayaç değil, defter. Nedeni: iade, hatalı tüketim ve AI maliyet mutabakatı
--   tek bir "balance" sütunuyla çözülemez. Ayrıca abonelikle gelen kredi dönem
--   sonunda yanar, satın alınan kredi yanmaz — bunlar ayrı kovalarda durmalı.
-- =============================================================================

create type credit_source as enum ('subscription_period', 'purchase', 'manual', 'promo');

create table credit_grant (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid        not null references account(id),
  source        credit_source not null,
  source_id     uuid,                   -- subscription.id veya order.id

  amount        integer     not null check (amount > 0),
  remaining     integer     not null check (remaining >= 0),

  -- Abonelik kredisi dönem sonunda yanar; satın alınan kredi için null.
  expires_at    timestamptz,
  created_at    timestamptz not null default now(),

  constraint credit_grant_remaining_lte_amount check (remaining <= amount)
);

-- Tüketim sırası: önce süresi dolacak olan (FIFO by expires_at nulls last).
create index credit_grant_consume_idx on credit_grant (account_id, expires_at nulls last, created_at)
  where remaining > 0;

-- Operasyon fiyat listesi. Kod içine gömülmez: AI maliyeti değişince
-- deploy beklemeden güncellenebilmeli.
create table credit_operation (
  code          text primary key,       -- 'trend_scan' | 'blog_article'
  name          text        not null,
  credits       integer     not null check (credits > 0),
  active        boolean     not null default true
);

create table credit_consumption (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid        not null references account(id),
  operation     text        not null references credit_operation(code),
  credits       integer     not null check (credits > 0),

  -- Aynı isteğin iki kez düşülmesini engeller (retry, çift tıklama, kuyruk tekrarı).
  request_id    text        not null unique,

  created_at    timestamptz not null default now()
);

create index credit_consumption_account_idx on credit_consumption (account_id, created_at desc);

-- Hangi tüketimin hangi kovadan düştüğü. İade ve mutabakat bunsuz yapılamaz.
create table credit_allocation (
  id              uuid primary key default gen_random_uuid(),
  consumption_id  uuid      not null references credit_consumption(id) on delete cascade,
  grant_id        uuid      not null references credit_grant(id),
  credits         integer   not null check (credits > 0)
);

create index credit_allocation_grant_idx on credit_allocation (grant_id);

create view credit_balance as
  select account_id,
         coalesce(sum(remaining), 0)::bigint as balance
    from credit_grant
   where remaining > 0
     and (expires_at is null or expires_at > now())
   group by account_id;

-- =============================================================================
-- 8. FATURA (B2B)
-- =============================================================================

create type invoice_status as enum ('draft', 'open', 'paid', 'void', 'uncollectible');

create table invoice (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid        not null references account(id),
  order_id      uuid        references "order"(id),

  number        text        not null unique,   -- ardışık, boşluksuz seri
  status        invoice_status not null default 'draft',

  currency      char(3)     not null,
  subtotal_minor bigint     not null,
  tax_minor     bigint      not null default 0,
  total_minor   bigint      not null,

  due_date      date,
  issued_at     timestamptz,
  paid_at       timestamptz,
  pdf_url       text,

  provider      payment_provider,
  provider_invoice_id text
);

create index invoice_account_idx on invoice (account_id, issued_at desc);
create index invoice_overdue_idx on invoice (due_date) where status = 'open';

create table invoice_line (
  id            uuid primary key default gen_random_uuid(),
  invoice_id    uuid        not null references invoice(id) on delete cascade,
  description   text        not null,
  quantity      integer     not null default 1,
  unit_amount_minor bigint  not null,
  tax_rate_bp   integer     not null default 0,
  total_minor   bigint      not null
);

-- =============================================================================
-- 9. WEBHOOK
--   Erişimi açan tek yer burasıdır. "Başarılı" sayfasına yönlendirilmek
--   ödeme kanıtı değildir.
--
--   Üç kural:
--     1. İmza doğrulanmadan hiçbir olay işlenmez.
--     2. provider_event_id tekildir — aynı olay iki kez işlenmez.
--     3. Olaylar sırasız gelebilir; işleyici sıraya değil duruma bakar.
-- =============================================================================

create type webhook_status as enum ('received', 'processed', 'failed', 'ignored');

create table webhook_event (
  id                uuid primary key default gen_random_uuid(),
  provider          payment_provider not null,
  provider_event_id text        not null,
  type              text        not null,

  payload           jsonb       not null,
  signature_valid   boolean     not null default false,

  status            webhook_status not null default 'received',
  attempts          integer     not null default 0,
  last_error        text,

  received_at       timestamptz not null default now(),
  processed_at      timestamptz,

  unique (provider, provider_event_id)
);

create index webhook_unprocessed_idx on webhook_event (received_at)
  where status in ('received', 'failed');

-- =============================================================================
-- 10. MUTABAKAT
--   Webhook kaybolur. Günlük iş, sağlayıcıdaki ödemeleri bizim kayıtla
--   karşılaştırır; eksik olanı buraya yazar ve uyarı üretir.
-- =============================================================================

create table reconciliation_run (
  id            uuid primary key default gen_random_uuid(),
  provider      payment_provider not null,
  period_start  timestamptz not null,
  period_end    timestamptz not null,
  provider_count integer,
  local_count   integer,
  mismatch_count integer not null default 0,
  details       jsonb,
  ran_at        timestamptz not null default now()
);
