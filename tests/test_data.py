#!/usr/bin/env python3
"""data/*.json dosyalarinin butunluk testleri.

Calistirma: python3 tests/test_data.py
Basarisizlikta sifirdan farkli kodla cikar.
"""

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

failures = []


def check(cond, msg):
    if not cond:
        failures.append(msg)


def load(name):
    return json.loads((DATA / f"{name}.json").read_text(encoding="utf-8"))


def test_categories():
    d = load("categories")
    cats = d["categories"]
    check(len(cats) == 7, f"kategori sayisi 7 olmali, {len(cats)}")
    slugs, ids = set(), set()
    for c in cats:
        for field in ("id", "slug", "name", "tagline", "icon", "description", "highlights"):
            check(field in c, f"kategori {c.get('id','?')}: '{field}' eksik")
        check(c["slug"] not in slugs, f"tekrar eden slug: {c['slug']}")
        check(c["id"] not in ids, f"tekrar eden id: {c['id']}")
        slugs.add(c["slug"]); ids.add(c["id"])
        check(len(c["highlights"]) >= 3, f"{c['id']}: en az 3 one cikan madde gerekli")


def test_workforce():
    d = load("workforce")
    roles, modules = d["roles"], d["modules"]
    module_ids = {m["id"] for m in modules}

    check(len(roles) == 3, f"rol sayisi 3 olmali, {len(roles)}")
    check(len(modules) == 7, f"is alani sayisi 7 olmali, {len(modules)}")

    # her rolun referans verdigi is alani gercekten var mi
    covered = set()
    for r in roles:
        for field in ("id", "name", "tr", "icon", "promise", "role", "does",
                      "night", "modules", "integrations", "kpi", "handoff", "setup"):
            check(field in r, f"rol {r.get('id','?')}: '{field}' eksik")
        for m in r["modules"]:
            check(m in module_ids, f"rol {r['id']}: bilinmeyen is alani '{m}'")
            covered.add(m)

    # kapsanmayan is alani kalmamali
    orphans = module_ids - covered
    check(not orphans, f"hicbir role baglanmayan is alani: {sorted(orphans)}")

    # paketlerdeki rol sayisi gercek rol sayisini asmamali
    for p in d["packages"]:
        check(1 <= p["roles"] <= len(roles),
              f"paket {p['id']}: rol sayisi {p['roles']} gecersiz")

    # CTA hedefi bos birakilmamali
    check(d["cta"].get("primary_href"), "CTA birincil hedefi bos")

    # itirazlarin hepsinin cevabi var
    for o in d["objections"]:
        check(o.get("q") and o.get("a"), f"eksik itiraz/cevap: {o}")


def test_team():
    d = load("team")
    group_ids = {g["id"] for g in d["groups"]}
    waves = {w["wave"] for w in d["waves"]}
    modes = {"founder", "core", "advisor", "contract", "later"}

    numbers = set()
    for r in d["roles"]:
        check(r["group"] in group_ids, f"rol {r['no']}: bilinmeyen grup '{r['group']}'")
        check(r["mode"] in modes, f"rol {r['no']}: bilinmeyen mod '{r['mode']}'")
        check(r["wave"] in waves, f"rol {r['no']}: bilinmeyen dalga {r['wave']}")
        check(r["no"] not in numbers, f"tekrar eden rol numarasi: {r['no']}")
        numbers.add(r["no"])

    check(numbers == set(range(1, len(d["roles"]) + 1)),
          "rol numaralari 1..N araliginda kesintisiz olmali")


def test_ux_copy():
    d = load("ux-copy")
    for section in ("buttons", "forms", "errors", "empty_states", "confirmations", "destructive"):
        check(section in d and d[section], f"ux-copy: '{section}' bolumu eksik")
    # yer tutuculu metinlerde suslu parantez dengeli olmali
    def walk(o, path=""):
        if isinstance(o, str):
            check(o.count("{") == o.count("}"), f"ux-copy {path}: dengesiz yer tutucu")
        elif isinstance(o, dict):
            for k, v in o.items():
                walk(v, f"{path}.{k}")
    walk(d)


if __name__ == "__main__":
    for fn in (test_categories, test_workforce, test_team, test_ux_copy):
        try:
            fn()
        except Exception as e:
            failures.append(f"{fn.__name__} istisna: {e!r}")
    if failures:
        print("VERI TESTLERI BASARISIZ:")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    print("veri testleri: OK (4 dosya)")
