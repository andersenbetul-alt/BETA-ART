# Proje envanteri — `andersenbetul-alt` hesabı

**Tarih:** 30.08.2026. **Sebep:** kullanıcı talimatı "BUTUN PROJELERI BURAYA
TASI" ve netleştirme sorusuna verilen cevap "HEPSI" (hem kapsam hem yöntem
sorusuna). Bu belge o talimatın ilk adımı: **körlemesine birleştirmeden önce
gerçekte ne var, gerçekte ne çakışıyor, gerçekte ne mümkün** sorularına
doğrulanmış cevap.

Bu bir öneri değil, bir ölçüm: her repo klonlandı, `HEAD` doğrulandı, dosyalar
gerçekten okundu. Uydurma yok.

## Özet tablo

| Repo | HEAD | Durum | Ne |
|---|---|---|---|
| `BETA-ART` | (bu repo) | **Aktif — QBLOGG** | Çalışan ürün, bu dosyanın bulunduğu yer |
| `beta-art-archive` | `c63e64c` | **Aktif — Beta Art** | Tamamen ayrı bir marka/iş, kendi "tek site" doktrini var |
| `QBLOGG` | `37cd174` | **Boş** | Tek commit "Delete README.md"; içerik yok |
| `qb` | — | **Tamamen boş** | Hiç commit yok |
| `eve-slack-agent` | `70bce1c` | **Değiştirilmemiş şablon** | Vercel "eve" Slack-agent starter'ı, olduğu gibi |
| `eve-chat-template` | `a765ce0` | **Değiştirilmemiş şablon** | Vercel "eve" Next.js chat starter'ı, tek commit "Initial commit" |

## Detay

### 1. `BETA-ART` — bu repo, QBLOGG

Bildiğiniz site. Saf HTML/CSS/JS, derleme yok, Vercel'de yayında
(`qblogg.vercel.app`). Bu envanterin yazıldığı yer. Değişiklik gerekmiyor.

### 2. `beta-art-archive` — ayrı bir marka, ayrı bir iş

`README.md` ve `BETA_ART_MASTER.md` okundu. Bu **QBLOGG değil**: "Beta Art"
adında, insan yapımı fotoğrafın doğrulanmış arşivini satan tamamen farklı bir
iş — fotoğraf lisanslama + (Faz 1 önceliği) Norveç'te inşaat projesi
dokümantasyon arşivleme. Vite + React + TypeScript + Supabase + shadcn/ui
(Lovable ile üretilmiş) — QBLOGG'un sıfır-bağımlılık mimarisiyle **teknik
olarak uyumsuz**.

**Doğrudan çelişki:** `BETA_ART_MASTER.md`'nin kendisi, madde 1 ve 9'da açıkça
şunu yazıyor:

> "Do not create another Beta Art website when a new idea appears."
> "No second production website."
> Ana kanal: `Airo/Drive/Lovable/… → beta-art-archive/main → Vercel → beta-art.com`

Yani bu reponun **kendi yönetişim belgesi**, onu başka bir kod tabanına
(BETA-ART dahil) taşımayı ya da parçalamayı açıkça yasaklıyor. "HEPSI"
talimatını harfiyen uygulayıp bu repoyu BETA-ART'a taşımak, kullanıcının
25.08.2026'da onayladığı kendi Beta Art kararını bozar.

**Öneri:** `beta-art-archive` kendi reposunda, kendi Vercel projesinde
kalmalı. QBLOGG ile tek ortak nokta: ikisi de aynı GitHub hesabında ve ikisi
de aynı "uydurma yasak" kültürünü ayrı ayrı benimsemiş. Birleştirme burada
"tek repo" değil, en fazla "iki ayrı, birbirine bağlantı veren site" anlamına
gelebilir — o bile ayrı bir karar gerektirir.

### 3. `QBLOGG` — boş kabuk

