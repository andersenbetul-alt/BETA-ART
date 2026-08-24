---
name: run-beta-art
description: BETA-ART sitesini kur, uret, tarayicida ac, ekran goruntusu al ve testleri kosur. Kullan — "siteyi calistir", "sayfayi goreyim", "screenshot al", "build et", "testleri kosur", "postgres'i baslat", "run beta-art", "screenshot beta-art" dendiginde. Statik site (Python ile uretiliyor) + PostgreSQL sema/test katmani.
---

# run-beta-art

BETA-ART bir **statik site ureteci** ve bir **PostgreSQL sema katmanindan**
olusur. Sunucu, framework, `node_modules` yoktur.

```
data/*.json  --build.py-->  index.html work.html team.html
             --build_review.py-->  review.html
db/*.sql     --psql-->  sema + RLS + 35 assertion
```

Tarayici tarafi `.claude/skills/run-beta-art/driver.mjs` ile surulur
(Playwright + gomulu statik sunucu). **`chromium-cli` bu konteynerde yok** —
surucu bu yuzden yazildi.

Tum yollar depo kokune (`/home/user/BETA-ART`) goredir.

## Onkosullar

Ek kurulum **gerekmiyor**. Konteynerde hazir olanlar:

- `python3` 3.11 — stdlib disinda bagimlilik yok
- `node` v22, `playwright@1.56.1` **global** (`/opt/node22/lib/node_modules`)
- Chromium `/opt/pw-browsers` (`PLAYWRIGHT_BROWSERS_PATH` ayarli)
- PostgreSQL 16 `/usr/lib/postgresql/16/bin`, veri dizini `/var/tmp/pgdata`

## Calistir (ajan yolu) — once bunu oku

```bash
node .claude/skills/run-beta-art/driver.mjs build   # data/*.json -> *.html
node .claude/skills/run-beta-art/driver.mjs check   # tarayicida dogrula
node .claude/skills/run-beta-art/driver.mjs shot    # 12 ekran goruntusu
node .claude/skills/run-beta-art/driver.mjs all     # build + check + shot
```

`check` tarayicida olcer — metin kontrolunun goremedigi seyler:

| Kontrol | Ne yakalar |
| --- | --- |
| `scrollWidth > innerWidth` | 390px'de yatay tasma |
| kopuk capa | `href="#x"` var, `id="x"` yok |
| **kendine giden capa** | Baglanti, kendisini iceren bolume gidiyor → tiklaninca hicbir sey olmuyor |
| disari acilan eylem | Sayfada tek bir `mailto:`/`tel:`/`https:` yok (UYARI) |

Cikis kodu = hata sayisi. **Bugun `check` 2 ile cikar** — asagidaki bilinen
bulgu yuzunden. Bu surucunun bozuk oldugu anlamina gelmez.

`shot` sunlari yazar → `/tmp/beta-shots/` (`SHOT_DIR` ile degistirilir):
4 sayfa x {desktop-light, desktop-dark, mobile-light} = 12 PNG.
`Read` araciyla PNG'yi **gercekten ac ve bak** — dosyanin var olmasi
sayfanin dogru ciktigi anlamina gelmez.

Elle gezmek icin:

```bash
node .claude/skills/run-beta-art/driver.mjs serve   # http://127.0.0.1:8321/
```

Durdurmak icin desen **kendini eslestirmemeli** (bkz. Gotcha 7):

```bash
pkill -f 'driver[.]mjs ser''ve'
```

## Testler

```bash
su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/pgdata \
  -l /var/tmp/pg.log -o '-k /var/tmp -p 55432 -c listen_addresses=' -w start"
pg_isready -h /var/tmp -p 55432     # "accepting connections" bekle
./run-tests.sh                       # 7 adim, tek cikis kodu
```

Beklenen son satir: `TÜM TESTLER GEÇTİ`, cikis kodu 0.

## Gotchas — hepsi bu konteynerde yasandi

**1. Bayat `postmaster.pid` testleri sessizce atlatir.** Konteyner postgres
surecini geri aldiginda pid dosyasi kalir. `pg_ctl start` soyle der:

```
FATAL: lock file "postmaster.pid" already exists
HINT:  Is another postmaster (PID 11731) running ...
```

