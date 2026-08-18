# QBLOGG — proje hafızası

Sürekli geliştirilen bir proje. Bu dosya, her yeni oturumun projeyi baştan çözmek
zorunda kalmaması içindir. Bir kural değişirse burayı da güncelleyin.

## Proje nedir

QBLOGG, şirketlere içerik hattı satan bir stüdyonun tanıtım + blog sitesidir:
SEO blog yazısı, LinkedIn serisi, sosyal içerik, newsletter ve çok dilli yayın.
Sitenin işi trafik toplamak değil, **brief formunu doldurtmaktır**.

Hedef kitle: kendi içerik ekibi olmayan, düzenli yayın yapmak isteyen KOBİ ve
SaaS şirketleri. İkincil kitle: stüdyoya katılmak isteyen yazarlar.

## Teknik yapı

Saf HTML + CSS + JavaScript. **Derleme adımı, çatı (framework) ve bağımlılık yok** —
bu bilinçli bir tercih: site herhangi bir statik sunucuya olduğu gibi yüklenir.
Yeni bağımlılık eklemeden önce bunun gerçekten gerekli olduğunu doğrulayın.

```
index.html          Tanıtım: hero, hizmetler, içerik akışı, paketler, son yazılar, bülten
work.html           Bizimle çalışın: marka briefi + yazar başvurusu, süreç, SSS
blog.html           Yazı listesi: arama + kategori filtresi
post.html           Yazı detayı (?slug=... ile)
assets/js/config.js Yayın ayarları: e-posta, alan adı, sosyal hesaplar, fiyatlar, lead magnet
assets/css/main.css Tek stil dosyası; tüm renkler :root değişkenlerinden gelir
assets/js/i18n.js   Dil listesi (QB_LANGS) + 10 dilde metinler (QB_I18N)
assets/js/posts.js  Blog içeriği (QB_POSTS): her yazı 10 dilde
assets/js/app.js    Dil, tema, liste/arama/filtre, yazı sayfası, sekmeler, formlar
scripts/check.mjs   Proje sağlık kontrolü
scripts/gorunurluk.mjs Yayınlanmış yazıları görünürlük kurallarına karşı denetler

engine/             Curiosity Engine (site değil, üretim hattı)
  schema.sql        Sinyal → konu → makale tabloları
  schema-billing.sql Ödeme: hesap, ürün, abonelik, kredi defteri, yetki, webhook
  billing.mjs       Kredi bakiyesi, yetki, webhook tekilliği, para biçimi
  visibility.mjs    16 maddelik görünürlük kuralının çalışan denetimi
  run.mjs           Topla → kümele → puanla → kuyruğa al
  write.mjs         Araştırma → makale → SEO → gelir → kalite + görünürlük kapısı
```

## Değişmez kurallar

1. **Dil bütünlüğü.** Diller: tr, en, zh, hi, es, ar, fr, pt, ru, no. Yeni bir metin
   anahtarı eklerken **on dile birden** eklenir. Eksik anahtar sessizce İngilizceye
   düşer; bu bir güvenlik ağıdır, çözüm değildir.
2. **Arapça RTL.** Yön bağımlı CSS yazmayın: `margin-left` yerine `margin-inline-start`,
   `left` yerine `inset-inline-start`. Yeni bir bölüm eklediğinizde Arapçaya geçip bakın.
3. **Metin HTML'de sabitlenmez.** Görünen her metin `data-i18n` (veya `data-i18n-attr`,
   `data-i18n-title`, `data-i18n-content`) ile sözlükten gelir. HTML'deki Türkçe metinler
   yalnızca JavaScript kapalıyken görünen yedeklerdir.
4. **Renkler değişkenlerden gelir.** Doğrudan hex yazmayın; `var(--brand)`, `var(--text)`
   gibi değişkenleri kullanın ki koyu tema kendiliğinden çalışsın.
5. **Sayfa iskeleti dört dosyada tekrar eder.** Menü veya altbilgiyi değiştirirken
   dördünü birden güncelleyin (`index`, `work`, `blog`, `post`). `check.mjs` çiftlenen
   id ve script'leri yakalar ama eksik menü bağlantısını yakalamaz.
6. **Rakamlar örnek olarak işaretlenir.** Paket fiyatları ve blog yazılarındaki ücret
   bilgileri araştırma/örnek veridir. Kesin vaat gibi sunmayın; abartılı iddia bu işte
   en pahalı hatadır.

