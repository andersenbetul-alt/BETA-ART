-- Kimlik doğrulama ve satır seviyesi güvenlik testleri.
--
-- Çalıştırma (auth_shim_test.sql yalnızca yerel test içindir):
--   psql -f db/schema.sql -f db/auth_shim_test.sql -f db/auth.sql \
--        -f db/seed.sql -f db/functions.sql -f db/test_auth.sql
--
-- Her kontrol ASSERT ile yapılır. Bir beklenti tutmazsa psql sıfırdan farklı
-- kodla çıkar. Testler transaction içinde çalışır ve geri alınır.

\set ON_ERROR_STOP on
begin;

-- Test verisi: iki kullanıcı, ikisinin de ödemesi
insert into auth.users (id, email, raw_user_meta_data) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'ayse@test.no',  '{"name":"Ayşe","billing_country":"no"}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'bjorn@test.no', '{"name":"Bjørn"}');

-- account.id artik trigger tarafindan uretiliyor; auth id'sinden cozulur.
insert into "order" (id, account_id, status, currency, subtotal_minor, total_minor)
  select '11111111-0000-0000-0000-000000000001'::uuid, id, 'paid'::order_status,'NOK',49900,49900
    from account where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  union all
  select '22222222-0000-0000-0000-000000000002'::uuid, id, 'paid'::order_status,'NOK',199900,199900
    from account where auth_user_id = 'bbbbbbbb-0000-0000-0000-000000000002';

insert into payment (order_id, account_id, provider, status, currency, amount_minor)
  select o.id, o.account_id,
         case when o.total_minor = 49900 then 'stripe' else 'vipps' end::payment_provider,
         'captured'::payment_status,'NOK', o.total_minor
    from "order" o;

insert into entitlement (account_id, feature_key, source_type)
  select id, 'report.ai', 'order'::entitlement_source from account
   where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001';

do $$
declare v_n integer; v_txt text; v_ok boolean;
begin
  -- A1: kayıt trigger'ı hesabı otomatik açtı
  select count(*) into v_n from account
   where auth_user_id in ('aaaaaaaa-0000-0000-0000-000000000001','bbbbbbbb-0000-0000-0000-000000000002');
  assert v_n = 2, format('A1 trigger hesap açmadı: %s', v_n);

  -- A2: meta veriden isim ve ülke alındı
  select name into v_txt from account where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001';
  assert v_txt = 'Ayşe', format('A2 isim aktarılmadı: %s', v_txt);
  select billing_country into v_txt from account where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001';
  assert v_txt = 'NO', format('A2 ülke büyük harfe çevrilmedi: %s', v_txt);

  -- A3: e-posta değişimi kopyaya yansıyor
  update auth.users set email = 'ayse.yeni@test.no' where id = 'aaaaaaaa-0000-0000-0000-000000000001';
  select email into v_txt from account where auth_user_id = 'aaaaaaaa-0000-0000-0000-000000000001';
  assert v_txt = 'ayse.yeni@test.no', format('A3 e-posta senkronlanmadı: %s', v_txt);

  -- A4: service_role her şeyi görür
  select count(*) into v_n from payment;
  assert v_n = 2, format('A4 service_role tüm ödemeleri görmeli: %s', v_n);
end $$;

-- --- Ayşe olarak: yalnızca kendi verisi ---
set local role authenticated;
set local request.jwt.claim.sub = 'aaaaaaaa-0000-0000-0000-000000000001';

do $$
declare v_n integer; v_max bigint;
begin
  select count(*) into v_n from account;
  assert v_n = 1, format('R1 kullanıcı yalnızca kendi hesabını görmeli: %s', v_n);

  select count(*), coalesce(max(amount_minor),0) into v_n, v_max from payment;
  assert v_n = 1, format('R2 kullanıcı yalnızca kendi ödemesini görmeli: %s', v_n);
  assert v_max = 49900, format('R2 BAŞKA HESABIN ÖDEMESİ SIZDI: %s', v_max);

  select count(*) into v_n from "order";
  assert v_n = 1, format('R3 sipariş sızıntısı: %s', v_n);

  select count(*) into v_n from entitlement;
  assert v_n = 1, format('R4 hak sızıntısı: %s', v_n);

  -- webhook_event: politika yok => erişilemez
  select count(*) into v_n from webhook_event;
  assert v_n = 0, format('R5 webhook_event sızdı: %s', v_n);

  -- katalog herkese açık
  select count(*) into v_n from product;
  assert v_n > 0, 'R6 katalog okunamıyor';
end $$;

