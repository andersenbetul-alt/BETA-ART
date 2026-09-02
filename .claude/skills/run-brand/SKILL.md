---
name: run-brand
description: Launch and screenshot BETA-ART brand contact sheets (CODDAN, COBBANI, NAVIAR) via Playwright. Use whenever asked to run, preview, test, or screenshot any brand identity page; to verify a brand change looks correct in both light and dark; or to rebuild brand SVG/PNG assets.
---

Brand contact sheets live at `brand/<name>/index.html`. Driver is a Python Playwright script; no server needed (opens via `file://`). Chromium is at `/opt/pw-browsers/chromium`.

## Prerequisites

```bash
pip install playwright -q   # if not already installed
pip install fonttools brotli -q  # for rebuild only
# Chromium: /opt/pw-browsers/chromium  (pre-installed, no install needed)
```

## Run (agent path)

### Smoke test — all brands, light + dark

```bash
python3 .claude/skills/run-brand/driver.py smoke /tmp/brand-run
```

Output: 6 PNGs in `/tmp/brand-run/`. Exits 0 on PASS, 1 on any failure.

### Screenshot one brand

```bash
python3 .claude/skills/run-brand/driver.py shot coddan light /tmp/brand-run
python3 .claude/skills/run-brand/driver.py shot cobbani dark /tmp/brand-run
python3 .claude/skills/run-brand/driver.py shot all light /tmp/brand-run
```

`brand` options: `coddan`, `cobbani`, `naviar`, `all`  
`theme` options: `light` (default), `dark`

Screenshot path printed to stdout.

### Rebuild brand assets

```bash
# Rebuild one brand's SVGs:
python3 .claude/skills/run-brand/driver.py build coddan

# Rebuild all brands + QBLOGG global assets:
python3 .claude/skills/run-brand/driver.py build all
```

Equivalent to running `scripts/marka-uret.py` (QBLOGG) + each `brand/<name>/build.py`.

## Brands

| Brand | Colors | Contact sheet |
|-------|--------|---------------|
| CODDAN | Navy `#0B1829` / Blue `#0066FF` | `brand/coddan/index.html` |
| COBBANI | Ink `#1A0A00` / Gold `#C8962A` | `brand/cobbani/index.html` |
| NAVIAR | (see build.py) | `brand/naviar/index.html` |
| QBLOGG | Navy `#082C54` / Aqua `#00D8C2` | assets built by `scripts/marka-uret.py` |

## Gotchas

- **Python Playwright, not Node**: Node Playwright has `MODULE_NOT_FOUND` issues in this container. The driver uses `playwright.sync_api`. Do not switch to Node.
- **file:// protocol**: contact sheets use `file://` URL — no server needed, but relative asset paths must work without a web root. All brand sheets pass this (assets inline or adjacent).
- **fontTools required for build**: `marka-uret.py` imports `fontTools.ttLib`; install with `pip install fonttools brotli -q` before any `build` command.
- **Screenshot size sanity**: a valid screenshot is >10 KB. Smaller = blank page or error.

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ModuleNotFoundError: playwright` | `pip install playwright -q` |
| `ModuleNotFoundError: fontTools` | `pip install fonttools brotli -q` |
| `FileNotFoundError: .../index.html` | Run `build` command first to generate contact sheet |
| Screenshot < 10 KB | Check `brand/<name>/index.html` opens without JS errors |
