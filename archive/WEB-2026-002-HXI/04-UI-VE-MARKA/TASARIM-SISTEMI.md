# WEB-2026-002 HXI — Tasarım Sistemi

**Durum:** Kilitli (CONCEPT LOCKED · 30.08.2026)  
**Kaynak:** `brand/hxi/README.md`, `brand/hxi/master/visual-identity.md`

---

## Renk paleti

| Token / Ad | Değer | Kullanım |
|---|---|---|
| Deep Black | `#080808` | Birincil arka plan |
| Cold Off-White | `#F0EDE8` | Birincil metin / yüzey |
| HXI Acid | `#C8FF00` | Birincil accent / marka rengi |
| Signal Red | `#EF2B2D` | İkincil sinyal — damla, uyarı, kampanya kesintisi |

> **Not:** `wordmark.svg` ve `symbol.svg` şu an `#E8153A` (Signal Red) ile üretildi — tasarım araştırması. X accent üretim rengi `#C8FF00` (Acid). Logo dosyaları final üretim öncesi güncellenmelidir.

---

## Tipografi

| Rol | Yüz | Kullanım |
|---|---|---|
| DISPLAY | Barlow Condensed | Başlık, kampanya, sanatçı açıklamaları |
| BODY | IBM Plex Sans | Uzun metin, açıklamalar, metadata |
| SYSTEM / SIGNAL | Space Mono | UTGAVE, koordinatlar, yıl, rol, parça metadata, navigasyon numaraları |

Kaynak: Google Fonts (CDN)

---

## Logo sistemi

**Wordmark geometrisi (brand/hxi/README.md):**

| Harf | Ölçü |
|---|---|
| H: Cap height | 200u, stem genişliği 28u (%14), crossbar y=86–114 |
| X: Bounding box | 140×200u, diyagonal 244.13u, perm. yarı genişlik 14u |
| I: Width | 28u, height 200u |
| Wordmark viewBox | `-16 -12 412 224` |

**3 konsept:**

| Konsept | Açıklama | Durum |
|---|---|---|
| A — Signal | H+I nötr, X signal kırmızı | ÖNERİLEN |
| B — Threshold | Tüm harfler nötr + yatay kırmızı çizgi | Variant |
| C — Monogram | Yalnızca X — daire, kontur, kare, serbest | İkon kullanımı |

**Logo dosyaları:**
- `brand/hxi/wordmark.svg` — Flat vector master (güncelleme gerekli)
- `brand/hxi/symbol.svg` — X monogramı daire içinde (güncelleme gerekli)
- `hxi/assets/img/favicon.svg` — Site favicon
- `hxi/assets/img/og-image.svg` — OG görsel

---

## Marka mimarisi

| Katman | Karar | Rol |
|---|---|---|
| HXI | MASTERBRAND | Artist / creator identity |
| OSLO / NORWAY | ORIGIN | Özgünlük ve sahip olunabilir coğrafya |
| NORDIC COLD | BRAND WORLD | Duygu / atmosfer |
| SIGNAL SYSTEM | VISUAL LANGUAGE | Grafik, motion, UI ve merchandise sistemi |
| UTGAVE | EDITORIAL SYSTEM | Release / kampanya / edition mantığı |
| THE SAME SPEED — COLDER. | SIGNATURE LINE | Yapışkan ifade |
| PROOF OVER HYPE | OPERATING PRINCIPLE | İç kalite ve doğruluk kuralı |

---

## Tasarım ilkeleri

- **MUSIC FIRST. WORLD SECOND. UTILITY THIRD.** — site sıra bu
- İlk 3–5 saniye: az eleman, güçlü hiyerarşi
- Karanlık tema, tek tema (bilinçli tercih)
- Scroll reveal animasyonları (IntersectionObserver tabanlı)
- `data-stagger` ile kademeli eleman girişi

---

## Açık üretim kapıları

| Kapı | Durum |
|---|---|
| Logo Acid renk güncelleme (`#C8FF00`) | AÇIK |
| Trademark clearance (HXI word mark, logo, slogan) | AÇIK — PROMISING CANDIDATE / NOT CLEARED |
| Final içerik + görseller | AÇIK |
| Üretim formları + QA | AÇIK |

`®` veya "tam koruma altında" ifadesi — trademark tescili tamamlanana kadar kullanılamaz.
