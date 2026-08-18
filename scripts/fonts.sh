#!/usr/bin/env bash
# Refetch the self-hosted webfonts. Only needed when a weight or a script is added.
#
# The site loads no third-party resources, so the faces live in assets/fonts/ and are
# declared in assets/css/fonts.css. Subsets: latin, latin-ext, cyrillic, cyrillic-ext —
# Arabic, Devanagari and Bengali intentionally fall back to system faces.
#
# Weights in use: Barlow Condensed 300/400/700/900 · Space Mono 400 · Inter 300/400
set -euo pipefail
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
URL='https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Space+Mono:wght@400&family=Inter:wght@300;400&display=swap'
curl -sS -A "$UA" "$URL" -o /tmp/gf.css
echo "Fetched the stylesheet to /tmp/gf.css."
echo "Keep the latin/latin-ext/cyrillic blocks, download each woff2 into assets/fonts/,"
echo "rename it <family>-<weight>-<subset>.woff2 and point the src at ../fonts/<name>."
