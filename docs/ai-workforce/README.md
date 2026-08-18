# AI Workforce — ürün tanımı

> **Karar gerektiren nokta:** Bu, QBLOGG'un içerik stüdyosundan **farklı bir iştir**.
> İçerik stüdyosu metin satar; AI Workforce süreç otomasyonu satar. Müşteri profili,
> satış döngüsü, teslim riski ve fiyatlama mantığı farklı. Üç seçenek var:
>
> 1. **Tam geçiş** — QBLOGG'u AI Workforce markasına çevir. İçerik hattı, AI Workforce'un
>    bir alt hizmeti (Content Agent) olur.
> 2. **İki markalı** — QBLOGG içerik tarafında kalır, AI Workforce ayrı bir marka/site olur.
> 3. **Tek çatı, iki teklif** — QBLOGG "içerik + otomasyon stüdyosu" olur; sitede iki
>    hizmet ailesi yan yana durur.
>
> **Önerim: 3.** İlk müşteriler zaten aynı yerden gelecek (KOBİ, SaaS, danışmanlık) ve
> içerik işleri otomasyon satışının kapısını açıyor. İkinci bir marka kurmak, sıfırdan
> güven inşa etmek demek — bunu kanıtlanmış bir teklif olmadan yapmayın.

## Ne satıyoruz

Cümle olarak: **"Şirketinizde tekrar eden işleri ölçüyoruz, en pahalı üçünü AI
çalışanlarıyla otomatikleştiriyoruz, sonucu saatle raporluyoruz."**

Satılan şey "yapay zekâ" değil, **geri kazanılan saat**. Müşteri bir ajanın ne kadar
akıllı olduğuyla ilgilenmiyor; ayda kaç saat kazandığıyla ilgileniyor. Bu yüzden her
teklif bir sayıyla açılır: "Bu iş şu an ayda X saat alıyor, otomasyon sonrası Y saat."

## Neden yedi ajanı birden satmıyoruz

Yedi ajanı aynı anda kurmak, bu işlerin en yaygın batma sebebidir:

- Her ajan ayrı bir sisteme bağlanır (e-posta, CRM, takvim, muhasebe). Yedi entegrasyon
  yedi ayrı izin, yedi ayrı arıza noktası demektir.
- Müşteri yedi yeni akışı aynı anda öğrenemez; kullanılmayan ajan iptal sebebidir.
- Bir ajan yanlış e-posta gönderirse tüm proje güvenini kaybeder.

**Kural: önce keşif, sonra bir ajan, kanıtlanınca ikinci.** Katalogdaki yedi ajan bir
menüdür, bir paket değil.

## Ürün merdiveni

| Adım | Ne | Süre | Fiyat (örnek) | Amaç |
|---|---|---|---|---|
| 0 | **Otomasyon Keşfi** | 1 hafta | €900 | Tekrar eden işleri ölç, ilk üç adayı ROI ile sırala |
| 1 | **Pilot ajan** | 2 hafta | €2.500 | Tek ajan, dar kapsam, ölçülebilir sonuç |
| 2 | **İkinci + üçüncü ajan** | 3–4 hafta | €2.000/ajan | Kanıtlanmış akıştan sonra genişleme |
| 3 | **Bakım ve iyileştirme** | sürekli | €600–1.800/ay | İzleme, hata düzeltme, model ve prompt bakımı |

Keşif ücretlidir ve bilinçli olarak ucuzdur: hem elemeyi yapar hem de teklifi
"tahmin" olmaktan çıkarır. Keşif sonunda müşteri devam etmezse, elinde yine de
kullanabileceği bir süreç haritası kalır.

Piyasa çerçevesi (Ağustos 2026 kaynakları): tek amaçlı özel ajan 1.500–5.000 $ kurulum
+ 300–800 $/ay işletme; 3+ ajanlı akış 5.000–25.000 $ kurulum + 1.000–3.000 $/ay.
KOBİ'ye yönelik yönetilen hizmetlerde kurulum 3.000–12.000 $ bandında. Bizim
merdivenimiz bu bandın alt-orta kısmına oturuyor — kasıtlı olarak, ilk referansları
almak için.

## Kimin için

**Uygun müşteri:** 5–50 çalışanlı, tekrar eden işi olan, dijital araçları zaten kullanan
(Google Workspace/Microsoft 365, bir CRM, bir muhasebe yazılımı) şirketler. Danışmanlık,
ajans, e-ticaret, SaaS, işe alım, muhasebe büroları.

**Uygun olmayan:** Süreçleri yazılı olmayan, verisi kâğıtta olan, kararı tek kişide olup
o kişinin vakti olmayan şirketler. Ayrıca sağlık ve hukuk gibi hatanın maliyetinin
yüksek olduğu alanlarda, uzman onayı olmadan otomasyon satmayın.

## Söylemeyeceğimiz şeyler

- "AI çalışanı işten çıkarmanızı sağlar." Satmıyoruz, doğru da değil. Sattığımız şey
  aynı ekibin daha az tekrar eden iş yapması.
- "Kurduk, unutun." Her ajan bakım ister; bunu peşinen fiyatlıyoruz.
- "%100 doğru çalışır." Ajanlar hata yapar. Bu yüzden her ajanın bir insan onay noktası
  ve bir geri alma yolu vardır (bkz. teknik mimari).

## Dosyalar

- `agent-katalogu.md` — yedi ajanın tek tek kapsamı, riski, teslim süresi
- `kesif-formu.md` — keşif haftasının soru seti ve ROI hesabı
- `teknik-mimari.md` — nasıl kuruyoruz: model seçimi, entegrasyon, güvenlik, maliyet
- `fiyatlandirma.md` — paketler ve birim ekonomi

---

## İçerik türetme hattı (kurulu)

Content Agent'ın çalışan ilk parçası depoda: `scripts/repurpose.mjs`.

Bir blog yazısından yedi çıktı üretir — LinkedIn serisi (5 post), sosyal içerikler
(10 adet), newsletter, kısa video senaryoları (3), YouTube taslağı, podcast bölüm
fikirleri (3) ve devam yazısı önerileri (3).

```bash
npm i                                 # SDK ve zod (yalnızca bu betik için)
export ANTHROPIC_API_KEY=...          # ya da: ant auth login
npm run repurpose -- <slug> [dil]
```

Çıktı `content/<slug>/<dil>/` altına markdown olarak yazılır; ayrıca `paket.json`
ham veriyi tutar. Model `claude-opus-5`, yapılandırılmış çıktı şemasıyla — yani
biçim her seferinde aynı, elle düzeltme gerekmiyor.

**Örnek çıktı depoda:** `content/yazarak-para-kazanma-platformlari/tr/` — amiral gemisi
yazının tam türev paketi (2.300 kelime). Müşteriye "bir araştırmadan beş çıktı"
derken gösterilecek somut örnek budur.

## Yayınla birlikte paylaşım

Yazı sayfasının altında artık paylaşım satırı var: LinkedIn, X, Facebook, WhatsApp,
e-posta ve bağlantı kopyalama. Her bağlantı yazının başlığı ve **okunan dildeki**
adresiyle önceden doldurulur — yazı yayına girdiği anda paylaşım hazır.

Altbilgideki sosyal hesap bağlantıları `assets/js/app.js` içindeki `SOCIAL` nesnesinden
gelir. Adresi girilmemiş hesap gösterilmez; böylece hiçbir zaman ölü bağlantı olmaz.
Hesap açtıkça oraya yazın:

```js
var SOCIAL = {
  linkedin: 'https://www.linkedin.com/company/...',
  x: '', medium: '', substack: '', youtube: ''
};
```
