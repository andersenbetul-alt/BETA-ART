---
name: hxi-yayin
description: HXI sitesini (hxi-nu.vercel.app) güncelle ve yayınla — kaynak düzenle, derle, hxi-sayfalar/'a kopyala, claude/hxi-skrlag dalına push'la, klon-kalıplı Vercel dağıtımını tetikle, Playwright ile doğrula. Kullanıcı HXI sayfasında herhangi bir değişiklik istediğinde (bölüm ekle/çıkar, metin düzelt, dil ekle, tasarım ayarı, "HXI'yı güncelle", "siteye ekle", "yayınla", "Vercel'e taşı") MUTLAKA bu beceriyi kullan; kurallar akıldan yürütülürse depo adresi, arşiv varlıkları ve kapı sayfası tuzaklarına düşülür.
---

# HXI Yayın Döngüsü

HXI sanatçı sitesinin tek yayın hattı. Bu beceri, bir oturumda altı kez elle
döndürülen döngünün kurallaştırılmış hâlidir — her adımın nedeni, bir kez
düşülmüş bir tuzaktır.

## Harita: hangi kaynak neyi üretir

| Kaynak | Çıktı | Yayın yeri |
|---|---|---|
| `hxi-v6/` (Next.js 15, statik export) | `hxi-v6/out/` | Site kökü: `/tr/ /en/ … /zh/` (10 dil) |
| `hxi-klasik-kaynak/` (React SPA, 8 dil) | web-artifacts-builder ile `bundle.html` | `/klasik` + Claude artifact |
| `hxi-sayfalar/` (yayın klasörü, depoda) | — | Vercel `hxi` projesi bunu olduğu gibi servis eder |

`hxi-sayfalar/` içindeki el yazması dosyalar (derleme çıktısı DEĞİL, elle korunur):
`index.html` (dil kapı sayfası), `klasik.html`, `studio.html`, `degerlendirme.html`,
`arktisk.html`, `sync.html`, `v1/ v2/ v4/ v5/ v6/` arşivleri.

## Değişmez kurallar

0. **Her iyileştirmeden ÖNCE üç kaynak okunur** (kullanıcı talimatı, 01.09.2026):
   `brand/hxi/README.md` + `brand/hxi/CONCEPT.md` (marka mimarisi — masterbrand,
   UTGAVE editoryal sistemi, dört dönüşüm modeli FAN→LISTEN / CREATOR→USE /
   BRAND→SYNC / INDUSTRY→CONTACT, kilitli renk/tipografi), `hxi/` statik
   sayfaları (mimari oturumunun uygulaması — yayında /v8) ve `hxi-website/`
   (dosyalar oturumunun uygulaması — yayında /v7). Bu üç kaynağa aykırı
   iyileştirme yapma; çelişki görürsen kullanıcıya söyle. Marka tescili temiz
   değil: sitede asla ® veya "korunmaktadır" dili kullanma.

1. **Depo adresi `BETA-ART-PRIVAT`'tır ve public'tir.** Vercel derlemesi onu
   anonim klonlar. Push çıktısındaki "repository moved" uyarısı normaldir;
   ama depo bir gün gerçekten private yapılırsa dağıtım o anda kırılır —
   böyle bir belirti görürsen önce görünürlüğü doğrula.
2. **Dal: `claude/hxi-skrlag`.** Üretim bu daldan beslenir; başka dala push yok.
3. **Kök `index.html`'i V6 çıktısıyla EZME.** V6 export'unun kök index'i
   JS-bağımlı bir Next hata-kabuğudur; depodaki kapı sayfası (dil seçici +
   meta-refresh) elle yazılmıştır. V6 çıktısını kopyalarken kapı sayfasını
   önce yedekle, sonra geri koy (aşağıdaki tarif bunu yapar).
4. **`assets/hero.png` silinmez.** Kök site WebP kullanır ama `/v5` ve `/v6`
   arşiv sayfaları kökteki PNG'ye başvurur; silinirse arşiv görselleri kırılır.
5. **Metinler yalın dil (klart språk) ilkesiyle yazılır:** kısa cümle, tek
   fikir, süs yok. Marka öğeleri çevrilmez: HXI, "THE SAME SPEED, COLDER",
   parça adları, marquee.
6. **Yeni metin anahtarı 10 dile birden eklenir** (`hxi-v6/content/locales.ts`:
   en, no, tr, fr, de, es, pt, ar, ja, zh). Klasik SPA'da 8 dil
   (`hxi-klasik-kaynak/src/i18n.ts`). Arapça RTL: `margin-left` değil
   `margin-inline-start`, `left` değil `inset-inline-start`.
7. **Bölüm eyebrow'ları 01–08 sıralıdır** (music 01 … contact 08; Nordik içi
   HAKKINDA alt bloğu 03'ü paylaşır). Bölüm ekle/çıkarınca 10 dilde yeniden
   numaralandır.
