# 13 — Ülke Ölçekleme Modeli

Hedef: İskandinavya → Avrupa → dünya. Bu dokümanın amacı **ülke eklemenin
maliyetini** dürüstçe göstermek, çünkü ölçeklemeyi belirleyen şey burası.

## Temel içgörü: pahalı veri ile değerli veri aynı şey değil

| Sorun | Veri kaynağı | Ülke başına maliyet |
|---|---|---|
| Sefer iptal / kaçırılan bağlantı | Ülkeye özgü ulaşım API'si | **Yüksek** — her ülkede farklı, çoğunda anahtar/sözleşme gerekir |
| Yol kapalı | Ulusal karayolu idaresi | Orta |
| Hava değişti | **MET Norway — tüm dünya, ücretsiz** | **Sıfır** |
| Nerede yeriz | Küratörlü liste veya OSM | Düşük (emek) |
| Eczane, acil numara, taksi tarifesi, bahşiş, ATM | **Statik ülke bilgisi** | **Çok düşük** |

Turistin en çok **para** kaybettiği yerler son satır: yanlış taksi, gereksiz
ATM komisyonu, bilinmeyen bahşiş kuralı, kapalı eczane yüzünden doktora gitmek.
Bunların hiçbiri canlı API istemiyor.

**Sonuç:** bir ülke, ulaşım entegrasyonu hiç olmadan açılabilir ve yine faydalı olur.
Norveç dışındaki on iki ülke tam olarak böyle açıldı (`transport: 'none'`).

## Bugünkü kapsam (Ağu 2026)

13 ülke canlı. Hepsinde acil numaralar, `essentials` (turistin en pahalıya mal
olan bilinmeyenleri), küratörlü yer listeleri ve — MET Norway dünya çapında
çalıştığı için — hava kararı var.

| Ülke | Şehir | Ulaşım |
|---|---|---|
| 🇳🇴 Norveç | Bergen · Oslo · Tromsø · Stavanger | **Entur (canlı)** |
| 🇸🇪 İsveç | 3 şehir | yok |
| 🇩🇰 Danimarka · 🇫🇮 Finlandiya · 🇮🇸 İzlanda | 2'şer şehir | yok |
| 🇩🇪 Almanya · 🇳🇱 Hollanda · 🇦🇹 Avusturya | 3'er şehir | yok |
| 🇫🇷 Fransa · 🇮🇹 İtalya · 🇪🇸 İspanya | 4'er şehir | yok |
| 🇵🇹 Portekiz · 🇬🇷 Yunanistan | 3'er şehir | yok |

İkincil şehirlerin çoğunda yer listesi tek satır. Bu bilerek: uydurulmuş
liste, kısa listeden kötüdür. Şehir derinliği ülke eklemekten daha ucuz —
sıradaki iş orası.

Ulaşım verisi olmayan ülkede "yakında" demiyoruz; AB yolcu haklarını ve o an
işe yarayan üç adımı veriyoruz (`NoTransportYet`). Boş ekran yok.

**Yunanistan özel:** feribot iptalleri rüzgâr yüzünden olur ve liman
başkanlığı kararıdır. Bu, Norveç'ten sonra ürünün en güçlü ikinci vakası —
ulaşım API'si eklenecek ilk aday.

## Ülke eklemek ne kadar iş

```
web/lib/countries/xx.ts   ← tek dosya: şehirler, acil numaralar, essentials
web/lib/country.ts        ← registry'ye bir satır
```

Kod değişikliği yok. Ulaşım sağlayıcısı varsa `lib/transport/` altına bir
uygulama eklenir; yoksa `'none'` kalır ve ulaşım soruları o ülkede gizlenir.

## Sıra ve gerekçesi

| Aşama | Ülkeler | Neden |
|---|---|---|
| **1** | 🇳🇴 Norveç | Entur dünyanın en iyi açık ulaşım API'si: tüm modlar, feribot dahil, gerçek zamanlı, ücretsiz, anahtarsız. Ürünü en zengin veriyle test etmek için ideal |
| **2** | 🇸🇪 İsveç · 🇩🇰 Danimarka | Aynı turist akışı, benzer sorunlar, İngilizce yaygın. Trafiklab ve Rejseplanen ücretsiz ama kayıt istiyor |
| 3 | 🇫🇮 Finlandiya · 🇮🇸 İzlanda | İskandinav seti tamamlanır. İzlanda'da turist/nüfus oranı çok yüksek |
| 4 | 🇩🇪 🇳🇱 🇦🇹 🇨🇭 | Orta Avrupa. Çoğu ülkede GTFS var; tek tek entegrasyon yerine bir GTFS toplayıcısı değerlendirilmeli |
| 5 | 🇮🇹 🇪🇸 🇫🇷 🇬🇷 | En büyük turist hacmi ama en dağınık veri. Bu noktada ulaşım verisi için ödeme yapmak mantıklı olabilir |

## Ulaşım verisinde ölçekleme kararı

Her ülkeye ayrı entegrasyon yazmak 5. aşamada duvara çarpar. Üç seçenek:

1. **Ülke ülke resmî API** — en doğru veri, en çok emek. 5-6 ülkeye kadar makul.
2. **GTFS / GTFS-Realtime toplayıcısı** — çoğu Avrupa ülkesi GTFS yayınlıyor.
   Tek arayüz, değişken kalite.
3. **Ticari toplayıcı** — hızlı ama aylık ücret; ürün gelir üretene kadar erken.

**Öneri:** 1–3. aşamada resmî API'ler, 4. aşamada GTFS'e geçiş,
ticari sağlayıcıyı ancak gelir varken değerlendir.

## Değişmeyen kısım

`lib/plan.ts` — tatil planına etki hesabı ülkeden bağımsız. Feribot Norveç'te,
tren İtalya'da iptal olur; "otel girişini kaçırıyorsun" mantığı aynıdır.
Ürünün asıl değeri bu katmanda ve **bir kez yazıldı.**
