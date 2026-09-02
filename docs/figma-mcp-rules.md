# BETA-ART — Figma MCP Design System Rules

**Ölçüm tarihi:** 30.08.2026  
**Kapsam:** Tüm alt projeler — QBLOGG (kök), HXI-v6, beta-art  
**Amaç:** Figma tasarımlarını bu depoya çevirirken Claude'un uyması gereken kurallar ve kalıplar.

> **Figma erişim seviyesi: `View`** — dosya oluşturulamaz, yalnızca okunur.  
> Belirteçler tek yönlü akar: **bu depo kaynaktır, Figma değil.** Figma'daki bir değişiklik buraya elle taşınır.

---

## Hızlı Başvuru — Alt Proje Matrisi

| Alt proje | Dizin | Framework | Stil | Build |
|---|---|---|---|---|
| **QBLOGG** | `/` (kök) | Yok — saf HTML/JS | Tek CSS dosyası, CSS custom props | Yok |
| **HXI-v6** | `hxi-v6/` | Next.js 15 + React 19 | Tek globals.css, CSS custom props | `next build` → static export |
| **beta-art** | `beta-art/` | TanStack Start + React 19 | Tailwind CSS 4 + shadcn/ui | Vite 8 + Bun |

---

## 1. Design Token Definitions

### 1.1 QBLOGG Tokens — `assets/css/main.css`

**Kaynak dosya:** `/home/user/BETA-ART/assets/css/main.css` — lines 1–58  
**Format:** Düz CSS custom properties. Dönüştürme sistemi yok (Style Dictionary, Theo, DTCG JSON **kullanılmaz**).  
**Kural:** Ham hex yazmak yasak — her zaman `var(--token)` kullanılır.

#### Color Tokens

```css
/* ─── Light theme (default) ─── */
:root {
  --bg:           #ffffff;
  --bg-soft:      #f6f7fb;
  --bg-card:      #ffffff;
  --text:         #14161c;
  --text-muted:   #5b6172;
  --border:       #e4e7f0;
  --brand:        #082C54;   /* Midnight Navy — kimlik rengi */
  --brand-2:      #00D8C2;   /* Electric Aqua — YALNIZCA vurgu/dekorasyon */
  --brand-2-ink:  #0a7d72;   /* Beyaz üzerinde 5.0:1 — metinde kullanılacak aqua */
  --on-brand:     #ffffff;   /* Marka rengi üzerindeki metin — 13.2:1 */
  --logo-ink:     #082C54;
  --danger:       #b3261e;   /* 6.3:1 on white */
  --shadow:       0 1px 2px rgba(16,20,40,.04), 0 12px 32px rgba(16,20,40,.07);
  --shadow-lg:    0 2px 4px rgba(16,20,40,.05), 0 24px 60px rgba(16,20,40,.12);
}

/* ─── Dark theme ─── */
html[data-theme="dark"] {
  --bg:           #0c0e14;
  --bg-soft:      #12141c;
  --bg-card:      #151823;
  --text:         #eef0f6;
  --text-muted:   #9ea5b9;   /* 7.2:1 on card */
  --border:       #242838;
  --brand:        #00D8C2;   /* ⚠ Navy → Aqua swap: navy koyu zeminde ayrışmıyor */
  --brand-2:      #7ce9dd;
  --on-brand:     #08202f;   /* White on aqua is only 1.7:1 — this fixes it */
  --logo-ink:     #ffffff;
  --danger:       #f28b82;
}
```

> **⚠ Aqua Trap:** `#00D8C2` beyaz üzerinde **1.9:1** kontrast — WCAG AA altında.  
> Açık temada aqua metni **asla** kullanma. `var(--brand-2-ink)` kullan (`#0a7d72`, 5.0:1).  
> Figma'dan gelen tasarımda aqua metin varsa bu bir hatadır — dönüştür, olduğu gibi çevirme.

#### Typography Scale — 8 Steps

