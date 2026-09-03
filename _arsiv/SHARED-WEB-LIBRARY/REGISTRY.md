# BETA-ART — Ortak Web Kütüphanesi

**Son güncelleme:** 2026-09-03  
**Amaç:** Projeler arasında yeniden kullanılabilir kod parçalarını ve kalıpları kayıt altına almak.

---

## LIB-001 — i18n Sistemi

**Kaynak:** `assets/js/i18n.js` (WEB-2026-001 QBLOGG)  
**Kullananlar:** WEB-2026-001 (kaynak), WEB-2026-006 (aynı yaklaşım planlandı)

### Ne Yapar
- `QB_LANGS`: dil listesi `{ code, name, native, dir }` — Arapça için `dir: 'rtl'`
- `QB_I18N`: `{ [langCode]: { [key]: string } }` — tüm metinler
- HTML'de `data-i18n="key"` ile bağlanır; `app.js` okuyup yerleştirir
- Eksik anahtar sessizce İngilizceye düşer (güvenlik ağı, çözüm değil)

### Kural
Yeni anahtar eklerken **on dile birden** eklenir. Kısmi ekleme kabul edilmez.

### Uyarlama Notu (Next.js/TypeScript için)
React context + custom hook `useI18n()` deseni: `QB_I18N` objesini import et,
`useSearchParams()` ile `?lang=` oku, `useState` ile dil state'i yönet.
Tüm metin bir `t(key)` wrapper'dan geçer.

---

## LIB-002 — Davranış Sistemi (behavior.js)

**Kaynak:** `assets/js/behavior.js` (WEB-2026-001 QBLOGG)  
**Kullananlar:** WEB-2026-001 (kaynak), WEB-2026-002 (TS uyarlaması belgelenmiş — repo transferi sonrası)

### Ne Yapar
- Gün bazlı azalma (`DECAY=0.85`) ile yazı/kategori izleme
- Öneri motoru: `suggest()`, `topCat()`, `recoPlan()`
- Widget enjeksiyonu: `injectPostWidget()` (2+. okuma: öneri, 4+: Stripe CTA), `injectBlogHint()`
- GDPR: `clear()` tek çağrıyla tüm izleme verisini siler
- Dil değişimini `qb:lang` event ile dinler

### Depolama
`localStorage['qb_beh']` — `{slug, cat, ts}[]`  
Kişisel veri yok; GDPR açısından düşük risk.

### Aktivasyon Eşikleri
`MIN_SUGGEST=2` (öneri widget), `MIN_PLAN=4` (Stripe CTA)

### TypeScript Uyarlaması
`naviar/docs/behavior-system.md`: React hook, bileşen örneği, Stripe entegrasyon rehberi.

---

## LIB-003 — Tasarım Simgesi Sistemi (Design Token System)

**Kaynak:** `assets/css/main.css` (WEB-2026-001 QBLOGG)  
**Belge:** `docs/tasarim-sistemi.md`  
**Kullananlar:** WEB-2026-001 (kaynak), WEB-2026-006 (planlandı — aynı i18n + CSS yaklaşımı)

### Renkler
| Token | Değer | Kullanım |
|---|---|---|
| `--brand` | `#082C54` Midnight Navy | Ana marka rengi |
| `--brand-2` | `#00D8C2` Electric Aqua | Vurgu, köprü |
| `--brand-2-ink` | `#0a7d72` | Açık zeminde metin (5,0:1 kontrast) |
| `--text` | Temaya göre | Gövde metni |
| `--logo-ink` | Temaya göre döner | Logo halkası |

**Önemli kural:** Aqua (`#00D8C2`) beyaz üzerinde 1,8:1 kontrast — metinde kullanılamaz.

### Yazı Boyutu Basamakları
`--fs-2xs` … `--fs-xl` — ham `rem` yazılmaz.

### Koyu Tema
`@media (prefers-color-scheme: dark)` ile otomatik çalışır.  
`data-theme="dark"` / `data-theme="light"` explicit override.

