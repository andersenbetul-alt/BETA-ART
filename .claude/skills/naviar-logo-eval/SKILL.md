---
name: naviar-logo-eval
description: NAVIAR logo çalışmalarını Patentstyret ve EUIPO tescil standartlarına göre değerlendir — "logo değerlendir", "hangi logo tescil edilir", "ayırt edicilik analizi", "tescil analizi yap", "naviar logo seç", "trademark eval", "hangi tasarım daha güçlü" istendiğinde bu beceriyi kullan. Her study için 250px görünüm, ayırt edicilik ve format uyumluluğu denetlenir.
---

# NAVIAR logo değerlendirme — Patentstyret & EUIPO standartları

Bu skill, `brand/naviar/studies/` altındaki SVG çalışmalarını tescil standartlarına
karşı değerlendirir. Standartlar `docs/marka-tescili.md` ve
`docs/naviar/LOGO-SKILLS-CLEARANCE-STACK-v1.0.md` kaynaklıdır.

> **Uydurma yasak.** Marka müsaitliği ve tescil edilebilirlik hakkında
> doğrulanmamış hiçbir şey yazılmaz. Kurum siteleri bu ortamda engeli;
> kriterler Firecrawl aracılığıyla derlendi ve `docs/marka-tescili.md`'de
> kaynaklıyla kayıtlıdır.

## Değerlendirme akışı

### 1. SVG'leri listele

```bash
ls brand/naviar/studies/*.svg | sort
```

### 2. Her study için kontrol listesi

Her study SVG'si için şu soruları yanıtla:

**A — Ayırt edicilik (en kritik kriter)**

| Soru | Kriter |
|---|---|
| Sırf harf mi? | Tek harf + standart yazı tipi → tescil riski yüksek |
| Geometrik işleme var mı? | İki renkli, kesişim, özgün form → daha güçlü |
| Renk kombinasyonu özgün mu? | Yalnızca siyah-beyaz → zayıf; Navy+Gold → güçlü |
| Küçük boyutta okunuyor mu? | 250×250px görünümde harf/form ayırt edilebiliyor mu? |

**B — Format uyumluluğu (EUIPO/Patentstyret)**

| Kriter | Değer |
|---|---|
| Dosya formatı | JPEG (SVG'den dönüştürülür) |
| Maks. boyut | 2835×2010 px |
| DPI | 96–300 |
| Renk modu | RGB, Gri, S-B veya CMYK |
| Dosya boyutu | ≤ 2 MB |
| Sicilde görünür boyut | 250×250 px — bu boyutta net okunmalı |

**C — Patentstyret özgün gereklilikleri**
- Mutlak ve göreli gerekçeleri re'sen inceler (EUIPO'dan daha katı)
- Yüksek ayırt edicilik eşiği — salt geometrik şekil + harf yetmeyebilir
- Aranan sektörde benzer işaret yoksa geçer: sicil araması gerekli
  (`search.patentstyret.no` — kullanıcı tarayıcısında yapılır)

### 3. Hızlı 250px smoke test (Playwright ile)

```bash
node --input-type=module << 'EOF'
import { createRequire } from 'module';
const req = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = req('playwright');
import { mkdirSync } from 'fs';
mkdirSync('/tmp/naviar-250', { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const studies = ['study-s1-n-axis-core','study-s2-n-axis-flow','study-s3-n-orbit',
  'study-s4-n-ascend','study-s5-n-shield','study-s6-n-unity',
  'study-s7-nc-monogram','study-s8-n-consult-super','study-s9-n-edge','study-s10-n-monolith'];
for (const s of studies) {
  const p = await b.newPage({ viewport:{width:250,height:250} });
  await p.goto(`file:///home/user/BETA-ART/brand/naviar/studies/${s}.svg`);
  await p.screenshot({ path:`/tmp/naviar-250/${s}.png` });
  await p.close();
  console.log('250px:', s);
}
await b.close();
console.log('Görüntüler: /tmp/naviar-250/');
EOF
```

### 4. Değerlendirme tablosu şablonu

Değerlendirme sonucunu bu biçimde yaz:

```markdown
## NAVIAR Logo Değerlendirme — [Tarih]

| Study | Konsept | Ayırt Edicilik | 250px | Format | Notlar |
|---|---|---|---|---|---|
| S1 | N-AXIS CORE | ⭐⭐⭐⭐⭐ | ✅ | ✅ | İki renkli diagonal — en güçlü aday |
| S2 | N-AXIS FLOW | ⭐⭐⭐⭐ | ✅ | ✅ | Gold sweeping daha agresif |
| ... | | | | | |

**Öneri:** S1 veya S8 — clearance stack'i başlatmadan finalist ilan edilemez.
```

### 5. Clearance stack (finalist seçimi öncesi zorunlu)

`docs/naviar/LOGO-SKILLS-CLEARANCE-STACK-v1.0.md` dosyasını oku.
Her gate tamamlanmadan hiçbir study `FINAL` veya `TESCİLE HAZIR` etiketiyle işaretlenemez.
Mevcut durum: tüm çalışmalar `PENDING`.

## Kurallar

- `EUIPO zarf dışı` veya `Patentstyret kesin reddedilir` gibi sonuç bildirme — doğrulanamaz
- `docs/marka-tescili.md`'deki kriterleri kurum şartı gibi değil, araştırma notu olarak sun
- Sicil araması kullanıcı tarayıcısında yapılır (`search.patentstyret.no`, `tmview.org`)
- Renk tescili: S1'deki Navy+Gold kombinasyonu ayrı başvuruya konu olabilir ama bu skill karar vermez

## Referanslar

- `docs/marka-tescili.md` — EUIPO ve Patentstyret standartları (Firecrawl derlemesi)
- `docs/naviar/LOGO-SKILLS-CLEARANCE-STACK-v1.0.md` — Clearance stack kapıları
- `brand/naviar/studies/` — 10 SVG çalışması (S1–S10)
- `brand/naviar/index.html` — Contact sheet (tümü bir arada görüntüle)
