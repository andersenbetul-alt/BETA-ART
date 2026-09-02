---
name: run-hxi
description: HXI Music sitesini (hxi/) bu konteynerde çalıştır, sür ve ekran görüntüsü al — "hxi'yi çalıştır", "run", "smoke test", "screenshot/ekran görüntüsü", "mobil menüyü göster", "music sayfasını göreyim", "tarayıcıda doğrula" istendiğinde bu beceriyi kullan. Sunucu başlatma + Playwright sürüşü tek komutta; mobil görünüm ve menü bayrakla.
---

# HXI'yi çalıştırma ve sürme

Saf statik site (derleme YOK, bağımlılık YOK) — `hxi/` altında 9 HTML +
`style.css` + `app.js` (938 bayt: mobil menü + tıklamayla Spotify iframe'i).
Ajan yolu: bu klasördeki **driver.mjs** — sunucuyu kendi açar (8003),
gerçek Chromium ile sürer, kapatır. Yollar depo kökünden.

## Önkoşul

Yok. `python3`, `node` ve Playwright (küresel, `/opt/node22/lib/node_modules`)
+ Chromium (`/opt/pw-browsers/chromium`) bu konteynerde hazır.
`apt`/`npm install` ÇALIŞTIRMA.

## Çalıştır (ajan yolu — önce bunu kullan)

```bash
# 19 kontrollü smoke test (~8 sn), 2 görüntü (index, mobil menü); çıkış 0/1:
node hxi/.claude/skills/run-hxi/driver.mjs smoke /tmp/hxi-run

# Tek sayfanın tam ekran görüntüsü (masaüstü 1280px):
node hxi/.claude/skills/run-hxi/driver.mjs shot music.html /tmp/hxi-run

# Mobil (390×844) ve açık hamburger menü:
node hxi/.claude/skills/run-hxi/driver.mjs shot index.html /tmp/hxi-run --mobile --menu
```

Görüntüler verilen dizine `.png` düşer (`music.html.png`,
`index.html-mobile-menu.png`). Sunucu 8003'te zaten çalışıyorsa driver
yeniden başlatmaz ve kapatmaz.

Smoke'un sürdüğü akışlar: index (başlık, CSS kök-mutlak yoldan uygulanmış,
7 nav bağlantısı, 4 iş kartı, JSON-LD `MusicGroup`) → music (6 yayın kartı,
"Load player" tıklanınca iframe eklenir + düğme kalkar) → 9 sayfanın hepsi
açılır, `noindex,nofollow` taşır, iç bağlantıları 200 döner → mobil
bağlamda hamburger menü açılır/kapanır (aria-hidden, aria-expanded, body
kaydırma kilidi) → sayfa hatası ve yerel 404 yok.

## Çalıştır (insan yolu)

```bash
python3 -m http.server 8003 --directory hxi
# → http://localhost:8003 (Ctrl-C ile kapat)
```

## Sayfalar

| Dosya | İçerik |
|---|---|
| `index.html` | Hero, seçilmiş işler (`.work` ×4), kanıt, creator/sync geçidi, JSON-LD MusicGroup |
| `music.html` | 6 yayın kartı; `[data-player]` düğmesi tıklanınca `#spotify-help` içine iframe |
| `credits.html` / `creator-use.html` / `sync.html` / `press.html` / `booking.html` | İçerik sayfaları, JS yok |
| `privacy.html` / `legal.html` | Hukuk metinleri |
| `style.css` | Tek stil dosyası, değişkenler `:root`'ta; ≤900px'te `.nav-links` gizli, `#menu-open` görünür |
| `app.js` | Mobil menü (`#menu-open`/`#menu-close` → `#mobile-menu.open`) + Spotify lazy iframe |
| `vercel.json` | Yalnızca güvenlik başlıkları; yönlendirme/derleme yok |

## Gotchas (hepsi bu konteynerde yaşandı)

