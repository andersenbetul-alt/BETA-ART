# Beta Art — Yol Haritası

**Dizin:** `beta-art/`  
**Lovable ID:** `9b7b3abe-43fc-4867-9f79-b1d22fb1a80c`  
**Kaynak repo:** `andersenbetul-alt/beta-art-archive`  
**Durum:** 🔒 Taslak (deploy edilmedi)

---

## Konsept

"Doğrulanmış insan fotoğrafçılığı arşivi." Her fotoğraf bir insan tarafından fiziksel kamerayla çekildi, RAW orijinali saklandı, çekim meta verisi korunuyor, lisans doğrudan fotoğrafçıdan veriliyor. AI üretimi içerik değil.

**Neden var:**
- AI görsel üretiminin patlama yaptığı dönemde **orijinalliği satmak**
- Belgelenmiş provenance → premium lisans fiyatı
- Arşiv estetiği → müze kalitesi hissi

**Tasarım yönü:**
- Minimalist müze / arşiv estetiği
- Editorial tipografi, bol beyaz alan
- Fotoğraf önde, UI geri planda
- SaaS landing page gibi değil — ciddi bir fotoğraf arşivi gibi

**Hedef kitle:**
- Tasarımcılar, yayıncılar, markalar: ticari lisans arayışında
- Gazeteciler, içerik ekipleri: doğrulanmış görsel kaynak

---

## Teknik mimari

| Karar | Neden |
|---|---|
| TanStack Start (SSR) | Lovable şablonu; SEO için SSR gerekli |
| React 19 + TypeScript | Lovable ekosistemi |
| Tailwind CSS v4 | Token sistemi |
| Supabase (planlanan) | Fotoğraf kataloğu, lisans takibi, provenance kayıtları |
| Lovable kaynak | `9b7b3abe` — push gelince `beta-art/` güncellenir |

---

## Sayfalar ve bölümler

### Ana sayfa (homepage)
| Bölüm | İçerik |
|---|---|
| Nav | Collection, Verification, Photographer, Licensing, FAQ, Contact |
| Hero | "Verified Human Photography" H1; provenance ve lisans bilgisi; "View the collection" CTA |
| Verification | 3 yöntem: RAW arşivlendi / Capture record / Maker imzalı lisans |
| Collection grid | 12 örnek plaka: başlık, katalog numarası, lokasyon/tarih, "from kr 190" |
| Photographer/About | — |
| Licensing | Personal / Commercial / Extended / Custom & Exclusive |
| FAQ | — |
| Footer | Premium altbilgi |

### Örnek koleksiyon plakları
First Light, Into the Pines, Sea of Fog, Still Water, PALM, Blue Hour Grid, Night Crossing, Golden Hour, Portrait in Amber, The Maker, Slow Morning, Low Tide

---

## Değişiklik günlüğü

| Tarih | Değişiklik | Yapan |
|---|---|---|
| Ağu 2026 | Lovable'da oluşturuldu | Lovable AI |
| 30.08.2026 | BETA-ART monoreposuna import edildi (`beta-art/`) | Claude |
| 30.08.2026 | ROADMAP.md oluşturuldu | Claude |

---

## Sırada ne var

| Öncelik | İş |
|---|---|
| Kritik | **Gerçek fotoğraflar ekle** — şu an placeholder; lisans satışı için gerçek koleksiyon gerekli |
| Kritik | **Ödeme akışı** — Lisans satın alma; Stripe önerilen |
| Yüksek | **Fotoğraf kataloğu** — Supabase; title, catalogue_no, provenance, RAW hash, lisans türleri |
| Yüksek | **Lisans belgesi üretimi** — Her satışta PDF/imzalı belge |
| Yüksek | **Alan adı** — beta-art.com (SEO meta'da halihazırda kayıtlı) |
| Orta | **Provenance sayfası** — Her fotoğrafın EXIF + RAW özeti |
| Orta | **Fotoğrafçı profili** — Kim çekti, nasıl doğrulandı |
| Düşük | **İkincil pazar / koleksiyoncu** — Baskı satışı |
