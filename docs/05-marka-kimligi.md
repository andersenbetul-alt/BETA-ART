# 05 — COBBAN Marka Kimliği

## 1. Marka konumlandırma

**COBBAN**, İskandinav sadeliği ile özenle seçilmiş ürünleri buluşturan çok kategorili bir online mağazadır.

| | |
|---|---|
| **Kategori** | Çok kategorili seçki mağazası (curated multi-category store) |
| **Vaat** | "Az ama doğru ürün" — her kategoride 10 yerine 3 iyi seçenek |
| **Ton** | Sakin, net, abartısız. Ünlem işareti yok, büyük harf bağırma yok |
| **Karşıtlık** | Pazaryerlerinin sonsuz listesi ve karar yorgunluğu |
| **Kime** | 28–45 yaş, tasarım duyarlılığı olan, kaliteyi fiyatın önüne koyan alıcı |

### Slogan
- 🇳🇴 *Nordisk enkelhet, håndplukket kvalitet.*
- 🇬🇧 *Nordic simplicity, handpicked quality.*
- 🇹🇷 *İskandinav sadeliği, özenle seçilmiş kalite.*

## 2. Logo

`brand/logo/` klasöründe:

| Dosya | Kullanım |
|---|---|
| `cobban-wordmark.svg` | Ana logo — site header, fatura, e-posta |
| `cobban-mark.svg` | Sembol — favicon, sosyal medya profil, ürün etiketi |
| `cobban-lockup-vertical.svg` | Dikey kilit — ambalaj, kartvizit |

**Kurallar**
- Minimum genişlik: wordmark 96 px, mark 24 px.
- Boşluk payı: "C" harfinin yüksekliği kadar her yönde boşluk bırak.
- Logo döndürülmez, gölge/kontur eklenmez, oranı bozulmaz.
- Sadece tek renk kullanılır: `ink` (koyu zeminde `fog`).

## 3. Renk paleti

| İsim | HEX | Kullanım | Fog üstü | Beyaz üstü |
|---|---|---|---|---|
| **Ink** | `#141A1F` | Ana metin, logo | 15.6:1 ✅ | 17.5:1 ✅ |
| **Fog** | `#F4F1EC` | Sayfa arka planı | — | — |
| **Clay** | `#C4714B` | **Yalnızca dekoratif** — çizgi, ayraç, vurgu bloğu | 3.2:1 | 3.6:1 |
| **Clay Strong** | `#A85835` | **Üzerine yazı gelen her yer** — CTA butonu, odak halkası | — | beyaz metinle **5.1:1** ✅ |
| **Moss** | `#3F5B4C` | İkincil vurgu, "stokta var" | 6.6:1 ✅ | 7.5:1 ✅ |
| **Sand** | `#D8CBB8` | Kart arka planı, ayraç | — | — |
| **Steel** | `#5C6B75` | İkincil metin, meta bilgi | 4.9:1 ✅ | 5.5:1 ✅ |

> ⚠️ **Düzeltme (Ağu 2026):** Bu tablonun ilk hâlindeki değerler yanlıştı.
> axe-core denetimi iki WCAG AA ihlali buldu ve ölçüm yapıldı:
> - `steel` eski değeri `#6B7A84` fog üzerinde **3.93:1** idi (4.5 gerekli) → `#5C6B75` oldu.
> - `clay` üzerine beyaz metin **3.61:1** idi (16 px kalın metin için 4.5 gerekli)
>   → butonlar `clay-strong` (#A85835) kullanıyor, `clay` dekoratif role çekildi.
>
> Palet değiştiğinde kontrastı yeniden ölç; "göze normal geliyor" yeterli değil.

## 4. Tipografi

| Rol | Font | Alternatif |
|---|---|---|
| Başlık | **Fraunces** (variable serif) | Playfair Display, Georgia |
| Gövde | **Inter** | system-ui, Helvetica |
| Rakam/fiyat | Inter (tabular-nums) | — |

**Ölçek**
```
Display  clamp(2.5rem, 5vw, 4rem)   Fraunces 500, tracking -0.02em
H1       2rem                        Fraunces 500
H2       1.5rem                      Fraunces 500
H3       1.125rem                    Inter 600
Body     1rem / 1.6                  Inter 400
Small    0.875rem                    Inter 400, steel
```

## 5. Ses tonu — üç dilde

| Durum | 🇹🇷 | 🇳🇴 | 🇬🇧 |
|---|---|---|---|
| Sepete ekle | Sepete ekle | Legg i handlekurv | Add to cart |
| Stokta | Stokta | På lager | In stock |
| Ücretsiz kargo | 799 NOK üzeri ücretsiz kargo | Fri frakt over 799 kr | Free shipping over 799 NOK |
| İade | 30 gün içinde koşulsuz iade | 30 dagers åpent kjøp | 30-day free returns |

**Yazım kuralları**
- Fiyatlar her zaman vergi dahil gösterilir (Norveç'te yasal zorunluluk).
- "İndirim" yerine "yeni fiyat" — sahte aciliyet yaratma.
- Ürün açıklaması: 1 cümle vaat + 3 madde özellik + malzeme/ölçü tablosu.
- Emoji kullanılmaz (sosyal medya hariç, orada da en fazla 1 tane).

## 6. Ambalaj ve unboxing

- Kraft kutu + `sand` renkli ipek kâğıt, `ink` baskı tek renk sticker.
- İçine: teşekkür kartı (el yazısı fontu değil, temiz Inter), iade talimatı, 
  QR → ürün bakım rehberi.
- **Plastik kullanma** — Norveç pazarında sürdürülebilirlik satın alma kararını doğrudan etkiler.

## 7. Marka tescili — mutlaka yap

| Ülke | Kurum | Süre | Maliyet (1 sınıf) |
|---|---|---|---|
| Norveç | **Patentstyret** | 3–6 ay | ~3.400 NOK |
| Türkiye | **TÜRKPATENT** | 6–12 ay | ~8.000 TL |
| AB | **EUIPO** | 4–6 ay | ~850 EUR |
| Uluslararası | WIPO Madrid Protokolü | 12–18 ay | değişken |

**Sınıf önerisi (Nice sınıflandırması)** — çok kategorili mağaza için:
- **Sınıf 35** — perakende/online satış hizmetleri ⬅️ *en kritik olan bu*
- Sattığın ana ürün sınıfları (ör. 25 giyim, 3 kozmetik, 21 ev eşyası, 14 takı)

> **Önce benzerlik araştırması yap:** Patentstyret ve TÜRKPATENT'in ücretsiz arama
> ekranlarında "COBBAN" ve benzer yazılışları (COBAN, ÇOBAN, KOBBAN) ara.
> Türkiye'de "Çoban" yaygın bir marka/soyadı — 35. sınıfta çakışma riski var, kontrol et.

## 8. Domain ve sosyal medya

- [ ] `cobban.com` — ana domain
- [ ] `cobban.no` — Norveç (org.nr gerekir, ENK kurulduktan sonra)
- [ ] `cobban.com.tr` — Türkiye (marka tescili veya ticaret sicil gerekir)
- [ ] Instagram, TikTok, Pinterest: `@cobban`
- [ ] E-posta: `hei@cobban.com` (NO), `merhaba@cobban.com` (TR), `support@cobban.com`
