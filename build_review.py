#!/usr/bin/env python3
"""review.html — is gelistirme incelemesinin gorsel ozeti.

Grafik geometrisi elle yazilmaz, hesaplanir. Renkler dataviz dogrulayicisindan
gecmistir (bkz. docs/business-review.md ve asagidaki not).
"""

import html
import pathlib

OUT = pathlib.Path(__file__).parent / "review.html"

# --- veri ---------------------------------------------------------------
HEDEF = 1_000_000

KAPASITE = [
    {"etiket": "1 hafta",  "kurulum": 23, "gelir": 575_000},
    {"etiket": "2 hafta",  "kurulum": 12, "gelir": 287_500},
    {"etiket": "3 hafta",  "kurulum": 8,  "gelir": 191_667},
]

MUSTERI = [
    {"ad": "Blog Pro",           "fiyat": "149 NOK/ay",    "adet": 559},
    {"ad": "Curiosity Starter",  "fiyat": "499 NOK/ay",    "adet": 167},
    {"ad": "Curiosity Creator",  "fiyat": "1.499 NOK/ay",  "adet": 56},
    {"ad": "Curiosity Business", "fiyat": "4.999 NOK/ay",  "adet": 17},
    {"ad": "Curiosity Agency",   "fiyat": "14.999 NOK/ay", "adet": 6},
]

BANTLAR = [
    {"aralik": "%0-30",  "baslik": "Danışmanlık",       "sonuc": "Ölçeklenmez. Saatlik fiyatlayın, marjı yönetin.",         "adim": 1},
    {"aralik": "%30-60", "baslik": "Ürünleşebilir ajans","sonuc": "Şablon kütüphanesi kurun. Tek hedef: kurulum süresini düşürmek.", "adim": 2},
    {"aralik": "%60+",   "baslik": "Gerçek ürün",        "sonuc": "Self-servis kurulum yazılabilir. İş modeli SaaS'a döner.", "adim": 3},
]

FAZLAR = [
    {"ay": "0-6 ay",  "ad": "Sadece AI Workforce",
     "hedef": "5-10 ödeyen müşteri",
     "amac": "Gelir değil, üç sayıyı ölçmek: yeniden kullanım oranı, gerçek kurulum saati, bakım geliri. GDPR sözleşmesi ve SLA bu fazda hazırlanır."},
    {"ay": "6-12 ay", "ad": "Ürünleştirme",
     "hedef": "Tekrar eden gelir",
     "amac": "En çok tekrarlanan iş self-servis hale getirilir. Curiosity Engine bu olabilir ya da olmayabilir — kararı veri verir."},
    {"ay": "12+ ay",  "ad": "İkinci ürün",
     "hedef": "Yalnızca önceki fazlar tuttuysa",
     "amac": "BETA SENIOR buraya girer. Daha erken girerse regülasyon ve güven yükü diğer her şeyi durdurur."},
]

RISKLER = [
    {"risk": "Odak dağılması",                 "etki": "critical", "azalt": "Kategorileri yol haritasından çıkarmak"},
    {"risk": "Müşteri verisi olayı",           "etki": "critical", "azalt": "Yazılı kapsam, minimum erişim, DPA, olay planı"},
    {"risk": "Kurucu darboğazı",               "etki": "serious",  "azalt": "Kapasite sınırı, şablonlaştırma, erken teknik ortak"},
    {"risk": "AI sağlayıcı maliyet değişimi",  "etki": "serious",  "azalt": "Kredi sisteminde maliyet aktarımı, tek sağlayıcıya bağımlı kalmama"},
    {"risk": "\"AI çalışan\" konumlandırması", "etki": "warning",  "azalt": "Dil: \"tekrar eden işi devralır\", \"insanın yerini alır\" değil"},
    {"risk": "Ödeme altyapısında aşırı mühendislik", "etki": "warning", "azalt": "Faz 1'de tek seferlik ödeme yeter"},
]

