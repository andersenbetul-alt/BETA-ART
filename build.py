#!/usr/bin/env python3
"""Sayfalari data/ altindaki JSON dosyalarindan uretir.

  index.html  <- data/categories.json   (BETA urun kategorileri)
  work.html   <- data/workforce.json    (BETA WORK / AI Workforce)
"""

import html
import json
import pathlib

ROOT = pathlib.Path(__file__).parent
DATA = ROOT / "data"

STYLE = """
:root {
  --bg: #ffffff;
  --bg-soft: #f6f6f4;
  --surface: #ffffff;
  --border: #e4e3df;
  --text: #16150f;
  --muted: #6b6a63;
  --accent: #c8552a;
  --accent-soft: #f5e7e0;
  --shadow: 0 1px 2px rgba(22,21,15,.05), 0 8px 24px rgba(22,21,15,.05);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #14140f;
    --bg-soft: #1b1b15;
    --surface: #1e1e17;
    --border: #33322a;
    --text: #f2f1ea;
    --muted: #a5a396;
    --accent: #e8825a;
    --accent-soft: #33231b;
    --shadow: 0 1px 2px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.25);
  }
}
:root[data-theme="dark"] {
  --bg: #14140f;
  --bg-soft: #1b1b15;
  --surface: #1e1e17;
  --border: #33322a;
  --text: #f2f1ea;
  --muted: #a5a396;
  --accent: #e8825a;
  --accent-soft: #33231b;
  --shadow: 0 1px 2px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.25);
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
a { color: inherit; }

header { padding: 72px 0 52px; border-bottom: 1px solid var(--border); }
.brand {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 13px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 26px;
}
.brand .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
h1 {
  margin: 0 0 18px;
  font-size: clamp(32px, 5.6vw, 56px);
  line-height: 1.1; letter-spacing: -.02em; font-weight: 600;
}
.lede { margin: 0; max-width: 58ch; font-size: clamp(16px, 2.2vw, 19px); color: var(--muted); }
.quote {
  margin: 0 0 20px; padding-left: 18px; border-left: 3px solid var(--accent);
  font-size: clamp(17px, 2.4vw, 21px); max-width: 58ch;
}

section { padding: 56px 0 0; }
.section-label {
  font-size: 12px; letter-spacing: .16em; text-transform: uppercase;
  color: var(--muted); margin: 0 0 8px;
}
.section-title { margin: 0 0 26px; font-size: 24px; font-weight: 600; letter-spacing: -.01em; }

.grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
.card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
  padding: 26px 24px 24px; box-shadow: var(--shadow);
  display: flex; flex-direction: column;
}
.card__icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--accent-soft); color: var(--accent);
  display: grid; place-items: center; font-size: 17px; margin-bottom: 18px;
}
.card__name { margin: 0 0 4px; font-size: 18px; font-weight: 600; letter-spacing: -.01em; }
.card__tagline { margin: 0 0 14px; font-size: 14px; color: var(--accent); font-weight: 500; }
.card__desc { margin: 0 0 18px; font-size: 15px; color: var(--muted); }
.card__list { margin: auto 0 0; padding: 16px 0 0; list-style: none; border-top: 1px solid var(--border); }
.card__list li { position: relative; padding-left: 18px; font-size: 14px; color: var(--muted); }
.card__list li + li { margin-top: 7px; }
.card__list li::before {
  content: ""; position: absolute; left: 0; top: 9px;
  width: 6px; height: 6px; border-radius: 50%; background: var(--accent); opacity: .55;
}
.card__meta {
  margin-top: 16px; padding-top: 14px; border-top: 1px dashed var(--border);
  font-size: 13px; color: var(--muted);
}
.card__meta b { color: var(--text); font-weight: 500; }
.card__meta p { margin: 0 0 6px; }
.card__meta p:last-child { margin-bottom: 0; }

.steps { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); }
.step {
  background: var(--bg-soft); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px 18px;
}
.step__no { font-size: 12px; letter-spacing: .12em; color: var(--accent); font-weight: 600; }
.step__name { margin: 8px 0 4px; font-size: 16px; font-weight: 600; }
.step__dur { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
.step__sum { margin: 12px 0 0; font-size: 14px; color: var(--muted); }
.step__out { margin: 12px 0 0; font-size: 13px; color: var(--accent); }

.tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.tags li {
  font-size: 12px; color: var(--muted);
  border: 1px solid var(--border); border-radius: 999px; padding: 3px 10px;
}

.notes { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
.notes li {
  position: relative; padding-left: 24px; font-size: 15px; color: var(--muted);
  max-width: 76ch;
}
.notes li::before {
  content: "✓"; position: absolute; left: 0; top: 0; color: var(--accent); font-size: 13px;
}

footer {
  margin-top: 72px; padding: 28px 0 48px; border-top: 1px solid var(--border);
  font-size: 14px; color: var(--muted);
}
footer .wrap { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; }
"""

PAGE = """<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<style>{style}</style>
</head>
<body>
{body}
<footer>
  <div class="wrap">
    <span>BETA</span>
    <span>Güncelleme: {updated}</span>
  </div>
</footer>
</body>
</html>
"""


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def li(items, cls=""):
    attr = f' class="{cls}"' if cls else ""
    return "\n".join(f"      <li{attr}>{esc(i)}</li>" for i in items)


def load(name: str) -> dict:
    return json.loads((DATA / f"{name}.json").read_text(encoding="utf-8"))


