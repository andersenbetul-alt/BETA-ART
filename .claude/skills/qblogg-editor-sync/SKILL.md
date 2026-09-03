---
name: qblogg-editor-sync
description: >
  QBLOGG editör paneli ve public artifact arasındaki senkronizasyon iş akışı.
  "Senkronize et", "editörden güncelle", "yazıları yayınla", "public siteyi güncelle",
  "editörden al", "sync", "blog yazılarını çek" gibi ifadeler geçtiğinde kullan.
  Yazıları editör artifact db'sinden okuyup React public sitesini yeniden build edip
  yayınlar; quiz analitiğini de tersine senkronize edebilir.
owner: QBLOGG
---

# QBLOGG Editör Senkronizasyonu

İki artifact ayrı db depolarına sahip — biri diğerine otomatik yansımaz.
Bu skill, ikisi arasındaki köprüyü Claude Code araçlarıyla kurar.

## Sabit kimlikler

```
EDITOR_ARTIFACT   = https://claude.ai/code/artifact/ffde7603-ccdc-4f27-94fa-93a479afc608
PUBLIC_ARTIFACT   = https://claude.ai/code/artifact/306ac7cf-2ba4-42ef-9c24-b933e72a55ed
SCRATCHPAD        = /tmp/claude-0/-home-user-BETA-ART/b59a76f8-cfbb-5b36-8a66-a73bf2f92d03/scratchpad
REACT_SRC         = $SCRATCHPAD/qblogg-site
BUILT_HTML        = $SCRATCHPAD/qblogg.html
```

## 1. Yazıları editörden public siteye aktar (en sık yapılan)

### Adım 1 — Editör db'sinden yayınlanmış yazıları oku

```
Artifact action: "read_db"
url: EDITOR_ARTIFACT
db_op: "query"
collection: "posts"
query:
  where: [["status", "eq", "published"]]
  order_by: { field: "date", direction: "desc" }
```

Her belge şu alanları taşır:
`{ title, slug, category, date (YYYY-MM-DD), status, excerpt, body, updatedAt }`

### Adım 2 — React `posts` dizisine dönüştür

`App.tsx` satır ~390'daki `const posts = [...]` dizisini güncelle.
Her yazı için bu dönüşüm uygulanır:

| Editör alanı | React alanı | Not |
|---|---|---|
| `title` | `title` | direkt |
| `slug` | `slug` | direkt |
| `category` | `cat` | direkt |
| `date` | `date` | `"2025-08-18"` → `"18 Ağu 2025"` (TR ay kısaltmaları) |
| — | `accent` | kategoriye göre: SEO/Strateji → `#082C54`; LinkedIn/Sosyal → `#0a7d72`; diğer → `#082C54` |

TR ay kısaltmaları: `["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"]`

### Adım 3 — Vite build

```bash
cd $SCRATCHPAD/qblogg-site
VITE_CONFIG_NATIVE_IGNORE_WARNING=true npx vite build --outDir dist 2>&1 | tail -5
```

Build çıktısı `$SCRATCHPAD/qblogg-site/dist/index.html` dosyasını üretir.
Bunu `$SCRATCHPAD/qblogg.html` olarak kopyala:

```bash
cp $SCRATCHPAD/qblogg-site/dist/index.html $SCRATCHPAD/qblogg.html
```

### Adım 4 — Public artifact'i güncelle

```
Artifact action: "publish"
file_path: $SCRATCHPAD/qblogg.html
url: PUBLIC_ARTIFACT          ← aynı URL'e yaz, yeni artifact AÇMA
favicon: (omit — var olanı koru)
```

Başarılı yayından sonra kullanıcıya güncellenen URL'i ver ve kaç yazının
aktarıldığını söyle.

---

## 2. Analitik tersine senkronizasyonu (isteğe bağlı)

Quiz analitiklerini public site db'sinden editör db'sine taşır.

```
# Oku
Artifact action: "read_db"
url: PUBLIC_ARTIFACT
db_op: "get"
collection: "analytics"
doc_id: "summary"

# Yaz
Artifact action: "write_db"
url: EDITOR_ARTIFACT
db_op: "set"
collection: "analytics"
doc_id: "summary"
data: <okunan belge + lastSynced: şimdiki ISO zamanı>
```

---

## 3. Gelen kutusu senkronizasyonu (gelecek)

Şu an public site brief formu `mailto:` kullanıyor — db kaydı yok.
Ziyaretçi db desteği eklendiğinde:
- Public site db `inbox/{id}` → Editör db `inbox/{id}` kopyalanır
- Bu bölüm güncellenecek

---

## Gotchas

- **Scratchpad silinmişse**: `$SCRATCHPAD/qblogg-site/` klasörü yoksa build başarısız olur.
  Bu durumda kullanıcıya React projesinin kaynak klasörünü yeniden oluşturmanız gerektiğini söyle.
  Önceki oturumun build log'u: `b59a76f8-cfbb-5b36-8a66-a73bf2f92d03`.

- **Artifact db yetkisi**: `read_db` / `write_db` işlemleri yalnızca sahibin
  artifact'ında çalışır (`andersen.betul@gmail.com`). Başkasının artifact'ı veya
  Public site ziyaretçileri bu db'ye erişemez — bu beklenen davranış.

- **Aynı URL'e publish**: Mutlaka `url: PUBLIC_ARTIFACT` geç; geçmezsen yeni
  bir artifact açılır ve eski link geçersiz kalır.

- **Build uyarısı**: `__dirname` ile ilgili `VITE_CONFIG_NATIVE_IGNORE_WARNING` uyarısı
  zararsız — build yine de başarıyla tamamlanır.

- **Sadece yayınlanmış yazılar**: `status: "published"` filtresi kritik.
  Taslaklar public siteye geçmemeli.
