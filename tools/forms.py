#!/usr/bin/env python3
"""A form may not report a delivery it did not make.

Three forms on this site told the visitor their message had arrived when there
was nowhere for it to arrive. The desk's enquiry form answered "Request
received. A written scope and price follow within 48 hours" and then called
`form.reset()`, so the enquiry was gone and the visitor was waiting for a reply
nobody could send. The journal's newsletter form answered "Thank you — check
your inbox for the confirmation letter", and no letter was coming. The
archive's licence form said "Request received" forty lines below its own
banner reading "no enquiry sent from this site is stored anywhere".

Each had a comment above it saying there was no backend yet. The comment was
addressed to us. The sentence was addressed to the visitor, and only one of
those two is read by the person the promise is made to.

`beta-art/release.js` had already solved it, in Norwegian, months earlier:

    if (!ENDPOINT) {
      /* Ingen mottaker satt opp. Si det rett ut framfor å vise en hake. */

— no recipient set up, say it straight out rather than showing a checkmark.
The pattern existed; three of the four forms never got it. That is the same
shape as observation 6, where a class travelled between properties and its rule
did not.

The third one was found by this gate, on its first run, while it was being
written to certify the other two.

So this gate is narrow and mechanical. A phrase that tells the visitor their
message got through is only truthful after a server said so, which means it
belongs inside the `.then()` of a real request. Anywhere else in a submit
handler, it is a sentence the page cannot support.

It deliberately does not require a form to *have* an endpoint. Not having one
is a state of the project, reported by `launch.py`, and it is allowed. What is
not allowed is lying about it.

    python3 tools/forms.py
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {".git", "tools", "docs", "node_modules", "__pycache__",
        "skill-observations", ".claude"}

# Wording that asserts the message reached somebody. Kept to claims of
# ARRIVAL — "ready", "prepared", "copied" claim nothing and stay legal
# everywhere, which is what lets a form be honest without an endpoint.
ARRIVAL = [
    r"\breceived\b", r"\bwe(?:'| ha)ve got it\b", r"\bin touch\b",
    r"check your inbox", r"confirmation letter", r"\bsigned up\b",
    r"\bsubscribed\b", r"thank you\b",
    # Norwegian. Anchored to the start of the sentence on purpose: `release.js`
    # says "samtykket blir først registrert når teksten under er sendt" — the
    # consent is registered *once you have sent* the text — which is a
    # condition, not a receipt, and a bare \bsendt\b flags it wrongly.
    r"^sendt\b", r"^mottatt\b", r"^takk\b", r"\ber registrert\b",
]
ARRIVAL_RE = re.compile("|".join(ARRIVAL), re.I | re.M)

STRING = re.compile(r'"((?:[^"\\]|\\.)*)"' r"|'((?:[^'\\]|\\.)*)'")


def decomment(src):
    """Blank out comments, keeping every byte's position so line numbers stay
    true. Written after this gate's first run flagged the comments in the two
    files it had just fixed, which quoted the bad sentences in order to explain
    why they were bad — observation 10, in a language `ast` does not cover. A
    gate that fails on the documentation of its own rule teaches people to skip
    the run."""
    out, i, n = [], 0, len(src)
    while i < n:
        c = src[i]
        if c in "\"'":
            j = i + 1
            while j < n and src[j] != c:
                j += 2 if src[j] == "\\" else 1
            out.append(src[i:min(j + 1, n)])
            i = j + 1
        elif src.startswith("//", i):
            j = src.find("\n", i)
            j = n if j < 0 else j
            out.append(" " * (j - i))
            i = j
        elif src.startswith("/*", i):
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            out.append("".join(ch if ch == "\n" else " " for ch in src[i:j]))
            i = j
        else:
            out.append(c)
            i += 1
    return "".join(out)


def js_files():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP]
        for f in filenames:
            if f.endswith(".js"):
                yield os.path.relpath(os.path.join(dirpath, f), ROOT)


def block(src, start):
    """The braced body beginning at or after `start`, by brace matching."""
    i = src.find("{", start)
    if i < 0:
        return ""
    depth, j = 0, i
    while j < len(src):
        c = src[j]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return src[i:j + 1]
        j += 1
    return src[i:]


def sent_regions(handler):
    """Spans inside a `.then(` that follows a `fetch(` — where a server has
    answered and an arrival claim is therefore something the page knows."""
    spans = []
    for m in re.finditer(r"\bfetch\s*\(", handler):
        rest = handler[m.start():]
        for t in re.finditer(r"\.then\s*\(", rest):
            body = block(rest, t.end())
            if not body:
                continue
            at = rest.find(body, t.end())
            spans.append((m.start() + at, m.start() + at + len(body)))
    return spans


def main():
    findings = []
    for rel in sorted(js_files()):
        src = decomment(open(os.path.join(ROOT, rel), encoding="utf-8").read())
        for h in re.finditer(r"addEventListener\(\s*[\"']submit[\"']", src):
            handler = block(src, h.end())
            if not handler:
                continue
            base = src.find(handler, h.end())
            safe = sent_regions(handler)
            for s in STRING.finditer(handler):
                text = s.group(1) if s.group(1) is not None else s.group(2)
                if not ARRIVAL_RE.search(text):
                    continue
                if any(a <= s.start() < b for a, b in safe):
                    continue
                line = src.count("\n", 0, base + s.start()) + 1
                findings.append((rel, line, text))

    for rel, line, text in findings:
        short = text if len(text) <= 88 else text[:85] + "…"
        print("  · %s:%d" % (rel, line))
        print("      %s" % short)

    if findings:
        print("\nA submit handler tells the visitor their message arrived, outside the")
        print("`.then()` of any request — so the page says so without having sent")
        print("anything. Either post it and move the sentence into the .then, or say")
        print("plainly that nothing was sent and hand the visitor their text, the way")
        print("beta-art/release.js does.")
    print("\ntotal findings: %d" % len(findings))
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main())
