# İş Geliştirme İncelemesi — BETA Konsepti

Bu doküman konseptin tamamını (7 kategori, AI Workforce, ödeme altyapısı,
Curiosity Engine, blog hunisi, ekip planı) iş geliştirme gözüyle değerlendirir.
Amaç fikri savunmak değil, **nerede kırılacağını önceden bulmak**.

---

## Özet değerlendirme

**Ürün seçimi doğru, sıralama doğru, ölçek modeli eksik.**

AI Workforce'u ilk ürün yapmak isabetli: gerçek bir acıya satılıyor, peşin
nakit üretiyor, iki taraflı pazar sorunu yok. Ödeme altyapısını baştan merkezi
kurma kararı, çoğu kurucunun iki yıl sonra pişman olduğu şeyi baştan çözüyor.

Ama konsept bugünkü haliyle **bir işletme değil, bir maaş** üretir. Aşağıdaki
aritmetik bunu gösteriyor. Farkı yaratacak tek değişken, kimsenin henüz
ölçmediği bir sayı: **yeniden kullanım oranı.**

---

## 1. Kapasite tavanı — en sert gerçek

Kendi fiyatlarınızla, kurulum başına ortalama 25.000 NOK varsayımıyla:

| Kurulum süresi | Yılda gerçekçi kurulum* | Yıllık gelir |
| --- | --- | --- |
| 1 hafta | 23 | ~575.000 NOK |
| 2 hafta | 12 | ~287.500 NOK |
| 3 hafta | 8 | ~192.000 NOK |

\* 46 çalışma haftası, zamanın %50'si satış ve idari işe gidiyor varsayımıyla.

Playbook'ta kurulum süresi **1-3 hafta** yazıyor. Yani tek kişiyle AI Workforce
yılda 200-575 bin NOK tavanına oturuyor. Norveç'te bu, bir kişinin maaşı ve
vergisinden sonra geriye şirket bırakmayan bir rakam. İkinci kişi eklemek
geliri artırır ama tavanı kaldırmaz — sadece yükseltir.

**Sonuç:** AI Workforce bu haliyle bir ajans. Ajans kötü bir iş değildir, ama
ölçeklenmez ve satılamaz. Ölçek tek bir şeyden gelir:

### Yeniden kullanım oranı — konseptin en önemli sayısı

Her kurulumun ne kadarı bir sonraki müşteride tekrar kullanılabiliyor?

- **%30'un altında** → bu bir danışmanlıktır. Fiyatı saatlik yapın, ölçek
  hayalini bırakın, kâr marjını yönetin.
- **%30-60** → ürünleşebilir ajans. Şablon kütüphanesi kurun, kurulum süresini
  düşürmeyi tek hedef yapın.
- **%60 üzeri** → burada gerçek bir ürün var. Self-servis kurulum yazılabilir
  ve iş modeli SaaS'a döner.

Bu sayı bilinmeden Curiosity Engine'e, blog hunisine veya ikinci ürüne
yatırım yapmak erken. İlk 5 kurulumun tek amacı bu oranı ölçmek olmalı.

---

## 2. Odak sorunu: 7 kategori, 5 farklı iş modeli

Kategoriler bir *marka mimarisi* olarak makul. Ama yol haritası olarak
okunursa beş ayrı şirket demek:

| Ürün | İş modeli | Zorluğu |
| --- | --- | --- |
| BETA WORK | Hizmet / danışmanlık | Zaman yoğun, nakit üretir |
| Curiosity Engine | SaaS | Sürekli mühendislik, yavaş gelir |
| Blog / LEARN / CREATOR | İçerik + bilgi ürünü | 12-24 ay birikim |
| BETA SENIOR (Nærhjelp) | İki taraflı platform | Soğuk başlangıç + regülasyon |
| BETA BUSINESS / CAREER | Hizmet | Farklı müşteri, farklı satış |

Bunların ortak müşterisi yok, ortak satış kanalı yok, ortak teslimat süreci
yok. Ortak olan tek şey marka adı — ve marka, iş modeli farkını kapatmaz.

