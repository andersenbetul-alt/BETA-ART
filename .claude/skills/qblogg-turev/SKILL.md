---
name: qblogg-turev
description: Tek bir araştırma/makaleden QBLOGG'un yedi türev çıktısını üret — LinkedIn serisi, sosyal içerik, newsletter bölümü, kısa video senaryoları, YouTube taslağı, podcast notları, devam yazıları listesi. Kullanıcı "türevleri üret", "yedi çıktıyı çıkar", "bu yazıdan sosyal içerik/LinkedIn serisi yap", "içerik paketi hazırla" dediğinde ya da bir yazının teslim paketi hazırlanacağında MUTLAKA bu beceriyi kullan.
owner: QBLOGG
---

# Yedi türev üretimi

"Bir araştırma, yedi çıktı" QBLOGG'un sattığı üründür. Bu beceri o üretimin
el kitabıdır. Altın kaynak depodadır: **önce
`content/yazarak-para-kazanma-platformlari/tr/` klasöründeki yedi gerçek
dosyayı aç ve desenlerine bak** — aşağıdaki kurallar o dosyaların
damıtılmasıdır, çelişkide gerçek dosyalar kazanır.

## Değişmez ilke

Türev, kaynak makalenin ÖZETİ değildir — aynı araştırmanın **o kanalın
diliyle yeniden anlatımı**dır. Her türev kendi başına değer taşımalı;
"devamı yazıda" tuzağına düşmemeli ama kaynak yazıya doğal bir köprü
içermeli. Kaynakta olmayan olgu/rakam türevde de olamaz (uydurma yasağı
kanal değiştirince kalkmaz).

## Yedi çıktı — dosya adları ve biçim çekirdeği

Çıktılar `content/<yazi-slug>/tr/` altına yazılır:

1. **linkedin.md** — 5-8 gönderilik seri. Her gönderi: tek fikir, ilk satır
   kanca (soru ya da ters-beklenti), 80-200 kelime, sonda hafif CTA.
   Seri numarası başlıkta (1/6 gibi). Kaynak atfı serinin sonunda bir kez.
2. **sosyal.md** — 8-12 kısa gönderi (X/Threads boyu): tek cümlelik çarpıcı
   olgu + bir bağlam cümlesi. Emoji YOK (marka kuralı). Rakamlı olanlar
   kaynaktaki rakamla birebir.
3. **newsletter.md** — bültene girecek tek bölüm (150-300 kelime): samimi
   ton, "bu hafta şunu öğrendik" çerçevesi, tek çıkarım, yazıya bağlantı.
4. **kisa-videolar.md** — 3-5 adet 30-60 saniyelik senaryo. Zaman kodlu:
   `0-3 sn` kanca / `3-15 sn` gerilim / `15-45 sn` içerik / son: tek cümle
   kapanış. Ekran metni ile seslendirme ayrı sütun/satırlarda.
5. **youtube.md** — tek videoluk taslak: kanca (0.00-0.15), bölüm başlıkları
   dakikalarıyla, açıklama metni + 3-5 etiket. Senaryo değil iskelet.
6. **podcast.md** — 10-15 dakikalık sohbet notları: 3-4 ana durak, her
   durakta konuşma soruları, geçiş cümleleri, kapanış özeti.
7. **devam-yazilari.md** — bu araştırmanın açtığı 5-10 yeni yazı fikri:
   her satır `başlık — tek cümle gerekçe — hedef anahtar kelime` üçlüsü.
   (Bunlar konu kümesinin genişleme haritasıdır; `{see:}` bağlantılarının
   geleceği buradan planlanır.)

## Üretim sırası ve verim

Sıra önemli: önce **devam-yazilari** (araştırmayı en taze kafayla haritala),
sonra **linkedin** (ana tezleri gönderiye bölmek diğerlerini kolaylaştırır),
sonra kalanlar. LinkedIn serisindeki gönderi başlıkları, kisa-videolar ve
sosyal için hammadde olur — aynı fikri üç kanala üç dilde anlatmak,
yediyi sıfırdan yazmaktan hızlıdır.

## Ton ve marka

- Türkçe üretim varsayılandır (müşteri briefi başka dil derse o).
- Emoji yok; vurgu `**kalın**` ile.
- Fiyat/kazanç rakamları örnek olarak işaretlenir; kesin vaat dili yasak.
- Her dosyanın başına tek satır künye: kaynak yazının başlığı + slug'ı.

## Kalite kapısı

Teslimden önce: (1) yedi dosya da var mı; (2) her rakam kaynak yazıda
birebir bulunuyor mu (kontrol et, hatırlama); (3) emoji sızmış mı
(`grep -P '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]'` benzeri bir tarama);
(4) her dosyada kaynak künyesi var mı. Müşteri teslimi ise `ornek.html`'e
alıntı eklenmez — o sayfa yalnız kendi yayınımızın türevlerini sergiler.
