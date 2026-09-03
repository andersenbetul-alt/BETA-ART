# BRD-2026-001 NAVIAR Marka — Üretim Notları

## Üretim komutu

```bash
python3 brand/naviar/build.py
```

Bağımlılık yok. Tüm geometri spec'teki sayılardan hesaplanır — hiçbir path elle kopyalanmamış.

## Doğrulama

`brand/naviar/index.html` — tüm varlıkları bir arada gösteren contact sheet. Specimen kartları her dosya için görsel + ölçüm özeti içeriyor.

## Dosya standardı

- Tüm varlıklar flat vector — filled polygon/path
- Gradyan, gölge, glow, raster mask yok
- Stroke yok — tüm şekiller filled
- Yeniden üretim: README'deki ölçülerle sıfırdan yeniden çizilir

## Dikkat: Descriptor kullanım sınırları

| Descriptor | Durum |
|---|---|
| CONSULTING, AI, PLATFORM, RESEARCH INSTITUTE, ACADEMY, LABS | Onaylı mimari |
| CARE | `naviar-care-PENDING-APPROVAL.svg` — iş onayı VE Nice sınıf 44 taraması gerekli; onaysız kullanılamaz |

## Bağlı projeler

- **WEB-2026-004 NAVIAR Care** — `naviar-care` descriptor bu projeyle doğrudan bağlantılı
- **WEB-2026-005 Eve Slack Agent** — `AGENT_PROFILE=naviar-consult` için marka referansı
