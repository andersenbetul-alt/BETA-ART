# BETA-ART — Project Status

**Component:** Navbar (BETA ART / Cobban)
**Branch:** `claude/navbar-beta-art-cobban-6t07ru`
**Overall:** First pass built — audited, fixes outstanding
**Last updated:** 2026-08-21

---

## Summary

The repository is a bare scaffold. No application code, build configuration,
or navbar implementation exists yet. This file records the actual state of
the repo so the navbar work has a documented starting point.

## Repository contents

| File | State |
| ---- | ----- |
| `CLAUDE.md` | Project memory — durable facts, conventions, doc map |
| `README.md` | Project overview, status pointers, layout |
| `STATUS.md` | This file |
| `PROGRESS.md` | Dated work log |
| `DECISIONS.md` | Decision log — D-001 accepted, D-002…D-005 open |
| `SECURITY.md` | Unmodified GitHub template — placeholder text, needs a real contact and version table |

No source directories (`src/`, `app/`, `components/`), no package manifest,
no CI workflows, no tests.

## Navbar status

| Item | Status | Notes |
| ---- | ------ | ----- |
| Navbar markup | Built | `src/index.html` |
| Navbar styling | Built | `src/styles.css` |
| Responsive / mobile menu | **Broken** | Markup + CSS exist; no JS toggle, so unopenable below 700px |
| Accessibility | Fails | 2 contrast failures, hit targets under minimum, no `prefers-reduced-motion` |
| Routing / link targets | Built | Home, Work, About, Contact |
| Tests | Not started | No test runner configured |

**Progress: first pass built and audited.** See [AUDIT.md](AUDIT.md) for the
full findings and fix order. The mobile menu is non-functional — highest
priority.

## Blockers

| Blocker | Decision | Effect |
| ------- | -------- | ------ |
| "Cobban" undefined | [D-004](DECISIONS.md) | Cannot set the site title / brand text in the navbar |
| No design reference | [D-005](DECISIONS.md) | Styling would be invented rather than matched |

D-002 and D-003 are now closed. D-004 and D-005 remain open but did not block
the first pass.

## Dependency graph

How the open decisions gate the navbar work. Everything downstream of D-002
and D-003 is unreachable until those two are answered.

```mermaid
graph TD
    D002["D-002 · Stack<br/>OPEN — hard blocker"]
    D003["D-003 · Page list<br/>OPEN — hard blocker"]
    D004["D-004 · What is 'Cobban'<br/>OPEN — soft"]
    D005["D-005 · Design reference<br/>OPEN — soft"]

    SCAFFOLD["Scaffold: manifest + entry point"]
    MARKUP["Navbar markup"]
    LINKS["Nav links"]
    BRAND["Brand / site title"]
    STYLE["Navbar styling"]
    RESP["Responsive + mobile menu"]
    A11Y["Accessibility pass"]
    TESTS["Tests"]
    DONE["Navbar shippable"]

    D002 --> SCAFFOLD --> MARKUP
    D003 --> LINKS --> MARKUP
    D004 -.placeholder ok.-> BRAND --> MARKUP
    D005 -.originate if none.-> STYLE
    MARKUP --> STYLE --> RESP --> A11Y --> DONE
    D002 --> TESTS --> DONE

    classDef blocker fill:#7f1d1d,stroke:#ef4444,color:#fff
    classDef soft fill:#78350f,stroke:#f59e0b,color:#fff
    classDef work fill:#1e3a5f,stroke:#3b82f6,color:#fff
    classDef goal fill:#14532d,stroke:#22c55e,color:#fff
    class D002,D003 blocker
    class D004,D005 soft
    class SCAFFOLD,MARKUP,LINKS,BRAND,STYLE,RESP,A11Y,TESTS work
    class DONE goal
```

**Critical path:** D-002 → scaffold → markup → styling → responsive →
accessibility. D-003 joins at markup. Nothing on this graph has been started.

## Open questions

1. What stack should BETA-ART use (static HTML/CSS, React, Next.js, other)?
2. What are the navbar links — what pages will the site have?
3. What does "Cobban" refer to — a brand name, a theme variant, or a
   person/owner? It appears only in the branch name, nowhere in the code.
4. Is there an existing design (Figma, mockup, reference site) to match?

## Next steps

- [x] Answer D-002 (stack) and D-003 (page list)
- [x] Build the navbar
- [x] Audit it against HIG principles → [AUDIT.md](AUDIT.md)
- [ ] Wire up the mobile menu toggle — currently broken
- [ ] Fix contrast (`#777`→`#666`, `#999`) and add `prefers-reduced-motion`
- [ ] Raise hit targets to 44×44 (toggle) and pad nav links
- [ ] Convert px→rem and set an explicit type scale
- [ ] Replace the placeholder text in `SECURITY.md`
