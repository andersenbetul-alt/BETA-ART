# Günlük Proje Raporu
## Proje: QBLOGG · Tarih: 2026-09-02 · Faz: 06 Launch

---

## Yönetici Özeti

Tüm kalite kapıları yeşil (8/8 · 13/13 · 10/10). Son commit 2026-08-31'de
AUTOPROMPT sisteminin kurulumu; bu haftada kod değişikliği yok. Kritik açıklar
değişmedi: Buttondown `tatil` → `qblogg` düzeltmesi, Formspree bağlantısı ve
qblogg.com DNS sahiplik doğrulaması kullanıcı eylemini bekliyor. Eylül bütçe
sezonu devam ediyor — bu hafta Formspree + LinkedIn çözülmezse fırsat penceresi
daralıyor.

---

## Kalite Kapısı Sonuçları

| Kapı | Sonuç | Detay |
|---|---|---|
| `npm run check` | **PASS 8/8** | i18n 10 dil, posts 10×10, HTML id/script, data-i18n anahtarları, yerel bağlantılar, sitemap 17 URL, betik yükleme, JSON-LD |
| `npm run guvenlik` | **PASS 13/13** | 0 yüksek · 0 orta · 2 bilgi (hreflang JavaScript bağımlı; qblogg.com dış bağlantısı) |
| `npm run gorunurluk` | **PASS 10/10** | 10 yazı × TR dili — 0 kural ihlali. Her yazıda 14–15 kural geçiyor, 1–2 uyarı |

---

## Config Boşluk Durumu

| Alan | Değer | Risk |
|---|---|---|
| `newsletterEndpoint` | `tatil` kullanıcısına işaret ediyor | **R01 — Yüksek** |
| `formEndpoint` | Boş — mailto fallback aktif | **R02 — Yüksek** |
| `prices.p1/p2/p3` | Boş — i18n örnek fiyatları gösteriyor | R04 — Orta |
| `social.*` | Tümü boş — altbilgide sosyal ikon yok | Düşük |
| `payLinks.*` | Tümü boş — Stripe bağlı değil | Bekleniyor |

---

## Son Değişiklikler (git log — son 7 gün)

| Hash | Tarih | Özet |
|---|---|---|
| 4114279 | 31.08.2026 | AUTOPROMPT: ilk sistem dosyaları ve günlük denetim raporu |
| f4a95c4 | Önceki | monorepo: tum projeler BETA-ART'ta birlestiriliyor |

Bu haftada QBLOGG kaynak dosyalarında değişiklik yok. Son değişiklik AUTOPROMPT
altyapısını (`docs/autoprompt/` dizini) ve ilk günlük raporu kuran commit.

---

## Risk Durumu

| ID | Risk | Önem | Durum | Değişim |
|---|---|---|---|---|
| R01 | Buttondown `tatil` kullanıcı adı | **Yüksek** | **Açık** | Değişmedi |
| R02 | formEndpoint boş (brief kaybı) | **Yüksek** | **Açık** | Değişmedi |
| R03 | qblogg.com DNS sahiplik doğrulaması | **Yüksek** | **Açık** | Değişmedi |
| R04 | EUR fiyatlar Norveç piyasasının altında | Orta | Karar bekliyor | Değişmedi |
| R05 | Legal metinlerde `[DOLDURULACAK]` alanlar | Orta | **Açık** | Değişmedi |
| R06 | Analitik yok | Orta | Bekliyor | Değişmedi |
| R07 | Marka tescili — kelime unsuru riski | Orta | Açık | Değişmedi |
| R08 | Eylül bütçe sezonu fırsatı (kaçırma riski) | Orta | **Acil — devam ediyor** | Eylül başı; pencere daralıyor |

**Yeni risk tespit edilmedi.**

**R08 not:** Eylül 2 itibarıyla bütçe sezonu ortasındayız. Formspree ve LinkedIn
yoksa ilk müşteri adaylarına ulaşmak bu hafta zorlaşıyor. R08 önem seviyesi
"Orta"dan "Yüksek"e yükseltildi.

