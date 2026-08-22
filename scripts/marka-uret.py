#!/usr/bin/env python3
"""QBLOGG kimlik sistemi — vektör üretici.

Sembol geometrisi bu dosyada sabittir (1000x1000 ızgara). Wordmark ana hatları
deponun kendi Inter değişken fontundan wght=700'de örneklenip çıkarılır, yani
çıktı hiçbir dış servise ve kurulu fonta bağlı değildir.

    pip install fonttools brotli
    python3 scripts/marka-uret.py
"""
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform
import math
from pathlib import Path

NAVY, AQUA = '#082C54', '#00D8C2'

# Yollar betiğin kendi konumundan çözülür, çağrıldığı klasörden değil: depo
# kökünden de, betiğin yanından da, kaynak paketinin içinden de çalışsın.
# Önceden 'assets/fonts/...' sabitti ve yalnızca depo kökünden çalışıyordu.
HERE = Path(__file__).resolve().parent


def _bul(*adaylar):
    """İlk var olan yolu döndürür; hiçbiri yoksa nerelere baktığını söyler."""
    for aday in adaylar:
        if aday.exists():
            return aday
    bakilan = '\n  '.join(str(a) for a in adaylar)
    raise SystemExit(
        f'Inter değişken fontu bulunamadı. Bakılan yerler:\n  {bakilan}\n'
        'Font, wordmark ana hatlarının çıkarıldığı dosyadır; onsuz üretim yapılamaz.'
    )


FONT = _bul(
    HERE.parent / 'assets' / 'fonts' / 'inter-latin.woff2',   # depo kökü
    HERE / 'assets' / 'fonts' / 'inter-latin.woff2',
    HERE.parent / 'font' / 'inter-latin.woff2',               # kaynak paketi
    HERE / 'inter-latin.woff2',
)
# Çıktı: depoda assets/brand, kaynak paketinde varliklar, ikisi de yoksa yanına.
if (HERE.parent / 'assets').is_dir():
    OUT = HERE.parent / 'assets' / 'brand'
elif (HERE.parent / 'varliklar').is_dir():
    OUT = HERE.parent / 'varliklar'
else:
    OUT = HERE / 'varliklar'
OUT.mkdir(parents=True, exist_ok=True)

# --- sembol: 1000x1000 ızgara, 800x800 ayak izi. Kâse "supercircle" (dört kuadratik,
# dört çapa) — ne daire ne kare. Sayaç yumuşak-köşeli (r=205), merkezi 7u yukarıda.
SYM_NAVY = ("M500 100 Q900 100 900 500 Q900 900 500 900 Q100 900 100 500 Q100 100 500 100 Z "
            "M463 251 L537 251 Q742 251 742 456 L742 530 Q742 735 537 735 "
            "L463 735 Q258 735 258 530 L258 456 Q258 251 463 251 Z")
# --- Q kuyruğu. 22.08.2026'da yeniden tasarlandı.
#
# Önceki kuyruk sayacı boydan boya kesen bir KİRİŞTİ ve kâsenin dışına hiç
# çıkmıyordu. Üç sonucu vardı, üçü de ölçüldü:
#  (a) Sembol Q değil Ø okunuyordu — çizili O, Norveççenin yaşayan bir harfi.
#      Norveç merkezli bir marka için bu tesadüfi benzerlik değil.
#  (b) Harf kimliği tamamen RENK katmanındaydı: aqua kaldırılınca geriye düz
#      bir O kalıyordu. Tek renk baskı, gravür, nakış ve tescilin siyah
#      dosyası tam olarak o hâli kullanır.
#  (c) Tek renk varyantında köprü sayacın sağ alt yarısını dolduran katı bir
#      kamaya dönüşüyordu — yani mono varyant renkli varyantla aynı şekil
#      bile değildi.
#
# Kuyruk artık siluetin parçası: sayacın içinden başlar, dış konturu saat
# 4:30 yönünde deler ve 75u dışarı taşar. Harf renkten değil biçimden okunur.
#
# Sayısal çözüm (ışın–poligon kesişimi, elle tahmin değil):
#   açı 45° · kalınlık 100u · iç uç sayaç kenarının %40'ında · taşma 75u
#   Her iki uç da KÂSE merkezinden (500·500) ışınlanır. Önce iç uç sayaç
#   merkezinden (500·493) alınmıştı; iki ışın paralel ama 7u kaymış olduğu
#   için birleştiren doğru 45,7° çıkıyordu. Tek merkez → tam 45,00°.
#   sayaç kenarı 264,6u → iç uç (574,9 · 574,9)
#   dış kontur  424,3u → uç    (853,0 · 853,0)
# Ölçülen kazanç (tek renk, 30-60° bandında siluetin kâseyi aşma oranı):
#   önceki 1,03/1,03/1,06 → yeni 1,24/1,24/1,24 (16/24/32 px)
# Sınır kutusu DEĞİŞMEDİ: kuyruk 888,4'te bitiyor, kâse zaten 900'e gidiyor.
SYM_AQUA = "M610.2 539.5 L539.5 610.2 L817.7 888.4 L888.4 817.7 Z"

