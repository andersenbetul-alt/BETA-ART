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
| Köprü açısı | 31° | 28–34 ✓ |
| Köprü genişliği | 86u | şerit ±%5 ✗ **gevşetildi** |
| Köprü uzunluğu | 461,5u | 235–270 ✗ **gevşetildi** |
| Köprü konumu | normal 59° (≈4:50) | ≈4:30 ~ |
| Örtüşme kesimi | tam 2 adet | 2 ✓ |
| Köprü siluetin içinde | evet, dış kuyruk yok | ✓ |
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

**Q**, Inter'in 45° taban-altı kuyruğu yerine özel kuyrukla kurulur: sayacın
sağ-alt **iç konturundan** başlar, **31°** ile (sembolün köprü açısı) halkayı
keser ve dış konturun ötesinde biter. Taban çizgisinin altına inmez — wordmark
tek cap satırında kalır (534u). Tam kiriş değildir; bu bilinçli, çünkü tam
kiriş denendiğinde marka **Ø** olarak okundu (Norveç pazarı için kabul
edilemez).

| Ölçüt | Değer |
|---|---|
| Uzunluk | 167,6u |
| Genişlik | 78,0u |
| Açı | 31,0° (sembolün köprü açısıyla aynı) |
| Sarım | CCW — O'nun dış konturuyla aynı yönde |
| İç uç | sayaç kenarında, 10u bindirme |

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
| `qblogg-icon-small.svg` | 16–32 px; köprü 100u'ya kalınlaştırılmış |
| `qblogg-icon-app.svg` | 1024×1024 uygulama ikonu |
| `qblogg-lockup-horizontal[-white].svg` | Yatay kilit |
| `qblogg-lockup-stacked[-white].svg` | Dikey kilit |

Ölçek testi 16/24/32/48/64 px'te yapıldı. 24 px'te navy en ince yeri ~3,6 px,
sayaç ~11,6 px; **aqua ~2,1 px ile 3 px hedefinin altında**. Bu yüzden
`icon-small` ayrı bir varyant olarak köprüyü 100u'ya kalınlaştırır. 16 px'te
aqua pratikte kaybolur; o boyutta `symbol-navy` kullanın.

## Kalan üretim notları

- 16 px'te aqua ayırt edilemiyor; tek renk varyantı zorunlu.
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
