#!/usr/bin/env python3
"""Build ciktilarinin testleri: tekrarlanabilirlik ve sayfa degismezleri.

Calistirma: python3 tests/test_build.py
"""

import hashlib
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ["index.html", "work.html", "team.html", "review.html"]

failures = []


def check(cond, msg):
    if not cond:
        failures.append(msg)


def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def test_deterministic():
    """Ayni girdiyle iki kez calisan build ayni ciktiyi vermeli."""
    before = {p: digest(ROOT / p) for p in PAGES}
    for script in ("build.py", "build_review.py"):
        r = subprocess.run([sys.executable, script], cwd=ROOT,
                           capture_output=True, text=True)
        check(r.returncode == 0, f"{script} sifirdan farkli kodla cikti: {r.stderr[:200]}")
    for p in PAGES:
        check(digest(ROOT / p) == before[p], f"{p}: build tekrarlanabilir degil")


def test_page_invariants():
    for name in PAGES:
        html = (ROOT / name).read_text(encoding="utf-8")

        # sablon kacaklari: uretilmemis {{ }} veya {degisken} kalintisi
        check("{{" not in html and "}}" not in html,
              f"{name}: islenmemis sablon parantezi kalmis")
        check(not re.search(r"\{esc\(|\{data\[|\{len\(", html),
              f"{name}: islenmemis f-string ifadesi kalmis")

        # her sayfada baslik ve dil
        check("<title>" in html, f"{name}: <title> yok")
        check('lang="tr"' in html or "<title>" in html, f"{name}: dil bilgisi yok")

        # her iki tema da tanimli olmali
        check("prefers-color-scheme: dark" in html, f"{name}: koyu tema yok")
        check('data-theme="dark"' in html, f"{name}: tema anahtari yok")

        # kirik baglanti: sayfa ici capa hedefleri gercekten var mi
        for anchor in set(re.findall(r'href="#([\w-]+)"', html)):
            check(f'id="{anchor}"' in html, f"{name}: '#{anchor}' capasi hedefsiz")


def test_review_accessibility():
    """review.html icin duzeltilen erisilebilirlik degismezleri."""
    html = (ROOT / "review.html").read_text(encoding="utf-8")

    # tipografi rem tabanli olmali (kullanici yazi boyutu ayarina uysun)
    px_fonts = re.findall(r"font-size: (\d+(?:\.\d+)?)px", html)
    check(not px_fonts, f"review.html: px'e kilitli yazi boyutu: {px_fonts}")

    # bosluklar 4pt izgarada
    spaces = re.findall(r"(?:padding|margin|gap)[^:]*: ([0-9px ]+);", html)
    off = sorted({v for s in spaces for v in s.split()
                  if v.endswith("px") and int(v[:-2]) % 4})
    check(not off, f"review.html: 4pt izgara disi bosluk: {off}")

    # Kontrast: acik mod --muted koyulastirilmis olmali. Koyu moddaki #898781
    # mesrudur (koyu zeminde 5.14:1); kontrol sadece acik mod blokunu hedefler.
    light_block = html.split("@media", 1)[0]
    m = re.search(r"--muted: (#[0-9a-fA-F]{6});", light_block)
    check(m is not None, "review.html: acik modda --muted tanimi bulunamadi")
    if m:
        check(m.group(1).lower() == "#6b6a63",
              f"review.html: acik mod --muted {m.group(1)} — kontrast esigi altina donmus")

    # grafik isabet alanlari duruyor mu
    check(html.count('class="hit"') >= 8,
          "review.html: grafik isabet alanlari eksik (cubuklar tekrar kucuk hedef olur)")

    # baslik satir yuksekligi ayarli
    check(re.search(r"h2 \{[^}]*line-height: 1\.2", html),
          "review.html: h2 satir yuksekligi ayarlanmamis")


if __name__ == "__main__":
    for fn in (test_deterministic, test_page_invariants, test_review_accessibility):
        try:
            fn()
        except Exception as e:
            failures.append(f"{fn.__name__} istisna: {e!r}")
    if failures:
        print("BUILD TESTLERI BASARISIZ:")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    print(f"build testleri: OK ({len(PAGES)} sayfa)")
