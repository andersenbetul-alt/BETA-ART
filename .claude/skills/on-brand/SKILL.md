---
name: on-brand
description: Enforces QBLOGG's real, measured brand rules — color tokens, typography scale, spacing/radius, icon system, RTL, and voice/content discipline — on ANY content or UI generated for this repo (HTML/CSS snippets, landing sections, UI components, blog copy, marketing text, ads, social posts). Invoke this BEFORE delivering visual or written output for QBLOGG, even when the user didn't ask for a "brand check" by name — it catches raw hex colors, ad-hoc font sizes, emoji-as-icon, direction-dependent CSS (margin-left/right), hyped or absolute claims, and unverified numbers/sources. Refuses off-brand patterns with a one-line reason plus the on-brand fix, instead of silently shipping them.
owner: QBLOGG
---

# On-brand kapısı

QBLOGG için üretilen her görsel/metin çıktının, depodaki **ölçülmüş** marka
kurallarına uyup uymadığını denetler. Kural uydurmaz — hepsi şu üç kaynaktan
gelir, çelişkide bu sıra kazanır:

1. `CLAUDE.md` — Değişmez kurallar (renk, ikon, dil bütünlüğü, sayı disiplini)
2. `docs/tasarim-sistemi.md` + `docs/figma-tasarim-kurallari.md` — token'lar, bileşen kalıpları, RTL
3. `.claude/skills/qblogg-blog-yazisi/SKILL.md` — yazı sesi ve kalite kuralları

Bu beceri sayı/hex ezberlemez, **kuralı** ezberler — tam token listesi ve
güncel ölçümler her zaman `docs/tasarim-sistemi.md`'de yaşar. Bir token değeri
gerekiyorsa (örn. "bu hex hangi değişkene karşılık geliyor?") o dosyayı oku;
buraya kopyalama, kopya iki kaynaklı gerçeği birbirinden kaydırır.

## Ne zaman devreye girer

Kullanıcı `/on-brand` yazmasa da devreye gir: bir HTML parçası, CSS kuralı,
UI bileşeni, blog taslağı, pazarlama metni, sosyal paylaşım veya reklam metni
**bu marka için** üretilecekse, teslim etmeden önce aşağıdaki listeyi geç.

## UI/görsel kontrol listesi

Her biri için: bul → reddet (kısa gerekçe) → marka-içi karşılığını öner.

| Kontrol | Reddetme sebebi (örnek) | Marka-içi karşılık |
|---|---|---|
| Ham hex renk (`#fff`, `color: #082C54`) | "Ham hex kullanılamaz — koyu tema kendiliğinden çalışmaz" | `var(--brand)`, `var(--text)` vb. — tam liste `tasarim-sistemi.md` §1 |
| Aqua (`--brand-2` / `#00D8C2`) metinde | "Aqua beyaz üzerinde ~1,9:1 — WCAG AA'nın (4,5:1) altında, metinde kullanılamaz" | `var(--brand-2-ink)` |
| Ham `rem`/`px` yazı boyutu | "Yazı ölçeği yedi basamağa oturur, ham değer tırtıklı hizalama üretir" | `var(--fs-xs)`…`var(--fs-xl)` (başlık `clamp()` ve `em` göreli boyutlar istisna) |
| Emoji ikon olarak kullanılmış | "Emoji'yi işletim sistemi çizer — üç platformda üç görünüm, marka kontrolü kaybolur" | Satır içi SVG: 24×24, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak uç/birleşim. İstisna: `→ ↑ ☾ ☀` gibi tek renkli yazı-tipi işaretleri |
| Yön bağımlı CSS (`margin-left`, `left`, `padding-right`) | "Arapça RTL'de kırılır — yön bağımsız özellik zorunlu" | `margin-inline-start`, `inset-inline-start`, `padding-inline-end`, `text-align: start` |
| Yeni bileşen türü icat edilmiş (çatı/kütüphane yok) | "Bu repoda bileşen çatısı yok; tekrar eden sınıf kalıpları var" | Var olan kalıba otur: `.btn`(+`--primary/--ghost/--block/--lg`), `.card`, `.plan`(+`--featured`), `.section`(+`--soft`), `.wrap`, `.tag`/`.chip`, `.field`, `.article-body`, `.table-wrap` — tam liste `figma-tasarim-kurallari.md` §2 |
| Dokunma hedefi 44px altı | "Mobilde dokunma hedefi 44px zorunlu" | Buton/etkileşim alanını 44px'e çıkar |
| Metin doğrudan HTML'e gömülü | "Görünen metin sözlükten gelir, tek dilde gömmek en sık yapılan hata" | `data-i18n="anahtar"` + anahtarı 10 dilde `i18n.js`'e ekle |
| Yeni dış servis/CDN/font bağlantısı | "Sıfır bağımlılık kuralı + CSP `connect-src` sessizce engeller" | Vendor'la veya reddet; gerekiyorsa `vercel.json` CSP güncellemesini de iste |