```css
--fs-2xs:  .76rem;   /* captions, labels */
--fs-xs:   .80rem;
--fs-sm:   .85rem;
--fs-md:   .92rem;
--fs-base: .95rem;   /* body default */
--fs-lg:   1.00rem;
--fs-xl:   1.12rem;  /* h3 */
--fs-logo: 1.16rem;  /* logo wordmark — brand-doc ratio, NOT rounded to scale */
```

Ölçek dışı izin verilenler:
- Başlık `clamp()` değerleri: `h1 { font-size: clamp(2.1rem, 5.4vw, 3.6rem) }`
- `em` cinsinden göreli boyutlar (ilk harf, `code`)
- `--fs-logo` — marka belgesinde ölçülmüş oran

**Figma'dan geliyorsa:** `14px` → `--fs-sm`, `15px` → `--fs-base`, `16px` → `--fs-lg` gibi en yakın basamağa yuvarla.

#### Spacing & Layout

```css
--radius:    16px;
--radius-sm: 10px;
--maxw:      1140px;
.wrap { padding-inline: 22px; }
.section { padding-block: clamp(56px, 8vw, 104px); }
```

---

### 1.2 HXI-v6 Tokens — `hxi-v6/app/globals.css`

**Kaynak dosya:** `/home/user/BETA-ART/hxi-v6/app/globals.css` — `:root` block  
**Not:** Always-dark design — tema geçişi yok.

```css
:root {
  /* Colors */
  --bg:        #080808;
  --surface:   #0e0e0e;
  --surface-2: #141414;
  --ink:       #f1f0eb;    /* warm off-white body text */
  --muted:     #b1b3ad;
  --acid:      #c8ff00;    /* primary accent — acid green */
  --red:       #ff2d2d;    /* danger / Norwegian red */
  --line:      #292929;    /* border / divider */

  /* Typography */
  --display: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  --sans:    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Arial, sans-serif;
  --mono:    'Courier New', ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Layout */
  --max: 1280px;
  --pad: clamp(18px, 4vw, 64px);
}
```

**Üç yazı tipi ailesi:**
- `--display` → hero başlıklar, logo mark (Impact)
- `--sans` → body, nav, paragraphs (Inter)
- `--mono` → coordinates, stats, code labels (Courier New)

---

### 1.3 beta-art Tokens

**Stack:** Tailwind CSS 4 + shadcn/ui  
**Config:** `beta-art/components.json` (shadcn registry)  
**Tailwind:** `@tailwindcss/vite` plugin, no `tailwind.config.js` — inline config  
**Tokens:** CSS variables in `src/styles.css`, shadcn/ui default theme augmented with QBLOGG brand colors

---

## 2. Component Library

### 2.1 QBLOGG — No Component Framework

**Bileşen kütüphanesi yok.** `assets/css/main.css` içinde **95 CSS sınıfı**, 6 HTML sayfasında elle kullanılıyor.

JavaScript'te bileşene en yakın yapı:

```js
// assets/js/app.js — string-returning function, not a class/component
function cardHTML(post, level) {
  return `<article class="post-card" ...>...</article>`;
}
```

**İkon kaydı** (`assets/js/app.js` → `ICONS` object, 11 icons):
```
question · coin · blocks · phone · banknote · compass · bulb · chart · envelope · link · gear
```

```js
function iconSVG(name) {
  var body = ICONS[name];
  if (!body) return '';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true" focusable="false">' + body + '</svg>';
}
```

**Sayfa iskeleti 6 dosyada tekrar eder:** `index.html`, `work.html`, `blog.html`, `post.html`, `gizlilik.html`, `kosullar.html`  
→ Nav veya footer değiştiğinde **6 dosyanın tamamını** güncelle.

### 2.2 HXI-v6 — Single File Component

**Tek bileşen:** `hxi-v6/components/SitePage.tsx`  
**Pattern:** `'use client'` (useState for Spotify player gate), props = `{ locale: Locale }`  
**Yardımcı bileşenler:** Sadece `<Ext>` (external link wrapper), rest is inline JSX

