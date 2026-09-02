# Beta Art — Sosyal Medya Kanal Stratejisi

**Tarih:** 02.09.2026 · **Durum:** plan — hiçbir kanal henüz açılmadı.
Marka: doğrulanmış insan fotoğrafçılığı arşivi ve lisans platformu
("Photography with proof": RAW orijinaller, çekim kaydı, üreticinin
imzaladığı lisans). Sesi: müze/arşiv sakinliği — kanıt gösterir, abartmaz.

## 0. Açılış kapıları (bunlar olmadan kanal AÇILMAZ)

1. **Gerçek görseller** — sitedeki 12 plaka hâlâ yer tutucu
   (`DevelopmentNotice` açık). Yer tutucu görselle kanal açmak "kanıt"
   markasını ilk gönderide yalanlar.
2. **İzlenebilir hedef** — bio bağlantısının gideceği canlı adres
   (beta-art.com DNS'i bağlı değil; geçici olarak lovable.app adresi
   kullanılabilir ama kalıcı hedef alan adıdır).
3. **Gerçek iletişim e-postası** (`site.ts`'te hâlâ "to be supplied").
4. Kullanıcı adları alınırken aynı gün sitedeki footer'a eklenmeli —
   tek kaynak `src/config/site.ts` (uydurma bağlantı siteye girmez;
   footer'a yalnız açılmış hesap yazılır).

## 1. Kanal önceliği (kitle ↔ kanal eşlemesi)

| Öncelik | Kanal | Kitle | Neden |
|---|---|---|---|
| 1 | **Instagram** | fotoğraf alıcısı + genel | Fotoğrafın ana mecrası; feed = vitrindeki arşiv. |
| 2 | **Pinterest** | lisans arayan tasarımcı/editör | Arama ömrü uzun; her plaka pin'i yıllarca lisans sayfasına trafik taşır. |
| 3 | **LinkedIn** | B2B lisans alıcısı (ajans, yayıncı) | "Kanıtlı fotoğraf lisansı" kurumsal alıcıya burada anlatılır. |
| 4 (sonra) | YouTube Shorts | süreç meraklısı | "Behind the capture" dikeyleri; ancak düzenli çekim kaydı videosu üretilebiliyorsa. |
| — | TikTok | — | Şimdilik yok: kadans yükü yüksek, arşiv sesiyle uyumu zayıf. Boşuna hesap açıp boş bırakma. |

## 2. Kullanıcı adı adayları (müsaitlik DOĞRULANMADI — alınmadan yazılmaz)

Sıra ile denenecek: `betaart` → `beta.art` → `betaartarchive` →
`betaart.no`. Üç kanalda da AYNI adın alınabilmesi öncelik; hangisi üçünde
birden boşsa o alınır. Alınan ad `site.ts`'e işlenir; bu belge güncellenir.

## 3. Bio metni (EN — üç kanalda uyumlu)

> Beta Art — verified human photography.
> RAW originals archived. Capture records preserved. Licensed by the maker.
> ↳ [site adresi]

Kurallar: "AI-free" polemiği yok (pozitif kanıt dili: "human-made,
documented"); emoji yok; ® / "protected" dili yok (tescil kapısı açık).

## 4. İçerik sütunları (haftalık kadans: IG 3 · Pinterest 2 · LinkedIn 1)

1. **Plaka spotu** — bir plaka + katalog numarası (BA-001…) + çekim
   kaydından iki satır (yer, koşul, ekipman). Format: tek görsel veya
   3'lü seri. CTA: "Licence via catalogue no."
2. **Kanıt anlatımı** — provenance mini-açıklama: RAW nedir, çekim kaydı
   görselle nasıl seyahat eder, lisansı neden üretici imzalar. Format:
   IG carousel / LinkedIn metin. Bu sütun markanın farkını taşır.
3. **Behind the capture** — çekim anından kare/kısa video; "MYSTERY,
   NOT ABSENCE" değil (o HXI kuralı) — burada üretici görünür, çünkü
   kanıt zinciri insana dayanır.
4. **Lisans eğitimi** — Personal / Commercial / Extended yalın dilde;
   ayda 1, LinkedIn ağırlıklı. Fiyat yazılırken test-fiyat notu korunur
   (kesin vaat dili yasak — QBLOGG kural 8 ile aynı ilke).
5. **Arşivden süreç** — reddedilen kareler, seçim kriterleri: "arşive
   neden her kare girmez". Küratörlük hissi.

Görsel dil: sitenin müze estetiği — bol boşluk, tutarlı ton, kapakta
katalog numarası. Şablonlar tek kaynaktan üretilmeli (marka üretim betiği
yazılana dek elle; QBLOGG kural 7'nin yeniden-üretilebilirlik ilkesi hedef).

## 5. Ölçüm (takipçi sayısı birincil ölçüt DEĞİL)

- Birincil: bio/gönderi → site tıklaması ve **lisans talebi formu** açılışı.
- İkincil: kaydetme (IG save, Pinterest save) — arşiv içeriği için doğru sinyal.
- Aylık gözden geçirme: en çok kaydedilen sütun kadansta öne alınır.

## 6. Yol haritası

1. Açılış kapıları (§0) kapanır → kullanıcı adları alınır (§2).
2. İlk 9 gönderi hazır olmadan yayına başlanmaz (IG ızgarası boş açılmaz):
   3 plaka spotu + 3 kanıt anlatımı + 3 süreç.
3. Footer + `site.ts` güncellenir; kanallar siteyle çapraz bağlanır.
4. 4 hafta kadans → ilk ölçüm → kadans/kanal düzeltmesi.
5. YouTube Shorts kararı ilk ölçümden sonra.

*Not: Beta Art sloganı "TRUST THE EVIDENCE BEHIND EVERY IMAGE." sosyalde
serbestçe kullanılabilir; marka tescili değerlendirmesi için
`brand/hxi/TESCIL-ARASTIRMASI.md` §3'e bakın (tanımlayıcılık riski notu).*
