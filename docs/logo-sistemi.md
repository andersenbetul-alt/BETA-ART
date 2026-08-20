# QBLOGG kimlik sistemi — durum, ölçümler ve açık kararlar

Bu belge, "A1 Soft Interlock Q" briefinin uygulanmasını ve uygulama sırasında
ölçümle ortaya çıkan üç yapısal çelişkiyi kayda geçirir. **Sistem henüz
onaylanabilir durumda değil**; nedeni aşağıda kanıtla birlikte.

Üretim: `python3 scripts/marka-uret.py` (gereken: `pip install fonttools brotli`).
Çıktılar `assets/brand/`. Wordmark ana hatları deponun kendi Inter değişken
fontundan `wght=700`'de örneklenir — dış servis ve kurulu font gerekmez.

## Sabit geometri (1000×1000 ızgara)

| Öğe | Değer |
|---|---|
| Dış ayak izi | 800×800; üst/alt bombe ile 820×820 (overshoot 10u) |
| Şerit genişliği | yan 158u · üst 151u · alt 165u |
| Dış köşe yarıçapı | 80u; sağ-alt 76u |
| Sayaç | 484×484, superellipse (kenar bombesi 6u, köşe 120u) |
| Sayaç merkezi | geometrik merkezin 7u üstünde |
| Sağ-alt optik telafi | +%4,4 (alt şerit / yan şerit) |
| Köprü açısı | 31° |
| Köprü genişliği | 165,5u (şeridin +%4,7'si) |
| Köprü uzunluğu | 269,3u |
| Örtüşme kesimi | tam 2 adet, her biri 18u |
| Yol yapısı | 1 kapalı navy yol (evenodd, dış + sayaç) + 1 kapalı aqua yol |
| Efekt | gradyan 0 · gölge 0 · maske 0 · kontur 0 |

Renkler yalnızca Midnight Navy `#082C54` ve Electric Aqua `#00D8C2`.

## Wordmark (W1)

Inter `wght=700` ana hatları, cap height **520u** — sembol yüksekliğinin
**%65'i** (hedef 62–68 ✓). Sembol–wordmark boşluğu 288u = 0,36 × 800 (hedef
0,32–0,40 ✓). Optik çift düzeltmesi, em'in yüzdesi olarak:

| Çift | Düzeltme |
|---|---|
| Q–B | 0 |
| B–L | −%4,5 |
| L–O | −%2,0 |
| O–G | −%2,5 |
| G–G | 0 |

Q, Inter'in 45° taban-altı kuyruğu yerine **31°'lik özel terminalle** kurulur;
sembolün köprü açısını yineler, taban çizgisinin altına inmez, sohbet-kuyruğu
biçimi oluşturmaz. Wordmark tek satır cap yüksekliğinde kalır (534u).

## Ölçülen alan dağılımı

0,25 u² örneklemeli tarama ile (`scripts/` dışında, tek seferlik):

| Ölçü | Değer |
|---|---|
| Navy alanı | 424.398 u² |
| Aqua görünür alanı | 31.918 u² |
| Açık sayaç kalanı | 196.639 u² |
| Aqua / toplam mürekkep | **%6,99** |
| Aqua / sayaç alanı | **%13,96** |

Marka kılavuzunda geçerli oran **sayaç tabanlı** olandır (%12–16 bandında).
Toplam mürekkep tabanlı ölçüm bu geometriyle 12'ye çıkarılamaz — nedeni aşağıda.

## Üç kanıtlanmış çelişki

Brief'in başarı ölçütleri kendi aralarında çelişiyor. Üçü de tercih değil,
hesap:

**1. Aqua %12–16, toplam mürekkep üzerinden erişilemez.**
Navy alanı 800×800 ayak izi ve 150–165u şeritle ~424.000 u²'ye sabitlenir.
Aqua'nın teorik tavanı = köprü genişliği (max 165,5u) × uzunluk (max 270u)
= 44.563 u², yani hiç örtüşme olmasa bile **%9,5**. İki zorunlu örtüşme
kesimiyle gerçek değer %7,0. Çözüm: oranı sayaç tabanlı ölçmek (uygulandı).