```tsx
// Component signature
export function SitePage({ locale }: { locale: Locale }) {
  const d = localeData[locale];
  const [playerLoaded, setPlayerLoaded] = useState(false);
  // ...
}

// External link wrapper
function Ext({ href, children, className }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}
```

**Route structure:** `app/[locale]/page.tsx` → renders `<SitePage locale={locale} />`

### 2.3 beta-art — shadcn/ui

**40+ pre-installed shadcn components:**
```
accordion, alert, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card,
carousel, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu,
form, hover-card, input, label, menubar, navigation-menu, popover, progress,
radio-group, resizable, scroll-area, select, separator, sheet, skeleton, slider,
sonner, switch, table, tabs, textarea, toast, toggle, toggle-group, tooltip
```

**Import pattern:**
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
```

---

## 3. Frameworks & Libraries

### 3.1 QBLOGG

| Kategori | Değer |
|---|---|
| UI framework | **Yok** |
| CSS library | **Yok** |
| Bundler | **Yok** |
| Runtime | Browser native |
| Dev server | `python3 -m http.server 8000` |
| Dependencies | **Sıfır** |

**Script load order (değiştirme):**
```html
<script src="assets/js/config.js"></script>   <!-- site config / env -->
<script src="assets/js/i18n.js"></script>     <!-- 10 langs × 209 keys -->
<script src="assets/js/posts.js"></script>    <!-- blog content -->
<script src="assets/js/app.js"></script>      <!-- everything uses the above -->
```

Global namespace: `window.QB_CONFIG`, `window.QB_I18N`, `window.QB_POSTS`, `window.QB_LANGS`

### 3.2 HXI-v6

```json
{
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5"
  }
}
```

**Next.js config:**
```ts
// hxi-v6/next.config.ts
const nextConfig: NextConfig = {
  output: 'export',        // static HTML export, no server
  images: { unoptimized: true },
  trailingSlash: true,     // /en/ not /en
};
```

**TypeScript path alias:**
```json
{ "paths": { "@/*": ["./*"] } }   // root-level, NOT ./src/
```

### 3.3 beta-art

| Kategori | Değer |
|---|---|
| Runtime | Bun |
| UI framework | TanStack Start 1.168 + React 19 |
| Router | TanStack Router 1.170 |
| CSS | Tailwind CSS 4 + `@tailwindcss/vite` |
| Components | shadcn/ui + Radix UI |
| Backend | Supabase (auth + PostgreSQL) |
| Charts | Recharts |
| Forms | react-hook-form + Zod |
| Build | Vite 8 |
| Icons | Lucide React |

---

## 4. Asset Management

### 4.1 QBLOGG Assets

```
assets/
  brand/      116 KB — 14 identity SVGs + 3 PNGs — betikten üretilir, elle düzenlenmez
  css/         36 KB — main.css (tek dosya)
  fonts/      204 KB — Inter subsets (latin, latin-ext, cyrillic, cyrillic-ext) + OFL.txt
  js/         460 KB — 4 files
  downloads/   12 KB — lead magnet
```

**CDN yok, olmayacak.** Fontlar GDPR nedeniyle self-hosted:
- Google Fonts CDN ziyaretçinin IP adresini Google'a gönderir
- Referans: Münih Bölge Mahkemesi 3 O 17493/20
- Figma Google Fonts bağlantısı öneriyorsa: fontu indir, `unicode-range` ile alt küme yap

**Font optimizasyonu:**
```css
/* unicode-range subsetting — visitor downloads only needed bytes */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, ...;  /* latin */
}
```

**Marka varlıkları üretmek:**
```bash
python3 scripts/marka-uret.py
# Üretir: 11 SVG + 3 PNG (favicon-32, apple-touch-icon, og-image)
# Gerekli: pip install fonttools brotli
```

### 4.2 HXI-v6 Assets

```
hxi-v6/public/assets/
  hero.png      ~1.9 MB — cinematic hero photograph
  og-hxi.jpg      49 KB — Open Graph image
  mark.webp       27 KB — HXI mark/logo
  favicon.svg          — SVG favicon
