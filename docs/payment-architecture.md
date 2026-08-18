# Ödeme Altyapısı — Mimari ve Kararlar

Blog, Curiosity Engine ve AI business ürünlerinin tamamı **tek ödeme
altyapısı** üzerinden satılır. Her ürüne ayrı ödeme sistemi kurulmaz.

Bu doküman mimariyi, alınan kararları ve henüz açık olan soruları tutar.
Veritabanı karşılığı: `db/schema.sql`, iş kuralları `db/functions.sql`.

---

## 1. Akış

```
                    WEB SİTESİ
                        ↓
                  Ürün / Hizmet
                        ↓
                  SMART CHECKOUT          ← müşteriye 3 seçenek gösterir, 15 logo değil
                        ↓
         ┌──────────────┼──────────────┐
         ↓              ↓              ↓
       VIPPS       CARD/WALLET      INVOICE
                     Stripe          (B2B)
         ↓              ↓              ↓
        NOK       NOK/EUR/USD      NOK, vadeli
         └──────────────┼──────────────┘
                        ↓
                  PAYMENT ENGINE          ← bizim backend: tek doğruluk kaynağı
                        ↓
         ┌──────────────┼───────────────┐
         ↓              ↓               ↓
    Tek ödeme       Abonelik      Kullanıma göre
         ↓              ↓               ↓
     E-kitap        Blog Pro        AI Credits
     Rapor          Curiosity       API
     Kurs           Membership      Agents
```

---

## 2. En kritik karar: doğruluk kaynağı bizde

**Stripe ve Vipps tahsilat kanalıdır, muhasebe defteri değildir.**

"Kullanıcı premium mi?" sorusu asla Stripe'a sorulmaz. `entitlement` tablosuna
sorulur. Aboneliğin durumu Stripe'tan okunmaz; `subscription` tablosundan okunur,
Stripe webhook'u yalnızca o tabloyu günceller.

Bunun nedeni doğrudan sizin mimarinizden çıkıyor: **aynı planı hem Stripe'tan
hem Vipps'ten satacaksınız.** İki sağlayıcının abonelik modeli aynı değil —
dönem hesabı, deneme süresi, başarısız ödeme davranışı farklı. Doğruluk
kaynağını sağlayıcıya bırakırsanız aynı ürünün iki farklı gerçeği olur ve
"Vipps'li müşteri neden erişemiyor" hatalarını asla kapatamazsınız.

Karşılığı `provider_ref` tablosu: bizim ürün/fiyat/abonelik kayıtlarımızı
sağlayıcıdaki kimliklere bağlar. Sağlayıcı değişirse eşleme değişir, veri değil.

### Buna bağlı ikinci karar: `premium = true` diye bir sütun yok

Erişim daima bir kaynağa bağlı, süreli ve **geri alınabilir** olmalı:

```sql
select has_entitlement(account_id, 'curiosity.creator');
```

`entitlement` satırı hangi siparişten/abonelikten doğduğunu, ne zaman
biteceğini ve iptal edilip edilmediğini taşır. Boolean sütun, iade veya
chargeback günü geri alınamaz — kim neye niye erişiyor bilinmez.

---

## 3. Smart checkout: az seçenek göster

| Müşteri | Gösterilen | Not |
| --- | --- | --- |
| Norveç B2C | Vipps · Kart · Apple/Google Pay | Vipps ilk sırada |
| Avrupa B2C | Kart · Wallet · (pahalı üründe Klarna) | |
| ABD / diğer | Kart · Wallet | |
| B2B (org.nr girilmiş) | Kart · Fatura | Fatura yalnızca doğrulanmış şirkete |

Yönlendirme kuralı: `account.billing_country` + `account.type` + sepet tutarı.
Kural koda gömülmez, tablodan okunur — yeni ülke açmak deploy gerektirmemeli.

**Klarna'yı ayrı entegre etmeyin.** Klarna, Stripe Checkout içinde bir ödeme
yöntemi olarak açılabiliyor; ayrı API/hosted page entegrasyonu ilk aşamada
gereksiz iş. Ayrı entegrasyon ancak Stripe üzerinden alamadığınız bir Klarna
özelliğine ihtiyaç duyarsanız anlamlı olur.