Tek commit: `Delete README.md`. `.github/` klasörü var ama içi boş (workflow
dosyası yok). Hiçbir gerçek içerik yok. Muhtemelen QBLOGG için ayrılmış ama
hiç kullanılmamış bir isim rezervasyonu. **Taşınacak bir şey yok** — bu repo
şu an hiçbir iş yapmıyor.

### 4. `qb` — tamamen boş

Hiç commit yok (`git clone` "empty repository" uyarısı verdi). **Taşınacak
bir şey yok.**

### 5. `eve-slack-agent` — değiştirilmemiş Vercel şablonu

`README.md` "This is a Slack agent template for eve" diyor; deploy butonu
`github.com/vercel/eve-examples`'a işaret ediyor. `package.json` adı
`eve-slack-agent-template`. İçerik: `agent/agent.ts`, `agent/instructions.md`,
bir örnek araç (`get_weather.ts`). **Hiç özelleştirme yapılmamış** — Vercel'in
"eve" framework'ünün stok Slack-agent kalıbı. QBLOGG'un konusuyla (blog/içerik
stüdyosu) hiçbir ilgisi yok.

### 6. `eve-chat-template` — değiştirilmemiş Vercel şablonu

Tek commit: `Initial commit`. Next.js + shadcn/ui + drizzle + auth akışlarıyla
tam bir sohbet arayüzü iskeleti — yine Vercel'in "eve" framework ailesinden,
stok hâliyle. QBLOGG'un mimarisiyle (framework yok, derleme yok) doğrudan
çelişiyor; içine hiç özel iş mantığı girmemiş.

## "HEPSI" talimatıyla gerçek durum arasındaki gerilim

1. **`beta-art-archive`** — taşınamaz değil, ama taşımak kullanıcının kendi
   onayladığı bir başka belgeyi (tek Beta Art sitesi kararı) çiğner. Bu bir
   teknik engel değil, **iki talimatın çakışması**: "her şeyi buraya taşı" ile
   "Beta Art'ı asla ikinci bir siteye bölme" aynı anda doğru olamaz.
2. **`QBLOGG`, `qb`** — taşınacak içerik yok; bu ikisi için "taşıma" anlamsız,
   isterseniz silinebilir ya da öylece bırakılabilir.
3. **`eve-slack-agent`, `eve-chat-template`** — stok şablon; taşınacak özel iş
   yok. QBLOGG'a katkısı yalnızca ileride bir Slack/chat entegrasyonu
   düşünülürse referans olabilir, bugün için işlevsiz.
4. **NAVIAR Care** — bu oturumda hâlâ erişilemiyor. `betulandersen-droid`
   adlı **farklı bir GitHub hesabı** altında olduğu daha önce tespit edildi;
   bu oturuma bağlı GitHub yetkilendirmesi yalnızca `andersenbetul-alt`
   hesabını kapsıyor. "HEPSI" cevabı bu depoyu da içeriyor olsa bile, hesap
   bağlanmadan teknik olarak görülemez/taşınamaz.

## Önerilen sıradaki adım

Gerçek kod/geçmiş birleştirmesi — yani beş reponun dosyalarını fiilen tek bir
repoya (ya da tek bir izlenebilir yapıya) taşımak — geri döndürülemez bir
işlemdir (git geçmişi, Vercel bağlantıları, DNS). Bu yüzden otomatik
yapılmadı; kullanıcının şu üç noktadan hangisini seçtiğini netleştirmesi
gerekiyor:

- `beta-art-archive` için: kendi doktrinine rağmen gerçekten birleştirilsin
  mi, yoksa ayrı kalıp yalnızca bağlantı mı kursun?
- `QBLOGG` ve `qb` için: sil, yoksa öylece dursun mu?
- `eve-slack-agent`/`eve-chat-template` için: hiç kullanılmıyorsa silinsin mi,
  yoksa ileride referans olarak mı tutulsun?

Bu üç karar netleşmeden dosya/geçmiş taşıma işlemi başlatılmayacak.
