# -*- coding: utf-8 -*-
"""Setter sammen de tre logofilene av merket og ordmerket.

   Alt måles i versalhøyder, ikke i piksler. Da holder forholdene når logoen
   settes i 24 px i en topplinje og i 400 px på et forsideoppslag."""

deler = open('ordmerke.txt').read().split('---')
D_NAVIAR = deler[0].strip()
D_CARE = deler[1].strip()
D_CARE_JUSTERT = deler[2].strip()
B_NAVIAR, BREDDE_ORD, B_CARE, VERSAL = [float(t) for t in deler[3].split()]

VERSALHOYDE = 100.0
S_ORD = VERSALHOYDE / VERSAL          # fra em-enheter til versalhøyder

# Merket er tegnet i en 32-rute. Flatene ligger fra 3,4 til 28,6 i x
# og 3,2 til 28,8 i y – resten av ruta er luft vi ikke vil ha med.
M_X0, M_Y0, M_B, M_H = 3.4, 3.2, 25.2, 25.6
MERKE_HOYDE = 122.0                   # merket står på grunnlinja og overskyter
S_MERKE = MERKE_HOYDE / M_H           # bare oppover, slik en varde ville gjort
MERKE_BREDDE = M_B * S_MERKE

MELLOMROM = 76.0                      # tre fjerdedels versalhøyde. Mindre enn
                                      # dette, og merket leses som en bokstav i ordet

# Merket er én flate med bandet som hull, ikke to flater der den ene ligger
# gjennomsiktig oppå den andre. Gjennomsiktighet finnes ikke i ett trykkfarge,
# og ved 16 px blir 45 % opasitet en grå klump i stedet for en strek.
BANE_MERKE = ('M16 3.2 3.4 28.8h5.1L16 13.6l7.5 15.2h5.1L16 3.2Z'
              'M11.1 23.6h9.8l2.2 4.4H8.9l2.2-4.4Z')

HODE = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s" '
        'width="%s" height="%s" role="img" aria-label="Naviar Care" fill="currentColor">')

FORKLARING = """
  <!-- Naviar Care. Ordmerket er satt i Inter og gjort om til flater, slik at
       logoen ikke er avhengig av at skriften finnes der den vises.
       Fargen arves med currentColor: sett color til blekket på lys flate og
       til sanden på mørk. Ikke skriv en heksverdi inn her. -->
"""

def merke(x, y, s):
    t = 'translate(%s %s) scale(%s) translate(%s %s)' % (
        rund(x), rund(y), rund(s, 4), rund(-M_X0), rund(-M_Y0))
    return ('  <g transform="%s">\n'
            '    <path fill-rule="evenodd" d="%s"/>\n'
            '  </g>') % (t, BANE_MERKE)


def ordmerke(x, grunnlinje):
    t = 'translate(%s %s) scale(%s)' % (rund(x), rund(grunnlinje), rund(S_ORD, 5))
    return ('  <g transform="%s">\n'
            '    <path d="%s"/>\n'
            '    <path d="%s"/>\n'
            '  </g>') % (t, D_NAVIAR, D_CARE)


def linje(d, x, grunnlinje):
    """Én ferdig satt tekstlinje, plassert på sin grunnlinje."""
    return ('  <g transform="translate(%s %s) scale(%s)">\n'
            '    <path d="%s"/>\n'
            '  </g>') % (rund(x), rund(grunnlinje), rund(S_ORD, 5), d)


def rund(v, n=2):
    return format(round(v, n), 'g')


def skriv(navn, bredde, hoyde, kropp, px_bredde):
    px_hoyde = round(px_bredde * hoyde / bredde, 1)
    ut = [HODE % (rund(bredde), rund(hoyde), rund(px_bredde), rund(px_hoyde)),
          FORKLARING.rstrip('\n'), kropp, '</svg>', '']
    open(navn, 'w').write('\n'.join(ut))
    print('%-34s %8s x %-7s  (%s x %s px)' % (
        navn, rund(bredde), rund(hoyde), rund(px_bredde), rund(px_hoyde)))


# --- 1. Liggende lås: merket, så ordmerket ------------------------------
# Merket står på grunnlinja og rager bare oppover. En varde som svever over
# skriftlinja ser ut som en feil, uansett hvor pent den er tegnet.
ord_bredde = BREDDE_ORD * S_ORD
care_bredde = B_CARE * S_ORD   # CARE justert – samme bredde som NAVIAR
naviar_bredde = B_NAVIAR * S_ORD

b = MERKE_BREDDE + MELLOMROM + ord_bredde
h = MERKE_HOYDE
skriv('naviar-care-logo.svg', b, h,
      merke(0, 0, S_MERKE) + '\n' + ordmerke(MERKE_BREDDE + MELLOMROM, h),
      260)

# --- 2. Ordmerket alene -------------------------------------------------
skriv('naviar-care-ordmerke.svg', ord_bredde, VERSALHOYDE,
      ordmerke(0, VERSALHOYDE), 220)

# --- 3. Stående lås: merket over to linjer ------------------------------
# Ordmerket er over ti versalhøyder bredt. Legges det under merket i én
# linje, blir låsen en strek med en liten hatt. Derfor deles ordene.
LUFT_MERKE = 40.0
LUFT_LINJE = 34.0
b2 = naviar_bredde
grunnlinje_1 = MERKE_HOYDE + LUFT_MERKE + VERSALHOYDE
grunnlinje_2 = grunnlinje_1 + LUFT_LINJE + VERSALHOYDE
kropp = (merke((b2 - MERKE_BREDDE) / 2.0, 0, S_MERKE) + '\n'
         + linje(D_NAVIAR, (b2 - naviar_bredde) / 2.0, grunnlinje_1) + '\n'
         + linje(D_CARE_JUSTERT, 0.0, grunnlinje_2))
skriv('naviar-care-logo-staaende.svg', b2, grunnlinje_2, kropp, 190)

# --- 4. Faste farger, til alle som ikke kan sette color -----------------
# Trykk, e-postmaler og andres presentasjonsverktoy arver ingen farge.
import re
grunn = open('naviar-care-logo.svg').read()
for navn, farge, hva in (('naviar-care-logo-blekk.svg', '#101a2e', 'lys flate'),
                         ('naviar-care-logo-negativ.svg', '#fbf6ee', 'mork flate')):
    ut = grunn.replace('fill="currentColor"', 'fill="%s"' % farge)
    ut = ut.replace('Fargen arves med currentColor: sett color til blekket på lys flate og\n'
                    '       til sanden på mørk. Ikke skriv en heksverdi inn her.',
                    'Fast farge, til bruk der ingen farge kan arves: %s.\n'
                    '       Bruk currentColor-utgaven i alt som er HTML.' % hva)
    open(navn, 'w').write(ut)
    print('%-34s fast farge %s' % (navn, farge))
