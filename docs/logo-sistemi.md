# QBLOGG kimlik sistemi

Üretim: `python3 scripts/marka-uret.py` (gereken: `pip install fonttools brotli`).
Çıktılar `assets/brand/` — **13 varlığın hepsi**: 11 SVG + 2 PNG (favicon-32,
apple-touch-icon). PNG'ler önce elle yapılmıştı ve yeniden üretilemiyordu; artık
betiğin içindeki stdlib rasterleştirici üretiyor (çift-tek tarama, y'de 8 kat
örnekleme, x'te tam örtüşme). Yeni bağımlılık yok. Betik yolları kendi konumundan
çözer, yani depo kökünden de kaynak paketinden de çalışır. Wordmark ana hatları deponun kendi Inter değişken
fontundan `wght=700`'de örneklenir — dış servis, kurulu font veya Figma gerekmez.

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

Overshoot kilitte uygulanır: sembol, wordmark'ın cap çizgisini alttan ve üstten
10u aşar (yuvarlak formun düz forma göre optik küçülmesini telafi eder).

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
sağ-altından başlar, **31°** ile (sembolün köprü açısı) halkayı keser, dış
konturun 22u ötesinde biter. Taban çizgisinin altına inmez — wordmark tek cap
satırında kalır (534u). Tam kiriş değildir; bu bilinçli, çünkü tam kiriş
denendiğinde marka **Ø** olarak okundu (Norveç pazarı için kabul edilemez).

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
- Q kuyruğunun sayaç içindeki kör ucu, çok büyük ölçekte küçük bir açık kama
  bırakıyor. Basılı 100 mm üzeri kullanımda gözden geçirilmeli.
- Sayaç merkezi 7u (hedef 10–15); 10u'da üst şerit 146u'ya düşüyor.
- Overshoot kilitte uygulandı, sembolün kendi konturunda uygulanmadı.
- Beş saniyelik hafıza testi protokolü yazıldı ama **uygulanmadı**; katılımcı
  sonucu üretilmemiştir.

## Hukuki

Marka müsaitliği veya tescil edilebilirliği konusunda **hiçbir iddia
üretilmemiştir**. Norveç (Patentstyret), EUIPO ve WIPO araştırması yapılmadı;
bu araştırma tamamlanmadan marka ticari kullanıma alınmamalıdır.

## Figma

Hedef dosya `SizThPMNI32oZ7K6h8A4VM` bu hesaptan düzenlenemiyor (`whoami`
koltuğu **View** döndürüyor). Çalışma dosyası:
https://www.figma.com/design/AEMuDEnZrrETaqurOvHyYz — `QBLOGG/Marka` değişken
koleksiyonu ve iki boya stili kurulu. Starter planı 3 sayfa ve 1 mod ile
sınırlı. Bu belgedeki vektörler Figma'dan bağımsızdır.
