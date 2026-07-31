# SEO Strategy

## Objective

Local SEO is the primary growth channel: capture "[programme] classes in
[Airoli/Ghansoli/Thane]"-shaped search intent across strength, personal training,
yoga, Zumba, and dance.

## Server rendering requirement

All content that matters for SEO — programme descriptions, branch details,
pricing, trainer bios, timetable summaries, blog posts — **must be server-rendered**
(React Server Components / static generation), never client-fetched-and-painted.
This is a hard constraint from the owner brief and applies regardless of how much
motion/interactivity is layered on top (see [MOTION-SYSTEM.md](./MOTION-SYSTEM.md)
for how animation coexists with this).

## Structured data

- `LocalBusiness` (or a more specific `HealthClub`/`ExerciseGym`/`DanceSchool`
  sub-type where accurate) JSON-LD per branch, on each `/locations/[slug]` page.
- `Course`/`Service`-style structured data per programme on `/programmes/[slug]`.
- `BreadcrumbList` on all detail pages.
- **Structured data must never be emitted from mock fields until they're
  `VERIFIED`** per [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) — a search
  engine indexing a fake phone number or fake address as a real `LocalBusiness` is
  a real-world harm, not just a copy problem. Until verified, branch pages render
  content visually but omit `LocalBusiness` JSON-LD (or emit it with
  `"@id"`-only placeholder scoping) — implementation detail to be finalized in
  Phase 2 of [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md).

## Indexing policy tied to the mock-data gate

While `dataStatus` is `"mock"` or `"reference-only"` anywhere in the
business-critical domains (address, phone, pricing), the site must not present
verified-looking signals to search engines:

- Non-production environments (dev, preview, staging) are `noindex, nofollow` via
  `robots` meta and `robots.txt`, unconditionally.
- The production environment itself does not go live until the launch gate in
  [DECISIONS.md ADR-002](./DECISIONS.md#adr-002) passes — so "production is
  indexable" and "production only ever contains verified critical facts" are
  meant to become true at the same moment.

## On-page strategy per route tier

- **Tier 1** (`/`, `/programmes*`, `/locations*`, `/timetable`, `/trial`,
  `/contact`): primary keyword targets, one clear H1 per page tied to
  programme+branch combinations, internal links between programme and branch
  pages both directions.
- **Tier 2** (`/trainers*`, `/pricing`, `/transformations`): supporting
  authority/trust pages, linked from Tier 1 but not the primary landing targets
  until real trainer/pricing data exists.
- **Tier 3** (`/blog*`): long-tail and topical authority once populated; not
  required for initial indexing.

## NAP consistency (Name, Address, Phone)

Once branch data is `VERIFIED`, NAP must be byte-identical across the website
footer, each `/locations/[slug]` page, JSON-LD, and any external listing (Google
Business Profile, etc.) the owner maintains. This is out of scope to configure now
(no verified data exists) but is recorded here so Phase 4 doesn't skip it — see
[IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md).

## Sitemap

Generated `sitemap.xml` includes only routes with server-rendered, crawlable
content; excludes any route still gated `noindex`.
