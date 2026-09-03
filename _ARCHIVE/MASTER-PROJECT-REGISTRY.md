# BETA-ART — Ana Proje Kataloğu

**Son güncelleme:** 2026-09-03  
**Depo:** `andersenbetul-alt/BETA-ART`  
**Takım:** BET-ART (Vercel)

---

## Proje tablosu

| Proje No | Proje Adı | Amaç | Durum | Sürüm | Son Güncelleme | Canlı Adres | Kod Konumu | Sonraki Adım |
|---|---|---|---|---|---|---|---|---|
| WEB-2026-001 | QBLOGG | İçerik stüdyosu tanıtım + blog | ✅ Yayında | 0.1.0 | 2026-08-30 | qblogg.vercel.app | `/` (kök) | Stripe + alan adı bağlantısı |
| WEB-2026-002 | Beta Art | İnsan fotoğrafçılığı arşivi | ⚠️ Belirsiz | — | 2026-08-30 | — | `beta-art/` | Canlı URL doğrulanmalı |
| WEB-2026-003 | NAVIAR CARE | Norveç yaşlı bakım koordinasyonu | 🔄 Taşıma bekleniyor | — | 2026-08-30 | naviar-care-1-psi.vercel.app | `naviar/` (sadece README) | Repo transferi + kod taşıma |
| WEB-2026-004 | Eve Slack Agent | Slack bot altyapısı | ✅ Vercel'de yayında | 0.0.0 | 2026-08-30 | naviar-consult + hxi-music | `agents/eve-slack-agent/` | Sürüm takibi başlatılmalı |
| WEB-2026-005 | Eve Chat Template | Sohbet UI şablonu | 🔧 Şablon | 0.0.0 | 2026-08-30 | — | `agents/eve-chat-template/` | Deploy planı belirsiz |
| BRD-2026-001 | Naviar Marka | Kimlik varlıkları | 📦 Arşiv | — | 2026-08-30 | — | `brand/naviar/` | — |
| BRD-2026-002 | HXI Marka | Kimlik varlıkları | 🔀 Merge bekliyor | — | 2026-08-30 | — | `brand/hxi/` | Main'e merge |
| BRD-2026-003 | Cobban Marka | Kimlik varlıkları | 📦 Arşiv | — | 2026-08-30 | — | `brand/cobban/` | — |
| INF-2026-001 | Curiosity Engine | İçerik üretim motoru | 🖥 Yerel | — | 2026-08-24 | — | `engine/` | Bulut planı yok |
| INF-2026-002 | Action Pages Demo | Satış demo sayfası | ✅ Yayında | — | 2026-08-24 | qblogg.vercel.app/demo/ | `demo/` | 30 günlük satış deneyi |

---

## Aktif projeler

- WEB-2026-001 QBLOGG
- WEB-2026-004 Eve Slack Agent

## Yayındaki projeler

- WEB-2026-001 QBLOGG → qblogg.vercel.app
- WEB-2026-004 Eve Slack Agent → naviar-consult.vercel.app, hxi-music.vercel.app
- INF-2026-002 Action Pages Demo → qblogg.vercel.app/demo/

## Bekleyen projeler

- WEB-2026-003 NAVIAR CARE (repo transferi bekleniyor)
- WEB-2026-005 Eve Chat Template (deploy planı yok)
- BRD-2026-002 HXI Marka (main'e merge bekliyor)

## Eksik dokümantasyonu olan projeler

- WEB-2026-002 Beta Art (amaç, canlı URL, sürüm belirsiz)
- WEB-2026-003 NAVIAR CARE (kod bu depoda yok)
- WEB-2026-004 Eve Slack Agent (dual-deploy mantığı belgelenmemiş)
- BRD-2026-003 Cobban (projenin bağlamı bilinmiyor)

## Teknik risk taşıyan projeler

- WEB-2026-003: Kod private repoda, erişim kesilirse kaybolur
- BRD-2026-002: HXI logoları main'de yok, kaybolma riski var
- Tüm projeler: Git tag yok → sürüm geçmişi belirsiz

## Birbiriyle bağlantılı projeler

```
QBLOGG ←→ Curiosity Engine (içerik üretim hattı)
QBLOGG ←→ Action Pages Demo (satış kanalı)
NAVIAR CARE ←→ Eve Slack Agent (naviar-consult botu)
HXI ←→ Eve Slack Agent (hxi-music botu)
Naviar Marka ←→ NAVIAR CARE
HXI Marka ←→ HXI (Vercel projesi, bu depoda değil)
```

## Ortak kod kullanan projeler

- Eve Chat Template + Eve Slack Agent → ortak shadcn/ui bileşenleri, pnpm
- QBLOGG + NAVIAR CARE → `uye/` sistemi (Supabase, ortak altyapı)

---

*Bu belge `_ARCHIVE/` sistemi tarafından otomatik üretilmiştir. Kod dokunulmaz — yalnızca belge.*
