# NAVIAR Care — pilot uygulama ağacı

Bu dizin, kullanıcının paylaştığı "NAVIAR Care Pilot Implementation Plan"ın
(26.08.2026) `docs/naviar/care-pilot/` altına yerleştirilmiş uygulamasıdır
— plandaki repo-kökü yolları (`docs/operations/`, `docs/legal/`, `site/`
vb.) QBLOGG'un kendi `docs/`'uyla karışmasın diye burada toplandı.

**Hiçbiri henüz üretimde değil.** Bu belgeler bir pilotun kâğıt üstü
hazırlığıdır; `decisions/decision-log.md`'deki 🔴 maddeler kapanmadan
(muhasebeci/hukuk danışmanı onayı) müşteri kabulü başlamaz.

## Okuma sırası

1. `../NAVIAR-CARE-IS-MODELI-KRITIK-ANALIZ.md` — üst seviye eleştirel analiz
   (bu dizin dışında, `docs/naviar/`'da)
2. `decisions/tjenestevurdering-2026-08-26.md` — bağımsız ikinci
   değerlendirme (tjenesteutvikler rolü), toplam puan 5,4/10
3. `legal/launch-review-brief.md` → `decisions/decision-log.md` — hukuk/
   muhasebe onay döngüsü
4. `operations/service-boundary-matrix.md` — üç hizmetin sınırları (her
   şeyin temeli)
5. `operations/` altındaki diğerleri — yardımcı işe alım, el kitabı, olay
   SOP'u
6. `research/`, `sales/`, `marketing/`, `partnerships/` — talep kanıtlama
7. `product/` + `site/index.html` — MVP dijital ürün
8. `finance/*.xlsx` — birim ekonomisi ve haftalık P&L (gerçek formüllerle,
   varsayımlar sarı işaretli)
9. `operations/weekly-pilot-scorecard.md` + `decisions/scale-gate-review.md`
   — 12 haftalık pilot ve 90 günlük karar kapısı
10. `product/post-pilot-product-requirements.md`,
    `strategy/*.md` — yalnız ölçekleme kapısı geçilirse

## Dizin haritası

```
care-pilot/
  decisions/    decision-log, scale-gate-review, tjenestevurdering
  legal/        launch-review-brief
  finance/      pilot-unit-economics.xlsx, weekly-cohort-p-and-l.xlsx
  operations/   service-boundary-matrix, helper-*, incident-sop,
                visit-update-template, weekly-pilot-scorecard,
                service-recovery-log
  research/     family-discovery-interviews
  sales/        pilot-offer-and-eligibility-script
  marketing/    message-test-scorecard
  partnerships/ referral-boundary
  product/      mvp-data-map, consent-and-communication-model,
                mvp-acceptance-tests, post-pilot-product-requirements
  site/         index.html — tek sayfalık MVP sitesi (noindex, fiyatsız,
                mailto: formu — gerçek CRM'e geçiş ayrı bir görev)
  strategy/     year-one-operating-plan, new-area-launch-checklist
```

## Bilinen sınırlar (dürüstçe)

- Bu ortamda LibreOffice/`soffice` çalışmıyor (bilinen sınır, bkz.
  `skill-observations/log.md` gözlem 3) — iki xlsx dosyasının formülleri
  **Python'da bağımsız olarak elle doğrulandı**, ama Excel/LibreOffice'in
  kendisiyle canlı yeniden hesaplanamadı. Dosyayı gerçek Excel/LibreOffice
  ile açtığınızda formüller otomatik hesaplanacak — bu normal.
- `site/index.html`'deki `pilot@naviarcare.example` bir yer tutucudur,
  gerçek adres netleşmeden değiştirilmedi.
- Tüm Norveç hukuku/vergi rakamları (AGA, feriepenger, OTP, MVA) arama
  motoru özetinden derlendi — resmî sayfalar bu ortamda erişilemedi
  (`EGRESS_BLOCKED`). Muhasebeci/hukuk danışmanı onayı olmadan hiçbiri
  kesin sayılmamalı.
