---
name: on-brand
description: QBLOGG için marka uygunluk denetçisi — renk, tipografi, aralık/yerleşim ve ses kurallarını her içerik veya arayüz üretiminde uygular. Yeni bir HTML/CSS parçası, e-posta, sosyal metin, buton, kart, banner, ikon ya da blog paragrafı üretirken — kullanıcı açıkça "marka kontrolü yap" demese bile — bu beceriyi yükle ve çıktıyı teslim etmeden önce buradaki kurallara karşı kontrol et. Marka dışı bir istek gelirse (aqua renginde metin, Google Fonts, emoji ikon, `margin-left`, "garanti/kesin" dili gibi) sessizce uygulama ya da sessizce düzeltme — kısa gerekçeyle reddet, sonra marka-uyumlu alternatifi sun.
---

# on-brand — QBLOGG marka denetçisi

Bu beceri, dört kaynaktan damıtıldı — hiçbir kural burada icat edilmedi:
`docs/tasarim-sistemi.md` (renk/tipografi/aralık), `assets/css/main.css`
(gerçek `:root` değerleri), `.claude/skills/qblogg-blog-yazisi/SKILL.md`
"Kalite kuralları" ve CLAUDE.md'nin uydurma/abartı yasağı. **Ayrı bir
"marka sesi" belgesi yok** — bu ikisi (kalite kuralları + uydurma yasağı)
QBLOGG'un fiili ses kuralıdır; kaynak buysa, bu beceri de bunu söyler.

Çelişki hâlinde CLAUDE.md kazanır — bu beceri onun bir alt kümesidir.

## Neden bu bir "reddet" becerisi, "düzelt" becerisi değil

Sessizce düzeltmek iki sorun yaratır: kullanıcı neyin yanlış olduğunu
öğrenmez (aynı hatayı tekrar ister), ve bazen "düzeltme" kullanıcının asıl
istediğini kaybeder. Bunun yerine: **kısa gerekçeyle reddet, sonra
marka-uyumlu alternatifi hemen sun.** Tek cümlelik gerekçe + çözüm — uzun
ders değil.

## Kontrol listesi

Her içerik/arayüz üretiminde, teslim etmeden önce şunları tara:

### 1. Renk — ham hex yazılmaz

