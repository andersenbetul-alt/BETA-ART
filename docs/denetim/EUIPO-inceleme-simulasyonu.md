# EUIPO inceleme simülasyonu — QBLOGG

Tarih: 22.08.2026 · Yürüten: proje ekibi (kendi kendine inceleme)

> **Bu resmî bir EUIPO işlemi değildir.** Başvuru yapılmadı, dosya numarası
> yok, kurumla iletişim kurulmadı. Aşağıdaki inceleme, EUIPO'nun uyguladığı
> ölçütler taklit edilerek **kendi markamıza kendimiz uyguladığımız** bir ön
> denetimdir. Amaç, başvurudan önce zayıf noktaları görmek.
>
> Kurum siteleri bu ortamda engelli (`euipo.europa.eu`, `patentstyret.no`,
> `tmdn.org`, `lovdata.no` — hepsi denendi, hiçbiri açılmadı). Ölçütler
> ikincil kaynaklardan alındı ve **birinci elden doğrulanmadı**.

---

## A. Şeklî inceleme — GEÇTİ (4/4)

Şekil markası görselinin biçim şartları. `node scripts/marka-tescil.mjs`
üretiyor ve denetliyor; sonuçlar bağımsız bir JPEG çözücüyle ikinci kez
doğrulandı.

| Dosya | Boyut | DPI | Renk | Baseline | Bayt | Sonuç |
|---|---|---:|---|---|---:|---|
| `sekil-markasi-renkli.jpg` | 1600×1600 | 300 | YCbCr (RGB) | ✓ | 85 KB | ✓ |
| `sekil-markasi-siyah.jpg` | 1600×1600 | 300 | YCbCr (RGB) | ✓ | 69 KB | ✓ |
| `kilit-renkli.jpg` | 1600×1600 | 300 | YCbCr (RGB) | ✓ | 71 KB | ✓ |
| `kilit-siyah.jpg` | 1600×1600 | 300 | YCbCr (RGB) | ✓ | 59 KB | ✓ |

Zarf: JPEG · ≤ 2835×2010 px · 96–300 DPI · RGB · progressive değil · < 2 MB.

### Bu incelemede bulunan kusur

İlk koşumda **dört dosyanın dördü de kaldı.** Chromium'un ürettiği JPEG,
JFIF APP0 bloğunda `birim = 0` ("yalnızca en-boy oranı") ve yoğunluk `1:1`
yazıyor — yani **fiziksel çözünürlük hiç beyan edilmiyor.**

Daha kötüsü: üreticimiz bu dosyalara "zarfa uygun" demişti. Kendi
denetleyicimiz çözünürlüğü hiç kontrol etmiyordu, yalnızca dosya boyutuna ve
kaba bir progressive taramasına bakıyordu. **Yanlış geçer notu veriyordu.**

Düzeltme: üretici artık JFIF bloğunu yerinde düzeltip 300 DPI yazıyor
(görüntü verisine dokunulmuyor, yalnızca üstbilgi) ve dosyayı baytlarına
bakarak inceliyor — boyut, bileşen sayısı, SOF türü, JFIF birimi ve yoğunluk.

## B. Mutlak ret nedenleri — unsur unsur

EUIPO ayırt edicilik ve tanımlayıcılığı **her AB resmî dili için ayrı ayrı**
değerlendirir; bir tek dilde tanımlayıcı olması reddi getirebilir.

### B1. Şekil unsuru (sembol tek başına) — **düşük risk**

Sembol soyut bir formdur: yuvarlatılmış halka, yumuşak köşeli sayaç, sayacı
kesen çapraz şerit. Hizmetin özelliğini, türünü, kalitesini ya da amacını
tanımlamıyor. Yaygın kullanılan bir sembol de değil.

Ayrıca **bu sembolün bir harf olarak okunması şart değil** ve okunmuyor da:
tek renk faks testinde "eğik çizgili yuvarlatılmış halka" olarak okunuyor,
Q olarak değil. Şekil markası açısından bu bir kusur değil — soyut olması
ayırt ediciliği güçlendirir.

**Değerlendirme: 7(1)(b) ve 7(1)(c) bakımından ciddi bir engel görünmüyor.**

### B2. Kelime unsuru "QBLOGG" — **YÜKSEK RİSK**

