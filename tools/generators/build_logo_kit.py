#!/usr/bin/env python3
"""The mark, in every form somebody will ask for it in.

The seal already exists — it is inline in 86 places across the site and the
touch icons are rendered from it. What did not exist is the thing you send to
a printer, a sign maker, a journalist or a marketplace: one folder holding
every lockup, every colour variant, the clear space, the minimum size, and a
written page saying what may not be done to it.

Nothing here is redrawn. Every file is generated from the same geometry the
site uses, so the kit cannot drift from the mark.

    python3 tools/generators/build_logo_kit.py
"""

import json
import math
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "brand")

INK, PAPER, BONE, SEAL, MUTED = "#0F0F0F", "#FBFAF7", "#F3F0E9", "#8B1A1A", "#67635B"

# The geometry, read out of the page rather than restated. If the mark on the
# site changes, the kit changes with it — that is the whole point.
def seal_paths():
    src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    m = re.search(r'<svg[^>]*class="seal-mark".*?</svg>', src, re.S)
    if not m:
        sys.exit("no seal-mark in index.html")
    svg = m.group(0)
    rays = re.search(r'<path d="([^"]+)"', svg).group(1)
    return rays


RAYS = seal_paths()


def seal(stroke, dot, size=100, bg=None, pad=0):
    """The mark as a standalone SVG. stroke and dot are the only variables."""
    box = 100 + pad * 2
    ground = ('<rect width="%d" height="%d" fill="%s"/>' % (box, box, bg)) if bg else ""
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {b} {b}" '
        'width="{s}" height="{s}" role="img" aria-label="Beta Art">{g}'
        '<g transform="translate({p},{p})">'
        '<g fill="none" stroke="{st}" stroke-width="4">'
        '<circle cx="50" cy="50" r="46"/><path d="{r}"/></g>'
        '<circle cx="50" cy="50" r="7" fill="{d}"/></g></svg>'
    ).format(b=box, s=size, g=ground, p=pad, st=stroke, d=dot, r=RAYS)


def text_w(size, tracking, s):
    """Width of letterspaced mono text.

    JetBrains Mono advances 0.6em, and the tracking is added after every glyph
    including the last, which CSS then leaves as trailing space — so it comes
    off again here. Without this the lockups shipped with a quarter of the
    canvas empty on the right, and an asset with baked-in whitespace throws
    the alignment off everywhere somebody places it.
    """
    return len(s) * (size * 0.6 + tracking) - tracking


def lockup(stroke, dot, text_fill, bg, stacked=False, sub=None):
    """Seal plus wordmark. The wordmark is set in the brand's mono face."""
    sub_l = (
        '<text x="{x}" y="{y}" font-family="JetBrains Mono, monospace" '
        'font-size="13" letter-spacing="4.2" fill="{c}">{t}</text>'
    )
    PAD = 20
    if stacked:
        wm = text_w(26, 9, "BETA ART")
        sw = text_w(13, 4.2, sub) if sub else 0
        w = int(max(wm, sw, 100) + PAD * 2)
        h = 240 if sub else 216
        cx = w / 2
        body = (
            '<g transform="translate(%.1f,18)">%s</g>'
            '<text x="%.1f" y="176" text-anchor="middle" font-family="JetBrains Mono, monospace" '
            'font-size="26" letter-spacing="9" fill="%s">BETA ART</text>'
            % (cx - 50, seal(stroke, dot, 100).split(">", 1)[1].rsplit("</svg>", 1)[0],
               cx, text_fill)
        )
        if sub:
            body += ('<text x="%.1f" y="206" text-anchor="middle" font-family="JetBrains Mono, '
                     'monospace" font-size="13" letter-spacing="4.2" fill="%s">%s</text>'
                     % (cx, MUTED if bg == PAPER else BONE, sub))
    else:
        x0 = 150
        wm = text_w(30, 10, "BETA ART")
        sw = text_w(13, 4.2, sub) if sub else 0
        w = int(x0 + max(wm, sw) + PAD)
        h = 140
        body = (
            '<g transform="translate(20,20)">%s</g>'
            '<text x="%d" y="%d" font-family="JetBrains Mono, monospace" '
            'font-size="30" letter-spacing="10" fill="%s">BETA ART</text>'
            % (seal(stroke, dot, 100).split(">", 1)[1].rsplit("</svg>", 1)[0],
               x0, 74 if sub else 82, text_fill)
        )
        if sub:
            body += ('<text x="%d" y="104" font-family="JetBrains Mono, monospace" '
                     'font-size="13" letter-spacing="4.2" fill="%s">%s</text>'
                     % (x0 + 2, MUTED if bg == PAPER else BONE, sub))
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" '
        'role="img" aria-label="Beta Art">'
        '<rect width="%d" height="%d" fill="%s"/>%s</svg>' % (w, h, w, h, w, h, bg, body)
    )


