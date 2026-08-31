# -*- coding: utf-8 -*-
"""NAVIAR identity generator. All geometry from the Logo Audit spec, H = 100."""
import math, os, pathlib

OUT = pathlib.Path(__file__).resolve().parent
NAVY, GOLD, OFFWHITE, GRAPHITE = "#0A1628", "#D4AF37", "#F5F6F8", "#1E1E1E"
H = 100.0
STROKE = 15.0          # 15% of H  (spec: 14-16%)
FONT = "'Poppins','Century Gothic','Futura','Helvetica Neue',Arial,sans-serif"

def r(v): return round(v, 2)

# ---------------------------------------------------------------- letterforms
def glyph_N():
    w, s = 78.0, STROKE
    run = w - 2*s                                   # diagonal horizontal run
    dv  = s / math.cos(math.atan(run / H))          # vertical offset for perp = s
    return [f"M0 0 H{r(s)} L{r(w-s)} {r(H-dv)} V0 H{r(w)} V{r(H)} H{r(w-s)} L{r(s)} {r(dv)} V{r(H)} H0 Z"], w

def _tri(w, flip=False):
    """Triangular A/V ring. flip=True -> V (apex at bottom)."""
    half, s = w/2.0, STROKE
    a     = math.atan(half / H)                     # half-angle from vertical
    dy    = s / math.sin(a)                         # apex shifts along axis
    dx    = s / math.cos(a)                         # base corners shift inward
    ax, ay = half, (H if flip else 0.0)
    iy     = (H - dy) if flip else dy
    by     = 0.0 if flip else H
    return (f"M{r(ax)} {r(ay)} L{r(w)} {r(by)} L{r(w-dx)} {r(by)} "
            f"L{r(ax)} {r(iy)} L{r(dx)} {r(by)} L0 {r(by)} Z"), a, dx, iy

def glyph_A(bar_top=72.0):
    w = 82.0
    ring, a, dx, iy = _tri(w)
    t = math.tan(a)
    bar_bot = bar_top + STROKE
    lt, rt = w/2 - (bar_top-iy)*t, w/2 + (bar_top-iy)*t
    lb, rb = w/2 - (bar_bot-iy)*t, w/2 + (bar_bot-iy)*t
    bar = f"M{r(lt)} {r(bar_top)} H{r(rt)} L{r(rb)} {r(bar_bot)} H{r(lb)} Z"
    return [ring, bar], w

def glyph_A_dot(bar_top=72.0):
    """Archive study only: Dot-A construction."""
    paths, w = glyph_A(bar_top)
    ring, a, dx, iy = _tri(w)
    cy = iy + (bar_top - iy) * 0.55
    rad = 7.5
    paths.append(f"M{r(w/2-rad)} {r(cy)} a{r(rad)} {r(rad)} 0 1 0 {r(2*rad)} 0 "
                 f"a{r(rad)} {r(rad)} 0 1 0 {r(-2*rad)} 0 Z")
    return paths, w

def glyph_V():
    w = 82.0
    ring, *_ = _tri(w, flip=True)
    return [ring], w

def glyph_I():
    return [f"M0 0 H{r(STROKE)} V{r(H)} H0 Z"], STROKE

def glyph_R(open_bowl=False):
    """Spec: closed bowl + diagonal leg. open_bowl=True is the REJECTED variant."""
    w, s = 72.0, STROKE
    bx, by = 44.0, 50.0                  # bowl junction x, bowl depth
    ro     = by/2.0                      # outer bowl radius
    ri     = ro - s
    lx2, ly2 = w, H                      # leg outer bottom-right
    leg_dx   = 28.0
    if open_bowl:                        # bowl stops short, never returns to stem
        outer = (f"M0 0 H{r(bx)} A{r(ro)} {r(ro)} 0 0 1 {r(bx)} {r(by)} "
                 f"L{r(lx2)} {r(ly2)} H{r(lx2-18)} L{r(bx-leg_dx+4)} {r(by+4)} "
                 f"H{r(s+16)} V{r(H)} H0 Z")
        return [outer], w
    outer = (f"M0 0 H{r(bx)} A{r(ro)} {r(ro)} 0 0 1 {r(bx)} {r(by)} "
             f"L{r(lx2)} {r(ly2)} H{r(lx2-18)} L{r(bx-leg_dx)} {r(by)} "
             f"H{r(s)} V{r(H)} H0 Z")
    hole  = f"M{r(s)} {r(s)} H{r(bx)} A{r(ri)} {r(ri)} 0 0 1 {r(bx)} {r(by-s)} H{r(s)} Z"
    return [outer, hole], w