**Öneri:** kategorileri *marka rezervasyonu* olarak tutun, yol haritası olarak
değil. Aktif geliştirme tek üründe olsun. Diğer altısı web sitesinde "yakında"
bile demesin — boş vaat, ilk müşteri görüşmesinde odaksızlık sinyali verir.

---

## 3. Hizmet–SaaS tuzağı

Plan örtük olarak şu: *AI Workforce nakit üretsin, o nakitle Curiosity Engine
geliştirilsin.* Teoride doğru, pratikte en sık başarısız olan model.

Sebebi basit: hizmet işi **acil**, ürün işi **önemli**. Müşteri arayınca
bugün cevap vermek gerekir; ürün ise bir hafta daha bekleyebilir. Her hafta
böyle geçer ve ürün asla çıkmaz.

**Kural koymadan bu tuzaktan çıkılmaz.** Somut öneri:

- Haftanın belirli günleri ürüne ayrılır ve müşteriye kapalıdır.
- Kurulum kapasitesine **üst sınır** konur (örn. aynı anda en fazla 2 müşteri).
  Sınırın altında kalmak değil, sınırı aşmamak disiplin gerektirir.
- "Ne zaman hizmet almayı bırakırız?" sorusunun cevabı bugünden yazılır
  (örn. tekrar eden gelir aylık X NOK'u geçtiğinde).

---

## 4. GDPR: satışı durduracak somut boşluk

AI Workforce müşterinin e-postasını, müşteri kayıtlarını ve yazışmalarını
işliyor. Bu, BETA'yı GDPR anlamında **veri işleyen (databehandler)** yapar.

Pratik sonucu: her müşteriyle **veri işleme sözleşmesi (databehandleravtale)**
imzalanması gerekir. Ayrıca kullandığınız AI sağlayıcısı **alt işleyen**
konumundadır ve sözleşmede adıyla listelenmelidir.

Bu bir "sonra hallederiz" kalemi değil, **satış blokeridir**: kurumsallaşmış
her Norveç KOBİ'si ilk görüşmede bunu sorar. Sözleşme şablonu hazır değilse
satış orada durur veya güven kaybedersiniz.

Yapılacak: standart bir databehandleravtale şablonu (avukatla), alt işleyen
listesi, veri saklama süresi ve silme taahhüdü. Bunlar aynı zamanda **satış
argümanıdır** — rakiplerin çoğunda yoktur.

---

## 5. "24/7" bir vaat değil, bir yükümlülük

Başlıkta 24/7 var. Müşteri bunu duyduğunda anladığı şey "gece de birileri
ilgilenir"dir.

Gerçek şu: gece 02:00'de AI yanlış bir cevap verirse veya sistem durursa,
1-3 kişilik bir şirket buna müdahale edemez. Bu beklenti yönetilmezse ilk
ciddi olayda güven kaybedilir.

**Öneri:** vaat dilini ayırın.
- *AI çalışanı 24/7 **yanıt verir*** — doğru ve savunulabilir.
- *BETA 24/7 **destek verir*** — yanlış, verilemez.

Sözleşmeye yazılması gereken: yanıt süresi taahhüdü (örn. mesai içi 4 saat),
mesai dışı davranış, olay tanımı ve eskalasyon. Bu netleşmeden "Tam Ekip"
paketi satılmamalı.

---

## 6. Curiosity Engine: fiyatı var, tanımı yok

Dört fiyat kademesi, kredi sistemi ve usage-based modeli konuşuldu; ama
**ürünün ne yaptığı ve kimin neden ödeyeceği** tanımlı değil. Bu sıralama ters.

Özellikle Agency kademesi (14.999 NOK/ay) dikkat gerektiriyor. Aritmetik
cazip görünüyor — 1M NOK/yıl için sadece 6 müşteri. Ama bu fiyat, ajansın
o üründen ayda en az 50-75 bin NOK değer görmesini gerektirir. Trend tarama
ve içerik üretimi tek başına bu değeri taşımaz; taşıyan şey ajansın *kendi
müşterisine faturaladığı* iştir. Yani Agency kademesi ancak white-label
olarak, ajansın gelir kalemine dönüştüğünde anlamlıdır.

**Yapılacak sıra:** kimin hangi işi bıraktığını tanımla → 3-5 kişiyle elle
yap (yazılım olmadan) → paranın gerçekten ödendiğini gör → sonra yaz.

Ve şunu düşünün: Curiosity Engine'i sıfırdan icat etmek yerine, **AI Workforce
kurulumlarında en çok tekrarlanan işi** ürünleştirin. Böylece ürün, müşterisi
kanıtlanmış bir ihtiyaçtan doğar — hipotezden değil.

---

## 7. Blog hunisi: doğru fikir, iyimser takvim

"100.000 okuyucu → newsletter → premium → SaaS" modeli sağlam. Zaman ufku
gerçekçi değil.

Üç uyarı:

1. **Süre.** Sıfırdan anlamlı organik trafiğe 12-24 ay. Gelir planı buna
   dayandırılamaz; blog *ikinci* gelir kanalı olarak planlanmalı.
2. **Rekabet.** "AI ile para kazanma" içeriği internetin en doymuş alanı.
   Ayrışma ancak sizin gerçek kurulum deneyiminizle olur — genel AI tavsiyesiyle
   değil. *"Bir Norveç kuaförüne AI resepsiyonist kurduk, şu oldu"* aramaz ama
   okunur ve satar.
3. **Arama trafiği daralıyor.** Arama motorlarının AI özetleri bilgi amaçlı
   tıklamayı düşürüyor. Newsletter listesi, blog trafiğinden daha değerli —
   dönüşümü ilk günden e-postaya kurun.

Blog Pro aritmetiği de bunu destekliyor: 149 NOK/ay ile 1M NOK/yıl için
**559 ödeyen abone** gerekir. Bu, on binlerce kişilik bir liste demek.
Blog'un işi doğrudan gelir değil, **AI Workforce'a müşteri getirmek** olmalı.

---

## 8. Pazar ve dil: cevaplanmamış temel soru

Ödeme altyapısı NOK ve Vipps; sayfa metinleri Türkçe. Bu iki karar aynı
müşteriyi işaret etmiyor ve **her şeyi etkiliyor**: fiyat, kanal, itiraz
listesi, sözleşme, hatta ürün adı.

Üç seçenek, üçü de meşru ama sonuçları farklı:

| Hedef | Avantaj | Bedeli |
| --- | --- | --- |
| Norveç KOBİ | Ödeme gücü yüksek, rekabet az | Norveççe zorunlu, satış döngüsü uzun, güven kurma yavaş |
| Norveç'teki Türkçe konuşan işletmeler | Güven ve erişim kolay, ilk müşteri hızlı | Pazar küçük, tavanı düşük |
| Global (İngilizce) | Tavan yüksek | Rekabet çok, Vipps anlamsız, MoR kararı öne gelir |

**Öneri:** ilk 5 müşteriyi Türkçe konuşan çevreden alın — güven zaten var,
satış döngüsü kısa, referans hızlı çıkar. Ama **ürünü ve içeriği Norveççe
kurun**, çünkü ölçek oradadır. Türkçe çevre pazar değil, *başlangıç rampasıdır*.

---

## 9. Güçlü yanlar — korunması gerekenler

Eleştiri listesi uzun olduğu için bunları ayrıca yazıyorum; bunlar gerçek
rekabet avantajı:

- **Gözetimli mod ve insana devir kuralları.** AI ürünlerinin en büyük satış
  engeli güvensizlik; siz bunu mimariye gömdünüz. Rakiplerin çoğu "AI her şeyi
  halleder" diyor ve ilk hatada çöküyor.
- **Ödeme altyapısını baştan merkezi kurmak.** Nadir ve doğru. İkinci ürün
  geldiğinde haftalar kazandırır.
- **Ücretli analiz + saat üzerinden ROI çerçevesi.** Bu, danışmanlık satışının
  doğru yapılma biçimi. Ücretsiz analiz veren rakiplerden ayrışır.
- **BETA SENIOR'ın demografik rüzgârı.** Norveç'te yaşlanan nüfus ve dijital
  kamu hizmetleri gerçek bir ihtiyaç yaratıyor. Ama bu **en zor** üründür —
  güven, regülasyon ve iki taraflı pazar. Üçüncü ürün olmalı, birinci değil.

---

## 10. Önerilen sıralama

**Faz 1 — 0-6 ay: sadece AI Workforce**
Hedef 5-10 ödeyen müşteri. Amaç gelir değil, üç sayıyı ölçmek: yeniden
kullanım oranı, gerçek kurulum saati, bakım geliri. GDPR sözleşme şablonu
ve SLA bu fazda hazırlanır. Blog haftada bir yazıyla, sadece kurulum
deneyimlerinden beslenerek başlar.

**Faz 2 — 6-12 ay: ürünleştirme**
Faz 1'de en çok tekrarlanan iş self-servis hale getirilir. Curiosity Engine
bu olabilir ya da olmayabilir — kararı veri verir. Tekrar eden gelir hedefi
konur.

**Faz 3 — 12+ ay: ikinci ürün**
Ancak Faz 1 ve 2'de tekrar eden gelir oluştuysa. BETA SENIOR buraya girer;
daha erken girerse regülasyon ve güven yükü diğer her şeyi durdurur.

Diğer kategoriler bu takvimde yer almaz.

---

## 11. İlk 90 günde cevaplanacak sorular

Hepsi ölçülebilir; hiçbiri fikir değil:

1. Bir kurulumun gerçek maliyeti kaç saat? *(Tahmin değil, kayıt tutun.)*
2. İkinci müşteride birincinin ne kadarını tekrar kullandınız? *(Yeniden
   kullanım oranı.)*
3. Aylık bakım için ne kadar ödemeye razılar? *(Fiyatlanmamış destek,
   hizmet şirketlerinin bir numaralı ölüm sebebi.)*
4. Norveçli bir KOBİ'ye satış döngüsü kaç hafta? *(Nakit planı buna bağlı.)*
5. İlk 5 müşteri hangi kanaldan geldi? *(Kurucu çevresi ölçeklenmez; ikinci
   kanal bulunmalı.)*
6. Kaç müşteri veri işleme sözleşmesi sordu? *(Sıfırsa yanlış segmente
   satıyorsunuz demektir.)*

---

## 12. Risk kaydı

| Risk | Etki | Azaltma |
| --- | --- | --- |
| Kurucu darboğazı | Yüksek | Kapasite sınırı, şablonlaştırma, erken teknik ortak |
| AI sağlayıcı maliyeti/politika değişimi | Yüksek | Kredi sisteminde maliyet aktarımı, tek sağlayıcıya bağımlı kalmama |
| Müşteri verisi olayı | Çok yüksek | Yazılı kapsam, minimum erişim, DPA, olay planı |
| "AI çalışan" konumlandırmasına tepki | Orta | Dil: "tekrar eden işi devralır", "insanın yerini alır" değil |
| Ödeme altyapısı fazla mühendislik | Orta | Faz 1'de tek seferlik ödeme yeter; abonelik Faz 2'de |
| Odak dağılması | Çok yüksek | Kategorileri yol haritasından çıkarmak |

---

## 13. Karar noktaları

Bu altı soru cevaplanmadan ilerlemek, yanlış yöne hızlı gitmek olur:

1. Hedef pazar: Norveç KOBİ mi, Türkçe konuşan çevre mi? *(Bkz. §8)*
2. AI Workforce ajans mı, ürün mü olacak — ve yeniden kullanım eşiği kaç? *(§1)*
3. Hizmet işine haftada kaç gün ayrılacak, kapasite sınırı ne? *(§3)*
4. Curiosity Engine icat mı edilecek, kurulumlardan mı doğacak? *(§6)*
5. 24/7 vaadinin sözleşmedeki karşılığı ne? *(§5)*
6. Faz 1'in başarı ölçütü ne — ciro mu, müşteri sayısı mı, yeniden kullanım
   oranı mı? *(Öneri: üçüncüsü.)*
