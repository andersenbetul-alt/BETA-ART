# Dijital Yardım Protokolü — Digital hjelp sammen

> naviar-consult botu ve NAVIAR CARE içeriği için rehber.
> Yaşlı bireyler ve pårørende ile dijital ortamda çalışırken
> dikkat edilecek ilkeler.

## Temel ilkeler

**Güven önce:** Dijital ortamda güvenlik her şeyden önce gelir.
Kullanıcı şüphe duyduğunda "dur ve sor" doğru yanıttır.

**Hız değil, doğruluk:** Yaşlı kullanıcılar için adımlar yavaş,
net ve tekrarlanabilir olmalıdır.

**Pårørende rolü:** Yakın aile üyesi destek verir ama gizlilik sınırına
dikkat eder — sağlık bilgileri paylaşmak kullanıcının onayını gerektirir.

---

## Kritik dijital araçlar

### BankID
Norveç'in en yaygın kimlik doğrulama sistemi. Bankacılık, nav.no,
helsenorge.no ve digipost için kullanılır.

**Güvenlik kuralları:**
- BankID kodları (engangskode / app şifresi) hiç kimseyle paylaşılmaz
- Telefon veya e-postayla BankID isteyen kişi her zaman dolandırıcıdır
- Şüpheli BankID girişi fark edilirse: bankanızı hemen arayın

**BankID app sorunları:** Bank BankID veya app yenileme için doğrudan
bankaya gidilmeli — telefon bankacılığı genellikle yeterli değil.

---

### MinID
BankID olmadan da kullanılabilen hafif kimlik doğrulama. Nav.no bazı
işlemler için MinID'yi kabul eder.

**Başvuru:** minid.no — fødselsnummer + mobiltelefon yeterli.

---

### Altinn (altinn.no)
Kamu kurumlarına dijital belge ve başvuru sistemi. NAV, Skatteetaten,
Brønnøysundregistrene ve belediyeler bu sistemi kullanır.

**Yaygın kullanım:**
- Skattekort (vergi kartı) güncelleme
- Selvangivelse (vergi beyannamesi) kontrolü
- Belediyeye resmi başvurular

---

### Helsenorge.no
Sağlık hizmetlerine dijital erişim noktası.

**Neler yapılabilir:**
- Legetime (doktor randevusu) görme ve iptal
- Resept (reçete) sorgulama
- Sykemelding (hastalık izni belgesi) görme
- Sağlık kayıtlarına erişim (Kjernejournal)

**Dikkat:** Pårørende kendi hesabıyla başka birinin sağlık bilgilerine
erişemez; kullanıcının kendi hesabıyla giriş yapması gerekir.

---

### Digipost (digipost.no)
NAV kararları ve kamu yazışmaları artık büyük ölçüde Digipost'a gelir.

**Aktivasyon:** digipost.no → BankID ile giriş → aktivasyon.
Aktivasyon yapılmadıysa mektuplar fiziksel olarak gelir.

---

## Svindel (Dolandırıcılık) işaretleri

Aşağıdakilerin HERHANGİ BİRİ dolandırıcılık belirtisidir:

| İşaret | Açıklama |
|---|---|
| SMS/e-posta ile BankID/PIN isteme | Gerçek kurumlar asla istemez |
| "Hemen tıklayın, aksi hâlde" baskısı | Korkutucu aciliyet |
| Tanımadığınız numara + resmi isim | Sahte numara spoofing |
| Ödeme için gift card (iTunes, Google Play) | Dolandırıcı tuzağı |
| nav.no'ya çok benzeyen adres (örn. nav-hjelp.no) | Sahte site |

**Ne yapılmalı:**
1. Tıklamayın, yanıt vermeyin
2. Politi/Kripos'a bildirin: politiet.no/svindel
3. Nasjonal kommunikasjonsmyndighet (Nkom): nkom.no

---

## Bot davranış notu

Kullanıcı bir dijital işlemde "ne yapacağımı bilmiyorum" dediğinde,
botu adım adım rehberlik moduna geçer. Her adım tek tek onaylanır.
"Şüphe duyuyorum" cevabı durdurmak için her zaman yeterlidir.

naviar-consult BankID veya şifre bilgisi hiçbir zaman istemez.
