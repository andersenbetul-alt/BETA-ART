# İş Modeli

Bu doküman fikir üretmez. Repoda hâlihazırda karar verilmiş olan şeylerden
(ürün tanımı, paketler, ödeme mimarisi, iş geliştirme incelemesi) **iş
modelini çıkarır** ve modelin nerede tıkandığını sayıyla gösterir.

Kaynaklar: `docs/ai-workforce-playbook.md` · `docs/payment-architecture.md` ·
`docs/business-review.md` · `data/workforce.json`

---

## 1. Tek cümle

> Norveç'teki küçük işletmelerin tekrar eden ön ofis işini analiz edip
> AI çalışanlarına devrediyoruz; **kurulumu bir kez**, **bakımı aylık**
> faturalandırıyoruz.

Satılan şey yazılım değil, **geri kazanılan saat**. Playbook bunu açıkça
söylüyor: teklif rakamla değil, "ayda 40 saat geri kazandırıyoruz, maliyeti
şu" karşılaştırmasıyla sunulur.

---

## 2. Model haritası

| Bileşen | Bugünkü karar | Kaynak |
| --- | --- | --- |
| **Müşteri** | 1-20 kişilik Norveç KOBİ'si; telefon/mesaj darboğazı olan | playbook |
| **Sorun** | Cevapsız kalan temas = kaybedilen gelir | workforce.json |
| **Çözüm** | 3 rol: Receptionist, Sales Assistant, Office Assistant | workforce.json |
| **Paketleme** | Başlangıç (1 rol) · Çekirdek (2) · Tam Ekip (3) | workforce.json |
| **Gelir** | Kurulum (tek seferlik) + aylık bakım (tekrar eden) | playbook §8 |
| **Kanal** | Kurucu çevresi → referans → içerik | review §7, §8 |
| **Ana maliyet** | Kurucunun saati | review §1 |
| **Değişken maliyet** | AI sağlayıcı kullanımı | review §12 |
| **Tahsilat** | Vipps + Stripe + fatura, merkezî ödeme altyapısı | payment-architecture |

---

## 3. Gelir modeli — üç kalem, üçü de altyapıda hazır

Ödeme mimarisi zaten üç modu destekliyor. İş modeli bunları faza yayar:

| Kalem | Tip | Faz | Şemadaki karşılığı |
| --- | --- | --- | --- |
| Analiz raporu | Tek seferlik | 1 | `order` + `payment` |
| Kurulum | Tek seferlik | 1 | `order` + `payment` |
| Aylık bakım | Abonelik | 1-2 | `subscription` + `entitlement` |
| Kullanım aşımı | Kullanım bazlı | 2 | `credit_grant` + `credit_consumption` |

