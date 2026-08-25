# QBLOGG Action Pages — 30 günlük pilot teklifi

Tarih: 24.08.2026 · Durum: satış deneyi (kullanıcı kararı: ilk ticari deney).
Kural: 30 günde 10 görüşme + 3 ücretli pilot; satılmazsa platform büyütülmez.
Bütün fiyatlar **[H] — test fiyatı**dır; ilk görüşmelerde kalibre edilir ve
siteye kesin vaat olarak yazılmaz.

## Teklif (tek cümle)

> En iyi içeriğinizi 7 gün içinde, müşteriye özel sonuç ve randevu üreten
> bir Action Page'e dönüştürüyoruz.

## Ne teslim edilir

1. Profesyonel soru-cevap sayfası (uzmanın markasıyla; QBLOGG imzası altta).
2. 5–10 soruluk interaktif değerlendirme (belirlenimci puanlama —
   yapay zekâ uydurması yok; sonuç metinleri uzmanla birlikte yazılır).
3. Ücretsiz kısa sonuç + kişiye özel iyileştirme maddeleri.
4. Ücretli adım düğmeleri: rapor/ürün (uzmanın Stripe/Vipps bağlantısı)
   ve randevu (uzmanın Calendly vb. bağlantısı).
5. Açık gizlilik notu: cevaplar tarayıcıda işlenir, v0'da hiçbir yere
   kaydedilmez (KVKK/GDPR yükünü en aza indiren bilinçli tasarım;
   potansiyel müşteri bilgisi doğrudan uzmanın kendi kanalına gider).
6. Temel ölçüm: uzmanın istediği analitik kendi hesabıyla eklenir
   (biz veri toplamayız).

Çalışan örnek: `demo/cv-action-page.html` — "Er CV-en din klar for det
norske arbeidsmarkedet?" (görüşmede gösterilecek satış demosu).

## Pilot fiyatı [H — görüşmelerde test edilir]

- Kurulum: 4.900 NOK (7 günde yayında)
- Barındırma + bakım: 690 NOK/ay
- Uzmanın kendi getirdiği satıştan komisyon: %0
- Özel geliştirme (ek sayfa, çok dil, entegrasyon): ayrıca teklif

Not: Stripe Norveç kesintisi (yurt içi kart %1,5 + 1,80 kr; karar öncesi
stripe.com'dan teyit) fiyatın içinde düşünülmüştür.

## Tahsilat kuralı (süreç denetimi B1)

Kurulum ücreti **fatura ile peşin** alınır; **ödeme gelmeden sayfa
yayına alınmaz.** Aylık bakım ücreti her ayın başında faturalanır;
iki ay ödenmezse sayfa askıya alınır (sözleşmeye yazılır). Kayıt:
`docs/pilot-defteri.md` tahsilat tablosu. Ön koşul: fatura kesebilmek
için şirket kaydı/org.nr (kullanıcı adımı — ilk anlaşmadan önce).

## Hedef müşteri (ilk 10 görüşme)

Norveç'te çalışan kariyer danışmanları ve iş koçları. Neden: müşteri
sorularını bilirler, danışmanlıktan zaten gelir elde ederler, tek yeni
müşteri pilot ücretini karşılar, CV konusu demo ile birebir örtüşür.

## Norveççe ulaşım mesajı (LinkedIn/e-posta, kısa)

> Hei [navn],
>
> jeg så at du hjelper folk med [karriere/CV]. Vi bygger «Action Pages»:
> vi gjør ditt beste innhold om til en interaktiv side som gir leseren
> et personlig resultat — og deg en booking eller et salg.
>
> Her er en demo (2 minutter): [demo-lenke]
>
> Vi setter opp din egen side på 7 dager. Pilotpris: 4 900 kr oppsett +
> 690 kr/md, ingen kommisjon på dine egne salg. Har du 15 minutter denne
> uken til en kort prat?
>
> Vennlig hilsen, Betül — QBLOGG

## Sizin adımlarınız (adım adım)

1. **Demoyu görün:** `demo/cv-action-page.html` dosyasını tarayıcıda açın (yayında: https://qblogg.vercel.app/demo/cv-action-page.html)
   (çift tıklamak yeter — sunucu gerekmez). Soruları cevaplayıp sonucu
   görün; sonuç metinlerinde değiştirmek istediğinizi bana söyleyin.
2. **Demo adresi:** görüşmelerde link paylaşmak için demoyu yayına
   alalım — onay verirseniz qblogg.vercel.app altına eklerim (main'e
   push onayınızla) ya da ayrı bir demo adresi açarım.
3. **10 aday listesi:** LinkedIn'de arama: "karriereveileder",
   "karrierecoach", "jobbsøkerhjelp" (Norge). Google: "karriereveiledning
   pris" yazan bireysel danışman siteleri. Adayları bana verirseniz
   her biri için kişiselleştirilmiş mesaj taslağı yazarım.
4. **Mesajı gönderin:** yukarıdaki Norveççe taslağı kendi hesabınızdan
   gönderin ([navn] ve [demo-lenke] alanlarını doldurup). Cevap gelince
   15 dakikalık görüşmeyi siz yaparsınız; görüşme notlarını bana iletin.
5. **Ölçüm:** her görüşme için üç satır kaydedin: fiyata tepki /
   itiraz / evet-hayır. 30. günde birlikte karar veririz: 3 ödeme
   geldiyse platform büyür, gelmediyse teklif veya kitle değişir.

## Bu belgeye girmeyenler (bilinçli)

- Yazar lansman paketi ve SAYFA60 kanalı: sırada, iptal değil
  (docs/yazar-platformu.md §10).
- AI ile kişiselleştirilmiş sonuç üretimi: ödeme kanıtından sonra,
  uzman onaylı şablonlarla.
- Lead toplama/CRM: veri işleyen rolü ve sözleşmesi gerektirir; avukat
  teyidi olmadan açılmaz.
