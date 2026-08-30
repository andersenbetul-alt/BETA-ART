# NAVIAR Care — Pilot sonrası ürün gereksinimleri

Kaynak: Pilot Implementation Plan, Task 6 Step 1. **Yalnız ölçekleme kapısı
geçildiyse geçerlidir** (bkz. `decisions/scale-gate-review.md`).

## İlke: otomasyon, kanıtlanmış insan kararının ARKASINDA kalır

| Otomatikleştirilebilir (ilk sırada) | Otomatikleştirilmez (hesap verebilir insan kararı kalır) |
|---|---|
| Zamanlama hatırlatmaları | Uygunluk/risk puanlaması |
| Müsaitlik toplama | Müşteri-yardımcı eşleştirme |
| Onaylı ziyaret güncellemesi teslimi | Olay triyajı |
| Dahili vaka kontrol listeleri | Ailenin notlara erişimi |

Bu sıralama, tjenestevurdering'in 6. maddesiyle ("Tidlig programvare kan bli
feil investering") ve plan'ın Architecture bölümüyle birebir uyumlu.

## Geriye kalan ürün yedeği (backlog) — öncelik sırasıyla

1. Zamanlama hatırlatma otomasyonu (SMS/e-posta)
2. Yardımcı müsaitlik toplama formu (kendi kendine güncelleme)
3. Onaylı güncelleme şablonunun yarı otomatik gönderimi (insan onayı hâlâ
   şart)
4. Dahili koordinatör kontrol listesi dijitalleştirme
5. **Ertelenmiş, henüz backlog'da değil:** otomatik eşleştirme, canlı
   takip, aile paneli — bunlar plan'ın kalıcı yasağı kapsamında, "pilot
   sonrası" bile otomatik olarak sıraya girmez, ayrı bir karar gerektirir.

## Kabul testi

Bu belge yalnız Task 5'in 90 günlük scorecard'ı ve `decisions/scale-gate-
review.md`'nin "Genişlet" kararıyla birlikte kullanılabilir — tek başına
bir yeşil ışık değildir.
