# The master prompt, checked against what is built

Four documents were supplied as the single source of truth: the master
prompt, the site-content pages, the pre-launch checklist, and the QR plate
labels. This records where the built site agreed with them, where it did not,
what was corrected, and what still needs a decision that only you can make.

---

## Corrected

**Two of three licence prices were hidden behind "price on request".**
The master prompt sets the ladder at Personal kr 190 / Commercial kr 890 /
Extended kr 2 900, and its own *What NOT to do* list says: "Do not hide prices
behind 'Contact for pricing'." The archive was doing exactly that on the
Commercial and Extended tiers, and so was the legal notice. Both now publish
the prices. `Custom & exclusive` still says price on request, which the spec
itself allows — that one is quoted per case.

**No 404 page existed on any property.** The checklist asks for one ("Skriv en
enkel 404-side som leder tilbake til galleriet"). All four now have one, in
their own design, `noindex`, kept out of the sitemaps, and each with the three
or four links a lost visitor actually wants. Each says plainly that nothing
published has been removed — on a site whose argument is provenance, a dead
link reads as an archive that lost something.

**Four of the twelve required FAQ questions were missing.** The spec names
twelve; the archive answered eight of them. Added: model releases,
commissioned shoots, prints, and how to reach a person. The archive now
answers sixteen.

---

## Needs your decision

**1. The domain. `betaart.com` is taken; the others are free.**

Checked against the registry:

| Domain | Status | Where it appears |
|---|---|---|
| `betaart.no` | **available** | the master prompt, the QR plate labels, the checklist |
| `beta-art.no` | available | nowhere yet |
| `beta-art.com` | **available** | every canonical tag and email on the built site |
| `betaart.com` | **taken** | — |

The built site and your documents disagree, and neither domain is registered
yet, so nothing is broken — but the QR plates printed on physical labels say
`betaart.no`, and a printed label is the hardest thing on this list to change
later. My recommendation is `betaart.no` as the primary, with `beta-art.com`
registered as a redirect so the .com is not taken by someone else. Say the
word and I change every canonical, every email and the structured data in one
pass.

**2. The contact address.** The site uses `hallo@beta-art.com`; the documents
use `hello@betaart.no`. Two differences at once — the spelling and the domain.
Both need to land on the same answer as (1).

**3. Organisation number and address.** The master prompt requires them in the
footer, and Norwegian law requires a business to state its organisation
number. Neither exists on any page, because the enkeltpersonforetak has not
been registered yet (Phase 0 of your checklist). Nothing can be published for
sale until this exists. Send it and I will put it in the footer of all four
properties and into the legal notice.

**4. Payment provider.** Your documents pick Lemon Squeezy as merchant of
record with Vipps alongside. My payment architecture (`05-payment-architecture.md`)
recommends starting on Stripe Checkout plus Vipps and evaluating a merchant of
record later. Both are defensible and the difference is real:

| | Lemon Squeezy (MoR) | Stripe + Vipps |
|---|---|---|
| Who is the seller | Lemon Squeezy | Beta Art |
| International VAT | they collect and remit | you do |
| Cost | ~5% + $0.50 | ~1.5–2.4% + fixed |
| Fits | selling plates worldwide from day one | selling services in Norway |

For the **archive** — small digital licences sold to buyers anywhere — the
merchant-of-record argument is strong and your document is probably right. For
the **business studio** — projects invoiced to Norwegian companies with EHF —
it is wrong; those are invoices, not checkouts. The answer is likely both, split
by property. Confirm and I will write it into the architecture.

**5. Facts I refused to invent.** The master prompt lists them as placeholders
and they are still placeholders: the city you are based in, the year you
started, the size of the archive ("84,000+"), and your street address. They
appear nowhere on the site rather than appearing as a guess.

---

## Deliberate divergences, with reasons

**Palette: `--muted` is `#67635B`, not the specified `#85817A`.** The spec says
"use these exact hex values, nothing else" in section 3, and requires WCAG AA
in section 8. It cannot have both: `#85817A` on the paper ground measures
3.71:1, and AA needs 4.5:1 for body text. That colour carried the eyebrows,
the accession labels, the captions and the form labels — the entire fine-print
layer of the design. `#67635B` measures 5.73:1 and is visually the same grey.
The accessibility requirement wins; if you would rather have the original hex,
say so and I will change it back and note the failure in the accessibility
statement.

**Hosting is Vercel, not Netlify.** The checklist recommends Netlify. The four
properties are already deployed on Vercel and there is no functional reason to
move. Not a defect — just a note so the checklist is not followed blindly.

**No analytics.** The checklist wants Plausible or Fathom, and the privacy
policy names Plausible as a processor. Neither is installed. Until one is, the
privacy policy should not name it — a policy that lists a processor you do not
use is a false statement about data handling. Either install it or I remove the
line.

**The watermark is not implemented.** The spec asks for "BETA ART · SPECIMEN"
at ~14% opacity, rotated -14°, on every preview. There are no real photographs
on the site yet — the plates are CSS placeholders — so there is nothing to
watermark. This becomes real work the day the first image lands.
