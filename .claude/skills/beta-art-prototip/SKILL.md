---
name: beta-art-prototip
description: Beta Art markası için tek dosyalık (bundle.html) web sayfası prototipi kur, güncelle ve doğrula — web-artifacts-builder + marka belirteçleri + gömülü gerçek fontlar + Playwright/incognito testi + dürüst-içerik kuralları, tek akışta. Kullanıcı "Beta Art için sayfa/prototip/konsept yap", "galleri/arşiv/salon sayfası", "web sayfasını güncelle/düzelt", "fontları/logoyu ekle" dediğinde ya da mevcut bir Beta Art prototipine bölüm/özellik ekleneceğinde MUTLAKA bu beceriyi kullan — kullanıcı beceri adını anmasa bile. Bu beceri olmadan yapılan denemeler bilinen tuzaklara (Parcel/favicon, Radix, html-inline fontları gömmez) tekrar düşer.
owner: BETA ART
---

# /beta-art-prototip — tek dosyalık Beta Art sayfası kurma akışı

Bu oturumlarda üç kez sıfırdan keşfedilen akışın kalıcı hâli. Amaç: herhangi bir
Beta Art sayfa konseptini (arşiv, galleri, salon, kampanya…) sunucusuz açılan,
dışarıya sıfır istek atan, marka-doğru tek bir `bundle.html` olarak üretmek ve
kanıtla teslim etmek.

## Neden bu sıra

Her adım, atlanınca gerçekten patlamış bir sorunun çözümüdür. Sıra keyfi değil.

## 1. Kurulum

```bash
cd <scratchpad>
bash <web-artifacts-builder>/scripts/init-artifact.sh <proje-adi>
cd <proje-adi>
rm -f src/App.css src/assets/hero.png src/assets/react.svg src/assets/vite.svg
mkdir -p src/data src/components/site src/lib
```

