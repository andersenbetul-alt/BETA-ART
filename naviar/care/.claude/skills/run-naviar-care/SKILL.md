---
name: run-naviar-care
description: NaviarCare sitesini bu konteynerde çalıştır, sür ve ekran görüntüsü al — "siteyi çalıştır", "run", "smoke test", "screenshot/ekran görüntüsü", "sayfayı göreyim", "tarayıcıda doğrula", "admin paneline gir", "profil sayfasını göster" istendiğinde bu beceriyi kullan. Sunucu başlatma + Playwright sürüşü tek komutta; admin girişi ve NCB onayı bayrakla.
---

# NaviarCare'i çalıştırma ve sürme

Saf statik site (derleme YOK, bağımlılık YOK) — `naviar/care/` altındaki
12 HTML + `style.css` + `app.js` + `behavior.js` + `doctors.js`.
Ajan yolu: bu klasördeki **driver.mjs** — sunucuyu kendi açar (8001),
gerçek Chromium ile sürer, kapatır. Yollar depo kökünden.

## Önkoşul

Yok. `python3`, `node` ve Playwright (küresel, `/opt/node22/lib/node_modules`)
+ Chromium (`/opt/pw-browsers/chromium`) bu konteynerde hazır.
`apt`/`npm install` ÇALIŞTIRMA.

## Çalıştır (ajan yolu — önce bunu kullan)

```bash
# 27 kontrollü smoke test, 3 görüntü (index, profil, admin doktor sekmesi); çıkış 0/1:
node naviar/care/.claude/skills/run-naviar-care/driver.mjs smoke /tmp/naviar-care-run

# Tek sayfanın tam ekran görüntüsü:
node naviar/care/.claude/skills/run-naviar-care/driver.mjs shot triage.html /tmp/naviar-care-run
node naviar/care/.claude/skills/run-naviar-care/driver.mjs shot "view-profile.html?id=ak" /tmp/naviar-care-run

# Admin paneli: --login ilk kurulum parolasını girer, --tab sekme açar
node naviar/care/.claude/skills/run-naviar-care/driver.mjs shot admin.html /tmp/naviar-care-run --login --tab=doctors

# Profil: --consent NCB onayını + 1 örnek favoriyi (ak) önceden yazar
node naviar/care/.claude/skills/run-naviar-care/driver.mjs shot profile.html /tmp/naviar-care-run --consent
```

Görüntüler verilen dizine `.png` düşer (`admin.html-panel-doctors.png`,
`profile.html.png`, `view-profile.html_id_ak.png` gibi). Sunucu 8001'de zaten
çalışıyorsa driver yeniden başlatmaz ve kapatmaz.

Smoke'un sürdüğü akışlar: ana sayfa → triage → booking (kart sayısı =
`doctors.js`, NCB onay bandı, favori kaydet) → profile (kayıtlı doktor
listelenir) → view-profile (ad `doctors.js` ile eşit, bilinmeyen id → not
found) → languages → about → join sihirbazı → temiz bağlamda profil onay
kapısı → temiz bağlamda admin (kurulum → panel → doktor tablosu → çıkış →
yanlış parola → doğru parola) → sayfa hatası yok.

## Çalıştır (insan yolu)

```bash
python3 -m http.server 8001 --directory naviar/care
# → http://localhost:8001 (Ctrl-C ile kapat)
```

## Sayfalar

| Dosya | İçerik |
|---|---|
| `index.html` | Ana sayfa — hero, nasıl çalışır, uzmanlıklar |
| `triage.html` | 4 adımlı semptom kontrolü (`#step-1`…) |
| `booking.html` | Doktor arama; kartlar `doctors.js`'ten; kalp düğmesi `.ncb-fav-btn` |
| `view-profile.html?id=ak` | Danışman profili — **kendi satır içi `DOCTORS` kopyası**, `doctors.js`'i yüklemez |
| `profile.html` | Hasta profili: favoriler, ilgi, geçmiş, bildirim, veri dışa/içe aktarma; `NC_CONSENT` yoksa onay kapısı |
| `admin.html` | Editör paneli: SHA-256 parola (`NC_ADMIN_HASH`), doktor CRUD + `doctors.js` dışa aktarma, NCB istatistik |
| `languages.html` | 113 dil tablosu + filtre |
| `about.html` / `join.html` / `legal.html` / `feedback.html` | Misyon+SSS / 4 adımlı doktor başvuru sihirbazı (`<form>` yok) / hukuk / geri bildirim |
| `doctors.js` | `NC_DOCTORS` dizisi + `window.NC_DOCTORS = NC_DOCTORS` — tek kaynak |
| `behavior.js` | NCB v2: onay, takip, favori, bildirim, dışa/içe aktarma |
| `style.css` / `app.js` | Paylaşılan stil (değişkenler `:root`) / dil seçimi, nav, form |

## Gotchas (hepsi bu konteynerde yaşandı)