# ------------------------------------------------------------------- wordmark
PAIRS = {"NA": 0.30, "AV": 0.24, "VI": 0.32, "IA": 0.34, "AR": 0.26}   # x H

def wordmark(tracking=1.0, dot_a=False, open_r=False):
    gaps = [PAIRS[k]*H*tracking for k in ("NA", "AV", "VI", "IA", "AR")]
    A = glyph_A_dot if dot_a else glyph_A
    letters = [glyph_N(), A(), glyph_V(), glyph_I(), A(), glyph_R(open_bowl=open_r)]
    out, x = [], 0.0
    for i, (paths, w) in enumerate(letters):
        out.append((x, paths))
        x += w + (gaps[i] if i < len(gaps) else 0.0)
    return out, x

def wordmark_svg_body(tracking=1.0, dot_a=False, open_r=False, fill=NAVY, dy=0.0, dx=0.0):
    groups, width = wordmark(tracking, dot_a, open_r)
    parts = []
    for gx, paths in groups:
        d = " ".join(paths)
        parts.append(f'<path d="{d}" transform="translate({r(gx+dx)} {r(dy)})" '
                     f'fill="{fill}" fill-rule="evenodd"/>')
    return "\n  ".join(parts), width

# ------------------------------------------------------------------- monogram
MW, MH, RIB = 760.0, 800.0, 150.0
_run  = MW - 2*RIB
_dv   = RIB / math.cos(math.atan(_run / MH))
GOLD_TOP_L = 167.7      # gold bottom edge, left end  (x = MW-RIB)
GOLD_TOP_R = 428.7      # gold bottom edge, right end (x = MW); parallel to diagonal
DIAG_DEG = math.degrees(math.atan(_run / MH))

def monogram_paths(navy=NAVY, gold=GOLD):
    n = (f"M0 0 H{r(RIB)} L{r(MW-RIB)} {r(MH-_dv)} V{r(GOLD_TOP_L)} L{r(MW)} {r(GOLD_TOP_R)} "
         f"V{r(MH)} H{r(MW-RIB)} L{r(RIB)} {r(_dv)} V{r(MH)} H0 Z")
    g = f"M{r(MW-RIB)} 0 H{r(MW)} V{r(GOLD_TOP_R)} L{r(MW-RIB)} {r(GOLD_TOP_L)} Z"
    return [(n, navy), (g, gold)]

def monogram_paths_p10(navy=NAVY, gold=GOLD, ratio=0.14):
    """P10 corrected candidate (31.08.2026) — user asked for the diagonal-gold
    direction from an external AI-generated logo to be fixed and re-evaluated,
    not just rejected. First draft moved gold to a top-right corner wedge;
    user rejected that ("logo bu değil") — the reference has gold crossing the
    MIDDLE of the diagonal stroke, touching neither stem. Rebuilt as a true
    interior band.

    Construction: the diagonal stroke is a uniform-width parallelogram running
    from the left-stem/diagonal junction (s=0) to the right-stem/diagonal
    junction (s=1); a point at parameter s sits at x = RIB + s*_run, with the
    stroke's local width _dv running from y = s*(MH-_dv) to y = _dv + s*(MH-_dv).
    Gold occupies a centered band s in [s0, s1] that touches neither stem —
    this makes it a genuine interior island, so navy is written as ONE <path>
    with fill-rule="evenodd" (outer silhouette + gold-hole subpath) — the same
    technique glyph_R() already uses for the bowl counter, so "1 closed navy
    path" (per NAVIAR-LOGO-KARAR.md's spec) still means one <path> element,
    not zero holes. `ratio` is solved analytically against silhouette_area(),
    not eyeballed off a rendered PNG the way the external candidate was.
    """
    width_frac = ratio * silhouette_area() / (_run * _dv)
    if not (0.0 < width_frac < 1.0):
        raise ValueError(f"ratio {ratio} gives width_frac={width_frac:.2f}, out of range")
    s0, s1 = (1.0 - width_frac) / 2.0, (1.0 + width_frac) / 2.0

    def pt_bottom(s): return (RIB + s*_run, s*(MH - _dv))
    def pt_top(s):    return (RIB + s*_run, _dv + s*(MH - _dv))

    bl, br = pt_bottom(s0), pt_bottom(s1)
    tl, tr = pt_top(s0), pt_top(s1)
    hole = f"M{r(bl[0])} {r(bl[1])} L{r(br[0])} {r(br[1])} L{r(tr[0])} {r(tr[1])} L{r(tl[0])} {r(tl[1])} Z"
    outer = monogram_solid(navy)  # full uncut silhouette, single closed path
    n = f"{outer} {hole}"          # two subpaths, one <path>, evenodd punches the hole
    return [(n, navy), (hole, gold)], (s0, s1)

