# NAVIAR Care — Yapay zeka yönetişimi ve erişilebilirlik gereksinimleri

Kaynak: kullanıcı talimatı (01.09.2026), beş madde. Bu belge o beş maddeyi
`legal/launch-review-brief.md` ve `product/mvp-data-map.md`'nin zaten
kapsadığı yerlerde **doğrulama**, kapsamadığı yerlerde **yeni zorunlu
gereksinim** olarak kaydeder. `launch-review-brief.md` gibi bu da hukuki
görüş değildir — mevcut tasarımın karşılığını gösteren bir denetim kaydı.

## 1. Sağlık bilgileri ve teşhisler gereksiz yere toplanmamalı

**Zaten karşılanıyor — doğrulandı.** `product/mvp-data-map.md`:

- "Kesinlikle toplanmayan" listesinde açıkça: *"Tıbbi teşhis, ilaç bilgisi,
  sağlık günlüğü"*.
- Talep formunun serbest metin alanının hemen üstünde zorunlu uyarı:
  *"Lütfen tıbbi, bankacılık veya kimlik bilgisi girmeyin."*
- Toplanan alanlar listesi (iletişim, posta kodu, hizmet kategorisi, sıklık,
  müsaitlik, dil, ilişki, izin) amaç-bağlı ve asgari; sağlık verisi hiçbir
  alanda yok.

Değişiklik gerekmedi. Bu ilke zaten `NAVIAR-CARE-IS-MODELI-KRITIK-ANALIZ.md`
§0'daki üç hizmetin kasıtlı olarak tıbbi/kişisel bakım dışı tasarlanmasıyla
aynı kökten geliyor (MVA muafiyeti tartışmasıyla da bağlantılı, bkz.
`legal/launch-review-brief.md` madde 3).

## 2. Yapay zekâ, çalışan (yardımcı) hakkında otomatik karar vermemeli

**Zaten karşılanıyor — doğrulandı.** Şu an sistemde otomatik karar veren
hiçbir yapay zekâ bileşeni yok; süreç uçtan uca insan:

- `operations/helper-selection-scorecard.md`: adaylar 4 aşamada
  (ön koşullar → yapılandırılmış görüşme → referans → ücretli senaryo
  denemesi) tamamen insan tarafından puanlanıyor. Karar sütunu "Onaylı /
  Onaylı değil" — bir algoritma çıktısı değil, insan kararı.
- `product/mvp-data-map.md`: *"Otomatik eşleştirme, canlı takip, sağlık
  kaydı veya aile gözetim paneli MVP'de yok — plan bunu açıkça
  yasaklıyor."* Aile-yardımcı eşleştirmesi de insan (koordinatör) yapıyor.

