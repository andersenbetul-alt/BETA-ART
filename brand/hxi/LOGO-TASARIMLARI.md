# HXI — Marka Kimliği

Tarih: 30 Ağustos 2026  
Proje: hxi-music (Vercel, BET-ART takımı)

## Varlıklar

| Dosya | Kullanım |
|---|---|
| `wordmark.svg` | Düz vektör master — H+X+I wordmark |
| `symbol.svg` | Düz vektör master — X monogramı, daire içinde |
| `designs.html` | Tarayıcıda açın — 3 konsept, 4 zemin, boyut testi |

## Renk paleti

| İsim | Hex | Kullanım |
|---|---|---|
| Void | `#07070A` | Birincil koyu zemin |
| Deep | `#0F0F16` | Kart zemini |
| Signal | `#E8153A` | X aksanı, sembol dolgusu |
| Noise | `#F2F2EE` | Tip ve logo (koyu zeminde) |

**Kontrast (WCAG 2.1 AA):**
- Signal / Void: 4.5:1 ✓
- Noise / Void: ~18:1 ✓
- Signal açık zeminde yalnızca grafik/büyük başlık (3.9:1) — metin değil

## Geometri

**H letterform**
- Cap height: 200u
- Stem genişliği: 28u (%14)
- Crossbar: y=86–114 (merkez y=100, yükseklik=28)
- Toplam genişlik: 140u

**X letterform**
- Bounding box: 140×200u
- Diyagonal uzunluk: 244.13u
- Perpendiküler yarı genişlik: 14u
- Polygon 1: `-11.47,8.03 11.47,-8.03 151.47,191.97 128.53,208.03`
- Polygon 2: `128.53,-8.03 151.47,8.03 11.47,208.03 -11.47,191.97`

**I letterform**
- Genişlik: 28u (stem genişliği)
- Yükseklik: 200u

**Wordmark düzeni**
- H: x=0
- X: translate(176,0) — H→X nominal aralık: 36u
- I: x=352 — X→I nominal aralık: 36u
- ViewBox: `-16 -12 412 224`

**X sembolü (symbol.svg)**
- Daire: cx=100, cy=100, r=96
- X transform: `translate(47,24) scale(0.76)` → merkez (100.2, 100)
- Köşe mesafeleri: ≈93.3u < r=96 ✓

## 3 Konsept

| Konsept | Açıklama | Durum |
|---|---|---|
| **A — Signal** | H+I nötr, X signal kırmızı | ÖNERİLEN |
| **B — Threshold** | Tüm harfler nötr + yatay kırmızı çizgi | Variant |
| **C — Monogram** | Yalnızca X — daire, kontur, kare, serbest | İkon kullanımı |

## Üretim notları

- `wordmark.svg` ve `symbol.svg` stroke içermez — tüm şekiller filled polygon/path
- Gradyan, gölge, glow, raster mask yok — flat vector master
- Yeniden üretim: bu README'deki ölçülerle sıfırdan yeniden çizilir
- Tescil öncesi: profesyonel marka taraması zorunlu (HXI kelime markası ve X monogramı)
