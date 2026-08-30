# HXI-2 — Flag Edition Yol Haritası

**Dizin:** `hxi-v2/`  
**Lovable ID:** `50f62e94-6826-409e-9bcf-df1d71d8d029`  
**Durum:** 🔒 Taslak (Lovable preview'da yayında, deploy edilmedi)

---

## Konsept

HXI-1'in "bayrak" yeniden tasarımı. Norveç bayrağının renkleri (`#00142e` lacivert, `#EF2B2D` kırmızı) birebir tema haline getirildi. Müzik kataloğu artık Supabase'den geliyor — hardcoded değil. Amaç: sanatçı yeni track yayınladıkça admin panelden ekleyebilsin, kod açmaya gerek kalmasın.

**Fark:** HXI-1 "underground stüdyo" hissiyatı verirken HXI-2 "resmi Norveç" hissiyatı veriyor.

---

## Teknik mimari

| Karar | Neden |
|---|---|
| Supabase `tracks` tablosu | Dinamik müzik kataloğu; `published` + `sort_order` ile sıralama |
| `is_admin` fonksiyonu | Admin CMS erişimi; e-posta tabanlı kontrol |
| `previewAuthStorage.ts` | Lovable preview ortamında postMessage auth broker |
| CSS `::before/::after` glitch | Span katmanları yerine; daha az DOM, aynı efekt |
| JSON-LD `MusicGroup` | Schema.org; streaming platformları ve arama için |
| `.env` asla commit edilmez | Gerçek key: `SUPABASE_PUBLISHABLE_KEY=sb_publishable_1yN6Zr...` — sadece `.env.example` depoda |

---

## Bölümler (11 bölüm — HXI-1'den daha sade)

| # | Bölüm | HXI-1'den fark |
|---|---|---|
| 1 | Nav + Preloader | Aynı yapı |
| 2 | Hero | 2 CTA (HXI-1: stats satırı vardı) |
| 3 | Ticker | Aynı |
| 4 | **Music** | **Supabase'den dinamik** (HXI-1: hardcoded) |
| 5 | Stats | 5 sayaç (HXI-1: 6) |
| 6 | Sync | Aynı tier + kimlik kartı |
| 7 | About | Sadeleştirildi |
| 8 | Store | 4 ürün |
| 9 | Email | Bülten |
| 10 | Booking | Inquiry formu |
| 11 | Footer | 3 sütun |

---

## Değişiklik günlüğü

| Tarih | Değişiklik | Yapan |
|---|---|---|
| Tem 2026 | HXI-3 orijinal oluşturuldu (10 iterasyon) | Lovable AI |
| Ağu 2026 | HXI-3'ten fork, 46 iterasyon eklendi (HXI-2) | Lovable AI |
| 24.08.2026 | BETA-ART monoreposuna import edildi (`hxi-v2/`) | Claude |

---

## Sırada ne var

| Öncelik | İş |
|---|---|
| Yüksek | Supabase projesini production'a hazırla (RLS politikaları, gerçek track verisi) |
| Yüksek | Admin paneli — basit CRUD arayüzü, `is_admin` kontrolüyle korumalı |
| Orta | `og:image` ve Twitter card |
| Orta | Alan adı bağla |
| Düşük | NCS ve Stems bölümlerini HXI-4'ten port et |
| Düşük | Norveçce dil desteği |
