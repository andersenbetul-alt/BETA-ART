# Araç yığını — ölçülmüş durum

Hedeflenen zincir:

```
Claude Code → OmniRoute → Headroom → Claude-Mem → Task Observer
```

Bu doküman, o zincirin bu ortamda **gerçekte** neye karşılık geldiğini
kaydeder. Kaynak iddia değil ölçüm: her satırın altında onu üreten komut var.

Ölçüm tarihi: 2026-08-24 · konteyner `container_01KbLGTTBVUgA9nSBJhshAiQ`

---

## 1. Zincir tek sıra değil, üç ayrı bağlantı noktası

Diyagram dört kutuyu alt alta diziyor ama bunlar aynı yere takılmıyor:

| Katman | Nereye takılır | Ne zaman çalışır |
| --- | --- | --- |
| OmniRoute | Model API'sinin **önüne** (HTTP proxy) | Her istekte |
| Headroom | Model API'sinin **önüne** (HTTP proxy) | Her istekte |
| Claude-Mem | Claude Code **eklentisi** (hook) | Oturum başı/sonu |
| Task Observer | **Beceri** (model bağlamında metin) | Tetiklendiğinde |

**OmniRoute ve Headroom aynı yuvayı paylaşıyor.** İkisi de `ANTHROPIC_BASE_URL`
üzerinden araya girer; ikisi birden aktif olamaz — biri diğerine yukarı akış
olarak bağlanmadıkça. Diyagramdaki dikey ok bu ikisi arasında yanlış.

Ayrıca OmniRoute'un kendi kutusunda **"Compression"** yazıyor. Headroom'un tek
işi de bu. Yani zincirin ikinci ve üçüncü kutusu aynı işi iki kez yapıyor.

---

## 2. Katman katman ölçüm

### OmniRoute — kurulu, devre dışı

```
$ command -v omniroute → /opt/node22/bin/omniroute
$ omniroute --version  → 3.8.49
$ omniroute status     → Database: Not found · Config Dir: Not found
```

Kurulu ama **hiç başlatılmamış**: veritabanı yok, yapılandırma yok, sağlayıcı
tanımlı değil. Bir sunucu süreci ve sağlayıcı anahtarları gerektiriyor.

### Headroom — mevcut değil

```
$ ls -d ~/Headroom /home/user/Headroom → (yok)
```

Klonlanmıştı, artık yok. Zaten sıkıştırma iddiası daha önce **tekrar
üretilemedi**: `tokens_saved: 0`, uygulanan dönüşümler yalnızca
`router:protected:user_message` ve `router:excluded:tool` idi. Yani gözlenen
davranış "büyük bağlamı sıkıştırmak" değil, mesajları sıkıştırmadan geçirmekti.

### Claude-Mem — kurulu ve etkin

```
$ cat ~/.claude/settings.json
{ "enabledPlugins": { "claude-mem@thedotmack": true } }
$ ls ~/.claude-mem → settings.json  telemetry.json
```

Eklenti olarak açık. Request yolunda değil, hook yolunda — bu doğru yuva.

### Task Observer — repoda, çalışıyor

```
$ ls .claude/skills/ → impeccable  task-observer
```

`SKILL.md` + `references/{observations,checkpoints,reporting}.md`. Commit'li.

---

## 3. İki proxy neden bu ortamda devreye giremez

```
$ env | grep ANTHROPIC_BASE_URL
ANTHROPIC_BASE_URL=https://api.anthropic.com

$ env | grep PROVIDER_MANAGED
CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST=1
```

Base URL doğrudan API'yi gösteriyor ve **sağlayıcı host tarafından yönetiliyor.**
Claude Code modelle doğrudan konuşuyor; arada ne OmniRoute ne Headroom var.
Bu bir yapılandırma eksiği değil, ortamın kararı.

Ek olarak çıkış proxy'si `openai.com` ve `openrouter.ai` gibi hedefleri
engelliyor — OmniRoute'un yönlendireceği sağlayıcıların çoğu buradan
erişilemez durumda. Yani "auto-fallback" için gidilecek yer yok.

---

## 4. Kalıcılık — asıl mesele

| Katman | Nerede duruyor | Konteyner geri alınınca |
| --- | --- | --- |
| OmniRoute | `/opt/node22/...` global npm | **gider** |
| Headroom | — | zaten yok |
| Claude-Mem | `~/.claude/`, `~/.claude-mem/` | **gider** |
| Task Observer | `.claude/skills/` (git) | **kalır** |

Dört katmanlı yığının bugün kalıcı olan tek parçası Task Observer. Diğerleri
her yeni oturumda elle kurulmak zorunda.

---

## 5. Karar bekleyen

1. **Headroom düşsün mü?** İşlevi OmniRoute'un kutusunda zaten var, kendisi
   ortamda yok, sıkıştırma iddiası ölçülemedi. Zincirden çıkarmak yığını
   üç katmana indirir ve hiçbir şey kaybettirmez.
2. **OmniRoute bu ortamda mı çalışacak, yerelde mi?** Burada base URL host
   tarafından sabit; anlamlı kullanım yerel makinede.
3. **Kalıcılık istenirse** repoya bir kurulum betiği girer. Bu, üçüncü parti
   araçları projenin bağımlılığı hâline getirir — bilinçli bir karar olmalı.
