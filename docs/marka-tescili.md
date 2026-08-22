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