# --- küçük boy ikonu: artık sembolün AYNISI.
#
# Ayrı bir varyantın gerekçesi kuyruk sayacın içindeyken vardı: köprü 16 px'te
# kayboluyordu, bu yüzden sayaç büyütülüp köprü kalınlaştırılmıştı. Kuyruk
# kâsenin dışına çıkınca o gerekçe düştü — harfi artık siluet taşıyor ve
# siluet her boyda aynı. İki geometriyi ayrı tutmak yalnızca R01 sınıfı
# hatalar üretiyordu (biri güncellenip diğeri unutuluyordu; bu oturumda iki
# kez oldu). Tek kaynak daha güvenli.
ICON_NAVY = SYM_NAVY
ICON_AQUA = SYM_AQUA

# --- wordmark ana hatları
font = instantiateVariableFont(TTFont(FONT), {'wght': 700}, inplace=True)
gs, hm, cm = font.getGlyphSet(), font['hmtx'], font.getBestCmap()
UPEM = font['head'].unitsPerEm
gn = lambda c: cm[ord(c)]

def fb(c):
    bp = BoundsPen(gs); gs[gn(c)].draw(bp); return bp.bounds

K = 520.0 / fb('B')[3]        # cap height 520u = sembol yüksekliğinin %65'i
EM = UPEM * K
oB = fb('O')

def gpath(c, dx):
    p = SVGPathPen(gs); gs[gn(c)].draw(TransformPen(p, Transform(K, 0, 0, -K, dx, 0)))
    return p.getCommands()

def gbounds(c, dx):
    bp = BoundsPen(gs); gs[gn(c)].draw(TransformPen(bp, Transform(K, 0, 0, -K, dx, 0)))
    return list(bp.bounds)

adv = lambda c: hm[gn(c)][0] * K

# Q'nun özel terminali: 31°, sembolün köprü açısını yineler, taban altına inmez
S = 715.0 / 2048.0
# Klasik Q kuyruğu: sayacın sağ-alt iç konturundan başlar, 31° ile halkayı keser.
# Sembolün köprü açısını yineler; taban çizgisinin altına inmez, sohbet-kuyruğu
# oluşturmaz, tam kiriş olmadığı için Ø ile karışmaz.
#
# 22.08.2026 — kuyruk baştan kuruldu. İki ayrı kusur vardı:
#
# 1) SARIM YÖNÜ TERSTİ. Nokta sırası, O'nun dış konturuyla ters yönde
#    dönüyordu; nonzero dolgu kuralında ters sarım siler, birleştirmez.
#    Yani kuyruk halkayı BOYAMIYOR, DELİYORDU — büyük ölçekte Q'nun
#    sağ-altında beyaz bir yarık görünüyordu. Küçük boyutta yarık göze
#    çarpmadığı için fark edilmemişti. Ölçümle doğrulandı: kuyruk
#    merkezindeki piksel RGB(255,255,255) idi, şimdi RGB(8,44,84).
#
# 2) İÇ UÇ SAYACIN ORTASINDA ASILIYDI. O glifinin iç ve dış konturları
#    font dosyasından okunup kuyruk ekseni nokta-poligon testiyle tarandı:
#    iç uç, sayaç kenarından 58,7 birim içerideydi — uzunluğun %36'sı beyaz
#    alanda kör uçla duruyordu. Belgedeki "sayacın sağ-altından başlar"
#    tanımına da aykırıydı.
#
# Yeni geometri: iç uç sayaç kenarına oturur (10 birim bindirme, kaynak izi
# kalmasın), dış uç 55 birim uzatılır. 55 ölçüyle seçildi: 0/32/55/80
# adayları 110/200/340 px'te karşılaştırıldı. 0'da marka "OBLOGG" okunuyor,
# 80'de kuyruk halkadan kopuk bir çubuğa dönüşüyor. 55'te Q 110 px'te bile
# okunuyor ve kuyruk halkayla bütünleşik kalıyor.
# --- Wordmark Q kuyruğu. Elle yazılmış dörtgen değil, parametreden türer.
# Sembol kuyruğu 22.08.2026'da 45°'ye alındı; wordmark 31°'de kalınca sistem
# kendi harfiyle kafiyesiz kaldı. İkisi aynı açıda olmalı: sembolün Q'su ile
# wordmark'ın Q'su aynı markanın aynı harfi.
# İç uç sabit (kâsenin içinde), dış uç açıyla döner. Uzunluk ve kalınlık aynı.
W_ACI, W_UZUNLUK, W_KALINLIK = 45.0, 167.6, 78.0
W_IC = (341.8, 405.1)                     # kâse içindeki çapa — değişmedi


