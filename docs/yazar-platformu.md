# QBLOGG Yazar Platformu — değerlendirme ve v1 tasarımı

**Durum (02.09.2026): MODEL KARARI VERİLDİ — Model A (davetli/küratörlü).**
İnşa henüz başlamadı — bkz. aşağıdaki açık gerilim.
Tarih: 24.08.2026 (ilk yazım). İşaretler: [V] doğrulanmış · [H] hipotez · [D] dış iddia.

**02.09.2026 notu — açıkça çözülmemiş bir gerilim var:** kullanıcı bugün
Model A'yı onayladı, ama bu belgenin kendi §9'u (aynı gün, 24.08 akşamı
eklenmiş, daha sonraki ve daha ayrıntılı gerekçeli) "Action Pages"i
haftanın en güçlü ticari fikri olarak önerip yazar platformunu **onun
SONRASINA** koyuyordu ("Davetli yazar platformu, Action Pages müşteri
tabanının üyelik/dağıtım katmanı olarak SONRA gelir"). Bugünkü onay
yalnızca "hangi model" sorusuna cevaptı — "şimdi mi, Action Pages'den
önce mi" sorusuna değil. İnşaya başlamadan bu sıralama kullanıcıyla
netleştirilmeli; aksi hâlde belgenin kendi §2 uyarısı ("üçü aynı anda
inşa edilirse hiçbiri kanıt eşiğine ulaşamaz") çiğnenmiş olur.

## 1. Fikir

QBLOGG, insanların **kendi bloglarını yayınlayabilecekleri ve kitaplarının
tanıtımını yapabilecekleri** bir platform olsun. Yazar tarafı: profil +
yazılar + kitap vitrini (kapak, tanıtım, satın alma bağlantısı). Okur
tarafı: dert/niyet temelli keşif — kullanıcının bu oturumda paylaştığı
filtre kodu (kategori + niyet + süre, küratoryal sıra) bu tarafın
prototipidir.

## 2. Dürüst değerlendirme

**Güçlü yanlar:**

- İkincil kitle zaten yazarlar [V]: `work.html` bugün yazar başvurusu
  topluyor. Bu pivot yazarı "tedarikçi"den "müşteri"ye çevirir — aynı
  kitleye ikinci bir değer önerisi, sıfırdan kitle değil.
- Altyapının yarısı hazır [V]: Supabase üye sistemi (auth + RLS + profil)
  dün kuruldu; `briefs` tablosunun deseni "yazar yazıları"na birebir
  genellenir. Çok dilli site, tema, tasarım sistemi duruyor.
- Kitap tanıtımı, reklam bildirimi altyapısıyla uyumlu [V]: `{aff:}`
  bloğu, `rel="sponsored"` ve bildirim kutusu deseni zaten kodda.

**Riskli yanlar (açıkça):**

- **İki taraflı pazar soğuk başlar.** Yazar, okur olmadan gelmez; okur,
  içerik olmadan gelmez. Açık kayıtla başlamak boş bir platform gösterir.
- **Marka çelişkisi riski.** QBLOGG'un bugüne kadarki tek iddiası
  kalite kapısıdır (16 maddelik görünürlük kuralı, uydurma yasağı).
  Denetimsiz kullanıcı içeriği bu iddiayı sulandırabilir. Çözüm modele
  gömülmeli (bkz. §3 öneri).
- **Bu, bir haftadaki üçüncü stratejik yön.** Studio [V, bugün satılabilir
  tek şey] → Intelligence (B0–B4, `is-modeli.md`) → Platform. Üçü aynı
  anda inşa edilirse hiçbiri kanıt eşiğine ulaşamaz. Bu belge platformu
  Intelligence'ın YERİNE değil, YANINA koyar; önceliği kullanıcı seçer
  (§8/2). Ortak payda: üç modelin de aynı üye sistemini kullanması.
- **Moderasyon ve hukuk yükü gerçek.** Kullanıcı içeriği = yayıncı değil
  aracı konumu, ama Norveç pazarlama mevzuatı (reklam işareti), telif ve
  GDPR yükümlülükleri kalır (§6). Açık modelde bu yük en büyüktür.

## 3. Üç model seçeneği

| Model | Ne demek | Artı | Eksi |
|---|---|---|---|
| **A. Davetli/küratörlü** (öneri) | Yazar başvurur, editoryal kapıdan geçer; yayın onayla açılır | Marka kalite iddiası korunur; moderasyon yükü küçük; soğuk başlangıç kontrollü | Büyüme yavaş |
| B. Açık kayıt (Medium tarzı) | Herkes kayıt olur, yazar | Ölçek potansiyeli | Moderasyon + hukuk yükü en yüksek; boş-platform ve kalite riski |
| C. Sadece kitap vitrini | Blog yok; yazar profili + kitap sayfası + niyet temelli keşif | En küçük inşa; en hızlı canlıya çıkış | "Kendi blogunu yayınla" vaadini ertelemek |

**Öneri: A ile başla, C'yi A'nın ilk teslimatı yap.** Yani: davetli
yazar programı; v1'de her yazarın profili + kitap vitrini + (isterse)
yazıları. Açık kayıt (B) ancak pilot eşiği geçilirse (bkz. §7).

## 4. v1 mimarisi — mevcut altyapının üstüne

İlke korunur: **ana site statik ve sıfır bağımlılık kalır.** Dinamik her
şey ayrı `uye/` uygulamasında (Supabase) yaşar; ana siteye yalnız statik
tanıtım/keşif sayfası eklenir.

Şema genişlemesi (uye/schema.sql üstüne, taslak):

- `authors` — profiles'a 1:1; `slug`, `bio`, `onaylandi` (editoryal kapı).
- `books` — yazar kitapları: başlık, tanıtım, kapak adresi, satınalma
  bağlantısı, `kategori`, `etiketler`. Reklam niteliği sabittir:
  arayüz her kitap kartını "tanıtım" olarak işaretler,
  dış bağlantı `rel="sponsored nofollow noopener"` alır.
- `author_posts` — briefs deseninin genellemesi: markdown gövde,
  `yayin_durumu` (taslak → incelemede → yayında), RLS: herkese yalnız
  `yayında`; yazara kendi satırları.
- Niyet katmanı: `intents` + kitap eşlemesi — paylaşılan filtre kodundaki
  `NIYETLER` deseni; keşif sayfası "kitap adı değil dert arar" ilkesiyle.

Okur tarafı v1'de giriş istemez (yayında olan içerik herkese açık);
yazar tarafı mevcut magic-link girişini kullanır. XSS kuralı üye
uygulamasındaki gibi: gövde `textContent`/güvenli dönüştürücü ile,
ham HTML asla.

SEO sınırı [V]: Supabase'den istemci tarafında çekilen içerik arama
motoruna görünmez (bilinen sınır, CLAUDE.md). v1'de kabul edilir;
platform tutarsa ön-render adımı zaten yol haritasında.

## 5. Gelir — "Abonnement og priser"

Rakam uydurulmaz; fiyat noktaları pilotta belirlenir. Kayıt altına
alınan seçenekler (hepsi [H]):

1. **Yazar aboneliği:** ücretsiz katman (profil + N yazı + 1 kitap) +
   ücretli katman (sınırsız yazı, çoklu kitap, öne çıkarma). Fiyat
   pilotta test edilir — B2'deki A/B disipliniyle.
2. **Öne çıkarma/vitrin ücreti:** ana sayfa veya keşif sayfasında
   "öne çıkan kitap" yeri; süreli, açıkça "tanıtım" işaretli.
3. **Komisyon değil bağlantı:** satın alma yazarın kendi bağlantısına
   gider (Amazon, forlag, kendi sitesi); v1'de komisyon altyapısı yok —
   karmaşıklığı almadan önce talep kanıtı gerekir.

Stripe tarafı mevcut planla birleşir: Payment Link → `plan_status`
deseni yazar aboneliğine de uyar. Norveç kart kesintisi (%1,5 + 1,80 kr
yurt içi [D — karar öncesi teyit]) fiyata dahil düşünülür.

## 6. Hukuk ve kural kapıları (v1'de zorunlu)

- Kitap kartları ve öne çıkarmalar **açık "tanıtım/annonse" işareti**
  taşır; gizli reklam yasağı (mevcut ilke) platforma da uygulanır.
- `kosullar.html` platforma göre güncellenir: içerik sorumluluğu
  yazarda, telif beyanı, kaldırma süreci (bildir-kaldır), yaş sınırı.
  Norveç mevzuatındaki karşılıklar (e-ticaret yasası, markedsføringsloven)
  yayına açılmadan bir avukatla teyit edilir [D — bu ortamdan
  doğrulanamaz; is-modeli §9/7 ile aynı madde].
- GDPR: mevcut asgari-veri ilkesi korunur; yazar profili yalnız yazarın
  kendi girdiği alanları gösterir.
- QBLOGG'un kendi yazıları için görünürlük kuralı aynen kalır; yazar
  içeriği ayrı etiketlenir ("yazar içeriği") — iki kalite rejimi
  görsel olarak karışmaz.

## 7. Pilot planı (eşikli, güven merdiveni disipliniyle)

- **P0 — inşa (1–2 hafta):** şema genişlemesi + yazar paneli (giriş,
  profil, kitap ekleme, yazı taslağı) + keşif sayfası (niyet filtresi).
- **P1 — davetli pilot:** 5–10 yazar elle davet edilir (work.html'e
  başvuranlar ilk aday havuzu). Eşik: ≥5 yazar profil+kitap yayınlar
  ve ≥3'ü ikinci ayda da içerik ekler.
- **P2 — ödeme kanıtı:** ücretli katman/öne çıkarma teklif edilir.
  Eşik: ödeyen yazar sayısı (hedef rakam pilotta belirlenir; şimdiden
  uydurulmaz).
- P1 eşiği tutmazsa açık kayıt (model B) inşa edilmez; plan yana
  revize edilir.

## 8. Ad tartışması — QBOOK / QBLOOK / QLBOOK (24.08.2026)

Kullanıcı, başka bir yapay zekânın puan tablosuyla üç adı getirdi ve
"QBLOOK çatı + QBOOK ürün" ekosistem fikrini önerdi. Puanlar öznel
değerlendirmedir [D]; buradan doğrulanabilen tek şey alan adlarıydı:

| Alan adı | Durum (GoDaddy, 24.08.2026) [V] |
|---|---|
| qbook.com | **DOLU** |
| qblook.com | müsait |
| qlbook.com | müsait |
| qbook.no | müsait |
| qblook.no | müsait |

Değerlendirme (uydurma yok, işaretli):

- **QBOOK çakışma riski:** qbook.com dolu [V]; ayrıca "QB/QuickBooks"
  (Intuit) yazılım alanında çok bilinen bir markadır — kitap platformu
  yazılım hizmeti olarak tescil edileceği için sınıf çakışması ihtimali
  TMview'da aranmadan ve avukata sorulmadan QBOOK'a yatırım yapılmamalı
  [D — hafızadan; teyit şart].
- **"blook"** kelimesinin 2000'lerde "blog+book" anlamıyla kullanılmış
  bir geçmişi var [D — hafızadan; teyit edilmeli]. Olumsuz değil, ama
  "özgün buluş" varsayımıyla pazarlanmadan önce bilinmeli.
- **Ekosistem deseni zaten kurulu:** Q Brief, Q Answer, Q Risk Radar,
  Q Scenario (is-modeli.md §5) tam da önerilen "Q___" ürün ailesidir.
  Yani "çatı marka + Q ürünleri" fikri yeni bir şirket adı gerektirmiyor;
  bugünkü çatı QBLOGG'dur ve logo sistemi + tescil hazırlığı +
  qblogg.com bu ada yatırılmış durumda [V].
- **QBLOGG ↔ QBLOOK benzerliği** iki yönlü: aile hissi verir (artı),
  ama iki ayrı marka olarak yaşatılırsa karışıklık üretir (eksi).

**Öneri:** şirket/çatı adını şimdi değiştirme — yeniden markalama
(logo, tescil, alan adı, site) kanıtı olmayan bir fikre bugünkü birikimi
harcar. Platform pilotu QBLOGG çatısı altında yapılsın; QBLOOK fikri
değerliyse **qblook.com + qblook.no şimdi ucuza savunma amaçlı alınabilir**
(geri dönüşü kolay, kapı açık kalır) ve ad kararı pilot kanıtından sonra
verilsin. Kayıt kullanıcı adımıdır (GoDaddy hesabıyla).

## 9. Action Pages önerisi — değerlendirme (24.08.2026, akşam)

Kullanıcı, başka bir yapay zekânın "QBLOGG Action Pages" önerisini
inceleme için getirdi: uzman içeriğini müşteri üreten interaktif mini
araca çevirmek (soru formu → ücretsiz kısa sonuç → ücretli rapor /
randevu / ürün), ve **okurdan değil uzmandan** para almak — önce hizmet
olarak (kurulumu biz yaparız), sonra yazılım üyeliği.

**Neden bu, haftanın en güçlü ticari fikri (dürüst gerekçe):**

1. **1. müşteriden gelir** — trafik, kitle, iki taraflı pazar
   beklemez. Bu belgenin §2'de platforma yazdığı "soğuk başlangıç"
   riskini tamamen atlar.
2. **Bugünkü yeteneklerle örtüşür [V]:** statik sayfa üretimi, form,
   Stripe Payment Link deseni, i18n, kalite kapıları — hepsi depoda
   çalışır durumda. v0 Action Page'in yeni platform kodu gerektirmeyen
   bir statik sayfa + belirlenimci puanlama + ödeme/randevu bağlantısı
   olarak inşası mümkün.
3. **Doğrulama kapısı bizim disiplinle aynı:** 30 günde 10 görüşme,
   3 ücretli pilot; satılmazsa platform inşa edilmez. (Güven merdiveni
   mantığının satış tarafına uygulanması.)
4. **Yazar platformuyla çelişmez, birleşir:** müşteri aynı kişi
   ("içerik üretiyorum ama müşteriye dönüşmüyor" diyen uzman/yazar).
   Kitap vitrini, Action Page'in özel hâlidir (sonuç = kitap önerisi +
   satın alma bağlantısı). Davetli yazar platformu, Action Pages müşteri
   tabanının üyelik/dağıtım katmanı olarak SONRA gelir.

**Düzeltmeler (öneriyi aynen almadan):**

- Bütün fiyatlar (kurulum 2.500–7.500 / pilot 4.900 + 690/ay) hipotezdir
  [H]; ilk 10 görüşmede test edilir, siteye kesin vaat olarak yazılmaz.
- Substack %10 · Gumroad %10+0,50$ · beehiiv %0 · Outgrow iddiaları
  [D — bağlantılar geldi ama bu ortamdan doğrulanmadı]; satış metnine
  girmeden önce kaynağından teyit edilir.
- **Kişiselleştirilmiş sonuç v0'da yapay zekâ ÜRETMEZ:** belirlenimci
  puanlama + uzmanla birlikte yazılmış hazır sonuç metinleri (uydurma
  riski sıfır, kalite kapısı uygulanabilir, maliyet sıfır). AI katmanı
  ancak ödeme kanıtından sonra ve uzman onaylı şablonlarla.
- **KVKK/GDPR gerçek yük:** form CV/kariyer verisi toplar; potansiyel
  müşteri bilgisi uzman adına işlenirse QBLOGG veri işleyen olur →
  veri işleme sözleşmesi gerekir. v0'da en aza indirme: form verisi
  tarayıcıda puanlanır, bize kaydedilmez; randevu/iletişim doğrudan
  uzmanın kendi kanalına gider. Avukat teyidi (§6) buraya da bakar.

**Revize öneri — tek sıra:** (1) Action Pages hizmet pilotu ÖNCE:
satış demosu olarak bir örnek Action Page (statik, mevcut yığınla) +
teklif metni; 3 ücretli pilot hedefi. (2) Davetli yazar platformu P0
(şeması yazıldı: `uye/schema-platform.sql`) ödeme kanıtından sonra
inşaya devam eder. (3) Intelligence beklemede kalır (kullanıcı kararı
zaten böyleydi). Slogan adayı: "Questions into action. Content into
customers." [karar kullanıcıda].

## 10. SAYFA60 + çok-format önerileri ve BİRLEŞİK TEZ (24.08.2026, gece)

Kullanıcı iki büyük öneri daha getirdi (başka yapay zekâdan): **çok-format
kitap merdiveni** ("1 kitabı değil, 1 fikri 10 biçimde sat"; Netflix-for-
Books) ve **SAYFA60** (60 saniyede kitap keşfi; TikTok/Reels/Shorts kanalı;
yazar-yayınevi tanıtım paketleri; tam iş modeli). İçlerindeki bütün pazar
rakamları (BookTok 50M kitap/€800M, sesli kitap 2,43 milyar $, %65 büyüme,
kitap listeleri) **[D] — bu ortamdan hiçbiri doğrulanmadı**; SAYFA60 video
metinlerine girecek her iddia için kendi görünürlük disiplinimiz geçerli
olur (kaynaksız yayın yok).

**Bütün haftanın fikirleri tek çizgide birleşiyor.** Action Pages'in
müşterisi "içerik üretiyorum ama müşteri gelmiyor" diyen uzman; yazar
platformunun müşterisi kitabını tanıtmak isteyen yazar; SAYFA60'ın kendi
planındaki ilk nakit "bağımsız yazar + yayınevi paketleri". Üçünde de
para ödeyecek kişi AYNI: **okur değil, içeriğini/kitabını müşteriye ve
okura dönüştürmek isteyen kişi.** Şirket tezi tek cümleye iner:

> QBLOGG, uzmanların ve yazarların içeriğini müşteriye/okura dönüştürür.
> ("Questions into action. Content into customers.")

Bu tezin üç ürün yüzü (aynı satış, farklı kitle):
1. **Action Page** — danışman/uzman için: soru formu → sonuç → randevu.
2. **Kitap lansman paketi** — yazar için: kitap sayfası + tanıtım
   (SAYFA60 Author paketlerinin QBLOGG hâli; davetli platform vitrini
   burada teslimat aracıdır).
3. **Keşif kanalı** (SAYFA60 tarzı video) — ilk ikisine müşteri getiren
   PAZARLAMA MOTORU; kendi başına ilk gelir kaynağı değil.

**SAYFA60 hakkında dürüst uyarı:** ayrı marka + günde 1 video + ayda
30-50 video, tam zamanlı bir medya operasyonudur; geliri kitleden sonra
gelir (kendi planı da "önce kitle" diyor). Bu, üç aydır uyardığım dağılma
riskinin en büyüğü. Kanal fikri değerli ama SIRASI VAR: ücretli müşteri
kanıtından önce ikinci marka açılmaz. (Bu tespiti dış profil de
doğruluyor: "on şirket tasarlayabilir; hangisinde kalacağı belirsiz.")

**Önerilen tek sıra (30'ar günlük kapılar, satılmazsa durulur):**
- **1. kapı:** TEK ticari deney seç (Action Pages pilotu VEYA yazar
  lansman paketi) → 10 görüşme, 3 ücretli pilot. Kod değil satış.
- **2. kapı:** ödeme kanıtı gelirse teslimat araçlarını genişlet
  (platform P0 kalan kod: yazar paneli + keşif sayfası).
- **3. kapı:** gelir düzenliyse keşif kanalı (video) pazarlama motoru
  olarak açılır — ayrı marka kararı o gün verilir (SAYFA60 adı, sosyal
  kullanıcı adları ve alan adı kontrolü o aşamanın işi).

## 11. Açık kararlar (kullanıcıda)

1. ~~Model seçimi~~ KARAR (24.08): A — davetli/küratörlü.
2. ~~Öncelik~~ KARAR (24.08): Platform önce, Intelligence beklemede.
   §9 ile revizyon önerisi: Action Pages hizmet pilotu en öne.
3. Action Pages ana ticari konsept olarak onaylanacak mı; onaylanırsa
   ilk teslimat: örnek Action Page (kariyer/CV demosu) + teklif metni.
4. P0 kalan kod (yazar paneli + keşif sayfası) ne zaman: ödeme
   kanıtından sonra (öneri) mı, hemen mi.
5. Ücretli katman fiyat testi (rakamlar [H], pilotta).
6. Ad konusu (§8): QBLOGG çatı kalır; qblook.com/.no savunma kaydı
   kullanıcı adımı.
