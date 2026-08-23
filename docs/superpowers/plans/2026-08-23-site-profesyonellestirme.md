# Plan: Site profesyonelleştirme (7 fikir → 6 görev)

Tarih: 23.08.2026 · Dal: `claude/qblogg-web-sayfasi-upcarm` · BASE: f191bea
Kaynak karar: kullanıcı 7 maddelik öneri listesinin tamamını onayladı ("Hepsi: 1-7").

## Global Constraints (bağlayıcı — CLAUDE.md'den)

1. **Dil bütünlüğü:** Yeni her i18n anahtarı ON dile birden eklenir (tr, en, zh, hi,
   es, ar, fr, pt, ru, no). Çeviriler BU PLANDA verilmiştir — uygulayıcı çeviri
   uydurmaz, plandakini birebir kullanır.
2. **RTL:** Yön bağımlı CSS yok: `margin-inline-start`, `inset-inline-start`,
   `padding-inline`, `text-align:start` vb. `left/right/margin-left` yazmak hatadır.
3. **Metin HTML'de sabitlenmez:** görünen metin `data-i18n` ile sözlükten gelir;
   HTML'deki Türkçe yalnızca JS kapalıyken görünen yedektir. İstisna: gizlilik/kosullar
   tarzı TR+EN statik hukuk/içerik sayfalarının gövdesi (kalite.html, ornek.html bu sınıfa girer).
4. **Emoji yok, ikon SVG:** 24×24 ızgara, `fill="none"` (dolu marka işaretleri hariç),
   `stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak uç/birleşim. `→ ↑ ☾ ☀`
   metin işaretleri istisnadır. ✓ işareti istisna DEĞİLDİR — onay için SVG check kullanılır.
5. **Renk ve yazı boyutu değişkenden:** ham hex ve ham `rem` yazma; `var(--…)` ve
   `--fs-…` basamakları.
6. **Sayfa iskeleti:** menü/altbilgi değişikliği TÜM sayfalara birden uygulanır
   (index, work, blog, post, gizlilik, kosullar + bu planla eklenen kalite, ornek;
   404.html'de sadeleştirilmiş iskelet var, ona da bak).
7. **Rakamlar örnektir:** fiyat/kapsam kesin vaat gibi sunulmaz; mevcut `pack.note` bu işi görür.
8. **Sıfır bağımlılık:** yeni npm paketi, CDN, dış istek YOK.
9. **Doğrulama:** her görev commit'inden önce `npm run check` VE `npm run guvenlik`
   yeşil olmalı. Kırmızıyken commit yasak.
10. **Uydurma yasak:** siteye yazılan her olgusal iddia ya depodaki bir dosyadan ya
    bu plandan gelir. Yeni sayı, müşteri, sonuç iddiası üretilmez.
11. Commit mesajı Türkçe, sonunda şu iki satır:
    `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` ve
    `Claude-Session: https://claude.ai/code/session_01RdLsHwXYNtYPnm5bCgyqCU`
12. Push YAPILMAZ — commit yerelde kalır, push'u koordinatör yapar.

## Ortak bilgi

- `config.js`: `mailTo: 'hello@qblogg.com'`, `siteUrl: 'https://qblogg.com'`.
- Node denetim betikleri `posts.js`/`i18n.js`'i vm sandbox ile yükler — örnek desen
  `scripts/check.mjs` başındaki `load()`.
- Yeni statik sayfa şablonu: `gizlilik.html` (head boilerplate, canonical+hreflang
  bloğu, `wrap--narrow`, `section-head`, `article-body article-body--plain`, aynı
  script listesi: config.js, i18n.js, posts.js, app.js).
- `vercel.json` buildCommand `cp` listesi dağıtıma giren dosyaları sayar — yeni kök
  dosya eklenince oraya da eklenir.
- `sitemap.xml` şu an 15 URL; check.mjs sitemap↔sayfa uyumunu denetler.

---