Ama `run-tests.sh` yine de **cikis kodu 0** verir — SQL adimlarini
`ATLANDI (PostgreSQL yok)` diye gecer. Once surecin gercekten olu oldugunu
dogrula, sonra sil:

```bash
PIDF=/var/tmp/pgdata/postmaster.pid
P=$(head -1 "$PIDF"); ps -p "$P" >/dev/null 2>&1 \
  && echo "CANLI (pid $P) — silme" \
  || { echo "bayat (pid $P olu)"; rm -f "$PIDF"; }
```

`ps aux | grep postgres` ile kontrol etme: kabuk komut satirinin kendisi
"postgres" kelimesini icerdigi icin surec yokken bile eslesir. Bu sekilde
iki kez yanlis okundu. Pid dosyasindaki numarayi `ps -p` ile sor.

Ayni tuzagin daha kotu hali: `pkill -f "postgres.*pgdata"` deseni **kendi
kabugunu** de eslestirir ve komutu calistiran shell'i oldurur — cikti
gormeden exit 1 alirsin.

**2. `ATLANDI` gecmis demek degil.** `run-tests.sh` PostgreSQL yoksa iki SQL
adimini atlar ve yine "TÜM TESTLER GEÇTİ" yazar. Son satiri degil, **yedi
satirin hepsini** oku.

**3. Uretilen HTML elle duzenlenmez.** `index.html`, `work.html`,
`team.html`, `review.html` ciktidir. Elle degistirilirse bir sonraki
`build.py` ezer ve `surukleme kontrolu` adimi testi dusurur. Degisiklik
`data/*.json` veya `build*.py` icinde yapilir.

**4. `import 'playwright'` calismaz.** Depoda `node_modules` yok; playwright
global. Surucu `createRequire` ile mutlak yoldan cozer:
`/opt/node22/lib/node_modules/playwright`.

**5. `chromium-cli` yok.** Web projelerinin alisildik surucusu bu
konteynerde kurulu degil (`command -v chromium-cli` bos doner). Playwright
+ `driver.mjs` bunun yerini alir.

**6. Metin kontrolu kendine giden capayi goremez.** `work.html` icindeki
birincil CTA gecerli bir `<a href="#iletisim">` — ama `<section
id="iletisim">` bolumunun **icinde**. Grep "baglanti var, hedef var" der ve
gecer; tarayicida tiklaninca sayfa kendi bulundugu yere kayar. Bu, `check`
komutunun bugun 2 ile cikmasinin sebebi ve **gercek bir kusur**: sitede
disari acilan tek bir iletisim yolu yok (4 sayfada da `mailto:`/`tel:` yok).
Duzeltmek icin bir e-posta veya rezervasyon baglantisi karari gerekiyor;
karar verilince `data/workforce.json` icindeki `cta` guncellenir ve
`build.py` yeniden kosulur.

**7. `pkill -f` / `grep` desenleri kendi kabuklarini eslestirir.** Bu
oturumda uc kez oldu. `pkill -f "postgres.*pgdata"` komutu calistiran
shell'i oldurdu — cikti yok, exit 1. Deseni kir (`driver[.]mjs`) veya
`ps -p <pid>` kullan.

## Sorun giderme

| Belirti | Sebep | Cozum |
| --- | --- | --- |
| `pg_ctl: could not start server` + log'da `lock file ... already exists` | Bayat pid dosyasi | Gotcha 1 |
| `sql (14 kontrol)  ATLANDI (PostgreSQL yok)` | Sunucu ayakta degil | Testler bolumundeki `pg_ctl` satiri |
| `surukleme kontrolu  BASARISIZ` | Uretilen HTML commit edilenden farkli | `python3 build.py && python3 build_review.py`, sonra commit |
| `Cannot find module 'playwright'` | Yerel `node_modules` yok | Surucuyu kullan; ciplak `import` deneme |
| `check` 2 ile cikiyor | Bilinen kusur | Gotcha 6 |
| `serve` sonrasi `curl` HTTP 000 | Baglanti yok — sunucu surecinin olmus olmasi | Surucuyu arka plana at, 2sn bekle; 000 bos sayfa DEGIL |
| `pkill`/`grep` sonrasi ciktisiz exit 1 | Desen kendi kabugunu eslestirdi | Gotcha 7 |