**2. Köprü uzunluğu 235–270u, "iki ucu da tam örtülü" koşuluyla bağdaşmıyor.**
Genişliği *w*, sayaç yarıçapı *R* olan bir köprünün her iki uç köşesinin de
sayaç dışında kalması için uzunluğun ≥ 2·√(R² − (h−w)²) olması gerekir. R=242,
w=82,75 için bu, görünür aqua bırakan her *h* değerinde **≥ ~380u** demektir.
235–270u yalnızca köprü sayacın **köşesini** kestiğinde mümkündür — ki bu
üçüncü sorunu doğurur.

**3. Köşe kirişi tek renkte konuşma balonu üretiyor. — kritik**
Köprü sayacın sağ-alt köşesini kesince geriye kalan açık alanın ucu sivrilir.
Aqua ile navy aynı renge indiğinde (1-renk siyah, 1-renk beyaz, gri tonlama,
"aqua olmadan üretim") siluet **konuşma balonuna** dönüşür. Bu, brief'in
açıkça yasakladığı okumadır. Kanıt: `docs/gorseller/logo-aday-karsilastirma.png`.

## Denenen adaylar

| Aday | Köprü | Aqua | Tek renk sonucu |
|---|---|---|---|
| **A1** köşe kirişi (spec uyumlu) | 269u | %7,0 | ✗ konuşma balonu |
| **A2** tam kiriş | 600u | %15,9 | ✗ "yasak" işareti / eğik çizgi |
| **A3** yuvarlak kâse (köşe 260u) | 451u | ~%12 | ~ balon yok, ama "Ø" gibi okunuyor; sayaç üst kenarında dalgalanma |

`assets/brand/` şu an **A1**'i üretir — ölçülebilir kriterlerin tamamını
geçen tek aday, ama 3. maddedeki balon kusuru nedeniyle **yayına alınmamalı**.
Siteye bağlanmadı; mevcut `.logo-mark` yerinde duruyor.

## Kök neden

800×800 ayak izinde 72–88u köşe yarıçapı, dış siluete kare karakteri verir;
bu bir harf kâsesi değil, çerçeve olarak okunur. Q'luk yükünün tamamı aqua
öğesine biner ve hiçbir köprü yerleşimi bunu tek başına taşıyamaz. Kâseyi
harfe benzetmek için köşe yarıçapının belirgin biçimde büyümesi gerekir
(A3'te 260u denendi) — bu da 72–88u kuralını kırar.

## Karar bekleyen

1. Hangi kural gevşetilsin: **köşe yarıçapı 72–88u** mu, **köprü uzunluğu
   235–270u** mu? İkisinden biri gevşemeden okunabilir bir Q çıkmıyor.
2. A3'ün sayaç kenarındaki dalgalanma, bombe ile büyük yarıçapın çakışmasından
   kaynaklanıyor; yön onaylanırsa kenar bombesi kaldırılıp temiz teğetle
   yeniden kurulmalı.

## Platform engelleri

- Hedef dosya `SizThPMNI32oZ7K6h8A4VM`: yazma izni yok
  (*"Looks like you don't have edit access to this file"*). Editor yetkisi gerekiyor.
- Figma Starter: **3 sayfa** sınırı (brief 8 sayfa istiyor) ve değişken
  koleksiyonlarında **1 mod** sınırı.
- Figma MCP çağrı kotası oturum içinde doldu; kalan Figma işi kota yenilenince
  sürdürülebilir. Bu belgedeki vektörler Figma'ya bağımlı değildir.

## Hukuki

Marka müsaitliği veya tescil edilebilirlik konusunda **hiçbir iddia
üretilmemiştir**. Norveç (Patentstyret), EUIPO ve WIPO araştırması yapılmadı;
bu araştırma yapılmadan marka kullanıma alınmamalıdır.
