# QBLOGG — Figma MCP entegrasyonu için tasarım sistemi kuralları

Bu belge, Figma MCP ile üretilen tasarımları bu depoya aktarırken uyulacak
kuralları toplar. **CLAUDE.md her zaman üstündür** — bu belge onun tasarım
sistemi kısmına dair daha ayrıntılı, dosya yollu bir referanstır. Çelişki
varsa CLAUDE.md kazanır.

Tek cümlelik özet: **derleme adımı yok, çatı (framework) yok, bağımlılık
yok.** Figma'dan gelen her tasarım saf HTML + CSS değişkenleri + satır içi
SVG'ye çevrilecek. React bileşeni, CSS-in-JS, Tailwind sınıfı ya da npm
paketi üretmeyin — hiçbiri bu projede çalışmaz.

## 1. Token tanımları

Tüm tasarım belirteçleri **tek dosyada**, düz CSS custom property olarak
tanımlı: `assets/css/main.css:4-38` (açık tema `:root`), koyu tema
karşılıkları `assets/css/main.css:41-58` (`html[data-theme="dark"]`).

Format: JSON/YAML token dosyası veya bir dönüştürme sistemi (Style
Dictionary vb.) **yok**. Belirteçler doğrudan CSS değişkeni:

```css
:root {
  --bg: #ffffff;
  --text: #14161c;
  --brand: #082C54;        /* Midnight Navy — kimlik rengi */
  --brand-2: #00D8C2;      /* Electric Aqua — yalnızca vurgu, metinde YASAK */
  --brand-2-ink: #0a7d72;  /* Aqua'nın metin-güvenli koyu tonu, beyazda 5,0:1 */
  --on-brand: #ffffff;     /* marka rengi zemin üstü metin, 13,2:1 */
  --fs-2xs: .76rem; --fs-xs: .8rem; --fs-sm: .85rem; --fs-md: .92rem;
  --fs-base: .95rem; --fs-lg: 1rem; --fs-xl: 1.12rem; --fs-logo: 1.16rem;
  --radius: 16px; --radius-sm: 10px; --maxw: 1140px;
  --font: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, 'Noto Sans', 'Noto Sans Arabic',
          'Noto Sans Devanagari', 'Noto Sans SC', sans-serif;
}
html[data-theme="dark"] {
  --brand: #00D8C2;   /* koyu temada roller yer değiştirir, marka rengi açılır */
  --on-brand: #08202f;
  --brand-2-ink: var(--brand-2);
  /* ... aynı değişken adları, farklı değerler */
}
```

**Kesin kurallar (CLAUDE.md madde 5):**
- Ham hex kodu asla component/sayfa kodunda yazmayın; her zaman
  `var(--...)`. Bu, koyu temanın otomatik çalışmasının tek nedeni.
- `--brand-2` (Aqua) beyaz üzerinde 1,8:1 kontrast verir — **metinde
  kullanılamaz**. Açık zeminde metin/ikon için `var(--brand-2-ink)`
  kullanın (5,0:1).
- Yazı boyutu da bir belirteç ölçeğidir: ham `rem`/`px` yazmayın,
  `--fs-2xs`…`--fs-xl` basamaklarından seçin. İstisna: başlıkların
  `clamp()` değerleri ve `em` ile tanımlı göreli boyutlar (ilk harf, `code`).
- Yeni bir renk/boyut belirteci gerekiyorsa **her iki temaya da** eklenir
  (açık `:root` + `html[data-theme="dark"]`), tek başına eklenmez.

Boşluk (spacing) için ayrı bir token seti **yok** — bileşenler doğrudan
`px`/`%`/`fr` ile aralık tanımlar (bkz. `.grid { gap: 18px }`,
`.card { padding: 26px 24px }`). Figma'dan spacing token'ı gelirse, en
yakın bileşendeki mevcut değere yuvarlayın; yeni bir spacing-scale
değişkeni icat etmeyin (sadelik ilkesi).

## 2. Bileşen kütüphanesi

Bileşen dosyası/paketi, Storybook, veya ayrı bir `components/` dizini
**yok**. "Bileşenler" `assets/css/main.css` içinde sınıf tabanlı olarak
tanımlı ve HTML'de doğrudan yazılıyor — React/Vue gibi kapsülleme yok.

Tekrar kullanılan sınıflar (Figma karşılığı: bileşen/varyant):

