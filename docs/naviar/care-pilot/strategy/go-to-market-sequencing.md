# NAVIAR Care — Pazara giriş sıralaması (proje lideri kararı, 02.09.2026)

Kaynak: kullanıcının `/IQ100` stratejik değerlendirmesi. Bu belge o kararı
kayıt altına alır; ayrıntılı gerekçe için orijinal metne bakılabilir
(kullanıcı mesajı, 02.09.2026). **Bu, `strategy/year-one-operating-plan.md`
taslağının varsaydığı sıralamayı değiştirir** — o belge 55 aktif *ödeyen
aile*yi Yıl 1 çıkış hedefi olarak alıyordu; bu karar aileyi ikinci sıraya
koyuyor. Year-1 planı ölçekleme kapısı geçildiğinde dolduğunda bu sıralama
esas alınmalı.

## Karar özeti

> Önce koordinasyon ve düşük riskli günlük destekle güven oluştur.
> Sonra eşleştirme ve komisyon modelini ölçekle.

NAVIAR CARE bir iş ilanı platformu değil: **ihtiyacı anlaşılır göreve
dönüştürme + doğru kişiyi bulma + güvenli planlama + hizmet takibi**
sistemi olarak konumlanıyor.

## Sıralama

1. Pårørende pilotuyla ihtiyaçları doğrula (mevcut MVP kapsamı).
2. Tek bölgede (Oslo yoğunluk kümesi) düşük riskli hizmetleri test et.
3. Yardımcıları manuel doğrula — otomatik/ölçekli değil.
4. Manuel eşleştirme + saatlik ödeme yapısını çalıştır.
5. Gerçek komisyon ve kârlılığı ölç (bkz. §4 denklem).
6. Kurumlarla pilot sözleşmesi yap.
7. Ancak kanıtlandıktan sonra teknoloji/otomasyonu büyüt.

## İlk müşteri: kurum, aile değil

**Birinci öncelik** — belediye, BPA sağlayıcısı, dagsenter, özel bakım
kuruluşu: kullanıcı bulma maliyeti düşük, güven hızlı oluşur, tek
sözleşmeyle çok kullanıcıya ulaşılır, pilot finansmanı mümkün, ailelerden
yüksek ücret istenmez. **İkinci öncelik** — aileler, sonradan doğrudan
ödeyen müşteri.

## Gelir aşamaları

| Aşama | Kim öder | Ne için |
|---|---|---|
| 1 — Pilot | Kurum | Pilot ücreti, kullanıcı başına ücret, koordinasyon ücreti (aile ücretsiz/düşük ücretli) |
| 2 — Hizmet pazaryeri | Kullanıcı/aile | Saatlik hizmet ücreti + NAVIAR CARE komisyonu |
| 3 — Kurumsal platform | Kurum | Aylık lisans + kullanıcı başına ücret + işlem komisyonu + raporlama/kalite hizmeti |

Üç gelir motoru: **Pårørende Start** (ilk günden, sabit hizmet ücreti),
**Match & Assist** (pilot sonrası, saatlik komisyon), **Partner/Belediye**
(güven kanıtlandıktan sonra, sözleşme + abonelik).

## İlk hizmet: Aktivitet & Hverdagsstøtte

Yürüyüş, sosyal refakat, alışveriş, aktivite/spor, ulaşım, randevuya
eşlik, basit ev işleri, aile koordinasyonu — sık tekrarlanan, anlaşılması
kolay, saatlik ödeme modeline uygun görevler. Bu, mevcut üç fokus
alanından (`product/mvp-data-map.md`, iniş sayfası) "Kommunale helse- og
omsorgstjenester" alanının bir alt-kümesi; NAV ve dijital veiledning
alanları bu aşamada birincil hizmet değil, destekleyici.

## Dil: "işsiz kişi" değil

Pazarlama/ürün dilinde yardımcılar için **"doğrulanmış, müsait ve uygun
görevler için destek sunan yardımcılar"** kullanılır — "işsiz kişi" ifadesi
kullanılmaz. Kullanıcı güvenilir bir kişi satın alır, işsiz birini değil.
Bu, `naviar-on-brand` becerisinin ses kurallarına eklenmesi gereken bir
kısıt.

## Birim ekonomisi denklemi

Her görevde:

```
Kullanıcıdan alınan ücret
- Yardımcıya ödenen tutar
- Ödeme sistemi gideri
- Sigorta ve doğrulama maliyeti
- NAVIAR CARE operasyon maliyeti
= Gerçek katkı payı
```

Yalnızca komisyon oranına bakmak yeterli değil; hizmet başına gerçek katkı
ölçülmeli. `finance/pilot-unit-economics.xlsx` bu denklemi zaten satır
kalemi olarak içeriyorsa doğrulanmalı, içermiyorsa eklenmeli (açık iş).

## İki taraflı pazar riski ve çözümü

Kullanıcı, yardımcı ve NAVIAR CARE'in aynı anda sisteme gelmesi klasik bir
"chicken-and-egg" problemi. Sıra: (1) tek bölgede talep topla, (2) talebe
göre yardımcı kaydet, (3) yardımcı sayısını talep olmadan büyütme, (4) her
kullanıcıya manuel eşleştirme yap, (5) en çok tekrarlanan hizmetleri
otomatikleştir.

## MVP kapsamı (bu karardan sonra doğrulanacak)

**Olmalı:** talep formu, yardımcı başvuru formu, görev kategorisi, konum,
müsaitlik, manuel eşleştirme, saat planı, ücret onayı, ödeme, hizmet
sonrası değerlendirme, yönetici paneli.

**Olmamalı (bu aşamada):** karmaşık mobil uygulama, tam otomatik yapay
zekâ, tüm bakım hizmetleri, hastane sistemi entegrasyonu, büyük açık
pazar yeri, yüksek riskli sağlık görevleri.

Mevcut MVP (`product/mvp-data-map.md`, talep formu) bu listenin yalnızca
"talep formu" parçasını kapsıyor — yardımcı başvurusu, manuel eşleştirme
arayüzü, ücret onayı, ödeme ve yönetici paneli henüz **açık iş.**

## Açık hukuki soru — yardımcı çalışma statüsü

Yardımcıların çalışma statüsü (frilanser / oppdragstaker) ve NAVIAR
CARE'in işveren/komisyoncu/platform rolü baştan netleştirilmeli; Norveç'te
bu iki model raporlama ve sorumluluk açısından farklı olabilir. Kaynak:
[Skatteetaten — frilanser, oppdragstaker ve honorar alanlar](https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/veiledning/arbeidsforholdet/type-arbeidsforhold/frilanser-oppdragstaker-og-personer-som-mottar-honorarer/).
Bu soru `decisions/decision-log.md`'ye açık madde olarak işlendi.

## Nihai konumlandırma

> Aileleri, yaşlıları ve günlük yaşam desteğine ihtiyaç duyan kişileri,
> doğrulanmış yardımcılarla buluşturan güvenli bir hizmet koordinasyon ve
> saatlik eşleştirme platformu.

Marka mesajı: **"Doğru yardım. Doğru kişi. Doğru zaman."**
