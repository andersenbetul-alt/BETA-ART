# WEB-2026-007 — Proje Kartı

**Proje No:** WEB-2026-007  
**Proje Adı:** Curiosity Engine  
**Kategori:** İçerik Üretim Hattı (Backend / CLI)  
**Durum:** Geliştirmede  
**Öncelik:** 🟡 Orta  
**Son güncelleme:** Bilinimiyor (aktif geliştirme)

---

## Kimlik

| Alan | Değer |
|---|---|
| Tam ad | Curiosity Engine V1 — QBLOGG içerik üretim hattı |
| Amaç | İnsanların neyi merak etmeye başladığını rakiplerden önce fark eden, puanlayan, araştıran ve blog taslağı üreten hat |
| Kod deposu | `andersenbetul-alt/BETA-ART/engine/` |
| Çalıştırma | CLI (`node engine/run.mjs --demo`) |
| Yayın otomasyonu | **YOK** — insan onayı zorunlu |

## Hat şeması

```
KAYNAKLAR → KÜMELEME → ÖZNİTELİK → PUANLAMA → KARAR → KUYRUK
                                                        ↓
                    SORULAR → ARAŞTIRMA → YAZI → SEO → PARA → KALİTE KAPISI
                                                        ↓
                                                  İNSAN ONAYI
```

## Bileşenler

| Dosya | İş |
|---|---|
| `schema.sql` | 8 tablo: sinyal, konu, soru, puan, makale, GSC, çalıştırma |
| `schema-billing.sql` | Ödeme: hesap, ürün, abonelik, kredi defteri, yetki, webhook |
| `db.mjs` | Node 22 yerleşik `node:sqlite` — ek bağımlılık yok |
| `sources/rss.mjs` | Google News, Google Trends RSS, Hacker News, Reddit |
| `sources/gsc.mjs` | Search Console CSV içe aktarma |
| `cluster.mjs` | Eş anlamlı başlıkları tek konuda toplar |
| `features.mjs` | Puanlama öznitelikleri |
| `score.mjs` | Trend / Opportunity / Money skorları |
| `agents.mjs` | 6 Claude ajanı: soru, araştırma, yazar, SEO, para, kalite |
| `run.mjs` | Tarama → puanlama hattı |
| `write.mjs` | Araştırma → makale zinciri |
| `billing.mjs` | Kredi bakiyesi, yetki, webhook |
| `visibility.mjs` | 16 maddelik görünürlük kuralı denetimi |
| `dashboard.html` | Statik panel (board.json okur) |

## Puanlama

| Tip | Ağırlıklar |
|---|---|
| Trend Score | büyüme %25, arama %20, sosyal %15, ticari niyet %15, düşük rekabet %10, sütun %10, güncellik %5 |
| Final | Trend %45 + Fırsat %30 + Para %25 |

**Karar eşikleri:** 93+ 🔥 · 85+ 🟢 · 75+ 🟠 · 60+ 🟡 · altı ❌

## Maliyet (Claude Opus 5)

Bir makale zinciri: ~40–80K çıktı tokenı ≈ **1,5–3 USD**.  
Ayda 20 makale ≈ 30–60 USD. Araştırmadaki web araması ayrıca ücretlendirilir.

## Yol haritası

- **V1 (mevcut):** trend topla → puanla → görüntüle → araştır → taslak üret
- **V2:** SEO otomasyonu + CMS'e yayın
- **V3:** Search Console öğrenme döngüsü
- **V4:** newsletter + sosyal dağıtım
- **V5:** tam otonom döngü + SaaS

## Bilinen sınırlar

- Bazı öznitelikler vekil ölçüm (rekabet gerçek SERP verisi istiyor)
- Mutlak skorlar RSS vekilleriyle düşük kalıyor (40–75 bandı)
- Google Trends resmi API'si alpha + erişim gerektiriyor
- Kümeleme AI'sız çalışırken eş anlamlıları kaçırabiliyor

---

**Hazırlayan:** AUTOPROMPT arşivleme sistemi, 2026-09-03
