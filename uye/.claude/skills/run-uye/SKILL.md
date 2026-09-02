---
name: run-uye
description: QBLOGG Üye (Q Brief Pro) sub-app'ini çalıştır ve ekran görüntüsü al — "üye uygulamasını çalıştır", "üye sayfası screenshot", "run uye", "Q Brief Pro aç", "üye paneli göreyim" istendiğinde bu beceriyi kullan. Supabase olmadan kurulum ekranı gösterir; bu beklenen davranıştır.
---

# QBLOGG Üye sub-app'ini çalıştırma

`uye/index.html` — QBLOGG'un üyelere özel Q Brief Pro paneli. Supabase auth
gerektirir; yapılandırma olmadan "Kurulum bekleniyor" ekranı gösterir. Bu durum
beklenen ve geçerlidir — smoke test sadece sayfa yüklenip başlık doğrulanır.

Ajan yolu: **`uye/.claude/skills/run-uye/driver.mjs`** — kendi sunucusunu (8094)
açar, Chromium ile sürer, kapatır. Yollar **BETA-ART/** kökünden verilir.

## Önkoşul

Yok. `node`, Playwright (`/opt/node22/lib/node_modules`) ve Chromium
(`/opt/pw-browsers/chromium`) hazır. `npm install` ÇALIŞTIRMA.

## Çalıştır (ajan yolu — önce bunu kullan)

```bash
# Smoke test — başlık + içerik doğrula + ekran görüntüsü (çıkış kodu 0/1):
node uye/.claude/skills/run-uye/driver.mjs smoke /tmp/uye-run

# Viewport ekran görüntüsü:
node uye/.claude/skills/run-uye/driver.mjs shot /tmp/uye-run
```

Komutlar BETA-ART/ kökünden çalıştırılır. `SMOKE: PASS` / `SMOKE: FAIL` yazılır.

## Çalıştır (insan yolu)

```bash
cd BETA-ART/ && python3 -m http.server 8094
# → http://localhost:8094/uye/   (Ctrl-C)
```

## Supabase olmadan kullanım (geliştirme)

`uye/config.js` içindeki `supabaseUrl` ve `supabaseAnonKey` değerleri boşsa
uygulama kurulum ekranı gösterir. Canlı veritabanı olmadan UI geliştirmek için:
1. Gerçek Supabase credentials'ı girin (`uye/config.js`)
2. `uye/schema.sql` ile veritabanını hazırlayın
3. Smoke test yeniden çalıştırılınca giriş formu / panel görünür

## Gotchas (bu konteynerde yaşandı)

- **`/uye/` isteği EISDIR hatası** — dizin isteği `index.html`'e yönlendirilmeli; sürücü bunu `statSync` ile çözer.
- **`await import('fs')` içinde SyntaxError** — ESM top-level await içinde `import()` Promise döndürür; `statSync`'yi dosya başında statik import et.
- **Supabase bağlantı hataları konsolda görünür** — "Kurulum bekleniyor" ekranıyla birlikte normaldir; smoke test bu hataları bastırır (`e.message.includes('supabase')`).
- **Port 8094** — 8000/8001/8091/8092/8093 ile çakışmaz. Eski süreç varsa: `pkill -f 8094`.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `EISDIR: illegal operation on a directory` | Sürücüyü BETA-ART/ kökünden çalıştır, `uye/` içinden değil |
| `server timeout` | Port 8094 meşgul: `pkill -f 8094` |
| Sayfa beyaz/boş | `uye/index.html` açık; devTools console'u kontrol et |
| `SMOKE: FAIL — başlık yok` | Sayfa yüklenemedi; sunucu log'unu kontrol et (`/tmp/uye-run/`) |
