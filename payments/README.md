# Merkezi Ödeme Altyapısı

Tek ödeme katmanı; üstüne ürün eklemek şema değişikliği gerektirmez.
COBBAN mağazası, blog aboneliği, raporlar, kurslar, danışmanlık ve
Curiosity Engine (SaaS + credits) aynı altyapıyı kullanır.

> Bu doküman mimari kararları ve **neden** öyle olduğunu kaydeder.
> Şema: [`schema.sql`](schema.sql) · Webhook kuralları: [`webhooks.md`](webhooks.md)
> Rakamların doğrulama tarihleri: [`../docs/12-kaynak-takibi.md`](../docs/12-kaynak-takibi.md)

## 1. Sağlayıcı seçimi — plandan sapan iki nokta

### Vipps'i lansmanda değil, hacim gelince ekle

Vipps sadece yüzde almıyor: **aylık sabit ücret ~299 NOK**, işlem başına
**%1,25–2,5**, Vipps Checkout'ta ayrıca **~5.000 NOK kurulum** var.

Bu, düşük hacimde baskın maliyet kalemidir:

| Senaryo | Aylık gelir | Vipps sabit | Sabitin gelire oranı |
|---|---|---|---|
| 20 Pro abone × 99 NOK | 1.980 NOK | 299 NOK | **%15** |
| 100 Pro abone × 99 NOK | 9.900 NOK | 299 NOK | %3 |
| 300 abone karışık | ~60.000 NOK | 299 NOK | %0,5 |

**Karar:** Stripe ile tek başına başla. Vipps'i aylık Norveç cirosu
~15.000 NOK'u geçince ekle. Norveç'te Vipps dönüşüm için önemlidir —
ama *önce satış olmalı ki dönüşümü artıracak bir şey olsun.*

> ~100.000 NOK/ay Vipps cirosunu geçince komisyon pazarlığa açılıyor.

### Fiyat karşılaştırması (499 NOK/ay SaaS aboneliği)

| Sağlayıcı | Oran | İşlem başına | Efektif |
|---|---|---|---|
| **Stripe** (NO/EEA kartı) | %2,4 + 2 NOK | ~14 NOK | **%2,8** |
| Stripe (uluslararası kart) | daha yüksek | ~20 NOK | ~%4 |
| **Paddle / Lemon Squeezy** (MoR) | %5 + 0,50 USD | ~30 NOK | **%6** |

MoR ~3 puan pahalı. Ama aşağıdaki KDV maddesi bu farkı yeniden değerlendirmeyi
gerektiriyor — MoR'un sattığı şey ödeme değil, **uyum yükünün devri.**

## 2. Planın en büyük açığı: AB'ye dijital hizmet KDV'si

Norveç şirketi AB'deki **tüketiciye** dijital hizmet (Pro abonelik, rapor,
kurs, SaaS) sattığında:

- **Non-Union OSS** kaydı yaptırmak zorunda — bir AB üyesi ülkede.
- **Eşik yok.** AB dışında yerleşik satıcı için **ilk satıştan itibaren** KDV doğar.
  Norveç'teki 50.000 NOK eşiği burada geçerli değildir.
- Her müşteriye **kendi ülkesinin oranı** uygulanır (%17–27 arası değişir).
- Üç ayda bir tek OSS beyanı verilir.
- B2B satış farklı: **reverse charge**, alıcının KDV numarası doğrulanmalı (VIES).

Bu, şemayı doğrudan etkiliyor: her satırda **müşterinin ülkesi, KDV oranı,
KDV tutarı ve B2B/B2C ayrımı** saklanmalı. Sonradan eklenemez — geçmiş
işlemler için geri dönüp hesaplayamazsın.

**Bu yüzden MoR kararı "ileride bakarız" değil, lansman kararıdır:**
AB satışı ilk aydan anlamlı olacaksa, %3 puan fark OSS kaydı + üç aylık
beyan + müşavir ücretinden ucuz olabilir.

## 3. Credits bir muhasebe sorunudur, sadece özellik değil

