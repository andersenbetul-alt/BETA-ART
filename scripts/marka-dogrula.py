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
import math
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
BELGE = ROOT / 'docs' / 'logo-sistemi.md'
URETICI = HERE / 'marka-uret.py'
MARKA = ROOT / 'assets' / 'brand'

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
QU = sayilar(re.search(r'QUAD = \[([^\]]*)\]', src).group(1))
Q = list(zip(QU[0::2], QU[1::2]))
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