- **Yollar kök-mutlak** (`/style.css`, `/app.js`, `/music.html`): sunucu
  `hxi/`'yi kök yapmalı — `--directory hxi`. Depo kökünden servis edersen
  QBLOGG'un `style.css`'i gelmez, 404 alırsın; alt klasörden (`/hxi/`) açarsan
  yine 404. Tek doğru yol: `--directory hxi` ve `http://localhost:8003/`.
- **Dış kaynaklar Chromium'a ulaşmıyor; `networkidle` sayfa başına 13 sn
  bekliyor.** `cdn.websitepublisher.ai` (logo) ve `open.spotify.com` askıda
  kalıyor (404 değil, timeout). `fonts.googleapis.com` `curl` ile 200 ama
  Chromium'da ~13 sn sonra `ERR_CONNECTION_RESET` (proxy tüneli kopuyor;
  `ignoreHTTPSErrors` fark etmedi). Driver bu yüzden `localhost` dışı her
  isteği `ctx.route(...).abort()` ile kesiyor: smoke 9 sayfayı 2 dk yerine
  8 sn'de geçiyor, tek görüntü 2 sn. Bedel: görüntülerde yedek sans-serif ve boş logo alanı —
  **Barlow Condensed tipografisi bu ortamda doğrulanamaz.**
- **`document.fonts.check()` yanıltır**: eşleşen `@font-face` hiç yüklenmemişse
  de `true` döner. Font yüklendi mi diye ona bakma; `requestfailed` olayına bak.
- **Mobil menü yalnızca ≤900px'te var**: masaüstü bağlamda `#menu-open`
  `display:none`, tıklarsan Playwright "not visible" ile bekler. `--mobile`
  ya da smoke'un ikinci bağlamı (390×844) gerekir.
- **Spotify "Load player" DOM'da doğrulanır, sesli değil**: iframe `src`'si
  abort edilir ama `#spotify-help iframe` eklenir, `data-loaded=1` olur, düğme
  `remove()` ile kalkar. İkinci tıklama diye bir şey yok.
- **`pkill -f 'http.server 8003'` kendi kabuğunu öldürür** (çıkış 144): desen
  onu içeren bash satırıyla eşleşir. `pkill -f '[h]ttp.server 8003'` yaz ve
  aynı komut satırında başka yerde düz `http.server 8003` metni olmasın.
- **Portlar**: 8000 QBLOGG, 8001 naviar/care, 8002 naviar/care-pilot,
  8003 HXI. Hepsi aynı anda çalışabilir.
- **Playwright depo kökünden import EDİLEMEZ** (`ERR_MODULE_NOT_FOUND`);
  driver `createRequire('/opt/node22/lib/node_modules/')` ile çözer.
- **Detached sunucu `unref()` ister**; yoksa `shot` görüntüyü yazdıktan sonra
  node çıkmaz. Driver `process.on('exit')` ile kendi açtığı sunucuyu kapatır.
- **`npm run check` HXI'yi denetlemez** (yalnızca QBLOGG); HXI için doğrulama
  bu smoke'tur. Formlar bilinçli olarak yok ("Preview forms are intentionally
  disabled"), o yüzden form akışı test edilmez.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `sunucu 5 sn içinde açılmadı` | `pkill -f '[h]ttp.server 8003'` (tek başına bir komut olarak) → tekrar çalıştır |
| Kabuk çıkış kodu 144, hiç çıktı yok | `pkill` deseni kendi satırını vurdu; `[h]ttp.server` biçimini kullan |
| `timeout` ile kesildi, `page.goto … networkidle` askıda | Dış istek kesimi kaldırılmış; `baglam()` içindeki `ctx.route(... abort)` satırını geri koy |
| `CSS kök-mutlak yoldan uygulandı` ❌ | Sunucu `--directory hxi` ile açılmamış; body arka planı `rgb(8, 8, 8)` değil |
| `#menu-open` için "element is not visible" | Masaüstü viewport; `--mobile` kullan |
| `ERR_MODULE_NOT_FOUND: playwright` | `createRequire` deseni (yukarıda) |
