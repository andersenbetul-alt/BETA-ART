---
name: qblogg-yeni-yazi
description: >
  QBLOGG'a yeni bir blog yazısı EKLE — posts.js teknik akışı, iki katmanlı içerik modeli
  (tam TR+EN, 8 dilde özet), sitemap ve RSS güncellemesi, tüm denetimler. Kullanıcı
  "yeni yazı ekle", "posts.js'e ekle", "blog yazısı yayınla", "slug oluştur", "yazıyı
  sisteme ekle", "yeni post" dediğinde MUTLAKA bu beceriyi kullan. qblogg-blog-yazisi
  içeriği yazar, bu beceri onu teknik olarak sisteme kaydeder.
owner: QBLOGG
---

# Yeni blog yazısı ekleme

`assets/js/posts.js` → `QB_POSTS` dizisine yeni nesne eklemek + tüm çevre dosyaları
güncellemek. `qblogg-blog-yazisi` içeriği üretir; bu beceri onu sisteme takar.

## Girdiler

- **Zorunlu:** `slug` (URL-güvenli, kısa çizgili), TR başlık, EN başlık, kategori
- **İsteğe bağlı:** tarih (yoksa bugün), ikon adı, accent rengi (1–6)

## Adım adım akış

### 1. Slug ve kategori doğrula

```bash
# Slug çakışıyor mu?
grep -n "slug: '$SLUG'" assets/js/posts.js

# Kategori geçerli mi? (safety | money | business | jobs | ai)
grep "cat\.$CATEGORY" assets/js/i18n.js | head -2
```

Çakışma veya bilinmeyen kategori → dur, sor.

### 2. Şablonu oluştur

Admin panelindeki şablon üreteci kullanılabilir (`admin/index.html` → "Yeni Yazı"
sekmesi), ya da aşağıdaki yapıyı elle yaz:

```js
{
  slug: 'ornek-yazi',
  category: 'money',          // safety | money | business | jobs | ai
  date: '2026-09-02',
  accent: 2,                  // 1=navy 2=teal 3=slate 4=violet 5=amber 6=emerald
  icon: 'coin',               // app.js → ICONS kaydında mevcut ad
  orig: 'Bu yazının özgün katkısı tek cümleyle.',
  src: [
    { t: 'Kaynak Başlığı', u: 'https://...' },
    { t: 'İkinci Kaynak', u: 'https://...' },
    { t: 'Üçüncü Kaynak', u: 'https://...' }
  ],
  t: { tr: 'TR Başlık', en: 'EN Title', zh: '', hi: '', es: '', ar: '', fr: '', pt: '', ru: '', no: '' },
  e: { tr: 'TR özet (140–160 karakter)', en: 'EN excerpt', zh: '', hi: '', es: '', ar: '', fr: '', pt: '', ru: '', no: '' },
  b: {
    tr: [ 'Giriş.', { h: 'Ara Başlık' }, 'İçerik.' ],   // 30–55 blok, ≥1.200 kelime
    en: [ 'Intro.', { h: 'Subheading' }, 'Body.' ],      // 30–55 blok, ≥1.200 kelime
    zh: [''], hi: [''], es: [''], ar: [''],               // 3 blok, 250–1.200 karakter
    fr: [''], pt: [''], ru: [''], no: ['']
  }
}
```

**İki katmanlı model:** `tr` ve `en` tam makale (≥1.200 kelime, ≥30 blok). Kalan
8 dil özet katmanı: 3 blok, 250–1.200 karakter. Bu eksik değil, tasarım.

**Gövde blok tipleri:**
- `'metin'` — paragraf
- `{ h: 'Başlık' }` — ara başlık
- `{ ul: ['madde1', 'madde2'] }` — liste
- `{ note: 'uyarı' }` — uyarı kutusu
- `{ see: 'baska-slug' }` — iç bağlantı
- `{ aff: { t: 'Başlık', u: 'url', why: 'neden' } }` — ortaklık bağlantısı
- `**vurgu**` — kalın metin (paragraf/liste/not içinde)

### 3. posts.js'e ekle

En üste (en yeni başta) veya tarihe göre sıralı olarak ekle. Dizi virgüllerine
dikkat; `check.mjs` JSON hatalarını yakalamaz ama tarayıcı console yakalar.

### 4. sitemap.xml'e ekle

```xml
<url>
  <loc>https://qblogg.com/post.html?slug=ornek-yazi</loc>
  <lastmod>2026-09-02</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

### 5. RSS'i yenile

```bash
npm run rss
```

### 6. Denetimleri çalıştır

```bash
npm run check        # zorunlu: dil bütünlüğü, bağlantılar, id çakışması
npm run gorunurluk   # görünürlük kapısı: orig, src, kelime sayısı
npm run guvenlik     # XSS, CSP, veri koruma
```

Herhangi biri kırmızıysa commit etme.

### 7. Commit et

```bash
git add assets/js/posts.js sitemap.xml feed.xml
git commit -m "content: yeni yazı — $SLUG"
```

## Sık hatalar

| Belirti | Çözüm |
|---|---|
| `check: bilinmeyen data-i18n anahtarı` | `e` veya `t` alanı eksik dil kodu var |
| `gorunurluk: orig boş` | `orig` alanı doldurulmamış |
| `gorunurluk: kaynak yetersiz` | `src` dizisinde 3'ten az kaynak |
| TR kelime sayısı düşük | `tr` gövdesi 30 bloktan az; özet katmanı değil tam makale |
| 8 dil boş kalır | `zh hi es ar fr pt ru no` için 3'er blok özet yaz |
| Ikon görünmüyor | `app.js` → `ICONS` kaydını kontrol et; yeni ikon varsa oraya ekle |
