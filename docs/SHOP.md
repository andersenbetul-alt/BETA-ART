# The store

The section renders from `assets/js/shop.js`. Adding a product is one object; no HTML is
touched, and all twelve languages keep working.

```js
{
  id: 'sample-pack-01',
  kind: 'digital',                    // 'digital' | 'physical'
  name: 'HXI Drum Kit Vol. 1',        // product names are not translated, like track titles
  desc: 'shop_d_kit',                 // an i18n key — add it to all twelve dictionaries
  price: { amount: 249, currency: 'NOK' },
  checkout: 'https://buy.stripe.com/...'
}
```

**`checkout` empty means the card renders as "coming soon"** and sends the visitor to the
mailing list instead. A Buy button that leads nowhere is worse than no button, so the empty
string is the safe default — a product is only for sale once its checkout link exists.

`npm run check` fails if a `desc` key is missing from any dictionary.

## Decided, August 2026

**The first product is digital, and it goes out through a Merchant of Record.**

`HXI Drum Kit Vol. 1` is in the catalogue with an empty `checkout`, so it renders as
"coming soon" until the link exists. It is first because it is the only kind of product a
producer can deliver today: the files already exist in his sessions. No printer, no courier,
no size chart, no returns.

To open it:

1. Create the product on **Gumroad** or **Lemon Squeezy** — upload the pack, set the price,
   write the licence line (see below).
2. Paste the product URL into `checkout` in `assets/js/shop.js`, and add
   `price: { amount: …, currency: 'NOK' }`.
3. `npm run check`, commit. The card becomes a formatted price and a Buy button in all
   twelve languages.

**Stripe is not the provider for this one**, and the account being live and ready does not
change that. Stripe takes the payment and stops there: it does not hand the buyer a file, and
it does not become the seller of record for VAT. Both of those are the entire problem with
selling a digital product from Norway to a consumer in Germany. Stripe (`acct_1U5ZmK2Od2RM6qBk`,
BETA ART) is the right answer for physical goods, once there is a print partner behind them.

**Write the licence line before the first sale.** "Royalty-free for your tracks" is what the
card says; the product page has to say precisely what that covers — commercial releases, yes
or no; resale of the samples themselves, no. A sample pack without a licence line generates
support mail forever, and the answer changes depending on who asks.

## Order of play: cheapest to produce first

The catalogue is ordered by what it costs HXI to make one, not by what it sells for. Three
bands, and the reason each sits where it does:

| Band | Products | Cost to produce one | Why here |
| --- | --- | --- | --- |
| Files | Drum kit, wallpaper pack, stems | **Nothing** | They already exist in his sessions. Prepared once, sold forever. No printer, courier, size or return. |
| Paper | Stickers, numbered print | Low, per unit sold | Cheapest print-on-demand there is. No sizes, so almost nothing comes back — a sticker is never the wrong fit. Posts in an envelope. |
| Fabric | Tee, hoodie | Low, per unit sold | No stock risk either, but sizing is real, and most apparel returns are a size problem. Do not fill in `checkout` without a size chart. |

Deliberately absent: **watches, rings, cargo trousers, jackets.** Each ties up money in stock
or carries a high unit cost, and a brand with no sales history yet has no way to know how many
to make. They are a decision for after the first band has sold something.

The order in `shop.js` is the order on the page, and it is this order on purpose: a visitor
meets the free thing first, then the cheap thing, then the thing with a size.

## The prices, and where they came from

Researched August 2026. These are starting prices, not settled ones — a price is a decision
that gets revised after the first fifty sales, and every one of them is a one-line edit in
`shop.js`.

| Product | Price | What the market shows |
| --- | --- | --- |
| Wallpaper pack | 49 NOK | Barely a market. Priced low because its job is the first transaction, not the margin. |
| Sticker pack | 99 NOK | Band stickers sell at $3–8 / £4–12. Small goods carry 70–85% gross margin, the highest of anything here. |
| Drum Kit Vol. 1 | 149 NOK | Phonk kits on Gumroad sit at **$5** and the shelf is crowded. This is priced above that on purpose — see below. |
| Numbered print | 299 NOK | Indie limited prints run £15–30. High margin, ships flat, and the number is what people pay for. |
| Tee | 399 NOK | Independent shows average **$37–38**; UK core tier £20–35. Target 55–70% gross margin. |
| Hoodie | 799 NOK | Averages around **$70**. Target 50–65% gross margin. |

**On the drum kit being 149 and not 55.** The generic phonk kit market has bottomed out at
$5, and competing there is a losing game — those packs are anonymous, and there are hundreds.
What is being sold here is not a folder of 808s; it is the 808s from a track with 43 million
streams, from the person who made it. That is a different product and it does not price
against the $5 shelf. If it does not sell at 149, the lesson is about the audience, not the
number, and the number is easy to change.

