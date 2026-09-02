#!/usr/bin/env python3
"""
run-brand driver — screenshot brand contact sheets via Playwright.

Usage:
  python3 .claude/skills/run-brand/driver.py smoke [outdir]
  python3 .claude/skills/run-brand/driver.py shot <brand> [light|dark] [outdir]
  python3 .claude/skills/run-brand/driver.py build [brand]

brands: coddan, cobbani, naviar, all
"""

import sys
import os
import subprocess
from pathlib import Path

REPO = Path(__file__).parent.parent.parent.parent
BRANDS = ["coddan", "cobbani", "naviar"]
CHROMIUM = "/opt/pw-browsers/chromium"


def get_page():
    from playwright.sync_api import sync_playwright
    return sync_playwright().__enter__()


def shot(brand: str, theme: str, outdir: Path) -> Path:
    """Screenshot one brand contact sheet, return path."""
    from playwright.sync_api import sync_playwright
    index = REPO / "brand" / brand / "index.html"
    if not index.exists():
        raise FileNotFoundError(f"No contact sheet at {index}")
    outdir.mkdir(parents=True, exist_ok=True)
    dest = outdir / f"{brand}-{theme}.png"
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        if theme == "dark":
            page.emulate_media(color_scheme="dark")
        page.goto(f"file://{index}", wait_until="networkidle")
        errors = []
        page.on("console", lambda m: errors.append(m) if m.type == "error" else None)
        page.screenshot(path=str(dest))
        browser.close()
        if errors:
            print(f"  ⚠ console errors: {[e.text for e in errors]}")
    return dest


def cmd_smoke(outdir: Path):
    print("SMOKE: brand contact sheets")
    ok = True
    for brand in BRANDS:
        for theme in ["light", "dark"]:
            try:
                dest = shot(brand, theme, outdir)
                size = os.path.getsize(dest)
                if size < 10_000:
                    print(f"  ✗ {brand}/{theme}: suspiciously small ({size} B)")
                    ok = False
                else:
                    print(f"  ✓ {brand}/{theme}: {size:,} B → {dest}")
            except Exception as e:
                print(f"  ✗ {brand}/{theme}: {e}")
                ok = False
    if ok:
        print("SMOKE: PASS")
    else:
        print("SMOKE: FAIL")
        sys.exit(1)


def cmd_shot(brand: str, theme: str, outdir: Path):
    if brand == "all":
        for b in BRANDS:
            dest = shot(b, theme, outdir)
            print(f"  → {dest}")
    else:
        dest = shot(brand, theme, outdir)
        print(f"  → {dest}")


def cmd_build(brand: str):
    """Regenerate SVG/PNG assets via brand-specific build.py or global marka-uret.py."""
    if brand == "all" or brand is None:
        # Global QBLOGG brand assets
        script = REPO / "scripts" / "marka-uret.py"
        subprocess.run(["python3", str(script)], cwd=REPO, check=True)
        # Individual brand directories
        for b in BRANDS:
            build = REPO / "brand" / b / "build.py"
            if build.exists():
                print(f"\n── {b} ──")
                subprocess.run(["python3", str(build)], cwd=REPO / "brand" / b, check=True)
    else:
        build = REPO / "brand" / brand / "build.py"
        if build.exists():
            subprocess.run(["python3", str(build)], cwd=REPO / "brand" / brand, check=True)
        else:
            print(f"No build.py for {brand}; run scripts/marka-uret.py for QBLOGG assets")
            sys.exit(1)


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(0)

    cmd = args[0]

    if cmd == "smoke":
        outdir = Path(args[1]) if len(args) > 1 else Path("/tmp/brand-run")
        cmd_smoke(outdir)

    elif cmd == "shot":
        brand = args[1] if len(args) > 1 else "all"
        # optional: "light" or "dark" as next arg, then outdir
        theme = "light"
        outdir = Path("/tmp/brand-run")
        if len(args) > 2 and args[2] in ("light", "dark"):
            theme = args[2]
            outdir = Path(args[3]) if len(args) > 3 else outdir
        elif len(args) > 2:
            outdir = Path(args[2])
        cmd_shot(brand, theme, outdir)

    elif cmd == "build":
        brand = args[1] if len(args) > 1 else "all"
        cmd_build(brand)

    else:
        print(f"Unknown command: {cmd}")
        print(__doc__)
        sys.exit(1)
