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
