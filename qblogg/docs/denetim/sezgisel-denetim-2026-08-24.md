# Sezgisel denetim (heuristic audit) — 24.08.2026

Kapsam kararı (kullanıcı, AskUserQuestion): rakip kümesi = Action Pages
rakipleri (Outgrow, ScoreApp, Typeform); özel ölçütler = aşağıdaki üçlü.

**Rakip yarısı YAPILAMADI:** outgrow.co, scoreapp.com, typeform.com bu
ortamdan erişilemedi (üçü de bağlantı kurulamadı — proxy engeli).
Rakip ekranı görülmeden puanlanamaz; kullanıcı ekran görüntüsü
yapıştırırsa karşılaştırma tamamlanır. Aşağıdaki puanlar YALNIZ kendi
ekranlarımızındır ve gerçek ekran görüntülerinden verilmiştir
(driver: run-qblogg + demo Playwright çekimleri).

Ölçekler: 1 (ciddi sorun) – 5 (güçlü). N1–N10 Nielsen; özel ölçütler:
**C1 İddia dürüstlüğü** (rakam/kanıt işaretlemesi, uydurma yasağı),
**C2 Tek iş netliği** (sayfa tek dönüşüme mi sürüyor),
**C3 Erişilebilirlik disiplini** (kontrast/RTL/durum bildirimi).

| Ölçüt | index | work | demo Action Page |
|---|---:|---:|---:|
| N1 Sistem durumu görünürlüğü | 4 | 4 | 3 |
| N2 Gerçek dünya dili | 5 | 5 | 5 |
| N3 Kullanıcı kontrolü | 4 | 4 | 4 |
| N4 Tutarlılık/standartlar | 5 | 5 | 4 |
| N5 Hata önleme | 4 | 3 | 4 |
| N6 Hatırlamak değil tanımak | 5 | 4 | 5 |
| N7 Esneklik/verimlilik | 4 | 4 | 3 |
| N8 Estetik/sade tasarım | 5 | 5 | 4 |
| N9 Hatadan kurtarma | 4 | 4 | 4 |
| N10 Yardım/belgelendirme | 4 | 5 | 4 |
| C1 İddia dürüstlüğü | 5 | 5 | 5 |
| C2 Tek iş netliği | 4 | 5 | 5 |
| C3 Erişilebilirlik disiplini | 4 | 4 | 4 |

## Ekran notları (gözleme dayalı)

**index:** Fiyatların "example starting rates" notu ve "measured numbers"
bağlantısı C1'i taşıyor; karşılaştırma tablosu dipnotlu (N6 güçlü).
Zayıf nokta: sayfada iki dönüşüm yarışıyor (brief + bülten) — bülten en
altta olduğu için kabul edilebilir, ama hero'daki ikili CTA ("Send a
brief" / "See packages") ilkinin lehine daha net ağırlıklanabilir (C2 4).

**work:** Form etiketleri tam, gizlilik cümlesi formun dibinde ("sending
stays in your hands... never shared") — C1/GDPR güçlü. İki zayıflık:
(1) "Monthly budget" seçilmiş değerle açılıyor (€150–€500) — boş
"seçiniz" ile açılmalı, yoksa yanlış bütçe beyanı sessizce gider (N5 3);
(2) tarih alanı tarayıcı yereline göre mm/dd/yyyy gösteriyor — Avrupa
kullanıcısı için karışabilir, ipucu metni eklenebilir (N5).

**demo Action Page:** Tek iş netliği örnek düzeyinde (C2 5): tek form,
tek sonuç, iki CTA. Gizlilik bandı en üstte, sonuçta "garanti değil"
ibaresi ve [DEMO] şeffaflığı — C1 5. Zayıflıklar: 8 soruda ilerleme
göstergesi yok (N1 3); sonuç sonrası cevap değiştirme akışı yalnız
yukarı kaydırmayla (N7 3); accent rengi sonuç ekranında hiç
kullanılmıyor, bant rengi durum (iyi/orta/zayıf) iletebilirdi (N4 4).

## Çalınmaya değer 3 desen (kategori standardı — rakip ekranları
görülemediği için bilinen ürün desenleri olarak yazıldı, canlıda teyit edin)

1. **İlerleme göstergesi / adım hissi** (Typeform'un imza deseni):
   demo'ya "3/8" sayacı eklemek tamamlama oranını artırır — düşük maliyet.
2. **Sonuç bandının görselleştirilmesi** (ScoreApp tarzı skor kadranı):
   16 üzerinden sayı yerine/yanına renkli bant veya basit ölçek —
   danışmanın raporu satması için sonucun "paylaşılabilir" görünmesi.
3. **Soru başına tek ekran seçeneği** uzun değerlendirmelerde (>10 soru):
   bizim 8 soruluk tek sayfa doğru; uzman 15+ soru isterse adımlı düzen.

## Kaçınılacak 3 desen (aynı kategoride yaygın)

1. **Sonuçtan önce zorunlu e-posta duvarı** — kategori standardı ama
   bizim GDPR-asgari konumumuzun tam tersi; ayrıca güveni bozar. Sonuç
   ücretsiz kalır, iletişim CTA'sı sonuçtan SONRA gelir.
2. **Sahte kişiselleştirme** ("AI senin için analiz ediyor..." dönen
   çarklar, belirlenimci sonuçta yapay bekletme) — uydurma yasağının
   arayüz hâli; asla.
3. **Skor enflasyonu** (herkese yüksek puan verip iyi hissettirme) —
   dönüşümü kısa vadede artırır, danışmanın güvenilirliğini uzun vadede
   bitirir. Bant metinlerimiz dürüst kalır.

## Sonraki adım

Rakip karşılaştırması için kullanıcıdan ekran görüntüsü bekleniyor
(Outgrow/ScoreApp/Typeform'un quiz akışları). Gelirse aynı 13 ölçütle
puanlanıp bu belgeye "bizden güçlü/zayıf" kolonu eklenecek.
