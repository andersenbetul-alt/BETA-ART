# Gözlemler

Bu oturumda **en az iki kez** görülen kalıplar. Her biri kayıttır, yorum
değil: kaç kez, nerede, ne önerildi.

Durum sütunu: `açık` = kullanıcı henüz karar vermedi · `kabul` = beceriye ya
da kurala dönüştü · `ret` = tekrar etti ama kural olmayı hak etmedi.

---

## 1. Araç sustu diye "sonuç yok" denildi

- **Kaç kez:** 3 — beceri arama ("bulunamadı" aslında bağlanamadı),
  `design-extract` deposu (404 sanıldı, aslında yetki), Vercel CLI
  (boş çıktı sanıldı, aslında proxy 403)
- **Kalıp:** Ağ engeli, boş sonuçla aynı görünüyor. İkisi ayırt edilmeden
  "yok" diye rapor edildi.
- **Ayırt etme yolu:** `curl -s -o /dev/null -w '%{http_code}'` → `000`
  bağlanamadı demektir, `200` + boş gövde gerçekten boş demektir. Bilinen
  iyi bir hedefle kontrol testi yapılır.
- **Öneri:** CLAUDE.md satırı — *"erişilemedi" ile "sonuç yok" ayrı raporlanır;
  ayrım ölçülmeden yazılmaz.*
- **Durum:** açık

## 2. Test değer yazdırdı, iddia etmedi

- **Kaç kez:** 2 — kredi FIFO kontrolü, tooltip görünürlük kontrolü
- **Kalıp:** Test çıktısı gözle okundu ve "doğru görünüyor" denildi. Test
  bozulduğunda hâlâ sıfırla çıkıyordu.
- **Kanıt:** FIFO mantığı kasten bozulduğunda süit gerçekten düştü (çıkış 3);
  bu davranış eklendikten *sonra* doğrulandı.
- **Öneri:** `references/checkpoints.md` zaten bunu kapsıyor — güncellendi,
  yeni beceri gerekmiyor.
- **Durum:** kabul (kontrol noktası olarak)

## 3. Toplu değiştirme ilgisiz satıra dokundu

- **Kaç kez:** 2 — `auth.users ... where id =` iki satırda yanlışlıkla
  `auth_user_id` yapıldı; `--muted` iddiası koyu temayı da kapsayacak kadar
  genişti
- **Kalıp:** Desen, hedeflenenden fazlasını eşledi. İkisinde de hata düzenleme
  anında değil, test düştüğünde görüldü.
- **Öneri:** CLAUDE.md satırı — *toplu değiştirmeden önce eşleşme sayısı
  okunur (`grep -c`), sonra beklenen sayıyla karşılaştırılır.*
- **Durum:** açık

## 4. Veri modeli kararı sessizce güvenlik kararıydı

- **Kaç kez:** 2 — `on delete cascade` (kullanıcı silinince muhasebe kaydı
  gidiyordu), satır politikası var ama sütun izni yok (kullanıcı kendi KDV'sini
  "doğrulanmış" işaretleyebiliyordu)
- **Kalıp:** Şema alanı rutin görünüyordu; sonucu saklama yükümlülüğü ve vergi
  kaçağıydı. İkisi de ancak sömürü fiilen çalıştırılınca görüldü.
- **Öneri:** Yeni beceri değil — `db/test_auth.sql` içine kilitlendi (D1–D5, V1).
  Kural: *her yeni tabloya RLS açılırken "hangi sütun kimin?" ayrıca yazılır.*
- **Durum:** kabul (test olarak)

## 5. Kurulum komutu platform varsayımıyla verildi

- **Kaç kez:** 2 — `brew` (macOS), `winget` (Windows); ortam Linux
- **Kalıp:** Komut, çalıştığı yerde değil, geldiği yerde varsayıldı.
- **Öneri:** Kural olmayı hak etmiyor — komutlar kullanıcıdan geliyor,
  benim ürettiğim bir kalıp değil. Çevirisi tek satır.
- **Durum:** ret

---

## Beceriye dönüşmeyi bekleyenler

1 ve 3 aynı kökten: **ölçmeden rapor etmek.** İkisi tek bir CLAUDE.md
maddesinde birleşebilir. Ayrı beceri açmak için erken — kendi tetikleyicisi
yok, mevcut çalışmanın içinde geçiyor.
