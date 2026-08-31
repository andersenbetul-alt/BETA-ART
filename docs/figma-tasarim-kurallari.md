# Figma ↔ BETA-ART tasarım sistemi kuralları

Bu belge, Figma MCP ile bu depoya tasarım aktarırken (veya bu siteden Figma'ya
tasarım üretirken) uyulacak kuralları tek yerde toplar. Depoda **iki ayrı,
birbirinden bağımsız tasarım sistemi** var — Figma çalışması hangisine
dokunuyorsa o bölüm geçerlidir, ikisini karıştırmayın:

- **§A — QBLOGG** (saf HTML/CSS/vanilla JS, çatı yok). Genel tasarım sistemi
  belgesi `docs/tasarim-sistemi.md`; buradaki içerik Figma'ya özel okuma.
- **§B — NAVIAR interaktif kimlik sitesi** (`brand/naviar/interactive/`,
  React + Vite + Tailwind + shadcn/ui). Genel belge `brand/naviar/README.md`
  ve `.claude/skills/on-brand/SKILL.md`.

Çelişkide her projenin kendi CLAUDE.md/README "Değişmez kurallar"ı kazanır.

---

# §A — QBLOGG

## 1. Belirteçler (design tokens)

**Tek kaynak:** `assets/css/main.css` içindeki `:root` bloğu (açık tema) ve
`html[data-theme="dark"]` bloğu (koyu tema, satır ~43). Ayrı token dosyası,
dönüştürme sistemi (Style Dictionary vb.) YOKTUR — bilinçli sadelik.

```css
--bg / --bg-soft / --bg-card      /* zeminler */
--text / --text-muted             /* metin */
--border                          /* çizgiler (dikkat: --line diye bir belirteç YOK) */
--brand: #082C54                  /* Midnight Navy — kimlik */
--brand-2: #00D8C2                /* Electric Aqua — yalnız vurgu; METİNDE KULLANILMAZ (1,9:1) */
--brand-2-ink: #0a7d72            /* açık zeminde aqua niyetli METİN rengi (5,0:1) */
--on-brand / --logo-ink / --brand-soft / --danger
--shadow / --shadow-lg
--radius: 16px / --radius-sm: 10px
--maxw: 1140px
```

**Yazı ölçeği yedi basamaktır** — Figma'daki serbest punto değerleri en yakın
basamağa oturtulur, ham `rem`/`px` yazılmaz:
`--fs-2xs .76rem · --fs-xs .8rem · --fs-sm .85rem · --fs-md .92rem ·
--fs-base .95rem · --fs-lg 1rem · --fs-xl 1.12rem` (+ `--fs-logo` yalnız logo).
Başlıkların `clamp()` değerleri ve `em` göreli boyutlar ölçeğin dışındadır.

**Figma değişken eşlemesi:** Figma'da renk stili açılacaksa adları bire bir
CSS değişkeninden alın (`brand`, `brand-2-ink`, `bg-soft`…), yeni ara ton
üretmeyin. Figma'dan gelen bir hex, listedeki bir belirtece denk gelmiyorsa
tasarım koda girmeden önce belirteçlerden birine yuvarlanır.

## 2. Bileşen kütüphanesi

Bileşen çatısı yoktur; "bileşen" = tekrar eden sınıf desenleri. Kaynak:
`assets/css/main.css` (tek dosya) + sayfa HTML'leri.

| Desen | Sınıf | Not |
|---|---|---|
| Düğme | `.btn` + `.btn--primary/.btn--ghost/.btn--block/.btn--lg` | `<a>` veya `<button>` |
| Kart | `.card`, plan kartı `.plan` (+`.plan--featured`) | |
| Bölüm | `.section` (+`.section--soft`), başlık bloğu `.section-head`, `.kicker` | |
| Izgara | `.wrap` (maks `--maxw`), `.wrap--narrow`, `.posts`, `.plans`, `.footer-grid` | |
| Rozet/etiket | `.tag`, chip `.chip` | |
| Form | `.field`, hata `.field-msg`, `[aria-invalid]` | |
| Makale | `.article-body` (+`--plain`), `.article-note`, `.article-toc`, `.article-sources` | |
| Tablo | `.table-wrap` (overflow sarıcı) + `.cmp-table` | |

Storybook/dokümantasyon sitesi yok; canlı referans `npm run dev` →
http://localhost:8000.

## 3. Çatı ve derleme

- **Çatı YOK:** saf HTML + CSS + vanilla JS (`assets/js/app.js`). React/Vue
  kodu üretmeyin; Figma'dan kod çıkarırken hedef her zaman bu üçlüdür.
