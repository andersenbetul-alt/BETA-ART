# Skill Observation Log

Observations captured during task-oriented work. Each entry identifies a
potential skill improvement or new skill opportunity.

**Status key:** OPEN = not yet actioned | ACTIONED = skill updated/created |
DECLINED = user decided not to pursue

---

## 2026-08-23 — Site profesyonelleştirme SDD oturumu

### Observation 1: Plan spec'leri kaynak doğrulaması olmadan değer anıyor

**Status:** ACTIONED — qblogg-operasyon becerisine işlendi (inceleme 24.08.2026)
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

**Status:** ACTIONED — qblogg-operasyon becerisine işlendi (inceleme 24.08.2026)
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

**Status:** ACTIONED — qblogg-operasyon becerisine işlendi (inceleme 24.08.2026)
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

**Status:** ACTIONED — qblogg-operasyon becerisine işlendi (inceleme 24.08.2026)
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

**Status:** ACTIONED — qblogg-operasyon becerisine işlendi (inceleme 24.08.2026)
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

## 2026-08-24 — Üye sistemi + Vercel olayı oturumu

### Observation 6: Küçük/büyük harf duyarlı grep, "dosya boş" yanılgısı üretti

**Status:** ACTIONED — qblogg-operasyon becerisine işlendi (inceleme 24.08.2026)
**Date:** 2026-08-24
**Session context:** engine/schema-billing.sql'i doğrulama sırasında
**Skill:** Genel çalışma pratiği (kesişen ilke 1'in yeni örneği)
**Type:** internal
**Phase/Area:** Kaynak doğrulama

**Issue:** `grep "create table"` sıfır sonuç verdi; dosya `CREATE TABLE`
(büyük harf) kullanıyordu. Bir an "şema yok" sonucuna gidilebilirdi;
ls + head ile ikinci bakış gerçeği gösterdi.

**Suggested improvement:** SQL/yapılandırma dosyalarında grep her zaman
`-i` ile yapılmalı; "hiç sonuç yok" bulgusu tek başına kanıt sayılmadan
önce dosyanın varlığı/başı ikinci bir yöntemle doğrulanmalı.

**Principle:** Sıfır sonuçlu arama, iddianın yokluğunun kanıtı değildir —
önce arama aracının kendisi doğrulanır.

### Observation 7: Tek dosyalık dağıtım deseni, silinen projeyi dakikalar içinde geri getirdi

**Status:** ACTIONED — qblogg-operasyon becerisine işlendi (inceleme 24.08.2026)
**Date:** 2026-08-24
**Session context:** qblogg Vercel projesi panelde yanlışlıkla silinmiş bulundu
**Skill:** deploy-to-vercel kullanım pratiği / proje CLAUDE.md
**Type:** internal
**Phase/Area:** Dağıtım dayanıklılığı

**Issue:** Üretim projesi silinince site yayından düştü; dağıtımın tek
girdisi vercel.json olduğu ve içerik public git'ten klonlandığı için aynı
adla yeniden dağıtım ~4 saniyede siteyi geri getirdi. Tek kayıp: eski
*.vercel.app takma adları (dış bağlantılar öldü) ve yeniden açılan
Deployment Protection'ın tekrar kapatılması gerekti.

**Suggested improvement:** Kurtarma sonrası kontrol listesi kalıcılaştı:
(1) yeniden dağıt, (2) protection'ı kapat, (3) canlı içerik doğrula,
(4) CLAUDE.md/günlükteki adresleri güncelle. Bu dizi CLAUDE.md dağıtım
notunda artık kayıtlı.

**Principle:** Dağıtım durumu (state) değil tarif (recipe) olarak
saklanırsa, altyapı kaybı felaket değil yeniden çalıştırma olur.

### Observation 8: Klon-tabanlı dağıtım, push edilmemiş dosyayı göremez

**Status:** ACTIONED — qblogg-operasyon becerisine işlendi (inceleme 24.08.2026)
**Date:** 2026-08-24
**Session context:** qblogg-uye ilk dağıtımı ENOENT ile düştü
**Skill:** deploy-to-vercel kullanım pratiği
**Type:** internal
**Phase/Area:** Dağıtım öncesi kontrol

**Issue:** buildCommand depodan klonlar; vendor'lanan lib çalışma ağacında
duruyordu ama push edilmemişti. Dağıtım "cp: cannot stat" ile düştü.

**Suggested improvement:** Tarif-tabanlı (klonlayan) her dağıtımdan önce
zorunlu kontrol: `git status --short` boş VE dal push'lu. Bu iki komut
dağıtım komutunun önüne alışkanlık olarak eklenmeli.

**Principle:** Dağıtım tarifi depoyu okuyorsa, "bende çalışıyor"un birimi
çalışma ağacı değil push edilmiş commit'tir.


## 2026-08-26 — COBBANI intake + Figma design-system-rules oturumu

### Observation 9: AskUserQuestion, serbest metin gerektiren iş fikri intake'inde bilgi üretmedi

**Status:** OPEN
**Date:** 2026-08-26
**Session context:** Kullanıcı "COBBANI" adlı belirsiz bir görev/iş fikri
gönderdi; içerik yoktu (yalnızca isim, sonra boş placeholder'lı bir brief
şablonu). AskUserQuestion ile "hangi işi kastediyorsunuz?" diye çoktan
seçmeli netleştirme soruldu; kullanıcı "[No preference]" seçti — hiçbir
bilgi gelmedi, bir tur boşa gitti.
**Skill:** Genel çalışma pratiği (kesişen ilke adayı)
**Type:** internal
**Phase/Area:** Belirsiz görev netleştirme

**Issue:** AskUserQuestion, sabit seçenekler arasından seçim gerektiren
kararlar için tasarlanmış (mimari tercih, evet/hayır vb.). Burada ihtiyaç
duyulan şey serbest metin — bir iş fikrinin ne olduğu, hangi pazara
hitap ettiği gibi anlatısal bilgiydi. Seçenek listesi sunmak kullanıcıyı
"hiçbiri" demeye itti ve asıl bilgiyi vermedi; oysa doğrudan düz metinle
"şunu şunu anlatır mısınız?" diye sormak muhtemelen aynı turda cevap
alırdı.

**Suggested improvement:** Netleştirme ihtiyacı **açık uçlu/anlatısal**
bilgiyse (bir fikrin ne olduğu, bir işin kapsamı, serbest bir açıklama),
AskUserQuestion yerine doğrudan düz metinle soru sorulmalı.
AskUserQuestion, gerçekten ayrık ve sınırlı seçenekler arasında karar
gerektiğinde (A/B mimarisi, evet/hayır, sıralı öncelik) kullanılmalı.
Bu ayrım qblogg-operasyon'a veya genel bir "belirsiz görev netleştirme"
kesişen ilkesine eklenebilir.

**Principle:** Soru biçimi, istenen cevabın biçimine uymalı — kapalı uçlu
bir araç (seçime zorlayan UI) açık uçlu bilgi istemek için kullanılırsa,
kullanıcıyı "hiçbiri" demeye iter ve turu bilgisiz tüketir.