`index.html` kurallları — ikisi de bundler'ı kırar, ekleme:
- `<link rel="icon">` yok (Parcel `./favicon.svg` çözümlemesinde patlar),
- dış `<link rel="stylesheet">` yok (html-inline dış URL'de ENOENT verir).

## 2. Marka belirteçleri

`references/tokens.css` dosyasını `src/index.css` olarak kopyala — MASTER.md §5
paletinin shadcn değişkenlerine birebir eşlenmiş hâli (Paper/Panel/Ink/Muted/
Rule/Seal, `--radius: 0rem`, üç font rolü). Renkleri elle yeniden türetme;
iki kez yanlış türetildi, bu dosya doğrulanmış hâl.

Logo: `references/Logo.tsx`'i `src/components/site/Logo.tsx` olarak kopyala.
Aperture mark geometrisi `brand/beta-art/master/logo-mark.svg`'den birebirdir;
crimson merkez nokta (#8B1515) her iki varyantta sabittir — marka kuralı.

## 3. Gerçek fontlar (en çok zaman kaybettiren adım)

`html-inline` yalnızca HTML etiketlerini gömer; **CSS `url()` font varlıklarını
gömmez** — @fontsource'u doğrudan import edersen bundle tek başına açıldığında
fontlar 404 olur ve sessizce sistem fontuna düşer. Çözüm base64 gömme:

```bash
pnpm add @fontsource/fraunces @fontsource/inter @fontsource/jetbrains-mono
python3 <bu-beceri>/scripts/embed-fonts.py   # src/fonts-embedded.css üretir
```

`index.css` en üstünde: `@import './fonts-embedded.css';`

Betik yalnızca **gerçekten kullanılan** kesitleri gömer (latin, kullanılan
ağırlıklar) — sayfada `font-medium` yoksa Inter 500'ü ekleme; her kesit ~20-25KB.
Doğrulama 5. adımda `document.fonts.check()` ile yapılır, "derlendi" yetmez.

## 4. İçerik — dürüstlük kuralları (pazarlıksız)

- **Uydurma yok.** Sanatçı adı, biyografi, sergi tarihi, müşteri logosu,
  referans, istatistik — kaynağı yoksa sayfaya girmez. Boş durum dürüst yazılır:
  "No exhibition is live yet", "published only once confirmed".
- **Sabit ticari dil:** komisyon **%30 / sanatçıya %70**; davet
  "requested, never sold"; salon ritmi "one to two exhibitions a year".
- **İki sorumluluk cümlesi korunur** (MASTER.md §4.06/§4.08): provenance
  evrensel gerçeği kanıtlamaz; makine-okunur sinyaller sözleşmeyi destekler,
  uyumu garanti etmez.
- Gerçek plaka/lisans verisi mevcut prototiplerin `src/data/content.ts`
  dosyalarında kaynak yorumlarıyla durur — oradan al, yeniden yazma.

## 5. Bilinen tuzaklar

- **Radix Sheet/Dialog Parcel'da kırılır** (`@radix-ui/primitive` export map).
  Çekmece/kapak gerekiyorsa elle `SlideOver` yaz; shadcn'in Dialog zincirini
  import etme.
- CSS `@import` içinde paket adı çözülmez; gerekirse
  `../node_modules/...` göreli yolu kullan (font betiği bunu zaten aşar).
- Playwright seçicileri: `text=No` gibi kısa metinler sayfadaki başka
  içerikle eşleşir — `getByRole("button", { name, exact: true })` kullan.

## 6. İsteğe bağlı katmanlar

İkisi de çalışır durumda `beta-art-one-site` içinde örneklidir; istenirse oradan taşı:
- **Davranış hafızası** (`src/lib/behavior.ts` + `Memory.tsx`): opt-in,
  yalnızca cihazda, panelde aynen görünür, tek tık "Forget me". Karar öncesi
  tek bayt yazılmaz — GDPR/ekomloven ve marka güveni bunun üstüne kurulu.
- **Editor/ziyaretçi ayrımı** (`src/lib/editor.ts` + `EditorBar.tsx`):
  ziyaretçi temiz sayfa görür; footer "Editor" bağlantısı / `?editor` küratör
  modunu açar; gizlemeler kalıcı ve ziyaretçiye yansır. Çubukta dürüst not:
  gerçek yetki sunucu girişi ister (üretim: beta-art/ Supabase auth).

## 7. Derle, kanıtla, teslim et

```bash
bash <web-artifacts-builder>/scripts/bundle-artifact.sh
# Teslim önkoşullarını tek komutla sına (çıkış kodu 0/1):
node <depo-koku>/.claude/skills/beta-art-prototip/scripts/drive-bundle.mjs \
  <proje>/bundle.html <cikti-dizini>        # kapılı sayfada: --enter
```

`drive-bundle.mjs` şunları sınar ve tam boy görüntü alır: üç marka fontu
`document.fonts.check` ile gerçekten yüklü, **sıfır dış ağ isteği**, React
render oldu, `pageerror`/`console.error` boş. `DRIVE: PASS` görmeden
`SendUserFile` ile gönderme. Sayfaya özgü etkileşimleri (filtre, kapı,
davranış onayı…) ek bir betikle gerçek tıklamayla sına — seçicilerde
`getByRole(..., { exact: true })` kullan (bkz. bölüm 5).

Kural: bir düzeltme "yapıldı" değil, "test şunu gösterdi" diye raporlanır.

Not: Playwright depo kökünden import edilemez (`ERR_MODULE_NOT_FOUND`);
sürücü bunu `createRequire('/opt/node22/lib/node_modules/')` ile çözer —
kendi betiğinde aynı deseni kullan.

## Bilinen sınırlar

- `bundle.html` prototiptir; üretim yolu MASTER.md §7 gereği beta-art.com
  altında rota olmaktır (`/galleri` gibi), ayrı site değil.
- Editor modunda gerçek kimlik doğrulama yoktur — bilinçli, çubukta yazılı.
- Davranış verisi cihaz dışına çıkmaz; kurucuya toplu içgörü vermez (o ayrı,
  izin-bantlı sunucu işi).