- **Derleme adımı YOK, bağımlılık YOK.** `npm` yalnız denetim betikleri için.
  Yeni paket/CDN eklemek yasak (CLAUDE.md kural 8; CSP de engeller).
- Dağıtım: Vercel, statik kopya (`vercel.json` buildCommand).

## 4. Varlık yönetimi

- Marka varlıkları `assets/brand/` — 14 dosya, hepsi `scripts/marka-uret.py`
  betiğinden çıkar; **elle SVG/PNG eklenmez**, betik güncellenir
  (yeniden üretilebilirlik kuralı, CLAUDE.md kural 7).
- Yazı tipleri `assets/fonts/` (Inter, kendi sunucumuzda; kaynak ve lisans
  kaydı `assets/fonts/KAYNAK.md`). Dış font servisi kullanılmaz.
- CDN yok; her şey aynı origin'den. Görsel eklemek gerekirse önce ikon/SVG
  düşünülür — sitede bit-eşlem görsel neredeyse yoktur (og-image hariç).

## 5. İkon sistemi

- **Emoji yasak.** Her ikon satır içi SVG: 24×24 ızgara, `fill="none"`,
  `stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak uç ve birleşim.
- Yazı ikonları `assets/js/app.js → ICONS` kaydında adla durur
  (ör. `icon: 'coin'`); sayfa ikonları doğrudan HTML'e gömülür.
- İstisna: `→ ↑ ☾ ☀` metin işaretleri yazı tipiyle çizilir.
- Figma'dan ikon alırken: 24×24'e oturt, stroke'u 1.7'ye ve `currentColor`'a
  çevir, dolguyu kaldır; dekoratifse `aria-hidden="true"`.

## 6. Stil yaklaşımı

- Tek global stil dosyası: `assets/css/main.css`. CSS Modules/utility
  framework yok; sınıf adları Türkçe-İngilizce karışık BEM-vari düz adlar.
- **RTL zorunluluğu:** yön bağımlı özellik yazılmaz — `margin-inline-start`,
  `inset-inline-start`, `padding-inline`, `text-align:start`. Figma'nın
  ürettiği `left/right` değerleri çevrilir. Yeni bölüm Arapçada denenir.
- Koyu tema değişkenlerle kendiliğinden çalışır; bileşen içinde tema koşulu
  yazmak yerine belirteç kullanılır.
- Kesme noktaları: `1180px`, `860px`, `620px`, `360px` (max-width) +
  `prefers-reduced-motion` ve `print` blokları. Yeni kesme noktası açmadan
  önce bu dördüne oturmayı deneyin.
- Erişilebilirlik tabanı: 44px dokunma hedefi, `:focus-visible` halkası,
  `.sr-only` yardımıcısı, kontrast ölçülü (bkz. belirteç yorumları).

## 7. Proje yapısı ve metin kuralı

```
index/work/blog/post/gizlilik/kosullar(.html) + 404.html   sayfalar
assets/css/main.css      tek stil dosyası
assets/js/config.js      yayın ayarları (tek yapılandırma noktası)
assets/js/i18n.js        10 dil sözlüğü (QB_I18N)
assets/js/posts.js       blog içeriği (QB_POSTS)
assets/js/app.js         tüm davranış
scripts/*.mjs|py         denetim + üretim betikleri
docs/*.md                sistem belgeleri
```

- **Görünen her metin sözlükten gelir:** HTML'e `data-i18n="anahtar"` yazılır,
  Türkçesi yalnız JS-kapalı yedektir. Figma'daki metinler koda alınırken
  önce `i18n.js`'e ON dilde anahtar açılır (CLAUDE.md kural 1) — tek dilde
  metin gömmek en sık yapılan hatadır.
- Menü/altbilgi değişikliği TÜM sayfalara birden uygulanır.
- Her değişiklikten sonra: `npm run check` + `npm run guvenlik` yeşil olmadan
  commit yok.

## A.8 — Figma'ya aktarım (code → design) notu

Siteden Figma'ya sayfa üretilecekse: renkleri yukarıdaki belirteç adlarıyla
stillendirin, Inter kullanın, 1140px içerik genişliği + 620px mobil çerçeve
ikilisiyle çalışın; ikonları `ICONS` kaydındaki adlarıyla bileşenleştirin.

---

# §B — NAVIAR interaktif kimlik sitesi

`brand/naviar/interactive/` — `naviar-consult` Vercel projesinin canlı
kaynağı. QBLOGG'un "çatı yok" ilkesi burada **geçerli değil**; bu ayrı bir
alt-proje, kendi `package.json`/build zinciri var.

## B.1 — Belirteçler (design tokens)

**Tek kaynak:** `src/index.css` içindeki `@layer base` bloğu — HSL formatında
CSS custom property, açık/koyu/`data-theme` üçlü şema (bkz. `artifact-design`
skill'inin tema kuralı). Ayrı Style Dictionary/token dosyası yok.

```css
--navy: 217 60% 10%;        /* #0A1628 — marka rengi */
--gold: 46 65% 52%;         /* #D4AF37 — kontrollü aksan, asla gövde/dolgu */
--off-white: 220 18% 97%;   /* #F5F6F8 */
--graphite: 0 0% 12%;       /* #1E1E1E */
--cyan: 193 100% 45%;       /* #00B2E3 — yalnız veri/UI, master markada YOK */
--pass / --fail              /* kontrast demosu için, yeşil/kırmızı */
```

shadcn'in standart semantik katmanı (`--background`, `--foreground`,
`--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`,
`--input`, `--ring`) bu beşine **yaslanır** — `tailwind.config.js`'de
`hsl(var(--...))` olarak eşlenir, `theme.extend.colors` içinde. Yeni bir
ham hex/ara ton eklemeyin; NAVIAR'ın 5 rengi dışına çıkan her Figma stili
`.claude/skills/on-brand/SKILL.md`'nin refüze kapsamına girer.

**Figma değişken eşlemesi:** Figma renk stilleri `navy/gold/off-white/
graphite` adlarıyla birebir kurulmalı; shadcn katmanı (`primary`,
`secondary`…) bunların üzerine türetilmiş bir *alias* katmanıdır, ayrı bir
kaynak değildir.

## B.2 — Bileşen kütüphanesi

- **shadcn/ui'den yalnız `button.tsx` kullanılıyor** (`src/components/ui/`).
  ~44 kullanılmayan shadcn taslak bileşeni bilinçli olarak elendi (bkz.
  `docs/proje-gunlugu.md`, 30.08.2026). Figma'dan yeni bir shadcn bileşeni
  (Dialog, Tabs, vb.) gerekiyorsa önce gerçekten gerekli mi diye sorun —
  varsayılan "hayır, mevcut deseni genişlet".
- Özel bileşenler `src/components/`: `theme-toggle.tsx`, `color-swatch.tsx`,
  `contrast-demo.tsx` (canlı WCAG hesaplayıcı, bkz. `src/lib/wcag.ts`),
  `section-nav.tsx` (scroll-spy, `SECTIONS` sabiti tek kaynak), yeni eklenen
  `booking-request.tsx` (görüşme talebi formu).
  `App.tsx` içindeki `Section` ve `AssetCard` yerel (dışa aktarılmamış)
  yardımcı bileşenler — Figma'dan yeni bir "kart" deseni gelirse önce
  `AssetCard`'ın genişletilip genişletilemeyeceğine bakın.
- Marka varlıkları (`Wordmark`, `Monogram`, `LockupHorizontal`,
  `LockupStacked`, `Descriptor`, `IconApp`, `IconFavicon`, çalışma/study
  bileşenleri) `src/assets/naviar-svg.tsx`'te — bunlar **elle Figma'dan kod
  çıkarılarak yeniden yazılmaz**; kaynak gerçek `brand/naviar/master/` SVG
  dosyalarıdır (`scripts/marka-uret.py`'den üretilir), bu dosya onları
  React bileşenine sarar. Figma'da yeni bir logo/monogram varyantı
  görürseniz önce onun `NAVIAR-LOGO-KARAR.md`'de onaylı olup olmadığına
  bakın — onaysız bir varyant koda REFÜZE EDİLİR (bkz. B.5).
- Storybook yok; canlı referans `npm run dev` (localhost:5173).

## B.3 — Çatı ve derleme

- React 19 + TypeScript + Vite 8 + Tailwind 3.4 + `tailwindcss-animate` +
  `class-variance-authority` + `clsx`/`tailwind-merge` + `lucide-react` +
  `@radix-ui/react-slot` (yalnız `button`'ın `asChild` desteği için).
- `npm run build` **yalnız `vite build`** çalıştırır, `tsc -b` değil —
  bu TS sürümünde `tsconfig`'in `baseUrl` kullanımı `TS5101` hatası
  veriyor ve Vercel build'ini kırıyordu. Tip kontrolü ayrı:
  `npm run typecheck`. Figma'dan kod üretirken bu iki komutu birbirine
  karıştırmayın — `typecheck` dağıtımı bloklamaz.
- Dağıtım: `deploy_to_vercel` ile **doğrudan dosya yükleme** — git
  entegrasyonu yok, `main`'e push otomatik dağıtım tetiklemez (QBLOGG'un
  git-clone tarifinden farklı).

## B.4 — Varlık yönetimi ve ikon sistemi

- Master SVG'ler `brand/naviar/master/` + `descriptors/` + `studies/` —
  hepsi `python3 scripts/marka-uret.py`'den üretilir, elle SVG eklenmez
  (CLAUDE.md kural 7a, bu depo genelinde geçerli).
- İkonlar iki kaynaklı: (1) NAVIAR marka ikonları yukarıdaki
  `naviar-svg.tsx` bileşenleri, (2) genel UI ikonları `lucide-react`
  (`ThemeToggle` içindeki `Sun`/`Moon` gibi). Emoji yasağı QBLOGG'daki
  gibi burada da geçerli.
- Favicon `public/favicon.svg` — gerçek NAVIAR favicon geometrisi
  (`IconFavicon` bileşeniyle birebir), Vite scaffold'unun varsayılan mor
  ikonu DEĞİL (bu, ilk dağıtımda bulunup düzeltilen bir hataydı).

## B.5 — Marka governance (Figma'ya özel en kritik kural)

`NAVIAR-LOGO-KARAR.md`'nin "tek monogram" şartı burada mutlak: master
monogramın altın yerleşimi **N'nin sağ dikey barı**dır (P8/P9, koşullu
kabul). Figma'dan veya başka bir üretim aracından **farklı bir geometri**
taşıyan bir "NAVIAR" logosu gelirse (ör. N'yi çapraz kesen diyagonal altın
şerit) — bu **onaysız bir varyanttır**, koda gömülmez, `on-brand` skill'i
gereği kısa gerekçeyle reddedilir: *"Onaylı master monogramla çelişiyor,
NAVIAR-LOGO-KARAR.md'nin tek-monogram şartını ihlal ediyor."* Böyle bir
varyant tasarım tartışması olarak gelirse kullanıcıya sorulur, sessizce
ne kabul edilir ne de mevcut sistemin yerine geçirilir.

Ayrıca: raster (PNG/JPG) bir logo dosyası — kaynağı ne olursa olsun —
`naviar-svg.tsx`'e giremez; CLAUDE.md kural 7(a) her marka varlığının bir
betikten (burada `scripts/marka-uret.py`) üretilebilir olmasını şart koşar.

## B.6 — Stil yaklaşımı ve proje yapısı

```
brand/naviar/interactive/
  src/index.css          HSL token'lar (@layer base) + Tailwind katmanları
  src/lib/config.ts       tek yapılandırma noktası (ör. CONTACT_EMAIL —
                          QBLOGG'daki assets/js/config.js deseniyle aynı)
  src/lib/wcag.ts         WCAG 2.1 kontrast formülü (resmî spec'ten)
  src/lib/utils.ts        cn() — clsx + tailwind-merge
  src/assets/naviar-svg.tsx   marka varlıkları (React sarmalayıcı)
  src/components/         özel bileşenler + ui/button.tsx
  src/App.tsx             tek sayfa, Section/AssetCard yerel yardımcılar
```

- Üç durumlu tema: `:root` (açık, varsayılan) · `@media
  (prefers-color-scheme: dark):not([data-theme="light"])` · `:root[data-
  theme="dark"]` — `artifact-design` skill'inin tema kalıbıyla aynı desen.
- Responsive: Tailwind'in varsayılan kesme noktaları (`sm/md/lg`), QBLOGG'un
  özel 4-nokta sistemi burada YOK.
- Dil: sayfa gövdesi Türkçe (bu, satış sitesi değil marka kimliği durumu
  belgesi olduğu için — bkz. üstteki banner metni), ama müşteri karşısına
  çıkan gerçek metin (booking formu) Norveççe + kısa İngilizce özet —
  NAVIAR Consult'un hedef pazarı Norveç, `naerhjelp-pilot-v2` pilotundaki
  dil deseniyle tutarlı.

## B.7 — Figma'ya aktarım (code → design) notu

NAVIAR'dan Figma'ya sayfa/bileşen üretilecekse: 5 rengi (navy/gold/
off-white/graphite/cyan) Figma renk stili olarak kurun, shadcn semantik
katmanını bunların üzerine alias olarak bağlayın, gradient/bevel/gölge/3D
efekt eklemeyin (master markanın kendi yasağı, bkz. `brand/naviar/
README.md` "Kurallar"). Tipografi için resmî bir NAVIAR body-fontu henüz
yok (`on-brand` SKILL.md §4) — IBM Plex Sans/Mono şu an yalnızca bu
dokümantasyon sayfasının seçimi, master marka kararı değil.
