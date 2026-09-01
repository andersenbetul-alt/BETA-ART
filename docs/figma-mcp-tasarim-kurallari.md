# Figma MCP için tasarım sistemi kuralları — BETA-ART monorepo

Bu belge, Figma MCP ile bir tasarımı koda çevirirken (veya kodu Figma'ya
taşırken) hangi kurallara uyulacağını anlatır. Depo bir monorepo; iki aktif
tasarım sistemi var ve **birbirine karıştırılmaz**:

| Sistem | Kaynak | Yayın | Karakter |
|---|---|---|---|
| **QBLOGG** | `/` (kök) | qblogg.vercel.app | Açık zemin, kurumsal, navy+aqua |
| **HXI** | `hxi-v6/` | hxi-nu.vercel.app (hximusic.com) | Koyu zemin, editoryal, acid lime |

Bir Figma tasarımı geldiğinde önce hangi projeye ait olduğuna karar ver;
belirsizse kullanıcıya sor. Diğer alt projeler (beta-art/, naviar/, hxi-v2/)
kendi stack'lerini taşır — bkz. `MONOREPO.md`.

---

## 1. QBLOGG (kök proje)

### Token'lar

Tek kaynak: **`assets/css/main.css` → `:root`** (629 satır, tek stil dosyası).
Ayrı bir token dosyası, ön işlemci veya dönüşüm sistemi YOK — CSS özel
değişkenleri doğrudan kullanılır. Koyu tema `html[data-theme="dark"]`
bloğunda aynı değişkenleri yeniden tanımlar.

```css
:root {
  --brand: #082C54;        /* Midnight Navy — kimlik rengi */
  --brand-2: #00D8C2;      /* Electric Aqua — yalnızca vurgu */
  --brand-2-ink: #0a7d72;  /* beyaz üzerinde 5,0:1 — metinde aqua yerine BU */
  --fs-2xs … --fs-xl;      /* yedi basamaklı yazı ölçeği; ham rem yazılmaz */
  --radius: 16px; --radius-sm: 10px; --maxw: 1140px;
}
```

Figma'dan gelen her renk bir değişkene bağlanır; **doğrudan hex yazılmaz**
(CLAUDE.md kural 5). Aqua `#00D8C2` beyaz üzerinde 1,8:1'dir — Figma'da metin
rengi olarak görünse bile kodda `var(--brand-2-ink)` kullanılır.

### Bileşen mimarisi

Framework yok: bileşenler `index.html`/`work.html`/… içinde tekrar eden HTML
kalıpları + `assets/js/app.js` davranışlarıdır. Sayfa iskeleti (menü,
altbilgi) **altı dosyada** elle tekrarlanır; birini değiştiren altısını
değiştirir. Storybook yok; kanonik referans `docs/tasarim-sistemi.md`.

### İkonlar

Emoji yasak; her ikon satır içi SVG (CLAUDE.md kural 4): 24×24 ızgara,
`fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak
uç/birleşim. Yazı ikonları `assets/js/app.js → ICONS` kaydında **adla** durur:

```js
var ICONS = {
  coin: '<circle cx="9.3" cy="9.3" r="5.6"/><circle cx="14.7" cy="14.7" r="5.6"/>',
  ...
};  // yazıda kullanım: icon: 'coin'
```

Figma'dan ikon alırken bu formata çevir; sayfa ikonları doğrudan HTML'e gömülür.

### Metin ve i18n

Görünen metin HTML'e sabitlenmez; `data-i18n` ile `assets/js/i18n.js`
sözlüğünden gelir (10 dil, anahtar eşitliği `npm run check` ile denetlenir).
Figma'daki metinleri koda taşırken: HTML'e Türkçe yedek + sözlüğe 10 dil.

### Duyarlılık ve RTL

Logical property zorunlu: `margin-inline-start`, `inset-inline-start`
(Arapça RTL otomatik döner). Kırılımlar `main.css` içindeki mevcut
`@media` bloklarına eklenir; yeni keyfi kırılım açılmaz.

### Varlıklar

`assets/brand/` (logo/lockup/favicon — `scripts/marka-uret.py` üretir, elle
çizilmez; tescil standardı CLAUDE.md kural 7), `assets/fonts/` (öz-barındırılan
Inter woff2 + `KAYNAK.md` lisans kaydı). CDN yok; her şey depodan servis edilir.
Doğrulama: `npm run check` + `npm run guvenlik`.

---

## 2. HXI (hxi-v6/)

### Marka otoritesi

Görsel kararların tek doğrusu **`brand/hxi/README.md` + `brand/hxi/CONCEPT.md`**
(kilitli 100/100 konsept). Figma tasarımı bu doktrinle çelişirse doktrin
kazanır; çelişkiyi kullanıcıya söyle. Kilitli değerler:

| Token | Değer | Rol |
|---|---|---|
| Deep Black | `#080808` | Ana zemin |
| Cold Off-White | `#F0EDE8` | Metin/yüzey |
| HXI Acid | `#C8FF00` | Marka vurgusu (hafıza rengi) |
| Signal Red | `#EF2B2D` | YALNIZ drop/uyarı/kampanya — kalıcı vurgu değil |

