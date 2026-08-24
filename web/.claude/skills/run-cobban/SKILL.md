---
name: run-cobban
description: Use to run, start, launch, build, screenshot, smoke-test or visually verify the COBBAN web app (Next.js, web/). Drives the running app headlessly with a Playwright driver — screenshots every screen in light and dark, checks the generated icon/OG image routes, and runs the 1758-check smoke suite. Trigger on "run the app", "start the server", "screenshot COBBAN", "does the page work", or before claiming any UI change works.
---

# COBBAN'ı çalıştır

Next.js 16 + Turbopack, telefon-öncelikli tek sütun. Sürücü
`.claude/skills/run-cobban/driver.mjs` — sunucuyu açar, gezer, ekran
görüntüsü alır, sonra sunucuyu kapatır.

**Bütün yollar `web/` dizinine göredir.** (`node .../observe.mjs` gibi depo
kökünden çalışan araçlar ayrı — aşağıda.)

## Hazırlık

Ek sistem paketi gerekmiyor. Playwright ve Chromium hazır kurulu; sürücü
tarayıcı yolunu kendi ayarlıyor, ortamdan beklemiyor.

**Node 22 şart.** Bu kutuda iki sürüm var ve `PATH`'te önce yanlış olan
geliyor:

```bash
command -v node     # /usr/local/bin/node -> Node 20  ← testleri kiriyor
/opt/node22/bin/node --version   # v22.22.2  ← gereken bu
```

`npm test` betiği `--experimental-strip-types` kullanıyor; Node 20 bunu
`node: bad option` diye reddediyor. `/opt/node22/bin` `PATH`'in başında olsun.

```bash
npm ci          # 33 paket, ~21 sn
npm run build   # ~11 sn
```

`npm run build` şart: sürücü `next start` kullanıyor, `.next` yoksa açılmaz.

## Çalıştır (ajan yolu)

```bash
node .claude/skills/run-cobban/driver.mjs all
```

Alt komutlar:

| komut | ne yapar |
|---|---|
| `shots` | 7 ekran × 2 tema = 14 görüntü → `/tmp/cobban-shots` |
| `assets` | `/icon`, `/apple-icon`, `/opengraph-image`, `/twitter-image`, `/favicon.ico` |
| `smoke` | 1758 kontrol, 49 bağlantı |
| `skeleton` | yükleniyor iskeleti + `.skeleton` renk jetonu |
| `all` | shots + assets + smoke |

Ortam: `COBBAN_PORT` (varsayılan 3111), `COBBAN_SHOTS` (varsayılan
`/tmp/cobban-shots`).

Sürücü her seferinde önce eski sunucuyu öldürür, sonunda da kapatır.

**Görüntüyü gerçekten aç.** Ölçüm "200 döndü" der, ama sayfa boş da olabilir.

## Çalıştır (insan yolu)

```bash
npx next start -p 3111    # sonra tarayicidan ac
```

Başlıksız ortamda tek başına işe yaramaz — göreceğin bir pencere yok.

## Test

```bash
npm run typecheck   # tsc --noEmit
npm test            # 49 test
npm run smoke -- http://localhost:3111   # sunucu AYAKTAYKEN
```

## Tuzaklar

- **`pkill -f "next start"` kabuğu öldürür.** Desen kendi komut satırını da
  eşleştiriyor; kabuk `exit 144` ile ölüyor. Köşeli parantez şart:
  `pkill -f "next[-]server"`. Sürücü bunu doğru yapıyor.
- **Ayakta kalmış eski sunucu sessizce eski derlemeyi servis eder.** Hiçbir
  şey yanlış görünmez; saatlerce kovaladım. Başlatmadan önce daima öldür.
- **Yükleniyor iskeleti demo modda hiç render olmaz.** Demo veri senkron
  dönüyor, Suspense hiç askıya alınmıyor. Görmek için `COBBAN_LIVE_DATA=true`
  (`skeleton` komutu bunu kendi ayarlıyor).
- **Canlı iskeleti yakalamak kararsız.** Kabuk→içerik değişimi sunucudan
  akıyor ve bazen Playwright bağlanmadan bitiyor. Fotoğraflamaya çalışma;
  `skeleton` komutu jeton rengini enjekte edilmiş elemanla deterministik
  ölçüyor. Üç koşudan biri yakalayamıyor, bu bir hata değil.
- **`COBBAN_LIVE_DATA=true` yine demo veri gösterir.** `api.entur.io` ve
  `api.met.no` bu konteynerde engelli (bkz. `network-reality` skill'i), istek
  hızlı başarısız olup demo'ya düşüyor ve sarı "Demo data" şeridi çıkıyor.
  Canlı veriyi buradan doğrulayamazsın.
- **Demo modda yağmur ekranı her zaman "Go indoors" der.** Hava gerçekten
  ne olursa olsun; `liveData` false iken `indoors` varsayılan true kalıyor.
  Ekran görüntüsüne bakıp "hava mantığı bozuk" sanma.
- **Sayfa seviyesinde `loading.tsx` 404'leri bozar.** Suspense sınırı HTTP
  durumunu `notFound()` çalışmadan önce yazıyor, bilinmeyen sorun türü 200
  dönüyordu. İskelet bu yüzden yalnızca async dalı saran `<Suspense>`
  içinde. Tekrar `loading.tsx` ekleme.
- **Görseller ikili dosya değil.** `icon.tsx` / `opengraph-image.tsx`
  derleme anında üretiyor. `/favicon.ico` **404** — açık bulgu,
  `docs/findings.md`.
- **Dizin ayrımı.** `npm` komutları `web/` içinden; `task-observer` ve
  `network-reality` **depo kökünden** çalışır.

## Sorun giderme

| belirti | sebep / çözüm |
|---|---|
| `MODULE_NOT_FOUND` — `.claude/skills/.../observe.mjs` | Depo kökünden çalıştır, `web/` içinden değil. |
| `sunucu 3111 portunda acilmadi` | `.next` yok → `npm run build`. |
| smoke `TypeError: fetch failed` | Sunucu daha açılmamış. Sürücü bekliyor; elle çalıştırıyorsan önce `curl localhost:3111` ile doğrula. |
| `.skeleton` beklerken TimeoutError | Beklenen kararsızlık. Sürücü bunu yakalayıp devam ediyor. |
| `node: bad option: --experimental-strip-types` | Node 20 çalışıyor. `PATH=/opt/node22/bin:$PATH`. |
| Chromium açılmıyor / tarayıcı bulunamıyor | Temiz kabukta `PLAYWRIGHT_BROWSERS_PATH` yok. Sürücü kendi ayarlıyor; elle Playwright kullanıyorsan `/opt/pw-browsers` ver ve `--no-sandbox` ekle (kök kullanıcı). |