## Task 1 — security.txt + yazdırma CSS'i (paket iş)

**Dosyalar:** `.well-known/security.txt` (yeni), `assets/css/main.css`,
`vercel.json`, `sitemap.xml` DEĞİL (security.txt sitemap'e girmez).

1. `.well-known/security.txt` (RFC 9116):
   ```
   Contact: mailto:hello@qblogg.com
   Expires: 2027-08-23T00:00:00.000Z
   Preferred-Languages: tr, en, no
   Canonical: https://qblogg.com/.well-known/security.txt
   ```
   Not: imza (signature) alanı EKLENMEZ — PGP anahtarımız yok, uydurma yasak.
2. `vercel.json` buildCommand'a, `robots.txt` kopyasından sonra:
   `&& mkdir -p dist/.well-known && cp _src/.well-known/security.txt dist/.well-known/`
   (mevcut `cp` zincirinin biçimini boz­ma; tek satır kalır).
3. `main.css` sonuna `@media print` bloğu:
   - gizle: `.site-header`, `.site-footer`, `.skip`, `#toast`, `.post-cta`,
     `.article-foot`, `.btn`, `#themeToggle`, `.reveal` animasyonu etkisiz
     (`opacity:1; transform:none`).
   - gövde: `body{background:#fff;color:#000}`; `.article-body a[href^="http"]::after{content:" (" attr(href) ")"; font-size:.85em}` —
     yalnız makale gövdesinde, dipnot niyetine.
   - `.article-cover` yazdırmada gizlenir (mürekkep israfı).
   - Renk değişkeni kuralı print bloğunda esnetilebilir (kâğıt = beyaz sabit);
     bunun dışında kural 5 geçerli.
4. Doğrulama: `npm run check` + `npm run guvenlik` yeşil; `python3 -c` ile değil,
   tarayıcı gerekmez — `node -e` ile vercel.json'ın hâlâ geçerli JSON olduğunu doğrula.

## Task 2 — Yazı sayfasına İçindekiler (TOC)

**Dosyalar:** `assets/js/app.js`, `assets/js/i18n.js`, `assets/css/main.css`.

1. `i18n.js`'e ON dile `posts.toc` anahtarı — birebir bu değerler:
   tr `İçindekiler` · en `Contents` · zh `目录` · hi `विषय-सूची` · es `Índice` ·
   ar `المحتويات` · fr `Sommaire` · pt `Índice` · ru `Содержание` · no `Innhold`.
2. `app.js → renderPost()`: gövdeyi üretirken blokları indeksle. `{h:'…'}` blokları
   `<h2 id="b-<i>">` alır (`i` = gövde dizisindeki sıra). Gövdede **3 veya daha çok**
   `h` bloğu varsa kapaktan sonra, gövdeden önce şunu bas:
   ```html
   <nav class="article-toc" aria-label="<posts.toc>">
     <h2><posts.toc></h2>
     <ol><li><a href="#b-N">başlık</a></li>…</ol>
   </nav>
   ```
   3'ten az `h` varsa TOC hiç basılmaz (özet katmanı dilleri böyle korunur).
   Mevcut `blockHTML` imzasını bozmadan yap (ör. `blockHTML(block, i)` ikinci
   parametre; yalnız `h` dalında kullanılır).
   TOC bağlantı metni `esc()` ile kaçırılır. `#b-N` tıklanınca URL hash değişir —
   ekstra JS gerekmez, native davranış yeter.
3. `main.css`: `.article-toc` (kart görünümü: `var(--card)` zemin, `var(--line)`
   çerçeve, `border-radius` mevcut kartlarla aynı ölçek; iç `ol` sayılı liste,
   `padding-inline-start` ile); `.article-body h2[id]{scroll-margin-top:90px}`
   (sabit header payı — mevcut değer varsa onu kullan). Mantıksal özellikler (kural 2).
4. Doğrulama: check+guvenlik yeşil. Playwright ile
   `post.html?slug=yazarak-para-kazanma-platformlari&lang=tr` aç → TOC görünür,
   ilk bağlantı tıklanınca ilgili `h2` viewport'a gelir; `&lang=zh` aç → TOC yok
   (3 blokluk özet katmanı); `&lang=ar` aç → hizalama sağdan (RTL) doğru.

## Task 3 — Paket karşılaştırma tablosu

**Dosyalar:** `index.html`, `assets/js/i18n.js`, `assets/css/main.css`.

`index.html` `#packages` bölümünde `.plans`'tan SONRA, `pack.note`'tan ÖNCE tablo.
Sütun başlıkları mevcut `p1.n / p2.n / p3.n` anahtarlarını `data-i18n` ile yeniden
kullanır (yeni anahtar açma). Hücre değerleri dilden bağımsız rakam/işaret.

**Satırlar ve hücreler (kaynağı mevcut p1/p2/p3 özellik metinleri + SSS `wa3`;
başka satır EKLENMEZ):**

| anahtar | Tek Makale | Büyüme | Stüdyo |
|---|---|---|---|
| cmp.r1 (aylık makale) | `1*` | `4` | `8` |
| cmp.r2 (aylık LinkedIn postu) | — | `20` | ✓† |
| cmp.r3 (newsletter) | — | — | ✓ |
| cmp.r4 (yayın dili) | `1` | `1` | `10` |
| cmp.r5 (kısa video + YouTube taslağı) | — | — | ✓ |
| cmp.r6 (aylık performans raporu) | — | ✓ | ✓† |
| cmp.r7 (özel içerik stratejisti) | — | — | ✓ |
| cmp.r8 (revizyon, içerik başına) | `2` | `2` | `2` |

- ✓ = satır içi SVG check (24×24, `stroke="currentColor"`, `stroke-width="1.7"`,
  `fill="none"`, yuvarlak uç; görüntü boyutu ~18px, `color:var(--brand-2-ink)`;
  koyu temada `var(--brand-2)` kullanılabilir — mevcut ikon rengi desenine uy).
  Erişilebilirlik: ✓ hücresi `<span class="sr-only" data-i18n="cmp.yes">` +
  `aria-hidden` SVG; — hücresi `<span class="sr-only" data-i18n="cmp.no">` +
  `<span aria-hidden="true">—</span>`. main.css'te `.sr-only`/görsel gizleme
  yardımcısı yoksa ekle (standart clip deseni).
- `*` ve `†` işaretleri tabloda üst simge; tablonun altında iki küçük dipnot satırı:
  `cmp.once` (`*`) ve `cmp.plus` (`†`), `flow-note` benzeri küçük stil.
- Tablo `<caption>` görünür ve `cmp.title` taşır; ilk sütun başlığı `cmp.feature`;
  satır etiketleri `<th scope="row">`, sütunlar `<th scope="col">`.
- Sarıcı: `<div class="table-wrap">` → `overflow-x:auto` (dar ekranda gövde yatay
  kaydırmaz, tablo kendi içinde kayar). `.cmp-table` stilinde çizgiler `var(--line)`,
  vurgulu orta sütun (`plan--featured` ile aynı vurgu mantığı) İSTEĞE BAĞLI —
  sadelik önce gelir, şart değil.

**Yeni i18n anahtarları (ON dil, birebir):**

- `cmp.title`: tr `Paketleri yan yana karşılaştırın` · en `Compare the packages side by side` · zh `并排比较各套餐` · hi `पैकेजों की तुलना करें` · es `Compara los paquetes lado a lado` · ar `قارن الباقات جنبًا إلى جنب` · fr `Comparez les forfaits côte à côte` · pt `Compare os pacotes lado a lado` · ru `Сравните пакеты рядом` · no `Sammenlign pakkene side om side`
- `cmp.feature`: tr `Kapsam` · en `What you get` · zh `包含内容` · hi `क्या मिलेगा` · es `Qué incluye` · ar `ما الذي تحصل عليه` · fr `Ce qui est inclus` · pt `O que está incluído` · ru `Что входит` · no `Hva du får`
- `cmp.r1`: tr `Makale (aylık)` · en `Articles per month` · zh `每月文章数` · hi `प्रति माह लेख` · es `Artículos al mes` · ar `مقالات شهريًا` · fr `Articles par mois` · pt `Artigos por mês` · ru `Статей в месяц` · no `Artikler per måned`
- `cmp.r2`: tr `LinkedIn postu (aylık)` · en `LinkedIn posts per month` · zh `每月 LinkedIn 帖子` · hi `प्रति माह LinkedIn पोस्ट` · es `Publicaciones de LinkedIn al mes` · ar `منشورات LinkedIn شهريًا` · fr `Posts LinkedIn par mois` · pt `Posts no LinkedIn por mês` · ru `Постов в LinkedIn в месяц` · no `LinkedIn-innlegg per måned`
- `cmp.r3`: tr `Newsletter` · en `Newsletter` · zh `新闻通讯` · hi `न्यूज़लेटर` · es `Newsletter` · ar `النشرة البريدية` · fr `Newsletter` · pt `Newsletter` · ru `Рассылка` · no `Nyhetsbrev`
- `cmp.r4`: tr `Yayın dili` · en `Publishing languages` · zh `发布语言` · hi `प्रकाशन भाषाएँ` · es `Idiomas de publicación` · ar `لغات النشر` · fr `Langues de publication` · pt `Idiomas de publicação` · ru `Языки публикации` · no `Publiseringsspråk`
- `cmp.r5`: tr `Kısa video senaryosu + YouTube taslağı` · en `Short-video script + YouTube outline` · zh `短视频脚本 + YouTube 大纲` · hi `शॉर्ट वीडियो स्क्रिप्ट + YouTube रूपरेखा` · es `Guion de vídeo corto + esquema de YouTube` · ar `نص فيديو قصير + مخطط YouTube` · fr `Script de vidéo courte + plan YouTube` · pt `Roteiro de vídeo curto + esboço para YouTube` · ru `Сценарий коротких видео + план для YouTube` · no `Kortvideomanus + YouTube-utkast`
- `cmp.r6`: tr `Aylık performans raporu` · en `Monthly performance report` · zh `月度效果报告` · hi `मासिक प्रदर्शन रिपोर्ट` · es `Informe mensual de rendimiento` · ar `تقرير أداء شهري` · fr `Rapport de performance mensuel` · pt `Relatório mensal de desempenho` · ru `Ежемесячный отчёт о результатах` · no `Månedlig resultatrapport`
- `cmp.r7`: tr `Özel içerik stratejisti` · en `Dedicated content strategist` · zh `专属内容策略师` · hi `समर्पित कंटेंट रणनीतिकार` · es `Estratega de contenidos dedicado` · ar `خبير استراتيجية محتوى مخصص` · fr `Stratège de contenu dédié` · pt `Estrategista de conteúdo dedicado` · ru `Персональный контент-стратег` · no `Dedikert innholdsstrateg`
- `cmp.r8`: tr `Revizyon hakkı (içerik başına)` · en `Revision rounds per piece` · zh `每篇修改轮数` · hi `प्रति सामग्री संशोधन` · es `Rondas de revisión por pieza` · ar `جولات المراجعة لكل محتوى` · fr `Tours de révision par contenu` · pt `Rodadas de revisão por peça` · ru `Раундов правок на материал` · no `Revisjonsrunder per innhold`
- `cmp.yes`: tr `Dahil` · en `Included` · zh `包含` · hi `शामिल` · es `Incluido` · ar `مشمول` · fr `Inclus` · pt `Incluído` · ru `Включено` · no `Inkludert`
- `cmp.no`: tr `Kapsamda değil` · en `Not included` · zh `不包含` · hi `शामिल नहीं` · es `No incluido` · ar `غير مشمول` · fr `Non inclus` · pt `Não incluído` · ru `Не входит` · no `Ikke inkludert`
- `cmp.once`: tr `Tek seferlik teslim; aylık paket değildir.` · en `One-off delivery, not a monthly plan.` · zh `一次性交付，非包月。` · hi `एकमुश्त डिलीवरी; मासिक पैकेज नहीं।` · es `Entrega única; no es un plan mensual.` · ar `تسليم لمرة واحدة، وليست باقة شهرية.` · fr `Livraison unique, pas un forfait mensuel.` · pt `Entrega única; não é um plano mensal.` · ru `Разовая поставка, не месячный план.` · no `Engangsleveranse, ikke en månedspakke.`
- `cmp.plus`: tr `Aylık paketlerde üst paket, alttaki paketin kapsamını da içerir.` · en `Between the monthly plans, the larger one includes everything in the smaller.` · zh `在包月套餐中，较大的套餐包含较小套餐的全部内容。` · hi `मासिक पैकेजों में बड़ा पैकेज छोटे पैकेज की सभी चीज़ें भी शामिल करता है।` · es `Entre los planes mensuales, el mayor incluye todo lo del menor.` · ar `في الباقات الشهرية، تشمل الباقة الأكبر كامل محتوى الباقة الأصغر.` · fr `Entre les forfaits mensuels, le plus grand inclut tout le contenu du plus petit.` · pt `Entre os planos mensais, o maior inclui tudo do menor.` · ru `Из месячных пакетов больший включает всё из меньшего.` · no `Av månedspakkene inkluderer den største alt i den minste.`

Doğrulama: check+guvenlik yeşil; Playwright ile `index.html?lang=tr` → tablo
görünür, `?lang=ar` → RTL'de taşma/yön bozukluğu yok, 390px viewport'ta gövde
yatay kaydırmıyor (tablo kendi sarıcısında kayıyor).

## Task 4 — RSS beslemesi

**Dosyalar:** `scripts/rss-uret.mjs` (yeni), `feed.xml` (yeni, üretilip commit
edilir), `package.json` (`"rss"` betiği), `index.html` + `blog.html` + `post.html`
(autodiscovery link), `vercel.json` (cp listesine `feed.xml`), `CLAUDE.md`
("Yeni blog yazısı" akışına tek satır: `npm run rss` ile feed'i yenile).

1. `scripts/rss-uret.mjs`: `check.mjs`'teki vm-sandbox desenini kopyalayarak
   `config.js` + `posts.js` yükle. RSS 2.0 üret:
   - kanal: title `QBLOGG`, link `siteUrl`, description = TR `meta.desc` değeri
     sözlükten (i18n.js'i de sandbox'a yükle), `language` `tr`,
     `lastBuildDate` = en yeni yazının tarihi (RFC 822; `new Date(date).toUTCString()`).
     Sabit "bugün" damgası KULLANMA — aynı girdiden aynı bayt çıkmalı (yeniden üretilebilirlik).
   - öğe (tarihe göre yeni→eski, tüm yazılar): title = `t.tr`, link =
     `siteUrl + '/post.html?slug=' + slug`, guid = link (`isPermaLink="true"`),
     pubDate = yazının `date`'i, description = `e.tr`.
   - XML kaçışı: `& < > " '` beşi de. Çıktıyı `feed.xml`'e yaz, sonunda
     kaç öğe yazdığını stdout'a bas.
2. `package.json` scripts: `"rss": "node scripts/rss-uret.mjs"`.
3. Üç sayfanın `<head>`'ine:
   `<link rel="alternate" type="application/rss+xml" title="QBLOGG" href="https://qblogg.com/feed.xml">`
4. `vercel.json` cp listesine `_src/feed.xml`.
5. Doğrulama: `npm run rss` iki kez üst üste → `git diff feed.xml` boş
   (determinizm); check+guvenlik yeşil; `node --input-type=module -e` ile feed.xml'i
   basit regex/parse kontrolünden geçir (öğe sayısı = posts.js'teki yazı sayısı = 10).

## Task 5 — kalite.html (Kalite güvencesi sayfası)

**Dosyalar:** `kalite.html` (yeni), `assets/js/i18n.js` (`footer.quality` ×10),
6 sayfa + 404 + (henüz yoksa) — altbilgi bağlantısı, `sitemap.xml` (+1 URL),
`vercel.json` (cp listesine `_src/kalite.html`).

1. Şablon: `gizlilik.html` birebir iskelet (head, hreflang×10+x-default, canonical
   `./kalite.html`, aynı script listesi, `wrap--narrow`, `article-body--plain`).
   `<html lang="tr">`; robots `index, follow`.
2. İçerik TR + altında EN (gizlilik desenindeki gibi tek sayfada iki dil; başa
   `article-note` ile "bu sayfa TR+EN yayınlanıyor" notu — gizlilikteki notun uyarlaması).
   **İçerik yalnız şu doğrulanabilir olgulardan yazılır** (kaynak: depo):
   - Her yazı yayına girmeden 16 maddelik görünürlük denetiminden geçer
     (`engine/visibility.mjs`; sitedeki yazılara da aynı kural: `npm run gorunurluk`).
   - Her yazıda özgün katkı alanı (`orig`) ve en az üç kaynak (`src`) zorunludur;
     adresi doğrulanmamış kaynak bağlantısız, gerekçesiyle yazılır. Para/kariyer
     konularında üç kaynak kural.
   - Fiyat ve rakamlar örnek olarak işaretlenir; kesin vaat dili kullanılmaz.
   - 10 dilde yayın; tr+en tam makale, diğer sekiz dil bilinçli özet katmanı.
   - Site çerez/izleyici çalıştırmaz (gizlilik sayfasıyla tutarlı ifade).
   - Otomatik denetimler: dil bütünlüğü, kırık bağlantı, güvenlik taraması
     (XSS/JSON-LD/karma içerik), erişilebilirlik ölçümleri (44px dokunma hedefi,
     ölçülmüş kontrast oranları) her değişiklikte çalışır.
   - Her içerikte iki revizyon dahildir (SSS `wa3` ile tutarlı).
   Uygulayıcı bu dosyaları OKUR ve yalnız orada olanı yazar; sayı uydurmaz,
   müşteri/başarı hikâyesi uydurmaz. Ton: gizlilik.html'deki gibi sade, net.
   Uzunluk: TR ~5-7 kısa bölüm, EN aynı yapının çevirisi.
3. `footer.quality` ×10 (birebir): tr `Kalite güvencesi` · en `Quality assurance` ·
   zh `质量保障` · hi `गुणवत्ता आश्वासन` · es `Garantía de calidad` · ar `ضمان الجودة` ·
   fr `Garantie qualité` · pt `Garantia de qualidade` · ru `Гарантия качества` ·
   no `Kvalitetssikring`.
4. Altbilgi: TÜM sayfalarda (index, work, blog, post, gizlilik, kosullar, kalite,
   404 — 404'te altbilgi varsa) "Site" sütununa
   `<li><a href="kalite.html" data-i18n="footer.quality">Kalite güvencesi</a></li>`
   (post/404 kök-göreli yol kullanıyorsa o sayfadaki mevcut yol biçimine uy).
5. `sitemap.xml`: `https://qblogg.com/kalite.html` girdisi (mevcut girdilerin
   biçimiyle; hreflang alternates deseni sitemap'te varsa aynı desen).
6. Doğrulama: check+guvenlik yeşil (check, sitemap↔sayfa uyumunu ve data-i18n
   anahtarlarını denetler); Playwright: `kalite.html?lang=ar` → iskelet RTL doğru.

## Task 6 — ornek.html (Örnek teslimat sayfası)

**Dosyalar:** `ornek.html` (yeni), `assets/js/i18n.js` (`footer.sample` ×10),
tüm sayfalarda altbilgi bağlantısı, `sitemap.xml` (+1), `vercel.json` (cp'ye
`_src/ornek.html`).

1. Şablon: Görev 5 ile aynı iskelet; canonical `./ornek.html`.
2. Amaç: "tek araştırmadan yedi çıktı" iddiasını SOMUT göstermek. Malzeme depoda
   GERÇEK olarak var: `content/yazarak-para-kazanma-platformlari/tr/` içindeki
   7 türev dosya (linkedin.md, sosyal.md, kisa-videolar.md, newsletter.md,
   podcast.md, youtube.md, devam-yazilari.md) + sitedeki kaynak yazı
   (`post.html?slug=yazarak-para-kazanma-platformlari`).
   Sayfa: kısa giriş (bu sayfadaki her şey gerçek üretim hattından, kurgu değil) →
   kaynak yazıya bağlantı → her türev için bir bölüm: türün adı + dosyadan SEÇME
   kısa alıntı (1 öğe / birkaç satır; tamamı değil) → her bölümde not niteliğinde
   tek cümle: tamamı brief sonrası paylaşılır. Alıntılar dosyadan birebir kopyalanır,
   yeniden yazılmaz; markdown'daki `**` vurgular HTML `<strong>`'a çevrilir, başka
   düzenleme yapılmaz. TR bölümünün altında EN bölümü: yapı aynı, alıntılar TR kalır
   (kaynak materyal TR — EN metin bunu açıkça söyler: "excerpts are shown in Turkish,
   the original production language"; alıntı çevirisi UYDURULMAZ).
3. `footer.sample` ×10 (birebir): tr `Örnek teslimat` · en `Sample deliverable` ·
   zh `交付示例` · hi `नमूना डिलीवरी` · es `Ejemplo de entrega` · ar `نموذج تسليم` ·
   fr `Exemple de livrable` · pt `Exemplo de entrega` · ru `Пример поставки` ·
   no `Eksempel på leveranse`.
4. Altbilgi "Site" sütununa `<li><a href="ornek.html" data-i18n="footer.sample">…</a></li>`
   — Görev 5'in eklediği kalite satırının ALTINA (Görev 5 tamamlanmış olacak;
   çakışma yok, sıralı çalışılıyor). ornek.html'in kendi altbilgisi de her iki
   yeni bağlantıyı taşır; kalite.html'in altbilgisine de ornek bağlantısı eklenir.
5. `sitemap.xml` +1; doğrulama Görev 5 ile aynı + Playwright ile ornek.html'de
   alıntı bölümlerinin sayısı 7.

---

## Görev sırası ve model önerisi

T1 (ucuz model) → T2 → T3 → T4 (orta model) → T5 → T6 (içerik ağırlıklı, güçlü model).
T5 ve T6 aynı altbilgi dosyalarına dokunur → kesinlikle sıralı, paralel değil.

## Task 7 — Stripe ödeme bağlantıları (site tarafı)

Kaynak: kullanıcı talebi "ODEME SISTEMI KUR" (23.08). Stripe MCP anahtarı yazma
izni vermedi; ürün/bağlantı oluşturma kullanıcı panelinde. Site, bağlantılar
config'e yapıştırıldığı anda çalışır hâle getirilir.

**Dosyalar:** `assets/js/config.js`, `assets/js/app.js`, `assets/js/i18n.js`,
`gizlilik.html`, `docs/odeme-sistemi.md` (yeni).

1. `config.js`: `prices` bloğunun altına yeni blok (aynı yorum üslubuyla):
   ```js
   /* Stripe Payment Link adresleri. Dolu olan pakette "Kartla öde" düğmesi
      çıkar; boş bırakılan pakette yalnız brief akışı kalır.
      Bağlantı üretimi: docs/odeme-sistemi.md */
   payLinks: { p1: '', p2: '', p3: '' },
   ```
2. `app.js`: config okunan yerde `PAY = QB_CONFIG.payLinks || {}`. Sayfa
   kurulumunda (`applySocial` benzeri desenle) her plan kartına bak:
   `#packages .plan` sırası p1/p2/p3. `PAY.<k>` doluysa CTA düğmesinin ALTINA
   ikinci bağlantı ekle:
   `<a class="btn btn--ghost btn--block" href="<link>" rel="noopener" data-i18n="pay.card">Kartla öde</a>`
   (target `_blank` KULLANMA — ödeme aynı sekmede; `rel="noopener"` zararsız).
   Boşsa hiçbir şey ekleme. HTML'e statik düğme koyma — JS ile, çünkü adres
   config'ten geliyor ve boş hâlde ölü bağlantı istemiyoruz (sosyal bağlantı
   deseniyle aynı gerekçe).
3. `i18n.js` ON dil, birebir:
   - `pay.card`: tr `Kartla öde` · en `Pay by card` · zh `银行卡支付` ·
     hi `कार्ड से भुगतान करें` · es `Pagar con tarjeta` · ar `الدفع بالبطاقة` ·
     fr `Payer par carte` · pt `Pagar com cartão` · ru `Оплатить картой` ·
     no `Betal med kort`
   - `pay.note`: tr `Ödeme, Stripe'ın güvenli sayfasında tamamlanır.` ·
     en `Payment is completed on Stripe's secure page.` ·
     zh `付款在 Stripe 的安全页面上完成。` ·
     hi `भुगतान Stripe के सुरक्षित पेज पर पूरा होता है।` ·
     es `El pago se completa en la página segura de Stripe.` ·
     ar `يُستكمل الدفع في صفحة Stripe الآمنة.` ·
     fr `Le paiement s'effectue sur la page sécurisée de Stripe.` ·
     pt `O pagamento é concluído na página segura da Stripe.` ·
     ru `Оплата завершается на защищённой странице Stripe.` ·
     no `Betalingen fullføres på Stripes sikre side.`
   `pay.note` yalnız en az bir payLink doluyken, `pack.note`un üstünde küçük
   satır olarak JS ile basılır (`flow-note` sınıfı; `#packages` içinde id'li boş
   `<p hidden>` konabilir — JS doldurup gösterir; `data-i18n` ile).
4. `gizlilik.html`: "Formlar" bölümünün altına kısa TR paragraf + EN karşılığı
   (sayfadaki EN bölümünün aynı yerine): ödeme bağlantısı kullanılırsa işlem
   Stripe'ın kendi sayfasında gerçekleşir; kart bilgisi bu siteye girmez, bu
   site ödeme verisi görmez/saklamaz; Stripe'ın gizlilik politikası geçerlidir.
   İddiayı büyütme (Stripe adına taahhüt yazma).
5. `docs/odeme-sistemi.md` (yeni): kullanıcı için adım adım panel kılavuzu:
   Stripe Dashboard → Product catalogue → üç ürün (Tek Makale €150 tek sefer;
   Büyüme €900/ay yinelenen; Stüdyo €2.500/ay yinelenen) → her biri için
   Payment Link oluşturma → linklerin `config.js → payLinks`'e yapıştırılması →
   test önerisi. Ücret notu: CLAUDE.md'deki Stripe Norveç kesintisi oranını
   aynen aktar ve "stripe.com bu ortamdan doğrulanamadı" kaydını koru. MCP
   anahtarına yazma izni verilirse ürünleri Claude'un da açabileceği not düşülür.
6. CSP değişmez (payment link düz gezinme bağlantısıdır, connect-src gerekmez) —
   bunu kılavuza da yaz.
7. Doğrulama: check+guvenlik yeşil; Playwright: payLinks boşken kartlarda ek
   düğme YOK; scratch'te config'e sahte `https://buy.stripe.com/test` doldurup
   düğmenin çıktığını ve `pay.note`un göründüğünü doğrula, sonra config'i boş
   hâline GERİ AL (commit'e boş hâli girer).