def _wquad(aci=W_ACI, uz=W_UZUNLUK, kal=W_KALINLIK, ic=W_IC):
    a = math.radians(aci)
    d = (math.cos(a), math.sin(a))
    ds = (ic[0] + uz * d[0], ic[1] + uz * d[1])
    px, py = -d[1], d[0]
    h = kal / 2
    # Sarım CCW — O'nun dış konturuyla aynı yönde. Ters sarım nonzero kuralında
    # birleştirmez, SİLER; bu hata 22.08'de bir kez yaşandı ve halkayı deliyordu.
    return [(ds[0] - h * px, ds[1] - h * py), (ds[0] + h * px, ds[1] + h * py),
            (ic[0] + h * px, ic[1] + h * py), (ic[0] - h * px, ic[1] - h * py)]


QUAD = [(round(x, 1), round(y, 1)) for x, y in _wquad()]
TERM = [((oB[0] + x / S) * K, -((oB[3] - y / S) * K)) for x, y in QUAD]

SP = [0.0, 0.0, -0.045, -0.020, -0.025, 0.0]   # Q-B, B-L, L-O, O-G, G-G optik düzeltme
parts, boxes, x = [], [], 0.0
# parts_ayrik: rasterleştirme için harf ve Q kuyruğu AYRI yollar olarak da
# tutulur. Rasterleştirici çift-tek kuralı kullanır; Q'da glif + kuyruk tek
# yolda birleşince kuyruğun halkayla örtüşen kısmı XOR'lanıp DELİK açar
# (SVG'de aynı tuzak sarım yönüyle yaşandı, 22.08 kaydına bakın). Ayrı
# yollar ayrı ayrı taranıp örtüleri BİRLEŞTİRİLİNCE (max) sorun kalmaz.
parts_ayrik = []
for i, ch in enumerate('QBLOGG'):
    src = 'O' if ch == 'Q' else ch
    d, b = gpath(src, x), gbounds(src, x)
    ayrik = [d]
    if ch == 'Q':
        tp = [(px + x, py) for px, py in TERM]
        kuyruk = 'M' + ' L'.join(f'{a:.2f} {c:.2f}' for a, c in tp) + ' Z'
        d += ' ' + kuyruk
        ayrik.append(kuyruk)
        b = [min(b[0], *[p[0] for p in tp]), min(b[1], *[p[1] for p in tp]),
             max(b[2], *[p[0] for p in tp]), max(b[3], *[p[1] for p in tp])]
    parts.append(d); boxes.append(b); parts_ayrik.append(ayrik)
    x += adv(src) + SP[i] * EM
WORD = ' '.join(parts)
WX0, WX1 = min(b[0] for b in boxes), max(b[2] for b in boxes)
WY0, WY1 = min(b[1] for b in boxes), max(b[3] for b in boxes)
WW, WH = WX1 - WX0, WY1 - WY0