```

Images referenced in CSS: `background-image: url('/assets/hero.png')` (absolute public path)

### 4.3 beta-art Assets

```
beta-art/public/
  apple-touch-icon.png
  favicon-32.png
  og-image.png
  qblogg-*.svg (8 variants — mirrors assets/brand/)
```

---

## 5. Icon System

### QBLOGG Icon Rules (BAĞLAYICI)

**Emoji kullanılmaz.** Her ikon satır içi SVG.

**Çizim kuralı:**
```
24×24 viewport · fill="none" · stroke="currentColor" · stroke-width="1.7"
stroke-linecap="round" · stroke-linejoin="round"
```

`currentColor` zorunlu: ikon bulunduğu metnin rengini alır, tema değişiminde otomatik döner.

**Kayıtlı yazı ikonları** (`assets/js/app.js` → `ICONS`):
```
question, coin, blocks, phone, banknote, compass, bulb, chart, envelope, link, gear
```

**Sayfa ikonları:** Doğrudan HTML'e gömülür, kayıtta durmaz.

**İstisna (SVG değil):** `→ ↑ ☾ ☀` — tek renkli metin işaretleri, yazı tipiyle çizilir.

**Figma'dan geliyorsa:**
- Sabit renk varsa → `currentColor`'a çevir
- Farklı boyut varsa → 24×24'e yeniden çiz
- Emoji varsa → SVG ikonla değiştir

### HXI-v6 Icon Rules

Satır içi SVG, aynı çizim kuralı. `currentColor` ile `--acid` veya `--ink` alır.

### beta-art Icon Rules

Lucide React: `import { Music, ExternalLink } from 'lucide-react'`  
Tailwind ile boyutlandırma: `className="w-4 h-4"` veya `className="w-5 h-5"`

---

## 6. Styling Approach

### 6.1 QBLOGG

**Metodoloji:** Yok — düz CSS, tek dosya, semantik kısa sınıf adları.

**Dosya yapısı** (`assets/css/main.css`, ~36 KB):
```
1. :root tokens
2. html[data-theme="dark"] tokens
3. Reset
4. Typography (h1–h3, p)
5. Layout utilities (.wrap, .section, .center, .muted, .sr-only, .skip)
6. Header / Nav
7. Sections (hero, services, flow, packages, posts, email, footer...)
8. Components (cards, buttons, forms, modals...)
9. Media queries (5× max-width)
```

**Responsive breakpoints:**
```css
@media (max-width: 900px) { ... }
@media (max-width: 680px) { ... }
@media (max-width: 620px) { ... }  /* lang picker collapses to icon */
@media (max-width: 460px) { ... }
@media (max-width: 360px) { ... }  /* theme button hidden */
```

**Grid pattern:**
```css
/* ✅ Doğru — yatay taşmayı önler */
grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));

/* ❌ Yanlış — dar ekranda taşar */
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
```

**RTL — Mutlak Kural:**
```css
/* ❌ Yazmayın */   margin-left, padding-right, left, right, text-align: left

/* ✅ Yazın */      margin-inline-start, padding-inline-end, inset-inline-start,
                   inset-inline-end, text-align: start
```

**Erişilebilirlik minimumları:**
- Gövde metin: 4.5:1 (WCAG AA)
- Dokunma hedefi: 44px minimum
- `:focus-visible` → `outline: 2px solid var(--brand); outline-offset: 3px; border-radius: 4px`

### 6.2 HXI-v6

**Metodoloji:** Tek globals.css, always-dark, 663 satır.

**Key CSS classes:**
```css
.topline      /* 3px acid-red-acid gradient top bar */
.nav          /* sticky header */
.brand        /* logo mark */
.hero         /* full-viewport hero */
.marquee      /* scrolling ticker */
.section      /* generic section wrapper */
.proof-card   /* credit card (F&F, Bodycam etc.) */
.nordic       /* UTGAVE 01 block */
.work-card    /* collab/remix/press cards */
.frequency    /* gated join section */
.footer       /* site footer */
```

**Responsive breakpoints (3):**
```css
@media (max-width: 1100px) { ... }
@media (max-width: 900px)  { ... }
@media (max-width: 560px)  { ... }
```

**Animation:**
```css
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
```

### 6.3 beta-art

**Tailwind CSS 4** — utility-first, no config file, plugin-based:
```tsx
// Tailwind utility classes
<div className="flex items-center gap-4 p-6 rounded-xl border border-border bg-card">
  <span className="text-sm font-medium text-muted-foreground">...</span>