Ön ödemeli credits **satıldığı anda gelir değildir — borçtur.** Müşteri
kullanana kadar bilançoda yükümlülük olarak durur.

KDV açısından kritik ayrım (AB/Norveç kupon kuralları):

| Durum | Sınıf | KDV ne zaman doğar |
|---|---|---|
| Credits yalnızca tek tip hizmet, tek oran, tek ülke | **Tek amaçlı kupon** | **Satın alma anında** |
| Credits farklı hizmetler / farklı oranlar / farklı ülkeler | **Çok amaçlı kupon** | **Kullanım anında** |

Senin credit tablonda (trend scan 1, blog article 20, deep report 50) hepsi
aynı KDV kategorisindeyse tek amaçlı; ileride "credits ile danışmanlık saati
al" gibi bir şey eklersen çok amaçlıya döner ve **muhasebe mantığın değişir.**

**Şemayı sabitlemeden önce müşavirle karara bağla.** `credit_ledger`
her iki modeli de destekleyecek şekilde tasarlandı, ama gelir tanıma
mantığı ona göre yazılır.

Ayrıca karara bağlanacaklar:
- Credits **son kullanma tarihli mi?** (Norveç'te ön ödemeli bakiyelerin
  zaman aşımı kuralları var — müşavire sor)
- Ay sonunda **devreder mi?** Devrederse tavan var mı?
- Abonelik iptalinde kalan credits ne olur? (İade edilirse KDV düzeltmesi gerekir)
- Downgrade'de fazla credits ne olur?

## 4. "Premium Access = TRUE" tuzağı

Boolean yerine **entitlement** (hak) kaydı tut:

```
entitlements(customer_id, product_id, source_type, source_id, valid_from, valid_to, status)
```

`source_type/source_id` kritik: bir hakkı **hangi ödemenin** verdiğini bilmezsen
iade, chargeback veya itiraz durumunda neyi geri alacağını bilemezsin.
Bir müşteride aynı anda üç kaynaktan hak olabilir (abonelik + tek seferlik
kurs + hediye kod) ve biri iptal olduğunda diğerleri devam etmeli.

## 5. Ödeme akışı — doğru olan kısım

Planındaki iki karar doğru ve pazarlık konusu değil:

1. **Kart verisi bizim sunucumuza hiç gelmez.** Hosted checkout (Stripe
   Checkout / Vipps) kullanılır. PCI kapsamı SAQ-A'ya iner.
2. **Erişim webhook ile açılır, yönlendirme ile değil.** "Başarılı" sayfasına
   düşmek ödemenin alındığı anlamına gelmez; kullanıcı o URL'yi elle de yazabilir.

Detaylar ve sağlamlaştırma kuralları: [`webhooks.md`](webhooks.md)

## 6. Kademeli kurulum sırası

```
FAZ 1  Stripe Checkout + Stripe Billing
       → tek seferlik ürün + abonelik + credits
       → Norveç MVA (25%) ve AB OSS kaydı
FAZ 2  Vipps MobilePay          (Norveç cirosu ~15.000 NOK/ay geçince)
FAZ 3  B2B fatura akışı         (reverse charge + VIES doğrulama)
FAZ 4  Klarna                   (yalnızca 2.000 NOK üzeri ürünlerde)
FAZ 5  MoR değerlendirmesi      (AB/ABD satışı toplamın %30'unu geçerse)
```

## 7. Ödeme yöntemlerini müşteriye göre göster

Planındaki bu fikir doğru — 15 logo dönüşümü düşürür. Kural:

| Müşteri | Gösterilen |
|---|---|
| Norveç B2C | Vipps · kart · Apple/Google Pay |
| AB B2C | kart · wallet · (>2.000 NOK ise Klarna) |
| Uluslararası B2C | kart · wallet |
| B2B (KDV no girilmiş) | kart · fatura |

Ülke tespiti kart BIN'inden değil, **müşterinin beyan ettiği fatura
ülkesinden** yapılmalı — KDV zaten oradan hesaplanıyor.
