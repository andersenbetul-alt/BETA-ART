# NAVIAR Care — MVP veri haritası

Kaynak: Pilot Implementation Plan, Task 4 Step 2. **İlke: veri asgariye
indirilir** — toplanan her alan bir amaca bağlı olmalı.

## Talep formunda toplanan (yalnızca bunlar)

| Alan | Amaç |
|---|---|
| İletişim bilgisi | Koordinatör geri araması |
| Pilot bölge posta kodu | İç Oslo kapsam kontrolü (Grünerløkka/Sagene/St. Hanshaugen/Frogner) |
| İstenen hizmet kategorisi | Trygt besøk / Følge til aktivitet / Digital hverdagsstøtte |
| İstenen sıklık | Kapasite planlama |
| Genel müsaitlik | Eşleştirme |
| Tercih edilen dil | Yardımcı ataması |
| Hizmet alanla ilişki | Rıza sürecinin kim ile başlayacağını belirler |
| İletişim izni | GDPR/Datatilsynet uyumu |

**Serbest metin:** isteğe bağlı, açıkça sınırlı, uzun süreli saklamadan
önce koordinatör tarafından incelenir/gerekirse düzenlenir (redaksiyon).

## Formda ZORUNLU uyarı

> "Lütfen tıbbi, bankacılık veya kimlik bilgisi girmeyin."

Bu uyarı, form gönderim alanının **hemen üstünde**, göz ardı edilemeyecek
biçimde durur.

## Kesinlikle toplanmayan (MVP'de)

- Tıbbi teşhis, ilaç bilgisi, sağlık günlüğü
- Canlı konum
- BankID, ödeme kartı bilgisi
- Serbest metin "bakım notları"

## Veri akışı (özet)

```
Talep formu (asgari alan) → Koordinatör inceleme kuyruğu (insan)
   → Kapsam/rıza değerlendirmesi → Onaylandıysa: rıza kaydı oluşturulur
   → Eşleştirme (insan) → Ziyaret planı → Onaylı güncelleme (rıza düzeyine göre)
```

Otomatik eşleştirme, canlı takip, sağlık kaydı veya aile gözetim paneli
**MVP'de yok** — plan bunu açıkça yasaklıyor (Architecture bölümü).

## DPIA sorusu

Datatilsynet, yüksek riskli işlemeden önce DPIA'yı zorunlu kılabiliyor.
Bu veri haritası (hassas grup + rıza katmanları) bu eşiği geçiyor mu
sorusu `legal/launch-review-brief.md` madde 6'da gizlilik danışmanına
yöneltildi — cevap `decisions/decision-log.md`'ye işlenecek.
