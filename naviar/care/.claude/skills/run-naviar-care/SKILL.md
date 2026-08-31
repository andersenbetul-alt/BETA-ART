---
name: run-naviar-care
description: NaviarCare sitesini bu konteynerde çalıştır, sür ve ekran görüntüsü al — "siteyi çalıştır", "run", "smoke test", "screenshot/ekran görüntüsü", "sayfayı göreyim", "tarayıcıda doğrula" istendiğinde bu beceriyi kullan. Sunucu başlatma + Playwright sürüşü tek komutta.
---

# NaviarCare'i çalıştırma ve sürme

Saf statik site (derleme YOK, bağımlılık YOK) — `naviar/care/` dizininin
altındaki 10 HTML/CSS/JS dosyası.
Ajan yolu: bu klasördeki **driver.mjs** — sunucuyu kendi açar (8001),
gerçek Chromium ile sürer, kapatır. Yollar depo kökünden.

## Önkoşul

Yok. `python3`, `node` ve Playwright (küresel, `/opt/node22/lib/node_modules`)
+ Chromium (`/opt/pw-browsers/chromium`) bu konteynerde hazır.
`apt`/`npm install` ÇALIŞTIRMA.

## Çalıştır (ajan yolu — önce bunu kullan)

```bash
# 7 kritik akışlı smoke test + ana sayfa görüntüsü (çıkış kodu 0/1):
node naviar/care/.claude/skills/run-naviar-care/driver.mjs smoke /tmp/naviar-care-run

# Tek sayfanın tam ekran görüntüsü:
node naviar/care/.claude/skills/run-naviar-care/driver.mjs shot triage.html /tmp/naviar-care-run
node naviar/care/.claude/skills/run-naviar-care/driver.mjs shot booking.html /tmp/naviar-care-run
node naviar/care/.claude/skills/run-naviar-care/driver.mjs shot "languages.html" /tmp/naviar-care-run
```

Görüntüler verilen dizine `.png` düşer. Sunucu 8001'de çalışıyorsa driver yeniden
başlatmaz — `pkill -f 'http.server 8001'` ile temizle.

## Çalıştır (insan yolu)

```bash
python3 -m http.server 8001 --directory naviar/care
# → http://localhost:8001 (Ctrl-C ile kapat)
```

## Sayfalar

| Dosya | İçerik |
|---|---|
| `index.html` | Ana sayfa — hero, nasıl çalışır, uzmanlıklar |
| `triage.html` | 4 adımlı semptom kontrolü |
| `booking.html` | Doktor arama + 6 örnek kart |
| `languages.html` | 113 dil tablosu + filtre |
| `about.html` | Misyon, SSS, iletişim |
| `join.html` | Doktor kayıt formu |
| `legal.html` | Hukuki bilgi |
| `feedback.html` | Geri bildirim formu |
| `style.css` | Paylaşılan stiller — tüm değişkenler `:root`'ta |
| `app.js` | Paylaşılan JS — dil seçimi, nav, form |

## Gotchas (hepsi bu konteynerde yaşandı)

- **Port çakışması**: QBLOGG `npm run dev` 8000'i kullanır; NaviarCare sürücüsü
  8001 kullanır. İkisi aynı anda çalışabilir.
- **Playwright depo kökünden import EDİLEMEZ** (`ERR_MODULE_NOT_FOUND`).
  Driver `createRequire('/opt/node22/lib/node_modules/')` ile çözer — bu
  deseni koru.
- **`--directory` flag gerekli**: `cwd` değiştirmek yerine `python3 -m
  http.server 8001 --directory naviar/care` kullan; aksi hâlde repo kökü
  servis edilir ve CSS/JS 404 verir.
- **Egress proxy `*.vercel.app` engeller** — canlı site bu konteynerde
  açılamaz; canlı doğrulama `web_fetch_vercel_url` MCP aracıyla yapılır.
- **Dağıtım = `naviar/vercel-care.json` tarifi**: yerel değişiklik canlıya
  "dal'a push + `deploy_to_vercel`" ile gider. Dağıtım token limiti nedeniyle
  dosyalar doğrudan değil, build sırasında git clone ile kopyalanır.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `sunucu 5 sn içinde açılmadı` | `pkill -f 'http.server 8001'` → tekrar çalıştır |
| CSS/JS 404 | `--directory naviar/care` eksik; mutlak yol kullan |
| `ERR_MODULE_NOT_FOUND: playwright` | `createRequire` deseni (yukarıda); scratchpad'e taşımak da çalışır |
| SendUserFile 400 | Görüntü >8000px — `deviceScaleFactor`ı 0.5'e düşür |
