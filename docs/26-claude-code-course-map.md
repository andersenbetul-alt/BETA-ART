# Claude Code course — module map

**Prepared:** 2026-08-25 · Thirteen objectives, sorted into a course.

**Audience: people who already write code.** Not a judgement call — the
objectives settle it. *"Wire Claude into pull requests"*, *"gate turns on real
test results"*, *"package a plugin your whole team can install"* have no meaning
to someone who has never opened a terminal. Anyone learning to program needs a
different course, and it starts before this one.

---

## 1 · The problem with the thirteen as they stand

**Four of the advanced objectives re-teach something the beginner nine already
claimed.** Not reinforcement — the same skill promised twice, at the same depth.

| Beginner objective | Advanced objective | Overlap |
|---|---|---|
| "Write effective prompts using manual mode, auto-accept, and **Plan Mode**" | "**scope work with plan mode**" | Same feature, same verb |
| "Create and maintain a **CLAUDE.md** file" | "write a **lean CLAUDE.md** Claude actually follows" | The second admits the first produces one Claude ignores |
| "Manage your context window with **/compact**, /clear, /context" | "**direct compaction** so summaries keep what matters" | Same command |
| "Build custom **subagents** to delegate tasks" | "package repeated procedures as **skills**" | Adjacent, not duplicate — leave both |

The third row is the interesting one. *"Write a lean CLAUDE.md Claude actually
follows"* is a quiet admission that the beginner lesson produces a file that
doesn't work. If that's true — and it is, most CLAUDE.md files are too long to
be followed — then teach it once, properly, in Part 2, and have Part 1 say only
*"make one, three lines, we'll fix it later."*

**The rule for the split:** Part 1 makes it work. Part 2 makes it reliable.
Nothing appears in both at the same depth.

---

## 2 · The map

### Part 1 — Getting it working *(nine objectives, four modules)*

| Module | Covers | From |
|---|---|---|
| **1.1 What it is** | Coding agent vs. chat tool. The agentic loop, context window, tools, permissions — as four things that explain each other, not four definitions | Obj 1, 2 |
| **1.2 Get it running** | Terminal, VS Code, JetBrains, Desktop, web. **Pick one and move on** | Obj 3 |
| **1.3 The working loop** | Manual / auto-accept / Plan Mode, then Explore → Plan → Code → Commit on a real feature | Obj 4, 5 |
| **1.4 Don't run out of room** | `/compact`, `/clear`, `/context`. A three-line CLAUDE.md. Subagents to keep the main thread clean. MCP for outside data | Obj 6, 7, 8, 9 |

### Part 2 — Making it reliable *(four objectives, four modules)*

| Module | Covers |
|---|---|
| **2.1 Steer** | Plan mode as scoping, not a toggle. Directing compaction so the summary keeps what matters. Rewind to course-correct. Choosing hands-on vs. autonomous |
| **2.2 Configure** | The lean CLAUDE.md that gets followed. Repeated procedures as skills. The right permission mode per job. Hooks for the rules that must not bend |
| **2.3 Automate** | Routines on Anthropic infrastructure. Headless when it's your pipeline. Managed code review and the GitHub action |
| **2.4 Verify and share** | **Verification in proportion to how little you watched.** Hooks gating turns on real test results. Packaging a setup as a plugin |

---

## 3 · The four advanced objectives, tightened

They were already the strongest writing in the set. The only real fault is
density — each packs four skills into one line, so a learner can't tell what
they'll be able to *do*. Same content, one promise per line:

> **2.1 · Steer the work**
> Scope a task in Plan Mode before any code is written. Tell compaction what to
> keep, so the summary doesn't drop the thing you were doing. Rewind when it
> goes wrong. Know when to watch every step and when to let it run.
>
> **2.2 · Configure Claude**
> Write a CLAUDE.md short enough to be followed. Turn a procedure you repeat
> into a skill. Match the permission mode to the risk of the job. Put the rules
> that must never bend into a hook, where asking nicely isn't involved.
>
> **2.3 · Automate repeat work**
> Schedule a prompt as a routine. Drop to headless when it belongs in your own
> pipeline. Put Claude on your pull requests.
>
> **2.4 · Verify and share**
> **Check an unsupervised run in proportion to how little you watched it.**
> Gate a turn on tests that actually ran. Package a setup you trust as a plugin
> your team installs in one command.

**2.4's first line is the best sentence in all thirteen objectives.** It is the
whole discipline of working with an agent, and it belongs in the course title,
the sales page and the first slide — not buried fourth in the last module.

---

## 4 · What is missing

Three things a working engineer will hit in week one, absent from all thirteen:

1. **What to do when it's confidently wrong.** Every objective describes success.
   None describes the failure mode that costs the most time: a plausible,
   well-structured, incorrect change. It belongs in 1.3, before Plan Mode.
2. **What not to give it.** Permission modes are covered as capability
   (obj: "pick the right permission mode"). Secrets, credentials, customer data
   and client-confidential code are not covered at all. An engineer running
   `--dangerously-skip-permissions` on a work repo is the single highest-cost
   mistake in the syllabus and it isn't mentioned.
3. **Cost.** Nothing says what any of this consumes. Autonomous loops and fleets
   of subagents are taught in 2.1 and 2.3 with no mention that they are the
   expensive modes.

Item 2 is the one to fix first. It is a safety gap, not a completeness gap.
