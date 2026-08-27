---
name: on-brand
description: QBLOGG marka kurallarını (renk belirteçleri, tipografi ölçeği, boşluk/düzen, ikon ve ses/içerik kuralları) her üretilen içerik veya arayüz parçasına uygular; kural dışı bir kalıp istendiğinde kısa gerekçeyle reddeder. "marka uyumlu mu", "on-brand", "bu renk/yazı boyutu kullanılabilir mi", "bu metin marka sesine uyuyor mu" sorulduğunda ya da herhangi bir HTML/CSS/metin üretiminden önce/sonra bu beceriyi kullan.
owner: QBLOGG
---

# On-brand denetimi

Bu beceri bir tasarım rehberi **değil** — QBLOGG'un zaten var olan marka
kurallarının (`CLAUDE.md`, `docs/tasarim-sistemi.md`,
`.claude/skills/qblogg-blog-yazisi/SKILL.md`) **uygulama katmanı**. Kuralları
burada tekrar tanımlamaz, kaynağından okur ve üretilen her içerik/arayüz
parçasını bunlara karşı denetler. Sayı gibi değişebilecek detaylar (kaç
anahtar, kaç sınıf) burada **hardcode edilmez** — kaynak dosyalar zaten
zamanla kaymış rakamlar içeriyor (`docs/tasarim-sistemi.md` "209 anahtar"
diyor, gerçek sayı artık 252 — bu yüzden burada sayı yerine dosya/komut
gösterilir).

Çelişki olursa sıra: **CLAUDE.md > docs/tasarim-sistemi.md > bu beceri.**

## Ne zaman kullanılır

- Yeni bir HTML/CSS bölümü, bileşen veya sayfa üretilirken/düzenlenirken.
- Blog yazısı, pazarlama metni, sosyal içerik gibi görünür metin üretilirken.
- Figma'dan veya başka bir dış tasarımdan kod çevrilirken.
- Biri açıkça "bu marka kurallarına uyuyor mu" diye sorduğunda.

## Kaynak dosyalar (tek kaynak burada değil, şurada)

| Konu | Kaynak | Not |
|---|---|---|
| Renk/tipografi belirteçleri | `assets/css/main.css` → `:root` ve `html[data-theme="dark"]` blokları | Gerçek değerler için `grep -n "^--" assets/css/main.css` |
| Belirteç açıklamaları, kontrast ölçümleri | `docs/tasarim-sistemi.md` bölüm 1 | Sayılar zaman zaman eskir, `main.css`'i esas al |
| Değişmez üst kurallar | `CLAUDE.md` → "Değişmez kurallar" (madde 2,4,5,8) | Her zaman kazanır |
| İkon kaydı | `assets/js/app.js` → `ICONS` | `grep -n "ICONS = {" -A 20` |
| Ses/içerik kuralları | `.claude/skills/qblogg-blog-yazisi/SKILL.md` | Blog'a özel ama genel ilkeler her metne uygulanır |
| i18n sözlüğü | `assets/js/i18n.js` | 10 dil, anahtar sayısı `grep -c "^  '" assets/js/i18n.js` ile ölç |

---

## 1. Renk

**Kural:** Kod içinde asla ham hex/rgb yazılmaz — her zaman `var(--...)`.

| Belirteç | Ne için | Yasak kullanım |
|---|---|---|
| `--brand` | Kimlik rengi (temaya göre navy↔aqua döner) | Sabit `#082C54` yazmak — koyu temada yanlış kalır |
| `--brand-2` | **Yalnızca vurgu** (nokta, ince çizgi, ikon dolgusu değil) | Metin rengi olarak kullanmak |
| `--brand-2-ink` | Açık zeminde aqua **niyetli metin** | — |
| `--text` / `--text-muted` | Gövde metni / ikincil metin | Sabit gri ton yazmak |
| `--on-brand` | Marka renkli zemin üstü metin | — |