Her renk `var(--token)` ile gelir; token'lar (`assets/css/main.css`):
`--bg`, `--bg-soft`, `--bg-card`, `--text`, `--text-muted`, `--border`,
`--brand` (#082C54, koyu temada aqua'ya döner), `--brand-2` (#00D8C2,
yalnızca vurgu), `--brand-2-ink` (#0a7d72, metinde kullanılacak aqua),
`--on-brand`, `--danger`.

**Tuzak:** `--brand-2` (aqua) beyaz üzerinde **1,8:1** — WCAG AA'nın
(4,5:1) çok altında. Aqua **hiçbir zaman metin rengi olamaz**; metin için
her zaman `--brand-2-ink`.

**Neden reddedilir, düzeltilmez:** Ham hex ya da sabit renk yazılırsa koyu
tema kendiliğinden çalışmaz — token kullanmak koyu temanın **tek**
çalışma mekanizması. Sessizce "düzelttim" demek, kullanıcının bir dahaki
sefere yine ham hex isteyeceği anlamına gelir.

**Örnek**
> İstek: "Butonu #00D8C2 renginde, üzerinde beyaz yazıyla yap."
> Yanıt: Reddediyorum — aqua (#00D8C2) beyaz üzerinde 1,8:1 kontrast
> veriyor, WCAG AA'nın çok altında ve koyu temada bozulur. Bunun yerine
> `background: var(--brand); color: var(--on-brand)` kullanıyorum —
> aynı marka hissi, okunabilir ve tema-uyumlu.

### 2. Tipografi — sekiz basamaklı ölçek

`--fs-2xs` … `--fs-xl` + `--fs-logo`. Ham `rem` yazılmaz. İstisnalar:
başlık `clamp()` değerleri, `em` göreli boyutlar (ilk harf, `code`),
`--fs-logo` (ölçeğe yuvarlanmaz, marka belgesinde ölçülü).

Yazı tipi: Inter, **yerelde** (`assets/fonts/`). Google Fonts CDN'i asla
önerilmez — ziyaretçinin IP'sini Google'a gönderir, Münih Bölge Mahkemesi
kararı (3 O 17493/20) sonrası AB'de riskli. Bu proje zaten hiçbir dış
istek yapmıyor; bir Google Fonts linki bunu kırar.

### 3. Aralık ve yerleşim

Token'lar: `--radius` (16px), `--radius-sm` (10px), `--maxw` (1140px).
Dokunma hedefi en az 44px.

**RTL — yön bağımlı CSS yazılmaz.** `margin-left`/`left`/`padding-right`
yerine `margin-inline-start`/`inset-inline-start`/`padding-inline-end`.
Arapça sitenin on dilinden biri; yön bağımlı bir kural doğrudan bozulur.

**Izgaralar** `minmax(min(Xpx, 100%), 1fr)` deseniyle yazılır — çıplak
`minmax(Xpx, 1fr)` küçük ekranda yatay taşma üretir.

### 4. İkon — emoji yok

Görünen her ikon satır içi SVG: 24×24 ızgara, `fill="none"`,
`stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak uç/birleşim.
Emoji işletim sistemine göre değişir (Windows/Android/macOS üç farklı
görünüm) — marka kendi görselinin kontrolünü kaybeder. **İstisna:** ok ve
tema düğmesi (`→ ↑ ☾ ☀`) — bunlar yazı tipiyle çizilen tek renkli işaret,
SVG ikon değil.

### 5. Ses — kalite kuralları + uydurma yasağı

- Rakamlar her zaman örnek/tahmin olarak işaretlenir, kesin vaat olarak
  sunulmaz. Abartılı/mutlak "garanti" dili reddedilir.
- Uydurma yok: doğrulanmamış istatistik, uydurma müşteri hikâyesi, uydurma
  kurum şartı — yumuşatılmaz, doğrudan reddedilir.
- Somut, soyuttan iyidir: beş sıfat yerine bir gerçek örnek.
- Kancayla aç — boğaz temizleme cümlesiyle değil.
- Bir içerik tek konuya, tek okura, tek çıkarıma hizmet eder.

**Örnek**
> İstek: "Bu pakette kesin olarak %300 daha fazla trafik garantisi
> verelim."
> Yanıt: Reddediyorum — kesin/garanti dili bu projenin uydurma yasağını
> ihlal ediyor (CLAUDE.md, rakamlar örnek olarak işaretlenir). Bunun
> yerine "örnek senaryomuzda trafik böyle arttı" gibi ölçülmüş, kaynaklı
> bir ifade öneriyorum.

## Nasıl uygulanır

1. İçerik/arayüz taslağını üretmeden **önce** hangi kategorilerin (1-5)
   ilgili olduğuna bak — bir buton isteniyorsa 1+3+4, bir paragraf
   isteniyorsa 5, tam bir bölüm isteniyorsa hepsi.
2. İstekte açık bir ihlal varsa (ham hex, Google Fonts, emoji, yön bağımlı
   CSS, garanti dili) — **önce reddet** (bir cümle, hangi kural), **sonra
   marka-uyumlu alternatifi üret.** İkisini aynı yanıtta yap, ayrı bir tur
   beklemeden.
3. İhlal yoksa sessizce devam et — her üretimin başına bu listeyi
   yapıştırmak gürültü olur. Yalnızca gerçek bir ihlal varsa konuş.
4. Emin değilsen (örneğin yeni bir renk tonu marka paletine "yakın" ama
   token değil) — token'a en yakın karşılığı öner, seçimi kullanıcıya
   bırak; bu bir ret değil bir uyarıdır.
