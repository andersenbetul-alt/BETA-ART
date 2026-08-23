# QBLOGG — Proje konsept belgesi

Sürüm: 1.0 · 23.08.2026 · Sahip: QBLOGG
Bu belge projenin ne olduğunu, kime ne sattığını ve nasıl çalıştığını tek
yerde anlatır. Buradaki her iddia depodaki dosyalara veya yayınlanmış siteye
dayanır; doğrulanmamış hiçbir rakam kesin vaat olarak yazılmamıştır.

## Tek cümleyle

QBLOGG, kendi içerik ekibi olmayan şirketlere **tek araştırmadan yedi farklı
çıktı** üreten, yapay zekâ destekli ama insan denetimli bir içerik
stüdyosudur; sitenin işi trafik toplamak değil, **brief formunu
doldurtmaktır**.

## Sorun

Düzenli yayın yapmak isteyen KOBİ ve SaaS şirketlerinin çoğunun içerik ekibi
yoktur. Tek yazı için ajans süreci ağır, serbest yazar yönetimi zahmetli,
"tam otomatik AI içerik" ise kalitesiz ve riskli. Boşluk: **düzenli, çok
kanallı, çok dilli ve denetlenebilir** üretimi tek pakette veren bir hat.

## Teklif

Bir konu bir kez derinlemesine araştırılır; aynı araştırmadan yedi çıktı
türetilir:

1. SEO blog yazısı (ana varlık)
2. LinkedIn serisi
3. Sosyal içerik
4. Newsletter bölümü
5. Kısa video senaryosu
6. YouTube taslağı
7. Devam yazıları / podcast notları

Bu model sitede somut olarak gösterilir: yayındaki
"yazarak para kazanma platformları" yazısından türetilmiş 7 gerçek teslimat
dosyası depoda durur (`content/yazarak-para-kazanma-platformlari/tr/`).

**Paketler** (fiyatlar örnek başlangıç fiyatıdır; kapsam ve sektöre göre
değişir — bu ibare sitenin kendisinde de yazılıdır):

| Paket | Örnek fiyat | Kapsam özeti |
|---|---|---|
| Tek Makale | €150 / makale | 1200–2000 kelime, anahtar kelime araştırması, iki revizyon |
| Büyüme | €900 / ay | Ayda 4 makale + 20 LinkedIn postu + aylık performans raporu |
| Stüdyo | €2.500 / ay | Ayda 8 makale + newsletter, 10 dilde yayın, video senaryosu + YouTube taslağı, özel stratejist |

## Hedef kitle

- **Birincil:** içerik ekibi olmayan, düzenli yayın isteyen KOBİ ve SaaS
  şirketleri (odak pazar: Norveç merkezli, çok dilli erişim).
- **İkincil:** stüdyoya katılmak isteyen yazarlar — sitede ayrı başvuru
  sekmesi vardır (work.html: marka briefi + yazar başvurusu).

## Neden inandırıcı — kalite ve güven katmanı

QBLOGG'un ayırt edici iddiası "daha çok içerik" değil, **denetlenebilir
içerik**tir. Kurallar yazılıdır ve makinece denetlenir:

- **Görünürlük kapısı:** her yazı yayına girmeden 16 maddelik otomatik
  denetimden geçer (denetim kodu: `engine/visibility.mjs`). Maddeler
  başlık, "önce cevap" yapısı, konu kümesi bağlantıları, tekrar, özgün
  katkı, meta/adres, okunabilirlik, yapılandırılmış veri, görsel ve
  kaynak/yazar/tarih ölçütlerini kapsar. Aynı ölçüt sitenin kendi
  yazılarına da uygulanır — kendi kuralına uymayan hat satılmaz.
- **Özgün katkı zorunlu:** her yazıda `orig` alanı (kendi verisi, testi,
  tablosu) yoksa yazı "yayınlanamaz" işaretlenir.
- **Kaynak kuralı:** en az üç kaynak; adresi doğrulanmamış kaynak uydurma
  bağlantıyla değil adıyla ve gerekçesiyle yazılır. Para/kariyer
  konularında bu kural, öneri değildir.
- **Uydurma yasağı:** doğrulanmamış istatistik, müşteri hikâyesi, kurum
  şartı yazılmaz. Fiyat ve rakamlar örnek olarak işaretlenir.
- **Revizyon:** her içerikte iki revizyon dahildir.
- **Otomatik denetimler:** dil bütünlüğü, kırık bağlantı, XSS/veri koruma
  taraması, erişilebilirlik ölçümleri her değişiklikte çalışır
  (`npm run check`, `npm run guvenlik`).

## Üretim hattı: Curiosity Engine

