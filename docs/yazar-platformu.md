# QBLOGG Yazar Platformu — değerlendirme ve v1 tasarımı

**Durum: TASLAK — model ve öncelik kararı kullanıcıda (bkz. §8).**
Tarih: 24.08.2026. İşaretler: [V] doğrulanmış · [H] hipotez · [D] dış iddia.

## 1. Fikir

QBLOGG, insanların **kendi bloglarını yayınlayabilecekleri ve kitaplarının
tanıtımını yapabilecekleri** bir platform olsun. Yazar tarafı: profil +
yazılar + kitap vitrini (kapak, tanıtım, satın alma bağlantısı). Okur
tarafı: dert/niyet temelli keşif — kullanıcının bu oturumda paylaştığı
filtre kodu (kategori + niyet + süre, küratoryal sıra) bu tarafın
prototipidir.

## 2. Dürüst değerlendirme

**Güçlü yanlar:**

- İkincil kitle zaten yazarlar [V]: `work.html` bugün yazar başvurusu
  topluyor. Bu pivot yazarı "tedarikçi"den "müşteri"ye çevirir — aynı
  kitleye ikinci bir değer önerisi, sıfırdan kitle değil.
- Altyapının yarısı hazır [V]: Supabase üye sistemi (auth + RLS + profil)
  dün kuruldu; `briefs` tablosunun deseni "yazar yazıları"na birebir
  genellenir. Çok dilli site, tema, tasarım sistemi duruyor.
- Kitap tanıtımı, reklam bildirimi altyapısıyla uyumlu [V]: `{aff:}`
  bloğu, `rel="sponsored"` ve bildirim kutusu deseni zaten kodda.

**Riskli yanlar (açıkça):**

- **İki taraflı pazar soğuk başlar.** Yazar, okur olmadan gelmez; okur,
  içerik olmadan gelmez. Açık kayıtla başlamak boş bir platform gösterir.
- **Marka çelişkisi riski.** QBLOGG'un bugüne kadarki tek iddiası
  kalite kapısıdır (16 maddelik görünürlük kuralı, uydurma yasağı).
  Denetimsiz kullanıcı içeriği bu iddiayı sulandırabilir. Çözüm modele
  gömülmeli (bkz. §3 öneri).
- **Bu, bir haftadaki üçüncü stratejik yön.** Studio [V, bugün satılabilir
  tek şey] → Intelligence (B0–B4, `is-modeli.md`) → Platform. Üçü aynı
  anda inşa edilirse hiçbiri kanıt eşiğine ulaşamaz. Bu belge platformu
  Intelligence'ın YERİNE değil, YANINA koyar; önceliği kullanıcı seçer
  (§8/2). Ortak payda: üç modelin de aynı üye sistemini kullanması.
- **Moderasyon ve hukuk yükü gerçek.** Kullanıcı içeriği = yayıncı değil
  aracı konumu, ama Norveç pazarlama mevzuatı (reklam işareti), telif ve
  GDPR yükümlülükleri kalır (§6). Açık modelde bu yük en büyüktür.

## 3. Üç model seçeneği

| Model | Ne demek | Artı | Eksi |
|---|---|---|---|
| **A. Davetli/küratörlü** (öneri) | Yazar başvurur, editoryal kapıdan geçer; yayın onayla açılır | Marka kalite iddiası korunur; moderasyon yükü küçük; soğuk başlangıç kontrollü | Büyüme yavaş |
| B. Açık kayıt (Medium tarzı) | Herkes kayıt olur, yazar | Ölçek potansiyeli | Moderasyon + hukuk yükü en yüksek; boş-platform ve kalite riski |
| C. Sadece kitap vitrini | Blog yok; yazar profili + kitap sayfası + niyet temelli keşif | En küçük inşa; en hızlı canlıya çıkış | "Kendi blogunu yayınla" vaadini ertelemek |

**Öneri: A ile başla, C'yi A'nın ilk teslimatı yap.** Yani: davetli
yazar programı; v1'de her yazarın profili + kitap vitrini + (isterse)
yazıları. Açık kayıt (B) ancak pilot eşiği geçilirse (bkz. §7).

## 4. v1 mimarisi — mevcut altyapının üstüne

İlke korunur: **ana site statik ve sıfır bağımlılık kalır.** Dinamik her
şey ayrı `uye/` uygulamasında (Supabase) yaşar; ana siteye yalnız statik
tanıtım/keşif sayfası eklenir.

Şema genişlemesi (uye/schema.sql üstüne, taslak):

- `authors` — profiles'a 1:1; `slug`, `bio`, `onaylandi` (editoryal kapı).
- `books` — yazar kitapları: başlık, tanıtım, kapak adresi, satınalma
  bağlantısı, `kategori`, `etiketler`. Reklam niteliği sabittir:
  arayüz her kitap kartını "tanıtım" olarak işaretler,
  dış bağlantı `rel="sponsored nofollow noopener"` alır.
