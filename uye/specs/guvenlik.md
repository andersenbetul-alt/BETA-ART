# uye/ güvenlik spec'leri — RLS iddialarının test tarifi

Kaynak: docs/test-mimarisi.md kararı. Bu spec'ler Supabase projesi
kurulup anahtarlar `uye/config.js`'e girildikten sonra Playwright
testlerine çevrilir (spec başına bir test). Şema referansları:
`uye/schema.sql` + `uye/schema-platform.sql`.

## S1 — Girişsiz ziyaretçi yalnız örnek brief görür

- **Given:** briefs tablosunda is_sample=true bir kayıt ve is_sample=false
  en az bir kayıt var; ziyaretçi oturum açmamış (anon anahtar).
- **When:** briefs üzerinde select (tüm kolonlar) çalıştırılır.
- **Then:** yalnız is_sample=true satır(lar) döner; is_sample=false
  satırların body_md dahil HİÇBİR alanı dönmez.

## S2 — free üye örnek olmayan gövdeyi alamaz

- **Given:** plan_status='free' bir üye oturum açmış; örnek olmayan
  yayınlanmış brief mevcut.
- **When:** briefs select edilir.
- **Then:** örnek olmayan satırlar hiç dönmez (başlık dahil); yalnız
  örnekler görünür. plan_status='active' yapılınca aynı sorgu tüm
  satırları döndürür.

## S3 — Onaysız yazar anonim listede görünmez

- **Given:** authors tablosunda approved=false bir yazar ve bu yazara
  bağlı kitap/yazı kayıtları var; istemci anonim.
- **When:** authors, books ve author_posts select edilir.
- **Then:** onaysız yazarın satırı, kitapları ve yazıları dönmez;
  approved=true yapılınca yazar + kitapları görünür (yazılar yalnız
  status='yayinda' ise).

## S4 — Yazar başkasının kaydına dokunamaz

- **Given:** iki onaylı yazar (A ve B); B'nin bir kitabı ve yazısı var;
  A oturum açmış.
- **When:** A, B'nin kitabını update/delete ve B'nin yazısını update
  etmeye çalışır.
- **Then:** her deneme etkisiz kalır (0 satır etkilenir / hata);
  B'nin verisi değişmeden durur.

## S5 — Yazar kendini "yayinda" yapamaz; düzenleme incelemeye düşürür

- **Given:** yazar A'nın status='taslak' bir yazısı ve (yönetici eliyle)
  status='yayinda' bir yazısı var.
- **When:** (a) A taslağı status='yayinda' ile update eder;
  (b) A yayındaki yazının gövdesini status='yayinda' koruyarak update eder;
  (c) A yayındaki yazıyı status='incelemede' ile update eder.
- **Then:** (a) ve (b) reddedilir (with check); (c) başarılıdır ve yazı
  anonim listeden kaybolur.

## S6 — approved alanını istemci değiştiremez

- **Given:** yazar A oturum açmış, kendi authors satırı approved=false.
- **When:** A kendi satırında approved=true update'i dener (bio
  güncellemesiyle birlikte ve tek başına).
- **Then:** guard trigger reddeder; bio-yalnız update başarılıdır,
  approved değişmez.

Çalıştırma notu: testler iki istemci bağlamı ister (anon + oturumlu);
oturum açma magic-link yerine test için Supabase test kullanıcısı +
şifre girişiyle yapılabilir (yalnız test projesinde). Yönetici
kurulumları (approved=true, status='yayinda') test hazırlığında SQL
editöründen yapılır.