**Reddetme örneği:** "CTA düğmesini `#00D8C2` (aqua) zeminde beyaz metinle yap"
→ **reddet**, gerekçe: *"Aqua beyaz üzerinde 1,9:1 kontrast veriyor, WCAG AA
(4,5:1) altında kalıyor — metin/zemin çifti olarak kullanılamaz. Bunun yerine
`var(--brand)` zemin + `var(--on-brand)` metin, ya da aqua'yı yalnızca ince bir
vurgu çizgisi/nokta olarak kullanabilirim."*

**Mekanik ihlaller** (biri "bu rengi kullan" demeden, sadece hex yapıştırılmış
bir tasarım/kod geldiğinde) sessizce reddedilmez — en yakın belirteçle
**düzeltilir ve not düşülür**: *"`#082c54` → `var(--brand)`'a çevirdim, aynı
değer zaten belirteçte tanımlı."* Reddetme, birinin **bilerek** kural dışı bir
görsel karar istediği durum içindir; mekanik çeviri hatası değildir.

## 2. Tipografi

Sekiz basamaklı ölçek (`--fs-2xs` … `--fs-xl`, artı yalnızca logo için
`--fs-logo`) — kaynak `assets/css/main.css`. Ham `rem`/`px` yazılmaz.

**İstisna (reddetme değil):** başlıkların `clamp()` değerleri, `em` cinsinden
göreli boyutlar (ilk harf, `code`).

**Reddetme örneği:** "Bu başlığı `font-size: 1.4rem` yap" → basamaklara
oturmuyorsa **reddet**, gerekçe: *"1.4rem ölçekteki sekiz basamağın hiçbirine
denk gelmiyor (`--fs-xl` 1.12rem, bir üstü yok). En yakın basamak `--fs-xl`;
gerçekten daha büyük gerekiyorsa `clamp()` ile başlık boyutu tanımlarım,
serbest rem yazmam."*

## 3. Boşluk ve düzen

- Köşe yarıçapı: `var(--radius)` (16px) / `var(--radius-sm)` (10px) — başka
  bir yarıçap değeri icat edilmez.
- İçerik genişliği: `var(--maxw)` (1140px).
- **RTL zorunluluğu** (Arapça 10 dilden biri): yön bağımlı özellik yazılmaz.

  | Yasak | Yerine |
  |---|---|
  | `margin-left` / `margin-right` | `margin-inline-start` / `-end` |
  | `left` / `right` | `inset-inline-start` / `-end` |
  | `padding-left` / `padding-right` | `padding-inline-start` / `-end` |
  | `text-align: left` | `text-align: start` |

- Dokunma hedefi en az **44px**.
- Yeni bir breakpoint açmadan önce mevcut dört noktayı dene (`main.css` içinde
  `@media (max-width: ...)` ile grep'le); `auto-fit`/`minmax` kendiliğinden
  kırılıyorsa breakpoint'e hiç gerek yoktur.

**Reddetme örneği:** "Bu kartın sağına `margin-right: 20px` ekle" → **reddet**,
gerekçe: *"Site Arapça'yı da destekliyor, fiziksel yön özelliği RTL'de ters
döner. `margin-inline-end: 20px` yazıyorum — LTR'de aynı görünür, RTL'de doğru
tarafa geçer."* (Bu, mekanik bir çeviri olduğu için otomatik düzeltilip
bildirilir — reddetmek yerine doğrudan doğrusu yazılır. Israrla fiziksel yön
istenirse ["neden mantıksal özellik gerektiğini"] tekrar açıklayıp önerilen
hâliyle devam edilir.)

## 4. İkon

- **Emoji yasak** — hiçbir görünen ikon emoji olamaz.
- Her ikon: 24×24 ızgara, `fill="none"`, `stroke="currentColor"`,
  `stroke-width="1.7"`, yuvarlak uç/birleşim.
- Yazı/kart ikonu → `assets/js/app.js` `ICONS` kaydına isimle eklenir; sayfa
  ikonu → doğrudan HTML'e gömülür.
- İstisna: `→ ↑ ☾ ☀` gibi tek renkli metin işaretleri (yazı tipiyle çizilir).

