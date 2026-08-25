# Teklif Alanları — İnceleme İçin

**Durum: TASLAK.** ⟨…⟩ içindeki her alan senden gelecek. Hiçbirine tahmini
değer yazmadım — teklif rakamı uydurulacak bir şey değil.

## Aday ve rol

| Alan | Değer |
|---|---|
| Aday adı | ⟨AD_SOYAD⟩ |
| Rol başlığı | ⟨ROL⟩ |
| Rapor verdiği kişi | ⟨YÖNETİCİ⟩ |
| Başlangıç tarihi | ⟨BAŞLANGIÇ⟩ |
| Çalışma biçimi | ⟨ofis / hibrit / uzaktan⟩ |
| İstihdam tipi | ⟨tam zamanlı / sözleşmeli / danışman⟩ |

`data/team.json` içindeki rollerden biriyse sorumluluk metni hazır:

| # | Rol | Sorumluluk | Mod |
|---|---|---|---|
| 3 | Service Designer | Müşterinin hizmeti baştan sona nasıl deneyimleyeceğini tasarlar | core |
| 5 | UX Designer | Kullanıcı yolculuğu, site mimarisi, wireframe ve akışlar | core |
| 6 | UI Designer | Renk, tipografi, buton, kart ve ekranların görsel tasarımı | core |
| 7 | Brand Designer | Logo, marka kimliği, görsel dil ve tasarım sistemi | contract |
| 8 | Copywriter / UX Writer | Metinleri sade, güvenilir ve ikna edici şekilde yazar | core |
| 11 | Full-Stack / Technical Lead | Teknik mimariyi ve frontend-backend bütünlüğünü yönetir | core |
| 17 | Accessibility Specialist | Erişilebilirlik — yaşlılar ve engelli kullanıcılar dahil | advisor |
| 19 | GDPR / Privacy Specialist | Avrupa veri koruma gereklilikleri | advisor |

## Rakamlar

| Alan | Değer | Not |
|---|---|---|
| Brüt yıllık ücret | ⟨BRÜT_YILLIK⟩ NOK | |
| Ödeme sıklığı | ⟨aylık / 12 taksit⟩ | |
| Tatil parası (feriepenger) | ⟨ORAN⟩ % | Ücrete dahil mi, üstüne mi — netleştir |
| Pensiyon (OTP) | ⟨ORAN⟩ % | |
| Bonus / prim | ⟨VAR_MI⟩ | Varsa: ölçütü ve ödeme zamanı |
| Hisse / opsiyon | ⟨VAR_MI⟩ | Varsa ayrı bir belge gerekir |
| Ekipman bütçesi | ⟨TUTAR⟩ NOK | |
| Kurs / konferans bütçesi | ⟨TUTAR⟩ NOK | |

## Sözleşme koşulları

| Alan | Değer |
|---|---|
| Deneme süresi (prøvetid) | ⟨SÜRE⟩ |
| İhbar süresi (oppsigelsestid) | ⟨SÜRE⟩ |
| Haftalık çalışma saati | ⟨SAAT⟩ |
| Tatil günü | ⟨GÜN⟩ |
| Teklifin geçerlilik süresi | ⟨TARİH⟩ |

## Süreç

| Alan | Değer |
|---|---|
| Teklif görüşmesi tarihi/saati | ⟨TARİH_SAAT⟩ |
| Görüşme bağlantısı | ⟨LİNK⟩ |
| Referans kontrolü yapıldı mı | ⟨EVET/HAYIR⟩ |
| Yazılı sözleşmeyi kim gönderecek | ⟨KİM⟩ |

---

## ⚠ Hukuki kontrol — bu paket gönderilmeden önce

Yukarıdaki alanların bir kısmı Norveç iş hukukuna tabi (deneme süresi, ihbar
süresi, tatil parası, OTP). **Bu alanların doğru değerlerini ben belirleyemem**
— bu oturumda `lovdata.no` ve `arbeidstilsynet` erişilemez durumda ve
doğrulayamadığım bir yasal eşiği yazmam.

Bu, "her zaman yasaları kontrol edeceğiz" politikasının ilk uygulaması:
alanlar burada, değerleri hukuk danışmanı veya muhasebeci doldurur.
