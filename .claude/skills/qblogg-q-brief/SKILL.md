---
name: qblogg-q-brief
description: QBLOGG'un üyelere özel "Q Brief" karar özetini üret — en fazla iki sayfalık, altı bölümlü, kaynak zorunlu format. Kullanıcı bir gelişme/haber/konu verip "Q Brief yaz", "brief hazırla", "karar özeti çıkar", "üyeler için özetle" dediğinde ya da uye/briefs tablosuna içerik üretileceğinde MUTLAKA bu beceriyi kullan; format serbest bırakılmaz.
owner: QBLOGG
---

# Q Brief üretimi

Q Brief, QBLOGG Intelligence katmanının temel ürünüdür (`docs/is-modeli.md`,
B1-B2 basamağı): bir gelişmeyi "ne oldu" haberinden **okurun kendi kararına
bağlanan** iki sayfalık özete çevirir. Değeri biçiminin katılığındadır —
üye her hafta aynı iskeleti gördüğü için 3 dakikada tarayabilir.

## Altı bölüm — sıra ve adlar değişmez

1. **Ne değişti?** — olgu, 2-4 cümle. Yalnız doğrulanabilir gelişme; yorum yok.
2. **Neden önemli?** — bağlam ve mekanizma. Burada "bence" yok; nedensellik var.
3. **Sizi nasıl etkileyebilir?** — okur profiline (şirket sahibi / yatırımcı /
   aile) bağlanan somut temas noktaları. "Etkileyebilir" kipi korunur —
   kesinlik iddiası yasak.
4. **En büyük risk** — tek risk seç. Liste değil; en büyüğünü seçmek analizin
   kendisidir.
5. **Hangi göstergeler izlenmeli?** — 2-4 erken sinyal, her biri gözlemlenebilir
   (bir tarih, bir yayın, bir fiyat, bir düzenleme adımı).
6. **Şimdi sorulacak soru** — okurun kendi danışmanına/ekibine soracağı TEK
   soru. Brief'in çıkışı eylem değil sorudur; karar okurundur.

Uzunluk: toplam 250-600 kelime. İki sayfayı aşan brief, brief değildir.

## Üç etiket disiplini

Her paragraf üç türden birine aittir ve karışırsa okurun güveni düşer:
- **bilgi** — kaynaklı olgu (1-2. bölümün gövdesi)
- **görüş** — QBLOGG'un değerlendirmesi; "değerlendirmemiz", "okumamız" gibi
  açık işaretle sunulur
- **senaryo** — koşullu gelecek ("X olursa Y"); asla kesinlik dilinde yazılmaz

## Kaynak ve dürüstlük kuralları (CLAUDE.md ile aynı hizada)

- "Ne değişti" bölümündeki her olgu için en az bir kaynak; brief sonunda
  `Kaynaklar:` listesi. Adresi doğrulanmamış kaynak uydurma bağlantıyla
  yazılmaz — adıyla yazılır.
- Rakam uydurulmaz; ikincil kaynaktan gelen rakam "X'e göre" ile taşınır.
- Yatırım tavsiyesi, sağlık tavsiyesi, hukuki görüş verilmez. Konu bu
  alanlara değiyorsa kapanışa tek cümlelik sınır notu eklenir
  ("Bu brief bilgilendirme amaçlıdır; ... görüşü değildir").
- Abartı sıfır: "devrim", "çığır" gibi kelimeler yerine ölçülebilir ifade.

## Çıktı biçimi

Varsayılan çıktı, düz markdown (başlıklar yukarıdaki altı ad). Kullanıcı
"veritabanına" derse ek olarak `uye/seed.sql` desenindeki INSERT üretilir:
`slug` (kebab-case), `title` (≤80 karakter), `summary` (1-2 cümle, herkese
görünür), `body_md` (altı bölüm + kaynaklar), `published_at`, `is_sample`
(varsayılan false). SQL'de tek tırnaklar `''` ile kaçırılır; gövde
`E'...'` içinde `\n` ile.

Örnek brief depoda: `uye/seed.sql` (örnek işaretli, gerçek yazıdan türetilmiş) —
tereddütte ona bak.

## Kalite kapısı

Teslimden önce şu dördünü kontrol et: (1) altı bölüm tam ve sırasında mı;
(2) her olgunun kaynağı var mı; (3) görüş/senaryo cümleleri işaretli mi;
(4) 6. bölüm gerçekten soru mu (eylem talimatı değil). Biri eksikse teslim
etme, tamamla.
