#!/bin/bash
# QBLOGG — oturum başlangıç kancası.
# Site saf HTML/CSS/JS olduğu için kurulacak bağımlılık yok; bunun yerine
# proje sağlık kontrolünü çalıştırıp içeriğin tutarlı olduğunu doğruluyoruz.
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

if ! command -v node >/dev/null 2>&1; then
  echo "node bulunamadı — scripts/check.mjs çalıştırılamadı."
  exit 0
fi

echo "QBLOGG sağlık kontrolü:"
node scripts/check.mjs || echo "(kontrol hata verdi — oturuma başlarken önce bunları düzeltin)"
