# COBBAN

Online satış için kurulan çok kategorili e-ticaret markası.
🇳🇴 **Norveç'te satış** · 🇹🇷 **Türkiye'de tedarik** · 3 dil (NO / EN / TR)

```
BETA-ART/
├── brand.json          Marka bilgilerinin tek kaynağı (ad, renk, font, domain)
├── brand/              Logo (SVG) ve tasarım token'ları
├── docs/               Şirket kurulum, vergi, ihracat, pazarlama dokümanları
│   └── sozlesmeler/    Yasal metin şablonları (TR / NO / EN)
└── web/                Next.js mağaza vitrini (3 dilli, çok para birimli)
```

## Nereden başlamalı

1. **[docs/00-yol-haritasi.md](docs/00-yol-haritasi.md)** — genel plan ve sıralama
2. **[docs/10-kontrol-listesi.md](docs/10-kontrol-listesi.md)** — tek sayfada tüm adımlar
3. **[docs/09-lansman-plani-90-gun.md](docs/09-lansman-plani-90-gun.md)** — hafta hafta ne yapılacak

## Dokümanlar

| Konu | Dosya |
|---|---|
| 🇳🇴 Norveç şirketi (ENK / AS, MVA, banka) | [docs/01](docs/01-norvec-sirket-kurulum.md) |
| 🇹🇷 Türkiye şirketi (şahıs / limited, ETBİS) | [docs/02](docs/02-turkiye-sirket-kurulum.md) |
| İki ülkeli model, mikro ihracat, VOEC, KDV iadesi | [docs/03](docs/03-iki-ulke-modeli-ve-ihracat.md) |
| Vergi ve muhasebe takvimi | [docs/04](docs/04-vergi-muhasebe-takvimi.md) |
| Marka kimliği ve marka tescili | [docs/05](docs/05-marka-kimligi.md) |
| Satış kanalları (site, pazaryeri, sosyal, ihracat) | [docs/06](docs/06-satis-kanallari.md) |
| Fiyatlandırma ve birim ekonomi | [docs/07](docs/07-fiyatlandirma-ve-birim-ekonomi.md) |
| Shopify mağaza kurulumu | [docs/08](docs/08-shopify-kurulum.md) |
| 90 günlük lansman planı | [docs/09](docs/09-lansman-plani-90-gun.md) |
| Kontrol listesi | [docs/10](docs/10-kontrol-listesi.md) |
| Yasal metinler (mesafeli satış, KVKK/GDPR, iade, çerez) | [docs/sozlesmeler/](docs/sozlesmeler/) |

## Web sitesi

```bash
cd web && npm install && npm run dev
```

Detay: [web/README.md](web/README.md)

## Mevcut durum

| | |
|---|---|
| Shopify mağazası | `p8q2mw-ab.myshopify.com` — **trial planında**, satış öncesi ücretli plana geçilmeli |
| Para birimi / ülke | NOK / Norveç |
| Marka adı | COBBAN (tescil başvurusu **yapılmadı** — önce benzerlik araştırması) |
| Domain | `cobban.com` **alınmadı** |
| Şirket | Henüz kurulmadı |

---

> ⚠️ Bu depodaki dokümanlar bilgilendirme amaçlıdır; hukuki veya mali müşavirlik
> hizmeti değildir. Tutar, oran ve eşikler her yıl değişir. Uygulamaya geçmeden önce
> Norveç'te bir *regnskapsfører*, Türkiye'de bir SMMM ile teyit et; yasal metinleri
> bir avukata okut.