## Çalışma akışı

```bash
npm run dev      # http://localhost:8000
npm run check    # zorunlu: commit öncesi çalıştırın
```

`npm run gorunurluk` yayınlanmış yazıları `engine/visibility.mjs` kurallarına karşı
denetler (tek yazı: `node scripts/gorunurluk.mjs <slug>`). Motorun taslaklara uyguladığı
ölçütü sitenin kendi yazılarına da uygular — kendi kuralımıza uymayan bir hattı
kimseye satamayız.

`scripts/check.mjs` şunları doğrular: 10 dilde anahtar eşitliği ve boş değer olmaması,
her yazının her dilde başlık/özet/gövdesi, çiftlenen id ve script, HTML'de kullanılan
ama sözlükte olmayan anahtarlar, kırık yerel bağlantılar, sitemap ile gerçek sayfa/slug
uyumu. Kontrol kırmızıysa commit etmeyin.

Tarayıcı testi gerektiğinde Playwright, Chromium ile kullanılabilir
(`executablePath: '/opt/pw-browsers/chromium'`); ayrıca kurulum yapmayın.

## Sık yapılan işler

**Yeni blog yazısı:** `assets/js/posts.js` dizisine nesne ekleyin — `slug`, `category`
(sözlükte `cat.<ad>` olmalı), `date` (YYYY-AA-GG), `accent` (1–6), `icon`, sonra
`t` / `e` / `b` alanlarını on dilde doldurun. `sitemap.xml`'e de ekleyin.

Gövde blokları: düz dize (paragraf), `{h:'…'}` (ara başlık), `{ul:[…]}` (liste),
`{note:'…'}` (uyarı kutusu), `{see:'slug'}` (metin içi yazı bağlantısı — küme
bağlantısı sayılır, `check.mjs` olmayan slug'ı yakalar).

Ayrıca iki alan görünürlük kuralı gereği doldurulur:
- `orig` — bu sayfanın özgün katkısı tek cümleyle (kendi verisi, testi, tablosu).
  Yoksa `gorunurluk.mjs` yazıyı `yayinlanamaz` işaretler.
- `src` — kaynak listesi, `[{t:'başlık', u:'https://…'}]`. `u` isteğe bağlıdır:
  adresi doğrulanmamış bir kaynağı uydurma bağlantıyla yayınlamayın, adıyla yazın.
  En az üç kaynak; para/kariyer konularında bu bir kural, öneri değil.

**Yeni bölüm/sayfa:** metinleri önce `i18n.js`'e on dilde ekleyin, sonra HTML'i
`data-i18n` ile yazın. Dört sayfanın menüsünü ve altbilgisini güncelleyin.

**Yeni dil:** `QB_LANGS`'a `{ code, name, native, dir }` ekleyin, `QB_I18N.<kod>`
sözlüğünü İngilizcedeki tüm anahtarlarla doldurun, yazılara aynı kodu ekleyin,
`hreflang` etiketlerini ve `sitemap.xml`'i güncelleyin.

## Bilinen sınırlar / açık işler

- Dil değişimi istemci tarafında; arama motoru tek HTML görür. Çok dilli SEO'dan tam
  verim için her dili ayrı URL'de üreten bir ön-render adımı gerekir.
- Formlar `mailto:` taslağı üretir (sunucu yok). Gerçek forma geçiş noktası: `app.js`
  içindeki `composeMail`. Alıcı adres, alan adı, fiyatlar ve sosyal hesaplar
  **`assets/js/config.js`** içinde — yayına almak için başka dosyaya dokunmak gerekmez.
- Bülten kaydı yalnızca tarayıcıda tutulur (`initForm`); e-posta servisine bağlanmalı.
- Depoya push izni yok (git ve GitHub App 403 döndürüyor); iş yerelde commit'leniyor.
- FAQPage şeması duruyor ama Google 7 Mayıs 2026'da FAQ zengin sonuçlarını kaldırdı.
  Yapay zekâ aramaları için tutuluyor; zengin sonuç beklemeyin.
- Stripe Norveç ücreti: yurt içi kart %1,5 + 1,80 kr (yurt dışı +%3,25, döviz +%2).
  Fiyatlandırma bu rakamla yapılmalı; stripe.com bu ortamda engelli, karar öncesi
  kaynağı kendiniz doğrulayın.

Öncelik sırası ve iş listesi için `ROADMAP.md`.
