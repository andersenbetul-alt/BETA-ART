---
name: qblogg-kucuk-isletme
description: small-business eklentisinin (knowledge-work-plugins) 15 iş akışını QBLOGG'a uyarlayan katman — bağlayıcı eşlemesi (QuickBooks/HubSpot/PayPal YOK; Stripe salt-okunur, Gmail, Takvim, Drive, Slack, Canva, Notion, Linear, Vercel var), NOK ölçeğine ayarlı eşikler, Norveç vergi/hukuk farkları, marka ve kanıt kuralları. Kullanıcı nakit, fatura, fiyat, marj, müşteri, şikâyet, kampanya, sözleşme, işe alım, haftalık/aylık/üç aylık özet, "Monday brief", "haftalık kontrol", "işler nasıl", "kimi arayayım", "ne satıyor", "vergi", "ay kapanışı" dediğinde ya da small-business eklentisinin herhangi bir becerisi/komutu tetiklendiğinde MUTLAKA önce bu beceriyi oku; eklenti kurulu olmasa da aynı iş akışlarını buradaki eşlemeyle yürüt.
---

# QBLOGG için small-business katmanı

small-business eklentisi ABD'li, çok kişilik, QuickBooks + HubSpot + PayPal
kullanan bir işletme varsayar. QBLOGG öyle değil: Oslo'da tek kurucu + yapay
zekâ, Norveç hukuku, NOK, ödeme kanıtı öncesi aşama. Bu beceri o farkı
kapatır. Eklentinin her becerisi çalışmadan önce **`CLAUDE.md → ## Business
context`** bloğunu ve bu dosyayı okur; çelişkide **CLAUDE.md'nin Değişmez
kuralları** kazanır.

## Değişmeyen üç kural

1. **Sayı uydurma yok.** Bağlayıcıdan gelmeyen her rakam "n/a" yazılır.
   Belgelerdeki rakamlar kanıt sınıfı taşır: **[V]** doğrulanmış, **[H]**
   hipotez, **[D]** dış iddia (`docs/is-modeli.md` §0). Özet ve raporlarda bu
   etiket korunur; [H] bir hedef gibi sunulmaz.
2. **Fiyatlar örnektir** (CLAUDE.md kural 8). €150 / €900 / €2.500 site
   fiyatları ve 4.900 NOK pilot fiyatı test fiyatıdır; müşteriye kesin vaat
   olarak yazılmaz, `config.js → prices` boş olduğu sürece sözlükteki
   örnekler görünür.
3. **Para ve müşteriye dokunan her adım onay ister** (eklentinin kendi kuralı)
   ve **kullanıcıya devredilen her adım tıklama düzeyinde anlatılır**
   (CLAUDE.md "Kullanıcıya iş devrederken").

## Bağlayıcı eşlemesi

Eklentinin beklediği → QBLOGG'da ne var:

| Eklenti bekler | QBLOGG'da | Sonuç |
|---|---|---|
| QuickBooks (muhasebe) | **Yok.** Muhasebe defteri bu depoda değil | Nakit/AR/AP kaynağı = Stripe (salt-okunur anahtar) + kullanıcının yükleyeceği CSV/banka dökümü. `cash-flow-snapshot` CSV yoluna düşer; "QuickBooks bağla" önerme, CSV iste |
| PayPal / Square | **Yok** | Ödeme = Stripe Payment Link (`docs/odeme-sistemi.md`); Vipps pilotta uzmanın kendi hesabı. İade Stripe panelinden, MCP anahtarı yazma izni taşımıyor |
| HubSpot (CRM) | **Yok** | Potansiyel müşteri = Gmail (`hello@qblogg.com`) + Formspree/`mailto` brief formu + `docs/action-pages-teklif.md` görüşme listesi. Boru hattı takibi Notion/Linear'da tutulabilir; `crm-cleanup` HubSpot yerine bu listeye uygulanır |
| Gmail, Google Calendar, Drive | **Var** | Doğrudan kullan |
| Slack | **Var** | Özet paylaşımı yalnız onayla (eklenti kuralı) |
| Canva | **Var** | Görsel üretimde marka kuralları: emoji yok, `#082C54` navy + `#00D8C2` aqua (aqua metinde kullanılmaz), Inter |
| DocuSign | **Yok** | Sözleşme = dosya yükleme veya `kosullar.html`; imza süreci kullanıcıda |
| Vercel, GitHub, Notion, Linear, Figma | **Var** (eklentide yok) | `business-pulse`'a ek kaynak: Vercel `get_web_analytics` (site trafiği), Linear (açık işler), GitHub (dal/PR durumu) |
| Buttondown (bülten) | Site bağlı, MCP yok | Abone sayısı kullanıcıdan/panelden; sayı yoksa "n/a" |

