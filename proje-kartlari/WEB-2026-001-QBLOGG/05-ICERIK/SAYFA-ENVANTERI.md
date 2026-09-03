# WEB-2026-001 QBLOGG — Sayfa Envanteri

**Son güncelleme:** 2026-09-03  
**Toplam sayfa:** 9 HTML dosyası

---

## PAGE-001 — Ana Sayfa (index.html)

**URL:** `/` (ve `?lang=...`)  
**Rol:** İkna hattı — hero → hizmetler → içerik akışı → paketler → son yazılar → bülten  
**Hedef eylem:** Brief formuna yönlendirme

| Alan | Değer |
|---|---|
| i18n anahtarı (hero başlık) | `hero.title` |
| Davranış sistemi | `behavior.js` — `injectBlogHint` (3+ okuma sonrası) |
| Stripe CTA | Paket kartları — `payLinks` (şu an boş) |
| Newsletter | Buttondown POST — `newsletterEndpoint` |
| JSON-LD | Organization + WebSite + Service |

**Bölümler (sırayla):**
1. Gezinme (nav) — 6 sayfa bağlantısı + dil seçici + tema düğmesi
2. Hero — başlık, alt başlık, CTA, kanıt bağlantısı
3. Hizmetler — 7 çıktı akış şeması
4. Paketler — p1/p2/p3 fiyat kartları
5. Son yazılar — son 3 blog yazısı
6. Bülten — Buttondown kaydı
7. Altbilgi

---

## PAGE-002 — Bizimle Çalışın (work.html)

**URL:** `/work.html`  
**Rol:** Dönüşüm noktası — marka briefi + yazar başvurusu, süreç, SSS  
**Hedef eylem:** Brief formu göndermek veya yazar başvurusu

| Alan | Değer |
|---|---|
| Brief formu | `composeMail()` → `mailto:` |
| Yazar başvurusu | `composeMail()` → `mailto:` |
| Sekmeler | Marka Briefi / Yazar Başvurusu |

**Bölümler:**
1. Gezinme
2. Sekme seçici (Marka Briefi / Yazar Başvurusu)
3. Brief formu (şirket adı, sektör, paket seçimi, hedef kitle, konu önerileri, ton, ek not)
4. Süreç (3 adım: brief → teklif → teslim)
5. SSS (8 soru)
6. Altbilgi

---

## PAGE-003 — Blog (blog.html)

**URL:** `/blog.html`  
**Rol:** Trafik ve güven — yazı listesi, arama, kategori filtresi  
**Hedef eylem:** Yazı okumak → dönüşüm

| Alan | Değer |
|---|---|
| Yazı sayısı | 11 (2026-09-03 itibarıyla) |
| Kategori filtresi | safety, guide, money, jobs, ai, seo, marketing, business, hr |
| Arama | İstemci taraflı (başlık + özet) |
| Davranış sistemi | `injectBlogHint` (3+ okuma) |

---

## PAGE-004 — Yazı Detayı (post.html)

**URL:** `/post.html?slug=<slug>`  
**Rol:** Derinlik okuma, güven inşası, dönüşüm  
**Hedef eylem:** Brief formuna veya ilgili pakete geçmek

| Alan | Değer |
|---|---|
| Yönlendirme | `?slug=` parametresi, `app.js` okur |
| Davranış sistemi | `track()` + `injectPostWidget()` (2. okuma: öneri, 4.: Stripe CTA) |
| Yapılandırılmış veri | BlogPosting + FAQPage JSON-LD |
| Kaynak listesi | `src` alanı (≥3 zorunlu) |
| Özgün katkı | `orig` alanı (zorunlu) |

**Yazı sonu bileşenleri:**
- Yazı sonu teklif köprüsü (10 dil)
- İlgili yazılar (kategori bazlı)
- Davranış sistemi widget (2+. okumada)

---

## PAGE-005 — Gizlilik (gizlilik.html)

**URL:** `/gizlilik.html`  
**Rol:** GDPR uyumu, güven  
**Dil:** TR + EN (iki sekme)

| Alan | Değer |
|---|---|
| Kapsam | Toplanan veriler, işleme amacı, Buttondown, localStorage |
| Açık alanlar | Yasal kimlik, e-posta adresi `[DOLDURULACAK]` |

---

## PAGE-006 — Koşullar (kosullar.html)

**URL:** `/kosullar.html`  
**Rol:** Hukuki çerçeve  
**Dil:** TR + EN (iki sekme)

| Alan | Değer |
|---|---|
| Kapsam | Hizmet kapsamı, fiyat/ödeme, iptal, revizyon, fikri mülkiyet, AI Act 50(4), sorumluluk sınırı, Norveç hukuku |
| Açık alanlar | 10 `[DOLDURULACAK]` (yasal kimlik, MVA, ödeme vadesi, editoryal sorumlu, yetkili mahkeme) |

---

## PAGE-007 — 404 (404.html)

**URL:** `/404.html`  
**Rol:** Kaybolan ziyaretçiyi ana sayfaya döndürür  
**Özellik:** Vercel `routes` ile otomatik tetiklenir

---

## PAGE-008 — Kalite Sayfası (kalite.html)

**URL:** `/kalite.html`  
**Rol:** Görünürlük sistemi ve kalite kriterlerini açıklar (dahili + ziyaretçi bilgisi)

> **Not:** Bu sayfanın varlığı `check.mjs` çıktısından çıkarılmıştır; sitemap.xml doğrulanarak teyit edilmeli.

---

## PAGE-009 — Örnek Sayfa (ornek.html)

**URL:** `/ornek.html`  
**Rol:** Demo veya şablon

> **Not:** Bu sayfanın varlığı `check.mjs` çıktısından çıkarılmıştır; içeriği kullanıcı doğrulaması gerekli.

---

## Sitemap Özeti

`sitemap.xml`'de 18 URL doğrulandı (`npm run check`, 2026-09-03).
Format: `https://qblogg.com/<sayfa>?lang=<kod>` × 10 dil + kök adresler.
