# WEB-2026-002 HXI — Test Sonuçları

## Otomatik kontroller

QBLOGG'daki gibi (`check.mjs`, `guvenlik.mjs`, `gorunurluk.mjs`) HXI için ayrı test altyapısı yok.

Site henüz yayınlanmadığı için `npm run guvenlik` veya `npm run gorunurluk` gibi araçlar uygulanmamıştır.

---

## Manuel kontroller (2026-09-03 itibarıyla bilinmeyen durum)

| Alan | Durum |
|---|---|
| Mobil uyumluluk | Bilgi bulunamadı — doğrulama gerekli |
| Erişilebilirlik (a11y) | Kısmi: `aria-label`, `aria-expanded`, `role="list"` mevcut; tam denetim yapılmadı |
| Core Web Vitals | Bilgi bulunamadı — site canlıya alınmadı |
| Tarayıcı uyumluluğu | Bilgi bulunamadı |
| Kırık bağlantılar | Bilgi bulunamadı — iç bağlantı denetimi yapılmadı |

---

## Güvenlik başlıkları (vercel.json'dan doğrulandı)

| Başlık | Değer | Durum |
|---|---|---|
| X-Content-Type-Options | nosniff | ✓ Yapılandırıldı |
| X-Frame-Options | DENY | ✓ Yapılandırıldı |
| X-XSS-Protection | 1; mode=block | ✓ Yapılandırıldı |
| Referrer-Policy | strict-origin-when-cross-origin | ✓ Yapılandırıldı |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | ✓ Yapılandırıldı |
| Content-Security-Policy | default-src 'self' + Google Fonts | ✓ Yapılandırıldı |

---

## Bilinen açık sorunlar

| Sorun | Seviye | Durum |
|---|---|---|
| Site deploy edilmedi (Vercel GitHub auth engeli) | **Yüksek** | Bekliyor (kullanıcı tarafı) |
| Müzik/cover görseli placeholder | **Yüksek** | Bekliyor |
| Contact formu gerçek servise bağlı değil | **Orta** | Bekliyor |
| Logo SVG Acid rengi güncellenmedi | **Orta** | Bekliyor |
| sitemap.xml yok | **Düşük** | Bekliyor |
