---
name: on-brand
description: Enforces QBLOGG's real, measured brand rules — color tokens, typography scale, spacing/radius, icon system, RTL, and voice/content discipline — on ANY content or UI generated for this repo (HTML/CSS snippets, landing sections, UI components, blog copy, marketing text, ads, social posts). Invoke this BEFORE delivering visual or written output for QBLOGG, even when the user didn't ask for a "brand check" by name — it catches raw hex colors, ad-hoc font sizes, emoji-as-icon, direction-dependent CSS (margin-left/right), Google Fonts links, hyped or absolute claims, and unverified numbers/sources. Refuses off-brand patterns with a one-line reason plus the on-brand fix, instead of silently shipping them.
owner: QBLOGG
---

# on-brand — QBLOGG marka denetçisi

QBLOGG için üretilen her görsel/metin çıktının, depodaki **ölçülmüş** marka
kurallarına uyup uymadığını denetler. Kural uydurmaz — hepsi şu kaynaklardan
damıtıldı, çelişkide bu sıra kazanır:

1. `CLAUDE.md` — Değişmez kurallar (renk, ikon, dil bütünlüğü, sayı disiplini)
2. `docs/tasarim-sistemi.md` + `assets/css/main.css` (gerçek `:root` değerleri) — token'lar, bileşen kalıpları, RTL
3. `.claude/skills/qblogg-blog-yazisi/SKILL.md` — yazı sesi ve kalite kuralları

**Ayrı bir "marka sesi" belgesi yok** — kalite kuralları + CLAUDE.md'nin
uydurma/abartı yasağı QBLOGG'un fiili ses kuralıdır. Bu beceri sayı/hex
ezberlemez, **kuralı** ezberler — tam token listesi ve güncel ölçümler her
zaman `docs/tasarim-sistemi.md`'de yaşar. Bir token değeri gerekiyorsa (örn.
"bu hex hangi değişkene karşılık geliyor?") o dosyayı oku; buraya kopyalama,
kopya iki kaynaklı gerçeği birbirinden kaydırır.

## Ne zaman devreye girer

Kullanıcı `/on-brand` yazmasa da devreye gir: bir HTML parçası, CSS kuralı,
UI bileşeni, blog taslağı, pazarlama metni, sosyal paylaşım veya reklam metni
**bu marka için** üretilecekse, teslim etmeden önce aşağıdaki listeyi geç.

## Neden bu bir "reddet" becerisi, "düzelt" becerisi değil

Sessizce düzeltmek iki sorun yaratır: kullanıcı neyin yanlış olduğunu
öğrenmez (aynı hatayı tekrar ister), ve bazen "düzeltme" kullanıcının asıl
istediğini kaybeder. Bunun yerine: **kısa gerekçeyle reddet, sonra
marka-uyumlu alternatifi hemen sun** — tek cümlelik gerekçe + çözüm, ikisi
aynı yanıtta, ayrı bir tur beklemeden.

## UI/görsel kontrol listesi

Her biri için: bul → reddet (kısa gerekçe) → marka-içi karşılığını öner.

