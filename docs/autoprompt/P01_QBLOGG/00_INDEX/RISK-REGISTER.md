# RISK-REGISTER — P01 QBLOGG

**Son güncelleme:** 2026-08-31

Risk önem ölçeği: **Yüksek** (hemen ele alınmalı) · **Orta** (bu ay) · **Düşük** (izle)

---

## Aktif Riskler

### R01 — Buttondown yanlış kullanıcı adı
| Alan | Değer |
|---|---|
| Önem | **Yüksek** |
| Açıklama | `config.js → newsletterEndpoint` `tatil` kullanıcısını işaret ediyor. Kayıt olan aboneler `qblogg` listesine değil `tatil` listesine gidiyor. |
| Etki | Tüm bülten aboneleri yanlış hesapta toplanıyor; liste oluşturulamıyor |
| Düzeltme | Buttondown panelinde hesap adını `tatil` → `qblogg` olarak değiştir (veya yeni hesap aç, endpoint güncelle) |
| Sorumlu | Kullanıcı (Buttondown panel) + `config.js` kodu |
| Tespit | 21.08.2026 |
| Durum | **Açık** |

---

### R02 — formEndpoint boş (brief kaybı)
| Alan | Değer |
|---|---|
| Önem | **Yüksek** |
| Açıklama | `config.js → formEndpoint` boş. Brief formu ziyaretçinin kendi e-posta uygulamasında taslak açıyor; gönder basılmazsa başvuru kaybolur. |
| Etki | Potansiyel müşteri kaybı — en kritik dönüşüm noktası güvensiz |
| Düzeltme | 1. Formspree hesabı aç. 2. Form oluştur. 3. Endpoint'i `config.js`'e yaz. 4. `vercel.json` CSP `connect-src`'ye Formspree adresi eklenir (zaten `guvenlik.mjs` denetliyor). |
| Sorumlu | Kullanıcı (Formspree hesabı) |
| Tespit | 21.08.2026 |
| Durum | **Açık** |

---

### R03 — qblogg.com DNS sahiplik doğrulaması
| Alan | Değer |
|---|---|
| Önem | **Yüksek** |
| Açıklama | qblogg.com başka bir Vercel hesabına bağlı. Devir için `_vercel` TXT kaydı + "Verify & Claim" adımı gerekiyor. |
| Etki | qblogg.com'a giden ziyaretçi siteyi görmüyor |
| Düzeltme | 1. Vercel paneli → Domains → qblogg.com → Claim. 2. GoDaddy → qblogg.com → DNS → TXT kaydı ekle (`_vercel=...`). 3. Vercel "Verify" bekle. |
| Sorumlu | Kullanıcı |
| Tespit | 22.08.2026 |
| Durum | **Açık** |

---

### R04 — EUR fiyatlar Norveç piyasasının altında
| Alan | Değer |
|---|---|
| Önem | Orta |
| Açıklama | Tek Makale €150 = ~1.730 kr. Norveç piyasası: benzer hizmet 3.000–8.000 kr. Büyüme paketi €900 ≈ 10.400 kr, piyasanın alt bandı. |
| Etki | Değer algısı düşük; karlılık sorunlu (özellikle Büyüme'de) |
| Düzeltme | `config.js → prices`'ı NOK cinsinden yaz. Öneri: Tek Makale 2.900 kr, Büyüme 12.900 kr/ay, Stüdyo 29.000 kr/ay |
| Sorumlu | Kullanıcı kararı |
| Tespit | ROADMAP #67 |
| Durum | Karar bekliyor |

---

### R05 — Legal metinlerde eksik alanlar
| Alan | Değer |
|---|---|
| Önem | Orta |
| Açıklama | `gizlilik.html`, `kosullar.html` ve `work.html`'de 10+ `[DOLDURULACAK]` alanı var: yasal kimlik, MVA no, ödeme vadesi, editoryal sorumlu, yetkili mahkeme. |
| Etki | GDPR / Norveç Forbrukertilsynet uyumsuzluğu riski |
| Düzeltme | Kullanıcı bu alanları kendi bilgileriyle dolduracak. Avukat teyidi öncelikli. |
| Sorumlu | Kullanıcı |
| Tespit | 21.08.2026 |
| Durum | **Açık** |

---

### R06 — Analitik yok
| Alan | Değer |
|---|---|
| Önem | Orta |
| Açıklama | Hangi yazının brief getirdiği, hangi ülkeden ziyaret geldiği, dönüşüm hunisi bilinmiyor. |
| Etki | İçerik ve fiyat kararları veri yerine tahmine dayanıyor |
| Düzeltme | Gizlilik dostu analitik kur: Umami (self-hosted veya cloud) veya Plausible. CSP'ye ekle. |
| Sorumlu | Kullanıcı (hesap + ödeme) |
| Tespit | ROADMAP #15 |
| Durum | Bekliyor |

---

### R07 — Marka tescili: kelime unsuru riski
| Alan | Değer |
|---|---|
| Önem | Orta |
| Açıklama | "BLOGG" İsveççe/Norveççe "blog" = tanımlayıcı. EUIPO inceleme simülasyonu: şekil unsuru düşük risk, kelime unsuru yüksek risk. AB sicil araması yapılmadı. |
| Etki | Tescil reddedilebilir; ticari kullanım sonrası marka itirazı gelebilir |
| Düzeltme | Vekil (marka avukatı) görüşü alınmadan başvurulmamalı. Seçenek: yalnızca şekil markası başvurusu. |
| Sorumlu | Kullanıcı (avukat işe alımı) |
| Tespit | 22.08.2026 |
| Durum | Açık |

---

### R08 — Eylül bütçe sezonu fırsatı (risk: kaçırma)
| Alan | Değer |
|---|---|
| Önem | Orta |
| Açıklama | Norveç şirketleri Eylül–Kasım'da 2027 bütçelerini belirliyor. Bu dönem B2B hizmet satışı için en verimli pencere. |
| Etki | Fırsat kaçırılırsa bir sonraki pencere 2027 Ocak. |
| Düzeltme | Bu ay: Formspree kur (başvuru al), LinkedIn sayfası aç, ilk müşteri adaylarına doğrudan ulaş. |
| Sorumlu | Kullanıcı |
| Tespit | 31.08.2026 |
| Durum | **Acil fırsat** |

---

## Kapatılan Riskler

| ID | Risk | Kapatma tarihi | Notlar |
|---|---|---|---|
| C01 | Buttondown CSP engeli | 21.08.2026 | `connect-src`'ye eklendi |
| C02 | Q sembolü ters sarım kusuru | 22.08.2026 | `marka-uret.py` düzeltildi |
| C03 | og:image ve 404 eksikliği | 22.08.2026 | Eklendi |
| C04 | XSS / tabnabbing | 18.08.2026 | Denetimde geçti |
