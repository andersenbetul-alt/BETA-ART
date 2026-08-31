---
name: on-brand
description: QBLOGG/BETA ART marka kurallarını (renk belirteçleri, tipografi, boşluk, ikon, ve depoda yazılı olan iki içerik kuralı) her üretilen HTML/CSS/JS parçasına ve her yeni metne uygular; off-brand bir kalıp istendiğinde kısa gerekçeyle reddeder ve doğrusunu önerir. Renk/hex, font-size, ikon, buton/kart/form gibi tekrar eden bileşen, ya da yeni bir metin/CTA/hero yazımı söz konusu olduğunda MUTLAKA bu beceriyi kullan — kullanıcı "marka kurallarına uygun mu" ya da "on-brand" demese bile.
owner: QBLOGG
---

# /on-brand — marka tutarlılığı denetçisi

Bu beceri yeni kural icat etmez; depoda **zaten yazılı** olan marka
kurallarını uygular ve ihlal edildiğinde kısa gerekçeyle reddeder. Çelişki
çıkarsa `CLAUDE.md` → "Değişmez kurallar" (1–8) her zaman kazanır.

## Kaynaklar (bu sırayla okunur)

1. `CLAUDE.md` madde 2, 3, 4, 5, 8 — RTL, i18n metin kuralı, emoji yasağı,
   renk/tipografi belirteçleri, rakam/ücret dürüstlüğü.
