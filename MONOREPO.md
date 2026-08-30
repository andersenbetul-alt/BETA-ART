# BETA-ART — Monorepo

Bu depo tüm projelerin tek merkezde toplandığı ana depodur.
**"Butun projeleri buraya tasi" — 30.08.2026**

## Proje haritası

| Dizin | Proje | Stack | Durum |
|---|---|---|---|
| `/` (kök) | **QBLOGG** — içerik stüdyosu tanıtım + blog sitesi | Saf HTML/CSS/JS, 10 dil | Yayında: qblogg.vercel.app |
| `beta-art/` | **Beta Art** — doğrulanmış insan fotoğrafçılığı ve arşiv | React + Vite + Bun + shadcn/ui | Kaynak: `andersenbetul-alt/beta-art-archive` |
| `naviar/` | **NAVIAR CARE** — Norveç yaşlı bakım koordinasyon platformu | Next.js (v0.app kökenli) | Kaynak: `betulandersen-droid/naviar-care-1` (transfer bekleniyor) |
| `agents/eve-slack-agent/` | **naviar-consult & hxi-music** — Eve Slack botu | TypeScript + pnpm + Claude Sonnet | Vercel: naviar-consult, hxi-music |
| `agents/eve-chat-template/` | **Eve Chat Template** — sohbet arayüzü şablonu | Next.js + pnpm + shadcn/ui | Kaynak: `andersenbetul-alt/eve-chat-template` |
| `cobbani/` | **Cobbani** — bağımsız marka; site geliştirme bekliyor | Marka dosyaları (SVG) | cobbani.co (planlı) |
| `demo/` | Action Pages demoları | Saf HTML/JS | qblogg.vercel.app/demo/ |
| `engine/` | Curiosity Engine — içerik üretim hattı | Node.js + SQLite | Yerel çalışır |
| `docs/` | Tüm projeler için belgeleme | Markdown | — |

## Vercel projeleri (BET-ART takımı)

| Vercel proje | GitHub kaynağı | Adres |
|---|---|---|
| qblogg | `andersenbetul-alt/BETA-ART` (main, buildCommand) | qblogg.vercel.app |
| naviar-care-1 | `betulandersen-droid/naviar-care-1` | — |
| naviar-consult | `betulandersen-droid/eve-slack-agent` | — |
| hxi-music | `betulandersen-droid/eve-slack-agent` | — |

## Transfer beklenen projeler

- **`betulandersen-droid/naviar-care-1`** → `naviar/` dizinine taşınacak.  
  GitHub repo transferi için: GitHub → naviar-care-1 repo → Settings → Transfer ownership → `andersenbetul-alt`.  
  Transfer sonrası `naviar/` güncellenecek ve Vercel bağlantısı yeniden kurulacak.

## Geliştirme notları

- QBLOGG (kök): `npm run dev` → http://localhost:8000
- Beta Art: `cd beta-art && bun install && bun dev`
- Eve Chat Template: `cd agents/eve-chat-template && pnpm install && pnpm dev`
- Eve Slack Agent: `cd agents/eve-slack-agent && pnpm install && pnpm dev`
