# The generators

Most pages on this project are not written by hand. They are written once, as
data, and generated — so that a change to a price, a service name or a piece of
chrome lands on every page that mentions it, rather than on the pages somebody
remembered.

Until now these scripts lived outside the repository. That was a real fragility:
the documentation described generated pages as having a single source of truth,
and the source of truth was in a temporary directory. If it had been lost, the
authored content would only have existed as generated HTML — editable, but no
longer regenerable without drift.

They run from this directory and write straight into the property folders.

## Data

| File | Holds |
|---|---|
| `data.py` | The 25 business services — name, slug, price, promise, process, FAQ |
| `data_no.py` | The same 25, written in Norwegian rather than translated |
| `posts.py` | The seven business articles (`beta-art-business/b-*.html`) |
| `journal.py` | The nine Field Notes essays (`beta-art-blog/j-*.html`) |
| `hub_guarantee.py` | The hub's guarantee section, in all twelve languages |
| `chrome_i18n.py` | The 24 chrome keys shared across the twelve languages |

## Builders

| File | Writes |
|---|---|
| `build.py` … `build6.py` | The business property: services, cases, resources, AI staff |
| `build_no.py` | `beta-art-business/no/` — the Norwegian URLs |
| `build_plates.py` | The archive's twelve plate pages |
| `build_journal.py` | The journal essays, and rewrites the index links to match |
| `build404.py` | A 404 page for each of the four properties |
| `build_code_doc.py` | `docs/20-kod.md` — the code, read off the tree rather than retold |
| `build_on_brand.py` | the `/on-brand` skill's token reference, read off the four `:root` blocks |
| `apply_hub*.py` | One-time patches to the hub, kept so the change is readable |

## After running any of them

The gates are not optional, and they are quick. `python3 tools/check.py` runs
the correctness set in one go and exits on it:

    python3 tools/sitemap.py     # URLs follow the pages
    python3 tools/feed.py        # the two feeds follow the articles
    python3 tools/enrich.py      # breadcrumb and FAQ structured data
    python3 tools/audit.py       # HTML
    python3 tools/qc.py          # JS, CSS, i18n, prices, hosts, deployability
    python3 tools/tokens.py      # a custom property is defined once, and resolves
    python3 tools/classes.py     # a class on a page has a rule behind it
    python3 tools/cascade.py     # a later rule beats a narrower breakpoint
    python3 tools/copy.py        # conversion copy
    python3 tools/forms.py       # a form does not report a delivery it did not make
    python3 tools/claims.py      # a promise on a page is a promise in the notice
    python3 tools/klarsprak.py   # Norwegian against Språkrådets klarspråk rules
    python3 tools/languages.py   # the notice says what languages.json records
    python3 tools/plates.py      # catalogue integrity
    node  tools/render-check.js  # a real browser, four widths

`python3 tools/i18n_pakke.py tr` is not a gate — it writes a review packet for
one language's strings, for a person to read.

The two below are readiness reports, not correctness gates. They exit **zero**,
because having something to report is not a failure — the same reason
`git status` exits zero on a dirty tree. What they report is real-world work
nobody here can finish: a lawyer, a domain, a photograph. Pass `--strict` to
either one to gate a deploy on it.

    python3 tools/launch.py      # is it ready? machine answers vs. person answers
    python3 tools/gaps.py        # what is still missing

`build_journal.py` is safe to re-run: it detects a previous run, does not
duplicate metadata, and reports any index card it could not match instead of
guessing.

**A builder does not write back the derived data.** `build.py` rewrites the 25
service pages without the JSON-LD `enrich.py` had appended — 32 lines gone from
each file, silently. Running the gates afterwards restores the tree to
byte-identical, because `enrich.py` is a writer and `check.py` runs it. A commit
taken between the two steps ships 25 pages with their breadcrumbs stripped, and
no gate can see that state, because running a gate repairs it.
