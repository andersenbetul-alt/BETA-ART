---
name: qblogg-sosyal
description: >
  QBLOGG veya Beta Art için sosyal medya içeriği üret — Instagram, LinkedIn,
  Twitter/X, Pinterest, YouTube shorts metni, story ve biyografi. "Sosyal medya",
  "Instagram yazısı", "LinkedIn postu", "tweet", "story", "kanal geliştir",
  "sosyal içerik", "platform içeriği" gibi ifadelerde bu skill'i kullan.
---

# QBLOGG / Beta Art Sosyal Medya İçerik Skill'i

Her platform için ayrı ses tonu ve format. İçerik her zaman bir **araştırma veya
yazıdan** türetilir — havadan üretilmez. Kaynak: mevcut `QB_POSTS` içeriği,
müşteri brief'i veya araştırma verisi.

## Platform profilleri

### LinkedIn (B2B öncelik)
- **Hedef:** KOBİ yöneticileri, SaaS pazarlama liderleri
- **Ton:** Düşünce liderliği, veri destekli, saygın
- **Format:** 3 bölüm — kanca (1–2 cümle), gövde (3–5 paragraf), CTA
- **Uzunluk:** 800–1.200 karakter
- **Hashtag:** 3–5, sonda, alakalı
- **Görsel:** Infografik veya veri tablosu önerilir

```
[Güçlü kanca — acı noktası veya şaşırtıcı veri]

[Bağlam — neden önemli]

[Çözüm veya içgörü — 2–3 madde]

[CTA — ne yapmaları gerekiyor]

#ContentMarketing #B2BMarketing #SEO
```

### Instagram
- **Hedef:** İçerik meraklıları, küçük işletme sahipleri
- **Ton:** İlham verici, görsel odaklı, erişilebilir
- **Format:** Kısa metin + 5–10 hashtag
- **Uzunluk:** 150–300 karakter (ilk 2 satır kanca olmalı)
- **Story:** 3–5 slayt — soru / bilgi / cevap / CTA yapısı

### Twitter / X
- **Hedef:** Teknik kitle, pazarlamacılar
- **Ton:** Keskin, direkt, fikir paylaşımı
- **Format:** Tek tweet (280 karakter) veya thread (3–7 tweet)
- **Thread yapısı:** 1. Kanca | 2–5. İçgörüler | Son: CTA + bağlantı

### YouTube Shorts / Reels metin
- **Format:** Senaryo, 45–60 saniye
- **Yapı:** Problem (0–5s) → Çözüm (5–40s) → CTA (40–60s)
- **qblogg-turev** skill'i bu formatı da üretir — büyük araştırmalardan türetmek için oraya bak

### Pinterest
- **Hedef:** Görsel arayanlar, içerik üreticileri
- **Format:** Başlık (max 100 karakter) + açıklama (500 karakter)
- **Anahtar kelime:** SEO odaklı, kullanıcının arayacağı terimler

## Ses tonu rehberi

### QBLOGG ses tonu
Uzman ama erişilebilir. Veriye dayalı ama jargonsuz. İddia değil, kanıt.
"Biz en iyiyiz" değil, "bu rakamları biz de şaşırdık".

### Beta Art ses tonu  
Sade, güvenilir, kanıta dayalı. "Gerçek insanlar. Gerçek yerler. Gerçek anlar."
— abartı yok, sahne yok, filtre yok. Fotoğrafçılık tartışmasında C2PA/kimlik
doğrulama mesajını öne çıkar.

## İçerik üretme adımları

1. **Kaynak belirle** — hangi blog yazısı, araştırma veya brief?
2. **Platform seç** — her platform ayrı üretim gerektirir
3. **Anahtar içgörüyü çıkar** — en şaşırtıcı veya en değerli tek nokta
4. **Format uygula** — yukarıdaki şablondan ilgili olanı seç
5. **Ses tonunu kontrol et** — QBLOGG mu Beta Art mı?
6. **CTA ekle** — her içeriğin bir sonraki adımı olmalı

## Kanal hesap yapısı (config.js'den)

Hesap linkleri ve biyografi metinleri `assets/js/config.js` içindeki
`social` nesnesinde saklanır. Platform eklerken oraya da yaz.

## qblogg-turev ile bağlantı

Bir araştırmadan 7 çıktı türetmek istiyorsan → `qblogg-turev` skill'ini kullan.
Bu skill tek başına bir post veya story üretmek içindir.
