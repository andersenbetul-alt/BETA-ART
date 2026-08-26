# QBLOGG — Figma MCP entegrasyon kuralları

Bu dosya, Figma tasarımlarını bu kod tabanına aktarırken (design-to-code) uyulacak
kuralları özetler. **Derleme adımı, çatı (framework) ve paket yöneticisi bağımlılığı
yok** — site saf HTML + CSS + vanilla JS'tir ve herhangi bir statik sunucuya olduğu
gibi yüklenir. Figma'dan gelen her üretim bu kısıtla uyumlu olmalı: yeni bir npm
paketi, bundler adımı veya React/Vue benzeri bir çatı **eklenmez**.

## 1. Token tanımları

Tüm tasarım belirteçleri **tek dosyada**, CSS custom property olarak:
`assets/css/main.css`, `:root` bloğu (satır ~5–39) + `:root[data-theme='dark']` /
`prefers-color-scheme: dark` blokları (satır ~44–61) ile koyu tema override'ı.

Format: düz CSS değişkeni, JSON/YAML token dosyası veya derleme aracı (Style
Dictionary vb.) **yok**. Figma değişkenlerini bu değişkenlere birebir eşleyin —
yeni bir token sistemi kurmayın.

**Renk:**
```css
--bg: #ffffff;            --text: #14161c;         --text-muted: #5b6172;
--border: #e4e7f0;
--brand: #082C54;         /* Midnight Navy — kimlik rengi */
--brand-2: #00D8C2;       /* Electric Aqua — YALNIZCA vurgu, metinde kullanılamaz (beyazda 1.8:1) */
--brand-2-ink: #0a7d72;   /* açık zeminde metin için aqua yerine bu (5.0:1) */
--on-brand: #ffffff;      /* marka rengi üzerindeki metin, 13.2:1 */
--danger: #b3261e;
--shadow: 0 1px 2px rgba(16,20,40,.04), 0 12px 32px rgba(16,20,40,.07);
```
Koyu temada aynı isimler farklı değerlerle geri tanımlanır (`--brand` koyu modda
`#00D8C2` olur, `--logo-ink` temaya göre döner). **Doğrudan hex yazılmaz** — her
zaman `var(--...)` kullanılır ki koyu tema kendiliğinden çalışsın.

**Tipografi (basamaklı ölçek, ham `rem` yok):**
```css
--fs-2xs: .76rem; --fs-xs: .8rem; --fs-sm: .85rem; --fs-md: .92rem;
--fs-base: .95rem; --fs-lg: 1rem; --fs-xl: 1.12rem; --fs-logo: 1.16rem;
--font: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, ...;
```
Başlıkların `clamp()` değerleri ve `em` göreli boyutlar (ilk harf, `code`) bu
ölçeğin dışındadır — Figma'da serbest boyutlu başlık görürseniz `clamp()` ile
karşılayın, yeni bir sabit `rem` eklemeyin.

**Diğer belirteçler:** `--radius: 16px`, `--radius-sm: 10px`, `--maxw: 1140px`
(içerik genişliği üst sınırı). **Ayrık bir aralık (spacing) ölçeği yok** — boşluklar
bileşen kurallarında doğrudan `px`/`clamp()` olarak yazılır (örn. `.nav { gap: 14px }`,
`.section { padding-block: clamp(56px, 8vw, 104px) }`). Figma'daki 4/8px grid
değerlerini olduğu gibi taşıyın, yeni bir `--space-*` değişken sistemi icat etmeyin.

## 2. Bileşen kütüphanesi

Ayrı bir bileşen dizini veya Storybook **yok**. Bileşenler `assets/css/main.css`
içinde düz sınıf seçicileriyle tanımlı, altı sayfada (`index.html`, `work.html`,
`blog.html`, `post.html`, `gizlilik.html`, `kosullar.html`) tekrar kullanılıyor.
Örnek desenler:

```css
.btn { ... }
.btn--primary { background: var(--brand); color: var(--on-brand); }
.btn--ghost   { background: transparent; color: var(--text); border-color: var(--border); }
.btn--lg      { padding: 14px 26px; font-size: var(--fs-lg); }
.btn--block   { width: 100%; }

.wrap    { width: 100%; max-width: var(--maxw); margin-inline: auto; padding-inline: 22px; }
.section { padding-block: clamp(56px, 8vw, 104px); }
.section--soft { background: var(--bg-soft); }
```
Yeni bir bileşen çevirirken: BEM benzeri `.blok`, `.blok--varyant` adlandırmasını
koruyun; sınıfı `main.css`'e ekleyin, ayrı bir CSS dosyası veya CSS-in-JS **açmayın**
(tek stil dosyası kuralı).