def clearspace():
    """Clear space is one ray length — measurable, not a feeling."""
    u = 46  # the circle radius: the unit everything else is stated in
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-70 -70 240 240" width="480" height="480">'
        '<rect x="-70" y="-70" width="240" height="240" fill="%s"/>'
        '<rect x="-24" y="-24" width="148" height="148" fill="none" stroke="%s" '
        'stroke-width="1" stroke-dasharray="5 5"/>'
        '<g transform="translate(0,0)">%s</g>'
        '<text x="50" y="-34" text-anchor="middle" font-family="JetBrains Mono, monospace" '
        'font-size="11" letter-spacing="2" fill="%s">CLEAR SPACE = 0.5 r</text>'
        '<text x="146" y="54" font-family="JetBrains Mono, monospace" font-size="11" '
        'letter-spacing="2" fill="%s">r = 46</text>'
        '</svg>' % (PAPER, MUTED,
                    seal(INK, SEAL, 100).split(">", 1)[1].rsplit("</svg>", 1)[0],
                    MUTED, MUTED)
    )


VARIANTS = [
    # file, stroke, dot, background, what it is for
    ("seal-ink-on-paper", INK, SEAL, PAPER, "Primary. Ink line, seal-red centre, on paper."),
    ("seal-bone-on-ink", BONE, "#C43A2E", INK, "On ink. The centre lifts to #C43A2E so it "
                                               "holds contrast against black."),
    ("seal-seal-on-paper", SEAL, SEAL, PAPER, "Single colour, seal red. One-colour print."),
    ("seal-black", "#000000", "#000000", None, "One colour, black. Fax, stamp, engraving, "
                                               "anything that cannot hold two inks."),
    ("seal-white", "#FFFFFF", "#FFFFFF", None, "One colour, white. Knockout on photography "
                                               "or a dark ground."),
]

LOCKUPS = [
    ("lockup-horizontal", INK, SEAL, INK, PAPER, False, None),
    ("lockup-horizontal-ink", BONE, "#C43A2E", BONE, INK, False, None),
    ("lockup-stacked", INK, SEAL, INK, PAPER, True, None),
    ("lockup-business", BONE, "#C43A2E", BONE, INK, False, "BUSINESS"),
    ("lockup-archive", INK, SEAL, INK, PAPER, False, "VERIFIED HUMAN PHOTOGRAPHY"),
]

PNG_SIZES = [32, 64, 180, 256, 512, 1024]


def main():
    os.makedirs(os.path.join(OUT, "svg"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "png"), exist_ok=True)
    written = []

    for name, stroke, dot, bg, _ in VARIANTS:
        p = os.path.join(OUT, "svg", name + ".svg")
        open(p, "w", encoding="utf-8").write(seal(stroke, dot, 512, bg))
        written.append(p)

    for name, stroke, dot, tf, bg, stacked, sub in LOCKUPS:
        p = os.path.join(OUT, "svg", name + ".svg")
        open(p, "w", encoding="utf-8").write(lockup(stroke, dot, tf, bg, stacked, sub))
        written.append(p)

    p = os.path.join(OUT, "svg", "clear-space.svg")
    open(p, "w", encoding="utf-8").write(clearspace())
    written.append(p)

    print("Beta Art — logo kit\n")
    for p in written:
        print("  %-46s %5d B" % (os.path.relpath(p, ROOT), os.path.getsize(p)))

    render_pngs()
    write_spec()


def render_pngs():
    """PNG at the sizes people actually ask for, rendered by a real browser."""
    node = "/opt/node22/bin/node"
    pw = "/opt/node22/lib/node_modules/playwright"
    if not os.path.exists(pw):
        print("\n  playwright missing — SVG written, PNG skipped")
        return
    jobs = []
    for name, stroke, dot, bg, _ in VARIANTS:
        for s in PNG_SIZES:
            jobs.append({"out": os.path.join(OUT, "png", "%s-%d.png" % (name, s)),
                         "svg": seal(stroke, dot, s, bg), "w": s, "h": s,
                         "transparent": bg is None})
    for name, stroke, dot, tf, bg, stacked, sub in LOCKUPS:
        svg = lockup(stroke, dot, tf, bg, stacked, sub)
        w, h = (int(float(v)) for v in
                re.search(r'width="([\d.]+)" height="([\d.]+)"', svg).groups())
        for scale in (1, 2):
            jobs.append({"out": os.path.join(OUT, "png", "%s@%dx.png" % (name, scale)),
                         "svg": svg, "w": w * scale, "h": h * scale, "transparent": False})

    script = """
const { chromium } = require(%s);
const jobs = %s;
(async () => {
  const b = await chromium.launch();
  for (const j of jobs) {
    const p = await b.newPage({ viewport: { width: j.w, height: j.h } });
    await p.setContent('<style>html,body{margin:0}svg{display:block;width:100%%;height:100%%}</style>' + j.svg);
    await p.screenshot({ path: j.out, omitBackground: j.transparent });
    await p.close();
  }
  await b.close();
})();
""" % (json.dumps(pw), json.dumps(jobs))
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as fh:
        fh.write(script)
        tmp = fh.name
    env = dict(os.environ, PLAYWRIGHT_BROWSERS_PATH="/opt/pw-browsers")
    r = subprocess.run([node, tmp], capture_output=True, text=True, env=env, cwd=ROOT)
    os.unlink(tmp)
    if r.returncode != 0:
        sys.exit(r.stderr.strip()[:400])
    n = len([f for f in os.listdir(os.path.join(OUT, "png")) if f.endswith(".png")])
    print("\n  %d PNG rendered into brand/png/" % n)


