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

- [ ] **Kopyalama onayı geçişsiz.** "✓ Copied" anlık yer değiştiriyor —
      uygulamanın "DONE" dediği an en zayıf geri bildirime sahip.

- [ ] **`loading.tsx` yok.** Ulaşım ekranı sunucuda Entur'a gidiyor; kötü
      sinyalde kullanıcı eski sayfada bekliyor, hiçbir işaret yok.
      Doğrulama: `ls web/app/sorun/[kind]/loading.tsx`.

## Tasarım — kaynak: impeccable (deterministik dedektör)

- [ ] **İki `side-tab`.** `globals.css:53` (`.answer`, moss) ve `:141`
      (`.fix`, clay) — kartın kenarında 4px renkli şerit.
      Doğrulama: `node .claude/skills/impeccable/scripts/detector/detect-antipatterns.mjs web/app web/components` → 0 bulgu.

- [ ] **Krem palet.** `--fog #F4F1EC` sayfa arka planı.
      Doğrulama: URL taraması `cream-palette` vermemeli.

## Ölçek — kaynak: kendi denetimim

- [ ] **Boşluk ölçeği yok.** 22 farklı rem değeri; komşular 0,8px farkla.
- [ ] **Tipografi ölçeği yok.** 11 boyut; `.85`/`.875`/`.9` ayırt edilemiyor.
- [x] **`min-height` piksel.** KAPANDI — 64px → 4rem, 44px → 2.75rem.

## Marka

- [ ] **`brand.json` ürünle çelişiyor.** Slogan hâlâ *"Nordic simplicity,
      handpicked quality"*, birincil alan adı `cobban.com` (başkasında).
      Ürün seyahat asistanı, alan adı `cobban.eu`.

## Doğrulanamayanlar — bu ortamdan yapılamaz

- [ ] Entur ve MET sorguları canlı doğrulanmadı (`npm run verify:apis`,
      kısıtsız ağ gerekir).
- [ ] Gerçek kullanıcı testi yapılmadı — sıfır kullanıcı verisi.
