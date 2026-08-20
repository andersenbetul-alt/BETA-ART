# 15 — cobban.eu'yu bağlamak

Bu doküman **senin yapman gereken** adımları anlatıyor. İkisi de benim
yapamayacağım işler: biri para harcıyor, diğeri Vercel panelinden manuel
onay istiyor.

## Durum

**cobban.eu ALINDI** (20 Ağu 2026). Kalan iş: Vercel'e eklemek ve DNS'i
yönlendirmek. Kod tarafı hazır — aşağıdaki "Kodda ne yapıldı" bölümüne bak.

| Alan adı | Durum | Not |
|---|---|---|
| **cobban.eu** | **alındı** | Vercel `.eu` satmıyor; ayrı kayıt şirketinden alındı |
| cobban.com | **alınmış** | Başkasında |
| cobban.no | boşta | Norveç için ikinci seçenek |
| cobban.app | boşta | |

`.eu` almak için AB/AEA'da ikamet veya kuruluş şartı var. **Norveç AEA
üyesi olduğu için Norveç adresiyle alınabilir.**

Site şu anda burada yayında ve herkese açık (koruma kapalı):
**https://cobban.vercel.app**

## 1. Alan adını al — ✅ tamam

## 2. Vercel'e ekle

Vercel panelinde: **cobban projesi → Settings → Domains → Add** →
`cobban.eu` ve `www.cobban.eu`.

> Bunu da ben yapamıyorum: Vercel'in MCP arayüzünde projeye alan adı
> ekleyen bir araç yok.

## 3. DNS'i yönlendir

Vercel ekleme sonrası **sana kesin değerleri gösterecek — panelde ne
yazıyorsa onu kullan.** Genelde şunlar çıkar:

| Kayıt | Ad | Değer |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns-0.com` |

Alternatif: alan adının nameserver'larını Vercel'e devret; o zaman tek tek
kayıt girmene gerek kalmaz.

Yayılma birkaç dakika ile birkaç saat arası sürer. TLS sertifikasını Vercel
otomatik alır.

## 4. Bağlandıktan sonra yapılacak kod değişiklikleri

Alan adı bağlanmadan bunları yapmanın anlamı yok, ama unutulmasın:

- `brand.json` içindeki alan adı alanı
- `app/layout.tsx` → `metadata.metadataBase = new URL('https://cobban.eu')`
  (canonical ve OG bağlantıları için)
- `app/robots.ts` ve `app/sitemap.ts` — henüz yok, alan adıyla birlikte eklenmeli
- `MET_USER_AGENT` içindeki iletişim adresi (`hei@cobban.com` → gerçek adres)

## Neden `.eu`

Ürün artık 13 AB/AEA ülkesinde çalışıyor ve konumlandırma tek bir ülkeye
bağlı değil. `.eu` kapsamı doğru anlatıyor; `.no` ürünü Norveç'e hapseder.


## Kodda ne yapıldı

Alan adı gelince kod tarafında üç şey gerekiyordu; üçü de yapıldı.

| Ne | Nerede | Neden |
|---|---|---|
| `siteUrl` | `web/lib/site.ts` | Tek kaynak. `NEXT_PUBLIC_SITE_URL` varsa onu kullanır (önizleme dağıtımları kendi adresini bilsin diye), yoksa `https://cobban.eu` |
| `metadataBase` | `web/app/layout.tsx` | Bu olmadan canonical etiketleri ve paylaşım kartları **çözümlenmiyordu**. Yardım sayfaları göreli canonical veriyor, kökü buradan alıyor |
| `sitemap.xml` + `robots.txt` | `web/app/sitemap.ts`, `web/app/robots.ts` | Sitemap sorun türleri ve yardım sayfalarından **otomatik** üretiliyor; elle tutulan liste unutulan listedir |

### Yakın kopya sorunu

Ülke seçimi `?country=DE` ile taşınıyor. Sekiz ekran × on üç ülke =
**yüz dört yakın kopya adres.** Arama motoru bunu ya kopya içerik sayar ya
da tarama bütçesini boşa harcar.

Çözüm iki katmanlı: `robots.txt` sorgu parametreli adresleri taramaya
kapatıyor, canonical etiketi hepsini temiz yola topluyor
(`/sorun/car?country=IT` → `/sorun/car`).

**Sonraki adım (henüz yapılmadı):** ülkeyi yola taşımak —
`/de/sorun/car`. O zaman her ülke kendi indekslenebilir adresini alır ve
"was ist bei zugausfall zu tun" gibi aramalarda görünür. Bu daha büyük bir
değişiklik; arama trafiği asıl edinim kanalı olacaksa yapılmalı.

### Duman testi bunu koruyor

`npm run smoke` artık robots, sitemap ve canonical'ın **birbirini tuttuğunu**
kontrol ediyor: sitemap'te sorgu parametresi veya `localhost` varsa, ya da
canonical robots'takinden farklı alan adı gösteriyorsa test patlar.

## Bağlandıktan sonra

1. `https://cobban.eu` açılıyor mu — HTTPS sertifikası Vercel tarafından
   otomatik geliyor, birkaç dakika sürebilir.
2. `https://cobban.eu/robots.txt` ve `/sitemap.xml` doğru alan adını
   gösteriyor mu.
3. Google Search Console'a `cobban.eu` ekle, sitemap'i bildir.
4. `cobban.vercel.app` çalışmaya devam eder; Vercel yeni alan adını birincil
   yapınca ona yönlendirir.
