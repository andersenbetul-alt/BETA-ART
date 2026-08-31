# Günlük Proje Raporu

## Proje: QBLOGG
## Proje Kodu: P01
## Tarih: 2026-08-31
## Güncel Faz: 06 Launch
## Güncel Sürüm: v0.8

---

## Yönetici Özeti

Site 22.08.2026'dan beri yayında. Son çalışma 24.08.2026 gece. Bu rapor
ilk AUTOPROMPT çalışmasını temsil ediyor. Tüm kod kalite kapıları geçiyor
(8/8 check · 13/13 güvenlik · 10/10 görünürlük). Ancak üç kritik yapısal
sorun hâlâ açık: bülten aboneleri yanlış hesaba gidiyor (R01), brief formu
güvensiz kanal (R02) ve alan adı sahiplik doğrulaması bekliyor (R03).
Eylül Norveç bütçe sezonunun başı — acil fırsat penceresi (R08).

---

## Son Değişiklikler (24.08 → 31.08.2026)

Son git log'a göre yapılan son commit `f4a95c4` (monorepo birleştirme).
Bu dönemde:
- Monorepo yapısı tamamlandı (`BETA-ART/` kök: QBLOGG + beta-art + naviar + agents)
- Action Pages pilotu tamamlandı (`demo/cv-action-page.html`) — deploy onayı bekleniyor
- NAVIAR CARE taşıma kılavuzu eklendi
- Bu çalışma: AUTOPROMPT sistem dosyaları ilk kez oluşturuldu

---

## Araştırma Bulguları (2026-08-31)

### Erişim Durumu
Bu ortamda dış web erişimi kapalı (EGRESS_BLOCKED). Aşağıdaki bulgular
eğitim verisine ve proje belgelerine dayanmaktadır; gerçek zamanlı
doğrulama eksik.

### Norveç B2B İçerik Pazarı (bilgi bankasından)

Norveç'te aktif içerik ajansları:
- **Webskaper / BrandWarriors grubu**: LinkedIn + thought leadership odaklı,
  genellikle 15–40 bin kr/ay ücret, proje bazlı.
- **Novicell Nordic**: B2B dijital pazarlama, içerik dahil, büyük kurumsal müşteri.
- **Idunn Marketing**: KOBİ odaklı, SEO + içerik, benzer hedef kitle.

Küresel rakipler (İngilizce, yüksek fiyat):
- **Animalz**: SaaS için içerik, $3.000–$10.000/ay, yalnızca EN.
- **Growth Machine**: SEO içerik, $3.000+/ay, yalnızca EN.
- **The Content Bureau**: B2B içerik, $5.000+/ay, yalnızca EN.

### QBLOGG Farklılaşma Analizi

| Ölçüt | Rakipler | QBLOGG | Avantaj |
|---|---|---|---|
| Dil sayısı | 1–2 | 10 | Güçlü |
| AI şeffaflığı | Çoğu gizliyor | Açıkça anlatılıyor | Güven avantajı |
| Fiyatlandırma | Saatlik / özel teklif | Sabit paket | Düşük sürtünme |
| Format çeşidi | 1–2 | 7 aynı araştırmadan | Güçlü |
| Norveç piyasası | Yerel rakipler mevcut | Yeni giriş | Risk ve fırsat |

---

## Karşılaştırmalı Rakip Analizi

### 3 Benzer Hizmet Özeti

**1. Animalz (küresel lider, EN)**
- Hedef: SaaS, B2B teknoloji şirketleri
- Model: Aylık retainer $3.000–$10.000
- Güçlü: Marka güveni yüksek, referanslar zengin
- Zayıf: Yalnızca İngilizce, küçük KOBİ'ye ulaşamıyor
- QBLOGG için: 10 dil + NOK fiyat büyük fark

**2. Norveç yerel ajansları (Webskaper benzeri)**
- Hedef: Kurumsal ve orta ölçekli Norveç şirketleri
- Model: Proje bazlı 15–40 bin kr
- Güçlü: Yerel iletişim, Norveç kültürü
- Zayıf: Çok dilli içerik üretemiyorlar, AI şeffaflığı yok
- QBLOGG için: Çok dil + 7 format + şeffaflık öne çıkar

**3. Upwork freelancer havuzu**
- Hedef: Bütçesi sınırlı KOBİ'ler
- Model: Yazı başına $50–$300
- Güçlü: Düşük giriş fiyatı, anında başlama
- Zayıf: Kalite tutarsızlığı, marka sesi yok, dil sınırı
- QBLOGG için: Paket model + güvenilirlik + süreklilik farkı

---

## Tespit Edilen Riskler

→ RISK-REGISTER.md'de tam liste. Bugünkü öncelikler:

1. **R01** (Yüksek): `newsletterEndpoint` yanlış — `tatil` yerine `qblogg` olmalı.
   Her gün yeni abone yanlış hesaba gidiyor.

