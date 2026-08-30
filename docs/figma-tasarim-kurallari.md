# BETA-ART — Figma MCP Design System Rules
*Tüm sayılar depodan ölçüldü. Son güncelleme: 30.08.2026.*

Bu belge, Figma tasarımlarını bu depoya entegre ederken Claude'un (ve insan
geliştiricilerin) uyması gereken kuralları tanımlar. **Depodaki kaynak budur;
Figma değil.**

---

## 0. Mimari özeti — önce bunu bilin

| Konu | Durum |
|---|---|
| UI çatısı | **Yok** — React/Vue/Svelte hiçbiri |
| Stil kütüphanesi | **Yok** — Tailwind/CSS Modules/Styled Components hiçbiri |
| Derleyici/paketleyici | **Yok** — Vite/webpack/esbuild hiçbiri |
| Bağımlılık | **Sıfır** (site dosyalarında) |
| Figma koltuğu | `View` — dosya oluşturulamaz, yalnızca okunur |

Figma bileşeni → **düz HTML + satır içi SVG**. JSX üretmeyin.

---

## 1. Tasarım belirteçleri (Token Definitions)

### Nerede tanımlı

**İki bağımsız tasarım sistemi var** — karıştırmayın:

| Sistem | Token dosyası | Renk paleti |
|---|---|---|
| **QBLOGG** | `assets/css/main.css` `:root` (satır 1–40) | Navy `#082C54` + Aqua `#00D8C2` |
| **NaviarCare** | `naviar/care/style.css` `:root` (satır 1–32) | Mavi `#0051c3` + Teal `#00897b` |

Her iki sistemde de başka hiçbir dosyada token tanımı yok.

### Format

Düz CSS özel değişkenleri. Dönüştürme sistemi (Style Dictionary / DTCG JSON)
**yok** — tarayıcı doğrudan okuyor.

### QBLOGG token tablosu

```css
:root {
  /* Renkler */
  --bg: #ffffff;          --bg-soft: #f6f7fb;     --bg-card: #ffffff;
  --text: #14161c;        --text-muted: #5b6172;  --border: #e4e7f0;
  --brand: #082C54;       /* Midnight Navy — kimlik */
  --brand-2: #00D8C2;     /* Electric Aqua — YALNIZCA vurgu, metinde kullanılamaz */
  --brand-2-ink: #0a7d72; /* Beyaz üzerinde 5,0:1 — metindeki aqua */
  --on-brand: #ffffff;    /* Marka üzerindeki metin — 13,2:1 */
  --logo-ink: #082C54;    /* Temaya göre döner */
  --danger: #b3261e;      /* Beyaz üzerinde 6,3:1 */

  /* Yazı ölçeği (8 basamak) */
  --fs-2xs: .76rem;  --fs-xs: .8rem;   --fs-sm: .85rem;  --fs-md: .92rem;
  --fs-base: .95rem; --fs-lg: 1rem;    --fs-xl: 1.12rem; --fs-logo: 1.16rem;

  /* Geometri */
  --radius: 16px;    --radius-sm: 10px;  --maxw: 1140px;
  --shadow: 0 1px 2px rgba(16,20,40,.04), 0 12px 32px rgba(16,20,40,.07);
  --shadow-lg: 0 2px 4px rgba(16,20,40,.05), 0 24px 60px rgba(16,20,40,.12);

  /* Tipografi */
  --font: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, 'Noto Sans', 'Noto Sans Arabic',
          'Noto Sans Devanagari', 'Noto Sans SC', sans-serif;
}
```

Koyu tema: `html[data-theme="dark"]` bloğu, `--brand` navy→aqua değişir.

### NaviarCare token tablosu

```css
:root {
  /* Renkler */
  --bg: #ffffff;         --bg-alt: #f8f9fb;     --bg-card: #f4f6f9;
  --border: #e2e6ec;     --border-strong: #c9d0db;
  --text: #0e1420;       --text-2: #3b4557;     --text-3: #6b7a92;
  --link: #0051c3;
  --brand: #0051c3;      --brand-dark: #003d96;  --brand-light: #e8f0fe;
  --accent: #00897b;     --accent-light: #e0f2f1;
  --danger: #c62828;     --danger-light: #ffebee;
  --success: #2e7d32;    --success-light: #e8f5e9;
  --warn: #e65100;       --warn-light: #fff3e0;

  /* Geometri */
  --radius: 8px;  --radius-lg: 14px;  --radius-xl: 20px;
  --max: 1100px;  --nav-h: 60px;
  --shadow: 0 1px 4px rgba(14,20,32,.08), 0 4px 16px rgba(14,20,32,.06);
  --shadow-lg: 0 2px 8px rgba(14,20,32,.1), 0 8px 32px rgba(14,20,32,.1);

  /* Tipografi */
  --font: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
}
```

