# COBBAN — Online Satış İçin Şirket Kurulum Yol Haritası

> **Uyarı:** Bu dokümanlar bilgilendirme amaçlıdır, hukuki veya mali müşavirlik hizmeti değildir.
> Tutarlar, oranlar ve eşikler her yıl değişir. Nihai adımları Norveç'te bir *regnskapsfører*
> (mali müşavir), Türkiye'de bir SMMM/YMM ile teyit et.
> **Son güncelleme:** 2026-08

## Kurulan yapı

COBBAN, **iki ülkeli** bir online satış markası olarak kuruluyor:

| | Norveç | Türkiye |
|---|---|---|
| **Rol** | Satış / faturalama / müşteri ilişkisi | Tedarik / üretim / depolama |
| **Şirket** | Enkeltpersonforetak (başlangıç) → AS (büyüyünce) | Şahıs firması → Limited (büyüyünce) |
| **Vergi** | MVA (KDV) %25, kayıt eşiği 50.000 NOK | KDV %20 / %10, ETBİS kaydı |
| **Para birimi** | NOK | TRY |
| **Ana pazar** | Norveç + AB | Türkiye + ihracat |

Ürün kategorisi sınırlaması yok (çok kategorili mağaza), satış kanalları:
kendi web sitesi + pazaryerleri + sosyal medya + yurt dışı.

## Doküman haritası

| Dosya | İçerik |
|---|---|
| [01-norvec-sirket-kurulum.md](01-norvec-sirket-kurulum.md) | ENK vs AS, Brønnøysund, Altinn, MVA kaydı, banka |
| [02-turkiye-sirket-kurulum.md](02-turkiye-sirket-kurulum.md) | Şahıs vs Limited, ETBİS, e-fatura, ödeme altyapısı |
| [03-iki-ulke-modeli-ve-ihracat.md](03-iki-ulke-modeli-ve-ihracat.md) | Mikro ihracat, ETGB, VOEC, gümrük, KDV iadesi |
| [04-vergi-muhasebe-takvimi.md](04-vergi-muhasebe-takvimi.md) | Aylık/dönemsel beyan takvimi, kayıt tutma |
| [05-marka-kimligi.md](05-marka-kimligi.md) | COBBAN logo, renk, tipografi, ses tonu, marka tescili |
| [06-satis-kanallari.md](06-satis-kanallari.md) | Kendi site, Trendyol/Etsy/Amazon/Finn, sosyal medya |
| [07-fiyatlandirma-ve-birim-ekonomi.md](07-fiyatlandirma-ve-birim-ekonomi.md) | Maliyet tablosu, kâr marjı, kargo, iade oranı |
| [08-shopify-kurulum.md](08-shopify-kurulum.md) | Mevcut "Min butikk" mağazasının COBBAN'a dönüşümü |
| [09-lansman-plani-90-gun.md](09-lansman-plani-90-gun.md) | Hafta hafta lansman planı |
| [10-kontrol-listesi.md](10-kontrol-listesi.md) | Tek sayfalık işaretlemeli kontrol listesi |
| [sozlesmeler/](sozlesmeler/) | Mesafeli satış, KVKK/GDPR, iade, çerez metinleri (TR/NO/EN) |

## Sıralama — hangi işi ne zaman yapmalı

```
HAFTA 1-2   Marka adı + domain + logo        → 05
            Ürün/tedarikçi kararı             → 07
HAFTA 2-4   Norveç ENK kaydı (Brønnøysund)    → 01
            Banka hesabı + Vipps              → 01
HAFTA 3-5   Türkiye şahıs firması + ETBİS     → 02
HAFTA 4-6   Shopify mağazası + web sitesi     → 08, web/
            Yasal metinlerin siteye eklenmesi → sozlesmeler/
HAFTA 6-8   Ödeme + kargo entegrasyonu        → 06, 07
HAFTA 8-10  Pazaryeri mağazaları              → 06
HAFTA 10-12 Lansman + reklam                  → 09
```

## Kritik "önce bunu yap" listesi

1. **Marka adını koru:** COBBAN adını Norveç (Patentstyret) ve Türkiye (TÜRKPATENT) için ayrı ayrı tescil ettir — kurulumdan *önce* benzerlik araştırması yap.
2. **Domain'i al:** `cobban.com` + `cobban.no` (.no için Norveç'te kayıtlı bir organizasyon numarası gerekir — ENK kurulduktan sonra alınabilir).
3. **Şirket kurmadan satış yapma:** Norveç'te düzenli/kâr amaçlı satış "næringsvirksomhet" sayılır ve kayıt zorunludur; Türkiye'de faturasız satış vergi cezası doğurur.
4. **Banka hesabını şirket adına aç:** Kişisel hesabı ticaret için kullanma — muhasebe ayrıştırması zorunlu.
5. **ETBİS kaydını atlama:** Türkiye'den online satış yapacaksan Ticaret Bakanlığı ETBİS kaydı yasal zorunluluk.
