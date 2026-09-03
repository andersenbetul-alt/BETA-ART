# WEB-2026-003 Beta Art — Mimari

## Kaynak ağacı (beta-art/)

```
beta-art/
├── src/
│   ├── routes/           TanStack Router sayfaları
│   │   ├── __root.tsx
│   │   ├── index.tsx        Ana sayfa
│   │   ├── plates.$slug.tsx Fotoğraf detay
│   │   ├── contact.tsx      İletişim
│   │   ├── license-terms.tsx Lisans şartları
│   │   ├── privacy.tsx      Gizlilik
│   │   └── refunds.tsx      İade politikası
│   ├── components/       UI bileşenleri
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   ├── LicenseRequestForm.tsx
│   │   ├── ProvenancePanel.tsx
│   │   ├── TrustStrip.tsx
│   │   └── ui/              shadcn/ui
│   ├── data/             Statik içerik (koleksiyon verileri)
│   ├── hooks/
│   ├── lib/
│   └── styles.css
├── supabase/             Supabase yapılandırması
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Teknoloji yığını

| Katman | Teknoloji |
|---|---|
| Framework | TanStack Start (React + SSR) |
| Router | TanStack Router |
| UI | shadcn/ui + Tailwind CSS |
| Backend / DB | Supabase |
| Derleme | Vite |
| Dil | TypeScript |
| Kaynak | Lovable (AI-first builder) |

## İş mantığı

- **Provenance sistemi:** Her fotoğraf için RAW arşivi, capture metadata, fotoğrafçı imzası
- **Lisans kademeleri:** Personal · Commercial · Extended · Custom & Exclusive
- **Fiyat başlangıcı:** kr 190
- **Koleksiyon:** 12 örnek plaka (First Light, Into the Pines, Sea of Fog, vb.)

## ⚠️ İki kaynak riski

`andersenbetul-alt/BETA-ART/beta-art/` ve Lovable'ın kendi repo'su aynı anda değişebilir.  
Lovable her değişikliği otomatik commit eder → monorepo'daki kod geride kalabilir.  
**Karar gerekli:** Tek kaynak hangisi olacak?
