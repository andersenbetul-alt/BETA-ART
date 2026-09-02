# Eve Slack Agent — Yol Haritası

**Dizin:** `agents/eve-slack-agent/`  
**Kaynak:** `andersenbetul-alt/eve-slack-agent`  
**Framework:** Eve (eve.dev) + TypeScript + pnpm  
**Durum:** ✅ Vercel'de yayında (iki proje)

---

## Konsept

Tek kod tabanı, iki farklı Slack botu:

| Vercel Projesi | Kim için | Ne yapar |
|---|---|---|
| **naviar-consult** | NAVIAR CARE ziyaretçileri / pårørende | NAV süreçleri, yaşlı bakım koordinasyonu soruları yanıtlar |
| **hxi-music** | HXI hayranları / label/supervisor'lar | HXI müziği, stem pack, sync licensing soruları |

**Neden Slack botu:**
- 7/24 yanıt — insanın olmadığı saatlerde soruları karşılar
- Tekrarlayan soruları otomatikleştirir (fiyat, süreç, iletişim)
- Hem naviar.no hem hxi sitesi için müşteri adayı kalitesini artırır

---

## Teknik mimari

| Parça | Dosya | Açıklama |
|---|---|---|
| Agent | `agent/agent.ts` | Model seçimi, bağlam yapılandırması |
| Talimatlar | `agent/instructions.md` | Botun kimliği, ton, sınırlar |
| Araçlar | `agent/tools/` | `get_weather` (örnek), `slack` (Vercel Connect) |
| Beceriler | `agent/skills/` | Özel yetenek dosyaları |
| Vercel Connect | — | Slack credentials yönetimi; `.env` yerine Connect kullanılır |

---

## Değişiklik günlüğü

| Tarih | Değişiklik | Yapan |
|---|---|---|
| Ağu 2026 | Eve şablonundan oluşturuldu | — |
| Ağu 2026 | `naviar-consult` + `hxi-music` olarak Vercel'de iki ayrı projeye deploy edildi | — |
| Ağu 2026 | BETA-ART monoreposuna taşındı (`agents/eve-slack-agent/`) | — |
| 30.08.2026 | ROADMAP.md oluşturuldu | Claude |

---

## Sırada ne var

| Öncelik | İş | Not |
|---|---|---|
| Yüksek | **naviar-consult talimatlarını özelleştir** | `agent/instructions.md` — NAV, belediye, pårørende odaklı |
| Yüksek | **hxi-music talimatlarını özelleştir** | Stem pack fiyatları, sync tier, booking süreci |
| Orta | **Gerçek araçlar ekle** | Naviar: NAV sayfa linki lookup; HXI: Spotify katalog sorgusu |
| Orta | **İki botu tek koddan yönet** | Ortam değişkeniyle bot kimliğini seç (`BOT_MODE=naviar|hxi`) |
| Düşük | **Konuşma geçmişi** | Şu an belleksiz; Upstash ile kalıcı hale getirilebilir |
| Düşük | **Proaktif mesaj** | HXI yeni track çıkardığında Slack'e bildirim |
