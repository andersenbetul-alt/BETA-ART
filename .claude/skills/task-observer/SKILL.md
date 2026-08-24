---
name: task-observer
description: Use when about to report progress, claim work is done, or decide what to do next in this repository. Surfaces the gap between tools installed and product work shipped, and lists outstanding measured findings with the evidence behind each. Trigger on "what is left", "durum nedir", "ne kaldı", status requests, or before any completion claim.
---

# Task Observer

Bu depoda "ne yapıldı" sorusunun cevabı sohbet geçmişi değil, **git ve ölçüm
çıktısıdır.** Bu skill o iki kaynağı okur ve aradaki farkı gösterir.

## Neden var

Bu projede araç kurulumu ile ürün işi birbirinden ayrıldı: on commit boyunca
kırk skill kuruldu, ürün kodu değişmedi. Bu fark sohbette görünmüyordu çünkü
her tur kendi içinde başarılı görünüyor. Gözlemci bunu görünür kılar.

## Nasıl çalıştırılır

```bash
node .claude/skills/task-observer/observe.mjs   # depo kokunden
```

Duman testi ayakta bir sunucu ister; yoksa "KALDI" yerine "atlandi" der,
cunku kapali sunucu bir bulgu degil. Baska port icin `COBBAN_SMOKE_PORT`.

Çıktı üç şey söyler:

1. **Son ürün commit'i** ile **son commit** arasındaki mesafe
2. `docs/findings.md` içindeki açık bulgular
3. Doğrulama komutlarının o an geçip geçmediği

## Ölçüm tarifleri

`docs/findings.md` içindeki sayıları yeniden üretmek için:
**[references/olcum.md](references/olcum.md)** — boşluk/tipografi ölçeği,
WCAG kontrastı, dokunma hedefi, ikili varlık, görsel yolları, tarayıcıda
jeton çözümü. Her tarif yazıldığı hâliyle çalıştırılıp doğrulandı.

## Kurallar

- **İddiadan önce çalıştır.** "Düzeltildi" demeden önce ilgili doğrulama
  komutunu çalıştır ve çıktısını yapıştır. Ölçülmemiş düzeltme yapılmamış
  sayılır.
- **Bulgu kapatmak commit ister.** `docs/findings.md` içindeki bir madde
  ancak onu kapatan commit varsa `[x]` olur.
- **Araç kurulumu ilerleme değildir.** Skill eklemek bulguyu kapatmaz.
- **Sayı tarifsiz yazılmaz.** Bulguya sayı koyuyorsan tarifi
  `references/olcum.md` içinde olsun; yoksa sessizce eskir.
