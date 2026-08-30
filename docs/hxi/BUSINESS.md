# HXI — İş Belgesi

Sürüm: 0.1 · 30.08.2026 · Sahip: andersenbetul-alt  
Durum: Taslak — kararlar ve rakamlar doğrulanmadan kesinleşmez.

## Tek cümleyle

HXI, müzik prodüksiyon stüdyosudur: kayıt, mix, mastering ve ses tasarımı
hizmetleri verir; müzisyen ve ses profesyonellerine danışmanlık sağlar.

## Sorun

Bağımsız müzisyenler ve küçük plakçılar için profesyonel prodüksiyon erişimi
genellikle ya çok pahalı (büyük stüdyolar) ya çok belirsiz (bireysel prodüktörler)
ya da her ikisi birden. Boşluk: **öngörülebilir fiyat, net teslimat ve erişilebilir
süreçle profesyonel ses kalitesi**.

## Teklif

| Hizmet | Kapsam | Not |
|---|---|---|
| Mix | Çok kanallı ses dosyaları → stereo master | Tur başı |
| Mastering | Stereo mix → dağıtım hazır dosya (streaming + fiziksel) | Tur başı |
| Prodüksiyon | Aranjman, enstrümantasyon, ses tasarımı | Proje bazlı |
| Danışmanlık | Stüdyo kurulumu, DAW seçimi, sinyal zinciri | Saat bazlı [H] |

[H] = Bu rakamlar veya kapsam henüz kesinleşmedi; örnek olarak işaretlidir.

## Hedef kitle

- **Birincil:** Bağımsız müzisyenler ve solo sanatçılar
- **İkincil:** Küçük bağımsız plakçılar ve podcast yapımcıları
- **Coğrafya:** Norveç merkezli, çevrimiçi çalışmayla küresel erişim

## Gelir modeli

| Katman | Model | Not |
|---|---|---|
| Proje bazlı | Tek hizmet bedeli (mix, mastering, prodüksiyon) | Temel gelir |
| Retainer | Aylık paket — düzenli sanatçılar için | Tekrarlayan [H] |
| Danışmanlık | Saat ücreti | Ek kanal [H] |

Rakamlar henüz kesinleşmemiştir; piyasa araştırması tamamlanmadan fiyat
listesi yayınlanmaz.

## Kanallar

- Kendi sitesi (yapılacak)
- Soundcloud / Bandcamp portföyü
- Norveç müzik ağları (Bylarm, Music Norway vb.)
- Slack botu (hxi-music) — iç iletişim ve proje takibi

## HXI Slack botu (`hxi-music`)

`agents/eve-slack-agent/` üzerinde çalışır. Kullanım alanları:

- Stüdyo soruları ve proje durumu
- Müşteri brief alma ve ön değerlendirme
- Teknik danışmanlık (DAW, format, sinyal zinciri)

Bot `AGENT_PROFILE=hxi-music` ortam değişkeniyle etkinleşir.
Profil dosyası: `agents/eve-slack-agent/agent/profiles/hxi-music.md`

## Marka

Belge: `docs/hxi/brand-brief.md`  
Varlık üretimi: henüz betiğe alınmadı — `docs/hxi/brand-brief.md`
tamamlandığında `scripts/hxi-marka-uret.py` yazılacak.

## Yapılacaklar (öncelik sırasıyla)

| # | İş | Durum |
|---|---|---|
| 1 | Slack botu kimliği ve profil dosyası | **Bu PR** |
| 2 | Fiyat araştırması (Norveç piyasası) | Bekliyor |
| 3 | Portföy / örnek çalışmalar | Bekliyor |
| 4 | Site: landing page | Bekliyor |
| 5 | Marka kimliği (betik) | Bekliyor |
| 6 | Stripe / ödeme entegrasyonu | Bekliyor — Hizmet #1'den sonra |

## Bilinen sınırlar

- Fiyatlar, hedef kitle ve hizmet kapsamı doğrulanmamıştır.
- Bu belge iş planı değil, çalışma taslağıdır.
- Norveç vergi/MVA yükümlülükleri kontrol edilmedi.
