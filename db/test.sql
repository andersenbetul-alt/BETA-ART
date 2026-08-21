-- Kredi ve erişim mantığının doğrulama testleri.
--
-- Çalıştırma:
--   psql -v ON_ERROR_STOP=1 -f db/schema.sql -f db/seed.sql -f db/functions.sql -f db/test.sql
--
-- Her kontrol ASSERT ile yapılır: bir beklenti tutmazsa psql hata verip
-- sıfırdan farklı kodla çıkar. Testler transaction içinde çalışır ve geri
-- alınır; veritabanında iz bırakmaz.

\set ON_ERROR_STOP on
begin;

do $$
declare
  v_acct  uuid := '11111111-1111-1111-1111-111111111111';
  v_sub   uuid := '22222222-2222-2222-2222-222222222222';
  v_empty uuid := '33333333-3333-3333-3333-333333333333';
  v_exp   uuid := '44444444-4444-4444-4444-444444444444';
  v_n     integer;
  v_bal   bigint;
  v_row   record;
  v_ok    boolean;
begin
  insert into account (id, email, billing_country) values (v_acct, 'test@beta.no', 'NO');

  insert into subscription (id, account_id, product_id, price_id, provider,
                            current_period_start, current_period_end)
    select v_sub, v_acct, p.id, pr.id, 'stripe', now(), now() + interval '30 days'
      from product p join price pr on pr.product_id = p.id
     where p.slug = 'curiosity-creator';

  -- 1. Dönem kredisi verilir
  v_n := grant_period_credits(v_sub);
  assert v_n = 1000, format('T1 dönem kredisi: beklenen 1000, gelen %s', v_n);

  -- 2. Aynı dönem için tekrar çağrılırsa kredi verilmez
  v_n := grant_period_credits(v_sub);
  assert v_n = 0, format('T2 çift kredi verildi: %s', v_n);

  -- 3. Satın alınmış süresiz kredi eklenince bakiye toplanır
  insert into credit_grant (account_id, source, amount, remaining, expires_at)
    values (v_acct, 'purchase', 1000, 1000, null);
  select balance into v_bal from credit_balance where account_id = v_acct;
  assert v_bal = 2000, format('T3 bakiye: beklenen 2000, gelen %s', v_bal);

  -- 4. Tüketim doğru tutarı düşer
  select charged, balance into v_n, v_bal
    from consume_credits(v_acct, 'blog_article', 'req-001');
  assert v_n = 20 and v_bal = 1980, format('T4 tüketim: %s kredi, bakiye %s', v_n, v_bal);

  -- 5. FIFO: önce süresi dolacak kovadan düşer
  select remaining into v_n from credit_grant
   where account_id = v_acct and source = 'subscription_period';
  assert v_n = 980, format('T5 FIFO bozuk: dönem kovasında %s kaldı (980 olmalı)', v_n);
  select remaining into v_n from credit_grant
   where account_id = v_acct and source = 'purchase';
  assert v_n = 1000, format('T5 FIFO bozuk: satın alınan kovadan düşüldü (%s)', v_n);

  -- 6. Idempotency: aynı request_id iki kez düşmez
  select charged, balance into v_n, v_bal
    from consume_credits(v_acct, 'blog_article', 'req-001');
  assert v_bal = 1980, format('T6 idempotency bozuk: bakiye %s', v_bal);
  select count(*) into v_n from credit_consumption where request_id = 'req-001';
  assert v_n = 1, format('T6 çift tüketim kaydı: %s', v_n);

  -- 7. Dağıtım izi tutulur ve tüketimle eşleşir
  select sum(a.credits) into v_n
    from credit_consumption c join credit_allocation a on a.consumption_id = c.id
   where c.request_id = 'req-001';
  assert v_n = 20, format('T7 dağıtım izi: %s (20 olmalı)', v_n);

  -- 8. Kovalar arası taşma
  for i in 1..25 loop
    perform consume_credits(v_acct, 'deep_report', 'bulk-' || i);
  end loop;
  select remaining into v_n from credit_grant
   where account_id = v_acct and source = 'subscription_period';
  assert v_n = 0, format('T8 dönem kovası tükenmeliydi: %s kaldı', v_n);
  select balance into v_bal from credit_balance where account_id = v_acct;
  assert v_bal = 730, format('T8 bakiye: beklenen 730, gelen %s', v_bal);

  -- 9. Yetersiz kredi hata verir
  insert into account (id, email, billing_country) values (v_empty, 'bos@beta.no', 'NO');
  insert into credit_grant (account_id, source, amount, remaining)
    values (v_empty, 'purchase', 30, 30);
  begin
    perform consume_credits(v_empty, 'deep_report', 'x-1');
    assert false, 'T9 yetersiz kredide hata beklenirdi';
  exception when insufficient_privilege then null;
  end;

  -- 10. Süresi dolmuş kredi bakiyeye sayılmaz
  insert into account (id, email, billing_country) values (v_exp, 'x@beta.no', 'NO');
  insert into credit_grant (account_id, source, amount, remaining, expires_at)
    values (v_exp, 'subscription_period', 100, 100, now() - interval '1 day');
  select coalesce((select balance from credit_balance where account_id = v_exp), 0) into v_bal;
  assert v_bal = 0, format('T10 süresi dolmuş kredi sayıldı: %s', v_bal);

  -- 11. Erişim: verilmeden yok, verilince var, iade sonrası iptal
  v_ok := has_entitlement(v_acct, 'curiosity.creator');
  assert not v_ok, 'T11 erişim yokken var göründü';
  insert into entitlement (account_id, feature_key, source_type, source_id, expires_at)
    values (v_acct, 'curiosity.creator', 'subscription', v_sub, now() + interval '30 days');
  v_ok := has_entitlement(v_acct, 'curiosity.creator');
  assert v_ok, 'T11 erişim verildi ama görünmüyor';
  update entitlement set revoked_at = now(), revoke_reason = 'refund' where account_id = v_acct;
  v_ok := has_entitlement(v_acct, 'curiosity.creator');
  assert not v_ok, 'T11 iade sonrası erişim geri alınmadı';

  -- 12. Süresi geçmiş erişim kapanır
  insert into entitlement (account_id, feature_key, source_type, expires_at)
    values (v_acct, 'blog_pro', 'order', now() - interval '1 hour');
  v_ok := has_entitlement(v_acct, 'blog_pro');
  assert not v_ok, 'T12 süresi geçmiş erişim hâlâ açık';

  -- 13. Katalog bütünlüğü: her abonelik ürününün fiyatı var
  select count(*) into v_n
    from product p left join price pr on pr.product_id = p.id and pr.active
   where p.kind = 'subscription' and pr.id is null;
  assert v_n = 0, format('T13 fiyatsız abonelik ürünü: %s', v_n);

  -- 14. Kredi operasyonlarının hepsi pozitif
  select count(*) into v_n from credit_operation where credits <= 0;
  assert v_n = 0, format('T14 geçersiz kredi bedeli: %s', v_n);

  raise notice 'TÜM TESTLER GEÇTİ (14 kontrol)';
end $$;

rollback;