**Reddetme örneği:** "Bu özelliğin yanına 🚀 emojisi koy" → **reddet**,
gerekçe: *"Emoji işletim sistemine göre üç farklı görünür, marka kendi
görselinin kontrolünü kaybeder. Aynı fikri anlatan bir çizgi-ikon (örn. `chart`
ya da yeni bir SVG) ekleyebilirim."*

## 5. Ses ve içerik

Kaynak: `CLAUDE.md` madde 8 + `qblogg-blog-yazisi` becerisinin kalite
kuralları. Görünür her metin için geçerli — yalnızca blog değil, pazarlama
metni, buton yazısı, form mesajı da dahil.

| Kural | Gerekçe |
|---|---|
| Rakam/fiyat/kazanç iddiaları **örnek** olarak işaretlenir, kesin vaat gibi yazılmaz | CLAUDE.md madde 8 — "abartılı iddia bu işte en pahalı hata" |
| Doğrulanmamış istatistik, müşteri hikâyesi, kurum şartı **uydurulmaz** | qblogg-blog-yazisi kalite kuralı |
| Somut örnek soyut sıfattan iyidir; dolgu cümle kesilir | Aynı |
| Görünen metin HTML'e sabitlenmez, `data-i18n` ile sözlükten gelir | CLAUDE.md madde 3 |
| Yeni bir i18n anahtarı **10 dilin tamamına** eklenir | CLAUDE.md madde 1 |
| Yeni çeviri yazmadan önce, tekrar eden ürün terimleri (brief, paket, abonelik, revizyon...) için **mevcut çeviriler grep'lenir** — her dilde terim sıfırdan seçilmez | Aksi hâlde aynı kavram için sitede iki farklı kelime dolaşır (bkz. `grep -n "'p1.cta'\|'hero.ctaPrimary'" assets/js/i18n.js` gibi bir tarama) |

**Reddetme örneği:** "Bu pakette 'garanti %300 büyüme' yaz" → **reddet**,
gerekçe: *"Kesin vaat dili CLAUDE.md madde 8'e aykırı — kanıtlanmamış bir
rakam garanti gibi sunulamaz. Bunun yerine 'örnek başlangıç fiyatı' / ölçülmüş
bir vaka çalışmasına bağlı somut bir cümle önerebilirim."*

## Reddetme protokolü

1. **Kural dışı bir görsel/metinsel karar** isteniyorsa (renk, iddia, emoji,
   font boyutu, fiziksel-yön ısrarı) → üretme, **tek satırlık** gerekçe ver:
   hangi kural, neden, ve on-brand alternatif ne.
2. **Mekanik ihlal** ise (hex yapıştırılmış, ham rem yazılmış, `left` kullanılmış
   ama kimse bilerek istemedi) → sessizce reddetme, **doğru hâliyle üret** ve
   tek cümlede ne değiştirdiğini söyle.
3. Emin değilsen (yeni bir belirteç mi lazım, yoksa var olan mı yeterli) →
   üretmeden önce sor; CLAUDE.md'nin "kodlamadan önce düşün" ilkesi burada da
   geçerli.

## Teslimden önce öz-denetim

Herhangi bir içerik/arayüz parçası teslim edilmeden önce hızlıca sorulur:

- [ ] Ham hex/rgb var mı? → `var(--...)`
- [ ] Ham `rem`/`px` font boyutu var mı? → sekiz basamaktan biri
- [ ] Fiziksel yön özelliği (`left`/`right`/`margin-left` vb.) var mı? → mantıksal karşılığı
- [ ] Emoji var mı? → SVG ikon
- [ ] Kesin vaat / doğrulanmamış rakam var mı? → örnek olarak işaretle veya kaynakla
- [ ] Yeni metin `data-i18n` ile mi bağlı, 10 dile mi eklendi, terim tutarlı mı?

Hepsi geçtiyse `npm run check` + `npm run guvenlik` çalıştırılır (UI/HTML
değişikliğiyse) — bu beceri onların yerine geçmez, önüne bir gerekçeli kapı
koyar.