- `author_posts` — briefs deseninin genellemesi: markdown gövde,
  `yayin_durumu` (taslak → incelemede → yayında), RLS: herkese yalnız
  `yayında`; yazara kendi satırları.
- Niyet katmanı: `intents` + kitap eşlemesi — paylaşılan filtre kodundaki
  `NIYETLER` deseni; keşif sayfası "kitap adı değil dert arar" ilkesiyle.

Okur tarafı v1'de giriş istemez (yayında olan içerik herkese açık);
yazar tarafı mevcut magic-link girişini kullanır. XSS kuralı üye
uygulamasındaki gibi: gövde `textContent`/güvenli dönüştürücü ile,
ham HTML asla.

SEO sınırı [V]: Supabase'den istemci tarafında çekilen içerik arama
motoruna görünmez (bilinen sınır, CLAUDE.md). v1'de kabul edilir;
platform tutarsa ön-render adımı zaten yol haritasında.

## 5. Gelir — "Abonnement og priser"

Rakam uydurulmaz; fiyat noktaları pilotta belirlenir. Kayıt altına
alınan seçenekler (hepsi [H]):

1. **Yazar aboneliği:** ücretsiz katman (profil + N yazı + 1 kitap) +
   ücretli katman (sınırsız yazı, çoklu kitap, öne çıkarma). Fiyat
   pilotta test edilir — B2'deki A/B disipliniyle.
2. **Öne çıkarma/vitrin ücreti:** ana sayfa veya keşif sayfasında
   "öne çıkan kitap" yeri; süreli, açıkça "tanıtım" işaretli.
3. **Komisyon değil bağlantı:** satın alma yazarın kendi bağlantısına
   gider (Amazon, forlag, kendi sitesi); v1'de komisyon altyapısı yok —
   karmaşıklığı almadan önce talep kanıtı gerekir.

Stripe tarafı mevcut planla birleşir: Payment Link → `plan_status`
deseni yazar aboneliğine de uyar. Norveç kart kesintisi (%1,5 + 1,80 kr
yurt içi [D — karar öncesi teyit]) fiyata dahil düşünülür.

## 6. Hukuk ve kural kapıları (v1'de zorunlu)

- Kitap kartları ve öne çıkarmalar **açık "tanıtım/annonse" işareti**
  taşır; gizli reklam yasağı (mevcut ilke) platforma da uygulanır.
- `kosullar.html` platforma göre güncellenir: içerik sorumluluğu
  yazarda, telif beyanı, kaldırma süreci (bildir-kaldır), yaş sınırı.
  Norveç mevzuatındaki karşılıklar (e-ticaret yasası, markedsføringsloven)
  yayına açılmadan bir avukatla teyit edilir [D — bu ortamdan
  doğrulanamaz; is-modeli §9/7 ile aynı madde].
- GDPR: mevcut asgari-veri ilkesi korunur; yazar profili yalnız yazarın
  kendi girdiği alanları gösterir.
- QBLOGG'un kendi yazıları için görünürlük kuralı aynen kalır; yazar
  içeriği ayrı etiketlenir ("yazar içeriği") — iki kalite rejimi
  görsel olarak karışmaz.

## 7. Pilot planı (eşikli, güven merdiveni disipliniyle)

- **P0 — inşa (1–2 hafta):** şema genişlemesi + yazar paneli (giriş,
  profil, kitap ekleme, yazı taslağı) + keşif sayfası (niyet filtresi).
- **P1 — davetli pilot:** 5–10 yazar elle davet edilir (work.html'e
  başvuranlar ilk aday havuzu). Eşik: ≥5 yazar profil+kitap yayınlar
  ve ≥3'ü ikinci ayda da içerik ekler.
- **P2 — ödeme kanıtı:** ücretli katman/öne çıkarma teklif edilir.
  Eşik: ödeyen yazar sayısı (hedef rakam pilotta belirlenir; şimdiden
  uydurulmaz).
- P1 eşiği tutmazsa açık kayıt (model B) inşa edilmez; plan yana
  revize edilir.

## 8. Açık kararlar (kullanıcıda)

1. Model seçimi: A (davetli, öneri) / B (açık) / C (yalnız vitrin).
2. Öncelik: Platform mu, Intelligence (B0 profesör işi) mi önce; yoksa
   Intelligence beklemeye mi alınır. (Studio her durumda açık kalır.)
3. P0 inşa emri: şema + yazar paneli + keşif sayfası ne zaman yazılsın.
4. Ücretli katmanın içeriği ve fiyat testi (P2'de, rakamsız başlarız).
