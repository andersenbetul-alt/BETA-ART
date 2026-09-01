# QBLOGG Studio — eleştirel iş modeli analizi

Tarih: 26.08.2026. Kapsam: **Studio katmanı** — bugün canlı olan, gelir
üretmesi beklenen tek iş (`docs/is-modeli.md`'deki "Intelligence" katmanı
ayrı ve henüz satılabilir değil, bkz. §10). Kanıt sınıfı işaretleri
`is-modeli.md` ile aynı kurala uyar: **[V]** doğrulanmış (depoda/config'te
kayıtlı), **[H]** hipotez (test edilecek), **[D]** dış varsayım.

---

## 1. Tek cümlelik model

QBLOGG Studio, kendi içerik ekibi olmayan KOBİ ve SaaS şirketlerine, tek bir
araştırmadan yedi kanala (blog, LinkedIn, sosyal, newsletter, SEO makalesi,
video senaryosu, YouTube taslağı) yayılan, insan editörlü içerik üretimini
abonelik paketi olarak satan bir hizmettir. [V]

## 2. Müşterinin gerçek problemi

| Problem | Neden gerçek |
|---|---|
| İçerik pazarlaması gerekli ama kendi ekip kurmak pahalı | Norveç'te ajans fiyatı 10.000–40.000 NOK/ay [D — ROADMAP'te kayıtlı, doğrulanmamış] |
| Serbest yazar ucuz ama tutarsız/yönetim yükü var | Her yazı ayrı brief, ayrı kalite kontrolü gerektirir [H] |
| AI ile kendi başına yazmak hızlı ama düşük güven | Marka sesi tutarsız, SEO'da "commodity içerik" cezası riski [D] |
| Çok dilli/çok kanallı yayılım tek başına zaman yutar | Bir araştırmayı 7 formata çevirmek manuel yapılırsa saatler alır [H] |

**Satın alma nedeni:** zaman tasarrufu + tutarlı marka sesi + "AI + insan
editör" garantisiyle risk azaltma — ajans güvenilirliği, serbest yazar
fiyatına yakın.

## 3. Hedef segment önceliklendirmesi

| Öncelik | Segment | Neden |
|---|---|---|
| 1 | Küçük-orta SaaS şirketleri | İçerik pazarlamasının değerini zaten biliyor, bütçesi var, İngilizce+çok dilli yayılımı doğal ihtiyaç |
| 2 | Yerel hizmet KOBİ'leri (Norveç) | Bütçe daha kısıtlı ama yerel dil/SEO avantajı güçlü farklılaştırıcı |
| 3 | Stüdyoya katılacak yazarlar | Gelir kaynağı değil, arz tarafı — üçüncül |

## 4. Rakipler ve alternatifler

| Alternatif | Güçlü yanı | Zayıf yanı | QBLOGG'un farkı |
|---|---|---|---|
| Serbest yazar (Upwork/Fiverr) | Ucuz | Tutarsız kalite, yönetim yükü müşteride | Tek pakette 7 çıktı, editör garantisi |
| Ajans | Güvenilir, hesap yöneticisi | Pahalı (10-40k NOK/ay [D]) | Ajans kalitesine yakın, çok daha düşük fiyat |
| DIY (ChatGPT vb.) | Bedava | Zaman maliyeti, marka sesi riski, SEO riski | Hazır sistem + insan editör |
| AI yazı araçları (Jasper vb.) | Ölçeklenebilir | Araç satar, hizmet değil — müşteri yine kendi yazar | Tam hizmet, araç değil |

## 5. Değer önerisi

> **Tek araştırmadan yedi kanala yayılan, insan editörlü, çok dilli içerik
> hattı — ajans güvenilirliği, serbest yazar fiyatına yakın maliyetle.**

Kanıt: site zaten bunu kendi üzerinde göstermiş durumda (`ai-icerik-studyosu`
yazısı = kendi ölçülmüş rakamlarıyla ilk vaka çalışması). [V]

## 6. Business Model Canvas

