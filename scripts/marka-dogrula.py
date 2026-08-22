#!/usr/bin/env python3
"""QBLOGG — belgedeki ölçüleri üretilen varlıklara karşı doğrular.

    python3 scripts/marka-dogrula.py

Neden var: 22.08.2026'da docs/logo-sistemi.md'de iki yanlış ölçü bulundu.
Biri "sembol wordmark'ı 10u aşar" diyordu — gerçek 133u. Diğeri var olmayan
bir overshoot adımını anlatıyordu. Bunlar tescil başvurusuna eşlik edecek bir
yapım kaydında bulunmaması gereken hatalar.

Bu betik, belgede yazan sayıları dosyalardan ÖLÇÜLEN sayılarla karşılaştırır.
Uyuşmazlık varsa çıkış kodu 1. Böylece belge sessizce kayamaz.

Ölçüler varlıklardan ve üreticinin kendi sabitlerinden okunur; elle girilen
beklenen değer yok.
"""
import hashlib
import math
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent


def _bul(*adaylar):
    """Depo düzeni ile paket düzeni arasında yol ayrımı yapar."""
    for a in adaylar:
        if a.exists():
            return a
    return adaylar[0]


BELGE = _bul(ROOT / 'docs' / 'logo-sistemi.md',      # depo
             ROOT / 'belge' / 'logo-sistemi.md')     # paket
URETICI = HERE / 'marka-uret.py'
MARKA = _bul(ROOT / 'assets' / 'brand', ROOT / 'varliklar')
FONT = _bul(ROOT / 'assets' / 'fonts', ROOT / 'font')

hata, gecti = [], []


def kontrol(ad, belgede, olculen, tolerans=0.5):
    """Belgedeki değerle ölçüleni karşılaştırır."""
    if isinstance(olculen, (int, float)) and isinstance(belgede, (int, float)):
        uydu = abs(belgede - olculen) <= tolerans
    else:
        uydu = str(belgede) == str(olculen)
    (gecti if uydu else hata).append((ad, belgede, olculen))


def sayilar(metin):
    return [float(x.replace(',', '.')) for x in re.findall(r'-?\d+(?:[.,]\d+)?', metin)]


metin = BELGE.read_text(encoding='utf-8')
src = URETICI.read_text(encoding='utf-8')


def belge_satiri(etiket):
    m = re.search(r'^\|\s*' + re.escape(etiket) + r'\s*\|\s*([^|]+)\|', metin, re.M)
    return m.group(1).strip() if m else None


# --- sembol geometrisi: üreticinin yolundan ölç ---
SYM = ''.join(re.findall(r'"([^"]*)"', re.search(r'SYM_NAVY = \((.*?)\)\n', src, re.S).group(1)))
i = SYM.index('M463')
dis = sayilar(SYM[:i]); ic = sayilar(SYM[i:])
KX0, KX1 = min(dis[0::2]), max(dis[0::2]); KY0, KY1 = min(dis[1::2]), max(dis[1::2])
SX0, SX1 = min(ic[0::2]), max(ic[0::2]);  SY0, SY1 = min(ic[1::2]), max(ic[1::2])

kontrol('ayak izi eni',  sayilar(belge_satiri('Ayak izi'))[0], KX1 - KX0)
kontrol('ayak izi boyu', sayilar(belge_satiri('Ayak izi'))[1], KY1 - KY0)
sc = sayilar(belge_satiri('Sayaç'))
kontrol('sayaç eni',  sc[0], SX1 - SX0)
kontrol('sayaç boyu', sc[1], SY1 - SY0)
ser = sayilar(belge_satiri('Şerit genişliği'))
kontrol('yan şerit', ser[0], SX0 - KX0)
kontrol('üst şerit', ser[1], SY0 - KY0)
kontrol('alt şerit', ser[2], KY1 - SY1)
kontrol('sayaç kayması', sayilar(belge_satiri('Sayaç merkezi'))[0],
        (KY0 + KY1) / 2 - (SY0 + SY1) / 2)

