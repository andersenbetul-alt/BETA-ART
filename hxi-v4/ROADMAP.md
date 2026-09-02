# HXI-4 — Phonk Studio Pro Yol Haritası

**Dizin:** `hxi-v4/`  
**Lovable ID:** `daddeade-7b69-4b6a-bda8-e3e3acab8645`  
**Durum:** 🔒 Taslak (import edildi, deploy edilmedi)

---

## Konsept

HXI'nin şimdiye kadarki en eksiksiz web sitesi. HXI-1'in siyah (`#080810`) temasına dönüldü — Flag Edition'ın (HXI-2) resmi Norveç hissiyatından vazgeçildi, daha sert underground phonk estetiğine geçildi. Ama içerik çok daha zengin: Stem Packs ürünleri, NCS ekosistemi detayları, Sync licensing tier tablosu, Store bölümü, Cookie consent, tam GDPR uyumu. Supabase kaldırıldı — siteyi tek dosyadan yönetme kararı.

**Hedef kitle genişletmesi:**
- **Prodüktörler** → Stem Packs (doğrudan satış)
- **Label/Supervisor'lar** → Sync Licensing (tier tablosu + inquiry formu)
- **NCS hayranları** → NCS Ecosystem bölümü (kanala gönderme)
- **DJ'ler / Event organizatörleri** → Booking formu (set türleri)

---

## Teknik mimari

| Karar | Neden |
|---|---|
| Supabase yok | HXI-4'te katalog küçük ve sabit; Supabase karmaşıklığa değmez |
| Span tabanlı glitch (HXI-1 gibi) | CSS pseudo yerine; 3. katman (mavi) daha belirgin |
| `@utility bg-grid` | 48px grid, kırmızı %6 opaklık; sahne dekorasyonu hissi |
| `@utility scanline-bar` | Hareketli gradyan şeridi; CRT/VHS nostaljisi |
| `@utility marquee-track` | 40s döngü; genre listesi temposunu hissettiriyor |
| Cookie banner localStorage | GDPR zorunluluğu; basit, sunucu gerektirmez |
| ScrollProgress | İnce kırmızı çizgi; sayfa okundukça ilerler |
| BackToTop | 600px sonra görünür; uzun sayfa için kullanılabilirlik |

---

## Bölümler (14 bölüm — en eksiksiz versiyon)

| # | Bölüm | HXI-1'den fark |
|---|---|---|
| 1–3 | Preloader, Nav, Hero | Stem pack teaser kutusu eklendi |
| 4 | Ticker | Aynı |
| 5 | Music | Static; HELP URSELF Spotify embed |
| 6 | Stats | 4 sayaç (43M, 500+, 12, 50M NCS subs) |
| 7 | **Stems** | **3 ürün** (HXI-1: 2); $0 / $14.99 / $29 |
| 8 | **NCS** | **Reach stats paneli** eklendi (HXI-1: sadece bilgi) |
| 9 | **Sync** | **Toggle inquiry formu** eklendi (HXI-1: form vardı ama toggle yok) |
| 10 | About | "THE FREQUENCY" dekoratif yazı |
| 11 | Store | 4 ürün |
| 12 | Email | Bülten |
| 13 | Booking | **Set türleri listesi** eklendi |
| 14 | Footer | **4 sütun** (HXI-1: 3 sütun) |

---

## Değişiklik günlüğü

| Tarih | Değişiklik | Yapan |
|---|---|---|
| Ağu 2026 | Lovable'da oluşturuldu ("HXI Phonk Studio") | Lovable AI |
| 30.08.2026 | BETA-ART monoreposuna import edildi (`hxi-v4/`) | Claude |

---

## Sırada ne var

| Öncelik | İş |
|---|---|
| Yüksek | **Stem pack ödeme akışı** — Gumroad veya Stripe; şu an fiyat gösteriyor ama satın alma yok |
| Yüksek | **Sync + Booking formları** — mailto yerine gerçek form servisi (Formspree/Resend) |
| Yüksek | **Deploy** — Vercel veya hxi-nordic-pulse.lovable.app'in yerini alacak |
| Orta | **Müzik kataloğunu Supabase'e taşı** — Yeni track eklenince admin olmadan güncellensin |
| Orta | **og:image** — Sosyal paylaşım görseli |
| Düşük | **Norveçce dil desteği** |
| Düşük | **HXI-2'den MusicSection bileşen mimarisini port et** — katalog büyürse |
