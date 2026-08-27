---
name: on-brand
description: QBLOGG marka kurallarını (renk belirteçleri, tipografi, boşluk, ikon, ses/üslup) her içerik veya arayüz üretiminde uygular; marka dışı örüntüleri kısa gerekçeyle reddeder/düzeltir. Sayfa, bileşen veya CSS üretirken, blog yazısı/pazarlama metni/form kopyası yazarken, ya da bir PR/diff'i marka uygunluğu için gözden geçirirken MUTLAKA bu beceriyi kullan.
owner: QBLOGG
---

# Marka uygunluğu (on-brand)

Bu beceri yeni bir kural seti yazmaz — depodaki dağınık marka kurallarını
(çoğu ölçülmüş, `docs/tasarim-sistemi.md`'de kanonik) uygulama anında tek
yerden çalıştırır ve eksik olan iki parçayı ekler: **ses/üslup** kuralları
(hiçbir yerde ayrı belge değildi, `qblogg-blog-yazisi` + CLAUDE.md madde
8'den derlendi) ve **boşluk** ölçeği (biçimsel bir token seti yok — bu,
`main.css`'teki gerçek değerlerden çıkarılmış gözlenen ritim).

Çelişkide sıra: **CLAUDE.md "Değişmez kurallar" > docs/tasarim-sistemi.md >
bu belge.** Bu belge hiçbirini geçersiz kılmaz, sadece uygulama anına taşır.

## Ne zaman kullanılır

- Yeni bir sayfa bölümü, bileşen, CSS kuralı veya HTML parçası üretilirken.
- Blog yazısı, form kopyası, hata mesajı, e-posta/newsletter metni yazılırken.
- Figma'dan (veya başka bir dış kaynaktan) tasarım kod'a çevrilirken.
- Bir PR/diff'in marka uygunluğu için gözden geçirilmesi istendiğinde.

## Kaynak hiyerarşisi (kopyalama, referans ver)

| Konu | Kanonik kaynak |
|---|---|
| Renk, tipografi, ikon, RTL, erişilebilirlik | `docs/tasarim-sistemi.md` |
| Figma'ya özel okuma | `docs/figma-tasarim-kurallari.md` |
| Değişmez kurallar (1–8) | `CLAUDE.md` |
| Blog yazısı yöntemi | `.claude/skills/qblogg-blog-yazisi/SKILL.md` |

Tam detay/ölçüm için bu dosyaları aç. Aşağıdaki özet yalnızca **hızlı
denetim** ve **reddetme gerekçeleri** için.

---

## 1. Renk

Tek kaynak `assets/css/main.css` `:root` + `html[data-theme="dark"]`. Ham hex
yazılmaz, `var(--...)` kullanılır.

| Belirteç | Kural |
|---|---|
| `--brand` | Kimlik rengi — açıkta Midnight Navy, koyuda Electric Aqua (temaya göre döner, sabit hex değil) |
| `--brand-2` (`#00D8C2`) | **Yalnızca vurgu** — beyaz üzerinde 1,9:1, metinde yasak |
| `--brand-2-ink` (`#0a7d72`) | Açık zeminde aqua niyetli metin — buradan kullan |
| `--on-brand`, `--text`, `--text-muted`, `--border`, `--bg*`, `--danger` | Bağlama göre; ham hex yerine bunlar |

**Reddet:** ham hex kod, aqua'nın metinde kullanımı, listede olmayan yeni bir ton icadı.

## 2. Tipografi

Sekiz basamak, ham `rem`/`px` yok: `--fs-2xs .76 · --fs-xs .8 · --fs-sm .85 ·
--fs-md .92 · --fs-base .95 · --fs-lg 1 · --fs-xl 1.12rem` (+ `--fs-logo`
yalnız logo). İstisna: başlık `clamp()` değerleri, `em` göreli boyutlar.

**Reddet:** basamağa oturmayan serbest punto değeri.

## 3. Boşluk (gözlenen ölçek — biçimsel token yok)

`main.css`'te ayrı bir `--space-*` seti **yok**; ama gerçek kullanım tutarlı
bir ritme oturuyor. Yeni bir bileşen yazarken **rastgele bir px değeri
seçmek yerine** en yakın gözlenen değeri kullanın:

| Bağlam | Gözlenen değerler |
|---|---|
| Küçük `gap` (ikon+metin, chip içi) | 4–10px (en sık: 8px) |
| Orta `gap` (kart/liste grid'i) | 14–20px (en sık: 18px) |
| Kompakt kontrol `padding` (buton, input) | dikey 9–14px, yatay 14–26px |
| Kart `padding` | 18–30px |
| Konteyner | `.wrap`: `max-width: var(--maxw)` (1140px), `padding-inline: 22px` |
| Bölüm dikey ritmi | `padding-block: clamp(56px, 8–9vw, 104–112px)` |
| Dokunma hedefi (zorunlu alt sınır) | 44px |
| Kırılma noktaları | `1180 / 860 / 620 / 360px` (hepsi `max-width`) — yeni breakpoint açmadan önce bu dördüne oturmayı dene |

**Reddet:** bu dörtlünün dışında yeni bir breakpoint; 44px altı dokunma hedefi;
kart/buton için yukarıdaki aralıkların dışında keyfi bir padding değeri
(gerekçe yoksa).

## 4. İkon

Emoji yasak — her ikon satır içi SVG: **24×24 ızgara, `fill="none"`,
`stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak uç/birleşim**.
Yazı ikonları `assets/js/app.js → ICONS` kaydında adla durur. İstisna:
`→ ↑ ☾ ☀` yazı tipiyle çizilen tek renkli işaretler.

**Reddet:** emoji, sabit renkli (`currentColor` olmayan) ikon, 24×24 dışı ızgara.

## 5. Ses ve üslup

Ayrı bir "brand voice" belgesi yoktu — bu, `qblogg-blog-yazisi` skill'inin
kalite kuralları + `CLAUDE.md` madde 8'in birleşimi:

- **Değerle aç.** Cevabı/kancayı baştan ver; boğaz temizleme paragrafı yok.
- **Somut, genelin önüne geçer.** Bir gerçek örnek/rakam/tablo, beş sıfattan iyidir.
- **Kesin vaat dili yasak.** Fiyat, oran, süre gibi rakamlar örnek/araştırma
  verisi olarak işaretlenir ("örnek başlangıç fiyatı", "araştırma verisi") —
  garanti gibi sunulmaz.
- **Uydurma yasak.** Doğrulanmamış istatistik, müşteri hikâyesi, kurum şartı
  (regülasyon, ödül, sertifika) yazılmaz. Kaynak yoksa cümle de yok.
- **Dolgu cümle kesilir.** Anlam kaybetmeden çıkarılabilen her şey çıkarılır.
- **Tek iş, tek yazı.** Bir metin üç şey yapmaya çalışıyorsa bölünür.

**Reddet:** "garantili", "kesin", "%X artış" gibi kaynaksız kesin iddia;
uydurulmuş istatistik/vaka/kurum şartı; dolgu açılış paragrafı.

## 6. Yapısal marka kuralları (UI'a özgü, sesle değil biçimle ilgili)

- **HTML'de sabit metin yok.** Görünen her metin `data-i18n` ile sözlükten
  gelir; HTML'deki metin yalnızca JS-kapalı yedektir.
- **Yön bağımlı CSS yazılmaz.** `margin-left/right`, `left/right` değil;
  `margin-inline-start`, `inset-inline-start` vb.
- **Yeni bağımlılık/CDN/bundler eklenmez** — depo sıfır bağımlılık kararına
  dayanıyor (CLAUDE.md). Gerekçesiz "en kolay yol bu paketi eklemek" kabul edilmez.
- **Sayfa iskeleti (menü/altbilgi) altı dosyada tekrar eder** — biri
  değişirse altısı birden güncellenir.

---

## Reddetme tablosu — kısa gerekçe kalıpları

Off-brand bir örüntü tespit edildiğinde **sessizce üretme**: marka içi
karşılığına çevir ve tek satırlık gerekçeyi ekle. Kullanıcı gerekçeyi
gördükten sonra ısrar ederse (bilinçli override), o tek seferlik isteği
uygula ama gerekçeyi kayıttan silme.

| Off-brand örüntü | Kısa gerekçe |
|---|---|
| Ham hex kod | "Token yerine ham hex — koyu tema kırılır, `var(--brand)` kullanılmalı." |
| Aqua metin rengi | "Aqua metinde 1,9:1 kontrast veriyor, WCAG AA'yı geçmiyor — `--brand-2-ink` kullanılmalı." |
| Emoji ikon | "Emoji marka kontrolünü işletim sistemine bırakıyor — 24×24 satır içi SVG gerekiyor." |
| Basamak dışı font-size | "Serbest punto tırtıklı hizalama üretiyor — en yakın `--fs-*` basamağına oturtulmalı." |
| Yön bağımlı CSS (`left`, `margin-right`) | "Arapça (RTL) sayfada kırılır — mantıksal özellik kullanılmalı." |
| HTML'e gömülü sabit metin | "Diğer 9 dilde görünmez — `data-i18n` anahtarı gerekiyor." |
| Yeni CSS framework/paket/CDN önerisi | "Depo sıfır bağımlılık kararına dayanıyor — gerekçesiz yeni bağımlılık eklenmez." |
| Kaynaksız kesin rakam/vaat | "Rakam örnek veri; kesin vaat gibi sunulamaz — kaynak veya 'örnek' ibaresi gerekli." |
| Uydurulmuş istatistik/vaka/kurum şartı | "Doğrulanmamış iddia — uydurma yasak, kaynak gösterilmeli ya da çıkarılmalı." |
| Yeni token/renk/punto icadı | "Mevcut belirteç setinin dışına çıkıyor — en yakın belirteci kullan, yenisini icat etme." |
| Rastgele breakpoint/padding değeri | "Gözlenen ritmin dışında — bölüm 3'teki en yakın değere otur." |

---

## Teslimden önce öz-denetim

Üretilen her içerik/UI parçasını teslim etmeden önce yukarıdaki 6 bölümü
tek tek geç: renk token'lı mı, punto basamakta mı, boşluk gözlenen aralıkta
mı, ikon SVG kuralına uyuyor mu, metin `data-i18n`'li mi, ses kuralları
(kesin vaat yok, uydurma yok, dolgu yok) tutuyor mu. Herhangi biri
tutmuyorsa reddetme tablosundaki gerekçeyle düzelt, sonra teslim et.
