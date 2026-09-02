# Beta Art — Sosyal Medya Kanalları

## Kanal stratejisi

Beta Art premium, arşiv estetiğinde bir marka. Sosyal medya varlığı bu estetiği
taşımalı: müze kataloğu dili, fotoğraf öncelikli görsel, sessiz otorite.
Kalabalık değil, seçici. Miktar değil, ağırlık.

---

## Kanallar

### 1. Instagram — birincil kanal

**Hesap adı hedefi:** `@betaart.co` veya `@beta.art`  
**Link in bio:** `beta-art.com`  
**Profil resmi:** `brand/ba-profil.svg` (PNG'ye aktar, 400×400)

**İçerik sütunları:**

| Sütun | İçerik | Oran |
|---|---|---|
| Arşiv fotoğrafı | Seri çalışmaları (Work, Craft, Land and Light, The Table, Rooms, The Unseen, Weather) | %50 |
| Doğrulama & süreç | Evidence zinciri, accession numaraları, "nasıl doğrulanır" | %20 |
| Haklar & provenance | Eğitici, otorite kurucu | %15 |
| İnsan / yapımcı | Fotoğrafçı sesi, kamera arkası (saydamlık gerekir — icad yasak) | %15 |

**Gönderi sıklığı:** 3–4 post/hafta, 5–7 Story/hafta  
**Şablonlar:** `brand/ba-instagram-post-acik.svg`, `brand/ba-instagram-post-koyu.svg`  
**Story şablonu:** `brand/ba-instagram-story-sablon.svg`

**Caption kuralları:**
- İlk satır: dizi adı ve accession numarası — `Work · BA·2026·001`
- İkinci paragraf: bağlam, yer, tarih (varsa)
- Son satır: hashtag bloku (ayrı yorum olarak da gönderilebilir)
- Doğrulanmış içerik için: `#betaartverified`
- Genel: `#betaart #archivephotography #humanmade #provenance`
- **Asla:** içerik sayısı, müşteri sayısı, başarı yüzdesi — doğrulanmamış hiçbir rakam

**Aksanlar:**
- Her gönderinin sol üst köşesi accession numarası
- Sağ üst köşe seri adı
- Archival seal kırmızısı `#8B1A1A` — marka imzası, dekoratif sticker değil

---

### 2. LinkedIn — B2B kanalı

**Şirket sayfası:** Beta Art  
**Tagline:** Real-world visual records with context, provenance and retrievability.  
**Kapak:** `brand/ba-linkedin-kapak.svg` (PNG'ye aktar, 1584×396)  
**Profil:** `brand/ba-profil.svg`

**İçerik sütunları:**

| Sütun | İçerik | Oran |
|---|---|---|
| İş kullanım senaryosu | İnşaat proje arşivi, tamamlanmış proje kurtarma | %40 |
| Methodology | Doğrulama zinciri, metadata, retrieval ilkesi | %30 |
| Sektörel perspektif | Provenance, haklar ve AI konularında düşünce liderliği | %20 |
| Şeffaflık | Privacy, DPA, saklama politikası, pilot kapsam | %10 |

**Gönderi sıklığı:** 2–3 yazı/hafta  
**Dil:** EN öncelikli (Norveç pazarı için NO eklenir aşama 2'de)

**Yazı kuralları:**
- Kısa header: bir soru veya bulgu
- 3–5 madde veya kısa paragraf
- CTA: `Vurder ett avsluttet prosjekt` veya `Book 20 minutter`
- Hiçbir zaman sahte müşteri logosu, referans sayısı veya garanti

---

### 3. Pinterest — arşiv keşif kanalı

**Hesap adı:** `beta-art-co`  
**Bağlantı:** `beta-art.com`

**Board yapısı** (seri adlarıyla birebir hizalı):

| Board | Açıklama |
|---|---|
| Work | Çalışma ve zanaat belgeleri |
| Craft | El sanatı ve yapım süreci |
| Land and Light | Coğrafya, ışık ve mevsim |
| The Table | Yemek, sofra, gündelik obje |
| Rooms | İç mekân, mekânsal kayıt |
| The Unseen | Az görülen, gözden kaçan |
| Weather | Atmosfer, hava, geçicilik |
| Verification | Doğrulama metodolojisi, evidence örnekleri |

**Pin boyutu:** 1000×1500 px (2:3 dikey)  
**Sıklık:** Board başına haftada 2–3 pin  
**Açıklama:** Accession numarası + seri adı + kısa bağlam

---

## Görsel kurallar (tüm kanallar)

1. **Fotoğraf önce gelir.** Grafik hiçbir zaman fotoğrafın önüne geçmez.
2. **Accession dili.** Accession numarası ve seri adı her gönderide bulunur.
3. **Doğrulanmamış içerik yayınlanmaz.** Doğrulama yapılmadan "doğrulanmış" etiketi kullanılmaz.
4. **Renk paleti sabit:** Paper `#FBFAF7`, Ink `#0F0F0F`, Archival red `#8B1A1A`, Muted `#85817A`.
5. **Yazı tipi sabit:** Fraunces (başlık), JetBrains Mono (accession/teknik metin).
6. **Boyut ve oranlar:** Kare (1:1) Instagram post, 4:5 dikey Instagram, 9:16 Story, 4:1 LinkedIn kapak.
7. **Emoji kullanılmaz.** Noktalama ve accession numarası yeterlidir.
8. **Filtre ve efekt yok.** Üretilmiş, yapay veya manipüle görsel paylaşılmaz — aksi hâlde açıkça belirtilir.

---

## Marka varlık dosyaları

```
beta-art/social/brand/
├── ba-profil.svg                  Profil resmi — açık zemin (400×400)
├── ba-profil-siyah.svg            Profil resmi — koyu zemin (400×400)
├── ba-instagram-post-acik.svg     Post şablonu — açık (1080×1080)
├── ba-instagram-post-koyu.svg     Post şablonu — koyu (1080×1080)
├── ba-instagram-story-sablon.svg  Story şablonu (1080×1920)
└── ba-linkedin-kapak.svg          LinkedIn kapak (1584×396)
```

**Dışa aktarma:** SVG'leri tarayıcıda açıp PNG olarak kaydedin veya
`inkscape --export-png=<çıktı.png> --export-width=<w> <giriş.svg>` komutunu kullanın.

---

## Açık/kapalı kanallar

| Platform | Durum | Gerekçe |
|---|---|---|
| Instagram | ✓ Açık | Görsel arşiv için birincil platform |
| LinkedIn | ✓ Açık | B2B / Norveç inşaat pazarı |
| Pinterest | ✓ Açık | Arşiv keşfi, pasif trafik |
| Twitter/X | ✗ Kapalı şimdilik | Gürültülü ortam, premium marka için uygun değil |
| TikTok | ✗ Kapalı | Arşiv estetiği ile uyumsuz |
| Facebook | ✗ Kapalı | Öncelik değil, hedef kitle örtüşmüyor |

---

## İlk gönderi planı (Faz 1 — ilk 4 hafta)

**Hafta 1 — Duyuru**
- Instagram: Profil kurulum, biyografi, link
- LinkedIn: Şirket sayfası + kapak + "Biz kimiz" yazısı
- Pinterest: 7 board + ilk 3 pin/board

**Hafta 2–3 — Arşiv serisi**
- Work ve Craft serilerinden 6 fotoğraf
- LinkedIn: "Project Archive neden storage değil retrieval meselesidir"
- Story: Accession numarası açıklaması (eğitici)

**Hafta 4 — Doğrulama**
- Instagram: Verification chain infografik (şablon kullanılarak)
- LinkedIn: Pilot pilot kapsam / DPA yazısı
- Pinterest: Verification board'u başlatma
