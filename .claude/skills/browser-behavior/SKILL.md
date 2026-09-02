---
name: browser-behavior
description: Add a lightweight "what does this visitor want next" personalization layer to a static or client-only website — tracks real interactions (filters clicked, sections viewed, pricing tiers explored) in the visitor's own localStorage, shows a "welcome back" recommendation on return visits, and gives the site editor a clearly-labelled local test panel — all with zero backend, zero third-party tracker, and no cookie-consent flow needed. Use this whenever the user asks to "find out what the customer wants to see or buy next time", add a recommendation/personalization feature, build a "returning visitor" experience, or add basic behavior tracking to a site that has no server and should not gain one just for this. Do NOT use it for real cross-visitor analytics, A/B testing, or anything that needs one person's browsing to inform another visitor's experience — that needs a real backend and is explicitly out of scope here.
---

# Browser-only customer behavior

## Why this exists

"Track what customers want and recommend it next time" sounds like it
needs an analytics pipeline. Most of the time it doesn't — a site with no
backend can still notice that a *returning* visitor filtered on
"Portraits" three times, and greet them with that instead of a generic
homepage. The whole trick: store it in **that visitor's own
`localStorage`**, never send it anywhere, and be honest about the one
real limitation that comes with that choice.

**The limitation, stated plainly, every time:** localStorage is
per-browser. The person who *edits* the site can never see what *other*
people did — only their own test clicks. If someone asks for "a panel
where I can see what my customers are interested in", that is a different
feature (real analytics, needs a backend) — don't build this instead and
let them find out later. Ask, or say so up front.

## When to reach for this vs. something bigger

| They want | Use this? |
|---|---|
| "Remember what a returning visitor looked at, greet them with it" | Yes |
| "Show a 'you might also like' based on this visitor's own clicks" | Yes |
| "Let me (the site owner) see what real visitors are interested in" | **No** — needs a backend + a database + almost certainly a GDPR/privacy notice. Say so before building anything; see "If they actually want real analytics" below. |
| "A/B test two versions across visitors" | No — needs a backend |
| "Recommend based on what *other* customers with similar taste bought" | No — needs cross-visitor data, i.e. a backend |

If you're not sure which one a request means, ask. In practice "customer
behavior system" and "what will they buy next" get used loosely for both
— confirm scope before writing code, the same way you'd confirm before
adding any other piece of infrastructure that changes the site's privacy
posture.

## What to build

Four pieces, all client-side:

1. **The store** — `scripts/behavior.js` in this skill folder. Four
   functions: `track(key)`, `topByPrefix(prefix)`, `countVisit()`,
   `resetBehavior()`. Copy it in (or port the same four functions if the
   site is vanilla JS with no module system — inline them at the top of
   the relevant file, same logic).

2. **Instrumentation** — at each interaction worth remembering, call
   `track('namespace:value')`. Namespace by what kind of thing it is so
   `topByPrefix()` can ask "what's their favorite X" without needing to
   know your domain:
   - `category:Landscape` (a filter/tab click)
   - `tier:Commercial` (a pricing/plan CTA click)
   - `section:pricing` (a nav link to a section)
   - `cta:book-call` vs `cta:see-demo` (which call-to-action they favored)

   Only track things a human would recognize as "yeah, that shows
   interest" — a filter click, a plan CTA, a nav click to a real section.
   Don't track mouse movement, scroll depth, or anything that would feel
   invasive if the visitor saw the list (they can, in the test panel).

3. **The "welcome back" panel (visitor-facing)** — on the 2nd+ visit
   (`countVisit() >= 2`) and only if there's a meaningful signal
   (`topByPrefix()` returned something), show a small banner: *"Welcome
   back — last time you looked mostly at **{topByPrefix('category:')}**"*
   with a button that jumps to it / pre-applies that filter. If there's no
   signal yet, render nothing — don't show an empty or generic banner,
   that's worse than no personalization.

4. **The editor test panel (editor-facing)** — a small, separate, always
   clearly-labelled toggle (e.g. a "Test panel" tab, corner of the
   screen) that reads the *same* store and shows the raw counts. It exists
   so the person building/testing the site can see their own tracking
   work without opening devtools — but the label must say, every time,
   in words close to: *"This is your own browser's test data, stored only
   on this device. It is not a record of real visitors — there is no
   server collecting anyone else's activity."* Include a reset button
   (calls `resetBehavior()`) so testing can start clean. Never skip this
   panel or its disclaimer — it's the thing that keeps "I built you a
   customer behavior system" from quietly implying more than it does.

## Adapting to the site's actual stack

Don't impose React or any framework the site doesn't already use — the
four functions in `behavior.js` are plain JS with no dependencies, so:

- **Plain HTML/JS site**: inline the four functions (or `<script
  src="behavior.js">` it), call `track()`/`countVisit()` directly in
  existing event handlers, and toggle the welcome-back banner / test
  panel with plain `element.hidden = …`.
- **React (or similar)**: wrap `countVisit()` in a `useEffect` +
  `useState` so the visit count is available for conditional rendering;
  everything else (`track`, `topByPrefix`, `resetBehavior`) is called
  directly, no hook needed. Lift any state the welcome-back panel needs
  to change (e.g. a filter) up to the nearest shared parent so the panel's
  "show me that" button can actually set it.

## Honesty checklist before calling this done

- [ ] The welcome-back panel only shows real, tracked interest — never a
      fabricated "recommended for you" on a first visit.
- [ ] The editor panel's disclaimer is present and says, unambiguously,
      that this is local test data, not real visitor data.
- [ ] Nothing here is described to the end user or in commit messages as
      "AI-powered" or "predicts what you'll buy" — it's a frequency count
      over the visitor's own clicks. Say that plainly if asked how it
      works.
- [ ] Every `localStorage`/`sessionStorage` call is wrapped so private
      browsing or a full quota degrades to "no personalization shown",
      not a broken page.
- [ ] If the site already has other localStorage keys, don't collide —
      check first, and consider a more specific `STORE_KEY` than the
      generic default in `behavior.js` (e.g. prefix it with the site's
      own name) if more than one project shares an origin.

## If they actually want real analytics

Say plainly that browser-only storage cannot show the editor real visitor
behavior, and that the fix is a small backend (an endpoint that logs
events + a database, or a hosted product like Plausible/Fathom for
aggregate stats). That's a different, bigger piece of work with its own
privacy-notice obligations — don't quietly build this skill's local-only
version and call it equivalent.