Site vitrindir; üretimin arkasında ayrı bir hat vardır (`engine/`):
sinyal topla → kümele → puanla → kuyruğa al (`run.mjs`), sonra
araştır → yaz → SEO → gelir → kalite + görünürlük kapısı (`write.mjs`).
Ödeme tarafı için hesap/abonelik/kredi defteri şeması hazırdır
(`schema-billing.sql`, `billing.mjs`). Motor bugün iç üretimde kullanılır;
uzun vadede ürünleşebilir.

## Dil modeli: iki katman

Site ve içerik 10 dildedir (tr, en, zh, hi, es, ar, fr, pt, ru, no; Arapça
RTL). Bilinçli tasarım: **tr + en tam makale** (1.200+ kelime), kalan sekiz
dil **özet katmanı** (yazı başına üç blok). Bu, "10 dilde yayın" vaadini
maliyeti kontrol ederek doğru kılar; eşikler otomatik denetlenir.

Müşteri işinde hedef diller ve her dilin derinliği (tam makale mi, özet
katmanı mı) brief'te kararlaştırılır; yukarıdaki iki katmanlı model
QBLOGG'un kendi yayınının uyguladığı ve önerdiği varsayılan yaklaşımdır.

## Gelir katmanları

1. Paket satışı (ana gelir; brief formu → e-posta).
2. Ortaklık bağlantıları — yazı içinde `{aff:…}` bloğu; bildirim kutusu ve
   `rel="sponsored"` kendiliğinden (`docs/gelir-sistemi.md`).
3. Bülten + lead magnet (bülten servisi Buttondown; kayıt karşılığı
   indirilebilir otomasyon keşif listesi).
4. Kart ile ödeme: Stripe Payment Link entegrasyonu site tarafında hazır
   hâle getiriliyor; bağlantılar `config.js`'e yapıştırıldığında paket
   kartlarında "Kartla öde" düğmesi belirir (`docs/odeme-sistemi.md`).

## Teknik yapı

Saf HTML + CSS + JavaScript; **derleme adımı, çatı ve bağımlılık yok** —
site herhangi bir statik sunucuya olduğu gibi yüklenir. Tek stil dosyası,
değişkene bağlı renk/boyut sistemi, koyu tema, RTL desteği, satır içi SVG
ikon kuralı (emoji yasak). Formlar sunucusuz (`mailto:` taslağı); bülten
Buttondown'a bağlanır. Yayın: Vercel (üretim adresi qblogg-bet-art.vercel.app;
qblogg.com bağlanma aşamasında). Sitenin güncellenmesi = `main`e push +
dağıtımın yeniden tetiklenmesi.

## Marka

Kimlik betikle üretilir, elle çizilmez (`scripts/marka-uret.py`, 14 varlık,
bayt bayt yeniden üretilebilir). Renkler: Midnight Navy `#082C54` +
Electric Aqua `#00D8C2`. EUIPO (Avrupa Birliği Fikri Mülkiyet Ofisi)
şekil markası başvuru dosyaları zarf
denetiminden geçmiş hâlde hazırdır; sınıf seçimi ve benzerlik taraması
marka vekili işidir ve dosyada açıkça öyle işaretlenmiştir
(`docs/marka-tescili.md`).

## Bugünkü durum (23.08.2026)

**Bitti:** site 7 sayfa + 404 ile yayında, tüm denetimler yeşil; yazdırma
CSS'i + security.txt; yazı sayfalarına İçindekiler.

**Yapılıyor:** paket karşılaştırma tablosu, RSS beslemesi, kalite güvencesi
sayfası, örnek teslimat sayfası, "Kartla öde" düğmeleri.

**Bekleyen (dış adım):** alan adı — DNS doğrulama TXT kayıtları yayıldı,
Vercel'de "Verify & Claim" onayı bekleniyor.
- Kullanıcı tarafında bekleyenler: hukuki alan bilgileri, Buttondown
  hesabı, hello@qblogg.com kutusu, sosyal hesap adresleri, EUIPO gönderimi,
  Stripe panelinde ürün/Payment Link oluşturma.

## Bilinen sınırlar

- Dil değişimi istemci tarafında; arama motoru tek HTML görür. Tam çok
  dilli SEO için ön-render adımı gerekir (yol haritasında).
- Formlar sunucusuzdur; CRM/otomasyon yoktur (bilinçli sadelik).
- Fiyatlar ve blog yazılarındaki ücret bilgileri araştırma/örnek veridir.

## Ölçüt

Bu projede başarı tanımı sıralıdır: (1) brief formu dolduran nitelikli
şirket sayısı, (2) bülten listesi büyümesi, (3) organik görünürlük.
Trafik tek başına ölçüt değildir.
