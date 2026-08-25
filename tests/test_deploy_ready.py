#!/usr/bin/env python3
"""Yayin kapisi. Varsayilan suitte KOSMAZ — deploy oncesi ayrica calistirilir.

    python3 tests/test_deploy_ready.py

Amaci tek: sitenin disari acilan bir iletisim yolu olmadan yayina cikmasini
engellemek. Bugun DUSER ve dusmesi dogrudur — data/workforce.json icindeki
contact blogu bos.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ["index.html", "work.html"]          # yayina cikan sayfalar
fail = []


def check_contact_configured() -> None:
    c = json.loads((ROOT / "data" / "workforce.json").read_text()).get("contact", {})
    if not any(c.get(k) for k in ("booking_url", "email", "phone")):
        fail.append(
            "iletisim bilgisi bos: data/workforce.json -> contact "
            "(booking_url, email veya phone'dan biri doldurulmali)"
        )


def check_outbound_path() -> None:
    """Satis sayfasi disari acilmali. Ana sayfa yonlendirme sayfasidir —
    ondan mailto beklemek yanlis kural olur; onun isi work.html'e gotmek."""
    html = (ROOT / "work.html").read_text()
    hrefs = re.findall(r'href="([^"]+)"', html)
    if not [h for h in hrefs if re.match(r"^(mailto:|tel:|https?:)", h)]:
        fail.append("work.html: disari acilan tek bir baglanti yok (mailto/tel/http)")

    index = (ROOT / "index.html").read_text()
    if 'href="work.html"' not in index:
        fail.append("index.html: satis sayfasina yonlendirmiyor")


def check_no_self_anchor() -> None:
    """Kendine giden capa: hedefi, baglantiyi iceren bolum."""
    for name in PUBLIC:
        html = (ROOT / name).read_text()
        for sec_id, body in re.findall(r'<section id="([^"]+)"(.*?)</section>', html, re.S):
            if f'href="#{sec_id}"' in body:
                fail.append(f"{name}: #{sec_id} kendine giden capa iceriyor")


for fn in (check_contact_configured, check_outbound_path, check_no_self_anchor):
    fn()

if fail:
    print("YAYINA HAZIR DEGIL:")
    for f in fail:
        print("  -", f)
    print("\nDuzeltmek icin: data/workforce.json -> contact doldur, python3 build.py")
    sys.exit(1)
print("yayin kapisi: OK — site yayina hazir")