| Sınıf | Ne | Konum |
|---|---|---|
| `.card`, `.card-icon` | İkonlu bilgi kartı | `main.css:234-247` |
| `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--lg`, `.btn--block` | Düğme + varyantlar | `main.css:172-184` |
| `.badge` | Küçük etiket/rozet (nokta + metin) | `main.css:197-203` |
| `.kicker` | Bölüm üstü küçük başlık (eyebrow) | `main.css:220-223` |
| `.section-head` | Bölüm başlık bloğu (kicker+h2+p, ortalı) | `main.css:224-228` |
| `.grid`, `.grid--2`, `.grid--3` | Otomatik yerleşen ızgara | `main.css:229-232` |
| `.flow-list`, `.flow-item`, `.flow-source` | Numaralı adım/akış listesi | `main.css:249-265` |
| `.plans`, `.plan`, `.plan--featured` | Fiyat/paket kartları | `main.css:279-` |
| `.cta-box` | Marka renkli çağrı kutusu | `main.css:387-393` |

**Yeni bir bölüm tasarlarken önce bu sınıfların karşılayıp
karşılamadığına bakın** — karşılıyorsa yeni CSS yazmayın, sadece HTML
yapısını kurup mevcut sınıfları uygulayın (bkz. örnek: `index.html`
içindeki `#kobi` bölümü, hiç yeni CSS eklemeden bu sınıflarla kuruldu).

"Belge" olarak `docs/tasarim-sistemi.md` (belirteçler, ikon kuralı, RTL,
dış tasarım çeviri listesi) var; Storybook/Figma kütüphanesi yok — bu
belge onun yerini tutar.

## 3. Çatı ve kitaplıklar

- **UI çatısı: yok.** Saf HTML5 + vanilla JavaScript (ES5/ES6 karışık,
  `assets/js/app.js`). React, Vue, Svelte, JSX **kullanılmaz**.
- **Stil kitaplığı: yok.** Tailwind, styled-components, CSS-in-JS yok —
  tek elle yazılmış `assets/css/main.css` (629 satır), CSS custom
  property + mantıksal (logical) özellikler (`margin-inline-start` vb.).
- **Derleme/paketleyici: yok.** Site olduğu gibi statik sunucuya
  yüklenir (`npm run dev` → `python3 -m http.server`). `package.json`
  yalnızca **denetim betikleri** için var (`npm run check`, `guvenlik`,
  `gorunurluk`, `onizleme`, `rss`) — build script'i yok.
- Tek istisna: `uye/` alt uygulaması `supabase-js` kullanıyor ama o da
  CDN'den değil **vendor'lanmış** (`uye/lib/`) — dış paket eklerken bu
  düzen izlenir, `npm install` ile bağımlılık büyütülmez.

**Figma MCP'den React/Tailwind kodu gelirse**: JSX'i düz HTML'e,
Tailwind sınıflarını yukarıdaki mevcut sınıflara veya (karşılığı yoksa)
`var(--...)` kullanan yeni bir CSS kuralına çevirin. Otomatik
"kod-olduğu-gibi-yapıştır" bu projede çalışmaz.

## 4. Varlık (asset) yönetimi

```
assets/
  brand/     kimlik varlıkları — SVG semboller/lockup'lar + 3 PNG (favicon-32,
             apple-touch-icon, og-image), hepsi scripts/marka-uret.py'den üretilir
  fonts/     Inter değişken fontu, kendi sunucumuzda (bkz. §5)
  css/       main.css (tek dosya)
  js/        config.js, i18n.js, posts.js, app.js
  downloads/ lead magnet PDF/HTML
```

- Görseller **CDN'den servis edilmiyor** — hepsi depo içinde, göreli
  yolla (`assets/brand/...`). Vercel dağıtımı statik dosya kopyalar,
  ayrı bir görsel optimizasyon/CDN katmanı yok.