| Blok | İçerik |
|---|---|
| **Müşteri segmentleri** | SaaS KOBİ (öncelik 1), yerel hizmet KOBİ (öncelik 2), yazar adayları (arz tarafı) |
| **Değer önerisi** | 7 çıktı / 1 araştırma, insan editörlü, çok dilli, örnek teslimatla kanıtlı |
| **Kanallar** | Kendi blog + SEO, LinkedIn, Upwork/nDash/ProBlogger (kurucu profili), Medium/Substack dağıtım |
| **Müşteri ilişkileri** | Brief formu → keşif görüşmesi → paket satışı → aylık teslimat döngüsü |
| **Gelir akışları** | Tek Makale (proje bazlı), Büyüme + Stüdyo (aylık abonelik) |
| **Temel faaliyetler** | Araştırma, yazım, çeviri/yerelleştirme, editöryal kontrol, SEO, dağıtım |
| **Temel kaynaklar** | Kurucu + AI hattı, marka/site altyapısı (sıfır bağımlılık, düşük işletme maliyeti), 10 dilde i18n sistemi |
| **Temel ortaklar** | E-posta servisi (Buttondown), form servisi (Formspree — henüz bağlı değil [V]), gelecekte yazar ağı |
| **Maliyet yapısı** | Neredeyse sıfır sabit maliyet (hosting Vercel ücretsiz katman, domain, e-posta servisi); asıl maliyet kurucunun zamanı |

## 7. Gelir modeli ve fiyatlandırma — **ciddi bir kusur var**

| Paket | Fiyat (site) | Durum |
|---|---|---|
| Tek Makale | €150 | Proje bazlı |
| Büyüme | €900/ay | 4 makale + 20 LinkedIn + newsletter |
| Stüdyo | €2.500/ay | Tam hat + video/YouTube |

