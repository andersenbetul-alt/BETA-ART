# BETA — Ürün Kategorileri

BETA ürün ailesinin yedi kategorisi ve bunları sunan tek sayfalık site.

## Kategoriler

| Kategori | Odak |
| --- | --- |
| BETA WORK | AI çalışanları |
| BETA BUSINESS | şirket kurma |
| BETA CAREER | yeni kariyer |
| BETA LEARN | AI eğitimi |
| BETA CREATOR | içerik ve kişisel marka |
| BETA SENIOR | yaşlılara dijital destek |
| BETA LIFE | kişisel AI |

## Yapı

```
data/categories.json   Kategorilerin tek kaynağı (isim, açıklama, öne çıkanlar)
build.py               JSON'dan index.html üretir
index.html             Üretilen sayfa (tek dosya, harici bağımlılık yok)
```

## Kullanım

Kategori metinlerini `data/categories.json` içinde düzenleyin, ardından sayfayı yeniden üretin:

```bash
python3 build.py
```

`index.html` doğrudan tarayıcıda açılabilir; kurulum veya derleme adımı gerektirmez.
Sayfa duyarlıdır ve açık/koyu temayı işletim sistemi tercihine göre uygular.
