# NAVIAR — interaktif kimlik rehberi

`naviar-consult` Vercel projesinin (bet-art takımı) canlı kaynağı.
React + TypeScript + Vite + Tailwind + shadcn/ui (yalnız `button` bileşeni
kullanılıyor, geri kalan shadcn taslağı elendi).

Statik `brand/naviar/index.html` contact sheet'inin yerini aldı — aynı gerçek
varlıkları (`src/assets/naviar-svg.tsx`, geometri birebir `master/`,
`descriptors/`, `studies/`'ten alınmış) gösteriyor ama tema anahtarı,
tıkla-kopyala renk kartları ve canlı WCAG kontrast hesaplayıcısı ekliyor.

## Geliştirme

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b — build'e dahil değil, bkz. aşağıda
npm run build      # vite build → dist/
```

## Bilinen tuhaflık: `tsc -b` build'i kırıyor

`npm run build` bilinçli olarak yalnız `vite build` çalıştırıyor, `tsc -b`
değil. Sebep: bu TypeScript sürümünde `tsconfig.json` ve `tsconfig.app.json`
`baseUrl` kullanıyor, TS bunu "deprecated, TS 7.0'da kaldırılacak" diye
**hataya** çeviriyor (`TS5101`) ve `tsc -b` sıfırdan farklı çıkış koduyla
çıkıyor — Vercel'de build'i kırdı (ilk dağıtım denemesi). Tip kontrolü hâlâ
`npm run typecheck` ile ayrı çalıştırılabilir, sadece dağıtımı bloklamıyor.

## Marka kuralları

`.claude/skills/on-brand/SKILL.md`'deki kurallara tabi: 5 belirteç dışında
renk yok, gradient/gölge/bevel yok, gold yalnız yapısal aksan. Sayfanın
kendisi bunu `Renkler` bölümündeki canlı kontrast demosuyla kanıtlıyor.

## Dağıtım

```
naviar-consult (Vercel, bet-art takımı) → prj_xdqrg8LAsRZX6ZUOo8cXqXhJG1IT
```

Bu depo yalnızca kaynak — Vercel projesi bu klasöre bağlı bir Git entegrasyonu
**taşımıyor** (proje `deploy_to_vercel` ile doğrudan dosya yükleyerek
dağıtıldı, `main`'e push otomatik dağıtım tetiklemez). Güncelleme için bu
klasörü değiştirip yine `deploy_to_vercel`'i (framework: vite, buildCommand:
`npx vite build`) çağırın.