---

## 4. Webhook sözleşmesi

**Erişimi açan tek yer webhook'tur.** Başarı sayfasına yönlendirilmek ödeme
kanıtı değildir — bu konuda haklısınız ve bu kural istisnasızdır.

```
BUY → hosted checkout → ödeme → sağlayıcı doğrular
                                      ↓
                                  webhook
                                      ↓
                        imza doğrula → kaydet (webhook_event)
                                      ↓
                        provider_event_id daha önce işlendi mi?
                             evet → sessizce çık
                             hayır ↓
                        order/payment/subscription güncelle
                                      ↓
                        entitlement aç · kredi yükle
                                      ↓
                        kullanıcı ürünü açar
```

Üç kural, üçü de `webhook_event` tablosunda karşılık buluyor:

1. **İmza doğrulanmadan hiçbir olay işlenmez.** `signature_valid` false ise
   payload kaydedilir ama işlenmez.
2. **`provider_event_id` tekildir.** Sağlayıcılar aynı olayı tekrar gönderir;
   unique kısıt çift işlemeyi veritabanı seviyesinde imkânsız kılar.
3. **Olaylar sırasız gelir.** `subscription.updated`, `subscription.created`'dan
   önce gelebilir. İşleyici sıraya değil **duruma** bakar; her olay kendi
   durumunu idempotent şekilde uygular.

### Eksik olan dördüncü kural: mutabakat

Webhook kaybolur — sağlayıcı gönderemez, sizin sunucu düşer, retry penceresi
dolar. Müşteri ödemiş ama erişimi açılmamış olur ve bunu **size şikâyet
gelene kadar bilmezsiniz.**

Bu yüzden `reconciliation_run` tablosu var: günlük iş sağlayıcıdaki ödemeleri
bizim kayıtlarla karşılaştırır, eşleşmeyeni işaretler. Bu iş ilk günden
kurulmalı; sonradan eklenen mutabakat, aylar önce kaybolmuş ödemeleri
bulamaz.

---

## 5. Kredi sistemi

Curiosity Engine için doğru seçim — AI maliyeti değişkenken sabit fiyatlı
sınırsız kullanım zarar ettirir.

Operasyon fiyatları `credit_operation` tablosunda, kodda değil:

| Operasyon | Kredi |
| --- | --- |
| Trend taraması | 1 |
| Anahtar kelime analizi | 2 |
| Araştırma | 5 |
| Blog makalesi | 20 |
| Derin rapor | 50 |

### Kredi bir sayaç değil, defterdir

Tek bir `balance` sütunu üç yerde kırılır: iade, hatalı tüketim, AI maliyet
mutabakatı. Bu yüzden `credit_grant` (kova) + `credit_consumption` (tüketim) +
`credit_allocation` (hangi kovadan ne düştü) üçlüsü var.

İki tür kova ayrı durur:

- **Abonelikle gelen kredi** — dönem sonunda yanar (`expires_at` dolu)
- **Satın alınan kredi** — yanmaz (`expires_at` null)

Tüketim **süresi dolacak kovadan başlar**. Tersi yapılırsa müşterinin
ödediği kredi dururken aboneliğinden gelen kredi yanar; bu bir destek
biletidir.

`consume_credits()` fonksiyonu bunu kilitli ve idempotent yapıyor:
`request_id` tekil olduğu için retry veya çift tıklama krediyi iki kez
düşmez. Test edildi (`db/test.sql`): FIFO sırası, kovalar arası taşma,
yetersiz bakiye hatası, süresi dolmuş kredinin sayılmaması.

### Uyarı: iki kez faturalandırmayın

Stripe'ın usage-based billing'i **ve** kendi kredi sisteminiz aynı kullanımı
ölçerse müşteri iki kez ödeme yapmış olur ya da rakamlar tutmaz. Karar:
**iç birim kredidir**, Stripe'a yalnızca abonelik ve kredi paketi satışı
gider. Stripe metered billing'i kullanılmaz.

---

