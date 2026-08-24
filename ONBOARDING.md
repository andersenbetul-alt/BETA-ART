# Welcome to Naviar Care

## How We Use Claude

Based on Betul Andersen's usage over the last 30 days:

Work Type Breakdown:
  Plan Design      ████████████████████  40%
  Build Feature    █████████████████░░░  35%
  Write Docs       ██████░░░░░░░░░░░░░░  13%
  Improve Quality  █████░░░░░░░░░░░░░░░  12%

_One session in the window, so this is derived from the command and MCP mix
rather than from session history. Treat it as a sketch, not a measurement._

Top Skills & Commands:
  /goal                                     ████████████████████  2x/month
  /apple-design                             ████████████████████  2x/month
  /deep-research                            ████████████████████  2x/month
  /web-asset-generator                      ████████████████████  2x/month
  /mcp__Figma__create_design_system_rules   ████████████████████  2x/month
  /design                                   ██████████░░░░░░░░░░  1x/month
  /canvas-design                            ██████████░░░░░░░░░░  1x/month
  /security-review                          ██████████░░░░░░░░░░  1x/month
  /writing-guidelines                       ██████████░░░░░░░░░░  1x/month
  /deploy-to-vercel                         ██████████░░░░░░░░░░  1x/month

Top MCP Servers:
  Vercel              ████████████████████  11 calls
  github              █████████████░░░░░░░   7 calls
  Stripe              ███████░░░░░░░░░░░░░   4 calls
  GoDaddy             ████░░░░░░░░░░░░░░░░   2 calls
  Claude Code Remote  ██░░░░░░░░░░░░░░░░░░   1 call

## Your Setup Checklist

### Codebases
- [ ] beta-art — https://github.com/andersenbetul-alt/BETA-ART
      The Naviar Care site. Static HTML, CSS and JS with **zero dependencies
      and no build step** — `node_modules` does not exist here and must not
      appear. `npm` is only used to run the tests.

### MCP Servers to Activate
- [ ] **Vercel** — hosting and deploys. Ask Betul for an invite to the
      `bet-art` team, then connect the Vercel connector in claude.ai
      Settings → Connectors.
- [ ] **github** — PRs, issues, CI status. Available in Claude Code on the web
      once your GitHub account is authorized for the repo.
- [ ] **Stripe** — payments. **The connected account is in live mode.** Read
      calls only unless you have explicit sign-off; a write here moves real
      money. See `docs/BETALING.md` for what is blocked and why.
- [ ] **GoDaddy** — where `naviarcare.com` is registered. The connector can
      check availability and pricing only; it cannot edit DNS records, so
      those are done by hand in the GoDaddy dashboard.
- [ ] Claude Code Remote — session and scheduling tools. Comes with Claude
      Code on the web; nothing to install.

### Skills to Know About
- [ ] **/naviar-merkevare** — our brand: colors, type, the mark, and where
      each applies. Use this for anything Naviar shows anyone. Do **not** use
      `/brand-guidelines` for Naviar work — that one carries Anthropic's
      colors, not ours.
- [ ] **/apple-design** — design review against HIG-derived rules. Used at
      every stage here, not just at the end.
- [ ] **/deep-research** — fans out web searches and adversarially verifies
      each claim before it lands. Used for the Norwegian-law and
      brand/trademark questions. Read its "unanswered" notes as carefully as
      its findings.
- [ ] **/security-review** — reviews the pending diff on the branch.
- [ ] **/writing-guidelines** — prose review. We write in plain language
      (klart språk); `assets/js/klarsprak.js` holds the per-text-type LIX
      thresholds and `npm test` enforces them on nine pages.
- [ ] **/deploy-to-vercel**, **/web-asset-generator**, **/canvas-design**,
      **/design** — deploys, favicons and OG images, and visual work.

## Team Tips

_TODO_

## Get Started

_TODO_

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