8. **Bağlantı uydurulmaz.** Doğrulanmış hesaplar: Spotify sanatçı
   `3yRqd6IO6SamMAmnXwZKeU`, Instagram `@prod.hxi`, YouTube `@hximusic`,
   NCS `ncs.io/artist/1169/hxi`, e-posta `booking@hxi.no`. TikTok/Apple Music
   adresi doğrulanmadıkça sayfaya girmez; podcast kutusu platform bağlantısız
   "hazırlanıyor" durumundadır.

## Tarif: V6 (kök site) güncellemesi

```bash
cd hxi-v6
# 1. Düzenle: components/SitePage.tsx, content/locales.ts, app/globals.css
npx next build                      # çıktı: out/ (basePath YOK — kök site)
cd ..
# 1b. JS söküm: Next hidrasyonu kaldırılır, üç davranış vanilya betiğe döner
#     (oynatıcı kapısı, dil menüsü kaydı). SitePage'e YENİ istemci davranışı
#     eklersen bu betiğe de vanilya karşılığını ekle, yoksa canlıda çalışmaz.
node .claude/skills/hxi-yayin/scripts/statik-incelt.mjs hxi-v6/out
# 2. Yayın klasörünü tazele (kapı sayfasını koruyarak)
KAPI=$(mktemp); cp hxi-sayfalar/index.html $KAPI
rm -rf hxi-sayfalar/{en,no,tr,fr,de,es,pt,ar,ja,zh,_next,404,404.html,sitemap.xml}
cp -r hxi-v6/out/. hxi-sayfalar/
cp $KAPI hxi-sayfalar/index.html
rm -f hxi-sayfalar/index.txt        # export artığı
# artık hiçbir sayfadan çağrılmayan JS parçaları atılır (css kalır!)
rm -rf hxi-sayfalar/_next/static/chunks
# hero.png'nin yerinde olduğunu doğrula (kural 4)
test -f hxi-sayfalar/assets/hero.png || cp hxi-v6/public/assets/hero.png hxi-sayfalar/assets/
# 3. Commit + push (model adı yazma; Co-Authored-By: Claude <noreply@anthropic.com>)
git add -A hxi-sayfalar hxi-v6 && git commit && git push origin claude/hxi-skrlag
```

## Tarif: klasik SPA güncellemesi

Kaynak depoda `hxi-klasik-kaynak/`. web-artifacts-builder iskeletine kopyala
(`src/App.tsx, src/index.css, src/i18n.ts, src/main.tsx, index.html, favicon.svg`;
`App.css` boş kalır), `bash scripts/bundle-artifact.sh` ile derle, çıktıyı
`hxi-sayfalar/klasik.html`'e kopyala. Değiştirdiğin kaynağı
`hxi-klasik-kaynak/`'a geri yaz — scratchpad kalıcı değildir.
Artifact eşitlemesi: aynı bundle'ı
`https://claude.ai/code/artifact/ec41761b-8d52-4faf-9b39-4d7094e801a0`
adresine yeniden yayınla (`url` parametresiyle; favicon 🎵 korunur).

## Dağıtım (Vercel)

Proje **hxi**, takım `team_xNtowH7U0jXQrI53DFJFzH2o` (BET - ART), üretim adresi
**hxi-nu.vercel.app**. Dağıtıma yalnızca `vercel.json` gönderilir:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "git clone --depth 1 --branch claude/hxi-skrlag https://github.com/andersenbetul-alt/BETA-ART-PRIVAT.git _src && git -C _src rev-parse HEAD && mkdir dist && cp -r _src/hxi-sayfalar/. dist/",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false,
  "framework": null,
  "headers": [
    { "source": "/assets/(.*)", "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] },
    { "source": "/_next/static/(.*)", "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] },
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
      { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
    ] }
  ]
}
```

`deploy_to_vercel` aracıyla `target: production`, `name: hxi`, yukarıdaki
teamId ile gönder. Derleme günlüğünde `rev-parse` satırındaki commit'in az
önce push'ladığın commit olduğunu doğrula — eski commit görürsen push
gitmemiştir.

## Doğrulama (dağıtımdan önce yerelde)

```bash
cd hxi-sayfalar && python3 -m http.server 4400 &   # yerel servis
node .claude/skills/hxi-yayin/scripts/dogrula.mjs   # rapor stdout'a
```

`scripts/dogrula.mjs` Chromium'la (`/opt/pw-browsers/chromium`) TR/EN/AR +
mobil görünümleri açar; konsol hatası, kırık çapa, yatay taşma, yüklenmeyen
görsel, RTL yönü ve mobilde başlığın ilk ekranda olup olmadığını denetler.
Herhangi bir satır `HATA` içeriyorsa push'lama — önce düzelt. Playwright
kurulu değilse: `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install playwright`
(tarayıcı indirme, hazır Chromium kullanılır).

## Bilinen açık işler

- Vercel Authentication takım varsayılanıyla açık olabilir (ziyaretçiye giriş
  duvarı); kullanıcının incognito testi ve onayı olmadan kapatma.
- hxi.no alan adı bağlanınca meta/canonical'lar hazır (zaten hxi.no yazıyor);
  bağlanana dek arama motoru önizlemeleri hxi.no gösterir, bu bilinçlidir.
