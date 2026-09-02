---
name: qblogg-admin
description: >
  QBLOGG admin panelini kullan — yazı listesi, yeni yazı JSON şablonu üretimi, site
  durumu, PIN yönetimi. "Admin paneli", "admin", "yönetici paneli", "yazı listesi
  göster", "şablon üret", "PIN değiştir", "admin/index.html" dediğinde bu beceriyi
  kullan. Editör ve kullanıcı sistemleri birbirinden ayrı; bu beceri editör tarafıdır.
owner: QBLOGG
---

# QBLOGG Yönetici Paneli

`admin/index.html` — tamamen tarayıcı tarafı, sunucu gerektirmez. Veriler yalnızca
editörün tarayıcısında durur; sunucuya hiçbir şey gönderilmez.

## Erişim

```
Yerel: http://localhost:8000/admin/index.html
Canlı: https://qblogg.com/admin/index.html   (robots: noindex)
```

Playwright ile ekran görüntüsü almak için:
```bash
node .claude/skills/run-qblogg/driver.mjs shot "admin/index.html" /tmp/qblogg-run
```
(PIN ekranı görünür; tarayıcı testinde PIN girişi gerekir)

## PIN sistemi

- **İlk açılış:** "PIN Belirle" formu — en az 4 karakter, iki kez girin.
- **Sonraki açılışlar:** "PIN Gir" formu.
- **PIN'i sıfırla:** Giriş ekranındaki "PIN'i sıfırla" bağlantısı → mevcut PIN doğrulanır → sıfırlanır.
- **Kilitlenme:** "Kilitle" düğmesi sayfayı yeniler (oturum biter).
- **Depolama:** `localStorage['qb_admin']` → `btoa('qb:' + pin)` — caydırıcı, güvenlik katmanı değil.
- **Sıfırlama (localStorage silinerek):** `localStorage.removeItem('qb_admin')` → sayfa yenile → PIN tekrar kurulur.

## Sekmeler

### 📋 Yazılar

`QB_POSTS` dizisinin canlı görünümü:

| Sütun | Açıklama |
|---|---|
| Başlık | Dışarı açılan bağlantı (post.html?slug=…) |
| Kategori | Renk etiket |
| Tarih | YYYY-AA-GG |
| Süre | dk (200 kelime/dk) |
| Kelime | 🔴 <600 / 🟡 600-1199 / 🟢 ≥1200 |
| Slug | Kopyalanabilir bağlantı (⧉ düğmesi) |

**Kategori filtresi:** "Tümü" veya tek kategori chip'i.

### ✍️ Yeni Yazı

Form → JSON şablonu oluşturur → kopyala → `assets/js/posts.js`'e yapıştır.

**Form alanları:** slug, kategori, tarih, ikon, accent (1-6), TR başlık, EN başlık,
TR özet, EN özet.

**Üretilen şablon** 10 dili (tr/en dolu, 8 dil boş) ve kaynak iskeletini içerir.
Şablonu yapıştırdıktan sonra `qblogg-yeni-yazi` akışını uygula (gorunurluk, check).

### 📊 Site Durumu

- Toplam yazı sayısı, aktif dil sayısı, öne çıkan yazı sayısı
- Hızlı bağlantılar: canlı site, blog, e-posta
- Terminal komutları referansı: `npm run check/dev/gorunurluk/guvenlik`

## Kullanıcı davranış sistemi (ayrı katman)

Admin paneli editör içindir. Kullanıcı tarafı `assets/js/behavior.js` modülüdür:
- `QB_BEH.isReturning()` — geri dönen ziyaretçi tespiti
- `QB_BEH.recommend(posts, n)` — kategori geçmişine göre öneri
- `QB_BEH.trackPackage('p1'|'p2'|'p3')` — hangi pakete bakıldığını sayar
- `QB_BEH.topPackage()` — en çok incelenen paket
- Depolama: `localStorage['qb_beh']` → `{ v, n, cats, read, pkgs }`

Admin panelinde davranış verilerini görmek için geliştirici konsolunda:
```js
JSON.parse(localStorage.getItem('qb_beh'))
```

## Teknik bağımlılıklar

Yükler (site kökünden göreli yollarla):
- `../assets/js/config.js` → `QB_CONFIG`
- `../assets/js/i18n.js` → `QB_LANGS`
- `../assets/js/posts.js` → `QB_POSTS`
- `./admin.js` → PIN, sekme, tablo, form mantığı

`check.mjs` admin/ alt klasörünü taramaz (yalnızca kök .html dosyaları). Admin
sayfası ana siteyle bağımsızdır; `main.css` kullanmaz.
