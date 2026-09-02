# NAVIAR Care — Karar günlüğü

Kaynak: NAVIAR Care Pilot Implementation Plan, Task 1 Step 2/4 ve Task 5
Step 4 (scale-gate). **Danışman/muhasebeci cevapları burada birebir
alıntılanır** — özetlenmez, yorumlanmaz. Yorumlanmış hâli varsa ayrıca
"NAVIAR yorumu" satırında belirtilir.

**Durum kodu:** 🟢 Yeşil (karar verildi, uygulanabilir) · 🟡 Sarı (kısmen
netleşti, koşullu) · 🔴 Kırmızı (açık, lansmanı bloke eder)

## Açık kararlar (launch-review-brief.md'den)

| # | Konu | Durum | Karar/cevap (birebir) | Kaynak | Tarih |
|---|---|---|---|---|---|
| 1 | Şirket biçimi (AS/ENK) | 🔴 | *(bekleniyor)* | Muhasebeci | — |
| 2 | İstihdam modeli teyidi | 🟡 | Plan gerekçeli olarak istihdamı seçti (Arbeidstilsynet'in employee-presumption kuralı); danışman teyidi bekleniyor. 02.09.2026: `/IQ100` kararı frilanser/oppdragstaker ayrımını da netleştirilmesi gereken bir soru olarak işaret etti (Skatteetaten kaynağı) — mevcut "istihdam" kararıyla çelişebilir, danışman teyidinde bu iki kaynak birlikte değerlendirilmeli | `launch-review-brief.md` §2, `strategy/go-to-market-sequencing.md` | 26.08.2026 (NAVIAR kararı); 02.09.2026 (ek kaynak) |
| 3 | MVA muamelesi | 🔴 | *(bekleniyor — NAVIAR yorumu: hizmet kasıtlı olarak sağlık kapsamı dışı tasarlandığı için muafiyet olası değil, %25 varsayılmalı)* | `NAVIAR-CARE-IS-MODELI-KRITIK-ANALIZ.md` §7 | — |
| 4 | İstihdam maliyeti kesin oranları | 🔴 | *(bekleniyor — tahmini: AGA %14,1, feriepenger %10,2, OTP %2, sigorta ~%0,5-1)* | Arama özeti, doğrulanmadı | — |
| 5 | Sigorta sağlayıcı/prim | 🔴 | *(bekleniyor)* | — | — |
| 6 | DPIA gerekli mi | 🔴 | *(bekleniyor)* | Datatilsynet eşiği | — |
| 7 | Polis kaydı türü | 🔴 | *(bekleniyor — plan bir tür varsayılmamasını açıkça uyarıyor)* | Plan, Task 2 Step 1 | — |
| 13 | İnsan kontrolü / RBAC / silme süresi / işlem kaydı (gelecek CRM için) | 🔴 | *(bekleniyor — henüz bir CRM/veritabanı yok; bu dördü CRM seçilirken zorunlu tasarım kriteri)* | `legal/ai-governance-and-accessibility.md` §3 | 01.09.2026 |
| 14 | WCAG 2.2 AA — iniş sayfası | 🟢 | axe-core denetimi: 2 ihlal bulundu (kontrast, geçersiz `<dl>`), düzeltildi, yeniden denetlendi — 0 ihlal | `legal/ai-governance-and-accessibility.md` §5 | 01.09.2026 |
| 15 | Incognito/temiz oturum testi — iniş sayfası | 🟢 | Playwright'ta sıfır depolama durumuyla (çerez/localStorage yok) test edildi: form gönderimi hiçbir şey kaydetmiyor, üçüncü taraf isteği yok. Bulunan tek sorun: `favicon.ico` 404 (site hiç favicon tanımlamıyordu) — NAVIAR master monogram ikonu (`brand/naviar/master/naviar-icon-favicon.svg`) eklendi, düzeltildi, yeniden dağıtıldı, 0 konsol hatası | `dpl_kfm1L9e38xpiL1TYzqw6fPjWfuP8` | 01.09.2026 |
| 16 | Pazara giriş sıralaması: kurum önce, aile sonra | 🟢 | Proje lideri kararı (`/IQ100`): ilk ödeyen müşteri kurum (belediye/BPA/dagsenter), aile ikinci aşamada doğrudan ödeyen. İlk hizmet: Aktivitet & Hverdagsstøtte. Üç aşamalı gelir modeli ve MVP kapsam sınırları karara bağlandı. `strategy/year-one-operating-plan.md`'nin aile-odaklı Yıl 1 hedefini geçersiz kılar — o belge doldurulurken bu sıralama esas alınmalı | `strategy/go-to-market-sequencing.md` | 02.09.2026 |
| 17 | Ödeme sağlayıcı tercihi | 🟡 | Kullanıcı, canlı ödeme/faturalama kurulduğunda değerlendirilecek sağlayıcıları belirtti: Stripe, PayPal, Vipps, DNB, Klarna. *(bekleniyor — henüz canlı gelir yok (madde 16), bu yüzden entegrasyon henüz kurulmadı; hangisi/hangileri gerçekten bağlanacak, Norveç pazarında Vipps'in yaygınlığı ve her sağlayıcının işlem ücretleri karşılaştırılarak seçilmeli. QBLOGG'un Stripe Norveç ücreti notu — `CLAUDE.md`: yurt içi kart %1,5 + 1,80 kr — referans alınabilir ama NAVIAR CARE için ayrıca doğrulanmalı.)* | Kullanıcı mesajı, 02.09.2026 | 02.09.2026 |

## Ürün kararları (Open Product Decisions Before First Public Quote)

| # | Konu | Durum | Karar | Tarih |
|---|---|---|---|---|
| 8 | Eve anahtar erişimi | 🟢 | Pilotta NAVIAR anahtar tutmaz (plan önerisi benimsendi) | 26.08.2026 |
| 9 | Dil vaadi | 🔴 | *(bekleniyor — Norveççe mi, Norveççe+İngilizce mi)* | — |
| 10 | Aile güncelleme varsayılanı | 🔴 | *(bekleniyor — asla ödeyenin ilişkisinden çıkarılmaz, alıcı belirler)* | — |
| 11 | Çalışma saatleri/nöbet kapsamı | 🔴 | *(bekleniyor — reklamdaki saat gerçek rotayla eşleşmeli, 7/24 ima edilmez)* | — |
| 12 | İptal/hastalık politikası | 🔴 | *(bekleniyor — ilk faturadan önce karar verilmeli)* | — |

## Ölçekleme kapısı kararı (90. gün, Task 5 Step 4 — doldurulacak)

| Ölçüt | Hedef | Gerçekleşen | Geçti mi? |
|---|---|---|---|
| Aktif ödeyen aile | 15+ | — | — |
| 4 haftalık devam | %70+ | — | — |
| Zamanında varış | %90+ | — | — |
| Çözülmemiş ciddi güvenlik/gizlilik olayı | 0 | — | — |
| Yuvarlanan katkı marjı | %30+ | — | — |
| Koordinatör nöbet yükü | Sürdürülebilir | — | — |

**Kural (plan, Task 5 Step 4):** herhangi bir güvenlik/gizlilik koşulu
başarısız olursa, büyüme durur ve yeni aile kabul edilmeden önce düzeltme
yapılır — diğer ölçütler yeşil olsa bile.
