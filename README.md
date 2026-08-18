# BETA

BETA ürün ailesinin kategorileri ve ilk ürün olan **AI Workforce**'un
tanımı, satış sayfası ve kurulum playbook'u.

## Ürün kategorileri

| Kategori | Odak |
| --- | --- |
| **BETA WORK** | AI çalışanları — *ilk ürün* |
| BETA BUSINESS | şirket kurma |
| BETA CAREER | yeni kariyer |
| BETA LEARN | AI eğitimi |
| BETA CREATOR | içerik ve kişisel marka |
| BETA SENIOR | yaşlılara dijital destek |
| BETA LIFE | kişisel AI |

## İlk ürün: AI Workforce

> "Şirketinizde tekrar eden işleri analiz ediyoruz ve bunları AI çalışanlarıyla
> otomatikleştiriyoruz."

Küçük işletmeye kurulan yedi AI çalışanı: Email, Customer Service, Sales,
Research, Content, Meeting ve Admin Agent. Beş adımlı akış — analiz, seçim,
kurulum, devreye alma, ölçüm — ile teslim edilir.

- Satış sayfası: `work.html`
- Ürün tanımı: `data/workforce.json`
- Kurulum ve satış playbook'u: [`docs/ai-workforce-playbook.md`](docs/ai-workforce-playbook.md)

## Yapı

```
data/categories.json            Kategorilerin tek kaynağı
data/workforce.json             AI Workforce ürün tanımı (ajanlar, süreç, paketler)
docs/ai-workforce-playbook.md   Satış akışı, analiz şablonu, kurulum kontrol listesi
build.py                        JSON'lardan index.html ve work.html üretir
index.html                      Kategori sayfası (üretilen)
work.html                       AI Workforce sayfası (üretilen)
```

## Kullanım

İçerikleri `data/` altındaki JSON dosyalarında düzenleyin, ardından sayfaları
yeniden üretin:

```bash
python3 build.py
```

Sayfalar tek dosyadır, harici bağımlılığı yoktur ve doğrudan tarayıcıda
açılabilir. Duyarlıdır; açık/koyu temayı işletim sistemi tercihine göre uygular.
