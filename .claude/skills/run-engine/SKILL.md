---
name: run-engine
description: Curiosity Engine'i bu konteynerde çalıştır, test et, boru hattını sür — "engine'i çalıştır", "billing testi", "demo pipeline", "konu tablosunu göster", "engine smoke test" istendiğinde bu beceriyi kullan. Ağ veya API anahtarı gerekmez.
---

# Curiosity Engine — çalıştırma ve test

`engine/` dizini QBLOGG üretim hattıdır: RSS sinyallerini toplar, kümelere ayırır,
puanlar ve yazı kuyruğuna ekler. Ayrı bir ödeme/kredi modülü (`billing.mjs`) ve
16 maddelik görünürlük kuralı denetleyicisi (`visibility.mjs`) içerir.

**Çatı yok, npm yok** — Node 22'nin yerleşik `node:sqlite` modülünü kullanır.

## Ajan yolu — önce bunu kullan

```bash
# Tüm kontroller (billing + pipeline demo):
node .claude/skills/run-engine/driver.mjs smoke

# Yalnızca billing birim testleri:
node .claude/skills/run-engine/driver.mjs billing

# Demo boru hattı (ağ yok, sabit veri):
node .claude/skills/run-engine/driver.mjs pipeline

# Son hesaplanan konu tablosunu yazdır:
node .claude/skills/run-engine/driver.mjs board

# Görünürlük testleri:
node .claude/skills/run-engine/driver.mjs visibility

# Puan testleri:
node .claude/skills/run-engine/driver.mjs score
```

Çıkış kodu 0 = tüm kontroller geçti. Çıktı depo kökünden göreli yollarla çalışır.

## Doğrudan çalıştır (insan yolu)

```bash
# Billing birim testleri:
node engine/billing.test.mjs

# Demo pipeline (ağ/API anahtarı yok, sabit veri):
node engine/run.mjs --demo

# Gerçek RSS kaynaklarından:
node engine/run.mjs --live

# Son tabloyu yazdır:
node engine/run.mjs --board

# Puan ve görünürlük testleri:
node engine/score.test.mjs
node engine/visibility.test.mjs
```

## Beklenen çıktılar

**billing testleri:**
```
ödeme testleri geçti
  kredi bakiyesi: 1930
  499 NOK → 499,00 kr
  3.500 EUR → 3.500,00 €
  kullanım kaydı: article:20, deep_report:50
```

**pipeline demo:**
```
30 sinyal → 16 konu · mod: demo
KONU  SÜTUN  TREND  FIRSAT  PARA  FINAL  KARAR
...
Kuyruğa alınan: 3 · panel verisi: engine/data/board.json
```

## Dosya haritası

```
engine/
  run.mjs          Ana boru hattı: TARA → KÜMELE → ÖZNİTELİK → PUANLA → KARAR → KUYRUK
  billing.mjs      Kredi sistemi: ensureAccount, addCredits, spendCredits, hasEntitlement
  billing.test.mjs Billing birim testleri (ağ yok)
  score.mjs        Konu puanlaması
  score.test.mjs   Puan testleri
  visibility.mjs   16 maddelik görünürlük kuralı
  visibility.test.mjs
  cluster.mjs      Sinyal kümeleme
  features.mjs     Öznitelik çıkarımı
  db.mjs           SQLite yardımcıları
  agents.mjs       Yazı üretim ajanları
  write.mjs        Araştır → yaz → SEO → kalite kapısı
  schema.sql       Sinyal/konu/yazı tabloları
  schema-billing.sql Hesap/kredi/hak tabloları
  demo-data.json   --demo modu sabit sinyalleri
  dashboard.html   Panel: son konu tablosu (tarayıcıda aç)
  data/board.json  Son pipeline çıktısı (--board bu dosyayı okur)
  data/curiosity.db SQLite veritabanı
```

## Gotchas

- **`(node:XXXX) ExperimentalWarning: SQLite`** — Node 22'nin `node:sqlite`
  modülü hâlâ deneysel; bu uyarı normal, hata değil. `--no-warnings` eklenirse
  uyarı gizlenir.
- **`engine/data/`** dizini yoksa `run.mjs` oluşturur; ilk çalıştırmada `board.json`
  boş olur, `--board` "henüz veri yok" yazar.
- **`--live` modu ağ ister** — `*.vercel.app` ve bazı RSS kaynakları bu konteynerde
  engellenebilir; `--demo` mod ağa çıkmaz ve güvenlidir.
- **`write.mjs` API anahtarı ister** — `ANTHROPIC_API_KEY` yoksa hata verir;
  billing + pipeline testleri için anahtar gerekmez.
- **Yolu depo kökünden ver** — sürücü `process.cwd()` değil `import.meta.url`
  üzerinden kök hesaplar; herhangi bir klasörden çalışır.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `Cannot find package 'better-sqlite3'` | Eski import kalıntısı; `node:sqlite` kullanılıyor, npm paketi yok. Node sürümünü kontrol et: `node --version` → v22+ gerekli. |
| `billing.test.mjs: assertion failed` | `engine/data/` altındaki eski test DB'si kirletmiş olabilir; driver geçici `/tmp` DB kullanır, doğrudan `billing.test.mjs` çalıştırınca `/tmp/qb-billing-test.db` üzerine yazar. |
| `--board: henüz veri yok` | Önce `--demo` veya `--live` çalıştırın; `board.json` oluşur. |
