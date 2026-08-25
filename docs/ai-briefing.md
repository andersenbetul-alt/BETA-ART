# BETA — AI Brifing Sayfası

Her yeni AI konuşmasının başına yapıştırılacak bağlam belgesi. Amacı, aynı
şeyleri her seferinde yeniden anlatmamak.

Buradaki her satır depodaki bir kaynaktan geliyor; parantez içinde yeri
yazılı. Tahmin veya doldurma yok — bilinmeyen şey **AÇIK** olarak işaretli.

Güncelleme: karar değiştiğinde. Yıllık gözden geçirme yeterli değil.

---

## 1. Kim olduğumuz

BETA, Norveç'te kurulan bir ürün ailesi. Yedi kategori marka rezervasyonu
olarak tutuluyor; **aktif geliştirme tek üründe:** BETA WORK — AI Workforce.
(`business-review.md §2`)

**Vaat:** Şirketinizde tekrar eden işleri analiz ediyoruz ve bunları AI
çalışanlarıyla otomatikleştiriyoruz. (`workforce.json`)

Sattığımız şey yazılım değil, **geri kazanılan saat**. Teklif rakamla değil,
"ayda 40 saat geri kazandırıyoruz, maliyeti şu" karşılaştırmasıyla sunulur.
(`ai-workforce-playbook.md §8`)

## 2. Ne satıyoruz

Üç AI çalışanı: **AI Receptionist**, **AI Sales Assistant**, **AI Office
Assistant** — müşterinin kendi araçlarının içinde çalışır, yeni yazılım
öğrenmesi gerekmez.

| Paket | Çalışan |
| --- | --- |
| Başlangıç | 1 |
| Çekirdek | 2 |
| Tam Ekip | 3 |

**Süreç:** Analiz (3-5 gün) → Seçim (1-2 gün) → Kurulum (1-3 hafta) →
Devreye alma (2 hafta) → Ölçüm ve bakım (sürekli)

**Gelir iki kalem:** kurulum (tek seferlik) + aylık bakım (tekrar eden).
Fiyat rakamları bilinçli olarak hiçbir dokümanda tutulmuyor — segment kararı
verilmeden fiyat yazmak kararı fiyata teslim etmek olur. (`business-model.md §3`)

## 3. Kime satıyoruz

Telefon ve mesaj darboğazı olan küçük işletmeler. Cevapsız kalan temas =
kaybedilen gelir.

**Pazar kararı AÇIK.** Ödeme altyapısı NOK + Vipps, sayfa metinleri Türkçe;
ikisi aynı müşteriyi işaret etmiyor. Öneri: ilk 5 müşteri Türkçe konuşan
çevreden (güven hazır, döngü kısa), ama ürün ve içerik Norveççe kurulsun.
Türkçe çevre pazar değil, **başlangıç rampası**. (`business-review.md §8`)

## 4. Durumumuz ve rolümüz

**Bugün: kurucu + danışman.** Kurucu Product Manager rolünü taşıyor; Business
Strategist çeyreklik danışman. (`team.json`, dalga 0)

21 rollük bir ekip modeli var ama işe alım takvime değil **tetikleyiciye**
bağlı. Dalga 1 ("inşa edebilir hale gel") ürün fikri doğrulandığında açılır.

**Sert kısıt — kapasite tavanı.** Tek kişiyle AI Workforce yılda 192–575 bin
NOK arasında bir tavana oturuyor. İkinci kişi tavanı yükseltir, kaldırmaz.
(`business-model.md §4.1`)

**Daha az fark edilen ikinci tavan: bakım.** ~920 saat/yıl üretken kapasitenin
yarısı kurulumlara ayrılırsa, müşteri başına ayda 8 saat bakım işi **dört
müşteride durduruyor**. Tekrar eden gelir tek başına kurtarmıyor; bakımın saat
tüketmemesi gerekiyor. (`business-model.md §4.2`)

**Kapasite kuralı:** aynı anda en fazla 2 kurulum. (`business-review.md §3`)

## 5. Asla taviz vermediklerimiz

Bunlar tercih değil, kural. Bir öneri bunlardan birini ihlal ediyorsa yanlış
öneridir.

- **Gözetimli mod önce gelir.** Hiçbir AI çalışanı ilk aşamada tek başına mesaj
  göndermez: hazırlar, insan onaylar. Yetki devri kademelidir; doğruluk
  ölçülmeden otomatik gönderim açılmaz.
- **Kritik kararlar insana devredilir** — ödeme, sözleşme, fiyat taahhüdü,
  şikâyet. Her zaman, istisnasız.
- **Uydurma kanıt yok.** Sahte referans, sahte rakam, sahte sosyal kanıt
  yazılmaz. (`copy-standards.md §6`)
- **"İnsanın yerini alır" demeyiz.** Devralınan şey tekrar eden iştir; insan
  karar gerektiren işe döner.
