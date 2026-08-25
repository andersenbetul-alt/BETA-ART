# Hukuk kontrol kapısı — konsept tasarımının zorunlu adımı

Kural (kullanıcı talimatı, 25.08.2026): **her yeni konsept tasarlanırken
yasalar kontrol edilir.** Bu belge o kapının nasıl işlediğini tanımlar ve
memoları toplar.

## Kapı nasıl işler

1. Yeni konsept belgesi açıldığında (iş modeli, ürün, sayfa) bu belgeye
   bir memo eklenir. Memo formatı (kullanıcının benimsettiği standart):
   **Soru** → **Kısa cevap** → **Otoriteye göre tartışma** → **Açık
   konular**; her önerme dayandığı kaynağa bağlanır.
2. **Kaynak dürüstlüğü:** Bu ortamda Thomson Reuters/Westlaw/Lovdata Pro
   erişimi YOK; Norveç kurum siteleri (lovdata.no, datatilsynet.no,
   forbrukertilsynet.no, patentstyret.no) ağ engelinin arkasında —
   doğrudan denendi, EGRESS_BLOCKED. Kaynaklar web arama özetlerinden
   gelir ve **[D — özet düzeyinde, elle teyit edilecek]** işaretini
   taşır. **İçtihat (rettspraksis) burada asla üretilmez** — dava adı ve
   karar atfı uydurulmaz; içtihat taraması avukatın/kullanıcının Lovdata
   Pro adımıdır.
3. Memo, gerçek yasal görüş değildir; yayına/satışa etkisi olan her
   sonuç bir Norveç avukatıyla teyit edilir (is-modeli §9/7 ile aynı
   madde). Memo "avukata sorulacak soruları" netleştirir — cevabın
   yerine geçmez.

---

## Memo 1 — Action Pages hizmeti (25.08.2026)

### Soru

QBLOGG'un danışmanlara sattığı Action Page (etkileşimli değerlendirme →
kişisel sonuç → ücretli rapor/randevu bağlantısı) hizmeti, Norveç
hukukunda hangi yükümlülükleri doğurur; v0 tasarımı (veri tarayıcıda,
sunucuya kayıt yok) bu yükümlülükleri karşılıyor mu?

### Kısa cevap

v0 tasarımı bilinçli olarak en düşük riskli bölgede: kişisel veri
sunucumuza gelmediği için QBLOGG'un veri işleyen (databehandler) rolü
doğmuyor; sayfa reklam/tanıtım niteliğini açıkça taşıyor; sonuç metni
"garanti değildir" ibaresiyle sınırlanmış. Risk, v1'de lead
toplama/CRM açılırsa (databehandleravtale zorunlu olur) ve danışmanın
kendi tüketici satışlarında (angrerett) başlar. Hiçbir sonuç birinci
elden kaynakla doğrulanmadı; aşağıdaki her başlık avukat teyidi ister.

### Tartışma (otoriteye göre)

**1. Kişisel veri — GDPR / personopplysningsloven (otorite: Datatilsynet)**

- Datatilsynet rehberliği [D]: behandlingsansvarlig (veri sorumlusu)
  amacı ve araçları belirleyen taraftır; databehandler onun adına işler;
  rol dağılımı açık ve belgeli olmalı, databehandler için
  databehandleravtale gerekir. Kaynak: Datatilsynet
  "Behandlingsansvarlig og databehandler" ve "Hvordan lage en
  databehandleravtale?" sayfaları (arama özeti; doğrudan açılamadı).
- Uygulama: v0'da cevaplar yalnız ziyaretçinin tarayıcısında puanlanır,
  QBLOGG'a hiçbir veri gelmez → QBLOGG işleme yapmıyor; veri sorumlusu
  danışmandır (kendi randevu/ödeme kanalı üzerinden). **v1'de lead
  kaydı/CRM açılırsa QBLOGG databehandler olur → yazılı
  databehandleravtale + işleme kaydı şart.** Bu, teklif belgesindeki
  "lead toplama avukat teyidi olmadan açılmaz" maddesinin dayanağıdır.
- Form/samtykke [D]: Datatilsynet, web formu kullanımında geçerli ve
  geri çekilebilir samtykke arar. Danışmanın sayfasına form eklenirse
  samtykke metni ve personvernerklæring danışman adına kurulmalı.

**2. Pazarlama — markedsføringsloven (otorite: Forbrukertilsynet)**

