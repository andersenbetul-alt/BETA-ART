# NAVIAR — hukuki şablonlar (referans, henüz sözleşme değil)

31.08.2026'da kullanıcı tarafından yüklenen iki `.docx` şablonu. İçerikleri bu
oturumda doğrudan doğrulandı (docx'i unzip edip `word/document.xml`'den metin
çıkararak — pandoc/soffice bu ortamda çalışmıyor, bkz. `NAVIAR-LOGO-KARAR.md`
"asıl M1 kaynağı" notu, aynı yöntem). Aşağıdaki özet kullanıcının verdiği
açıklamayla karşılaştırıldı ve tutarlı bulundu.

## `oppdragsavtale-mal.docx`

Sykefraværsoppfølgingi için genel bir konsültan/işveren hizmet sözleşmesi
şablonu. Başlığında açıkça **"Dette er et utkast/mal — anbefalt gjennomgått av
advokat før bruk"** yazıyor — nihai sözleşme değil.

Kapsadığı hizmet kalemleri (Vedlegg 1'e referans veriyor, fiyat bu dosyada
yok): oppfølgingsplan hazırlığı, dialogmøte 1 hazırlığı/fasilitasyonu, NAV
raporlama şablonu desteği (**"Kunden sender selv, med mindre formell fullmakt
er etablert"** — NAVIAR doğrudan NAV'a göndermez), lederlik/HR eğitimi,
sürekli danışmanlık, yıllık süreç gözden geçirme. Dayanak: arbeidsmiljøloven
§4-6 ve folketrygdloven.

## `dpa-mal.docx`

GDPR art. 28(3) uyarınca veri işleme sözleşmesi (Databehandleravtale) şablonu.
Aynı şekilde **"utkast/mal... særlig siden det behandler helseopplysninger
(spesiell kategori, GDPR art. 9)"** uyarısı taşıyor.

Rol tanımı: **Kunde = dataansvarlig (controller)**, **Konsulent = databehandler
(processor)** — Konsulent yalnızca Kunden'in belgelenmiş talimatıyla işler.
İşlenen veri türleri: ad, pozisyon, fravær/sykmelding bilgisi, oppfølgingsplan
ve toplantı notları — "helseopplysninger (özel kategori)" olarak işaretli.

## Bu depodaki karşılığı

Bu iki şablon **is-modeli.md §7 (hukuki risk sınırları)** ve **§9-12
(Lederstøtte/Tilrettelegging/Arbeidsnærvær kapsamı)** ile aynı sınırı çiziyor:
NAVIAR dataansvarlig değil, NAV'a doğrudan rapor göndermiyor, teşhis/tedavi
yapmıyor. Web sitesindeki güven bölümü (`web/index.html` §Tillit) bu şablonun
prensipleriyle çelişmiyor.

**Ne yapılmadı:** Bu şablonlar nihai sözleşme olarak "kilitlenmedi" — ikisi de
kendi içinde avukat incelemesi öneriyor, `[KLAMMER]` alanları boş, ve NAVIAR'ın
gerçek org.nr./adres/kontak bilgisi henüz girilmedi. Web sitesi veya pazarlama
metnine bu şablonlardan doğrudan hukuki taahhüt aktarılmadı.

## `oppfolgingsplan-mal.docx`

"Oppfølgingsplan for sykmeldt ansatt" ön-hazırlık şablonu. Kendi içinde açıkça
belirtiyor: **"Det offisielle verktøyet er NAVs digitale oppfølgingsplan i
Altinn («Dine sykmeldte»)"** — bu sadece bir hazırlık aracı, resmi form değil.
Yasal dayanak: arbeidsmiljøloven §4-6. İçerik: 4/7/8/26 haftalık frist
zinciri, "diagnose skal ikke registreres" ilkesi, tiltak/ansvarlı/tarih
tablosu, tilbakeføring planı, BHT/NAV/lege bistand kutucukları.

## `tjeneste-prisoversikt-mal.docx`

Gerçek fiyat hipotezleri içeren tek dosya — ama **"Prisene er veiledende...
illustrative oppstartsestimater"** ibaresiyle açıkça örnek/başlangıç fiyatı
olarak işaretli, gerçek müşteri testinden gelmiyor.

| Paket | İçerik | Fiyat |
|---|---|---|
| A — "Frisk sjekk" | Tek vaka, sykmelding→oppfølgingsplan→dialogmøte 1→uke 8 | kr 6.000–12.000/vaka |
| B — "Ledelsesakademi" | Yarım günlük kurs, 10 katılımcıya kadar | kr 12.000–20.000/kurs |
| C — "Fast følgesvenn" | Yıllık abonelik, e-posta/telefon danışmanlığı | kr 15.000–35.000/yıl + kr 300–500/çalışan |

Ek: saatlik ücret kr 1.100–1.500 (uzman yönlendirmesi kr 1.500+), 14 gün
vade, <24 saat iptalde %50 ücret. Belge kendi **"markedsbenchmark"**'ını da
veriyor: HMS/BHT danışmanlığı tipik olarak **kr 1.100–1.700/saat**
(kaynak belgede: tuka.no, Dr.Dropin Bedrift — bu iki kaynak bu oturumda ayrıca
doğrulanmadı, yalnızca şablonun kendi atfı olarak aktarılıyor).

**Bu depodaki karşılığı:** `is-modeli.md`'de daha önce zaten "6-12 bin / 12-20
bin / 15-35 bin NOK" aralığı hipotez olarak kayıtlıydı (kaynağı bu şablondu,
ama o zaman şablonun kendisi elde değildi). Şimdi doğrulandı ve saatlik ücret
+ benchmark eklendi. **Hâlâ değişmeyen:** bu fiyatlar gerçek bir müşteriyle
test edilmedi (`autoprompt-degerlendirme.md` §19'daki açık iş). Paket adları
("Frisk sjekk" vb.) web sitesine taşınmıyor — CLAUDE.md'de zaten not edilen
karar (bkz. `is-modeli.md` §14 mimarisi: Lederstøtte/Tilrettelegging/
Arbeidsnærvær/Sprint).
