# NAVIAR Care — Rıza ve iletişim modeli

Kaynak: Pilot Implementation Plan, Task 4 Step 3. **Temel ilke: ödeyenin
ödemesi, hizmet alanı gözlemleme hakkı doğurmaz.**

## Ayrı ayrı kaydedilen rıza türleri

| Rıza türü | Ne için | Varsayılan |
|---|---|---|
| Hizmete rıza | Hizmetin kendisini kabul | Zorunlu, ilk adım |
| Tercih edilen/yedek yardımcı tanıtımına rıza | Kimlerin ziyarete geleceği | Hizmete rızayla birlikte alınır |
| Acil durum kişisi | 113/116 117 dışı, NAVIAR'ın kimi arayacağı | Zorunlu alan |
| Aile güncellemesi izni | Bir aile üyesinin güncelleme alıp almayacağı | **Asla ödeyen ilişkisinden çıkarılmaz** |
| Güncelleme düzeyi | Hangi sınıf bilginin paylaşılacağı (`operations/visit-update-template.md`) | Hizmet alan seçer |
| Geri çekme yöntemi | Rızanın nasıl iptal edileceği | Her zaman erişilebilir olmalı |

## Kritik tasarım kararı — §2'de flag edilen riskin çözümü

`NAVIAR-CARE-IS-MODELI-KRITIK-ANALIZ.md` R4: "rıza adımı satış hunisinde
ne zaman alınacağı tanımsız." Bu belge bunu netleştiriyor:

**Rıza, ilk ödemeden ÖNCE alınır.** Kurulum görüşmesi sırası:
1. Aile talebi + uygunluk taraması (`sales/pilot-offer-and-eligibility-script.md`)
2. **Hizmet alanla doğrudan rıza görüşmesi** (koordinatör, telefon/yüz yüze)
3. Rıza onaylandıysa → ödeme/fatura süreci başlar
4. Rıza onaylanmadıysa → hizmet başlamaz, ücret alınmaz

tjenestevurdering'in de vurguladığı gibi: "Betaleren overstyrer personen"
riskini önlemenin tek yolu, bu sırayı **tersine çevirmemek**.

## Aile iletişim modeli

- Kanal: telefon/SMS, yalnız lojistik (Tech Stack: "not sensitive
  details")
- İçerik: `operations/visit-update-template.md`'deki onaylı düzeyle sınırlı
- Sıklık: ziyaret başına bir güncelleme, aile talebiyle sıklaştırılmaz

## Kabul testi bağlantısı

Bu modelin doğru çalıştığının kanıtı `product/mvp-acceptance-tests.md`
madde 3'te: "recipient can revoke family updates and the next update is
suppressed."
