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

## 2026-08-26 — NAVIAR CARE + Figma design-system-rules oturumu

### Observation 9: Yeni sayfa eklendiğinde tekrarlanan-iskelet belgeleri senkron kalmıyor

**Status:** OPEN
**Date:** 2026-08-26
**Session context:** Figma design-system-rules komutu için docs/tasarim-sistemi.md
yeniden ölçülürken bulundu
**Skill:** qblogg-operasyon
**Type:** internal
**Phase/Area:** Yeni sayfa/iskelet bakımı

**Issue:** `kalite.html` ve `ornek.html`, 22.08.2026 ölçümünden sonra eklenmiş
ve ikisi de altı diğer sayfayla aynı `.site-header`/altbilgi iskeletini
taşıyor — ama CLAUDE.md'nin "sayfa iskeleti altı dosyada tekrar eder" listesi
ve `docs/tasarim-sistemi.md`'nin sayı/dosya listesi ikisini de atlamış. Aradan
dört gün geçmiş, `npm run check` yeşil kalmış (çiftlenen id/script yakalıyor,
eksik menü bağlantısını veya belge listesini yakalamıyor — bu zaten CLAUDE.md'de
bilinen bir sınır). İki ayrı belge aynı sebepten aynı şekilde eskimiş.

**Suggested improvement:** qblogg-operasyon'a "yeni sayfa ekleme" maddesi
eklensin: iskelet taşıyan bir HTML dosyası eklendiğinde, aynı commit'te
CLAUDE.md'nin "Sayfa iskeleti ... dosyada tekrar eder" cümlesi ve
`docs/tasarim-sistemi.md` §2/§7'deki sayı/liste birlikte güncellenir. İkisi
tek bir grep ile doğrulanabilir: `ls *.html | wc -l` ve `grep -c site-header
*.html` sonucu belgelerdeki sayıyla karşılaştırılır.

**Principle:** Kod büyüdükçe onu tarif eden belge sayısı da büyürse (burada
ikisi), her biri ayrı ayrı eskiyebilir — "kaynaktan doğrula" ilkesi (kesişen
ilke #1) yalnız yazarken değil, var olan bir belgeyi yeniden kullanırken de
uygulanmalı; bir belgenin "resmi kılavuz" olması onu güncel yapmaz.

### Observation 10: Kullanıcı, yapılandırılmış bir soruyu yanıtladıktan hemen sonra serbest metinle çelişen bilgi verdi

**Status:** OPEN
**Date:** 2026-08-26
**Session context:** NAVIAR CARE hizmet tanımı toplanırken
**Skill:** Genel çalışma pratiği (yeni ilke adayı — kesişen olabilir)
**Type:** internal
**Phase/Area:** Belirsiz/çelişkili girdi toplama

**Issue:** AskUserQuestion ile "sağlık/bakım dışı, kurumsal danışmanlık"
seçildi; aynı tur içinde art arda gelen serbest metin mesajları ("yaşlılar,
aileler ve bakım ihtiyacı", "güvenli yardımcı ve bakım koordinasyonu") bunun
tam tersini söyledi. Sessizce biri seçilip diğeri atlanabilirdi; onun yerine
çelişki açıkça kullanıcıya bildirildi ve en spesifik/en son gelen bilgi esas
alındı, gerekçesiyle birlikte belgeye de not düşüldü.

**Suggested improvement:** Yapılandırılmış soru (AskUserQuestion/seçenek)
cevabı ile onu hemen izleyen serbest metin çelişirse: (1) çelişkiyi sessizce
çözme, (2) hangisinin esas alındığını ve neden olduğunu hem kullanıcıya hem
üretilen belgeye yaz, (3) daha spesifik ve daha sonra gelen bilgiyi tercih et
ama bunu "kesin" değil "şimdilik esas alınan" olarak işaretle.

**Principle:** Hızlı ve parçalı gelen kullanıcı girdisinde (özellikle çoklu
mid-turn mesaj), en son mesaj otomatik olarak "düzeltme" sayılmamalı —
çelişki bir gözlem olarak kayda geçmeli, çünkü aksi hâlde hangi bilginin
esas alındığı belgenin okuyucusuna kaybolur.

## 2026-08-26 (devam) — NAVIAR Care pilot uygulaması oturumu

### Observation 11: xlsx skill'in recalc.py'si de bu ortamda LibreOffice'e bağımlı olduğu için çalışmıyor

**Status:** OPEN
**Date:** 2026-08-26
**Session context:** NAVIAR Care birim ekonomisi ve haftalık P&L
xlsx dosyaları üretilirken
**Skill:** xlsx (sistem becerisi — gerekirse xlsx-extras'a)
**Type:** internal
**Phase/Area:** Doğrulama

**Issue:** `scripts/recalc.py`, 165 saniyeye kadar denenen timeout'larda
bile "LibreOffice timed out" hatası verdi — gözlem 3'te docx için tespit
edilen "LibreOffice bu konteynerde çalışmıyor" bulgusunun xlsx/openpyxl
iş akışı için de geçerli olduğunu doğruluyor (aynı kök neden, farklı
skill). Formüller bu yüzden gerçek bir hesap makinesiyle (LibreOffice)
değil, formüllerle birebir aynı mantığı taşıyan bağımsız bir Python
hesabıyla doğrulandı — ve bu doğrulama bir yerde gerçek bir hata da
yakaladı (saatlik maliyet sabitini yanlış türetmiştim, 214 kr yerine
321,2 kr olmalıydı).

**Suggested improvement:** xlsx skill'ine (ya da bir xlsx-extras
tamamlayıcısına) bu ortam için not düşülsün: recalc.py çalışmıyorsa,
formülle aynı mantığı taşıyan bağımsız bir Python hesabıyla çapraz
kontrol yapılmalı ve bu doğrulamanın "gerçek Excel/LibreOffice yeniden
hesaplaması değil, mantık doğrulaması" olduğu teslim edilen dosyanın
notlarında açıkça belirtilmeli.

**Principle:** Bir doğrulama aracı (recalc.py, pandoc, soffice...) ortamda
çalışmıyorsa doğrulama atlanmaz — en yakın alternatif kurulur ve neyin
doğrulanamadığı dürüstçe söylenir (gözlem 3'ün ilkesinin ikinci, bağımsız
örneği — artık bir "kalıp" sayılabilir: bu ortamda LibreOffice'e dayanan
HİÇBİR araç güvenilir çalışmıyor, yalnız docx değil).