ETKI_ETIKET = {"critical": "Çok yüksek", "serious": "Yüksek", "warning": "Orta"}
ETKI_IKON = {"critical": "▲", "serious": "▲", "warning": "■"}


def esc(v):
    return html.escape(str(v), quote=True)


def nok(n):
    return f"{n:,.0f}".replace(",", ".")


# --- grafik 1: kapasite tavani ------------------------------------------
def chart_kapasite():
    W, H = 660, 320
    L, R, T, B = 58, 20, 26, 58
    pw, ph = W - L - R, H - T - B
    ymax = 1_100_000
    n = len(KAPASITE)
    slot = pw / n
    bw = 86

    def y(v):
        return T + ph - (v / ymax) * ph

    parts = []
    # yatay kilavuz cizgileri
    for tick in (0, 250_000, 500_000, 750_000, 1_000_000):
        yy = y(tick)
        parts.append(f'<line class="grid" x1="{L}" y1="{yy:.1f}" x2="{L+pw}" y2="{yy:.1f}"/>')
        parts.append(f'<text class="tick" x="{L-10}" y="{yy+4:.1f}" text-anchor="end">'
                     f'{tick//1000}k</text>')

    # hedef cizgisi
    yt = y(HEDEF)
    parts.append(f'<line class="target" x1="{L}" y1="{yt:.1f}" x2="{L+pw}" y2="{yt:.1f}"/>')
    parts.append(f'<text class="target-label" x="{L+pw}" y="{yt-9:.1f}" text-anchor="end">'
                 f'1.000.000 NOK · mütevazı hedef</text>')

    # cubuklar (4px yuvarlatilmis ust uc, tabana sabit)
    for i, d in enumerate(KAPASITE):
        cx = L + slot * i + slot / 2
        x = cx - bw / 2
        yy = y(d["gelir"])
        h = T + ph - yy
        r = 4
        path = (f'M{x:.1f},{T+ph:.1f} V{yy+r:.1f} Q{x:.1f},{yy:.1f} {x+r:.1f},{yy:.1f} '
                f'H{x+bw-r:.1f} Q{x+bw:.1f},{yy:.1f} {x+bw:.1f},{yy+r:.1f} '
                f'V{T+ph:.1f} Z')
        parts.append(f'<path class="bar" d="{path}"/>')
        parts.append(
            f'<rect class="hit" x="{cx-slot/2+6:.1f}" y="{T}" width="{slot-12:.1f}" height="{ph}" '
            f'tabindex="0" role="img" '
            f'aria-label="{esc(d["etiket"])} kurulum: yılda {d["kurulum"]} kurulum, '
            f'{nok(d["gelir"])} NOK" '
            f'data-tip="{esc(d["etiket"])} kurulum · yılda {d["kurulum"]} kurulum · '
            f'{nok(d["gelir"])} NOK"/>')
        # dogrudan etiket
        parts.append(f'<text class="val" x="{cx:.1f}" y="{yy-10:.1f}" text-anchor="middle">'
                     f'{nok(d["gelir"])}</text>')
        parts.append(f'<text class="cat" x="{cx:.1f}" y="{T+ph+22:.1f}" text-anchor="middle">'
                     f'{esc(d["etiket"])}</text>')
        parts.append(f'<text class="cat sub" x="{cx:.1f}" y="{T+ph+39:.1f}" text-anchor="middle">'
                     f'{d["kurulum"]} kurulum/yıl</text>')

    parts.append(f'<line class="axis" x1="{L}" y1="{T+ph}" x2="{L+pw}" y2="{T+ph}"/>')
    return (f'<svg viewBox="0 0 {W} {H}" class="chart" role="img" '
            f'aria-label="Kurulum süresine göre yıllık gelir tavanı">'
            + "".join(parts) + "</svg>")


