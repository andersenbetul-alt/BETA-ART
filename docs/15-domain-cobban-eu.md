# 15 — cobban.eu'yu bağlamak

Bu doküman **senin yapman gereken** adımları anlatıyor. İkisi de benim
yapamayacağım işler: biri para harcıyor, diğeri Vercel panelinden manuel
onay istiyor.

## Durum

| Alan adı | Durum | Not |
|---|---|---|
| **cobban.eu** | **boşta** (20 Ağu 2026'da bakıldı) | Alınabilir. Vercel `.eu` **satmıyor** — ayrı bir kayıt şirketi gerekiyor |
| cobban.com | **alınmış** | Başkasında |
| cobban.no | boşta | Norveç için ikinci seçenek |
| cobban.app | boşta | |

`.eu` almak için AB/AEA'da ikamet veya kuruluş şartı var. **Norveç AEA
üyesi olduğu için Norveç adresiyle alınabilir.**

Site şu anda burada yayında ve herkese açık (koruma kapalı):
**https://cobban.vercel.app**

## 1. Alan adını al

`.eu` satan kayıt şirketlerinden birinden (Gandi, OVH, Namecheap, Domeneshop).
Fiyat yıllık ~10 €. Kayıt sırasında **AB/AEA adresi** istenecek.

> Bunu ben satın alamam: para harcayan, iadesi olmayan bir işlem. Karar senin.

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
