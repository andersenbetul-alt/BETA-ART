# Açık bulgular

Her madde **ölçülmüş**tür — tahmin yok. Kapatmak için: düzeltmeyi yap,
doğrulama komutunu çalıştır, çıktıyı commit mesajına koy, kutuyu işaretle.

`node .claude/skills/task-observer/observe.mjs` bu dosyayı okur.

## Erişilebilirlik — kaynak: apple-design

- [x] **Dokunma hedefleri eşiğin altında.** KAPANDI — ölçüm 19 → 0.
      Çipler 40,3 → 44px (`min-height:2.75rem` + inline-flex). `.back`,
      konum butonu ve marka bağlantısı da 44px. 16 çipin 16'sı 40,3px, eşik 44
- [x] **Dokunmada geri bildirim yok.** KAPANDI — `:active` 0 → 7 kural.
      `scale(.985)` + arka plan değişimi; `prefers-reduced-motion` ile
      kapatılıyor.

- [x] **Kopyalama onayı geçişsiz.** KAPANDI — buton `is-done` sınıfıyla
      yeşile geçiyor (`--done` jetonu, .12s). Metin anlık değişiyor, renk
      geçişle. `aria-live="polite"` eklendi.

- [x] **Yükleniyor durumu yoktu.** KAPANDI — `loading.tsx` DEĞİL, ulaşım
      dalının etrafında `<Suspense>`. `loading.tsx` denendi ve geri alındı:
      akış başlayınca HTTP durumu yazılıyor, `notFound()` geç kalıyor ve
      bilinmeyen sorun türü 404 yerine 200 dönüyordu (duman testi yakaladı).

## Tasarım — kaynak: impeccable (deterministik dedektör)

- [ ] **İki `side-tab`.** `globals.css:53` (`.answer`, moss) ve `:141`
      (`.fix`, clay) — kartın kenarında 4px renkli şerit.
      Doğrulama: `node .claude/skills/impeccable/scripts/detector/detect-antipatterns.mjs web/app web/components` → 0 bulgu.

- [ ] **Krem palet.** `--fog #F4F1EC` sayfa arka planı.
      Doğrulama: URL taraması `cream-palette` vermemeli.

## Yeni bulgu — kontrast ölçümünden

- [ ] **`.pill.live` koyu temada zeminden ayrılmıyor.** `--moss` #3F5B4C,
      koyu yüzey #171E23 → **2,26:1**, bileşen sınırı eşiği 3,0. Kopyalama
      butonunu düzeltirken aynı kökten çıktı; `--done` jetonu buton için
      çözdü ama pill hâlâ `--moss` kullanıyor. Önceden var olan sorun,
      bilerek ayrı bırakıldı.

## Ölçek — kaynak: kendi denetimim

- [ ] **Boşluk ölçeği yok.** 22 farklı rem değeri; komşular 0,8px farkla.
- [ ] **Tipografi ölçeği yok.** 11 boyut; `.85`/`.875`/`.9` ayırt edilemiyor.
- [x] **`min-height` piksel.** KAPANDI — 64px → 4rem, 44px → 2.75rem.

## Marka

- [x] **Favicon ve OG görseli yoktu.** KAPANDI — `/icon`, `/apple-icon`,
      `/opengraph-image`, `/twitter-image` üretiliyor ve sunuluyor (4×200,
      512×512 / 180×180 / 1200×630 / 1200×675). Paylaşılan bağlantı önizlemeli.

- [x] **OG alt metni çıkmıyordu.** KAPANDI — `.alt.txt` yan dosyası işlemiyor,
      ama görsel üreteci `.tsx` olunca `export const alt` işliyor:
      `og:image:alt` ve `twitter:image:alt` artık HTML'de.

- [x] **İkili görseller Vercel'e taşınamıyordu.** KAPANDI — MCP kanalı yalnızca
      metin taşıyor. Görseller `next/og` `ImageResponse` ile derleme anında
      üretiliyor; depoda tek bir ikili dosya kalmadı (ölçüm: `find` → 0).

- [x] **İşaret 16px'te okunmuyordu.** KAPANDI — `fontWeight: 700` sessizce yok
      sayılıyordu, çünkü next/og'un varsayılan yazı tipinde kalın kesim yok.
      "C" harf yerine SVG yayı olarak çiziliyor; kalınlık artık bizim elimizde.

- [ ] **`/favicon.ico` 404 veriyor.** `app/favicon.ico` görselleri koda çevirirken
      silindi, o yolu karşılayan bir şey konmadı. Ölçüm: `curl -o /dev/null -w
      '%{http_code}' localhost:3111/favicon.ico` → **404**; aynı yol
      `b05e274`'te 200 idi (`git ls-tree b05e274 web/app/` → `favicon.ico`).
      Tarayıcılar `<link rel="icon">` kullandığı için sekme ikonu bozulmuyor
      (gerçek tarayıcıda doğrulandı: 512×512 çözülüyor), ama `/favicon.ico`'yu
      doğrudan isteyen istemciler — bazı bağlantı önizleyiciler, RSS okuyucular —
      artık boş dönüyor. Bağlantı paylaşımı bu ürünün dağıtım kanalı olduğu için
      önemli. Kapanma ölçütü: o yol 200 döndürecek ve depoda ikili dosya
      kalmayacak (örn. `/icon`'a yönlendiren `app/favicon.ico/route.ts`).


- [ ] **`brand.json` ürünle çelişiyor.** Slogan hâlâ *"Nordic simplicity,
      handpicked quality"*, birincil alan adı `cobban.com` (başkasında).
      Ürün seyahat asistanı, alan adı `cobban.eu`.

## Doğrulanamayanlar — bu ortamdan yapılamaz

- [ ] Entur ve MET sorguları canlı doğrulanmadı (`npm run verify:apis`,
      kısıtsız ağ gerekir).
- [ ] Gerçek kullanıcı testi yapılmadı — sıfır kullanıcı verisi.
