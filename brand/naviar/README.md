# NAVIAR — Master Identity System

Üretim: `python3 build.py` (bağımlılık yok). Tüm geometri spec'teki sayılardan
hesaplanır; hiçbir path elle kopyalanmamıştır.

Kaynak kurallar: *NAVIAR Logo Audit & Figma Production Autoprompt v1.0* +
*NAVIAR_CARE_Usage.txt*. Proje bazında kabul kararı: `docs/naviar/NAVIAR-LOGO-KARAR.md`.

## Ölçüm kanıtı

| Kriter | Spec | Üretilen | Durum |
|---|---|---|---|
| Wordmark stroke | H'nin %14–16'sı | **%15** | ✔ |
| Çift aralığı N–A | 0,30H | 30 | ✔ |
| Çift aralığı A–V | 0,24H | 24 | ✔ |
| Çift aralığı V–I | 0,32H | 32 | ✔ |
| Çift aralığı I–A | 0,34H | 34 | ✔ |
| Çift aralığı A–R | 0,26H | 26 | ✔ |
| A crossbar | ≥ 0,14H | 0,15H | ✔ |
| A counter açıklığı | ≥ 0,20H | 0,27H | ✔ |
| R | kapalı bowl + diyagonal bacak | kapalı bowl + bacak | ✔ |
| Responsive tracking | −%15–20 (<160 px) | −%17 | ✔ |
| Min. wordmark | 96 px / 24 mm | 96 px'te okunur | ✔ |
| Monogram footprint | ~760 × 800 | 760 × 800 | ✔ |
| Ribbon | 145–160 birim | 150 | ✔ |
| Altın aksan | görünür alanın %12–16'sı | **%14,1** | ✔ |
| Monogram path | 1 kapalı lacivert + 1 kapalı altın | 2 kapalı path | ✔ |
| İkon ölçek | 16/24/32/48 px + tek renk | doğrulandı | ✔ |
| Descriptor cap | NAVIAR'ın %24–30'u | %27 | ✔ |
| Efekt | gradient/gölge/bevel/3D yok | yok | ✔ |
| Tagline | master'a gömülü değil | gömülü değil | ✔ |
| **Diyagonal açı** | **38–42°** | **29,9° (dikeyden)** | **✘ SAPMA** |

### Tek sapma: diyagonal açı

Spec'in üç monogram sayısı birbiriyle çelişiyor. 760 × 800 footprint ve 150
birim ribbon sabitken, N'nin diyagonali için kalan yatay açıklık 460 birim
olur; bu da dikeyden 29,9° verir. 38–42° elde etmek için footprint'in ~971
birim genişlemesi gerekir — bu da "~760 × 800" şartını bozar.

Footprint ve ribbon korunmuş, açı sapması bilerek bırakılmıştır. Spec'in kendi
Stop Condition maddesi bu durumu düzenliyor: *"Pause for user approval if the
geometry must depart from any specified range."* **Karar bekliyor.**

## İçerik

**master/** — `naviar-wordmark` (+ white/black/responsive) · `naviar-monogram`
(+ mono-dark/mono-light) · `naviar-lockup-horizontal` (+ reverse) ·
`naviar-lockup-stacked` · `naviar-icon-app` · `naviar-icon-favicon`

**descriptors/** — CONSULTING · AI · PLATFORM · RESEARCH INSTITUTE · ACADEMY ·
LABS. Ayrıca `naviar-care-PENDING-APPROVAL.svg` — CARE onaylı mimaride yoktur,
iş onayı ve Nice sınıf 44 taraması gerektirir.

**studies/** — reddedilen yönlerin arşiv çalışmaları: `study-p1-sculptural-n-flat`
(metalik N'nin düz vektör karşılığı) · `study-p4-dot-a-scale` (Dot-A'nın 100/48/24
cap height'ta çözülmesi) · `study-p6-r-comparison` (açık R vs kapalı R, 24 cap
height) · `study-p7-monogram-scale` (16/24/32/48 px). Master değildirler.

`index.html` — hepsini bir arada gösteren contact sheet.

## Renkler

| Rol | Renk | Hex |
|---|---|---|
| Primary | Midnight Navy | `#0A1628` |
| Accent | Premium Gold | `#D4AF37` |
| Neutral | Off White | `#F5F6F8` |
| Neutral | Graphite | `#1E1E1E` |
| Veri/UI | Accent Cyan | `#00B2E3` — master markada **asla** |

Altın beyaz zeminde 2,10:1 kontrast verir; WCAG AA'yı geçmez. Bu yüzden altın
yalnız yapısal aksandır — açık zeminde metin veya taşıyıcı grafik olarak
kullanılmaz. Descriptor'lar açık zeminde lacivert, koyu zeminde off-white.

## Kurallar

Clear space: lockup çevresinde ≥ 0,30H; monogram çevresinde ≥ 1 ribbon
genişliği. Minimum: wordmark 96 px / 24 mm, tam lockup 160 px / 35 mm.

Yasak: gradient · bevel · gölge · glow · metal doku · 3D · master'a gömülü
kalıcı tagline · wordmark geometrisini yeniden çizmek · ülkeye özel varyant ·
NAVIAR'ı çevirmek, aynalamak, döndürmek.

## Açık kalemler

1. Diyagonal açı sapması — onay bekliyor (yukarı bkz.).
2. Descriptor'lar `<text>` olarak yerleştirilmiştir; üretimde outline'a
   çevrilmelidir. Master wordmark ve monogram zaten custom outline vektördür.
3. CONSULT / CONSULTING adlandırma kararı verilmedi; mimaride CONSULTING geçiyor.
4. CARE iş onayı ve ayrı marka taraması bekliyor.
5. Profesyonel marka temizliği yapılmadan tescil, tabela ve rollout yapılamaz.
   Ön risk: orta-yüksek (NAVAIR / NAVIER yakınlığı).
