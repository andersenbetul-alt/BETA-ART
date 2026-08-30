# NAVIAR CARE — alt-proje talimatları

Norveçli yaşlı bireyler ve yakınları için dijital koordinasyon platformu.
**"Trygg koordinering for eldre og pårørende."**

## Proje nedir

NAVIAR CARE, yaşlı bireyler ve onların pårørende'lerinin (yakın bakıcılar)
NAV, belediye ve dijital kamu hizmetleri sistemlerinde yol bulmasına yardımcı
olur. Hedef kitle: Norveçli 60+ yaş grubu ve onların aile üyeleri.

## Teknik yapı

Next.js · Dil: Norveççe öncelikli, İngilizce ikincil.

```
naviar/
  README.md         Vercel durumu ve taşıma planı
  CLAUDE.md         Bu dosya — proje hafızası
  docs/             NAVIAR proje belgeleri
    pilot-projeler.md  Üç pilot projenin kapsamı ve durumu
    nav-sistemi.md     NAV başvuru akışları ve önemli noktalar
    belediye.md        Belediye bakım hizmetleri rehberi
    dijital-yardim.md  Dijital hizmetlerde güvenli yardım protokolü
  app/              ← Henüz boş: kaynak betulandersen-droid/naviar-care-1'de
                      GitHub repo transferi bekleniyor (bkz. README.md)
```

## Kaynak ve dağıtım

| Kaynak | Adres |
|---|---|
| Kaynak kodu | `betulandersen-droid/naviar-care-1` (private, transfer bekleniyor) |
| Vercel projesi | `naviar-care-1` (bet-art takımı) |
| Production URL | `naviar-care-1-psi.vercel.app` |
| Slack botu | `agents/eve-slack-agent/` → Vercel: naviar-consult |

## Pilot projeler

1. **Pårørende i NAV-systemet** — NAV başvuruları, kararlar, itirazlar
2. **Pårørende og kommunen** — Bakım ve belediye hizmetleri
3. **Digital hjelp sammen** — Dijital hizmetlerde güvenli yardım

## Geliştirme notu

`app/` dizini şu an boş. Repo transferi tamamlandığında:
```bash
# Kaynak kodu buraya kopyalanacak
cd naviar && npm install && npm run dev
```

Transfer için: GitHub → `betulandersen-droid/naviar-care-1` → Settings →
Transfer ownership → `andersenbetul-alt`. Sonra Vercel bağlantısı güncellenir.

## naviar-consult Slack botu

Bot yapılandırması `agents/eve-slack-agent/` altında durur.
NAVIAR'a özgü beceriler `agents/eve-slack-agent/agent/skills/` içinde.

Botu geliştirmek için:
```bash
cd agents/eve-slack-agent
pnpm install
vercel link   # naviar-consult projesini seç
vercel env pull
pnpm dev
```