2. **R02** (Yüksek): `formEndpoint` boş — brief başvuruları kaybolabilir.
   Site yayında ama en kritik dönüşüm noktası güvensiz.

3. **R08** (Acil fırsat): Eylül = Norveç bütçe sezonu. LinkedIn üzerinden
   aktif ulaşma, Formspree ve sosyal hesaplar bu ay çözülmeli.

---

## Kullanıcının Gözden Kaçırabileceği Konular

1. **Bülten aboneleri yanlış hesapta.** `tatil` Buttondown hesabında birikiyor,
   `qblogg`'da değil. Çözülene kadar listeyi gerçek anlamda kuruyorsunuz.

2. **Eylül Norveç bütçe sezonunun başı.** B2B hizmet satışı için yılın en iyi
   penceresi. Formspree bağlanmadan, sosyal hesaplar olmadan, LinkedIn'de
   aktif olmadan bu pencereyi kaçırma riski yüksek.

3. **Legal metinlerde 10 boş alan.** GDPR açısından riskli. Norveç'te
   Forbrukertilsynet (Tüketici Dairesi) B2C içeriği olan siteleri denetliyor.

4. **Fiyatlar piyasanın altında.** €150/makale = ~1.730 kr. Norveç'te bu tür
   hizmet 3.000–5.000 kr. Düşük fiyat kalite algısını olumsuz etkileyebilir.

5. **Action Pages demosu deploy edilmedi.** `demo/cv-action-page.html` hazır
   ve test edildi, ama yayında değil. Norveç bütçe sezonunda somut bir ürün
   göstermek kritik.

---

## Önerilen Değişiklikler

| Öncelik | Değişiklik | Gerekçe | Etki | Zorluk | Risk | Durum |
|---|---|---|---|---|---|---|
| 1 | Buttondown kullanıcı adını düzelt | Aboneler yanlış hesaba gidiyor | Yüksek | Düşük | Düşük | Kullanıcı eylemi |
| 2 | Formspree bağla (`formEndpoint`) | Brief başvuruları kaybolabilir | Yüksek | Düşük | Düşük | Kullanıcı eylemi |
| 3 | qblogg.com DNS (`_vercel` TXT) | Alan adı bağlı değil | Yüksek | Düşük | Düşük | Kullanıcı eylemi |
| 4 | Action Pages demo deploy et | Pilot ürün yayında değil | Yüksek | Düşük | Düşük | Kullanıcı onayı |
| 5 | LinkedIn hesabı aç + paylaş | Bütçe sezonu fırsat penceresi | Yüksek | Orta | Düşük | Kullanıcı eylemi |
| 6 | NOK fiyatlandırma | Piyasanın altındayız | Orta | Düşük | Düşük | Kullanıcı kararı |
| 7 | Legal metinlerdeki `[DOLDURULACAK]` | GDPR riski | Orta | Orta | Orta | Kullanıcı + avukat |
| 8 | Analitik (Plausible veya Umami) | Dönüşümü ölçemiyoruz | Orta | Orta | Düşük | Kullanıcı eylemi |
| 9 | "İlk 1.000 ziyaretçi" blog yazısı | Yüksek arama hacmi, trafik | Orta | Orta | Düşük | Uygulanabilir (kod) |

---

## Uygulanan Değişiklikler (bu oturum)

| Değişiklik | Dosya | Durum |
|---|---|---|
| AUTOPROMPT sistem dosyaları oluşturuldu | `docs/autoprompt/P01_QBLOGG/` | ✓ |
| PROJECT-INDEX.md oluşturuldu | `00_INDEX/PROJECT-INDEX.md` | ✓ |
| RISK-REGISTER.md oluşturuldu | `00_INDEX/RISK-REGISTER.md` | ✓ |
| QUALITY-GATE.md oluşturuldu | `00_INDEX/QUALITY-GATE.md` | ✓ |
| TRANSLATION-GLOSSARY.md oluşturuldu | `00_INDEX/TRANSLATION-GLOSSARY.md` | ✓ |
| Günlük rapor oluşturuldu | `06_LAUNCH/2026-08-31_...` | ✓ |
| proje-gunlugu.md güncellendi | `docs/proje-gunlugu.md` | ✓ |

---

## Uygulanamayan Değişiklikler ve Blokajlar

| Değişiklik | Bloker |
|---|---|
| Buttondown endpoint düzeltme | Kullanıcının Buttondown paneli gerekiyor |
| Formspree bağlantısı | Kullanıcının Formspree hesabı gerekiyor |
| DNS doğrulaması | Kullanıcının GoDaddy + Vercel panel erişimi gerekiyor |
| Legal metin doldurma | Kullanıcının hukuki bilgileri + avukat |
| Rakip siteleri inceleme | Dış web erişimi kapalı (EGRESS_BLOCKED) |
| Analitik kurulumu | Kullanıcının hesap + ödeme kararı |

---

