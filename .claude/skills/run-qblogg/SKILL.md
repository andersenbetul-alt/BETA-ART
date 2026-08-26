---
name: run-qblogg
description: QBLOGG sitesini bu konteynerde çalıştır, sür ve ekran görüntüsü al — "siteyi çalıştır", "run", "smoke test", "screenshot/ekran görüntüsü", "sayfayı göreyim", "tarayıcıda doğrula" istendiğinde bu beceriyi kullan. Sunucu başlatma + Playwright sürüşü tek komutta.
---

# QBLOGG'u çalıştırma ve sürme

Saf statik site (derleme YOK, bağımlılık YOK) + `uye/` alt uygulaması.
Ajan yolu: bu klasördeki **driver.mjs** — sunucuyu kendi açar, gerçek
Chromium ile sürer, kapatır. Yollar depo kökünden.

## Önkoşul

Yok. python3, node ve Playwright (küresel, `/opt/node22/lib/node_modules`)
+ Chromium (`/opt/pw-browsers/chromium`) bu konteynerde hazır. `apt`/`npm
install` ÇALIŞTIRMA.

## Çalıştır (ajan yolu — önce bunu kullan)

```bash
# 5 kritik akışlı smoke test + ana sayfa görüntüsü (çıkış kodu 0/1):
node .claude/skills/run-qblogg/driver.mjs smoke /tmp/qblogg-run

# Tek sayfanın tam ekran görüntüsü (reveal animasyonu sabitlenmiş):
node .claude/skills/run-qblogg/driver.mjs shot "post.html?slug=ai-icerik-studyosu" /tmp/qblogg-run
```

Görüntüler verilen dizine `.png` düşer. 8000'i çok aşan sayfa
yüksekliğinde SendUserFile reddeder — sürücü 0.75 ölçek kullanır; yine
aşarsa driver'daki `deviceScaleFactor`ı düşür.

## Çalıştır (insan yolu)

```bash
npm run dev        # python3 -m http.server 8000; Ctrl-C ile kapat
```

## Denetimler (commit öncesi zorunlu ikili + diğerleri)

```bash
npm run check      # 10 dil × anahtar bütünlüğü, sitemap, bağlantılar
npm run guvenlik   # XSS/CSP/veri koruma taraması
npm run gorunurluk # yayınlanmış yazıların görünürlük denetimi
npm run onizleme   # 8 sayfayı tek tıklanabilir HTML'e gömer (paylaşım için)
```

## Gotchas (hepsi bu konteynerde yaşandı)

- **Playwright depo kökünden import EDİLEMEZ** (`ERR_MODULE_NOT_FOUND`;
  ESM, NODE_PATH'i de yok sayar). driver.mjs bunu
  `createRequire('/opt/node22/lib/node_modules/')` ile çözer — kendi
  betiğini yazacaksan aynı deseni kopyala.
- **Egress proxy `*.vercel.app` ve `esm.sh`'i engeller** — canlı site bu
  konteynerden curl/tarayıcıyla açılamaz; canlı doğrulama Vercel MCP
  araçlarıyla (`web_fetch_vercel_url`) yapılır. CDN gerekirse paket
  vendor'lanır (örnek: `uye/lib/`).
- **Reveal animasyonu** ekran görüntüsünde fold-altı kartları boş
  gösterir; sürücü `.reveal{opacity:1!important}` enjekte eder.
- **Dil otomatik seçilir** — Playwright'ın varsayılan locale'i en olduğu
  için sayfa İngilizce açılır; Türkçe görmek için `?lang=tr` ekle.
- **Dağıtım = siteyi güncellemek değil**: canlı site `main`'i klonlayan
  vercel.json tarifiyle yayınlanır. Yerel değişiklik canlıya "main'e push
  + dağıtımı yeniden tetikleme" ile gider (CLAUDE.md "Bilinen sınırlar").
  Dağıtım öncesi: çalışma ağacı temiz + dal push'lu olmalı
  (qblogg-operasyon becerisi, madde 3).
- **LibreOffice/pandoc bu konteynerde çalışmıyor** — belge doğrulaması
  için qblogg-operasyon becerisindeki alternatifi kullan.
- **8000 portunu `pkill -f http.server` ile kapatma** — bu sandbox'ta
  Bash aracı arka planda takip ettiği süreci öldürünce komutun kendisi
  anlamsız bir çıkış koduyla (144) döner; site aslında sağlıklı kalır ama
  ajan bunu hata sanabilir. Gerekmedikçe portu manuel kapatma: driver
  zaten `portAcik()` ile var olan sunucuyu yeniden kullanıyor, kendi
  başlattığını da `process.kill(-srv.pid)` ile kendi kapatıyor.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `ERR_MODULE_NOT_FOUND: playwright` | createRequire deseni (yukarıda); betiği scratchpad'e taşımak da çalışır |
| `sunucu 5 sn içinde açılmadı` | 8000 portunu tutan eski süreç: `pkill -f http.server` sonra tekrar |
| Görüntüde kartlar boş | reveal sabitleme enjekte edilmemiş — driver'ı kullan |
| SendUserFile 400 | Görüntü >8000px — deviceScaleFactor'ı düşür |
