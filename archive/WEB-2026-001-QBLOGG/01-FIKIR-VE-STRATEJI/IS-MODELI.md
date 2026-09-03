# WEB-2026-001 — İş Modeli

> **Uyarı:** Paket fiyatları araştırma/örnek veridir. Kesin vaat değildir.

## Gelir modeli

### Paketler

| Paket kodu | Ad | Fiyat (örnek) | Kapsam |
|---|---|---|---|
| p1 | Tek Makale | €150 | Bir kerelik proje |
| p2 | Büyüme | €900/ay | Aylık abonelik |
| p3 | Stüdyo | €2.500/ay | Tam içerik hattı |

> Norveç pazarı için NOK cinsinden fiyatlandırma düşünülüyor. Stripe Norveç ücreti: yurt içi kart %1,5 + 1,80 kr (yurt dışı +%3,25, döviz +%2).

### Gelir kanalları

1. **Kendi sitesi** — brief formu → doğrudan müşteri
2. **Upwork / nDash / ProBlogger** — platform üzerinden proje bazlı
3. **Medium / Substack** — içerik pazarlama → lead üretimi
4. **E-posta listesi** — Buttondown üzerinden bülten aboneleri → lead besleme

## Operasyonel model

- Müşteri brief formunu dolduruyor
- QBLOGG araştırma yapıyor
- Tek araştırmadan yedi format üretiliyor
- On dile çevriliyor
- Müşteri onaylıyor → yayın

## Sahip olunan varlıklar

1. **Site** — brifin gittiği, güvenilirliğin oluştuğu yer
2. **E-posta listesi** — platformlardan bağımsız, kalıcı kanal

> Platformlar dağıtım kanalıdır, iş değildir.

## Faz 1 hedefi

- İlk 3 aylık müşteriyi manuel süreçle kazanmak
- Sürecin tekrarlanabilirliğini kanıtlamak
- Ölçeklendirme kararını bu kanıta dayandırmak

## Teknik borç (iş modeli açısından)

- `config.js` gerçek verilerle doldurulmadı (mailTo, prices, payLinks boş)
- Stripe entegrasyonu kurulmadı
- Formlar gerçek servise bağlı değil