---

## Pazar / Araştırma Bulguları

*Dış web erişimi bu ortamda kapalı; aşağıdakiler eğitim verisi / teyit gerekiyor.*

- **Eylül bütçe sezonu (Norveç):** Norveç şirketleri Eylül–Kasım arasında
  2027 bütçelerini kesinleştiriyor. B2B hizmet satışı için en verimli pencere.
  Fırsat: brief formu bu ay çalışmazsa bir sonraki pencere Ocak 2027.

- **AI içerik pazarı trendi:** İçerik üretiminde AI araçları yaygınlaşıyor;
  ancak editoryal kalite ve özgün araştırma premium segmentin savunma kalkanı.
  QBLOGG'un "tek araştırmadan 7 format" modeli bu açıdan doğru konumlanmış.
  (Kaynak: eğitim verisi — güncel rakam için sektör raporu gerekli.)

- **GDPR / Datatilsynet:** 2026 boyunca Norveç Datatilsynet denetimleri arttı.
  `[DOLDURULACAK]` alanlarındaki eksik yasal kimlik (R05) somut uyumsuzluk riski.

---

## Uygulanan Değişiklikler

**Bu turda kod değişikliği yapılmadı.** Tüm kapılar zaten yeşildi; cerrahi
değişiklik ilkesi uyarınca gereksiz değişiklikten kaçınıldı.

---

## Kullanıcı Eylemi Gereken Konular

Öncelik sırasıyla:

1. **[R02 — Kritik]** Formspree hesabı aç, `config.js → formEndpoint`'e yaz,
   `vercel.json` CSP `connect-src`'ye Formspree adresini ekle. Brief başvuruları
   şu an kaybolabilir.

2. **[R01 — Kritik]** Buttondown panelinde hesap adını `tatil` → `qblogg` olarak
   değiştir (veya yeni hesap aç ve `config.js → newsletterEndpoint`'i güncelle).
   Tüm bülten aboneleri şu an yanlış hesaba gidiyor.

3. **[R03 — Kritik]** Vercel panel → Domains → qblogg.com → "Claim". GoDaddy'de
   `_vercel` TXT kaydı ekle. qblogg.com hâlâ siteyi göstermiyor.

4. **[R08 — Acil fırsat]** Eylül bütçe penceresi: LinkedIn şirket sayfası aç,
   ilk 3–5 müşteri adayına doğrudan ulaş, brief formunu çalıştır (Formspree).
   Bu ay harekete geçilmezse bir sonraki pencere Ocak 2027.

5. **[R05 — Orta]** `gizlilik.html` ve `kosullar.html`'deki 10+ `[DOLDURULACAK]`
   alanını gerçek yasal kimlik bilgileriyle doldur (MVA no, ödeme vadesi, yetkili
   mahkeme). Avukat teyidi önerilir.

6. **[R04 — Karar]** `config.js → prices`'ı NOK cinsinden güncelle. Öneri:
   Tek Makale 2.900 kr, Büyüme 12.900 kr/ay, Stüdyo 29.000 kr/ay.

7. **[D03 — Karar]** Action Pages demosu (`demo/cv-action-page.html`) ana siteye
   deploy onayı bekliyor. Onaylarsanız `main`'e push + Vercel yeniden tetiklenir.

---

## Bir Sonraki En Değerli Üç Görev

1. **Formspree bağla + Vercel deploy** — Brief başvurusu alan tek değişiklik bu.
   Yapılabilir yarım saatte; gelir doğrudan bu kapıdan geçiyor.

2. **LinkedIn şirket sayfası + ilk 5 müşteri adayına mesaj** — Eylül bütçe
   sezonu devam ediyor; organik trafik beklemek için vakit yok.

3. **qblogg.com DNS sahiplik doğrulaması** — Vercel panel + GoDaddy TXT kaydı.
   Alan adı yayında olmadan marka güvenilirliği eksik kalıyor.