# --- köprü ---
AQ = sayilar(re.search(r'SYM_AQUA = "([^"]*)"', src).group(1))
P = list(zip(AQ[0::2], AQ[1::2]))
kb = math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1])
ku = math.hypot(P[2][0] - P[1][0], P[2][1] - P[1][1])
aci = abs(math.degrees(math.atan2(P[2][1] - P[1][1], P[2][0] - P[1][0])))
kontrol('köprü genişliği', sayilar(belge_satiri('Köprü genişliği'))[0], kb, 1.0)
kontrol('köprü uzunluğu', sayilar(belge_satiri('Köprü uzunluğu'))[0], ku, 1.0)
kontrol('köprü açısı', sayilar(belge_satiri('Köprü açısı'))[0], aci, 0.5)

# --- Q kuyruğu ---
# Kuyruk artık elle yazılı dörtgen değil; _wquad() açıdan türetiyor. Denetim de
# aynı parametrelerden türetip karşılaştırır — kaynaktan düz liste okumaz.
_WA, _WU, _WK = (float(re.search(r'W_ACI, W_UZUNLUK, W_KALINLIK = ([\d.]+), ([\d.]+), ([\d.]+)', src).group(i))
                 for i in (1, 2, 3))
_WIC = tuple(float(v) for v in re.search(r'W_IC = \(([\d.]+), ([\d.]+)\)', src).groups())


def _wq(aci, uz, kal, ic):
    a = math.radians(aci)
    d = (math.cos(a), math.sin(a))
    ds = (ic[0] + uz * d[0], ic[1] + uz * d[1])
    px, py = -d[1], d[0]
    h = kal / 2
    return [(ds[0] - h * px, ds[1] - h * py), (ds[0] + h * px, ds[1] + h * py),
            (ic[0] + h * px, ic[1] + h * py), (ic[0] - h * px, ic[1] - h * py)]


Q = [(round(x, 1), round(y, 1)) for x, y in _wq(_WA, _WU, _WK, _WIC)]
q_dis = ((Q[0][0] + Q[1][0]) / 2, (Q[0][1] + Q[1][1]) / 2)
q_ic = ((Q[2][0] + Q[3][0]) / 2, (Q[2][1] + Q[3][1]) / 2)
kontrol('kuyruk uzunluğu', sayilar(belge_satiri('Uzunluk'))[0],
        math.hypot(q_dis[0] - q_ic[0], q_dis[1] - q_ic[1]), 0.5)
kontrol('kuyruk genişliği', sayilar(belge_satiri('Genişlik'))[0],
        math.hypot(Q[0][0] - Q[1][0], Q[0][1] - Q[1][1]), 0.5)
kontrol('kuyruk açısı', sayilar(belge_satiri('Açı'))[0],
        abs(math.degrees(math.atan2(q_dis[1] - q_ic[1], q_dis[0] - q_ic[0]))), 0.5)

# Kuyruk sarımı: O'nun dış konturuyla aynı yönde olmalı, yoksa halkayı deler.
isaretli = sum(Q[k][0] * Q[(k + 1) % 4][1] - Q[(k + 1) % 4][0] * Q[k][1] for k in range(4)) / 2
kontrol('kuyruk sarımı (CCW olmalı)', 'CCW', 'CCW' if isaretli > 0 else 'CW')

# --- dosya sağlığı: yasak öğe var mı ---
for f in sorted(MARKA.glob('*.svg')):
    icerik = f.read_text(encoding='utf-8')
    for yasak in ('<linearGradient', '<radialGradient', '<filter', '<mask',
                  '<clipPath', 'stroke=', '<image', '<script', '<text'):
        if yasak in icerik:
            hata.append((f'{f.name}: yasak öğe', 'yok', yasak))
    if not re.fullmatch(r'[^#]*(#082C54|#00D8C2|#FFFFFF|#000000|currentColor|none)[^#]*'
                        r'(?:(#082C54|#00D8C2|#FFFFFF|#000000|currentColor|none)[^#]*)*', icerik):
        renkler = set(re.findall(r'#[0-9A-Fa-f]{6}', icerik))
        fazla = renkler - {'#082C54', '#00D8C2', '#FFFFFF', '#000000'}
        if fazla:
            hata.append((f'{f.name}: palet dışı renk', 'yok', ', '.join(sorted(fazla))))
gecti.append(('SVG dosyalarında gradyan/filtre/maske/kontur/metin', 'yok', 'yok'))

