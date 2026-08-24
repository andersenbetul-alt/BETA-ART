# Marka tescili — EUIPO kapısı

Bu belge, QBLOGG kimliğinin AB marka başvurusuna hazır olup olmadığını
denetler. **Bugünkü karar: hazır değil, başvuru beklemede.**

Üretim: `node scripts/marka-tescil.mjs` → `tescil/` (git'te izlenmiyor).

## Neden EUIPO, neden EPO değil

EPO (European Patent Office) **patent** kurumudur; buluşları korur. Bir logo
patentlenmez. Logonun yeri **marka** hukukudur:

| Kapsam | Kurum | Ne korur |
|---|---|---|
| AB (27 ülke, tek başvuru) | **EUIPO** | Marka — şekil ve kelime |
| Norveç | **Patentstyret** | Marka — Norveç AB üyesi değil, EUIPO kapsamına girmez |
| Uluslararası genişletme | **WIPO** (Madrid) | Temel bir tescile dayanır |
| Buluş / teknik çözüm | EPO | Patent — bu projede konu dışı |

**Norveç kritik.** Şirket Norveç merkezliyse ve asıl pazar orasıysa, EUIPO tek
başına yetmez; Patentstyret'e ayrı başvuru gerekir. AB'ye satış yapılıyorsa
ikisi birden.

## Biçim zarfı — otomatik denetleniyor

`scripts/marka-tescil.mjs` şekil markası görselini şu zarfa göre üretir ve
üretilen her dosyayı zarfa karşı denetler:

| Şart | Değer |
|---|---|
| Biçim | JPEG |
| En büyük boyut | 2835 × 2010 piksel |
| Çözünürlük | 96–300 DPI |
| Renk modu | RGB, Gri, S/B **veya** CMYK — dördü de kabul |
| Progressive JPEG | EUIPO kuralı değil; bizim tedbirimiz, uyarı verilir |
| En büyük dosya | 2 MB |
| Sicilde görünen boyut | 250 × 250 piksel |

Betik zarfın dışına çıkan bir dosya üretirse çıkış kodu 1 döner.

Sicil görüntüsü 250×250'ye ölçeklendiği için marka o boyutta ayakta kalmalı;
üretici ayrıca `tescil/sicil-onizleme-250.png` çıkarır — sicilde tam olarak
bu görünür.

**Bu rakamlar başvurudan önce EUIPO'nun kendi sayfasından doğrulanmalı.** Kurum
şartlarını değiştirebilir.

## Üretilen başvuru dosyaları

| Dosya | Ne | Karar |
|---|---|---|
| `sekil-markasi-renkli.jpg` | Sembol, marka renkleriyle | Renk beyanı yapılacak mı? |
| `sekil-markasi-siyah.jpg` | Sembol, tek renk | Daha geniş koruma, renk iddiası yok |
| `kilit-renkli.jpg` | Yatay kilit (sembol + wordmark) | |
| `kilit-siyah.jpg` | Yatay kilit, tek renk | |

**Renkli mi siyah-beyaz mı** sorusu hukuki bir tercihtir: renk beyanı o renk
kombinasyonunu korur ama koruma dar olur; siyah-beyaz başvuru daha geniş
korur ama renge dayalı iddia kurulamaz. Karar hukukçuya aittir; ikisi de
üretilir ki karar dosya eksikliğinden gecikmesin.

## Ücretler — doğrulanmalı

Aramada bulunan rakamlar: bir sınıf **850 €**, ikinci sınıf **50 €**, sonraki
her sınıf **150 €** (elektronik başvuru). **Bu rakamlar bu belgeye
doğrulanmamış olarak yazılmıştır**; ödeme öncesi EUIPO'nun ücret sayfasından
teyit edilmelidir. Norveç (Patentstyret) ücretleri ayrıdır ve buraya
yazılmamıştır — araştırılmadı.

## Nice sınıflandırması — BOŞ

45 sınıf var; 1–34 mal, 35–45 hizmet. QBLOGG içerik hizmeti sattığı için
hizmet sınıfları ilgilidir. **Sınıf listesi doldurulmadı.** Mal/hizmet listesi
başvurunun koruma kapsamını belirler; dar yazılırsa koruma yetmez, geniş
yazılırsa itiraz ve ret riski artar. Bu bir hukukçu işidir.

| Alan | Durum |
|---|---|
| Başvuru sahibi (kişi/şirket, adres, org.nr) | **BOŞ** |
| Nice sınıfları | **BOŞ** |
| Mal/hizmet listesi | **BOŞ** |
| Renk beyanı kararı | **BOŞ** |

## Norveç — Patentstyret

Norveç AB üyesi değil; EUIPO tescili Norveç'te **koruma vermez**. Şirket
Norveç merkezliyse burası ilk sıradadır.

| Kalem | Değer (doğrulanmadı) |
|---|---|
| Başvuru ücreti | **3.800 NOK**'tan başlıyor — 3.200 NOK resmî + 600 NOK işlem, bir sınıf dahil |
| Ek sınıf | ayrı ücret |
| Koruma süresi | başvuru tarihinden 10 yıl |
| Yenileme | **3.400 NOK**'tan başlıyor |
| İtiraz süresi | tescil yayınından sonra **3 ay** |

Patentstyret hem mutlak (ayırt edicilik, tanımlayıcılık) hem nispi (önceki
haklar) nedenleri **kendisi inceler** — EUIPO'dan farkı budur; EUIPO nispi
nedenleri yalnızca itiraz gelirse bakar.

**Norveç ayırt edicilik eşiği görece yüksektir.** Ayırt ediciliği zayıf bir
marka, uzun süreli ya da yoğun kullanımla "yerleşme" (innarbeidelse)
belgelenerek tescil edilebiliyor; marka ne kadar zayıfsa o kadar çok belge
isteniyor. QBLOGG için bu doğrudan ilgili: adın içindeki **"blog"** kelimesi
içerik/blog hizmetinde tanımlayıcı sayılabilir.

Bu bir gözlemdir, hukuki görüş değildir — ve ücret rakamları dahil hiçbiri
birinci elden okunmadı (bkz. aşağıdaki not).

## Ön araştırma — YAPILMADI

Başvurudan önce yapılması gerekenler. Hiçbiri yapılmadı, hiçbiri hakkında
iddia üretilmedi:

| Araştırma | Nerede | Durum |
|---|---|---|
| AB marka sicili | EUIPO eSearch / TMview | **yapılmadı** |
| Norveç marka sicili | Patentstyret | **yapılmadı** |
| Uluslararası | WIPO Global Brand Database | **yapılmadı** |
| Şirket adı çakışması | Brønnøysundregistrene (Norveç) | **yapılmadı** |
| Alan adı | `qblogg.com` sizde. **`.no` alınmayacak** (22.08.2026 kararı). `.eu` bakılmadı | **kısmi** |

Ayrıca **mutlak ret nedenleri** başvuruda incelenir: ayırt edici olmayan ya da
tanımlayıcı markalar reddedilir. "QBLOGG" içerik/blog hizmetinde "blog"
kelimesini taşıyor — bu, tanımlayıcılık itirazına açık bir noktadır ve
başvurudan önce değerlendirilmelidir. Bu bir gözlemdir, hukuki görüş değildir.

## Kendi kendine inceleme yapıldı

`docs/denetim/EUIPO-inceleme-simulasyonu.md` — EUIPO ölçütleri markamıza
uygulandı. Özet:

- **Şeklî inceleme: geçti (4/4).** İlk koşumda dördü de kalmıştı; sebep
  çözünürlük beyan edilmemesiydi, düzeltildi.
- **Şekil unsuru: düşük risk.** Soyut, tanımlayıcı değil.
- **Kelime unsuru "QBLOGG": yüksek risk.** "BLOGG" İsveççe ve Norveççe
  "blog" demek; içerik hizmetlerinde tanımlayıcılık itirazına açık.
  İsveççe AB resmî dili ve inceleme dil bazlı yürütülüyor.
- **Nispi nedenler: incelenmedi.** Kayıtlara erişilemiyor.

Tavsiye: şekil markasıyla başvurun, kelime markası için önce vekil görüşü
alın.

## Karar

**Başvuru beklemede.** Biçim tarafı hazır ve otomatik denetleniyor; hukuk
tarafı boş. Kimlik ticari kullanıma alınmadan önce en azından EUIPO ve
Patentstyret araştırmaları tamamlanmalıdır.

## Doğrulama notu — önemli

Bu belgedeki hiçbir rakam **birinci elden okunmadı.** Bu ortamın ağ politikası
ilgili kurumların tamamını kapatıyor; hepsi denendi ve hepsi bağlantı
kuramadı:

    www.patentstyret.no   euipo.europa.eu   www.epo.org
    tmdn.org              lovdata.no

Değerler arama sonucu özetlerinden alındı. **Para ödemeden, dosya yüklemeden
ve karar vermeden önce her rakamı kurumun kendi sayfasından teyit edin.**

Kaynaklar: EUIPO "Get the image right", FAQ: Attachments, FAQ: Nice
classification, Fees and payments · Patentstyret "How much does a trademark
application cost", "Requirements for registration", "Distinctive character",
"Application process step by step".

## EUIPO kriterleri — kaynaklı, 22.08.2026

**Erişim durumu.** `euipo.europa.eu`, `guidelines.euipo.europa.eu`,
`eur-lex.europa.eu`, `wipo.int` ve kılavuz aynası `euipo01app.sdlproducts.com`
bu ortamdan **engelli**; hepsi bugün tek tek denendi. Aşağıdaki maddeler
EUIPO'nun kendi sayfalarının **arama sonucu alıntılarından** okundu. Yani
kaynak EUIPO'nun kendisi, ama sayfa doğrudan açılıp teyit edilemedi.
**Başvurudan önce elle doğrulanmalı.**

### Şekil markası görseli — teknik zarf

Kaynak: `euipo.europa.eu/en/help-centre/forms/faq-apply-for-a-trade-mark`
ve `euipo.europa.eu/news/practice-tips/get-the-image-right`

| Kriter | EUIPO'nun dediği | Bizim dosyalar | Denetleyen |
|---|---|---|---|
| Dosya biçimi | JPEG | JPEG | `marka-tescil.mjs` |
| En büyük boyut | 2835 × 2010 piksel | 1600 × 1600 | ✅ |
| Baskı çözünürlüğü | en az 96, en çok 300 DPI | 300 DPI | ✅ |
| Renk modu | RGB, Gri, S/B **veya CMYK** | RGB | ✅ |
| Dosya boyutu | en çok 2 MB | 59–85 KB | ✅ |
| Sicilde görünüm | 250 × 250'ye ölçekleniyor | önizleme üretiliyor | ✅ |
| Ek toplamı | en çok 20 MB | 285 KB | ✅ |

### Düzeltilen iki hatam

**Renk modu.** Denetleyicim yalnızca RGB'ye izin veriyordu ve hata mesajı
"RGB bekleniyor" diyordu. EUIPO dördünü de kabul ediyor. Kural yanlış
aktarılmıştı; düzeltildi.

**Progressive JPEG.** Dosyanın başında "progressive olmayan" bir EUIPO şartı
gibi yazılmıştı. **Kaynaklarda böyle bir madde yok.** Bu bizim kendi
tedbirimiz — bazı eski ayrıştırıcılar progressive JPEG'i açamıyor. Artık ret
değil, uyarı olarak veriliyor ve gerekçesi kodda yazılı.

### Temsil kuralı — kılavuz

Kaynak: EUIPO Guidelines 9.1 ve 9.3.2 (alıntı)

- Şekil markası, işaretin bir reprodüksiyonu sunularak temsil edilir.
- Temsil **tek bir JPEG dosyasında** ya da **tek bir A4 sayfasında** sunulur.
- Sayfa DIN A4'ü aşamaz; **her yönden en az 2,5 cm kenar boşluğu** bırakılır.
- JPEG ya da A4 sayfa **yalnızca bir temsil** içerir; başka hiçbir bilgi
  bulunmaz.

> Kenar boşluğu maddesi A4 sayfa yolu içindir. Biz JPEG yolunu kullanıyoruz;
> yine de dosyalarımızda marka kenara yapışmıyor. Bu **doğrulanmadı**, göz
> kararıdır.

### Ücretler

Kaynak: `euipo.europa.eu/en/trade-marks/before-applying/fees-payments`
(alıntı) ve EUIPO Guidelines 7.5.1

| Kalem | Ücret |
|---|---|
| Temel çevrimiçi başvuru (1 sınıf) | **850 €** |
| 2. sınıf | **50 €** |
| 3. ve sonraki her sınıf | **150 €** |
| Yenileme (10 yılda bir) | başvuruyla aynı |

Tescil sonrası ayrı bir ücret yok; başvuru ücreti inceleme ve tescil sürecinin
tamamını kapsıyor. Ortak/garanti markaları için temel ücret 1.500 €.

**QBLOGG için tahmini:** hizmetler 35 (reklam/işletme), 41 (yayıncılık) ve
42 (yazılım) sınıflarına dağılıyor. Üç sınıf = 850 + 50 + 150 = **1.050 €**.
Bu bir hesaptır, teklif değil — sınıf seçimi marka vekiliyle netleşmeli.

> **Doğrulanmadı:** bu rakamlar bugün geçerli mi. Ücret tarifeleri değişir.
> Başvurudan önce EUIPO'nun ücret hesaplayıcısından teyit edin.

### Hâlâ kapalı olan

- **Ayırt edicilik / mutlak ret** (EUTMR md. 7(1)(b)-(c)) — her AB resmî
  dilinde ayrı değerlendirilir. İsveççede `blogg` = blog; asıl risk burada.
  Değerlendirme marka vekilinin işidir, bu belge iddia etmez.
- **Nispi ret / önceki haklar** — AB ve Norveç sicil taraması yapılmadı,
  siciller engelli. Detay: `docs/denetim/marka-arastirmasi.md`.
- **Kelime unsuru.** `kilit-*.jpg` dosyaları wordmark içerdiği için şekil
  markası başvurusunda risk taşır; denetleyici bunu 🔴 ile işaretliyor.
  Şekil markası için `sekil-markasi-*.jpg` kullanılmalı.


## Patentstyret başvuru hazırlığı — 24.08.2026

Kullanıcı talimatı: "logonun Patentstyret ve EUIPO kabul görmesi için bütün
hazırlıkları yap." Biçim hattı bu tarihte yeniden koşuldu ve yeşil:
`npm run marka` (15 varlık) → `npm run tescil` (4 JPEG + sicil önizleme,
zarf ✓) → `npm run tescil-testi` (4/4) → `npm run marka-dogrula` (56 ölçü ✓).

Kurum sayfaları hâlâ engelli (patentstyret.no ve lovdata.no bu oturumda da
denendi: EGRESS_BLOCKED). Aşağıdaki bilgiler web arama özetlerinden alındı —
**hiçbiri birinci elden okunmadı; başvuru öncesi elle teyit şart.**

### Dosya biçimi — Patentstyret [arama özeti, teyit edilecek]

- Patentstyret marka görseli için **TIF ve JPEG** öneriyor; dosya biçimi
  kuralları WIPO standardına dayanıyor; **uzantı gerçek biçimle eşleşmeli**
  (.jpg → JPEG). Kaynak: patentstyret.no "filformater" kılavuzu (PDF,
  doğrudan açılamadı) + "Start a trademark application" sayfa özeti.
- Sonuç: `tescil/` klasöründeki baseline JPEG dosyalarımız bu öneriye uyar;
  EUIPO zarfı (≤2835×2010, 96–300 DPI, <2 MB) Patentstyret için de güvenli
  taraftadır. **Aynı dosyalar iki kuruma da verilebilir.**

### Başvuru kanalı [arama özeti, teyit edilecek]

- Dijital başvuru **Altinn** üzerinden ("Start a trademark application" →
  søknadsveiviser). Norveç kimlik numarası yoksa "Start service" →
  **International** ile e-posta girişli başvuru mümkün.
- Ücret: bir sınıf **3.800 NOK** (yeniden teyit edildi, özet düzeyinde);
  1 Mart 2023'ten beri taban ücret TEK sınıf kapsar, ek sınıf ayrı ücret —
  **ek sınıf tutarı doğrulanamadı** (Lovdata engelli). Yenileme 3.400 NOK'tan.

### Başvuru stratejisi (öneri — hukuki görüş değil)

1. **Önce Patentstyret** (şirket Norveç'te; EUIPO Norveç'i kapsamaz),
   sonra 6 aylık Paris rüçhan penceresi içinde EUIPO.
2. **Şekil markası olarak yalnız sembol:** `tescil/sekil-markasi-renkli.jpg`.
   Kilit dosyaları (🔴 kelime unsuru "QBLOGG" → "BLOGG" tanımlayıcılık riski,
   Norveç eşiği yüksek) vekil görüşü olmadan kullanılmaz.
3. **Renk beyanı:** fiili kullanım renkli olduğundan renkli sürümle başvuru
   önerilir (Midnight Navy #082C54 + Electric Aqua #00D8C2); siyah sürüm
   ayrı bir başvuru ücreti demektir, vekile sorulacak.
4. **Nice sınıf TASLAĞI (vekil teyidi olmadan gönderilmez):**
   - **35** — başkaları için içerik pazarlaması, reklam ve pazarlama
     hizmetleri (Studio paketleri)
   - **41** — yayıncılık hizmetleri, çevrim içi (indirilemeyen) yayınlar,
     eğitim/bilgilendirme içerikleri (blog, Q Brief)
   - **42 (isteğe bağlı)** — çevrim içi platform/yazılım hizmeti (Action
     Pages / üye platformu büyürse; şimdi eklemek ücret artırır)
5. **Başvuru sahibi alanları hâlâ BOŞ** (kişi mi şirket mi, adres, org.nr) —
   kullanıcı dolduracak. Şirket kurulacaksa başvuru şirket adına atılmalı;
   sahiplik devri sonradan ek iş çıkarır.

### Kullanıcı adımları (başvuru günü, adım adım)

1. patentstyret.no → "Varemerke" → "Lever søknad om varemerke" (İngilizce:
   Start a trademark application) → Altinn girişi (BankID; şirketse şirket
   adına temsil seçin).
2. Marka türü: **figurmerke** (şekil markası). Görsel: depodan
   `tescil/sekil-markasi-renkli.jpg` dosyasını yükleyin.
3. Mal/hizmet listesi: yukarıdaki 35+41 taslağını vekil onayından geçmiş
   hâliyle girin (Patentstyret'in sınıf sihirbazı önerilerinden seçmek,
   serbest metinden daha az itiraz riski taşır).
4. Ücreti kartla ödeyin (bir sınıf 3.800 NOK + ek sınıf; tutarı ödeme
   ekranında görünce buradaki rakamla karşılaştırın — farklıysa bu belge
   güncellenmeli).
5. Başvuru numarasını ve tarihini kaydedin: EUIPO rüçhan başvurusunda
   (6 ay içinde) bu numara sorulur.
6. EUIPO tarafı: euipo.europa.eu → Easy Filing → aynı JPEG + rüçhan talebi.
   Ücret tahmini belgenin EUIPO bölümünde (850/50/150 € — teyitli değil).

### Bu oturumda YAPILAMAYANLAR (dürüst liste)

- Sicil ön araştırması (TMview/Patentstyret søk) — siteler engelli;
  kullanıcı tarayıcısından yapılmalı: search.patentstyret.no'da "QBLOGG"
  ve benzer ("Q BLOGG", "KVBLOGG" vb.) aramaları + tmview.org'da
  figüratif arama. Sonuç ekran görüntüleri bana iletilirse değerlendiririm.
- Ek sınıf ücretinin tutarı — Lovdata engelli.
- Vekil görüşü — "BLOGG" tanımlayıcılık riski için başvuru öncesi şart
  (özellikle kelime markası düşünülüyorsa).
