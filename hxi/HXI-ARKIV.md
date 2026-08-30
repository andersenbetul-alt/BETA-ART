# HXI — Proje Arşivi

Tüm HXI Lovable sürümlerinin sistematik kaydı.  
**Rutin:** Lovable'dan yeni bir proje geldiğinde bu dosyayı güncelle, dizine ekle, push et.

---

## Proje Tablosu

| Kod | Dizin | Lovable ID | İsim | Tema | Supabase | Durum | Yayın |
|---|---|---|---|---|---|---|---|
| **HXI-1** | `hxi/` | `2bae4f70` | **Nordic Pulse** | Siyah `#080810` | Hayır | ✅ Yayında | [hxi-nordic-pulse.lovable.app](https://hxi-nordic-pulse.lovable.app) |
| **HXI-2** | `hxi-v2/` | `50f62e94` | **Flag Edition** | Lacivert `#00142e` | Evet | 🔒 Taslak | [id-preview--50f62e94...lovable.app](https://id-preview--50f62e94-6826-409e-9bcf-df1d71d8d029.lovable.app) |
| **HXI-3** | *(hxi-v2 ile aynı kod)* | `761f6cd8` | **Phonk Studio (Orijinal)** | Lacivert `#00142e` | Evet | 🔒 Taslak | [id-preview--761f6cd8...lovable.app](https://id-preview--761f6cd8-77f3-4ed5-a60d-188f01add89d.lovable.app) |
| **HXI-4** | `hxi-v4/` | `daddeade` | **Phonk Studio Pro** | Siyah `#080810` | Hayır | 🔒 Taslak | [id-preview--daddeade...lovable.app](https://id-preview--daddeade-7b69-4b6a-bda8-e3e3acab8645.lovable.app) |
| **HXI-5** | `hxi-v5/` | *(Next.js — Lovable yok)* | **Acid Signal** | Siyah `#080808` + Acid `#c8ff00` | Hayır | 🔒 Geliştirme | — |

> **HXI-3 notu:** HXI-2, HXI-3'ün Lovable'daki "remix"idir (fork). HXI-3 Temmuz 2026'da 10 iterasyonla oluşturuldu; HXI-2 ise Ağustos 2026'da bu orijinalin üstüne 46 iterasyon daha eklendi. Kod tabanı birebir aynı — bu yüzden monorepo'da ayrı dizin açılmadı.

> **HXI-4 notu:** En zengin özellik seti. HXI-1 ile aynı siyah tema (`#080810`) ama çok daha fazla bölüm: Stems, NCS, Sync, Store, Booking, Cookie, Preloader, ScrollProgress. Supabase yok — tüm içerik hardcoded.

---

## HXI-1 — Nordic Pulse (`hxi/`)

**Lovable:** `2bae4f70-cf5f-4b05-bd04-8cf9d26ad9bb`  
**Snapshot:** `c7faa2a04c08c0778faa3f178d43fe6aba654cc7` (Ağustos 24, 2026)  
**Durum:** Yayında → hxi-nordic-pulse.lovable.app

### Renk Sistemi
```
--color-bg:      #080810   /* neredeyse siyah, hafif mavi ton */
--color-surface: #0e0e18
--color-border:  #1e1e2e
--color-red:     #EF2B2D   /* Norveç kırmızısı — aksant, CTA, glitch */
--color-blue:    #002868   /* Norveç mavisi — ikincil rozet */
--color-ink:     #F0EDE8   /* ana metin */
--color-muted:   #666660
```

### Bölümler (13 bölüm, tüm içerik hardcoded)
1. Preloader — glitch HXI animasyonu
2. Nav — sticky, mobil fullscreen overlay
3. Hero — 22vw glitch logo, stats satırı, stem promo kutusu
4. Ticker — kırmızı marquee şeridi
5. Music — 3 kart (Help Urself, X-Pirata, Montagem Hysteria), Spotify embed
6. Stats — 6 animasyonlu sayaç
7. Stems — ürün kartları (stem pack, preset pack)
8. NCS Ecosystem — 50M abone bölümü
9. Sync & Licensing — kimlik bilgileri + tier tablosu + inquiry formu
10. About — bio + bağımsızlık kutusu
11. Store — 4 ürün kartı
12. Email — "Drop First. World Later." bülten
13. Booking — DJ set formu
14. Footer — 3 sütun (Music / Social / Contact)

### Teknik Özellikler
- ❌ Supabase yok — tüm içerik `index.tsx` içine hardcode
- ✅ JSON-LD yok (`__root.tsx`'de meta tags var)
- ✅ Scroll progress bar (kırmızı, üst)
- ✅ Scroll reveal (IntersectionObserver)
- ✅ Cookie banner (GDPR, localStorage)
- ✅ Back-to-top butonu
- ✅ Glitch: CSS keyframe katmanları (`glitch-layer-red`, `glitch-layer-blue`) — `styles.css`

### Farklar (HXI-2'ye göre)
| Özellik | HXI-1 | HXI-2 |
|---|---|---|
| Tema | Siyah `#080810` | Lacivert `#00142e` |
| Müzik verisi | Hardcoded | Supabase `tracks` tablosu |
| Bölüm sayısı | 13 (NCS + Stems bölümleri var) | 7 (daha sade) |
| JSON-LD | Yok | `MusicGroup` schema var |
| Glitch tekniği | CSS keyframe katmanları | CSS `::before/::after` pseudo |
| Yayın | ✅ Canlı | ❌ Taslak |

---

## HXI-2 — Flag Edition (`hxi-v2/`)

**Lovable:** `50f62e94-6826-409e-9bcf-df1d71d8d029`  
**Snapshot:** `17459addd82d29003f74db3da821a8a104a462a2` (Ağustos 24, 2026)  
**Kaynak:** HXI-3'ün 46 iterasyonlu remix'i  
**Durum:** Taslak (yayınlanmamış)

### Renk Sistemi
```
--bg:      #00142e   /* Norveç bayrağı lacivert tonu */
--surface: #002868   /* Norveç bayrağı tam mavisi */
--border:  #0a3a8a
--primary: #EF2B2D   /* Norveç kırmızısı */
--text:    #FFFFFF   /* tam beyaz */
--muted:   #a8bcd8
```

### Bölümler (7 bölüm)
1. Nav + Preloader
2. Hero — glitch HXI, 2 CTA
3. Ticker — kırmızı marquee
4. Music — **Supabase `tracks` tablosundan** dinamik (MusicSection bileşeni)
5. Stats — 5 animasyonlu sayaç
6. Sync — 4 kimlik kartı + tier tablosu (3 tier) + inquiry formu
7. About — bio + bağımsızlık paneli
8. Store — 4 ürün kartı
9. Email signup
10. Booking — inquiry formu
11. Footer

### Teknik Özellikler
- ✅ Supabase `tracks` tablosu — `published`, `sort_order`, `spotify_embed_url`, `cover_url`, `apple_url`, `youtube_url`, `soundcloud_url`
- ✅ `is_admin` Supabase fonksiyonu (admin CMS erişim kontrolü)
- ✅ JSON-LD `MusicGroup` schema (`__root.tsx`)
- ✅ Glitch: CSS `::before/::after` pseudo-elementler
- ✅ Scroll progress bar, reveal, cookie banner
- ✅ `previewAuthStorage.ts` — Lovable preview'da auth broker

### Supabase Şeması
```
tracks: id, title, kicker, streams_label, description, spotify_embed_url,
        cover_url, release_date, apple_url, youtube_url, soundcloud_url,
        sort_order, published, created_at, updated_at

admin_users: user_id, email, created_at

is_admin(uid) → boolean
```

### `.env` Yapısı (`.env.example`)
```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

---

## HXI-4 — Phonk Studio Pro (`hxi-v4/`)

**Lovable:** `daddeade-7b69-4b6a-bda8-e3e3acab8645`  
**Durum:** Taslak (import edildi, deploy edilmedi)

### Renk Sistemi
```
--bg:      #080810   /* HXI-1 ile aynı neredeyse siyah */
--surface: #0e0e18
--red:     #EF2B2D   /* Norveç kırmızısı */
--ink:     #F0EDE8   /* ılık kırık beyaz metin */
--muted:   #666660
```

### Bölümler (14 bölüm — en tam versiyon)
1. Preloader — 1200ms, glitch HXI animasyonu
2. Nav — sticky, mobil fullscreen overlay + hamburger
3. Hero — 22vw glitch logo, stem pack teaser kutusu, hızlı istatistik grid
4. Ticker — kırmızı marquee (`marquee-track` utility)
5. Music — static: HELP URSELF (Spotify embed), X-PIRATA, MONTAGEM HYSTERIA
6. Stats — animasyonlu sayaçlar (IntersectionObserver): 43M streams, 500+ tracks, 12 labels, 50M NCS subs
7. Stems — 3 ürün: FREE stem pack, $14.99 preset pack, $29 X-Pirata stems
8. NCS Ecosystem — 50M abone bilgisi + reach stats paneli
9. Sync & Licensing — pazar verisi, 4 kimlik kartı, tier tablosu, toggle inquiry formu
10. About — "THE FREQUENCY" dekoratif yazı + bio
11. Store — 4 ürün kartı
12. Email — bülten kayıt formu
13. Booking — set türleri + inquiry formu
14. Footer — 4 sütun

### Teknik Özellikler
- ❌ Supabase yok — tüm içerik hardcoded `index.tsx` içinde
- ✅ JSON-LD `MusicGroup` schema (`__root.tsx`)
- ✅ Glitch: span katmanları (`glitch-layer-red`, `glitch-layer-blue`, `mix-blend-mode: screen`)
- ✅ Scanline overlay (`scanline-bar` utility, hareketli gradient)
- ✅ Grid background (`bg-grid` utility, kırmızı %6 ızgara, 48px)
- ✅ Scroll progress bar (kırmızı, sayfanın üstü)
- ✅ Back-to-top butonu (600px sonra görünür)
- ✅ Cookie banner (GDPR, localStorage'da `hxi-cookie`)
- ✅ Fontlar: Barlow Condensed 700/900, Space Mono 400/700, Inter 300/400

### HXI-1'e Göre Farklar
| Özellik | HXI-1 | HXI-4 |
|---|---|---|
| Sync & Licensing | Var | Var + toggle inquiry formu |
| NCS bölümü | Var | Var + reach stats |
| Stems | 2 ürün | 3 ürün |
| Booking | Var | Var + set türleri |
| `bg-grid` utility | Yok | Var |
| `scanline-bar` utility | Yok | Var |
| Footer sütunları | 3 | 4 |

---

## HXI-3 — Phonk Studio Orijinal (arşiv)

**Lovable:** `761f6cd8-77f3-4ed5-a60d-188f01add89d`  
**Snapshot:** `e69afe52bf9000591053da3e03d792174277cc7f` (Temmuz 25, 2026)  
**Durum:** Arşivlendi — HXI-2'nin öncülü, kod tabanı aynı

HXI-2'ye göre farklar:
- Temmuz 25, 2026'da oluşturuldu (HXI-2'den 1 ay önce)
- Lovable'da 10 iterasyon (HXI-2: 46 iterasyon)
- `index.tsx` ve `styles.css` HXI-2 ile birebir aynı (doğrulandı)
- Ayrı bir monorepo dizini açılmadı — HXI-2 daha gelişmiş versiyonu

---

## En İyi Özellikler — Birleştirme Notu

İleride tek bir nihai HXI sitesi oluşturulacak. En iyi alınacak özellikler:

| Kaynak | Alınacak Özellik |
|---|---|
| HXI-1 | NCS bölümü, Stems bölümü, 13 tam bölüm yapısı, Spotify embed hardcoded |
| HXI-1 | `#080810` siyah tema (daha sert, underground hissi) |
| HXI-2 | JSON-LD `MusicGroup` schema (SEO için) |
| HXI-2 | Supabase `tracks` tablosu (müzik kataloğu yönetimi için) |
| HXI-2 | `MusicSection` bileşen mimarisi (ayrı component) |
| HXI-2 | Glitch CSS pseudo-element tekniği (daha temiz) |
| HXI-4 | `bg-grid` + `scanline-bar` atmospherik katmanlar |
| HXI-4 | Sync inquiry formu toggle, NCS reach stats, 4-sütun footer |
| HXI-4 | En eksiksiz bölüm yapısı (14 bölüm, hiç eksik içerik yok) |
| Ortak | Animasyonlu sayaçlar, scroll reveal, GDPR banner |

---

## Rutin — Yeni Lovable Projesi Geldiğinde

```bash
# 1. Projeyi Lovable MCP ile incele
mcp__Lovable__get_project (project_id)
mcp__Lovable__list_files (project_id)

# 2. Benzersiz dosyaları çek
mcp__Lovable__read_file (index.tsx, styles.css, __root.tsx, package.json, ...)

# 3. Monorepo'ya yaz
mkdir hxi-vN/src/routes hxi-vN/src/components hxi-vN/src/lib ...
# Boilerplate: hxi/ kaynaklı kopyala (router, start, server, lib/*, hooks/*)
# Benzersiz: Lovable'dan alınan dosyalar

# 4. .env.example oluştur (.env asla commit edilmez)

# 5. Bu dosyayı (HXI-ARKIV.md) güncelle

# 6. Commit ve push
git add -A && git commit -m "feat(hxi): import HXI-N <İSİM> from Lovable"
git push -u origin claude/hxi-skrlag
```