---

## LIB-004 — RTL/Çok Yönlü CSS Kalıbı

**Kaynak:** `assets/css/main.css` (WEB-2026-001 QBLOGG)  
**Belge:** `docs/tasarim-sistemi.md`

### Kural
Yön bağımlı CSS özelliği **yazılmaz**:
- ✅ `margin-inline-start` (yerine: `margin-left`)
- ✅ `inset-inline-start` (yerine: `left`)
- ✅ `padding-inline-end` (yerine: `padding-right`)

Arapça için `<html dir="rtl">` atar; mantıksal özellikler RTL'de otomatik yansır.

---

## LIB-005 — Blog İçerik Veri Modeli (posts.js formatı)

**Kaynak:** `assets/js/posts.js` (WEB-2026-001 QBLOGG)  
**Kullananlar:** WEB-2026-001 (kaynak), WEB-2026-007 (Curiosity Engine çıktısı bu formata gider)

### Yazı Nesnesi Şeması
```js
{
  slug: 'benzersiz-slug',
  category: 'ai',           // sözlükte cat.<ad> olmalı
  date: '2026-09-01',       // YYYY-AA-GG
  accent: 3,                // 1-6: kapak rampası
  icon: 'brain',            // ICONS kaydındaki ad
  orig: 'Özgün katkı tek cümleyle.',
  src: [{ t: 'Başlık', u: 'https://...' }],  // ≥3 kaynak zorunlu
  t: { tr: '...', en: '...', /* 10 dil */ },   // başlık
  e: { tr: '...', en: '...', /* 10 dil */ },   // özet
  b: { tr: [...], en: [...], /* 10 dil */ }     // gövde blokları
}
```

### Gövde Blok Tipleri
| Tip | Sözdizimi | Açıklama |
|---|---|---|
| Paragraf | `'Metin'` | Düz dize |
| Ara başlık | `{h: 'Başlık'}` | `<h3>` |
| Liste | `{ul: ['...', '...']}` | `<ul>` |
| Uyarı | `{note: 'Metin'}` | Vurgulu kutu |
| İç bağlantı | `{see: 'slug'}` | Küme bağlantısı |
| Ortaklık | `{aff: {t, u, why}}` | `rel="sponsored"`, bildirim |

Metin içinde `**vurgu**` yazılabilir (paragraf, liste, not içinde).

---

## LIB-006 — Doğrulama Betiği Kalıbı (check.mjs)

**Kaynak:** `scripts/check.mjs` (WEB-2026-001 QBLOGG)

### Yapı
Node.js ESM modülü. Çıkış kodu 0 = hepsi yeşil, 1 = hata var.

Denetler:
1. i18n anahtar bütünlüğü (10 dil × N anahtar)
2. Boş değer kontrolü
3. Yazı alanları (slug, başlık, özet, gövde × 10 dil)
4. HTML'de çiftlenen id/script
5. data-i18n → sözlük eşleşmesi
6. Yerel bağlantı/varlık varlığı
7. Sitemap–sayfa/slug uyumu
8. Eşleşmeyen `**` (rich() kaçış hatası)

**Kullanım:** `npm run check` — commit öncesi zorunlu.

---

## LIB-007 — Görünürlük Kuralı (visibility.mjs / gorunurluk.mjs)

**Kaynak:** `engine/visibility.mjs` + `scripts/gorunurluk.mjs` (WEB-2026-001 / WEB-2026-007)

### 16 Maddelik Kural Özeti
- `orig` alanı zorunlu
- `src` en az 3 kaynak (para/kariyer konularında kesin kural)
- tr/en tam makale: 30–55 blok, 1.200+ kelime (CJK duyarlı sayaç)
- 8 özet dil: 3 blok, 250–1.200 karakter
- Adressiz kaynak `nu` ile gerekçelendirilmeli

**Kullanım:** `npm run gorunurluk` (tüm yazılar), `node scripts/gorunurluk.mjs <slug>` (tek yazı).
