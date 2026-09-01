# Eve Slack Agent

Eve (eve.dev) tabanlı Slack botu. BETA-ART monoreposuna `andersenbetul-alt/eve-slack-agent` reposundan taşındı.

## Vercel projeleri
- **naviar-consult** — Naviar danışmanlık botu (bet-art takımı) · `AGENT_PROFILE=naviar-consult`
- **hxi-music** — HXI müzik prodüksiyon stüdyo botu (bet-art takımı) · `AGENT_PROFILE=hxi-music`

## Geliştirme
```bash
cd agents/eve-slack-agent
pnpm install
vercel link   # ilgili projeyi seç (hxi-music veya naviar-consult)
vercel env pull
AGENT_PROFILE=hxi-music pnpm dev   # ya da naviar-consult
```

## Yapı
- `agent/agent.ts` — model seçimi; `AGENT_PROFILE` env'e göre profil yükler
- `agent/profiles/hxi-music.md` — HXI müzik botunun kimliği ve davranışı
- `agent/profiles/naviar-consult.md` — Naviar danışmanlık botu (taslak)
- `agent/instructions.md` — profil belirlenmemişse kullanılan yedek
- `agent/tools/` — araçlar (get_weather)
- `agent/skills/` — beceriler (proje-on-degerlendirme, teknik-format)

## HXI için ek belgeler
- İş belgesi: `docs/hxi/BUSINESS.md`
- Marka taslağı: `docs/hxi/brand-brief.md`

## Vercel'de AGENT_PROFILE kurulumu
Vercel Dashboard → proje → Settings → Environment Variables:
- `AGENT_PROFILE` = `hxi-music` (hxi-music projesi için)
- `AGENT_PROFILE` = `naviar-consult` (naviar-consult projesi için)
