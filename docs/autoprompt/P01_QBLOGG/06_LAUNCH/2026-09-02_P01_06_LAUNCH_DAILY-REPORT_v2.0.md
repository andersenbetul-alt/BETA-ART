# Günlük Proje Raporu

## Proje: QBLOGG
## Proje Kodu: P01
## Tarih: 2026-09-02
## Güncel Faz: 06 Launch
## Güncel Sürüm: v0.8
## Rapor Versiyonu: v2.0 (AUTOPROMPT #2)

---

## Yönetici Özeti

Site 22.08.2026'dan beri yayında. Son AUTOPROMPT çalışması 31.08.2026.
Bu rapor 02.09.2026 günlük denetimini temsil ediyor.

**Kalite kapıları:** Tüm kontroller yeşil (8/8 check · 13/13 güvenlik · 10/10
görünürlük). Kod altyapısı sağlam.

**Kritik durum değişikliği yok:** R01 (yanlış bülten hesabı), R02 (brief formu
boş), R03 (DNS) açık kalmaya devam ediyor. Eylül bütçe sezonunun ikinci
gününde bu üç sorun çözülmeden lead toplanamıyor.

**Yeni bulgu:** Son commit'ten bu yana (31.08) herhangi bir kod değişikliği
yapılmamış. Mevcut dalda bekleyen yeni çalışma yok.

---

## Son Değişiklikler (31.08 → 02.09.2026)

Git log incelemesi: Son commit `4114279` — AUTOPROMPT ilk sistem dosyaları ve
günlük denetim raporu (31.08.2026). Bu dönemde siteye dokunulmadı.

**Bu oturumda yapılanlar:**
- Kalite kapıları çalıştırıldı ve doğrulandı
- `config.js` boşlukları kontrol edildi
- Risk durumu güncellendi (değişiklik yok)
- Bu günlük rapor oluşturuldu
- `proje-gunlugu.md` güncellendi

---

## Kalite Kapısı Sonuçları (02.09.2026)

| Test | Sonuç | Kanıt |
|---|---|---|
| `npm run check` | ✓ PASS | 8/8 · 0 uyarı |
| `npm run guvenlik` | ✓ PASS | 13/13 · 0 yüksek · 0 orta · 2 bilgi |
| `npm run gorunurluk` | ✓ PASS | 10/10 yazı · 0 kural ihlali |

**check detayı:** 10 dil × 233 anahtar eksiksiz · 10 yazı × 10 dil eksiksiz ·
9 sayfada çiftlenen id/script yok · 17 URL sitemap doğrulandı.

**güvenlik notları (bilgi, değişmedi):**
- hreflang canonical JavaScript'e bağımlı — kalıcı çözüm ön-render (ROADMAP #11)
- Dış bağlantı: yalnızca qblogg.com

---

## config.js Boşluk Analizi

| Alan | Mevcut değer | Durum | Risk |
|---|---|---|---|
| `mailTo` | `hello@qblogg.com` | ✓ Dolu | — |
| `siteUrl` | `https://qblogg.com` | ✓ Dolu | DNS bağlı değil (R03) |
| `social.linkedin` | `''` (boş) | ⚠ Boş | Eylül fırsat kaçıyor |
| `social.x` | `''` (boş) | ⚠ Boş | — |
| `social.medium` | `''` (boş) | ⚠ Boş | — |
| `social.substack` | `''` (boş) | ⚠ Boş | — |
| `social.youtube` | `''` (boş) | ⚠ Boş | — |
| `prices.p1/p2/p3` | Hepsi boş | ⚠ Boş | i18n yedek kullanılıyor (R04) |
| `payLinks.p1/p2/p3` | Hepsi boş | ⚠ Boş | Stripe bağlı değil |
| `newsletterEndpoint` | `tatil` kullanıcısı | 🔴 Yanlış | Aboneler kaybolıyor (R01) |
| `formEndpoint` | `''` (boş) | 🔴 Boş | Brief başvuruları kaybolabilir (R02) |
| `leadMagnet` | Dosya tanımlı | ✓ Tanımlı | Dosyanın varlığı ayrıca kontrol edilmeli |

**Özet:** 2 kritik (kırmızı) · 6 uyarı (sarı) · 3 normal (yeşil)

---

## Risk Durum Özeti (02.09.2026)

