# 06 — Satış Kanalları

Dört kanalın hepsini aynı anda açma. Sıra: **kendi site → sosyal → pazaryeri → yurt dışı.**

## 1. Kendi web sitesi (ana kanal)

| | Shopify | Kendi kodun (Next.js) |
|---|---|---|
| Kurulum süresi | 1 hafta | 4–8 hafta |
| Aylık maliyet | ~29–79 USD + tema | Vercel ~0–20 USD |
| Ödeme | Hazır (Shopify Payments, Vipps, Klarna) | Stripe/iyzico entegrasyonu sen yazarsın |
| Kargo etiketi, iade, stok | Hazır | Sen yazarsın |
| Esneklik | Tema sınırı | Sınırsız |
| **Karar** | **Önce bununla başla** | Ciro oturunca headless'a geç |

**COBBAN kararı:** Shopify'ı *ticaret motoru* olarak kullan, bu repodaki `web/`
Next.js projesini **Shopify Storefront API ile headless vitrin** olarak geliştir.
Böylece stok/sipariş/ödeme Shopify'da kalır, tasarım ve hız sende olur.

### Dönüşüm için olmazsa olmazlar
- [ ] Fiyat vergi dahil, kargo ücreti sepette sürpriz olmasın
- [ ] Vipps (NO) ve taksit (TR) ödeme seçenekleri
- [ ] Ürün başına en az 4 görsel + 1 ölçek/kullanım görseli
- [ ] Beden/ölçü tablosu — iade oranını en çok düşüren tek şey
- [ ] Kargo süresi net yazılsın ("3–5 iş günü", "değişebilir" değil)
- [ ] Misafir ödeme (üyelik zorunlu olmasın)
- [ ] Mobilde LCP < 2.5 s

## 2. Sosyal medya

| Platform | Rol | İlk 90 gün hedefi |
|---|---|---|
| **Instagram** | Ana vitrin, ürün estetiği | Haftada 3 post + 5 story, Shopping etiketi |
| **TikTok** | Keşif, video, ölçek gösterimi | Haftada 3 kısa video, TikTok Shop (NO'da sınırlı) |
| **Pinterest** | Uzun kuyruk arama trafiği | Ürün başına 2 pin, zengin pin doğrulaması |
| **Facebook** | Norveç'te 35+ yaş, Marketplace | Sayfa + katalog + retargeting |

**İçerik formülü (haftalık 7 içerik)**
```
2 × ürün detay (makro çekim, malzeme)
2 × kullanım/yaşam alanı (ürün bağlamda)
1 × arkasında kim var (üretim, seçim süreci)
1 × müşteri yorumu / UGC
1 × eğitici (bakım, ölçü seçimi, malzeme farkı)
```

**Yasal:** Reklam içeriklerinde işbirliği etiketi zorunlu —
Norveç: *Markedsføringsloven* + Forbrukertilsynet, Türkiye: Reklam Kurulu / "#işbirliği".

## 3. Pazaryerleri

| Pazaryeri | Pazar | Komisyon | Not |
|---|---|---|---|
| **Etsy** | Global | ~%6,5 + listeleme + ödeme | El yapımı/tasarım ürün için en hızlı başlangıç. NO+TR'den satış yapılabilir |
| **Amazon** | AB/ABD | %8–15 | Norveç'te Amazon zayıf; Amazon.de/.se üzerinden Norveç'e satış sınırlı |
| **Trendyol** | TR (+ AB) | %10–22 + hizmet bedeli | TR pazarı için ana kanal. Trendyol Global ile ihracat |
| **Hepsiburada** | TR | %8–20 | İkinci TR kanalı |
| **Finn.no torget** | NO | Küçük ilan ücreti | Norveç'te en çok ziyaret edilen site; ikinci el ağırlıklı ama yeni ürün de satılıyor |
| **Kaufland / eMAG / Allegro** | AB | değişken | Doygunluğu düşük, ileride bak |

### Pazaryeri stratejisi
1. **Ay 1–3:** Sadece **Etsy** (global, düşük risk) + **Trendyol** (TR hacmi).
2. **Ay 4–6:** Hepsiburada, Amazon.de.
3. Fiyat: Pazaryerinde **kendi sitenden %5–10 pahalı** listele — komisyonu karşıla ve
   müşteriyi kendi sitene yönlendirmek için kutu içine indirim kodu koy.
4. Stok senkronizasyonu şart: **Shopify + Shipentegra/Entegrabaz** ile tek stok havuzu.
   Fazla satış (oversell) pazaryerinde mağaza puanını düşürür ve satış kapatır.

## 4. Yurt dışına satış

Detay için → [03-iki-ulke-modeli-ve-ihracat.md](03-iki-ulke-modeli-ve-ihracat.md)

**Ülke önceliği (COBBAN için)**
1. 🇳🇴 Norveç — ana pazar, yerel stok, hızlı teslimat
2. 🇸🇪🇩🇰 İsveç/Danimarka — PostNord ile 2–3 gün, benzer zevk, EUR/SEK/DKK
3. 🇩🇪🇳🇱 Almanya/Hollanda — büyük hacim, IOSS gerekli
4. 🇹🇷 Türkiye — TL fiyatlandırma, taksit, yerel kargo
5. 🌍 Global (Etsy üzerinden) — düşük hacim, yüksek marj

**Çok dilli/çok para birimli kurulum**
- Shopify Markets ile ülke bazlı fiyat + para birimi + dil.
- Site dilleri: **no / en / tr** (bkz. `web/` projesindeki i18n yapısı).
- Fiyatı otomatik kurdan çevirtme — **her pazar için el ile yuvarlanmış fiyat** koy
  (399 NOK, 39 EUR, 1.290 TL gibi).

## 5. Kanal bazlı birim ekonomi karşılaştırması (örnek ürün: 499 NOK)

| | Kendi site | Etsy | Trendyol |
|---|---|---|---|
| Satış fiyatı | 499 | 549 | 1.290 TL |
| Komisyon | 0 | ~36 (%6,5) | ~258 (%20) |
| Ödeme komisyonu | ~14 (%2,9) | ~20 | dahil |
| Kargo (sen ödüyorsan) | 79 | 79 | 60 TL |
| Reklam payı (CAC) | ~90 | ~15 | ~50 TL |
| **Kalan** | **316** | **399** | **922 TL** |
| Ürün maliyeti | 150 | 150 | 350 TL |
| **Brüt kâr** | **166 (%33)** | **249 (%45)** | **572 TL (%44)** |

> Kendi sitede marj düşük görünür çünkü reklam maliyeti oradadır — ama müşteri **senindir**,
> ikinci satın alma reklamsız gelir. Pazaryerinde müşteri **onlarındır**.
> Hedef: 12. ayda cironun **%60'ı kendi siteden.**
