# NAVIAR Care — Ziyaret güncelleme şablonu

Kaynak: Pilot Implementation Plan, Task 4 Step 3 (kademeli rıza modeli).
**Kural:** ödeyenin ilişkisi rıza doğurmaz — güncelleme yalnız hizmet
alanın onayladığı düzeyde ve kanalda gider.

## Onaylanabilir güncelleme düzeyleri (rıza kaydında seçilir)

| Düzey | İçerik | Ne ZAMAN kullanılır |
|---|---|---|
| Yok | Hiçbir güncelleme gönderilmez | Hizmet alan güncellemeyi tamamen reddettiğinde |
| "Ziyaret tamamlandı" | Yalnız tarih/saat, ziyaret gerçekleşti bilgisi | Asgari düzey, varsayılan olabilir |
| "Aktivite tamamlandı" | Ziyaret + genel aktivite türü (örn. "yürüyüşe çıkıldı") | Hizmet alan bunu onayladıysa |
| "Beni arayın" talebi | Yardımcı/koordinatör aileyi arasın işareti | Hizmet alan bir konu iletmek istediğinde |

## Şablon metni (örnek, "Aktivite tamamlandı" düzeyi)

> NAVIAR Care — [tarih], [hizmet türü] ziyareti tamamlandı.
> [Genel aktivite — örn. "Kısa bir yürüyüş yapıldı."]
> Bir sonraki ziyaret: [tarih].
> Sorularınız için: [koordinatör adı/iletişim].

**İçermeyecekleri:** sağlık durumu, ilaç, ruh hali yorumu, ev durumu
tasviri, tıbbi gözlem. Bunlar "olay raporu" kapsamına girer (bkz.
`incident-and-escalation-sop.md`), rutin güncellemeye değil.

## Kanal

Plan: "phone/SMS only for logistics, not sensitive details" + CRM üzerinden
kayıt. Güncelleme SMS/e-posta ile, hassas detay taşımayan kısa metin
olarak gider.

## Geri çekme mekanizması

Hizmet alan herhangi bir anda güncellemeyi durdurabilir. Geri çekme anından
itibaren **bir sonraki güncelleme derhal bastırılır** — bu, sistemin (MVP'de
insan koordinatörün) test edeceği bir kabul kriteridir (bkz.
`product/mvp-acceptance-tests.md`, Task 4 Step 4, madde 3).