| ID | Risk | Önem | Durum | Değişim |
|---|---|---|---|---|
| R01 | Buttondown yanlış kullanıcı (`tatil`) | Yüksek | **Açık** | Değişmedi |
| R02 | formEndpoint boş (brief kaybı) | Yüksek | **Açık** | Değişmedi |
| R03 | qblogg.com DNS sahiplik doğrulaması | Yüksek | **Açık** | Değişmedi |
| R04 | EUR fiyatlar Norveç piyasasının altında | Orta | Karar bekliyor | Değişmedi |
| R05 | Legal metinlerde `[DOLDURULACAK]` alanlar | Orta | **Açık** | Değişmedi |
| R06 | Analitik yok | Orta | Bekliyor | Değişmedi |
| R07 | Marka tescili: kelime unsuru riski | Orta | Açık | Değişmedi |
| R08 | Eylül bütçe sezonu fırsatı (kaçırma riski) | Orta | **Acil** | **2. gün geçiyor** |

**R08 Durum Notu:** Eylül bütçe sezonunun 2. günü. Norveç B2B şirketleri
2027 bütçelerini belirliyor. Formspree + LinkedIn olmadan bu pencereden geçmek
anlamına gelen lead kaybı her geçen gün büyüyor.

---

## Eylül Bütçe Sezonu — Gün Sayacı

**Bugün:** 02 Eylül 2026
**Kalan süre:** ~90 gün (Eylül–Kasım aktif bütçe sezonu)
**Tamamlanan:** R01 çözülmedi · R02 çözülmedi · R03 çözülmedi · LinkedIn yok

Her gün 3 kritik sorun açık kalırken:
- Bülten aboneleri yanlış hesapta birikmeye devam ediyor
- Brief başvuruları kaybolma riski taşıyor
- qblogg.com'a giden ziyaretçi siteyi görmüyor

---

## Kullanıcı Eylem Listesi (öncelik sırasına göre)

### Bu Hafta — Kritik (lead kaybı durduruluyor)

**1. Buttondown endpoint düzelt (15 dakika)**
- Seçenek A: Buttondown panelinde giriş yap → Settings → hesap adını `tatil`'den `qblogg`'a değiştir
- Seçenek B: Yeni Buttondown hesabı aç (`qblogg`), `config.js` → `newsletterEndpoint`'i yeni adresle güncelle: `'https://buttondown.com/api/emails/embed-subscribe/qblogg'`
- Sonra: `git push` (otomatik Vercel deploy tetiklenir)
- Doğrulama: Test e-postası gönder, Buttondown `qblogg` hesabında görünsün