## 3. Çatı ve kütüphaneler

- **UI çatısı yok** — vanilla JS, IIFE modülü (`(function(){ 'use strict'; ... })()`).
- **Stil:** düz CSS, önişlemci yok (Sass/PostCSS yok), tek dosya `assets/css/main.css`.
- **Build/bundler yok.** Dosyalar tarayıcıya olduğu gibi servis edilir
  (`npm run dev` = `python3 -m http.server 8000`).
- Tek runtime bağımlılığı: `assets/js/vendor` altında **vendor'lanmış** kütüphaneler
  (CDN yok — `uye/lib/`'de örneği var, güvenlik denetimi CDN referansını yakalıyor).
  Figma'dan bir etkileşim kütüphanesi gerekiyorsa aynı şekilde vendor'lanmalı.

## 4. Varlık (asset) yönetimi

- **Marka varlıkları:** `assets/brand/` — SVG logo/sembol/kilit varyantları + 3 PNG
  (favicon-32, apple-touch-icon, og-image). Hepsi `scripts/marka-uret.py` betiğinden
  **üretilir**, elle çizilmez/eklenmez (bkz. CLAUDE.md madde 7 — yeniden üretilebilirlik
  kapısı). Figma'dan yeni bir logo/marka varlığı gelirse önce bu betiğe entegre etme
  yolu değerlendirilir, doğrudan dosya eklenmez.
- **Yazı tipi:** `assets/fonts/` — Inter, woff2 olarak vendor'lanmış (`inter-latin.woff2`
  vb.), `inter.css` ile `@font-face` tanımlı; kaynak/lisans kaydı `KAYNAK.md` + `OFL.txt`.
  Dış font servisi (Google Fonts CDN vb.) **kullanılmaz**.
- **CDN yok, harici görsel istek yok** — her varlık depoya gömülü. Güvenlik denetimi
  (`npm run guvenlik`) karışık içerik ve dış kaynak taramasını buna göre yapıyor.
- Blog kapak görselleri **yok** — kapaklar `ACCENTS` renk rampası + inline SVG ikonla
  üretiliyor (aşağıya bakın), raster görsel varlık gerekmiyor.

## 5. İkon sistemi

**Emoji kullanılmaz — her ikon satır içi SVG'dir** (CLAUDE.md madde 4, sıkı kural).
Kayıt `assets/js/app.js` içinde `ICONS` nesnesi (satır ~21):

