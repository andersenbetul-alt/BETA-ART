-- =============================================================================
-- Katalog başlangıç verisi — huni basamakları ve Curiosity Engine planları.
-- Fiyatlar minor unit (øre). 149 NOK = 14900.
-- Not: buradaki rakamlar başlangıç değeridir; nihai fiyat birim maliyet
-- analizinden sonra belirlenir.
-- =============================================================================

-- --- Huni: FREE -> PRO -> REPORT -> COURSE -> CONSULTING -> BUSINESS ---------

insert into product (slug, name, kind, feature_key, description) values
  ('newsletter',    'Newsletter',              'one_time',    'newsletter',      'Ücretsiz — huninin girişi'),
  ('blog-pro',      'Blog Pro',                'subscription','blog_pro',        'Premium makaleler, arşiv, erken erişim'),
  ('ai-report',     'AI/Business Raporu',      'one_time',    'report.ai',       'Tek seferlik özel rapor'),
  ('course-ai',     'AI Eğitimi',              'one_time',    'course.ai',       'Kurs erişimi, süresiz'),
  ('consulting',    'Danışmanlık',             'service',     null,              'Saatlik/paket danışmanlık — fatura ile'),
  ('ai-setup',      'AI Setup (BETA WORK)',    'service',     null,              'AI çalışanı kurulumu — fatura ile');

-- Blog Pro: 99-199 NOK/ay aralığı, açılış 149
insert into price (product_id, currency, amount_minor, interval, tax_behavior)
  select id, 'NOK', 14900, 'month', 'inclusive' from product where slug = 'blog-pro';

-- Rapor: 299-999 aralığı, açılış 499
insert into price (product_id, currency, amount_minor, tax_behavior)
  select id, 'NOK', 49900, 'inclusive' from product where slug = 'ai-report';

-- Kurs: 999-4.999 aralığı, açılış 1.999
insert into price (product_id, currency, amount_minor, tax_behavior)
  select id, 'NOK', 199900, 'inclusive' from product where slug = 'course-ai';

-- Danışmanlık ve AI setup: B2B, fiyat teklife göre değişir (2.500-15.000 /
-- 10.000-50.000+). Sabit price satırı yok; sipariş satırında tutar donar.

-- --- Curiosity Engine (SaaS) -------------------------------------------------

insert into product (slug, name, kind, feature_key, credits_per_period, description) values
  ('curiosity-starter',  'Curiosity Starter',  'subscription', 'curiosity.starter',    100, '100 trend analizi'),
  ('curiosity-creator',  'Curiosity Creator',  'subscription', 'curiosity.creator',   1000, '1.000 analiz + blog üretimi'),
  ('curiosity-business', 'Curiosity Business', 'subscription', 'curiosity.business',  5000, 'Çoklu site + otomasyon'),
  ('curiosity-agency',   'Curiosity Agency',   'subscription', 'curiosity.agency',   20000, 'Çoklu müşteri + white label');

insert into price (product_id, currency, amount_minor, interval, tax_behavior)
  select id, 'NOK', v.amount, 'month', 'inclusive'
    from product join (values
      ('curiosity-starter',   49900),
      ('curiosity-creator',  149900),
      ('curiosity-business', 499900),
      ('curiosity-agency',  1499900)
    ) as v(slug, amount) on product.slug = v.slug;

-- Ek kredi paketi. FİYAT BİLEREK BOŞ: 1.000 kredinin bize gerçek AI maliyeti
-- ölçülmeden fiyat konmaz. Ölçüm sonrası price satırı eklenir.
insert into product (slug, name, kind, feature_key, description) values
  ('credits-1000', '+1.000 Credits', 'credit_pack', null,
   'Ek kredi paketi — fiyat birim maliyet ölçümünden sonra belirlenecek');

-- --- Kredi operasyon fiyatları ----------------------------------------------
-- Kod içine gömülmez: AI maliyeti değişince deploy beklemeden güncellenir.

insert into credit_operation (code, name, credits) values
  ('trend_scan',      'Trend taraması',      1),
  ('keyword_analysis','Anahtar kelime analizi', 2),
  ('research',        'Araştırma',           5),
  ('blog_article',    'Blog makalesi',      20),
  ('deep_report',     'Derin rapor',        50);