- Marka varlıkları **elle çizilmez / Figma'dan elle export edilmez** —
  `python3 scripts/marka-uret.py` betiğinden üretilir (CLAUDE.md madde
  7a, "yeniden üretilebilirlik" kuralı: betik boş bir klasörde aynı
  bayt'ları üretmeli). Figma'da yeni bir logo/ikon varyantı
  tasarlandıysa, önce betiğe yansıtılır, sonra betik çalıştırılıp
  dosyalar üretilir — PNG/SVG'yi doğrudan Figma'dan sürükleyip
  `assets/brand/`e atmayın.
- Blog/sayfa içeriği görselleri şu an **yok** — kapak görselleri CSS
  gradyanı (`accent` 1–6 rampası) ile üretiliyor, dış görsel dosyası
  yüklenmiyor. Figma'dan foto/illüstrasyon gelirse önce bu deponun
  "emoji/dış görsel yok, betikle üret" kültürüne uyup uymadığını
  kullanıcıya sorun.

## 5. İkon sistemi

**Emoji kesinlikle kullanılmaz** (CLAUDE.md madde 4) — her görünen ikon
satır içi SVG, tek tip çizim kuralıyla:

```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
     aria-hidden="true" focusable="false">
  <!-- path/circle/rect burada -->
</svg>
```

İki depo yeri var:

1. **Yazı/kart ikonları** — ad ile `assets/js/app.js:21-38` içindeki
   `ICONS` kaydında durur, `iconSVG(name)` ile render edilir:
   ```js
   var ICONS = {
     coin: '<circle cx="9.3" cy="9.3" r="5.6"/><circle cx="14.7" cy="14.7" r="5.6"/>',
     bulb: '<path d="M9.3 17.5a6 6 0 1 1 5.4 0"/><path d="M9.5 20.4h5M10 17.5h4"/>',
     // ...
   };
   ```
   Yeni bir yazı ikonu gerekiyorsa buraya bir isimle eklenir
   (`icon: 'coin'` şeklinde yazı verisinde referans verilir), HTML'e
   gömülmez.
2. **Sayfa ikonları** (hizmet kartları, akış adımları, vb.) doğrudan
   HTML'e gömülür — `index.html` içindeki `.card-icon` bloklarına bakın.

Ad verme kuralı: kısa, İngilizce, kavramı anlatan tek kelime
(`coin`, `bulb`, `compass`, `envelope`, `gear`, `linkedin`, `x`,
`whatsapp`). Marka/sosyal glifleri de emoji değil aynı çizgi diliyle
sadeleştirilmiş SVG'dir (`main.css` ikon kuralına tabi).

**Renk asla ikonun kendi SVG'sinde sabitlenmez** — `stroke="currentColor"`
ile ebeveynin `color`/`var(--brand-2-ink)` değerini devralır.

Tek istisna (ikon kuralı dışı): ok ve tema düğmesindeki tek renkli metin
işaretleri (`→ ↑ ☾ ☀`) — bunlar yazı tipiyle çizilir, SVG değildir.

## 6. Stil yaklaşımı

- **Metodoloji**: düz CSS, tek dosya, düşük özgüllüklü sınıf seçiciler
  (BEM benzeri ama katı değil: `.plan`, `.plan--featured`,
  `.btn--primary`). CSS Modülleri, styled-components yok.
- **Global stiller**: `assets/css/main.css` tüm sayfalarca paylaşılır;
  sayfa-özel `<style>` bloğu yok.
- **Yön bağımsızlık (RTL)**: proje Arapça'yı destekliyor
  (`dir="rtl"`), bu yüzden **fiziksel yön özellikleri yasak**:
  `margin-left`/`right`, `left`/`right`, `padding-left/right` yazmayın.
  Bunun yerine mantıksal karşılıkları kullanın:
  `margin-inline-start/end`, `inset-inline-start/end`,
  `padding-inline-start/end`, `border-inline-start`. Yeni bir bölüm
  eklediğinizde **Arapça'ya geçip görsel olarak kontrol edin**
  (`index.html?lang=ar`, ya da `driver.mjs shot "index.html?lang=ar"`).
- **Duyarlı (responsive) tasarım**: sabit breakpoint sistemi yok, dört
  nokta var (`main.css`): `max-width: 1180px`, `860px`, `620px`,
  `360px`. Çoğu ızgara `repeat(auto-fit, minmax(...))` ile kendiliğinden
  kırılır (`.grid--3 { grid-template-columns: repeat(auto-fit,
  minmax(280px, 1fr)) }`) — medya sorgusuna gerek kalmadan. Yeni bir
  bileşen için önce `auto-fit`/`minmax` ile kendiliğinden kırılan bir
  çözüm deneyin, breakpoint'e en son başvurun.
- **Tema**: `data-theme="light"|"dark"` kök elemanda; JS
  (`app.js`, `LS_THEME` anahtarı) tercihi `localStorage`'da tutar. Yeni
  bir renk her iki temada da tanımlanmadan commit edilmez.
- **Font**: Inter, Google Fonts CDN'den DEĞİL, kendi sunucumuzdan
  (`assets/fonts/*.woff2` + `assets/fonts/inter.css`, `@font-face` +
  `unicode-range` ile bölünmüş — cyrillic/latin/latin-ext ayrı dosya).
  Sebep GDPR (IP sızıntısı riski, belgeli gerekçe `inter.css` başında).
  Arapça/Çince/Devanagari için sistem fontlarına düşülür (font-stack
  içinde `Noto Sans Arabic` vb. zaten tanımlı). **Yeni bir font/ağırlık
  eklemeyin** — mevcut değişken font 400–800 aralığını zaten kapsıyor.

## 7. Proje yapısı

```
index.html      Tanıtım: hero, hizmetler, içerik akışı, KOBİ bölümü,
                paketler, son yazılar, bülten
work.html       Marka briefi + yazar başvurusu formu
blog.html       Yazı listesi: arama + kategori filtresi
post.html       Yazı detayı (?slug=...)
gizlilik.html / kosullar.html   Yasal metinler (TR+EN)
kalite.html / ornek.html        Kalite güvencesi / örnek teslimat sayfaları
assets/js/config.js   TEK yapılandırma dosyası (e-posta, fiyat, sosyal, CSP endpoint)
assets/js/i18n.js     10 dilde metin sözlüğü (QB_I18N) + dil listesi (QB_LANGS)
assets/js/posts.js    Blog içeriği (QB_POSTS)
assets/js/app.js      Dil/tema/arama/form mantığı + ICONS kaydı
assets/css/main.css   Tek stil dosyası
uye/            Ayrı bir alt uygulama (üye paneli), kendi lib/ vendor'ı var
engine/         Site değil — içerik üretim hattı (Node, ayrı concern)
scripts/        Denetim ve üretim betikleri (check.mjs, marka-uret.py, ...)
docs/           Tasarım sistemi, marka, gelir, güvenlik belgeleri
```

**Sayfa iskeleti 6 dosyada tekrar eder** (nav + footer): `index`,
`work`, `blog`, `post`, `gizlilik`, `kosullar`. Figma'dan gelen bir
header/footer değişikliği **hepsine birden** uygulanmalı — tek dosyada
unutulan menü linki `check.mjs` tarafından yakalanmaz.

**Metin asla HTML'e sabitlenmez.** Her görünen metin `data-i18n` (veya
`data-i18n-attr`, `data-i18n-title`, `data-i18n-content`) ile
`i18n.js` sözlüğünden gelir:

