---
name: on-brand
description: Enforce NAVIAR's color tokens, spacing, and voice rules on any content or UI Claude generates for the NAVIAR brand — colors, contrast, descriptor sizing, forbidden effects (gradient/bevel/shadow/3D), and positioning tone. Use when asked to write NAVIAR copy, design a NAVIAR page/deck/social asset, pick colors for a NAVIAR surface, or review something for "on brand" / "marka kurallarına uygun mu". Refuses off-brand requests with a one-line reason instead of silently complying or silently swapping.
---

# NAVIAR marka denetimi

Kaynak, tek yerde durur: `brand/naviar/README.md` (renkler, spacing,
marka dili) ve `docs/naviar/NAVIAR-LOGO-KARAR.md` (yasak listesi, M1/M2
kuralları). **Bu dosya o ikisinin bir özeti değil, uygulanabilir bir
denetim listesidir** — çelişki olursa kaynak dosyalar kazanır, oraya bakıp
bu dosyayı güncelleyin.

Bu skill her NAVIAR içeriği/arayüzü üretiminde **önce** okunur, üretimden
**sonra** aynı listeyle öz-denetim yapılır (bkz. sondaki kontrol listesi).
Bir istek aşağıdaki kurallardan birini ihlal ediyorsa, sessizce uyarlama —
**reddet, tek cümlelik gerekçe ver, uyumlu alternatifi öner.**

## 1. Renk belirteçleri — kaynak: README.md §Renkler

| Rol | Hex | Kullanım |
|---|---|---|
| Primary | Midnight Navy `#0A1628` | Zemin, ana marka rengi |
| Accent | Premium Gold `#D4AF37` | **Yalnız kontrollü/yapısal aksan** — görünür alanın %12–16'sı |
| Neutral | Off White `#F5F6F8` | Açık zemin, koyu zeminde metin |
| Neutral | Graphite `#1E1E1E` | İkincil metin/zemin |
| Veri/UI | Accent Cyan `#00B2E3` | **Yalnız dijital/veri/UI vurgusu — master markada asla** |

**Sabit kontrast bulgusu (KARAR.md §4.1, ölçüldü):** Gold, beyaz zeminde
**2,10:1** — WCAG AA metin eşiğinin (4,5:1) altında. **Gold hiçbir zaman
açık zeminde metin veya taşıyıcı grafik olarak kullanılmaz.** Descriptor
rengi: açık zeminde lacivert, koyu zeminde off-white — gold değil.

**Reddet, şunu isterlerse:**
- "Gold metin, beyaz arka plan" → *"Gold beyazda 2,10:1 kontrast veriyor, WCAG AA'yı geçmiyor — descriptor rengini lacivert yapıp gold'u dekoratif çizgi/aksan olarak kullanabilirim."*
- "Cyan'ı logoya/ana markaya ekle" → *"Cyan master markada hiç kullanılmıyor, yalnız veri/UI vurgusunda — bunun yerine gold aksan öneririm."*
- Gold'un görünür alanın %16'sından fazlasını kaplaması → *"Gold %12–16 aralığında yapısal aksan olmalı, bu oran aralığı aşıyor — küçültülmeli."*

## 2. Spacing / ölçü — kaynak: README.md §Kurallar