## Ses/içerik kontrol listesi

| Kontrol | Reddetme sebebi (örnek) | Marka-içi karşılık |
|---|---|---|
| Doğrulanmamış istatistik, vaka, kurum şartı | "Uydurma yasak — bu iddianın kaynağı yok" | Ya kaynak bul (`src` alanına `u` ile), ya da "adres doğrulanmadı" notuyla (`nu`) yaz, ya da iddiayı çıkar |
| Kesin/abartılı vaat ("garantili", "kesinlikle 3 kat büyür") | "Rakamlar örnek olarak işaretlenir; kesin vaat bu işte en pahalı hata" | "örnek/tipik" diliyle yaz, aralık ver, varsayımı işaretle |
| Genel/soyut iddia beş sıfatla süslenmiş | "Özgül olan geneli yener — somut örnek daha güçlü" | Tek gerçek örneğe/rakama indir |
| Blog yazısı `orig` (özgün katkı) olmadan | "Özgün katkısı olmayan yazı `gorunurluk.mjs` kapısından geçmez, yayınlanamaz" | Kendi veri/test/tablo ekle veya kapsamı daralt |
| Blog yazısı 3'ten az kaynakla (para/kariyer konusu) | "Para/kariyer konusunda üç kaynak kural, öneri değil" | Kaynak ekle veya konuyu değiştir |
| Dolgu cümle, boğaz temizleme girişi | "Değerle açılmıyor — okur üç paragraf bekletiliyor" | Kancayla aç, getiriyi baştan söyle |

Tam yöntem (iskelet, optimize etme, düzeltme adımları) blog yazısı içinse
`qblogg-blog-yazisi` becerisine devret — bu liste onun da uyduğu ortak zemin.

## Nasıl reddet

Kısa, tek cümle, hangi kural + neden + karşılığı. Uzun ders verme, akışı
durdurma:

> Reddedildi: `color: #00D8C2` metin rengi olarak kullanılmış — beyaz üzerinde
> ~1,9:1 kontrast, WCAG AA'nın altında. `var(--brand-2-ink)` ile değiştirdim.

Reddetme, teslimatı durdurmaz — ihlali marka-içi karşılığıyla değiştirip
teslim et. Yalnızca karşılığı belirsizse (örn. hangi token'a yuvarlanacağı
net değilse) kullanıcıya sor.

## Teslimden önce son geçiş

Çıktıyı vermeden önce yukarıdaki iki tabloyu bir kez daha, bu sefer kendi
ürettiğin metne/koda karşı çalıştır. Bir skill kuralları yazıp onları
uygulamayı unutmak, hiç yazmamaktan daha kötü bir izlenim bırakır — bu son
geçiş 30 saniyelik, atlanmaması gereken bir adım.

## Kapsam dışı

- Marka varlığı üretimi (logo/ikon dosyaları) — `scripts/marka-uret.py`'nin işi, elle SVG/PNG eklenmez
- Tescil/hukuk kararları — `docs/marka-tescili.md`
- Tam blog yazısı üretim yöntemi — `qblogg-blog-yazisi` becerisi
