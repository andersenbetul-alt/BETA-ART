# WEB-2026-001 — Kod Mimarisi

## Genel mimari

**Saf statik site** — derleme yok, framework yok, bağımlılık yok. Her dosya doğrudan tarayıcıda çalışır.

```
[Tarayıcı]
    │
    ├── index.html / work.html / blog.html / post.html / ...
    │       └── <script src="assets/js/...">
    │
    ├── assets/js/config.js      ← Yapılandırma (e-posta, fiyat, sosyal)
    ├── assets/js/i18n.js        ← 10 dil sözlüğü + QB_LANGS
    ├── assets/js/posts.js       ← Blog içeriği (QB_POSTS)
    └── assets/js/app.js         ← Tüm uygulama mantığı
```

## Dosya envanteri

### Giriş noktaları (HTML)

| Dosya | Satır | Amaç |
|---|---|---|
| `index.html` | — | Ana sayfa |
| `work.html` | — | Çalış (brief + yazar) |
| `blog.html` | — | Blog listesi |
| `post.html` | — | Yazı detayı |
| `gizlilik.html` | — | Gizlilik metni |
| `kosullar.html` | — | Kullanım koşulları |
| `kalite.html` | — | Kalite güvencesi |
| `ornek.html` | — | Örnek içerik |
| `404.html` | — | Hata sayfası |

### JavaScript dosyaları

**`assets/js/config.js`**
- Görevi: Yayın yapılandırması (tek dosya, buradan başlayın)
- Değişkenler: `window.QB_CONFIG` — mailTo, siteUrl, social, prices, payLinks, leadMagnet, newsletterEndpoint, newsletterField
- Bağımlılıklar: `app.js` bu nesneyi okur
- Güvenlik notu: API anahtarı veya şifre içermez (hepsi public config)

**`assets/js/i18n.js`**
- Görevi: 10 dil sözlüğü
- Değişkenler: `window.QB_LANGS`, `window.QB_I18N`
- Kapsam: 236 anahtar × 10 dil = 2.360 çeviri
- Kural: Yeni anahtar eklenmesi 10 dile birden eklenmeli

**`assets/js/posts.js`**
- Görevi: 11 blog yazısının tamamı
- Değişken: `window.QB_POSTS`
- Kapsam: Her yazıda `slug`, `category`, `date`, `accent`, `icon`, `t`/`e`/`b` (10 dilde başlık/özet/gövde)
- Boyut: 1.475 satır

**`assets/js/app.js`**
- Görevi: Tüm uygulama mantığı
- Kapsam: Dil, tema, liste/arama/filtre, yazı sayfası, sekmeler, formlar, ICONS kaydı
- Boyut: 878 satır
- Bağımlılıklar: config.js, i18n.js, posts.js yüklü olmalı

### CSS

**`assets/css/main.css`**
- Görevi: Tek stil dosyası
- Boyut: 629 satır
- Kural: Tüm renkler `:root` değişkenlerinden gelir; doğrudan hex yazılmaz

## Veri akışı

```
config.js (yapılandırma)  ─┐
i18n.js   (sözlük)         ├─→ app.js → DOM manipülasyonu → görünen sayfa
posts.js  (içerik)        ─┘
```

## Deployment

- **Build:** `buildCommand` `vercel.json` içinde — public repoyu klonlayıp 9 sayfa + assets'i `dist/`e kopyalar
- **Hosting:** Vercel (BET-ART takımı)
- **CI/CD:** Yok (otomatik deploy için GitHub entegrasyonu kurulmalı)

## Harici servisler (runtime)

| Servis | Endpoint | Güvenlik |
|---|---|---|
| Buttondown | `newsletterEndpoint` (config.js) | Public form API |
| Formspree | `formEndpoint` (config.js, boş) | Public form API |
| Stripe | `payLinks` (config.js, boş) | Payment Link (ödeme sayfasına yönlendirme) |

## Teknik borçlar

1. `config.js` gerçek verilerle doldurulmadı
2. Formspree entegrasyonu kurulmadı
3. Dil değişimi istemci taraflı → SEO için her dil ayrı URL'de olmalı (pre-render adımı)
4. GitHub entegrasyonu yetkisiz → her deploy manuel tetiklenmeli