def svg(vb, body, w=None, h=None):
    size = f' width="{w}" height="{h}"' if w else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{size} '
            f'role="img" aria-label="QBLOGG">\n{body}\n</svg>\n')

def sym(navy=NAVY, aqua=AQUA):
    """Kâse önce, kuyruk ÜSTÜNE. Sıra kritik: eski kirişte aqua altta çiziliyordu
    ve halka onu örttüğü için çubuk yalnızca sayacın içinde görünüyordu — Ø
    okumasının kaynağı buydu. Kuyruk artık dışarı taştığı için üstte olmalı."""
    k = f'  <path fill-rule="evenodd" d="{SYM_NAVY}" fill="{navy}"/>'
    return k + (f'\n  <path d="{SYM_AQUA}" fill="{aqua}"/>' if aqua else '')

VB = '100 100 800 800'
w = {}
w['qblogg-symbol.svg']          = svg(VB, sym())
w['qblogg-symbol-navy.svg']     = svg(VB, sym(NAVY, NAVY))
w['qblogg-symbol-black.svg']    = svg(VB, sym('#000000', '#000000'))
w['qblogg-symbol-white.svg']    = svg(VB, sym('#FFFFFF', '#FFFFFF'))
w['qblogg-symbol-reverse.svg']  = svg('0 0 1000 1000',
    f'  <rect width="1000" height="1000" rx="190" fill="{NAVY}"/>\n' + sym('#FFFFFF', AQUA))
w['qblogg-icon-small.svg'] = svg(VB,
    f'  <path fill-rule="evenodd" d="{ICON_NAVY}" fill="{NAVY}"/>\n'
    f'  <path d="{ICON_AQUA}" fill="{AQUA}"/>', 24, 24)

# --- Tarayıcı sekmesi favicon'u: PNG ile BİREBİR aynı kompozisyon.
#
# Önce sekmede iki farklı marka görünüyordu: SVG favicon saydam zeminde navy
# halka, favicon-32.png ise navy zeminde beyaz halka. Tarayıcı hangisini
# seçerse farklı marka. HIG: "Provide a visually consistent icon design across
# all the platforms your app supports… prevents people from mistaking your app
# for multiple apps."
#
# Ayrıca saydam zeminli SVG, koyu tarayıcı temasında navy halkayı neredeyse
# görünmez kılıyordu. Dolu marka zemini her iki temada da ayakta duruyor.
#
# icon-small.svg'yi değiştirmek yerine ayrı varlık: o dosya uretim-testi.mjs'nin
# 16/24/32/48 px ölçek testlerinde çıplak sembol olarak kullanılıyor, rolü farklı.
_FR = 1000 / 1000 * 0.78
w['qblogg-favicon.svg'] = svg('0 0 1000 1000',
    f'  <rect width="1000" height="1000" rx="219" fill="{NAVY}"/>\n'
    f'  <g transform="translate(110 110) scale({_FR:.5f})">\n'
    f'    <path fill-rule="evenodd" d="{ICON_NAVY}" fill="#FFFFFF"/>\n'
    f'    <path d="{ICON_AQUA}" fill="{AQUA}"/>\n  </g>', 32, 32)

R = 1024 / 1000 * 0.78
w['qblogg-icon-app.svg'] = svg('0 0 1024 1024',
    # Kendi köşe yuvarlatmamız YOK — sistem kendi maskesini uyguluyor.
    # Bizimki rx=224 (%21,9), iOS süperelipsi ~%18,1: bizimki daha yuvarlak
    # olduğu için maskenin gösterdiği alanın köşelerinde bizim ikonumuz
    # yoktu. apple-touch-icon.png'de ölçüldü: (3,3) (6,6) (9,9) alpha=0.
    # iOS saydam apple-touch-icon'u SİYAH üzerine bindirir — lacivert
    # ikonun köşelerinde siyah çentikler. HIG: "If you do import a
    # background layer, make sure it's full-bleed and opaque."
    f'  <rect width="1024" height="1024" fill="{NAVY}"/>\n'
    f'  <g transform="translate(113.6 113.6) scale({R:.5f})">\n'
    f'    <path fill-rule="evenodd" d="{ICON_NAVY}" fill="#FFFFFF"/>\n'
    f'    <path d="{ICON_AQUA}" fill="{AQUA}"/>\n  </g>', 1024, 1024)

