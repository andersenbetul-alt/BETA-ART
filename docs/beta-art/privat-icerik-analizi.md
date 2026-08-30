# BETA ART Privat — içerik analizi (30.08.2026)

`docs/proje-arsivi.md` hangi dosyanın nerede olduğunu kataloglar. Bu belge
bir adım ileri gidip **içeriği** karşılaştırır: dört ayrı kod tabanında
(madde 4/5/12/13, bkz. proje-arsivi.md) aynı şeyler mi yazıyor? Kaynak,
depoya girmiş her dosyadan birebir alıntı veya doğrudan grep sonucu —
hiçbir rakam hafızadan yazılmadı.

## 1. Fiyatlandırma — gerçek bir çelişki var

| Kaynak | Personal | Commercial | Extended | Custom |
|---|---|---|---|---|
| Canlı site (`beta-art-archive-five.vercel.app`, kullanıcı paylaştı) | kr 190'dan | **kr 1.200'den** | **kr 4.500'den** | talebe göre |
| Statik "Privat" prototip (`0be5318f-index.html`, `.tier-price`) | kr 190'dan | **kr 890** (sabit) | **kr 2.900** (sabit) | talebe göre |
| "BETA ART Private" (madde 13, `assets/app.js`) | rakam yok — "final pricing... subject to launch review" | rakam yok | rakam yok | rakam yok |
| Final Work v2 (Supabase) | rakam yok — üretim veritabanından geleceği varsayılıyor | rakam yok | rakam yok | rakam yok |

**Personal fiyatı iki kaynakta da aynı (kr 190'dan)** — tutarlı. Ama
**Commercial ve Extended iki farklı sayı taşıyor**: biri "başlangıç
fiyatı" (890/2.900) diyor, diğeri "-dan" ekiyle daha yüksek bir taban
(1.200/4.500) veriyor. Bu, aynı ürünün iki ayrı taslak aşamasında farklı
fiyatlandığını gösteriyor olabilir — ama hangisinin güncel/geçerli olduğu
hiçbir belgede söylenmiyor.

## 2. Seri/plaka yapısı — sayı tutarlı, şema tutarlı değil

| Kaynak | Toplam plaka | Organizasyon şeması |
|---|---|---|
| `CONTENTMAP.md` / canlı site "Editorial framework" | **14 planlı** (12 mevcut prototip) | **7 seri**: Work, Craft, Land and Light, The Table, Rooms, The Unseen, Weather |
| Field Notes "launch shot list" (madde 12) | **14** | **5 katman (Tier A–E)**: A=Norveç'te çalışan insanlar·4, B=Zanaat/süreç·3, C=İmza mekanlar·3, D=Nordik mimari·2, E=Yemek/kültür·2 |
| Statik "Privat" prototip (madde 4) | **12** katalog kaydı | Seri yok — düz kategori filtresi: landscape/city/portrait |
| "BETA ART Private" (madde 13) | **3 demo** (Series I·Work, Land and light, Rooms) | Seri adları kullanıyor, 7'li şemayla **uyumlu** (üçü de gerçek seri adı) |

Toplam sayı (14 planlı) iki bağımsız kaynakta eşleşiyor — bu güven verici.
Ama **organizasyon şeması farklı**: CONTENTMAP.md'nin 7 serisi ile Field
Notes'un 5 katmanı aynı 14 plakayı iki farklı şemayla anlatıyor gibi
görünüyor; hangisinin kanonik olduğu hiçbir yerde açıkça yazmıyor.
Madde 13'ün üç demo plakası en azından 7-seri adlandırmasıyla uyumlu.

## 3. Doğrulama zinciri — dört farklı adım sayısı

| Kaynak | Adım sayısı | Liste |
|---|---|---|
| Statik "Privat" prototip (madde 4), `#verification` bölümü | **3** ("Method I/II/III") | RAW arşivlenir → köken kaydı eşlik eder → lisans fotoğrafçı tarafından imzalanır |
| Canlı site "Beta proof chain" (kullanıcının ilk paylaştığı sayfa) | **6** | Human → Camera → RAW → Edit → Rights → Licence |
| `ASSETSTATUS.md` | **5** ("all five verification checks") — liste **hâlâ paylaşılmadı** | bilinmiyor |
| "BETA ART Private" (madde 13) doğrulama kapısı | **8** | Original, Identity, Capture, Rights, AI disclosure, Conflict gate, Provenance, C2PA |

Dördü de aynı temel fikri anlatıyor (orijinal + köken + haklar + lisans),
ama hiçbiri birebir aynı adım sayısını vermiyor. En ayrıntılı liste
(madde 13, 8 adım) muhtemelen en olgun/son sürüm — ama bu bir varsayım,
doğrulanmadı.

## 4. Tutarlı kalan şeyler (iyi haber)

- **Fotoğrafçı kimliği**: Betül Öner, tüm kaynaklarda aynı.
- **"AI-free" iddiası ve gerekçesi**: hiçbir kaynak "kesin/mutlak kanıt" iddiasında bulunmuyor, hepsi "kanıt gösterilen, iddia edilmeyen" dilini koruyor — CLAUDE.md'nin "uydurma yasağı" ilkesiyle aynı disiplin, dört kod tabanında da bozulmamış.
- **Lisans katmanı adları** (Personal / Commercial / Extended / Custom & Exclusive): dört kaynakta da aynı dört isim.
- **Personal fiyatı**: kr 190'dan, iki rakamlı kaynakta da eşleşiyor.
- **Norveç odaklı, KDV %25**: statik prototipin teklif/fatura aracı (`tools.js`) `VAT 25%` sabit oranını kullanıyor, canlı sitedeki Norveç vurgusuyla tutarlı.

## Sonuç

"BETA ART Privat" kavramı **fikir düzeyinde tutarlı** (aynı fotoğrafçı,
aynı disiplin, aynı dört lisans katmanı, aynı toplam plaka hedefi) ama
**rakam ve şema düzeyinde en az üç gerçek çelişki** taşıyor: Commercial/
Extended fiyatları, seri organizasyon şeması, doğrulama adım sayısı.
Birleştirme kararından önce bunların **hangi kaynağın "son söz" olduğu**
netleşmeden tek bir sayfaya indirgenmesi, üç çelişkiden birini rastgele
seçmiş olmak anlamına gelir — bu da uydurmadan farksız olur.
