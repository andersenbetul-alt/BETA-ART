-- Ödeme ve abonelik şeması.
--
-- Tasarım kararları (sonradan değiştirilmesi pahalı olanlar):
--
-- 1. PARA TAM SAYI OLARAK SAKLANIR. Tutarlar en küçük birimde (øre/cent) ve
--    integer'dır. Ondalıklı sayı kullanmak yuvarlama hatası üretir; bir kez
--    üretti mi muhasebe mutabakatı bozulur.
-- 2. KREDİ BAKİYESİ SÜTUN DEĞİL, DEFTERDİR. credit_ledger append-only'dir;
--    bakiye toplamdan hesaplanır. Sütun tutmak eşzamanlı isteklerde yanlış
--    bakiye üretir ve "bu kredi nereye gitti" sorusu cevapsız kalır.
-- 3. HAK (ENTITLEMENT) ÖDEMEDEN AYRIDIR. Kartla, Vipps'le veya faturayla
--    ödenmiş olması kullanıcının neye erişebildiğini değiştirmez.
-- 4. WEBHOOK'LAR TEKİLDİR. Aynı olay iki kez gelirse ikinci kez işlenmez;
--    yoksa çift kredi yüklenir.
-- 5. SAĞLAYICI BAĞIMSIZ. Stripe, Vipps ve fatura aynı tablolarda yaşar;
--    ayırt edici alan (provider, provider_ref) çiftidir.

CREATE TABLE IF NOT EXISTS accounts (
  id          INTEGER PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT,
  company     TEXT,
  vat_id      TEXT,                       -- B2B ters ibraz için
  country     TEXT,                       -- ISO 3166-1 alpha-2
  currency    TEXT NOT NULL DEFAULT 'NOK',
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id        INTEGER PRIMARY KEY,
  code      TEXT NOT NULL UNIQUE,         -- blog_pro | report_ai_2026 | engine_starter …
  name      TEXT NOT NULL,
  kind      TEXT NOT NULL,                -- one_time | subscription | credit_pack
  active    INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS prices (
  id           INTEGER PRIMARY KEY,
  product_id   INTEGER NOT NULL REFERENCES products(id),
  currency     TEXT NOT NULL,             -- NOK | EUR | USD
  unit_amount  INTEGER NOT NULL,          -- en küçük birim: 49900 = 499,00 NOK
  interval     TEXT,                      -- month | year | NULL (tek seferlik)
  credits      INTEGER NOT NULL DEFAULT 0,-- dönem başına verilen kredi
  provider_ref TEXT,                      -- Stripe price_id vb.
  active       INTEGER NOT NULL DEFAULT 1,
  UNIQUE (product_id, currency, interval)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                   INTEGER PRIMARY KEY,
  account_id           INTEGER NOT NULL REFERENCES accounts(id),
  price_id             INTEGER NOT NULL REFERENCES prices(id),
  provider             TEXT NOT NULL,     -- stripe | vipps | manual
  provider_ref         TEXT,
  status               TEXT NOT NULL,     -- trialing | active | past_due | canceled
  current_period_start TEXT,
  current_period_end   TEXT,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  created_at           TEXT NOT NULL,
  UNIQUE (provider, provider_ref)
);

CREATE TABLE IF NOT EXISTS payments (
  id           INTEGER PRIMARY KEY,
  account_id   INTEGER NOT NULL REFERENCES accounts(id),
  provider     TEXT NOT NULL,             -- stripe | vipps | invoice
  provider_ref TEXT NOT NULL,             -- payment_intent / orderId / fatura no
  amount       INTEGER NOT NULL,          -- en küçük birim
  currency     TEXT NOT NULL,
  fee          INTEGER,                   -- sağlayıcı komisyonu (biliniyorsa)
  status       TEXT NOT NULL,             -- pending | succeeded | failed | refunded
  kind         TEXT NOT NULL,             -- one_time | subscription | credit_pack
  product_id   INTEGER REFERENCES products(id),
  created_at   TEXT NOT NULL,
  UNIQUE (provider, provider_ref)
);

-- B2B: kart yerine fatura. AI Workforce satışlarının çoğu buradan geçecek.
CREATE TABLE IF NOT EXISTS invoices (
  id          INTEGER PRIMARY KEY,
  account_id  INTEGER NOT NULL REFERENCES accounts(id),
  number      TEXT NOT NULL UNIQUE,       -- 2026-0001
  amount      INTEGER NOT NULL,
  vat_amount  INTEGER NOT NULL DEFAULT 0,
  currency    TEXT NOT NULL,
  status      TEXT NOT NULL,              -- draft | sent | paid | overdue | void
  issued_at   TEXT,
  due_at      TEXT,
  paid_at     TEXT,
  payment_id  INTEGER REFERENCES payments(id),
  note        TEXT
);

-- Kredi defteri: append-only. Bakiye = SUM(delta).
CREATE TABLE IF NOT EXISTS credit_ledger (
  id          INTEGER PRIMARY KEY,
  account_id  INTEGER NOT NULL REFERENCES accounts(id),
  delta       INTEGER NOT NULL,           -- + yükleme, − kullanım
  reason      TEXT NOT NULL,              -- subscription_grant | topup | usage | refund | expiry
  ref_type    TEXT,                       -- payment | subscription | job
  ref_id      TEXT,
  balance_after INTEGER,                  -- denetim kolaylığı için; kaynak değil
  created_at  TEXT NOT NULL
);

-- Kullanıcının neye erişebildiği. Ödeme yönteminden bağımsızdır.
CREATE TABLE IF NOT EXISTS entitlements (
  id          INTEGER PRIMARY KEY,
  account_id  INTEGER NOT NULL REFERENCES accounts(id),
  feature     TEXT NOT NULL,              -- blog_pro | report:ai_2026 | engine:starter
  source_type TEXT NOT NULL,              -- subscription | payment | manual
  source_id   TEXT,
  granted_at  TEXT NOT NULL,
  expires_at  TEXT,                       -- NULL = süresiz (satın alınan rapor gibi)
  revoked_at  TEXT,
  UNIQUE (account_id, feature, source_id)
);

-- Webhook tekilliği: aynı olay iki kez işlenmez.
CREATE TABLE IF NOT EXISTS webhook_events (
  id           INTEGER PRIMARY KEY,
  provider     TEXT NOT NULL,
  event_id     TEXT NOT NULL,
  type         TEXT,
  payload      TEXT,
  received_at  TEXT NOT NULL,
  processed_at TEXT,
  status       TEXT NOT NULL DEFAULT 'received',  -- received | processed | failed | ignored
  error        TEXT,
  UNIQUE (provider, event_id)
);

-- Kullanım ölçümü: kredi tüketen her iş buraya yazılır.
CREATE TABLE IF NOT EXISTS usage_events (
  id          INTEGER PRIMARY KEY,
  account_id  INTEGER NOT NULL REFERENCES accounts(id),
  operation   TEXT NOT NULL,              -- trend_scan | research | article | report
  credits     INTEGER NOT NULL,
  meta        TEXT,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ledger_account ON credit_ledger(account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ent_account ON entitlements(account_id, feature);
CREATE INDEX IF NOT EXISTS idx_pay_account ON payments(account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_usage_account ON usage_events(account_id, created_at);
