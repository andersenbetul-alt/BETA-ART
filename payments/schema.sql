-- COBBAN / Future Human — merkezi ödeme şeması (PostgreSQL)
--
-- Kurallar:
--   * Para her zaman TAM SAYI ve minor unit (øre/cent/kuruş). Float yok.
--   * Her tutarın yanında para birimi saklanır. Tek para birimi varsayılmaz.
--   * KDV satır bazında ve İŞLEM ANINDA dondurulur — oranlar değişir,
--     geçmiş faturalar değişmemelidir.
--   * Credit bakiyesi bir sütun değil, defterin toplamıdır (append-only).
--   * Sağlayıcı kimlikleri (provider_*_id) her zaman saklanır: mutabakat,
--     iade ve itiraz süreçleri bunlar olmadan yürümez.

CREATE TYPE payment_provider AS ENUM ('stripe', 'vipps', 'klarna', 'invoice', 'manual');
CREATE TYPE product_kind     AS ENUM ('one_time', 'subscription', 'credit_pack', 'physical');
CREATE TYPE entitlement_src  AS ENUM ('payment', 'subscription', 'grant', 'trial');
CREATE TYPE entitlement_st   AS ENUM ('active', 'expired', 'revoked');
CREATE TYPE payment_status   AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'disputed');
CREATE TYPE sub_status       AS ENUM ('trialing', 'active', 'past_due', 'paused', 'canceled', 'incomplete');
CREATE TYPE tax_treatment    AS ENUM ('b2c_domestic', 'b2c_oss', 'b2b_reverse_charge', 'export_zero', 'exempt');

-- ---------------------------------------------------------------- müşteri

CREATE TABLE customers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id    text UNIQUE NOT NULL,          -- kimlik sağlayıcıdaki kimlik
  email           citext NOT NULL,
  -- KDV bu iki alandan hesaplanır; kart BIN'inden DEĞİL.
  billing_country char(2) NOT NULL,              -- ISO 3166-1 alpha-2
  is_business     boolean NOT NULL DEFAULT false,
  vat_number      text,                          -- B2B reverse charge için (VIES ile doğrulanır)
  vat_validated_at timestamptz,
  provider_ids    jsonb NOT NULL DEFAULT '{}',   -- {"stripe":"cus_...","vipps":"..."}
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON customers (email);

-- ---------------------------------------------------------------- katalog

CREATE TABLE products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  kind          product_kind NOT NULL,
  name          jsonb NOT NULL,                  -- {"no":"...","en":"...","tr":"..."}
  -- KDV kategorisi: dijital hizmet mi, fiziksel mal mı, eğitim mi.
  -- OSS oranı ve muafiyetler buna göre belirlenir.
  tax_category  text NOT NULL,
  credits_granted integer,                       -- credit_pack ise kaç credit verir
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Fiyat pazar başına EL İLE yazılır; otomatik kur çevirimi kullanılmaz.
CREATE TABLE prices (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        uuid NOT NULL REFERENCES products(id),
  currency          char(3) NOT NULL,
  amount_minor      bigint NOT NULL CHECK (amount_minor >= 0),
  tax_inclusive     boolean NOT NULL DEFAULT true,  -- Norveç'te yasal zorunluluk
  interval          text,                            -- 'month' | 'year' | NULL
  interval_count    smallint,
  provider          payment_provider NOT NULL,
  provider_price_id text,                            -- Stripe price_...
  active            boolean NOT NULL DEFAULT true,
  UNIQUE (product_id, currency, interval, provider)
);

-- ---------------------------------------------------------------- ödeme

CREATE TABLE checkout_sessions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         uuid REFERENCES customers(id),   -- misafir ödemede NULL
  provider            payment_provider NOT NULL,
  provider_session_id text NOT NULL,
  status              text NOT NULL DEFAULT 'open',
  -- Sepetin sunucudaki hâli. İstemciden gelen fiyata asla güvenilmez.
  line_items          jsonb NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  expires_at          timestamptz,
  UNIQUE (provider, provider_session_id)
);

CREATE TABLE payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         uuid NOT NULL REFERENCES customers(id),
  provider            payment_provider NOT NULL,
  provider_payment_id text NOT NULL,
  status              payment_status NOT NULL,
  currency            char(3) NOT NULL,
  gross_minor         bigint NOT NULL,   -- müşterinin ödediği toplam
  vat_minor           bigint NOT NULL,   -- içindeki KDV
  net_minor           bigint NOT NULL,   -- KDV hariç
  fee_minor           bigint,            -- sağlayıcı komisyonu (mutabakattan gelir)
  -- KDV işlem anında dondurulur: oran sonradan değişse bile fatura değişmez
  vat_rate            numeric(5,4) NOT NULL,
  vat_country         char(2) NOT NULL,
  tax_treatment       tax_treatment NOT NULL,
  refunded_minor      bigint NOT NULL DEFAULT 0,
  paid_at             timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_payment_id)
);
CREATE INDEX ON payments (customer_id, created_at DESC);
CREATE INDEX ON payments (vat_country, paid_at);   -- OSS beyanı bu indeksten çıkar

