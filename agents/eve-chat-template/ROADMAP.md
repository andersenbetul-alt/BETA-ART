# Eve Chat Template — Yol Haritası

**Dizin:** `agents/eve-chat-template/`  
**Framework:** Eve (eve.dev) + Next.js + pnpm + shadcn/ui  
**Durum:** 🔒 Taslak / Şablon (deploy edilmedi)

---

## Konsept

Eve tabanlı sohbet arayüzü şablonu. Başlangıç modu: şifre koruması + localStorage.
Üretim modu: Sign in with Vercel + Neon (veritabanı) + Upstash (oturum).

**Ne için kullanılacak:**
- NAVIAR CARE için danışmanlık sohbeti (pårørende soru sorar)
- HXI için hayran/iş ortağı sohbeti
- İleride QBLOGG için müşteri adayı niteliklendir

**Starter modunda:** Tek şifre, tarayıcı localStorage, birden fazla kullanıcı paylaşır.  
**Production modunda:** Her kullanıcı kendi oturumunu açar, sohbet Neon'da saklanır.

---

## Teknik mimari

| Karar | Neden |
|---|---|
| Next.js | Vercel ile doğal; SSR |
| Eve framework | Streaming agent yanıtları; araç + beceri sistemi |
| shadcn/ui + Tailwind | Bileşen seti hazır |
| Drizzle ORM + Neon | Production modu için |
| Upstash | Eve session cursor persistence |
| Better Auth | Vercel Sign In |
| Starter mod | Hızlı deploy; gerçek kullanıcı yokken |

---

## Dağıtım modları

| Mod | Ne zaman | Kimlik doğrulama | Sohbet kalıcılığı |
|---|---|---|---|
| Starter | `EVE_CHAT_PASSWORD` ayarlıysa | Paylaşılan şifre | Browser localStorage |
| Production | Neon + Upstash + Vercel Sign In | Kişisel hesap | Neon |
| Yerel geliştirme | Hiçbir mod yapılandırılmamış + `next dev` | Yerel dev kimliği | Browser localStorage |

---

## Değişiklik günlüğü

| Tarih | Değişiklik | Yapan |
|---|---|---|
| Ağu 2026 | Eve şablonundan oluşturuldu | — |
| Ağu 2026 | BETA-ART monoreposuna taşındı (`agents/eve-chat-template/`) | — |
| 30.08.2026 | ROADMAP.md oluşturuldu | Claude |

---

## Sırada ne var

| Öncelik | İş | Not |
|---|---|---|
| Yüksek | **Hangi proje için deploy** — Naviar mı, HXI mi? | Talimatları ve kimliği o projeye göre ayarla |
| Yüksek | **Starter mod deploy** | `EVE_CHAT_PASSWORD` ayarla, Vercel'e push |
| Orta | **Agent talimatları özelleştir** | `agent/instructions.md` — projeye özel kimlik |
| Orta | **Tasarım uyarlaması** | Projenin marka rengine göre tema |
| Düşük | **Production mod** | Neon + Upstash + Vercel Sign In; çok kullanıcı gerekince |
