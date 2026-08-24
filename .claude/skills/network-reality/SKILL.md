---
name: network-reality
description: Use before fetching, installing, deploying, or verifying anything that leaves this container — any curl, npm/pip install, API check, deployment, or model download. Names which hosts are reachable and which are blocked by the egress policy, so a blocked host costs a lookup instead of a wasted round trip. Trigger on network errors, HTTP 000, "unreachable", "fetch failed", connection_rejected, or before claiming an external service is broken.
---

# Ağ gerçekliği

Bu konteynerin dışarı çıkışı kısıtlı. Ölçüldü: **12 gözlem** engelli bir host'a
gidip bir tur kaybetmekle ilgili. Bu skill o turu siler.

## Önce sor

```bash
node .claude/skills/network-reality/hosts.mjs              # bilinen liste
node .claude/skills/network-reality/hosts.mjs <host> ...   # bilinmeyeni ölç
```

## Ölçülmüş durum (2026-08-24)

| açık | engelli (HTTP 000) |
|---|---|
| `registry.npmjs.org` | `huggingface.co`, `hf.co` |
| `pypi.org` | `api.vercel.com`, `vercel.com` |
| `github.com`, `api.github.com` | `api.entur.io`, `api.met.no` |
| `objects.githubusercontent.com` | `genspark.ai`, `pomelli.com` |
| `fonts.googleapis.com`, `crates.io` | `stitch.withgoogle.com`, `skills.sh` |

## Bu proje için sonuçları

- **`npm run verify:apis` bu ortamda kapatılamaz.** Entur ve MET engelli;
  `COBBAN_LIVE_DATA=true` her zaman demo veriye düşer. Bulgu kalıcı olarak
  "doğrulanamaz" kutusunda — eksiklik değil, ortam gerçeği.
- **Vercel yalnızca MCP üzerinden.** CLI `api.vercel.com`'a çıkamıyor;
  `vercel deploy` "fetch failed" verir. Dağıtım kanalı `deploy_to_vercel`.
- **HuggingFace'e dayanan her şey ölü.** Headroom kurulur, CLI çalışır, ama
  Kompress modeli inemediği için sıkıştırma sessizce %0 döner — hata vermez.
  ML modeli indiren bir araç gördüğünde önce burayı kontrol et.

## Sessiz basarisizliklar

Engelli bir host her zaman hata vermiyor. Bunlar **cevap gibi gorunen
kesintiler** — en tehlikeli tur:

| komut | engelliyken ne der | gercek |
|---|---|---|
| `npx skills find <q>` | `No skills found`, **exit 0** | `skills.sh` engelli; arama hic yapilmadi |
| `headroom` sikistirma | `%0 tasarruf`, hata yok | HuggingFace engelli, model inemedi |
| `COBBAN_LIVE_DATA=true` | demo veri + sari serit | Entur/MET engelli, sessizce dusuyor |

Kural: bu ucunden biri "sonuc yok" derse **once host'u olc**, sonra rapor et.
"Hic skill yok" ile "arayamadim" ayni sey degil.

## Kurallar

- **HTTP 000 bir hata değil, bir cevaptır.** "Servis bozuk" deme; engelli de.
  Farkı ayırmadan kullanıcıya rapor etme.
- **Engellenen bir isteği tekrarlama.** Proxy politikası tur atmakla değişmez.
  TLS doğrulamasını kapatmak veya `HTTPS_PROXY`'yi kaldırmak da çözüm değil.
- **Liste eskir.** `hosts.mjs <host>` kayıtlıdan farklı çıkarsa
  `← DEGISMIS` der; o zaman listeyi güncelle.
