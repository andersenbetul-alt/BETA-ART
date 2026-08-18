# 04 — Vergi ve Muhasebe Takvimi

## Norveç (COBBAN NO)

| Ne | Sıklık | Son tarih | Nerede |
|---|---|---|---|
| **MVA-melding** (KDV beyanı) | 2 ayda bir | Dönem bitiminden **1 ay 10 gün** sonra | Altinn / muhasebe yazılımı |
| MVA — yıllık beyan (ciro < 1 mn NOK) | Yıllık | 10 Mart | Altinn |
| **Forskuddsskatt** (ENK peşin vergi) | 4 taksit | 15 Mart / 15 Haziran / 15 Eylül / 15 Aralık | Skatteetaten |
| **Skattemelding** (yıllık beyan) | Yıllık | 31 Mayıs | Altinn |
| **Næringsspesifikasjon** (işletme eki) | Yıllık | 31 Mayıs | Altinn |
| **Årsregnskap** (AS için yıllık hesap) | Yıllık | 31 Temmuz | Regnskapsregisteret |
| **A-melding** (çalışan varsa) | Aylık | Ayı takip eden ayın 5'i | Altinn |
| Arbeidsgiveravgift (işveren primi) | 2 ayda bir | 15'i | Skatteetaten |

**MVA dönemleri:** Ocak–Şubat, Mart–Nisan, Mayıs–Haziran, Temmuz–Ağustos, Eylül–Ekim, Kasım–Aralık.

## Türkiye (COBBAN TR)

| Ne | Sıklık | Son tarih | Nerede |
|---|---|---|---|
| **KDV Beyannamesi** | Aylık | Takip eden ayın **28**'i | GİB / e-Beyanname |
| **Muhtasar ve Prim Hizmet Beyannamesi** | Aylık | Takip eden ayın 26'sı | GİB |
| **Geçici Vergi** (kurum/gelir) | 3 ayda bir | Dönemi takip eden 2. ayın 17'si | GİB |
| **Yıllık Gelir Vergisi** (şahıs) | Yıllık | 31 Mart (2 taksit: Mart, Temmuz) | GİB |
| **Yıllık Kurumlar Vergisi** (Ltd) | Yıllık | 30 Nisan | GİB |
| **Bağ-Kur primi** | Aylık | Takip eden ayın sonu | SGK |
| **BA-BS formları** (limitli) | Aylık | Takip eden ayın sonu | GİB |
| **Defter-Beyan / e-Defter** | Aylık | Değişken | GİB |

> Beyanname son günleri resmî tatile denk gelirse ertesi iş gününe kayar.
> GİB sık sık **süre uzatımı** yayınlar — SMMM takip eder.

## Kayıt tutma kuralları

### Norveç
- **Bokføringsplikt:** her satış, alış, banka hareketi kayıtlı olmalı.
- Saklama süresi: **5 yıl** (bazı belgeler 10 yıl).
- Satış belgeleri numaralı ve kesintisiz sırada olmalı.
- Nakit satış varsa **kassasystem** (onaylı yazarkasa) zorunlu — online satışta gerekmez.

### Türkiye
- Şahıs: **İşletme Defteri** (Defter-Beyan Sistemi üzerinden, ücretsiz).
- Limited: **e-Defter** (yevmiye + kebir), aylık berat yükleme.
- Saklama: **5 yıl** (TTK'ya göre defterler 10 yıl).
- E-arşiv faturalar GİB sisteminde saklanır ama kendi yedeğini de al.

## Aylık rutin (öneri)

```
Her ayın 1-5'i        Önceki ayın tüm satış/gider belgelerini muhasebeye gönder
Her ayın 5-10'u       Banka mutabakatı, Shopify/pazaryeri raporlarını indir
Her ayın 10-15'i      Stok sayımı, birim ekonomi tablosunu güncelle (doküman 07)
Her ayın 20-28'i      TR beyannameleri (SMMM), NO MVA (2 ayda bir)
Çeyrek sonu           Kâr/zarar, kur farkı, fiyat gözden geçirme
```

## Muhasebeye her ay gönderilecek dosyalar

- [ ] Shopify → *Analytics > Reports > Finances summary* (aylık PDF/CSV)
- [ ] Shopify Payments payout raporu
- [ ] Vipps / Klarna / iyzico ekstresi
- [ ] Pazaryeri komisyon faturaları (Trendyol, Etsy, Amazon)
- [ ] Kargo faturaları
- [ ] Reklam faturaları (Meta, Google, TikTok) — **ters yükümlülük KDV'ye dikkat**
- [ ] Tedarikçi faturaları + ithalat/ihracat beyannameleri (ETGB)
- [ ] Banka ekstresi (her iki ülke)

> **Reklam faturaları uyarısı:** Meta/Google faturaları İrlanda'dan gelir.
> Türkiye'de **sorumlu sıfatıyla KDV (2 no'lu KDV beyannamesi)** ve
> **dijital hizmet vergisi** yükümlülüğü doğurabilir. Norveç'te **snudd avregning**
> (reverse charge) uygulanır. SMMM'ne mutlaka söyle.