</div>
```

**shadcn/ui theming** — CSS variables in `src/styles.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... HSL format for Tailwind compatibility */
}
```

---

## 7. Project Structure

### 7.1 QBLOGG (root)

```
/
├── index.html          Tanıtım (hero, hizmetler, içerik akışı, paketler, yazılar, bülten)
├── work.html           Brief formu + yazar başvurusu
├── blog.html           Yazı listesi (arama + filtre)
├── post.html           Yazı detayı (?slug=...)
├── gizlilik.html       Gizlilik metni (TR+EN)
├── kosullar.html       Kullanım koşulları (TR+EN)
├── sitemap.xml
├── robots.txt
├── 404.html
├── assets/
│   ├── css/main.css        ← tek stil dosyası
│   ├── js/
│   │   ├── config.js       ← tek dokunulacak dosya (e-posta, alan adı, fiyatlar)
│   │   ├── i18n.js         ← 10 dil × 209 anahtar
│   │   ├── posts.js        ← blog içeriği
│   │   └── app.js          ← runtime
│   ├── brand/              ← 14 kimlik varlığı (betikten üretilir)
│   └── fonts/              ← Inter subsets + lisans
├── scripts/            Doğrulama ve üretim betikleri
├── engine/             Curiosity Engine (üretim hattı)
└── docs/               Marka, gelir, içerik belgeleri
```

**10 dil:** `tr en zh hi es ar fr pt ru no`  
**Yönlendirme:** Tek sayfada `?lang=ar` → JS ile RTL geçişi  
**Yayın:** Vercel qblogg.vercel.app, `main` → buildCommand

### 7.2 HXI-v6

```
hxi-v6/
├── app/
│   ├── globals.css         ← tek stil dosyası
│   ├── layout.tsx          ← root passthrough (returns children as ReactElement)
│   ├── sitemap.ts          ← static sitemap (force-static)
│   └── [locale]/
│       ├── layout.tsx      ← html+body wrapper, locale guard
│       ├── page.tsx        ← renders <SitePage locale={locale} />
│       └── privacy/
│           └── page.tsx
├── components/
│   └── SitePage.tsx        ← single monolithic client component ('use client')
├── content/
│   └── locales.ts          ← 10 locales × all content (1,214 lines)
├── public/
│   └── assets/             ← hero.png, og-hxi.jpg, mark.webp, favicon.svg
├── next.config.ts          ← output: 'export', trailingSlash: true
├── tsconfig.json           ← paths: { "@/*": ["./*"] }  ← root-level alias
└── package.json
```

**10 dil:** `en no tr fr de es pt ar ja zh`  
**Yönlendirme:** `/[locale]/` URL prefix, static params  
**Çıktı:** 25 static pages (10 home + 10 privacy + sitemap.xml)

### 7.3 beta-art

```
beta-art/
├── src/
│   ├── routes/             TanStack Router file-based routes
│   ├── components/         Shared React components
│   │   └── ui/             shadcn/ui components (40+)
│   ├── hooks/              Custom React hooks
│   ├── lib/                Utilities (utils.ts, supabase client)
│   ├── integrations/       Supabase type-safe client
│   ├── data/               Static data / fixtures
│   ├── styles.css          Tailwind + shadcn CSS variables
│   ├── routeTree.gen.ts    Auto-generated by TanStack Router
│   ├── router.tsx
│   └── main.tsx
├── supabase/               Migrations + types
├── public/                 Static assets (SVG logos, favicon)
├── components.json         shadcn/ui registry config
├── vite.config.ts
└── bunfig.toml
```

---

## 8. Figma → Codebase Translation Checklist

Her Figma çevirisinde bu kontrol listesini sırayla uygula:

### Renk

- [ ] Figma'daki renk değerleri token'a dönüştürüldü mü? Ham hex bırakmayın
- [ ] Aqua (`#00D8C2`) metinde kullanılıyor mu? → `var(--brand-2-ink)` yapın
- [ ] Koyu tema çalışıyor mu? Token kullandıysanız evet

