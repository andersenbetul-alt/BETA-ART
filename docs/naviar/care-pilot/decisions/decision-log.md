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
| 2 | İstihdam modeli teyidi | 🟡 | Plan gerekçeli olarak istihdamı seçti (Arbeidstilsynet'in employee-presumption kuralı); danışman teyidi bekleniyor | `launch-review-brief.md` §2 | 26.08.2026 (NAVIAR kararı) |
| 3 | MVA muamelesi | 🔴 | *(bekleniyor — NAVIAR yorumu: hizmet kasıtlı olarak sağlık kapsamı dışı tasarlandığı için muafiyet olası değil, %25 varsayılmalı)* | `NAVIAR-CARE-IS-MODELI-KRITIK-ANALIZ.md` §7 | — |
| 4 | İstihdam maliyeti kesin oranları | 🔴 | *(bekleniyor — tahmini: AGA %14,1, feriepenger %10,2, OTP %2, sigorta ~%0,5-1)* | Arama özeti, doğrulanmadı | — |
| 5 | Sigorta sağlayıcı/prim | 🔴 | *(bekleniyor)* | — | — |
| 6 | DPIA gerekli mi | 🔴 | *(bekleniyor)* | Datatilsynet eşiği | — |
| 7 | Polis kaydı türü | 🔴 | *(bekleniyor — plan bir tür varsayılmamasını açıkça uyarıyor)* | Plan, Task 2 Step 1 | — |
| 13 | İnsan kontrolü / RBAC / silme süresi / işlem kaydı (gelecek CRM için) | 🔴 | *(bekleniyor — henüz bir CRM/veritabanı yok; bu dördü CRM seçilirken zorunlu tasarım kriteri)* | `legal/ai-governance-and-accessibility.md` §3 | 01.09.2026 |
| 14 | WCAG 2.2 AA — iniş sayfası | 🟢 | axe-core denetimi: 2 ihlal bulundu (kontrast, geçersiz `<dl>`), düzeltildi, yeniden denetlendi — 0 ihlal | `legal/ai-governance-and-accessibility.md` §5 | 01.09.2026 |

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