2. `docs/tasarim-sistemi.md` — belirteç/tipografi/boşluk/ikon/RTL'nin tam,
   ölçülmüş kaynağı (26.08.2026'da yeniden ölçüldü).
3. `docs/figma-tasarim-kurallari.md` — aynı kapsamın Figma aktarımına göre
   özeti; tekrar eden sınıf adları (`.btn`, `.card`, `.plan`, `.section`,
   `.wrap`, `.tag`, `.field`, `.article-body`, `.table-wrap`) burada listeli.

**Bilinen çakışma:** bu iki belge aynı konuyu (belirteçler, ikon, RTL) ayrı
ayrı anlatıyor. Bu beceri ikisini birleştirmiyor — biri güncellenirse
diğerinin de kontrol edilmesi gerekir. Bunu fark ettiğinde kullanıcıya söyle,
sessizce geçme.

## Kapsam dışı

`brand/naviar/` ve NAVIAR'a referans veren her şey **bu markanın kimliği
değil** — `naviar-care` adlı ayrı bir projenin üretim/inceleme referansı
(bkz. `docs/naviar/`). Bu beceri onu enforce etmez, karıştırma.

## Ne zaman devreye girer

- HTML/CSS/JS üretimi ya da düzenlemesi — renk, tipografi, ikon, boşluk,
  buton/kart/form gibi tekrar eden bir görsel öğe içeriyorsa
- Yeni metin/kopya yazımı — hero, CTA, rakam/ücret içeren herhangi bir cümle
- Figma'dan ya da dışarıdan gelen bir tasarımın koda çevrilmesi
- Açık istek: "marka kurallarına uygun mu", "on-brand mi", "brand check"

## Zorunlu ön-kontrol — teslimden önce

Her üretimden önce şu soruları kendine sor; "hayır" çıkan her madde
teslim edilmeden düzeltilir:

1. Her renk `var(--…)` mi, yoksa ham hex mi?
2. Aqua (`--brand-2` / `#00D8C2`) metin olarak mı kullanılıyor? (metinde
   yasak — 1,9:1)
3. Her yazı boyutu 8 basamaklık ölçekte mi, yoksa ham `rem`/`px` mi?
4. Yeni bir ikon varsa: 24×24, `fill="none"`, `stroke="currentColor"`,
   `stroke-width="1.7"` mi? Emoji mi kullanılmış?
5. Yön bağımlı CSS (`margin-left`, `left`, `padding-right`) mi yazılmış,
   yoksa mantıksal özellik (`margin-inline-start`, `inset-inline-start`) mi?
6. Görünen metin `data-i18n` ile sözlükten mi geliyor, yoksa HTML'e sabit mi
   yazılmış?
7. Rakam/ücret/istatistik varsa: örnek olarak mı işaretli, yoksa kesin vaat
   gibi mi sunulmuş?
8. Tekrar eden bir bileşen (buton, kart, form alanı) için var olan sınıf
   (`.btn`, `.card`, `.field`...) mu kullanılmış, yoksa yeni ad-hoc bir sınıf
   mı icat edilmiş?

## 1. Renk belirteçleri

| Belirteç | Ne için | Tuzak |
|---|---|---|
| `--bg` / `--bg-soft` / `--bg-card` | zeminler | |
| `--text` / `--text-muted` | metin | |
| `--border` | çizgiler | `--line` diye bir belirteç **yok** |
| `--brand` | kimlik rengi (temaya göre döner: açıkta navy, koyuda aqua) | sabit hex sanılmasın |
| `--brand-2` | yalnızca vurgu (`#00D8C2`) | **metinde asla** — beyaz üzerinde 1,9:1 |
| `--brand-2-ink` | açık zeminde aqua niyetli metin (`#0a7d72`, 5,0:1) | metin aqua istendiğinde buraya çevir |
| `--on-brand` / `--logo-ink` / `--brand-soft` / `--danger` | marka üstü metin / logo halkası / hafif vurgu / hata | |

**Reddet:** ham hex (`#082C54`, `#00D8C2` doğrudan yazımı), aquayı metin
rengi olarak kullanmak, yeni bir ara ton icat etmek.

## 2. Tipografi

Sekiz basamak: `--fs-2xs .76rem · --fs-xs .8rem · --fs-sm .85rem ·
--fs-md .92rem · --fs-base .95rem · --fs-lg 1rem · --fs-xl 1.12rem` +
`--fs-logo` (yalnızca logo). İstisna: başlıkların `clamp()` değerleri ve
`em` göreli boyutlar (ilk harf, `code`).

Yazı tipi: Inter, yerel sunucudan (`assets/fonts/`). **Reddet:** ham `rem`/
`px` punto, Google Fonts ya da başka bir CDN font bağlantısı (GDPR gerekçesi
`assets/fonts/inter.css` başında kayıtlı).

## 3. Boşluk / düzen

- `--radius: 16px`, `--radius-sm: 10px`, `--maxw: 1140px`
- Kırılma noktaları: `1180px · 860px · 620px · 360px` (hepsi `max-width`) —
  yeni bir kırılma noktası açmadan önce bu dördüne oturmayı dene
- Dokunma hedefi **44px** minimum (`.share-btn` bu yüzden 44px)
- **RTL zorunlu:** `margin-left`→`margin-inline-start`, `left`→
  `inset-inline-start`, `padding-right`→`padding-inline-end`,
  `text-align:left`→`text-align:start`. Yeni bir bölüm eklenince Arapça
  görünümü kontrol edilir.
- Tekrar eden bileşen için var olan sınıf deseni kullanılır (§ Kaynaklar
  madde 3'teki tablo); yeni ad-hoc sınıf icat etmeden önce main.css'te
  aynısı olup olmadığına bakılır.

## 4. İkon sistemi

**Emoji yasak** — işletim sistemi çizer, üç platformda üç farklı görünüm
verir. Her ikon satır içi SVG: 24×24 ızgara, `fill="none"`,
`stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak uç/birleşim.
Yazı ikonları `assets/js/app.js → ICONS` kaydında adla durur; kayıtta
olmayan yeni bir ikon gerekiyorsa aynı çizim kuralına uyularak kayda
eklenir, HTML'e rastgele bir SVG yapıştırılmaz.

**İstisna:** `→ ↑ ☾ ☀` — tek renkli, yazı tipiyle çizilen metin işaretleri
(ok, tema düğmesi). Bunlar emoji değil, ikon kuralının dışında.

## 5. İçerik / ses — burada dürüst olalım

**Depoda resmi bir "marka sesi" (tone of voice) belgesi yok.** Ton, cümle
uzunluğu, resmi/samimi tercih hiçbir yerde yazılı değil. Bu beceri var
olmayan bir ses uydurmadan yalnızca **yazılı olan iki kuralı** uygular:

1. **Rakam/ücret dürüstlüğü** (`CLAUDE.md` madde 8) — paket fiyatı, blog
   yazısındaki ücret/istatistik bilgisi araştırma/örnek veridir; kesin vaat
   gibi sunulmaz. Abartılı iddia bu işte en pahalı hata sayılır
   (`docs/proje-gunlugu.md`).
2. **Metin sözlükten gelir** (`CLAUDE.md` madde 1, 3) — görünen her metin
   `data-i18n` ile `i18n.js`'ten gelir, on dile birden eklenir; HTML'deki
   Türkçe yalnızca JS kapalıyken görünen yedektir.

Bunun ötesinde bir "marka sesi" isteniyorsa (resmi mi samimi mi, ikinci
tekil mi çoğul hitap mı), bu beceri karar vermez — kullanıcıya sorulur ve
gerçek bir ton belgesi yoksa bunun eksik olduğu söylenir.

## Reddetme biçimi

Off-brand bir kalıp istendiğinde uzun açıklama yapma; şu üç parçayı ver:

```
Marka kuralı ihlali: [kural, kaynağıyla]
Neden: [bir cümle — ölçü/gerekçe varsa rakamla]
Düzeltme: [somut alternatif]
```

Örnek:

```
Marka kuralı ihlali: buton metni aqua (#00D8C2) ile isteniyor.
Neden: --brand-2 beyaz üzerinde 1,9:1 — WCAG AA'nın (4,5:1) çok altında.
Düzeltme: metin için var(--brand-2-ink) kullan (5,0:1); #00D8C2 yalnızca
vurgu/dekor olarak kalabilir, metin değil.
```

Reddetme, işi durdurmak için değil — aynı istekte kalıp doğru belirteçle
üretmek için. Kullanıcı bilerek kuralı aşmak isterse (örn. tek seferlik bir
deney sayfası) bunu açıkça söylediği an uygula, ama önce ihlali adlandır.

## Bilinen sınırlar

- İçerik/ses bölümü sığ — yukarıda söylendiği gibi gerçek bir ton belgesi
  yok. Biri yazılırsa bu beceriye eklenir.
- `docs/tasarim-sistemi.md` ile `docs/figma-tasarim-kurallari.md` örtüşüyor;
  bu beceri ikisini birleştirmiyor, yalnızca ikisinden de besleniyor.
