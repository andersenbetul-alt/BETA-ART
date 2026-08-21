# Açık bulgular

Her madde **ölçülmüş**tür — tahmin yok. Kapatmak için: düzeltmeyi yap,
doğrulama komutunu çalıştır, çıktıyı commit mesajına koy, kutuyu işaretle.

`node .claude/skills/task-observer/observe.mjs` bu dosyayı okur.

## Erişilebilirlik — kaynak: apple-design

- [ ] **Dokunma hedefleri eşiğin altında.** 16 çipin 16'sı 40,3px, eşik 44
      (HIG mobil 44×44pt). `.back` 22px, konum butonu 22px, marka linki 27px.
      Çip ana gezinme öğesi — her ekranda ülke ve şehir seçimi ondan geçiyor.
      Ölçüm: Playwright, 390×844.
      Doğrulama: viewport 390 genişlikte tüm `.chip` yüksekliği ≥ 44.

- [ ] **Dokunmada geri bildirim yok.** `:active` sayısı 0. Dokunmatikte hover
      yok, yani çipe basınca yeni sayfa boyanana kadar hiçbir şey olmuyor.
      Doğrulama: `grep -c ":active" web/app/globals.css` > 0.

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
- [ ] **`min-height` piksel.** 64px/44px sabit — kullanıcı yazı boyutunu
      büyütünce metin taşıyor. `rem` olmalı.

## Marka

- [ ] **`brand.json` ürünle çelişiyor.** Slogan hâlâ *"Nordic simplicity,
      handpicked quality"*, birincil alan adı `cobban.com` (başkasında).
      Ürün seyahat asistanı, alan adı `cobban.eu`.

## Doğrulanamayanlar — bu ortamdan yapılamaz

- [ ] Entur ve MET sorguları canlı doğrulanmadı (`npm run verify:apis`,
      kısıtsız ağ gerekir).
- [ ] Gerçek kullanıcı testi yapılmadı — sıfır kullanıcı verisi.
