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

- [x] **İki `side-tab`.** KAPANDI — 4px sol şerit yerine tam çevre 1px vurgu
      kenarlığı (`.answer` moss, `.fix` clay). Dedektör **0 bulgu, çıkış 0**.
      Dedektörün gerçekten yakaladığı kasıtlı bozuk girdiyle kanıtlandı
      (aynı desen → 1 bulgu, çıkış 2), yani boş çıktı sessiz başarısızlık değil.
      Tarayıcı ölçümü: `.answer` sol kenarlık 1px = üst kenarlık 1px.

- [ ] **Krem palet.** `--fog #F4F1EC` sayfa arka planı.
      Doğrulama: URL taraması `cream-palette` vermemeli.

## Yeni bulgu — kontrast ölçümünden

- [x] **`.pill.live` koyu temada zeminden ayrılmıyor.** KAPANDI — koyu temada
      `--moss` #3F5B4C → **#6E9B7E**, yeni `--on-moss` #141A1F.
      Tarayıcı ölçümü (koyu): zeminden **5,34:1** (eşik 3,0), üstündeki metin
      **5,56:1** (eşik 4,5). Aynı jeton düzeltmesi `.answer` kenarlığını ve
      kopyalama onay butonunu da kapattı; `--done`/`--on-done` bu değişiklikle
      birebir kopya kaldığı için kaldırıldı (4 jeton → 2).

- [x] **`.pill` varsayılanı koyu temada okunmuyordu.** KAPANDI — listede yoktu,
      moss düzeltmesi sırasında bulundu. `--sand` koyu temada hiç devredilmiyordu:
      açık kum zemin #D8CBB8 üzerinde açık `--ink` #F4F1EC = **1,42:1** (eşik 4,5).
      Koyu tema `--sand` → **#8FA0AA**, metin `--on-sand` #141A1F.
      Tarayıcı ölçümü: metin **6,50:1**, zeminden **6,24:1**.
      Açık listedeki hiçbir maddeden daha ciddiydi.

## Ölçek — kaynak: kendi denetimim

- [ ] **Boşluk ölçeği yok.** 26 farklı rem değeri (margin/padding/gap);
      19 komşu çift 2px'ten yakın, en küçüğü 0,5px. Tarif:
      `.claude/skills/task-observer/references/olcum.md`.
      Kapanma ölçütü: ≤8 değerlik ölçek, 2px'ten yakın komşu yok.
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

- [x] **`/favicon.ico` 404 veriyor.** KAPANDI — `app/favicon.ico/route.ts`,
      `/icon`'a 308 kalıcı yönlendirme. Ölçüm: `curl -w '%{http_code}'
      localhost:3111/favicon.ico` → **308 → /icon 200**. İkili dosya geri
      konmadı; ikonun tek kaynağı `app/icon.tsx` kalıyor. Not: bu yol
      `next build` route tablosunda **görünmüyor** (Next metadata yolunu
      listelemiyor) — tabloya bakıp "çalışmadı" sanma, ölç.
      ESKİ KAYIT: `app/favicon.ico` görselleri koda çevirirken
      silindi, o yolu karşılayan bir şey konmadı. Ölçüm: `curl -o /dev/null -w
      '%{http_code}' localhost:3111/favicon.ico` → **404**; aynı yol
      `b05e274`'te 200 idi (`git ls-tree b05e274 web/app/` → `favicon.ico`).
      Tarayıcılar `<link rel="icon">` kullandığı için sekme ikonu bozulmuyor
      (gerçek tarayıcıda doğrulandı: 512×512 çözülüyor), ama `/favicon.ico`'yu
      doğrudan isteyen istemciler — bazı bağlantı önizleyiciler, RSS okuyucular —
      artık boş dönüyor. Bağlantı paylaşımı bu ürünün dağıtım kanalı olduğu için
      önemli. Kapanma ölçütü: o yol 200 döndürecek ve depoda ikili dosya
      kalmayacak (örn. `/icon`'a yönlendiren `app/favicon.ico/route.ts`).


- [x] **`brand.json` ürünle çelişiyor.** KAPANDI — dosya baştan yazıldı, her
      alan koda karşı çapraz doğrulandı (8/8 renk, alan adı, 13/13 ülke).
      Düzeltilen çelişkiler: slogan perakende metniydi; `primary` alan adı
      bize ait olmayan `cobban.com`'du; `markets` uygulamada olmayan TR/GLOBAL
      içeriyordu; `fonts` Fraunces/Inter diyordu ama kod `system-ui` kullanıyor;
      `locales` üç dil sayıyordu ama arayüz yalnızca İngilizce; iletişim
      adresleri çalışmayan alan adındaydı.
      **En ciddisi:** dosya `legalNameNO: "Cobban AS"` yazıyordu. Kurulmuş
      şirket yok, organizasyon numarası yok, ENK/AS kararı verilmedi — ve ENK
      seçilirse ad yasal olarak soyadı içermek zorunda. Yasal isim alanı
      `status: "KARAR VERİLMEDİ"` ile değiştirildi; karar kurucunun.

## Yeni açık bulgu — kontrast düzeltmesi sırasında ölçüldü

- [ ] **`.pill` varsayılanı AÇIK temada zeminden ayrışmıyor.** Kum #D8CBB8,
      beyaz yüzey → **1,60:1**, bileşen sınırı eşiği 3,0. Koyu temadaki
      kardeşinden farkı: metin kontrastı sorunsuz (**10,99:1**), yalnızca
      rozetin sınırı yumuşak. Koyu temadaki 1,42:1 açık bir metin ihlaliydi ve
      hemen kapatıldı; bu bir yargı çağrısı olduğu için kapsamı genişletmeden
      kayda geçiriliyor.
      Kapanma ölçütü: açık temada `.pill` zemin/yüzey ≥ 3,0 **veya** rozete
      sınır eklenmesi.

## Doğrulanamayanlar — bu ortamdan yapılamaz

- [ ] Entur ve MET sorguları canlı doğrulanmadı (`npm run verify:apis`,
      kısıtsız ağ gerekir).
- [ ] Gerçek kullanıcı testi yapılmadı — sıfır kullanıcı verisi.
