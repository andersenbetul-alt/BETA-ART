# QBLOGG içerik paneli (panel/) — kurulum ve mimari

Tarih: 02.09.2026 · Durum: v1 kod hazır, **canlı değil, uçtan uca doğrulanmadı**.
Karar kaydı: kullanıcı onayı ile — "web sayfasını düzenleyen kişi" için ayrı
sistem, mimari GitHub'a doğrudan yazan hafif panel (`uye/` deseninin devamı).

## Mimari

```
qblogg.com (ana site)             DEĞİŞMEDİ — sıfır bağımlılık, statik
uye.qblogg.com (üye/okur)         DEĞİŞMEDİ — ayrı Vercel + Supabase
        │
        ▼
panel.qblogg.com (yeni, ayrı Vercel projesi)
  panel/index.html   tek dosyalık istemci: GitHub PAT girişi + iki form
  panel/vercel.json  bu uygulamaya özel başlıklar/CSP
```

- Üçüncü ayrı uygulama; ana sitenin dağıtımı `panel/` klasörünü kopyalamaz.
- **Bağımlılık yok** — `uye/`'nin aksine bir SDK bile gerekmiyor: GitHub'ın
  REST API'si düz `fetch()` ile çağrılıyor, vendor'lanacak bir kütüphane yok.
- Kimlik doğrulama Supabase/magic-link değil, GitHub kişisel erişim jetonu
  (PAT) — editor jetonu panelin giriş ekranına yapıştırır, panel
  `GET /user` ile doğrular. Jeton yalnızca `sessionStorage`'da tutulur
  (sekme kapanınca silinir), hiçbir sunucuya gönderilmez — tek gittiği yer
  `api.github.com`.
- Panel **hiçbir zaman `main`'e doğrudan yazmaz.** Her iki işlev de bir
  inceleme adımı üretir: site ayarları değişikliği bir Pull Request,
  yeni yazı önerisi bir Issue açar.

## v1 işlevleri (bilinçli dar kapsam)

1. **Site ayarları (`assets/js/config.js`)** — sosyal hesap adresleri,
   e-posta, form servisi adresi için bir form. Gönderilince: yeni bir dal
   açılır (`panel/config-<zaman>`), dosyanın **yalnızca hedeflenen
   satırları** satır-bazlı regex ile yamalanır (tam yeniden üretim değil —
   yorumlar ve biçimlendirme birebir korunur, Node'da gerçek dosyaya karşı
   doğrulandı), sonra `main`'e karşı bir PR açılır.
2. **Yeni yazı öner** — başlık, kategori, tek cümlelik gerekçe, bilinen
   kaynaklar. Bilinçli olarak **yazıyı kendisi üretmez** — 10 dilde,
   kaynak zorunlu, 16 maddelik görünürlük kuralına tabi bir yazı üretmek
   ayrı bir üretim adımı (`qblogg-blog-yazisi` becerisi). Panel yalnızca
   konuyu bir GitHub Issue olarak kayda geçirir (`yeni-yazi-onerisi`
   etiketiyle) — otomatik, denetimsiz çok-dilli içerik üretiminin
   `gorunurluk.mjs` kapısını atlama riski böylece hiç doğmuyor.

**Bilinçli olarak v1'de YOK:** posts.js'in tam gövde düzenlemesi (30-55
blok, 10 dil, block-dizisi biçimi — güvenli bir form/parser inşa etmek
başlı başına ayrı bir proje), kullanıcı yönetimi (kaç editör olacağı,
rol ayrımı), otomatik merge.

## Doğrulanan ve DOĞRULANAMAYAN kısım — açıkça işaretli

**Doğrulandı (bu ortamda):**
- `patchConfig` mantığı gerçek `config.js` dosyasına karşı Node'da
  çalıştırıldı: hedeflenen alanlar doğru değişti, geri kalanı bayt bayt
  aynı kaldı, çıktı geçerli JS olarak yüklendi.
- Panel arayüzü gerçek tarayıcıda (Playwright) hatasız render oluyor,
  sekme geçişi çalışıyor.
