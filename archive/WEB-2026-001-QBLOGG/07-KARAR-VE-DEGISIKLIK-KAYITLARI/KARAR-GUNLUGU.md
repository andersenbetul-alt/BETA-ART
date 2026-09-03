# WEB-2026-001 — Karar Günlüğü

---

## DEC-2026-08-01 — Saf HTML/CSS/JS tercih edildi (framework yok)

- **Tarih:** 2026-08 (kesin tarih bilinmiyor)
- **Proje:** WEB-2026-001 QBLOGG
- **Proje aşaması:** Define → Build
- **Kararı alan:** Betül Andersen
- **Konu:** Frontend teknoloji seçimi
- **Mevcut problem:** Site hangi teknoloji yığınıyla inşa edilecek?
- **Değerlendirilen seçenekler:** React/Next.js, Astro, Hugo, saf HTML
- **Seçilen çözüm:** Saf HTML + CSS + JavaScript (derleme yok, bağımlılık yok)
- **Seçilme nedeni:** Herhangi bir statik sunucuya olduğu gibi yüklenir; bakım maliyeti sıfır; hız avantajı; QBLOGG'un ölçeği için fazla mühendislik gerektirmez
- **Reddedilen seçenekler:** Framework'ler — gereksiz karmaşıklık, derleme adımı, bağımlılık yönetimi ek maliyet
- **Beklenen sonuç:** Uzun vadeli bakım kolaylığı, hızlı yükleme
- **Kararın durumu:** Aktif — değiştirilmedi
- **Yeniden değerlendirme tarihi:** Ölçek gerektirirse (çok sayfa, dinamik içerik)

---

## DEC-2026-08-02 — 10 dil desteği (istemci taraflı)

- **Tarih:** 2026-08 (kesin tarih bilinmiyor)
- **Proje:** WEB-2026-001 QBLOGG
- **Proje aşaması:** Design → Build
- **Kararı alan:** Betül Andersen
- **Konu:** Çok dilli içerik nasıl sunulacak?
- **Mevcut problem:** 10 dil desteği gerekiyor; her dil için ayrı sayfa mı, istemci taraflı değiştirme mi?
- **Seçilen çözüm:** İstemci taraflı i18n (tek HTML, JS ile dil değiştirme)
- **Seçilme nedeni:** Saf HTML tercihiyle uyumlu; sunucu gerektirmiyor; geliştirme hızı yüksek
- **Reddedilen seçenekler:** Her dil için ayrı HTML dosyası — bakım kabusa döner; pre-render — derleme adımı gerektirir
- **Bilinen risk:** Arama motoru tek HTML görür → çok dilli SEO sınırlı. Tam verim için pre-render adımı gerekecek.
- **Kararın durumu:** Aktif — bilinen sınırla kabul edildi

---

## DEC-2026-08-03 — Emoji kullanılmaz, satır içi SVG ikon çizilir

- **Tarih:** 2026-08
- **Proje:** WEB-2026-001 QBLOGG
- **Proje aşaması:** Design
- **Kararı alan:** Betül Andersen
- **Konu:** İkon sistemi
- **Seçilen çözüm:** Her ikon satır içi SVG — 24×24 ızgara, stroke tabanlı, `currentColor`
- **Seçilme nedeni:** Emoji işletim sistemi tarafından çizilir; Windows/Android/macOS farklı görünüm verir; marka kontrolü kaybolur. SVG her ortamda aynı görünür.
- **Kararın durumu:** Aktif

---

## DEC-2026-08-04 — Yayına alma kararı (22.08.2026)

- **Tarih:** 2026-08-22
- **Proje:** WEB-2026-001 QBLOGG
- **Proje aşaması:** Launch
- **Kararı alan:** Betül Andersen
- **Konu:** Site yayına alınacak mı?
- **Mevcut problem:** config.js boş (e-posta, fiyat, sosyal), bazı özellikler eksik
- **Seçilen çözüm:** Eksiklerle birlikte yayına alındı
- **Seçilme nedeni:** Erteleme kararı aynı gün kalktı; logo bitti, kullanıcı "yayına al" dedi. Mükemmeli beklemek trafik ve öğrenme kaybettiriyor.
- **Kararın durumu:** Uygulandı (site yayında)
- **Sonraki adım:** config.js doldurulacak, form servisi bağlanacak

---

## DEC-2026-08-05 — İki katmanlı içerik modeli

- **Tarih:** 2026-08
- **Proje:** WEB-2026-001 QBLOGG
- **Proje aşaması:** Build
- **Konu:** 10 dilden hangisi tam makale, hangisi özet?
- **Seçilen çözüm:** TR ve EN tam makale (30–55 blok, 1.200+ kelime); kalan 8 dil özet katmanı (3 blok, 250–1.200 karakter)
- **Seçilme nedeni:** Tüm 10 dili tam çevirmek zaman + maliyet açısından sürdürülemez; özet katmanı içeriği erişilebilir kılar ama kaynak yoğunluğu sınırlar
- **Kararın durumu:** Aktif
