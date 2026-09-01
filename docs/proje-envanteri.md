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

---

## 30.08.2026 (gece) — Güncelleme: kod tarafı tek yerde birleşti, dağıtım hâlâ ikiye bölünmüş

Bu bölümün üstündeki envanterden sonra gerçekten çok şey değişti — bir kısmı
bu oturumda, bir kısmı (monorepo birleşmesi, depo görünürlük değişikliği,
yeni Vercel projeleri) **bu oturumun dışında, paralel olarak.** Aşağıdaki,
"QBLOGG projelerini her yerden incele, tek bir konsepte getir" isteğine
şu anki gerçek duruma göre verilen cevap.

### Kod: artık gerçekten tek yerde

`MONOREPO.md` (main'de, "Butun projeleri buraya tasi — 30.08.2026" başlığıyla)
zaten fiilen uygulanmış: `beta-art/`, `naviar/`, `agents/eve-slack-agent/`,
`agents/eve-chat-template/` bu depoya taşınmış. **QBLOGG'un kendisi bu
deponun kök dizini** — saf HTML/CSS/JS, sıfır bağımlılık, değişmedi.
Diğerleri (Beta Art, NAVIAR Care, Eve ajanları) QBLOGG değil, aynı deponun
içinde duran ayrı projeler; "QBLOGG'a dahil" değiller, yalnızca aynı
depoyu paylaşıyorlar.

`QBLOGG` ve `qb` adlı ayrı GitHub depoları hâlâ tamamen boş — "ikinci bir
QBLOGG" değiller, kullanılmayan isim rezervasyonları. Kod anlamında QBLOGG
artık gerçekten tek bir yerde: burada.

### Yeni ve gerçek bir sorun: depo özelleşti

Bu oturumda push sırasında GitHub şu uyarıyı verdi: **depo
`andersenbetul-alt/BETA-ART`'tan `andersenbetul-alt/BETA-ART-PRIVAT`'a
taşınmış ve özel (private) yapılmış.** Doğrulandı: eski adres 301 ile
yönlendiriyor, yeni adres kimliksiz istekte 403 veriyor.

Bunun tek başına zararsız görünen ama gerçekte QBLOGG'un canlı dağıtımını
kıran bir sonucu var: `vercel.json`'daki `buildCommand` her derlemede bu
depoyu **kimlik doğrulamasız** klonluyor (`git clone https://github.com/
andersenbetul-alt/BETA-ART.git`). Depo özelken bu klon Vercel'in derleme
sunucularında başarısız olur — şu anki canlı sürüm çalışmaya devam eder,
ama bir sonraki push+redeploy döngüsü kırılır. **Karar kullanıcıda:**
depoyu tekrar herkese açık yapmak mı, yoksa Vercel'e özel bir deploy
key/PAT tanımlayıp tarifi ona göre güncellemek mi.

### Dağıtım: hâlâ iki ayrı Vercel takımına bölünmüş

| Yer | Adres | Durum |
|---|---|---|
| Vercel **"BET-ART"** takımı, `qblogg` projesi (bu oturum erişebiliyor) | `qblogg-smoky.vercel.app` | Canlı, içerik güncel (30.08 sabahı doğrulandı), ama git bağlantısı `betulandersen-droid/eve-slack-agent` — yanlış/yer tutucu repo, gerçek `andersenbetul-alt/BETA-ART`'a değil. Özel alan adı (`qblogg.com`) bağlı değil. |
| Vercel **"beta-art-master"** takımı (bu oturum erişemiyor) | muhtemelen `qblogg.vercel.app` + `qblogg.com` | Muhtemelen tarihsel/asıl canlı adres (kullanıcının paylaştığı panel bağlantılarından çıkarıldı) — ama bu oturumdan ne API ne pano erişimiyle doğrulanabiliyor. |

Ayrıca "BET-ART" takımında bugün hızla çoğalan, çoğu `eve-slack-agent`
yer tutucusuna bağlı yeni projeler var (`beta-art`, `beta-art-archive`,
`naviar-care`, `naviar-care-2`, `naviar-paaroerende-pilot`,
`naerhjelp-pilot-v2` — 30.08 akşamı `git_deployment_context`'te görüldü).
Bunlar QBLOGG'u doğrudan etkilemiyor ama aynı takımın hızla
karmaşıklaştığını gösteriyor.

### "Tek konsept" için gerçekte kalan üç karar

1. **Depo görünürlüğü** — public'e geri mi, Vercel'e deploy key mi.
2. **Hangi Vercel projesi asıl QBLOGG olacak** — BET-ART'taki (erişilebilir
   ama alan adı yok) mi, beta-art-master'daki (muhtemelen qblogg.com bağlı
   ama görünmüyor) mi?
3. **Asıl olmayan proje(ler) ne olacak** — silinsin mi, öylece mi dursun.

Bunlar netleşmeden teknik olarak yapılabilecek her şey yapıldı: kod tek
yerde, sitenin kendi denetimleri (check/marka-dogrula/tescil-testi) yeşil.
Kalan iş tamamen hesap/panel kararları — kod değişikliği değil.