```js
var ICONS = {
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.2 9.4a2.9 2.9 0 0 1 5.6 1c0 2-2.8 2.4-2.8 4"/>...',
  coin: '...', blocks: '...', linkedin: '...', x: '...', facebook: '...', whatsapp: '...', ...
};
function iconSVG(name) {
  var body = ICONS[name];
  if (!body) return '';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + '</svg>';
}
```
Kural: **24×24 ızgara, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`,
yuvarlak uç ve birleşim (`stroke-linecap/linejoin="round"`)**. Figma'dan yeni bir
ikon çevirirken bu dört özelliği birebir koruyun, `path`/`circle` verilerini
`ICONS` nesnesine adla ekleyin (örn. `icon: 'coin'`), sayfa ikonlarını (menü,
tema düğmesi gibi tek seferlik olanlar) doğrudan HTML'e gömün. **İstisna:** ok ve
tema düğmesindeki tek renkli metin işaretleri (`→ ↑ ☾ ☀`) yazı tipiyle çizilir,
SVG kuralının dışındadır — Figma'da emoji/karakter olarak görürseniz bunlar da
metin karakteri olarak kalabilir.

## 6. Stil yaklaşımı

- **Metodoloji:** düz CSS, tek dosya (`assets/css/main.css`, 629 satır), CSS Modülü/
  Styled Components/Tailwind **yok**.
- **Global stiller:** `:root` token'ları + `*`/`body` sıfırlama en üstte, sayfaya
  özel stil ekstra sınıf olarak aynı dosyaya eklenir (ayrı sayfa CSS'i yok).
- **Yön bağımlılığı (RTL) zorunlu mantıksal özellik kullanır:** `margin-left` değil
  `margin-inline-start`, `left` değil `inset-inline-start`. Arapça (`ar`, `dir: rtl`)
  desteği bu yüzden ek kod gerektirmeden çalışıyor — Figma'dan gelen her yeni
  bölümde yön bağımlı bir CSS özelliği (`left/right`, `margin-left/right`) varsa
  mantıksal karşılığına çevirin.
- **Duyarlı tasarım:** `@media (max-width: ...)` kırılım noktaları — `1180px`
  (`.nav-links` daralması), `860px`, `620px` (mobil düzen), `360px` (çok dar ekran).
  Ayrıca `clamp()` ile akışkan tipografi/boşluk (`font-size: clamp(...)`,
  `padding-block: clamp(56px, 8vw, 104px)`) — sabit breakpoint yerine önce `clamp()`
  denenir. `@media (prefers-reduced-motion: reduce)` ve `@media print` de tanımlı.
- **Koyu tema:** ayrı bir stylesheet değil, aynı token'ların `:root[data-theme='dark']`
  altında yeniden tanımlanmasıyla çalışır — bileşen CSS'i tema'dan bağımsız kalır.

## 7. Metin ve i18n — HTML'de sabit metin YOK

Görünen her metin `data-i18n` (veya `data-i18n-attr`, `data-i18n-title`,
`data-i18n-content`) ile `assets/js/i18n.js`'teki `QB_I18N` sözlüğünden gelir:

```html
<a href="index.html" data-i18n="nav.home">Ana Sayfa</a>
<button data-i18n-attr="aria-label:ui.lang">...</button>
<title data-i18n-title="meta.title">QBLOGG — AI destekli içerik stüdyosu</title>
```
HTML'deki Türkçe metin yalnızca JS kapalıyken görünen **yedektir**, kaynak değil.
**Figma'dan metin çevirirken:** yeni bir metin anahtarı **on dile birden** eklenir
(`tr, en, zh, hi, es, ar, fr, pt, ru, no` — `QB_LANGS` dizisi, `i18n.js` başı).
Eksik anahtar sessizce İngilizceye düşer; bu bir güvenlik ağıdır, tasarım kararı
değildir — commit öncesi `npm run check` eksik anahtarı yakalar.

## 8. Proje yapısı

```
index.html, work.html, blog.html, post.html, gizlilik.html, kosullar.html, kalite.html, ornek.html, 404.html
  → sayfa iskeleti (header/nav/footer) ALTI ana sayfada (index/work/blog/post/gizlilik/kosullar) BİREBİR tekrar eder.
    Figma'da menü/footer değişikliği varsa altısını da güncelleyin — check.mjs
    yalnızca çiftlenen id/script'i yakalar, eksik menü linkini YAKALAMAZ.
assets/css/main.css     → tek stil dosyası, tüm token + bileşen tanımı
assets/js/app.js        → dil/tema/liste/form mantığı + ICONS kaydı
assets/js/i18n.js       → QB_LANGS + QB_I18N (10 dil sözlüğü)
assets/js/posts.js      → blog içerik verisi (kod değil, veri — Figma'yla ilgisiz)
assets/js/config.js     → e-posta, fiyat, sosyal hesap ayarları (statik veri)
assets/brand/           → üretilmiş kimlik varlıkları (elle eklenmez)
assets/fonts/           → vendor'lanmış Inter woff2 + lisans kaydı
uye/                     → ayrı bir alt-uygulama (üye paneli), kendi vercel.json'u var
```
Sayfa/özellik organizasyonu **feature-based değil, dosya-tipi bazlı düz yapı**:
tek CSS, tek JS mantık dosyası, sayfa başına bir HTML. Figma'dan gelen çok bileşenli
bir tasarım için ayrı bileşen dosyaları/klasörleri **açmayın** — mevcut düz yapıya
sınıf olarak ekleyin.

## Figma → kod aktarırken kontrol listesi

1. Renk/tipografi: `var(--...)` kullan, hex/ham `rem` yazma.
2. İkon: emoji değil, `ICONS` kaydına 24×24 SVG path ekle.
3. Metin: `data-i18n` + 10 dilin hepsine anahtar ekle (en azından `tr`/`en` tam,
   diğer 8 dil kısa özet katmanı — CLAUDE.md'deki iki katmanlı model).
4. Yön: `margin-inline-start` gibi mantıksal özellik, `left/right` değil.
5. Sayfa iskeleti değişikliği → 6 sayfada birden uygula.
6. Yeni bağımlılık/CDN/bundler **eklemeden önce** gerçekten gerekli mi diye sor —
   varsayılan cevap hayır.
7. Bitirince `npm run check` (zorunlu) + `npm run guvenlik` çalıştır.
