# QBLOGG-001 — Source and Code Audit v0.3

Date: 2026-08-22  
Source archive: `qbloggmarkakaynak.zip`  
Decision: **SOURCE VERIFIED / REVISE / FILING HOLD**

## 1. Package inventory

The archive safely expands without absolute paths, traversal segments, or backslash path ambiguity. It contains:

- one Python generator: `uretici/marka-uret.py`;
- one local Inter WOFF2 font and CSS declaration;
- two design/test documents;
- three visual evidence boards;
- eleven SVG and two PNG deliverables.

All eleven SVG files parse as XML. They contain only `svg`, `path`, `g`, and—where required—`rect` elements. No scripts, external references, text objects, embedded raster images, gradients, filters, masks, clipping paths, or strokes were found. The wordmark is delivered as outlines.

The PNG files are structurally valid at 32×32 and 180×180 pixels.

## 2. Verified construction

The source code and delivered SVGs support the following construction record:

| Property | Verified value |
|---|---:|
| Grid | 1000×1000 |
| Symbol footprint | 800×800 |
| Counter | 484×484 |
| Counter vertical offset | 7u upward |
| Bridge width | 85.989u |
| Bridge length | 461.520u |
| Bridge angle | 31.000° |
| Navy area | about 327,094u² |
| Visible aqua area | about 30,472u² |
| Open counter remainder | about 175,767u² |
| Aqua / counter | 14.775% |
| Aqua / total ink | 8.522% |

The small-icon bridge is separately widened to 100u in `ICON_AQUA`. The wordmark is derived from the bundled Inter source at weight 700, then converted to paths. The Q uses the O outline plus a custom four-point terminal.

## 3. Confirmed strengths

1. Geometry, key measurements, and the stated area ratios are internally consistent.
2. The primary vector assets are flat, self-contained, and suitable for ordinary SVG delivery.
3. Monochrome, reverse, horizontal, stacked, app-icon, and small-icon variants exist.
4. The documents explicitly avoid inventing user-test or trademark-search results.
5. Navy on white has strong luminance contrast: approximately 14.01:1.

## 4. Required revisions

### R01 — PNG/app-icon geometry mismatch

`qblogg-icon-app.svg` uses the widened `ICON_AQUA` bridge. The PNG routine instead calls `SYM_AQUA`, the thinner 86u bridge, while claiming to reproduce the SVG app composition. Therefore the favicon and Apple touch icon are not generated from exactly the same bridge geometry as the app SVG.

Required action: use `ICON_AQUA` in `_ikon_uret`, regenerate both PNGs, and compare them against the app-icon SVG master.

### R02 — `currentColor` is not implemented

The delivered SVGs use fixed fills such as `#082C54`, `#00D8C2`, `#000000`, and `#FFFFFF`. They do not use `currentColor`.

Required action: either remove the theme-rotation claim or add a separately named CSS/theme SVG variant without replacing the fixed-color filing master.

### R03 — stale or incorrect package commands and paths

- From the archive root, `python3 marka-uret.py` is not the correct path; the file is under `uretici/`.
- `logo-sistemi.md` still references `scripts/marka-uret.py`, `assets/brand/`, and `docs/gorseller/`, while this package uses `uretici/`, `varliklar/`, and `kanit/`.

Required action: synchronize package documentation with the actual archive layout.

### R04 — full reproducibility not yet proven in this audit environment

The generator compiles successfully, and the supplied WOFF2 is recognized as Inter with weight instances. A complete bit-for-bit regeneration was not executed because the current audit environment lacks the Python `brotli` dependency required by FontTools to open WOFF2.

Required action: run in a clean pinned environment, regenerate all 13 files, and record the output hashes. Add a dependency lock/requirements file.

### R05 — font license evidence missing

The font and CSS are included, but the package contains no font license text, source URL, version record, or attribution/provenance document.

Required action: add the applicable license and provenance evidence before the filing/rights package is closed.

### R06 — small-size aqua separation remains weak

Calculated color contrast is approximately:

- navy/white: 14.01:1;
- aqua/navy: 7.74:1;
- aqua/white: 1.81:1.

The aqua segment sits partly against white, so its weak small-size behavior is expected. The supplied test document already rejects the normal full-color symbol at 16px and reports the 24px aqua stroke below its 3px target.

Required action: enforce the monochrome 16px rule in implementation and test the regenerated 32px/180px PNGs on real displays.

### R07 — recognition evidence is incomplete

The visual boards show a coherent system, but at navigation scale the custom wordmark Q terminal can look like a small notch or punctuation mark. The standalone symbol can also read as an abstract O/ring until the diagonal is recognized. The five-second recognition test is explicitly unperformed.

Required action: run the documented test with real participants and keep the raw results.

### R08 — production and legal gates remain open

Fax/one-color print, embroidery, engraving, and large-format review are unperformed. Patentstyret, EUIPO/TMview, WIPO, company-name, and domain searches are blank. Applicant ownership and Nice-class scope are also blank.

Required action: keep the project on filing hold until these checks are completed and documented.

## 5. Final audit decision

The archive is a credible and substantially coherent construction source for the QBLOGG identity. It verifies how the current geometry and wordmark were produced. It does **not** yet justify a `FINAL`, `LOCKED`, or `TESCILE HAZIR` label because reproducibility, asset consistency, rights evidence, real-world production tests, recognition testing, and trademark clearance remain incomplete.
