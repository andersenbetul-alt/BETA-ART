#!/usr/bin/env bash
# PreToolUse(Bash) kancası: komut "git commit" içeriyorsa npm run check
# yeşil olmadan commit'e izin verme. CLAUDE.md kuralının mekanik hâli.
set -u
cmd="$(jq -r '.tool_input.command // empty' 2>/dev/null)"
case "$cmd" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac
CHECK_CMD="${QBLOGG_CHECK_CMD:-npm run check}"
if ! $CHECK_CMD >/tmp/qblogg-check-hook.log 2>&1; then
  echo "ENGELLENDI: npm run check kirmizi — commit atilamaz. Ayrinti: /tmp/qblogg-check-hook.log" >&2
  exit 2
fi
exit 0
