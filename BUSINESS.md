# BETA ART / Cobban — İş Modeli

> **Bu belge çıkarım değil, öneridir.** Depoda ticari hiçbir veri yok: fiyat
> yok, kitle tanımı yok, ürün yok, satış kanalı yok. Aşağıdakiler gerçek
> bilgiden türetilmedi — karar verilmesi için masaya konmuş seçeneklerdir.
> Karar verildiğinde `DECISIONS.md` içine D-006 olarak girmeli.

## Deponun gerçekten söylediği tek şey

Navigasyon: **Home · Work · About · Contact**

Burada `Shop`, `Store` veya `Prints` yok. `Contact` var. Bu bir tercihtir ve
bir iş modeli ima eder: **talep üzerine satış** (soruşturma → görüşme →
fiyat), doğrudan e-ticaret değil.

Bu tesadüf olabilir — D-003 kararı verilirken bu düşünülmedi, konvansiyonel
set seçildi. Ama şu an sitenin mimarisinde yazılı olan model budur. Farklı
bir model isteniyorsa navigasyon da değişmeli.

## Dört model

| Model | Kim öder | Ne için | Site neyi gerektirir | Stack etkisi (D-002) |
| ----- | -------- | ------- | -------------------- | -------------------- |
| **A. Orijinal eser satışı** | Koleksiyoner, galeri | Tek parça, yüksek fiyat | Yüksek çözünürlüklü galeri, eser künyesi, soruşturma formu | Statik yeterli |
| **B. Baskı / edisyon** | Genel alıcı | Çoğaltılabilir, orta fiyat | Sepet, stok, ödeme, kargo | **Statik yetmez** — Stripe Payment Links veya Shopify buy-button gerekir |
| **C. Komisyon / sipariş** | Birey, kurum | Hizmet | Süreç sayfası, brief formu, fiyat aralığı | Statik yeterli |
| **D. Lisanslama** | Marka, yayıncı | Görsel kullanım hakkı | Lisans şartları, portfolyo, iletişim | Statik yeterli |

**E. Galeri temsili** ayrı bir kategori: site gelir üretmez, *güvenilirlik*
üretir. Basın dosyası, CV, sergi geçmişi. Satış galeri üzerinden yürür.
Birçok sanatçı için gerçek model budur ve siteden para beklemek yanlış olur.

## Maliyet yapısı

| Kalem | Tahmini | Not |
| ----- | ------- | --- |
| Hosting | ~0 | Statik site; Vercel/Netlify/GitHub Pages ücretsiz katman |
| Alan adı | yıllık ~15 USD | Tek gerçek sabit gider |
| Ödeme komisyonu | işlem başına ~%3 | Yalnızca B modelinde |
| Baskı/kargo | değişken | Yalnızca B modelinde; print-on-demand ile stoksuz |
| Geliştirme | zaman | Şu an sıfır para maliyeti |

Sabit gider neredeyse yok. Bu, modeli seçmeden yayına girmenin maliyetinin
düşük olduğu anlamına gelir — acele karar vermeye gerek yok.

## Öneri

**A + C ile başla, B'yi erteleme kararı olarak kaydet.**

Gerekçe: A ve C mevcut statik mimariye uyar, ek maliyet getirmez ve `Contact`
odaklı navigasyonla tutarlıdır. B (baskı satışı) tek başına stack kararını
yeniden açar — sepet, stok ve ödeme statik HTML'e sonradan iliştirilebilir
(Stripe Payment Links) ama bu bir mimari borçtur, bilinçli alınmalı.

En küçük çalışan adım: `Work` sayfasında eserler + her eserde "Bu eser
hakkında" bağlantısı → `Contact`. Ödeme altyapısı yok, envanter yok, iade
politikası yok. Talep geldikçe ölçeklenir.

## Karar için gereken bilgi

Bu belge şu üç soru cevaplanmadan tamamlanamaz:

1. **"Cobban" nedir?** (D-004) Marka mı, koleksiyon mu, kişi mi? Ürünün adı
   mı, sanatçının adı mı? İş modelinin merkezinde bu var.
2. **Kim alıcı?** Koleksiyoner, genel tüketici, kurum — üçü üç ayrı site.
3. **Satış zaten bir yerde oluyor mu?** Galeri, Instagram, fuar? Varsa site
   onu desteklemeli, onunla rekabet etmemeli.
