-- Kredi ve erişim mantığının doğrulama testleri.
-- Çalıştırma: psql -f db/schema.sql -f db/seed.sql -f db/functions.sql -f db/test.sql
-- Hepsi transaction içinde çalışır ve rollback eder; veri bırakmaz.

begin;

-- Senaryo: Creator planı (1.000 kredi/ay) + 1.000 satın alınmış kredi
insert into account (id, email, billing_country)
  values ('11111111-1111-1111-1111-111111111111', 'test@beta.no', 'NO');

insert into subscription (id, account_id, product_id, price_id, provider,
                          current_period_start, current_period_end)
  select '22222222-2222-2222-2222-222222222222',
         '11111111-1111-1111-1111-111111111111',
         p.id, pr.id, 'stripe', now(), now() + interval '30 days'
    from product p join price pr on pr.product_id = p.id
   where p.slug = 'curiosity-creator';

\echo '--- 1. Dönem kredisi verilir (1000, 30 gün sonra yanar) ---'
select grant_period_credits('22222222-2222-2222-2222-222222222222') as verilen;

\echo '--- 2. Aynı dönem için tekrar çağrılır: 0 dönmeli ---'
select grant_period_credits('22222222-2222-2222-2222-222222222222') as tekrar;

\echo '--- 3. Satın alınmış 1000 kredi (süresiz) eklenir ---'
insert into credit_grant (account_id, source, amount, remaining, expires_at)
  values ('11111111-1111-1111-1111-111111111111', 'purchase', 1000, 1000, null);

select balance as toplam_bakiye from credit_balance
 where account_id = '11111111-1111-1111-1111-111111111111';

\echo '--- 4. Blog makalesi (20 kredi) üretilir ---'
select * from consume_credits('11111111-1111-1111-1111-111111111111', 'blog_article', 'req-001');

\echo '--- 5. FIFO kontrolü: düşüş SÜRESİ DOLACAK kovadan olmalı ---'
select g.source, g.amount, g.remaining, (g.expires_at is null) as suresiz
  from credit_grant g
 where g.account_id = '11111111-1111-1111-1111-111111111111'
 order by g.expires_at nulls last;

\echo '--- 6. Idempotency: aynı request_id tekrar gönderilir, bakiye düşmemeli ---'
select * from consume_credits('11111111-1111-1111-1111-111111111111', 'blog_article', 'req-001');

\echo '--- 7. Dağıtım izi ---'
select c.operation, c.credits, a.credits as kovadan_dusen, (g.expires_at is null) as suresiz_kova
  from credit_consumption c
  join credit_allocation a on a.consumption_id = c.id
  join credit_grant g on g.id = a.grant_id;

\echo '--- 8. Derin rapor x 25 = 1250 kredi: iki kovaya taşmalı ---'
select sum(c.charged) as toplam
  from generate_series(1,25) i,
       lateral consume_credits('11111111-1111-1111-1111-111111111111','deep_report','bulk-'||i) c;

select g.source, g.remaining, (g.expires_at is null) as suresiz
  from credit_grant g where g.account_id = '11111111-1111-1111-1111-111111111111'
 order by g.expires_at nulls last;

\echo '--- 10. Erişim kontrolü ---'
select has_entitlement('11111111-1111-1111-1111-111111111111','curiosity.creator') as erisim_yok_once;
insert into entitlement (account_id, feature_key, source_type, source_id, expires_at)
  values ('11111111-1111-1111-1111-111111111111','curiosity.creator','subscription',
          '22222222-2222-2222-2222-222222222222', now() + interval '30 days');
select has_entitlement('11111111-1111-1111-1111-111111111111','curiosity.creator') as erisim_var;

\echo '--- 11. İade sonrası erişim geri alınır ---'
update entitlement set revoked_at = now(), revoke_reason = 'refund'
 where account_id = '11111111-1111-1111-1111-111111111111';
select has_entitlement('11111111-1111-1111-1111-111111111111','curiosity.creator') as erisim_iptal;

rollback;

begin;
insert into account (id, email, billing_country)
  values ('33333333-3333-3333-3333-333333333333', 'bos@beta.no', 'NO');
insert into credit_grant (account_id, source, amount, remaining)
  values ('33333333-3333-3333-3333-333333333333', 'purchase', 30, 30);

\echo '--- 12. Yetersiz kredi hatası: bakiye 30, derin rapor 50 kredi istiyor ---'
select * from consume_credits('33333333-3333-3333-3333-333333333333','deep_report','x-1');
rollback;

begin;
insert into account (id, email, billing_country) values ('44444444-4444-4444-4444-444444444444','x@b.no','NO');
insert into credit_grant (account_id, source, amount, remaining, expires_at)
  values ('44444444-4444-4444-4444-444444444444','subscription_period',100,100, now() - interval '1 day');
\echo '--- 13. Süresi dolmuş kredi bakiyeye sayılmamalı ---'
select coalesce((select balance from credit_balance where account_id='44444444-4444-4444-4444-444444444444'),0) as bakiye;
select * from consume_credits('44444444-4444-4444-4444-444444444444','trend_scan','y-1');
rollback;
