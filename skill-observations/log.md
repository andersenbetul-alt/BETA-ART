# Skill Observation Log

Observations captured during task-oriented work. Each entry identifies a
potential skill improvement or new skill opportunity.

**Status key:** OPEN = not yet actioned | ACTIONED = skill updated/created |
DECLINED = user decided not to pursue

---

## 2026-08-26 — Beta Art: KOBİ bölümü, run-qblogg doğrulaması, Figma kuralları

### Observation 9: Yeni i18n anahtarı eklerken terim tutarlılığı kontrolü kurallara yazılı değildi

**Status:** OPEN
**Date:** 2026-08-26
**Session context:** index.html'e yeni "Kimler için" (kobi) bölümü eklenirken
19 anahtar × 10 dile çevrildi
**Skill:** qblogg-operasyon (Kaynak doğrulama bölümü) — ya da CLAUDE.md'nin
"Yeni bölüm/sayfa" ve "Yeni dil" maddeleri
**Type:** internal
**Phase/Area:** Çok dilli metin ekleme

**Issue:** CLAUDE.md ve qblogg-operasyon, yeni bir i18n anahtarının 10
dilin tamamına eklenmesi gerektiğini söylüyor ama *nasıl* çevrileceğine
dair bir kural yok. "Brief" gibi bir terimin sitede zaten yerleşmiş
çevirileri var (zh: 需求, hi: ब्रीफ़, ar: الملخّص, es/fr/pt/no: brief,
ru: бриф) — bunu grep'lemeden çevirseydim her dilde farklı bir kelime
seçebilirdim (örn. zh için 需求 yerine 简报 yazabilirdim) ve aynı kavram
için sitede iki farklı sözcük dolaşırdı. Yeni anahtarları yazmadan önce
`grep -n "'p1.cta'\|'hero.ctaPrimary'\|..."` ile mevcut çevirileri
tarayıp terimi oradan aldım; bu adım hiçbir skill'de yazılı değildi,
kendi muhakememle uyguladım.

**Suggested improvement:** qblogg-operasyon'un "Kaynak doğrulama"
bölümüne şu kural eklensin: yeni bir i18n anahtarı 10 dile çevrilmeden
önce, anahtarın içerdiği tekrar eden ürün terimleri (brief, paket,
abonelik, revizyon vb.) için mevcut çeviriler `grep` ile bulunur, yeni
metin o terimi kullanır — her dil için terimi sıfırdan seçmez.

**Principle:** Çok dilli bir projede yeni metin eklemek yalnızca "10
dile çevrildi mi" sorusuyla tamamlanmaz; "aynı terim için siteye ikinci
bir çeviri mi eklendi" sorusu da sorulmalı — kaynak doğrulama ilkesi
(kesişen ilke 1) yalnızca kod tanımlayıcılarına değil, tekrar eden
çeviri terimlerine de uygulanır.

### Observation 10: run-qblogg driver'ı tek bir bölümü çoklu dil/tema kombinasyonunda görüntülemeyi desteklemiyor

**Status:** OPEN
**Date:** 2026-08-26
**Session context:** index.html'e eklenen yeni "kobi" bölümünü TR/EN ×
açık/koyu temada ve Arapça RTL'de doğrulama
**Skill:** run-qblogg
**Type:** internal
**Phase/Area:** Ajan sürücüsü (driver.mjs) kapsamı

