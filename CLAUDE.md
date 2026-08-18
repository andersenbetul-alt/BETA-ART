# COBBAN — proje notu

**Norway is complicated. COBBAN makes it simple.**

Norveç'te seyahat aksaklığı yaşayan turiste tek ekranda çözüm veren asistan.
`Problem → COBBAN → DONE`

> **Yön değişikliği (Ağu 2026):** COBBAN önce çok kategorili bir e-ticaret
> markasıydı. Mağaza vitrini `177a485` commit'inde duruyor
> (`git checkout 177a485 -- web/`). `docs/` altındaki şirket kurulum, vergi ve
> yasal metin dokümanları hâlâ geçerli; mağazaya özgü olanlar (06, 07, 08, 09)
> eski konumlandırmayı anlatıyor.

## Depo yapısı

| Yol | İçerik |
|---|---|
| `brand.json` | Marka bilgilerinin tek kaynağı — ad, renk, font, domain, iletişim |
| `brand/` | Logo (SVG) ve `tokens.css` |
| `docs/` | Şirket kurulum, vergi, ihracat, pazarlama dokümanları (Türkçe) |
| `docs/sozlesmeler/` | Yasal metin şablonları (TR / NO / EN) |
| `web/` | Next.js mağaza vitrini |

## Çalışma kuralları

- **Doküman dili Türkçe**, site içeriği üç dilde (`web/lib/i18n.ts` sözlükleri).
- **Yeni metin eklerken üç dile de ekle** — eksik anahtar sessizce Norveççeye düşer.
- **Fiyatlar pazar başına el ile yazılır** (`price: { no, en, tr }`).
  Otomatik kur çevirimi kullanma; `347,83 kr` gibi fiyatlar güven kırar.
- **Fiyatlar vergi dahil gösterilir** — Norveç'te *prisopplysningsforskriften* gereği yasal zorunluluk.
- **Fiyat ve varyant kimliği asla istemciden alınmaz.** `/api/checkout` yalnızca
  slug ve adet kabul eder, geri kalanını sunucudaki katalogdan okur.
- **Rıza olmadan ölçüm betiği yüklenmez.** `cobban:consent` olayını dinle.
- Yasal metinlerdeki `{{...}}` alanları doldurulmadan hiçbir metin yayına alınmaz.

## Doğrulama

```bash
cd web
npm run typecheck     # tsc --noEmit
npm run build         # 42 sayfa üretmeli
```

Değişiklikten sonra en az bunları tarayıcıda dene: anasayfa, ürün detay,
sepet (iki üründe ücretsiz kargo eşiği), dil değiştirici, çerez bandı.

## Bilinen durum

- Shopify mağazası `p8q2mw-ab.myshopify.com` — **trial planında**, adı hâlâ "Min butikk".
- 8 ürün **DRAFT** durumunda; Storefront API yalnızca ACTIVE ürünleri döndürür.
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` yoksa site yerel katalogla çalışır, ödeme kapalıdır.
- GitHub push bu ortamdan 403 veriyor; çıktılar zip/bundle olarak veriliyor.

## Bilgi tazeleme

Vergi oranı, eşik, limit gibi her rakam `docs/12-kaynak-takibi.md`'de tarihiyle
kayıtlı. Bir rakamı kullanmadan veya güncellemeden önce oraya bak; "tekrar bak"
tarihi geçmişse kaynaktan doğrula ve kaydı güncelle. Eski değeri silme.

Sıradaki işler: `docs/11-gelistirme-plani.md`
