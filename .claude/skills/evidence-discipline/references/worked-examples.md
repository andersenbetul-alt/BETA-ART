# Worked Examples

Full trails behind the rules in `SKILL.md`. Load when a rule needs the
context, not on every session. All three are from BETA-ART, 2026-08-22.

---

## 1. The skip link that passed its test and did nothing

**Claim reported:** "11/11 tests pass, accessibility fixed."

**What the test observed:**

```js
const href = await page.$eval('a[href^="#"]', e => e.getAttribute('href'));
assert.ok(await page.$(href), `skip link target ${href} does not exist`);
```

It asserts `#main` exists. It does. The test passes.

**What driving the page showed:**

```
Tab1 = Skip to content
after Enter, activeElement = BODY#-
NEXT Tab after skip = A "Skip to content"
=> skip link worked? false
main has tabindex? null
```

Activating the skip link left focus on `<body>`; the next Tab returned to the
skip link. A keyboard user ends exactly where they started. `<main>` needs
`tabindex="-1"` to be focusable at all.

**Why it matters more than a missing test:** a missing test is visibly
missing. This one converted absent coverage into a green tick that was then
cited as evidence. The suite was reported as proof of a fix it never tested.

---

## 2. Two confident wrong diagnoses before the raw output

An intermittent failure, roughly 1 run in 8, in a test asserting 44px hit
targets.

| Attempt | Hypothesis | Fix applied | Result |
| ------- | ---------- | ----------- | ------ |
| 1 | Layout not settled after `goto` | `await document.fonts.ready` | still failed |
| 2 | Click race — measured before the menu opened | wait for open state | still failed |
| 3 | *(captured the raw assertion)* | — | cause found |

The captured line:

```
'390px: got 43.999996185302734, 44, 44, 44, need >= 44'
```

The open animation applies `translateY(-0.5rem)`. A transformed element's
`getBoundingClientRect()` returns fractional device pixels, so a 44px box
measures a hair under 44. The test compared floats exactly, mid-animation.

**Fix:** await `getAnimations()` completion before measuring, and allow 0.5px
of tolerance.

**The trap in the process:** after each wrong fix came a run of clean passes
that felt like confirmation. At a 1-in-8 base rate, six clean runs is what an
unchanged bug looks like most of the time. Both earlier changes were kept —
they are defensible on their own merits — but the commit message says plainly
that neither was the cause, so the next reader is not misled.

---

## 3. A row policy that did not restrict a column

**Intent:** "users may edit their own profile."

```sql
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
```

**Exploit, run as the unprivileged `authenticated` role:**

```
--- T5 SELF-PROMOTE
UPDATE 1
 22222222-... | owner
```

One statement, collector becomes owner. RLS answers *which rows* you may
update, never *which columns*.

**Fix — two guards, so neither is load-bearing alone:**

```sql
revoke update on public.profiles from authenticated;
grant  update (display_name) on public.profiles to authenticated;
```

plus a `before update` trigger rejecting role changes by non-owners.

**The second bug, created by the first fix:** the trigger made the first owner
impossible to create — nobody was owner, so nobody could promote anyone.
Caught because an unrelated assertion regressed (owner saw 1 work instead of
2). Fixed by permitting the change when `auth.uid()` is null, i.e. migration
or service-role context, which is already privileged.

**Two lessons:** test authorization as the role the application actually
uses — superusers bypass RLS and would have shown nothing. And every guard
against escalation needs checking for the bootstrap case it may forbid.
