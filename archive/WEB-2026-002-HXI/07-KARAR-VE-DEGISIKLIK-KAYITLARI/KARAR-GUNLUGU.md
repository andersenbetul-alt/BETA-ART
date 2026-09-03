# WEB-2026-002 HXI — Karar Günlüğü

## DEC-HXI-001: Saf HTML/CSS/JS teknoloji seçimi

**Tarih:** 2026-08 (kesin tarih bilinmiyor)  
**Durum:** Kesinleşti  
**Karar:** QBLOGG ile aynı strateji — derleme adımı yok, framework yok, bağımlılık yok.

**Gerekçe:**  
Hız, güvenilirlik ve bakım kolaylığı. Müzisyen sitesi için React/Next.js overkill; statik site her sunucuya olduğu gibi yüklenir.

**Alternatifler değerlendirilen:**  
- `hxi-nordic-phonk.html` — React + Space Mono prototipi (296KB, ağır)
- `hxi-arktisk.html` — React + Space Grotesk prototipi (217KB)

Her ikisi `experiments/` klasöründe korunmuştur.

---

## DEC-HXI-002: Tek tema (karanlık) — Light mode yok

**Tarih:** 2026-08  
**Durum:** Kesinleşti  
**Karar:** Site yalnızca karanlık tema ile sunuluyor; `prefers-color-scheme` toggle yok.

**Gerekçe:**  
Karanlık atmosfer HXI marka kimliğinin ayrılmaz parçası (Nordic Cold, Deep Black `#080808`). Açık temaya geçiş marka bütünlüğünü bozar.

---

## DEC-HXI-003: Tek dil (İngilizce)

**Tarih:** 2026-08  
**Durum:** Kesinleşti  
**Karar:** i18n altyapısı yok; site yalnızca İngilizce.

**Gerekçe:**  
Hedef kitle uluslararası: fan, creator, supervisor, medya. Norveççe eklemek kapsam küçültür. İngilizce tüm kitlelere ulaşır.

**QBLOGG farkı:** QBLOGG 10 dilli — farklı iş ihtiyacı; bu bilinçli bir ayrışmadır.

---

## DEC-HXI-004: Dört dönüşüm modeli — her kitle kendi sayfasına

**Tarih:** 2026-08  
**Durum:** Kesinleşti  
**Karar:** Fan → `#listen`, Creator → `use.html`, Supervisor → `sync.html`, Endüstri → `contact.html`

**Gerekçe:**  
Jenerik müzisyen siteleri herkesi ana sayfaya yığar. HXI'da her kitlenin ihtiyacı ve önceliği farklı; ayrı sayfa = doğrudan dönüşüm.

---

## DEC-HXI-005: Direct contact, no intermediaries (Sync)

**Tarih:** 2026-08  
**Durum:** Kesinleşti  
**Karar:** Sync/Licensing sayfası doğrudan iletişimi öne çıkarır — aracı ajans veya platform değil.

**Gerekçe:**  
Küçük sanatçı için aracı komisyon kaybı anlamlı. "Direct, no intermediaries" hem maliyet hem kontrol avantajı.

---

## DEC-HXI-006: PROOF OVER HYPE — marka ilkesi

**Tarih:** 2026-08  
**Durum:** Kesinleşti  
**Karar:** Sitede hiçbir doğrulanmamış iddiayla başvurulmaz (dinleyici sayısı, endüstri sıralaması vb.).

**Gerekçe:**  
İçerik stüdyo müşterisi çeken QBLOGG'da rakam verilebilir; müzisyen sitesinde kanıtlanmamış rakam güven zedeler. WORTH NOTHING/NCS kaydı gibi kanıtlanmış çalışmalar öne çıkar.