## 6. Abonelik

`subscription` bizim tablomuz; sağlayıcı yalnızca tahsilatı yürütür.
`subscription_event` her durum değişimini nedeniyle birlikte tutar —
"bu abonelik neden iptal oldu?" desteğin en sık sorusu.

Kurulmadan önce cevaplanacak sorular:

- **Upgrade/downgrade ne zaman geçerli?** Anında mı, dönem sonunda mı?
  Anındaysa oransal (proration) hesap gerekir ve kredi bakiyesi ne olacak?
  *Öneri: upgrade anında + oransal, downgrade dönem sonunda. Kredi
  farkı yeni kova olarak eklenir.*
- **Ödeme başarısız olunca?** Kaç gün, kaç deneme, sonra erişim kapanır?
  `past_due` durumu var ama süre politikası iş kararıdır.
  *Öneri: 14 gün `past_due` (erişim açık), sonra `expired` (erişim kapalı,
  veri silinmez).*
- **Fiyat değişince eski müşteri ne olur?** `price` satırları **hiçbir zaman
  güncellenmez**, yeni satır eklenir. Eski abonelik eski fiyata bağlı kalır
  (grandfathering). Bu sayede zam, mevcut müşteriyi otomatik etkilemez.

---

## 7. B2B fatura

Fatura akışı kart akışının kopyası değildir — ödeme *sonradan* gelir.

Cevaplanacak tek kritik soru: **erişim ne zaman açılır?**

| Seçenek | Risk |
| --- | --- |
| Fatura kesilince aç | Tahsil edilemezse hizmet bedava verilmiş olur |
| Ödeme gelince aç | B2B müşteri "faturayı ödedim, neden bekliyorum" der |

*Öneri:* danışmanlık ve AI setup gibi hizmetlerde peşin/parçalı ödeme
(başlangıçta %50), dijital üründe ödeme gelince açılır. `invoice.status`
ve `entitlement` ayrı olduğu için bu politika kod değişikliği olmadan
üründen ürüne farklı uygulanabilir.

Ayrıca: fatura numaraları **ardışık ve boşluksuz** olmalı (muhasebe
gereği) — `invoice.number` unique, üretimi tek noktadan yapılmalı.

---

## 8. Vergi

Şema vergiyi *hesaplamıyor*, **kararı kaydediyor**: `order.tax_reason` ve
`order_item.tax_rate_bp`. Böylece iki yıl sonra "bu satırda neden KDV yok"
sorusunun cevabı kayıtta durur.

Üç durum ayrışır:

- **Norveç B2C** — MVA tahsil edilir, fiyat **KDV dahil** gösterilir
  (`price.tax_behavior = 'inclusive'`).
- **AB B2B, VAT numarası doğrulanmış** — reverse charge. `account.vat_validated_at`
  dolu değilse reverse charge **uygulanmaz**; doğrulanmamış numaraya güvenmek
  vergiyi size bırakır.
- **Diğer** — ülkeye göre; kayıt eşiği aşılana kadar kapsam dışı olabilir.

Kesin oranlar, kayıt eşikleri ve beyan takvimi muhasebeciyle doğrulanır.
Şemanın işi bu kararı esnek ve izlenebilir tutmak.

### Merchant of Record kararını erteleme, ama ucuz sanma

Paddle/Lemon Squeezy gibi bir MoR, satıcı olarak sizin yerinize geçip birçok
ülkede vergi tahsilatını üstlenir. Global SaaS için ciddi bir yönetim yükü
azaltması — bu değerlendirmeniz doğru.

Ama şu uyarıyla: **abonelikler sağlayıcılar arasında kolay taşınmaz.**
Stripe'ta 500 aboneniz varken MoR'a geçmek, çoğu durumda müşterilerden ödeme
yöntemini yeniden almak demektir ve o geçişte kayıp yaşarsınız. Yani "sonra
karar veririz" ucuz değil.

