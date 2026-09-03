# BRD-2026-001 — Proje Kartı

**Proje No:** BRD-2026-001  
**Proje Adı:** NAVIAR Marka  
**Kategori:** Marka Kimliği  
**Durum:** Tamamlandı (üretim kapıları kısmen açık)  
**Öncelik:** —  
**Son güncelleme:** 2026-08

---

## Kimlik

| Alan | Değer |
|---|---|
| Tam ad | NAVIAR — Master Identity System |
| Kod deposu | `andersenbetul-alt/BETA-ART/brand/naviar/` |
| Üretim betiği | `python3 brand/naviar/build.py` — bağımlılık yok |
| Kaynak kurallar | *NAVIAR Logo Audit & Figma Production Autoprompt v1.0* |

## Varlıklar

### master/ — Üretim varlıkları (SVG)
- `naviar-wordmark` (+ white/black/responsive)
- `naviar-monogram` (+ mono-dark/mono-light)
- `naviar-lockup-horizontal` (+ reverse)
- `naviar-lockup-stacked`
- `naviar-icon-app`
- `naviar-icon-favicon`

### descriptors/ — Ürün tanımlayıcıları
CONSULTING · AI · PLATFORM · RESEARCH INSTITUTE · ACADEMY · LABS  
+ `naviar-care-PENDING-APPROVAL.svg` — **iş onayı ve Nice sınıf 44 taraması gerekli**

### studies/ — Reddedilen yönlerin arşivi
Metalik N flat, Dot-A ölçeği, R karşılaştırması, monogram ölçeği

## Renk paleti

| İsim | Değer |
|---|---|
| NAVIAR Lacivert | Bilgi bulunamadı — `build.py`'den doğrulama gerekli |
| Altın aksan | Görünür alanın %14,0'ı (spec: %12–16) |

## Geometri doğrulaması

| Kriter | Spec | Üretilen | Durum |
|---|---|---|---|
| Wordmark stroke | H'nin %14–16'sı | %15 | ✔ |
| Altın aksan | %12–16 | %14,0 | ✔ |
| **Diyagonal açı** | **38–42°** | **29,9°** | **✘ SAPMA — karar bekliyor** |

### Açı sapmasının gerekçesi
Spec'in üç monogram sayısı birbiriyle çelişiyor. 760×800 footprint + 150 birim ribbon sabitken, N diyagonali için 29,9° zorunlu. 38–42° için footprint ~971 birime çıkması gerekir — bu "~760×800" şartını bozar. Footprint ve ribbon korunmuş, açı sapması bilerek bırakılmış. **Kullanıcı onayı bekleniyor.**

## Açık üretim kapıları

| Kapı | Durum |
|---|---|
| Diyagonal açı sapması onayı | AÇIK — karar bekliyor |
| `naviar-care` descriptor onayı | AÇIK — iş onayı + Nice 44 taraması gerekli |
| Trademark clearance | Bilgi bulunamadı — doğrulama gerekli |

---

**Hazırlayan:** AUTOPROMPT arşivleme sistemi, 2026-09-03
