# COBBAN

**Norway is complicated. COBBAN makes it simple.**

Turist bir aksaklıkla karşılaştığında tek ekranda çözüm veren asistan.

```
Problem  →  COBBAN  →  DONE
```

## Neden LLM yok

MVP'de yapay zekâ çağrısı yapılmıyor ve bu bilinçli bir karar:

- Niyet zaten beş başlıktan biri. Serbest metni ayrıştırmak için dil modeli
  gerekmiyor; buton daha hızlı ve **bedava**.
- Mahsur kalmış, ıslanmış, telefonu az şarjlı biri yazmak istemez.
- Asıl değer dilde değil **veride**: Entur'un gerçek zamanlı sefer verisi.

LLM ileride serbest metin girişi ve çok adımlı gün yeniden planlaması için
eklenebilir — ama önce insanların hangi sorunla geldiğini öğrenmek gerekir.

## Maliyet

| Kalem | Aylık |
|---|---|
| Entur JourneyPlanner (tüm toplu taşıma + feribot, gerçek zamanlı) | **0 NOK** — anahtar bile yok |
| MET Norway hava durumu | **0 NOK** |
| Vercel Hobby (barındırma) | **0 NOK** |
| Veritabanı | yok |
| LLM | yok |
| **Toplam** | **0 NOK** |

Tek zorunlu gider alan adı (~150 NOK/yıl). Onsuz da `*.vercel.app` ile yayınlanır.

## Çalıştırma

```bash
npm install
cp .env.example .env.local     # ENTUR_CLIENT_NAME'i kendi adınla doldur
npm run dev
```

`COBBAN_LIVE_DATA=false` (varsayılan) → sabit demo verisiyle çalışır, ağ gerekmez.
`true` → Entur'dan canlı sefer verisi çeker.

## ⚠️ Doğrulanmamış kısım

`lib/entur.ts` içindeki GraphQL sorgusu **canlı API'ye karşı test edilmedi** —
geliştirme ortamının ağ politikası `api.entur.io`'yu engelliyor. Kendi
makinende `COBBAN_LIVE_DATA=true` ile ilk çalıştırmada yanıtı kontrol et.
Sorgu gezgini: https://api.entur.io/graphql-explorer/journey-planner-v3

Geri kalan her şey (arayüz, yönlendirme, yer verisi, biçimlendirme) çalışır
durumda ve test edildi.

## Yapı

```
app/page.tsx              beş sorun butonu
app/sorun/[kind]/page.tsx cevap ekranı — ulaşım veya yer önerisi
lib/entur.ts              Entur JourneyPlanner istemcisi (canlı)
lib/fixtures.ts           demo sefer verisi (canlı kapalıyken)
lib/places.ts             küratörlü yeme/kapalı mekân listesi, şehir başına
lib/format.ts             saat, süre ve ulaşım modu biçimlendirme
```

## Sıradaki adımlar

- [ ] Entur sorgusunu canlı API'de doğrula
- [ ] Konumdan şehir tespiti (tarayıcı geolocation — ücretsiz)
- [ ] `road` sorunu için Statens vegvesen DATEX bağlantısı (ücretsiz, hesap gerekir)
- [ ] `rain` için MET Norway'den gerçek yağış kontrolü
- [ ] Şehir sayısını artır — 4 şehir elle sürdürülebilir, 20 şehir değil
- [ ] Ölçüm: hangi sorun kaç kez seçiliyor (ürünün yönünü bu belirleyecek)
