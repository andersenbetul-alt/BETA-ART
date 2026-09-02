---
name: beta-art-brand
description: >
  Beta Art marka portföyünü yönet — QBLOGG, Cobbani ve Naviar marka varlıklarını üret,
  doğrula ve güncelle. "Marka varlıkları", "logo üret", "SVG üret", "brand assets",
  "COBBANI logo", "NAVIAR logo", "QBLOGG favicon", "marka-uret", "kimlik dosyaları",
  "tescil dosyası", "brand kit", "marka güncellemesi" dediğinde bu beceriyi kullan.
  Beta Art bünyesindeki üç markanın tamamı burada belgelidir.
owner: Beta Art
---

# Beta Art marka portföyü

Beta Art üç markanın portföyünü yönetir. Her markanın varlıkları betikten üretilir,
elle çizilmez (CLAUDE.md kural 7a: yeniden üretilebilirlik).

---

## 1. QBLOGG

**Alan:** qblogg.com | **Renk:** Midnight Navy `#082C54`, Electric Aqua `#00D8C2`

### Varlıklar

```
assets/brand/
  qblogg-symbol.svg                # Ana işaret (renkli)
  qblogg-symbol-navy.svg           # Lacivert üretim
  qblogg-symbol-black.svg          # Siyah
  qblogg-symbol-white.svg          # Beyaz (koyu zemin)
  qblogg-symbol-reverse.svg        # Ters (aqua köprü)
  qblogg-lockup-horizontal.svg     # Yatay kilit (açık zemin)
  qblogg-lockup-horizontal-white.svg # Yatay kilit (koyu zemin)
  qblogg-lockup-stacked.svg        # Dikey kilit
  qblogg-lockup-stacked-white.svg  # Dikey kilit (koyu zemin)
  qblogg-icon-app.svg              # Uygulama ikonu (1024×1024 benzeri)
  qblogg-icon-small.svg            # Küçük ikon
  favicon-32.png                   # 32×32 tarayıcı favicon
  apple-touch-icon.png             # 180×180 iOS
  og-image.png                     # 1200×630 sosyal paylaşım
  MANIFEST.md                      # Her dosyanın ölçümleri ve doğrulama
```

### Üretme

```bash
pip install fonttools brotli   # bir kez
python3 scripts/marka-uret.py  # 14 varlığın tamamını üretir
```

### Doğrulama

```bash
npm run marka-dogrula  # belgedeki ölçümleri dosyalardan yeniden ölçer
npm run tescil-testi   # EUIPO zarfı uyumu (JPEG, boyut, DPI, renk modu)
```

### Tescil

Belgeler: `docs/logo-sistemi.md`, `docs/marka-tescili.md`, `docs/marka-testleri.md`
Tescil dosyası üretimi: `node scripts/marka-tescil.mjs`

---

## 2. Cobbani

**Alan:** cobbani.co | **Durum:** Marka tamamlandı, site geliştirme aşamasında

### Renk paleti

| Ad | Hex | Kullanım |
|---|---|---|
| Çam Yeşili | `#12463C` | Ana marka rengi |
| Pirinç | `#9C7F45` | Tittle nokta (şeffaf zemin) |
| Pirinç Açık | `#C6A566` | Tittle nokta (koyu zemin) |
| Mürekkep | `#14181A` | Metin, mono logo |
| Kâğıt | `#F1F3F1` | Açık zemin |

**Yazı tipleri:** Bodoni Moda (başlık/wordmark), Instrument Sans (gövde/UI)

### Varlıklar

```
cobbani/brand/
  cobbani-isaret.svg               # C işareti + tittle (renkli)
  cobbani-isaret-siyah.svg         # Tek renk
  cobbani-isaret-beyaz.svg         # Beyaz (koyu zemin)
  cobbani-logo-yatay.svg           # Yatay kilit (renkli)
  cobbani-logo-yatay-siyah.svg     # Yatay kilit (tek renk)
  cobbani-logo-yatay-beyaz.svg     # Yatay kilit (koyu zemin)
  cobbani-favicon.svg              # Favicon
```

### İşaret sistemi

İki parça:
1. **C işareti** — Bodoni Moda oranlarına yakın geometri, açık C yayı
2. **Tittle nokta** — C'nin sağ açılımına yerleşen pirinç daire; markanın sesi

Yeni varlık üretmek için `cobbani/README.md`'deki geometri kurallarını uygula;
elle path kopyalama yasak.

---

## 3. Naviar

**Durum:** Kimlik sistemi tamamlandı; betikten üretilir

### Renk

| Ad | Hex | Kullanım |
|---|---|---|
| Lacivert | (NAVIAR spec'teki) | Ana marka rengi |
| Altın | (NAVIAR spec'teki) | Aksan, %12-16 görünür alan |

### Varlıklar

```
brand/naviar/master/
  naviar-wordmark.svg
  naviar-wordmark-responsive.svg   # <160px'de −%17 tracking
  naviar-lockup-horizontal.svg
  naviar-lockup-horizontal-reverse.svg
  naviar-icon-app.svg
  naviar-icon-favicon.svg
```

### Üretme

```bash
cd brand/naviar
python3 build.py     # bağımlılık yok; tüm geometri spec'ten hesaplanır
```

Doğrulama tablosu `brand/naviar/README.md`'de — 18 ölçüm kriteri, hepsi geçti.

Kaynak kurallar: `docs/naviar/NAVIAR-LOGO-KARAR.md` (proje bazında kabul kararı).

---

## Genel marka kuralları (Beta Art portföyü için)

1. **Betikten üret, elle çizme** — yeni varlık gerekiyorsa betiği güncelle.
2. **Doğrulama zorunlu** — ürettikten sonra ilgili doğrulama komutunu çalıştır.
3. **Kayıt tut** — yeni varlık için MANIFEST.md veya README'yi güncelle.
4. **Renk modu kontrolü** — OG image ve tescil dosyaları RGB olmalı.
5. **Aqua metinde kullanılmaz** — `#00D8C2` açık zeminde 1,8:1 kontrast; metin için `#0a7d72`.

## Sık işler

```bash
# Tüm QBLOGG varlıklarını yenile
python3 scripts/marka-uret.py && npm run marka-dogrula

# Cobbani'ye yeni varlık ekle
# → cobbani/README.md geometri kurallarını oku
# → cobbani/brand/ altına SVG yaz
# → README'ye ekle

# EUIPO tescil zarfı hazırla
node scripts/marka-tescil.mjs

# Tescil testi
npm run tescil-testi
```
