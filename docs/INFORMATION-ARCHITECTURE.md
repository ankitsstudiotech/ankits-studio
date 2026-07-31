# Information Architecture

## Route map (Next.js App Router)

| Route | Purpose | Tier |
|---|---|---|
| `/` | Home — brand overview, programme + branch entry points | 1 |
| `/programmes` | Programme index (all 7 confirmed programmes) | 1 |
| `/programmes/[slug]` | Programme detail | 1 |
| `/locations` | Branch index (Airoli, Ghansoli, Thane) | 1 |
| `/locations/[slug]` | Branch detail (address, hours, programmes offered, map) | 1 |
| `/timetable` | Class timetable, filterable by branch and programme | 1 |
| `/trial` | Trial class booking flow | 1 |
| `/contact` | Contact page — all branches, forms | 1 |
| `/trainers` | Trainer roster index | 2 |
| `/trainers/[slug]` | Individual trainer detail | 2 |
| `/pricing` | Membership / pricing plans | 2 |
| `/transformations` | Transformation stories/gallery | 2 |
| `/blog` | Blog index | 3 |
| `/blog/[slug]` | Blog post detail | 3 |

Slugs: `[slug]` under `/programmes/` uses `ProgrammeSlug`; under `/locations/` uses
`BranchSlug` — both defined in [CONTENT-MODEL.md](./CONTENT-MODEL.md).

## Route tiering — what should exist before real business data arrives

Per the brief, most business facts are unverified today. Tiering answers "what can
we responsibly build now, with mock data, vs. what should wait."

**Tier 1 — build now, structural, lowest factual risk.** These routes are
primarily about structure, navigation, and motion/design craft; their content
reads naturally as illustrative. Build with full mock data behind the launch gate
(see [DECISIONS.md ADR-002](./DECISIONS.md#adr-002)):
`/`, `/programmes`, `/programmes/[slug]`, `/locations`, `/locations/[slug]`,
`/timetable`, `/trial`, `/contact`.

**Tier 2 — build once Tier 1 is stable, extra disclaimer treatment.** These
domains carry higher real-world risk if a mock value is ever mistaken for real
(money, named individuals, health claims): `/trainers`, `/trainers/[slug]`,
`/pricing`, `/transformations`. Every price, name, and result on these routes
must render an inline mock disclaimer, not just a page banner — see
[CONTENT-MODEL.md](./CONTENT-MODEL.md).

**Tier 3 — defer, or ship as a stub.** `/blog`, `/blog/[slug]` are not required
for launch and depend on real content the owner hasn't produced yet. Acceptable
to ship as an empty index with a "coming soon" state rather than mock blog posts,
since fabricated blog content has weak justification versus fabricated UI-filler
content elsewhere. If built, blog posts still carry `dataStatus`.

No route is blocked on real business data existing — the mock-data strategy
exists precisely so IA, design, and motion work isn't blocked. What's gated is
**production launch**, not development, per
[DECISIONS.md ADR-002](./DECISIONS.md#adr-002).

## Primary navigation

Home · Programmes · Locations · Timetable · Pricing · Trainers · Transformations ·
Contact, with a persistent "Book a trial" CTA. Blog lives in the footer only until
it leaves Tier 3.

## Footer navigation

Branch list (Airoli, Ghansoli, Thane) with direct links to `/locations/[slug]`,
programme list, Blog, Contact, social links (mock/placeholder until verified).

## URL conventions

- All slugs are kebab-case, English, ASCII.
- No query-string-based routing for primary content (route segments only); query
  strings are reserved for filters that should be shareable/bookmarkable (e.g.
  `/timetable?branch=airoli&programme=yoga`), per the URL-as-state pattern.
- Every route in Tier 1 and Tier 2 must have a server-rendered, crawlable version
  of its primary content — see [SEO-STRATEGY.md](./SEO-STRATEGY.md).
