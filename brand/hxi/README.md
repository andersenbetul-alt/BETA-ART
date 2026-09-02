# HXI — Brand Architecture & Logo Production

**Status:** CONCEPT LOCKED · Production gates open (see below)  
**Version:** 100/100 Final · 30.08.2026  
**Owner:** andersen.betul@gmail.com

---

## Final System at a Glance

| Layer | Decision | Role |
|---|---|---|
| **HXI** | MASTERBRAND | Artist / creator identity |
| **OSLO / NORWAY** | ORIGIN | Authenticity and ownable geography |
| **NORDIC COLD** | BRAND WORLD | Feeling / atmosphere |
| **SIGNAL SYSTEM** | VISUAL LANGUAGE | Graphic, motion, UI and merchandise system |
| **UTGAVE** | EDITORIAL SYSTEM | Release / campaign / edition logic |
| **THE SAME SPEED — COLDER.** | SIGNATURE LINE | Sticky expression |
| **PROOF OVER HYPE** | OPERATING PRINCIPLE | Internal quality and accuracy rule |

---

## Brand DNA (Final)

```
SOUND × PLACE × SIGNAL × IMPACT × CULTURE
```

| Pillar | Meaning |
|---|---|
| SOUND | HXI music is the center. Site shows before it tells. |
| PLACE | Oslo. Not postcard Norway — concrete, winter light, industrial silence. `59.91°N / 10.75°E` |
| SIGNAL | What separates HXI from a generic dark-artist site. X, acid, coordinates, UTGAVE, readout, controlled distortion. |
| IMPACT | First 3–5 seconds must land. Fewer elements + stronger hierarchy. |
| CULTURE | Music → edit culture → gaming → visual media → fashion → objects → sync → collaboration. |

---

## Core Identity

**Master positioning:**
> HXI is an Oslo-born electronic artist built around speed, distortion and impact.

**Genre descriptor:** Nordic phonk / electronic production  
**SEO:** Norwegian phonk producer / Nordic phonk artist

**Signature line:** THE SAME SPEED — COLDER.  
**Operating principle (internal):** PROOF OVER HYPE.  
**Website rule:** MUSIC FIRST. WORLD SECOND. UTILITY THIRD.

---

## Visual Identity — Locked Values

| Token | Value | Use |
|---|---|---|
| Deep Black | `#080808` | Primary background |
| Cold Off-White | `#F0EDE8` | Primary text / surface |
| HXI Acid | `#C8FF00` | Primary accent / brand memory color |
| Signal Red | `#EF2B2D` | Signal Secondary only — drops, warnings, campaign interruption |

**Typography:**

| Role | Face | Usage |
|---|---|---|
| DISPLAY | Barlow Condensed | Headline, campaign, artist statements |
| BODY | IBM Plex Sans | Long-form, descriptions, metadata |
| SYSTEM / SIGNAL | Space Mono | UTGAVE, coordinates, year, role, track metadata, navigation numbers |

> **Note on logo files:** `wordmark.svg` and `symbol.svg` in this directory were produced with `#E8153A` Signal Red as the X accent (a design exploration). The locked production color for Acid accent is `#C8FF00`. SVGs should be updated before final production use.

---

## Logo Production

### Dosyalar

| Dosya | Kullanım |
|---|---|
| `wordmark.svg` | Düz vektör master — H+X+I wordmark |
| `symbol.svg` | Düz vektör master — X monogramı, daire içinde |
| `designs.html` | Tarayıcıda açın — 3 konsept, 4 zemin, boyut testi |

### Geometri

**H letterform**
- Cap height: 200u
- Stem genişliği: 28u (%14)
- Crossbar: y=86–114 (merkez y=100, yükseklik=28)
- Toplam genişlik: 140u

**X letterform**
- Bounding box: 140×200u
- Diyagonal uzunluk: 244.13u
- Perpendiküler yarı genişlik: 14u
- Polygon 1: `-11.47,8.03 11.47,-8.03 151.47,191.97 128.53,208.03`
- Polygon 2: `128.53,-8.03 151.47,8.03 11.47,208.03 -11.47,191.97`

**I letterform**
- Genişlik: 28u (stem genişliği)
- Yükseklik: 200u

**Wordmark düzeni**
- H: x=0
- X: translate(176,0) — H→X nominal aralık: 36u
- I: x=352 — X→I nominal aralık: 36u
- ViewBox: `-16 -12 412 224`

**X sembolü (symbol.svg)**
- Daire: cx=100, cy=100, r=96
- X transform: `translate(47,24) scale(0.76)` → merkez (100.2, 100)
- Köşe mesafeleri: ≈93.3u < r=96 ✓

### 3 Konsept

| Konsept | Açıklama | Durum |
|---|---|---|
| **A — Signal** | H+I nötr, X signal kırmızı | ÖNERİLEN |
| **B — Threshold** | Tüm harfler nötr + yatay kırmızı çizgi | Variant |
| **C — Monogram** | Yalnızca X — daire, kontur, kare, serbest | İkon kullanımı |

### Üretim notları

- `wordmark.svg` ve `symbol.svg` stroke içermez — tüm şekiller filled polygon/path
- Gradyan, gölge, glow, raster mask yok — flat vector master
- Yeniden üretim: bu README'deki ölçülerle sıfırdan yeniden çizilir
- Tescil öncesi: profesyonel marka taraması zorunlu (HXI kelime markası ve X monogramı)

---

## Website Architecture — Conversion Model

Four conversions drive every UX decision:

| Audience | Goal |
|---|---|
| FAN | → LISTEN |
| CREATOR | → USE |
| SUPERVISOR / BRAND | → SYNC |
| INDUSTRY | → CONTACT |

**Navigation (final):**
```
MUSIC · CREDITS · USE · SYNC · PRESS · CONTACT        [LISTEN ↗]
```

---

## Open Gates (Production Blockers)

| Gate | Status |
|---|---|
| Logo production master (Acid `#C8FF00` renk güncelleme) | OPEN |
| Trademark / slogan clearance (HXI word mark, logo, slogan) | OPEN — PROMISING CANDIDATE / NOT CLEARED |
| Final selected content + imagery | OPEN |
| Production forms + QA | OPEN |

No `®` or "fully protected" language until trademark clearance is complete.

---

## Files in This Directory

| File | Contents |
|---|---|
| `README.md` | This overview + key decisions + logo geometry |
| `CONCEPT.md` | Full 100/100 concept — all 38 sections |
| `wordmark.svg` | HXI wordmark — flat vector master |
| `symbol.svg` | X monogram in circle — flat vector master |
| `designs.html` | 3 konsept, 4 zemin, boyut testi |
| `master/visual-identity.md` | Colors, typography, logo, motion rules |
| `master/website-architecture.md` | All 9 homepage screens + all pages |
| `master/technical.md` | Tech stack, performance, SEO, i18n |
| `master/signal-score.md` | HXI Signal Score 2.0 (10 categories, production gate: 90+) |
