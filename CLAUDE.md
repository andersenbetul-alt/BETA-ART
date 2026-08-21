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
gizlilik.html       Gizlilik ve veri koruma metni (TR + EN)
kosullar.html       Kullanım ve hizmet koşulları (TR + EN)
post.html           Yazı detayı (?slug=... ile)
assets/js/config.js Yayın ayarları: e-posta, alan adı, sosyal hesaplar, fiyatlar, lead magnet
assets/css/main.css Tek stil dosyası; tüm renkler :root değişkenlerinden gelir
assets/brand/       Kimlik: sembol, kilitler, ikonlar, favicon (scripts/marka-uret.py üretir)
assets/js/i18n.js   Dil listesi (QB_LANGS) + 10 dilde metinler (QB_I18N)
assets/js/posts.js  Blog içeriği (QB_POSTS): her yazı 10 dilde
assets/js/app.js    Dil, tema, liste/arama/filtre, yazı sayfası, sekmeler, formlar
scripts/check.mjs   Proje sağlık kontrolü
scripts/gorunurluk.mjs Yayınlanmış yazıları görünürlük kurallarına karşı denetler
scripts/guvenlik.mjs   Güvenlik ve veri koruma denetimi
scripts/onizleme.mjs   Tüm siteyi tek tıklanabilir HTML dosyasına gömer

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
4. **Emoji kullanılmaz, ikon çizilir.** Görünen her ikon satır içi SVG'dir:
   24×24 ızgara, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`,
   yuvarlak uç ve birleşim. Emoji'yi işletim sistemi çizer — Windows, Android ve
   macOS üç farklı görünüm verir, marka kendi görselinin kontrolünü kaybeder.
   Yazı ikonları `app.js` içindeki `ICONS` kaydında adla durur (`icon: 'coin'`);
   sayfa ikonları doğrudan HTML'e gömülür. Ok ve tema düğmesindeki tek renkli
   metin işaretleri (`→ ↑ ☾ ☀`) bunun dışındadır; onlar yazı tipiyle çizilir.
5. **Renkler değişkenlerden gelir.** Doğrudan hex yazmayın; `var(--brand)`, `var(--text)`
   gibi değişkenleri kullanın ki koyu tema kendiliğinden çalışsın. Marka renkleri:
   Midnight Navy `#082C54` ve Electric Aqua `#00D8C2`. **Aqua beyaz üzerinde 1,8:1'dir
   ve metinde kullanılamaz**; açık zeminde metin için `var(--brand-2-ink)` (`#0a7d72`,
   5,0:1). Logo halkası `var(--logo-ink)` ile temaya göre döner, aqua köprü sabittir.
   Yazı boyutu da aynı kuraldadır: ham `rem` yazmayın, `--fs-2xs`…`--fs-xl`
   basamaklarını kullanın. Başlıkların `clamp()` değerleri ve `em` göreli boyutlar
   (ilk harf, `code`) ölçeğin dışındadır.
6. **Sayfa iskeleti altı dosyada tekrar eder.** Menü veya altbilgiyi değiştirirken
   altısını birden güncelleyin (`index`, `work`, `blog`, `post`, `gizlilik`, `kosullar`). `check.mjs` çiftlenen
   id ve script'leri yakalar ama eksik menü bağlantısını yakalamaz.
7. **Rakamlar örnek olarak işaretlenir.** Paket fiyatları ve blog yazılarındaki ücret
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

`npm run onizleme` altı sayfayı, yazı tipleri dahil her şeyi tek dosyaya gömüp
`onizleme/qblogg.html` üretir: sunucu kurmadan, dışarıya hiç istek atmadan
tıklanabilir bir önizleme. Birine site göstermek gerektiğinde bunu kullanın.
Yönlendirme `?page=` ile; `slug` ve `lang` gerçek sorgu dizesinde kaldığı için
`app.js` değişmeden çalışır. Gövde değiştikten sonra `window.QB_BOOT()` çağrılır.

`python3 scripts/marka-uret.py` kimlik vektörlerini yeniden üretir (gereken:
`pip install fonttools brotli`). Wordmark ana hatları deponun kendi Inter değişken
fontundan `wght=700`'de örneklenir; dış servis gerekmez. Geometri, ölçümler ve
brief'ten sapma gerekçeleri `docs/logo-sistemi.md`; test protokolleri ve marka
araştırma sayfası `docs/marka-testleri.md`.

`npm run guvenlik` üçüncü bir soruyu sorar: site ziyaretçiye zarar verebilir mi,
topladığı veriyi hukuka uygun işliyor mu? XSS, JSON-LD kaçışı, tabnabbing,
localStorage'daki kişisel veri, gizlilik metni, canonical–hreflang tutarlılığı,
mailto enjeksiyonu, karışık içerik, `rel="sponsored"` ve güvenlik başlıkları.
Yüksek seviyeli bulgu varsa çıkış kodu 1.