- `GET https://api.github.com/user`'a `Origin` başlığıyla yapılan düz bir
  istek `Access-Control-Allow-Origin: *` döndürdü — GitHub'ın API'si CORS'u
  gerçekten destekliyor.

**DOĞRULANAMADI — bilinçli sınır:** Panelin gerçek istekleri
`Authorization` başlığı taşıdığı için tarayıcı önce bir CORS ön-denetimi
(preflight, `OPTIONS`) gönderir. Bu ortamın giden trafiği bir vekil
sunucudan geçiyor ve `OPTIONS` isteğine vekil 405 döndürdü — bu GitHub'ın
gerçek davranışı mı yoksa bu kum havuzuna özgü bir vekil kısıtlaması mı,
buradan ayırt edilemedi (vekilin kendi 403/405/407 kısıtlamaları olduğu
ortamın kendi belgelerinde de yazıyor). **Gerçek kullanıcının tarayıcısı
bu vekilden hiç geçmeyecek** — dolayısıyla bu belirsizlik yalnızca test
imkânımı sınırlıyor, panelin kendisini değil.

Güvenim yine de yüksek çünkü aynı desen (fetch ile doğrudan
`api.github.com`'a PAT'lı istek) üretimde çalışan bilinen açık kaynak
araçların (Decap/Netlify CMS'in GitHub arka ucu gibi) temel çalışma
şekli — ama bu **hatırlanan bilgi**, bu oturumda birebir doğrulanmadı.
**İlk gerçek girişte** (panel canlıya alınıp bir PAT girildiğinde) "Site
ayarları" formunu bir kez test edip PR'ın gerçekten açıldığını görmek,
bu belgeyi "doğrulandı" olarak güncellemenin koşuludur.

## Kurulum — sizin adımlarınız

1. **Vercel projesi açın** (ayrı proje, `uye` ile aynı takımda):
   Root Directory: `panel`, Framework: Other/Static, Build Command: boş,
   Output Directory: `.` (kök) — `panel/index.html` ve `panel/vercel.json`
   tek başına yeterli, ek bir build adımı gerekmiyor.
2. **PAT üretin:** GitHub → sağ üst profil → Settings → Developer settings
   → Personal access tokens → **Fine-grained tokens** → Generate new token.
   - Repository access: **Only select repositories** → `BETA-ART-PRIVAT`.
   - Permissions: **Contents** → Read and write, **Issues** → Read and
     write, **Pull requests** → Read and write. Başka hiçbir izin vermeyin.
   - Expiration: kısa tutun (30-90 gün) — süresi dolunca yeni jeton
     üretip panele tekrar girersiniz.
3. Panel adresine gidin, jetonu yapıştırın, "Giriş yap".
4. "Site ayarları" sekmesinde mevcut değerler otomatik yüklenir (boş
   alanlar boş görünür — bu normal, henüz doldurulmadılar). Doldurup
   gönderin; açılan PR'ı GitHub'da inceleyip `npm run check` +
   `npm run guvenlik` sonrası siz (ya da bu oturuma dönersem ben) merge
   eder.

## Bilinen sınırlar (bilinçli)

- Tek editör rolü var — herkese aynı yetki (PAT sahibi olan herkes
  Contents+Issues+PR yazabilir). Birden fazla editör olacaksa her biri
  kendi PAT'ını üretir; kimin ne yaptığı GitHub'ın kendi commit/PR
  yazarlığı üzerinden izlenir, panelin kendi kullanıcı sistemi yok.
- `payLinks` ve `prices` alanları v1 formunda yok (yalnızca sosyal +
  mailTo + formEndpoint) — en sık ihtiyaç duyulanlar bunlardı (bkz.
  `docs/sosyal-medya-stratejisi.md`); istenirse form genişletilir.
- Yeni bir dal her gönderimde zaman damgasıyla açılır
  (`panel/config-<ms>`) — eski, birleştirilmemiş dallar birikir, periyodik
  temizlik (silme) gerekebilir.
