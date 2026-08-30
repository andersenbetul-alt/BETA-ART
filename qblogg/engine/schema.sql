-- Curiosity Engine — veri şeması (SQLite)
-- Tek dosya, sunucu yok. Node 22'nin yerleşik node:sqlite modülüyle çalışır.

-- Ham sinyaller: her kaynaktan gelen tekil kayıt. Aynı başlık farklı kaynaklardan
-- gelebilir; kümeleme sonraki adımda yapılır.
CREATE TABLE IF NOT EXISTS signals (
  id           INTEGER PRIMARY KEY,
  source       TEXT NOT NULL,          -- google_news | google_trends | reddit | hn | youtube | gsc | competitor
  external_id  TEXT,                   -- kaynaktaki kimlik (tekrar kaydı önler)
  title        TEXT NOT NULL,
  url          TEXT,
  raw_score    REAL,                   -- kaynağın kendi metriği (puan, oy, izlenme)
  captured_at  TEXT NOT NULL,          -- ISO 8601
  published_at TEXT,
  UNIQUE (source, external_id)
);

-- Konular: sinyallerden türetilen kümeler. "AI agents for small business" gibi.
CREATE TABLE IF NOT EXISTS topics (
  id           INTEGER PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  pillar       TEXT,                   -- ai | money | jobs | business | life | senior | safety
  first_seen   TEXT NOT NULL,
  last_seen    TEXT NOT NULL,
  signal_count INTEGER DEFAULT 0,
  status       TEXT DEFAULT 'new'      -- new | scored | queued | drafted | published | skipped
);

CREATE TABLE IF NOT EXISTS topic_signals (
  topic_id  INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  signal_id INTEGER NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
  PRIMARY KEY (topic_id, signal_id)
);

-- İnsanların sorduğu sorular. Kümelenmiş hâlde tutulur ki aynı soruya
-- on ayrı makale yazılmasın (Google'ın "scaled content abuse" tanımı).
CREATE TABLE IF NOT EXISTS questions (
  id         INTEGER PRIMARY KEY,
  topic_id   INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question   TEXT NOT NULL,
  cluster    TEXT,                     -- aynı niyetteki sorular aynı cluster'da
  intent     TEXT,                     -- bilgi | karsilastirma | islem
  source     TEXT,
  UNIQUE (topic_id, question)
);

-- Puanlar. Her çalıştırmada yeniden hesaplanır; geçmiş saklanır ki
-- bir konunun yükselişi/düşüşü görülebilsin.
CREATE TABLE IF NOT EXISTS scores (
  id            INTEGER PRIMARY KEY,
  topic_id      INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  run_id        INTEGER NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  growth        REAL, search_interest REAL, social REAL, commercial REAL,
  competition   REAL, brand_fit REAL, freshness REAL,
  trend_score   REAL NOT NULL,
  opportunity   REAL,                  -- içerik boşluğu: soruluyor ama iyi cevaplanmamış
  money         REAL,                  -- gelir yolu netliği
  final_score   REAL NOT NULL,
  decision      TEXT NOT NULL,         -- skip | idea | draft | publish | hot
  created_at    TEXT NOT NULL
);

-- Yazı kuyruğu ve durumu.
CREATE TABLE IF NOT EXISTS articles (
  id           INTEGER PRIMARY KEY,
  topic_id     INTEGER NOT NULL REFERENCES topics(id),
  slug         TEXT UNIQUE,
  title        TEXT,
  speed        TEXT,                   -- breaking | rising | evergreen
  money_path   TEXT,                   -- affiliate | product | course | service | ads
  status       TEXT DEFAULT 'queued',  -- queued | researching | drafted | review | published
  word_target  INTEGER,
  draft_path   TEXT,
  research_path TEXT,
  published_at TEXT,
  created_at   TEXT NOT NULL
);

-- Search Console geri beslemesi: hangi sorgudan trafik geldi.
CREATE TABLE IF NOT EXISTS gsc_queries (
  id          INTEGER PRIMARY KEY,
  query       TEXT NOT NULL,
  page        TEXT,
  clicks      INTEGER, impressions INTEGER, ctr REAL, position REAL,
  period      TEXT NOT NULL,
  UNIQUE (query, page, period)
);

-- Çalıştırma kaydı: ne zaman, kaç sinyal, kaç konu, kaç karar.
CREATE TABLE IF NOT EXISTS runs (
  id           INTEGER PRIMARY KEY,
  started_at   TEXT NOT NULL,
  finished_at  TEXT,
  mode         TEXT,                   -- live | demo
  signals_in   INTEGER DEFAULT 0,
  topics_out   INTEGER DEFAULT 0,
  notes        TEXT
);

CREATE INDEX IF NOT EXISTS idx_signals_captured ON signals(captured_at);
CREATE INDEX IF NOT EXISTS idx_scores_topic ON scores(topic_id, created_at);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