| Kontrol | Reddetme sebebi (örnek) | Marka-içi karşılık |
|---|---|---|
| Ham hex renk (`#fff`, `color: #082C54`) | "Ham hex kullanılamaz — koyu tema kendiliğinden çalışmaz" | `var(--brand)`, `var(--text)` vb. — tam liste `tasarim-sistemi.md` §1 |
| Aqua (`--brand-2` / `#00D8C2`) metinde | "Aqua beyaz üzerinde 1,8:1 — WCAG AA'nın (4,5:1) çok altında, metinde kullanılamaz" | `var(--brand-2-ink)` (#0a7d72, 4,4:1) |
| Ham `rem`/`px` yazı boyutu | "Yazı ölçeği sekiz basamağa oturur, ham değer tırtıklı hizalama üretir" | `var(--fs-2xs)`…`var(--fs-xl)` (başlık `clamp()`, `em` göreli boyutlar ve `--fs-logo` istisna) |
| Emoji ikon olarak kullanılmış | "Emoji'yi işletim sistemi çizer — üç platformda üç görünüm, marka kontrolü kaybolur" | Satır içi SVG: 24×24, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak uç/birleşim. İstisna: `→ ↑ ☾ ☀` gibi tek renkli yazı-tipi işaretleri |
| Yön bağımlı CSS (`margin-left`, `left`, `padding-right`) | "Arapça RTL'de kırılır — yön bağımsız özellik zorunlu" | `margin-inline-start`, `inset-inline-start`, `padding-inline-end`, `text-align: start` |
| Google Fonts / dış CDN linki | "Sıfır bağımlılık kuralı + ziyaretçi IP'sini Google'a gönderir (Münih Bölge Mahkemesi, 3 O 17493/20) — CSP `connect-src` da sessizce engeller" | Yerelde barındırılan `assets/fonts/` (Inter); yeni servis gerekiyorsa vendor'la ve `vercel.json` CSP'sini güncelle |
| Yeni bileşen türü icat edilmiş (çatı/kütüphane yok) | "Bu repoda bileşen çatısı yok; tekrar eden sınıf kalıpları var" | Var olan kalıba otur: `.btn`(+`--primary/--ghost/--block/--lg`), `.card`, `.plan`(+`--featured`), `.section`(+`--soft`), `.wrap`, `.tag`/`.chip`, `.field`, `.article-body`, `.table-wrap` |
| Dokunma hedefi 44px altı | "Mobilde dokunma hedefi 44px zorunlu" | Buton/etkileşim alanını 44px'e çıkar |
| Metin doğrudan HTML'e gömülü | "Görünen metin sözlükten gelir, tek dilde gömmek en sık yapılan hata" | `data-i18n="anahtar"` + anahtarı 10 dilde `i18n.js`'e ekle |
| Çıplak `minmax(Xpx, 1fr)` ızgara | "Küçük ekranda yatay taşma üretir" | `minmax(min(Xpx, 100%), 1fr)` |

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

> İstek: "Butonu #00D8C2 renginde, üzerinde beyaz yazıyla yap."
> Yanıt: Reddediyorum — aqua (#00D8C2) beyaz üzerinde 1,8:1 kontrast veriyor,
> WCAG AA'nın çok altında ve koyu temada bozulur. Bunun yerine
> `background: var(--brand); color: var(--on-brand)` kullanıyorum — aynı
> marka hissi, okunabilir ve tema-uyumlu.

> İstek: "Bu pakette kesin olarak %300 daha fazla trafik garantisi verelim."
> Yanıt: Reddediyorum — kesin/garanti dili bu projenin uydurma yasağını
> ihlal ediyor (CLAUDE.md, rakamlar örnek olarak işaretlenir). Bunun yerine
> "örnek senaryomuzda trafik böyle arttı" gibi ölçülmüş, kaynaklı bir ifade
> öneriyorum.

Reddetme, teslimatı durdurmaz — ihlali marka-içi karşılığıyla değiştirip
teslim et. Yalnızca karşılığı belirsizse (örn. yeni bir renk tonu markaya
"yakın" ama hangi token'a yuvarlanacağı net değilse) kullanıcıya sor; bu bir
ret değil bir uyarıdır.

## Nasıl uygulanır

1. İçerik/arayüz taslağını üretmeden **önce** hangi kontrol listelerinin
   ilgili olduğuna bak — bir buton isteniyorsa UI listesinin renk/aralık/ikon
   satırları, bir paragraf isteniyorsa ses listesi, tam bir bölüm isteniyorsa
   ikisi de.
2. İstekte açık bir ihlal varsa — **önce reddet** (bir cümle, hangi kural),
   **sonra marka-uyumlu alternatifi üret**, aynı yanıtta.
3. İhlal yoksa sessizce devam et — her üretimin başına bu listeyi yapıştırmak
   gürültü olur. Yalnızca gerçek bir ihlal varsa konuş.
4. Çıktıyı vermeden önce iki tabloyu bir kez daha, bu sefer kendi
   ürettiğin metne/koda karşı çalıştır. Bir skill kuralları yazıp onları
   uygulamayı unutmak, hiç yazmamaktan daha kötü bir izlenim bırakır — bu son
   geçiş 30 saniyelik, atlanmaması gereken bir adım.

## Kapsam dışı

- Marka varlığı üretimi (logo/ikon dosyaları) — `scripts/marka-uret.py`'nin işi, elle SVG/PNG eklenmez
- Tescil/hukuk kararları — `docs/marka-tescili.md`
- Tam blog yazısı üretim yöntemi — `qblogg-blog-yazisi` becerisi