| Kural | Değer |
|---|---|
| Clear space (tam lockup) | ≥ 0,30H (H = wordmark cap height) |
| Clear space (monogram) | ≥ 1 ribbon genişliği |
| Minimum wordmark | 96 px dijital / 24 mm baskı |
| Minimum tam lockup | 160 px dijital / 35 mm baskı |
| Descriptor cap height | NAVIAR'ın %24–30'u |
| Dokunma hedefi (UI) | 44px (QBLOGG'la ortak erişilebilirlik kuralı, aynı prensip NAVIAR yüzeylerine de uygulanır) |

**Reddet, şunu isterlerse:**
- Lockup'ı belirtilen clear space'ten daha sıkı yerleştirmek → *"Clear space 0,30H altına düşüyor, marka kimliği sıkışık görünür."*
- Wordmark'ı 96 px'in altında kullanmak (favicon/ikon dışı bağlamda) → *"96 px altı wordmark okunmuyor — bunun yerine monogram/ikon kullanın."*

## 3. Yasak görsel efektler — kaynak: NAVIAR-LOGO-KARAR.md §1 (M1+M2 ortak yasak listesi)

Gradient · bevel · gölge (shadow) · glow · metal doku · 3D · raster mask ·
master logonun içine kalıcı tagline · wordmark geometrisini yeniden çizmek ·
ülkeye özel varyant · NAVIAR'ı çevirmek/aynalamak/döndürmek · **open-R
varyantı** (R her zaman kapalı bowl + diyagonal bacak).

**Reddet, şunu isterlerse:** "logoya hafif bir gölge/gradient ekle,
premium görünsün" → *"Gradient/gölge M1 Finishing Rule'da yasak — 'premium'
burada dokuyla değil kontrollü gold oranıyla (§1) sağlanıyor."*

## 4. Tipografi — bilinen boşluk, icat etmeyin

NAVIAR'ın **body-metin için tanımlı bir yazı tipi yok.** Wordmark özel
outline vektördür (bir font değil), Poppins yalnız *inşa referansı* olarak
kullanılmış ve master için **reddedilmiştir** (KARAR.md §2 P2: "Poppins'in
A'sı çentiksiz, R'si farklı" — wordmark'la örtüşmüyor).

**Bu skill'in kuralı:** Body/UI metni için bir font seçmeniz istenirse,
Poppins önermeyin (yanlışlıkla marka fontu sanılır). Nötr bir sistem
yığını kullanın (`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`)
ve kullanıcıya bunun **geçici** olduğunu, resmi bir NAVIAR body-fontu
seçilmediğini açıkça söyleyin. Kendi başınıza bir marka fontu "belirlemeyin".

## 5. Marka dili / ses tonu — kaynak: README.md §Marka dili

| Unsur | Hedeflenen algı |
|---|---|
| Lacivert ağırlıklı zemin | Güven · kurumsallık · intelligence |
| Kontrollü gold vurgu | Premium · stratejik değer (gösterişli değil) |
| Genel konumlandırma | McKinsey tarzı kurumsallık + modern teknoloji şirketi + butik strateji firması |

**Bundan çıkan yazım kuralları:**
- Abartılı/pazarlamacı dil yok ("devrim yaratan", "en iyi", ünlem yığını) —
  ton kurumsal ve ölçülü, girişim/hype dili değil.
- "Gösterişsiz ama premium" — süsleme yerine netlik ve kontrollü aksanla
  ayrışma sağlanır. Bir metin/tasarım göze çarpmak için efekt/renk
  yığıyorsa bu, marka diliyle çelişir (bkz. §3).
- Rakamsal/hukuki iddialarda ölçülülük: NAVIAR henüz tescil sürecinde
  (KARAR.md §5, "orta-yüksek" hukuki risk) — "tescilli marka", "resmi
  ortak" gibi doğrulanmamış iddialar üretilmez.

**Reddet, şunu isterlerse:** "Bu metni daha 'wow' yap, ünlemlerle
coşkulu bir ton kullan" → *"NAVIAR'ın hedeflenen tonu kurumsal/ölçülü —
coşkulu pazarlama dili McKinsey-tarzı konumlandırmayla çelişir; netlik ve
somut değer vurgusuyla güçlendirebilirim."*

## 6. Kapsam dışı — henüz karara bağlanmamış

Aşağıdakiler bu skill'in **zorunlu kılamayacağı** açık kararlardır
(`docs/naviar/is-modeli.md` §4, `NAVIAR-LOGO-KARAR.md` §7):

- CARE descriptor'ı onaylı mimaride yok — iş onayı gerektirir.
- Diyagonal açı sapması (29,9° vs. spec'in 38–42°'si) onay bekliyor.
- Body-fontu resmi olarak seçilmedi (bkz. §4).

Bu konularda bir istek geldiğinde skill "reddetmez" ama **belirsizliği
adlandırır**: "Bu, henüz karara bağlanmamış bir marka açığı — devam etmeden
önce kullanıcıya sormalıyım."

## Üretim sonrası öz-denetim (her NAVIAR çıktısından önce çalıştırın)

1. Renkler yalnız §1'deki beş değerden mi geliyor? Ham/farklı hex var mı?
2. Gold açık zeminde metin/taşıyıcı grafik olarak mı kullanılmış?
3. Gold oranı %12–16 aralığında mı (görsel bir kompozisyondaysa)?
4. Cyan master marka bağlamında mı kullanılmış (yalnız veri/UI'da olmalı)?
5. Gradient/gölge/bevel/3D/metal doku var mı?
6. Clear space ve minimum ölçü kuralına uyuyor mu?
7. Ton kurumsal/ölçülü mü, yoksa pazarlama hype'ına mı kaymış?
8. Doğrulanmamış bir tescil/hukuki iddia var mı?

Herhangi biri "hayır" ise, teslim etmeden önce düzeltin veya kullanıcıya
söyleyip reddedin.
