# WEB-2026-001 — Dosya Yapısı

```
/ (monorepo kökü = QBLOGG sitesi)
│
├── index.html              Ana sayfa
├── work.html               Çalış sayfası
├── blog.html               Blog listesi
├── post.html               Yazı detayı
├── gizlilik.html           Gizlilik
├── kosullar.html           Koşullar
├── kalite.html             Kalite güvencesi
├── ornek.html              Örnek içerik
├── 404.html                Hata sayfası
│
├── assets/
│   ├── css/
│   │   └── main.css        Tek stil dosyası (629 satır)
│   ├── js/
│   │   ├── config.js       Yapılandırma — yayın öncesi doldurulacak
│   │   ├── i18n.js         10 dil sözlüğü (236 anahtar)
│   │   ├── posts.js        11 blog yazısı (1.475 satır)
│   │   └── app.js          Uygulama mantığı (878 satır)
│   ├── brand/              14 marka varlığı (betikten üretiliyor)
│   │   ├── MANIFEST.md     Varlık listesi
│   │   ├── *.svg (11)      Sembol, lockup, ikon, favicon
│   │   └── *.png (3)       favicon-32, apple-touch-icon, og-image
│   ├── fonts/              Inter değişken fontu (4 woff2 alt küme)
│   │   ├── KAYNAK.md       Lisans ve kaynak kaydı
│   │   ├── OFL.txt         Open Font License
│   │   └── *.woff2 (4)     latin, latin-ext, cyrillic, cyrillic-ext
│   └── downloads/
│       └── otomasyon-kesif-listesi.html  Lead magnet
│
├── scripts/
│   ├── check.mjs           Proje sağlık kontrolü (8 kontrol)
│   ├── gorunurluk.mjs      Görünürlük kuralı denetimi
│   ├── guvenlik.mjs        Güvenlik ve GDPR denetimi
│   ├── onizleme.mjs        Tek dosyalı önizleme üretici
│   ├── marka-uret.py       Marka varlıkları üretici
│   └── marka-tescil.mjs    EUIPO tescil dosyaları üretici
│
├── docs/                   Tüm proje belgeleri
├── engine/                 Curiosity Engine (WEB-2026-007)
├── sitemap.xml             18 URL
├── robots.txt              —
├── feed.xml                RSS beslemesi
├── vercel.json             Deploy yapılandırması
└── package.json            npm betikleri (dev, check, guvenlik, vb.)
```

## npm betikleri

| Komut | Amaç |
|---|---|
| `npm run dev` | http://localhost:8000 |
| `npm run check` | Sağlık kontrolü (commit öncesi zorunlu) |
| `npm run guvenlik` | Güvenlik + GDPR denetimi |
| `npm run gorunurluk` | Görünürlük kuralı denetimi |
| `npm run onizleme` | Tek dosyalı önizleme (`onizleme/qblogg.html`) |
| `npm run rss` | `feed.xml` güncelleme |
| `npm run marka-dogrula` | Marka belgelerini gerçek dosyalarla karşılaştır |
| `npm run tescil-testi` | EUIPO renk modu kuralı testi |
