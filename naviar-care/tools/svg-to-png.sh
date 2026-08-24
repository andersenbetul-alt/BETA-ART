#!/usr/bin/env bash
# Render an SVG to a transparent PNG with headless Chromium.
#
# Exists because two headless-Chromium traps silently produce a wrong file:
#
#   1. A window sized exactly to the drawing clips the bottom of it. Measured:
#      an 800x320 drawing in an 800x320 window loses everything below ~y=235;
#      the same drawing in an 800x400 window is complete. So render with slack.
#   2. --force-device-scale-factor on a small window renders a blank frame.
#
# Both write a valid PNG, so they look like success until you open the file.
#
#   scripts/svg-to-png.sh input.svg output.png [width]
#
# Height follows the SVG's own aspect ratio, taken from its viewBox.

set -euo pipefail

SVG="${1:?usage: svg-to-png.sh input.svg output.png [width]}"
OUT="${2:?usage: svg-to-png.sh input.svg output.png [width]}"
WIDTH="${3:-1024}"

CHROME="${CHROME_BIN:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}"
[ -x "$CHROME" ] || CHROME="$(command -v chromium || command -v google-chrome || true)"
[ -n "$CHROME" ] || { echo "no chromium found; set CHROME_BIN" >&2; exit 1; }

# Aspect ratio from the viewBox, so the caller only has to pick a width.
read -r VB_W VB_H < <(
  grep -o 'viewBox="[^"]*"' "$SVG" | head -1 |
  sed -E 's/viewBox="([^"]*)"/\1/' | awk '{print $3, $4}'
)
[ -n "${VB_W:-}" ] && [ -n "${VB_H:-}" ] || { echo "no viewBox in $SVG" >&2; exit 1; }
HEIGHT=$(awk -v w="$WIDTH" -v vw="$VB_W" -v vh="$VB_H" 'BEGIN{printf "%d", (w*vh/vw)+0.5}')
# Slack the viewport past the drawing so trap 1 cannot bite. The drawing keeps
# its own size; only the window grows, leaving transparent padding below.
WINDOW_H=$(awk -v h="$HEIGHT" 'BEGIN{printf "%d", (h*1.35)+40}')

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# The load-bearing part: size the <svg> itself, never html/body. Any height on
# the document element becomes a clip rectangle.
sed -E "0,/<svg /s//<svg width=\"$WIDTH\" height=\"$HEIGHT\" /" "$SVG" \
  | sed -E "0,/<svg /s/ width=\"[0-9.]+\" height=\"[0-9.]+\"( width=)/\1/" > "$WORK/sized.svg"

{
  printf '<!doctype html><html><head><meta charset="utf-8">'
  printf '<style>*{margin:0;padding:0}svg{display:block}</style></head><body>'
  cat "$WORK/sized.svg"
  printf '</body></html>'
} > "$WORK/page.html"

"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --default-background-color=00000000 --virtual-time-budget=6000 \
  --window-size="$WIDTH,$WINDOW_H" --screenshot="$OUT" \
  "file://$WORK/page.html" >/dev/null 2>&1

[ -s "$OUT" ] || { echo "render produced nothing" >&2; exit 1; }

# A blank frame still writes a valid PNG, so check it is not suspiciously small.
BYTES=$(stat -c%s "$OUT")
if [ "$BYTES" -lt 2000 ]; then
  echo "warning: $OUT is only ${BYTES} bytes — likely a blank render" >&2
fi
echo "$OUT  ${WIDTH}x${WINDOW_H}  ${BYTES} bytes  (drawing is ${WIDTH}x${HEIGHT}; the rest is transparent padding)"