CREATE TABLE subscriptions (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id          uuid NOT NULL REFERENCES customers(id),
  price_id             uuid NOT NULL REFERENCES prices(id),
  provider             payment_provider NOT NULL,
  provider_sub_id      text NOT NULL,
  status               sub_status NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end   timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  canceled_at          timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_sub_id)
);
CREATE INDEX ON subscriptions (customer_id, status);

-- ------------------------------------------------------------- haklar

-- "premium = true" yerine: neyin, hangi kaynaktan, ne zamana kadar verildiği.
-- İade/chargeback geldiğinde source_id ile tam olarak o hak geri alınır.
CREATE TABLE entitlements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id),
  product_id  uuid NOT NULL REFERENCES products(id),
  source_type entitlement_src NOT NULL,
  source_id   uuid NOT NULL,          -- payments.id | subscriptions.id
  status      entitlement_st NOT NULL DEFAULT 'active',
  valid_from  timestamptz NOT NULL DEFAULT now(),
  valid_to    timestamptz,            -- NULL = süresiz (ör. satın alınmış kurs)
  revoked_at  timestamptz,
  revoke_reason text
);
CREATE INDEX ON entitlements (customer_id, status);
CREATE INDEX ON entitlements (source_type, source_id);

-- ------------------------------------------------------------- credits

-- Append-only defter. Bakiye = SUM(delta). Bakiyeyi sütunda tutup güncellemek
-- eşzamanlı istekte yanlış sonuç verir ve denetlenemez.
CREATE TABLE credit_ledger (
  id           bigserial PRIMARY KEY,
  customer_id  uuid NOT NULL REFERENCES customers(id),
  delta        integer NOT NULL,       -- + satın alma/hediye, − kullanım
  reason       text NOT NULL,          -- 'subscription_grant','pack_purchase','trend_scan',...
  source_type  text,                   -- 'payment' | 'subscription' | 'operation'
  source_id    uuid,
  -- Çok amaçlı kupon modelinde gelir BURADA tanınır (kullanım anında).
  -- Tek amaçlı modelde satın alma anında tanınır; bu alan yine denetim izidir.
  recognized_minor bigint,
  currency     char(3),
  expires_at   timestamptz,            -- son kullanma tarihi varsa
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON credit_ledger (customer_id, created_at DESC);

-- Bakiye görünümü — tek doğru kaynak
CREATE VIEW credit_balances AS
SELECT customer_id,
       SUM(delta) FILTER (WHERE expires_at IS NULL OR expires_at > now()) AS balance
FROM credit_ledger
GROUP BY customer_id;

-- İşlem başına credit maliyeti; kodda sabit yazılmaz, buradan okunur
CREATE TABLE credit_costs (
  operation   text PRIMARY KEY,        -- 'trend_scan','keyword_analysis','blog_article',...
  credits     integer NOT NULL CHECK (credits > 0),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------- fatura

CREATE TABLE invoices (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         uuid NOT NULL REFERENCES customers(id),
  payment_id          uuid REFERENCES payments(id),
  number              text UNIQUE NOT NULL,   -- kesintisiz sıra — bokføringsloven
  currency            char(3) NOT NULL,
  net_minor           bigint NOT NULL,
  vat_minor           bigint NOT NULL,
  gross_minor         bigint NOT NULL,
  vat_rate            numeric(5,4) NOT NULL,
  vat_country         char(2) NOT NULL,
  tax_treatment       tax_treatment NOT NULL,
  -- B2B reverse charge'da faturada zorunlu ibare + karşı taraf KDV numarası
  counterparty_vat    text,
  issued_at           timestamptz NOT NULL DEFAULT now(),
  pdf_url             text
);

-- ------------------------------------------------------------- webhook

-- Idempotency ve yeniden deneme kaydı. Ayrıntı: webhooks.md
CREATE TABLE webhook_events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider          payment_provider NOT NULL,
  provider_event_id text NOT NULL,
  type              text NOT NULL,
  payload           jsonb NOT NULL,
  received_at       timestamptz NOT NULL DEFAULT now(),
  processed_at      timestamptz,
  status            text NOT NULL DEFAULT 'pending',  -- pending|processed|failed|ignored
  attempts          smallint NOT NULL DEFAULT 0,
  last_error        text,
  -- Aynı olay iki kez gelirse ikincisi buraya çarpar ve işlenmez.
  UNIQUE (provider, provider_event_id)
);
CREATE INDEX ON webhook_events (status, received_at);
