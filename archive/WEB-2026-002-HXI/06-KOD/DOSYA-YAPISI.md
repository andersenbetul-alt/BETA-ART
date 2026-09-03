# WEB-2026-002 HXI — Dosya Yapısı

## Kaynak ağacı

```
hxi/
├── index.html           Ana sayfa                               433 satır
├── music.html           Diskografi sayfası                      125 satır
├── credits.html         Kredit listesi                          110 satır
├── use.html             Creator Use sayfası                     128 satır
├── sync.html            Sync & Licensing sayfası                151 satır
├── press.html           Basın sayfası                           146 satır
├── contact.html         İletişim sayfası                        134 satır
├── privacy.html         Gizlilik politikası                     116 satır
├── legal.html           Yasal uyarılar                          123 satır
├── vercel.json          Deployment yapılandırması               36 satır
├── README.md            Proje açıklaması
│
├── assets/
│   ├── css/
│   │   └── main.css     Tek stil dosyası                        972 satır
│   ├── js/
│   │   └── app.js       Navigasyon, scroll, reveal              131 satır
│   └── img/
│       ├── favicon.svg  SVG favicon
│       └── og-image.svg Open Graph görseli
│
└── docs/                Tasarım ve değerlendirme belgeleri
    ├── hxi-autopromt-creator-sync.html  Creator/Sync gelir kanalı değerlendirmesi
    ├── hxi-studio.html                  Studio takip ve görev belgesi
    └── hxi-tasarim-degerlendirmesi.html Tasarım seçenekleri değerlendirmesi
```

## experiments/ (hxi/ altında)

```
experiments/
├── hxi-nordic-phonk.html  Nordic Phonk tasarım prototipi (React/Space Mono, 296KB)
└── hxi-arktisk.html       Arktisk tasarım prototipi (React/Space Grotesk, 217KB)
```

Bu iki dosya keşif prototipleridir; üretim koduna dahil değildir.

## Marka klasörü (brand/hxi/)

```
brand/hxi/
├── README.md             Marka mimarisi, logo geometrisi, üretim notları
├── CONCEPT.md            Tam konsept — 38 bölüm
├── designs.html          3 konsept, 4 zemin, boyut testi
├── wordmark.svg          HXI wordmark — flat vector master
├── symbol.svg            X monogramı daire içinde
└── master/
    ├── visual-identity.md   Renk, tipografi, logo, motion kuralları
    ├── website-architecture.md  9 anasayfa ekranı + tüm sayfalar
    ├── technical.md         Tech stack, performans, SEO
    └── signal-score.md      HXI Signal Score 2.0 (10 kategori, üretim kapısı: 90+)
```

## Özet

| Ölçüm | Değer |
|---|---|
| Toplam kaynak dosyası | 11 (9 HTML + 1 CSS + 1 JS) |
| Toplam satır | ~2.569 |
| En büyük dosya | `main.css` (972 satır) |
| Dış bağımlılık | Google Fonts (CDN) |
