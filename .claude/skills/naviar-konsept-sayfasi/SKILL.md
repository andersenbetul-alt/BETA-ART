---
name: naviar-konsept-sayfasi
description: NAVIAR alt markaları (CARE, TURIST, CONSULT, veya henüz adı olmayan yeni bir konsept) için tek sayfalık konsept/test landing page üretir — marka yönetişimini (docs/naviar/NAVIAR-LOGO-KARAR.md) kontrol edip, uydurma istatistik/yorum koymadan, artifact-design disiplinine uygun bir Artifact yayınlar. Kullanıcı "NAVIAR CARE/TURIST/CONSULT için sayfa yap", "konsept sayfası", "test sayfası", "landing page" dediğinde, ya da yeni bir NAVIAR alt marka fikrini görselleştirmek istediğinde MUTLAKA bu beceriyi kullan.
owner: NAVIAR
---

# NAVIAR konsept/test sayfası

NAVIAR CARE (`docs/naviar/`) ve Istanbul-planen (NAVIAR TURIST TEST 01)
sayfalarında izlenen süreç. Bu ikisi gerçek, çalışan örnekler — burada
anlatılan her adım onlarda gerçekten uygulandı.

## Neden bu skill var

NAVIAR'ın gerçek marka mimarisi ve hukuki sınırları var
(`docs/naviar/NAVIAR-LOGO-KARAR.md`, `docs/naviar/*AUTOPROMPT*`). Bunları
her seferinde yeniden keşfetmek yerine, bu skill onları zorunlu bir
kontrol listesine dönüştürür — bir konsept sayfası hazırlarken atlanması
en kolay, ama atlandığında en pahalıya patlayan adım budur (onaysız bir
descriptor'ı canlıymış gibi göstermek).

## 1. Marka yönetişimini kontrol et — HER ZAMAN ilk adım

`docs/naviar/NAVIAR-LOGO-KARAR.md`'yi oku. Onaylı alt marka mimarisi:
**CONSULTING, AI, PLATFORM, RESEARCH INSTITUTE, ACADEMY, LABS.**

- Sayfa bu listedeki bir isim için mi? → descriptor lockup'ı kullanılabilir.
- Sayfa listede olmayan bir isim için mi (CARE, TURIST, ya da tamamen yeni
  bir fikir)? → **master NAVIAR wordmark'ı kullan** (`brand/naviar/master/`),
  descriptor'u ayrı bir etiket olarak yaz (logo lockup'ı değil), ve footer'da
  açıkça "bu konsept onaylı marka mimarisinde değil" notu düş, KARAR.md'ye
  referans ver. Bu, CARE ve TURIST sayfalarında birebir uygulandı — atlama.

`brand/naviar/descriptors/` altında `-PENDING-APPROVAL` etiketli bir dosya
varsa, o isim için tasarım zaten var demektir ama onay bekliyor — aynı
kurala tabi.

## 2. İçerik: gerçek kaynağa dayan, uydurma istatistik/yorum yok

- Sayfanın metni `docs/naviar/*.md` içindeki gerçek analiz/plan
  belgelerinden gelir — yoksa önce o belge yazılır (bu depoda zaten
  `NAVIAR-TURIST-IS-MODELI.md`, `NAVIAR-TURIST-AUTOPROMPT-ANALIZI.md` var).
- **Müşteri sayısı, memnuniyet oranı, "500 kullanıcı" gibi hiçbir rakam
  uydurulmaz.** Veri yoksa ya boş bırakılır (`—`, "fastsettes"), ya da
  "bu ilk testimiz" gibi dürüst bir çerçeveye çevrilir — Istanbul-planen'in
  final CTA'sındaki "kunde nummer én, ikke nummer tusen" cümlesi buna
  örnek.
- Sahte müşteri yorumu eklenecekse **açıkça "illüstratif, gerçek kullanıcı
  değil"** diye etiketlenir (NAVIAR CARE'deki `<cite>` örneği) — ya da hiç
  eklenmez (Istanbul-planen'in tercihi, daha temiz).
- Coğrafi/sektörel detaylar gerçek olmalı (Istanbul-planen'deki Sultanahmet,
  Kadıköy, Beyoğlu gibi) — jenerik "amazing destination" dili değil.

## 3. Tasarım — artifact-design'ı yükle, NAVIAR tonlarını miras al ama tekrar etme

Yazmadan önce `artifact-design` skill'ini çağır (tasarım kalibrasyonu için
zorunlu). Sonra:

- **Renk:** Navy `#0A1628` + altın `#D4AF37` (açık zeminde metin için
  koyulaştırılmış `#B98F1F` — altın açık zeminde asla metin/ana grafik
  olarak kullanılmaz, bu KARAR.md'nin kontrast bulgusu). Her sayfa için
  yeni bir "marka rengi" icat etme — bu, KARAR.md'nin "6 alt markanın 6
  ayrı rengi mimariyi aşıyor" bulgusunu tekrar eder. Sayfaya özgü tek bir
  ek ton istersen (Istanbul-planen'deki toprak tonu gibi), footer'da bunun
  resmi marka rengi değil, sayfa-düzeyi bir illüstrasyon kararı olduğunu
  belirt.
- **Tipografi:** CARE ve TURIST'te iki farklı ama aynı ailede eşleştirme
  kullanıldı (Fraunces+Public Sans+Poppins / Instrument Serif+Public
  Sans+Poppins) — Public Sans (gövde) ve Poppins (logo etiketi, marka
  tutarlılığı için) sabit kalsın, başlık yazı tipini konuya göre seç ama
  Inter kullanma.
- **Nötr zemin:** `#F0F2F6` ailesini (soğuk, hafif lacivert tonlu) NAVIAR
  sayfaları arasında ortak tut — "aynı ev, farklı oda" ilkesi.
- Her iki tema (açık/koyu) tanımlanır — `artifact-design`'daki token
  yapısına uy.

## 4. Yayınlama akışı

1. HTML'i `<scratchpad>/` içinde yaz (bkz. Environment'taki scratchpad yolu).
2. **Bir kez** Playwright ile ekran görüntüsü al, kontrol et (bkz.
   `run-qblogg` becerisindeki `createRequire('/opt/node22/lib/node_modules/')`
   deseni — Playwright depo kökünden import edilemiyor).
3. Gördüğün somut sorunları düzelt (Istanbul-planen'de 5. gün etiketinin
   ters sıralanması böyle yakalandı) — ikinci bir ekran görüntüsü döngüsü
   kurma, tek geçiş yeterli.
4. `Artifact` aracıyla yayınla; `title` ürün adı gibi olsun (örn.
   "Istanbul-planen", "NAVIAR CARE" — açıklayıcı ek yok), `description`
   bir cümle, uygun bir favicon emoji seç.
5. Kullanıcıya yanıtta: hangi marka yönetişimi kararını verdiğini (master
   mi descriptor mı), hangi kaynak belgeye dayandığını, hangi uydurma
   riskini nasıl önlediğini kısaca özetle — bu, tasarım kararlarının
   gerekçesini görünür kılar.

## Sınırlar

Bu skill yalnız **konsept/test** sayfaları için — gerçek, canlıya çıkacak
bir ürün sayfası (örn. `naviar-care-1` Vercel projesinin gerçek kodu) için
değil; o ayrı bir repo ve bu oturumun kapsamı dışında. Karıştırma.
