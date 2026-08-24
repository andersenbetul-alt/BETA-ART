# Ölçüm tarifleri

`docs/findings.md` içindeki her sayının nereden geldiği. Bulgu bir iddiadır;
tarif onu yeniden üretilebilir yapar. **Tarifsiz sayı eskir ve kimse fark etmez.**

Hepsi `web/` dizininden çalışır. Yanlarındaki değerler `d476546`'da ölçüldü.

---

## Boşluk ölçeği

Yalnızca boşluk özellikleri sayılır. Kaba `grep rem` yükseklik ve genişlikleri de
toplar ve sayıyı şişirir (37 der, doğrusu 26).

```bash
grep -ohE '(margin|padding|gap)[a-z-]*:[^;]+' app/globals.css \
  | grep -ohE '[0-9]*\.?[0-9]+rem' | sort -u | wc -l
```

Son ölçüm: **26 ayrı değer.** Komşu farkları:

```bash
grep -ohE '(margin|padding|gap)[a-z-]*:[^;]+' app/globals.css \
  | grep -ohE '[0-9]*\.?[0-9]+rem' | sort -u | sed 's/rem//' \
  | python3 -c "
import sys
v=sorted(float(x)*16 for x in sys.stdin if x.strip())
print(sum(1 for a,b in zip(v,v[1:]) if b-a<2), 'cift 2px ten yakin')"
```

Son ölçüm: **19 çift**, en küçüğü 0,5px. Kapanma ölçütü: ≤8 değerlik bir ölçek,
2px'ten yakın komşu kalmaması.

## Tipografi ölçeği

```bash
grep -ohE 'font-size:[^;]+' app/globals.css | sed 's/font-size: *//' | sort -u | wc -l
```

Son ölçüm: **11 boyut.** `.85rem` / `.875rem` / `.9rem` gözle ayırt edilemiyor.
Kapanma ölçütü: ≤5 boyut.

## Kontrast (WCAG 2.1)

Metin 4,5:1; iri metin ve bileşen sınırı 3:1.

```bash
python3 -c "
def L(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=.03928 else ((x+.055)/1.055)**2.4 for x in c]
    return .2126*c[0]+.7152*c[1]+.0722*c[2]
def R(a,b):
    l1,l2=sorted([L(a),L(b)],reverse=True); return (l1+.05)/(l2+.05)
print(f'{R(\"#3F5B4C\",\"#171E23\"):.2f}:1')"
```

Son ölçümler: `.pill.live` koyu temada **2,26:1** (kalıyor, açık bulgu) ·
`--done` koyu **5,56:1** · `--cost` koyu **7,09:1**.

Jeton koyu temada yeniden tanımlanmıyorsa açık tema değeriyle ölçme —
`@media (prefers-color-scheme: dark)` bloğundaki gerçek değeri al.

## Dokunma hedefleri

44×44pt (WCAG 2.5.5). `2.75rem` = 44px.

```bash
grep -nE 'min-height:' app/globals.css | grep -vE '2\.75rem|4rem'
```

Son ölçüm: **boş** — eşiğin altında hedef yok.

## İkili varlık

Dağıtım kanalı yalnızca metin taşıyor; depoda ikili dosya kalmamalı.

```bash
find app public -type f \( -name '*.png' -o -name '*.ico' -o -name '*.jpg' \) | wc -l
```

Son ölçüm: **0**.

## Görsel yolları

Derleme anında üretiliyorlar, sunucu ayakta olmalı.

```bash
for p in icon apple-icon opengraph-image twitter-image favicon.ico; do
  printf '%-18s %s\n' "/$p" "$(curl -s -o /dev/null -w '%{http_code} %{content_type}' http://localhost:3111/$p)"
done
```

Son ölçüm: dördü **200 image/png** (512² · 180² · 1200×630 · 1200×675),
`/favicon.ico` **404** — açık bulgu.

## Tarayıcıda doğrulama

Sunulan CSS'in gerçekten çözülüp çözülmediği ancak tarayıcıda görülür.
Jetonu olmayan bir renk sessizce şeffaf kalır; derleme buna hata vermez.

```bash
node -e "
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args:['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto('http://localhost:3111/');
  console.log(await p.evaluate(() => {
    const d = document.createElement('div');
    d.className = 'skeleton'; document.body.appendChild(d);
    const bg = getComputedStyle(d).backgroundColor; d.remove(); return bg;
  }));
  await b.close();
})()"
```

Son ölçüm: `rgb(228, 222, 212)`. `rgba(0, 0, 0, 0)` çıkarsa jeton tanımsız
demektir — `--track` hatası tam olarak böyle görünüyordu.
