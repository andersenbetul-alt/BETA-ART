# WEB-2026-007 — Güncel Durum Raporu

**Rapor tarihi:** 2026-09-03  
**Hazırlayan:** AUTOPROMPT arşivleme sistemi

---

## 1. Proje kimliği
**WEB-2026-007 — Curiosity Engine V1**

## 2. Projenin amacı
QBLOGG için otomatik içerik keşif ve üretim hattı. İnsan merakını rakiplerden önce fark etmek, puanlamak ve blog taslağı üretmek. **Yayın kararı daima insanda.**

## 3. Mevcut durum
**Geliştirmede** — V1 işlevsel. `--demo` modu çalışıyor. Canlı veri (RSS) modu test edildi.

## 4. Çalıştırma

```bash
node engine/run.mjs --demo           # Demo verisiyle — ağ ve API anahtarı gerekmez
node engine/run.mjs --live           # Canlı RSS kaynakları (anahtarsız)
node engine/write.mjs --next --dry   # Zinciri anlat, API çağırma
node engine/write.mjs --next         # Araştır + yaz (ANTHROPIC_API_KEY gerekir)
```

## 5. Bağımlı projeler
- **WEB-2026-001 QBLOGG** — Engine'in çıktısı QBLOGG blog yazılarını besliyor
- **SHARED-WEB-LIBRARY** — `visibility.mjs` ve `billing.mjs` paylaşılabilir

## 6. Teknik borçlar

| Borç | Seviye |
|---|---|
| Google Trends API alpha erişimi yok | **Orta** |
| Rekabet skoru gerçek SERP verisi istemiyor (vekil) | **Orta** |
| Search Console entegrasyonu opsiyonel, gerçek bağlantı yok | **Düşük** |

## 7. Sonraki adım
Görünürlük kuralı entegrasyonu — `engine/visibility.mjs` çıktısının QBLOGG yayın sürecine otomatik dahil edilmesi.
