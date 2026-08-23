# Cross-Cutting Principles

Principles that apply to all skills. This file is read as a mandatory
checklist during any skill creation or regeneration.

---

## Active Principles

### 1. Spec değerleri kaynaktan doğrulanır, hafızadan yazılmaz
**Added:** 2026-08-23
**Applies to:** all skills with rules
**Requirement:** Bir plan/brief/skill başka bir dosyadaki adı, belirteci veya
değeri anıyorsa (CSS değişkeni, id, dosya yolu), yazmadan önce kaynaktan
grep'le doğrulanır. Bu oturumda iki hata bu yüzden çıktı (`--line` diye
belirteç yok, `#themeToggle` diye id yok).
**Propagation:** opportunistic
**Status:** active
