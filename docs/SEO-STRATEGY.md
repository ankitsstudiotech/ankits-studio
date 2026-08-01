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

## Programme × location landing pages (DECISIONS.md ADR-008)

`/locations/[branch]/[programme]` is a dedicated landing surface for
"[programme] classes in [branch]"-shaped intent — the specific query shape
this doc names as the primary growth channel, which separate programme and
branch pages don't win on their own. Rules:

- Generated only for pairs present in both `Branch.programmeSlugs` and
  `Programme.branchSlugs` — never the full cross product.
- Each page requires unique server-rendered copy: a local intro, that
  branch's timetable excerpt for that programme, facilities/directions, and a
  trial CTA for that pair. Reusing the branch or programme page's copy with
  only the name swapped fails the uniqueness bar and the page should not be
  generated (same rule applies if this pattern is ever extended further —
  see [DECISIONS.md ADR-007](./DECISIONS.md#adr-007) finding I2).
- Location-first URL shape only (`/locations/[branch]/[programme]`, not also
  `/programs/[programme]/[branch]`) — one canonical URL per intent, no
  duplicate content between two shapes.
- Ships in Phase 2, alongside the rest of Tier 2 (see
  [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md)).

## Structured data

- `LocalBusiness` (or a more specific `HealthClub`/`ExerciseGym`/`DanceSchool`
  sub-type where accurate) JSON-LD per branch, on each `/locations/[slug]` page.
- `Course`/`Service`-style structured data per programme on `/programs/[slug]`
  and on each `/locations/[branch]/[programme]` page.
- `BreadcrumbList` on all detail pages.
- **Structured data must never be emitted from mock fields until they're
  `VERIFIED`** per [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) — a search
  engine indexing a fake phone number or fake address as a real `LocalBusiness` is
  a real-world harm, not just a copy problem. Until verified, branch pages render
  content visually but **omit `LocalBusiness` JSON-LD entirely** — the
  previously-considered `"@id"`-only placeholder option is rejected as
  unnecessary risk (easy to implement wrong, emitting partial NAP); omission
  is the only rule. See [DECISIONS.md ADR-011](./DECISIONS.md#adr-011).
- No fabricated review/rating structured data, ever — not even a placeholder
  `AggregateRating`.

## Metadata mechanics (DECISIONS.md ADR-007, finding I3)

- **Title template**: `"{Page Title} | Ankit's Studio"`, extended with branch
  and/or programme context where applicable (e.g. `"Yoga in Airoli | Ankit's
  Studio"`); exact copy per route type is a Phase 1/2 authoring task, not
  fixed here.
- **Canonical**: every route sets its own canonical to itself; query-string
  filter variants (e.g. `/timetable?branch=airoli`) canonicalize to the base
  route.
- **Open Graph / Twitter card**: required on all Tier 1 and Tier 2 routes.
  Uses a placeholder OG image while imagery is mock; swapped once real
  photography exists.
- **Image SEO**: descriptive `alt` text and explicit dimensions, sourced from
  the `MediaAsset` type (see [CONTENT-MODEL.md](./CONTENT-MODEL.md)).
- **Maps embeds**: never rendered for a branch until its address is
  `VERIFIED` — see the `mapEmbedUrl` rule in
  [CONTENT-MODEL.md](./CONTENT-MODEL.md) and
  [DECISIONS.md ADR-011](./DECISIONS.md#adr-011). Embedding an owner-supplied
  Maps pin while the printed address text is still labelled mock is the same
  leak as publishing the address itself.

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

- **Tier 1** (`/`, `/programs*`, `/locations*`, `/timetable`, `/trial`,
  `/contact`): primary keyword targets, one clear H1 per page tied to
  programme+branch combinations, internal links between programme and branch
  pages both directions.
- **Tier 2** (`/trainers*`, `/pricing`, `/transformations`,
  `/locations/[branch]/[programme]`): the programme×branch pages are the
  primary landing targets for local intent (see the section above); the rest
  are supporting authority/trust pages, linked from Tier 1 but not primary
  landing targets until real trainer/pricing data exists.
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
content; excludes any route still gated `noindex`. Implemented as
`buildSitemapEntries()` returning `[]` outright while any unverified content
exists anywhere on the site — a listed entry is itself an "indexable,
confirmed" signal, so the simplest correct rule is to list nothing at all
rather than try to selectively include "safe" entries.

## Implementation status (content + SEO foundation pass)

The SEO utility layer described above now exists in code, not just this
doc, at `src/lib/seo/**`: `buildPageMetadata` (title/description/canonical/
OG/Twitter, unique per call site), `buildCanonicalUrl`, structured-data
builders for `BreadcrumbList`, `Organization`, `ExerciseGym`
(LocalBusiness), `Article`, and `FAQPage`, `serializeJsonLd` (safe
`<script type="application/ld+json">` embedding — escapes
`<`/`>`/`&`/U+2028/U+2029), `buildSitemapEntries`, and `buildRobotsRules`.
`src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`, and
`src/app/opengraph-image.tsx` wire these in as the actual Next.js special
files. See `docs/HANDOFF-SEO.md` for full detail, test coverage, and
follow-ups.

The "omit, never placeholder" rule from `DECISIONS.md` ADR-011 is now
implemented uniformly across every structured-data builder, not just
`LocalBusiness`: `Organization`, `Article`, and `FAQPage` all return `null`
(or, for `FAQPage`, drop non-verified entries and return `null` if none
remain) unless the source record's `dataStatus === "verified"`. No new ADR
was needed for this — it's the *same* rule ADR-011 already established,
just applied consistently to the additional structured-data types this
pass added, not a new decision.

Course/Service structured data per programme (mentioned above) is not yet
built — out of this pass's explicit scope; still tracked for Phase 2 Track
G/H once programme/location pages exist.
