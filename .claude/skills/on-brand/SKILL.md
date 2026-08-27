---
name: on-brand
description: QBLOGG için marka denetim kapısı — renk belirteçleri, yazı ölçeği, boşluk/dokunma hedefi, ikon kuralı ve içerik bütünlüğü (ses/voice) kurallarını, üretilen her içerik veya arayüz parçasına karşı denetler; kural ihlali varsa sessizce geçmez, kısa gerekçeyle ya düzeltir ya reddeder. Şu durumlarda MUTLAKA kullan: yeni bir HTML/CSS bileşeni, sayfa bölümü veya Figma çevirisi üretirken; pazarlama/blog/sosyal metni yazarken; "bu markaya uygun mu", "on-brand mi", "renk/tipografi/boşluk kontrol et" denildiğinde; herhangi bir görsel veya metin çıktısını QBLOGG adına yayına hazırlarken.
owner: QBLOGG
version: 0.1.0
---

# on-brand — QBLOGG marka denetim kapısı

Bu beceri yeni bir kural kaynağı **değildir** — kurallar zaten
`docs/tasarim-sistemi.md` ve `docs/figma-tasarim-kurallari.md`'de var ve
oradan **tek kaynak** olarak okunur, burada kopyalanmaz. Bu beceri onların
üstüne bir **denetim/reddetme katmanı** koyar: bir şey üretilirken bu
listeye karşı çalıştırılır, mekanik ihlaller kısa gerekçeyle otomatik
düzeltilir, yargı gerektirenler kısa gerekçeyle işaretlenip sorulur.

