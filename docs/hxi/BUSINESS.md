# HXI — İş Belgesi

Sürüm: 0.2 · 30.08.2026 · Sahip: andersenbetul-alt  
Durum: Yön kararlaştırıldı — rakamlar ve detaylar doğrulanmadı.

## Tek cümleyle

HXI, Oslo tabanlı bir Nordic phonk elektronik sanatçısı/prodüktör markasıdır:
kendi müziğini yayınlar, diğer sanatçılarla çalışır ve prodüksiyon araçları üretir.

## Kim

HXI bir hizmet stüdyosu değildir. Müzisyenlerden servis satın almaz —
kendisi sanatçı olarak üretir, yayınlar ve iş birliği yapar.

**Ses dili:** Nordic phonk elektronik — Oslo'nun kış soğuğunun dönüştürüldüğü
ses estetiği. Tagline: **THE SAME SPEED — COLDER.**

Referans koordinat: 59.91°N · 10.75°E

## Marka mimarisi

| Kol | İçerik | Aşama |
|---|---|---|
| HXI Music | Ana yayınlar (single, EP, LP) | Birincil |
| HXI Credits | Diğer sanatçılara verilen prodüksiyon/mix katkısı | Aktif |
| HXI Creator Use | Sample pack, preset, araç satışı | Planlanan |
| HXI Sync | Film/oyun/reklam lisanslama | Planlanan |
| HXI Booking | Canlı performans ve DJ set | Planlanan |
| HXI Press | Basın materyalleri, medya | Altyapı |

## Gelir modeli

| Kanal | Model | Durum |
|---|---|---|
| Streaming (Spotify, Apple Music vb.) | Telif + dağıtım | Hedef |
| Creator Use (sample / preset) | Tek seferlik satış | Planlanan [H] |
| Sync lisanslama | Proje başına veya kütüphane lisansı | Planlanan [H] |
| Canlı / DJ set | Gig ücreti | Planlanan [H] |
| Koleksiyon / limited release | Fiziksel + dijital UTGAVE serileri | Planlanan [H] |

[H] = Henüz kesinleşmemiş; bu belge iş planı değil, çalışma taslağıdır.

## HXI Signal Score — iç kalite kapısı

Her yayın ≥ 90/100 eşiğini geçmeden dağıtıma çıkmaz. Ölçüt alanları:

- Ses kalitesi ve mastering standardı
- Özgünlük / marka ses diliyle uyum
- Teknik meta-veri eksiksizliği (ISRC, BPM, anahtar, tag)
- Görsel tutarlılık (kapak, UTGAVE sistemi)

## HXI web sitesi — mimari

9 ekranlı tek sayfa yapısı (planlanan):

1. **Hero** — tagline + ses/video loop
2. **Current Signal** — aktif UTGAVE, yeni yayın
3. **Selected Works** — seçilmiş diskografi
4. **Credits** — iş birliği yapılan sanatçılar
5. **Place (Oslo)** — coğrafya, atmosfer — 59.91°N · 10.75°E
6. **Artist Story** — HXI kimliği ve ses dili
7. **Creator / Sync** — araç ve lisanslama kanalları
8. **Culture** — editorial, referans, etki
9. **Work With HXI** — iletişim / booking formu

## HXI Slack botu (`hxi-music`)

`agents/eve-slack-agent/` üzerinde çalışır. `AGENT_PROFILE=hxi-music` ile etkinleşir.  
Profil: `agents/eve-slack-agent/agent/profiles/hxi-music.md`

Kullanım alanları: proje takibi, teknik sorular, yayın planlama, iş birliği brief'i.

## Marka

Belge: `docs/hxi/brand-brief.md`  
Palette: Deep Black `#080808` · Off White `#F0EDE8` · Acid Signal `#C8FF00` · Signal Red `#EF2B2D`  
Tipografi: Barlow Condensed (display) · IBM Plex Sans (body) · Space Mono (metadata)

## Yapılacaklar (öncelik sırasıyla)

| # | İş | Durum |
|---|---|---|
| 1 | Slack botu kimliği ve profil | **Bu PR** |
| 2 | HXI web sitesi (9 ekranlı) | Bekliyor |
| 3 | Marka varlık üretim betiği (`hxi-marka-uret.py`) | Bekliyor |
| 4 | Marka araştırması (Patentstyret + TMview) | Bekliyor |
| 5 | İlk UTGAVE yayın paketi | Bekliyor |
| 6 | Creator Use kanal kurulumu | Bekliyor |

## Bilinen sınırlar

- Gelir rakamları doğrulanmamıştır; bu belge iş planı değil, çalışma taslağıdır.
- Norveç vergi/MVA yükümlülükleri kontrol edilmedi.
- Marka araştırması tamamlanmadan ticari yayılma yapılmamalı.