`scripts/check.mjs` şunları doğrular: 10 dilde anahtar eşitliği ve boş değer olmaması,
her yazının her dilde başlık/özet/gövdesi, çiftlenen id ve script, HTML'de kullanılan
ama sözlükte olmayan anahtarlar, kırık yerel bağlantılar, sitemap ile gerçek sayfa/slug
uyumu. Kontrol kırmızıysa commit etmeyin.

Tarayıcı testi gerektiğinde Playwright, Chromium ile kullanılabilir
(`executablePath: '/opt/pw-browsers/chromium'`); ayrıca kurulum yapmayın.

## Sık yapılan işler

**Yeni blog yazısı:** `assets/js/posts.js` dizisine nesne ekleyin — `slug`, `category`
(sözlükte `cat.<ad>` olmalı), `date` (YYYY-AA-GG), `accent` (1–6: navy–teal kapak
rampası), `icon` (`app.js` → `ICONS` kaydındaki ad), sonra
`t` / `e` / `b` alanlarını on dilde doldurun. `sitemap.xml`'e de ekleyin.

Gövde blokları: düz dize (paragraf), `{h:'…'}` (ara başlık), `{ul:[…]}` (liste),
`{note:'…'}` (uyarı kutusu), `{see:'slug'}` (metin içi yazı bağlantısı — küme
bağlantısı sayılır, `check.mjs` olmayan slug'ı yakalar), `{aff:{t,u,why}}`
(ortaklık bağlantısı).

Paragraf, liste ve not içinde `**vurgu**` yazılabilir. Ara başlıkta çevrilmez.
Kaçırma önce, çeviri sonra yapılır (`rich()`); sırayı bozmayın, yoksa vurgu
işareti HTML enjeksiyonuna kapı açar. `check.mjs` eşleşmeyen `**` yakalar.

**İki katmanlı içerik modeli.** `tr` ve `en` tam makaledir (30–55 blok, 1.200+
kelime; ölçütü `npm run gorunurluk`). Kalan sekiz dil **özet katmanıdır**: her
yazıda üç blok, 250–1.200 karakter. Bu bir eksik değil, tasarım — `check.mjs`
ikisini ayrı eşiklerle denetler. Özet katmanındaki eşik kalite hedefi değil,
boşalma korumasıdır; diller arasında yoğunluk çok farklı olduğu için tek bir
kelime sayısını kalite ölçütü saymak her seferinde en yoğun dili cezalandırır.
Kelime sayacı CJK duyarlıdır (Çince boşluk kullanmaz; naif `split(/\s+/)`
bir paragrafı tek kelime sayıyordu).

Ayrıca iki alan görünürlük kuralı gereği doldurulur:
- `orig` — bu sayfanın özgün katkısı tek cümleyle (kendi verisi, testi, tablosu).
  Yoksa `gorunurluk.mjs` yazıyı `yayinlanamaz` işaretler.
- `src` — kaynak listesi, `[{t:'başlık', u:'https://…'}]`. `u` isteğe bağlıdır:
  adresi doğrulanmamış bir kaynağı uydurma bağlantıyla yayınlamayın, adıyla yazın.
  **Adres yoksa `nu` ile gerekçesini yazın** (`{t:'…', nu:'adres doğrulanmadı; …'}`) —
  böylece kural gereği adressiz kaynakla unutulmuş adres birbirinden ayrılır.
  `nu` sayfada görünmez, yalnızca denetim içindir.
  En az üç kaynak; para/kariyer konularında bu bir kural, öneri değil.

**Yeni bölüm/sayfa:** metinleri önce `i18n.js`'e on dilde ekleyin, sonra HTML'i
`data-i18n` ile yazın. Dört sayfanın menüsünü ve altbilgisini güncelleyin.

**Yeni dil:** `QB_LANGS`'a `{ code, name, native, dir }` ekleyin, `QB_I18N.<kod>`
sözlüğünü İngilizcedeki tüm anahtarlarla doldurun, yazılara aynı kodu ekleyin,
`hreflang` etiketlerini ve `sitemap.xml`'i güncelleyin.

## Çalışma ilkeleri

Karpathy'nin LLM kodlama tuzakları üzerine gözlemlerinden türetilmiş dört ilke
(kaynak: github.com/forrestchang/andrej-karpathy-skills). Bunlar davranış
kuralıdır; yukarıdaki **Değişmez kurallar** projeye özgüdür ve çelişki hâlinde
onlar kazanır.

**Denge:** bu ilkeler hızdan çok temkini seçer. Önemsiz işlerde muhakeme kullanın.

**1. Kodlamadan önce düşün.** Varsayma, kafa karışıklığını gizleme, ödünleşimi
söyle. Uygulamadan önce varsayımlarını açıkça yaz; birden fazla okuma varsa
sessizce birini seçme, ikisini de sun. Daha basit bir yol varsa söyle; gerektiğinde
itiraz et. Bir şey belirsizse dur, neyin belirsiz olduğunu adlandır, sor.

**2. Önce sadelik.** Sorunu çözen en az kod, fazlası yok. İstenmeyen özellik yok.
Tek kullanımlık kod için soyutlama yok. İstenmemiş "esneklik" yok. İmkânsız
senaryolar için hata yakalama yok. 200 satır yazdıysan ve 50 yeterliyse, yeniden yaz.

**3. Cerrahi değişiklik.** Yalnızca dokunman gerekene dokun; yalnızca kendi
dağınıklığını topla. Komşu kodu, yorumu, biçimlendirmeyi "iyileştirme". Bozuk
olmayanı yeniden düzenleme. Kendi tarzın farklı olsa da mevcut tarza uy. İlgisiz
ölü kod görürsen **söyle, silme**. Kendi değişikliğinin yetim bıraktığı import ve
değişkenleri temizle; önceden var olan ölü kodu istenmedikçe kaldırma.
Ölçüt: değişen her satır doğrudan istenen işe kadar izlenebilmeli.

**4. Hedefe göre yürüt.** Başarı ölçütünü tanımla, doğrulanana kadar döngüde kal.
"Doğrulama ekle" → "geçersiz girdiler için test yaz, sonra geçir". "Hatayı düzelt"
→ "hatayı üreten test yaz, sonra geçir". Bu projede doğrulama katmanı hazır:
`npm run check`, `npm run guvenlik`, `npm run gorunurluk`. Çok adımlı işlerde
kısa bir plan yaz ve her adımın yanına doğrulamasını koy.

Bu ilkeler işe yarıyorsa: diff'lerde gereksiz değişiklik azalır, fazla
karmaşıklıktan doğan yeniden yazımlar azalır ve açıklayıcı sorular hatadan sonra
değil önce gelir.

## Kullanıcıya iş devrederken

Kullanıcının kendi yapması gereken bir adım varsa (izin verme, DNS, panel ayarı,
terminal komutu) **adım adım anlatın**: nereye tıklanacak, ne yazılacak, ne
görünmesi gerekir, hata gelirse ne yapılır. "Vercel'e deploy edin" yetmez;
komutun kendisi, beklenen çıktı ve olası hata mesajı yazılır. Bu kullanıcının
açık talebi.

## Bilinen sınırlar / açık işler

- Dil değişimi istemci tarafında; arama motoru tek HTML görür. Çok dilli SEO'dan tam
  verim için her dili ayrı URL'de üreten bir ön-render adımı gerekir.
- Formlar `mailto:` taslağı üretir (sunucu yok). Gerçek forma geçiş noktası: `app.js`
  içindeki `composeMail`. Alıcı adres, alan adı, fiyatlar ve sosyal hesaplar
  **`assets/js/config.js`** içinde — yayına almak için başka dosyaya dokunmak gerekmez.
- Bülten kaydı `config.js → newsletterEndpoint` boşken yalnızca tarayıcıda tutulur
  ve konsola uyarı düşer. Adres girilince gerçek servise POST ediliyor.
- Ortaklık bağlantısı `{aff:{t,u,why}}` bloğuyla eklenir; bildirim kutusu,
  `rel="sponsored nofollow noopener"` ve gerekçe denetimi kendiliğinden çalışır.
  Gelir katmanlarının tamamı için `docs/gelir-sistemi.md`.
- Depoya push izni yok. İki ayrı sorun: (1) uzak depo tamamen boş — hiç commit yok;
  (2) GitHub App'in yazma izni yok, yazma çağrıları "Resource not accessible by
  integration" döndürüyor. Okuma çalışıyor. İş yerelde commit'leniyor.
- Haftalık SEO/AI görünürlük izlemesi kurulu: pazartesi 07:00 (Norveç saati).
- FAQPage şeması duruyor ama Google 7 Mayıs 2026'da FAQ zengin sonuçlarını kaldırdı.
  Yapay zekâ aramaları için tutuluyor; zengin sonuç beklemeyin.
- Stripe Norveç ücreti: yurt içi kart %1,5 + 1,80 kr (yurt dışı +%3,25, döviz +%2).
  Fiyatlandırma bu rakamla yapılmalı; stripe.com bu ortamda engelli, karar öncesi
  kaynağı kendiniz doğrulayın.

Öncelik sırası ve iş listesi için `ROADMAP.md`.