**Açık nokta:** Bu madde "çalışan hakkında" diyor — NAVIAR Care'in
yardımcıları (Task 2'deki 8-12 aday havuzu) kurulacak şirket biçimine göre
(bkz. `legal/launch-review-brief.md` madde 1) çalışan ya da bağımsız
yüklenici olabilir; ikisinde de yukarıdaki insan-karar ilkesi aynı şekilde
uygulanmalı — istihdam modeli netleşince bu satır tekrar gözden geçirilmeli.

## 3. İnsan kontrolü, rol bazlı erişim, silme süresi, işlem kaydı — tasarım zorunluluğu

**Henüz karşılanamaz — sistem henüz yok, bu bir gereksinim kaydı.**
Bugüne kadar inşa edilen tek şey bu depodaki statik iniş sayfası
(`naviar-care.vercel.app`) — form verisi hiçbir yere kaydedilmiyor, bir
veritabanı/CRM yok. `legal/launch-review-brief.md`'nin teslim paketi
listesinde "Veri sağlayıcı listesi (CRM, ödeme işleme, bordro)" henüz
seçilmedi (madde 6). Yani bu dört gereksinim, o sistem kurulduğunda
**tasarım girdisi** olarak bağlayıcı:

| Gereksinim | Karşılığı ne zaman kurulmalı |
|---|---|
| İnsan kontrolü | Zaten ilke olarak var (madde 2) — gerçek sisteme geçince de korunmalı: hiçbir eşleştirme/onay adımı tam otomatik olmamalı |
| Rol bazlı erişim (RBAC) | CRM seçilirken zorunlu değerlendirme kriteri: koordinatör / yardımcı / muhasebe rollerinin görebileceği veri ayrı tanımlanmalı |
| Silme süresi (saklama süresi) | `product/mvp-data-map.md`'de "uzun süreli saklamadan önce koordinatör tarafından incelenir" var ama **süre sayısı yok** — Datatilsynet'e sorulacak DPIA sorusuyla (`legal/launch-review-brief.md` madde 6) birlikte netleştirilmeli |
| İşlem kaydı (audit log) | CRM/veritabanı seçiminde zorunlu özellik: kim, ne zaman, hangi kaydı görüntüledi/değiştirdi — özellikle rıza durumu değişiklikleri (`product/consent-and-communication-model.md`) için |

**Karar günlüğüne eklendi** (`decisions/decision-log.md`, madde 13) —
sistem kurulmadan önce kapatılması gereken açık madde olarak.

## 4. AI Act / Norveç KI-lov hazırlığı

Kaynak doğrulandı (web arama, bu ortamdan regjeringen.no'ya doğrudan erişim
yok ama arama sonucu özetleri resmi sayfa metnini taşıyor):

- Norveç hükümeti KI-lov taslağını Ekim/Kasım 2025'te görüşe (høring) açtı,
  ~150 görüş yanıtı aldı.
- AB'nin AI Act'inde 2026 yazında yapılan değişiklikler nedeniyle Norveç
  taslağı **yeniden** görüşe çıkarılacak (sonbahar 2026).
- Hükümetin güncel hedefi yasayı Stortinget'e **bahar 2027**'de sunmak —
  bu, önceki bahar 2026 hedefinden bir erteleme.
- AB AI Act'in kendisi, esas hükümleriyle Ağustos 2026'da AB genelinde
  yürürlüğe giriyor; Norveç bunu EEA üzerinden kendi hukukuna aktarıyor.

**Kaynaklar:**
[regjeringen.no — Lov om kunstig intelligens i Norge sendes nå på høring](https://www.regjeringen.no/no/aktuelt/lov-om-kunstig-intelligens-i-norge-sendes-na-pa-horing/id3113732/) ·
[regjeringen.no — Tung vil sende KI-loven med endringer på høring](https://www.regjeringen.no/no/aktuelt/tung-vil-sende-ki-loven-med-endringer-pa-horing/id3169693/) ·
[regjeringen.no — Høringsnotat (KI-lov taslağı, PDF)](https://www.regjeringen.no/contentassets/e823dc21809c43f2b4ba9ff1e389e245/horingsnotat-utkast-til-ki-lov131652.pdf)

**NAVIAR Care'e pratik karşılığı:** yasa henüz yürürlükte değil ama madde
2'de doğrulandığı gibi sistemde zaten **hiç otomatik-karar-veren yapay
zekâ bileşeni yok** — yani AI Act'in asıl ağırlığını taşıyan
"yüksek riskli AI sistemi" yükümlülükleri şu an için isabet etmiyor. Bunu
"AI Act uyumluyuz" diye pazarlamak yanlış olur (henüz test edilecek bir
sistem yok); doğru çerçeve: *tasarım ilkesi olarak insan-karar zorunluluğu
zaten var, ileride bir öneri/otomasyon katmanı eklenirse o katman bu
belgeye ve KI-lov'un nihai haline karşı ayrıca değerlendirilmeli.*

## 5. WCAG / Norveç erişilebilirlik kuralları — denetlendi ve düzeltildi

Kaynak doğrulandı (web arama, uutilsynet.no özetleri):

- Tilsynet for universell utforming av IKT (Uutilsynet), Digitaliserings-
  direktoratet altında, hem özel hem kamu kurumlarının IKT çözümlerini
  denetliyor.
- **1 Şubat 2026'dan itibaren yeni siteler için WCAG 2.2 AA zorunlu**;
  WCAG 2.1 A/AA halihazırda yasal asgari.

**Kaynaklar:**
[uutilsynet.no — Kva seier forskrifta?](https://www.uutilsynet.no/regelverk/kva-seier-forskrifta/153) ·
[uutilsynet.no — Regelverk og krav](https://www.uutilsynet.no/regelverk/regelverk-og-krav/746)

**Doğrulanmadı:** çok küçük işletmeler için (NAVIAR Care gibi bir ENK/AS
pilot aşamasında) forskriftte bir muafiyet eşiği olup olmadığı — bu ortamdan
forskriftin tam metnine erişilemedi, varsayılmadı.

### Uygulama — naviar-care.vercel.app denetlendi

`axe-core 4.13.0` ile gerçek denetim yapıldı (WCAG 2.1 A/AA + 2.2 AA
etiketleri), yayınlanan sayfanın build çıktısı üzerinde:

**İlk tarama — 2 ihlal bulundu:**
1. `color-contrast` (serious, 6 öğe) — açık zeminde altın/lacivert eyebrow
   etiketleri (`navy/50`, 3.38:1) ve koyu zeminde "01/02/03" adım
   numaraları (`offwhite/15`, 1.56:1) eşiğin altındaydı.
2. `definition-list` — hero istatistik bloğu `<dl>` içinde geçersiz
   `<div>` çocukları kullanıyordu.

**Düzeltildi ve yeniden dağıtıldı** (`dpl_HtrtGWEjp4ELNZY7yhSt9qvg5XLm`):
- Opaklık değerleri kontrast oranı hesaplanarak yükseltildi
  (`navy/50→65`, `offwhite/15→50`, `offwhite/40→50` — hepsi ≥4,5:1'e
  çıkarıldı, hesaplama WCAG'ın kendi luminans formülüyle yapıldı).
- `<dl>/<dt>/<dd>` geçersiz yapısı düz `<div>`'e çevrildi.

**İkinci tarama:** 0 ihlal, 17 test geçti.

Bu denetim yalnızca otomatik kontrol kapsamındaki maddeleri kapsar (renk
kontrastı, form etiketleri, ARIA, yapı bütünlüğü vb.) — klavye gezinme ve
ekran okuyucu testleri gibi manuel WCAG maddeleri henüz elle doğrulanmadı.
