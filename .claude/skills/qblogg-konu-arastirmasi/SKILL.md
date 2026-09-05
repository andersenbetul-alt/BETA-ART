---
name: qblogg-konu-arastirmasi
description: Bir veya birden fazla alan (ör. "Ekonomi & Finans", "Liderlik & HR", "Jeopolitik", "Teknoloji & Bilim") verildiğinde, o alanlarda dünyada gerçekten merak edilen/aranan konuları paralel araştırma agent'larıyla tarar, uydurma rakam/istatistik sızmasın diye her bulguyu kaynağıyla birlikte teslim eder, en tartışmalı/kaynağı zayıf bulguyu /deep-research'e havale eder ve QBLOGG'un blog kategorisi genişletme kararına hazır, kaynaklı bir aday listesi çıkarır. Kullanıcı "trend araştır", "en çok merak edilen konuları incele", "hangi konularda yazı yazalım", "kategori için konu bul/araştır", "şu alanda ne yazsak" dediğinde ya da yeni bir blog kategorisi/pillar açma kararı öncesinde MUTLAKA bu beceriyi kullan.
owner: QBLOGG
---

# QBLOGG konu araştırması

Yeni bir kategori ya da pillar açmadan önce hangi konunun gerçekten yazılmaya
değer olduğunu bulan araştırma hattı. Çıktısı bir yazı değil — `qblogg-blog-yazisi`
ya da `/deep-research`'e girecek, kaynağıyla doğrulanmış bir aday listesidir.

## Neden bu ayrı bir adım

QBLOGG'un görünürlük kuralı ("orig" + en az üç kaynak, `gorunurluk.mjs`) yazı
yazıldıktan SONRA devreye giriyor — ama en pahalı hata konuyu seçerken olur:
uydurma bir istatistiğe ("Google Trends'e göre X arandı" gibi) dayanarak bir
konu seçip sonra kaynağını bulamamak, yarım kalmış bir yazı ya da CLAUDE.md
madde 8'i çiğneyen bir iddia demek. Bu yüzden araştırma ile yazma ayrı
adımlardır: burada yalnız *hangi konunun gerçekten ilgi çektiğini ve neden*
doğrulanır, metin burada üretilmez.

## Akış

**1. Alanları netleştir.** Kullanıcı tek bir alan verdiyse doğrudan başla.
Birden fazla alan verdiyse (ör. "Ekonomi, Liderlik, Jeopolitik, Teknoloji")
her biri için ayrı bir araştırma agent'ı paralel çalıştır — aynı turda,
tek tek değil (bkz. Agent tool: "independent calls in the same block").

**2. Her alan için paralel bir genel-amaçlı agent'a şunu sor** (birebir
kopyalamayın, alana göre uyarlayın):
- WebSearch ile o alanda 2026'da gerçekten merak edilen/aranan konuları bul.
- Yalnızca **gerçek, kontrol edilebilir kaynak** kullan: Google Trends yıllık
  raporu, Pew Research, Gallup, McKinsey, sektör anketleri (SHRM, NFIB,
  YouGov, WEF, PwC vb.), haber sitelerinin kendi (ikincil değil, mümkünse
  birincil) verisi. Rakam/istatistik doğrulanamıyorsa **uydurma, "bulunamadı"
  de**.
- 3-5 somut yazı açısı öner; her biri: konu, neden şimdi (gerçek tetikleyici),
  kaynak(lar) (ad + URL + tarih), QBLOGG'un KOBİ/SaaS kitlesine neden uyduğu.
- Kaynağı ikincil/aktarım olan ya da kaynaklar arasında rakam çelişen
  bulguları **açıkça işaretlesin** ("ikincil kaynaktan aktarılıyor, birincil
  rapor teyit edilmeli" gibi) — bunlar silinmez, ama güven seviyesi düşük
  olarak taşınır.

**3. Sonuçları konsolide et.** Alan başına en güçlü 1-2 adayı öne çıkar.
Kaynağı tek, birincil ve net olanlar ("Gallup 2026 doğrudan") ile kaynağı
birden fazla ikincil siteden aktarılan ("3 farklı sektör raporu farklı rakam
veriyor") bulguları ayrı işaretle — ikincisi deep-research'e aday, birincisi
değil.

**4. En belirsiz/yüksek-değerli bulguyu `/deep-research`'e öner.** Otomatik
çalıştırma — kullanıcıya "bunu tam doğrulamaya göndereyim mi" diye sor,
çünkü deep-research pahalı bir işlemdir (5 arama açısı × 15 kaynak × çapraz
doğrulama) ve hangi konunun gerçekten bir yazıya dönüşeceğine kullanıcı karar
verir. "En belirsiz" ile "en değerli" (en güçlü B2B/QBLOGG uyumu) çakışmıyorsa
ikisini de adayla, kullanıcı seçsin.

**5. Teslim formatı** — her alan için bir tablo ya da liste:

```
| Alan | En güçlü aday | Kanıt gücü |
|---|---|---|
| <alan adı> | <tek cümlelik açı> | Sağlam / Orta / Belirsiz |
```

Tablonun altına, her adayın altında 2-4 satırlık gerekçe + kaynak listesi
(ad, URL, tarih) — kullanıcı tıklamadan kaynağı görebilsin.

## Bilinçli sınırlar

- Bu beceri **yazı yazmaz**. Bir konu seçildikten sonra `qblogg-blog-yazisi`
  becerisine geçin (tek konu, tek okur, kaynak zorunlu, gorunurluk denetimi).
- "En çok aranan" için Google Trends'in yıllık raporu yalnızca Aralık'ta
  yayınlanır — yıl içi bir araştırmada bu rapor yoksa **uydurmayın**, "bu yıl
  için henüz yayınlanmadı" deyip anket/sektör raporu gibi alternatif kaynaklara
  geçin (2026 örneğinde `technology/science` agent'ı tam bunu yaptı).
- QBLOGG'un kendi kategorileri (`assets/js/posts.js`'deki `category` alanları)
  ile bu beceride bulunan yeni alan adları aynı olmak zorunda değil — yeni bir
  kategori chip'i yalnızca o kategoride gerçek bir yazı varken görünür
  (`renderBlog()`, boş kategori = boş çip, istenmeyen boşluk). Yani araştırma
  bittiğinde önce yazı yazılır, kategori chip'i kendiliğinden ortaya çıkar.
