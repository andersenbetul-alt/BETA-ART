# Eve Slack Agent

Eve (eve.dev) tabanlı Slack botu. BETA-ART monoreposuna `andersenbetul-alt/eve-slack-agent` reposundan taşındı.

## Vercel projeleri
- **naviar-consult** — Naviar danışmanlık botu (bet-art takımı)
- **hxi-music** — HXI müzik botu (bet-art takımı)

## Geliştirme
```bash
cd agents/eve-slack-agent
pnpm install
vercel link   # ilgili projeyi seç
vercel env pull
pnpm dev
```

## Yapı
- `agent/agent.ts` — model seçimi ve yapılandırma
- `agent/instructions.md` — botun kimliği ve davranışı
- `agent/tools/` — araçlar (get_weather, slack)
- `agent/skills/` — beceriler
