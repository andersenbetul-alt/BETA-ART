---
name: smb-qblogg
description: QBLOGG için özelleştirilmiş small-business iş akışları — haftalık brief, lead önceliklendirme, içerik stratejisi, nakit durumu ve Stripe aktivasyonu. small-business plugin'i kurulmadan da kullanılabilir; plugin kurulunca smb-onboard ile birleştirilir.
owner: QBLOGG
---

# QBLOGG — Small Business İş Akışları

Bu skill, genel `small-business` plugin şablonlarını QBLOGG'a özgü bağlamla
önceden doldurur. Tam profil: `docs/smb-profil.md`.

---

## /monday-brief — Pazartesi haftalık başlangıcı

**Kontrol listesi:**
1. `git log --oneline -5` — geçen hafta ne yayınlandı?
2. Vercel deploy durumu: qblogg.vercel.app erişilebilir mi?
3. Buttondown: yeni aboneler var mı? (dashboard → manuel kontrol)
4. Açık leadler: work.html brief formu gelen kutusunda bekleniyor mu?
5. Bu haftanın yazı hedefi: slug + kategori + taslak tarihi

**Çıktı:** `## Pazartesi Brifingi — [tarih]` başlıklı kısa liste.

---

## /friday-brief — Cuma haftalık kapanış

**Kontrol listesi:**
1. Bu hafta yayınlanan yazılar (slug + kategori)
2. `npm run check` durumu — hata var mı?
3. `npm run gorunurluk` — görünürlük geçen yazılar
4. Stripe `payLinks` durumu — hâlâ boş mu?
5. Gelecek haftanın yazı taslağı hazır mı?
6. NAVIAR: repo transfer durumu değişti mi?

**Çıktı:** `## Cuma Özeti — [tarih]` başlıklı kısa liste.

---

## /content-strategy — İçerik takvimi

**QBLOGG kategorileri ve paket eşlemesi:**

| Kategori | Paket | Öneri hedefi |
|---|---|---|
| `business`, `hr` | p3 | Karar vericiler, yöneticiler |
| `money`, `jobs`, `ai`, `seo`, `marketing` | p2 | Büyüme odaklı KOBİ |
| `safety`, `guide` | p1 | Risk bilincli, küçük işletme |
| `newsletter` | — | Bülten büyütme içeriği |

**Yayın formatı:**
- TR + EN: tam makale (30–55 blok, 1200+ kelime)
- Diğer 8 dil: 3 bloklu özet
- Her yazıda `orig` (özgün katkı) + `src` (≥3 kaynak) zorunlu

**Takvim şablonu:**
```
Hafta 1: [kategori] — [anahtar kelime] — [slug taslağı]
Hafta 2: …
```

---

## /lead-triage — Lead önceliklendirme

**Kaynak:** work.html brief formu (şu an mailto: taslağı)

**Niteleme soruları:**
1. İç içerik ekibi var mı? (varsa → yanlış hedef)
2. Düzenli yayın hedefi var mı? (blog / LinkedIn / newsletter)
3. Bütçe aralığı hangi pakete giriyor? (p1/p2/p3)
4. Hangi dil(ler)de yayın istiyor?

**Sıralama:** p3 (yüksek değer) → p2 → p1 → niteliksiz

---

## /invoice-chase — Stripe ve ödeme takibi

**Mevcut durum:** Stripe kurulu ama `config.js → payLinks` boş.

**Aktivasyon adımları (kullanıcı yapacak):**
1. Stripe Dashboard → Payment Links → 3 link oluştur (p1/p2/p3)
2. `assets/js/config.js` içine:
   ```js
   payLinks: {
     p1: 'https://buy.stripe.com/…',
     p2: 'https://buy.stripe.com/…',
     p3: 'https://buy.stripe.com/…',
   }
   ```
3. `git add assets/js/config.js && git commit -m "config: Stripe payLinks eklendi"`
4. Vercel deploy → CTA canlıya geçer (4+ davranış eventi olan ziyaretçilerde)

**Norveç Stripe komisyonu:** %1,5 + 1,80 kr (yurt içi) / +%3,25 (yurt dışı)

---

## /price-check — Paket fiyatlandırma

**Mevcut:** `config.js` içinde örnek rakamlar (kesinleşmedi).

**Fiyatlandırma çerçevesi:**
- p1 (safety/guide): Giriş seviyesi — basit blog paketi
- p2 (para/kariyer/ai): Orta — SEO + LinkedIn + newsletter
- p3 (iş/İK): Premium — full-service, çok kanallı

**Kontrol noktaları:**
- Stripe komisyonu fiyata dahil mi?
- MVA (Norveç KDV) fiyata dahil mi yoksa üstüne mi?
- Rakip ajans fiyatlarıyla karşılaştırma yapıldı mı?

---

## /job-post-builder — Yazar ilanı

**QBLOGG yazar profili:**
- Serbest yazar / editör
- Uzmanlık: SEO yazarlığı, B2B, SaaS
- Dil: Norveççe (öncelik) + İngilizce
- Teslim formatı: `posts.js` nesnesi (teknik onboarding gerekir)
- Ücret: proje bazlı (kelime başı veya makale başı)

**İlan kanalları:** LinkedIn (Norveç) · NAV.no iş ilanları · Upwork (uluslararası)

---

## /business-pulse — Genel sağlık kontrol

**QBLOGG için aylık pulse:**

| Gösterge | Nereden | Hedef |
|---|---|---|
| Yayınlanan yazı sayısı | `assets/js/posts.js` | Aylık 4+ |
| Check.mjs durumu | `npm run check` | 0 hata |
| Görünürlük geçen yazı oranı | `npm run gorunurluk` | %100 |
| Stripe CTA aktive | `config.js → payLinks` | Dolu |
| Buttondown abone sayısı | Buttondown dashboard | Artış trendi |
| Vercel uptime | qblogg.vercel.app | Erişilebilir |
| NAVIAR repo transfer | GitHub | Tamamlandı mı? |

---

## Plugin kurulunca: smb-onboard

`small-business` plugin kurulduğunda:
1. `/smb-onboard` komutunu çalıştır
2. Sorularda `docs/smb-profil.md` içeriğini kullan
3. Bağlantıları bağla: Stripe (önce), Gmail, Google Calendar (opsiyonel)
4. HubSpot bağlantısı: lead takibi için değerlendirilebilir

Bu skill'i `naviar-operasyon` ile karıştırmayın — NAVIAR ayrı proje.
