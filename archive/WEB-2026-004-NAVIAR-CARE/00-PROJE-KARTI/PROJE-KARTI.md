# WEB-2026-004 — Proje Kartı

**Proje No:** WEB-2026-004  
**Proje Adı:** NAVIAR Care  
**Kategori:** Web Platformu — Norveç Yaşlı Bakım / Kamu Hizmetleri Koordinasyonu  
**Durum:** Beklemede  
**Öncelik:** 🟡 Orta  
**Son güncelleme:** Bilinmiyor

---

## Kimlik

| Alan | Değer |
|---|---|
| Tam ad | NAVIAR Care — Norveçli yaşlılar ve yakınları için dijital koordinasyon platformu |
| Tagline | "Trygg koordinering for eldre og pårørende." |
| Hedef domain | Bilgi bulunamadı — doğrulama gerekli |
| Kod deposu | `betulandersen-droid/naviar-care-1` (private — başka hesapta) |
| BETA-ART deposu | `andersenbetul-alt/BETA-ART/naviar/` — yalnızca README, kod YOK |
| Vercel projesi | `naviar-care-1` (bet-art takımı) |
| Production URL | `naviar-care-1-psi.vercel.app` |
| Son preview | `naviar-care-1-1503sfbgf-bet-art.vercel.app` |

## Sürüm

| Alan | Değer |
|---|---|
| Production | Eski — "update site title" commit |
| Preview | "rename NAVIAR to NAVIAR CARE and update tagline" — production'a çıkarılmadı |

## Teknik özet

| Alan | Değer |
|---|---|
| Teknoloji | Next.js (v0 ile oluşturuldu) |
| Dil | Türkçe |

## Pilot projeler

1. **Pårørende i NAV-systemet** — NAV başvuruları, kararlar, itirazlar
2. **Pårørende og kommunen** — Bakım ve belediye hizmetleri
3. **Digital hjelp sammen** — Dijital hizmetlerde güvenli yardım

## Engel

Kaynak kodu `betulandersen-droid` hesabında, `andersenbetul-alt` hesabından erişim bilinmiyor.  
BETA-ART monoreposuna taşıma planı var ama henüz yapılmadı.

## Taşıma planı

1. `betulandersen-droid/naviar-care-1` → `andersenbetul-alt/BETA-ART` için erişim ver
2. Kaynak kodu `naviar/app/` altına kopyala
3. Vercel'de `naviar-care-1` projesini bu repoya bağla
4. `vercel.json` monorepo yapısıyla güncelle

---

**Hazırlayan:** AUTOPROMPT arşivleme sistemi, 2026-09-03
