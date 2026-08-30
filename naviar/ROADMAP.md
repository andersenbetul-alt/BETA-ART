# NAVIAR CARE — Yol Haritası

**Dizin:** `naviar/`  
**Kaynak:** `betulandersen-droid/naviar-care-1` (private)  
**Vercel:** `naviar-care-1` (bet-art takımı)  
**Production URL:** `naviar-care-1-psi.vercel.app`  
**Durum:** ⚠️ Preview'da (production'a çıkarılmadı)

---

## Konsept

Norveçli yaşlı bireyler ve yakınları (pårørende) için dijital koordinasyon platformu.  
**"Trygg koordinering for eldre og pårørende."**

**Neden var:**
- Norveç'te pårørende NAV/belediye sistemlerinde kaybolabiliyor
- Yaşlı bakım hizmetleri karmaşık ve dağınık; dijital yardım çok az
- Güven merkezli, panik üretmeyen, sade bir koordinasyon aracı

**Hedef kitle:**
- Yaşlı yakını olan orta kuşak Norveçliler (35–60 yaş)
- Yaşlı bireyler (65+, dijital yardıma ihtiyacı olanlar)

**Tasarım yönü:**
- Sade, güven veren, panikletmeyen
- Norveç kamu hizmetleri tonunda (resmi ama soğuk değil)
- Türkçe: navigasyon için platform dili; hedef kullanıcı Norveçce

---

## Pilot projeler

| # | Proje | Açıklama |
|---|---|---|
| 1 | Pårørende i NAV-systemet | NAV başvuruları, kararlar, itirazlar adım adım |
| 2 | Pårørende og kommunen | Bakım ve belediye hizmetleri rehberi |
| 3 | Digital hjelp sammen | Dijital hizmetlerde güvenli yardım (BankID, Altinn, Helsenorge) |

---

## Teknik mimari

| Karar | Neden |
|---|---|
| Next.js | v0.app ile oluşturuldu; Vercel deploy zinciri hazır |
| Vercel | `naviar-care-1` projesi bet-art takımında |
| Türkçe kod tabanı | Platform dili; hedef kullanıcı Norveçce görecek |
| BETA-ART monoreposu | `betulandersen-droid/naviar-care-1` → `naviar/` (transfer bekliyor) |

---

## Değişiklik günlüğü

| Tarih | Değişiklik | Yapan |
|---|---|---|
| Ağu 2026 | v0.app ile oluşturuldu | — |
| Ağu 2026 | "rename NAVIAR to NAVIAR CARE" — preview'da, production'a çıkarılmadı | — |
| 30.08.2026 | ROADMAP.md oluşturuldu | Claude |

---

## Açık işler — öncelik sırasıyla

| Öncelik | İş | Not |
|---|---|---|
| Kritik | **Production'a çıkar** | Vercel Dashboard → naviar-care-1 → Deployments → `dpl_E4Q3o3WXeyaCEva7reSLgtGRwt7z` → Promote to Production |
| Kritik | **Repo erişimi** | `betulandersen-droid/naviar-care-1` → `andersenbetul-alt/BETA-ART` için erişim; GitHub App bağlantısı |
| Kritik | **BETA-ART'a taşı** | Kaynak kodu `naviar/` altına kopyala; Vercel bağlantısını güncelle |
| Yüksek | **Alan adı** | naviarcare.no veya naviar.no |
| Yüksek | **NAV içeriği doğrula** | Yasal bilgiler yanlış olmamalı; Norveç sağlık ve sosyal hizmetler mevzuatı |
| Orta | **Kullanıcı testi** | Gerçek pårørende ile test — dil tonu ve gezinme |
| Orta | **Eve botu entegrasyonu** | `agents/eve-slack-agent/` → naviar-consult Slack botu |
| Düşük | **İnteraktif NAV form rehberi** | Adım adım, ekran görüntülü |
| Düşük | **Çevrimiçi toplantı rezervasyonu** | Pårørende + danışman arasında |

---

## Eve entegrasyonu

`agents/eve-slack-agent/` altında `naviar-consult` Vercel projesi mevcut.
Slack botu olarak: pårørende sorularını yanıtlar, NAV süreçlerini açıklar.
İki tarafı bağlama planı yapılmadı henüz — önce web platform stable hale gelmeli.
