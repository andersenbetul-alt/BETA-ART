# OBS-001 — Shell commands silently run against the wrong directory

**Status:** pending
**Occurrences:** 2
**First seen:** 2026-08-24

## Evidence
- `cd naviar-app && cat > supabase/migrations/0001_...sql` failed because cwd
  was already inside `naviar-app`. The `cat` commands chained after it on
  separate lines ran anyway, against an unintended directory, and the block
  still printed its closing `ok` — so the output read as success while the SQL
  migration had not been written at all.
- `npx tsc --noEmit` printed the compiler's help text instead of typechecking.
  cwd had no `tsconfig.json`, so npx downloaded an unrelated compiler
  (v6.0.2) and ran it with no project. Exit code 1 looked like a type error.

## Pattern
Shell cwd does not persist between tool calls. Relative paths resolve against
whatever cwd happens to be, a failed `cd` at the head of a chain does not stop
the commands after it, and a tool invoked outside its project can resolve to a
different binary entirely.

## Proposed change
Use absolute paths in shell commands. When a command genuinely depends on cwd,
set it in that same command and confirm it rather than assuming it carried
over. Prefer a project's local binary (`./node_modules/.bin/tsc`) over a
resolver that can reach outside it. Read the whole output — a success message
may belong to a different command than the one that mattered.

## Target
New skill `shell-hygiene`, or a section in an existing bash-practices skill.
