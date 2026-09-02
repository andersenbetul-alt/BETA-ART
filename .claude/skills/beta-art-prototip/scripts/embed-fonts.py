#!/usr/bin/env python3
"""Beta Art prototipleri için font gömücü.

html-inline, CSS url() font varlıklarını tek dosyaya GÖMMEZ — @fontsource'u
doğrudan import eden bundle, tek başına açıldığında sessizce sistem fontuna
düşer. Bu betik, kullanılan kesitleri base64 data-URI olarak
src/fonts-embedded.css'e yazar; sonuç dosya hiçbir dış kaynağa bakmaz.

Kullanım (proje kökünden, @fontsource paketleri kurulu olmalı):
    python3 embed-fonts.py                # varsayılan set
    python3 embed-fonts.py --inter-500    # + Inter Medium (font-medium kullanılıyorsa)

Yalnızca gerçekten kullanılan ağırlıkları göm: her kesit ~20-25KB.
"""
import argparse
import base64
import pathlib
import sys

BASE = [
    ("Inter", 400, "normal", "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2"),
    ("Inter", 400, "italic", "node_modules/@fontsource/inter/files/inter-latin-400-italic.woff2"),
    ("Fraunces", 400, "normal", "node_modules/@fontsource/fraunces/files/fraunces-latin-400-normal.woff2"),
    ("JetBrains Mono", 400, "normal", "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2"),
]
INTER_500 = ("Inter", 500, "normal", "node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2")

parser = argparse.ArgumentParser()
parser.add_argument("--inter-500", action="store_true", help="Inter Medium'u da göm (sayfada font-medium varsa)")
args = parser.parse_args()

fonts = BASE + ([INTER_500] if args.inter_500 else [])

out = [
    "/* embed-fonts.py üretti — SIL OFL lisanslı @fontsource dosyaları, latin",
    "   kesiti, base64 (html-inline CSS url() varlıklarını gömmediği için). */",
]
for family, weight, style, path in fonts:
    p = pathlib.Path(path)
    if not p.exists():
        sys.exit(f"eksik font dosyası: {path} — önce `pnpm add @fontsource/...` çalıştır")
    data = base64.b64encode(p.read_bytes()).decode()
    out.append(
        f'@font-face{{font-family:"{family}";font-style:{style};font-weight:{weight};'
        f'font-display:swap;src:url(data:font/woff2;base64,{data}) format("woff2");}}'
    )

dest = pathlib.Path("src/fonts-embedded.css")
dest.write_text("\n".join(out) + "\n")
print(f"{dest} yazıldı — {len(fonts)} yüz, {dest.stat().st_size // 1024}KB")
print("index.css'in en üstüne ekle: @import './fonts-embedded.css';")
