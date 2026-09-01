---
name: qblogg-sayfa-iskeleti
description: QBLOGG'un sekiz sayfasında (index, work, blog, post, gizlilik, kosullar, kalite, ornek — 404.html hariç, o kendi başına bir sayfa) tekrar eden menü ve altbilgi iskeletini senkron tutar. Kullanıcı menüye yeni bağlantı eklemek, bir nav öğesini yeniden adlandırmak, altbilgiye sayfa veya sosyal hesap eklemek, ya da yepyeni bir sayfa açıp mevcut header/footer iskeletine oturtmak istediğinde MUTLAKA bu beceriyi yükle. `npm run check` çiftlenen id/script yakalar ama eksik menü bağlantısını yakalamaz (CLAUDE.md madde 6) — sekiz dosyayı elle tek tek düzenlemek unutkanlığa açık, bu yüzden bu beceri kendi doğrulama betiğini taşır.
---

# qblogg-sayfa-iskeleti — menü/altbilgi senkronizasyonu

QBLOGG'da header ve footer ayrı bir bileşen dosyası değil; sekiz HTML
dosyasının her birine gömülü, elle tekrarlanan bir blok. Bu bilinçli bir
sadelik tercihi (derleme yok, dahil etme mekanizması yok) — ama bedeli
şu: bir menü değişikliği yedi kopyayı daha unutursa sessizce tutarsız
kalır, ve `check.mjs` bunu yakalamaz (yalnızca *çiftlenen* id/script'i
denetler, *eksik* bağlantıyı değil). Bu beceri o boşluğu kapatır.

## Kapsam — hangi sayfalar

`index.html`, `work.html`, `blog.html`, `post.html`, `gizlilik.html`,
`kosullar.html`, `kalite.html`, `ornek.html`. **`404.html` kasıtlı hariç** —
o bir hata sayfası, site iskeletini taşımaz.

## İki kasıtlı fark — bunları "hata" sanıp düzeltme

Sekiz sayfanın menü/altbilgi bloğu **karakter karakter aynı**, iki
istisna dışında:

1. **`aria-current="page"`** yalnızca o anki sayfanın kendi nav
   öğesinde durur (`index.html`'de "Ana Sayfa", `work.html`'de
   "Bizimle çalışın", `blog.html`/`post.html`'de "Blog"). `gizlilik`,
   `kosullar`, `kalite`, `ornek` üst menüde temsil edilmediği için
   hiçbirinde `aria-current` yok.
2. **Çapa bağlantıları** — `index.html` kendi bölümlerine çıplak çapa
   kullanır (`href="#services"`), çünkü zaten o sayfadadır. Diğer yedi
   sayfada aynı bağlantı `href="index.html#services"` olmak **zorunda** —
   yoksa ziyaretçi başka bir sayfadayken linke tıkladığında hiçbir şey
   olmaz (URL'ye `#services` eklenir ama index.html'e gitmez).

Bir değişiklik yaparken bu iki noktayı satır satır kopyalamayın —
`scripts/kontrol-iskelet.mjs` bunları otomatik normalize edip
karşılaştırır, siz düzenlemeye odaklanın.

## İş akışı

**1. Yeni görünür metin mi ekleniyor?** Önce `assets/js/i18n.js`'e on
dilde ekleyin (CLAUDE.md kural 1 — HTML'e dokunmadan önce). Yeni bir nav
öğesi, footer başlığı, buton metni hep bu kategoridedir.

**2. `index.html`'i referans alın.** Menü/altbilgi bloğunun "taban"
hali orada duruyor (kendi bölüm çapaları hariç). Değişikliği önce orada
yapın, sonra diğer yedi dosyaya taşıyın.

**3. Diğer yedi dosyaya uygularken çapaları çevirin.** `index.html`'de
`href="#x"` yazdıysanız, diğer sayfalarda `href="index.html#x"` olacak.
Aksini yaparsanız link kırılmaz ama işlevsiz kalır — `check.mjs` bunu
yakalamaz, tarayıcıda tıklamadan fark edilmez.

**4. `aria-current="page"` sadece kendi sayfasında kalsın.** Kopyala-
yapıştırırken bu satırı diğer sayfalara taşımayın; her sayfa kendi
öğesinde tutar ya da (gizlilik/kosullar/kalite/ornek gibi üst menüde
temsil edilmeyen sayfalarda) hiç taşımaz.

**5. Yeni bir üst-menü sayfası ekleniyorsa** (`nav-links`'e yeni bir
`<a>` eklemek): footer'ın "Site" listesine de ekleyin, `sitemap.xml`'e
ekleyin. `npm run check` sitemap–gerçek sayfa uyumunu zaten denetler,
ama menüye eklemeyi unutmayı denetlemez — 3. ve 4. adımı atlamayın.

**6. Doğrulayın:**

```bash
node .claude/skills/qblogg-sayfa-iskeleti/scripts/kontrol-iskelet.mjs
npm run check
```

İlk komut bu beceriye özel: sekiz sayfanın menü+altbilgi bloğunu
`index.html`'e karşı normalize edip karşılaştırır, yalnızca yukarıdaki
iki kasıtlı farkı görmezden gelir — her başka fark hataya sayılır.
İkincisi projenin genel sağlık kontrolü (id/script çiftlenmesi, sitemap,
i18n eksiksizliği); ikisi farklı şeyleri denetler, biri diğerinin yerini
tutmaz.

## Yepyeni bir sayfa açılıyorsa

Sıfırdan bir sayfa (`yeni.html`) oluşturuyorsanız, `index.html`'in
`<header class="site-header">…</header>` ve
`<footer class="site-footer">…</footer>` bloklarını olduğu gibi kopyalayın,
sonra:

- Tüm `#services`/`#flow`/`#packages` çapalarına `index.html` önekini ekleyin
  (yeni sayfa `index.html` değilse — adım 3'teki kural).
- `aria-current="page"` işaretini kaldırın, yalnızca sayfanın kendi nav
  öğesi varsa (üst menüde temsil ediliyorsa) oraya taşıyın.
- `<head>`'teki `<title>`, `og:title`, `og:description`, `canonical` ve
  `hreflang` bağlantılarını yeni sayfaya göre güncelleyin — bunlar
  iskeletin parçası değil, sayfaya özgü ve tek tek elle yazılır.
- `sitemap.xml`'e ekleyin, footer "Site" listesine ekleyin (üst menüye
  girecekse `nav-links`'e de).
- `scripts/check.mjs` script/id kontrolünü, `kontrol-iskelet.mjs` menü/
  altbilgi tutarlılığını doğrular — ikisini de çalıştırın.
