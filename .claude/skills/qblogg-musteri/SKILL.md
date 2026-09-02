---
name: qblogg-musteri
description: >
  QBLOGG müşteri davranış verilerini oku, yorumla ve aksiyon öner — localStorage
  qb_bhv2 verisini analiz et, hangi müşteri neyi görmek istiyor, bir sonraki adım
  ne olmalı. "Müşteri analizi", "davranış verisi", "behavior", "ziyaretçi neyi
  istiyor", "kişiselleştirme", "öneri motoru", "kim ne okudu" gibi ifadelerde bu
  skill'i kullan.
---

# QBLOGG Müşteri Davranış Analizi

`assets/js/behavior.js` tüm sayfalarda sessizce çalışır ve her ziyaretçinin
ilgi profilini `localStorage` anahtarı **`qb_bhv2`**'de biriktirir.
Bu skill o veriyi okur, yorumlar ve pazarlama/içerik kararlarına çevirir.

## Veri şeması (qb_bhv2)

```json
{
  "sessions": 4,
  "lastVisit": 1725270000000,
  "pageViews": { "index": 3, "blog": 2, "work": 1 },
  "catScores": { "ai": 9, "seo": 3 },
  "packScores": { "p1": 2, "p2": 7 },
  "sectionViews": { "packages": 1, "blog": 1 },
  "postSlugs": ["ai-icerik-studyosu", "seo-rehberi"],
  "formStarted": false,
  "downloaded": false
}
```

## Sinyal→Skor sistemi

| Eylem | Skor |
|-------|------|
| Blog yazısı okuma | +3 → ilgili kategori |
| Kategori filtresi tıklama | +2 → ilgili kategori |
| Paket kartı üzerine hover | +1 → pakete |
| Paket CTA butonuna tıklama | +5 → pakete (en güçlü sinyal) |
| Bölüm scroll (IntersectionObserver) | 1× kayıt |
| Brief formuna dokunma | `formStarted = true` |
| Lead magnet indirme | `downloaded = true` |

## Öneri motoru — öncelik sırası

1. `formStarted = true` → kişi brief formuna başlamış, satın alma sürecinde
2. `packScores` en yüksek → hangi pakete en fazla ilgi gösterdi
3. `catScores` en yüksek → hangi içerik kategorisini seviyor
4. `postSlugs[0]` → en son okuduğu yazı

Widget bu sırayı izler ve 2. oturumdan itibaren, sayfa yüklenmesinden 1,8 sn
sonra gösterir. Oturum başına bir kez görünür (sessionStorage bayrağı).

## Paket isimleri (i18n anahtarları)

| Anahtar | TR |
|---------|----|
| p1.n | Başlangıç |
| p2.n | Büyüme |
| p3.n | Otorite |

## Kategori isimleri (i18n anahtarları)

`cat.ai`, `cat.seo`, `cat.newsletter`, `cat.guide`, `cat.social`, `cat.strategy`

## Analiz rehberi

**Yüksek packScore p2 + catScore ai:**
→ Ziyaretçi AI konularına ilgili, orta paket değerlendiriyor. İçerik önerisi:
"Yapay zeka ile içerik üretimi" yazısı + Büyüme paketi CTA.

**formStarted = true, sessions ≥ 3:**
→ Sıcak lead. Brief formunu tamamlamadı. Öneri: kişiselleştirilmiş takip
e-postası veya work.html sayfasına yönlendirme.

**downloaded = true, packScores boş:**
→ Lead magnet aldı ama henüz paket bakmadı. Üst düzey funnel, eğitim içeriği
ile besle.

**sessions = 1, tüm skorlar 0:**
→ İlk ziyaret. Widget gösterilmez. Yeni içerik veya bülten aboneliği hedefle.

## Veriyi okuma (geliştirici / analiz)

Browser console'dan:
```js
JSON.parse(localStorage.getItem('qb_bhv2'))
```

Sıfırlama (test için):
```js
localStorage.removeItem('qb_bhv2'); sessionStorage.removeItem('qb_bs2');
```

## Bağlı dosyalar

- `assets/js/behavior.js` — izleme ve widget kodu
- `assets/js/i18n.js` → `bhv.*` anahtarları (10 dil)
- `assets/css/main.css` → `#bhvWidget` stilleri
- Tüm 6 HTML sayfası → `app.js`'den sonra yüklenir
