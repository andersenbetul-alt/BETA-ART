# Skill Observation Log

Observations captured during task-oriented work. Each entry identifies a
potential skill improvement or new skill opportunity.

**Status key:** OPEN = not yet actioned | ACTIONED = skill updated/created |
DECLINED = user decided not to pursue

---

## 2026-08-26 — run-qblogg doğrulama + Beta Art konsept oturumu

### Observation 9: run-qblogg becerisinin sorun giderme tavsiyesi, aracın kendisini çökertiyordu

**Status:** ACTIONED — run-qblogg SKILL.md'ye işlendi (bu oturum, commit `803ae6c`)
**Date:** 2026-08-26
**Session context:** `/run-skill-generator` ile mevcut run-qblogg becerisinin doğrulanması (yeniden yazmak yerine gerçekten çalıştırıp doğrulama)
**Skill:** run-qblogg
**Type:** internal
**Phase/Area:** Sorun giderme / ortam sınırlamaları

**Issue:** Beceriyi doğrularken sunucuyu durdurmak için `pkill -f "http.server 8000"` denendi — bu, komutta başka hiçbir şey olmasa bile o Bash araç çağrısının **tamamını** çıkış kodu 144 ve sıfır çıktıyla öldürdü (6 denemenin 4'ünde tekrarlandı, tek başına `pkill -f "..."; echo done` bile "done"u hiç yazdırmadı). Daha kötüsü: becerinin **kendi Sorun giderme tablosu tam olarak bu tehlikeli komutu öneriyordu** ("port tutulduysa `pkill -f http.server`"). `kill <pid>` ve `fuser -k 8000/tcp` ikisi de sorunsuz doğrulandı.

**Suggested improvement:** SKILL.md'nin Gotchas ve Sorun giderme bölümlerine
eklendi: sunucuyu asla `pkill -f` ile durdurma; `fuser -k <port>/tcp` veya
`kill <pid>` kullan. driver.mjs zaten kendi başlattığı sunucuyu Node içinden
kapatıyor, manuel müdahaleye gerek yok.

**Principle:** Bu sandbox'ta, arka planda başlatılmış bir süreci desen
eşleşmeli (`pkill -f`) öldürmek, o süreci başlatan/izleyen Bash araç
çağrısının tamamını (ilgisiz komutlar dahil) öldürebiliyor — ama tam pid
hedefli `kill` veya `fuser -k` güvenli. Bu, yalnız run-qblogg'a özgü değil:
bu ortamda arka plan sunucusu yöneten HERHANGİ bir beceri/betik aynı tuzağa
düşer. Genel kural: geliştirme sunucusu durdurmak gerektiğinde önce pid'i
öğren (`fuser <port>/tcp` salt-okunur sorgu, sonra `-k` ekle, veya `kill
<pid>`), asla `pkill -f <desen>` yazma.

### Observation 10 (kesişen ilke adayı): Kaynağından doğru yazılmış bir referans belgesi bile zamanla kayar

**Status:** OPEN — kesişen ilke olarak eklenmesi kullanıcı onayına sunuluyor
**Date:** 2026-08-26
**Session context:** `/mcp__Figma__create_design_system_rules` için `docs/tasarim-sistemi.md` ve `docs/figma-tasarim-kurallari.md` yeniden ölçüldü
**Skill:** All skills (kesişen ilke 1'in bir uzantısı, yeni bir örneği değil)
**Type:** internal
**Phase/Area:** Referans belge bakımı

**Issue:** İki belge de 22.08.2026'da depodan doğru ölçülerek yazılmıştı
(kesişen ilke 1'e tam uyum) — ama yalnızca 3-4 gün sonra beş rakım kaymıştı:
i18n anahtar sayısı (209→233), ikon kaydı (11→15, paylaşım glifleri
eklenmiş), tekrar eden sayfa iskeleti sayısı (6→8, `kalite.html` ve
`ornek.html` sonradan eklenmiş ama belgeye işlenmemiş), main.css satır
sayısı (553→629), medya sorgusu sayısı (5→6). Kesişen ilke 1 "yazarken
doğrula" diyor ama bu belgeler yazıldığı anda doğruydu; sorun **yazma
sonrası aşınma** — kodda yapılan sıradan değişiklikler, o değişikliği yapan
kişi/ajan farkında olmadan bir referans belgeyi bayatlatıyor.

**Suggested improvement:** Kesişen ilke 1'e şu ek cümle önerilir: "Depodan
tam sayı/liste ölçüsü içeren referans belgeleri (tasarım sistemi, mimari
envanteri vb.) her kullanıldıklarında yeniden ölçülür — belgenin kendi
yazıldığı tarih, güncelliğinin kanıtı değildir." Pratikte: böyle bir belge
Figma/tasarım/mimari sorusu için okunduğunda, alıntılanacak sayılar
kullanılmadan önce tek komutla (`wc -l`, `grep -c`, küçük bir node betiği)
yeniden ölçülür; sapma varsa hem cevap güncel sayıyı kullanır hem belge
küçük bir düzeltmeyle tazelenir.

**Principle:** Kaynak doğrulaması tek seferlik bir yazma-anı disiplini
değil, her okuma-ve-alıntılama anında tekrarlanan bir kontroldür — özellikle
canlı geliştirilen bir depoda referans belgelerinin "son ölçüm tarihi"
etiketi taşıdığı durumlarda.
