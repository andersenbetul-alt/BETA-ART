# Bu projenin doğrulanabilir kontrol noktaları

Her satır ölçülebilir bir komut ve net bir başarı ölçütü içerir. "Bittiğini
düşünüyorum" yerine bunlardan biri çalıştırılır.

## Test ve build

| Ne | Komut | Başarı ölçütü |
| --- | --- | --- |
| Tüm testler | `./run-tests.sh` | Çıkış kodu **0**, son satır `TÜM TESTLER GEÇTİ` |
| Sayfa üretimi | `python3 build.py` | Çıkış kodu 0, üç dosya yazıldı |
| İnceleme sayfası | `python3 build_review.py` | Çıkış kodu 0 |
| Sürükleme | `git status --porcelain` | **Boş** — üretilen HTML commit edilenle aynı |
| Veri bütünlüğü | `python3 tests/test_data.py` | `veri testleri: OK` |
| Sayfa değişmezleri | `python3 tests/test_build.py` | `build testleri: OK` |

### SQL adımları PostgreSQL ister

`run-tests.sh` PostgreSQL yoksa SQL adımlarını **ATLANDI** olarak işaretler.
Bu, geçti anlamına gelmez.

> **Atlanmış test geçmiş test değildir.** Rapor yazarken bu ikisi ayrı ayrı
> söylenir. "Tüm testler geçti" derken SQL adımı atlanmışsa rapor yanlıştır.

Sunucuyu başlatmak:

```bash
su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/pgdata \
  -l /var/tmp/pg.log -o '-k /var/tmp -p 55432 -c listen_addresses=' -w start"
```

| Ne | Beklenen |
| --- | --- |
| Kredi ve erişim mantığı | `sql (14 kontrol) OK` |
| Kimlik ve RLS | `auth/rls (16 kontrol) OK` |

## Depo durumu

| Ne | Komut | Not |
| --- | --- | --- |
| Bekleyen commit | `git log --oneline` | Push engelliyse burada birikir |
| Push denemesi | `git push -u origin <dal>` | `403` = GitHub yazma izni yok; tekrar denemek sonucu değiştirmez |
| Temiz ağaç | `git status --porcelain` | Boş olmalı |

## Ağ: neyin engelli olduğu

Bu ortamda çoğu dış adres engelli. Bir aracın "sonuç yok" demesi ile
"bağlanamadı" demesi karıştırılmamalı — ayırt etmek için doğrudan ölç:

```bash
curl -sS -o /dev/null -w "HTTP %{http_code}\n" --max-time 15 <url>
```

`HTTP 000` = bağlantı kurulamadı (engelli). Ayrıca proxy kaydı:

```bash
curl -sS "$HTTPS_PROXY/__agentproxy/status"
```

Ölçülmüş durum: `vercel.com`, `api.vercel.com`, `*.vercel.app`, `skills.sh`,
`claude.com`, `impeccable.style`, `openai.com`, `openrouter.ai`, video siteleri
→ **engelli**. `registry.npmjs.org`, `pypi.org`, `github.com` (okuma),
`api.anthropic.com` → açık.

## Deploy

| Ne | Nasıl | Başarı ölçütü |
| --- | --- | --- |
| Vercel deploy | Vercel MCP (`deploy_to_vercel`) — CLI ve API engelli | `get_deployment` → `state: READY` |
| Canlı doğrulama | Bu ortamdan **yapılamaz** (`*.vercel.app` engelli) | Kullanıcı kendi tarayıcısından bakmalı |

Deploy edilen dosyalar depodakinden farklıysa bu raporda söylenir.