## Komut → QBLOGG uyarlaması

| Eklenti komutu | QBLOGG'da nasıl çalışır |
|---|---|
| `/monday-brief`, `/friday-brief`, `business-pulse` | Kaynaklar: Stripe (ödeme/abonelik), Vercel analytics, Gmail (brief/başvuru/şikâyet), Takvim (görüşmeler), Linear/ROADMAP (açık işler). Bölümler: **Nakit** (Stripe), **Trafik** (Vercel), **Görüşme hattı** (Action Pages 30 gün kapısı: 10 görüşme / 3 ücretli pilot sayacı), **İzleme listesi** (Gmail). Eşikler `esikler.md`. Pazartesi 07:00 SEO/AI görünürlük izlemesi zaten var; brief onunla çakışmaz, onu özetler |
| `/plan-payroll` | Bordro yok (tek kişi). "Nakit sıkıntı" = kurucunun çekişi + sabit giderler (Vercel, Buttondown, Supabase, alan adı). Bunları CSV'den al; "payroll" kelimesi çıktıda geçmez |
| `/month-heads-up`, `/close-month` | Kapanış = Stripe ödemeleri + gider CSV'si; QuickBooks mutabakatı atlanır ve **atlandığı yazılır**. Norveç: MVA dönemi iki aylık (skatteetaten); muhasebeci teslim paketi NOK |
| `/price-check`, `margin-analyzer` | Girdi: `docs/is-modeli.md` §3 fiyat merdiveni, ROADMAP #67/#68 (Tek Makale 2–5 kat düşük, Büyüme negatif marj, etkin saat 1.500–2.250 kr) ve Norveç ajans bandı (10–40 bin kr/ay). Stripe kesintisi %1,5 + 1,80 kr yurt içi. Üç senaryo NOK'ta; hepsi [H] |
| `/tax-prep` | **ABD 1099/quarterly estimate uygulanmaz.** Norveç: MVA (%25, iki aylık beyan), skattemelding, enkeltpersonforetak/AS ayrımı kullanıcıda. Beceri yalnız muhasebeciye gidecek gelir/gider paketini toplar; vergi hesaplamaz, "avukat/muhasebeci teyidi" notu zorunlu |
| `/call-list`, `lead-triage` | HubSpot yerine: Gmail'de son 14 günün brief/başvuru/yanıt konuları + Takvim'deki görüşmeler + `action-pages-teklif.md` hedef listesi. Sıralama: pilot fiyatına en yakın olan, cevapsız kalan, görüşme tarihi yaklaşan. Konuşma notları `docs/action-pages-teklif.md` teklif cümlesini kullanır |
| `/run-campaign`, `content-strategy`, `canva-creator` | Satış verisi yerine trafik/bülten verisi. İçerik üretimi bu deponun kendi becerileriyle: **qblogg-blog-yazisi** (yazı), **qblogg-turev** (yedi türev: LinkedIn serisi, sosyal, bülten…), **qblogg-q-brief** (üye özeti). Kampanya çıktısı HubSpot'a değil Buttondown taslağına + LinkedIn'e gider; gönderim kullanıcıda |
| `/sales-brief` | "Ne satıyor" = hangi yazı trafik/abone getiriyor (Vercel + Buttondown) ve hangi paket görüşmelerde konuşuluyor. Ürün SKU'su yok |
| `/customer-pulse-check`, `/handle-complaint`, `ticket-deflector` | Kaynak Gmail. Yanıt taslağı `hello@qblogg.com` adına, TR/EN/NO müşteri diliyle; iade söz konusuysa Stripe panel adımları tıklama düzeyinde yazılır, MCP'den iade denenmez |
| `/crm-cleanup` | Notion/Linear/Markdown listesindeki bayat görüşmeler (14+ gün hareketsiz) ve eksik alanlar (şirket, teklif edilen paket, sonraki adım) |
| `/review-contract` | Norveç hukuku, yetkili mahkeme ve MVA alanları `kosullar.html`'de `[DOLDURULACAK]`; inceleme bunları önce sorar. AI Act 50(4) editoryal sorumluluk maddesi sitede var; müşteri sözleşmesi onunla çelişmemeli. Hukuki tavsiye değil, avukat teyidi notu |
| `job-post-builder` | `docs/ekip-modeli.md`: ödeme kanıtı (3 ücretli pilot) gelmeden işe alım savunulamaz. Beceri çağrılırsa önce bunu hatırlat; ısrar varsa ilk rol editör/yazar, ikinci satış |
| `/quarterly-review` | Anlatı `docs/is-modeli.md` güven merdiveniyle (B0–B4 eşikleri) kurulur; her sayı [V]/[H]/[D] etiketli. Eşik geçilmediyse bir üst basamak "planlanmadı" yazılır, "gecikti" değil |
| `smb-onboard` | `## Business context` CLAUDE.md'de zaten var → **yeniden mülakat yapma**, "ne değişti" sor, yalnız değişen alanı güncelle. Bağlayıcı bağlamayı kullanıcıya bırak |
| `smb-router` | Türkçe tetikleyiciler: "işler nasıl" → pulse · "kimi arayayım" → call-list · "ne satıyor" → sales-brief · "fiyat/marj" → price-check · "ay kapanışı" → close-month · "vergi" → tax-prep · "şikâyet/kızgın müşteri" → handle-complaint · "kampanya" → run-campaign · "sözleşme" → review-contract · "haftalık kontrol" → monday-brief. Her zaman tek öneri, tek cümle gerekçe, onay sorusu |