Koyu tema: `@media (prefers-color-scheme: dark)` + `:root[data-theme="dark"]`.

### Değişmez kural: ham değer yazılmaz

Ham hex veya ham `rem` **yazmayın**. Her değer `var(--…)` ile gelir.
Başlıklar `clamp()` kullanır — bu ölçeğin dışındadır.

---

## 2. Bileşen kütüphanesi (Component Library)

**Resmi bileşen kütüphanesi yok.** Storybook yok. Yerine geçen:

- **QBLOGG:** `assets/css/main.css` içinde **95 CSS sınıfı**, 6 HTML
  sayfasında elle kullanılıyor. JavaScript'te en yakın şey `app.js`'deki
  `cardHTML(post, seviye)` — JSX değil, dize döndüren işlev.

- **NaviarCare:** `naviar/care/style.css` içinde NaviarCare'e özgü
  bileşenler (`.nav`, `.doctor-card`, `.triage-step`, `.rating-btn` vb.).

### Sayfa iskeleti tekrarı

QBLOGG'un 6 HTML sayfasında (`index`, `work`, `blog`, `post`, `gizlilik`,
`kosullar`) menü ve altbilgi **elle tekrarlanır**. Birini değiştirirken
hepsini güncelleyin.

NaviarCare'de aynı kural geçerli: 8 HTML sayfası (`naviar/care/`).

---

## 3. Çatılar ve kütüphaneler (Frameworks & Libraries)

### Site (üretim)

| Katman | Durum |
|---|---|
| HTML | Düz 5 — çerçeve yok |
| CSS | Tek dosya, CSS özel değişkenleri |
| JavaScript | Vanilla ES5/ES6 — modül sistemi yok, `window.QB_*` küreselleri |
| Yazı tipi | Inter 4.001 — **kendi sunucumuzda**, Google Fonts CDN yok |

### Betik yükleme sırası (QBLOGG — değiştirmeyin)

```html
<script src="assets/js/config.js"></script>   <!-- yayın ayarları -->
<script src="assets/js/i18n.js"></script>     <!-- dil verileri -->
<script src="assets/js/posts.js"></script>    <!-- blog içeriği -->
<script src="assets/js/app.js"></script>      <!-- hepsini kullanır -->
```

### Geliştirme araçları (siteye girmez)

- **Playwright + Chromium** `/opt/pw-browsers/chromium` — tarayıcı testi
- **fonttools + brotli** — marka varlıkları üretimi
- **Node.js scriptleri** — `check.mjs`, `guvenlik.mjs`, `gorunurluk.mjs`

### NaviarCare

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<script src="app.js"></script>
```

`app.js` yüklendiğinde: `LANGS`, `getLang`, `setLang`, `initFaq`,
`initLangFilter`, `initActiveNav`, `initLangChips`, `initComplaintInput`.

---

## 4. Varlık yönetimi (Asset Management)

### Klasör yapısı

```
assets/
  css/main.css          Tek stil dosyası (QBLOGG)
  js/config.js          Yayın ayarları (e-posta, alan adı, fiyatlar)
  js/i18n.js            10 dil × 209+ anahtar
  js/posts.js           Blog içeriği (10 yazı × 10 dil)
  js/app.js             Tüm uygulama mantığı
  fonts/                Inter alt kümeleri (latin, latin-ext, cyrillic, cyrillic-ext)
  brand/                14 kimlik varlığı — betikten üretilir, ELLE DÜZENLENMEz
  downloads/            Lead magnet HTML

brand/naviar/
  master/               12 SVG — wordmark, monogram, lockup, icon
  descriptors/          7 hizmet tanımlayıcısı SVG
  index.html            Kimlik kılavuzu sayfası

naviar/care/
  style.css  app.js     NaviarCare paylaşımlı varlıklar
  *.html (8)            Sayfa dosyaları

