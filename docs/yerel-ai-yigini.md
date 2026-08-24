# Yerel Claude Code yığını — kurulum kılavuzu

Tarih: 24.08.2026 · Hedef makine: SİZİN bilgisayarınız (bu uzak oturum değil —
buradaki altyapı sabittir ve araya katman kabul etmez).
Hedef yığın (sizin şemanız):

```
CLAUDE CODE → OmniRoute (yönlendirme) → Headroom (bağlam sıkıştırma)
            → Claude-Mem (kalıcı hafıza) → Task Observer (beceri öğrenme)
```

Dürüstlük çerçevesi: araçların vaatleri kendi belgelerinden aktarılmıştır
[D — dış iddia]; tasarruf/etki rakamlarını kendi kullanımınızda ölçmeden
doğru kabul etmeyin. Benim önerim OmniRoute'suz sade yığındır; yine de
dördü de aşağıda, istediğinizi kurarsınız.

## Altın kural: TEK TEK kurun, her katmandan sonra 1 gün normal çalışın

Dört katmanı aynı anda kurarsanız bir sorun çıktığında hangisinden
geldiğini bilemezsiniz. Sıra (riski en düşükten yükseğe):

## 1. katman — Task Observer (zaten hazır)

Depoda: `.claude/skills/task-observer/`. QBLOGG deposunda çalışan her
Claude oturumu görür; gözlemler `skill-observations/log.md`'ye işleniyor
(şu an 8 açık gözlem). Diğer projelerinizde de istiyorsanız:

```bash
mkdir -p ~/.claude/skills
cp -r <QBLOGG-depo-yolu>/.claude/skills/task-observer ~/.claude/skills/
```

Doğrulama: yeni bir Claude Code oturumunda "task-observer" beceri
listesinde görünmeli. Geri alma: kopyaladığınız klasörü silin.

## 2. katman — Claude-Mem (kalıcı hafıza)

```bash
npx claude-mem install     # sihirbaz: hook kaydı + worker servisi
# Claude Code'u tamamen kapatıp yeniden açın
```

Doğrulama: birkaç oturum çalışın; yeni oturum açılışında önceki oturum
özetinin bağlama enjekte edildiğini görmelisiniz. Sorun çıkarsa
`claude-mem status` / belgeleri: docs.claude-mem.ai.
Geri alma: `npx claude-mem uninstall` (yoksa hook'ları
`~/.claude/settings.json`'dan elle silin).
Not: QBLOGG deposunda git-tabanlı hafıza (CLAUDE.md + proje günlüğü)
birincil kalır — claude-mem onun yerine değil, üstüne gelir.

## 3. katman — Headroom (bağlam sıkıştırma)

```bash
pip install "headroom-ai[all]"
headroom wrap claude       # kabuk-komutu çıktısı sıkıştıran şim kurar
```

Doğrulama: bir oturum çalışın; oturum sonunda "tokens saved" özeti ve
`rtk gain --format json` gerçek tasarrufunuzu gösterir. İlk hafta çıktı
KALİTESİNİ izleyin — sıkıştırma kayıplıdır; önemli bir işte tuhaflık
görürseniz şimi devre dışı bırakıp karşılaştırın.
Geri alma: `headroom unwrap claude` (yoksa `~/.rtk/bin` şimini PATH'ten
çıkarın).

## 4. katman — OmniRoute (İSTEĞE BAĞLI — çekincem kayıtlı)

Kurmadan önce bilin: (a) hakkında CVE/güvenlik uyarısı içeren bağımsız
incelemeler var; (b) "ücretsiz kota sağma" stratejisi sağlayıcı kullanım
koşullarıyla çatışıp hesap kapattırabilir; (c) tüm istemleriniz ve
anahtarlarınız bu katmandan geçer. QBLOGG işlerini Claude aboneliğinizle
yürütüyorsanız bu katmanın size kazandıracağı şey belirsiz, riski somut.

Yine de kuracaksanız: omniroute.online'daki güncel talimatı izleyin
(kendi kendine barındırılır; tek OpenAI-uyumlu uç nokta açar, araçlar
ANTHROPIC_BASE_URL benzeri değişkenle ona yönlendirilir). MUTLAKA:
yalnız kendi API anahtarlarınızla, "free tier draining" özellikleri
kapalı, önce önemsiz bir projede bir hafta.
Geri alma: base-URL ortam değişkenini kaldırın, servisi durdurun.

## Katmanlar birbirine karışırsa (hata ayıklama protokolü)

Sorun çıktığında EN SON kurduğunuz katmanı kapatın, sorunun gidip
gitmediğine bakın; gitmediyse bir alttakini. Üç katman da kapalıyken
sorun sürüyorsa sorun Claude Code'un kendisindedir — o zaman bana gelin.

## Bu uzak oturumla ilişkisi

Bu yığının hiçbiri bu uzak oturuma kurulmaz/kurulamaz: buradaki trafik
Anthropic'in yönetilen altyapısından geçer, hafıza görevi git'teki proje
belgelerindedir, gözlemci zaten depodadır. Yığın tamamen sizin yerel
terminaliniz içindir.
