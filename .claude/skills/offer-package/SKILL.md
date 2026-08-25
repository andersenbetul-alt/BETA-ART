---
name: offer-package
description: Use when preparing to extend a job offer — filling offer fields for review, writing the email that sets up the offer call, or building a deck to screenshare on that call. Trigger on "offer package", "teklif", "extend an offer", "offer call", "finalist", or any request to draft offer terms or an offer letter.
---

# Teklif paketi

Uc parca: doldurulacak alanlar, cagriyi kuran e-posta, cagrida paylasilan sunum.
Sirasi onemli — **cagri once, yazili teklif sonra.**

## Once: isveren var mi?

Teklif bir tuzel kisiyi isimlendirir. Sirket tipi (or. ENK/AS) ve sicil numarasi
yoksa teklif yazilamaz — sirket tipi yukumlulukleri degistirdigi icin teklifin
basligini degil **icerigini** etkiler. Bu adim atlanirsa geri kalan her sey
yeniden yazilir.

## Sonra: paketi kur

```bash
cp -r .claude/skills/offer-package/template teklif/
```

`offer-fields.md` · `call-email.md` · `offer-deck.html` — hepsinde `[koseli]`
jetonlari var. Doldur.

## Sunmadan once: kapi

```bash
node .claude/skills/offer-package/check-ready.mjs teklif/*
```

Cikis kodu 0 degilse **ekrani paylasma.** Sunum kendi hazirligini de bildirir:
ustundeki serit kalan alan sayisini gosterir, sifirlaninca kaybolur.

## Kurallar

- **Rakam yerine "yok" yaz.** Bos prim hucresi adayda soru isareti birakir;
  "yok" birakmaz. Kapi da bos hucreyi eksik sayar, "yok"u saymaz.
- **Rakami e-postaya koyma.** Once cagrida anlat, yazili teklif hemen ardindan.
  Daha sicak, ve yanlis anlasilmayi azaltir.
- **"Neden sen" slaydi jenerik olamaz.** Surecte yaptigi somut bir sey, ekibin
  eksik olan bir tarafi, aklinda kalan bir cumlesi. Doldurulamiyorsa teklif
  erken demektir.
- **Sozlesme baglayicidir, sunum degil.** Rakamlar slaydinda bunu soyle; adayin
  farki simdi yakalamasi, imzadan sonra yakalamasindan iyidir.
- **Karar tarihini esnek tut.** Tarih, adayin kararindan daha kolay tasinir.

## Sik hatalar

| Hata | Ne yapmali |
|---|---|
| Tuzel kisi belli degilken teklif yazmak | Once sirket kararini bitir |
| Yarim sunumla cagriya girmek | Kapiyi calistir, serit kaybolsun |
| Prim/hisse hucresini bos birakmak | "yok" yaz |
| Rakami e-postada gondermek | Cagriya birak |
| "Neden sen"i sablondan doldurmak | Somut olmayan cumleyi sil, slayti kisalt |
