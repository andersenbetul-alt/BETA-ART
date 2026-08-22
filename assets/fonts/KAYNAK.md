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
| Lisans metni | `OFL.txt` — SIL Open Font License 1.1, 26 Şubat 2007 |

## Dosyalar — SHA-256 (ilk 16 hane)

| Dosya | Özet | Boyut |
|---|---|---|
| `inter-latin.woff2` | `3100e775e8616cd2` | 48.256 bayt |
| `inter-latin-ext.woff2` | `34b9c504cab7a73e` | 85.068 bayt |
| `inter-cyrillic.woff2` | `71d5ee93cc1e9f1d` | 18.748 bayt |
| `inter-cyrillic-ext.woff2` | `ca157063339ac4ad` | 25.960 bayt |
| `OFL.txt` | `262481e844521b32` | 4.380 bayt |

`inter-latin.woff2` aynı zamanda `scripts/marka-uret.py`'nin wordmark ana
hatlarını çıkardığı dosyadır; yani logo bu sürüme bağlıdır. Sürüm değişirse
wordmark de değişebilir — özet burada bu yüzden kayıtlı.

`npm run marka-dogrula` bu tablodaki her özeti dosyalardan yeniden hesaplar;
bir yazı tipi kayıt güncellenmeden değişirse çıkış kodu 1 verir.

## Lisans metni — R05 kapandı (22.08.2026)

`OFL.txt`, Inter dağıtımının kendi `LICENSE.txt` dosyasıdır; kullanıcı tarafından
sağlandı, ezberden yazılmadı. Doğrulanan noktalar:

- Başlık ve tarih: *SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007*
- Zorunlu bölümlerin tamamı: PREAMBLE, DEFINITIONS, PERMISSION AND CONDITIONS
  (5 madde), TERMINATION, DISCLAIMER
- Telif satırı fontun kendi kaydıyla eşleşiyor: *Copyright (c) 2016 The Inter
  Project Authors (https://github.com/rsms/inter)*

OFL madde 2, yeniden dağıtılan yazı tipiyle **birlikte** telif bildirimi ve
lisansın taşınmasını şart koşar; `assets/fonts/` klasörü artık bu şartı
karşılıyor. Madde 3 (Reserved Font Name) bizi ilgilendirmiyor: fontu
değiştirmiyoruz, adını da kullanmıyoruz.

**Doğrulanmadı:** `openfontlicense.org` ve `scripts.sil.org/OFL` adreslerinin
bugün hangi sürümü sunduğu — bu ortamdan dış ağa çıkılamıyor. Metin, fontun
kendi dağıtımından geldiği için bu artık kapatıcı bir eksik değil.

## Resmi dağıtımın tamamı depoda

`vendor/inter-4.001/` — Inter'in resmi dağıtımı (152 dosya, 60 MB) 22.08.2026'da
depoya kondu. **Site bu dosyaları kullanmıyor**; yükte değişiklik yok, yayına
çıkan hâlâ bu klasördeki dört alt küme. Amaç hak paketi ve soy zinciri
kanıtı. Ayrıntı: `vendor/inter-4.001/KAYNAK.md`.

## Wordmark ana hatlarının kökeni — doğrulandı (22.08.2026)

Soru şuydu: logodaki harfler gerçekten resmi Inter dağıtımından mı geliyor,
yoksa depodaki alt küme yolda değişmiş mi? Resmi dağıtımın `InterVariable.ttf`
dosyası sağlandı ve iki font `wght=700`'de örneklenip **harf harf**
karşılaştırıldı (`Q B L O G`):

| Harf | Kontur | Nokta | Ana hat özeti (her iki fontta) |
|---|---|---|---|
| Q | 3 | 42 | `fba2818c266305a1` |
| B | 3 | 40 | `4ab58bec7987e1bb` |
| L | 1 | 6 | `28baff3ccc41d784` |
| O | 2 | 34 | `1967ffece4728933` |
| G | 1 | 41 | `a1783f5ae653d92a` |

Beş harfin ana hatları, ilerleme ve sol kenar değerleri dahil aynı. Yani
wordmark'ın soy zinciri resmi dağıtıma kadar kesintisiz.

İki fark var, ikisi de sonucu bozmuyor:

- **Yapım kimliği.** Depo alt kümesi `git-66647c0bb`, sağlanan resmi dosya
  `git-9221beed3`. İkisi de `Version 4.001`. Ana hatlar aynı olduğuna göre
  fark bu beş harfi etkilememiş.
- **Optik boyut ekseni.** Resmi `InterVariable.ttf` `opsz` eksenini taşır
  (14–32), depo alt kümesi taşımaz. Eşitlik `opsz=14`'te — eksenin varsayılanı
  ve gövde metni değeri — geçerlidir. `opsz` gerçekten harfleri değiştiriyor;
  aynı beş harf `opsz=14/20/32`'de üç ayrı ana hat verdi. Dolayısıyla depo alt
  kümesi **Inter (metin)** kesitidir, *Inter Display* değil; wordmark de öyle.

Karşılaştırmayı üreten betik: bu kayıt yazılırken tek seferlik çalıştırıldı,
girdisi depo dışındaki bir dosya olduğu için sürekli denetime alınmadı.
Sürekli denetim `marka-dogrula.py` içindeki özet kontrolüyle yapılıyor:
`inter-latin.woff2` kayıt güncellenmeden değişirse denetim kırmızıya döner.
