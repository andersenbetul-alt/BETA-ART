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

.card__night {
  margin: 16px 0 0; padding: 12px 14px; border-radius: 10px;
  background: var(--accent-soft); color: var(--text);
  font-size: 13.5px; line-height: 1.5;
}
.mods { display: grid; gap: 0; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.mod {
  display: grid; grid-template-columns: minmax(160px, 1fr) minmax(0, 2fr) minmax(120px, auto);
  gap: 14px; align-items: baseline;
  padding: 14px 18px; background: var(--surface); font-size: 14px;
}
.mod + .mod { border-top: 1px solid var(--border); }
.mod b { font-weight: 600; font-size: 14.5px; }
.mod span { color: var(--muted); }
.mod em {
  font-style: normal; font-size: 12px; color: var(--accent);
  letter-spacing: .04em; text-align: right;
}
@media (max-width: 640px) {
  .mod { grid-template-columns: 1fr; gap: 4px; }
  .mod em { text-align: left; }
}
.tiles { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); }
.tile { background: var(--bg-soft); border: 1px solid var(--border); border-radius: 12px; padding: 20px 18px; }
.tile h3 { margin: 0 0 8px; font-size: 15.5px; font-weight: 600; }
.tile p { margin: 0; font-size: 14px; color: var(--muted); }

.groupbar { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); margin-bottom: 28px; }
.groupbar div {
  background: var(--bg-soft); border: 1px solid var(--border); border-radius: 10px;
  padding: 12px 14px; font-size: 13px;
}
.groupbar b { display: block; font-size: 13.5px; margin-bottom: 4px; }
.groupbar span { color: var(--muted); font-size: 12.5px; line-height: 1.45; }

