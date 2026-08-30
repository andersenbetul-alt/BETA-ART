# NAV Sistemi — Pårørende Rehberi

> Bu belge NAVIAR CARE içerik ve bot geliştirme için referans.
> Bilgiler nav.no kaynaklıdır; başvuru öncesi her zaman nav.no'dan
> güncel bilgileri doğrulayın.

## NAV nedir

NAV (Arbeids- og velferdsetaten) Norveç'in çalışma ve sosyal yardım
idaresidir. Hastalık, engellilik, iş kaybı ve bakım gibi durumlar için
ekonomik destek ve pratik yardım sağlar.

## Pårørende olarak en çok başvurulan yardımlar

### Pleiepenger (Bakım parası)
Kronik veya ciddi hastalığı olan bir çocuğun bakımı için işten ayrılmak
zorunda kalan ebeveynlere ödenir.

**Koşullar:**
- Çocuk 18 yaşından küçük olmalı (bazı durumlarda 20 yaşa kadar)
- Ebeveyn, bakım nedeniyle tam veya kısmi iş kaybı yaşamalı
- Çocuğun tıbbi ihtiyacı belgelenmiş olmalı

**Başvuru adımları:**
1. nav.no/pleiepenger adresinden dijital başvuru
2. Doktor belgesi (legeerklæring) hazırlanır
3. Çocuğun hastanesi veya avtalelegen (aile hekimi) formu doldurur
4. NAV ortalama 3–4 hafta içinde karar verir

**İpucu:** Pleiepenger geriye dönük olarak (retroaktif) 3 yıla kadar
talep edilebilir — öğrenmeden önce hak kazanıldıysa geçmişi kapsıyor.

---

### Omsorgspenger (Bakım günleri)
Hasta çocuk nedeniyle işe gidilemeyen günler için kullanılır.

**Kota:** Standart 10 gün/yıl. Kronik hastalıkta veya tek ebeveynde artar.

**Başvuru:** İşvereninize bildirin; işveren kota aşılınca NAV'dan tazmin alır.

---

### Omsorgsopptjening (Bakım hizmetleri emeklilik puanı)
Yaşlı veya engelli bir yakınına evde bakım sağlayan kişilere emeklilik
puanı kazandırır. Belediyeye başvurulur, NAV'a değil.

---

### Klage (İtiraz süreci)
NAV kararına itiraz etmek için:

1. Kararı alındıktan sonra **6 hafta** içinde itiraz edilmeli
2. nav.no üzerinden dijital itiraz veya yazılı itiraz
3. NAV önce kendi kararını inceler
4. Kabul edilmezse dosya Trygderetten'e (sosyal güvenlik mahkemesi) gider

**İtirazda ne belirtilmeli:**
- Hangi karara itiraz edildiği (saksnummer)
- İtirazın gerekçesi ve eksik bulunan değerlendirme
- Varsa ek belgeler

---

## NAV ile iletişim

| Kanal | Kullanım |
|---|---|
| nav.no — Min side | Dijital başvuru, belgeler, kararlar |
| 55 55 33 33 | Telefon (Pazartesi–Cuma 09–15) |
| nav.no/kontakt | Yazılı mesaj (giriş gerekli) |
| Yerel NAV kontoret | Randevulu yüz yüze görüşme |

**Dikkat:** NAV asla SMS veya e-postayla BankID bilgisi istemez. Böyle
bir mesaj alınırsa svindel (dolandırıcılık) olabilir.

## Bot davranış notu

naviar-consult botu NAV süreçleri hakkında genel rehberlik sağlar,
ancak bireysel hukuki tavsiye vermez. Karmaşık durumlarda her zaman
yerel NAV kontoret veya Fri rettshjelp (ücretsiz hukuki yardım)
önerilmeli.