**Kritik bulgu (ROADMAP #67-68, zaten kayıtlı, karar bekliyor):** Bu
fiyatlar Norveç piyasasına göre **2-5 kat düşük**; Büyüme paketinin
**negatif marjda** olma ihtimali var (kurucunun zamanı fiyatlanmamış). Bu,
"az geliri az" değil "büyüdükçe zarar büyür" riski — müşteri sayısı arttıkça
kârlılık değil kurucunun tükenmesi hızlanır. **Bu analizin bulduğu en
önemli tek şey budur: fiyat kararı, kanal/içerik kararlarından önce
gelmeli.**

Öneri: [H] Büyüme paketi 900€ → en az 1.500-2.000€ bandına, Norveç NOK
gösterimiyle test edilmeli (ROADMAP #21: ajans fiyatı 10-40k NOK/ay,
QBLOGG'un konumu bunun altında ama üstünde kalmalı, en altında değil).

## 8. İlk 90 gün — düşük bütçeli MVP planı

| Gün | Odak | Çıktı |
|---|---|---|
| 1-30 | Gelir altyapısını gerçek kıl | E-posta servisini gerçekten bağla (config.js tek satır, şu an sızdırıyor [V] — gelir-sistemi.md §"en pahalı eksik"); fiyatları NOK'a çevir ve yukarı revize et; 2-3 gerçek vaka çalışması ekle |
| 31-60 | İlk müşteri kanıtı | 20 keşif görüşmesi hedefi (Upwork/LinkedIn'den); ilk ücretli müşteri; brief formunu Formspree'ye bağla (şu an yalnızca mailto) |
| 61-90 | Ölç ve düzelt | Gelir-sistemi.md'deki 4 sayıyı (oturum→abone→görüşme→müşteri) gerçek veriyle doldur; fiyat/paket revizyonu bu veriye göre |

## 9. Müşteri kazanma kanalları

| Tür | Kanal | Öncelik |
|---|---|---|
| Organik | SEO blog (10 yazı yayında, ön-render eksik [V — ROADMAP #11]) | Yüksek ama yavaş |
| Satış | Doğrudan LinkedIn + Upwork/nDash/ProBlogger üzerinden kurucu görünürlüğü | Yüksek, hızlı |
| Ortaklık | Affiliate altyapısı kurulu ama ilişki yok [V — gelir-sistemi.md] | Düşük öncelik, henüz erken |
| Reklam | Yok, açılmamalı (aylık 10.000 oturuma kadar [V — gelir-sistemi.md]) | En son |

## 10. Riskler, zayıf noktalar, başarısızlık varsayımları

| # | Varsayım | Neden riskli |
|---|---|---|
| 1 | "E-posta listesi zaten çalışıyor" | Yanlış — kayıt yalnız tarayıcıda kalıyor, hiç toplanmıyor [V, kritik] |
| 2 | "Mevcut fiyatlar sürdürülebilir" | Muhtemelen negatif marjda (ROADMAP #67) [H, kritik] |
| 3 | "Vaka çalışması olmadan da güven kurulur" | Anonim stüdyo dönüşümü düşürür (ROADMAP #7-8) [D] |
| 4 | "Tek kurucu her ölçekte teslim edebilir" | İlk 2-3 müşteride kapasite duvarına çarpılır [H] |
| 5 | "Q Master Plan (bu oturum) ile Q Private Intelligence (`is-modeli.md`) aynı anda sürdürülebilir" | **Yeni bulgu:** iki ayrı proje aynı "Q" ön ekini kullanıyor — biri iş-üretkenlik platformu (bu oturum), diğeri HNW üyelik/entelektüel içerik kulübü (`is-modeli.md`). Marka çakışması + odak bölünmesi riski |
| 6 | "Çok dilli site SEO avantajı veriyor" | İstemci taraflı dil değişimi; arama motoru tek HTML görüyor, ön-render olmadan vaat edilen fayda sınırlı [V, CLAUDE.md kendi notu] |

## 11. Hızlı deneyler (varsayımları test etmek için)

| Varsayım | Deney | Süre | Başarı ölçütü |
|---|---|---|---|
| Fiyat çok düşük mü | 5 keşif görüşmesinde yeni (yüksek) fiyatı söyle, tepkiyi ölç | 2 hafta | ≥2/5 "makul" diyor |
| E-posta gerçekten dönüşüyor mu | Servisi bağla, 30 gün ölç | 30 gün | ≥%1 ziyaretçi→abone |
| Vaka çalışması satışı artırıyor mu | 2 vaka çalışması ekle, öncesi/sonrası görüşme talebini karşılaştır | 30 gün | Fark ölçülebilir olsun |
| Upwork/LinkedIn hangi kanal daha çok görüşme getiriyor | Paralel 2 hafta dene | 2 hafta | Hangi kanaldan kaç görüşme geldi |

## 12. 12 aylık yol haritası ve KPI'lar

| Çeyrek | Odak | KPI |
|---|---|---|
| Ç1 | Gelir altyapısını düzelt, ilk müşteri | E-posta gerçekten toplanıyor, 1 ücretli müşteri, fiyat revize edildi |
| Ç2 | Tekrarlayan gelir | 3 aylık müşteri, aylık 5 brief formu (ROADMAP hedefi zaten var) |
| Ç3 | Kanal çeşitlendirme | Organik trafik 1.000/ay (ROADMAP hedefi), 2. kanal doğrulandı |
| Ç4 | Ölçek kararı | Yazar ağı mı büyütülür yoksa fiyat mı yükseltilir — Ç1-3 verisiyle karar |

Mevcut ROADMAP.md "Başarı ölçütleri" tablosuyla tutarlı; bu belge onu
tekrar etmiyor, önceliklendiriyor.

## 13. Şimdi yapılacak en önemli 5 adım

1. **E-posta servisini gerçekten bağla** (`config.js → newsletterEndpoint`) — tek satır, en yüksek etki/en düşük maliyet düzeltme.
2. **Fiyatları NOK'a çevirip yukarı revize et** — mevcut fiyatlar muhtemelen negatif marjda; bu, büyümeden önce düzeltilmesi gereken tek şey.
3. **2-3 gerçek vaka çalışması ekle** (kendi hattının rakamları zaten var, bir müşteri örneği eksik).
4. **20 gerçek keşif görüşmesi hedefiyle doğrudan satışa çık** (LinkedIn + Upwork) — organik SEO yavaş, ilk gelir doğrudan temastan gelir.
5. **"Q" marka çakışmasını çöz** — bu oturumun Q Master Plan'ı ile `is-modeli.md`'nin Q Private Intelligence'ı aynı ön eki kullanıyor; hangisi (varsa) gerçekten ilerletilecekse diğeri farklı adlandırılmalı.
