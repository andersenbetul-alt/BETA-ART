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
