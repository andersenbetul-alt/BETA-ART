# Metin Standardı — Conversion Copy + UX Writing

Bu doküman BETA sitelerindeki **bütün metinlerin** uyması gereken standardı
tanımlar. "Güzel yazmak" ölçüt değildir; ölçüt ziyaretçinin bir sonraki adımı
atmasıdır.

Rol dağılımı: **Conversion Copywriter** satış sayfalarını, **UX Writer** arayüz
metinlerini yazar. Aynı kişide birleşebilir; standart aynıdır.

---

## 1. Beş yazar rolü ve hangisinin nerede yazdığı

| Rol | Yazdığı yer | Başarı ölçütü |
| --- | --- | --- |
| **Conversion Copywriter** | Ana sayfa, hizmet sayfaları, fiyatlandırma, CTA, güven bölümleri | Dönüşüm oranı |
| **UX Writer** | Buton, form, hata, boş durum, onay, e-posta bildirimi | Görev tamamlama, destek talebi azalması |
| **SEO Content Writer** | Blog, rehber, organik trafik içerikleri | Organik trafik, sıralama |
| **Brand Copywriter** | Marka sesi, slogan, hakkımızda | Tanınırlık, tutarlılık |
| **Technical Writer** | Dokümantasyon, kurulum, API | Anlaşılırlık, destek yükü |

Birinin işini diğerine yaptırmak en sık yapılan hata. SEO yazarına satış
sayfası yazdırılırsa sayfa anahtar kelimeyle dolar ama kimse tıklamaz;
conversion yazarına blog yazdırılırsa her paragraf satışa döner ve okuyucu
kaçar.

---

## 2. Sayfa iskeleti — her satış sayfası bu sırayı izler

```
1. Başlık            Ne kazandığını tek cümlede söyle (özellik değil, sonuç)
2. Alt başlık        Kime, nasıl, hangi kısıtla
3. Birincil CTA      Sayfanın ilk ekranında, tek ve net
4. Risk azaltıcı     "Bağlayıcı değil" · "Ücretsiz" · "İptal edebilirsiniz"
5. Ne veriyoruz      Somut kapsam — liste, tablo, rol
6. Nasıl çalışır     Adımlar; belirsizliği düşürür
7. Kanıt             Sonuç, referans, sayı  ← henüz yoksa boş bırakılır
8. Fiyat / paket     Karşılaştırılabilir, gizlenmemiş
9. İtiraz karşılama  Aklındaki soruyu sen sor, sen cevapla
10. Kapanış CTA      Aynı eylem, farklı cümle
```

Sayfa **anlatıyor ama satmıyorsa** genelde 3, 7, 9 ve 10 eksiktir.

---

## 3. Başlık kuralları

- **Sonuç yaz, özellik değil.** "Yedi AI ajanı" bir özelliktir. "AI çalışanlar
  şirketiniz için 24/7 çalışsın" bir sonuçtur.
- **Somut ol.** "Verimliliğinizi artırın" hiçbir şey söylemez. "Gece 02:00'de
  gelen talep sabah masanızda özetiyle olur" resim çizer.
- **Müşterinin kelimelerini kullan.** Müşteri "otomasyon çözümü" demez;
  "telefona yetişemiyorum" der.
- **Sıfat değil, fiil.** Güçlü metin isim ve sıfat yığınıyla değil fiille kurulur.

**Yasak kalıplar:** "sektörde lider", "yenilikçi çözümler", "müşteri odaklı",
"kaliteden ödün vermeden", "tek adres". Bunlar hiçbir bilgi taşımaz ve her
rakip aynısını yazar.

---

## 4. CTA kuralları

- **Sayfada bir birincil eylem vardır.** İkincil eylem sadece "önce anlamak
  isteyen" için, görsel olarak zayıf.
- **Butonda ne olacağını yaz.** "Gönder" değil, "30 dakikalık keşif görüşmesi
  ayarlayın". Kullanıcı tıklamadan önce ne olacağını bilmeli.
- **Butonun altına risk azaltıcı koy.** Tereddüdün çoğu butonun kendisinde
  değil, sonrasının belirsizliğinde.
- **Aynı eylemi tekrar et.** Uzun sayfada CTA başta ve sonda olur; ortada
  bölüm sonlarında tekrarlanabilir.
- **Ölü buton olmaz.** Hedefi bağlanmamış CTA, hiç CTA olmamasından kötüdür.

---

## 5. İtiraz karşılama

Ziyaretçi sayfayı okurken kafasında itiraz üretir. Yazılmazsa itiraz
cevapsız kalır ve sekme kapanır. Kural: **en güçlü üç itirazı sen yaz, sen
cevapla.**

İyi bir itiraz cevabı:
- İtirazı küçümsemez, ciddiye alır
- Sözle değil **mekanizmayla** cevaplar ("gözetimli mod", "yazılı kapsam")
- Ürünün sınırını da söyler — her şeyi vaat eden cevap güveni azaltır

`data/workforce.json` içindeki `objections` bloğu bu standarda göre yazıldı:
her cevap ürünün gerçek bir kararına dayanıyor, pazarlama cümlesine değil.

---

## 6. Kanıt: uydurma yok

Referans, müşteri sözü, "500+ mutlu müşteri" gibi ifadeler **gerçek olmadan
yazılmaz.** Uydurulmuş sosyal kanıt hem yasal risk hem itibar riskidir; ilk
soruda çöker.

