# Durum raporu nasıl yazılır

## Üç soru

Her rapor bunlara cevap verir:

1. **Ne oldu?** — geçti / düştü / hâlâ çalışıyor
2. **Kanıt ne?** — çıkış kodu, hata satırı, ölçülen değer
3. **Sırada ne var?** — düzeltme, bekleme, veya karar

## Kalıplar

**Geçti:**
> `./run-tests.sh` — çıkış kodu 0, yedi adımın yedisi de OK. Çalışma ağacı temiz.

**Düştü:**
> `veri bütünlüğü` adımı düştü: `rol receptionist: bilinmeyen is alani 'x'`.
> `data/workforce.json` içindeki rol, `modules` listesinde olmayan bir kimliğe
> referans veriyor. Düzeltip yeniden koşuyorum.

**Hâlâ çalışıyor:**
> Deploy 40 saniyedir `INITIALIZING`. Build asenkron; iki dakika sonra tekrar
> bakacağım.

**Kısmen ölçüldü — en sık atlanan durum:**
> Beş adım geçti, SQL adımları **atlandı** (PostgreSQL çalışmıyor). Kredi ve
> RLS mantığı bu koşumda doğrulanmadı.

## Kaçınılacaklar

- **"Muhtemelen bitti."** Ölç ya da beklediğini söyle.
- **"Testler geçiyor"** derken bir kısmı atlandıysa. Atlanan ayrıca söylenir.
- **Aynı durumu tekrar tekrar raporlamak.** Durum değişmediyse sus; yalnızca
  değişince veya kullanıcı sorunca konuş.
- **Hata çıktısını gizlemek.** Düşen adımın gerçek satırı gösterilir,
  özetlenmez.
- **Kendi testine güvenmek.** Bir test hiç düşemiyorsa değersizdir. Şüphe
  varsa kasten boz ve çöktüğünü gör — bu projede iki kez böyle doğrulandı
  (FIFO sıralaması bozulunca çıkış kodu 3, veriye kopuk referans eklenince 1).

## Ne zaman kullanıcıyı uyandırmalı

| Durum | Haber ver? |
| --- | --- |
| İş bitti, başarılı | Evet, kısa |
| İş düştü | Evet, hata satırıyla |
| Karar gerekiyor | Evet, seçenekleri netleştirerek |
| Hâlâ çalışıyor, durum değişmedi | Hayır — sessizce tekrar bak |
| Engel daha önce bildirildi, hâlâ duruyor | Hayır — tekrarlama |