- Forbrukertilsynet rehberliği [D]: gizli reklam yasaktır; pazarlama
  açıkça pazarlama olarak görünmeli ("reklame"/"annonse" işareti,
  kimin adına yapıldığı belli); sorumluluk birincil olarak reklam
  verendedir. Kaynaklar: "Veileder for merking av reklame i sosiale
  medier", "47 annonsører brøt forbudet mot skjult reklame" (arama
  özeti düzeyi).
- Uygulama: Action Page bir pazarlama aracıdır ve öyle görünür (marka,
  hizmet, CTA açık) — gizli reklam sorunu yok. Danışman sayfayı sosyal
  medyada tanıtırken olağan reklam işareti kuralları danışmana düşer;
  teslim paketine bu not eklenir. Sonuç metinlerinde abartılı iddia
  (villedende markedsføring) yasağı bizim uydurma yasağımızla örtüşür:
  "garanti değildir" ibaresi ve ölçülü bant metinleri korunacak.

**3. Tüketici satışı — angrerettloven (mesafeli satış)**

- Danışmanın ücretli raporu/hizmeti tüketiciye çevrim içi satılırsa
  mesafeli satış kuralları (ön bilgilendirme, cayma hakkı) danışmanın
  yükümlülüğüdür; QBLOGG-danışman ilişkisi B2B olduğundan bu yasa
  o ilişkiye uygulanmaz. [D — kapsam ayrıntısı doğrulanamadı; dijital
  içerikte cayma istisnalarının koşulları avukata sorulacak.]

**4. İçtihat**

Taranamadı — bu ortamda içtihat veritabanı yok ve uydurulmaz. Avukat
görüşmesinde istenecek: villedende markedsføring ve "quiz/değerlendirme
temelli pazarlama" üzerine Markedsrådet/Forbrukertilsynet kararları.

### Açık konular (avukata)

1. v1 lead toplama açılırsa databehandleravtale şablonu + hangi asgari
   kayıtlar (behandlingsprotokoll) gerekir?
2. CV/kariyer cevapları "özel nitelikli veri"ye yaklaşır mı (sağlık
   iması taşıyan sorular yasak listemize girmeli mi)?
3. Danışman sayfasında analitik (ör. GA) kullanılırsa çerez/samtykke
   yükümlülüğü nasıl kurulur (ekomloven §2-7b)?
4. Dijital içerik satışında cayma hakkı istisnasının tam koşulları.
5. "Action Pages" adının markedsføringsloven açısından bir sorunu yok
   varsayımı doğru mu (tanımlayıcı kullanım)?

Kaynak listesi (hepsi arama özeti düzeyi, doğrudan açılamadı):
Forbrukertilsynet someveiledning · Forbrukertilsynet konkurranse
veilederi · Datatilsynet behandlingsansvarlig/databehandler ·
Datatilsynet databehandleravtale · Datatilsynet samtykke.

---

## Memo 2 — Yazar platformu: kullanıcı içeriği + kitap tanıtımı (25.08.2026)

Not: Thomson Reuters/Westlaw bu ortamda yok; içtihat bölümü bu yüzden
"taranamadı" olarak dürüstçe boş. Aşağıdaki kaynakların tamamı web arama
özeti düzeyindedir [D] ve karar öncesi kurum sayfasından teyit ister.

### Soru

QBLOGG'un davetli yazar platformu (yazar profili + blog yazıları +
kitap vitrini; editoryal onay kapısı `schema-platform.sql`'de) Norveç
hukukunda hangi sorumlulukları doğurur; mevcut tasarım bunları
karşılıyor mu?

### Kısa cevap

Tasarımın iki güçlü yanı (kitap kartlarının açık "tanıtım" işareti ve
asgari veri) mevzuatla uyumlu görünüyor. İki gerçek risk alanı var:
(1) **editoryal onay kapısı, "pasif barındırıcı" sorumsuzluğunu
zayıflatabilir** — içeriği seçip yayımlayan platform, salt depolayandan
daha yakın bir sorumluluk konumuna kayar; (2) **DSA (lov om digitale
tjenester) 2026 yazından itibaren Norveç hukuku** — küçük işletme
muafiyetlerinin kapsamı netleştirilmeden platform büyütülmemeli. Kapak
görselleri telif izni ister. Üçü de avukat sorusudur; hiçbir kaynak
birinci elden okunamadı.

### Tartışma (otoriteye göre)

**1. Aracı sorumluluğu — ehandelsloven (otorite: yasa + hazırlık
çalışmaları)** [D]

