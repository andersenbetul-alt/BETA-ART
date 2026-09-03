# WEB-2026-006 — Proje Kartı

**Proje No:** WEB-2026-006  
**Proje Adı:** Eve Chat Template  
**Kategori:** Web Uygulaması — Sohbet Arayüzü Şablonu  
**Durum:** Beklemede  
**Öncelik:** 🟢 Düşük  
**Son güncelleme:** Bilinmiyor

---

## Kimlik

| Alan | Değer |
|---|---|
| Tam ad | Eve Chat Template — Next.js tabanlı çok kullanıcılı sohbet şablonu |
| Framework | Eve (eve.dev) + Next.js |
| Kod deposu | `andersenbetul-alt/BETA-ART/agents/eve-chat-template/` |
| Sürüm | v0.0.0 |
| Paket yöneticisi | npm/pnpm |

## Teknik özet

| Alan | Değer |
|---|---|
| Frontend | Next.js + shadcn/ui + Tailwind CSS |
| Sohbet | Streamdown |
| Auth | Better Auth (Starter: parola, Production: Sign in with Vercel) |
| DB | Drizzle + Neon |
| Cache | Upstash |
| Deploy | Vercel |
| Dil | TypeScript |

## Deployment modları

| Mod | Koşul | Auth | Kalıcılık |
|---|---|---|---|
| Starter | `EVE_CHAT_PASSWORD` yapılandırılmış | Paylaşılan parola | Browser localStorage |
| Production | Neon + Upstash + Vercel env tam | Sign in with Vercel | Neon DB |
| Local | Hiçbiri yapılandırılmamış | Yerel geliştirici kimliği | Browser localStorage |

## Eve agent bağlantısı

`agent/agent.ts` — model ve davranış  
`agent/channels/eve.ts` + `agent/channels/slack.ts` — kanal handler'ları  
`agent/connections/` — Linear, Notion, Sentry bağlantıları

## Bilinen eksikler

| Alan | Seviye | Durum |
|---|---|---|
| Hangi projeye özelleştirileceği belirsiz | **Orta** | Bekliyor |
| Vercel deploy yapılmadı | **Düşük** | Bekliyor |

---

**Hazırlayan:** AUTOPROMPT arşivleme sistemi, 2026-09-03
