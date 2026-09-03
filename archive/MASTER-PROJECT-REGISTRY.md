# MASTER PROJECT REGISTRY
# BET-ART — Tüm Projeler Ana Kataloğu

**Son güncelleme:** 2026-09-03
**Versiyon:** 1.0
**Kaynak:** `andersenbetul-alt/BETA-ART` monoreposu

---

## Ana tablo

| Proje No | Proje Adı | Amaç | Durum | Güncel Sürüm | Son Güncelleme | Canlı Adres | Kod Deposu | Öncelik | Sonraki Adım |
|---|---|---|---|---|---|---|---|---|---|
| WEB-2026-001 | **QBLOGG** | İçerik stüdyosu tanıtım + blog | Yayında | v1.0.0 | 2026-08-24 | qblogg.vercel.app | BETA-ART `/` | 🔴 Kritik | config.js doldur |
| WEB-2026-002 | **HXI** | Oslo elektronik artist sitesi | Geliştirmede | — | 2026-09-03 | Yok | BETA-ART `hxi/` | 🔴 Kritik | Vercel deploy |
| WEB-2026-003 | **Beta Art** | Fotoğraf + proje arşiv servisi | Geliştirmede | — | 2026-08-25 | — | beta-art-archive | 🟡 Orta | Airo sitesi + Business bölümü |
| WEB-2026-004 | **NAVIAR Care** | Norveç yaşlı bakım platformu | Beklemede | — | Bilinmiyor | — | naviar-care-1 (transfer bekliyor) | 🟡 Orta | Repo transferi |
| WEB-2026-005 | **Eve Slack Agent** | naviar-consult + hxi-music botu | Beklemede | v0.0.0 | — | — | BETA-ART `agents/eve-slack-agent/` | 🟢 Düşük | Özelleştirme kararı |
| WEB-2026-006 | **Eve Chat Template** | Sohbet arayüzü şablonu | Beklemede | v0.0.0 | — | — | BETA-ART `agents/eve-chat-template/` | 🟢 Düşük | Özelleştirme kararı |
| WEB-2026-007 | **Curiosity Engine** | QBLOGG içerik üretim hattı | Geliştirmede | — | — | — | BETA-ART `engine/` | 🟡 Orta | Görünürlük kuralı entegrasyonu |
| WEB-2026-008 | **Demo Sayfaları** | Action page demoları | Yayında | — | — | qblogg.vercel.app/demo/ | BETA-ART `demo/` | 🟢 Düşük | — |
| BRD-2026-001 | **NAVIAR Marka** | NAVIAR kimlik sistemi | Tamamlandı | — | 2026-08 | — | BETA-ART `brand/naviar/` | — | — |
| BRD-2026-002 | **HXI Marka** | HXI görsel kimlik | Tamamlandı | — | 2026-08-30 | — | BETA-ART `brand/hxi/` | — | HXI sitesine uygula |
| BRD-2026-003 | **Cobban Marka** | Cobban kimlik tasarımı | İnceleme gerekli | — | — | — | BETA-ART `brand/cobban/` | — | Kim/ne? |

---

## Listeler

### Aktif projeler (kod geliştirme sürüyor)

- WEB-2026-001 QBLOGG
- WEB-2026-002 HXI
- WEB-2026-003 Beta Art
- WEB-2026-007 Curiosity Engine

### Yayındaki projeler

- WEB-2026-001 QBLOGG → https://qblogg.vercel.app
- WEB-2026-008 Demo Sayfaları → https://qblogg.vercel.app/demo/

### Bekleyen projeler

- WEB-2026-004 NAVIAR Care (repo transferi bekleniyor)
- WEB-2026-005 Eve Slack Agent (özelleştirme kararı bekleniyor)
- WEB-2026-006 Eve Chat Template (özelleştirme kararı bekleniyor)

### Arşivlenen projeler

Yok.

### Eksik dokümantasyonu olan projeler

**Tümü** — bu arşivleme çalışması WEB-2026-001'den başlıyor (2026-09-03).

### Teknik risk taşıyan projeler

| Proje | Risk | Seviye |
|---|---|---|
| WEB-2026-001 QBLOGG | config.js boş (site işlevsel değil) | **Yüksek** |
| WEB-2026-001 QBLOGG | Formlar gerçek servise bağlı değil | **Yüksek** |
| WEB-2026-003 Beta Art | İki kopya (monorepo + beta-art-archive) | **Yüksek** |
| WEB-2026-004 NAVIAR | Başka hesapta, erişim belirsiz | **Orta** |

### Birbiriyle bağlantılı projeler

```
QBLOGG (001)
  └─ içerik üretir → Curiosity Engine (007)
  └─ demo barındırır → Demo Sayfaları (008)

HXI (002)
  └─ marka kaynağı → HXI Marka (BRD-002)
  └─ bot → Eve Slack Agent (005) [AGENT_PROFILE=hxi-music]

NAVIAR (004)
  └─ marka kaynağı → NAVIAR Marka (BRD-001)
  └─ bot → Eve Slack Agent (005) [AGENT_PROFILE=naviar-consult]
```

### Ortak kod kullanan projeler

| Teknoloji | Projeler |
|---|---|
| Saf HTML/CSS/JS | QBLOGG (001), HXI (002) |
| TypeScript + pnpm | Eve Slack Agent (005), Eve Chat Template (006) |
| CSS değişken sistemi | QBLOGG ve HXI benzer yaklaşım |

### Acil işlem gereken projeler

1. **WEB-2026-001 QBLOGG** — `config.js` doldurulması (site kullanılamaz durumda)
2. **WEB-2026-002 HXI** — Vercel deploy (sitenin PR'ı açık, deploy engelli)

---

## Arşivleme ilerlemesi

| Proje | Arşivleme durumu | Tarih |
|---|---|---|
| WEB-2026-001 QBLOGG | ✓ Tamamlandı | 2026-09-03 |
| WEB-2026-002 HXI | ✓ Tamamlandı | 2026-09-03 |
| WEB-2026-003 Beta Art | ○ Bekliyor | — |
| WEB-2026-004 NAVIAR | ○ Bekliyor | — |
| WEB-2026-005 Eve Slack | ○ Bekliyor | — |
| WEB-2026-006 Eve Chat | ○ Bekliyor | — |
| WEB-2026-007 Curiosity Engine | ○ Bekliyor | — |
| WEB-2026-008 Demo | ○ Bekliyor | — |
| BRD-2026-001 NAVIAR Marka | ○ Bekliyor | — |
| BRD-2026-002 HXI Marka | ○ Bekliyor | — |
| BRD-2026-003 Cobban Marka | ○ Bekliyor | — |