- Ehandelsloven'de üç sorumsuzluk hâli düzenlenir: iletim, önbellek,
  **barındırma (vert)**; koşullara uyan aracı, üçüncü kişinin hukuka
  aykırı bilgisini depolamaktan ancak kasıtla (ceza) ya da kasıt/ağır
  ihmalle (tazminat) sorumlu tutulur; istisna kullanıcı içerikli yayın
  platformlarını kapsar. Kaynaklar: SNL "ehandelsloven", Finansavisen
  "Ansvarsfrihet for mellommenn" (2021), Ot.prp. nr. 4 (2003–2004)
  (arama özetleri).
- **Uygulamadaki gerilim:** bizim modelde yazı ancak yönetici
  `yayinda` yapınca görünür (RLS ile zorlanmış editoryal kapı). Bu,
  kalite iddiasını korur AMA "talep üzerine salt depolama" konumundan
  uzaklaştırır: onayladığın içeriği bilmediğini söyleyemezsin. Avukata
  net soru: editoryal kapı bu sorumsuzluğu ne ölçüde kaldırır ve onay
  akışına asgari hangi hukuka aykırılık kontrolü eklenmelidir?

**2. DSA — lov om digitale tjenester (otorite: regjeringen, Nkom,
Medietilsynet)** [D]

- DSA, AB'de Şubat 2024'ten beri yürürlükte; Norveç uyarlaması için
  taslak yasa Ekim 2025 høring'inden geçti ve **2026 yazından itibaren
  Norveç hukuku olarak uygulanması** planlanıyor; koordinatör Nkom
  (Forbrukertilsynet/Datatilsynet/Medietilsynet ile birlikte).
  Kaynaklar: regjeringen.no høring duyuruları, Nkom "Hva er DSA?",
  Medietilsynet DSA sayfası (arama özetleri; bugünkü kesin yürürlük
  durumu doğrulanamadı — İLK teyit maddesi).
- Uygulama: platform büyümeden önce netleşmeli — bildirim-ve-eylem
  (notice-and-action) mekanizması, iletişim noktası ve koşul
  şeffaflığı DSA tabanıdır; mikro/küçük işletme muafiyetlerinin hangi
  yükümlülükleri kaldırdığı avukata sorulacak. kosullar.html'e
  bildir-kaldır süreci zaten planlıydı (yazar-platformu §6) — DSA bunu
  keyfî iyi niyetten yükümlülük adayına çevirir.

**3. Telif — åndsverkloven (otorite: yasa + üniversite/eğitim
kaynakları)** [D]

- Başkasının eserini (görsel dahil) kullanmak izin ister; alıntı hakkı
  (sitatrett, § 29) "iyi uygulamaya uygun ve amacın gerektirdiği
  ölçüde" sınırlıdır ve ad/eser anmayı gerektirir; haklar yayınevine
  devredilmişse izin yayınevinden alınır. Kaynaklar: UiB opphavsrett
  sayfası, NDLA åndsverklov kaynakları (arama özetleri).
- Uygulama: `books.cover_url` yazarın yüklediği kapak görselini
  gösterir — kapağın hakları çoğu zaman **forlagdadır**. Yazar
  sözleşmesine/koşullara: (a) yazarın "yüklediğim içerik ve görseller
  üzerinde hak sahibiyim veya iznim var" beyanı, (b) ihlalde
  sorumluluğun yazara ait olduğu, (c) bildir-kaldır taahhüdü.

**4. Pazarlama — markedsføringsloven (otorite: Forbrukertilsynet)**

- Memo 1'deki rehber aynen uygulanır: gizli reklam yasak, tanıtım
  açıkça işaretli. Platform tasarımı bunu şemadan itibaren karşılıyor
  (her kitap kartı "tanıtım" işaretli, dış bağlantı
  `rel="sponsored nofollow noopener"` — yazar-platformu §4/§6).

**5. İçtihat** — taranamadı (veritabanı yok; uydurulmaz). Avukattan
istenecek: editoryal kontrol ile aracı sorumsuzluğunun sınırına dair
Norveç/AB kararları (ör. barındırıcı statüsü değerlendirmeleri).

### Açık konular (avukata)

1. Editoryal onay kapısı hosting sorumsuzluğunu kaldırır mı; onay
   akışına asgari hangi kontrol listesi eklenmeli?
2. DSA'nın Norveç'te bugünkü kesin yürürlük durumu ve mikro işletme
   muafiyetlerinin tam listesi.
3. Bildir-kaldır sürecinin asgari biçimsel gerekleri (süre, kayıt,
   itiraz yolu).
4. Yazar sözleşmesi: hak beyanı + tazmin maddesi + kapak görseli için
   forlag izni pratiği.
5. Platform "yayıncı" sayılırsa medieansvarsloven kapsamına girer mi
   (redaktörlü medya tanımı)?