```html
<h2 data-i18n="pack.title">Şeffaf paketler</h2>
```

Figma'dan bir metin/başlık geldiğinde: (1) `assets/js/i18n.js`'e anahtar
**10 dilin tamamına** eklenir, (2) HTML'e `data-i18n="..."` ile
bağlanır, HTML içindeki Türkçe metin yalnızca JS kapalıyken görünen
yedektir. Tek dosyaya İngilizce/Türkçe yazıp bırakmak `npm run check`'i
kırar (10 dil × anahtar eşitliği kontrolü).

**Doğrulama zinciri** (Figma'dan aktarılan her değişiklikten sonra
çalıştırılır):

```bash
npm run check      # i18n eksiksizliği, kırık link, çiftlenen id
npm run guvenlik    # XSS/CSP, tabnabbing, mixed content
node .claude/skills/run-qblogg/driver.mjs smoke   # gerçek tarayıcıda uçtan uca
node .claude/skills/run-qblogg/driver.mjs shot "index.html?lang=ar"  # RTL kontrolü
```

## Figma → kod aktarırken hızlı kontrol listesi

1. Renk/boyut Figma değişkeninden mi geldi, yoksa sabit mi? → sabitse
   en yakın `var(--...)`'a eşle, yeni ham değer yazma.
2. İkon mu var? → emoji/PNG değil, 24×24 `stroke="currentColor"` SVG;
   yazı ikonuysa `app.js` `ICONS` kaydına, sayfa ikonuysa HTML'e.
3. Yeni metin mi var? → `i18n.js`'e 10 dile ekle, HTML'e `data-i18n` yaz.
4. Bölüm nav/footer'ı mı değiştiriyor? → 6 sayfanın hepsini güncelle.
5. Yatay/dikey konumlandırma fiziksel mi (`left`/`right`) yoksa mantıksal
   mı (`inline-start/end`)? → mantıksal yaz, Arapça'da kontrol et.
6. Mevcut bir `.card`/`.btn`/`.flow-item` sınıfı bunu zaten karşılıyor
   mu? → karşılıyorsa yeni CSS yazma, sınıfı uygula.
7. `npm run check` + `npm run guvenlik` yeşil mi? → değilse commit etme.
