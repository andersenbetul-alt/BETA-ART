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
