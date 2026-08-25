# Karar Kaydı

Verilen kararlar ve gerekçeleri. Bir karar değiştiğinde satır silinmez,
altına yenisi yazılır ve eskisi tarihiyle bırakılır.

---

## K1 · Yayın kapısı kuruldu — 2026-08-25

**Karar:** Site, dışarı açılan bir iletişim yolu olmadan yayına çıkamaz.

**Neden:** İş modeli "ilk 5 müşteri" diyor; site bugün o beşi karşılayamaz.
Birincil CTA kendi bulunduğu bölüme gidiyordu — tıklanınca hiçbir şey
olmuyordu. Metin kontrolü bunu göremez (bağlantı var, hedef var); ancak
tarayıcıda çalıştırınca çıktı.

**Uygulama:**
- `data/workforce.json` → `contact` bloğu (booking_url · email · phone)
- `build.py` → `cta_href()` hedefi bu bloktan çözer; boşsa **stderr'e uyarır**
- `tests/test_deploy_ready.py` → yayın öncesi kapı; bugün çıkış kodu **1**

**Kapı bugün kapalı** ve kapalı olması doğru. Açılması için `contact`
doldurulmalı. İki yönde de doğrulandı: boşken düşüyor, doluyken geçiyor.

**Neden varsayılan test süitine koymadım:** sürekli düşen bir test öğrenilmiş
körlük yaratır. Kapı ayrı çalışır, yalnızca yayın öncesi.

---

## K2 · Ana sayfadan iletişim beklenmiyor — 2026-08-25

**Karar:** Dışarı açılan bağlantı yalnızca `work.html`'de aranır.
`index.html` yönlendirme sayfasıdır; işi satış sayfasına götürmektir.

**Neden:** İlk kural her sayfada mailto arıyordu. Bu yanlış kuraldı — ana
sayfanın dönüşüm görevi yok, rota görevi var. Kapı ona göre düzeltildi.

---

## K3 · Aktif geliştirme tek üründe — teyit

**Karar:** Yedi kategoriden yalnızca BETA WORK aktif. Diğer altısı marka
rezervasyonu; yol haritasında yer almıyor. LEARN içeriği (AI Fluency çalışma
kâğıdı) **ayrı ürün değil**, AI Workforce hunisine besleme.

**Neden:** `business-review.md §2` — ortak müşteri, kanal ve teslimat süreci
yok. `business-model.md §5` — ikinci ürüne geçiş eşiği tekrar eden gelirin
oluşması.

---

## Bana ait olmayan kararlar

Bunları CEO sıfatıyla da vermem; veri veya yetki bende değil.

| Karar | Neden bende değil | Kimde |
| --- | --- | --- |
| İletişim adresi / rezervasyon bağlantısı | Var olmayan bir adres uyduramam | Sahip |
| Fiyat rakamları | Segment kararına bağlı, ölçüm yok | Sahip |
| Hedef pazar ve dil (NO / TR) | Ticari karar; ölçüm değil tercih | Sahip |
| Yasal eşikler (feriepenger, OTP, prøvetid, KDV) | Birincil kaynak erişilemez, doğrulanmamış eşik yazmam | Hukuk / muhasebe |
| Para harcama, sözleşme imzalama | Yetki devri yok | Sahip |

**Öneri (karar değil):** `business-review.md §8` — ilk 5 müşteri Türkçe
konuşan çevreden, ürün ve içerik Norveççe kurulsun. Türkçe çevre pazar değil,
başlangıç rampası. Bu öneriyi onaylarsan karar olarak buraya yazarım.
