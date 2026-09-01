# COBBAN — Marka Kimliği

Tarih: 30 Ağustos 2026  
Proje: COBBAN (BETA-ART)

## Varlıklar

| Dosya | Kullanım |
|---|---|
| `wordmark.svg` | Düz vektör master — C+O+B+B+A+N wordmark |
| `symbol.svg` | Düz vektör master — C monogramı, daire içinde |
| `designs.html` | Tarayıcıda açın — 3 konsept, 4 zemin, boyut testi |

## Renk paleti

| İsim | Hex | Kullanım |
|---|---|---|
| Void | `#06060A` | Birincil koyu zemin |
| Deep | `#101018` | Kart zemini |
| Ember | `#D95F0A` | C aksanı, sembol dolgusu |
| Ash | `#EFEFEB` | Tip ve logo (koyu zeminde) |

**Kontrast (WCAG 2.1 AA):**
- Ember / Void: 5.6:1 ✓ (grafik/büyük başlık için)
- Ash / Void: ~18:1 ✓
- Ember açık zeminde yalnızca grafik/büyük başlık — metin değil

## Geometri

**C letterform**
- Bounding box: 120×200u
- Stem genişliği: 24u (%12 cap height)
- Path: `M0,0 H120 V24 H24 V176 H120 V200 H0 Z`

**O letterform**
- Bounding box: 140×200u
- Stem genişliği: 24u
- Path (evenodd): `M0,0 H140 V200 H0 Z M24,24 H116 V176 H24 Z`

**B letterform**
- Bounding box: 128×200u
- Üst çıkıntı genişliği: 112u (y=0–100)
- Alt çıkıntı genişliği: 128u (y=100–200, daha geniş)
- Path (evenodd):
  - Dış: `M0,0 H112 V100 H128 V200 H0 Z`
  - Üst delik: `M24,24 H88 V96 H24 Z`
  - Alt delik: `M24,104 H100 V176 H24 Z`

**A letterform**
- Bounding box: 130×200u
- Sol bacak (polygon): `53,0 77,0 24,200 0,200`
- Sağ bacak (polygon): `53,0 77,0 106,200 130,200`
- Çapraz çubuk (rect): x=52, y=92, w=26, h=24

**N letterform**
- Bounding box: 140×200u
- Sol stem: rect(0, 0, 24, 200)
- Sağ stem: rect(116, 0, 24, 200)
- Diyagonal (polygon): `24,0 50,0 116,200 90,200`

**Wordmark düzeni**
- C: x=0
- O: translate(150,0)
- B1: translate(320,0)
- B2: translate(478,0)
- A: translate(636,0)
- N: translate(796,0)
- ViewBox: `-16 -12 968 224`

**C sembolü (symbol.svg)**
- Daire: cx=100, cy=100, r=96
- C transform: `translate(51,18) scale(0.82)` → merkez (100.2, 100) ✓
- Köşe mesafeleri: ≈95.8u < r=96 ✓

## 3 Konsept

| Konsept | Açıklama | Durum |
|---|---|---|
| **A — Ember** | C ember, geri kalanı nötr | ÖNERİLEN |
| **B — Dual** | Her iki B de ember, geri kalanı nötr | Variant |
| **C — Monogram** | Yalnızca C — daire içinde | İkon kullanımı |

## Üretim notları

- `wordmark.svg` ve `symbol.svg` stroke içermez — tüm şekiller filled polygon/path/rect
- Gradyan, gölge, glow, raster mask yok — flat vector master
- Yeniden üretim: bu README'deki ölçülerle sıfırdan yeniden çizilir
- Tescil öncesi: profesyonel marka taraması zorunlu (COBBAN kelime markası ve C monogramı)
