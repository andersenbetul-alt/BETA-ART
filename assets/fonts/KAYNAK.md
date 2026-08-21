# Inter — kaynak ve lisans kaydı

Kaynak kod denetimi v0.3, R05 maddesi: paket yazı tipini içeriyor ama lisans
metnini, kaynak adresini, sürüm kaydını ve künyesini içermiyordu. Aşağıdaki
bilgiler **dosyanın kendi `name` tablosundan okundu**, dışarıdan getirilmedi.

| Alan | Değer |
|---|---|
| Yazı tipi | Inter |
| Sürüm | `Version 4.001;git-66647c0bb` |
| Telif | Copyright 2016 The Inter Project Authors |
| Proje | https://github.com/rsms/inter |
| Lisans (font kaydına göre) | https://openfontlicense.org |

## Dosyalar — SHA-256 (ilk 16 hane)

| Dosya | Özet | Boyut |
|---|---|---|
| `inter-latin.woff2` | `3100e775e8616cd2` | 48.256 bayt |
| `inter-latin-ext.woff2` | `34b9c504cab7a73e` | 85.068 bayt |
| `inter-cyrillic.woff2` | `71d5ee93cc1e9f1d` | 18.748 bayt |
| `inter-cyrillic-ext.woff2` | `ca157063339ac4ad` | 25.960 bayt |

`inter-latin.woff2` aynı zamanda `scripts/marka-uret.py`'nin wordmark ana
hatlarını çıkardığı dosyadır; yani logo bu sürüme bağlıdır. Sürüm değişirse
wordmark de değişebilir — özet burada bu yüzden kayıtlı.

## Açık madde — kapatılmadan hak paketi kapanmaz

**Lisans metninin kendisi bu depoda yok.** SIL Open Font License, yeniden
dağıtılan yazı tipiyle birlikte lisans metninin de dağıtılmasını şart koşar.
Font kaydı `openfontlicense.org` adresini gösteriyor ama metni buraya
**ezberden yazmıyorum**: yanlış bir lisans metni, eksik lisans metninden daha
kötüdür.

Yapılacak: yukarıdaki proje adresinden `OFL.txt` dosyası indirilip bu klasöre
`OFL.txt` adıyla konacak ve indirildiği sürüm bu tabloya yazılacak. Bu ortamdan
dış ağa çıkılamadığı için indirme yapılamadı.

Aynı gerekçeyle şu da doğrulanmadı: yukarıdaki adreslerin bugün hangi lisans
sürümünü sunduğu. Hak paketi kapanmadan önce elle doğrulanmalı.
