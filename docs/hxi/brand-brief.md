# HXI — Marka Brief

Sürüm: 0.1 · 30.08.2026  
Durum: Taslak — renk, tipografi ve geometri kararları onaylanmadı.

## Kimlik

**Ad:** HXI  
**Sektör:** Müzik prodüksiyon stüdyosu  
**Konum:** Norveç  
**Ton:** Profesyonel, teknik, erişilebilir — aşırı parlak değil, aşırı soğuk da değil.

## Marka mimarisi

```
HXI                    (ana marka — descriptor'suz master)
HXI STUDIO             (stüdyo hizmetleri)
HXI MIX                (opsiyonel — mix/mastering alt birimi)
```

Descriptor boyutu, harf aralığı ve clear space: QBLOGG ve NAVIAR
deneyiminden çıkan kurala göre belirlenir (HXI ana markasının cap
height'ının %24–30'u).

## Renk paleti — taslak

| Ad | Hex | Kullanım | Durum |
|---|---|---|---|
| Signal Black | `#0D0D0D` | Birincil zemin | Onay bekliyor [H] |
| Studio White | `#F2F0EB` | Metin, açık zemin | Onay bekliyor [H] |
| Tape Red | `#D94F3D` | Vurgu, eylem | Onay bekliyor [H] |
| Console Grey | `#4A4A4A` | İkincil metin, arka plan | Onay bekliyor [H] |

[H] = Henüz kesinleşmedi. Kontrast oranları hesaplanmadan
kullanılamaz (WCAG 2.1 AA: metin 4.5:1, grafik 3:1).

**Onay öncesi kontrol listesi:**
- [ ] Signal Black üzerinde Studio White kontrast oranı ölçüldü mü?
- [ ] Tape Red açık zeminde metin olarak kullanılacaksa kontrast yeterli mi?
- [ ] Renklerin tek kaynak hex değerleri `scripts/hxi-marka-uret.py`'e girildi mi?

## Tipografi — taslak

Karar verilmedi. Değerlendirme kriterleri:
- Lisans: açık kaynak veya ticari kullanım izni
- Ses/müzik sektöründe okunabilirlik
- Latin + Norveç karakterleri (æ, ø, å) tam destek

Karar verildiğinde `assets/hxi/fonts/KAYNAK.md`'e kayıt düşülecek
(QBLOGG'un `assets/fonts/KAYNAK.md` modelinde).

## İkon kuralı

QBLOGG ile aynı kural: satır içi SVG, 24×24 ızgara, `fill="none"`,
`stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak uç/birleşim.
Emoji kullanılmaz.

## Logo — taslak

Tasarım kararı verilmedi. Minimum üretim şartları (NAVIAR ve QBLOGG
deneyiminden):

- Saf vektör, efektsiz (gradient/gölge/bevel yok)
- Yeniden üretilebilirlik: betikten çıkmalı (`scripts/hxi-marka-uret.py`)
- Küçük boy testi: 16 / 24 / 32 / 48 px ve tek renk siluet
- Minimum ölçü: `[DOLDURULACAK]` px dijital / `[DOLDURULACAK]` mm baskı
- Tescil zarfı: JPEG, maks 2835×2010 px, 96–300 DPI, 2 MB altı, RGB

## Tescil durumu

Marka araştırması yapılmadı. "HXI" kısa ve soyut bir kombinasyon —
ayırt edicilik açısından güçlü olabilir, ancak sicil taraması
(Patentstyret, TMview/EUIPO) tamamlanmadan tescil başvurusu veya
ticari yayılma yapılmamalı.

Nice sınıf adayları: 41 (müzik hizmetleri), 42 (teknik danışmanlık)  
Profesyonel tarama + vekil görüşü gerekiyor.

## Yapılacaklar

| # | İş | Durum |
|---|---|---|
| 1 | Renk paletini onayla ve kontrast ölçümlerini yap | Bekliyor |
| 2 | Tipografi seç ve lisans kaydet | Bekliyor |
| 3 | Logo tasarımını al ve `scripts/hxi-marka-uret.py`'e dönüştür | Bekliyor |
| 4 | Marka araştırması (Patentstyret + TMview) | Bekliyor |
| 5 | Tescil dosyalarını üret (`npm run hxi-tescil`) | Betik sonrası |
