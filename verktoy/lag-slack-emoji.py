"""Fire Slack-emoji for Naviar Care.

Reglene fra prosjektet gjelder også her:
  - Ingen tilstand signaliseres med farge alene. Formen bærer meningen.
  - Ingen emoji-skrift. Alt tegnes med PIL-primitiver.
  - To grønner: disse ligger på blekk, altså --brand-pa-mork (7,2:1), ikke --brand.
"""
import sys, math
sys.path.insert(0, '/root/.claude/skills/synced/slack-gif-creator')
from PIL import Image, ImageDraw
from core.gif_builder import GIFBuilder
from core.easing import interpolate

S = 4                      # tegnes 4x og skaleres ned; PIL kantutjevner ikke selv
W = 128
INK        = (16, 26, 46)      # --ink
GRONN      = (76, 185, 155)    # --brand-pa-mork, den som er lesbar på blekk
LYS        = (221, 226, 234)   # --line
DEMPET     = (154, 166, 187)
SAND       = (251, 246, 238)   # --bg-sand

def blank():
    im = Image.new('RGB', (W*S, W*S), INK)
    return im, ImageDraw.Draw(im)

def ned(im):
    return im.resize((W, W), Image.LANCZOS)

def polyline_del(punkter, andel):
    """Første `andel` av en polylinje, målt i lengde. Gir en strek som tegnes."""
    if andel <= 0: return []
    lengder = [math.dist(punkter[i], punkter[i+1]) for i in range(len(punkter)-1)]
    total = sum(lengder)
    mal = total * min(andel, 1.0)
    ut, gatt = [punkter[0]], 0.0
    for i, L in enumerate(lengder):
        if gatt + L >= mal:
            t = (mal - gatt) / L
            a, b = punkter[i], punkter[i+1]
            ut.append((a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t))
            return ut
        gatt += L
        ut.append(punkter[i+1])
    return ut

def ring(d, andel=1.0, farge=GRONN, bredde=9, marg=14):
    """Ring som sveiper. Starter på toppen og går med klokka."""
    boks = [marg*S, marg*S, (W-marg)*S, (W-marg)*S]
    if andel >= 1.0:
        d.ellipse(boks, outline=farge, width=bredde*S)
    elif andel > 0:
        d.arc(boks, start=-90, end=-90 + 360*andel, fill=farge, width=bredde*S)


def godkjent():
    """Hun har sagt ja. Ringen sveiper, så tegnes haken."""
    b = GIFBuilder(width=W, height=W, fps=12)
    N = 16
    hake = [(40, 66), (57, 83), (90, 45)]
    for i in range(N):
        im, d = blank()
        t = i / (N - 1)
        ring(d, interpolate(0, 1, min(t/0.55, 1.0), 'ease_out_cubic'))
        if t > 0.45:
            a = interpolate(0, 1, min((t-0.45)/0.45, 1.0), 'ease_out_cubic')
            p = polyline_del([(x*S, y*S) for x, y in hake], a)
            if len(p) > 1:
                d.line(p, fill=GRONN, width=10*S, joint='curve')
                for pt in (p[0], p[-1]):        # runde ender, som ikonene våre
                    r = 5*S
                    d.ellipse([pt[0]-r, pt[1]-r, pt[0]+r, pt[1]+r], fill=GRONN)
        b.add_frame(ned(im))
    b.save('naviar-godkjent.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)


def nei():
    """Hun har sagt nei.

    Bevisst ikke et rødt kryss som rister. Et nei er et fullgodt svar i denne
    tjenesten, ikke en feil – og ingen purring følger. Derfor: en strek som
    legger seg rolig på plass, i dempet farge, og blir liggende."""
    b = GIFBuilder(width=W, height=W, fps=12)
    N = 14
    for i in range(N):
        im, d = blank()
        t = i / (N - 1)
        ring(d, 1.0, farge=DEMPET, bredde=7)
        a = interpolate(0, 1, min(t/0.6, 1.0), 'ease_out_cubic')
        halv = 24 * a
        y = W//2
        if halv > 1:
            d.line([((W//2-halv)*S, y*S), ((W//2+halv)*S, y*S)],
                   fill=LYS, width=10*S)
            for x in (W//2-halv, W//2+halv):
                r = 5*S
                d.ellipse([x*S-r, y*S-r, x*S+r, y*S+r], fill=LYS)
        b.add_frame(ned(im))
    b.save('naviar-nei.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)


def utfort():
    """Oppdraget er gjort. Kortet står, haken stemples ned i det."""
    b = GIFBuilder(width=W, height=W, fps=12)
    N = 16
    for i in range(N):
        im, d = blank()
        t = i / (N - 1)
        d.rounded_rectangle([22*S, 26*S, 106*S, 102*S], radius=10*S,
                            outline=DEMPET, width=5*S)
        for j, y in enumerate((44, 58)):                     # to tekstlinjer
            synlig = min(max((t - j*0.12) / 0.3, 0), 1)
            if synlig > 0:
                d.line([34*S, y*S, (34 + 46*synlig)*S, y*S], fill=DEMPET, width=5*S)
        if t > 0.4:
            a = interpolate(0, 1, min((t-0.4)/0.5, 1.0), 'ease_back_out')
            p = polyline_del([(40*S, 78*S), (54*S, 92*S), (88*S, 60*S)], a)
            if len(p) > 1:
                d.line(p, fill=GRONN, width=9*S, joint='curve')
                for pt in (p[0], p[-1]):
                    r = 4.5*S
                    d.ellipse([pt[0]-r, pt[1]-r, pt[0]+r, pt[1]+r], fill=GRONN)
        b.add_frame(ned(im))
    b.save('naviar-utfort.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)


def venter():
    """Venter på svar fra henne. Tre prikker, ingen nedtelling."""
    b = GIFBuilder(width=W, height=W, fps=12)
    N = 18
    for i in range(N):
        im, d = blank()
        for j, x in enumerate((38, 64, 90)):
            fase = (i / N * 2 * math.pi) - j * (2*math.pi/3)
            puls = (math.sin(fase) + 1) / 2
            r = (7 + 5*puls) * S
            f = tuple(int(DEMPET[k] + (GRONN[k]-DEMPET[k])*puls) for k in range(3))
            d.ellipse([x*S-r, 64*S-r, x*S+r, 64*S+r], fill=f)
        b.add_frame(ned(im))
    b.save('naviar-venter.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)


for f in (godkjent, nei, utfort, venter):
    f(); print(f.__name__, 'ok')
