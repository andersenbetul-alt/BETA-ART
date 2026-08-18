#!/usr/bin/env python3
"""index.html dosyasini data/categories.json icerigine gore uretir."""

import html
import json
import pathlib

ROOT = pathlib.Path(__file__).parent
DATA = ROOT / "data" / "categories.json"
OUT = ROOT / "index.html"

PAGE = """<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BETA — Ürün Kategorileri</title>
<meta name="description" content="BETA ürün ailesi: WORK, BUSINESS, CAREER, LEARN, CREATOR, SENIOR ve LIFE.">
<style>
:root {{
  --bg: #ffffff;
  --bg-soft: #f6f6f4;
  --surface: #ffffff;
  --border: #e4e3df;
  --text: #16150f;
  --muted: #6b6a63;
  --accent: #c8552a;
  --accent-soft: #f5e7e0;
  --shadow: 0 1px 2px rgba(22,21,15,.05), 0 8px 24px rgba(22,21,15,.05);
}}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
    --bg: #14140f;
    --bg-soft: #1b1b15;
    --surface: #1e1e17;
    --border: #33322a;
    --text: #f2f1ea;
    --muted: #a5a396;
    --accent: #e8825a;
    --accent-soft: #33231b;
    --shadow: 0 1px 2px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.25);
  }}
}}
:root[data-theme="dark"] {{
  --bg: #14140f;
  --bg-soft: #1b1b15;
  --surface: #1e1e17;
  --border: #33322a;
  --text: #f2f1ea;
  --muted: #a5a396;
  --accent: #e8825a;
  --accent-soft: #33231b;
  --shadow: 0 1px 2px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.25);
}}

* {{ box-sizing: border-box; }}
body {{
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}}
.wrap {{ max-width: 1080px; margin: 0 auto; padding: 0 24px; }}

header {{ padding: 80px 0 56px; border-bottom: 1px solid var(--border); }}
.brand {{
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 13px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 28px;
}}
.brand .dot {{ width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }}
h1 {{
  margin: 0 0 18px;
  font-size: clamp(34px, 6vw, 58px);
  line-height: 1.1; letter-spacing: -.02em; font-weight: 600;
}}
.lede {{ margin: 0; max-width: 56ch; font-size: clamp(16px, 2.2vw, 19px); color: var(--muted); }}

main {{ padding: 56px 0 0; }}
.section-label {{
  font-size: 12px; letter-spacing: .16em; text-transform: uppercase;
  color: var(--muted); margin: 0 0 24px;
}}
.grid {{
  display: grid; gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}}
.card {{
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 26px 24px 24px;
  box-shadow: var(--shadow);
  display: flex; flex-direction: column;
}}
.card__icon {{
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--accent-soft); color: var(--accent);
  display: grid; place-items: center; font-size: 17px; margin-bottom: 18px;
}}
.card__name {{
  margin: 0 0 4px; font-size: 18px; font-weight: 600; letter-spacing: -.01em;
}}
.card__tagline {{
  margin: 0 0 14px; font-size: 14px; color: var(--accent); font-weight: 500;
}}
.card__desc {{ margin: 0 0 18px; font-size: 15px; color: var(--muted); }}
.card__list {{
  margin: auto 0 0; padding: 16px 0 0; list-style: none;
  border-top: 1px solid var(--border);
}}
.card__list li {{
  position: relative; padding-left: 18px; font-size: 14px; color: var(--muted);
}}
.card__list li + li {{ margin-top: 7px; }}
.card__list li::before {{
  content: ""; position: absolute; left: 0; top: 9px;
  width: 6px; height: 6px; border-radius: 50%; background: var(--accent); opacity: .55;
}}

footer {{
  margin-top: 72px; padding: 28px 0 48px;
  border-top: 1px solid var(--border);
  font-size: 14px; color: var(--muted);
  display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between;
}}
</style>
</head>
<body>
<header>
  <div class="wrap">
    <div class="brand"><span class="dot"></span>BETA</div>
    <h1>Ürün kategorileri</h1>
    <p class="lede">BETA ürün ailesi {count} kategoriden oluşuyor. Her biri farklı bir ihtiyaca odaklanıyor: işletmeler, kariyer, öğrenme, üretim ve günlük hayat.</p>
  </div>
</header>

<main>
  <div class="wrap">
    <p class="section-label">Kategoriler</p>
    <div class="grid">
{cards}
    </div>
  </div>
</main>

<footer>
  <div class="wrap" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;width:100%">
    <span>BETA</span>
    <span>Güncelleme: {updated}</span>
  </div>
</footer>
</body>
</html>
"""

CARD = """      <article class="card" id="{slug}">
        <div class="card__icon" aria-hidden="true">{icon}</div>
        <h2 class="card__name">{name}</h2>
        <p class="card__tagline">{tagline}</p>
        <p class="card__desc">{description}</p>
        <ul class="card__list">
{items}
        </ul>
      </article>"""


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def render_card(category: dict) -> str:
    items = "\n".join(
        f"          <li>{esc(item)}</li>" for item in category["highlights"]
    )
    return CARD.format(
        slug=esc(category["slug"]),
        icon=esc(category["icon"]),
        name=esc(category["name"]),
        tagline=esc(category["tagline"]),
        description=esc(category["description"]),
        items=items,
    )


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    categories = data["categories"]
    page = PAGE.format(
        count=len(categories),
        updated=esc(data["updated"]),
        cards="\n".join(render_card(c) for c in categories),
    )
    OUT.write_text(page, encoding="utf-8")
    print(f"{OUT.name} olusturuldu ({len(categories)} kategori)")


if __name__ == "__main__":
    main()
