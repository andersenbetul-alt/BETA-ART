---
name: run-naviar
description: NAVIAR brand contact sheet'ini çalıştır, sür ve ekran görüntüsü al — "naviar logoları göreyim", "logo çalışmalarını göster", "naviar brand screenshot", "study ekranını aç", "run naviar" istendiğinde bu beceriyi kullan. Sürücü sunucuyu kendi açar, Chromium ile sürer, kapatır.
---

# NAVIAR brand contact sheet'ini çalıştırma

Saf statik HTML/SVG (`brand/naviar/index.html`) — derleme YOK.
Ajan yolu: bu klasördeki **driver.mjs** — kendi portunu (8091) açar, Chromium ile
sürer, kapatır. Yollar **brand/naviar/** kökünden verilir ama sürücü depo kökünden çalıştırılır.

## Önkoşul

Yok. `node`, `python3`, Playwright (`/opt/node22/lib/node_modules`) ve Chromium
(`/opt/pw-browsers/chromium`) bu konteynerde hazır. `apt`/`npm install` ÇALIŞTIRMA.

## Çalıştır (ajan yolu — önce bunu kullan)

```bash
# Hızlı smoke test — başlık + içerik + ekran görüntüsü (çıkış kodu 0/1):
node brand/naviar/.claude/skills/run-naviar/driver.mjs smoke /tmp/naviar-run

# Viewport ekran görüntüsü (1280×900):
node brand/naviar/.claude/skills/run-naviar/driver.mjs shot /tmp/naviar-run

# Tam sayfa görüntüsü:
node brand/naviar/.claude/skills/run-naviar/driver.mjs full /tmp/naviar-run

# Her study SVG'sini ayrı ayrı görüntüle (S1–S10):
node brand/naviar/.claude/skills/run-naviar/driver.mjs studies /tmp/naviar-run
```

Komutlar depo kökünden (`BETA-ART/`) çalıştırılır. Görüntüler verilen dizine `.png` düşer.
Smoke testi sonunda `SMOKE: PASS` / `SMOKE: FAIL` yazar; başarılı çıkış kodu 0, hatalı 1.

## Çalıştır (insan yolu)

```bash
cd brand/naviar && python3 -m http.server 8000
# → http://localhost:8000/index.html  (Ctrl-C ile kapat)
```

## İçerik

| Dizin | Açıklama |
|---|---|
| `brand/naviar/index.html` | Ana contact sheet — tüm study'ler burada |
| `brand/naviar/studies/` | S1–S10 SVG çalışmaları (`study-s1-*.svg` … `study-s10-*.svg`) |
| `brand/naviar/master/` | Master N geometrisi |
| `brand/naviar/descriptors/` | Marka tanımlayıcı belgeler |

## Gotchas (bu konteynerde yaşandı)

- **Sürücü depo kökünden çalıştırılmalı** (`BETA-ART/`): yol `brand/naviar/.claude/skills/run-naviar/driver.mjs`. Farklı dizinden çalıştırılırsa `SERVE_ROOT` bozulur — sürücü `__dir` ile kendini hesaplar ama `process.cwd()` değişkeni değil.
- **Port 8091** kullanılır (8000 ve 8001 çakışmaması için). Eski süreç kaldıysa: `pkill -f 8091` sonra tekrar.
- **Playwright depo kökünden import EDİLEMEZ** — `createRequire('/opt/node22/lib/node_modules/')` ile çözülür (run-qblogg sürücüsüyle aynı desen).
- **study'ler PENDING** — tüm SVG'ler geçici etiket taşır; `FINAL` veya `TESCİLE HAZIR` yoktur. Logo clearance süreci: `docs/naviar/LOGO-SKILLS-CLEARANCE-STACK-v1.0.md`.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `net::ERR_HTTP_RESPONSE_CODE_FAILURE` | `SERVE_ROOT` yanlış — sürücüyü depo kökünden çalıştır |
| `server timeout` | 8091 portunu tutan eski süreç: `pkill -f 8091` |
| `ERR_MODULE_NOT_FOUND: playwright` | `createRequire('/opt/node22/lib/node_modules/')` deseni (driver'da mevcut) |
| Boş ekran görüntüsü | SVG'ler yüklenemedi — `studies/` dizini mevcut mu kontrol et |
