# The mailing list

The signup form is the only thing on this page that captures anything. Everything else
sends the visitor somewhere HXI does not own.

## Why it matters more than the stream button

A stream is rented; a list is owned. Send someone to Spotify and you learn nothing about
them — no name, no way to tell them about the next release, the next drop, the next date.
The comparison that makes the size of it obvious: **a small list converting at 2.5% on a
€20 item earns what roughly 83,000 Spotify streams earn.** HXI's whole catalogue outside
"help urself" is a few million streams. The list is the shorter road.

HXI's own numbers say the same thing from the other side: 19,834 Spotify followers against
251,000 monthly listeners is a 7.9% follow rate, where 15–25% is normal. A quarter of a
million people hear the music every month and almost none of them are reachable.

## What the form does today

`SIGNUP_ENDPOINT` in `assets/js/app.js` is empty, so the form opens the visitor's mail
client with the address prefilled. That is a placeholder, and it is a weak one: plenty of
machines have no mail client configured, and the navigation then does nothing at all.

The important part is that it no longer *pretends*. It says what is about to happen, gives
the address to write to if nothing opens, and leaves the typed address in the field instead
of clearing it and looking successful. A form that silently loses signups while showing a
tick is worse than no form.

## Turning it on

Set `SIGNUP_ENDPOINT` to a form endpoint and the page posts JSON (`{"email": "..."}`) to it
instead. Nothing else changes — the states, the messages and the twelve translations are
already written.

Pick an endpoint that **stores in the EU**. The site is Norwegian, the audience is largely
European, and EU storage is the version of this you can describe in one sentence: no standard
contractual clauses to sign, no transfer impact assessment, no argument. Services that store
in EU regions, and EU-hosted serverless functions writing straight to a list, both qualify.

Two things to get right when it goes live:

- **Double opt-in.** GDPR wants consent that can be shown, and a confirmation click is the
  cheapest proof there is. `signup_ok` already reads as a confirmation state.
- **A privacy policy.** The page collects an email address and there is no privacy page yet.
  That is a gap, and it is why the note under the form no longer says "GDPR compliant" — it
  says where the address goes and how to get off the list, which is true today and useful in
  a way a compliance badge is not. Put the claim back when the page exists to support it.

## What not to do

Do not add a tracker to measure the form. The page makes no third-party request before the
visitor asks for one, and that promise is worth more than a funnel chart. Signup counts come
from the list itself.