- **`pkill -f 'http.server 8001'` kendi kabuğunu öldürür** (çıkış 144, hiç
  çıktı yok): desen, onu içeren bash komut satırıyla da eşleşir. `pkill -f
  '[h]ttp.server 8001'` yaz — köşeli parantez deseni kendi satırıyla eşleşmez.
  Ama aynı komut satırında başka bir yerde düz `http.server 8001` metni varsa
  (ör. insan yolu komutu, bir heredoc içindeki dosya yolu) yine vurur:
  `pkill`/`pgrep`'i tek başına ayrı bir komut olarak çalıştır. Bu oturumda
  üç kez yaşandı.
- **`hidden` özniteliği id seçiciye yenilir.** `#doctor-modal { display:flex }`
  ve `#auth-screen { display:flex }` tarayıcının `[hidden]{display:none}`
  kuralını eziyordu; modal her zaman açıktı, sayfa tıklanamıyordu
  (Playwright: "subtree intercepts pointer events"). Çözüm: `#x[hidden]
  { display:none }` satırı. Yeni bir `hidden` ile açılıp kapanan öğeye id
  seçiciyle `display` verirsen aynı satırı ekle.
- **Üst düzey `const` `window`'a yazılmaz.** `doctors.js`'teki `const
  NC_DOCTORS` sonrası `window.NC_DOCTORS` `undefined`'dı; admin tablosu ve
  profil favorileri sessizce boş kalıyordu. Dosya sonundaki
  `window.NC_DOCTORS = NC_DOCTORS;` satırı bunun için; admin dışa aktarması
  da aynı satırı yazar. Silme.
- **Her Playwright context ayrı localStorage/sessionStorage.** Onay, favori
  ve admin oturumu böyle izole edilir; "onay yok" ve "admin ilk kurulum"
  kontrolleri temiz context ister. Aynı context'te ikinci `admin.html`
  ziyareti kurulum değil giriş ekranı gösterir.
- **NCB onay bandı 1,5 sn gecikmeli** (`NCB.init` → `setTimeout(showBanner,
  1500)`); `waitFor({timeout: 4000})` ile bekle, `isVisible()` hemen sorma.
- **Onaysız favori tıklaması `alert()` açar**; driver `dialog` olayını
  kapatıp hata sayar. Favori testinden önce onay ver.
- **`view-profile.html` `doctors.js`'i yüklemez** — ad karşılaştırması için
  beklenen değeri booking sayfasında al. İki liste ayrışırsa smoke'taki
  "iki liste ayrışmamış" kontrolü kırmızıya döner; bu istenen davranış.
- **Driver çökerse sunucu kalır mıydı?** Artık kalmaz: `process.on('exit')`
  kendi açtığı 8001'i kapatır. Bunun çalışması için spawn sonrası
  `srv.unref()` şart — unref'siz detached çocuk node'un event loop'unu açık
  tutar, `shot` komutu görüntüyü yazdıktan sonra sonsuza dek bekler
  (bu oturumda 5 dk timeout ile yaşandı). Ama driver başlamadan önce 8001 doluysa o
  sunucuya dokunmaz — çökmüş bir koşudan kalan süreç varsa `pgrep -af
  '[h]ttp.server 8001'` ile gör, `pkill` ile kapat.
- **Port çakışması**: QBLOGG `npm run dev` 8000'i kullanır; NaviarCare 8001.
  İkisi aynı anda çalışabilir.
- **Playwright depo kökünden import EDİLEMEZ** (`ERR_MODULE_NOT_FOUND`).
  Driver `createRequire('/opt/node22/lib/node_modules/')` ile çözer.
- **`--directory` flag gerekli**: `python3 -m http.server 8001 --directory
  naviar/care`; aksi hâlde repo kökü servis edilir ve CSS/JS 404 verir.
- **`npm run check` NaviarCare'i denetlemez** (yalnızca QBLOGG); NaviarCare
  için doğrulama bu smoke'tur.
- **Egress proxy `*.vercel.app` engeller** — canlı site burada açılamaz;
  canlı doğrulama `web_fetch_vercel_url` MCP aracıyla.
- **Dağıtım = `naviar/vercel-care.json` tarifi**: dal'a push +
  `deploy_to_vercel`; dosyalar build sırasında git clone ile kopyalanır.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `sunucu 5 sn içinde açılmadı` | `pkill -f '[h]ttp.server 8001'` → tekrar çalıştır |
| Kabuk çıkış kodu 144, hiç çıktı yok | `pkill` deseni kendi satırını vurdu; `[h]ttp.server` biçimini kullan |
| `page.click: Timeout … subtree intercepts pointer events` | Gizli bir kaplama `hidden`'a rağmen görünüyor; `#id[hidden]{display:none}` ekle |
| `booking doktor kartları (= doctors.js, 0)` | `window.NC_DOCTORS` yok; `doctors.js` sonundaki `window.NC_DOCTORS = …` satırı silinmiş |
| `join sayfası form mevcut` ❌ (eski driver) | join `<form>` değil sihirbaz; `#jstep-1` ve `.spec-card` kontrol edilir |
| CSS/JS 404 | `--directory naviar/care` eksik; mutlak yol kullan |
| `ERR_MODULE_NOT_FOUND: playwright` | `createRequire` deseni (yukarıda) |
| SendUserFile 400 | Görüntü >8000px — `deviceScaleFactor`ı 0.5'e düşür |
