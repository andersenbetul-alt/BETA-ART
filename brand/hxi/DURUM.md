# HXI — proje durumu

Site ve marka işinin tek yerde durum kaydı. Canlı takip panosu: `pano/`
(BET·ART Panosu). Bir iş bittiğinde buraya tarihle geçir; kullanıcı tarafında
bekleyen adımlar **[SENİN ADIMIN]** ile işaretli.

**Site:** 10 dilli kök (V6 statik export) · kanonik hximusic.com (hxi-nu.vercel.app)
**Yayın hattı:** `.claude/skills/hxi-yayin` · geliştirme dalı `claude/hxi-skrlag`

---

## Bitti

| İş | Not |
|---|---|
| 10 dilli site kökü (V6, SEO-doğru çok dilli yapı) | en/no/tr/fr/de/es/pt/ar/ja/zh — kanonik hximusic.com |
| `/use` ve `/sync` alt sayfaları (10 dil) | Konsept §18–19; doğrulanmış NCS bağlantıları, booking@ CTA |
| Üç oturum birleştirildi: `/v7` `/v8` `/logo` | Marka mimarisi + dosyalar + logo oturumları mount edildi |
| Sosyal medya + podcast bölümü | Spotify / Instagram / YouTube / NCS + HXI FREQUENCY |
| Cihaz-içi öneri sistemi ("Senin için" şeridi) | En çok dinlenen parçalar; veri tarayıcıda kalır, panele gitmez |
| Marka tescili derin araştırma raporu | `TESCIL-ARASTIRMASI.md` — EUIPO vs Patentstyret, ücretler, HXI/PROD.HXI/HXIMUSIC, sloganlar |
| small-business eklenti profili | `SMB-PROFIL.md` — 30 iş akışının HXI'ye uygunluk haritası |

## Devam ediyor

| İş | Not |
|---|---|
| PR #14 yeşile taşınıyor | `claude/hxi-skrlag` → main; kalan kırmızı: başıboş Vercel projeleri kotası (bu PR'ın hatası değil) |

## Sıradaki

| İş | Not |
|---|---|
| Marka tescili: TMview + Patentstyret elle tarama | HX/HXV komşuluğu netleşmeden başvuru yok; kurum siteleri bu ortamda engelli |
| Gerçek "help urself" kapak görseli | **[SENİN ADIMIN]** — sağlarsan placeholder yerine geçer |

## Beklemede — [SENİN ADIMIN]

| İş | Adım |
|---|---|
| hximusic.com DNS bağlama | Vercel panel + GoDaddy DNS (A `@` → `76.76.21.21`, CNAME `www`) |
| booking@hximusic.com e-posta yönlendirme | GoDaddy Email Forwarding → Gmail |

---

## Açık kapılar (üretim engelleri)

Marka mimarisi ve logo geometrisi kilitli; kalan kapılar `README.md` → *Open Gates*:
logo Acid `#C8FF00` renk güncellemesi, tescil/slogan temizliği, seçilmiş içerik/görsel,
üretim formları + QA. Tescil temiz olana dek `®` veya "korunmaktadır" dili **yok**.