### Tipografi

- [ ] Yazı boyutları QBLOGG'un 8 basamaklı ölçeğine oturdu mu?
- [ ] Ham `rem` değerleri token'a dönüştürüldü mü?
- [ ] HXI için: 3 yazı tipi ailesi doğru kullanıldı mı? (Impact display, Inter sans, Courier mono)

### İkonlar

- [ ] Figma'dan gelen ikonlar satır içi SVG'e çevrildi mi?
- [ ] 24×24 / `fill="none"` / `stroke="currentColor"` / `stroke-width="1.7"` / yuvarlak uçlar?
- [ ] Sabit renk varsa `currentColor`'a çevrildi mi?
- [ ] Emoji varsa SVG ile değiştirildi mi?

### Layout & Spacing

- [ ] QBLOGG için: yön bağımlı CSS yerine mantıksal özellikler kullanıldı mı?
- [ ] Dokunma hedefleri 44px mi?
- [ ] Grid `minmax(min(X, 100%), 1fr)` kalıbı kullanıldı mı?

### İçerik (QBLOGG)

- [ ] Görünen her metin `data-i18n` ile mi bağlandı?
- [ ] Tüm 10 dile anahtar eklendi mi?
- [ ] Arapçaya geçilip RTL kontrol edildi mi?

### Yeni Bölüm / Sayfa (QBLOGG)

- [ ] 6 HTML sayfasının tamamında menü/footer güncellendi mi?
- [ ] Yeni dış servis bağlandıysa `vercel.json` CSP `connect-src`'ye eklendi mi?

### Doğrulama

```bash
# QBLOGG
npm run check       # i18n, post, id, link, sitemap
npm run guvenlik    # XSS, CSP, GDPR, mixed content
npm run gorunurluk  # visibility rules for posts

# HXI-v6
cd hxi-v6 && npm run build   # TypeScript + static export
```

---

## 9. Figma MCP Tool Usage Notes

### Okuma (View erişimi)

```
mcp__Figma__get_design_context   — frame/component token değerlerini al
mcp__Figma__get_screenshot       — görsel referans
mcp__Figma__get_metadata         — dosya/page listesi
mcp__Figma__get_variable_defs    — Figma variable definitions (token comparison)
mcp__Figma__search_design_system — component/style arama
```

### Yazma (Yok — View koltuğu)

Figma'ya yazma işlemi mümkün değil. `use_figma`, `create_new_file`, `upload_assets` araçları bu hesap için çalışmaz.

### Tek Yönlü Akış

```
Bu depo (CSS custom props) ──→ Figma
                    ↑
              elle taşınır
                    ↑
     Figma tasarım değişikliği
```

---

## 10. Known Constraints

| Kısıt | Açıklama |
|---|---|
| Figma erişimi | `View` only — oluşturma/güncelleme mümkün değil |
| QBLOGG'ta framework yok | JSX bileşeni değil, HTML + CSS sınıfı |
| Google Fonts yasak | GDPR — fontları self-host et |
| Aqua metin yasak | `#00D8C2` açık temada 1.9:1 kontrast |
| Ham hex yasak | Her zaman `var(--token)` |
| Emoji yasak (QBLOGG) | Satır içi SVG kullan |
| Script sırası değişmez (QBLOGG) | config → i18n → posts → app |
| `.env` asla commit edilmez | `.env.example` ile placeholder |