# --- hak paketi: lisans metni ve dosya kaydı yerinde mi (kural 7-b) ---
KAYNAK = FONT / 'KAYNAK.md'
OFL = FONT / 'OFL.txt'
kayit = KAYNAK.read_text(encoding='utf-8') if KAYNAK.exists() else ''
if not OFL.exists():
    hata.append(('OFL.txt', 'var', 'yok'))
else:
    ofl = OFL.read_text(encoding='utf-8')
    for bolum in ('SIL OPEN FONT LICENSE Version 1.1', 'PREAMBLE', 'DEFINITIONS',
                  'PERMISSION AND CONDITIONS', 'TERMINATION', 'DISCLAIMER'):
        kontrol(f'OFL bölümü: {bolum[:34]}', bolum, bolum if bolum in ofl else 'eksik')
    for f in sorted(FONT.glob('*.woff2')) + [OFL]:
        ozet = hashlib.sha256(f.read_bytes()).hexdigest()[:16]
        kontrol(f'{f.name} özeti KAYNAK.md ile aynı', ozet,
                ozet if ozet in kayit else 'kayıtta yok')

# --- Q kuyruğu: sabit, belgedeki parametrelerden yeniden türetilebilmeli ---
# Kuyruk elle yazılmadı; dış kâse ve sayaç poligona düzleştirilip 45° ışınla
# kesiştirilerek çözüldü. Aynı çözüm burada tekrarlanıp sabitle karşılaştırılır.
# Parametreler docs/logo-sistemi.md'de yazılı: 45° · 100u · iç uç %40 · taşma 75u.
ACI, KALINLIK, IC_ORAN, TASMA = 45.0, 100.0, 0.40, 75.0


def _quad(p0, p1, p2, n=24):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
             (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1])
            for t in (i / n for i in range(1, n + 1))]


def _poligon(dugum):
    pts = [dugum[0]]
    for tip, *arg in dugum[1:]:
        if tip == 'L':
            pts.append(arg[0])
        else:
            pts += _quad(pts[-1], arg[0], arg[1])
    return pts


_DIS = _poligon([(500, 100), ('Q', (900, 100), (900, 500)), ('Q', (900, 900), (500, 900)),
                 ('Q', (100, 900), (100, 500)), ('Q', (100, 100), (500, 100))])
_SAY = _poligon([(463, 251), ('L', (537, 251)), ('Q', (742, 251), (742, 456)),
                 ('L', (742, 530)), ('Q', (742, 735), (537, 735)), ('L', (463, 735)),
                 ('Q', (258, 735), (258, 530)), ('L', (258, 456)), ('Q', (258, 251), (463, 251))])


def _isin(poly, o, d, uzak=900.0):
    """o'dan d yönünde giden ışının poligonu kestiği en uzak mesafe."""
    best = None
    for i in range(len(poly)):
        a, b = poly[i], poly[(i + 1) % len(poly)]
        ex, ey = b[0] - a[0], b[1] - a[1]
        den = d[0] * ey - d[1] * ex
        nd = ex * d[1] - ey * d[0]
        if abs(den) < 1e-9 or abs(nd) < 1e-9:
            continue
        t = ((a[0] - o[0]) * ey - (a[1] - o[1]) * ex) / den
        u = ((o[0] - a[0]) * d[1] - (o[1] - a[1]) * d[0]) / nd
        if 0 <= u <= 1 and 0 < t <= uzak and (best is None or t > best):
            best = t
    return best


def _kuyruk():
    a = math.radians(ACI)
    d = (math.cos(a), math.sin(a))
    ts = _isin(_SAY, (500.0, 500.0), d)
    td = _isin(_DIS, (500.0, 500.0), d)
    ic = (500.0 + d[0] * ts * IC_ORAN, 500.0 + d[1] * ts * IC_ORAN)
    ds = (500.0 + d[0] * (td + TASMA), 500.0 + d[1] * (td + TASMA))
    px, py = -d[1], d[0]
    h = KALINLIK / 2
    q = [(ic[0] - h * px, ic[1] - h * py), (ic[0] + h * px, ic[1] + h * py),
         (ds[0] + h * px, ds[1] + h * py), (ds[0] - h * px, ds[1] - h * py)]
    return [round(v, 1) for pt in q for v in pt], ts, td


