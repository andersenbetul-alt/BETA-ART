#!/usr/bin/env bash
# Tum testleri calistirir. Herhangi biri basarisiz olursa sifirdan farkli kodla ciker.
#
#   ./run-tests.sh
#
# SQL testleri icin calisan bir PostgreSQL gerekir. Yoksa o adim atlanir ve
# bu durum ciktida acikca belirtilir (sessizce gecilmez).

set -uo pipefail
cd "$(dirname "$0")"

fail=0
run() {
  local name="$1"; shift
  printf '%-28s' "$name"
  if out=$("$@" 2>&1); then
    echo "OK"
  else
    echo "BASARISIZ"
    echo "$out" | sed 's/^/    /'
    fail=1
  fi
}

echo "=== BETA test koşumu ==="
run "build (3 sayfa)"     python3 build.py
run "build (review)"      python3 build_review.py
run "veri butunlugu"      python3 tests/test_data.py
run "build degismezleri"  python3 tests/test_build.py

# Uretilen ciktilar depodakinden farkli mi?
printf '%-28s' "surukleme kontrolu"
if [ -z "$(git status --porcelain -- '*.html' 2>/dev/null)" ]; then
  echo "OK"
else
  echo "BASARISIZ"
  git status --short -- '*.html' | sed 's/^/    /'
  echo "    (build ciktisi commit edilenden farkli — yeniden commit gerekiyor)"
  fail=1
fi

# --- SQL ---
PSQL_ARGS="${PGTEST_ARGS:--h /var/tmp -p 55432 -U postgres}"
printf '%-28s' "sql (14 kontrol)"
if command -v psql >/dev/null && psql $PSQL_ARGS -tAc 'select 1' >/dev/null 2>&1; then
  if out=$(psql $PSQL_ARGS -q -v ON_ERROR_STOP=1 \
             -c 'drop schema public cascade; create schema public;' \
             -f db/schema.sql -f db/seed.sql -f db/functions.sql -f db/test.sql 2>&1); then
    echo "OK"
  else
    echo "BASARISIZ"; echo "$out" | grep -E 'ERROR|HATA' | sed 's/^/    /'; fail=1
  fi
else
  echo "ATLANDI (PostgreSQL yok)"
  echo "    Calistirmak icin: PGTEST_ARGS='-h /var/tmp -p 55432 -U postgres' ./run-tests.sh"
fi

echo
[ $fail -eq 0 ] && echo "TÜM TESTLER GEÇTİ" || echo "BAŞARISIZ TEST VAR"
exit $fail