**2. Formspree kur (30 dakika)**
- [formspree.io](https://formspree.io) → yeni hesap aç
- "New Form" → isim: "QBLOGG Brief" → form oluştur
- Form → Integration sekmesi → endpoint adresini kopyala (`https://formspree.io/f/xxxxxxxx`)
- `config.js` → `formEndpoint: 'https://formspree.io/f/xxxxxxxx'`
- `vercel.json` → CSP `connect-src`'ye `https://formspree.io` ekle
- Sonra: `npm run guvenlik` → PASS olduğunu doğrula → `git push`

**3. qblogg.com DNS (20 dakika + propagasyon)**
- Vercel panel → qblogg projesi → Settings → Domains → `qblogg.com` ekle
- Vercel'in verdiği `_vercel` TXT kayıt değerini kopyala
- GoDaddy → DNS Yönetimi → TXT kaydı ekle: `_vercel = [kopyalanan değer]`
- Vercel panelinde "Verify" butonuna tıkla
- DNS propagasyonu 24 saat içinde tamamlanır; sonra qblogg.com yayında

### Bu Hafta — Önemli (fırsat penceresi)

**4. LinkedIn hesabı aç ve QBLOGG sayfasını oluştur**
- LinkedIn → Şirket Sayfası oluştur
- Profil fotoğrafı: `assets/brand/` altındaki logo
- config.js → `social.linkedin: 'https://linkedin.com/company/qblogg'`
- İlk paylaşım: "10 dilde içerik stüdyosu — Eylül'de açılıyoruz"
- Hedef: ilk müşteri adaylarına doğrudan mesaj

**5. Fiyat kararı ver (10 dakika)**
- Seçenek: `config.js → prices` bölümüne NOK yazın
- Öneri: `p1: '2.900 kr'`, `p2: '12.900 kr/ay'`, `p3: '29.000 kr/ay'`
- Ya da EUR fiyatlar olduğu gibi kalsın (mevcut durum)
- Karar verdikten sonra `git push`

### Bu Ay — Gerekli

**6. Legal metinlerdeki boş alanları doldur**
- Dosyalar: `gizlilik.html`, `kosullar.html`, `work.html`
- Alanlar: şirket adı, MVA no, adres, editoryal sorumlu, yetkili mahkeme
- Avukat teyidi alın (özellikle GDPR veri işleme + Norveç Forbrukertilsynet)

**7. Google Search Console doğrulaması**
- qblogg.com DNS bağlandıktan sonra
- Search Console → Property ekle → TXT veya HTML doğrulama
- Organik trafik izlemeye başlanır

---

## Bir Sonraki 3 Görev (öncelik sırası)

### 1. [Kullanıcı] Buttondown + Formspree + DNS — Bu Hafta
Lead toplama altyapısının üç kritik parçası. Eylül bütçe sezonunda her gün
gecikme potansiyel müşteri kaybı demek. Kod hazır — yalnızca panel erişimi
ve `config.js`'e bir satır yazma gerekiyor.

### 2. [Kod — onay bekleniyor] "İlk 1.000 ziyaretçi" blog yazısı ekle
- Konu: Bir blogun ilk 1.000 ziyaretçisi nereden gelir (pratik kılavuz)
- Format: 10 dilde (TR+EN tam makale 40+ blok, 8 dil özet)
- `orig` alanı: QBLOGG'un kendi deneyimi / yayın istatistikleri
- Tahmini süre: 2–3 saat kodla
- Yüksek arama hacmi + QBLOGG'un tam hedef kitlesine (KOBİ + SaaS) ulaşıyor
- Onay verilirse bu oturumda başlanabilir

### 3. [Kod — onay bekleniyor] Action Pages demoyu yayına al
- `demo/cv-action-page.html` test edilmiş ve hazır
- main'e push + Vercel tetikleme yeterli
- Norveç bütçe sezonunda somut ürün göstermek güven kazandırır
- Onay gelirse 5 dakikada tamamlanır

---

## Hukuk, GDPR ve Güvenlik

**Açık hukuki riskler (değişmedi):**
- Legal metinlerde 10+ `[DOLDURULACAK]` alan → GDPR uyumsuzluk
- MVA numarası yok → Norveç B2B faturalama için gerekli
- Editoryal sorumlu adı yok → EU AI Act 50(4) gereği

**Güvenlik denetimi:** PASS (13/13) — bakınız Kalite Kapısı tablosu

---

## SEO Durum

| Alan | Durum | Not |
|---|---|---|
| Sitemap | ✓ 17 URL | Güncel |
| JSON-LD | ✓ Geçerli | FAQPage korunuyor (AI aramaları için) |
| hreflang | ⚠ JS bağımlı | ROADMAP #11 (ön-render) |
| Search Console | ✗ Bağlı değil | DNS sonrası kurulabilir |
| Core Web Vitals | ✗ Ölçülmedi | Lighthouse gerekli |

---

## Test Sonuçları (özet)

| Test | Durum | Kanıt |
|---|---|---|
| `npm run check` | ✓ PASS | 8/8 kontrol |
| `npm run guvenlik` | ✓ PASS | 13/13 · 0 yüksek |
| `npm run gorunurluk` | ✓ PASS | 10/10 yazı |
| Sezgisel denetim | Son: 24.08 — yenilenmedi | Ortalama 4,3/5 |
| Otomatik a11y | BLOCKED | Araç kurulumu gerekiyor |
| Lighthouse | BLOCKED | Araç kurulumu gerekiyor |

---

## Uygulanan Değişiklikler (bu oturum)

| Değişiklik | Dosya | Durum |
|---|---|---|
| Kalite kapıları çalıştırıldı | — | ✓ Tüm yeşil |
| config.js boşlukları analiz edildi | config.js | ✓ |
| Günlük rapor oluşturuldu | 06_LAUNCH/2026-09-02_... | ✓ |
| proje-gunlugu.md güncellendi | docs/proje-gunlugu.md | ✓ |
| Git commit + push | main → Vercel | ✓ |

---

## Uygulanamayan Değişiklikler

| Değişiklik | Bloker |
|---|---|
| Buttondown endpoint düzeltme | Kullanıcının Buttondown panel erişimi |
| Formspree bağlantısı | Kullanıcının Formspree hesabı |
| DNS doğrulaması | Kullanıcının GoDaddy + Vercel panel erişimi |
| Legal metin doldurma | Kullanıcının hukuki bilgileri |
| LinkedIn hesabı | Kullanıcı kararı |
| Analitik kurulumu | Kullanıcı kararı |