.roles { display: grid; gap: 0; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.role {
  display: grid; grid-template-columns: 30px minmax(150px, 1.1fr) minmax(0, 2fr) auto;
  gap: 14px; align-items: baseline; padding: 15px 18px; background: var(--surface);
}
.role + .role { border-top: 1px solid var(--border); }
.role__no { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.role__name { font-weight: 600; font-size: 14.5px; }
.role__body { font-size: 14px; color: var(--muted); }
.role__body em { font-style: normal; display: block; margin-top: 5px; font-size: 13px; opacity: .95; }
.tag {
  font-size: 11px; letter-spacing: .04em; text-transform: uppercase;
  border: 1px solid var(--border); border-radius: 999px; padding: 3px 9px; color: var(--muted);
  white-space: nowrap;
}
.tag--core { border-color: var(--accent); color: var(--accent); }
.tag--new { background: var(--accent-soft); border-color: var(--accent-soft); color: var(--accent); }
@media (max-width: 720px) {
  .role { grid-template-columns: 1fr; gap: 6px; }
}

.waves { display: grid; gap: 12px; }
.wave {
  display: grid; grid-template-columns: 46px 1fr; gap: 16px;
  background: var(--bg-soft); border: 1px solid var(--border); border-radius: 12px; padding: 18px;
}
.wave__no {
  width: 34px; height: 34px; border-radius: 50%; background: var(--accent-soft);
  color: var(--accent); display: grid; place-items: center; font-weight: 600; font-size: 14px;
}
.wave__name { font-weight: 600; font-size: 16px; margin: 0 0 2px; }
.wave__trigger { font-size: 12.5px; color: var(--accent); margin: 0 0 8px; }
.wave__hires { margin: 0; font-size: 14px; color: var(--muted); }

.cta { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 26px 0 12px; }
.btn {
  display: inline-block; padding: 13px 22px; border-radius: 10px;
  font-size: 15px; font-weight: 600; text-decoration: none;
  background: var(--accent); color: #fff; border: 1px solid var(--accent);
}
.btn:hover { filter: brightness(1.06); }
.btn--ghost { background: transparent; color: var(--text); border-color: var(--border); font-weight: 500; }
.cta__support { margin: 0; font-size: 13.5px; color: var(--muted); }

.qa { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.qa details { background: var(--surface); }
.qa details + details { border-top: 1px solid var(--border); }
.qa summary {
  cursor: pointer; padding: 16px 18px; font-size: 15.5px; font-weight: 500;
  list-style: none; display: flex; justify-content: space-between; gap: 16px; align-items: center;
}
.qa summary::-webkit-details-marker { display: none; }
.qa summary::after { content: "＋"; color: var(--accent); font-size: 18px; line-height: 1; }
.qa details[open] summary::after { content: "−"; }
.qa p { margin: 0; padding: 0 18px 18px; font-size: 14.5px; color: var(--muted); max-width: 72ch; }

.close {
  background: var(--bg-soft); border: 1px solid var(--border); border-radius: 14px;
  padding: 32px 28px; margin-top: 8px;
}
.close h2 { margin: 0 0 12px; font-size: clamp(21px, 3vw, 27px); letter-spacing: -.01em; }
.close p { margin: 0 0 8px; font-size: 15.5px; color: var(--muted); max-width: 62ch; }
.close .cta { margin-bottom: 6px; }

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
    by_id = {m["id"]: m for m in data["modules"]}
    role_of = {m: r["name"] for r in data["roles"] for m in r["modules"]}

    roles = "\n".join(f"""        <article class="card" id="{esc(r['id'])}">
          <div class="card__icon" aria-hidden="true">{esc(r['icon'])}</div>
          <h3 class="card__name">{esc(r['name'])}</h3>
          <p class="card__tagline">{esc(r['tr'])} · kurulum {esc(r['setup'])}</p>
          <p class="card__desc"><b>{esc(r['promise'])}</b><br>{esc(r['role'])}</p>
          <ul class="card__list">
{li(r['does'])}
          </ul>
          <p class="card__night">🌙 {esc(r['night'])}</p>
          <div class="card__meta">
            <p><b>Bağlandığı araçlar:</b> {esc(', '.join(r['integrations']))}</p>
            <p><b>Ölçülen:</b> {esc(', '.join(r['kpi']))}</p>
            <p><b>İnsana devir:</b> {esc(r['handoff'])}</p>
          </div>
        </article>""" for r in data["roles"])

    tiles = "\n".join(f"""        <div class="tile">
          <h3>{esc(t['title'])}</h3>
          <p>{esc(t['text'])}</p>
        </div>""" for t in data["always_on"])

    steps = "\n".join(f"""        <div class="step">
          <div class="step__no">{esc(s_['step'])}</div>
          <div class="step__name">{esc(s_['name'])}</div>
          <div class="step__dur">{esc(s_['duration'])}</div>
          <p class="step__sum">{esc(s_['summary'])}</p>
          <p class="step__out">→ {esc(s_['output'])}</p>
        </div>""" for s_ in data["process"])

    mods = "\n".join(f"""        <div class="mod" id="{esc(m['id'])}">
          <b>{esc(m['name'])}</b>
          <span>{esc(m['role'])}</span>
          <em>{esc(role_of[m['id']])}</em>
        </div>""" for m in data["modules"])

    qa = "\n".join(f"""        <details>
          <summary>{esc(o['q'])}</summary>
          <p>{esc(o['a'])}</p>
        </details>""" for o in data["objections"])

    packages = "\n".join(f"""        <article class="card">
          <div class="card__icon" aria-hidden="true">{p_['roles']}</div>
          <h3 class="card__name">{esc(p_['name'])}</h3>
          <p class="card__tagline">{esc(p_['roles'])} AI çalışanı</p>
          <p class="card__desc">{esc(p_['for'])}</p>
          <ul class="card__list">
{li(p_['includes'])}
          </ul>
        </article>""" for p_ in data["packages"])

    body = f"""<header>
  <div class="wrap">
    <div class="brand"><span class="dot"></span>BETA WORK · AI Workforce</div>
    <h1>{esc(data['headline'])}</h1>
    <p class="lede">Şirketinizde tekrar eden işleri analiz ediyor, bunları göreve özel AI çalışanlarıyla otomatikleştiriyoruz. Yeni yazılım öğrenmenize gerek yok — AI çalışanları bugün kullandığınız araçların içinde çalışır.</p>
    <!-- TODO: CTA hedefi bağlanmadı. Form, takvim linki veya mailto buraya. -->
    <div class="cta">
      <a class="btn" href="{esc(data['cta']['primary_href'])}">{esc(data['cta']['primary'])}</a>
      <a class="btn btn--ghost" href="{esc(data['cta']['secondary_href'])}">{esc(data['cta']['secondary'])}</a>
    </div>
    <p class="cta__support">{esc(data['cta']['support'])}</p>
  </div>
</header>

<main>
  <section>
    <div class="wrap">
      <p class="section-label">Ekip</p>
      <h2 class="section-title">Üç AI çalışanı</h2>
      <div class="grid">
{roles}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="section-label">24/7</p>
      <h2 class="section-title">Mesai bitince iş durmaz</h2>
      <div class="tiles">
{tiles}
      </div>
    </div>
  </section>

  <section id="nasil-calisir">
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
      <p class="section-label">Kapsam</p>
      <h2 class="section-title">Devralınan {len(data['modules'])} iş alanı</h2>
      <div class="mods">
{mods}
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
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="section-label">Sık sorulanlar</p>
      <h2 class="section-title">Aklınızdaki soru muhtemelen bunlardan biri</h2>
      <div class="qa">
{qa}
      </div>
    </div>
  </section>

  <section id="iletisim">
    <div class="wrap">
      <div class="close">
        <h2>{esc(data['cta']['closing_title'])}</h2>
        <p>{esc(data['cta']['closing_body'])}</p>
        <div class="cta">
          <a class="btn" href="#iletisim">{esc(data['cta']['primary'])}</a>
        </div>
        <p class="cta__support">{esc(data['cta']['closing_note'])}</p>
      </div>
      <p style="margin-top:28px;font-size:15px;color:var(--muted)">
        <a href="index.html">← Tüm BETA ürünleri</a>
      </p>
    </div>
  </section>
</main>"""
    write("work.html", "BETA WORK — AI Workforce",
          data["headline"] + " " + data["promise"], body, data["updated"])



# --- team.html --------------------------------------------------------------

MODE_LABEL = {
    "founder":  ("Kurucu", "core"),
    "core":     ("Çekirdek", "core"),
    "advisor":  ("Danışman", ""),
    "contract": ("Proje bazlı", ""),
    "later":    ("Sonraki dalga", ""),
}


def build_team() -> None:
    data = load("team")
    groups = {g["id"]: g["name"] for g in data["groups"]}

    bar = "\n".join(f"""        <div><b>{esc(g['name'])}</b><span>{esc(g['summary'])}</span></div>"""
                    for g in data["groups"])

    rows = []
    for r in data["roles"]:
        label, cls = MODE_LABEL[r["mode"]]
        tag_cls = f"tag tag--{cls}" if cls else "tag"
        new = ' <span class="tag tag--new">eklendi</span>' if r.get("added") else ""
        rows.append(f"""        <div class="role">
          <span class="role__no">{r['no']}</span>
          <span class="role__name">{esc(r['name'])}<br><span class="role__no">{esc(groups[r['group']])}</span></span>
          <span class="role__body">{esc(r['responsibility'])}<em>{esc(r['note'])}</em></span>
          <span class="{tag_cls}">{esc(label)}{new}</span>
        </div>""")

    waves = "\n".join(f"""        <div class="wave">
          <div class="wave__no">{w['wave']}</div>
          <div>
            <p class="wave__name">{esc(w['name'])}</p>
            <p class="wave__trigger">Tetikleyici: {esc(w['trigger'])}</p>
            <p class="wave__hires">{esc(w['hires'])}</p>
          </div>
        </div>""" for w in data["waves"])

    core = "\n".join(f"      <li>{esc(m)}</li>" for m in data["core_team"]["members"])

    body = f"""<header>
  <div class="wrap">
    <div class="brand"><span class="dot"></span>BETA · Ekip</div>
    <h1>{esc(data['title'])}</h1>
    <p class="lede">{esc(data['principle'])}</p>
  </div>
</header>

<main>
  <section>
    <div class="wrap">
      <p class="section-label">Yapı</p>
      <h2 class="section-title">Yedi fonksiyon</h2>
      <div class="groupbar">
{bar}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="section-label">Roller</p>
      <h2 class="section-title">{len(data['roles'])} rol ve ne zaman gerektiği</h2>
      <div class="roles">
{chr(10).join(rows)}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="section-label">Başlangıç</p>
      <h2 class="section-title">Çekirdek ekip — {esc(data['core_team']['size'])}</h2>
      <ul class="notes">
{core}
      </ul>
    </div>
  </section>

  <section>
    <div class="wrap">
      <p class="section-label">Sıra</p>
      <h2 class="section-title">İşe alım dalgaları</h2>
      <div class="waves">
{waves}
      </div>
      <p style="margin-top:28px;font-size:15px;color:var(--muted)">
        Gerekçe ve açık kararlar: <b>docs/team-and-org.md</b> · <a href="index.html">← Tüm BETA ürünleri</a>
      </p>
    </div>
  </section>
</main>"""
    write("team.html", "BETA — Ürün ve Web Ekibi",
          data["principle"], body, data["updated"])


if __name__ == "__main__":
    build_index()
    build_work()
    build_team()
