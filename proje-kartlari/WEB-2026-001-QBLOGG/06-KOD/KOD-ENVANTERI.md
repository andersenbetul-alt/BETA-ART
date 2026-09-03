# WEB-2026-001 QBLOGG — Kod Envanteri

**Son güncelleme:** 2026-09-03

---

## JavaScript (`assets/js/`)

### config.js
**Rol:** Tüm yayın ayarları — tek değişiklik noktası  
**Dışa aktarır:** `window.QB_CONFIG`

| Alan | İçerik | Durum |
|---|---|---|
| `mailTo` | Alıcı e-posta | `[DOLDURULACAK]` |
| `siteUrl` | `https://qblogg.com` | Var |
| `social` | Twitter, LinkedIn URL'leri | `[DOLDURULACAK]` |
| `prices` | p1/p2/p3 fiyat nesneleri | Örnek (NOK yok) |
| `payLinks` | Stripe ödeme bağlantıları | **Boş — gelir kapısı kapalı** |
| `leadMagnet` | PDF URL'si | Var |
| `newsletterEndpoint` | Buttondown POST URL | Var (`tatil` kullanıcı adıyla) |

### i18n.js
**Rol:** Dil listesi + 10 dilde metin sözlüğü  
**Dışa aktarır:** `QB_LANGS` (dizi), `QB_I18N` (nesne)  
**Boyut:** 236 anahtar × 10 dil  
**Özel:** Arapça (`ar`) için `dir: 'rtl'` — uygulama bunu okuyarak `<html dir>` atar

### posts.js
**Rol:** Tüm blog içeriği  
**Dışa aktarır:** `QB_POSTS` (dizi)  
**Yazı sayısı:** 11 (2026-09-03)  
**Yazı alanları:** `slug`, `category`, `date`, `accent` (1–6), `icon`, `t/e/b` (title/excerpt/body) × 10 dil, `orig`, `src`  
**Gövde blok tipleri:** düz dize (paragraf), `{h}`, `{ul}`, `{note}`, `{see}`, `{aff}`

### app.js
**Rol:** Dil/tema/liste/arama/filtre/yazı sayfası/sekmeler/formlar  
**Önemli fonksiyonlar:**
- `QB_BOOT()` — sayfa başlatma
- `composeMail()` — brief ve yazar başvurusu `mailto:` oluşturucu
- `rich()` — `**vurgu**` → `<strong>` dönüştürücü (önce kaçış, sonra çeviri)
- `syncCanonical()` — canonical + hreflang dil değişiminde güncelleme
- `ICONS` — yazı ikonları ad → SVG kaydı

### behavior.js
**Rol:** Ziyaretçi davranış izleme ve kişiselleştirme  
**Dışa aktarır:** `window.QB_BEH`  
**Boyut:** 228 satır  
**API:**
- `track(slug, category)` — oturum başına bir kez
- `suggest()` — okunmamış yazılar, kategori ağırlıklı
- `topCat()` — en çok okunan kategori
- `recoPlan()` — kategori → Stripe paket (`payLinks`)
- `eventCount()` — toplam sayım
- `clear()` — GDPR silme
- `injectPostWidget()` — post.html'e öneri/CTA widget
- `injectBlogHint()` — blog.html'e kategori ipucu
**Depolama:** `localStorage['qb_beh']` — `{slug, cat, ts}[]`  
**Azalma:** `Math.pow(0.85, days)` — eski okumalar düşük ağırlık  
**Aktivasyon:** MIN_SUGGEST=2, MIN_PLAN=4

---

## CSS (`assets/css/`)

### main.css
**Rol:** Tek stil dosyası  
**Mimari:**
- `:root` değişkenleri — tüm renkler ve yazı boyutları
- `@media (prefers-color-scheme: dark)` — koyu tema otomatik
- Mantıksal CSS özellikleri (`margin-inline-start`, `inset-inline-start`) — RTL uyumlu
- Yazı boyutu basamakları: `--fs-2xs` … `--fs-xl`
- Marka renkleri: `--brand` (Midnight Navy #082C54), `--brand-2` (Electric Aqua #00D8C2), `--brand-2-ink` (#0a7d72 — metinde kullanılabilir, 5,0:1)

---

## Betikler (`scripts/`)

| Betik | Komut | İşlev |
|---|---|---|
| `check.mjs` | `npm run check` | i18n, yazılar, HTML, sitemap sağlık kontrolü |
| `guvenlik.mjs` | `npm run guvenlik` | XSS, GDPR, CSP, güvenlik başlıkları |
| `gorunurluk.mjs` | `npm run gorunurluk` | 16 maddelik görünürlük kuralı |
| `onizleme.mjs` | `npm run onizleme` | Tek dosya HTML önizleme |
| `marka-uret.py` | `python3 scripts/marka-uret.py` | 14 kimlik varlığı üretimi |
| `marka-tescil.mjs` | `node scripts/marka-tescil.mjs` | EUIPO tescil dosyası denetimi |

---

## Marka Varlıkları (`assets/brand/`)

**Üretici:** `scripts/marka-uret.py`  
**Çıktılar:** 11 SVG + 3 PNG (favicon-32, apple-touch-icon, og-image)  
**Bağımlılık:** `fonttools`, `brotli` (stdlib ile rasterleştirici)

---

## Fontlar (`assets/fonts/`)

| Font | Lisans | Kaynak |
|---|---|---|
| Inter Variable | OFL-1.1 | `KAYNAK.md`'de belgelenmiş |