Çevrilmeyen öğeler: HXI, "THE SAME SPEED — COLDER." (uzun çizgi + nokta),
UTGAVE, 59.91°N · 10.75°E. Tescil temiz değil: ® veya "korunmaktadır" dili yok.

### Token'lar

Uygulama: **`hxi-v6/app/globals.css` → `:root`** (760 satır, tek dosya):

```css
:root {
  --bg: #080808; --ink: #f1f0eb; --acid: #c8ff00; --red: #ff2d2d;
  --surface: #0e0e0e; --line: #292929;
  --display: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  --mono: 'Courier New', ui-monospace, SFMono-Regular, Menlo, monospace;
  --max: 1280px; --pad: clamp(18px, 4vw, 64px);
}
```

**Bilinçli sapma:** konsept tipografisi Barlow Condensed / IBM Plex Sans /
Space Mono'dur ama site **0 bayt web fontu** hedefiyle sistem eşdeğerlerini
kullanır (Impact ≈ condensed display, Courier ≈ mono). Figma'dan font
getirme önerisi bu performans kararını bozar — önce kullanıcıya sor.

### Bileşen mimarisi

Next.js 15 statik export, tek büyük sayfa bileşeni:
`hxi-v6/components/SitePage.tsx` (tüm bölümler) + alt sayfalar
`app/[locale]/{use,sync,privacy}/page.tsx` (privacy kalıbı kopyalanır).
Metinler `hxi-v6/content/locales.ts` → `LocaleData` tipi, **10 dil birden**.
Yayında Next JS'i sökülür (`statik-incelt.mjs`) — **yeni istemci davranışı
eklersen vanilya karşılığını da o betiğe ekle**, yoksa canlıda çalışmaz.

### Stil yaklaşımı

Global tek CSS dosyası, sınıf adları bölüm bazlı (`.hero-*`, `.proof-card`,
`.creator-link`). CSS Modules/Tailwind YOK. Kırılımlar: 1100px, 900px, 560px
+ `prefers-reduced-motion` (zorunlu). RTL: `[dir='rtl']` istisnaları +
logical property'ler. Eyebrow'lar 01–08 sıralı ve mono/uppercase.

### Varlıklar

`hxi-v6/public/assets/` — hero.webp (kök sayfa), hero.png (SİLİNMEZ —
/v5 /v6 arşivleri kullanır), og-hxi.jpg, favicon.svg. Logo master'ları
`brand/hxi/wordmark.svg` + `symbol.svg` (geometri README'de ölçülü;
elle çizilmez, ölçülerden yeniden üretilir).

### Yayın

Her görsel değişiklik `hxi-yayin` becerisiyle yayınlanır (derle → JS söküm →
`hxi-sayfalar/` tazele → push → Vercel klon-kalıbı → Playwright doğrulama).
Figma'dan kod üretince bu döngünün dışına çıkma.

---

## 3. Figma MCP çalışma kuralları (her iki sistem)

1. **Önce oku, sonra çevir:** QBLOGG için `docs/tasarim-sistemi.md`, HXI için
   `brand/hxi/README.md` + `CONCEPT.md` (hxi-yayin kural 0).
2. **Figma değerleri ham kopyalanmaz:** renkler mevcut değişkenlere, yazı
   boyutları mevcut ölçeğe eşlenir. Ölçekte olmayan bir değer geldiyse en
   yakın basamağı kullan; yeni basamak açmak kullanıcı kararıdır.
3. **Kontrast Figma'da değil kodda doğrulanır:** aqua/acid gibi parlak marka
   renkleri açık zeminde metin olamaz (QBLOGG `--brand-2-ink`, HXI'da acid
   yalnız koyu zeminde metin olur).
4. **`get_screenshot` + `get_design_context`** ile yapıyı al; üretilen kodu
   projenin doğrulama komutundan geçir (QBLOGG: `npm run check`; HXI:
   `dogrula.mjs`). Kırmızıysa commit yok.
5. Kod→Figma yönünde (`use_figma`): önce `/figma-use` becerisini yükle;
   token adlarını buradaki tablolarla eşleştirerek stil kütüphanesi kur.
