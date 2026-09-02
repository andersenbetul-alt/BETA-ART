---
name: run-eve-chat-template
description: Eve Chat Template'i bu konteynerde doğrula — "chat template çalıştır", "next.js ajanını test et", "typecheck", "smoke test" istendiğinde bu beceriyi kullan. Next.js 16 + eve + NeonDB + Upstash tabanlı tam yığın sohbet arayüzü.
---

# Eve Chat Template — doğrulama

Next.js 16 + eve chat arayüzü. `next dev` hem Next.js hem eve ajanını başlatır.
shadcn/ui + Tailwind + Streamdown (markdown akışı) + Better Auth + Drizzle + Neon.

**Yerel çalıştırma mümkün değil**: `pnpm dev` içinde `[eve:dev]` süreci
Vercel AI Gateway'e (`https://ai-gateway.vercel.sh`) bağlanır; bu konteynerden 403.
Vercel'e deploy edilen canlı URL üzerinden çalışır.

## Çalıştır (ajan yolu)

```bash
# eve-chat-template/ klasöründen:
node .claude/skills/run-eve-chat-template/driver.mjs check /tmp/eve-chat-run
```

10 yapı kontrolü + typecheck (Next.js typegen + tsgo). Çıkış kodu 0 = PASS.

## Çalıştır (insan yolu — kimlik bilgisi + Node ≥24 gerekli)

```bash
cd agents/eve-chat-template
pnpm install
vercel link          # projeyi seç
vercel env pull      # AI_GATEWAY_API_KEY, Neon/Upstash url'leri çeker
PATH="/tmp/node-v24.20.0-linux-x64/bin:$PATH" pnpm dev
```

Uygulama `http://localhost:3000`'de açılır. Parola modunda `EVE_CHAT_PASSWORD=...` set edin.

## Deployment modes

| Mod | Tetikleyici | Auth | Kalıcılık |
|---|---|---|---|
| Starter | `EVE_CHAT_PASSWORD` set | Paylaşımlı şifre + cookie | Browser localStorage |
| Production | Neon + Upstash + Vercel Sign-in | Sign in with Vercel | Neon |
| Local | Hiçbiri + `next dev` | Yerel kimlik | Browser localStorage |

## Yapı

```
agent/
  agent.ts          — model: anthropic/claude-sonnet-5
  instructions.md   — botun kimliği
  tools/
    get_weather.ts  — örnek araç (stub: Sunny 72°F)
  skills/
    plan_a_trip.md  — seyahat planı becerisi
  channels/
    eve.ts          — UI kanalı (Next.js içi sohbet)
    slack.ts        — Slack bağlantısı (SLACK_CONNECTOR)
    linear.ts / notion.ts / sentry.ts — bağlayıcılar
app/                — Next.js sayfa/route yapısı
lib/                — auth, db, session yardımcıları
drizzle.config.ts   — NeonDB şema migrasyonu
```

## Denetimler

```bash
pnpm typecheck      # next typegen + tsgo --noEmit (Node 22 ile çalışır)
```

## Gotchas (bu konteynerde yaşandı)

- **`pnpm dev` → Node 22 ile "requires Node.js >=24"** — `[eve:dev]` süreci
  shell'in `node` komutunu kullanır. `PATH=/tmp/node-v24.20.0-linux-x64/bin:$PATH pnpm dev` gerekli.
- **Node 24 ile bile `[eve:dev]` → HTTP 403** — `ai-gateway.vercel.sh` bu proxy'de engelli.
  `vercel link && vercel env pull` sonrası bile gateway erişilemiyor.
- **`pnpm install` esbuild uyarısı** — `Ignored build scripts: esbuild`. Önemli değil:
  esbuild binary'si pnpm store'unda (`node_modules/.pnpm/@esbuild+linux-x64@*`) mevcut.
- **`pnpm typecheck` Node 22 ile çalışır** — `next typegen` + `tsgo` eve gerektirmez.
- **Drizzle migrasyonu Neon bağlantısı ister** — `pnpm db:migrate` `DATABASE_URL` olmadan patlıyor.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `eve requires Node.js >=24` | `PATH=/tmp/node-v24.20.0-linux-x64/bin:$PATH pnpm dev` |
| `AI Gateway model catalog request failed` | Vercel AI Gateway engelli; deploy URL kullanın |
| `Cannot find module 'esbuild'` | `pnpm approve-builds` (interaktif) veya `node node_modules/@esbuild/linux-x64/bin/esbuild --version` |
| DB migration hatası | `vercel env pull` ile `DATABASE_URL` çekin |
