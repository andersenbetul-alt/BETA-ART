# Kimlik Doğrulama Mimarisi — Supabase Auth + PostgreSQL

Kimlik Supabase Auth'ta, uygulama verisi PostgreSQL'de. Bu doküman ikisinin
nasıl bağlandığını ve verinin nasıl korunduğunu tarif eder.

Kod karşılığı: `db/auth.sql` · testler: `db/test_auth.sql` (21 kontrol)

---

## 1. Tek veritabanı kararı

**Auth ve uygulama verisi aynı Postgres örneğinde durur** — Supabase'in kendi
veritabanı. Bu, aşağıdaki her şeyin dayandığı karardır.

Nedeni: ayrı veritabanları olsaydı iki şey birden imkânsız olurdu.

- `account.auth_user_id → auth.users.id` foreign key kurulamazdı; kimlik ile
  fatura kaydı arasındaki bağ uygulama koduna kalırdı ve zamanla kopardı.
- `auth.uid()` ile satır seviyesi güvenlik yazılamazdı; her sorguda "bu satır
  bu kullanıcının mı" kontrolünü uygulama yapardı — ve bir yerde unuturdu.

Supabase Postgres'i zaten sağladığı için ayrı bir veritabanı tutmak ek maliyet
ve ek risk demek. "Supabase for auth, PostgreSQL for app data" ifadesi bu
kurulumda **aynı PostgreSQL** anlamına gelir.

---

## 2. Kimlik doğruluk kaynağı: `auth.users`

Parola, OAuth, e-posta doğrulama, oturum — hepsi Supabase'in işi. Bizim
`account` tablomuz kimlik değil, **fatura ve profil kaydıdır.**

```
auth.users.id  ──1:1──>  account.auth_user_id   (foreign key, on delete set null)
auth.users.email ──────>  account.email          (kopya, trigger ile senkron)
```

`account.id` kendi başına bir kimliktir, `auth.users.id`'nin kopyası değil.
Bu ayrım bilinçli: giriş kaydı silinebilir, mali kayıt silinemez. Bkz. §6.

Politikalar `auth.uid()` yerine `current_account_id()` üzerinden yazılır:

```sql
create or replace function current_account_id()
returns uuid language sql stable security definer set search_path = public
as $$ select id from account where auth_user_id = auth.uid(); $$;
```

İki trigger bu bağı canlı tutar:

| Trigger | Ne zaman | Ne yapar |
| --- | --- | --- |
| `on_auth_user_created` | Kullanıcı kaydolduğunda | `account` satırını açar, meta veriden isim ve ülkeyi alır |
| `on_auth_user_email_changed` | E-posta değiştiğinde | `account.email` kopyasını günceller |

`account.email` neden kopya olarak duruyor: fatura ve raporlama sorguları
`auth` şemasına gitmesin diye. Doğruluk kaynağı yine `auth.users`.

**Bugün 1:1.** Bir şirketin birden fazla kullanıcısı gerektiğinde araya
`account_member` tablosu girer ve `current_account_id()` tek bir kimlik yerine
kimlik kümesi döndüren `current_account_ids()` hâline gelir. Politika metni
değişmez, yalnızca `=` yerine `in` yazılır. Politikalar tek kalıpta yazıldığı için bu değişiklik mekaniktir.
Bugün yapılmıyor — B2B müşteri yokken erken soyutlama olurdu.

---

## 3. RLS bir iyileştirme değil, tek engel

**Supabase veritabanını PostgREST üzerinden internete açar.** Anon anahtarı
istemci tarafındadır ve herkese görünür. Satır seviyesi güvenlik olmadan,
giriş yapmış herhangi bir kullanıcı şu tabloların tamamını okuyabilir:

`payment` · `invoice` · `subscription` · `entitlement` · `credit_grant` ·
`order` · `account`

Yani her müşterinin e-postası, adresi, org.nr'si, ne ödediği ve neye abone
olduğu. Bu, "eklesek iyi olur" değil; **kapatılmadığında veri sızıntısıdır.**

Bu yüzden 20 tablonun hepsinde RLS açık. Politikası olmayan tablo, normal
kullanıcı için tamamen erişilemez durumdadır — bu bilinçli bir tercih.

### Üç erişim sınıfı

| Sınıf | Tablolar | Kural |
| --- | --- | --- |
| **Katalog** | `product`, `price`, `credit_operation` | Herkes okur (yalnızca `active` olanlar) |
| **Kendi verisi** | `account`, `order`, `payment`, `subscription`, `entitlement`, `credit_*`, `invoice`, `checkout_session` … | Yalnızca `account_id = current_account_id()` — **sadece okuma** |
| **Yalnızca service_role** | `webhook_event`, `reconciliation_run`, `provider_ref` | Politika yok → kullanıcıya kapalı |

---

## 4. Temel kural: kullanıcı okur, asla yazmaz