## Ölçek

Rakamlar küçüktür ve yüzde bazlı eşikler (MoM %) sıfıra yakın tabanda saçmalar.
`esikler.md` mutlak NOK eşikleri ve pilot sayaçlarını tanımlar; eklentinin
`business-pulse/reference/thresholds.md` yerine onu kullan. Para birimi:
çıktıda **NOK**, site fiyatı EUR ise yanında yaklaşık NOK (kur tarihiyle).

## Çıktı dili ve biçimi

Kullanıcıyla Türkçe. Müşteriye giden taslaklar müşterinin dilinde (TR/EN/NO).
Sayı önce, sıfat sonra; her sayıya karşılaştırma dönemi; kaynak satırı
("Kaynak: Stripe + CSV; Buttondown n/a"). Emoji yalnız eklentinin 🟢🟡🔴 durum
işaretinde; siteye giden hiçbir içerikte emoji yok (kural 4).

## Bu dosyayı ne zaman güncellemeli

Bağlayıcı eklenince (ör. muhasebe yazılımı bağlanırsa QuickBooks satırı),
Action Pages 30 günlük kapı kapanınca (sayaçlar ve eşikler değişir), fiyat
kararı (#67/#68) alınınca. Değişiklik `docs/proje-gunlugu.md`'ye tarihle düşer.