# --- grafik 2: gereken musteri sayisi -----------------------------------
def chart_musteri():
    W = 660
    row, gap = 34, 12
    T, B, L, R = 10, 26, 150, 56
    H = T + len(MUSTERI) * (row + gap) - gap + B
    pw = W - L - R
    xmax = max(d["adet"] for d in MUSTERI)

    parts = []
    for i, d in enumerate(MUSTERI):
        yy = T + i * (row + gap)
        w = max(3, (d["adet"] / xmax) * pw)
        r = 4
        path = (f'M{L},{yy} H{L+w-r:.1f} Q{L+w:.1f},{yy} {L+w:.1f},{yy+r} '
                f'V{yy+row-r} Q{L+w:.1f},{yy+row} {L+w-r:.1f},{yy+row} H{L} Z')
        parts.append(f'<path class="bar" d="{path}"/>')
        # Isabet alani cubugun kendisi degil, satirin tamami: en kucuk cubuk 6px
        # genisligindeydi ve fareyle vurulamiyordu (HIG masaustu asgari 20pt).
        parts.append(
            f'<rect class="hit" x="{L}" y="{yy}" width="{pw}" height="{row}" '
            f'tabindex="0" role="img" '
            f'aria-label="{esc(d["ad"])}, {esc(d["fiyat"])}: {d["adet"]} müşteri" '
            f'data-tip="{esc(d["ad"])} · {esc(d["fiyat"])} · {d["adet"]} müşteri gerekir"/>')
        parts.append(f'<text class="cat" x="{L-12}" y="{yy+row/2+4:.1f}" text-anchor="end">'
                     f'{esc(d["ad"])}</text>')
        parts.append(f'<text class="val" x="{L+w+10:.1f}" y="{yy+row/2+4:.1f}">'
                     f'{d["adet"]}</text>')
    return (f'<svg viewBox="0 0 {W} {H}" class="chart" role="img" '
            f'aria-label="1 milyon NOK yıllık gelir için gereken abone sayısı">'
            + "".join(parts) + "</svg>")


def tablo(basliklar, satirlar, ozet):
    th = "".join(f"<th>{esc(b)}</th>" for b in basliklar)
    tr = "".join("<tr>" + "".join(f"<td>{esc(h)}</td>" for h in s) + "</tr>" for s in satirlar)
    return (f'<details class="table-view"><summary>{esc(ozet)}</summary>'
            f'<div class="scroll"><table><thead><tr>{th}</tr></thead>'
            f'<tbody>{tr}</tbody></table></div></details>')