GAP_H, GAP_V = 0.36 * 800, 0.32 * 800          # 288u ve 256u
def lockup_h(navy):
    tx = (900 + GAP_H) - WX0
    ty = 500 - (WY0 + WH / 2)
    body = (sym(navy, AQUA if navy == NAVY else navy) +
            f'\n  <g transform="translate({tx:.2f} {ty:.2f})">'
            f'<path d="{WORD}" fill="{navy}"/></g>')
    return svg(f"100 100 {800 + GAP_H + WW:.2f} 800", body)

def lockup_v(navy):
    tx = 500 - (WX0 + WW / 2)
    ty = 900 + GAP_V + 520
    body = (sym(navy, AQUA if navy == NAVY else navy) +
            f'\n  <g transform="translate({tx:.2f} {ty:.2f})">'
            f'<path d="{WORD}" fill="{navy}"/></g>')
    return svg(f"{500 - WW/2:.2f} 100 {WW:.2f} {ty + WY1 - 100:.2f}", body)

w['qblogg-lockup-horizontal.svg']       = lockup_h(NAVY)
w['qblogg-lockup-horizontal-white.svg'] = lockup_h('#FFFFFF')
w['qblogg-lockup-stacked.svg']          = lockup_v(NAVY)
w['qblogg-lockup-stacked-white.svg']    = lockup_v('#FFFFFF')

for name, body in w.items():
    (OUT / name).write_text(body, encoding='utf8')
    print(f'  ✓ {OUT.name}/{name}  ({len(body)} B)')
print(f'\nwordmark: {WW:.1f} x {WH:.1f} u · cap 520u · yatay kilit {820 + GAP_H + WW:.1f}u geniş')


# ---------------------------------------------------------------------------
# Raster çıktı: favicon-32.png ve apple-touch-icon.png
#
# Bu blok eklenene kadar betik 13 varlığın 11'ini üretiyordu; iki PNG başka bir
# yoldan yapılmıştı ve yeniden üretilemiyordu. Yani "üretim kaydı" eksikti.
#
# Rasterleştirici stdlib ile yazıldı — projenin bağımlılık kuralı gereği yeni
# paket eklenmiyor. Yöntem: yolları düz çizgilere böl, alt tarama satırlarında
# çift-tek (even-odd) kesişim al, x'te tam örtüşme hesapla. y'de SS kat
# örnekleme, x'te analitik: 32 px'te bile kenarlar temiz çıkıyor.
# ---------------------------------------------------------------------------
import re as _re
import zlib as _zlib
import struct as _struct

_SS = 8          # y ekseninde alt örnekleme
_QSEG = 24       # kuadratik eğri kaç doğru parçasına bölünüyor


def _yollari_coz(d):
    """SVG yol dizesini poligon listesine çevirir (M/L/H/V/Q/Z destekli).
    H/V font ana hatları için gerekli: SVGPathPen dik çizgileri H/V yazar."""
    polis, cur = [], []
    x = y = 0.0
    for komut, arg in _re.findall(r'([MLHVQZ])([^MLHVQZ]*)', d, _re.I):
        s = [float(v) for v in _re.findall(r'-?\d*\.?\d+', arg)]
        k = komut.upper()
        if k == 'M':
            if cur:
                polis.append(cur)
            x, y = s[0], s[1]
            cur = [(x, y)]
        elif k == 'L':
            for i in range(0, len(s), 2):
                x, y = s[i], s[i + 1]
                cur.append((x, y))
        elif k == 'H':
            for v in s:
                x = v
                cur.append((x, y))
        elif k == 'V':
            for v in s:
                y = v
                cur.append((x, y))
        elif k == 'Q':
            for i in range(0, len(s), 4):
                cx, cy, nx, ny = s[i:i + 4]
                for j in range(1, _QSEG + 1):
                    t = j / _QSEG
                    u = 1 - t
                    cur.append((u * u * x + 2 * u * t * cx + t * t * nx,
                                u * u * y + 2 * u * t * cy + t * t * ny))
                x, y = nx, ny
        elif k == 'Z':
            if cur:
                polis.append(cur)
            cur = []
    if cur:
        polis.append(cur)
    return polis