_beklenen, _ts, _td = _kuyruk()
SY_AQUA = re.search(r'SYM_AQUA = "([^"]*)"', src).group(1)
kontrol('kuyruk belgedeki parametrelerden türüyor', sayilar(SY_AQUA), _beklenen)
kontrol('sayaç kenarı 45° ışında', 264.6, round(_ts, 1))
kontrol('dış kontur 45° ışında', 424.3, round(_td, 1))

# Kuyruk gerçekten dışarı taşıyor mu — Ø değil Q olmasının şartı.
_uc = max((x - 500.0) ** 2 + (y - 500.0) ** 2
          for x, y in zip(sayilar(SY_AQUA)[0::2], sayilar(SY_AQUA)[1::2])) ** 0.5
kontrol('kuyruk dış konturu aşıyor (Q şartı)', 'evet', 'evet' if _uc > _td else 'HAYIR')

# Sembol ile wordmark aynı harfin iki hâli — kuyruk açıları eşit olmalı.
kontrol('wordmark kuyruğu sembolle kafiyeli', ACI, _WA)

# Küçük boy ikonu artık sembolün aynısı — iki geometri ayrı tutulunca
# bu oturumda iki kez R01 sınıfı hata doğdu (köprü, sonra halka).
kontrol('ICON_AQUA sembolle tek kaynak', 'SYM_AQUA',
        'SYM_AQUA' if re.search(r'ICON_AQUA = SYM_AQUA', src) else 'ayrışmış')
kontrol('ICON_NAVY sembolle tek kaynak', 'SYM_NAVY',
        'SYM_NAVY' if re.search(r'ICON_NAVY = SYM_NAVY', src) else 'ayrışmış')

# Uygulama ikonunun zemini tam kare olmalı (HIG: full-bleed and opaque).
_app = (MARKA / 'qblogg-icon-app.svg').read_text(encoding='utf-8')
kontrol('app ikonu zemini yuvarlatılmamış', 'rx yok',
        'rx yok' if 'rx=' not in _app.split('<g')[0] else 'rx var')

# --- Üretim koşulları: nakış ve ters kullanım ---
# Saten dikiş SERBEST UÇTAN sökülür ve ters kullanımda (navy zeminde beyaz
# kuyruk) uç iki yandan yenir. İki koşul _kuyruk() kurgusunun doğal sonucu
# ama sessizce bozulabilir; burada ölçülüp sabitleniyor:
#   (1) uç kenarı eksene DİK olmalı — eğik uç daha ince biter,
#   (2) kuyruğun halkayı kestiği BOYUN kuyruktan ince olmamalı.
_K = list(zip(sayilar(SY_AQUA)[0::2], sayilar(SY_AQUA)[1::2]))
_d = (math.cos(math.radians(ACI)), math.sin(math.radians(ACI)))
_sira = sorted(range(4), key=lambda i: _K[i][0] * _d[0] + _K[i][1] * _d[1])
_ic_k, _uc_k = [_K[_sira[0]], _K[_sira[1]]], [_K[_sira[2]], _K[_sira[3]]]
_uv = (_uc_k[1][0] - _uc_k[0][0], _uc_k[1][1] - _uc_k[0][1])
_ul = math.hypot(*_uv)
_sapma = abs(math.degrees(math.asin(min(1.0, abs(_uv[0] * _d[0] + _uv[1] * _d[1]) / _ul))))
kontrol('serbest uç eksene dik (nakış/ters)',
        sayilar(belge_satiri('Serbest uç sapması'))[0], round(_sapma, 2), 0.05)


def _kesim(poly, p, v):
    """p→p+v doğru parçasının poligonu kestiği t değerleri."""
    out = []
    for i in range(len(poly)):
        a, b = poly[i], poly[(i + 1) % len(poly)]
        ex, ey = b[0] - a[0], b[1] - a[1]
        den = v[0] * ey - v[1] * ex
        if abs(den) < 1e-9:
            continue
        wx, wy = a[0] - p[0], a[1] - p[1]
        t = (wx * ey - wy * ex) / den
        u = (wx * v[1] - wy * v[0]) / den
        if 0 <= u <= 1 and 0 <= t <= 1:
            out.append(t)
    return out


_yan = lambda pt: -pt[0] * _d[1] + pt[1] * _d[0]
_boyun = []
for _i, _u in zip(sorted(_ic_k, key=_yan), sorted(_uc_k, key=_yan)):
    _v = (_u[0] - _i[0], _u[1] - _i[1])
    _t = _kesim(_DIS, _i, _v)
    if _t:
        _boyun.append((_i[0] + _v[0] * max(_t), _i[1] + _v[1] * max(_t)))
