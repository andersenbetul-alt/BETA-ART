---
name: qblogg-davranis
description: >
  QBLOGG kullanıcı davranış sistemi — QB_BEH modülünü kullan, kişiselleştirilmiş
  öneri göster, paket takibi oku, geri dönen ziyaretçilere özel içerik sun. "Davranış
  sistemi", "behavior", "QB_BEH", "kişiselleştirme", "öneri motoru", "hangi pakete
  baktı", "geri dönen kullanıcı", "topPackage", "recommend" dediğinde bu beceriyi
  kullan. Sistem istemci taraflıdır; sunucuya veri gitmez.
owner: QBLOGG
---

# Kullanıcı davranış sistemi — QB_BEH

`assets/js/behavior.js` modülü. Tüm sayfalar yükler (index, blog, post, work).
Gizlilik: `gizlilik.html` → "İçerik tercihleri" bölümü.

## Veri modeli

```js
localStorage['qb_beh'] = {
  v: 1,                          // şema sürümü
  n: <sayı>,                     // toplam oturum sayısı (farklı sekme/pencere açılışı)
  cats: { safety:2, money:5 },   // kategori okuma puanları
  read: ['slug-1', 'slug-2'],    // okunmuş yazı slug'ları
  pkgs: { p1:1, p2:3 }          // paket görüntüleme sayıları
}
sessionStorage['qb_ses'] = '1'   // oturum içi işaretleyici (yenileme = aynı oturum)
```

## API

```js
// Modül window.QB_BEH olarak açılır; tüm sayfalardan ulaşılabilir
QB_BEH.boot()                    // sayfa açılışında otomatik çağrılır
QB_BEH.trackRead(slug, category) // bir yazı okunduğunda — post.html'de otomatik
QB_BEH.trackPackage('p1')        // paket görüntülendiğinde — index.html'de otomatik (IntersectionObserver)
QB_BEH.isReturning()             // → boolean: n >= 2 ise true
QB_BEH.recommend(QB_POSTS, 3)    // → Post[]: okunmamış, kategori puanına göre sıralı
QB_BEH.topPackage()              // → 'p1'|'p2'|'p3'|null: en çok görüntülenen paket
```

## Kişiselleştirme mantığı

### Ana sayfada öneri bloğu (index.html)

`renderHome()` içinde:
- `isReturning()` true → `recommend(POSTS, 3)` çağrılır
- Öneri varsa → `#blogKicker`, `#blogTitle`, `#blogSub` metinleri i18n'den
  `beh.kicker/title/sub` anahtarlarıyla değiştirilir, önerilen kartlar render edilir
- Öneri yoksa → standart "son 3 yazı" gösterilir
- i18n önce çalışır, `renderHome()` sonra; son write kazanır → kişiselleştirilmiş metin i18n'i geçersiz kılar

### Paket takibi (index.html)

`data-pkg="p1"`, `"p2"`, `"p3"` — plan kartlarında.

```html
<!-- index.html'deki inline script: -->
(function () {
  if (!window.QB_BEH || !window.IntersectionObserver) return;
  var seen = {};
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.dataset.pkg;
      if (id && !seen[id]) { seen[id] = 1; QB_BEH.trackPackage(id); }
      obs.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-pkg]').forEach(function (el) { obs.observe(el); });
})();
```

Kart görünüme girince (>%50) bir kez sayılır, sonra gözlem bırakılır.

## Yeni sayfa veya bölüme entegre etme

**Yeni sayfaya behavior modülü eklemek:**
```html
<script src="assets/js/behavior.js"></script>
<script src="assets/js/app.js"></script>
```
`boot()` modül yüklenince otomatik çalışır.

**Yeni CTA'ya paket takibi eklemek:**
```js
if (window.QB_BEH) QB_BEH.trackPackage('p2');
```

**Özel öneri bölümü render etmek:**
```js
var recs = window.QB_BEH ? QB_BEH.recommend(QB_POSTS, 5) : [];
// recs → Post dizisi: okunmamış, kategori puanı yüksek önce
```

## Geliştirici konsolu testleri

```js
// Mevcut durumu oku
JSON.parse(localStorage.getItem('qb_beh'))

// Geri dönen kullanıcı simüle et (oturumu artır)
var d = JSON.parse(localStorage.getItem('qb_beh')) || {};
d.n = 3; localStorage.setItem('qb_beh', JSON.stringify(d));
// → Sayfayı yenile → öneri bloğu görünmeli

// Temizle (sıfırdan test)
localStorage.removeItem('qb_beh');
sessionStorage.removeItem('qb_ses');
```

## Gizlilik uyumu

- Sunucuya **hiçbir veri** gönderilmez
- Tüm veri yalnızca ziyaretçinin tarayıcısında kalır
- Gizli mod / localStorage engeli → try/catch → sessizce atlanır (site çalışmaya devam eder)
- Veri açıklaması: `gizlilik.html` → "İçerik tercihleri" bölümü
- Silme talimatı: gizlilik.html'de tarayıcı ayarları yönlendirmesi