def monogram_solid(col=NAVY):
    """Single closed path — no two-tone seam in monochrome variants."""
    return (f"M0 0 H{r(RIB)} L{r(MW-RIB)} {r(MH-_dv)} V0 H{r(MW)} V{r(MH)} "
            f"H{r(MW-RIB)} L{r(RIB)} {r(_dv)} V{r(MH)} H0 Z")

def monogram_body(navy=NAVY, gold=GOLD, dx=0.0, dy=0.0, scale=1.0):
    ps = monogram_paths(navy, gold)
    inner = "\n    ".join(f'<path d="{d}" fill="{c}"/>' for d, c in ps)
    return (f'<g transform="translate({r(dx)} {r(dy)}) scale({r(scale)})">\n    '
            f'{inner}\n  </g>')

def _shoelace(pts):
    a = 0.0
    for i in range(len(pts)):
        x1, y1 = pts[i]; x2, y2 = pts[(i+1) % len(pts)]
        a += x1*y2 - x2*y1
    return abs(a) / 2.0

def silhouette_area():
    """Area of the N silhouette (navy + gold). Two stems plus the diagonal
    parallelogram; the diagonal is clipped to the gap between the stem inner
    edges, so the three pieces do not overlap. Verified against a pixel count
    of the rendered master: 319,593 analytic vs 318,877 measured (+0.2%)."""
    return 2.0*RIB*MH + _run*_dv

def gold_ratio():
    return (RIB*(GOLD_TOP_L+GOLD_TOP_R)/2.0) / silhouette_area() * 100.0

# ---------------------------------------------------------------- svg wrapper
def svg(name, vb, body, title, bg=None, extra=""):
    x, y, w, h = vb
    rect = f'<rect x="{r(x)}" y="{r(y)}" width="{r(w)}" height="{r(h)}" fill="{bg}"/>\n  ' if bg else ""
    doc = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{r(x)} {r(y)} {r(w)} {r(h)}" '
           f'width="{r(w)}" height="{r(h)}" role="img" aria-label="{title}">\n'
           f'  <title>{title}</title>\n  {rect}{extra}{body}\n</svg>\n')
    p = OUT / name
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(doc, encoding="utf-8")
    return name

def descriptor_text(label, x, y, cap, fill, anchor="start", max_w=None):
    """Cap height ~0.70*font-size. textLength keeps long descriptors inside the
    wordmark width instead of overflowing the artboard."""
    fs   = cap / 0.70
    trk  = fs * 0.42
    nat  = len(label) * (fs * 0.62 + trk)
    tl   = min(nat, max_w) if max_w else nat
    return (f'<text x="{r(x)}" y="{r(y)}" font-family="{FONT}" font-size="{r(fs)}" '
            f'font-weight="500" letter-spacing="{r(trk)}" fill="{fill}" '
            f'text-anchor="{anchor}" textLength="{r(tl)}" lengthAdjust="spacing">'
            f'{label}</text>')

# =============================================================== EMIT
made = []

# ---- P5  master wordmark ------------------------------------------------
for nm, col in (("naviar-wordmark", NAVY), ("naviar-wordmark-white", OFFWHITE),
                ("naviar-wordmark-black", GRAPHITE)):
    b, w = wordmark_svg_body(fill=col)
    made.append(svg(f"master/{nm}.svg", (0, 0, w, H), b, f"NAVIAR wordmark"))
WM_W = w

b, w = wordmark_svg_body(tracking=0.83, fill=NAVY)
made.append(svg("master/naviar-wordmark-responsive.svg", (0, 0, w, H), b,
                "NAVIAR wordmark responsive small"))
WM_RESP_W = w

# ---- monogram (P3/P7 resolved) ------------------------------------------
made.append(svg("master/naviar-monogram.svg", (0, 0, MW, MH),
                "\n  ".join(f'<path d="{d}" fill="{c}"/>' for d, c in monogram_paths()),
                "NAVIAR N monogram"))
