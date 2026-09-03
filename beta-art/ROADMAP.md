# Beta Art — Yol Haritası

**Dizin:** `beta-art/`  
**Lovable ID:** `9b7b3abe-43fc-4867-9f79-b1d22fb1a80c`  
**Kaynak repo:** `andersenbetul-alt/beta-art-archive`  
**Durum:** 🔒 Taslak (deploy edilmedi)

---

## Konsept

"Doğrulanmış insan fotoğrafçılığı arşivi." Her fotoğraf bir insan tarafından fiziksel kamerayla çekildi, RAW orijinali saklandı, çekim meta verisi korunuyor, lisans doğrudan fotoğrafçıdan veriliyor. AI üretimi içerik değil.

**Neden var:**
- AI görsel üretiminin patlama yaptığı dönemde **orijinalliği satmak**
- Belgelenmiş provenance → premium lisans fiyatı
- Arşiv estetiği → müze kalitesi hissi

**Tasarım yönü:**
- Minimalist müze / arşiv estetiği
- Editorial tipografi, bol beyaz alan
- Fotoğraf önde, UI geri planda
- SaaS landing page gibi değil — ciddi bir fotoğraf arşivi gibi

**Hedef kitle:**
- Tasarımcılar, yayıncılar, markalar: ticari lisans arayışında
- Gazeteciler, içerik ekipleri: doğrulanmış görsel kaynak

---

## Teknik mimari

| Karar | Neden |
|---|---|
| TanStack Start (SSR) | Lovable şablonu; SEO için SSR gerekli |
| React 19 + TypeScript | Lovable ekosistemi |
| Tailwind CSS v4 | Token sistemi |
| Supabase (planlanan) | Fotoğraf kataloğu, lisans takibi, provenance kayıtları |
| Lovable kaynak | `9b7b3abe` — push gelince `beta-art/` güncellenir |

---

## Sayfalar ve bölümler

### Ana sayfa (homepage)
| Bölüm | İçerik |
|---|---|
| Nav | Collection, Verification, Photographer, Licensing, FAQ, Contact |
| Hero | "Verified Human Photography" H1; provenance ve lisans bilgisi; "View the collection" CTA |
| Verification | 3 yöntem: RAW arşivlendi / Capture record / Maker imzalı lisans |
| Collection grid | 12 örnek plaka: başlık, katalog numarası, lokasyon/tarih, "from kr 190" |
| Photographer/About | — |
| Licensing | Personal / Commercial / Extended / Custom & Exclusive |
| FAQ | — |
| Footer | Premium altbilgi |

### Örnek koleksiyon plakları
First Light, Into the Pines, Sea of Fog, Still Water, PALM, Blue Hour Grid, Night Crossing, Golden Hour, Portrait in Amber, The Maker, Slow Morning, Low Tide

---

## Değişiklik günlüğü

| Tarih | Değişiklik | Yapan |
|---|---|---|
| Ağu 2026 | Lovable'da oluşturuldu | Lovable AI |
| 30.08.2026 | BETA-ART monoreposuna import edildi (`beta-art/`) | Claude |
| 30.08.2026 | ROADMAP.md oluşturuldu | Claude |
| 02.09.2026 | Hukuki footer düzeltmeleri: `/kontakt`→`/refunds`, `/cookie-settings`→`/privacy` redirect rotaları; çerez beyanı | Claude |
| 02.09.2026 | Lovable barındırılan uygulamada footer bağlantıları düzeltildi + yeniden yayın (`/terms` `/cookies` `/ai-policy` kaldırıldı; gerçek rotalara bağlandı) | Claude |
| 02.09.2026 | Cihaz-içi öneri (`ForYou`) + editör panel notu: kullanıcı/editör ayrımı, uydurma istatistik yok — veri tarayıcıda kalır | Claude |
| 02.09.2026 | Sosyal medya kanal stratejisi (`SOSYAL-MEDYA.md`): IG→Pinterest→LinkedIn, açılış kapıları | Claude |
| 03.09.2026 | **10 dilli i18n temeli** (`src/i18n/`): HXI seti (en/no/tr/fr/de/es/pt/ar/ja/zh), SSR-güvenli sağlayıcı, dil değiştirici, Arapça RTL; chrome (header/footer/trust/dev-notice) 10 dilde. node-server derlemesi + Playwright ile doğrulandı | Claude |
| 03.09.2026 | **Ana sayfa gövdesi 10 dilde** (`src/i18n/home.*.ts`, 138 anahtar × 10 dil): hero, manifesto, kanıt zinciri, passport, seriler, koleksiyon, platform, haklar, lisanslama, kitleler, komisyon, fotoğrafçı, final CTA. Playwright ile TR/JA/AR gövde çevirisi + RTL doğrulandı | Claude |
| 03.09.2026 | **Katalog verisi 10 dilde** (`src/i18n/catalog.*.ts`, 63 anahtar × 10 dil): SSS (6 S-C), lisanslar (Kişisel/Ticari/Genişletilmiş/Özel — ad, kitle, fiyat, özet, izin/kısıt listeleri), teslimat, sipariş adımları, plaka açıklaması + doğrulama durumları. Bağlandı: ana sayfa kartları, footer, lisans-koşulları, talep formu, plaka detay seçici. Playwright ile TR doğrulandı. **Kalan: ProvenancePanel/CaptureTable + plaka-detay bölüm başlıkları (provenance/sayfa chrome) + hukuk sayfaları** | Claude |

---

## Sırada ne var

Canlı takip panosu: `pano/` (BET·ART Panosu). Kullanıcı tarafında bekleyen
adımlar **[SENİN ADIMIN]** ile işaretli — bunlar bağlanmadan "kanıt" markası açılamaz.

| Öncelik | İş |
|---|---|
| Kritik · [SENİN ADIMIN] | **Gerçek fotoğraflar ekle** — 12 plaka hâlâ placeholder; gerçek fotoğraflar olmadan "kanıt" markası açılamaz |
| Kritik · [SENİN ADIMIN] | **beta-art.com DNS** — alan adı çözünmüyor; barındırma seç + DNS bağla |
| Kritik | **Ödeme akışı** — Lisans satın alma; Stripe önerilen |
| Yüksek · [SENİN ADIMIN] | **Gerçek iletişim e-postası** (`src/config/site.ts`) — hâlâ "to be supplied" |
| Yüksek · [SENİN ADIMIN] | **Hukuki metinlerdeki [To be completed] alanları** — şirket unvanı, org.nr, adres, saklama süreleri |
| Yüksek | **Submission backend** (form → gerçek kayıt) — bağlanınca editör paneli gerçek sinyalle dolar |
| Yüksek | **Fotoğraf kataloğu** — Supabase; title, catalogue_no, provenance, RAW hash, lisans türleri |
| Yüksek | **Lisans belgesi üretimi** — Her satışta PDF/imzalı belge |
| Orta | **Provenance sayfası** — Her fotoğrafın EXIF + RAW özeti |
| Orta | **Fotoğrafçı profili** — Kim çekti, nasıl doğrulandı |
| Düşük | **İkincil pazar / koleksiyoncu** — Baskı satışı |
