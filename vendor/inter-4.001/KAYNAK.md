# Inter 4.001 — resmi dağıtım (depoda saklanıyor, sitede kullanılmıyor)

Bu klasör, Inter yazı tipinin **resmi dağıtımının tamamıdır**. Kullanıcı
tarafından sağlandı, 22.08.2026'da depoya kondu.

## Neden burada

İki iş için:

1. **Hak paketi (kural 7-b).** Marka tescili başvurusuna eşlik edecek yapım
   kaydında, wordmark'ın hangi yazı tipinden çıktığı kanıtlanabilir olmalı.
   Elimizde yalnızca alt küme (`assets/fonts/inter-latin.woff2`) vardı; artık
   kaynağın kendisi de var.
2. **Soy zinciri doğrulaması.** `InterVariable.ttf` ile depo alt kümesi
   `wght=700`'de harf harf karşılaştırıldı; `Q B L O G` ana hatları birebir
   aynı çıktı. Ölçüler `assets/fonts/KAYNAK.md`'de.

## Site bu dosyaları kullanmıyor

Site yalnızca `assets/fonts/` altındaki dört alt kümeyi yükler
(latin, latin-ext, cyrillic, cyrillic-ext — toplam ~178 KB). Bu klasör 60 MB'dır
ve **yayına çıkmaz**. Alt küme stratejisi bilinçlidir: ziyaretçi yalnızca kendi
dilinin gerektirdiği baytı indirir.

Bu klasördeki dosyaları siteye taşımayın. Taşınırsa ilk sayfa yükü
onlarca kat artar ve çok dilli geri düşüş (fallback) zinciri bozulur.

## Künye — dosyaların kendi `name` tablosundan okundu

| Alan | Değer |
|---|---|
| Sürüm | `Version 4.001;git-9221beed3` |
| Telif | `Copyright 2016 The Inter Project Authors` |
| Lisans (font kaydına göre) | `http://scripts.sil.org/OFL` |
| Lisans metni | `LICENSE.txt` (OFL-1.1) |

148 font dosyasının **tamamı** aynı sürüm, telif ve lisans satırını taşıyor;
tek bir sapma yok. `Inter.ttc` 36 yüz içeriyor.

Depodaki alt küme farklı bir yapıdan geliyor: `git-66647c0bb`. İkisi de
`Version 4.001`. Ana hatlar aynı olduğu için bu fark wordmark'ı etkilemiyor.

`LICENSE.txt`, `assets/fonts/OFL.txt` ile bayt bayt aynıdır.

## Düzen — `help.txt`'nin anlattığı resmi düzen

```
Inter.ttc               36 yüzlük tam aile (TrueType hinting'li)
InterVariable.ttf       Değişken aile — hinting yok
InterVariableItalic.ttf
LICENSE.txt             SIL Open Font License 1.1
help.txt                Dağıtımın kendi kurulum/kullanım metni
web/                    39 dosya — inter.css + 36 statik woff2 + 2 değişken woff2
extras/otf/             36 dosya — CFF biçiminde statik
extras/ttf/             36 dosya — TrueType hinting'li statik (36/36 doğrulandı)
extras/woff-hinted/     36 dosya — hinting'li web fontları
```

`web/` ile `extras/woff-hinted/` aynı adları taşır ama farklı dosyalardır:
hinting'li olanlarda dört tablo fazladır (`cvt `, `fpgm`, `gasp`, `prep`).
Ayrım tahmin edilmedi, tablo tablo ölçüldü.

## Bütünlük

`OZETLER.sha256` 152 dosyanın SHA-256 özetini taşır. Doğrulamak için:

```bash
cd vendor/inter-4.001 && sha256sum -c OZETLER.sha256
```

Beklenen çıktı: 152 satır `OK`. Yükleme sırasında 8 yinelenen dosya geldi
(aynı ad, aynı içerik); bunlar bir kez saklandı, ad çakışması olmadı.

## Lisans durumu

OFL madde 2, yeniden dağıtılan yazı tipiyle telif bildiriminin ve lisans
metninin birlikte taşınmasını şart koşar — `LICENSE.txt` bu klasörde. Madde 3
(Reserved Font Name) bizi ilgilendirmiyor: dosyalar değiştirilmedi, Inter adı
kendi ürünümüz için kullanılmıyor.
