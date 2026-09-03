# WEB-2026-001 – QBLOGG

- **Proje numarası:** WEB-2026-001
- **Resmî proje adı:** QBLOGG
- **Önceki isimleri:** —
- **Kısa açıklama:** AI destekli içerik stüdyosu — şirketlere SEO blog yazısı, LinkedIn serisi, newsletter ve çok dilli içerik üretip satan tanıtım + blog sitesi.
- **Temel amaç:** Brief formunu doldurtmak (müşteri adayı yakalamak).
- **Çözdüğü problem:** İçerik ekibi olmayan KOBİ/SaaS şirketleri düzenli, kaliteli içerik yayınlayamıyor.
- **Hedef kullanıcılar:** (1) Kendi içerik ekibi olmayan, düzenli yayın yapmak isteyen KOBİ ve SaaS şirketleri; (2) Stüdyoya katılmak isteyen yazarlar.
- **Proje sahibi:** Betül Andersen / BET-ART (andersen.betul@gmail.com)
- **Başlangıç tarihi:** 2026-08 (kesin tarih — Bilgi bulunamadı; git geçmişinden ilk commit incelenmeli)
- **Son güncelleme:** 2026-08-24 (main dalı son commit)
- **Güncel durum:** Yayında
- **Güncel sürüm:** v1.0.0 (ilk Semantic Versioning ataması — öncesinde SemVer kullanılmamıştı)
- **Son kararlı sürüm:** main dalı, commit `b12dde9` → Doğrulanmış kararlı sürüm
- **Canlı adres:** https://qblogg.vercel.app (Vercel üretim) · https://qblogg.com (alan adı bağlanmakta)
- **Test adresi:** Yok (ayrı staging ortamı kurulmamış)
- **Kod deposu:** https://github.com/andersenbetul-alt/BETA-ART (monorepo kökü `/`)
- **Aktif Git dalı:** main (kararlı), claude/* (geliştirme dalları)
- **Kullanılan teknolojiler:** Saf HTML5, CSS3 (CSS Custom Properties), Vanilla JavaScript (ES6+), JSON-LD, hreflang, RSS/Atom
- **Framework:** Yok (bilinçli tercih — derleme adımı, bağımlılık yok)
- **Programlama dilleri:** HTML, CSS, JavaScript
- **Veritabanı:** Yok (içerik JS dosyalarında: `posts.js`, `i18n.js`)
- **Hosting/dağıtım:** Vercel (BET-ART takımı, `team_xNtowH7U0jXQrI53DFJFzH2o`)
- **Veri hassasiyet seviyesi:** Düşük (kişisel veri toplanmıyor; yalnızca bülten e-postası Buttondown'a gönderiliyor)
- **İlgili projeler:** WEB-2026-007 Curiosity Engine (içerik üretim hattı), WEB-2026-008 Demo Sayfaları
- **Güncel öncelikler:**
  1. `config.js` gerçek e-posta/alan/fiyatlarla doldurulması (ROADMAP #3)
  2. Formspree entegrasyonu (ROADMAP #5)
  3. qblogg.com alan adı doğrulaması (Vercel TXT kaydı)
- **Bilinen sorunlar:**
  - `config.js` hâlâ örnek verilerle (mailTo, prices, payLinks, social boş)
  - Buttondown endpoint'i gerçek liste değil tatil listesine bağlı
  - Alan adı TXT doğrulaması bekliyor (`_vercel` kaydı)
  - Formlar `mailto:` taslağı açıyor (gerçek form servisi yok)
  - Vercel GitHub entegrasyonu `andersenbetul-alt` hesabına yetkili değil (otomatik deploy yok)
- **Sonraki adım:** `config.js` gerçek verilerle doldurulacak → form Formspree'ye bağlanacak → alan adı doğrulanacak
- **Son doğrulama tarihi:** 2026-09-03
