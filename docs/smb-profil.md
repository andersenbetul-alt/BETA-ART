# QBLOGG — Small Business Plugin Şirket Profili

Bu dosya `small-business` plugin'inin `smb-onboard` adımı için hazırdır.
Plugin kurulunca buradan kopyala-yapıştır yap veya `/smb-onboard` ile otomatik yüklet.

---

## Kimlik

| Alan | Değer |
|---|---|
| Şirket adı | QBLOGG |
| Tür | İçerik stüdyosu — B2B ajans |
| Konum | Norveç |
| Sahip / iletişim | andersen.betul@gmail.com |
| Site (üretim) | qblogg.vercel.app |
| Altyapı | Vercel (qblogg projesi, BET-ART takımı) |

---

## Ne satıyoruz

Düzenli içerik yayını yapan ama iç ekibi olmayan KOBİ ve SaaS şirketlerine
**içerik hattı** — abone paketi olarak:

| Paket kodu | Kapsam | Hedef kategori |
|---|---|---|
| p1 | Güvenlik / rehber içeriği | `safety`, `guide` |
| p2 | Para, kariyer, yapay zekâ, SEO, pazarlama | `money`, `jobs`, `ai`, `seo`, `marketing` |
| p3 | İş dünyası, İK | `business`, `hr` |

**Hizmet türleri:** SEO blog yazısı · LinkedIn serisi · sosyal içerik · newsletter · çok dilli yayın (10 dil)

---

## Ödeme ve araçlar

| Araç | Durum | Not |
|---|---|---|
| Stripe | Kurulu, CTA beklemede | `config.js → payLinks` boş; URL eklenince aktive |
| Buttondown | Bağlı | Newsletter: `config.js → newsletterEndpoint` |
| Vercel | Aktif | deploy = `main`'e push |
| Canva | Yok | İçerik görselleri elle yapılıyor |
| HubSpot / CRM | Yok | Lead takibi manuel |
| QuickBooks | Yok | Muhasebe henüz bağlı değil |

---

## İçerik pipeline'ı

```
Brief formu (work.html) → yazı taslağı → gorunurluk denetimi
→ posts.js'e ekleme → check.mjs (yeşil) → Vercel deploy
→ newsletter (Buttondown) → QB_BEH davranış sistemi önerileri
```

**Yayın temposu hedefi:** haftada 1 TR+EN tam makale + 8 dil özeti.

**İçerik kategorileri:** business · safety · money · jobs · ai · seo · marketing · hr · guide · newsletter

---

## Lead ve müşteri akışı

- **Lead kaynağı:** `work.html` marka brief formu (şu an `mailto:` — gerçek form geçişi bekliyor)
- **Nitelik kriteri:** İç içerik ekibi yok + düzenli yayın hedefi var
- **Müşteri tipleri:** KOBİ (Norveç + uluslararası), SaaS şirketleri
- **CRM:** yok — plugin kurulunca HubSpot bağlantısı değerlendirilebilir

---

## Yazı ekibi

- Şu an: tek kişi (stüdyo sahibi)
- Yazar ihtiyacı: serbest yazarlar (Norveç piyasası: NAV.no, LinkedIn)
- Dil önceliği: Norveççe + Türkçe üretim, İngilizce yayın

---

## Muhasebe ve nakit akışı

- Stripe komisyon (Norveç): yurt içi kart %1,5 + 1,80 kr; yurt dışı +%3,25; döviz +%2
- Paket fiyatları: `config.js` içinde (şu an örnek rakamlar; kesinleşmedi)
- Vergi sistemi: Norveç (MVA)
- Fatura: henüz otomatik sistem yok

---

## Haftalık ritim (plugin brief hedefi)

| Gün | Eylem |
|---|---|
| Pazartesi | Haftalık brief: yayın takvimi + açık leadler |
| Salı–Perşembe | Yazı üretimi + gözden geçirme |
| Cuma | Haftalık özet: yayınlanan + Buttondown + Stripe durum |

---

## İkincil proje: NAVIAR CARE

| Alan | Değer |
|---|---|
| Tür | B2C/B2G — Norveçli yaşlılar ve pårørende için navigasyon platformu |
| Vercel | naviar-care-1-psi.vercel.app |
| Slack botu | naviar-consult (agents/eve-slack-agent/) |
| Durum | Repo transferi bekleniyor (betulandersen-droid → andersenbetul-alt) |
| Paketler | nav · kommune · digital |

NAVIAR için ayrı `naviar-operasyon` becerisi var; small-business plugin'i QBLOGG odaklıdır.
