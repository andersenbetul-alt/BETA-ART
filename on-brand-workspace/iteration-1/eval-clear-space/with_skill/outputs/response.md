🚫 Off-brand as specified: "logoyu köşeye sıkıştır, etrafında boşluk bırakma, diğer metinler logoya değebilir" breaks NAVIAR's ratified clear-space rule — this one isn't a style preference, it's measured and enforced strictly (`brand/naviar/README.md`, confirmed by `docs/naviar/NAVIAR-LOGO-KARAR.md`):

> Clear space: ≥ 0.30× the wordmark's cap height around a full lockup; ≥ 1 ribbon-width around the monogram alone. Nothing — text, other graphics, the canvas edge — sits inside that zone.

So I didn't build the version where headline text touches the mark. Here's what I did instead, and why it still gets you the space you're after.

**What I built:** `naviar-instagram-post.html` in this outputs folder — a 1080×1080 Instagram post, Midnight Navy ground, NAVIAR lockup (reverse/dark-ground master, unedited) tucked into the bottom-right corner at 300px wide. At that size, cap-height ≈ 40px, so the mandatory clear space is only ≈12px — I gave it 24px (2× the minimum) as a safety margin, and kept the true canvas edges at 48px. That's a real, tight corner placement; it's just not a *zero*-space one. Open the file in a browser — there's a "clear-space kılavuzunu göster" button that draws the 12px boundary so you can see exactly how little room this actually costs you.

**Where the space actually came from, since cramming the logo wasn't the lever:**
- The lockup is sized at 300px — comfortably above the 160px full-lockup minimum, but nowhere near hero-sized. Most of your visual real estate was never the logo's to begin with.
- Headline, kicker, and subhead are pulled tight against each other and against the canvas edges (96px margins, tight line-height) — that's where "alan kazanmak" actually pays off, not in the 12–24px around the mark.
- One thin gold rule line as a structural accent (per the gold-contrast rule: gold never carries text or information on a light/navy-adjacent readable area — it's a divider, not a label).

**Content note:** you didn't give me the actual announcement (what/when), so the headline ("Yeni bir şey geliyor.") and subhead are placeholders — swap them for the real copy. I did *not* pull in any of NAVIAR's five candidate taglines as "the" brand voice — that's still an open, undecided item (`NAVIAR-LOGO-KARAR.md` §6 item 7), so I wrote neutral placeholder copy instead of presenting one of those five as official.

**Self-check:**
- Colors: only the four ratified tokens (#0A1628, #D4AF37, #F5F6F8) — no ad-hoc hex.
- Gold: rule line only, never text, never on a low-contrast pairing.
- No gradients/shadows/bevels/glow/3D — flat fills throughout; box-shadow on the page is just the browser-preview stage frame, not part of the creative itself.
- Clear space: ≥0.30×cap-height maintained on every side, verified against the toggleable guide.
- Minimum size: lockup at 300px width, well above the 160px floor.
- No descriptor used (master NAVIAR only) — not applicable here.
- Wordmark geometry untouched, not flipped/mirrored/rotated.
- No tagline presented as official/decided.

If the actual constraint is "this needs to fit a tighter format" (e.g., a Story crop, or a smaller placement), the way to gain more room is either a smaller — but still ≥160px — lockup with its own smaller, still-respected clear space, or the monogram alone (clear space there is ≥1 ribbon-width instead of the lockup rule), not shrinking the clear space itself. Happy to produce either variant if you tell me the actual format and copy.
