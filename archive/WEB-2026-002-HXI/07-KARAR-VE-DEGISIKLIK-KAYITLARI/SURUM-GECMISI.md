# WEB-2026-002 HXI — Sürüm Geçmişi

## Mevcut durum

| Alan | Değer |
|---|---|
| Durum | Geliştirmede — henüz yayınlanmadı |
| Güncel sürüm | Yok (v1.0.0 henüz yayınlanmadı) |
| Aktif dal | `claude/hxi-dosyalari-nuf9y8` |
| Açık PR | PR #17 → `main` |

---

## Taslak: v1.0.0 (ilk yayın — beklemede)

**Bekleyenler:**
1. Vercel deploy engeli çözülmeli (Vercel GitHub auth `andersenbetul-alt`'a yetkili değil)
2. İsteğe bağlı: gerçek müzik/cover görseli (şu an placeholder)
3. İsteğe bağlı: contact formu gerçek servise bağlanmalı

**v1.0.0 kapsamı (mevcut kod):**
- 9 HTML sayfası (index, music, credits, use, sync, press, contact, privacy, legal)
- Tek CSS dosyası (main.css)
- Tek JS dosyası (app.js — navigasyon, scroll, reveal)
- Vercel yapılandırması (vercel.json — URL rewrites, güvenlik başlıkları, cache)
- Favicon ve OG görseli (SVG)

---

## Dal geçmişi

| Dal | Açıklama |
|---|---|
| `claude/hxi-dosyalari-nuf9y8` | Aktif geliştirme dalı |
| `main` | Üretim dalı (HXI kodu henüz merge edilmedi) |

---

## Deneme prototipleri (experiments/)

| Dosya | Teknoloji | Durum |
|---|---|---|
| `hxi-nordic-phonk.html` | React / Space Mono | Reddedildi — çok ağır (296KB) |
| `hxi-arktisk.html` | React / Space Grotesk | Reddedildi — çok ağır (217KB) |

Her iki prototip `experiments/` klasöründe korunmaktadır — tarihsel referans.