**On the wallpaper pack.** It may work harder as free — a list incentive that costs nothing
to give away and gives the mailing list something real to hand over. `free: true` and
`signup: true` turn it into that in one edit. Worth trying before selling it.

**VAT.** Norway charges 25% MVA. The number on the card is what a consumer pays, VAT included
— that is the convention here and the legal expectation for consumer pricing. For digital
sales abroad the Merchant of Record handles the buyer's local rate, which is a second reason
to use one.

**Currency.** Prices are set in NOK and shown in the visitor's own formatting, not converted
at checkout. A EUR price is a separate decision, not an exchange rate — set it when there is
a reason to sell in EUR.

## The digital line, and what did not translate

The product list this came from was written for a visual artist. Most of it maps onto a
producer; two rows do not.

**Icon packs and brush packs are out.** A brush pack is an illustrator selling the tool
behind their own hand. HXI does not illustrate, and a brush pack with his logo on it would be
a thing he bought from someone else and resold.

**The producer's brush pack is a preset pack** — `HXI Serum Presets`, 199 NOK, against a
market where a hundred-preset Serum pack runs about $19.99. That is the exact analogue: the
patches the sound is actually made of, sold to someone who wants to build with them.

**And there is a second one nobody would guess.** This audience is visual. They found the
music while cutting video, and their tool is not a brush either — it is LUTs, overlays and
transitions. `HXI Edit Pack`, 149 NOK. It contains no music at all and it sells to exactly
the community that built the 43 million streams. It is the closest thing in the catalogue to
selling the audience their own craft back.

`HXI Poster — Print at Home` (79 NOK) is the numbered print's zero-cost sibling: the buyer
prints it. No printer, no courier, no returns.

## Membership and experiences

`HXI Frequency` — 99 NOK a month. The only recurring line, and the only one whose real cost
is not money but a promise: **something has to go out every month.** The question to answer
before its checkout gets filled in is not the price, it is "what am I sending in March". An
empty month is a cancelled subscription, and cancellations do not come back.

The name is deliberate — an earlier plan had a FREQUENCY podcast that was built and never
launched. If the podcast ever happens, it belongs inside the membership rather than beside it.

`Private Listening Stream` — 249 NOK. Experiences pay well and do not scale: what is being
sold is an hour. A stream is the scalable one — done once, watched by many.

**A studio visit is not in the catalogue, and that is deliberate.** It does not scale, and it
means giving an address to someone met on the internet. Before it is ever listed: where, with
whom else present, and on what terms. That is a decision about a young artist's safety, not a
product decision, and it should be made away from a pricing table.

## Which checkout provider

The answer is not the same for the two kinds of product, and the difference is tax, not payment.

**Physical merch — Stripe Payment Link.** Create the product and price in Stripe, paste the
link. Payment solved. Fulfilment is not: someone has to print, pack and post, so pair it with
a print-on-demand partner before selling a single tee. Shipping cost, sizes and returns are
the real work here, not the checkout.

**Digital goods — use a Merchant of Record** (Lemon Squeezy, Gumroad, Paddle). Two reasons,
and the second is the one that matters:

1. They host the file and deliver it to the buyer after payment. Stripe does not — a Payment
   Link's success page cannot safely hand over a download, because a guessable URL leaks the
   product.
2. **VAT.** Selling a digital product from Norway to a consumer in the EU, the UK or
   elsewhere can create a registration and remittance obligation in the buyer's country. A
   Merchant of Record becomes the legal seller and handles that. For a one-person operation
   selling a 249 NOK sample pack worldwide, this is the difference between shipping the
   product and not shipping it.

Stripe stays the right answer the day there is a company with an accountant behind it and
enough volume to justify owning tax compliance. That is a later decision; the `checkout`
field is just a URL, so switching provider is a catalogue edit.

## What must never change

**No card fields on this site.** Every checkout is a hosted page on the provider's domain.
The site's Content-Security-Policy permits no third-party frames beyond the two players, and
that is deliberate: card data that never arrives cannot leak.

**No cart.** Each product is its own hosted checkout. A basket needs a server to hold it, and
this site has none — that is what keeps it deployable by dragging a folder anywhere. If
selling ever needs a basket, the store moves to the platform that has a backend, and this
section becomes a set of links into it.

## Before the first real product goes live

- The price is set per currency, not converted at checkout. A NOK price and a EUR price are
  two decisions, not one exchange rate.
- Physical goods: shipping cost and delivery time stated before the buyer commits.
- Digital goods: say what the buyer gets — formats, tempo, key, licence terms. A sample pack
  without a licence line generates support mail forever.
- The free stem pack promised in the hero needs to be a real file before the store makes that
  promise a second time.