**Issue:** `driver.mjs shot` yalnızca tam sayfa (`fullPage: true`)
görüntü alıyor ve temayı değiştirmiyor (varsayılan `qb_theme`'i
kullanıyor; dil de yalnızca URL `?lang=`'dan geliyor). Yeni eklenen tek
bir bölümü 4 kombinasyonda (tr/en × açık/koyu) ve ayrıca Arapça'da
kontrol etmek için scratchpad'e ayrı, tek kullanımlık bir Playwright
betiği yazmak gerekti (`localStorage.setItem('qb_theme', ...)` +
`page.locator('#id').screenshot()`). Bu ihtiyaç — yeni bir bölümü
birden çok dil/tema kombinasyonunda doğrulama — CLAUDE.md'nin kendi
kuralı gereği (madde 2: her yeni bölümde RTL kontrolü) her yeni bölüm
eklendiğinde tekrar edecek.

**Suggested improvement:** `driver.mjs`'e üçüncü bir alt komut eklensin,
örn. `node driver.mjs el <sayfa> <#seçici> <dizin> [tema] [dil]` —
verilen CSS seçicisine `locator(...).screenshot()` alsın, `tema`
argümanı verilirse sayfa yüklenmeden önce `qb_theme`'i `localStorage`'a
yazsın. Bu, RTL/tema kontrolü için her seferinde tek kullanımlık betik
yazma ihtiyacını ortadan kaldırır.

**Principle:** Bir sürücü becerisi iki farklı doğrulama ihtiyacını
karşılamalı: "sayfanın tamamı" ve "tek bileşen + varyant matrisi".
İkincisi, projenin kendi tasarım kuralları (çok dillilik, RTL,
açık/koyu tema) yeni içerik eklemeyi gerektirdikçe tekrar tekrar ortaya
çıkar — tek seferlik değil, yinelenen bir ihtiyaçtır.

### Observation 11: pkill ile 8000 portunu kapatmak sandbox'ta yanıltıcı exit kodu (144) üretiyor

**Status:** ACTIONED — run-qblogg SKILL.md Gotchas bölümüne işlendi (commit 823eb3e, 2026-08-26, bu oturumdan önce)
**Date:** 2026-08-26
**Session context:** index.html'deki yeni bölümü ekran görüntüsüyle
doğrularken sunucuyu yeniden başlatmak için `pkill -f "http.server
8000"` çalıştırıldı
**Skill:** run-qblogg
**Type:** internal
**Phase/Area:** Gotchas / sandbox davranışı

**Issue:** Bash aracı `python3 -m http.server 8000`'i arka planda takip
ediyor; bunu `pkill -f http.server` ile öldürmek, komutun kendisinin
anlamsız bir çıkış koduyla (144) dönmesine yol açtı — üç ayrı denemede
tekrarlandı, site aslında sağlıklı kalıyordu ama hata sanılıp zaman
kaybedildi. Kök neden: harness'ın arka plan görev takibi, kendi izlediği
bir süreç dışarıdan öldürülünce bunu komutun başarısızlığı gibi
raporluyor.

**Suggested improvement:** Bu bulgu doğrudan uygulandı — run-qblogg
SKILL.md'nin Gotchas bölümüne "8000 portunu pkill ile kapatma" maddesi
eklendi; driver zaten kendi sunucusunu kendi açıp kapatıyor, manuel
pkill'e gerek yok.

**Principle:** Bir agent-driver skill'inin Gotchas bölümü yalnızca hedef
uygulamanın tuhaflıklarını değil, çalıştığı sandbox/harness'ın araç
davranışındaki tuhaflıkları da kapsamalı — ikisi de "bu konteynerde
yaşandı" kategorisine girer ve ikisi de sonraki ajanın zamanını çalar.

### Observation 12: Yeni bir belge yazmadan önce docs/ taranmadı, mevcut iki belgeyle çakışan üçüncü bir belge üretildi

**Status:** ACTIONED — kendi hatam bu oturumda düzeltildi (`.claude/figma-design-system.md` silindi, `/on-brand` becerisi mevcut belgelere işaret edecek şekilde yazıldı)
**Date:** 2026-08-26
**Session context:** `/mcp__Figma__create_design_system_rules` isteğine cevaben
Figma entegrasyonu için tasarım sistemi kuralları belgesi yazıldı
**Skill:** Genel çalışma pratiği (kesişen ilke 1'in yeni örneği)
**Type:** internal
**Phase/Area:** Belge/skill yazımı öncesi kaynak taraması

**Issue:** `.claude/figma-design-system.md` sıfırdan yazıldı; ama depoda
zaten `docs/tasarim-sistemi.md` (kapsamlı, ölçülmüş, "her madde depodan
ölçüldü" notlu) ve `docs/figma-tasarim-kurallari.md` (Figma'ya özel okuma)
vardı — ikisi de aynı konuyu, benimkinden daha eksiksiz ve güncel olarak
kapsıyordu. Sonradan `/on-brand` becerisini yazarken `docs/` klasörünü
taradığımda bu çakışma ortaya çıktı; kendi yazdığım dosyayı sildim.

**Suggested improvement:** Yeni bir kurallar/rehber belgesi ya da skill
yazmadan önce zorunlu adım: `ls docs/` ve `grep -rli "<konu anahtar
kelimesi>" docs/ .claude/skills/` ile aynı konuda mevcut belge olup
olmadığı taranır. Kesişen ilke 1 (kaynak doğrulama) şu ana kadar "bir
değeri/adı yazmadan önce doğrula" anlamında uygulanıyordu; bu gözlem
kapsamı genişletiyor: "bir **belge** yazmadan önce, aynı konuda başka bir
belge zaten var mı" sorusu da aynı ilkenin parçası.

**Principle:** Kaynak doğrulama yalnızca kod tanımlayıcıları ve çeviri
terimleri için değil, **belge/skill üretimi** için de geçerli — bir konu
hakkında yazmaya başlamadan önce o konunun zaten belgeli olup olmadığı
taranır; aksi hâlde depo aynı gerçeği anlatan, zamanla birbirinden
sapacak birden fazla belgeyle dolar.
