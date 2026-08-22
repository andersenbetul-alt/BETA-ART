# -*- coding: utf-8 -*-
"""Setter ordmerket NAVIAR CARE i Inter og gjør bokstavene om til flater.

   Grunnen til at teksten ikke blir liggende som <text>: en logo som er
   avhengig av at en skrift er installert, er ikke en logo. Den er en
   forhåpning. Inter er lisensiert under SIL OFL, som tillater dette.

   Koordinatsystemet er 1000 enheter per em, y snudd til SVG-retning,
   og grunnlinja ligger i y = 0. Alt annet plasseres ut fra versalhøyden."""

from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

UPM_MAL = 1000.0


class Skrift(object):
    def __init__(self, sti):
        self.font = TTFont(sti)
        self.upm = self.font['head'].unitsPerEm
        self.k = UPM_MAL / self.upm
        self.glyfsett = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.versalhoyde = self.font['OS/2'].sCapHeight * self.k

    def navn(self, tegn):
        return self.cmap[ord(tegn)]

    def bredde(self, tegn):
        g = self.navn(tegn)
        return self.font['hmtx'][g][0] * self.k

    def bane(self, tegn, x, y=0.0):
        """Glyfen som SVG-banedata, flyttet til x og med y snudd."""
        pen = SVGPathPen(self.glyfsett, ntos=lambda v: format(round(v, 1), 'g'))
        # Snu y og skaler i ett steg, så det ikke blir to avrundinger.
        tp = TransformPen(pen, Transform(self.k, 0, 0, -self.k, x, y))
        self.glyfsett[self.navn(tegn)].draw(tp)
        return pen.getCommands()


def sett(skrift, tekst, x, sporing):
    """sporing er i 1/1000 em, slik skriftfolk oppgir det."""
    biter = []
    for tegn in tekst:
        biter.append(skrift.bane(tegn, x))
        x += skrift.bredde(tegn) + sporing
    # Siste bokstav skal ikke dra med seg sporing inn i høyden.
    return ' '.join(b for b in biter if b), x - sporing


fet = Skrift('inter-700.ttf')
mager = Skrift('inter-400.ttf')

SPORING_NAVIAR = 55      # fet tekst tåler lite luft
SPORING_CARE = 140       # mager tekst i versaler trenger mye
ORDMELLOMROM = 430       # må være tydelig større enn sporingen inne i CARE,
                         # ellers leses de to ordene som ett

d1, slutt1 = sett(fet, 'NAVIAR', 0.0, SPORING_NAVIAR)
d2, slutt2 = sett(mager, 'CARE', slutt1 + ORDMELLOMROM, SPORING_CARE)

print('versalhoyde fet   :', round(fet.versalhoyde, 1))
print('versalhoyde mager :', round(mager.versalhoyde, 1))
print('NAVIAR slutter ved:', round(slutt1, 1))
print('CARE slutter ved  :', round(slutt2, 1))

# CARE for seg selv, til den stående låsen der ordene ligger på hver sin linje.
d3, slutt3 = sett(mager, 'CARE', 0.0, SPORING_CARE)

# I den stående låsen spores CARE ut til nøyaktig samme bredde som NAVIAR.
sum_care = sum(mager.bredde(t) for t in 'CARE')
sporing_justert = (slutt1 - sum_care) / 3.0
d4, slutt4 = sett(mager, 'CARE', 0.0, sporing_justert)
print('sporing justert:', round(sporing_justert))

with open('ordmerke.txt', 'w') as f:
    f.write(d1 + '\n---\n' + d2 + '\n---\n' + d4 + '\n---\n')
    f.write('%.1f %.1f %.1f %.1f\n' % (slutt1, slutt2, slutt4, fet.versalhoyde))
print('CARE alene     :', round(slutt3, 1))
