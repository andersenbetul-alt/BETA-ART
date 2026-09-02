---
name: run-beta-art
description: Beta Art uygulamasını bu konteynerde çalıştır, sür ve ekran görüntüsü al — "beta-art çalıştır", "run", "smoke test", "screenshot", "sayfayı göreyim", "tarayıcıda doğrula" istendiğinde bu beceriyi kullan. Dev sunucu başlatma + Playwright sürüşü tek komutta.
---

# Beta Art'ı çalıştırma ve sürme

React 19 + TanStack Start (SSR) + Supabase + Tailwind v4 fotoğraf arşivi uygulaması.
Ajan yolu: bu klasördeki **driver.mjs** — sunucuyu kendi açar, eksik supabase
paketini kurar, Chromium ile sürer, kapatır. Yollar `beta-art/` kökünden.

## Önkoşul

Yok — python3, node, bun, Playwright (küresel `/opt/node22/lib/node_modules`) +
Chromium (`/opt/pw-browsers/chromium`) bu konteynerde hazır. `apt`/`npm install`
ÇALIŞTIRMA (driver kendisi yapar).

## Çalıştır (ajan yolu — önce bunu kullan)

```bash
# beta-art/ klasöründen:
node .claude/skills/run-beta-art/driver.mjs smoke /tmp/beta-art-run
```

4 kontrol: başlık, h1, navigasyon (≥4 bağlantı), konsol hatası yok.
Görüntüler `<çıktı-dizini>/smoke-anasayfa.png` olarak düşer.

Tam sayfa görüntü için:

```bash
node .claude/skills/run-beta-art/driver.mjs shot /tmp/beta-art-run
```

## Çalıştır (insan yolu)

```bash
# beta-art/ içinde:
bun install          # Lovable sandbox dışında kısmi başarılı — aşağıdaki notlara bak
bun run dev          # vite.config.ts @lovable.dev/vite-tanstack-config ister; yoksa patlıyor
```

Doğrudan `bun run dev` bu konteynerde çalışmaz — bunun yerine driver.mjs kullanın.

## Denetimler

```bash
bun run lint         # eslint
bun run format       # prettier
```

## Gotchas (bu konteynerde yaşandı)

- **`@lovable.dev/vite-tanstack-config` → 403.** Lovable'ın private registry'si
  (`europe-west4-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache`) bu konteynerde
  engelli. `bun install` kısmen tamamlanıyor. Çözüm: `vite.config.local.ts`
  (standart eklentiler: `@vitejs/plugin-react`, `@tailwindcss/vite`,
  `vite-tsconfig-paths`, `@tanstack/react-start/plugin/vite`). Bun bu dosyayı
  asla değiştirmeyin.
- **`@supabase/supabase-js` → eksik.** Aynı registry sorunu; bun install sırasında
  `@supabase/storage-js` ve `@supabase/phoenix` 403 alır, tüm `@supabase/*` grubu
  kurulmaz. Driver bunu algılar ve `npm install --legacy-peer-deps
  @supabase/supabase-js@2.112.3` ile public registry'den kurar.
- **`bun run dev` çalışmaz** — `vite.config.ts`, Lovable paketini import eder.
  Driver `--config vite.config.local.ts` ile çalıştırır, port 8100.
- **Port 8100.** Driver standart 8000'i kullanmaz (run-qblogg'la çakışmasın).
- **Playwright depo kökünden import edilemez** — `createRequire('/opt/node22/...')`
  deseni (run-qblogg ile aynı).
- **TanStack Start SSR** — sayfa `bun run vite dev --config local` ile istemci
  taraflı ve SSR modunda birlikte çalışır. Supabase yokken SSR rotası 500 döner;
  driver önce supabase'i kurar.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `sunucu 20 saniyede açılmadı` | 8100'ü tutan eski süreç: `kill $(lsof -ti:8100)` |
| `Cannot find module '@supabase/supabase-js'` | Driver bunu otomatik kurar; elle: `npm install --legacy-peer-deps @supabase/supabase-js@2.112.3` |
| `UNRESOLVED_IMPORT @lovable.dev/vite-tanstack-config` | `vite.config.ts` değil `vite.config.local.ts` kullanılıyor mu? Driver zaten doğruyu seçiyor. |
| SendUserFile 400 | Görüntü >8000px — `deviceScaleFactor` düşür |