## Hukuk, GDPR ve Güvenlik Kontrolü

```
TEST: npm run guvenlik
DURUM: PASS
KANIT: 13/13 geçti · 0 yüksek · 0 orta · 2 bilgi
RİSK: 2 bilgi notu (hreflang JS bağımlı; dış bağlantı qblogg.com)
DÜZELTME: hreflang için kalıcı çözüm ön-render (ROADMAP #11)
```

**Açık hukuki riskler:**
- Legal metinlerde 10 `[DOLDURULACAK]` alan → GDPR uyumsuzluk riski
- MVA numarası yok → Norveç B2B faturalama için gerekli
- Editoryal sorumlu adı yok → AI içeriği için gerekli (EU AI Act 50(4))

---

## Erişilebilirlik Kontrolü

```
TEST: Manuel sezgisel denetim (24.08.2026)
DURUM: PASS (ortalama 4,3/5)
KANIT: docs/denetim/sezgisel-denetim-2026-08-24.md
RİSK: Demo'da ilerleme göstergesi eksik (N1: 3/5)
DÜZELTME: Adım sayacı eklenebilir (demo/cv-action-page.html)
```

Otomatik erişilebilirlik testi (axe/Lighthouse) yapılmadı. Manuel kontrol
ile takip ediliyor.

---

## SEO ve Performans Kontrolü

```
TEST: npm run check (sitemap, JSON-LD, hreflang)
DURUM: PASS — 17 URL sitemap'te doğrulandı
RİSK: Tüm diller aynı URL'de (JS ile değişiyor) — arama motoru tek HTML görüyor
DÜZELTME: Ön-render adımı (ROADMAP #11) — öncelik henüz orta
```

**Bilinen SEO açıkları:**
- Çok dilli SEO için ayrı URL'ler yok
- Google Search Console bağlı değil (doğrulama kodu yok)
- Core Web Vitals ölçülmedi
- 236 KB sayfa yükü (183 KB i18n+posts; her ziyaretçi 10 dili indiriyor)

---

## Çoklu Dil Kontrolü

```
TEST: npm run check (i18n + posts)
DURUM: PASS — 10 dil × 233 anahtar eksiksiz; 10 yazı × 10 dil eksiksiz
RİSK: AR (Arapça) RTL live test yapılmadı bu oturumda
DÜZELTME: Arapçaya geçip mobil kontrol — her yeni bölüm eklenmesinde
```

---

## Test Sonuçları (özet)

| Test | Durum | Kanıt |
|---|---|---|
| `npm run check` | ✓ PASS | 8/8 |
| `npm run guvenlik` | ✓ PASS | 13/13 · 0 yüksek |
| `npm run gorunurluk` | ✓ PASS | 10/10 yazı |
| Sezgisel denetim | PASS | Ortalama 4,3/5 |
| Otomatik a11y | BLOCKED | Araç kurulumu gerekiyor |
| Lighthouse | BLOCKED | Araç kurulumu gerekiyor |

---

## Karar Günlüğü Güncellemesi

Yeni karar yok bu oturumda. Açık kararlar:
- D04 (NOK fiyat) → kullanıcı kararı bekliyor
- D05 (Analitik) → kullanıcı kararı bekliyor
- D08 (DNS) → kullanıcı eylemi bekliyor

---

## Bir Sonraki En Değerli Üç Görev

1. **[Kullanıcı] Buttondown + Formspree + DNS — bu hafta**
   - Buttondown: hesap adını `tatil` → `qblogg` yap (veya yeni hesap, endpoint güncelle)
   - Formspree: hesap aç → form oluştur → `config.js formEndpoint`'e yaz
   - GoDaddy: `_vercel` TXT kaydı → Vercel "Verify & Claim"
   - **Neden şimdi:** Eylül bütçe sezonu başladı. Bu üçü olmadan lead toplanmıyor.

2. **[Kod — hazır] Action Pages demo'yu yayına al**
   - `demo/cv-action-page.html` test edilmiş ve hazır.
   - main'e push + Vercel tetikleme yeterli.
   - **Onay gelirse** bu oturumda uygulanabilir.

3. **[Kod] "Bir blogun ilk 1.000 ziyaretçisi" blog yazısı ekle**
   - Konu havuzunda var, yüksek arama hacimli, trafik getirici.
   - 10 dilde (TR+EN tam, 8 dil özet), `orig` + `src` ile.
   - Tahmini süre: 2–3 saat.

---

## İnsan Onayı Gereken Konular

| Konu | Neden onay gerekiyor |
|---|---|
| Action Pages demo deploy | Yayına alma kararı |
| NOK fiyatlandırma | İş kararı |
| Legal metin doldurma | Kişisel/şirket bilgileri |
| Analitik platform seçimi | Ödeme ve gizlilik tercihi |
| LinkedIn hesabı açmak | Sosyal strateji kararı |
| Avukat görüşü (marka) | Hukuki karar |
