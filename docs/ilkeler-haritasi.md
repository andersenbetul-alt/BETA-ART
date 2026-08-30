# İlke haritası — kural hangi dosyada yaşıyor

Bu bir kural belgesi **değil**, bir harita. Hiçbir kuralı burada yeniden
yazmaz — her kuralın **tek gerçek kaynağını** gösterir. Amaç: yeni bir
kural/belge/skill yazmadan önce "bu konu zaten belgeli mi?" sorusuna tek
yerden cevap bulmak.

Ortaya çıkış nedeni kayıtlı: `skill-observations/log.md` gözlem 12 —
Figma entegrasyonu için yazılan bir kurallar belgesi, `docs/` hiç
taranmadan üretilmiş ve zaten var olan iki belgeyle (`tasarim-sistemi.md`,
`figma-tasarim-kurallari.md`) çakışmıştı. Bu harita aynı hatanın
tekrarını önlemek için var.

## Üstünlük sırası

Çelişki olduğunda:

1. **`CLAUDE.md`** → "Değişmez kurallar" ve "Çalışma ilkeleri" — her zaman kazanır
2. **İlgili `docs/*.md`** → konuya özel derinlik, ölçüm, gerekçe
3. **`.claude/skills/*/SKILL.md`** → uygulama/iş akışı katmanı (kuralı tekrarlamaz, kaynağından okur)
4. Diğer her şey (denetim raporları, günlükler) **kural değil, tarihsel kayıttır**

## Harita

| Alan | Kural kaynağı | Otomatik denetim |
|---|---|---|
| Dil/çeviri bütünlüğü (10 dil) | CLAUDE.md madde 1 | `npm run check` |
| RTL / yön bağımsız CSS | CLAUDE.md madde 2 · `docs/tasarim-sistemi.md` §6 · `docs/figma-tasarim-kurallari.md` §6 | `npm run guvenlik` (kısmen) · görsel: `node .claude/skills/run-qblogg/driver.mjs shot "index.html?lang=ar"` |
| Metin sabitleme yasağı (`data-i18n`) | CLAUDE.md madde 3 | `npm run check` |
| Emoji/ikon kuralı | CLAUDE.md madde 4 · `docs/tasarim-sistemi.md` §5 | Yok — `/on-brand` becerisi |
| Renk/tipografi belirteçleri | CLAUDE.md madde 5 · `docs/tasarim-sistemi.md` §1 | Yok — `/on-brand` becerisi |
| Sayfa iskeleti (menü/altbilgi) tekrarı | CLAUDE.md madde 6 | `npm run check` (çiftlenen id/script yakalar, eksik menü linkini yakalamaz) |
| Kimlik/tescil üretimi (logo, EUIPO) | CLAUDE.md madde 7 · `docs/logo-sistemi.md` · `docs/marka-tescili.md` · `docs/marka-testleri.md` | `npm run tescil-testi` · `npm run marka-dogrula` |
| Rakamların örnek işaretlenmesi, uydurma yasağı | CLAUDE.md madde 8 · `.claude/skills/qblogg-blog-yazisi/SKILL.md` kalite kuralları | Yok — `/on-brand` becerisi |
| Marka kurallarını üretime uygulama/reddetme | `.claude/skills/on-brand/SKILL.md` | — (bu, kaynak değil uygulama katmanıdır) |
| Blog yazısı üretim yöntemi | `.claude/skills/qblogg-blog-yazisi/SKILL.md` | `npm run gorunurluk` |
| Yayınlanmış yazı görünürlük kuralı (16 madde) | `engine/visibility.mjs` | `npm run gorunurluk` |
| Türev içerik (LinkedIn, sosyal, newsletter…) üretimi | `.claude/skills/qblogg-turev/SKILL.md` | — |
| Üyelere özel "Q Brief" formatı | `.claude/skills/qblogg-q-brief/SKILL.md` | — |
| Oturum operasyonu (kaynak doğrulama, commit sahipliği, dağıtım kontrol listesi) | `.claude/skills/qblogg-operasyon/SKILL.md` | — |
| Siteyi çalıştırma/sürme, ekran görüntüsü | `.claude/skills/run-qblogg/SKILL.md` + `driver.mjs` | `smoke` alt komutu |
| Skill gözlem/iyileştirme döngüsü | `.claude/skills/task-observer/SKILL.md` | `skill-observations/log.md` |
| Güvenlik ve veri koruma | CLAUDE.md "guvenlik" bölümü | `npm run guvenlik` |
| Dağıtım (Vercel tarif deseni, tek dosya) | CLAUDE.md "Bilinen sınırlar" · `DAGITIM.md` · `qblogg-operasyon` §3 | Elle kontrol listesi |
| Ödeme (Stripe Payment Link) | `docs/odeme-sistemi.md` | — |
| İş modeli | `docs/is-modeli.md` | — |
| Gelir sistemi (5 katman) | `docs/gelir-sistemi.md` | — |
| İçerik mimarisi (30 temel sayfa + 300 destek) | `docs/icerik-mimarisi.md` | — |
| İçerik stratejisi (7 sütun, huni) | `docs/icerik-stratejisi.md` | — |
| Ekip modeli | `docs/ekip-modeli.md` | — |
| Üye sistemi (Q Brief Pro) | `docs/uye-sistemi.md` | — |
| Test mimarisi kararı (Playwright standardı) | `docs/test-mimarisi.md` | — |
| Yerel AI yığını kurulumu (kullanıcının kendi makinesi) | `docs/yerel-ai-yigini.md` | — |

## Tarihsel kayıtlar — kural değil, kanıt/karar geçmişi

Bunlar bir şeyin **nasıl olması gerektiğini** değil, **ne olduğunu/nasıl
karar verildiğini** anlatır. Yeni bir kural ararken buraya bakmayın —
yukarıdaki haritaya bakın.

- `docs/proje-gunlugu.md` — kronolojik proje günlüğü
- `docs/konsept.md` — ilk konsept belgesi (23.08.2026)
- `docs/action-pages-teklif.md` — bir satış pilotunun teklif belgesi
- `docs/yazar-platformu.md` — değerlendirilmiş, kararı bekleyen bir platform fikri
- `docs/denetim/*.md` — geçmiş denetim/inceleme raporları
- `docs/naviar/*.md` — NAVIAR Care (başka marka) logo karar süreci — referans, QBLOGG kuralı değil
- `docs/ai-workforce/*.md` — ayrı bir ürün hattı fikri (site değil)
- `docs/gorseller/*.png` — görsel kanıt/karşılaştırma panoları
- `skill-observations/log.md` + `archive/*.md` — skill gözlem günlüğü (task-observer)
- `ROADMAP.md` — iş listesi ve öncelik sırası (kural değil, durum)

## Yeni bir kural/belge/skill eklerken

1. Önce tara: `grep -rli "<anahtar kelime>" docs/ .claude/skills/ CLAUDE.md`
2. Zaten bir yerde varsa → oraya ekle/güncelle, **yeni dosya açma**
3. Yoksa doğru katmanı seç:
   - Tek cümlelik, projeye özgü, asla değişmeyecek bir kural → `CLAUDE.md`
   - Derin/teknik, ölçüme dayalı bir konu → `docs/`'ta yeni dosya
   - Bir iş akışını/üretimi yönlendiren, tekrar tetiklenecek bir davranış → `.claude/skills/`
4. Bu haritaya bir satır ekleyin — harita kendini güncellemez.
