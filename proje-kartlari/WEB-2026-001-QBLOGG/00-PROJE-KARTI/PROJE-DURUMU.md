# WEB-2026-001 QBLOGG — Güncel Durum

**Son güncelleme:** 2026-09-03  
**Durum:** Yayında (Bakımda)

## Canlı Ortam

| Alan | Değer |
|---|---|
| Üretim URL | https://qblogg.vercel.app |
| Hedef alan adı | https://qblogg.com (DNS bağlı; TXT doğrulama + Verify & Claim bekliyor) |
| Hosting | Vercel — Proje: `qblogg`, Takım: BET-ART (`team_xNtowH7U0jXQrI53DFJFzH2o`) |
| Son dağıtım tetikleyici | Manuel push → Vercel redeploy |

## Versiyon

| Alan | Değer |
|---|---|
| Güncel sürüm | 1.7.0 (tahmini — Git tag yok, commit sayısına göre) |
| Son doğrulanmış kararlı commit | `2c8edd6` (2026-09-02) |
| Git dalı (yayın) | `main` |
| Git dalı (geliştirme) | `claude/naviar-dosylari-oijd0p` |

## Sağlık Kontrolü (2026-09-03)

`npm run check` sonucu — **8/8 yeşil, 0 uyarı:**

| Kontrol | Sonuç |
|---|---|
| i18n: 10 dil × 236 anahtar | ✓ |
| posts: 11 yazı × 10 dil | ✓ |
| html: çiftlenen id/script | ✓ |
| html: data-i18n sözlük eşleşmesi | ✓ |
| html: yerel bağlantı/varlık | ✓ |
| sitemap: 18 URL | ✓ |
| html: stil ve betik yükleme | ✓ |
| json-ld: statik blok | ✓ |

## Açık Sorunlar

| Öncelik | Sorun | Sorumlu |
|---|---|---|
| 🔴 | `config.js → payLinks` boş — Stripe gelir kapısı kapalı | Kullanıcı |
| 🔴 | Git tag yok — sürüm geri alımı güç | Teknik |
| 🟡 | Buttondown kullanıcı adı `tatil` → `qblogg` olmalı | Kullanıcı |
| 🟡 | `qblogg.com` DNS bağlama: TXT + Verify & Claim | Kullanıcı |
| 🟡 | Koşullar sayfasında 10 `[DOLDURULACAK]` yasal alan | Kullanıcı |
| 🟡 | Fiyatlar NOK'a dönüştürülmemiş | Kullanıcı |
| 🟢 | Gerçek e-posta ve sosyal hesaplar `config.js`'e yazılmadı | Kullanıcı |
| 🟢 | Vercel–GitHub otomatik dağıtım entegrasyonu kurulmamış | Kullanıcı |

## Sonraki Adım

1. `config.js → payLinks: {p1:'...', p2:'...', p3:'...'}` doldur
2. `config.js → prices` NOK fiyatlandırma
3. `main`'e push → Vercel redeploy
4. Git tag: `git tag qblogg-v1.7.0 && git push origin qblogg-v1.7.0`
