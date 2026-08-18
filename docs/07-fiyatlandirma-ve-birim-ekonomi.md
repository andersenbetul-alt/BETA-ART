# 07 — Fiyatlandırma ve Birim Ekonomi

## 1. Fiyat nasıl kurulur

Maliyete çarpan atma. Sırayla hesapla:

```
1  Ürün maliyeti (FOB)                    100 TL
2  + Yurt içi kargo/depo                    8 TL
3  + İhracat/gümrükleme payı               12 TL
4  = Depoya giriş maliyeti (landed cost)  120 TL  → ~35 NOK
5  + Ambalaj                                4 NOK
6  = Toplam ürün maliyeti (COGS)          39 NOK
7  × Hedef brüt marj (%65)  → 39 / 0,35 = 111 NOK
8  + Kargo sübvansiyonu (ort. 40 NOK)     151 NOK
9  + Reklam (CAC hedefi 90 NOK)           241 NOK
10 + İade payı (%8)                       262 NOK
11 = Taban fiyat (MVA hariç)              262 NOK
12 × 1,25 (MVA)                           328 NOK
13 → Psikolojik yuvarlama                 349 NOK
```

**Kural:** MVA/KDV **her zaman** son adımda eklenir ve etikette dahil gösterilir.

## 2. Hedef oranlar (sağlıklı e-ticaret)

| Metrik | Zayıf | İyi | Hedef |
|---|---|---|---|
| Brüt marj | <%40 | %50–60 | **%60–70** |
| CAC / AOV | >%35 | %20–30 | **<%20** |
| Dönüşüm oranı | <%1 | %1,5–2,5 | **>%2,5** |
| Sepet ortalaması (AOV) | — | — | **>600 NOK** |
| İade oranı (tekstil) | >%25 | %15–20 | **<%12** |
| İade oranı (tekstil dışı) | >%8 | %4–6 | **<%4** |
| Tekrar satın alma (12 ay) | <%15 | %25 | **>%30** |
| Net kâr | <%0 | %5–10 | **%12–18** |

## 3. Kargo politikası

| Karar | Öneri | Gerekçe |
|---|---|---|
| Ücretsiz kargo eşiği | **799 NOK / 1.500 TL** | AOV'yi eşiğe çeker |
| Eşik altı ücret | 79 NOK / 89 TL | Gerçek maliyetin altında, sübvanse |
| İade kargosu | İlk iade ücretsiz, sonrası müşteride | Norveç'te "åpent kjøp" beklentisi yüksek |
| Teslimat süresi vaadi | NO içi 1–3 gün, AB 3–6, TR 2–4 | Vaadi tut, geç kalırsan bildirim gönder |

> Ücretsiz kargo eşiğini AOV'nin **%25–35 üzerine** koy. AOV 600 ise eşik ~799.

## 4. İndirim politikası

- **Sürekli indirim yapma** — marka değerini yer, müşteri hiç tam fiyat ödemez.
- Yılda en fazla 3 kampanya: Black Friday, sezon sonu, marka yıldönümü.
- Norveç'te **Markedsføringsloven**: "önce/sonra" fiyat göstereceksen,
  eski fiyatın **son 30 gün içinde gerçekten uygulanmış** olması gerekir. AB'de de aynı (Omnibus).
  ⚠️ Sahte indirim ciddi para cezası doğurur.
- İlk alışverişe %10 yerine **ücretsiz kargo** ver — marjı daha az yer, dönüşümü daha çok artırır.

## 5. Birim ekonomi tablosu (kopyala-kullan)

`docs/birim-ekonomi.csv` dosyasına bak — Excel/Sheets'e doğrudan aç.

## 6. Nakit akışı — asıl öldüren şey

Kâr etmek yetmez, **nakit** gerekir:

```
Stok siparişi (peşin ödeme)        gün 0     -100.000 TL
Üretim + sevkiyat                  gün 45
Depoya giriş                       gün 60
Satışın tamamlanması               gün 60-150
Shopify payout (2-3 gün gecikme)   gün 63-153
Pazaryeri ödemesi (14-30 gün)      gün 90-180
KDV iadesi                         gün 120+
```

→ Paran **4–6 ay** bağlı kalır. İlk stok siparişini **satabileceğinin yarısı kadar** ver.
→ Yeniden sipariş için "satış hızı × tedarik süresi × 1,5" formülünü kullan.

## 7. Fiyat listesi şablonu (pazar bazlı)

| Ürün | COGS (NOK) | 🇳🇴 NOK | 🇪🇺 EUR | 🇹🇷 TRY | Marj NO |
|---|---|---|---|---|---|
| Örnek A | 39 | 349 | 34 | 1.190 | %68 |
| Örnek B | 85 | 699 | 69 | 2.390 | %63 |
| Örnek C | 160 | 1.299 | 129 | 4.490 | %61 |

> Her pazar için **ayrı yuvarlanmış** fiyat. Otomatik kur çevirimi kullanma —
> 347,83 NOK gibi fiyatlar ucuz görünür ve güven kırar.
