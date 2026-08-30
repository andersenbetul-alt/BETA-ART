# NAVIAR CARE

Norveçli yaşlı bireyler ve pårørende (yakın aile/veli) için dijital koordinasyon platformu.  
**"Trygg koordinering for eldre og pårørende."**

## Mevcut durum

| Kaynak | Adres |
|---|---|
| Kaynak kodu | `betulandersen-droid/naviar-care-1` (private — transfer bekliyor) |
| Vercel projesi | `naviar-care-1` (BET-ART takımı) |
| Production URL | `naviar-care-1-psi.vercel.app` |
| Son preview | `naviar-care-1-1503sfbgf-bet-art.vercel.app` |
| Marka kullanım kılavuzu | `../brand/naviar/NAVIAR_CARE_Usage.txt` |
| Logo + descriptor | `../brand/naviar/descriptors/naviar-care-PENDING-APPROVAL.svg` |

### Vercel dağıtım durumu

- Son commit: "rename NAVIAR to NAVIAR CARE and update tagline" — **preview'da, production'a çıkarılmadı**
- Production'daki: eski "update site title" sürümü
- Mevcut preview'u production'a almak için:
  ```
  Vercel Dashboard → naviar-care-1 → Deployments
  → dpl_E4Q3o3WXeyaCEva7reSLgtGRwt7z → ⋯ → Promote to Production
  ```

## Platform özeti

**Stack:** Next.js (v0.app kökenli) · Norveçce arayüz  
**Hedef:** Norveçli yaşlılar ve yakınları için NAV/belediye sistemlerinde navigasyon

### Pilot modüller

| # | Modül | Kapsam |
|---|---|---|
| 1 | **Pårørende i NAV-systemet** | NAV başvuruları, kararlar, itirazlar |
| 2 | **Pårørende og kommunen** | Bakım hizmetleri ve belediye süreçleri |
| 3 | **Digital hjelp sammen** | Dijital hizmetlerde güvenli yardım |

## BETA-ART'a taşıma planı

Sıra önemlidir; 1 tamamlanmadan 2'ye geçilmez.

1. **GitHub transfer (kullanıcı adımı)**  
   `betulandersen-droid/naviar-care-1` → Settings → Transfer ownership → `andersenbetul-alt`  
   Transfer sonrası repo bu monorepo'dan klonlanabilir hale gelir.

2. **Kaynak kodu kopyalama (Claude adımı — 1. adım bittikten sonra)**  
   ```bash
   git subtree add --prefix=naviar/app \
     https://github.com/andersenbetul-alt/naviar-care-1 main --squash
   ```
   Ya da: `git clone --no-local` ile `naviar/app/` altına çek.

3. **Vercel bağlantısını güncelle (kullanıcı adımı)**  
   Vercel Dashboard → `naviar-care-1` → Settings → Git →  
   Repo'yu `andersenbetul-alt/BETA-ART`'a yönlendir, Root Directory: `naviar/app`

4. **`vercel.json` güncelle (Claude adımı — 3. adım bittikten sonra)**  
   Mevcut monorepo `vercel.json`'a `naviar-care-1` projesini ekle.

## Geliştirme (taşıma sonrası)

```bash
cd naviar/app
pnpm install       # veya npm install
pnpm dev           # http://localhost:3000
```

## Marka durumu

Logo kullanımı `../brand/naviar/NAVIAR_CARE_Usage.txt` kurallarına tabidir.  
CARE descriptoru onaylı mimaride **henüz yer almıyor**; kullanım için iş onayı
ve ayrı bir Nice sınıf 44 marka taraması gerekiyor.  
Ayrıntı: `../docs/naviar/NAVIAR-LOGO-KARAR.md` → P9 bölümü.
