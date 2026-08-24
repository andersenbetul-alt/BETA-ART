---
name: task-observer
description: Uzun süren veya arka planda çalışan işleri izler ve durumunu raporlar. Test koşumu, build, deploy, veritabanı migrasyonu, PR/CI durumu gibi "başlattım, bitince haber ver" işleri için kullanılır. Ayrıca bir işin gerçekten bitip bitmediğini doğrular — "çalıştı" ile "geçti" arasındaki farkı ayırt eder. Kullanıcı "izle", "takip et", "bitince söyle", "durumu ne", "hâlâ çalışıyor mu" dediğinde veya uzun süren bir komut başlatıldığında devreye girer.
---

# Task Observer

Bir işin durumunu **ölçerek** raporlar. Tahmin etmez, "muhtemelen bitmiştir"
demez, çıkış kodu görmeden "geçti" demez.

## Temel kural

**Çıkış kodu görülmeden hiçbir iş "başarılı" sayılmaz.**

Bu becerinin var olma sebebi tek bir hata biçimidir: bir komut çalışır, çıktısı
makul görünür, ve durum "tamam" diye raporlanır — ama komut aslında sıfırdan
farklı bir kodla çıkmıştır ya da hiç çalışmamıştır. Bu proje bunu iki kez yaşadı:

- Bir test dosyası yalnızca değer yazdırıyordu, doğrulama yapmıyordu; "testler
  geçiyor" denebilmesi için önce hata durumunda çökebilmesi gerekti.
- Bir beceri arama komutu bağlantı kuramayınca hata yerine "sonuç yok" dedi;
  "arama boş döndü" ile "arama çalışmadı" karıştırıldı.

Her ikisinde de çıktı makuldü. Ölçüm makul değildi.

## Nasıl izlenir

### 1. Ne beklediğini önce yaz

İzlemeye başlamadan **bitiş koşulunu** ve **başarı ölçütünü** ayrı ayrı tanımla:

| İş | Bitti mi? | Başarılı mı? |
| --- | --- | --- |
| Test koşumu | Süreç sonlandı | Çıkış kodu 0 |
| Build | Dosya üretildi | Üretilen dosya commit edilenle aynı |
| Deploy | Durum READY | Sayfalar açılıyor, bağlantılar kırık değil |
| Migrasyon | psql döndü | Şema beklenen tabloları içeriyor |

"Bitti" ile "başarılı" aynı şey değildir. İkisini ayrı sor.

### 2. Doğru bekleme aracını seç

| Durum | Araç | Neden |
| --- | --- | --- |
| Bu oturumda başlattığın arka plan işi | Otomatik bildirim | Harness iş bitince seni zaten uyandırır — yoklama yapma |
| Bir koşulun sağlanmasını bekleme | `Monitor` | Koşul sağlanınca döner |
| Dış sistem durumu (CI, deploy, kuyruk) | `/loop` uygun aralıkla | Harness bunları bildiremez |
| Uzun bekleme, sonra tekrar bak | `send_later` | Oturum bekleyerek boşa harcanmaz |
| PR olayları | `subscribe_pr_activity` | Olay geldiğinde uyandırır |

**Asla `sleep` ile bekleme.** Beklerken oturum donar ve kullanıcı araya
giremez.

**Kısa aralıklı yoklama yapma.** Harness'ın takip ettiği iş bitince zaten
haber verir; 30 saniyede bir kontrol etmek boşa gider. Yalnızca harness'ın
göremediği dış durum için (CI, deploy) aralık seç ve aralığı işin gerçek
hızına göre belirle — 8 dakikalık bir CI için tek bir 8 dakikalık kontrol,
sekiz tane 1 dakikalık kontrolden iyidir.

### 3. Ölçerek doğrula

Bittiğini düşündüğünde, düşünceyi kontrol et:

```bash
./run-tests.sh; echo "cikis: $?"          # cikis kodu goruldu mu
git status --porcelain                     # surukleme var mi
```

Bu projenin doğrulanabilir kontrol noktaları: `references/checkpoints.md`

### 4. Raporla

Rapor kısa olmalı ve üç şeyi söylemeli: **ne oldu, kanıt ne, sırada ne var.**

- Geçtiyse: hangi kontrol, hangi çıkış kodu.
- Düştüyse: hangi adım, hata satırı, ve düzeltme önerisi.
- Hâlâ çalışıyorsa: ne kadar süredir, ne bekleniyor, ne zaman tekrar bakılacak.

Sessizce beklemek de bir rapordur — ama yalnızca bir kez söylenmişse.
Durum değişmediyse aynı şeyi tekrar söyleme.

Ayrıntı: `references/reporting.md`

## Ne zaman kullanılmaz

- Anında biten komutlar (`ls`, `git status`) — sadece çalıştır.
- Tek seferlik iş — izleme kurmaya değmez.
- Kullanıcının sorusu "bu ne durumda" değil de "şunu yap" ise — işi yap.
