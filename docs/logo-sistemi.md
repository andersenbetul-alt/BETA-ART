# QBLOGG kimlik sistemi

Üretim: `python3 scripts/marka-uret.py` (gereken: `pip install fonttools brotli`).
Çıktılar `assets/brand/` — **13 varlığın hepsi**: 11 SVG + 2 PNG (favicon-32,
apple-touch-icon). PNG'ler önce elle yapılmıştı ve yeniden üretilemiyordu; artık
betiğin içindeki stdlib rasterleştirici üretiyor (çift-tek tarama, y'de 8 kat
örnekleme, x'te tam örtüşme). Yeni bağımlılık yok. Betik yolları kendi konumundan
çözer, yani depo kökünden de kaynak paketinden de çalışır. Wordmark ana hatları deponun kendi Inter değişken
fontundan `wght=700`'de örneklenir — dış servis, kurulu font veya Figma gerekmez.

Doğrulama: `npm run marka-dogrula` — bu belgedeki her ölçüyü üretilen
dosyalardan yeniden ölçer ve karşılaştırır. 16 ölçü denetleniyor:
ayak izi, sayaç, üç şerit, sayaç kayması, köprünün üç ölçüsü, kuyruğun
üç ölçüsü, kuyruk sarımı ve SVG'lerde yasak öğe taraması. Uyuşmazlıkta
çıkış kodu 1.

Güncel hâl: `docs/gorseller/logo-son-hali.png` — kilitler, sembol varyantları,
tek renk sınaması, ölçek merdiveni ve uygulama ikonları tek sayfada.

Kanıt: `docs/gorseller/logo-kanit-panosu.png` (ölçek testi, varyantlar, kilitler,
Reality Board) · `docs/gorseller/logo-aday-karsilastirma.png` (aday elemesi).

## Sembol — ölçülen geometri (1000×1000 ızgara)

| Ölçüt | Değer | Brief |
|---|---|---|
| Ayak izi | 800×800 | ~800×800 ✓ |
| Kâse | supercircle: 4 kuadratik, 4 çapa — ne daire ne kare | — |
| Dış köşe yarıçapı | 400u (kâse formu) | 72–88 ✗ **gevşetildi** |
| Şerit genişliği | yan 158u · üst 151u · alt 165u | 150–165 ✓ |
| Sayaç | 484×484, yumuşak-köşeli (r=205) | ≥330, daire/kare değil ✓ |
| Sayaç merkezi | 7u yukarıda | 10–15 ✗ (2 birim; üst şerit 150'nin altına düşmesin diye) |
| Sağ-alt optik telafi | +%4,4 (alt şerit / yan şerit) | 4–6 ✓ |
| Köprü açısı | 45° | 28–34 ✗ **kasıtlı** — kanonik Q açısı |
| Köprü genişliği | 100u | şerit ±%5 ✗ **gevşetildi** |
| Köprü uzunluğu | 393,4u | 235–270 ✗ **gevşetildi** |
| Köprü konumu | 4:30 | ≈4:30 ✓ |
| Örtüşme kesimi | tam 2 adet | 2 ✓ |
| Köprü siluetin içinde | **hayır — 75u dışarı taşıyor** | brief "dış kuyruk yok" diyordu ✗ **kasıtlı** |
| Yol yapısı | 1 kapalı navy (evenodd) + 1 kapalı aqua | ✓ |
| Gradyan / gölge / maske / kontur / raster | 0 / 0 / 0 / 0 / 0 | ✓ |
| Renk | yalnızca `#082C54` ve `#00D8C2` | ✓ |

### Kilitte sembol–wordmark ilişkisi — ölçülen

| Ölçüt | Değer |
|---|---|
| Sembol yüksekliği | 800u (y 100 → 900) |
| Wordmark yüksekliği | 534u (y 233 → 767) — cap 520u + Q kuyruğu |
| Sembolün wordmark'ı aşması | **133u** üstten, **133u** alttan |
| Cap / sembol oranı | 520 / 800 = **%65** (hedef 62–68 ✓) |

Sembol wordmark'a göre dikey ortalanır; aşma iki yönde eşittir. Bu, yuvarlak
formun düz forma göre optik olarak küçük görünmesini telafi eden **%65 cap
oranı** kuralının sonucudur — ayrıca uygulanan bir overshoot değildir.

> **22.08.2026 düzeltmesi.** Bu belgede önceden "sembol, wordmark'ın cap
> çizgisini alttan ve üstten **10u** aşar" yazıyordu. **Yanlıştı.** Üretilen
> kilit dosyası ölçüldüğünde aşma 133u çıktı. Ayrıca "overshoot kilitte
> uygulandı, sembolün kendi konturunda uygulanmadı" notu da gerçeği
> anlatmıyordu: kodda ayrı bir overshoot adımı hiç yok, ilişki tamamen %65
> cap oranından doğuyor.
>
> Bu, tescil başvurusuna eşlik edecek bir yapım kaydında bulunmaması gereken
> türden bir hatadır: belge, varlıkta olmayan bir işlemi anlatıyordu.

### Ölçülen alan dağılımı

0,25 u² örneklemeli tarama:

| Ölçü | Değer |
|---|---|
| Navy | 327.076 u² |
| Aqua (görünür) | 30.470 u² |
| Açık sayaç kalanı | 175.754 u² |
| **Aqua / sayaç alanı** | **%14,78** — hedef 12–16 ✓ |
| Aqua / toplam mürekkep | %8,52 |

Geçerli oran sayaç tabanlıdır. Toplam mürekkep tabanı bu ayak izi ve şerit
genişliğiyle 12'ye çıkarılamaz; gerekçe aşağıda.

## Wordmark — W1

Inter `wght=700` ana hatları. Cap height **520u** = sembol yüksekliğinin **%65'i**
(hedef 62–68 ✓). Sembol–wordmark boşluğu **288u** = 0,36 × 800 (hedef 0,32–0,40 ✓).
Tümü büyük harf. Optik çift düzeltmesi, em yüzdesi:

| Çift | Düzeltme |
|---|---|
| Q–B | 0 |
| B–L | −%4,5 |
| L–O | −%2,0 |
| O–G | −%2,5 |
| G–G | 0 |

**Q**, Inter'in kendi kuyruğu yerine özel kuyrukla kurulur: sayacın sağ-alt
**iç konturundan** başlar, **45°** ile (sembolün kuyruk açısı) halkayı keser ve
dış konturun ötesinde biter. Tam kiriş değildir; bu bilinçli, çünkü tam kiriş
denendiğinde marka **Ø** olarak okundu (Norveç pazarı için kabul edilemez).

> **Not.** Ø riski wordmark için 22.08 sabahı biliniyordu ve bu satıra
> yazılmıştı — ama aynı içgörü **sembole hiç uygulanmadı**. Sembolün köprüsü
> tam kirişti ve tam da bu yüzden Ø okunuyordu. Bir belgede yazılı olan uyarı,
> kardeş varlığa taşınmadıkça koruma sağlamıyor.

Kuyruk 22.08.2026'da **31°'den 45°'ye** alındı: sembolün kuyruğu 45°'ye
taşınınca wordmark 31°'de kalırsa sistem kendi harfiyle kafiyesiz olur —
sembolün Q'su ile wordmark'ın Q'su aynı markanın aynı harfidir.

Bunun bir bedeli var ve kabul edildi: kuyruk artık **taban çizgisinin altına
iniyor**, wordmark bandı 534u → **551u** (+%3,2). Önceki "tek cap satırında
kalır" özelliği terk edildi. Gerçek Q'lar zaten taban altına iner; kafiye bu
kısıttan daha değerli.

| Ölçüt | Değer |
|---|---|
| Uzunluk | 167,6u |
| Genişlik | 78,0u |
| Açı | 45,0° (sembolün kuyruk açısıyla aynı) |
| Sarım | CCW — O'nun dış konturuyla aynı yönde |
| İç uç | sayaç kenarında, 10u bindirme — çapa (341,8 · 405,1) |
| Kurgu | elle yazılı dörtgen değil; `_wquad()` açıdan türetir |

### 22.08.2026 — kuyruk baştan kuruldu, iki kusur vardı

**1. Sarım yönü tersti ve kuyruk halkayı deliyordu.** Nokta sırası O'nun dış
konturuyla ters yönde dönüyordu. `nonzero` dolgu kuralında ters sarım
birleştirmez, **siler**. Yani kuyruk halkayı boyamıyor, içinden beyaz bir
yarık açıyordu.

Küçük boyutta yarık göze çarpmadığı için fark edilmemişti; 340 px'te
belirgin. Ölçümle doğrulandı: kuyruk merkezindeki piksel `RGB(255,255,255)`
idi, düzeltmeden sonra `RGB(8,44,84)`.

**Bu kusur tüm kilit dosyalarında vardı ve bugüne kadar yayınlanan her
sürümde bulunuyordu.**

**2. İç uç sayacın ortasında asılıydı.** O glifinin iç ve dış konturları font
dosyasından okunup kuyruk ekseni boyunca nokta-poligon testiyle tarandı:

```
t = -40 … 167  →  sayaç içi (beyaz)
t = 168 … 491  →  navy halka
t = 492 …      →  dışarısı
```

İç uç, sayaç kenarından **58,7 birim içerideydi** — kuyruk uzunluğunun
**%36'sı** beyaz alanda kör uçla duruyordu. Belgedeki "sayacın sağ-altından
başlar" tanımına da aykırıydı.

**Dış uzatma neden 55 birim.** İç ucu düzeltince kuyruk halkanın içinde
kayboldu ve marka **"OBLOGG"** okunmaya başladı — yani bir kusur diğerinin
yerini aldı. Dört aday (0/32/55/80) üç boyutta (110/200/340 px)
karşılaştırıldı:

| Uzatma | 110 px | 340 px | Karar |
|---|---|---|---|
| 0 | "OBLOGG" | "OBLOGG" | ✗ kuyruk görünmüyor |
| 32 | sınırda | Q okunuyor | ~ |
| **55** | **Q okunuyor** | **Q okunuyor, bütünleşik** | **✓ seçildi** |
| 80 | Q okunuyor | kuyruk kopuk çubuk | ✗ ağır |

## Beşinci çelişki: sayaç kayması 10–15u imkânsız

Brief sayaç merkezinin kâse merkezinden **10–15u yukarıda** olmasını, aynı
zamanda tüm şeritlerin **150–165u** arasında kalmasını istiyor. İkisi birlikte
sağlanamaz — ve bu, sayaç boyutundan bağımsızdır.

Kâse yüksekliği *K*, sayaç yüksekliği *S*, kayma *X* olsun:

```
üst şerit = (K − S)/2 − X
alt şerit = (K − S)/2 + X
```

İki denklem çıkarılınca *K* ve *S* düşer:

```
alt − üst = 2X
üst ≥ 150  ve  alt ≤ 165   ⟹   2X ≤ 15   ⟹   X ≤ 7,5u
```

Yani **hiçbir sayaç ölçüsünde 10u'ya çıkılamaz.** Şerit aralığı 15u genişliğinde
olduğu için kayma en fazla onun yarısı olabilir.

Uygulanan değer **7u** — ulaşılabilir azaminin (7,5u) hemen altında, tam sayı.
Ölçülen şeritler: üst 151u · alt 165u · yan 158u. Üçü de aralıkta.

Bu bir taviz değil, sınırın kendisidir.

## Neden dört kural gevşetildi

Brief'in sayısal zarfı kendi içinde tutarsız. Dördü de ölçümle kanıtlandı:

**1. Aqua %12–16, toplam mürekkep üzerinden erişilemez.** Navy alanı ayak izi ve
şerit genişliğiyle sabitlenir. Köprünün teorik tavanı = max genişlik × max
uzunluk; zorunlu iki örtüşme kesimi düşüldüğünde bile oran %9,5'i geçemez.
Çözüm: oran sayaç tabanında ölçülüyor (%14,78).

**2. Köprü 235–270u ile "iki uç da tam örtülü" bağdaşmıyor.** Genişliği *w*,
sayaç yarıçapı *R*, dik uzaklığı *h* olan bir köprünün her iki uç köşesinin de
sayaç dışında kalması için uzunluk ≥ 2·√(R²−(h−w)²). Görünür aqua bırakan her
*h* değerinde bu ≥ ~380u demektir.

**3. Köşe yarıçapı 72–88u, "hemen Q okunsun" ile bağdaşmıyor — kritik.**
800×800 ayak izinde bu yarıçap dış siluete kare karakteri verir; sonuç bir harf
kâsesi değil, çerçevedir. Dahası, 235–270u köprü yalnızca sayacın köşesini
keserek elde edilebiliyordu ve bu, geriye sivri uçlu bir açık alan bırakarak
tek renkli üretimde markayı **konuşma balonuna** çeviriyordu — brief'in açıkça
yasakladığı okuma.

**4. Köprü genişliği = şerit genişliği, sayacın %34'ünü kaplıyor.** Hiçbir
konumda Q okunmuyor; ya Ø ya "yasak" işareti çıkıyor. 86u (%17,8) ile Q net.

Elenen adaylar: **A1** köşe kirişi (balon) · **A2** tam kiriş (yasak işareti) ·
**A3** yuvarlak kâse + geniş köprü (Ø) · **B1/B2/B4** kare kâse (çerçeve).
Seçilen: **B3c** — yuvarlak kâse, yumuşak-köşeli sayaç, 86u köprü.

## Dosyalar

| Dosya | Kullanım |
|---|---|
| `qblogg-symbol.svg` | Ana sembol, full-color |
| `qblogg-symbol-navy/black/white.svg` | Tek renk |
| `qblogg-symbol-reverse.svg` | Koyu zeminde, yuvarlatılmış alan |
| `qblogg-icon-small.svg` | 16–32 px; sembolle aynı geometri (ölçek testleri bunu kullanır) |
| `qblogg-favicon.svg` | Tarayıcı sekmesi; `favicon-32.png` ile aynı kompozisyon |
| `qblogg-icon-app.svg` | 1024×1024 uygulama ikonu |
| `qblogg-lockup-horizontal[-white].svg` | Yatay kilit |
| `qblogg-lockup-stacked[-white].svg` | Dikey kilit |

Ölçek testi 16/24/32/48/64 px'te yapıldı. 24 px'te navy en ince yeri ~3,6 px,
sayaç ~11,6 px; **aqua ~2,1 px ile 3 px hedefinin altında**.

### Küçük boy varyantı yeniden ölçüldü — 22.08.2026

`icon-small` daha önce köprüyü 86u'dan **100u'ya** kalınlaştırıyordu ve gerekçe
"16 px'te ayakta kalsın" diye yazılmıştı. Gerekçe **ölçülmemişti**. Ölçüldü:

| 16 px'te | aqua piksel |
|---|---|
| `symbol` (86u) | 24 |
| `icon-small` (100u) | 25 |

**Tek piksel.** 16 px'te bir CSS pikseli 62,5 birime karşılık gelir; 14 birimlik
kalınlaşma 0,22 piksel demektir. Varyantın tüm gerekçesi sayısal olarak boştu.

Kalınlığı artırmak da çözmüyor. Altı kalınlık 16/24/32 px'te ölçüldü:

| Köprü | 16 px aqua | 32 px aqua |
|---|---|---|
| 86u | 19 | 54 |
| 130u | 21 | 67 |
| 160u | 23 | 77 |
| 190u | 25 | 84 |
| 220u | 26 | 90 |

86u → 190u, yani **%121 kalınlaşma**, 16 px'te yalnızca 6 piksel getiriyor ve
büyük boyda şekli hantallaştırıyor. Okunurluğu taşıyan öğe köprü değil,
**sayaç** — "bu delikli bir harf" mesajını o veriyor.

Bu yüzden varyant iki eksende birden değişti. Sayaç merkez etrafında (500, 493)
**1,16 katına** ölçeklendi — yan şerit 158u → 119u — ve köprü **160u**'ya çıktı:

| 16 px | sayaç | aqua |
|---|---|---|
| Önceki (k1,00 · 86u) | 135 | 19 |
| **Seçilen (k1,16 · 160u)** | **143** | **28** |
| Elenen (k1,24 · 160u) | 147 | 27 |

Seçilen aday sayaçta +8, aqua'da **+%47** kazandırıyor. k1,24 sayaçta biraz
daha iyi ama aqua'da geriliyor ve halka 100u'nun altına inip kırılganlaşıyor.

Kazanılan asıl şey sayı değil: köprü artık halkayı **sol altta gerçekten kesip
dışarı çıkıyor**. Q'yu O'dan ayıran özellik budur ve 86u'da zar zor görünüyordu.

**Ana sembol değişmedi.** Kilitler, tescil başvuru dosyaları ve bu belgedeki
27 ölçü ana sembole bağlıdır; küçük boy varyantı bağımsız bir dosyadır.

### Beraberinde çıkan hata — PNG halkası

`ICON_NAVY` sembolden ayrılınca `_ikon_uret` içindeki halka satırı `SYM_NAVY`'de
kalmıştı; PNG favicon'lar SVG app ikonundan farklı çıkacaktı. R01'in aynısı,
ikinci kez. Piksel piksel ölçülüp düzeltildi:

| 32 px'te SVG ↔ PNG | fark > 32 olan piksel |
|---|---|
| Düzeltilmemiş hâli | 155 |
| Düzeltilmiş hâli | **94** |

Kalan 94 piksel iki rasterleştiricinin kenar yumuşatma farkıdır; değişiklikten
önceki taban da aynı büyüklükteydi.

> **Ölçüt notu.** İlk denemede üç toplam renk sayısı (navy/aqua/beyaz)
> kullanıldı ve bu ölçüt iki geometriyi **ayırt edemedi** — hatalı hâl
> düzeltilmiş hâlden daha iyi göründü. Toplam sayımlar yer değiştiren pikselleri
> görmez. Piksel piksel karşılaştırmaya geçildi.

## Q kuyruğu yeniden tasarlandı — 22.08.2026

Bu, projedeki en büyük geometri değişikliği. Gerekçesi ölçümdür.

### Teşhis

Üç bağımsız değerlendirme (harf biçimi, marka anlamı, üretim) aynı yere
işaret etti. Ölçütü harf biçimi uzmanı verdi:

> *"16 px'te, tek renk navy, aqua olmadan render alın. Orada Q değilse hiçbir
> yerde Q değildir."*

Uygulandı. Aqua kaldırılınca geriye **düz bir O** kalıyordu. Yani harf
kimliğinin tamamı renk katmanındaydı.

Üç sonuç, üçü de ölçüldü:

1. **Ø okuması.** Sayacı boydan boya kesen çubuk, Latin alfabesinde yerleşik
   bir işarettir: çizili O, çizili sıfır ve **Norveççe/Danca ø**. Norveç
   merkezli bir marka için tesadüfi benzerlik değil.
2. **Renk bağımlılığı.** Tek renk baskı, gravür, nakış ve tescilin siyah
   dosyası tam olarak aqua'sız hâli kullanır.
3. **Mono varyant farklı şekildi.** `qblogg-symbol-black.svg`'de köprü,
   sayacın sağ alt yarısını dolduran katı bir kamaya dönüşüyordu — mono
   varyant renkli varyantla aynı şekil bile değildi.

Kök sebep tekti: **kuyruk kâseden hiç çıkmıyordu.** Kalınlık ve yön
denemelerinin hepsi belirtiyi tedavi ediyordu.

### Yeni geometri

Kuyruk artık siluetin parçası: sayacın içinden başlar, dış konturu 4:30
yönünde deler, 75u dışarı taşar.

| Parametre | Değer | Nasıl bulundu |
|---|---|---|
| Açı | 45° | Kanonik Q açısı; 31° de denendi, elendi |
| Kalınlık | 100u | Şerit 158u'nun %63'ü |
| İç uç | sayaç kenarının %40'ı | Sol duvara değmiyor — Ø okumasını kıran şey bu |
| Merkez | ikisi de kâse merkezi (500·500) | İç uç sayaç merkezinden alınınca açı 45,7° çıkıyordu |
| Taşma | 75u | Dış kontur 424,3u → uç 499,3u |
| İç uç | (574,9 · 574,9) | Işın–poligon kesişimi |
| Dış uç | (853,0 · 853,0) | Aynı |

Sayısal çözüm elle tahmin değil: dış kâse ve sayaç poligona düzleştirilip
45° ışınla kesiştirildi.

### Ölçülen kazanç

Tek renk render, 30–60° bandında siluetin kâse konturunu aşma oranı:

| | 16 px | 24 px | 32 px |
|---|---|---|---|
| Önceki kiriş | 1,03 | 1,03 | 1,06 |
| 31° kuyruk (elendi) | 1,09 | 1,10 | 1,12 |
| **45° kuyruk** | **1,24** | **1,24** | **1,24** |

1,24 üç boyutta da sabit — piksel tesadüfü değil, yapısal aşma. 31° adayı
ayrıca sembolü genişletiyordu (849×800), kare kabulünü bozuyordu.

**Sınır kutusu değişmedi:** kuyruk 888,4'te bitiyor, kâse zaten 900'e gidiyor.
Kilitler, boşluklar ve tescil zarfı yeniden türetilmeden çalışıyor.

### Brief'ten beşinci sapma

`docs/marka-testleri.md` "köprü siluetin içinde, dış kuyruk yok" diyordu. Bu
madde **bilinçli olarak terk edildi** — maddenin kendisi Ø okumasının
kaynağıydı. Diğer dört sapma aşağıda kayıtlı.

### Yan etki: küçük boy varyantı sadeleşti

`qblogg-icon-small.svg` artık sembolün aynısı. Ayrı varyantın gerekçesi
kuyruk sayacın içindeyken vardı; kuyruk dışarı çıkınca harfi siluet taşıyor
ve siluet her boyda aynı. İki geometriyi ayrı tutmak yalnızca R01 sınıfı
hata üretiyordu — bu oturumda iki kez oldu (köprü, sonra halka).

### Çizim sırası kritik

Eski kirişte aqua **altta** çiziliyordu ve halka onu örtüyordu; çubuk yalnızca
sayacın içinde görünüyordu — Ø okumasının doğrudan kaynağı buydu. Kuyruk artık
dışarı taştığı için **üstte** çizilmeli. Dört yerde düzeltildi: `sym()`,
`icon-small`, `icon-app` ve PNG birleştirmesi. Sonuncusu 180 px'te SVG ile
PNG karşılaştırılarak doğrulandı: fark >32 olan piksel %0,2 (kenar yumuşatma).

### Favicon tutarsızlığı kapatıldı — 22.08.2026

Sayfalar iki favicon bildiriyordu ve **ikisi farklı markaydı**:

| Yuva | Önceki |
|---|---|
| `rel="icon"` SVG | `icon-small.svg` — saydam zeminde navy halka |
| `rel="icon"` PNG | `favicon-32.png` — navy zeminde beyaz halka |

Tarayıcı hangisini seçerse farklı marka görünüyordu. Ayrıca saydam zeminli
SVG, koyu tarayıcı temasında navy halkayı neredeyse görünmez kılıyordu.

> **HIG — App Icons > Design:** *"Provide a visually consistent icon design
> across all the platforms your app supports… prevents people from mistaking
> your app for multiple apps."*

`icon-small.svg` değiştirilmedi: o dosya `uretim-testi.mjs`'nin 16/24/32/48 px
ölçek testlerinde **çıplak sembol** olarak kullanılıyor, rolü farklı. Bunun
yerine `qblogg-favicon.svg` üretildi — PNG ile aynı kompozisyon.

Doğrulandı: 32 px'te ikisi beyaz zemine bindirilip karşılaştırıldı, fark >32
olan piksel **%3,4** (kenar yumuşatma).

> **Ölçüt notu.** İlk karşılaştırma alpha'yı yok sayıyordu ve köşede sahte bir
> uyuşmazlık üretti: PNG'de o piksel saydam (RGB navy, alpha 0), SVG'de beyaz
> zemin görünüyordu. Saydam PNG karşılaştırılırken zemine bindirmek şart.

### Wordmark kuyruğu kurgusu — üçüncü kez aynı sarım hatası

Kuyruk artık elle yazılmış dörtgen değil, `_wquad(açı, uzunluk, kalınlık, çapa)`
işlevinden türüyor. Kurgu, 31°'de eski dörtgeni **birebir** üretiyor (dört nokta
da ±0,2u içinde) — yani türetme doğrulanmış.

Kurguyu yazarken **ters sarım hatasını yeniden yaptım.** Nokta sırasını CW
üretiyordu; `nonzero` kuralında ters sarım birleştirmez, siler. Sonuç: 45°'de
kuyruk O'dan koptu ve altında ayrı bir baklava olarak durdu. Üstelik kodun
yorumunda "Sarım CCW" yazıyordu — kontrol etmeden yazmıştım.

Bu hatanın üçüncü tekrarı: (1) 22.08 sabahı wordmark kuyruğunda, (2) sembol
köprüsünde, (3) burada. Ortak nedeni aynı: **sarım gözle görülmez, ölçülmelidir.**
İşaretli alan hesabı `marka-dogrula.py`'de zaten vardı ve bu seferkini de
yakaladı.

### Kilit optik açıklığı ölçüldü — 22.08.2026

Yeni kuyruk sembolün **sağ-alt** köşesine uzuyor; wordmark de sağda duruyor.
Soru: kuyruk yatay kilitte wordmark'a sokulup açıklığı daraltıyor mu? Sınır
kutusu bunu göstermez — sembolün kutusu kâseyle zaten 900'e gidiyor, kuyruk
888,4'te bitiyor, yani kutu hiç değişmiyor.

Ölçüm `qblogg-lockup-horizontal.svg` düzleştirilip **satır satır** tarandı:
her *y* değerinde sembolün en sağ mürekkebi ile wordmark'ın en solu.

| Ölçü | Değer |
|---|---|
| Sınır kutusu boşluğu | 288,0u |
| Optik açıklık | 288,1u |
| Kuyruğun daralttığı | 0,0u |

En dar satır **y = 500**, yani kâsenin en sağ noktası. Kuyruk hiçbir satırda
belirleyici değil: sağ ucu (888,4) kâsenin sağ ucundan 11,6u geride ve
wordmark'ın harf gövdesinin altında kalıyor. **Düzeltme gerekmiyor.**

> **Düzeltme.** Bu ölçüm ilk kez 1200×240 px tarayıcı render'ı üzerinden
> yapıldı ve **292,0u** çıktı. O sayı yanlıştı: 1u ≈ 0,298 px olduğu için tek
> piksellik kenar yumuşatma belirsizliği ±3,4u demektir. Geometrik tarama
> tam değeri veriyor, tarayıcı gerektirmiyor ve denetleyiciye o girdi.

### Nakış ve ters kullanım — serbest uç ölçüldü

Üretim tarafının iki itirazı vardı:

- **Nakış.** Saten dikiş **serbest uçtan** sökülür. Kuyruğun halkayı kestiği
  yerdeki *boyun* kuyruğun kendisinden ince olursa zayıf nokta orasıdır.
- **Ters kullanım.** Navy zeminde beyaz kuyruk iki yandan yenir; **eğik kesilmiş
  bir uç, dik kesilmiş uçtan daha ince biter.**

| Ölçü | Değer |
|---|---|
| Boyun genişliği | 100,0u |
| Serbest uç sapması | 0,00° |

Boyun, kuyruğun iki uzun kenarının dış konturu kestiği noktalar arasıdır:
(832,2 · 761,5) ile (761,5 · 832,2) — arası **100,0u**, kuyruğun tam kalınlığı.
Daralma yok. Nedeni kurgusal: dış kontur 45° köşegenine göre simetrik olduğu
için iki kesişim birbirinin aynası, aradaki kiriş eksene dik.

Serbest uç kenarı eksene **tam dik** (sapma 0,00°). Bu da kurgunun sonucu:
`_kuyruk()` dörtgeni eksene dik iki kenarla kapatıyor, ışının eğik bitişini
kullanmıyor. Yani "ucu dik kesin" koşulu zaten sağlanmıştı — **geometri
değişmedi, koşul kanıtlandı.** İkisi de artık `marka-dogrula.py` içinde sabit;
biri bozulursa çıkış kodu 1.

#### Asgari üretim boyu — bu bizim kuralımız

Sembol S mm basıldığında 1u = S/800 mm:

| Sembol boyu | Kuyruk kalınlığı | Taşma |
|---|---|---|
| 10 mm | 1,25 mm | 0,94 mm |
| 12 mm | 1,50 mm | 1,13 mm |
| 20 mm | 2,50 mm | 1,88 mm |

**Kural: 12 mm altında kuyruk saten dikişle işlenmez.** O boyutta sembol tek
renk düz dolgu olarak, aqua ayrımı yapılmadan uygulanır.

Bu eşik **bizim tedbirimizdir; bir kurum ya da sektör şartı değildir.** Aranan
kaynaklar forum ve sosyal medya gönderileriydi, alıntılanabilir bir standart
bulunamadı. Eşik, ölçülen 1,50 mm kalınlığın yuvarlak bir sınır olmasından
geliyor — sökülme deneyinden değil. **Sipariş öncesi işlemeciye teyit ettirin.**

## Kalan üretim notları

- 16 px'te aqua zayıf kalıyor ama artık seçiliyor (28 piksel). Harf kimliği bu
  boyutta yine de tam okunmaz; o boyutta marka rengi ve siluetiyle çalışır.
  Bu **bilinçli bir ödünleşimdir**, fark edilmemiş bir kusur değil.
- ~~Q kuyruğunun sayaç içindeki kör ucu~~ — **kapandı 22.08.2026.** Kör uç
  kaldırıldı; ayrıca ters sarımdan doğan ve kuyruğu halkayı delen ayrı bir
  kusur bulunup düzeltildi. Detay yukarıda.
- ~~Sayaç merkezi 7u (hedef 10–15)~~ — **kapandı 22.08.2026: hedef imkânsız.**
  Cebirsel kanıt aşağıda; 7u ulaşılabilir azami değer, eksik değil sınır.
- ~~Overshoot kilitte uygulandı, sembolün kendi konturunda uygulanmadı~~ —
  **kapandı 22.08.2026: böyle bir adım hiç yok.** Belge hatası düzeltildi.
- Beş saniyelik hafıza testi protokolü yazıldı ama **uygulanmadı**; katılımcı
  sonucu üretilmemiştir.

## Renk: dosyalar sabit, sitedeki satır içi SVG döner

Denetim v0.3 / R02 bu ikisini karıştırmıştı; ayrımı burada yazıyoruz.

**`assets/brand/` içindeki SVG dosyaları sabit renk kullanır** (`#082C54`,
`#00D8C2`, `#000000`, `#FFFFFF`). `currentColor` yok ve olmamalı: bunlar
dağıtım ve başvuru masterı; renkleri çağıran ortama göre değişen bir dosya
tescil masterı olamaz.

**Sitenin HTML'ine gömülü satır içi SVG ayrı bir şeydir.** Orada halka
`fill="currentColor"` kullanır ve `--logo-ink` ile temaya göre döner; aqua
köprü her iki temada sabit kalır. Tema desteği iddiası buna aittir.

## Hukuki

Marka müsaitliği veya tescil edilebilirliği konusunda **hiçbir iddia
üretilmemiştir**. Başvuru kapısı, biçim şartları ve boş kalan hukuki alanlar:
`docs/marka-tescili.md`. Denetim yanıtı: `docs/denetim/YANIT.md`. Norveç (Patentstyret), EUIPO ve WIPO araştırması yapılmadı;
bu araştırma tamamlanmadan marka ticari kullanıma alınmamalıdır.

## Figma

Hedef dosya `SizThPMNI32oZ7K6h8A4VM` bu hesaptan düzenlenemiyor (`whoami`
koltuğu **View** döndürüyor). Çalışma dosyası:
https://www.figma.com/design/AEMuDEnZrrETaqurOvHyYz — `QBLOGG/Marka` değişken
koleksiyonu ve iki boya stili kurulu. Starter planı 3 sayfa ve 1 mod ile
sınırlı. Bu belgedeki vektörler Figma'dan bağımsızdır.
