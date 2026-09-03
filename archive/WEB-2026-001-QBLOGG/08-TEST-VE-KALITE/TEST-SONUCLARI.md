# WEB-2026-001 — Test Sonuçları

## Otomatik kontroller

### `npm run check` — Proje sağlık kontrolü

**Son çalıştırma:** 2026-09-03 (oturum başlangıcı hook)
**Sonuç:** ✓ 8/8 geçti

| # | Kontrol | Sonuç |
|---|---|---|
| 1 | i18n: 10 dil × 236 anahtar eksiksiz | ✓ |
| 2 | posts: 11 yazı × 10 dil eksiksiz | ✓ |
| 3 | html: 9 sayfada çiftlenen id/script yok | ✓ |
| 4 | html: tüm data-i18n anahtarları sözlükte mevcut | ✓ |
| 5 | html: tüm yerel bağlantı ve varlıklar mevcut | ✓ |
| 6 | sitemap: 18 URL doğrulandı | ✓ |
| 7 | html: her sayfa gerekli stil ve betikleri yüklüyor | ✓ |
| 8 | json-ld: 1 statik blok geçerli | ✓ |

### `npm run guvenlik` — Güvenlik + GDPR

**Son çalıştırma:** Bilinmiyor — kullanıcı doğrulaması gerekli
**Kontrol kapsamı:** XSS, JSON-LD kaçışı, tabnabbing, localStorage kişisel veri, canonical–hreflang, mailto enjeksiyonu, CSP connect-src, rel="sponsored"

### `npm run gorunurluk` — Görünürlük kuralı (16 madde)

**Son çalıştırma:** Bilinmiyor — kullanıcı doğrulaması gerekli
**Kontrol kapsamı:** orig alanı, src kaynakları (en az 3), kelime sayısı eşiği, TR/EN tam makale, özet katmanı

## Manuel kontroller (2026-09-03 itibarıyla bilinmeyen durum)

| Alan | Durum |
|---|---|
| Mobil uyumluluk | Bilgi bulunamadı — test gerekli |
| Erişilebilirlik (a11y) | Bilgi bulunamadı — test gerekli |
| Core Web Vitals | Bilgi bulunamadı — test gerekli |
| Kırık bağlantılar | Bilgi bulunamadı — `check.mjs` yerel bağlantıları kontrol ediyor, harici kontrol yok |
| Tarayıcı uyumluluğu | Bilgi bulunamadı |

## Bilinen açık sorunlar

| Sorun | Seviye | Durum |
|---|---|---|
| `config.js` boş (gerçek e-posta/fiyat yok) | Yüksek | Bekliyor |
| Formlar gerçek servise bağlı değil | Yüksek | Bekliyor |
| Buttondown yanlış listeye bağlı | Orta | Bekliyor |
| Alan adı TXT doğrulaması | Orta | Bekliyor |