def _yuvarlak_kare(boy, r):
    """Köşeleri yarıçapı r olan kare — köşeler çeyrek daire olarak bölünür."""
    import math
    p, N = [], 24
    for cx, cy, bas in ((boy - r, r, -90), (boy - r, boy - r, 0), (r, boy - r, 90), (r, r, 180)):
        for i in range(N + 1):
            a = math.radians(bas + 90 * i / N)
            p.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return [p]


def _ortu(polis, en, boy):
    """Poligonların piksel başına örtme oranı (0..1). Çift-tek kuralı."""
    kenar = []
    for poli in polis:
        for i in range(len(poli)):
            x0, y0 = poli[i]
            x1, y1 = poli[(i + 1) % len(poli)]
            if y0 != y1:
                kenar.append((x0, y0, x1, y1))
    ortu = [[0.0] * en for _ in range(boy)]
    for satir in range(boy):
        for alt in range(_SS):
            sy = satir + (alt + 0.5) / _SS
            kesim = sorted(x0 + (sy - y0) * (x1 - x0) / (y1 - y0)
                           for x0, y0, x1, y1 in kenar
                           if (y0 <= sy < y1) or (y1 <= sy < y0))
            for i in range(0, len(kesim) - 1, 2):
                a, b = max(0.0, kesim[i]), min(float(en), kesim[i + 1])
                if b <= a:
                    continue
                for px in range(int(a), min(en, int(b) + 1)):
                    ortu[satir][px] += (min(b, px + 1) - max(a, px)) / _SS
    return ortu


def _png_yaz(hedef, en, boy, piksel):
    ham = b''.join(b'\x00' + bytes(piksel[s]) for s in range(boy))

    def parca(tip, veri):
        return (_struct.pack('>I', len(veri)) + tip + veri
                + _struct.pack('>I', _zlib.crc32(tip + veri) & 0xffffffff))

    hedef.write_bytes(
        b'\x89PNG\r\n\x1a\n'
        + parca(b'IHDR', _struct.pack('>IIBBBBB', en, boy, 8, 6, 0, 0, 0))
        + parca(b'IDAT', _zlib.compress(ham, 9))
        + parca(b'IEND', b''))


def _ikon_uret(ad, boy):
    """qblogg-icon-app.svg ile aynı kompozisyon: navy zemin, aqua köprü, beyaz halka."""
    k = boy / 1024.0
    olcek, kaydir = 0.79872 * k, 113.6 * k

    def don(d):
        return [[(kaydir + olcek * x, kaydir + olcek * y) for x, y in poli]
                for poli in _yollari_coz(d)]

    # Zemin iki bağlamda farklı olmalı:
    #  · apple-touch-icon — iOS KENDİ maskesini uygular ve saydam pikselleri
    #    SİYAH üzerine bindirir. Kendi köşemizi yuvarlatırsak maskenin
    #    gösterdiği alanın köşelerinde siyah çentik çıkar. Ölçüldü: eski
    #    dosyada (3,3) (6,6) (9,9) alpha=0. Bu yüzden TAM KARE, TAM OPAK.
    #  · favicon — tarayıcı sekmesinde maskeleme YOK. Orada yuvarlak köşe
    #    doğru ve daha iyi durur; saydamlık da sorun değil.
    if boy >= 120:                       # apple-touch-icon (180) ve üstü
        zemin = [[1.0] * boy for _ in range(boy)]
    else:                                # favicon (32)
        zemin = _ortu(_yuvarlak_kare(boy, 224 * k), boy, boy)
    # ICON_* çifti — SYM_* değil. qblogg-icon-app.svg küçük boy geometrisini
    # kullanıyor; burada sembolünki kullanılırsa PNG'ler app ikonunun aynısı
    # olmaz. Denetimde bir kez yakalandı (R01): köprü SYM_AQUA yazılmıştı ve
    # 'birebir aynı' denmişti. 22.08.2026'da halka için aynı hata yeniden
    # doğdu: ICON_NAVY sembolden ayrılınca bu satır SYM_NAVY'de kalmıştı.
    aqua = _ortu(don(ICON_AQUA), boy, boy)
    halka = _ortu(don(ICON_NAVY), boy, boy)

    NV, AQ, BZ = (8, 44, 84), (0, 216, 194), (255, 255, 255)
    satirlar = []
    for s in range(boy):
        row = bytearray()
        for p in range(boy):
            a = min(1.0, zemin[s][p])
            renk = NV
            # Sıra: halka önce, kuyruk ÜSTÜNE — SVG'lerdeki sırayla aynı.
            # Ters olursa kuyruğun kâse dışına taşan kısmı halka tarafından
            # örtülür ve PNG, SVG'den farklı çıkar.
            for ust, ustrenk in ((halka[s][p], BZ), (aqua[s][p], AQ)):
                o = min(1.0, ust)
                if o > 0:
                    renk = tuple(round(r * (1 - o) + u * o) for r, u in zip(renk, ustrenk))
            row += bytes((renk[0], renk[1], renk[2], round(a * 255)))
        satirlar.append(row)
    _png_yaz(OUT / ad, boy, boy, satirlar)
    print(f'  ✓ {OUT.name}/{ad}  ({boy}x{boy})')


