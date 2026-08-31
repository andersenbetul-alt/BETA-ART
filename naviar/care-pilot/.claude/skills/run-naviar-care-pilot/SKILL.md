---
name: run-naviar-care-pilot
description: NAVIAR Care Pilot sitesini bu konteynerde çalıştır, sür ve ekran görüntüsü al — "pilot siteyi çalıştır", "run", "smoke test", "screenshot/ekran görüntüsü", "sayfayı göreyim", "tarayıcıda doğrula" istendiğinde bu beceriyi kullan. Sunucu başlatma + Playwright sürüşü tek komutta.
---

# NAVIAR Care Pilot'u çalıştırma ve sürme

Tek sayfalık Norveç hizmeti MVP (`naviar/care-pilot/index.html`) — sıfır bağımlılık,
sıfır derleme adımı. Tüm komutlar **depo kökünden** çalıştırılır.
Ajan yolu: bu klasördeki **driver.mjs** — sunucuyu kendi açar (8002), gerçek
Chromium ile sürer, kapatır.

## Önkoşul

Yok. `python3`, `node` ve Playwright (küresel, `/opt/node22/lib/node_modules`)
+ Chromium (`/opt/pw-browsers/chromium`) bu konteynerde hazır.
`apt`/`npm install` ÇALIŞTIRMA.

## Çalıştır (ajan yolu — önce bunu kullan)

```bash
# 7 kritik noktanın smoke testi + ana sayfa görüntüsü (çıkış kodu 0/1):
node naviar/care-pilot/.claude/skills/run-naviar-care-pilot/driver.mjs smoke /tmp/naviar-care-pilot-run

# Ana sayfanın tam ekran görüntüsü:
node naviar/care-pilot/.claude/skills/run-naviar-care-pilot/driver.mjs shot /tmp/naviar-care-pilot-run
```

Görüntüler verilen dizine `.png` düşer. Sunucu 8002'de zaten çalışıyorsa driver
yeniden başlatmaz — `pkill -f 'http.server 8002'` ile temizle.

## Çalıştır (insan yolu)

```bash
python3 -m http.server 8002 --directory naviar/care-pilot
# → http://localhost:8002 (Ctrl-C ile kapat)
```

## Smoke kontrolleri

| Kontrol | Beklenen |
|---|---|
| `<title>` | `NAVIAR Care` (tam eşleşme) |
| `nav.site a` | 3 bağlantı |
| `.who-card` | 3 kart |
| `table.services tbody tr` | 3 satır |
| `.area-badge` | 4 bölge rozeti |
| `#requestForm` | 1 form |
| Sayfa/konsol hatası | 0 |

## Gotchas (bu konteynerde yaşandı)

- **Port 8002**: 8000 = QBLOGG, 8001 = NaviarCare ana site, 8002 = bu pilot.
  Üçü aynı anda çalışabilir; çakışma olmaz.
- **`--directory` flag zorunlu**: `--directory naviar/care-pilot` olmadan sunucu
  depo kökünü servis eder ve `index.html` 404 verir.
- **Playwright depo kökünden import EDİLEMEZ** (`ERR_MODULE_NOT_FOUND`).
  Driver `createRequire('/opt/node22/lib/node_modules/')` ile çözer.
- **Egress proxy `*.vercel.app` engeller** — canlı site (`naerhjelp-pilot-v2.vercel.app`)
  bu konteynerde açılamaz; canlı doğrulama `web_fetch_vercel_url` MCP aracıyla yapılır.
- **`mailto:pilot@naviarcare.example`** — form submit gerçek e-posta açmaz (RFC 2606
  `.example` alan adı); bu kasıtlı YER TUTUCUDUR, değiştirme.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `sunucu 5 sn içinde açılmadı` | `pkill -f 'http.server 8002'` → tekrar çalıştır |
| CSS yok / beyaz sayfa | `--directory naviar/care-pilot` eksik; mutlak yol dene |
| `ERR_MODULE_NOT_FOUND: playwright` | `createRequire` deseni (yukarıda) |
| SendUserFile 400 | Görüntü >8000px — `deviceScaleFactor`ı 0.5'e düşür |