for nm, col in (("naviar-monogram-mono-dark", NAVY), ("naviar-monogram-mono-light", OFFWHITE)):
    made.append(svg(f"master/{nm}.svg", (0, 0, MW, MH),
                    f'<path d="{monogram_solid(col)}" fill="{col}"/>',
                    "NAVIAR N monogram monochrome"))

# ---- lockups -------------------------------------------------------------
MON_H  = 145.0
MON_S  = MON_H / MH
MON_W  = MW * MON_S
GAP    = 58.0

def lockup_h(fill, gold, name, descriptor=None, bg=None):
    body_wm, wmw = wordmark_svg_body(fill=fill)
    dcap  = 0.27 * H
    block = H + (20.0 + dcap if descriptor else 0.0)
    top   = (MON_H - block) / 2.0
    parts = [monogram_body(fill if gold is None else NAVY if fill == NAVY else fill,
                           gold or fill, 0, 0, MON_S)]
    gwm, _ = wordmark_svg_body(fill=fill, dx=MON_W + GAP, dy=top)
    parts.append(gwm)
    if descriptor:
        parts.append(descriptor_text(descriptor, MON_W + GAP + wmw/2,
                                     top + H + 20.0 + dcap, dcap, fill, "middle",
                                     max_w=wmw))
    return svg(name, (0, 0, MON_W + GAP + wmw, MON_H), "\n  ".join(parts),
               f"NAVIAR {descriptor or ''}".strip(), bg=bg)

made.append(lockup_h(NAVY, GOLD, "master/naviar-lockup-horizontal.svg"))
made.append(lockup_h(OFFWHITE, GOLD, "master/naviar-lockup-horizontal-reverse.svg", bg=NAVY))

# stacked
MON_S2 = 200.0 / MH
MON_W2 = MW * MON_S2
b2, w2 = wordmark_svg_body(fill=NAVY, dy=250.0)
made.append(svg("master/naviar-lockup-stacked.svg", (0, 0, WM_W, 350.0),
                monogram_body(NAVY, GOLD, (WM_W - MON_W2)/2, 0, MON_S2) + "\n  " + b2,
                "NAVIAR stacked lockup"))

# ---- icons ---------------------------------------------------------------
def icon(name, box, rx, frac):
    s   = (box * frac) / MH
    mw2 = MW * s
    return svg(name, (0, 0, box, box),
               monogram_body(OFFWHITE, GOLD, (box-mw2)/2, (box-box*frac)/2, s),
               "NAVIAR icon",
               extra=f'<rect width="{box}" height="{box}" rx="{rx}" fill="{NAVY}"/>\n  ')
made.append(icon("master/naviar-icon-app.svg",  1024, 224, 0.56))
made.append(icon("master/naviar-icon-favicon.svg", 512,  96, 0.62))

# ---- descriptor system (P8 / P9 resolved) --------------------------------
APPROVED = ["CONSULTING", "AI", "PLATFORM", "RESEARCH INSTITUTE", "ACADEMY", "LABS"]
for d in APPROVED:
    slug = d.lower().replace(" ", "-")
    made.append(lockup_h(NAVY, GOLD, f"descriptors/naviar-{slug}.svg", descriptor=d))
made.append(lockup_h(NAVY, GOLD, "descriptors/naviar-care-PENDING-APPROVAL.svg",
                     descriptor="CARE"))

# ---- studies -------------------------------------------------------------
# P4  Dot-A: same wordmark at three cap heights, dots vanish
rows = []
yy = 0.0
for cap in (100.0, 48.0, 24.0):
    sc = cap / H
    bb, ww = wordmark_svg_body(dot_a=True, fill=NAVY)
    rows.append(f'<g transform="translate(0 {r(yy)}) scale({r(sc)})">{bb}</g>')
    yy += cap + 40.0
made.append(svg("studies/study-p4-dot-a-scale.svg", (0, 0, WM_W, yy - 40.0),
                "\n  ".join(rows), "Dot-A construction at 100 / 48 / 24 cap height"))

# P6  open R vs closed R at 24 cap height
b_open, w_open   = wordmark_svg_body(open_r=True, fill=NAVY)
b_close, w_close = wordmark_svg_body(fill=NAVY)
sc = 24.0 / H
made.append(svg("studies/study-p6-r-comparison.svg", (0, 0, w_open*sc, 24*2+40),
                f'<g transform="scale({r(sc)})">{b_open}</g>\n  '
                f'<g transform="translate(0 {r(24+40)}) scale({r(sc)})">{b_close}</g>',
                "Open-R (rejected, top) vs closed-R (master, bottom) at 24 cap height"))