Kanıt henüz yokken kullanılabilecek dürüst alternatifler:

- **Mekanizma kanıtı** — nasıl çalıştığını göstermek ("iki hafta gözetimli mod")
- **Şeffaflık kanıtı** — neyi yapmadığınızı söylemek ("ödeme ve sözleşme
  insanda kalır")
- **Süreç kanıtı** — adımları ve süreleri açıkça yazmak
- **Kurucu kanıtı** — bunu neden yaptığınızı ilk ağızdan anlatmak

İlk gerçek müşteri sonuçları geldiğinde kanıt bölümü açılır. O zamana kadar
`proof` bloğu **boş kalır** — doldurulmuş gibi yapılmaz.

---

## 7. UX Writing kuralları

| Öğe | Kural | Kötü | İyi |
| --- | --- | --- | --- |
| Buton | Fiil + sonuç | "Tamam" | "Aboneliği iptal et" |
| Form etiketi | Ne istendiği net | "İsim" | "Şirket adı" |
| Yardım metni | Neden sorulduğunu söyle | — | "Faturanızda görünecek" |
| Hata | Suçlama yok, çözüm var | "Geçersiz giriş" | "E-posta adresi @ içermeli" |
| Boş durum | Ne yapılacağını söyle | "Kayıt yok" | "Henüz rapor yok. İlk analizi başlatın." |
| Onay | Ne olduğunu ve sırada ne olduğunu söyle | "Başarılı" | "Ödeme alındı. Erişiminiz açıldı." |
| Yıkıcı işlem | Sonucu açıkça yaz | "Emin misiniz?" | "Bu aboneliği iptal ederseniz krediniz dönem sonunda silinir." |

**Hata mesajı formülü:** ne oldu → neden → şimdi ne yapmalı.
Üçü de yoksa mesaj eksiktir.

---

## 8. BETA SENIOR için ek kurallar

Yaşlı kullanıcıya yazarken standart sertleşir:

- **Kısa cümle.** Bir cümlede bir fikir.
- **Yabancı kelime yok.** "Dashboard", "onboarding", "abone ol" yerine
  gündelik karşılık.
- **Adım adım.** "Ayarlardan hesabınızı yönetin" değil; "1. Ayarlar'a
  dokunun. 2. Hesabım'ı seçin."
- **Acele ettiren dil yok.** Sayaç, "son şans", "hemen" gibi baskı kalıpları
  savunmasız kullanıcıda etik sorun yaratır ve güveni bitirir.
- **Korkutma yok.** Güvenlik uyarısı bilgilendirir, panik yaratmaz.
- **Metin, tasarımdan önce test edilir.** Kafa karışıklığının kaynağı çoğu
  zaman görsel değil dildir.

---

## 9. Dil kararı — açık ve acil

Şu an ürün sayfaları **Türkçe**, ödeme altyapısı ise **NOK ve Vipps** üzerine
kurulu. Bu ikisi aynı müşteriyi işaret etmiyor.

Cevaplanması gereken: **satış Norveç pazarına mı, Türkçe konuşan kitleye mi?**

- Norveçli KOBİ'ye satılacaksa sayfa **Norveççe** olmalı. İngilizce bile
  dönüşümü düşürür; Türkçe hiç çalışmaz.
- Türkçe konuşan kitleye satılacaksa ödeme tarafı gözden geçirilmeli.
- İkisi birden ise site **çok dilli kurulmalı** — sonradan eklemek pahalı.

Teknik karşılığı bugün ucuz: sayfalar zaten `data/*.json` dosyalarından
üretiliyor. Metinleri dile göre anahtarlamak (`tr`, `no`, `en`) şu anda
küçük bir değişiklik; on sayfa sonra büyük bir yeniden yazım.

**Çeviri ≠ yerelleştirme.** Norveççe sayfa Türkçenin çevirisi olmamalı;
itirazlar, güven mesajları ve fiyat çerçevesi pazara göre değişir.

---

## 10. Yayın öncesi kontrol listesi

Her sayfa için:

- [ ] Başlık sonuç söylüyor, özellik saymıyor
- [ ] İlk ekranda tek ve net birincil CTA var
- [ ] CTA hedefi **gerçekten bağlı** (ölü buton yok)
- [ ] Butonun altında risk azaltıcı cümle var
- [ ] En güçlü üç itiraz yazılmış ve cevaplanmış
- [ ] Kanıt bölümünde uydurma tek bir ifade yok
- [ ] Fiyat gizlenmemiş ya da neden gizlendiği açıklanmış
- [ ] Kapanışta CTA tekrarlanmış
- [ ] Yasak kalıplar taranmış ("lider", "yenilikçi", "müşteri odaklı"…)
- [ ] Hata ve boş durum metinleri yazılmış (sonradan bırakılmamış)
- [ ] Metin sesli okunduğunda doğal duyuluyor

---

## 11. Açık kalemler

1. **CTA hedefi bağlanmadı.** `work.html` içindeki birincil buton şu an sayfa
   içi çapaya gidiyor. Form, takvim linki veya e-posta bağlanmalı — bu
   bağlanmadan sayfa yayına alınmamalı.
2. **Dil kararı** (bölüm 9) — diğer her şeyi etkiliyor.
3. **Kanıt bölümü** ilk müşteri sonuçları geldiğinde açılacak.
4. İletişim sonrası ne olacağı yazılmalı: form dolduran kişi ne zaman,
   kimden, nasıl bir dönüş alacak?