def write(name: str, title: str, description: str, body: str, updated: str) -> None:
    path = ROOT / name
    path.write_text(
        PAGE.format(
            title=esc(title),
            description=esc(description),
            style=STYLE,
            body=body,
            updated=esc(updated),
        ),
        encoding="utf-8",
    )
    print(f"{name} olusturuldu")


# --- index.html -------------------------------------------------------------

def build_index() -> None:
    data = load("categories")
    cards = []
    for c in data["categories"]:
        cards.append(f"""      <article class="card" id="{esc(c['slug'])}">
        <div class="card__icon" aria-hidden="true">{esc(c['icon'])}</div>
        <h2 class="card__name">{esc(c['name'])}</h2>
        <p class="card__tagline">{esc(c['tagline'])}</p>
        <p class="card__desc">{esc(c['description'])}</p>
        <ul class="card__list">
{li(c['highlights'])}
        </ul>
      </article>""")

    body = f"""<header>
  <div class="wrap">
    <div class="brand"><span class="dot"></span>BETA</div>
    <h1>Ürün kategorileri</h1>
    <p class="lede">BETA ürün ailesi {len(data['categories'])} kategoriden oluşuyor. Her biri farklı bir ihtiyaca odaklanıyor: işletmeler, kariyer, öğrenme, üretim ve günlük hayat.</p>
  </div>
</header>

<main>
  <section>
    <div class="wrap">
      <p class="section-label">Kategoriler</p>
      <h2 class="section-title">Yedi ürün, yedi ihtiyaç</h2>
      <div class="grid">
{chr(10).join(cards)}
      </div>
      <p style="margin-top:28px;font-size:15px;color:var(--muted)">
        İlk ürün: <a href="work.html"><b>BETA WORK — AI Workforce</b></a>
      </p>
    </div>
  </section>
</main>"""
    write("index.html", "BETA — Ürün Kategorileri",
          "BETA ürün ailesi: WORK, BUSINESS, CAREER, LEARN, CREATOR, SENIOR ve LIFE.",
          body, data["updated"])


# --- work.html --------------------------------------------------------------

def build_work() -> None:
    data = load("workforce")

    steps = "\n".join(f"""        <div class="step">
          <div class="step__no">{esc(s['step'])}</div>
          <div class="step__name">{esc(s['name'])}</div>
          <div class="step__dur">{esc(s['duration'])}</div>
          <p class="step__sum">{esc(s['summary'])}</p>
          <p class="step__out">→ {esc(s['output'])}</p>
        </div>""" for s in data["process"])

    agents = "\n".join(f"""        <article class="card" id="{esc(a['id'])}">
          <div class="card__icon" aria-hidden="true">{esc(a['icon'])}</div>
          <h3 class="card__name">{esc(a['name'])}</h3>
          <p class="card__tagline">{esc(a['tr'])} · kurulum {esc(a['setup'])}</p>
          <p class="card__desc">{esc(a['role'])}</p>
          <ul class="card__list">
{li(a['does'])}
          </ul>
          <div class="card__meta">
            <p><b>Bağlandığı araçlar:</b> {esc(', '.join(a['integrations']))}</p>
            <p><b>Ölçülen:</b> {esc(', '.join(a['kpi']))}</p>
            <p><b>İnsana devir:</b> {esc(a['handoff'])}</p>
          </div>
        </article>""" for a in data["agents"])

    packages = "\n".join(f"""        <article class="card">
          <div class="card__icon" aria-hidden="true">{p['agents']}</div>
          <h3 class="card__name">{esc(p['name'])}</h3>
          <p class="card__tagline">{esc(p['agents'])} AI çalışanı</p>
          <p class="card__desc">{esc(p['for'])}</p>
          <ul class="card__list">
{li(p['includes'])}
          </ul>
        </article>""" for p in data["packages"])

    body = f"""<header>
  <div class="wrap">
    <div class="brand"><span class="dot"></span>BETA WORK</div>
    <h1>AI Workforce</h1>
    <p class="quote">“{esc(data['promise'])}”</p>
    <p class="lede">Yeni yazılım öğrenmeye gerek yok. Şirketin bugün kullandığı araçların içinde çalışan, {len(data['agents'])} göreve özel AI çalışanı kuruyoruz — önce gözetimli, sonra devredilmiş.</p>
  </div>
</header>

<main>
  <section>
    <div class="wrap">
      <p class="section-label">Nasıl çalışır</p>
      <h2 class="section-title">Analizden devreye almaya</h2>
      <div class="steps">
{steps}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="section-label">Ekip</p>
      <h2 class="section-title">Kurduğumuz {len(data['agents'])} AI çalışanı</h2>
      <div class="grid">
{agents}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="section-label">Paketler</p>
      <h2 class="section-title">Kaç çalışanla başlanır?</h2>
      <div class="grid">
{packages}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="section-label">Çalışma ilkeleri</p>
      <h2 class="section-title">Kontrol her zaman şirkette</h2>
      <ul class="notes">
{li(data['guarantees'])}
      </ul>
      <p style="margin-top:28px;font-size:15px;color:var(--muted)">
        <a href="index.html">← Tüm BETA ürünleri</a>
      </p>
    </div>
  </section>
</main>"""
    write("work.html", "BETA WORK — AI Workforce",
          data["promise"], body, data["updated"])


if __name__ == "__main__":
    build_index()
    build_work()
