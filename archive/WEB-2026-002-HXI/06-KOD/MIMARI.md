# WEB-2026-002 HXI — Mimari

## Genel mimari

```
hxi/
├── index.html          Ana sayfa (433 satır)
├── music.html          Diskografi (125 satır)
├── credits.html        Kredit listesi (110 satır)
├── use.html            Creator Use (128 satır)
├── sync.html           Sync & Licensing (151 satır)
├── press.html          Basın (146 satır)
├── contact.html        İletişim (134 satır)
├── privacy.html        Gizlilik (116 satır)
├── legal.html          Yasal (123 satır)
├── vercel.json         Deployment yapılandırması
├── assets/
│   ├── css/
│   │   └── main.css    Tek stil dosyası (~972 satır)
│   ├── js/
│   │   └── app.js      Navigasyon, scroll, reveal (~131 satır)
│   └── img/
│       ├── favicon.svg Favicon
│       └── og-image.svg OG görsel
└── README.md
```

**Toplam kaynak:** ~2.569 satır (HTML: 1466, CSS: 972, JS: 131)

---

## Teknoloji seçimi

| Karar | Gerekçe |
|---|---|
| Saf HTML/CSS/JS | Hız, güvenilirlik, sıfır bağımlılık — aynı QBLOGG felsefesi |
| Derleme adımı yok | Herhangi bir statik sunucuya olduğu gibi yüklenir |
| Tek tema (karanlık) | Marka tutarlılığı — karanlık atmosfer HXI kimliğinin parçası |
| Tek dil (İngilizce) | Uluslararası erişim; çok dilli altyapı gerekmez |
| Google Fonts CDN | Barlow Condensed, IBM Plex Sans, Space Mono |

---

## JavaScript mimarisi (app.js)

**Navigasyon modülü:**
- Mobil menü açma/kapama (burger → X animasyonu)
- Keyboard: Escape tuşu menüyü kapatır
- `aria-expanded`, `aria-hidden` erişilebilirlik yönetimi

**Scroll efektleri:**
- `nav.scrolled` sınıfı → nav arka planı scroll'da değişir
- `requestAnimationFrame` ile optimize edilmiş scroll listener

**Scroll Reveal:**
- `IntersectionObserver` ile `.reveal` elementleri giriş animasyonu
- `data-stagger` ile kademeli animasyon
- `prefers-reduced-motion` desteği

---

## CSS mimarisi (main.css)

**Token sistemi:**
- CSS custom properties (`--font-display`, `--font-body`, `--font-signal`)
- Renk tokenları (`--white`, `--grey-1`…`--grey-5`, `--acid`)
- Boşluk / boyut tokenları
- Navigasyon yüksekliği (`--nav-h`)

**Bileşenler:**
- `.nav` / `.nav-mobile` — navigasyon ve mobil overlay
- `.hero` — tam ekran hero bölümü (noise, background)
- `.current-signal` — öne çıkan single bölümü
- `.selected-works` / `.sw-featured` — katalog kartları
- `.credits-grid` — kredit ızgarası
- `.btn-primary` / `.btn-secondary` — buton varyantları
- `.reveal` — scroll animasyon tetikleyici sınıf
- `.container` — içerik genişliği sınırlayıcı

---

## Deployment yapılandırması (vercel.json)

**Güvenlik başlıkları (tüm sayfalar):**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy`: self + unsafe-inline (CSS), Google Fonts

**Cache:**
- `assets/*`: `public, max-age=31536000, immutable` (1 yıl)

**URL temizliği:**
- `cleanUrls: true` — `.html` uzantısı gizlenir
- `trailingSlash: false`
- Rewrites: `/music` → `/music.html` vb.

---

## Dış bağlantılar

| Servis | Kullanım |
|---|---|
| https://ncs.io | Müzik dağıtım platformu — CTA hedefi |
| https://fonts.googleapis.com | Google Fonts CDN |
| https://fonts.gstatic.com | Font dosyaları |

---

## Teknik borçlar

| Borç | Seviye |
|---|---|
| Contact formu gerçek servise bağlı değil | **Yüksek** |
| Gerçek müzik/cover görseli yok (placeholder) | **Yüksek** |
| sitemap.xml eksik | **Orta** |
| Logo SVG'leri Acid rengiyle güncellenmeli | **Orta** |