-- --- Yazma engelleri ---
do $$
declare v_n integer;
begin
  -- W1: kendine kredi tanımlayamaz
  begin
    insert into credit_grant (account_id, source, amount, remaining)
      values ('aaaaaaaa-0000-0000-0000-000000000001','manual',1000000,1000000);
    assert false, 'W1 KULLANICI KENDİNE KREDİ TANIMLADI';
  exception when insufficient_privilege then null;
  end;

  -- W2: kendine erişim açamaz
  begin
    insert into entitlement (account_id, feature_key, source_type)
      values ('aaaaaaaa-0000-0000-0000-000000000001','curiosity.agency','manual');
    assert false, 'W2 KULLANICI KENDİNE ERİŞİM AÇTI';
  exception when insufficient_privilege then null;
  end;

  -- W3: ödeme tutarını değiştiremez
  begin
    update payment set amount_minor = 1 where account_id = 'aaaaaaaa-0000-0000-0000-000000000001';
    assert false, 'W3 KULLANICI ÖDEMEYİ DEĞİŞTİRDİ';
  exception when insufficient_privilege then null;
  end;

  -- W4: başkasının hesabını güncelleyemez (politika 0 satır etkiler)
  update account set name = 'ele geçirildi' where auth_user_id = 'bbbbbbbb-0000-0000-0000-000000000002';
  get diagnostics v_n = row_count;
  assert v_n = 0, format('W4 BAŞKA HESAP GÜNCELLENDİ: %s satır', v_n);

  -- V1: KENDİ KDV'sini "doğrulanmış" işaretleyemez.
  -- Bu açık gerçekten vardı: sütun kısıtı olmadan kullanıcı sahte bir VAT
  -- numarasını doğrulanmış gösterip reverse charge ile KDV'den kaçabiliyordu.
  begin
    update account set vat_validated_at = now()
     where auth_user_id = auth.uid();
    assert false, 'V1 KULLANICI KENDİ KDV''SİNİ DOĞRULANMIŞ İŞARETLEDİ — vergi kaçağı açığı';
  exception when insufficient_privilege then null;
  end;

  -- P1: kendi profil alanlarını güncelleyebilmeli
  update account set name = 'Ayşe Y.', company_name = 'Beta AS'
   where auth_user_id = auth.uid();
  get diagnostics v_n = row_count;
  assert v_n = 1, format('P1 kullanıcı kendi profilini güncelleyemedi: %s', v_n);
end $$;

-- --- Diğer kullanıcı kendi verisini görür ---
set local request.jwt.claim.sub = 'bbbbbbbb-0000-0000-0000-000000000002';
do $$
declare v_max bigint;
begin
  select coalesce(max(amount_minor),0) into v_max from payment;
  assert v_max = 199900, format('R7 ikinci kullanıcı kendi ödemesini görmeli: %s', v_max);
end $$;

reset role;

-- --- Silme ve saklama: mali kayıt kullanıcıdan uzun yaşar ---
do $$
declare v_acct uuid; v_n integer; v_email text; v_link uuid;
begin
  select id into v_acct from account where email like 'ayse%';

  -- D1: auth kullanıcısı silinince hesap ve ödemeler DURMALI
  delete from auth.users where id = 'aaaaaaaa-0000-0000-0000-000000000001';

  select count(*) into v_n from account where id = v_acct;
  assert v_n = 1, 'D1 HESAP SİLİNDİ — muhasebe kaydı kayboldu';

  select count(*) into v_n from payment where account_id = v_acct;
  assert v_n = 1, format('D1 ÖDEME KAYDI SİLİNDİ: %s', v_n);

  select count(*) into v_n from "order" where account_id = v_acct;
  assert v_n = 1, format('D1 SİPARİŞ SİLİNDİ: %s', v_n);

  -- D2: giriş bağlantısı koptu
  select auth_user_id into v_link from account where id = v_acct;
  assert v_link is null, format('D2 auth bağlantısı kopmadı: %s', v_link);

  -- D3: anonimleştirme kişisel alanları temizler
  perform anonymize_account(v_acct);
  select email into v_email from account where id = v_acct;
  assert v_email like 'anonim+%@silinmis.invalid',
         format('D3 e-posta anonimleşmedi: %s', v_email);
  select count(*) into v_n from account
   where id = v_acct and (name is not null or org_number is not null
                          or vat_number is not null or vat_validated_at is not null);
  assert v_n = 0, 'D3 kişisel alan kaldı';

  -- D4: mali kayıt hâlâ tam
  select count(*) into v_n from payment where account_id = v_acct and amount_minor = 49900;
  assert v_n = 1, 'D4 ANONİMLEŞTİRME MALİ KAYDI BOZDU';

  -- D5: erişim kapandı
  select count(*) into v_n from entitlement where account_id = v_acct and revoked_at is null;
  assert v_n = 0, format('D5 silinmiş hesabın erişimi açık kaldı: %s', v_n);
end $$;

do $$ begin raise notice 'AUTH/RLS TESTLERİ GEÇTİ (21 kontrol)'; end $$;
rollback;