**Kapsam notu:** Bu beceri **QBLOGG**'un markasını denetler — bu depodaki
tek gerçek, ölçülü tasarım sistemi bu. `docs/beta-art-konsept.md`'de
tanımlanan "Beta Art" ürünü henüz kendi renk/tipografi/ses sistemine sahip
değil (§M'de açık karar); o ürün için ayrı belirteçler kurulunca bu
beceriye ikinci bir bölüm eklenmeli, şimdilik burada yok.

## Nasıl çalışır

Bir HTML/CSS parçası, bir bileşen, bir pazarlama/blog metni veya bir
Figma çevirisi üretmeden önce (ya da üretildikten hemen sonra, teslim
etmeden önce) aşağıdaki tabloyu satır satır kontrol et. Her satır için:

- **Mekanik ihlal** (belirteç, ölçek, ikon, yön, dokunma hedefi) →
  **otomatik düzelt**, ama sessizce değil: kullanıcıya/çıktıya tek satırlık
  gerekçe ekle ("`#00D8C2` metin renginde kullanılamaz [1.9:1] →
  `var(--brand-2-ink)`'e çevrildi [5.0:1]").
- **Yargı gerektiren ihlal** (ses/voice, kaynaksız iddia) → **durdur ve
  sor** ya da açıkça "bu satır kaynaksız, kaldırdım" de; asla sessizce
  geçme veya sessizce uydurma bir kaynak ekleme.

## 1. Renk

| Kontrol | İhlal örneği | Kısa gerekçe → düzeltme |
|---|---|---|
| Ham hex mi? | `color: #082C54` | "Ham hex; koyu tema kırılır → `var(--brand)`" |
| Aqua metinde mi? | `color: #00D8C2` bir metinde | "`#00D8C2` beyazda 1.9:1, WCAG AA altı → `var(--brand-2-ink)` (5.0:1)" |
| Belirteç dışı yeni ton mu? | Depoda olmayan bir mavi/yeşil | "Yeni ara ton yok → en yakın belirtece yuvarla" |

Tam belirteç listesi ve kontrast ölçümleri: `docs/tasarim-sistemi.md` §1,
`docs/figma-tasarim-kurallari.md` §1.

## 2. Tipografi

| Kontrol | İhlal örneği | Kısa gerekçe → düzeltme |
|---|---|---|
| Ham `rem`/`px` mi? | `font-size: 0.9rem` | "Ölçek dışı → en yakın basamak (`--fs-md` .92rem)" |
| Sekiz basamağın dışında mı? | `.83rem` gibi ara bir değer | "Sekiz basamağa oturmuyor → yuvarla" |
| `--fs-logo` sistemin dışında kullanılıyor mu? | Logo dışı bir yerde `--fs-logo` | "Bu belirteç yalnız logo oranı için, başka yerde kullanılmaz" |

İstisna (denetim gerektirmez): başlıkların `clamp()` değerleri, `em`
göreli boyutlar (ilk harf, `code`).

## 3. Boşluk / dokunma hedefi

| Kontrol | İhlal örneği | Kısa gerekçe → düzeltme |
|---|---|---|
| Yön bağımlı özellik mi? | `margin-left`, `left`, `padding-right` | "RTL'de kırılır → `margin-inline-start` / `inset-inline-start` / `padding-inline-end`" |
| Dokunma hedefi <44px mi? | 32px'lik bir düğme/ikon linki | "Erişilebilirlik tabanı 44px altında → büyüt" |
| `--maxw`/`--radius` dışı sabit değer mi? | `max-width: 1200px` gibi elle yazılmış | "Belirteçten sap → `var(--maxw)`/`var(--radius)`" |
| Yeni bir breakpoint mı açılıyor? | `@media (max-width: 700px)` | "Mevcut dört basamağa (1180/860/620/360) oturmuyor mu, önce onu dene" |

## 4. İkon

| Kontrol | İhlal örneği | Kısa gerekçe → düzeltme |
|---|---|---|
| Emoji mi? | 💡 ✅ 🚀 | "Emoji yasak (OS'e göre değişir) → `ICONS` kaydından SVG veya 24×24/`stroke-width:1.7`/`currentColor` kuralına göre yeni ikon" |
| Sabit renkli SVG mi? | `fill="#082C54"` içeren ikon | "İkon `currentColor` kullanmalı ki tema değişince dönsün" |
| 24×24 dışı ızgara mı? | `viewBox="0 0 32 32"` | "Sabit ızgara 24×24; ölçekle" |

## 5. Metin bütünlüğü (i18n)

| Kontrol | İhlal örneği | Kısa gerekçe |
|---|---|---|
| HTML'e sabit metin mi gömüldü? | `<h2>Paketler</h2>` (anahtar yok) | "Görünen metin `data-i18n` ile sözlükten gelmeli; HTML'deki metin yalnız JS-kapalı yedek" |
| Yeni anahtar 10 dilin hepsinde mi? | Yalnız `tr`/`en`'de eklendi | "Eksik dilde sessizce İngilizceye düşer — bu güvenlik ağı, çözüm değil; 10 dile birden ekle" |

## 6. Ses / voice — dürüst bir not

**Bu depoda QBLOGG için tek, adı konmuş bir "marka tonu" belgesi yok** —
`docs/beta-art-konsept.md`'deki "Marka tonu" bölümü **Beta Art**'a ait,
farklı ve henüz kurulmamış bir ürüne. QBLOGG'un yazdığı içerik için
gerçekten var olan, ölçülü kurallar şunlar — voice denetimi bunlarla
sınırlı, uydurulmuş bir "ton kılavuzu" değil:

| Kontrol | Kaynak | Kısa gerekçe |
|---|---|---|
| Kaynaksız istatistik/alıntı/iddia var mı? | CLAUDE.md kural 8, `engine/visibility.mjs` | "Doğrulanmamış iddia yazılmaz; kaynak yoksa 'örnek/tahmin' işaretle ya da kaldır" |
| Fiyat/rakam kesin vaat gibi mi sunuluyor? | CLAUDE.md kural 8 | "Rakamlar örnek/başlangıç fiyatı olarak işaretlenir, kesin taahhüt gibi yazılmaz" |
| Yazı "önce cevap" yapısında mı başlıyor? | `engine/visibility.mjs` görünürlük kapısı | "Giriş paragrafı boşalma/lafı dolandırma içeriyorsa, doğrudan cevapla aç" |
| `**vurgu**` kaçırma sırası doğru mu? | CLAUDE.md — "kaçırma önce, çeviri sonra" | "Sıra bozulursa vurgu işareti HTML enjeksiyonuna açılır" |
| Emoji metinde mi kullanılmış? | CLAUDE.md kural 4 | "Metinde de emoji yasak — madde 4 yalnız ikonlara özel değil" |

**Eğer daha katı bir ses/tonu denetimi istiyorsan** (cümle uzunluğu,
resmiyet seviyesi, "biz" mi "sen" mi hitap vb.) — bunun için gerçek bir
kaynak yok; ya `docs/`'a yeni bir `ses-tonu.md` yazıp burayı ona
yönlendir, ya da hangi yayınlanmış QBLOGG yazısını örnek aldığını söyle,
oradan çıkarım yaparım. Var olmayan bir kuralı varmış gibi uygulamak,
projenin kendi "uydurma yasağı" ilkesine aykırı olur.

## Kapsam ve dağıtım notu

Bu beceri şu an yalnız bu depoda (`BETA-ART/.claude/skills/on-brand/`)
yaşıyor — Claude Code onu bu depo içinde çalışan her oturumda otomatik
keşfeder. "Paylaşılan beceri" ile birden fazla depo/organizasyon arasında
paylaşmayı kastediyorsan, bunun bir eklenti (plugin) olarak paketlenmesi
gerekir; şu an öyle değil. İstersen bu adımı ayrıca yaparım.
