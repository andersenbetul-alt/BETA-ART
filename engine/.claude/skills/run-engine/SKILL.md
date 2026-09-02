---
name: run-engine
description: Curiosity Engine modüllerini çalıştır ve smoke test yap — "engine testi", "billing test", "score hesapla", "visibility denetle", "run engine", "motoru çalıştır", "puanlama testi" istendiğinde bu beceriyi kullan. Smoke script billing/score/visibility modüllerini import eder, üç test dosyasını çalıştırır; çıkış kodu 0/1.
---

# Curiosity Engine'i çalıştırma ve test etme

Engine, QBLOGG'un içerik üretim hattıdır — sinyal toplama, puanlama, görünürlük
denetimi ve makale yazma. Sunucu veya GUI yoktur; modüller Node.js ESM olarak
doğrudan import edilir. Ajan yolu: **engine/.claude/skills/run-engine/smoke.mjs**.

## Önkoşul

Yok. Node.js v22 bu konteynerde hazır. `npm install` ÇALIŞTIRMA.

> ⚠️ SQLite ESM uyarısı normaldir: `ExperimentalWarning: SQLite is an experimental feature`.

## Çalıştır (ajan yolu — smoke test)

```bash
# engine/ dizininden:
node .claude/skills/run-engine/smoke.mjs
```

Başarılıysa `SMOKE: PASS` çıkar (exit 0), hatalıysa `SMOKE: FAIL` (exit 1).

## Test dosyalarını çalıştır

```bash
cd engine/
node billing.test.mjs    # kredi bakiyesi, para biçimi
node score.test.mjs      # konu puanlama kararları
node visibility.test.mjs # 16 görünürlük kapısı
```

## Modül API'si

### billing.mjs

```js
import { openBilling, creditBalance, formatMoney, spendCredits } from './billing.mjs';
const db = openBilling(':memory:');   // veya 'engine.db' yolu
const bal = creditBalance(db, 'hesap-id');  // kuruş cinsinden
const str = formatMoney(49900, 'NOK');      // "499,00 kr"
```

### score.mjs

```js
import { scoreTopic, decide } from './score.mjs';
const result = scoreTopic({ title, growth, searchInterest, commercial, brandFit });
// → { finalScore: 82.9, decision: 'publish', label: '✅ Yayınla', speed: 'rising', wordTarget: 2500 }
```

### visibility.mjs

```js
import { checkVisibility, printReport } from './visibility.mjs';
const gates = checkVisibility(article);   // makale nesnesiyle
printReport(gates);
```

## Dashboard (tarayıcıda görüntüle)

`engine/dashboard.html` — Curiosity Engine canlı paneli. DB bağlantısı olmadan
boş yüklenir (stat kartları ve konu listesi boş görünür); bu normaldir.

```bash
# BETA-ART/ kökünden:
python3 -m http.server 8000 --directory . &
# → http://localhost:8000/engine/dashboard.html
```

Playwright ile ekran görüntüsü:

```bash
node --input-type=module << 'EOF'
import { createRequire } from 'module';
const req = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = req('playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://localhost:8000/engine/dashboard.html', { waitUntil:'networkidle' });
await p.screenshot({ path:'/tmp/engine-dashboard.png' });
await b.close();
EOF
```

> Gerçek veriler: `engine.db` SQLite dosyası aynı dizinde olmalı; dashboard
> `fetch('/api/topics')` çağırmaz, doğrudan DB'ye bakacak `run.mjs` çıktısı gerekir.

## Doğrudan içerik kanalı

```bash
# Konu puanlaması (demo verisiyle):
cd engine/ && node run.mjs

# Makale yazma motoru:
cd engine/ && node write.mjs
```

> Not: `run.mjs` ve `write.mjs` gerçek API anahtarı ve veritabanı bekleyebilir.
> Smoke test API'siz çalışır.

## Gotchas (bu konteynerde yaşandı)

- **`formatMoney(miktar, 'NOK')`** → miktar **kuruş/øre** cinsinden (49900 = 499,00 kr).
  Yanlış: `formatMoney(499, 'NOK')` → `4,99 kr`.
- **`creditBalance(db, hesapId)`** → ilk parametre DB nesnesi, ikincisi hesap ID.
  `openBilling(':memory:')` ile geçici DB, `openBilling('./engine.db')` ile kalıcı.
- **`checkVisibility(article)`** sıfır geçiş dönebilir** — demo article alanları
  eksikse kapılar `undefined` olarak başarısız sayılır; bu bir hata değil, kural.
- **ESM `import()` her seferinde modülü yeniden çalıştırır** — `openBilling` içinde
  SQLite şemasını her import'ta oluşturur; bellek içi DB için sorun değil.
- **`score.test.mjs` gerçek API verisi kullanmaz** — sabit konu başlıklarıyla
  deterministik çalışır; `SMOKE: PASS` piyasa sinyali doğruluğunu garanti etmez.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `db.prepare is not a function` | `openBilling(':memory:')` eksik — `creditBalance(db, id)` şeklinde çağır |
| `scoreTopic is not a function` | Yanlış export; `scoreTopic` kullan, `score` değil |
| `ExperimentalWarning: SQLite` | Normal — baskılamak için `node --no-warnings` ekle |
| Test dosyası FAIL | `cd engine/` içinden çalıştır; cwd yanlışsa modül yolları bozulur |
