# NAVIAR Care — MVP kabul testleri

Kaynak: Pilot Implementation Plan, Task 4 Step 4. Bu beş test, `site/index.html`
ve etraflarındaki insan sürecinin (koordinatör kuyruğu) canlıya alınmadan
önce geçmesi gereken asgari koşuldur.

| # | Test | Geçme koşulu | Durum |
|---|---|---|---|
| 1 | Aile hassas veri girmeden talep gönderebilir | Form, tıbbi/bankacılık/kimlik alanı içermiyor; uyarı görünür | [ ] |
| 2 | Koordinatör kapsam-dışı talebi reddedip uygun yönlendirme gönderebilir | Red + yönlendirme akışı çalışıyor (`sales/pilot-offer-and-eligibility-script.md`) | [ ] |
| 3 | Hizmet alan aile güncellemesini geri çekebilir, sonraki güncelleme bastırılır | Geri çekme anından itibaren bir sonraki güncelleme gönderilmiyor | [ ] |
| 4 | Yardımcı yalnız kendi müşterilerini görebiliyor | Yardımcı arayüzünde ilgisiz müşteri verisi yok | [ ] |
| 5 | Acil endişe tarif edildiğinde 113 uyarısı görünür | Form/koordinatör arayüzünde tetikleyici kelimelerde 113 bildirimi çıkıyor | [ ] |

**Not:** MVP'de bu "arayüzler" büyük ölçüde insan sürecidir (koordinatör +
basit form), otomatik bir platform değil — plan Architecture bölümünün
gereği. Test 4, bu pilotta "yardımcı arayüzü" yoksa, "yardımcı yalnız
kendine atanan müşteri bilgisini alıyor" (telefon/SMS ile) şeklinde
uygulanır.

## Site kabul kriterleri (Task 4 Step 1)

- [ ] Tek cümlelik konumlandırma görünür
- [ ] "Kimin için" net
- [ ] Üç hizmet + açık hariç tutmalar CTA'nın yanında
- [ ] İç Oslo kapsamı belirtilmiş
- [ ] CTA "koordinatör geri araması" vaat ediyor — anlık eşleştirme veya
      7/24 vaadi YOK
- [ ] Erişilebilirlik beyanı var
- [ ] Gizlilik bildirimi var
- [ ] Acil durum/belediye yönlendirme bilgisi var
- [ ] Fiyat başlangıç noktası yalnız finans onayından SONRA yayınlanır
      (bkz. `decisions/decision-log.md` madde 3 — MVA netleşmeden fiyat
      taahhüt edilmez)