Fatura verisi kullanıcının yazabileceği bir şey değildir. Ödeme, hak ve kredi
kayıtları **webhook yolundan** doğar (`service_role`, RLS'i baypas eder).

Kullanıcıya bu tablolarda yazma izni vermek, kendine kredi tanımlamasına veya
premium erişim açmasına izin vermektir. Test edildi:

```
W1  kendine 1.000.000 kredi tanımla   → permission denied ✓
W2  kendine curiosity.agency erişimi  → permission denied ✓
W3  ödeme tutarını değiştir           → permission denied ✓
W4  başkasının hesabını güncelle      → 0 satır etkilendi  ✓
```

### Sütun seviyesinde kısıtlama — gerçek bir açık kapatıldı

Kullanıcı kendi profilini güncelleyebilmeli. Ama RLS politikaları **sütun
bazında kısıtlama yapmaz**: "kendi satırını güncelleyebilir" dediğinizde
o satırdaki *her* sütunu güncelleyebilir.

İlk yazımda politika böyleydi ve testte şu ortaya çıktı:

```sql
update account set vat_number = 'DE999999999', vat_validated_at = now()
 where auth_user_id = auth.uid();
-- UPDATE 1   ← kullanıcı kendi KDV'sini "doğrulanmış" işaretledi
```

Sahte bir Alman VAT numarası girip doğrulanmış göstererek **reverse charge ile
KDV'den kaçmak** mümkündü. Vergi kaçağı, üstelik veritabanının izin verdiği bir
yoldan.

Çözüm sütun seviyesinde `GRANT`:

```sql
revoke update on account from authenticated;
grant update (name, company_name, org_number, vat_number, billing_country)
  on account to authenticated;
```

`vat_validated_at` artık yalnızca `service_role` tarafından yazılabilir —
doğrulama dış bir servisin işidir (VIES), kullanıcının beyanı değil.
Bu senaryo `db/test_auth.sql` içinde **V1** olarak kalıcı teste bağlandı.

### Kapatılmayan, bilinçli olarak açık bırakılan

`billing_country` kullanıcı tarafından güncellenebilir — çünkü kullanıcının
ülkesini beyan etmesi gerekir. Ama bu alan **vergi hesabını doğrudan
etkiler**: Norveç yerine ABD yazan bir kullanıcı MVA'dan kaçmaya çalışabilir.

Veritabanı bunu tek başına çözemez. Gereken kontrol uygulama katmanında:
ödeme sağlayıcısının bildirdiği kart ülkesi ile beyan edilen ülke
karşılaştırılmalı, uyuşmazlık işaretlenmeli. Şema bu kararı kaydediyor
(`order.tax_country`, `order.tax_reason`), doğrulamayı değil.

---

## 5. Test kapsamı

`db/test_auth.sql` — 21 assertion, `./run-tests.sh` içinde koşar:

- **A1-A4** kayıt trigger'ı, meta veri aktarımı, e-posta senkronu, service_role görünürlüğü
- **R1-R7** izolasyon: her kullanıcı yalnızca kendi hesabını, ödemesini, siparişini, hakkını görür; `webhook_event` erişilemez; katalog açık
- **W1-W4** yazma engelleri
- **V1** KDV kendi kendine doğrulama açığı
- **P1** kendi profilini güncelleyebilme
- **D1-D5** silme ve saklama: auth kullanıcısı silinince hesap, sipariş ve
  ödeme ayakta kalır; giriş bağlantısı kopar; anonimleştirme kişisel alanları
  temizler ama mali kaydı bozmaz; erişim hakları kapanır

Testler Supabase'e deploy etmeden çalışır: `db/auth_shim_test.sql` `auth.users`
tablosunun ve `auth.uid()` fonksiyonunun minimal taklidini kurar. **Bu dosya
üretimde kullanılmaz** — Supabase bunları kendisi sağlar.

---

## 6. Açık kararlar

1. **E-posta doğrulama zorunlu mu?** Supabase ayarı. Ödeme öncesi doğrulanmış
   e-posta şart olmalı — fatura oraya gidiyor.
2. **Hangi giriş yöntemleri?** Parola, magic link, Google/Apple OAuth, Vipps
   Login. Norveç pazarı için Vipps Login tanıdıklık avantajı sağlar; Supabase
   desteği araştırılmalı.
3. **`billing_country` çapraz kontrolü** kim yapacak, uyuşmazlıkta ne olacak?
4. **Oturum süresi ve yenileme** politikası — özellikle BETA SENIOR tarafında
   sık çıkış yaptırmak kullanılabilirliği bozar.
5. **Saklama süresi.** Anonimleştirilmiş mali kayıt ne kadar tutulacak?
   Norveç muhasebe mevzuatı beş yıl istiyor; bu süre dolduğunda kaydın
   gerçekten silinmesi gerekiyor. Bugün silen bir iş yok — takvimli bir
   temizlik işi yazılmalı.

---

## 7. Silme ve saklama çelişkisi — nasıl çözüldü

İlk yazımda `account.id` doğrudan `auth.users.id`'ye `on delete cascade` ile
bağlıydı. Bunun anlamı: **bir kullanıcı silindiğinde ödemesi, faturası ve
aboneliği de silinirdi.** Muhasebe mevzuatı bu kayıtların yıllarca saklanmasını
istiyor; GDPR ise kişisel verinin silinmesini. İkisi aynı satırda duramaz.

Çözüm kimliği fatura yaşam döngüsünden ayırmak:

| Karar | Sonuç |
| --- | --- |
| `account.id` kendi başına PK | Mali kayıt kullanıcıdan bağımsız yaşar |
| `auth_user_id` ayrı sütun, `on delete set null` | Giriş silinir, kayıt kalır |
| `anonymize_account(uuid)` | Kişisel alanlar temizlenir, tutar/tarih dokunulmaz |

`anonymize_account()` ne yapar: `email`'i `anonim+<id>@silinmis.invalid`
yapar, `name`, `org_number`, `vat_number`, `vat_validated_at` alanlarını
boşaltır, `auth_user_id`'yi null'lar, açık hakları geri alır ve abonelikleri
iptal eder. **`order`, `payment`, `invoice`, `refund` tablolarına hiç
dokunmaz** — bunlar kime ait olduğu artık okunamayan ama tutarı ve tarihi
sağlam duran mali kayıtlardır.

Fonksiyon `authenticated`'a kapalı (`revoke all ... from public, authenticated`):
silme bir destek/uyum işlemidir, kullanıcının doğrudan çağıracağı bir uç değil.

Bu davranış D1-D5 testlerine bağlandı; `on delete cascade`'e dönülürse süit
düşer.
