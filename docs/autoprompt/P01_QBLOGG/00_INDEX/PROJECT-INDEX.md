# PROJECT-INDEX — P01 QBLOGG

**Son güncelleme:** 2026-08-31  
**Güncel faz:** 06 Launch  
**Güncel sürüm:** v0.8 (yayında, geliştirme sürüyor)

---

## Temel Bilgiler

| Alan | Değer |
|---|---|
| Proje adı | QBLOGG |
| Proje kodu | P01 |
| Amaç | İçerik stüdyosu tanıtım + blog sitesi; brief formu doldurtmak |
| Hedef kullanıcılar | İçerik ekibi olmayan KOBİ ve SaaS şirketleri (Norveç odaklı) |
| Değer önerisi | Tek araştırmadan 7 format: blog + LinkedIn + sosyal + newsletter + SEO + kısa video senaryosu + YouTube |
| İş modeli | Tek Makale / Büyüme retainer / Stüdyo retainer + Action Pages eklenti geliri |
| Başlangıç tarihi | 2026-08-18 |
| Yayın tarihi | 2026-08-22 |

---

## Canlı Adresler

| Ortam | Adres |
|---|---|
| **Üretim** | https://qblogg.vercel.app (qblogg.com DNS doğrulama bekliyor) |
| Vercel projesi | qblogg · takım: BET-ART |
| Action Pages demo | https://qblogg.vercel.app/demo/cv-action-page.html |

---

## Çalışma Konumu

| Bileşen | Konum |
|---|---|
| Claude Code | `/home/user/BETA-ART/` (kök — QBLOGG) |
| Lovable | Yok (saf HTML, framework yok) |
| Branch | Geliştirme: `claude/autoprompt-project-system-zaqpz1` |
| Üretim | `main` → Vercel buildCommand |

---

## Önemli Dosyalar

| Dosya | İşlev |
|---|---|
| `assets/js/config.js` | **TEK KAYNAK:** e-posta, alan adı, sosyal, fiyat, Formspree, Buttondown |
| `assets/js/i18n.js` | 10 dil × 233 anahtar |
| `assets/js/posts.js` | 10 blog yazısı × 10 dil |
| `assets/js/app.js` | Dil, tema, liste, yazı, formlar |
| `ROADMAP.md` | İş listesi ve öncelik sırası |
| `docs/proje-gunlugu.md` | Aşama kayıtları |
| `docs/is-modeli.md` | İş modeli detayı |
| `docs/gelir-sistemi.md` | Gelir katmanları ve huni |
| `scripts/check.mjs` | Sağlık kontrolü (8 test) |
| `scripts/guvenlik.mjs` | Güvenlik denetimi (13 test) |
| `scripts/gorunurluk.mjs` | Görünürlük kuralları (16 madde) |
| `demo/cv-action-page.html` | Action Pages MVP demosu |

---

## Güncel Test Sonuçları (2026-08-31)

| Test | Sonuç |
|---|---|
| `npm run check` | ✓ 8/8 geçti |
| `npm run guvenlik` | ✓ 13/13 geçti · 0 yüksek |
| `npm run gorunurluk` | ✓ 10/10 yazı geçiyor |

---

## Açık Kararlar

| # | Karar | Bloker |
|---|---|---|
| D01 | Buttondown kullanıcı adı `tatil` → `qblogg` yeniden adlandırması | Kullanıcı Buttondown paneli |
| D02 | Formspree bağlantısı (formEndpoint boş) | Kullanıcı Formspree hesabı |
| D03 | Action Pages demosu ana siteye deploy — onay bekliyor | Kullanıcı onayı |
| D04 | Norveç fiyatlandırması: mevcut EUR fiyatlar piyasanın altında | Kullanıcı kararı |
| D05 | Analitik kurulumu (Umami/Plausible önerildi) | Kullanıcı kararı |
| D06 | Marka tescili: kelime markası vekil görüşü | Avukat |
| D07 | Legal metinlerdeki `[DOLDURULACAK]` alanlar (10 alan) | Kullanıcı |
| D08 | qblogg.com DNS sahiplik doğrulaması (`_vercel` TXT) | Kullanıcı |
| D09 | Sosyal hesap adresleri (LinkedIn, X, Medium, Substack, YouTube) | Kullanıcı |

---

## Bilinen Riskler (özet → RISK-REGISTER.md)

| ID | Risk | Önem |
|---|---|---|
| R01 | newsletterEndpoint yanlış kullanıcı (`tatil`) → abone kaybı | **Yüksek** |
| R02 | formEndpoint boş → brief başvuruları kaybolabilir | **Yüksek** |
| R03 | qblogg.com DNS doğrulanmadı → alan adı başka Vercel hesabına bağlı | **Yüksek** |
| R04 | EUR fiyatlar Norveç piyasasına göre düşük → yanlış beklenti | Orta |
| R05 | Legal metinlerde eksik alanlar → GDPR/hukuki uyumsuzluk riski | Orta |
| R06 | Analitik yok → hangi içeriğin lead getirdiği bilinmiyor | Orta |
| R07 | Marka tescili: kelime unsuru risk taşıyor | Orta |

---

## Bir Sonraki En Değerli Üç Görev

1. **D01 + D02:** Buttondown kullanıcı adını düzelt + Formspree kur (kullanıcı)
2. **D08:** qblogg.com DNS sahiplik doğrulaması (kullanıcı; Vercel panel + GoDaddy)
3. **Yeni blog yazısı:** "Bir blogun ilk 1.000 ziyaretçisi nereden gelir" — büyük hacimli, trafik getirici