_ikon_uret('favicon-32.png', 32)
_ikon_uret('apple-touch-icon.png', 180)


# ---------------------------------------------------------------------------
# og-image.png (1200×630) — sosyal paylaşım kartı.
#
# Bağlantı LinkedIn/WhatsApp/X'te paylaşılınca görünen görsel. Metin YOK:
# görsel on dilin hepsinde aynı bağlantıyla kullanılıyor, dile bağlı metin
# hangi dilde olsa dokuzuna yanlış olurdu. Navy zemin + beyaz yatay kilit;
# koyu/açık her akışta ayakta durur (reverse varyantla aynı mantık).
#
# Kompozisyon parametreleri: kilit genişliği tuval eninin %62'si, dikeyde
# merkezli. %62, 630 yükseklikte 120 px üstü cap yüksekliği bırakıyor —
# küçük önizlemede (WhatsApp ~110 px) bile wordmark okunur kalıyor.
# ---------------------------------------------------------------------------
def _og_uret(ad, en, boy):
    NV, AQ, BZ = (8, 44, 84), (0, 216, 194), (255, 255, 255)
    kilit_w = 800 + GAP_H + WW                 # u — sembol + boşluk + wordmark
    k = (en * 0.62) / kilit_w
    ox = (en - kilit_w * k) / 2
    oy = (boy - 800 * k) / 2                   # sembol yüksekliği 800u

    def don(d, dx=0.0, dy=0.0):
        # Rasterleştirici yalnızca M/L/Q/Z tanır; sessiz eksik çizim olmasın.
        komutlar = set(_re.findall(r'[A-Za-z]', d))
        assert komutlar <= set('MLHVQZmlhvqz'), f'desteklenmeyen yol komutu: {komutlar}'
        return [[(ox + (px + dx - 100) * k, oy + (py + dy - 100) * k)
                 for px, py in poli] for poli in _yollari_coz(d)]

    # Wordmark, lockup_h ile AYNI yerleşimle taşınır (tek kaynak: aynı formül).
    tx = (900 + GAP_H) - WX0
    ty = 500 - (WY0 + WH / 2)

    beyaz = [[0.0] * en for _ in range(boy)]
    def birlestir(o):
        for s in range(boy):
            bs, os_ = beyaz[s], o[s]
            for p in range(en):
                if os_[p] > bs[p]:
                    bs[p] = os_[p]

    birlestir(_ortu(don(SYM_NAVY), en, boy))               # halka (çift-tek: sayaç delik)
    for ayrik in parts_ayrik:                              # harfler; Q kuyruğu ayrı
        for d in ayrik:
            birlestir(_ortu(don(d, tx, ty), en, boy))
    aqua = _ortu(don(SYM_AQUA), en, boy)                   # sembol kuyruğu en üstte

    satirlar = []
    for s in range(boy):
        row = bytearray()
        for p in range(en):
            renk = NV
            for ust, ustrenk in ((beyaz[s][p], BZ), (aqua[s][p], AQ)):
                o = min(1.0, ust)
                if o > 0:
                    renk = tuple(round(r * (1 - o) + u * o) for r, u in zip(renk, ustrenk))
            row += bytes((renk[0], renk[1], renk[2], 255))
        satirlar.append(row)
    _png_yaz(OUT / ad, en, boy, satirlar)
    print(f'  ✓ {OUT.name}/{ad}  ({en}x{boy})')


