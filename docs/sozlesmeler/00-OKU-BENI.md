# Sözleşme ve Yasal Metin Şablonları

> ⚠️ **Bunlar şablondur, hukuki görüş değildir.** Yayına almadan önce bir avukata
> okut. `{{...}}` ile işaretli yerleri doldur.

| Dosya | Nerede kullanılır |
|---|---|
| `TR-on-bilgilendirme-formu.md` | TR checkout — sipariş öncesi onay |
| `TR-mesafeli-satis-sozlesmesi.md` | TR checkout — sipariş öncesi onay |
| `TR-iade-ve-cayma-politikasi.md` | Site footer + Shopify Refund policy |
| `TR-kvkk-aydinlatma-metni.md` | Site footer + form altları |
| `NO-salgsbetingelser.md` | Site footer + Shopify Terms of service |
| `NO-personvernerklaering.md` | Site footer + Shopify Privacy policy |
| `EN-terms-of-sale.md` | Uluslararası market footer |
| `EN-privacy-policy.md` | Uluslararası market footer |
| `cerez-politikasi.md` | Çerez banner'ı "Daha fazla bilgi" bağlantısı |

## Doldurulacak değişkenler

```
{{SIRKET_ADI_TR}}       Örn. Betül Andersen (COBBAN)
{{SIRKET_ADI_NO}}       Örn. COBBAN ANDERSEN
{{ORG_NR}}              Norveç organisasjonsnummer
{{VERGI_NO}}            TR vergi numarası
{{MERSIS}}              TR MERSİS numarası (limited ise)
{{ADRES_TR}}            TR yasal adres
{{ADRES_NO}}            NO yasal adres
{{TELEFON}}             Müşteri hizmetleri telefonu
{{EPOSTA}}              support@cobban.com
{{ETBIS_NO}}            ETBİS kayıt numarası
{{KEP}}                 KEP adresi (varsa)
```
