# HXI-1 — Nordic Pulse Yol Haritası

**Dizin:** `hxi/`  
**Lovable ID:** `2bae4f70-cf5f-4b05-bd04-8cf9d26ad9bb`  
**Durum:** ✅ Yayında → hxi-nordic-pulse.lovable.app

---

## Konsept ve tasarım düşüncesi

Christoffer Andersen (HXI), Norveçli phonk prodüktörü. 43M+ Spotify akışı.
Hedef: Kendini tanıtmak, NCS ekosistemine dahil olduğunu göstermek,
stem pack satmak, sync lisans fırsatları almak, booking almak.

**Tasarım yönü:**
- Yeraltı phonk estetiği — Norveç kimlliğiyle buluşan sertlik
- `#080810` neredeyse siyah: sahne ışığı kapalıyken backstage hissi
- `#EF2B2D` Norveç kırmızısı: tek aksant, CTA, glitch katmanı
- `#002868` Norveç mavisi: ikincil rozet, bayrak referansı
- Glitch efekti: Norveç'in uluslararası phonk sahnesine "girişini" anlatır
- Yazı tipleri: Barlow Condensed (başlıklar, sert) + Space Mono (stat sayılar, teknik) + Inter (gövde)

**Kullanıcı akışı:**
1. Preloader → glitch logosu → sayfa açılır (tüm dikkat logoya)
2. Hero → kim olduğunu anlıyor + CTA (stem pack veya booking)
3. Ticker → hız ve genre etiketleri (phonk, afrobeat, bass)
4. Music → dinler, tanır
5. Stats → rakamlar güven verir (43M, 500+ track, 12 label)
6. Stems + NCS → ürün satın alabilir veya lisans için düşünür
7. Sync → label ve supervisor'lar için kimlik bilgileri
8. About → hikaye
9. Store → doğrudan satış
10. Booking → form doldurur

---

## Teknik mimari

| Karar | Neden |
|---|---|
| TanStack Start (SSR) | Lovable'ın varsayılan şablonu; SEO için SSR şart |
| React 19 + TypeScript | Lovable ekosistemi |
| Tailwind CSS v4 `@theme inline` | CSS değişkenleri doğrudan token olarak; koyu tema otomatik |
| `@utility` ile glitch katmanları | Framework bağımsız, class olarak kullanılır |
| Span tabanlı glitch | `glitch-layer-red` + `glitch-layer-blue` span'ları, `mix-blend-mode: screen` |
| Tüm içerik hardcoded | Supabase yok; küçük site, güncelleme seyrek |
| IntersectionObserver sayaçlar | JS kütüphanesi olmadan animasyon |
| Preloader | 1200ms — marka anını yaşatır, sayfayı "önemsiz" göstermez |

---

## Bölümler (14 bölüm)

| # | Bölüm | İçerik | Notlar |
|---|---|---|---|
| 1 | Preloader | Glitch HXI animasyonu, 1200ms | — |
| 2 | Nav | Sticky, mobil fullscreen overlay | — |
| 3 | Hero | 22vw glitch logo, stats satırı, stem promo | — |
| 4 | Ticker | Kırmızı marquee, genre etiketleri | — |
| 5 | Music | 3 kart + Spotify embed | HELP URSELF, X-PIRATA, MONTAGEM HYSTERIA |
| 6 | Stats | 6 animasyonlu sayaç | 43M akış, 500+ track, 12 label, vb. |
| 7 | Stems | Ürün kartları | FREE stem pack, preset pack |
| 8 | NCS | 50M abone bilgisi | Kanal ortaklığı göstergesi |
| 9 | Sync | Kimlik kartları + tier tablosu + inquiry formu | Sync & Licensing |
| 10 | About | Bio + bağımsızlık kutusu | |
| 11 | Store | 4 ürün kartı | |
| 12 | Email | Bülten kayıt formu | |
| 13 | Booking | Set türleri + inquiry formu | |
| 14 | Footer | 3 sütun: Music / Social / Contact | |

---

## Değişiklik günlüğü

| Tarih | Değişiklik | Yapan |
|---|---|---|
| Ağu 2026 | İlk Lovable sürümü oluşturuldu | Lovable AI |
| 24.08.2026 | BETA-ART monoreposuna import edildi (`hxi/`) | Claude |

---

## Sırada ne var

| Öncelik | İş | Not |
|---|---|---|
| Yüksek | **Gerçek müzik kataloğunu Supabase'e taşı** | Şu an hardcoded; yeni çıkan her track için kod değişikliği gerekiyor |
| Yüksek | **Stem pack satışı çalışır hale getir** | Şu an fiyat gösteriyor ama ödeme yok; Stripe veya Gumroad |
| Yüksek | **Booking formu gerçek e-postaya bağlansın** | mailto taslağı açıyor; Formspree veya Resend |
| Orta | **JSON-LD MusicGroup schema ekle** | HXI-2'de var, burada yok; SEO için önemli |
| Orta | **og:image ve twitter card** | Sosyal paylaşımda görsel yok |
| Orta | **Alan adı bağla** | hxi.no veya christofferhxi.com |
| Düşük | **Yeni track eklenince kolayca güncellensin** | Admin panel (minimal CMS) veya Supabase entegrasyonu |
| Düşük | **İngilizce dışında dil desteği** | Norveçce öncelikli |

---

## Notlar

- Lovable'dan push geldikçe `hxi/` dizini güncellenir
- Büyük değişiklik yapılacaksa önce bu dosyayı güncelle, sonra kodu yaz
- HXI-4 (Phonk Studio Pro) bu versiyonun geliştirilmiş hali — oraya bakın
