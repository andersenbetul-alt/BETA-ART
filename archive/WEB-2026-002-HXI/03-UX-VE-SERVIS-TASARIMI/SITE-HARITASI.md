# WEB-2026-002 HXI — Site Haritası

**Son güncelleme:** 2026-09-03  
**Sayfa sayısı:** 9

---

## Sayfa envanteri

| Kod | Dosya | URL | Başlık | Açıklama |
|---|---|---|---|---|
| PAGE-001 | `index.html` | `/` | HXI — Norwegian Electronic / Phonk Artist from Oslo | Ana sayfa: hero, current signal, selected works, credits snippet, use, sync, press teaser, contact CTA |
| PAGE-002 | `music.html` | `/music` | HXI Music — Releases & Discography | Tam diskografi: releases, remixler, seçilmiş eserler |
| PAGE-003 | `credits.html` | `/credits` | HXI Credits — Studio & Production | Stüdyo, prodüksiyon, kredit listesi |
| PAGE-004 | `use.html` | `/use` | HXI Use — Creator Licensing | Creator Use lisans bilgisi: creator içerikçiler için müzik kullanım kuralları |
| PAGE-005 | `sync.html` | `/sync` | HXI Sync & Licensing | Film, TV, oyun ve reklam için profesyonel sync ve lisans sorgulama |
| PAGE-006 | `press.html` | `/press` | HXI Press | Basın paketi, resmi fotoğraflar, biyografi |
| PAGE-007 | `contact.html` | `/contact` | HXI Contact | Doğrudan iletişim formu |
| PAGE-008 | `privacy.html` | `/privacy` | HXI — Privacy Policy | Gizlilik politikası |
| PAGE-009 | `legal.html` | `/legal` | HXI — Legal | Yasal uyarılar, lisans ve kullanım koşulları |

---

## Navigasyon yapısı

**Ana menü (masaüstü + mobil):**
```
HXI [logo]    Music · Credits · Use · Sync · Press · Contact    [Listen ↗]
```

**Mobil menü (numaralı):**
```
01  Music
02  Credits
03  Use
04  Sync
05  Press
06  Contact
```

---

## Ana sayfa bölümleri (index.html — 9 ekran)

| # | Bölüm | İçerik |
|---|---|---|
| 01 | HERO | UTGAVE etiketi, koordinatlar, HXI işareti, tagline, destekleyici metin, iki CTA |
| 02 | CURRENT SIGNAL | Öne çıkan single/remix: "WORTH NOTHING" (2024, NCS) |
| 03 | SELECTED WORKS | Featured release + katalog kartları, Full Catalog bağlantısı |
| 04 | CREDITS | Stüdyo kredit özeti |
| 05 | USE | Creator Use açıklaması + CTA |
| 06 | SYNC | Sync / Licensing açıklaması + CTA |
| 07 | PRESS | Basın özeti + CTA |
| 08 | CONTACT | İletişim formu veya CTA |
| 09 | FOOTER | Telif, bağlantılar |

---

## Vercel URL yönlendirmeleri (vercel.json → rewrites)

| Source | Destination |
|---|---|
| `/music` | `/music.html` |
| `/credits` | `/credits.html` |
| `/use` | `/use.html` |
| `/sync` | `/sync.html` |
| `/press` | `/press.html` |
| `/contact` | `/contact.html` |
| `/privacy` | `/privacy.html` |
| `/legal` | `/legal.html` |

`cleanUrls: true` → `.html` uzantısı URL'de görünmez.
