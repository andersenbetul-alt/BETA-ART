# Toolchain failures and how to diagnose them

All observed in a Claude Code remote container, 2026-08-25. Each one cost
real time; each has a fast tell.

## `recalc.py` reports a timeout on every workbook — LibreOffice Calc is missing

**Symptom.** `python scripts/recalc.py model.xlsx 90` returns:

```json
{"error": "LibreOffice timed out after 88s; formulas were NOT recalculated.
           Re-run with a longer timeout."}
```

Raising the timeout does not help. It fails at 420s too.

**The error message is wrong.** Nothing is timing out. `soffice` cannot load
the file at all, and the wrapper reports the failure as a timeout.

**Diagnosis — two commands.** Convert directly and watch how long it takes:

```bash
soffice --headless --norestore -env:UserInstallation=file:///tmp/lo_prof \
        --convert-to xlsx --outdir /tmp/lo_out /abs/path/model.xlsx
# Error: source file could not be loaded     <- in ~1 second, not 88
```

A load error in one second is not a timeout. Then bisect with a **one-cell
workbook**:

```python
from openpyxl import Workbook
wb = Workbook(); wb.active["A1"] = "hi"; wb.save("/tmp/t.xlsx")
```

If that also fails to load, the problem is LibreOffice, not your file. Confirm:

```bash
ls /usr/lib/libreoffice/share/registry/   # no calc.xcd => Calc not installed
```

**Fix.**

```bash
apt-get install -y --no-install-recommends libreoffice-calc
```

Takes about a minute. Does not survive the container being reclaimed, so
expect to redo it in a new session.

**Generalises to:** any wrapper that reports a subprocess failure as a
timeout. Time the underlying command yourself. A "timeout" that returns
instantly is a different bug wearing a timeout's clothes.

## `openpyxl` is not preinstalled, despite the xlsx skill saying it is

```
ModuleNotFoundError: No module named 'openpyxl'
```

```bash
pip install --break-system-packages openpyxl
```

The `--break-system-packages` flag is required on this image. Do not trust a
skill's "preinstalled — do not run pip install" claim over an actual
ImportError.

## Note strings that begin with `=` become broken formulas

Source-note text written into a cell is parsed as a formula if it starts with
an equals sign. These produced `#VALUE!` and `#N/A` in an otherwise clean
workbook:

```python
a.cell(r, 6, "= entry multiple x current ARR")      # -> #VALUE!
a.cell(r, 6, "= cheque / entry EV. See comment.")   # -> #N/A
```

Drop the leading `=`: `"Entry multiple x current ARR"`. The tell is a formula
error in a cell you never intended to be a formula — check your annotation
strings before hunting through the model.

## A connector reported "not available" may just be switched off

Before telling the user a data source is unavailable, call `ListConnectors`:

```json
{"name": "Daloopa",  "installState": "unknown", "enabledInChat": false}
{"name": "S&P Global - Adaptive Retrieval", "enabledInChat": false}
{"name": "Box", "enabledInChat": false}
```

`enabledInChat: false` means installed on the account but toggled off for
this session — its tools never loaded, so `ToolSearch` finds nothing and the
capability looks absent. The useful report is "installed but off for this
chat, enable it in connector settings", not "not available".

Also worth checking: the requested product may not exist as its own
connector. There is no Kensho connector; Kensho is S&P Global, so the
nearest thing is S&P Global Adaptive Retrieval — and whether it exposes the
specific dataset asked for cannot be confirmed until it is enabled.

## Verify the subject exists before modelling it

A ticker that returns only vendor documentation pages in search is probably
an example, not a company. One search costs seconds; twelve quarters of
fabricated financials costs credibility.
