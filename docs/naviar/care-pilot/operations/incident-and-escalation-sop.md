# NAVIAR Care — Olay ve yükseltme SOP'u

Kaynak: Pilot Implementation Plan, Task 2 Step 4 (tabletop test) + Task 5
(haftalık kalite toplantısı bu SOP'un girdisini kullanır).

## Yükseltme merdiveni

```
Yardımcı gözlemler → Etkinliği durdurur → Acil mi?
   ├─ Evet (akut) → 113 → Nöbetçi koordinatörü bilgilendir
   └─ Hayır (mesai dışı tıbbi) → 116 117'ye yönlendir → Nöbetçi koordinatörü bilgilendir
                                          ↓
                        Koordinatör: rıza planına göre yetkili aile kişisiyle iletişim
                                          ↓
                        Yardımcı: gerçeğe dayalı operasyonel olay raporu yazar
                                          ↓
                        Güvenlik danışmanı: her ciddi endişeyi inceler
                                          ↓
                        Haftalık kalite toplantısında kapanış kanıtıyla gözden geçirilir
```

## Olay sınıflandırması

| Sınıf | Örnek | Yanıt süresi | Kim kapatır |
|---|---|---|---|
| Kritik (güvenlik/gizlilik) | Ciddi düşme, rıza ihlali, veri sızıntısı | Anında | Kurucu + güvenlik danışmanı, birlikte |
| Orta (sınır ihlali girişimi) | BankID/para talebi, kapsam dışı istek | Aynı gün | Koordinatör |
| Düşük (lojistik) | Geç kalma, iptal | Haftalık toplantıda | Koordinatör |

**Kural (plan, Task 5 Step 4):** çözülmemiş bir kritik güvenlik/gizlilik
olayı varken **yeni aile kabul edilmez** — diğer ölçütler yeşil olsa bile.

## Tabletop test senaryoları (Task 2 Step 4 — geçme koşulu)

| # | Senaryo | Geçme koşulu |
|---|---|---|
| 1 | Düşme/akut endişe | Ekip SOP'u izler, 113'ü tanımlar, gerçeğe dayalı kayıt üretir (sağlık günlüğü değil) |
| 2 | BankID talebi | Yardımcı reddeder, koordinatöre bildirir, rıza korunur |
| 3 | Müşteri güncelleme paylaşmayı reddediyor | Rıza derhal onurlandırılır, sonraki güncelleme bastırılır |

Test, kurucu + 1 koordinatör + 1 yardımcı ile yürütülür; üçü de SOP'u
tekrarsız uygulayabilmeli.

## Olay raporu şablonu

- Tarih/saat
- Hizmet türü (Trygt besøk / Følge til aktivitet / Digital hverdagsstøtte)
- Gözlenen davranış (yalnız gözlem, yorum değil)
- Alınan aksiyon
- Bilgilendirilen kişi(ler) ve zaman
- Sınıf (kritik/orta/düşük)
- Kapanış durumu ve tarihi

**Yasak alanlar:** teşhis, tıbbi terim, tahmin, sağlık geçmişi çıkarımı —
bkz. `service-boundary-matrix.md` §5.
