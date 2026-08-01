# Handoff

_Last updated: 2026-08-01 — Programme & location experiences integrated._

## Current state

Programme and location **detail routes** now compose the reusable presentation
system from [HANDOFF-ROUTE-UI.md](./HANDOFF-ROUTE-UI.md) on top of the route
architecture in [HANDOFF-ROUTES.md](./HANDOFF-ROUTES.md). Pages stay
**server-rendered**; metadata, JSON-LD, mock noindex, and missing-data
handling are unchanged in behaviour.

### What this pass built

- **`src/app/programs/[slug]/page.tsx`** — wires `@/content` accessors into
  programme presentation components (hero → trial CTA). Publicly listed
  branches link to `/locations/[slug]`.
- **`src/app/locations/[slug]/page.tsx`** — wires location presentation,
  `MapPlaceholder`, and `BranchTimetable`. Offered programmes link to
  `/programs/[slug]`. Contact actions use `getBranchContactLinks` (disabled
  until verified — ADR-011).
- **Homepage internal links** — `/programmes` → `/programs` so showcase CTAs
  hit the real routes (gap flagged in HANDOFF-ROUTES).

Index pages (`/programs`, `/locations`), lookup helpers, `not-found` /
`loading`, content schemas, and SEO builders were already in place and were
**not** reworked beyond the detail-page composition above.

### Systems reused (not duplicated)

| System | Source |
|---|---|
| Content | `getProgrammes`, `getProgrammeBySlug`, `getPubliclyListedBranches`, `getBranches`, `getBranchContactLinks`, `getTimetableSlots`, `getTrainers`, `getFaqs` |
| SEO | `buildPageMetadata`, `buildBreadcrumbJsonLd`, `buildCourseJsonLd`, `buildLocalBusinessJsonLd`, `buildFaqPageJsonLd`, `serializeJsonLd` |
| Presentation | `src/components/programs/**`, `locations/**`, `maps/**`, `timetable/**` |
| Mock labelling | Record `mockDisclaimer` via presentation `FieldDisclaimer` / `PendingValue` |

### Verification (this pass)

```
npm run lint
npm run type-check
npm run test                                          # unit
npx vitest run --config tests/seo/vitest.config.ts
npx vitest run --config tests/routes/vitest.config.ts
ALLOW_MOCK_PUBLISH=true npm run build
```

Browser QA (every generated programme + location page, plus unknown-slug
not-found UI): mobile 390×844 through 1920×1080 — no horizontal overflow;
Thane TBC / empty hours / disabled contact; long programme names; crawlable
breadcrumb `<a>` links; specific trial CTA labels; `prefers-reduced-motion`
emulated; Course JSON-LD on programmes; LocalBusiness absent (branches still
unverified); noindex preserved.

### Still open

- Track D: remaining Tier 1 routes (`/timetable`, `/trial`, `/contact`, …).
- Track F: full ADR-002 layer-2 banner on preview builds.
- CONTENT-MODEL.md / DECISIONS.md sync for route-pass schema fields — see
  [HANDOFF-ROUTES.md](./HANDOFF-ROUTES.md) and [HANDOFF-SEO.md](./HANDOFF-SEO.md).
- Owner data verification (Phase 4).

## How to resume

Read this file, then [TASKS.md](./TASKS.md). For programme/location UI,
start at `src/app/programs/[slug]/page.tsx` and
`src/app/locations/[slug]/page.tsx`. For presentation props, see
[HANDOFF-ROUTE-UI.md](./HANDOFF-ROUTE-UI.md). Always load data via `@/content`
— never import `src/content/mock/**` from components.