*Öneri:* Curiosity Engine'i **global satmaya başlamadan önce** karar verin.
Norveç ve yakın pazarda Stripe ile yürüyün; uluslararası abone sayısı anlamlı
büyümeye başlamadan MoR kararını verin. Şema her iki yolu da destekliyor
(`payment_provider` enum'una `paddle` eklenebilir), taşınması zor olan
müşteri ilişkisidir, veri değil.

---

## 9. Güvenlik ve PCI

- **Kart verisi bizim sunucumuza gelmez.** Yalnızca hosted checkout
  (Stripe Checkout / Vipps). Kendi kart formumuz yok.
- Hosted checkout PCI kapsamını büyük ölçüde daraltır; yine de kapsamın
  hangi SAQ tipine düştüğü kurulum sonrası doğrulanmalı.
- Webhook secret'ları rotasyona uygun tutulur; imza doğrulaması atlanamaz.
- Webhook payload'ı ham haliyle saklanır (`webhook_event.payload`) —
  anlaşmazlıkta tek kanıt budur.
- Tutarlar tam sayı ve minor unit; float yok. Kur dönüşümü sunum katmanında
  yapılmaz.

---

## 10. Tek hesap

Kullanıcı hesabında gördüğü her şey bu şemadan doğar:

| Ekran | Kaynak |
| --- | --- |
| Planım | `subscription` + `product` |
| Faturalarım | `invoice`, `order`, `payment` |
| Ödeme yöntemim | sağlayıcı portalı (kart verisi bizde değil) |
| AI credits | `credit_balance` görünümü |
| Kullanımım | `credit_consumption` |
| Upgrade / Downgrade / Cancel | `subscription` + `subscription_event` |
| Satın aldıklarım | `entitlement` (source_type = 'order') |

Ödeme, siteye sonradan takılan bir "Pay" butonu değil; hesabın kendisi.

---

## 11. Faz planı

**Faz 1 — tahsilat çalışsın**
Stripe Checkout (kart + wallet) · Vipps · webhook + idempotency · entitlement ·
tek seferlik ürün (rapor, kurs) · mutabakat işi.

**Faz 2 — tekrar eden gelir**
Stripe Billing üzerinden abonelik · Blog Pro · dönem kredisi · dunning
(`past_due` politikası) · hesap sayfası.

**Faz 3 — Curiosity Engine**
Kredi paketleri · plan yükseltme/düşürme · kullanım raporu · birim maliyet
ölçümü (kredi fiyatı buradan çıkar).

**Faz 4 — genişleme**
B2B fatura · Klarna (Stripe içinden) · MoR kararı.

---

## 12. Açık kararlar

Kod yazılmadan cevaplanmalı:

1. Kredi paketi fiyatı — 1.000 kredinin gerçek AI maliyeti ölçülmeden
   konmamalı. (`credits-1000` ürünü şemada var, fiyatı bilerek boş.)
2. `past_due` süresi ve erişim kapanma politikası.
3. Upgrade/downgrade zamanlaması ve kredi devri.
4. B2B'de erişimin fatura kesiminde mi tahsilatta mı açılacağı.
5. Para birimi: müşteri seçebilecek mi, yoksa ülkeye göre sabit mi?
   *Öneri: ülkeye göre sabit. Abonelik ortasında para birimi değişimi
   desteklenmez — muhasebe ve iade tarafında karışıklık çıkarır.*
6. Curiosity Engine global satışa çıkmadan Stripe/MoR kararı.

## 13. Doğrulanacak varsayımlar

Mimari bunlara dayanıyor; sözleşme öncesi teyit edilmeli:

- Vipps MobilePay'in recurring/abonelik API'sinin ihtiyacınız olan senaryoyu
  (plan değişimi, duraklatma, iade) desteklediği.
- Vipps'in Stripe üzerinden bir ödeme yöntemi olarak kullanılıp
  kullanılamayacağı — kullanılabiliyorsa ayrı entegrasyon yükü ortadan kalkar.
  Bu doğrulanana kadar mimari iki ayrı sağlayıcı varsayıyor.
- Güncel Stripe Norveç komisyon oranları. Oranlar veritabanına sabitlenmez;
  `payment.fee_minor` webhook'tan okunur — kâr hesabı tahminle değil gerçek
  kesintiyle yapılır.
