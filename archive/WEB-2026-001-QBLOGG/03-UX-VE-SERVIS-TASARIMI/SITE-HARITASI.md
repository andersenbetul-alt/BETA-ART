# WEB-2026-001 — Site Haritası

**Durum:** Doğrulanmış (dosyalar incelendi, 2026-09-03)

## Sayfa envanteri

| Sayfa no | Dosya | URL yolu | Amaç |
|---|---|---|---|
| PAGE-001 | `index.html` | `/` | Ana sayfa — hero, hizmetler, paketler, son yazılar, bülten |
| PAGE-002 | `work.html` | `/work.html` | Çalış — brief formu, yazar başvurusu, süreç, SSS |
| PAGE-003 | `blog.html` | `/blog.html` | Blog listesi — arama + kategori filtresi |
| PAGE-004 | `post.html` | `/post.html?slug=...` | Yazı detayı (slug parametresiyle) |
| PAGE-005 | `gizlilik.html` | `/gizlilik.html` | Gizlilik ve veri koruma (TR + EN) |
| PAGE-006 | `kosullar.html` | `/kosullar.html` | Kullanım koşulları (TR + EN) |
| PAGE-007 | `kalite.html` | `/kalite.html` | Kalite güvencesi sayfası |
| PAGE-008 | `ornek.html` | `/ornek.html` | Örnek içerik sayfası |
| PAGE-009 | `404.html` | `/404.html` | Hata sayfası (kasıtlı olarak iskelet dışı) |

## Blog yazıları (11 adet, `posts.js` içinde)

Her yazı tek bir `post.html?slug=<slug>` URL'inde gösteriliyor. Yazıların slug listesi `assets/js/posts.js` içinde.

## Menü yapısı (tüm sayfalarda tekrar eder)

```
Logo → /
Blog → /blog.html
Bizimle Çalışın → /work.html
[Dil seçici]
[Tema düğmesi]
```

## Altbilgi (tüm sayfalarda tekrar eder)

```
Logo + açıklama
Hızlı bağlantılar (Ana Sayfa, Blog, Bizimle Çalışın)
Kaynaklar (Gizlilik, Koşullar, Kalite)
Sosyal bağlantılar (config.js'ten — boşsa görünmez)
Bülten kutusu
Telif hakkı notu
```

## Sitemap

`sitemap.xml` → 18 URL (doğrulandı, `check.mjs` tarafından izleniyor)

## RSS

`feed.xml` → `npm run rss` ile üretiliyor