SPEC = """# Beta Art — the mark

Generated by `tools/generators/build_logo_kit.py` from the same geometry the
site uses. Do not edit these files by hand; if the mark changes on the site,
re-run the builder and the kit follows.

## What the mark is

A circle with six rays and a centre. It reads as an aperture, a compass rose
and a wax seal at the same time, and all three are the argument: a camera, a
bearing taken in the field, and a document somebody signed.

Geometry, on a 100 × 100 field:

| Element | Value |
|---|---|
| Circle radius | 46 |
| Stroke width | 4 |
| Rays | 6, at 60° |
| Centre dot radius | 7 |

The centre is the only filled element and it is the only place the accent
colour appears. That is deliberate: in a mark about verification, the thing
that is confirmed sits in the middle and everything else points at it.

## Colour

| Token | Hex | Use |
|---|---|---|
| ink | `#0F0F0F` | the line, on light grounds |
| bone | `#F3F0E9` | the line, on dark grounds |
| paper | `#FBFAF7` | the light ground |
| seal | `#8B1A1A` | the centre, on light grounds |
| seal-bright | `#C43A2E` | the centre, on dark grounds only |
| muted | `#67635B` | secondary text in a lockup |

`#8B1A1A` on `#0F0F0F` does not hold. That is why the dark variant lifts the
centre to `#C43A2E` — it is not a second brand colour, it is the same colour
made legible on ink.

## Type

The wordmark is **JetBrains Mono**, letterspaced. Not a drawn logotype: the
mark is a seal and the name beside it is a catalogue label, so it is set in
the same face the site uses for accession numbers and prices.

| Lockup | Size | Tracking |
|---|---|---|
| Horizontal | 30 px | 10 |
| Stacked | 26 px | 9 |
| Sub-line (BUSINESS, etc.) | 13 px | 4.2 |

## Clear space

**Half the circle radius on every side — 23 units on the 100-unit field.**
Nothing enters it: no type, no rule, no image edge, no other logo. See
`svg/clear-space.svg`.

## Minimum size

| Medium | Minimum |
|---|---|
| Screen | 24 px |
| Print | 8 mm |
| Favicon | use the 32 px file, not a scaled-down 512 |

Below 24 px the six rays close up and the mark reads as a dot in a circle.
The 32 px render exists because a browser downscaling a 512 does it badly.

## The files

    brand/svg/   vector, for anything that will be scaled or printed
    brand/png/   raster, at 32 · 64 · 180 · 256 · 512 · 1024
                 lockups at @1x and @2x

`seal-black` and `seal-white` have **no background** — they are transparent,
for placing on photography or a coloured ground.

## What may not be done to it

1. **Do not recolour the line.** Ink or bone. There is no blue Beta Art.
2. **Do not fill the circle.** The mark is a line drawing; a solid disc is a
   different mark.
3. **Do not add a second accent.** One accent, in the centre, once.
4. **Do not stretch, rotate, or skew.** The rays are at 60°; rotation reads as
   a mistake because the eye knows a compass rose has an up.
5. **Do not add effects.** No shadow, no glow, no gradient, no outline. The
   site has none anywhere, and the mark is the reason.
6. **Do not re-typeset the wordmark.** It is JetBrains Mono at the tracking
   above. A different face is a different company.
7. **Do not place it on a busy photograph** without the knockout variant and
   the full clear space.

## Where it already lives

| Use | File on the site |
|---|---|
| Inline in the page | 86 occurrences of `class="seal-mark"` |
| Favicon | a `data:` URI — no request, no file |
| Home-screen icon | `apple-touch-icon.png`, one per property, generated from this same mark |

The journal, Field Notes, carries no seal in its masthead — that is a
newspaper wordmark with a dateline, and it is meant to look like one. It still
uses the seal for its home-screen icon, so the four properties are
distinguishable on a phone.
"""


def write_spec():
    p = os.path.join(OUT, "README.md")
    open(p, "w", encoding="utf-8").write(SPEC)
    print("  brand/README.md written")


if __name__ == "__main__":
    main()
