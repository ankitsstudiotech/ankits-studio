# Information Architecture

## Route map (Next.js App Router)

| Route | Purpose | Tier |
|---|---|---|
| `/` | Home — brand overview, programme + branch entry points | 1 |
| `/programs` | Programme index (all 7 confirmed programmes) | 1 |
| `/programs/[slug]` | Programme detail | 1 |
| `/locations` | Branch index (Airoli, Ghansoli, Thane) | 1 |
| `/locations/[slug]` | Branch detail (address, hours, programmes offered, map) | 1 |
| `/timetable` | Class timetable, filterable by branch and programme | 1 |
| `/trial` | Trial class booking flow | 1 |
| `/contact` | Contact page — all branches, forms | 1 |
| `/locations/[branch]/[programme]` | Programme-at-branch landing page (local SEO) | 2 |
| `/trainers` | Trainer roster index | 2 |
| `/trainers/[slug]` | Individual trainer detail | 2 |
| `/pricing` | Membership / pricing plans | 2 |
| `/transformations` | Transformation stories/gallery | 2 |
| `/blog` | Blog index | 3 |
| `/blog/[slug]` | Blog post detail | 3 |

Slugs: `[slug]` under `/programs/` uses `ProgrammeSlug`; under `/locations/` uses
`BranchSlug` — both defined in [CONTENT-MODEL.md](./CONTENT-MODEL.md).
`/locations/[branch]/[programme]` is generated only for pairs present in both
`Branch.programmeSlugs` and `Programme.branchSlugs` — see
[DECISIONS.md ADR-008](./DECISIONS.md#adr-008) and
[SEO-STRATEGY.md](./SEO-STRATEGY.md) for the uniqueness requirement.

## Route tiering — what should exist before real business data arrives

Per the brief, most business facts are unverified today. Tiering answers "what can
we responsibly build now, with mock data, vs. what should wait."

**Tier 1 — build now, structural, lowest factual risk.** These routes are
primarily about structure, navigation, and motion/design craft; their content
reads naturally as illustrative. Build with full mock data behind the launch gate
(see [DECISIONS.md ADR-002](./DECISIONS.md#adr-002)):
`/`, `/programs`, `/programs/[slug]`, `/locations`, `/locations/[slug]`,
`/timetable`, `/trial`, `/contact`.

**Tier 2 — build once Tier 1 is stable, extra disclaimer treatment.** These
domains carry higher real-world risk if a mock value is ever mistaken for real
(money, named individuals, health claims): `/trainers`, `/trainers/[slug]`,
`/pricing`, `/transformations`, `/locations/[branch]/[programme]`. Every price,
name, and result on these routes must render an inline mock disclaimer, not
just a page banner — see [CONTENT-MODEL.md](./CONTENT-MODEL.md). The
programme×branch pages additionally require unique per-pair copy (local intro,
that branch's timetable excerpt for that programme, facilities/directions) —
reusing another page's copy with only the name swapped is not acceptable
(doorway-page risk) — see
[DECISIONS.md ADR-008](./DECISIONS.md#adr-008).

**Tier 3 — defer, or ship as a stub.** `/blog`, `/blog/[slug]` are not required
for launch and depend on real content the owner hasn't produced yet. Acceptable
to ship as an empty index with a "coming soon" state rather than mock blog posts,
since fabricated blog content has weak justification versus fabricated UI-filler
content elsewhere. If built, blog posts still carry `dataStatus`.

No route is blocked on real business data existing — the mock-data strategy
exists precisely so IA, design, and motion work isn't blocked. What's gated is
**production launch**, not development, per
[DECISIONS.md ADR-002](./DECISIONS.md#adr-002).

## Primary navigation (progressive by phase — DECISIONS.md ADR-007, finding I12)

**Phase 1 (Tier 1 only)**: Home · Programmes · Locations · Timetable · Contact,
with a persistent "Book a trial" CTA. Pricing, Trainers, and Transformations
are **not** linked from primary nav yet — those routes don't exist until
Phase 2, and an unbuilt Tier 2 link is either a dead link or pressure to ship
Tier 2 early without its required disclaimer treatment.

**Phase 2 onward**: Pricing, Trainers, and Transformations are added to
primary nav as each ships (with its inline-disclaimer treatment already in
place — never added to nav before the route itself is live). Blog stays
footer-only until it leaves Tier 3.

## Footer navigation

Branch list — **publicly-listed branches only** (`Branch.publiclyListed ===
true`; Thane is excluded while `reference-only`, see
[BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) and
[DECISIONS.md ADR-007](./DECISIONS.md#adr-007) finding I2) — with direct links
to `/locations/[slug]`, programme list, Blog, Contact, social links
(mock/placeholder until verified). A branch excluded from nav can still exist
as a route for prototyping/design work; it's simply not linked or included in
the generated sitemap until it's publicly listed.

## Conversion model (DECISIONS.md ADR-007, finding I1 — partial accept)

CTA hierarchy, in priority order: **Trial booking > WhatsApp > Phone call >
Contact form.** `/trial` is the primary, single-purpose conversion surface;
`/contact` is the branch directory and fallback contact form for non-trial
inquiries — the two are not duplicates of each other. WhatsApp/phone CTAs
render from a `Branch` record but only become clickable once that branch is
`verified` (see the `tel:`/`wa.me` rule in
[CONTENT-MODEL.md](./CONTENT-MODEL.md) hard rules) — pre-verification they
display as plain text. Minimum form fields, analytics events, lead routing,
and spam protection are explicitly **not** specified here — no analytics or
form vendor is chosen yet, so those details are deferred to a Phase 2 task
once one is picked, rather than guessed now.

## Mobile navigation and timetable layout (DECISIONS.md ADR-007, finding I10)

Exact breakpoints and the mobile nav pattern (e.g. priority nav + drawer) are
a named Phase 1 deliverable of the design-tokens track, not decided in this
doc. The `/timetable` mobile layout (stacked-by-day vs. horizontal scroll,
with a screen-reader-accessible alternative to any visual grid) is a named
Phase 1 deliverable of the route-scaffolding track. Both are tracked in
[TASKS.md](./TASKS.md) rather than specified speculatively here.

## URL conventions

- All slugs are kebab-case, English, ASCII.
- No query-string-based routing for primary content (route segments only); query
  strings are reserved for filters that should be shareable/bookmarkable (e.g.
  `/timetable?branch=airoli&programme=yoga`), per the URL-as-state pattern.
- Every route in Tier 1 and Tier 2 must have a server-rendered, crawlable version
  of its primary content — see [SEO-STRATEGY.md](./SEO-STRATEGY.md).
- `/timetable` specifically ships a fully server-rendered default view (no
  filter applied) so it has real crawlable content and a working no-JS
  baseline; branch/programme filters are a client enhancement layered on top —
  see [DECISIONS.md ADR-010](./DECISIONS.md#adr-010).
