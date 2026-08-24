# OBS-001 — Shell commands silently run against the wrong directory

**Status:** pending
**Occurrences:** 3
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

- `pkill -f 'dist/server.js'` killed the shell running it. `pkill -f` matches
  against full command lines, and the pattern appeared inside the very command
  that invoked it, so the shell matched itself. Exit 144, and none of the
  heredocs after it ran — no files written, no commit — while the processes it
  was meant to kill stayed alive.

## Pattern
A command near the start of a chain fails or self-destructs, and the rest of
the chain runs anyway — or doesn't run at all — while the output still reads as
success. Three mechanisms so far: cwd not persisting between tool calls so
relative paths resolve unpredictably; a tool invoked outside its project
resolving to a different binary; and a pattern-matching kill matching the
process that issued it.

The common thread is not paths specifically. It is that the shell will happily
execute a chain whose earlier steps did not do what was intended, and the only
reliable signal is checking the result rather than reading the last line.

## Proposed change
Use absolute paths in shell commands. When a command genuinely depends on cwd,
set it in that same command and confirm it rather than assuming it carried
over. Prefer a project's local binary (`./node_modules/.bin/tsc`) over a
resolver that can reach outside it. Kill processes by PID rather than by
pattern, since `pkill -f` can match the caller. Keep destructive commands out
of the same invocation as the work that depends on them.

Read the whole output, and when a step matters, verify its effect rather than
inferring it from the last line — the third occurrence was caught only because
the files were checked for existence afterwards.

## Target
New skill `shell-hygiene`, or a section in an existing bash-practices skill.