Buradaki sorun ciddi ve başvuru stratejisini değiştirecek nitelikte.

**"BLOGG", İsveççede "blog" demektir.** İsveççe bir AB resmî dilidir. Marka
blog/içerik hizmetleri için başvurulacaksa, İsveççe konuşan kamu için
"QBLOGG" = "Q" + "blogg" biçiminde ayrışır ve hizmetin **türünü doğrudan
tanımlar.** Aynı okuma Norveççede de geçerlidir (Patentstyret için) ve
"blog / blogue / blogi / Blog" biçimleriyle diğer AB dillerinin çoğunda
benzer bir okuma mümkündür.

Başındaki tek harf **"Q"**, tanımlayıcı bir sözcüğe eklenen tek harften
ibarettir. Tek başına bütüne ayırt edicilik kazandırmaya genellikle
yetmez — özellikle ayrık okuma bu kadar doğalken.

**Değerlendirme: kelime markası olarak başvuru, 35/41/42 gibi içerik ve
yayıncılık sınıflarında 7(1)(c) itirazına açıktır.** Bu bir kesinlik değil,
gerçek ve hesaba katılması gereken bir risktir.

> Not: Bu okumayı destekleyen belirli bir EUIPO kararı **bulunamadı** ve
> uydurulmadı. Yukarıdaki, dilbilgisel gerçek (İsveççe "blogg") ile
> incelemenin dil bazlı yürütüldüğü ilkesinden çıkarılmış bir gerekçedir.

### B3. Birleşik kilit (sembol + wordmark) — **orta risk**

Şekil unsuru yeterince ayırt ediciyse bütün tescil edilebilir; ancak koruma
fiilen şekle dayanır, kelimeye değil. Yani başkası "Blogg" içeren başka bir
adı farklı bir sembolle kullanabilir.

## C. Nispi ret nedenleri — **KISMEN İNCELENDİ (22.08.2026)**

`BLOGG` araması TMview'da yapıldı (kullanıcı tarafından; 29 kayıt).
Tam liste ve okunuşu: `docs/denetim/marka-arastirmasi.md`.

**Özet: AB ve Norveç'te sınıf 35'te yaşayan bir `BLOGG` engeli görünmüyor.**
O sınıftaki kayıtların hepsi ölü (Fransa, Çekya, Norveç `Bloggr`, Almanya).
Yaşayan `BLOGG` tescilleri mobilya sınıflarında (11/20/21) ve tek sahipte:
Leiner & kika Möbelhandels GmbH.

İzlenecek iki kayıt, ikisi de Birleşik Krallık (AB dışı ama pazar olabilir):
`BLOGGI` (sınıf 35 dahil, tescilli) ve `BLOGG OFF` (35/41, 01.08.2026'da
başvurulmuş, derdest).

Yapılmayan aramalar: `QBLOGG`, `Q BLOGG`, `QBLOG`, WIPO Global Brand
Database, şirket adı ve alan adı. Bu bölüm hâlâ eksik.

### Bu bulgunun B2'ye etkisi

B2'deki tanımlayıcılık uyarısı **duruyor** ve veri onu çürütmüyor:
EUIPO'nun `BLOGG`'u tescil etmiş olması mobilya içindir; orada sözcük
keyfîdir. Ayırt edicilik mal ve hizmete göre değerlendirilir.

Değişen şey riskin **kaynağı**: engel başkasının önceki hakkı değil,
markanın kendi ayırt ediciliği. Bu, mutlak ret sorunudur — nispi değil.

## C-eski. Nispi ret nedenleri — genel çerçeve

Önceki haklar araştırması yapılmadı. EUIPO nispi nedenleri kendiliğinden
incelemez (itiraz üzerine bakar) ama başvuru sahibine bir araştırma raporu
gönderir. **Patentstyret ise nispi nedenleri kendisi inceler** — Norveç için
bu araştırma daha da kritiktir.

| Kayıt | Durum |
|---|---|
| EUIPO eSearch / TMview | **yapılmadı** — site engelli |
| Patentstyret | **yapılmadı** — site engelli |
| WIPO Global Brand Database | **yapılmadı** |
| Brønnøysundregistrene (şirket adı) | **yapılmadı** |

Bu bölüm doldurulmadan hiçbir başvuru yapılmamalıdır.

