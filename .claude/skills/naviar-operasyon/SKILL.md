---
name: naviar-operasyon
description: NAVIAR CARE projesinde çalışan her oturumun operasyon kuralları — repo durumu, Next.js yapısı, Slack botu, davranış sistemi entegrasyonu ve pilot proje öncelikleri. NAVIAR ile ilgili herhangi bir geliştirme, planlama veya koordinasyon işine başlarken MUTLAKA yükle; "naviar", "naviar-care", "pårørende", "NAV botu", "naviar-consult" anahtar kelimeleri geçtiğinde tetikle.
owner: QBLOGG
---

# NAVIAR CARE — operasyon kuralları

NAVIAR CARE, Norveçli yaşlı bireyler ve yakınları (pårørende) için
NAV/belediye/dijital hizmetlerde navigasyon platformu.
**"Trygg koordinering for eldre og pårørende."**

Bu beceri, NAVIAR'da çalışırken neyin nerede durduğunu ve ne sırayla
yapıldığını özetler. Çelişkide `naviar/CLAUDE.md` ve üstte `CLAUDE.md` kazanır.

---

## 1. Repo durumu ve öncelik sırası

**Kritik engel:** Kaynak kodu `betulandersen-droid/naviar-care-1` (private)
reposundadır. Bu repo `andersenbetul-alt/BETA-ART`'a transfer edilmeden
`naviar/app/` dizini boş kalır.

**Transfer adımları (kullanıcıya anlatılacak):**
1. GitHub → `betulandersen-droid/naviar-care-1` → Settings → Transfer ownership
2. Hedef: `andersenbetul-alt` (veya `andersenbetul-alt/BETA-ART` repo'su)
3. Transfer onaylandıktan sonra: `git submodule` veya düz kopyalama kararı
4. Vercel'de `naviar-care-1` projesini yeni repo'ya bağla
5. Preview URL'i test et: `naviar-care-1-psi.vercel.app`

**Öncelik sırası (31.08.2026 kararı):**
- **Önce:** Repo transferi
- **Sonra:** Marka çalışması (kimlik, görsel sistem, renk paleti)
- **Sonra:** Davranış sistemi entegrasyonu
Marka kararları kaynak kodu görülmeden havada kalır; sıraya uy.

---

## 2. Dizin yapısı

```
naviar/
  CLAUDE.md              Proje hafızası (öncelik sırası, kararlar)
  README.md              Vercel durumu ve taşıma planı
  docs/
    pilot-projeler.md    Üç pilot kapsam ve durum
    nav-sistemi.md       NAV başvuru akışları
    belediye.md          Belediye bakım rehberi
    dijital-yardim.md    Dijital hizmet protokolü
    behavior-system.md   Davranış sistemi (TypeScript modülü + React hook)
  app/                   ← BOŞ: repo transferi bekleniyor
```

**Stack:** Next.js · Norveççe öncelikli, İngilizce ikincil.
`naviar/app/` dolduğunda: `npm install && npm run dev`

---

## 3. Slack botu (naviar-consult)

Bot `agents/eve-slack-agent/` altında durur.
NAVIAR'a özgü beceriler `agents/eve-slack-agent/agent/skills/` içinde:
- `dijital_guvenlik.md` — kimlik avı, güvenli tarayıcı
- `belediye_hizmetleri.md` — bakım başvuruları
- `nav_yardim.md` — NAV hizmetleri navigasyonu

Botu geliştirmek için:
```bash
cd agents/eve-slack-agent
pnpm install
vercel link   # naviar-consult projesini seç
vercel env pull
pnpm dev
```

---

## 4. Davranış sistemi entegrasyonu (Next.js)

TypeScript modülü ve React hook hazır: `naviar/docs/behavior-system.md`

Entegrasyon için üç dosya oluşturulacak:
- `naviar/app/lib/behavior.ts` — localStorage tracker
- `naviar/app/hooks/useBehavior.ts` — React hook
- `naviar/app/components/BehaviorWidget.tsx` — öneri bileşeni

Kategori → hizmet eşlemesi:
| Kategori | Öneri |
|---|---|
| `nav` (NAV başvuruları) | Pårørende i NAV paketi |
| `kommune` (belediye) | Pårørende og kommunen paketi |
| `digital` (dijital) | Digital hjelp paketi |

Stripe entegrasyonu için `config.ts` içine `payLinks` nesnesi eklenecek —
tam yapı `naviar/docs/behavior-system.md` sonundaki "Stripe entegrasyonu"
bölümünde.

---

## 5. Pilot projeler

1. **Pårørende i NAV-systemet** — NAV başvuruları, kararlar, itirazlar
2. **Pårørende og kommunen** — Bakım ve belediye hizmetleri
3. **Digital hjelp sammen** — Dijital hizmetlerde güvenli yardım

Her pilot ayrı bir "paket" olacak: içerik + Slack bot desteği + rehber
belgeler. Mevcut içerik `naviar/docs/` altında.

---

## 6. QBLOGG ile sınır

NAVIAR ve QBLOGG aynı depoda (`andersenbetul-alt/BETA-ART`) yaşar ama
ayrı Vercel projeleri ve ayrı kod tabanlarıdır.

- QBLOGG değişiklikleri `BETA-ART` kök dizinini etkiler
- NAVIAR değişiklikleri `naviar/` alt dizinini etkiler
- `git add` yaparken hangi dosyaların hangi projeye ait olduğunu ayrıştır
  (qblogg-operasyon becerisi, madde 2)

---

## 7. Bu skill'i güncelleme

Yeni bir NAVIAR kararı veya teknik bulgu çıktığında:
1. `naviar/CLAUDE.md`'ye tarihle kayıt
2. Bu skill'in ilgili bölümünü güncelle
3. `docs/proje-gunlugu.md`'ye özet düş
