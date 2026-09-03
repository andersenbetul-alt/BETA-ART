# WEB-2026-006 — QBLOGG Üye / Q Brief Pro

- **Proje numarası:** WEB-2026-006
- **Resmî proje adı:** QBLOGG Üye / Q Brief Pro
- **Kısa açıklama:** Üye portalı ve özet üreticisi — QBLOGG abonelerine giriş, brief yönetimi, içerik özeti
- **Temel amaç:** Ödeme yapan müşterilere özel portal; brief gönderme ve içerik takibi
- **Çözdüğü problem:** Brief formunun e-posta tabanlı olması — müşteri takibi yok, içerik durumu görünmüyor
- **Hedef kullanıcılar:** QBLOGG aboneleri (p1/p2/p3 paket sahipleri)
- **Proje sahibi:** Betul Andersen — andersen.betul@gmail.com
- **Başlangıç tarihi:** 2026-08-24
- **Son güncelleme:** 2026-08-24
- **Güncel durum:** Geliştirme
- **Güncel sürüm:** 0.1.0
- **Son kararlı sürüm:** İskelet aşamasında — canlıya alınmadı
- **Canlı adres:** Yok (Supabase bağlı değil)
- **Kod deposu:** `uye/` (BETA-ART monoreposu içinde)
- **Aktif Git dalı:** `main` (monorepo ana dalı)
- **Kullanılan teknolojiler:**
  - Frontend: Saf HTML (QBLOGG ile aynı yaklaşım)
  - Backend: Supabase (yapılandırılmamış)
  - Auth: Supabase Auth (yapılandırılmamış)
  - `supabaseUrl` ve `supabaseAnonKey` boş
- **Veri hassasiyet seviyesi:** Yüksek (müşteri brief içerikleri, ödeme durumu)
- **İlgili projeler:**
  - WEB-2026-001 (QBLOGG — aynı marka, ana site)
- **Güncel öncelikler:**
  1. Supabase proje oluştur ve yapılandır (`supabaseUrl`, `supabaseAnonKey`)
  2. Auth akışı test et
  3. Brief yönetim sayfalarını tamamla
- **Bilinen sorunlar:**
  - Supabase bağlı değil — yanlışlıkla push'lanırsa verisiz canlıya çıkar
  - Canlıya almak için önce Supabase yapılandırılmalı
- **Sonraki adım:** Supabase projesi yapılandır — önce test ortamında
- **Son doğrulama tarihi:** 2026-09-03
- **Özel not (güvenlik):** `supabaseUrl` ve `supabaseAnonKey` bu belgeye yazılmamıştır. Yapılandırma değerleri yalnızca ortam değişkeni veya Vercel env secrets olarak saklanmalı.
