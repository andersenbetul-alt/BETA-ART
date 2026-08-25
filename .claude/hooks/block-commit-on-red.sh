#!/usr/bin/env bash
# Suit kirmiziyken git commit/push engeller. PreToolUse/Bash.
c=$(jq -r '.tool_input.command // ""')
case "$c" in *"git commit"*|*"git push"*) ;; *) exit 0 ;; esac
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0
if out=$(./run-tests.sh 2>&1); then exit 0; fi
fails=$(printf '%s' "$out" | grep -E 'BASARISIZ|BAŞARISIZ' | head -3 | tr '\n' ' ')
jq -cn --arg r "Test suiti kirmizi — commit/push engellendi. $fails Once ./run-tests.sh calistir ve duzelt." \
  '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
