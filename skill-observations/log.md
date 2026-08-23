# Skill Observation Log

Observations captured during task-oriented work. Each entry identifies a
potential skill improvement or new skill opportunity.

**Status key:** OPEN = not yet actioned | ACTIONED = skill updated/created |
DECLINED = user decided not to pursue

---

## 2026-08-23 — Site profesyonelleştirme SDD oturumu

### Observation 1: Plan spec'leri kaynak doğrulaması olmadan değer anıyor

**Date:** 2026-08-23
**Session context:** SDD planı yazımı (site profesyonelleştirme, 8 görev)
**Skill:** subagent-driven-development (kullanım pratiği) / internal
**Type:** internal
**Phase/Area:** Plan yazımı

**Issue:** Plana hafızadan iki yanlış değer yazıldı: CSS belirteci olarak
`var(--line)` (gerçeği `--border`) ve print gizleme seçicisi `#themeToggle`
(gerçeği `#themeBtn`). Biri inceleme bulgusu oldu, diğerini uygulayıcı
kendisi düzeltti.

**Suggested improvement:** Plan yazarken başka dosyadan anılan her ad
(değişken, id, sınıf, yol) tek grep'le doğrulanmalı; plan şablonuna
"kaynak-doğrulanmış değerler" ön-kontrol maddesi eklenmeli.

**Principle:** Spec'te geçen her tanımlayıcı, yazıldığı anda kaynağından
doğrulanır — inceleme aşamasına bırakılmaz. (Cross-cutting principles #1)

### Observation 2: SDD task-brief betiği başlık biçimine duyarlı

**Date:** 2026-08-23
**Session context:** `scripts/task-brief PLAN 1` çağrısı "task 1 not found" verdi
**Skill:** subagent-driven-development
**Type:** internal
**Phase/Area:** Setup / plan biçimi

**Issue:** Plan başlıkları Türkçe "## Görev N —" yazılmıştı; betik yalnız
"Task N" desenini tanıyor. Başlıklar "## Task N —" yapılarak çözüldü.

**Suggested improvement:** Türkçe projede de SDD planlarının görev
başlıkları "Task N" ile açılmalı (gövde Türkçe kalabilir); bu kural proje
CLAUDE.md'sine değil, plan yazım alışkanlığına not edildi.

**Principle:** Araç zincirine giren belgelerde, aracın ayrıştırdığı
işaretler araç sözleşmesine göre yazılır; insan dili gövdede serbesttir.

### Observation 3: Bu ortamda belge render zinciri kırık, doğrulama alternatifi gerekti

**Date:** 2026-08-23
**Session context:** Konsept belgesinin Word çıktısının görsel doğrulaması
**Skill:** docx (sistem becerisi — gerekirse docx-extras'a)
**Type:** internal
**Phase/Area:** Verify the output

**Issue:** `pandoc` ve `pdftoppm` yok; `soffice` her dosyada (düz metin
dahil) "source file could not be loaded" veriyor — LibreOffice bu konteynerde
çalışmıyor. Skill'in önerdiği doğrulama yolu (docx→pdf→jpeg→bak) kapalı.

**Suggested improvement:** Bu ortam için doğrulama alternatifi: zipfile +
ElementTree ile document.xml geçerliliği ve anahtar metin varlığı kontrolü;
görsel doğrulama gerekiyorsa HTML/SVG üzerinden Playwright ekran görüntüsü.

**Principle:** Bir skill'in doğrulama adımı ortamda çalışmıyorsa doğrulama
atlanmaz; aynı garantiyi veren en yakın alternatif kurulur ve raporda
"neyin doğrulanamadığı" açıkça söylenir.

### Observation 4: Scratchpad'e stdlib adıyla dosya bırakmak sonraki işleri kırdı

**Date:** 2026-08-23
**Session context:** `python3 -c "import xml.etree..."` çağrısı patladı
**Skill:** Genel çalışma pratiği
**Type:** internal
**Phase/Area:** Scratchpad hijyeni

**Issue:** Önceki oturumdan kalan `scratchpad/copy.py`, Python stdlib
`copy` modülünü gölgeleyip `xml.etree.ElementTree` importunu bile kırdı.
Hata mesajı kökten alakasız görünüyordu; teşhis zaman aldı.

**Suggested improvement:** Scratch betiklerine stdlib modül adı verilmez
(copy, json, types...); cwd=scratchpad ile python çalıştırırken bu risk
hatırlanmalı.

**Principle:** Çalışma dizinindeki dosya adları import uzayının parçasıdır;
geçici dosya bile ad uzayına saygılı seçilir.

### Observation 5: Stop-hook, alt-ajanın bitmemiş işini commit'lemeye zorluyor

**Date:** 2026-08-23
**Session context:** SDD sırasında stop-hook "uncommitted changes" uyarıları
**Skill:** subagent-driven-development
**Type:** internal
**Phase/Area:** Koordinatör-uygulayıcı eşzamanlılığı

**Issue:** Uygulayıcı alt-ajan dosyaları düzenlerken oturumun stop-hook'u
"commit ve push yap" diye bastırdı. Yarıda commit, ajanın işini bölerdi.
Çözüm: `git status` ile fark sahipliği ayrıştırıldı; yalnız koordinatörün
kendi dosyaları açıkça `git add <dosya>` ile commit'lendi, ajan farkına
dokunulmadı.

**Suggested improvement:** SDD çalışırken stop-hook uyarısına verilecek
standart yanıt: sahiplik kontrolü → kendi dosyalarını isimle commit'le →
ajan farkını bekle. `git add -A` bu kipte yasak.

**Principle:** Paylaşılan çalışma ağacında commit, dosya sahipliği
doğrulanmadan atılmaz; otomasyon baskısı bunu değiştirmez.
