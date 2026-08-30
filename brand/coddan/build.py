#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CODDAN Identity Generator
All geometry derived from H=100 grid, S=14 stroke weight.
Run: python3 build.py  (from any directory)
"""
import math, pathlib

# ── Palette ──────────────────────────────────────────────────────────────────
NAVY   = "#0B1829"   # Deep Space Navy  — primary
BLUE   = "#0066FF"   # Electric Blue    — accent
WHITE  = "#FFFFFF"
LIGHT  = "#EEF4FF"   # Ice Blue         — light backgrounds

# ── Grid ────────────────────────────────────────────────────────────────────
H, S   = 100.0, 14.0   # cap height, stroke/stem width
GAP    = 20.0          # default inter-glyph gap

OUT    = pathlib.Path(__file__).resolve().parent
MASTER = OUT / "master"
MASTER.mkdir(exist_ok=True)
(OUT / "studies").mkdir(exist_ok=True)

def r(v):
    return str(round(v, 3)).rstrip("0").rstrip(".")

def write(fpath, content):
    p = OUT / fpath
    p.parent.mkdir(exist_ok=True)
    p.write_text(content, encoding="utf-8")
    return str(fpath)

# ── SVG wrapper ──────────────────────────────────────────────────────────────
def svg_wrap(w, h, body, title="", bg=None):
    extra = f'\n  <rect width="{r(w)}" height="{r(h)}" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {r(w)} {r(h)}">'
        f'\n  <!-- {title} -->{extra}\n  {body}\n</svg>\n'
    )

def path(d, fill, rule="evenodd"):
    return f'<path d="{d}" fill="{fill}" fill-rule="{rule}"/>'

def g(body, transform=""):
    if transform:
        return f'<g transform="{transform}">{body}</g>'
    return f'<g>{body}</g>'

# ── Letterforms (H=100, S=14) ────────────────────────────────────────────────

def glyph_C(gap_deg=27.0):
    """Arc ring, opens right. Returns (paths_list, width)."""
    Ro = 39.0; Ri = Ro - S
    cx  = Ro; cy = H / 2
    gd  = math.radians(gap_deg)
    to_x = r(cx + Ro * math.cos(gd)); to_y = r(cy - Ro * math.sin(gd))
    bo_x = to_x;                       bo_y = r(cy + Ro * math.sin(gd))
    ti_x = r(cx + Ri * math.cos(gd)); ti_y = r(cy - Ri * math.sin(gd))
    bi_x = ti_x;                       bi_y = r(cy + Ri * math.sin(gd))
    d = (f"M{to_x},{to_y} A{r(Ro)},{r(Ro)} 0 1,0 {bo_x},{bo_y} "
         f"L{bi_x},{bi_y} A{r(Ri)},{r(Ri)} 0 1,1 {ti_x},{ti_y} Z")
    return [d], 2 * Ro

def glyph_O():
    """Oval ring. Returns (paths_list, width)."""
    W = 76.0
    rx_o, ry_o = W / 2, H / 2
    rx_i, ry_i = rx_o - S, ry_o - S   # 24, 36
    cx, cy = W / 2, H / 2
    def ell(rx, ry, cw):
        sw = 1 if cw else 0
        return (f"M{r(cx-rx)},{r(cy)} "
                f"A{r(rx)},{r(ry)} 0 1,{sw} {r(cx+rx)},{r(cy)} "
                f"A{r(rx)},{r(ry)} 0 1,{sw} {r(cx-rx)},{r(cy)} Z")
    return [ell(rx_o, ry_o, True), ell(rx_i, ry_i, False)], W

def glyph_D():
    """D-shape: left stem + right half-ellipse. Returns (paths_list, width)."""
    W = 74.0
    rx_o, ry_o = W - S, H / 2          # 60, 50 — outer arc radii from stem edge
    rx_i, ry_i = rx_o - S, ry_o - S    # 46, 36 — inner counter
    outer = (f"M0,0 H{r(S)} A{r(rx_o)},{r(ry_o)} 0 0,1 {r(S)},{r(H)} H0 Z")
    inner = (f"M{r(S)},{r(S)} A{r(rx_i)},{r(ry_i)} 0 0,1 {r(S)},{r(H-S)} Z")
    return [outer, inner], W

def glyph_A(bar_frac=0.70):
    """Triangular ring + crossbar. Adapted from NAVIAR geometry."""
    W = 80.0; half = W / 2
    a  = math.atan(half / H)            # half-angle from vertical
    dy = S / math.sin(a)                # inner apex y
    dx = S / math.cos(a)                # base corner inset
    t  = math.tan(a)
    ring = (f"M{r(half)},0 L{r(W)},{r(H)} L{r(W-dx)},{r(H)} "
            f"L{r(half)},{r(dy)} L{r(dx)},{r(H)} L0,{r(H)} Z")
    bar_top = H * bar_frac; bar_bot = bar_top + S
    lt = r(half - (bar_top - dy) * t); rt = r(half + (bar_top - dy) * t)
    lb = r(half - (bar_bot - dy) * t); rb = r(half + (bar_bot - dy) * t)
    bar = f"M{lt},{r(bar_top)} H{rt} L{rb},{r(bar_bot)} H{lb} Z"
    return [ring, bar], W

def glyph_N():
    """N with diagonal stroke. Adapted from NAVIAR geometry."""
    W = 78.0
    run = W - 2 * S
    dv  = S / math.cos(math.atan(run / H))
    d   = (f"M0,0 H{r(S)} L{r(W-S)},{r(H-dv)} V0 H{r(W)} V{r(H)} "
           f"H{r(W-S)} L{r(S)},{r(dv)} V{r(H)} H0 Z")
    return [d], W

# ── Wordmark builder ─────────────────────────────────────────────────────────

GLYPHS_CODDAN = [glyph_C, glyph_O, glyph_D, glyph_D, glyph_A, glyph_N]

def wordmark_body(fill=NAVY, dx=0.0, dy=0.0, scale=1.0, gap=GAP):
    x = dx; parts = []; total_w = 0.0
    for fn in GLYPHS_CODDAN:
        paths, w = fn()
        shift = f"translate({r(x)},{r(dy)})" + (f" scale({r(scale)})" if scale != 1.0 else "")
        parts.append(g("".join(path(d, fill) for d in paths), shift))
        x += (w + gap) * scale
        total_w = x - gap * scale
    return "".join(parts), total_w

# ── Mark (C-bracket accent symbol) ──────────────────────────────────────────

MARK_H  = 140.0   # mark bounding height
MARK_Ro = 64.0    # outer radius
MARK_Ri = 40.0    # inner radius
MARK_GAP = 26.0   # gap angle (degrees)
MARK_W  = MARK_Ro * 2

def mark_body(primary=NAVY, accent=BLUE, dx=0.0, dy=0.0, scale=1.0):
    """C-bracket mark: navy arc ring + electric blue accent bar inside the gap."""
    Ro, Ri = MARK_Ro * scale, MARK_Ri * scale
    cx, cy = dx + MARK_Ro * scale, dy + MARK_H * scale / 2
    gd = math.radians(MARK_GAP)

    _to_x = cx + Ro * math.cos(gd); _to_y = cy - Ro * math.sin(gd)
    _bo_x = _to_x;                   _bo_y = cy + Ro * math.sin(gd)
    _ti_x = cx + Ri * math.cos(gd); _ti_y = cy - Ri * math.sin(gd)
    _bi_x = _ti_x;                   _bi_y = cy + Ri * math.sin(gd)

    arc = (f"M{r(_to_x)},{r(_to_y)} A{r(Ro)},{r(Ro)} 0 1,0 {r(_bo_x)},{r(_bo_y)} "
           f"L{r(_bi_x)},{r(_bi_y)} A{r(Ri)},{r(Ri)} 0 1,1 {r(_ti_x)},{r(_ti_y)} Z")

    # Accent bar: vertical rectangle INSIDE the C gap (between inner and outer radius)
    margin = 3.0 * scale
    bar_x = _ti_x + margin
    bar_w = (_to_x - _ti_x) - 2 * margin
    bar_y = _ti_y
    bar_h = _bi_y - _ti_y
    bar   = f"M{r(bar_x)},{r(bar_y)} h{r(bar_w)} v{r(bar_h)} h{r(-bar_w)} Z"

    return (path(arc, primary) + path(bar, accent)), MARK_W * scale

def mark_svg(name, primary=NAVY, accent=BLUE, bg=None):
    mw = MARK_W; mh = MARK_H
    body, _ = mark_body(primary, accent)
    return write(name, svg_wrap(mw, mh, body, "CODDAN mark", bg=bg))

# ── Lockups ──────────────────────────────────────────────────────────────────

def lockup_h(name, fill=NAVY, accent=BLUE, bg=None):
    """Horizontal lockup: mark + wordmark."""
    mk_scale = H / MARK_H
    mk_w = MARK_W * mk_scale
    mk_dy = 0.0
    mark_svg_body, _ = mark_body(fill, accent, dx=0, dy=mk_dy, scale=mk_scale)
    wm_dx = mk_w + 28
    wm_body, wm_w = wordmark_body(fill=fill, dx=wm_dx, dy=0)
    total_w = wm_dx + wm_w
    return write(name, svg_wrap(total_w, H, mark_svg_body + wm_body, "CODDAN horizontal lockup", bg=bg))

def lockup_v(name, fill=NAVY, accent=BLUE, bg=None):
    """Vertical lockup: mark above, wordmark below."""
    mk_scale = 1.2
    mk_w = MARK_W * mk_scale; mk_h = MARK_H * mk_scale
    mark_svg_body, _ = mark_body(fill, accent, dx=0, dy=0, scale=mk_scale)
    gap_v = 18.0
    wm_scale = 0.72
    wm_body, wm_w = wordmark_body(fill=fill, dy=mk_h + gap_v)
    # Centre wordmark under mark
    shift_x = (mk_w - wm_w) / 2
    wm_body_c, _ = wordmark_body(fill=fill, dx=shift_x, dy=mk_h + gap_v)
    total_h = mk_h + gap_v + H
    total_w = max(mk_w, wm_w)
    return write(name, svg_wrap(total_w, total_h, mark_svg_body + wm_body_c, "CODDAN vertical lockup", bg=bg))

def icon_svg(name, box, rx_ratio, bg=NAVY, primary=WHITE, accent=BLUE):
    """App icon: mark centred on square."""
    scale = box * 0.58 / MARK_H
    mw = MARK_W * scale; mh = MARK_H * scale
    dx = (box - mw) / 2; dy = (box - mh) / 2
    body_m, _ = mark_body(primary, accent, dx=dx, dy=dy, scale=scale)
    rx = box * rx_ratio
    bg_rect = f'<rect width="{box}" height="{box}" rx="{r(rx)}" fill="{bg}"/>'
    return write(name, svg_wrap(box, box, bg_rect + "\n  " + body_m, "CODDAN icon"))

# ── Generate all files ───────────────────────────────────────────────────────

made = []

# Wordmarks
wm_body, wm_w = wordmark_body()
made.append(write("master/coddan-wordmark.svg",
    svg_wrap(wm_w, H, wm_body, "CODDAN wordmark navy")))

wm_body_w, wm_w = wordmark_body(fill=WHITE)
made.append(write("master/coddan-wordmark-white.svg",
    svg_wrap(wm_w, H, wm_body_w, "CODDAN wordmark white", bg=NAVY)))

wm_body_b, wm_w = wordmark_body(fill=BLUE)
made.append(write("master/coddan-wordmark-blue.svg",
    svg_wrap(wm_w, H, wm_body_b, "CODDAN wordmark electric blue")))

# Mark
made.append(mark_svg("master/coddan-mark.svg"))
made.append(mark_svg("master/coddan-mark-white.svg", primary=WHITE, accent=LIGHT, bg=NAVY))
made.append(mark_svg("master/coddan-mark-mono-dark.svg", primary=NAVY, accent=NAVY))
made.append(mark_svg("master/coddan-mark-mono-light.svg", primary=WHITE, accent=WHITE, bg=NAVY))

# Lockups
made.append(lockup_h("master/coddan-lockup-horizontal.svg"))
made.append(lockup_h("master/coddan-lockup-horizontal-reverse.svg", fill=WHITE, accent=BLUE, bg=NAVY))
made.append(lockup_v("master/coddan-lockup-stacked.svg"))

# Icons
made.append(icon_svg("master/coddan-icon-app.svg",     1024, 0.22))
made.append(icon_svg("master/coddan-icon-favicon.svg",  512, 0.09))

# Studies
# Scale ladder
rows = []; yy = 0.0
for cap in (100.0, 48.0, 24.0):
    sc = cap / H
    b, ww = wordmark_body(fill=NAVY)
    rows.append(g(b, f"translate(0,{r(yy)}) scale({r(sc)})"))
    yy += cap + 24.0
wm_w_full = wordmark_body()[1]
made.append(write("studies/coddan-scale-ladder.svg",
    svg_wrap(wm_w_full, yy - 24, "\n  ".join(rows), "CODDAN scale ladder")))

print(f"Mark:        {MARK_W:.0f} × {MARK_H:.0f}  (outer R={MARK_Ro}, inner R={MARK_Ri})")
print(f"Gap angle:   {MARK_GAP}°")
print(f"Stroke:      {S:.0f}  ({S/H*100:.0f}% of H)")
print(f"\n{len(made)} files written:")
for m in made:
    print(f"  {m}")