Bu, altyapının iş modelinin önünde olduğu ender bir durum: **abonelik ve kredi
kodu yazılmayı değil, satılmayı bekliyor.** Faz 1'de yalnızca tek seferlik
ödeme kullanılacak (bkz. review §12 risk kaydı: "ödeme altyapısı fazla
mühendislik").

Fiyat rakamları bilinçli olarak hiçbir dokümanda tutulmuyor — segment kararı
verilmeden fiyat yazmak, kararı fiyata teslim etmek olur.

---

## 4. Birim ekonomi — modelin sert tarafı

### 4.1 Kurulum kapasitesi bir tavandır

Kurulum başına ortalama 25.000 NOK varsayımıyla (review §1):

| Kurulum süresi | Yılda kurulum | Yıllık gelir |
| --- | --- | --- |
| 1 hafta | 23 | ~575.000 NOK |
| 2 hafta | 12 | ~287.500 NOK |
| 3 hafta | 8 | ~192.000 NOK |

Tek kişiyle tavan burası. İkinci kişi tavanı **yükseltir, kaldırmaz.**

### 4.2 Bakım da bir tavandır — bu daha az fark ediliyor

Aynı varsayımdan türetiliyor: 46 çalışma haftası, zamanın %50'si satış ve
idari işe gidiyor → yılda **~920 saat** üretken kapasite.

Her yeni müşteri, kurulumdan sonra bu bütçeden **kalıcı** bir pay alır.
Kurulum yapmaya devam edebilmek için kapasitenin yarısını (460 saat) boş
tutmak gerekirse:

| Müşteri başına bakım | Yılda saat | Taşınabilecek müşteri |
| --- | --- | --- |
| Ayda 2 saat | 24 | ~19 |
| Ayda 4 saat | 48 | ~9 |
| Ayda 8 saat | 96 | ~4 |

Ayda 8 saat bakım gerektiren bir hizmette iş, **dört müşteride durur.** Yeni
müşteri almak eskisinin bakımını yemeye başlar. Ajans yürüyen bandı tam olarak
budur.

**Sonuç:** tekrar eden gelir tek başına kurtarmıyor. Kurtaran şey, bakımın
saat tüketmeyen hâle gelmesi — izleme, raporlama ve iyileştirmenin
otomatikleşmesi. Aylık rapor (playbook §9) bu yüzden ürünleştirilecek ilk
adaydır: her müşteride tekrar eden, elle yapıldığında saat yiyen iş.

### 4.3 Modeli belirleyen tek sayı: yeniden kullanım oranı

Her kurulumun ne kadarı bir sonraki müşteride tekrar kullanılabiliyor?

| Oran | Bu ne demek | Doğru davranış |
| --- | --- | --- |
| **< %30** | Danışmanlık | Saatlik fiyatla, ölçek hedefini bırak, marjı yönet |
| **%30-60** | Ürünleşebilir ajans | Şablon kütüphanesi, tek hedef kurulum süresini düşürmek |
| **> %60** | Gerçek ürün | Self-servis kurulum yazılabilir, model SaaS'a döner |

Bu sayı ölçülmeden hangi işte olunduğu bilinmiyor. İlk 5 kurulumun tek amacı
onu ölçmek olmalı.

---

## 5. Model üç aşamada değişir

Bunlar takvim değil, **eşik**. Bir sonrakine ancak eşik geçilince geçilir.

```
Ajans                    Ürünleşmiş ajans              Ürün
kurulum + elle bakım  →  şablon + otomatik rapor  →   self-servis kurulum
tavan: ~575k NOK         tavan: kişi başı yüksek      tavan: müşteri sayısı
                                                       (kapasite değil)
```

| Geçiş | Eşik |
| --- | --- |
| Ajans → Ürünleşmiş ajans | Yeniden kullanım oranı %30'u geçti **ve** aylık rapor otomatik |
| Ürünleşmiş ajans → Ürün | Yeniden kullanım %60'ı geçti **ve** tekrar eden gelir sabit giderleri karşılıyor |

İkinci ürüne (BETA SENIOR vb.) geçiş için ölçüt aynı: **tekrar eden gelir
oluşmadan yeni ürün açılmaz.** Aksi hâlde iki yarım iş olur.

---

## 6. Modelin dışında bırakılanlar

Kalan altı kategori (BUSINESS, CAREER, LEARN, CREATOR, SENIOR, LIFE) bu iş
modelinde **yok**. Marka rezervasyonu olarak tutuluyorlar; yol haritası
değiller. Gerekçe review §2'de: ortak müşteri, ortak kanal, ortak teslimat
süreci yok — ortak olan tek şey marka adı ve marka, iş modeli farkını
kapatmaz.

Blog da doğrudan gelir kalemi değil. Görevi **AI Workforce'a müşteri
getirmek** (review §7). 149 NOK/ay ile 1M NOK/yıl için 559 ödeyen abone
gerekiyor; bu, on binlerce kişilik bir liste demek ve 12-24 ay sürer.

---

## 7. Modeli çalıştıran üç şart

Bunlar özellik değil, **satış önkoşulu**:

1. **Veri işleme sözleşmesi (databehandleravtale).** AI Workforce müşterinin
   yazışmalarını işliyor → BETA veri işleyen konumunda. Şablon hazır değilse
   kurumsallaşmış her KOBİ'de satış orada durur. (review §4)
2. **SLA'nın 24/7 vaadiyle uyumu.** "AI çalışanı 24/7 yanıt verir" savunulabilir;
   "BETA 24/7 destek verir" verilemez. Sözleşmede yanıt süresi, mesai dışı
   davranış ve eskalasyon yazılı olmalı. (review §5)
3. **Kapasite sınırı.** Aynı anda en fazla 2 kurulum. Sınırın altında kalmak
   değil, **sınırı aşmamak** disiplin gerektirir. (review §3)

---

## 8. Modelin bilinmeyenleri

Model bu üç sayı ölçülene kadar hipotezdir:

| Bilinmeyen | Nasıl ölçülür | Neyi belirler |
| --- | --- | --- |
| Yeniden kullanım oranı | 2. kurulumda 1.'den ne kullanıldı | Ajans mı ürün mü |
| Gerçek kurulum saati | Kayıt tut, tahmin etme | Kapasite tavanı |
| Bakım için ödenen tutar | Sor ve fiyatla | Tekrar eden gelirin varlığı |

Ve iki karar, ölçümden önce verilmeli:

- **Hedef pazar.** Ödeme altyapısı NOK+Vipps, sayfa metinleri Türkçe. İkisi
  aynı müşteriyi işaret etmiyor. Öneri (review §8): ilk 5 müşteri Türkçe
  konuşan çevreden — güven hazır, döngü kısa — ama ürün ve içerik Norveççe
  kurulsun. Türkçe çevre pazar değil, **başlangıç rampası.**
- **Faz 1'in başarı ölçütü.** Ciro değil, müşteri sayısı değil: **yeniden
  kullanım oranı.**