naviar/care-pilot/index.html   Oslo bakım koordinasyonu MVP sitesi
naviar/consult/index.html      NAVIAR Consult yer tutucu
```

### CDN — yok, olmamalı

Yazı tipleri kendi sunucumuzda. Google Fonts CDN IP adresini Google'a iletir
(GDPR riski). Figma bir Google Fonts bağlantısı önerirse **kabul etmeyin** —
fontu indirip `assets/fonts/`'e ekleyin.

### Optimizasyon

- **Alt kümeleme:** `unicode-range` — ziyaretçi yalnızca kendi dilinin
  gerektirdiği baytı indirir.
- `font-display: swap` her `@font-face`'te.
- Arapça, Çince, Devanagari → sistem yazı tiplerine düşer.
- `vendor/inter-4.001/` (60 MB) yayına çıkmaz — `.vercelignore`'da.

---

## 5. İkon sistemi (Icon System)

### Değişmez kural: emoji kullanılmaz

Emoji'yi işletim sistemi çizer — Windows, Android, macOS üç farklı görünüm.
Görünen her ikon **satır içi SVG**.

### Çizim kuralı

```
Izgara: 24 × 24
fill="none"
stroke="currentColor"
stroke-width="1.7"
stroke-linecap="round"
stroke-linejoin="round"
aria-hidden="true"
focusable="false"
```

`currentColor` kritik: ikon bulunduğu metnin rengini alır, tema değişiminde
kendiliğinden döner.

**İstisna:** `→  ↑  ☾  ☀` — yazı tipiyle çizilir, SVG değil.

### İki depo

**Yazı ikonları (QBLOGG)** — `assets/js/app.js` `ICONS` kaydı, 11 ikon:
```
question · coin · blocks · phone · banknote · compass · bulb ·
chart · envelope · link · gear
```

Yalnızca path gövdesi saklanır; sarmalayıcı `iconSVG(name)` üretir:

```js
function iconSVG(name) {
  var body = ICONS[name];
  if (!body) return '';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true" focusable="false">' + body + '</svg>';
}
```

Blog yazısı ikonu `posts.js`'de adla seçilir: `icon: 'coin'`.

**Sayfa ikonları** — doğrudan HTML'e gömülür, kayıtta durmaz.

### Figma'dan ikon çevirirken

1. Sabit renk varsa `currentColor`'a çevirin.
2. `stroke-width` 1.7'ye ayarlayın.
3. Gereksiz `g` sarmalayıcıları ve `id` niteliklerini temizleyin.
4. `aria-hidden="true" focusable="false"` ekleyin.

---

## 6. Stil yaklaşımı (Styling Approach)

### Metodoloji

Hiçbiri. Düz CSS, tek dosya. Sınıf adları anlamsal ve kısa.

### Koyu tema

**QBLOGG:** `html[data-theme="dark"]` niteliği (JavaScript'te `setTheme()`).

**NaviarCare:** `@media (prefers-color-scheme: dark)` + `[data-theme="dark"]`.
İkisi de CSS tarafında çözülür — JavaScript yalnızca sınıfı veya niteliği ekler.

### RTL — değişmez kural

```css
/* YANLIŞ */           /* DOĞRU */
margin-left            margin-inline-start
margin-right           margin-inline-end
padding-left           padding-inline-start
left                   inset-inline-start
right                  inset-inline-end
text-align: left       text-align: start
```

Arapça sitenin dillerinden biri — yeni bölüm eklerken Arapçaya geçip bakın.

### Responsive

**5 medya sorgusu**, hepsi `max-width`:

| Kırılma | QBLOGG | NaviarCare |
|---|---|---|
| 900px | — | grid 2 sütun → 1 sütun |
| 800px | — | booking layout stack |
| 720px | — | form tek sütun |
| 640px | — | doctor-card wrap |
| 620px | Logo sembolü, dil seçici ikonu | — |
| 360px | Tema düğmesi gizlenir | — |

Izgaralar `min()` ile korunur:

```css
grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
```

### Erişilebilirlik zorunlulukları

- Gövde metni ≥ **4,5:1** (WCAG AA)
- Dokunma hedefi ≥ **44px**
- Renk tek başına bilgi taşımaz
- `:focus-visible` → `2px solid var(--brand)`, `outline-offset: 3px`

---

## 7. Proje yapısı (Project Structure)

```
BETA-ART/
├── index.html, blog.html, work.html      QBLOGG ana sayfalar
├── post.html, gizlilik.html, kosullar.html
├── 404.html, feed.xml, sitemap.xml, robots.txt
├── assets/                               QBLOGG varlıkları
├── engine/                               Curiosity Engine (üretim hattı)
├── scripts/                              Doğrulama + üretim betikleri
├── naviar/
│   ├── care/                             NaviarCare telemedicine (8 sayfa)
│   ├── care-pilot/index.html             Oslo bakım koordinasyonu MVP
│   └── consult/index.html                NAVIAR Consult yer tutucu
├── hxi/                                  HXI Music sitesi (9 sayfa)
├── uye/                                  Üyelik platformu (Supabase)
├── brand/naviar/                         NAVIAR kimlik varlıkları
├── docs/                                 Tüm belgeler
└── vendor/inter-4.001/                   Font kaynağı (yayına çıkmaz)
```

---

## 8. NAVIAR marka varlıkları (Brand Assets)

### Nerede

```
brand/naviar/master/        12 master SVG
brand/naviar/descriptors/   7 hizmet tanımlayıcısı
brand/naviar/index.html     Kimlik kılavuzu
```

### Üretim

```bash
python3 brand/naviar/build.py
```

Tüm geometri spec'teki sayılardan hesaplanır; hiçbir path elle kopyalanmamış.

### Kullanım kuralları

| Durum | Kullanım |
|---|---|
| Açık zemin | `naviar-wordmark.svg` (navy) |
| Koyu zemin | `naviar-wordmark-white.svg` |
| Favicon/uygulama ikonu | `naviar-icon-favicon.svg` / `naviar-icon-app.svg` |
| Mono (baskı, nakış) | `naviar-monogram-mono-dark.svg` / `-mono-light.svg` |
| Yatay kompozisyon | `naviar-lockup-horizontal.svg` / `-reverse.svg` |
| Dikey kompozisyon | `naviar-lockup-stacked.svg` |

**Descriptor durumu:** `naviar-care-PENDING-APPROVAL.svg` — iş onayı
bekliyor, canlıya çıkma yok.

### Yasak

- Gradient, gölge, bevel, 3D efekt yok
- Tagline master'a gömülü değil
- Aqua (`#00D8C2`) beyaz üzerinde metin rengi olarak kullanılamaz (1,9:1)
- Diyagonal açı sapması (29,9° ölçüldü, spec 38–42°) — onay bekliyor