# --- sayfa ---------------------------------------------------------------
def build():
    bantlar = "".join(
        f'<div class="band band--{b["adim"]}">'
        f'<span class="band__range">{esc(b["aralik"])}</span>'
        f'<span class="band__title">{esc(b["baslik"])}</span>'
        f'<span class="band__note">{esc(b["sonuc"])}</span></div>'
        for b in BANTLAR)

    fazlar = "".join(
        f'<li class="phase"><div class="phase__when">{esc(f["ay"])}</div>'
        f'<div><p class="phase__name">{esc(f["ad"])}</p>'
        f'<p class="phase__goal">Hedef: {esc(f["hedef"])}</p>'
        f'<p class="phase__body">{esc(f["amac"])}</p></div></li>'
        for f in FAZLAR)

    riskler = "".join(
        f'<tr><td>{esc(r["risk"])}</td>'
        f'<td><span class="pill pill--{r["etki"]}">'
        f'<span aria-hidden="true">{ETKI_IKON[r["etki"]]}</span> {ETKI_ETIKET[r["etki"]]}</span></td>'
        f'<td>{esc(r["azalt"])}</td></tr>'
        for r in RISKLER)

    return f"""<title>BETA Kapasite Tavanı</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root {{
  color-scheme: light;
  --bg: #ffffff;
  --soft: #f6f6f4;
  --surface: #fcfcfb;
  --border: #e4e3df;
  --ink: #16150f;
  --ink-2: #52514e;
  --muted: #6b6a63;
  --grid: #e1e0d9;
  --axis: #c3c2b7;
  --series: #c8552a;
  --band-1: #e39a7c;
  --band-2: #bd4d24;
  --band-3: #8f3818;
  --on-band: #ffffff;
  --critical: #d03b3b;
  --serious: #b8541f;
  --warning: #8a6a12;
  --sel: #f3ddd2;
  --tip-bg: #16150f;
  --tip-ink: #f6f6f4;
}}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
    color-scheme: dark;
    --bg: #14140f;
    --soft: #1b1b15;
    --surface: #1e1e17;
    --border: #33322a;
    --ink: #f2f1ea;
    --ink-2: #c3c2b7;
    --muted: #898781;
    --grid: #2c2c2a;
    --axis: #383835;
    --series: #d97045;
    --band-1: #f0b79c;
    --band-2: #d97045;
    --band-3: #a84a24;
    --on-band: #14140f;
    --critical: #e66767;
    --serious: #ec835a;
    --warning: #fab219;
    --sel: #3a2418;
    --tip-bg: #f2f1ea;
    --tip-ink: #14140f;
  }}
}}
:root[data-theme="dark"] {{
  color-scheme: dark;
  --bg: #14140f;
  --soft: #1b1b15;
  --surface: #1e1e17;
  --border: #33322a;
  --ink: #f2f1ea;
  --ink-2: #c3c2b7;
  --muted: #898781;
  --grid: #2c2c2a;
  --axis: #383835;
  --series: #d97045;
  --band-1: #f0b79c;
  --band-2: #d97045;
  --band-3: #a84a24;
  --on-band: #14140f;
  --critical: #e66767;
  --serious: #ec835a;
  --warning: #fab219;
  --sel: #3a2418;
  --tip-bg: #f2f1ea;
  --tip-ink: #14140f;
}}

* {{ box-sizing: border-box; }}
::selection {{ background: var(--sel); color: var(--ink); }}
:focus-visible {{ outline: 2px solid var(--series); outline-offset: 2px; border-radius: 3px; }}
html {{ scrollbar-color: var(--axis) transparent; }}
body {{
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}}
.wrap {{ max-width: 940px; margin: 0 auto; padding: 0 24px; }}

header {{ padding: 72px 0 48px; border-bottom: 1px solid var(--border); }}
.eyebrow {{
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 0.75rem; letter-spacing: .18em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 24px;
}}
.eyebrow::before {{
  content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--series);
}}
h1 {{
  margin: 0 0 20px; font-size: clamp(1.875rem, 5vw, 2.875rem); font-weight: 600;
  letter-spacing: -.022em; line-height: 1.1; text-wrap: balance;
}}
.lede {{ margin: 0; max-width: 62ch; font-size: clamp(1rem, 2vw, 1.125rem); color: var(--ink-2); }}

.hero {{
  display: flex; flex-wrap: wrap; gap: 24px 48px; align-items: flex-end;
  margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border);
}}
.hero__fig {{
  font-size: clamp(2.5rem, 8vw, 3.875rem); font-weight: 600; line-height: 1;
  letter-spacing: -.03em; color: var(--series);
}}
.hero__unit {{ font-size: .42em; font-weight: 500; color: var(--ink-2); margin-left: 8px; }}
.hero__note {{ margin: 0; max-width: 42ch; font-size: 0.875rem; color: var(--ink-2); }}

section {{ padding: 56px 0 0; }}
.label {{
  margin: 0 0 8px; font-size: 0.75rem; letter-spacing: .16em;
  text-transform: uppercase; color: var(--muted);
}}
h2 {{ margin: 0 0 8px; line-height: 1.2; font-size: clamp(1.3125rem, 3vw, 1.625rem); font-weight: 600; letter-spacing: -.015em; }}
.intro {{ margin: 0 0 24px; max-width: 66ch; color: var(--ink-2); font-size: 1rem; }}

.panel {{
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 24px 24px 16px;
}}
.chart {{ width: 100%; height: auto; display: block; overflow: visible; }}
.grid {{ stroke: var(--grid); stroke-width: 1; }}
.axis {{ stroke: var(--axis); stroke-width: 1; }}
.bar {{ fill: var(--series); transition: fill-opacity 120ms ease-out; pointer-events: none; }}
.hit {{ fill: transparent; cursor: default; }}
.hit:hover {{ fill: var(--series); fill-opacity: .07; }}
.hit:focus-visible {{ fill: var(--series); fill-opacity: .12; outline: none;
  stroke: var(--series); stroke-width: 2; }}
.bar:focus-visible {{ stroke: var(--ink); stroke-width: 2; }}
.target {{ stroke: var(--ink-2); stroke-width: 2; stroke-dasharray: 5 4; }}
.target-label {{ fill: var(--ink-2); font-size: 0.75rem; font-weight: 500; }}
.tick {{ fill: var(--muted); font-size: 0.75rem; font-variant-numeric: tabular-nums; }}
.val {{ fill: var(--ink); font-size: 0.8125rem; font-weight: 600; font-variant-numeric: tabular-nums; }}
.cat {{ fill: var(--ink); font-size: 0.8125rem; }}
.cat.sub {{ fill: var(--muted); font-size: 0.75rem; }}

.table-view {{ margin-top: 16px; border-top: 1px solid var(--border); padding-top: 12px; }}
.table-view summary {{
  cursor: pointer; font-size: 0.8125rem; color: var(--ink-2);
}}
.scroll {{ overflow-x: auto; }}
.table-view .scroll {{ margin-top: 12px; }}
table {{ min-width: 420px; }}
table {{ border-collapse: collapse; width: 100%; font-size: 0.875rem; }}
th, td {{ text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--border); }}
th {{ color: var(--muted); font-weight: 500; font-size: 0.75rem;
      letter-spacing: .06em; text-transform: uppercase; }}
td {{ color: var(--ink-2); }}
td:first-child {{ color: var(--ink); }}

.bands {{ display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }}
.band {{ border-radius: 12px; padding: 16px 16px 20px; display: flex; flex-direction: column; gap: 8px; }}
.band--1 {{ background: var(--band-1); }}
.band--2 {{ background: var(--band-2); }}
.band--3 {{ background: var(--band-3); }}
.band--1 {{ color: #16150f; }}
.band--2, .band--3 {{ color: #ffffff; }}
:root[data-theme="dark"] .band--1,
:root[data-theme="dark"] .band--2 {{ color: #14140f; }}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) .band--1,
  :root:not([data-theme="light"]) .band--2 {{ color: #14140f; }}
}}
.band__range {{ font-size: 0.75rem; letter-spacing: .1em; text-transform: uppercase; opacity: .78;
                font-variant-numeric: tabular-nums; }}
.band__title {{ font-size: 1.0625rem; font-weight: 600; letter-spacing: -.01em; }}
.band__note {{ font-size: 0.875rem; line-height: 1.5; opacity: .92; }}

.phases {{ list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }}
.phase {{
  display: grid; grid-template-columns: 92px 1fr; gap: 20px;
  background: var(--soft); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px;
}}
.phase__when {{ font-size: 0.8125rem; font-weight: 600; color: var(--series);
                font-variant-numeric: tabular-nums; }}
.phase__name {{ margin: 0 0 4px; font-size: 1.0625rem; font-weight: 600; }}
.phase__goal {{ margin: 0 0 8px; font-size: 0.8125rem; color: var(--muted); }}
.phase__body {{ margin: 0; font-size: 0.875rem; color: var(--ink-2); max-width: 70ch; }}

.pill {{
  display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;
  font-size: 0.75rem; font-weight: 500;
}}
.pill--critical {{ color: var(--critical); }}
.pill--serious {{ color: var(--serious); }}
.pill--warning {{ color: var(--warning); }}

.decisions {{ list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; counter-reset: d; }}
.decisions li {{
  counter-increment: d; position: relative; padding-left: 40px;
  font-size: 1rem; color: var(--ink-2); max-width: 74ch;
}}
.decisions li::before {{
  content: counter(d); position: absolute; left: 0; top: 1px;
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--soft); border: 1px solid var(--border);
  color: var(--ink); font-size: 0.75rem; font-weight: 600;
  display: grid; place-items: center; font-variant-numeric: tabular-nums;
}}
.decisions b {{ color: var(--ink); font-weight: 600; }}

footer {{
  margin-top: 64px; padding: 24px 0 48px; border-top: 1px solid var(--border);
  font-size: 0.8125rem; color: var(--muted);
}}
footer p {{ margin: 0 0 8px; max-width: 76ch; }}

#tip {{
  position: fixed; z-index: 10; pointer-events: none; opacity: 0;
  background: var(--tip-bg); color: var(--tip-ink);
  font-size: 0.8125rem; padding: 8px 12px; border-radius: 7px;
  transition: opacity .12s ease; max-width: 260px;
}}
#tip[data-show="1"] {{ opacity: 1; }}
@media (prefers-reduced-motion: reduce) {{
  * {{ transition: none !important; animation: none !important; }}
}}
</style>

<header>
  <div class="wrap">
    <p class="eyebrow">BETA · İş geliştirme incelemesi</p>
    <h1>Konsept bir işletme değil, bir maaş üretiyor</h1>
    <p class="lede">Ürün seçimi doğru, sıralama doğru, ölçek modeli eksik. Aşağıdaki
      aritmetik konseptin kendi fiyatlarıyla yapıldı ve tek bir soruya çıkıyor.</p>

    <div class="hero">
      <div>
        <div class="hero__fig">575.000<span class="hero__unit">NOK</span></div>
      </div>
      <p class="hero__note">Tek kişiyle AI Workforce'un <b>en iyi senaryodaki</b> yıllık
        tavanı. Kurulum üç hafta sürerse 192.000 NOK'a iniyor. İkinci kişi tavanı
        kaldırmaz, sadece yükseltir.</p>
    </div>
  </div>
</header>

<main>
  <section>
    <div class="wrap">
      <p class="label">Bulgu 1</p>
      <h2>Kapasite tavanı</h2>
      <p class="intro">Kurulum başına ortalama 25.000 NOK, 46 çalışma haftası ve zamanın
        yarısının satış ile idari işe gittiği varsayımıyla. Playbook'ta kurulum süresi
        1-3 hafta yazıyor — yani üç senaryonun üçü de mütevazı bir hedefin altında kalıyor.</p>
      <div class="panel">
        {chart_kapasite()}
        {tablo(["Kurulum süresi", "Yılda kurulum", "Yıllık gelir (NOK)"],
               [[d["etiket"], d["kurulum"], nok(d["gelir"])] for d in KAPASITE],
               "Veriyi tablo olarak gör")}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="label">Bulgu 2</p>
      <h2>Tavanı kıran tek sayı: yeniden kullanım oranı</h2>
      <p class="intro">Her kurulumun ne kadarı bir sonraki müşteride tekrar
        kullanılabiliyor? Bu oran bilinmeden Curiosity Engine'e veya blog hunisine
        yatırım yapmak erken. İlk beş kurulumun tek amacı bunu ölçmek olmalı.</p>
      <div class="bands">
{bantlar}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="label">Bulgu 3</p>
      <h2>Abonelikte kaldıraç, tek seferlik satışta yok</h2>
      <p class="intro">1.000.000 NOK yıllık gelir için her modelde kaç müşteri gerekiyor?
        Aradaki fark, neden ürünleştirmenin tek çıkış yolu olduğunu gösteriyor. Ama dikkat:
        Agency kademesi ancak white-label olarak, ajansın kendi gelir kalemine
        dönüştüğünde bu fiyatı taşır.</p>
      <div class="panel">
        {chart_musteri()}
        {tablo(["Model", "Fiyat", "Gereken müşteri"],
               [[d["ad"], d["fiyat"], d["adet"]] for d in MUSTERI],
               "Veriyi tablo olarak gör")}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="label">Öneri</p>
      <h2>Sıralama</h2>
      <p class="intro">Yedi kategori aslında beş ayrı iş modeli — hizmet, SaaS, içerik,
        iki taraflı platform, eğitim. Ortak müşteri, ortak kanal, ortak teslimat yok.
        Aktif geliştirme tek üründe olmalı.</p>
      <ol class="phases">
{fazlar}
      </ol>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="label">Risk</p>
      <h2>Neyin yanlış gitmesi pahalı</h2>
      <div class="panel">
        <div class="scroll">
          <table>
            <thead><tr><th>Risk</th><th>Etki</th><th>Azaltma</th></tr></thead>
            <tbody>
{riskler}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="label">Karar</p>
      <h2>İlerlemeden önce cevaplanacak altı soru</h2>
      <ol class="decisions">
        <li><b>Hedef pazar:</b> Norveç KOBİ mi, Türkçe konuşan çevre mi? Ödeme altyapısı
          NOK ve Vipps, sayfa metinleri Türkçe — ikisi aynı müşteriyi işaret etmiyor.</li>
        <li><b>Yeniden kullanım eşiği:</b> AI Workforce ajans mı, ürün mü olacak?</li>
        <li><b>Kapasite sınırı:</b> Hizmet işine haftada kaç gün ayrılacak? Sınır
          konmazsa hizmet acil, ürün önemli kalır ve ürün asla çıkmaz.</li>
        <li><b>Curiosity Engine</b> icat mı edilecek, kurulumlardan mı doğacak?</li>
        <li><b>24/7 vaadinin</b> sözleşmedeki karşılığı ne? Yanıt süresi, mesai dışı
          davranış, eskalasyon.</li>
        <li><b>Faz 1'in başarı ölçütü</b> ciro mu, müşteri sayısı mı, yeniden kullanım
          oranı mı? <b>Öneri: üçüncüsü.</b></li>
      </ol>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <p>Rakamlar konseptin kendi fiyat noktalarından hesaplandı; pazar verisi değildir.
      Varsayımlar: kurulum başına ortalama 25.000 NOK, 46 çalışma haftası, zamanın
      %50'si satış ve idari işte. Gerçek sayılar ilk beş kurulumda ölçülmeli.</p>
    <p>Ayrıntılı gerekçe: docs/business-review.md</p>
  </div>
</footer>

<div id="tip" role="status" aria-live="polite"></div>

<script>
(function () {{
  var tip = document.getElementById('tip');
  function show(e, text) {{
    tip.textContent = text;
    tip.dataset.show = '1';
    var r = tip.getBoundingClientRect();
    var x = (e.clientX || 0) + 14, y = (e.clientY || 0) - r.height - 12;
    if (x + r.width > window.innerWidth - 8) x = window.innerWidth - r.width - 8;
    if (y < 8) y = (e.clientY || 0) + 18;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }}
  var current = null;
  function hide(el) {{ if (el && el !== current) return; current = null; tip.dataset.show = '0'; }}
  document.querySelectorAll('[data-tip]').forEach(function (el) {{
    el.addEventListener('mousemove', function (e) {{ current = el; show(e, el.dataset.tip); }});
    el.addEventListener('mouseleave', function () {{ hide(el); }});
    el.addEventListener('focus', function () {{
      var b = el.getBoundingClientRect();
      current = el;
      show({{ clientX: b.left + b.width / 2, clientY: b.top }}, el.dataset.tip);
    }});
    el.addEventListener('blur', function () {{ hide(el); }});
  }});
  window.addEventListener('scroll', function () {{ hide(current); }}, {{ passive: true }});
}})();
</script>
"""


if __name__ == "__main__":
    OUT.write_text(build(), encoding="utf-8")
    print(f"{OUT.name} olusturuldu ({OUT.stat().st_size} bayt)")