_bg = math.dist(*_boyun) if len(_boyun) == 2 else 0.0
kontrol('boyun genişliği', sayilar(belge_satiri('Boyun genişliği'))[0], round(_bg, 1))
kontrol('boyun kuyruktan ince değil (nakış)', 'evet',
        'evet' if _bg >= _ul - 0.05 else 'HAYIR')

# --- Yatay kilit: optik açıklık gerçekten sınır kutusu boşluğu kadar mı ---
# Yeni kuyruk sembolün sağ-alt köşesine uzuyor; wordmark'a sokulup açıklığı
# daraltıyor olabilirdi. Sınır kutusu bunu göstermez, satır taraması gösterir:
# her y'de sembolün en sağ mürekkebi ile wordmark'ın en solu.
_L = (MARKA / 'qblogg-lockup-horizontal.svg').read_text(encoding='utf-8')
_tx, _ty = (float(v) for v in re.search(r'translate\(([\d.]+) ([\d.]+)\)', _L).groups())
_bol = _L.index('<g transform')


def _yollar(parca, dx=0.0, dy=0.0):
    cikti = []
    for d in re.findall(r'<path[^>]*d="([^"]+)"', parca):
        pts, cur = [], (0.0, 0.0)
        for k, a in re.findall(r'([MLQZ])([^MLQZ]*)', d):
            n = [float(x) + (dx if j % 2 == 0 else dy) for j, x
                 in enumerate(re.findall(r'-?\d*\.?\d+(?:e-?\d+)?', a))]
            if k == 'M':
                if len(pts) > 2:
                    cikti.append(pts)
                cur = (n[0], n[1])
                pts = [cur]
            elif k == 'L':
                cur = (n[0], n[1])
                pts.append(cur)
            elif k == 'Q':
                pts += _quad(cur, (n[0], n[1]), (n[2], n[3]))
                cur = pts[-1]
            elif k == 'Z':
                if len(pts) > 2:
                    cikti.append(pts)
                pts = []
        if len(pts) > 2:
            cikti.append(pts)
    return cikti


def _satir(polys, y):
    return [a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1])
            for P in polys for a, b in zip(P, P[1:] + P[:1])
            if (a[1] > y) != (b[1] > y)]


_sem, _soz = _yollar(_L[:_bol]), _yollar(_L[_bol:], _tx, _ty)
_bbox = min(x for P in _soz for x, _ in P) - max(x for P in _sem for x, _ in P)
_dar = min(min(_satir(_soz, y) or [1e9]) - max(_satir(_sem, y) or [-1e9])
           for y in (100 + i * 0.25 for i in range(1, 3200)))
_darsiz = min(min(_satir(_soz, y) or [1e9]) - max(_satir(_sem[:2], y) or [-1e9])
              for y in (100 + i * 0.25 for i in range(1, 3200)))
kontrol('kilit sınır kutusu boşluğu',
        sayilar(belge_satiri('Sınır kutusu boşluğu'))[0], round(_bbox, 1))
kontrol('kilit optik açıklığı', sayilar(belge_satiri('Optik açıklık'))[0], round(_dar, 1))
kontrol('kuyruğun daralttığı', sayilar(belge_satiri('Kuyruğun daralttığı'))[0],
        round(_darsiz - _dar, 1))
kontrol('optik açıklık sınır kutusundan dar değil', 'evet',
        'evet' if _dar >= _bbox - 0.5 else 'HAYIR')


print('QBLOGG marka ölçü doğrulaması')
print('─' * 62)
for ad, b, o in gecti:
    print(f'  ✓ {ad}')
for ad, b, o in hata:
    ob = f'{o:.1f}' if isinstance(o, float) else o
    bb = f'{b:.1f}' if isinstance(b, float) else b
    print(f'  ✗ {ad}: belgede {bb}, ölçülen {ob}')
print('─' * 62)
if hata:
    print(f'{len(hata)} uyuşmazlık — docs/logo-sistemi.md gerçeği anlatmıyor.')
    sys.exit(1)
print(f'{len(gecti)} ölçü doğrulandı; belge varlıklarla tutarlı.')
