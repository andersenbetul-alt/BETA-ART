# NAVIAR — pazarlama ana sayfası (V2)

Tek dosyalık, bağımlılıksız statik HTML — `docs/naviar/is-modeli.md` ve
`docs/naviar/method-research.md`'de aylarca tartışılan "V2 blueprint"in ilk
kez koda dökülmüş hali (31.08.2026). Önceki tur boyunca yalnızca planlama
belgesi olarak vardı; `brand/naviar/interactive/` (kimlik/contact-sheet
sayfası) ile karıştırılmamalı — bu, gerçek pazarlama/satış sayfası.

## İçerik kararları — hepsi bu oturumda kapatıldı

- **Ad:** düz **NAVIAR** (descriptor yok) + "Clarity in Complex Systems"
  tagline'ı, ayrı metin öğesi olarak (master logo dosyasına gömülü değil —
  `NAVIAR-LOGO-KARAR.md` §6 madde 7).
- **Marka varlıkları:** onaylı master'dan (`brand/naviar/master/`) birebir
  path verisi — P8/P9 monogram, P5 wordmark. Hiçbir yeni geometri icat
  edilmedi.
- **Üç hizmet:** Lederstøtte · Tilrettelegging · Arbeidsnærvær (`is-modeli.md`
  §9'daki B2B/kurumsal karar).
- **Sprint bölümü:** `is-modeli.md` §9/§10'daki Arbeidsnærvær Sprint akışı.
- **Method bölümü:** `method-research.md`'de doğrulanan gerçek kanıt
  (Cochrane CD006955) — abartılı vaat yok, kas-iskelet/erken müdahale
  vurgusu kanıtla sınırlı tutuldu.
- **Trust bölümü:** §7 Risk Gate sınırları (teşhis yok, otomatik karar yok).
- **Booking:** istek + insan onayı deseni — `interactive/`'daki
  `booking-request.tsx` ile aynı mantık, mailto: taslağı, gerçek backend yok.

## Renk/tipografi

Renkler `brand/naviar/README.md`'deki 5 belirteçten (`#0A1628` / `#D4AF37` /
`#F5F6F8` / `#1E1E1E`). Tipografi: Poppins (başlık — M1'in wordmark
construction-reference fontuyla aynı aile) + IBM Plex Sans (gövde) +
IBM Plex Mono (eyebrow/veri). Gradyan, gölge, bevel, metalik efekt yok.

## Durum

Bu bir claude.ai artifact olarak yayınlandı (önizleme/sunum amaçlı).
Vercel'deki `naviar-consult` projesine dağıtılmadı — istenirse
`brand/naviar/interactive/`'deki gibi `deploy_to_vercel` ile ayrı bir
adım olarak yapılabilir.

**31.08.2026 — paralel bir "V2" çalışması var, karıştırmayın.** Kullanıcı bu
dosyadan bağımsız olarak, NAVIAR'ın kendi Figma alanında "NAVIAR Consult V2 —
Website Master" adıyla ayrı bir tasarım dosyası başlattığını bildirdi (Figma
MCP değil — kullanıcının kendi Figma oturumu). Hedef zincir kullanıcı
tarafından açıkça belirtildi: **Figma (tasarım) → Next.js (kod) → Vercel
(barındırma)** — bu depodaki mevcut sade HTML/CSS/vanilla-JS yaklaşımından
farklı bir teknoloji seçimi. Bu depoda henüz karşılığı yok: `index.html`
(bu dosya) hâlâ statik HTML, `interactive/` hâlâ React+Vite+Tailwind+shadcn;
ikisi de Next.js değil. **Figma'daki tasarım koda dökülmeye hazır olduğunda
ayrı bir görev olarak ele alınmalı** — bu dosyayı o an gelen gerçek Figma
çıktısına göre migrate etmek ya da yepyeni bir Next.js projesi başlatmak
arasında seçim, o zamanki talebe göre yapılır. Şimdiden tahminle Next.js
iskeleti kurulmadı.
