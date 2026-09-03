# WEB-2026-007 — Curiosity Engine

- **Proje numarası:** WEB-2026-007
- **Resmî proje adı:** Curiosity Engine
- **Kısa açıklama:** İçerik üretim hattı — sinyal toplayıcı, konu kümeleyici, makale yazıcı
- **Temel amaç:** QBLOGG blog içeriğini araştırma → makale → SEO → kalite kapısı pipeline'ıyla üretmek
- **Çözdüğü problem:** Manuel içerik araştırması ve yazımı yavaş, ölçeklenmez; Curiosity Engine bunu otomatikleştirir
- **Hedef kullanıcılar:** İç kullanım — QBLOGG içerik hattı operasyonu
- **Proje sahibi:** Betul Andersen — andersen.betul@gmail.com
- **Başlangıç tarihi:** 2026 (kesin tarih bilinmiyor)
- **Son güncelleme:** 2026-09-02
- **Güncel durum:** Geliştirme
- **Güncel sürüm:** 0.5.0 (tahmini)
- **Son kararlı sürüm:** Yerel ortamda çalışıyor; network ortamı gerekli
- **Canlı adres:** Yok (yerel)
- **Kod deposu:** `engine/` (BETA-ART monoreposu içinde)
- **Aktif Git dalı:** `main` (monorepo ana dalı)
- **Kullanılan teknolojiler:**
  - Dil: Node.js (JavaScript/ESM)
  - Veritabanı: SQLite
  - Temel dosyalar: `schema.sql`, `schema-billing.sql`, `billing.mjs`, `visibility.mjs`, `run.mjs`, `write.mjs`
- **Veri hassasiyet seviyesi:** Düşük (içerik meta verisi, API sonuçları)
- **İlgili projeler:**
  - WEB-2026-001 (QBLOGG — aynı `posts.js` formatı; engine çıktısı buraya gider)
- **Güncel öncelikler:**
  1. Gerçek ağ ortamında test et (container ağ kısıtlaması engel)
  2. `visibility.mjs` 16 maddelik kalite kapısını tam entegre et
- **Bilinen sorunlar:**
  - Container ağ erişimi kısıtlı — harici servis çağrıları bu ortamda çalışmıyor
  - Üretim ortamı kurulmamış
- **Sonraki adım:** Gerçek ağ ortamında `run.mjs` testini çalıştır
- **Son doğrulama tarihi:** 2026-09-03
- **Teknik not:** `schema-billing.sql` içinde ödeme altyapısı var: hesap, ürün, abonelik, kredi defteri, yetki, webhook. `billing.mjs`: kredi bakiyesi, yetki, webhook tekilliği, para biçimi. `visibility.mjs`: 16 maddelik görünürlük kuralı — `gorunurluk.mjs` betiği bu modülü QBLOGG yazılarına da uygular.
