# WEB-2026-001 — QBLOGG İçerik Stüdyosu

- **Proje numarası:** WEB-2026-001
- **Resmî proje adı:** QBLOGG
- **Önceki isimleri:** "saat uygulaması" (monorepo birleştirme öncesi eski depo adı; QBLOGG adı 22.08.2026'dan itibaren)
- **Kısa açıklama:** Şirketlere içerik hattı satan bir stüdyonun tanıtım + blog sitesi. 10 dil, saf HTML/CSS/JS, derleme adımı yok.
- **Temel amaç:** Hedef müşterilerin brief formunu doldurmasını sağlamak
- **Çözdüğü problem:** İçerik ekibi olmayan KOBİ ve SaaS şirketleri düzenli yayın yapamıyor; QBLOGG hazır içerik hattı sunuyor
- **Hedef kullanıcılar:** İçerik ekibi olmayan Norveçli ve uluslararası KOBİ / SaaS şirketleri; ikincil: stüdyoya katılmak isteyen yazarlar
- **Proje sahibi:** Betul Andersen — andersen.betul@gmail.com
- **Başlangıç tarihi:** 2026-08-14 (tahmini; ilk commit geçmişten tespit edilemedi — QBLOGG olarak net başlangıç 22.08.2026)
- **Son güncelleme:** 2026-09-03
- **Güncel durum:** Yayında (Bakımda)
- **Güncel sürüm:** 1.7.0 (tahmini — Git tag yok, commit sayısına göre tahmin; kullanıcı doğrulaması gerekli)
- **Son kararlı sürüm:** Doğrulanmış son kararlı sürüm — `main` dalı, commit `2c8edd6` (2026-09-02)
- **Canlı adres:** https://qblogg.vercel.app
- **Hedef alan adı:** https://qblogg.com (DNS bağlı; TXT doğrulama + Verify & Claim bekliyor)
- **Test adresi:** Yok (ayrı preview ortamı kurulmamış)
- **Kod deposu:** https://github.com/andersenbetul-alt/BETA-ART
- **Aktif Git dalı:** `main` (yayın) + `claude/naviar-dosylari-oijd0p` (geliştirme)
- **Kullanılan teknolojiler:**
  - Frontend: Saf HTML5, CSS3 (değişkenler + RTL), Vanilla JS (ES2020+)
  - Analitik: Yok
  - Arama: Yok (istemci tarafı filtre)
  - Dil: 10 dil (tr, en, zh, hi, es, ar, fr, pt, ru, no)
  - Font: Inter Variable (yerel, OFL-1.1)
  - Newsletter: Buttondown (POST API)
  - Davranış: behavior.js (localStorage, sıfır bağımlılık)
  - Ödeme: Stripe Payment Links (yapılandırılmamış — `payLinks` boş)
  - Hosting: Vercel (BET-ART takımı, buildCommand deseni)
  - Veritabanı: Yok (istemci tarafı localStorage)
  - CI/CD: Manuel (main'e push → Vercel yeniden tetikleme)
- **Veri hassasiyet seviyesi:** Düşük — localStorage'da yalnızca slug+kategori; e-posta yalnızca Buttondown'a gidiyor; sunucuda kişisel veri tutulmuyor
- **İlgili projeler:**
  - WEB-2026-006 (QBLOGG Üye — aynı markanın üye portalı)
  - WEB-2026-007 (Curiosity Engine — içerik üretim hattı; aynı posts.js formatı)
- **Güncel öncelikler:**
  1. `config.js → payLinks` Stripe URL'leri ekle (gelir kapısı)
  2. `config.js → prices` NOK fiyatlandırma
  3. `config.js` gerçek e-posta ve sosyal hesaplar
  4. `qblogg.com` DNS bağlama (TXT doğrulama)
  5. Buttondown kullanıcı adını `tatil`'den `qblogg`'a değiştir
  6. Koşullar sayfasındaki 10 `[DOLDURULACAK]` alanı doldur
- **Bilinen sorunlar:**
  - Stripe CTA görünmüyor (`payLinks` boş)
  - Buttondown kullanıcı adı yanlış (`tatil` → `qblogg` olmalı)
  - Git tag yok (sürüm geçmişi takip edilemiyor)
  - `qblogg.com` alan adı henüz Vercel'e bağlı değil
  - Vercel'in GitHub entegrasyonu `andersenbetul-alt` hesabına yetkili değil
  - Fiyatlar örnek (NOK'a dönüştürülmemiş)
  - Koşullar sayfasında 10 boş yasal alan var
- **Sonraki adım:** Stripe payLinks ekle → config.js commit → main push → Vercel redeploy
- **Son doğrulama tarihi:** 2026-09-03
