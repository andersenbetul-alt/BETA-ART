# Skill Observation Log

Observations captured during task-oriented work. Each entry identifies a
potential skill improvement or new skill opportunity.

**Status key:** OPEN = not yet actioned | ACTIONED = skill updated/created |
DECLINED = user decided not to pursue

---

## 2026-08-26 — run-qblogg incelemesi + Figma tasarım sistemi belgesi

### Observation 9: Ölçülmüş-sayı belgeleri, yeni sayfa eklendiğinde birbirinden bağımsız kayıyor

**Status:** OPEN
**Date:** 2026-08-26
**Session context:** `/mcp__Figma__create_design_system_rules` isteğine yanıt
olarak `docs/tasarim-sistemi.md`'yi depoyla karşılaştırma
**Skill:** qblogg-operasyon (kaynak doğrulama ilkesi)
**Type:** internal
**Phase/Area:** Belge bakımı — sayfa iskeleti sayımı

**Issue:** `kalite.html` ve `ornek.html` depoya eklendiğinde site iskeleti
(menü+altbilgi) 6 dosyadan 8 dosyaya çıktı, ama bunu sayan iki ayrı belge
güncellenmedi: `docs/tasarim-sistemi.md` ("altı HTML sayfası", "553 satır,
95 sınıf" — main.css o sırada 629 satır/119 sınıftı) ve `CLAUDE.md` madde 6
("sayfa iskeleti altı dosyada tekrar eder"). İkisi de "her madde depodan
ölçüldü" iddiasıyla yazılmıştı ama ölçüm tek seferlikti, sayfa eklendiğinde
yeniden koşulmadı. `docs/tasarim-sistemi.md`'yi bu oturumda düzelttim;
`CLAUDE.md` hâlâ eski — kullanıcıya bildirildi, onay bekleniyor.

**Suggested improvement:** `qblogg-operasyon` becerisine (veya CLAUDE.md'nin
kendisine) şu kontrol listesi maddesi eklenmeli: yeni bir sayfa dosyası
(`*.html`, menü+altbilgi iskeletini tekrar eden türden) eklendiğinde,
iskelet dosya sayısını anan yerler (`grep -rn "altı dosya\|6 sayfa\|altı
HTML" CLAUDE.md docs/`) taranır ve sayı güncellenir. `check.mjs`'e de
benzer bir denetim eklenebilir: gerçek `*.html` sayısı ile CLAUDE.md'deki
anılan sayı uyuşmuyorsa uyarı versin.

**Principle:** "Ölçüldü" notu bir belgeyi yalnızca yazıldığı ana kadar
doğru tutar; ölçülen şey (dosya sayısı, satır sayısı) değişebilecek bir
yapıdaysa, o yapıyı değiştiren her işlem (yeni sayfa, yeni bölüm) belgeyi
de yeniden ölçmeyi tetiklemeli — tek seferlik doğrulama kalıcı doğruluk
değildir.

### Observation 10: Aynı komutun art arda tekrarında, önce oturum içi durum kontrol edildi — yeniden üretim yapılmadı

**Status:** OPEN
**Date:** 2026-08-26
**Session context:** `/mcp__Figma__create_design_system_rules` art arda iki
kez, birebir aynı argümanla çağrıldı
**Skill:** Genel çalışma pratiği (kesişen ilke adayı)
**Type:** open-source
**Phase/Area:** Tekrarlı çağrı işleme

**Issue:** Bir üretici komut (kapsamlı bir analiz/belge isteyen) ikinci kez
birebir aynı şekilde geldiğinde, önce `git status` ve önceki commit
kontrol edildi; iş zaten yapılmış ve push'lanmış olduğu görüldüğü için
analiz baştan tekrarlanmadı, yalnızca durum doğrulanıp özetlendi. Bu,
gereksiz token harcamasını ve çelişkili ikinci bir belge sürümü riskini
önledi.

**Suggested improvement:** Kesişen ilkelere şu madde eklenebilir: bir istek
öncekiyle aynı deliverable'ı istiyorsa (aynı komut, aynı argüman, veya
"az önce yaptığın işi tekrar yap" izlenimi varsa), önce çalışma ağacı/son
commit durumu kontrol edilir; iş zaten tamamlanmışsa yeniden üretmek yerine
mevcut durumu doğrulayıp özetlemek tercih edilir.

**Principle:** Tekrarlı bir istek, işi baştan yapma emri değil — önce
"bu zaten yapıldı mı?" sorusunun sorulması gerektiğinin sinyalidir.
Gereksiz yeniden üretim hem maliyetlidir hem de tutarsız ikinci bir
sürüm riski taşır.