---

## 9. Figma'dan çeviri kontrol listesi

Figma'dan herhangi bir tasarımı bu depoya uygularken bu 10 maddeyi geçin:

1. **Renkler token'dan mı?** Ham hex varsa `var(--…)` belirtecine çevirin
2. **Aqua metin var mı?** `--brand-2-ink`'e çevirin (`#00D8C2` metinde 1,9:1)
3. **Yazı boyutları ölçeğe oturuyor mu?** Ham `rem` yazmayın
4. **İkonlar satır içi SVG mi?** 24×24 / `stroke-width="1.7"` / `currentColor`
5. **Emoji var mı?** İkona çevirin
6. **Yön bağımlı CSS var mı?** Mantıksal özelliklere çevirin
7. **Metin `data-i18n` ile mi geliyor?** (QBLOGG için zorunlu)
8. **Koyu tema çalışıyor mu?** Token kullandıysanız kendiliğinden çalışır
9. **Dokunma hedefi ≥ 44px mı?**
10. **Yeni dış servis mi bağlanıyor?** `vercel.json` CSP `connect-src`'ye ekleyin

Sonra: `npm run check` · `npm run guvenlik` · `npm run gorunurluk`

---

## 10. Bilinen sınırlar

| Sınır | Detay |
|---|---|
| Figma koltuğu | `View` — dosya oluşturulamaz, yalnızca okunur (22.08.2026 `whoami`) |
| Token akışı | Tek yön: depo → Figma. Figma değişikliği elle taşınır |
| CDN | Devre dışı — Google Fonts dahil tüm dış kaynaklar engelli |
| Bağımlılık | Sıfır kuralı — yeni bağımlılık önce `CLAUDE.md`'de tartışılır |
| Aqua metin | `#00D8C2` beyaz üzerinde 1,9:1 — WCAG AA başarısız, kullanılamaz |
| NaviarCare marka | CARE descriptor onay bekliyor |
