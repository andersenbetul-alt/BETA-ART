# WEB-2026-001 — Tasarım Sistemi

**Referans:** `/docs/tasarim-sistemi.md` (tam spesifikasyon orada)

## Renk paleti

| Token | Değer | Kullanım |
|---|---|---|
| `--brand` | `#082C54` (Midnight Navy) | Birincil marka rengi |
| `--brand-2` | `#00D8C2` (Electric Aqua) | Vurgu rengi |
| `--brand-2-ink` | `#0a7d72` | Aqua'nın metin versiyonu (5,0:1 kontrast) |
| `--logo-ink` | Temaya göre döner | Logo halkası |

> **Kritik:** Aqua (#00D8C2) beyaz üzerinde 1,8:1 kontrast oranına sahip — **metinde kullanılamaz**. Açık zeminde metin için `--brand-2-ink` kullanılır.

## Yazı tipi ölçeği

Token bazlı sistem — ham `rem` yazılmaz:

| Token | Değer |
|---|---|
| `--fs-2xs` | En küçük |
| `--fs-xs` | Çok küçük |
| `--fs-sm` | Küçük |
| `--fs-md` | Normal gövde |
| `--fs-lg` | Büyük |
| `--fs-xl` | En büyük |

## İkon kuralı

- **Satır içi SVG** — 24×24 ızgara, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, yuvarlak uç ve birleşim
- **Emoji kullanılmaz** — işletim sistemi çizer, marka kontrolü kaybolur
- Ok ve tema düğmesi tek renkli metin işaretleri (`→ ↑ ☾ ☀`) istisnadır

## Koyu tema

Tüm renkler CSS değişkenlerinden gelir → koyu tema kendiliğinden çalışır.

## RTL (Arapça)

Yön bağımlı CSS yazılmaz:
- `margin-left` → `margin-inline-start`
- `left` → `inset-inline-start`

## Marka varlıkları

`assets/brand/` altında 14 dosya (betikten üretiliyor: `scripts/marka-uret.py`):
- 11 SVG (sembol, lockup yatay/dikey, ikon, favicon, versiyonlar)
- 3 PNG (favicon-32, apple-touch-icon, og-image)
