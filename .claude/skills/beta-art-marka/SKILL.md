---
name: beta-art-marka
description: >
  Beta Art marka varlıklarını yönet ve güncelle — logo SVG'leri üret, renk sistemi
  uygula, BA monogramını oluştur veya düzelt. "Beta Art logosu", "marka", "logo",
  "brand assets", "BA monogram", "logo güncelle", "yeni logo", "SVG üret" gibi
  ifadelerde MUTLAKA bu skill'i kullan. Marka tescil belgelerini ve slogan listesini
  de kapsar.
---

# Beta Art Marka Skill'i

Beta Art'ın görsel kimliğini üretir, doğrular ve günceller.
**Temel varlıklar:** `brand/beta-art/master/` içindeki 4 SVG — bunlar el ile
düzenlenmez, geometri bu belgeden türetilir.

## Birincil işaret: BA Monogramı

Resmi birincil marka işareti. Her Beta Art projesinde değiştirmeden kullanılır.

### Geometri (viewBox 200 × 200)

| Öğe | SVG |
|-----|-----|
| B gövdesi | `<line x1="32" y1="42" x2="32" y2="158" stroke-width="4" stroke-linecap="round"/>` |
| B üst kâse | `<path d="M 32,42 Q 78,42 78,71 Q 78,100 32,100" stroke-width="3.2" fill="none"/>` |
| B alt kâse | `<path d="M 32,100 Q 84,100 84,129 Q 84,158 32,158" stroke-width="3.2" fill="none"/>` |
| A sol bacak | `<line x1="134" y1="42" x2="97" y2="158" stroke-width="3.2"/>` |
| A sağ bacak | `<line x1="134" y1="42" x2="172" y2="158" stroke-width="3.2"/>` |
| A çapraz | `<line x1="113" y1="112" x2="155" y2="112" stroke-width="2.6"/>` |

Tüm öğelerde `stroke-linecap="round"`, `fill="none"`.

### Renkler

| Değişken | Hex | Kullanım |
|----------|-----|----------|
| Altın (koyu zemin) | `#C4A35A` | `logo-mark.svg` + `logo-horizontal.svg` |
| Koyu (açık zemin) | `#1A1714` | `logo-mark-cream.svg` + `logo-horizontal-white.svg` |
| Zemin koyu | `#0A0908` | `logo-mark.svg` arka planı |
| Zemin krem | `#F2EFE8` | `logo-mark-cream.svg` arka planı |

### Yatay kilit wordmark metni

```
BETA ART               (font-size="18" font-weight="700" letter-spacing="3")
PHOTOGRAPHY ARCHIVE    (font-size="7.5" letter-spacing="2.5")
————————————————       (hairline rule: stroke-width="0.5")
Trust the evidence behind every image.  (font-size="6.5" font-style="italic")
```

## Varlık dosyaları

```
brand/beta-art/master/
  logo-mark.svg              Altın/koyu — koyu zeminde kullan
  logo-mark-cream.svg        Koyu/krem — açık zeminde kullan
  logo-horizontal.svg        İşaret + wordmark, koyu
  logo-horizontal-white.svg  İşaret + wordmark, açık
  README.md                  Geometri, renk, kullanım kuralları
```

## Logo üretme veya güncelleme

SVG'ler doğrudan yazılır — harici araç, Figma veya betik gerekmez.
Geometriyi yukarıdaki tabloya göre üret; `stroke="currentColor"` YAZMA,
`stroke="#C4A35A"` (veya `#1A1714`) kullan — CSS bağlamı dışındaki SVG
`currentColor`'ı çözemez.

```bash
# Doğrulama: boyut ve öğe varlığı kontrolü
python3 scripts/marka-dogrula.py   # marka-uret.py çıktısını denetler
```

NOT: `scripts/marka-uret.py` **QBLOGG** kimliğini üretir (Q sembolü),
Beta Art logosunu DEĞİL. Beta Art SVG'leri elle yazılır.

## Sloganlar (resmi, değiştirilemez)

- Ana slogan: **REAL PEOPLE. REAL PLACES. REAL MOMENTS.**
- Alt slogan: **Trust the evidence behind every image.**
- Alt kimlik: **VERIFIED HUMAN PHOTOGRAPHY**

## Kullanım kuralları

1. İşareti asla döndürme, eğme veya boyut orantısız yeniden ölçekle.
2. Minimum ekran boyutu: 24 px genişlik.
3. Nötr gri arka planda koyu varyantı kullan.
4. Açık zemin → krem varyant; koyu zemin → altın varyant.

## Tescil

- Patentstyret (NO): https://www.patentstyret.no/
- EUIPO (AB): https://www.euipo.europa.eu/en
- Detaylar: `docs/marka-tescili.md`
- Bu ortamda her iki site de engelli — doğrulama Firecrawl arama alıntılarıyla
  yapılır; başvuru öncesi tarayıcıda kendiniz teyit edin.

## C2PA / İçerik Kimlik Doğrulama

Beta Art'ın değer önerisi fotoğrafların kriptografik imzasına dayanır.
Referans: Sony/Leica kamera seviyesi imzalama; Adobe CAI entegrasyonu.
`docs/` klasöründeki araştırma raporunda detaylar mevcut.