# P1  sculptural N rebuilt flat: blade N, two-tone, same footprint
blade_navy = (f"M0 0 H{r(RIB)} V{r(MH)} H0 Z "
              f"M{r(RIB)} 0 L{r(MW-RIB*0.55)} {r(MH)} L{r(MW-RIB*1.6)} {r(MH)} "
              f"L{r(RIB)} {r(_dv*1.15)} Z")
blade_gold = (f"M{r(MW-RIB)} 0 H{r(MW)} V{r(GOLD_TOP_R)} L{r(MW-RIB)} {r(GOLD_TOP_L)} Z")
made.append(svg("studies/study-p1-sculptural-n-flat.svg", (0, 0, MW, MH),
                f'<path d="{blade_navy}" fill="{NAVY}" fill-rule="evenodd"/>\n  '
                f'<path d="{blade_gold}" fill="{GOLD}"/>',
                "Sculptural N rebuilt as flat vector (archive study)"))

# P7  metallic N rebuilt flat at icon sizes
tiles = []
xx = 0.0
for px in (16, 24, 32, 48):
    s2 = px / MH
    tiles.append(f'<g transform="translate({r(xx)} {r(48-px)}) scale({r(s2)})">'
                 + "".join(f'<path d="{d}" fill="{c}"/>' for d, c in monogram_paths())
                 + "</g>")
    xx += px + 24.0
made.append(svg("studies/study-p7-monogram-scale.svg", (0, 0, xx - 24.0, 48.0),
                "\n  ".join(tiles), "Flat monogram at 16 / 24 / 32 / 48 px"))

# P10  corrected candidate — same silhouette + master wordmark, gold
# relocated and ratio-tuned (see monogram_paths_p10 docstring). Kept as a
# study, not master/, pending the Acceptance Rule (measured evidence here,
# explicit decision entry in NAVIAR-LOGO-KARAR.md separately).
p10_paths, (p10_s0, p10_s1) = monogram_paths_p10()
p10_ratio = (p10_s1 - p10_s0) * _run * _dv / silhouette_area() * 100.0
p10_dcap = 0.27 * H
p10_top = (MON_H - (H + 20.0 + p10_dcap)) / 2.0
p10_navy_d, p10_gold_d = p10_paths[0][0], p10_paths[1][0]
p10_mono = (f'<g transform="scale({r(MON_S)})">\n    '
            f'<path d="{p10_navy_d}" fill="{NAVY}" fill-rule="evenodd"/>\n    '
            f'<path d="{p10_gold_d}" fill="{GOLD}"/>'
            + "\n  </g>")
p10_wm, p10_wmw = wordmark_svg_body(fill=NAVY, dx=MON_W + GAP, dy=p10_top)
p10_body = (p10_mono + "\n  " + p10_wm + "\n  "
            + descriptor_text("CONSULTING", MON_W + GAP + p10_wmw/2,
                               p10_top + H + 20.0 + p10_dcap, p10_dcap, NAVY,
                               "middle", max_w=p10_wmw))
made.append(svg("studies/study-p10-diagonal-corrected.svg",
                (0, 0, MON_W + GAP + p10_wmw, MON_H), p10_body,
                "P10 corrected candidate — diagonal-gold direction, ratio-fixed"))

print(f"gold accent = {gold_ratio():.1f}%  (spec 12-16%)")
print(f"P10 study gold accent = {p10_ratio:.1f}%  (target 12-16%, corrected from external candidate)")
print(f"diagonal    = {DIAG_DEG:.1f} deg from vertical  (spec 38-42) <-- DEVIATION")
print(f"ribbon      = {RIB:.0f} units (spec 145-160)")
print(f"footprint   = {MW:.0f} x {MH:.0f} (spec ~760 x 800)")
print(f"stroke      = {STROKE/H*100:.0f}% of H (spec 14-16%)")
print(f"wordmark    = {WM_W:.0f} x {H:.0f} -> ratio {WM_W/H:.2f}:1")
print(f"responsive  = {WM_RESP_W:.0f} wide (tracking -17%)")
print(f"\n{len(made)} files:")
for m in made: print("  " + m)