## D. Üretim testleri — teknik yarısı yapıldı

Kanıt: `docs/gorseller/uretim-testleri.png`

Üretim: `npm run uretim-testi` — pano ve ölçümler betikten çıkar.

| Test | Mürekkep | Ara ton | Sonuç |
|---|---:|---:|---|
| **Faks / tek renk (1 bit)** | %55,6 | %0,7 | ✓ Ayakta. Ara ton neredeyse sıfır — eşiklemede kayıp yok. Halka ve çapraz okunuyor; Q okunmuyor, şekil markası için sorun değil |
| **Siluet (6 px bulanık)** | %45,5 | %15,3 | ~ Silüet yuvarlatılmış halka; jenerik. Çapraz zayıf da olsa duruyor |
| **Ters çevirme** | %4,6 | %0,2 | ✓ Form korunuyor |
| **Gri tonlama** | %50,7 | %5,4 | ✓ Aqua griye düşüyor, ayrım kalıyor |
| **16 px** | %45,3 | **%17,6** | ✗ Aqua bir leke, sayaç ~4 px. **Tek renk varyantı zorunlu** |
| **24 px** | %47,4 | %12,8 | ~ Aqua ~2,1 px, 3 px hedefinin altında. `icon-small` (100u köprü) kullanılıyor |
| **32 px** | %49,0 | %10,5 | ✓ Net |
| **48 px** | %48,8 | %9,1 | ✓ Net |

**Ara ton** = ne koyu ne açık pikseller, yani belirsizleşen alan. 16 px'te
%17,6'dan 48 px'te %9,1'e düşüyor: küçüldükçe markanın giderek daha büyük
bölümü bulanık piksele dönüşüyor. 16 px kuralının sayısal karşılığı budur.

> **Ölçüm düzeltmesi.** Bu tablonun ilk sürümünde siluet, ters ve gri
> satırları yanlıştı: CSS filtresi ekran görüntüsüne uygulanıyordu ama
> ölçümün yapıldığı canvas'a uygulanmıyordu, yani o üç satır filtresiz
> aslın sayılarını raporluyordu. Betik `scripts/uretim-testi.mjs`'ye
> taşınırken filtre ölçüm tarafına da uygulandı; yukarıdaki değerler
> düzeltilmiş olanlardır.

**Yapılmayanlar:** nakış, gravür, 100 mm üzeri büyük format baskı, gerçek
ekran testi. Bunlar fiziksel üretim gerektiriyor.

## E. Sonuç ve tavsiye

**Şeklî bakımdan hazır. Esas bakımdan iki farklı hikâye var.**

1. **Şekil markası (sembol) için başvuru — önerilir.** Ayırt edicilik
   sorunu görünmüyor, dosyalar zarfa uygun, üretim testlerinin teknik
   yarısını geçiyor.

2. **Kelime markası "QBLOGG" için başvuru — önce hukuki görüş alın.**
   "BLOGG" İsveççe ve Norveççe "blog" demek. İçerik hizmetlerinde
   tanımlayıcılık itirazı gerçek bir olasılık. Ücret ödeyip reddedilmek
   yerine, önce bir marka vekiline sorun.

3. **Hiçbir başvuru, C bölümündeki araştırmalar yapılmadan yapılmamalı.**

**Karar: TESCİL BEKLEMESİ SÜRÜYOR.** Şeklî kapı açıldı; esas ve araştırma
kapıları kapalı.

## Bu incelemenin ardından yapılan düzeltmeler

| Bulgu | Düzeltme |
|---|---|
| Dört dosya da DPI beyan etmiyordu | Üretici JFIF bloğunu düzeltip 300 DPI yazıyor |
| Denetleyici DPI'yı hiç kontrol etmiyordu — yanlış geçer notu | JPEG artık baytlarına bakılarak inceleniyor |
| Kelime unsurunun riski dosya adından anlaşılmıyordu | `tescil/RAPOR.md` her dosyaya esas risk sütunu koyuyor; kilit dosyaları 🔴 işaretli ve rapor sonunda uyarı var |
| Üretim testleri geçici dosyada elle koşulmuştu | `npm run uretim-testi` — betikten çıkıyor, pano depoda |
| Siluet/ters/gri ölçümleri filtresiz aslı raporluyordu | Filtre ölçüm tarafına da uygulandı |
