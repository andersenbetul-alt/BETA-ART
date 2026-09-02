---
name: run-eve-slack-agent
description: Eve Slack ajanını bu konteynerde doğrula ve deploy edilmiş URL'ye istek gönder — "eve-slack çalıştır", "slack ajanını test et", "ajan smoke test", "invoke et", "typecheck" istendiğinde bu beceriyi kullan.
---

# Eve Slack Agent — doğrulama ve invoke

Eve (eve.dev) tabanlı Slack botu. `agent/` klasörünün içinde TypeScript araçlar,
beceriler ve kanal yapılandırması bulunur; `eve build` ile derlenir, Vercel'e
deploy edilir.

**Yerel çalıştırma mümkün değil**: `eve build/dev` Vercel AI Gateway'e
(`https://ai-gateway.vercel.sh`) erişim gerektirir; bu konteynerden proxy HTTP 403
döndürür. Bu nedenle yapı doğrulaması + typecheck için driver, gerçek çalıştırma
için `eve invoke --url <deploy-url>` kullanın.

## Vercel projeleri
- **naviar-consult** → `naviar-consult.vercel.app`
- **hxi-music** → `hxi-music.vercel.app`

## Önkoşul

Node 24 sadece `invoke` modunda gereklidir (konteyner v22 ile gelir; build/invoke Node ≥24 ister).

```bash
# Node 24 indirmek için (yoksa):
curl -fsSL https://nodejs.org/dist/v24.20.0/node-v24.20.0-linux-x64.tar.xz -o /tmp/node24.tar.xz
tar -xf /tmp/node24.tar.xz -C /tmp
```

## Çalıştır (ajan yolu)

```bash
# eve-slack-agent/ klasöründen:

# Yapı doğrulaması + typecheck (çıkış kodu 0 = PASS):
node .claude/skills/run-eve-slack-agent/driver.mjs check /tmp/eve-slack-run

# Deploy edilmiş endpoint'e prompt gönder:
node .claude/skills/run-eve-slack-agent/driver.mjs invoke https://naviar-consult.vercel.app "Hava durumu nasıl?" /tmp/eve-slack-run
```

`check` komutu şunları doğrular: agent/, tools/, skills/, channels/ dosyaları mevcut + `pnpm typecheck` geçiyor.

## Çalıştır (insan yolu — kimlik bilgisi gerekli)

```bash
cd agents/eve-slack-agent
pnpm install
vercel link          # ilgili projeyi seç (naviar-consult veya hxi-music)
vercel env pull      # AI_GATEWAY_API_KEY ve SLACK_CONNECTOR'ı .env.local'a çeker
pnpm dev             # Node ≥24 gerekli; /tmp/node-v24.20.0-linux-x64/bin/node gerekebilir
```

## Denetimler

```bash
pnpm typecheck   # TypeScript derleme hatası yok
```

## Yapı

```
agent/
  agent.ts          — model: anthropic/claude-sonnet-5
  instructions.md   — botun kimliği ("You are a concise assistant...")
  tools/
    get_weather.ts  — örnek araç: hava durumu (stub, her zaman Sunny 72°F döner)
  skills/
    plan_a_trip.md  — seyahat planı becerisi (get_weather çağrısını tetikler)
  channels/
    slack.ts        — SLACK_CONNECTOR env ile Slack bağlantısı
```

## Gotchas (bu konteynerde yaşandı)

- **`eve` komutu `node --version` v22 ile çalışmaz** — `eve requires Node.js >=24`.
  `.bin/eve` bir shell wrapper; Node 24 ile doğrudan `node_modules/eve/bin/eve.js` çağrılmalı:
  `NODE24=/tmp/node-v24.20.0-linux-x64/bin/node && $NODE24 node_modules/eve/bin/eve.js --help`
- **`eve build` Vercel AI Gateway'e bağlanamaz** — `https://ai-gateway.vercel.sh` proxy'de 403.
  URL sabit kodlu, env override yok. `AI_GATEWAY_API_KEY=dummy` denendi, yine 403.
  Bu konteynerde yerel çalıştırma mümkün değil.
- **`pnpm typecheck` ise node v22 ile çalışır** — TypeScript `tsc` çalıştırır, eve çağırmaz.
- **`pnpm install` pnpm gerektiriyor** — `npm install` yerine `pnpm install` kullanın.
  `node_modules/` konteynerde hazır, yeniden kurmaya gerek yok.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `eve requires Node.js >=24` | `node_modules/eve/bin/eve.js`'i doğrudan Node 24 ile çalıştırın |
| `AI Gateway model catalog request failed with HTTP 403` | Yerel çalıştırma imkânsız; `vercel link && vercel env pull` + Node 24 gerekli |
| `invoke` bağlanamıyor | `naviar-consult.vercel.app` bu proxy'den engelli olabilir — VPN veya yerel makineden deneyin |
| `pnpm: command not found` | `npm i -g pnpm` veya `corepack enable && corepack prepare pnpm@latest --activate` |
