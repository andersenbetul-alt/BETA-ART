---
name: performance-review
description: Use when a manager is preparing, drafting, or scoring a performance review for someone on their team, gathering peer or self-assessment input, or deciding a rating. Trigger on "performance review", "degerlendirme", "review cycle", "rate my report", "calibration prep", or any request to draft review text.
---

# Performance Review

Yoneticinin isi: kanit toplamak ve karar vermek. Bu skill'in isi: kaniti
cerceveye baglamak ve metni taslaga dokmek. **Puani yonetici verir,
metni yonetici imzalar.**

## Once kapi

```bash
node .claude/skills/performance-review/check-framework.mjs
```

Cikis kodu 0 degilse **dur.** Eksik olan sey IK'den gelir. Yetkinlik veya
puan tanimi uydurulmaz — bu skill'in var olma sebebi budur.

## Akis

**1 — Kanit topla.** Her yetkinlik icin: kisinin oz degerlendirmesi, akran
girdileri, yoneticinin kendi notlari, ve **ise ait somut ciktilar** (sevk
edilen is, kapatilan kayit, yazilan belge). Kaynak ve tarih ile kaydet.

**2 — Kanit yeterli mi diye bak.** Bir yetkinlik icin tarihli ve somut en az
bir ornek yoksa, o yetkinlik **puanlanmaz**. "Yeterli kanit yok" yazilir.
Bosluk, dusuk puan degildir.

**3 — Puanla.** Her yetkinlik icin `ratings.md` icindeki tanimi **kelimesi
kelimesine** yaz, sonra hangi kanitin o tanimi karsiladigini goster. Kanit
tanima uymuyorsa, uydugu tanimi sec — tanimi kanida uyacak sekilde
esnetme.

**4 — Tarafliligi kontrol et.** Kanitlarin tarihlerine bak: cogunlugu son
alti haftadaysa bu yakinlik yanilgisidir, donemin tamamini tara. Tek bir
olay birden fazla yetkinligi boyamamali.

**5 — Taslaga dok.** `template.md` sekli. Baska baslik eklenmez.

**6 — Yonetici okur ve sahiplenir.** Taslak, yoneticinin yerine gecmez.

## Kurallar

- **`competencies.md` disinda hicbir sey puanlanmaz.** Iyi bir gozlem
  cerceveye girmiyorsa, degerlendirmeye degil, bir sonraki cerceve
  revizyonuna gider.
- **Puan tanimlari kelimesi kelimesine alintilanir.** Ozet, parafraz veya
  "yani sunu demek" aciklamasi yok.
- **Kanitsiz puan yok.** Izlenim, "genel his" ve akran yorumundan turetilmis
  cikarim kanit degildir.
- **Kisilik degil, is.** Cerceve davranis tarif ediyorsa davranis yazilir;
  kisinin ne oldugu degil ne yaptigi.
- **Bu belge birinin maasini ve isini etkiler.** Emin olmadigin yeri bos
  birak ve kalibrasyona goturt.

## Sik hatalar

| Hata | Ne yapmali |
|---|---|
| Cerceve elde yokken taslaga baslamak | Kapiyi calistir; eksikse IK'ye don |
| Tanimi hatirlayarak yazmak | `ratings.md`'den kopyala |
| Cerceve disinda "ekstra" bir guclu yon eklemek | Cikar; bir sonraki revizyona oner |
| Kanit yokken orta puan vermek | "Yeterli kanit yok" yaz |
| Son projeye gore puanlamak | Tarihleri say, donemin tamamina bak |
