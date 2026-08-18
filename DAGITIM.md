# Yayına alma — qblogg.com

Site saf statik: derleme adımı yok, sunucu tarafı kod yok. Herhangi bir statik
barındırıcıya olduğu gibi yüklenir. Aşağıdaki adımlar Vercel içindir.

## 1. Yayınla

Depo bu ortamdan GitHub'a gönderilemiyor (GitHub App'in yazma izni kapalı), bu
yüzden ilk yayın kendi makinenizden yapılır. Proje klasörünün içinde:

```bash
npx vercel login          # bir kereye mahsus
npx vercel --prod
```

Sorduklarına şöyle cevap verin:

| Soru | Cevap |
|---|---|
| Set up and deploy? | **y** |
| Which scope? | **BET - ART** |
| Link to existing project? | **n** |
| Project name? | **qblogg** |
| In which directory is your code? | **./** (Enter) |
| Want to modify settings? | **n** — `vercel.json` zaten doğru ayarlı |

Çıktıda `https://qblogg-....vercel.app` adresi verilir. Alan adını bağlamadan
önce bu adreste siteyi bir kez açıp kontrol edin.

**Not:** GitHub yazma izni açılırsa bu adım tamamen kalkar. Depoyu Vercel'e
bağladığınızda her push kendiliğinden yayına gider ve elle dağıtım gerekmez.

## 2. Alan adını bağla

Vercel panelinde: **Project → Settings → Domains → Add** → `qblogg.com`.

Vercel size iki kayıt gösterir. Alan adınızı aldığınız yerin DNS panelinde
bunları girin:

| Tip | Ad | Değer |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | Vercel'in panelde gösterdiği değer |

**CNAME değerini panelden okuyun, buraya yazmayın.** Vercel bu hedefi projeye
göre veriyor (`cname.vercel-dns.com` ya da `cname.vercel-dns-N.com` olabilir);
yanlış değer sessizce çalışmaz.

Alternatif — alan adının ad sunucularını (nameserver) tamamen Vercel'e
devrederseniz DNS'i Vercel yönetir ve tek tek kayıt girmezsiniz. Daha kolay,
ama e-posta kayıtlarınızı (MX) da oraya taşımanız gerekir.

Yayılma genelde 10 dakika–2 saat sürer, en kötü 48 saat. HTTPS sertifikası
doğrulama biter bitmez otomatik gelir.

### www mi, www'siz mi

Birini asıl adres seçin, diğerini ona yönlendirin. Öneri: **qblogg.com** asıl,
`www.qblogg.com` ona yönlensin. İkisi de açık kalırsa arama motoru aynı sayfayı
iki adreste görür.

## 3. Yayın sonrası

- `assets/js/config.js` içindeki `mailTo` adresini kendi kutunuza çevirin.
  Şu an `hello@qblogg.com` — bu adrese posta gelmiyorsa formlar boşa gider.
- Sosyal hesap adreslerini `config.js` içine girin; boş bırakılanlar altbilgide
  gösterilmiyor, ölü bağlantı oluşmuyor.
- Search Console'a `qblogg.com` mülkünü ekleyin ve `sitemap.xml` gönderin.
- Bing Webmaster Tools'a da ekleyin: AI aramalarının bir kısmı Bing dizinini
  kullanıyor.

## Yapılandırma dosyaları

`vercel.json` şunları ayarlıyor:

- **cleanUrls** — `/blog.html` yerine `/blog` çalışır
- **Önbellek** — yazı tipleri bir yıl değişmez damgalı; CSS ve JS her istekte
  doğrulanır (derleme adımı olmadığı için dosya adında sürüm damgası yok)
- **Güvenlik başlıkları** — HSTS, nosniff, referrer politikası, çerçeveleme
- **CSP** — `script-src 'self'`: satır içi script çalışmaz. Bu bilinçli.
  Yeni bir sayfaya satır içi `<script>` eklerseniz **sessizce çalışmaz**;
  kodu `assets/js/app.js` içine koyun.

`.vercelignore` motoru, betikleri, dokümanları ve türev içerik kaynaklarını
yayının dışında tutuyor — bunların hiçbiri tarayıcıya gitmemeli.
