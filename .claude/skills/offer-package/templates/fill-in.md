# Doldur ve geri yapıştır

Bunu kopyala, sağ tarafı doldur, bana geri gönder. Üç dosyayı da doldurup
kırmızı TASLAK bandı kalkmış hâlde geri veririm.

```
AD              =
ROL             =
YÖNETİCİ        =
BAŞLANGIÇ       =
BİÇİM           =            # ofis / hibrit / uzaktan
BRÜT            =            # yıllık, NOK
ORAN_TATİL      =            # feriepenger %
ORAN_PENSİYON   =            # OTP %
TUTAR_EKİPMAN   =            # NOK
SÜRE_DENEME     =            # prøvetid
TARİH_SÖZLEŞME  =            # yazılı sözleşme ne zaman gidiyor
TARİH_GEÇERLİLİK=            # teklif ne zaman doluyor
KİM             =            # sözleşmeyi kim gönderiyor
TARİH_SAAT      =            # görüşme
LİNK            =            # görüşme bağlantısı
SENİN_ADIN      =
İLK_AY          =            # 0-30 günde ne sahiplenecek
İLK_ÇEYREK      =            # 30-90 gün
SOMUT_AN_1      =            # görüşmeden hatırladığın bir an
SOMUT_AN_2      =
SOMUT_AN_3      =
DİL             =            # tr / no  — Norveççeyse baştan Norveçce yazarım
```

## Doldurmadan bırakmanı önerdiğim üç alan

`ORAN_TATİL`, `ORAN_PENSİYON`, `SÜRE_DENEME` — bunlar Norveç iş hukukuna
tabi. Değerlerini ben yazmam: `lovdata.no` bu ortamda erişilemiyor ve
doğrulayamadığım bir yasal eşiği teklif belgesine koymam. Muhasebeci veya
hukuk danışmanı versin.

## Rol seçimi kısayolu

`ROL` alanına şunlardan birini yazarsan sorumluluk metnini `data/team.json`'dan
otomatik alırım — yeniden yazmana gerek yok:

Service Designer · UX Designer · UI Designer · Brand Designer ·
Copywriter/UX Writer · Full-Stack/Technical Lead · Accessibility Specialist ·
GDPR/Privacy Specialist
