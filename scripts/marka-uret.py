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
from pathlib import Path

NAVY, AQUA = '#082C54', '#00D8C2'
OUT = Path('assets/brand'); OUT.mkdir(parents=True, exist_ok=True)

# --- sembol: 1000x1000 ızgara, ~820x820 ayak izi (üst/alt 10u overshoot dahil)
SYM_NAVY = ("M180 100 Q500 80 820 100 Q900 100 900 180 Q920 500 900 824 "
            "Q900 900 824 900 Q500 920 180 900 Q100 900 100 820 Q80 500 100 180 "
            "Q100 100 180 100 Z "
            "M378 251 Q500 239 622 251 Q742 251 742 371 Q754 493 742 615 "
            "Q742 735 622 735 Q500 747 378 735 Q258 735 258 615 Q246 493 258 371 "
            "Q258 251 378 251 Z")
SYM_AQUA = "M484 673.4 L569.2 815.2 L799.9 676.5 L714.7 534.7 Z"

# --- küçük boy ikonu: bombeler düzleştirilir, 16-24 px'te kenarlar net kalır
ICON_NAVY = ("M180 100 L820 100 Q900 100 900 180 L900 824 Q900 900 824 900 "
             "L180 900 Q100 900 100 820 L100 180 Q100 100 180 100 Z "
             "M378 251 L622 251 Q742 251 742 371 L742 615 Q742 735 622 735 "
             "L378 735 Q258 735 258 615 L258 371 Q258 251 378 251 Z")

# --- wordmark ana hatları
font = instantiateVariableFont(TTFont('assets/fonts/inter-latin.woff2'), {'wght': 700}, inplace=True)
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
QUAD = [(298.7, 378.7), (258.5, 445.5), (386.2, 522.3), (426.4, 455.5)]
TERM = [((oB[0] + x / S) * K, -((oB[3] - y / S) * K)) for x, y in QUAD]

SP = [0.0, 0.0, -0.045, -0.020, -0.025, 0.0]   # Q-B, B-L, L-O, O-G, G-G optik düzeltme
parts, boxes, x = [], [], 0.0
for i, ch in enumerate('QBLOGG'):
    src = 'O' if ch == 'Q' else ch
    d, b = gpath(src, x), gbounds(src, x)
    if ch == 'Q':
        tp = [(px + x, py) for px, py in TERM]
        d += ' M' + ' L'.join(f'{a:.2f} {c:.2f}' for a, c in tp) + ' Z'
        b = [min(b[0], *[p[0] for p in tp]), min(b[1], *[p[1] for p in tp]),
             max(b[2], *[p[0] for p in tp]), max(b[3], *[p[1] for p in tp])]
    parts.append(d); boxes.append(b)
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
    a = f'  <path d="{SYM_AQUA}" fill="{aqua}"/>\n' if aqua else ''
    return a + f'  <path fill-rule="evenodd" d="{SYM_NAVY}" fill="{navy}"/>'

VB = '90 90 820 820'
w = {}
w['qblogg-symbol.svg']          = svg(VB, sym())
w['qblogg-symbol-navy.svg']     = svg(VB, sym(NAVY, NAVY))
w['qblogg-symbol-black.svg']    = svg(VB, sym('#000000', '#000000'))
w['qblogg-symbol-white.svg']    = svg(VB, sym('#FFFFFF', '#FFFFFF'))
w['qblogg-symbol-reverse.svg']  = svg('0 0 1000 1000',
    f'  <rect width="1000" height="1000" fill="{NAVY}"/>\n' + sym('#FFFFFF', AQUA))
w['qblogg-icon-small.svg'] = svg(VB,
    f'  <path d="{SYM_AQUA}" fill="{AQUA}"/>\n'
    f'  <path fill-rule="evenodd" d="{ICON_NAVY}" fill="{NAVY}"/>', 24, 24)

R = 1024 / 1000 * 0.78
w['qblogg-icon-app.svg'] = svg('0 0 1024 1024',
    f'  <rect width="1024" height="1024" rx="224" fill="{NAVY}"/>\n'
    f'  <g transform="translate(113.6 113.6) scale({R:.5f})">\n'
    f'    <path d="{SYM_AQUA}" fill="{AQUA}"/>\n'
    f'    <path fill-rule="evenodd" d="{ICON_NAVY}" fill="#FFFFFF"/>\n  </g>', 1024, 1024)

GAP_H, GAP_V = 0.36 * 800, 0.32 * 800          # 288u ve 256u
def lockup_h(navy):
    tx = (910 + GAP_H) - WX0
    ty = 500 - (WY0 + WH / 2)
    body = (sym(navy, AQUA if navy == NAVY else navy) +
            f'\n  <g transform="translate({tx:.2f} {ty:.2f})">'
            f'<path d="{WORD}" fill="{navy}"/></g>')
    return svg(f'90 90 {820 + GAP_H + WW:.2f} 820', body)

def lockup_v(navy):
    tx = 500 - (WX0 + WW / 2)
    ty = 910 + GAP_V + 520
    body = (sym(navy, AQUA if navy == NAVY else navy) +
            f'\n  <g transform="translate({tx:.2f} {ty:.2f})">'
            f'<path d="{WORD}" fill="{navy}"/></g>')
    return svg(f'{500 - WW/2:.2f} 90 {WW:.2f} {ty + WY1 - 90:.2f}', body)

w['qblogg-lockup-horizontal.svg']       = lockup_h(NAVY)
w['qblogg-lockup-horizontal-white.svg'] = lockup_h('#FFFFFF')
w['qblogg-lockup-stacked.svg']          = lockup_v(NAVY)
w['qblogg-lockup-stacked-white.svg']    = lockup_v('#FFFFFF')

for name, body in w.items():
    (OUT / name).write_text(body, encoding='utf8')
    print(f'  ✓ assets/brand/{name}  ({len(body)} B)')
print(f'\nwordmark: {WW:.1f} x {WH:.1f} u · cap 520u · yatay kilit {820 + GAP_H + WW:.1f}u geniş')