- **24/7 vaadi ayrılır:** *AI çalışanı 24/7 yanıt verir* savunulabilir;
  *BETA 24/7 destek verir* verilemez. (`business-review.md §5`)
- **Ölçmeden iddia etmeyiz.** "Erişilemedi" ile "sonuç yok" ayrı raporlanır;
  toplu değişiklikten önce eşleşme sayısı okunur. (`CLAUDE.md §5`)

## 6. Bugünkü acılarımız

- **Sitede dışarı açılan tek bir iletişim yolu yok.** Birincil CTA kendi
  bulunduğu bölüme gidiyor; mailto, telefon veya form yok. İlk müşteriyi
  karşılayamayacak durumda.
- **Veri işleme sözleşmesi (databehandleravtale) hazır değil.** AI Workforce
  müşteri yazışmasını işliyor → BETA veri işleyen konumunda. Kurumsallaşmış
  her Norveç KOBİ'si ilk görüşmede soruyor; şablon yoksa satış orada duruyor.
  Bu bir "sonra hallederiz" kalemi değil, **satış blokeri**. (`business-review.md §4`)
- **Görev ayrılığı açığı:** `service_role` hem ödemeyi kaydediyor hem erişimi
  veriyor hem krediyi yüklüyor. (`process-payment-controls.md B1`)
- **Fiyat belirlenmedi**, çünkü segment kararı verilmedi.

## 7. AI'ı kendi işimizde nereye koyuyoruz

Ürünleştirilecek ilk aday **aylık rapor** — her müşteride tekrar eden, elle
yapıldığında saat yiyen iş. Bakım tavanını kaldıracak tek şey bunun
otomatikleşmesi. (`business-model.md §4.2`)

İkinci ürüne (Curiosity Engine vb.) geçiş ölçütü: **kurulumlarda en çok
tekrarlanan işi ürünleştirmek** — sıfırdan icat etmek değil. Böylece ürün
kanıtlanmış bir ihtiyaçtan doğar. (`business-review.md §6`)

## 8. Ölçülmeden bilinmeyen üç sayı

Model bunlar ölçülene kadar hipotez:

| Bilinmeyen | Nasıl ölçülür | Neyi belirler |
| --- | --- | --- |
| Yeniden kullanım oranı | 2. kurulumda 1.'den ne kullanıldı | Ajans mı ürün mü (<%30 danışmanlık, >%60 ürün) |
| Gerçek kurulum saati | Kayıt tut, tahmin etme | Kapasite tavanı |
| Bakım için ödenen tutar | Sor ve fiyatla | Tekrar eden gelirin varlığı |

**Faz 1'in başarı ölçütü ciro değil, müşteri sayısı değil: yeniden kullanım
oranı.**

## 9. Nasıl çalışıldığını bilmek isteyen için

- Üretilen HTML elle düzenlenmez; `data/*.json` değişir, `build.py` yeniden koşar.
- Atlanmış test geçmiş test değildir; ikisi ayrı raporlanır.
- Yeni beceri en pahalı seçenektir: önce CLAUDE.md satırı, sonra mevcut
  beceriyi güncelleme, en son yeni beceri.

---

## Kopyala-yapıştır özeti

Yeni bir konuşmaya bunu yapıştırın:

```
BETA, Norveç'te bir ürün ailesi. Aktif tek ürün: AI Workforce — küçük
işletmelerin tekrar eden ön ofis işini üç AI çalışanına devrediyoruz
(Receptionist, Sales Assistant, Office Assistant). Kurulum tek seferlik,
bakım aylık faturalanıyor. Sattığımız şey yazılım değil, geri kazanılan saat.

Durum: kurucu + çeyreklik danışman. Aynı anda en fazla 2 kurulum kapasitesi.
Tek kişiyle yıllık tavan 192-575 bin NOK. Fiyat henüz belirlenmedi.

Pazar kararı açık: Norveç KOBİ mi, Norveç'teki Türkçe konuşan işletmeler mi.
Ödeme altyapısı NOK+Vipps, sayfa metinleri şu an Türkçe.

Asla taviz vermediklerimiz: AI önce gözetimli modda çalışır (hazırlar, insan
onaylar); ödeme/sözleşme/şikâyet her zaman insana devredilir; uydurma kanıt
veya rakam yazılmaz; "insanın yerini alır" demeyiz; ölçmeden iddia etmeyiz.

Bugünkü en acil eksikler: sitede dışarı açılan iletişim yolu yok, GDPR veri
işleme sözleşmesi şablonu hazır değil, fiyat belirlenmedi.

Ölçülmeyi bekleyen kritik sayı: yeniden kullanım oranı — her kurulumun ne
kadarı bir sonraki müşteride tekrar kullanılabiliyor. Bu sayı bu işin ajans
mı ürün mü olduğunu belirliyor.

Bana öneri verirken bu kısıtları veri kabul et. Bir öneri kapasite tavanını
veya taviz vermediklerimizi ihlal ediyorsa bunu söyle.
```
