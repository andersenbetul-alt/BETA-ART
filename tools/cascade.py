#!/usr/bin/env python3
"""A narrower breakpoint does not win. A later rule does.

Observation 3 in `skill-observations/log.md`, still live in the code two days
after it was written down.

Media queries add no specificity. A declaration inside `@media (max-width:
560px)` loses to the same declaration inside `@media (max-width: 1180px)` if
the 1180 block appears later in the file — at every width where both match,
which is every width the 560 block covers. The narrower rule is dead
everywhere.

That is not theory here. `beta-art-business/styles.css` carried three such
declarations, written to tighten the header bar below 560px:

    .bar-actions          { gap: .3rem }
    .bar-actions .btn-sm  { padding: .5rem .6rem; letter-spacing: .06em }

Measured in a browser, the gap between 401px and 560px computed to **6.4px** —
the `.4rem` from the 1180 block — never the 4.8px intended. Three declarations,
dead since they were written, and invisible in every diff because each one
reads correctly on its own.

The file already carried a comment warning about exactly this, above a 460px
block that had been moved to the end of the file for the same reason. The trap
was documented and the code still had it one breakpoint up. A comment is not a
gate.

WHAT THIS FAILS ON

A declaration shadowed by a later, wider `max-width` block **with a different
value**. That is intent silently lost.

WHAT IT DELIBERATELY LETS THROUGH

The same declaration repeated with an *identical* value. Nineteen of those
exist here. They are untidy, not wrong — nothing a reader or a browser can
tell apart from the intended result. Failing on them would fire twenty-two
times on code that renders correctly, and a gate that cries wolf is one people
learn to skip. They are counted in the summary and not raised as findings.

Blocks carrying a `min-width` are skipped: a range query does not simply
contain a narrower one, and deciding whether it shadows takes more than
comparing two numbers.

    python3 tools/cascade.py
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SHEETS = [
    ("beta-art/styles.css", "the archive"),
    ("beta-art-business/styles.css", "the desk"),
    ("beta-art-blog/styles.css", "the journal"),
]

MEDIA = re.compile(r"@media([^{]*?)\{")
RULE = re.compile(r"([^{}]+)\{([^{}]*)\}")
DECL = re.compile(r"([a-z-]+)\s*:\s*([^;]+)")


def media_blocks(src):
    """Every @media block, with its max-width and where it starts."""
    out = []
    for m in MEDIA.finditer(src):
        query = m.group(1)
        mx = re.search(r"max-width:\s*(\d+)px", query)
        mn = re.search(r"min-width:\s*(\d+)px", query)
        if not mx or mn:
            continue                       # only plain max-width blocks
        i = m.end()
        depth, j = 1, i
        while j < len(src) and depth:
            depth += (src[j] == "{") - (src[j] == "}")
            j += 1
        out.append({
            "max": int(mx.group(1)),
            "pos": m.start(),
            "line": src.count("\n", 0, m.start()) + 1,
            "body": src[i:j - 1],
        })
    return out


def check(rel):
    path = os.path.join(ROOT, rel)
    if not os.path.exists(path):
        return ["%s: missing" % rel], 0
    src = open(path, encoding="utf-8").read()

    seen = {}
    for b in media_blocks(src):
        for rm in RULE.finditer(b["body"]):
            sel = " ".join(rm.group(1).split())
            for dm in DECL.finditer(rm.group(2)):
                key = (sel, dm.group(1))
                seen.setdefault(key, []).append(
                    (b["pos"], b["max"], " ".join(dm.group(2).split()), b["line"]))

    found, harmless = [], 0
    for (sel, prop), occ in seen.items():
        occ.sort()
        for a in range(len(occ) - 1):
            for c in range(a + 1, len(occ)):
                if occ[a][1] >= occ[c][1]:
                    continue               # later block is not wider — fine
                if occ[a][2] == occ[c][2]:
                    harmless += 1
                else:
                    found.append(
                        "%s:%d  `%s { %s: %s }` never applies. The %dpx block at "
                        "line %d sets it to %s and comes later, so it wins at every "
                        "width the %dpx block covers. Move this rule below line %d."
                        % (rel, occ[a][3], sel, prop, occ[a][2], occ[c][1],
                           occ[c][3], occ[c][2], occ[a][1], occ[c][3]))
                break                      # nearest later shadow is enough
    return found, harmless


def main():
    print("A later rule beats a narrower breakpoint\n")
    total, dup = [], 0
    for rel, label in SHEETS:
        f, h = check(rel)
        dup += h
        total += f
        print("  %-30s %-14s %s" % (rel, label,
              "ok" if not f else "%d dead declaration(s)" % len(f)))

    if not total:
        print("\nNo declaration is shadowed by a later, wider breakpoint.")
        if dup:
            print("%d declaration(s) are repeated at an identical value — untidy, "
                  "not wrong, and not a finding." % dup)
        return 0

    print()
    for f in total:
        print("  · %s" % f)
    print("\nPut override blocks at the end of the file, widest first. A rule that "
          "reads correctly\nand does nothing is the hardest kind to see in a diff.")
    print("total findings: %d" % len(total))
    return 1


if __name__ == "__main__":
    sys.exit(main())
