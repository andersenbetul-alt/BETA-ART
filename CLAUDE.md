# BETA-ART — çoklu proje deposu

Bu depo artık tek bir siteye özel değil: Beta Art çatısı altındaki her proje
buraya toplanıyor (kullanıcı kararı, 30.08.2026). Kural: **her proje kendi
üst-düzey klasöründe yaşar**, kendi `CLAUDE.md`'si ve (varsa) kendi
`package.json` / `vercel.json`'ıyla birlikte. Bu dosya yalnızca üst-düzey
haritadır — proje kuralları kendi klasörlerindeki `CLAUDE.md`'de durur.

## Klasörler

| Klasör | Proje | Durum |
|---|---|---|
| `qblogg/` | QBLOGG — çok dilli içerik stüdyosu sitesi + AI Workforce hattı + üye/Intelligence katmanı | **Canlı** (qblogg.vercel.app). Kendi kuralları: `qblogg/CLAUDE.md` |
| `naviar/` | NAVIAR — strateji/danışmanlık markası: kimlik sistemi (`naviar/brand/`) ve karar belgeleri (`naviar/docs/`) | Marka kimliği karara bağlandı; iş modeli/site henüz yok |
| `skill-observations/` | task-observer gözlem günlüğü — depo genelinde, tek bir projeye ait değil | Sürüyor |
| `.claude/` | Depo genelindeki beceriler ve kancalar (bazıları hâlâ QBLOGG'a özel isimli — bkz. Açık işler) | — |

Yeni bir proje eklerken: kendi üst-düzey klasörünü açın, içine kendi
`CLAUDE.md`'sini yazın, bu tabloya bir satır ekleyin.

## Neden bu yapı

Tek bir depoda üç bağımsız iş birikmişti (QBLOGG, NAVIAR, "Q Work"/AI
Workforce) ve hepsi kök dizinde iç içe duruyordu — kök `index.html` QBLOGG'a,
kök `docs/naviar/` NAVIAR'a aitti, ayrım yalnızca dosya adından anlaşılıyordu.
30.08.2026'da klasör-başına-proje yapısına geçildi. Taşıma sırasında
doğrulanan şey: her betik (`scripts/*.mjs`, `*.py`) kendi dosya konumuna göre
(`import.meta.url` / `__file__`) yol çözüyor, `process.cwd()`'e hiç
güvenmiyor — bu yüzden klasörler bütün halinde taşınınca hiçbir betik kodu
değişmedi. Değişen tek şeyler: `qblogg/vercel.json`'daki `buildCommand`
(kopyalanan yollara `qblogg/` öneki eklendi), `.claude/hooks/session-start.sh`
(kontrol betiğinin yeni yolu) ve `.gitignore`'daki tek çapalı kural
(`engine/data/` → `qblogg/engine/data/`).

## Açık işler (taşıma sonrası)

- **"Q Work" / AI Workforce'un yeri karara bağlanmadı.** `qblogg/docs/ai-workforce/`
  içindeki ürün tanımı kendi içinde üç seçenek sunuyor (tam geçiş / iki marka /
  tek çatı-iki teklif) ve **kendi önerisi QBLOGG çatısı altında kalmak**. Bu,
  bu oturumda ayrı bir "Q Work" projesi olarak ele alınmasıyla gerilimli —
  kullanıcıyla netleştirilmeli, körlemesine ayrı klasöre taşınmadı.
- **Dört Vercel projesi var** (takım "BET - ART" / `team_xNtowH7U0jXQrI53DFJFzH2o`):
  `qblogg` (bu depo), `hxi-music` ve `naviar-consult` ikisi de
  `betulandersen-droid/eve-slack-agent` deposuna bağlı, `naviar-care-1` ise
  `betulandersen-droid/naviar-care-1` deposuna bağlı. **Bu iki depo bu
  oturumun GitHub erişim kapsamında değil** — içerikleri bu depoya taşınmadı.
  "Bütün projeler buraya taşınsın" tam anlamıyla uygulanmak isteniyorsa bu
  depoların erişime eklenmesi gerekir.
- `.claude/skills/qblogg-*` beceri adları hâlâ kök seviyede duruyor (QBLOGG
  içeriğine özel olsalar da) — beceri keşif mekaniği doğrulanmadan taşınmadı.
- Kök `README.md` yeni yapıya göre kısaltıldı; her projenin kendi ayrıntılı
  README'si kendi klasöründe (`qblogg/README.md`).
