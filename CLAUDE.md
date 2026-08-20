# COBBAN — proje notu

**Europe is complicated. COBBAN makes it simple.**

Avrupa'da seyahat aksaklığı yaşayan turiste tek ekranda çözüm veren asistan.
`Problem → COBBAN → DONE`

Ayırt edici nokta: cevaplar **hıza göre değil, tatil planına göre** sıralanır.
20 dakika erken varıp uçuşu kaçıran seçenek, 20 dakika geç varıp her şeyi
kurtarandan kötüdür (`web/lib/plan.ts`).

> **Yön değişikliği (Ağu 2026):** COBBAN önce çok kategorili bir e-ticaret
> markasıydı. Mağaza vitrini `177a485` commit'inde duruyor
> (`git checkout 177a485 -- web/`). `docs/` altındaki şirket kurulum, vergi ve
> yasal metin dokümanları hâlâ geçerli; mağazaya özgü olanlar (06, 07, 08, 09)
> eski konumlandırmayı anlatıyor.

## Depo yapısı

| Yol | İçerik |
|---|---|
| `brand.json` | Marka bilgilerinin tek kaynağı — ad, renk, font, domain, iletişim |
| `brand/` | Logo (SVG) ve `tokens.css` |
| `docs/` | Şirket kurulum, vergi, ölçekleme, metin rehberi (Türkçe) |
| `docs/sozlesmeler/` | Yasal metin şablonları (TR / NO / EN) |
| `payments/` | Ödeme mimarisi notları ve şema taslağı — henüz kod değil |
| `web/` | Next.js uygulaması: asıl ürün |

### `web/` içinde ne nerede

| Yol | İş |
|---|---|
| `lib/country.ts` | Ülke soyutlaması + kayıt defteri. **Tek veri kaynağı.** |
| `lib/countries/xx.ts` | Ülke verisi: şehirler, acil numaralar, yerler, `essentials` |
| `lib/plan.ts` | Tatil planına etki hesabı — ülkeden bağımsız, ürünün kalbi |
| `lib/entur.ts` | Norveç canlı sefer verisi (tek ulaşım entegrasyonu) |
| `lib/met.ts` + `lib/weather.ts` | Hava (MET Norway — **dünya çapında**, ücretsiz) |
| `lib/events.ts` | Tekrar eden etkinlik sıralaması — "bugün ne var" mantığı |
| `app/sorun/[kind]/` | Yedi sorun ekranı: cancelled · missed · road · eat · rain · meet · basics |

## Çalışma kuralları

- **Kod yorumları ve `docs/` Türkçe; arayüz metni İngilizce.** Turist Türkçe okumuyor.
- **Ülke eklemek kod yazmak değil, veri yazmaktır:** `lib/countries/xx.ts` + kayıt satırı.
  Ulaşım entegrasyonu yoksa `transport: 'none'` bırak — ülke yine faydalı açılır.
- **Doğrulayamadığın bilgiyi yazma.** `essentials` içindeki her madde turistin
  parasını etkiliyor; uydurma bir bahşiş kuralı ürünün tamamını çürütür.
- **"Yakında" yazma.** Elinde veri yoksa o an gerçekten işe yarayan şeyi ver
  (bkz. `NoTransportYet`: AB yolcu hakları + üç somut adım).
- **Boş liste = boş ekran.** Her şehirde her tür için en az bir kayıt olmalı;
  test bunu zorunlu tutuyor.
- **Etkinlikte yalnızca TEKRAR EDEN kayıt.** Tek seferlik konser bir hafta
  sonra yalan olur ve turist kapalı kapıya gider. Küratörlü etkinliği
  olmayan şehirde `universalWays` devreye girer — boş ekran yok.
- **Rıza olmadan ölçüm betiği yüklenmez.** `cobban:consent` olayını dinle.
- Yasal metinlerdeki `{{...}}` alanları doldurulmadan hiçbir metin yayına alınmaz.

## Doğrulama

```bash
cd web
npm run check          # typecheck + 35 birim testi + build
npm run start          # ayrı terminalde
npm run smoke          # 13 ülke × 7 ekran, canlı sunucuya karşı (1460 kontrol)
npm run verify:apis    # Entur ve MET sorgularını canlı doğrular (kısıtsız ağ gerekir)
```

`smoke` üretim derlemesine karşı HER sayfayı açıyor: boş ekran, kayıp ülke
seçimi, arayüze sızmış Türkçe, kırık bağlantı ve "yakında" metni testte patlar.

Değişiklikten sonra en az bunları tarayıcıda dene: anasayfa, ülke değiştirici,
`/sorun/cancelled?country=NO` (plan etkisi üç seviyede de görünmeli),
`/sorun/cancelled?country=IT` (ulaşımsız ülke ekranı), `/sorun/basics?country=GR`,
`/sorun/meet?country=DE&city=berlin` (perşembeyse "Tonight" görünmeli).

## Bilinen durum

- 13 ülke canlı; canlı sefer verisi yalnızca Norveç'te (Entur).
- `COBBAN_LIVE_DATA=true` yoksa sefer ve hava demo veriyle çalışır — ekranda yazıyor.
- Entur ve MET sorguları bu ortamdan **canlı doğrulanamadı** (çıkış trafiği kapalı).
- `cobban.eu` kayıtsız ve alınabilir; Vercel `.eu` satmıyor, ayrı kayıt gerekiyor.
- GitHub push bu ortamdan 403 veriyor; çıktılar zip/bundle olarak veriliyor.

## Bilgi tazeleme

Vergi oranı, eşik, limit gibi her rakam `docs/12-kaynak-takibi.md`'de tarihiyle
kayıtlı. Bir rakamı kullanmadan veya güncellemeden önce oraya bak; "tekrar bak"
tarihi geçmişse kaynaktan doğrula ve kaydı güncelle. Eski değeri silme.

Ölçekleme modeli: `docs/13-olcekleme.md` · Metin standardı: `docs/14-metin-rehberi.md`
Sıradaki işler: `docs/11-gelistirme-plani.md`
