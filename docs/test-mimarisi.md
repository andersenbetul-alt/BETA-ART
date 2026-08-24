# Test mimarisi — spec-driven Playwright standardının değerlendirmesi

Tarih: 24.08.2026. Kullanıcı, NAVIAR Care için önerilen üç katmanlı
yapıyı iletti (specs/ insan-okur planlar → tests/*.spec.ts Playwright →
.github/agents/ ajan tanımları; rol bazlı klasörler + safety/) ve
"web sayfaları için hangi aracı kullanmalıyız" sorusunu sordu.

## Cevap: Playwright — zaten standardımız

Web arayüzü testi için araç kararı verilmiş durumda ve öneriyle uyumlu:
depo Playwright kullanıyor (run-qblogg becerisi: smoke 5 akış + ekran
görüntüsü; demo/uye doğrulamaları aynı yolla). Locator öncelik önerisi
(getByRole → getByLabel → getByText → getByTestId; uzun CSS/XPath
kırılgandır) doğrudur ve mevcut sürücü zaten böyle yazılmıştır.

## Bu ortama özgü düzeltmeler (önerideki komutlar aynen çalışmaz)

1. **`npx playwright codegen` bu konteynerde çalışmaz** — codegen
   etkileşimli bir tarayıcı penceresi açar; burada ekran yok. Codegen
   kullanıcının kendi bilgisayarının aracıdır. Bu ortamda test üretimi
   elle/ajanla yazılır ve headless koşulur.
2. **Kurulum yapılmaz:** Chromium hazır (`/opt/pw-browsers/chromium`);
   Playwright depo cwd'sinden çözülmez, `createRequire('/opt/node22/
   lib/node_modules/')` ile yüklenir (run-qblogg/driver.mjs'te örneği).
   `npm i playwright` / `playwright install` ÇALIŞTIRILMAZ (CLAUDE.md).
3. **QBLOGG ana sitesi için tam test altyapısı (playwright.config.ts +
   spec dosyaları) kurulmaz** — sıfır bağımlılık ilkesi; check.mjs +
   guvenlik.mjs + run-qblogg smoke bu işi görüyor. Spec-driven yapı,
   DURUM İÇEREN uygulamalar için anlamlı: uye/ ve (yaşarsa) NAVIAR Care.

## Benimsenen kısım: uye/ platformu için safety spec'leri

Öneri klasörlerinden en değerlisi `safety/`. uye/ Supabase anahtarları
gelip uçtan uca test başlayınca şu senaryolar spec olarak yazılıp
Playwright ile koşulacak (RLS iddialarının kanıtı — schema yorumu değil):

1. Girişsiz ziyaretçi yalnız `is_sample=true` brief görür; body_md
   diğer satırlar için hiç dönmez.
2. `plan_status='free'` üye, örnek olmayan brief'in gövdesini alamaz.
3. Onaysız yazarın profili/kitapları anonim listede görünmez
   (schema-platform.sql politikaları).
4. Yazar, başka yazarın kitabını/yazısını güncelleyemez-silemez.
5. Yazar, yazısını `yayinda` durumuna kendisi çekemez; yayındaki
   yazıyı düzenleyince durum inceleme kuyruğuna döner.
6. `approved` alanını istemci oturumu değiştiremez (guard trigger).

Biçim: önce `uye/specs/guvenlik.md` (Given/When/Then, insan-okur),
sonra spec başına bir test. Ajan katmanı (.github/agents/) şimdilik
kurulmaz — tek oturumlu çalışmada bu belge + beceriler aynı işi görür;
CI'da otomatik koşum gerekirse o gün eklenir.

## NAVIAR Care notu

Rol bazlı klasörleme (public/customer/helper/admin/safety) ve
"aynı booking'i iki helper kabul edemez" tarzı yarış-durumu testleri
o platform gerçekten yazılırsa doğru standarttır; bu depo o kararı
yalnız kayıt eder (NAVIAR işi bu depoda geliştirilmiyor).
