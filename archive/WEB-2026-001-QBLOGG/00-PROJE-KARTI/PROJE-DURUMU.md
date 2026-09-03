# WEB-2026-001 — QBLOGG Proje Durumu

**Son güncelleme:** 2026-09-03

## Genel durum: YAYINDA ✓

Temel site çalışıyor. Asıl eksikler operasyonel: formlar gerçek servislere bağlı değil.

## Durum tablosu

| Alan | Durum | Not |
|---|---|---|
| Site yayını | ✓ Tamamlandı | qblogg.vercel.app |
| Marka/Logo | ✓ Tamamlandı | 14 varlık, betikten üretiliyor |
| 10 dil desteği | ✓ Tamamlandı | check.mjs yeşil |
| 11 blog yazısı | ✓ Tamamlandı | Tüm dillerde |
| Alan adı | ⚠ Kısmi | qblogg.com DNS doğru, Vercel TXT bekliyor |
| Brief formu | ⚠ Kısmi | mailto: taslağı açıyor; Formspree kurulmadı |
| Bülten | ⚠ Kısmi | Buttondown bağlı ama yanlış listeye (tatil) |
| config.js | ✗ Eksik | Gerçek e-posta, sosyal, fiyat girilmedi |
| Stripe / ödeme | ✗ Yok | payLinks boş |
| Otomatik deploy | ✗ Yok | GitHub entegrasyonu yetkisiz |
| Portföy/vaka | ✗ Yok | Henüz eklenmedi |
| Hakkımızda | ✗ Yok | Anonim stüdyo — güven düşürücü |

## ROADMAP ilerlemesi

| # | İş | Durum |
|---|---|---|
| 1 | Depoya yazma izni, push | **Bitti** 22.08.2026 |
| 2 | Alan adı bağlantısı | **Yarım** |
| 3 | Gerçek e-posta, alan, fiyatlar (config.js) | **Bekliyor** |
| 5 | Formspree entegrasyonu | **Bekliyor** |
| 7 | 2–3 vaka çalışması | **Bekliyor** |
| 8 | Hakkımızda bölümü | **Bekliyor** |

## Kalite kontrol özeti

- `npm run check` → ✓ 8/8 geçti (2026-09-03 oturum başlangıcı)
- `npm run guvenlik` → Son çalıştırma tarihi bilinmiyor
- `npm run gorunurluk` → Son çalıştırma tarihi bilinmiyor
