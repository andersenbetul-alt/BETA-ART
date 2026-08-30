#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
COBBANI Identity Generator
All geometry derived from H=100 grid, S=14 stroke weight.
Run: python3 build.py  (from any directory)
"""
import math, pathlib

# ── Palette ──────────────────────────────────────────────────────────────────
INK    = "#1A0A00"   # Deep Espresso  — primary
GOLD   = "#C8962A"   # Burnished Gold — accent
CREAM  = "#FFF8EE"   # Warm Cream     — light background
WHITE  = "#FFFFFF"

# ── Grid ────────────────────────────────────────────────────────────────────
H, S   = 100.0, 13.0   # cap height, stroke/stem width (slightly thinner than CODDAN)
GAP    = 18.0          # inter-glyph gap

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

def svg_wrap(w, h, body, title="", bg=None):
    extra = f'\n  <rect width="{r(w)}" height="{r(h)}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" '
            f'viewBox="0 0 {r(w)} {r(h)}">'
            f'\n  <!-- {title} -->{extra}\n  {body}\n</svg>\n')

def path(d, fill, rule="evenodd"):
    return f'<path d="{d}" fill="{fill}" fill-rule="{rule}"/>'

def g(body, transform=""):
    if transform:
        return f'<g transform="{transform}">{body}</g>'
    return f'<g>{body}</g>'

# ── Letterforms (H=100, S=13) ────────────────────────────────────────────────

def glyph_C(gap_deg=26.0):
    """Arc ring, opens right."""
    Ro = 38.0; Ri = Ro - S
    cx = Ro; cy = H / 2
    gd = math.radians(gap_deg)
    to_x = r(cx + Ro * math.cos(gd)); to_y = r(cy - Ro * math.sin(gd))
    bo_x = to_x;                       bo_y = r(cy + Ro * math.sin(gd))
    ti_x = r(cx + Ri * math.cos(gd)); ti_y = r(cy - Ri * math.sin(gd))
    bi_x = ti_x;                       bi_y = r(cy + Ri * math.sin(gd))
    d = (f"M{to_x},{to_y} A{r(Ro)},{r(Ro)} 0 1,0 {bo_x},{bo_y} "
         f"L{bi_x},{bi_y} A{r(Ri)},{r(Ri)} 0 1,1 {ti_x},{ti_y} Z")
    return [d], 2 * Ro

def glyph_O():
    """Oval ring."""
    W = 74.0
    rx_o, ry_o = W / 2, H / 2
    rx_i, ry_i = rx_o - S, ry_o - S
    cx, cy = W / 2, H / 2
    def ell(rx, ry, cw):
        sw = 1 if cw else 0
        return (f"M{r(cx-rx)},{r(cy)} "
                f"A{r(rx)},{r(ry)} 0 1,{sw} {r(cx+rx)},{r(cy)} "
                f"A{r(rx)},{r(ry)} 0 1,{sw} {r(cx-rx)},{r(cy)} Z")
    return [ell(rx_o, ry_o, True), ell(rx_i, ry_i, False)], W

def glyph_B():
    """B shape: left stem + upper bump + lower bump (lower slightly wider)."""
    W = 66.0
    # Upper bump: centre at (S, H/4), outer rx=W-S, ry=H/4
    rx_u, ry_u = W - S, H / 4          # 53, 25
    # Lower bump: slightly wider for optical weight (traditional B proportion)
    rx_l, ry_l = W - S + 4, H / 4     # 57, 25
    # Counter holes: inset by S
    rx_ui, ry_ui = rx_u - S, ry_u - S  # 40, 12
    rx_li, ry_li = rx_l - S, ry_l - S  # 44, 12

    outer = (f"M0,0 H{r(S)} "
             f"A{r(rx_u)},{r(ry_u)} 0 0,1 {r(S)},{r(H/2)} "
             f"A{r(rx_l)},{r(ry_l)} 0 0,1 {r(S)},{r(H)} "
             f"H0 Z")
    upper_hole = f"M{r(S)},{r(S)} A{r(rx_ui)},{r(ry_ui)} 0 0,1 {r(S)},{r(H/2-S)} Z"
    lower_hole = f"M{r(S)},{r(H/2+S)} A{r(rx_li)},{r(ry_li)} 0 0,1 {r(S)},{r(H-S)} Z"
    return [outer, upper_hole, lower_hole], W

def glyph_A(bar_frac=0.70):
    """Triangular ring + crossbar."""
    W = 78.0; half = W / 2
    a  = math.atan(half / H)
    dy = S / math.sin(a)
    dx = S / math.cos(a)
    t  = math.tan(a)
    ring = (f"M{r(half)},0 L{r(W)},{r(H)} L{r(W-dx)},{r(H)} "
            f"L{r(half)},{r(dy)} L{r(dx)},{r(H)} L0,{r(H)} Z")
    bar_top = H * bar_frac; bar_bot = bar_top + S
    lt = r(half - (bar_top - dy) * t); rt = r(half + (bar_top - dy) * t)
    lb = r(half - (bar_bot - dy) * t); rb = r(half + (bar_bot - dy) * t)
    bar = f"M{lt},{r(bar_top)} H{rt} L{rb},{r(bar_bot)} H{lb} Z"
    return [ring, bar], W

def glyph_N():
    """N with diagonal stroke."""
    W = 76.0
    run = W - 2 * S
    dv  = S / math.cos(math.atan(run / H))
    d   = (f"M0,0 H{r(S)} L{r(W-S)},{r(H-dv)} V0 H{r(W)} V{r(H)} "
           f"H{r(W-S)} L{r(S)},{r(dv)} V{r(H)} H0 Z")
    return [d], W

def glyph_I():
    """Thin vertical rectangle."""
    return [f"M0,0 H{r(S)} V{r(H)} H0 Z"], S

# ── Wordmark builder ─────────────────────────────────────────────────────────

GLYPHS_COBBANI = [glyph_C, glyph_O, glyph_B, glyph_B, glyph_A, glyph_N, glyph_I]

def wordmark_body(fill=INK, dx=0.0, dy=0.0, gap=GAP):
    x = dx; parts = []
    for fn in GLYPHS_COBBANI:
        paths, w = fn()
        shift = f"translate({r(x)},{r(dy)})"
        parts.append(g("".join(path(d, fill) for d in paths), shift))
        x += w + gap
    total_w = x - gap
    return "".join(parts), total_w

# ── Mark: Double-B monogram ──────────────────────────────────────────────────
# Two B shapes side by side — left in espresso (primary), right in gold (accent).
# The BB rhythm echoes the letter pair at the heart of the brand name.

MARK_SZ = 150.0   # mark bounding box width; height = H * scale (auto)
MARK_BW = 66.0    # B glyph width (matches glyph_B at H=100)

def _b_block(scale, dx, dy, fill):
    """Render B glyph (absolute coordinates) at given position and fill."""
    W  = MARK_BW * scale
    S_ = S * scale
    H_ = H * scale
    rx_u, ry_u = (MARK_BW - S) * scale, H_ / 4
    rx_l, ry_l = (MARK_BW - S + 4) * scale, H_ / 4
    rx_ui, ry_ui = (MARK_BW - 2*S) * scale, H_ / 4 - S_
    rx_li, ry_li = (MARK_BW - 2*S + 4) * scale, H_ / 4 - S_
    outer = (f"M{r(dx)},{r(dy)} H{r(dx+S_)} "
             f"A{r(rx_u)},{r(ry_u)} 0 0,1 {r(dx+S_)},{r(dy+H_/2)} "
             f"A{r(rx_l)},{r(ry_l)} 0 0,1 {r(dx+S_)},{r(dy+H_)} "
             f"H{r(dx)} Z")
    uh = (f"M{r(dx+S_)},{r(dy+S_)} "
          f"A{r(rx_ui)},{r(ry_ui)} 0 0,1 {r(dx+S_)},{r(dy+H_/2-S_)} Z")
    lh = (f"M{r(dx+S_)},{r(dy+H_/2+S_)} "
          f"A{r(rx_li)},{r(ry_li)} 0 0,1 {r(dx+S_)},{r(dy+H_-S_)} Z")
    return path(outer, fill) + path(uh, fill) + path(lh, fill)

def mark_body(primary=INK, accent=GOLD, dx=0.0, dy=0.0, scale=1.0):
    """Double-B monogram: two Bs side by side, ink + gold."""
    BW  = MARK_BW * scale
    BH  = H * scale
    gap = S * scale * 0.4   # narrow gap between the two Bs
    total_w = BW * 2 + gap
    x0  = dx + (MARK_SZ * scale - total_w) / 2
    y0  = dy + (MARK_SZ * scale - BH) / 2
    left  = _b_block(scale, x0, y0, primary)
    right = _b_block(scale, x0 + BW + gap, y0, accent)
    return left + right, total_w

def mark_svg(name, primary=INK, accent=GOLD, bg=None):
    sz = MARK_SZ
    body, _ = mark_body(primary, accent, dx=0, dy=0, scale=1)
    return write(name, svg_wrap(sz, sz, body, "COBBANI mark", bg=bg))

# ── Lockups ──────────────────────────────────────────────────────────────────

def lockup_h(name, fill=INK, accent=GOLD, bg=None):
    mk_scale = H / MARK_SZ
    mk_sz = MARK_SZ * mk_scale   # = H
    mk_body, _ = mark_body(primary=fill, accent=accent, dx=0, dy=0, scale=mk_scale)
    wm_dx = mk_sz + 24
    wm_body, wm_w = wordmark_body(fill=fill, dx=wm_dx)
    total_w = wm_dx + wm_w
    return write(name, svg_wrap(total_w, H, mk_body + wm_body, "COBBANI horizontal lockup", bg=bg))

def lockup_v(name, fill=INK, accent=GOLD, bg=None):
    mk_scale = 1.3
    mk_sz = MARK_SZ * mk_scale
    mk_body, _ = mark_body(primary=fill, accent=accent, dx=0, dy=0, scale=mk_scale)
    gap_v = 20.0
    wm_body, wm_w = wordmark_body(fill=fill, dy=mk_sz + gap_v)
    shift_x = (mk_sz - wm_w) / 2
    wm_body_c, _ = wordmark_body(fill=fill, dx=shift_x, dy=mk_sz + gap_v)
    total_h = mk_sz + gap_v + H
    total_w = max(mk_sz, wm_w)
    return write(name, svg_wrap(total_w, total_h, mk_body + wm_body_c, "COBBANI stacked lockup", bg=bg))

def icon_svg(name, box, rx_ratio, bg=INK, primary=CREAM, accent=GOLD):
    scale = box * 0.55 / MARK_SZ
    sz    = MARK_SZ * scale
    dx    = (box - sz) / 2; dy = (box - sz) / 2
    body_m, _ = mark_body(primary, accent, dx=dx, dy=dy, scale=scale)
    rx    = box * rx_ratio
    bg_r  = f'<rect width="{box}" height="{box}" rx="{r(rx)}" fill="{bg}"/>'
    return write(name, svg_wrap(box, box, bg_r + "\n  " + body_m, "COBBANI icon"))

# ── Generate all files ───────────────────────────────────────────────────────

made = []

# Wordmarks
wm_body, wm_w = wordmark_body()
made.append(write("master/cobbani-wordmark.svg",
    svg_wrap(wm_w, H, wm_body, "COBBANI wordmark espresso")))

wm_body_w, wm_w = wordmark_body(fill=WHITE)
made.append(write("master/cobbani-wordmark-white.svg",
    svg_wrap(wm_w, H, wm_body_w, "COBBANI wordmark white", bg=INK)))

wm_body_g, wm_w = wordmark_body(fill=GOLD)
made.append(write("master/cobbani-wordmark-gold.svg",
    svg_wrap(wm_w, H, wm_body_g, "COBBANI wordmark gold", bg=INK)))

wm_body_c, wm_w = wordmark_body(fill=INK)
made.append(write("master/cobbani-wordmark-cream-bg.svg",
    svg_wrap(wm_w, H, wm_body_c, "COBBANI wordmark on cream", bg=CREAM)))

# Mark
made.append(mark_svg("master/cobbani-mark.svg"))
made.append(mark_svg("master/cobbani-mark-reverse.svg", primary=CREAM, accent=GOLD, bg=INK))
made.append(mark_svg("master/cobbani-mark-mono.svg", primary=INK, accent=INK))
made.append(mark_svg("master/cobbani-mark-mono-light.svg", primary=CREAM, accent=CREAM, bg=INK))

# Lockups
made.append(lockup_h("master/cobbani-lockup-horizontal.svg"))
made.append(lockup_h("master/cobbani-lockup-horizontal-reverse.svg", fill=CREAM, accent=GOLD, bg=INK))
made.append(lockup_v("master/cobbani-lockup-stacked.svg"))

# Icons
made.append(icon_svg("master/cobbani-icon-app.svg",     1024, 0.22))
made.append(icon_svg("master/cobbani-icon-favicon.svg",  512, 0.09))

# Studies — compare B proportions at scale
rows = []; yy = 0.0
for cap in (100.0, 48.0, 24.0):
    sc = cap / H
    b, ww = wordmark_body(fill=INK)
    rows.append(g(b, f"translate(0,{r(yy)}) scale({r(sc)})"))
    yy += cap + 24.0
wm_w_full = wordmark_body()[1]
made.append(write("studies/cobbani-scale-ladder.svg",
    svg_wrap(wm_w_full, yy - 24, "\n  ".join(rows), "COBBANI scale ladder")))

print(f"Palette:     {INK} + {GOLD}")
print(f"Stroke:      {S:.0f}  ({S/H*100:.0f}% of H)")
print(f"Mark:        {MARK_SZ:.0f} × {MARK_SZ:.0f}  (double-B monogram)")
print(f"\n{len(made)} files written:")
for m in made:
    print(f"  {m}")
