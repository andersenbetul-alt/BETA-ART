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
SYM_AQUA = "M368.6 722.4 L412.9 796.1 L808.5 558.4 L764.2 484.7 Z"

# --- küçük boy ikonu: köprü 100u'ya kalınlaştırılır, 16 px'te ayakta kalsın diye
ICON_NAVY = SYM_NAVY
ICON_AQUA = "M369.7 723.0 L421.2 808.7 L815.7 571.6 L764.2 485.9 Z"

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
# Klasik Q kuyruğu: sayacın sağ-altından başlar, 31° ile halkayı keser, dış konturun
# 22u ötesinde biter. Sembolün köprü açısını yineler; taban çizgisinin altına inmez,
# sohbet-kuyruğu oluşturmaz, tam kiriş olmadığı için Ø ile karışmaz.
QUAD = [(320.1, 346.6), (279.9, 413.4), (418.2, 496.5), (458.4, 429.7)]
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

VB = '100 100 800 800'
w = {}
w['qblogg-symbol.svg']          = svg(VB, sym())
w['qblogg-symbol-navy.svg']     = svg(VB, sym(NAVY, NAVY))
w['qblogg-symbol-black.svg']    = svg(VB, sym('#000000', '#000000'))
w['qblogg-symbol-white.svg']    = svg(VB, sym('#FFFFFF', '#FFFFFF'))
w['qblogg-symbol-reverse.svg']  = svg('0 0 1000 1000',
    f'  <rect width="1000" height="1000" rx="190" fill="{NAVY}"/>\n' + sym('#FFFFFF', AQUA))
w['qblogg-icon-small.svg'] = svg(VB,
    f'  <path d="{ICON_AQUA}" fill="{AQUA}"/>\n'
    f'  <path fill-rule="evenodd" d="{ICON_NAVY}" fill="{NAVY}"/>', 24, 24)

R = 1024 / 1000 * 0.78
w['qblogg-icon-app.svg'] = svg('0 0 1024 1024',
    f'  <rect width="1024" height="1024" rx="224" fill="{NAVY}"/>\n'
    f'  <g transform="translate(113.6 113.6) scale({R:.5f})">\n'
    f'    <path d="{ICON_AQUA}" fill="{AQUA}"/>\n'
    f'    <path fill-rule="evenodd" d="{ICON_NAVY}" fill="#FFFFFF"/>\n  </g>', 1024, 1024)

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
    """SVG yol dizesini poligon listesine çevirir (M/L/Q/Z destekli)."""
    polis, cur = [], []
    x = y = 0.0
    for komut, arg in _re.findall(r'([MLQZ])([^MLQZ]*)', d, _re.I):
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

    zemin = _ortu(_yuvarlak_kare(boy, 224 * k), boy, boy)
    # ICON_AQUA — SYM_AQUA değil. qblogg-icon-app.svg 100u köprüyü kullanıyor;
    # burada 86u kullanılırsa PNG'ler app ikonunun aynısı olmaz. Denetimde
    # yakalandı (R01): önce SYM_AQUA yazılmıştı ve 'birebir aynı' denmişti.
    aqua = _ortu(don(ICON_AQUA), boy, boy)
    halka = _ortu(don(SYM_NAVY), boy, boy)

    NV, AQ, BZ = (8, 44, 84), (0, 216, 194), (255, 255, 255)
    satirlar = []
    for s in range(boy):
        row = bytearray()
        for p in range(boy):
            a = min(1.0, zemin[s][p])
            renk = NV
            for ust, ustrenk in ((aqua[s][p], AQ), (halka[s][p], BZ)):
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
    'qblogg-icon-small.svg': '16–32 px ikon — köprü 100u',
    'favicon-32.png': 'Tarayıcı sekmesi, 32×32 — app ikonundan',
    'apple-touch-icon.png': 'iOS ana ekran, 180×180 — app ikonundan',
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
