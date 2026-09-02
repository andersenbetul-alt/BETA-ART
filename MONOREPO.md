# BETA-ART — Monorepo

Bu depo tüm projelerin tek merkezde toplandığı ana depodur.
**"Butun projeleri buraya tasi" — 30.08.2026**

## Proje haritası

| Dizin | Proje | Stack | Durum |
|---|---|---|---|
| `/` (kök) | **QBLOGG** — içerik stüdyosu tanıtım + blog sitesi | Saf HTML/CSS/JS, 10 dil | Yayında: qblogg.vercel.app |
| `hxi/` | **HXI** — Oslo elektronik artist sitesi | Saf HTML/CSS/JS | Geliştirmede · `brand/hxi/` marka mimarisi |
| `beta-art/` | **Beta Art** — doğrulanmış insan fotoğrafçılığı ve arşiv | React + Vite + Bun + shadcn/ui | Kaynak: `andersenbetul-alt/beta-art-archive` |
| `naviar/` | **NAVIAR CARE** — Norveç yaşlı bakım koordinasyon platformu | Next.js (v0.app kökenli) | Kaynak: `betulandersen-droid/naviar-care-1` (transfer bekleniyor) |
| `agents/eve-slack-agent/` | **naviar-consult & hxi-music** — Eve Slack botu | TypeScript + pnpm + Claude Sonnet | Vercel: naviar-consult, hxi-music. Bot kimliği `AGENT_PROFILE` env değişkeniyle ayrılır |
| `agents/eve-chat-template/` | **Eve Chat Template** — sohbet arayüzü şablonu | Next.js + pnpm + shadcn/ui | Kaynak: `andersenbetul-alt/eve-chat-template` |
| `demo/` | Action Pages demoları | Saf HTML/JS | qblogg.vercel.app/demo/ |
| `engine/` | Curiosity Engine — içerik üretim hattı | Node.js + SQLite | Yerel çalışır |
| `docs/` | Tüm projeler için belgeleme | Markdown | — |
| `brand/hxi/` | **HXI marka mimarisi** — brand DNA, görsel kimlik, site mimarisi | Markdown | 100/100 Final · 30.08.2026 |

## Vercel projeleri (BET-ART takımı)

| Vercel proje | GitHub kaynağı | Adres |
|---|---|---|
| qblogg | `andersenbetul-alt/BETA-ART` (main, buildCommand) | qblogg.vercel.app |
| naviar-care-1 | `betulandersen-droid/naviar-care-1` | — |
| naviar-consult | `betulandersen-droid/eve-slack-agent` | — | `AGENT_PROFILE=naviar-consult` |
| hxi-music | `betulandersen-droid/eve-slack-agent` | — | `AGENT_PROFILE=hxi-music` |

## Transfer beklenen projeler

- **`betulandersen-droid/naviar-care-1`** → `naviar/` dizinine taşınacak.  
  GitHub repo transferi için: GitHub → naviar-care-1 repo → Settings → Transfer ownership → `andersenbetul-alt`.  
  Transfer sonrası `naviar/` güncellenecek ve Vercel bağlantısı yeniden kurulacak.

## Geliştirme notları

- QBLOGG (kök): `npm run dev` → http://localhost:8000
- **HXI**: `cd hxi && python3 -m http.server 8001` → http://localhost:8001 (saf HTML, sunucu gerekmez)
  - Marka mimarisi: `brand/hxi/README.md` ve `brand/hxi/CONCEPT.md`
- Beta Art: `cd beta-art && bun install && bun dev`
- Eve Chat Template: `cd agents/eve-chat-template && pnpm install && pnpm dev`
- Eve Slack Agent: `cd agents/eve-slack-agent && pnpm install && AGENT_PROFILE=hxi-music pnpm dev`
- HXI belgesi: `docs/hxi/BUSINESS.md` · marka taslağı: `docs/hxi/brand-brief.md`
