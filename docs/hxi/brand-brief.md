# HXI — Marka Brief

Sürüm: 0.2 · 30.08.2026  
Durum: Yön kararlaştırıldı — logo ve varlık üretimi bekliyor.

## Kimlik

**Ad:** HXI  
**Tanım:** Nordic phonk elektronik sanatçısı ve prodüktör — Oslo, Norveç  
**Konum:** 59.91°N · 10.75°E  
**Tagline:** THE SAME SPEED — COLDER.  
**Ton:** Ham, teknik, Kuzey'e özgü soğukluk. Sesini satar değil — sesini yayar.

HXI bir hizmet stüdyosu değildir. Bir sanatçı markasıdır: prodüksiyon,
sinyal ve mekânın —  Oslo kış gecesinin — estetiğine dayalı.

## Marka DNA

```
SOUND × PLACE × SIGNAL × IMPACT × CULTURE
```

## Marka mimarisi

```
HXI                  (master sanatçı kimliği)
├── HXI Music        (müzik yayınları ve prodüksiyon)
├── HXI Credits      (diğer sanatçılarla çalışmalar)
├── HXI Creator Use  (sample pack, preset, araç)
├── HXI Sync         (lisanslama, plasman)
├── HXI Booking      (canlı performans)
└── HXI Press        (basın ve medya)
```

## Renk paleti

| Ad | Hex | Kullanım |
|---|---|---|
| Deep Black | `#080808` | Birincil zemin — neredeyse saf siyah |
| Off White | `#F0EDE8` | Birincil metin — ılık beyaz, soğuk değil |
| Acid Signal | `#C8FF00` | Vurgu — limon-neon; metinde kullanılmaz |
| Signal Red | `#EF2B2D` | İkincil vurgu — Norveç bayrağından |

**Kontrast notu:**
- Off White / Deep Black: ≥ 19:1 ✓
- Acid Signal / Deep Black: ~9,7:1 ✓ (grafik vurgu; metin boyutunda test et)
- Signal Red / Deep Black: ~4,8:1 ✓ (büyük metin / grafik için yeterli; küçük metinde dikkat)

**Acid Signal asla metin rengi olarak açık zemin üzerinde kullanılmaz.**

## Tipografi

| Rol | Yazı tipi | Kullanım |
|---|---|---|
| Display | Barlow Condensed | Başlıklar, poster tipografi, Hero |
| Body | IBM Plex Sans | Metin, ara başlıklar, UI |
| Metadata | Space Mono | Koordinat, sürüm, teknik etiket |

Lisans: tümü açık kaynak (Google Fonts / IBM Plex ailesi).  
Kayıt: `assets/hxi/fonts/KAYNAK.md` — varlık üretimi başladığında doldurulacak.

## UTGAVE editorial sistemi

Yayınlar UTGAVE numarasıyla ayrılır: UTGAVE 01, 02, 03 …  
Her UTGAVE bir koleksiyon veya dönem belgesini temsil eder.

## İkon kuralı

QBLOGG ile aynı standart: satır içi SVG, 24×24 ızgara, `fill="none"`,
`stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak uç/birleşim.
Emoji kullanılmaz.

## Logo — durum

Tasarım kararı verilmedi. Aday A yönü (net geometrik logotype) öne çıkıyor.
Minimum üretim şartları:

- Saf vektör, efektsiz
- Yeniden üretilebilir: `scripts/hxi-marka-uret.py`'den çıkmalı
- Küçük boy testi: 16 / 24 / 32 / 48 px ve mono siluet
- Tescil zarfı: JPEG, maks 2835×2010 px, 96–300 DPI, 2 MB altı, RGB

## Tescil durumu

Marka araştırması yapılmadı. "HXI" ve "THE SAME SPEED — COLDER." için
Patentstyret + TMview/EUIPO taraması gerekiyor.

Nice sınıf adayları: 41 (müzik hizmetleri / yayınları), 09 (ses kaydı / yazılım)  
Profesyonel tarama + vekil görüşü gerekiyor; doğrulanmadan ticari yayılma yapılmamalı.

## Yapılacaklar

| # | İş | Durum |
|---|---|---|
| 1 | Logo tasarımı → `scripts/hxi-marka-uret.py`'e dönüştür | Bekliyor |
| 2 | Marka araştırması (Patentstyret + TMview) | Bekliyor |
| 3 | Tescil dosyalarını üret | Betik sonrası |
| 4 | Yazı tipi lisanslarını `assets/hxi/fonts/KAYNAK.md`'e kaydet | Logo ile birlikte |
| 5 | HXI web sitesi: 9 ekranlı mimari (bkz. BUSINESS.md) | Bekliyor |
