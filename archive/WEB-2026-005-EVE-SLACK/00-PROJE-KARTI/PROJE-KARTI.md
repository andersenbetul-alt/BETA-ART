# WEB-2026-005 — Proje Kartı

**Proje No:** WEB-2026-005  
**Proje Adı:** Eve Slack Agent  
**Kategori:** Bot / Agent — Slack Entegrasyonu  
**Durum:** Beklemede  
**Öncelik:** 🟢 Düşük  
**Son güncelleme:** Bilinmiyor

---

## Kimlik

| Alan | Değer |
|---|---|
| Tam ad | Eve Slack Agent — naviar-consult + hxi-music Slack botu |
| Framework | Eve (eve.dev) + Vercel |
| Kod deposu | `andersenbetul-alt/BETA-ART/agents/eve-slack-agent/` |
| Kaynak | `andersenbetul-alt/eve-slack-agent` reposundan taşındı |
| Paket yöneticisi | pnpm |
| Sürüm | v0.0.0 |

## Vercel projeleri

| Proje | Profil | Takım |
|---|---|---|
| `naviar-consult` | `AGENT_PROFILE=naviar-consult` | bet-art takımı |
| `hxi-music` | `AGENT_PROFILE=hxi-music` | bet-art takımı |

## Yapı

| Dosya | İçerik |
|---|---|
| `agent/agent.ts` | Model seçimi, `AGENT_PROFILE` env'e göre profil yükler |
| `agent/instructions.md` | Profil belirlenmemişse yedek talimat |
| `agent/profiles/hxi-music.md` | HXI müzik botunun kimliği ve davranışı (59 satır) |
| `agent/profiles/naviar-consult.md` | Naviar danışmanlık botu (17 satır, taslak) |
| `agent/skills/` | proje-on-degerlendirme, teknik-format |
| `agent/tools/` | get_weather (örnek araç) |

## Bağlı projeler

- **HXI** (WEB-2026-002) — hxi-music botu `AGENT_PROFILE=hxi-music`
- **NAVIAR** (WEB-2026-004) — naviar-consult botu `AGENT_PROFILE=naviar-consult`

## Bilinen eksikler

| Alan | Seviye | Durum |
|---|---|---|
| naviar-consult profili taslak düzeyde | **Orta** | Bekliyor |
| Özelleştirme kararı alınmadı | **Orta** | Bekliyor |
| Slack bağlantısı kurulmadı | **Orta** | Bekliyor |

---

**Hazırlayan:** AUTOPROMPT arşivleme sistemi, 2026-09-03