_og_uret('og-image.png', 1200, 630)


# ---------------------------------------------------------------------------
# MANIFEST.md — hangi dosya, hangi rol, hangi özet.
# Çıktı-entegrasyon denetimi v0.2, kabul kontrolü 8: "her başvurulan dosya
# mevcut ve özeti kayıtlı olmalı". Özet burada üretilir ki elle güncellenmesin.
# ---------------------------------------------------------------------------
import hashlib as _hl

_ROL = {
    'qblogg-symbol.svg': 'Ana sembol, tam renk — birincil varlık',
    'qblogg-symbol-navy.svg': 'Sembol, tek renk navy',
    'qblogg-symbol-white.svg': 'Sembol, tek renk beyaz',
    'qblogg-symbol-black.svg': 'Sembol, tek renk siyah — faks/gravür',
    'qblogg-symbol-reverse.svg': 'Koyu zeminde, yuvarlatılmış alan',
    'qblogg-lockup-horizontal.svg': 'Yatay kilit (sembol + wordmark)',
    'qblogg-lockup-horizontal-white.svg': 'Yatay kilit, koyu zemin',
    'qblogg-lockup-stacked.svg': 'Dikey kilit',
    'qblogg-lockup-stacked-white.svg': 'Dikey kilit, koyu zemin',
    'qblogg-icon-app.svg': '1024×1024 uygulama ikonu — köprü 100u',
    'qblogg-icon-small.svg': '16–32 px ikon — sembolle aynı geometri',
    'qblogg-favicon.svg': 'Tarayıcı sekmesi SVG — favicon-32.png ile aynı kompozisyon',
    'favicon-32.png': 'Tarayıcı sekmesi, 32×32 — app ikonundan',
    'apple-touch-icon.png': 'iOS ana ekran, 180×180 — app ikonundan',
    'og-image.png': 'Sosyal paylaşım kartı, 1200×630 — yatay kilitten',
}

_satir = []
for _ad in sorted(_ROL):
    _p = OUT / _ad
    if not _p.exists():
        _satir.append(f'| `{_ad}` | {_ROL[_ad]} | — | **DOSYA YOK** |')
        continue
    _b = _p.read_bytes()
    # Binlik ayracı yalnızca sayıya uygulanır. Önce tüm satıra uygulanıyordu
    # ve rol metnindeki virgülleri de noktaya çeviriyordu.
    _boy = f'{len(_b):,}'.replace(',', '.')
    _satir.append(f'| `{_ad}` | {_ROL[_ad]} | {_boy} | `{_hl.sha256(_b).hexdigest()[:16]}` |')

_fazla = sorted(p.name for p in OUT.iterdir() if p.name not in _ROL and p.name != 'MANIFEST.md')

(OUT / 'MANIFEST.md').write_text(
    '# QBLOGG marka varlıkları — manifesto\n\n'
    '`python3 scripts/marka-uret.py` üretir. **Elle düzenlemeyin.**\n\n'
    'Özetler SHA-256\'nın ilk 16 hanesi. Bir dosya beklenmedik biçimde\n'
    'değiştiyse özeti burada tutmaz — üretici yeniden çalıştırılıp\n'
    'değişikliğin kaynağı bulunmalıdır.\n\n'
    '| Dosya | Rol | Bayt | SHA-256 |\n|---|---|---:|---|\n'
    + '\n'.join(_satir) + '\n\n'
    + (f'**Manifesto dışı dosya:** {", ".join(_fazla)}\n' if _fazla
       else 'Klasörde manifesto dışı dosya yok.\n'),
    encoding='utf8')
print(f'  ✓ {OUT.name}/MANIFEST.md  ({len(_ROL)} varlık kayıtlı)')
