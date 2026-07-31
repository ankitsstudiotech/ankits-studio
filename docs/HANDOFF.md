# Handoff

_Last updated: 2026-07-31 — Homepage integrated from content + SEO + UI systems._

## Current state

The marketing homepage at `/` is implemented as a **server-rendered composition**
of existing systems — not a parallel stack.

### What this pass built

- **`src/app/page.tsx`** — full homepage sections wired to `@/content` accessors
  and `@/lib/seo` `buildPageMetadata`.
- **Root shell** — `layout.tsx` + `globals.css` now load Syne/Figtree and
  `studio.css` / motion utilities site-wide (follow-up from
  [HANDOFF-UI.md](./HANDOFF-UI.md)).
- **Home sections** under `src/components/home/**` (reuse existing Hero,
  ProgrammeCard, LocationTeaserCard, TimetablePreview, TestimonialCard,
  layout chrome, motion islands — no duplicate tokens/buttons/SEO/content).

Homepage section map:

1. Cinematic hero (SSR copy; replaceable mock atmosphere media)
2. Trust strip (programme + listed locations only — no fake stats)
3. Programme showcase
4. Why Ankit's Studio
5. Founder-story placeholder
6. Transformation-story placeholders (qualitative, labelled)
7. Branch explorer (publicly listed only; Thane excluded)
8. Timetable preview
9. Community / testimonials (illustrative)
10. Free-trial CTA
11. FAQ (`<details>` SSR disclosures)
12. Footer + mobile sticky CTA

### Systems reused (not duplicated)

| System | Source |
|---|---|
| Content | `getProgrammes`, `getPubliclyListedBranches`, `getTimetableSlots`, `getTestimonials`, `getTransformations`, `getFaqs`, `getBusinessIdentity`, `getNavigationItems` |
| SEO metadata | `buildPageMetadata` from `src/lib/seo` |
| UI / motion / layout | `src/components/ui`, `motion`, `layout`, existing home primitives |
| Tokens | `src/styles/tokens.css` |
| Mock labelling | `MockModeIndicator` (dev) + inline `MockDisclaimer` / record `mockDisclaimer` |

### Verification (this pass)

```
npm run lint         # clean
npm run type-check   # clean
npm run test         # 27/27
ALLOW_MOCK_PUBLISH=true npm run build  # succeeds
```

Browser QA viewports: 390×844, 768×1024, 1440×900, 1920×1080 — no horizontal
overflow; mobile menu + sticky CTA on small screens; desktop nav on lg+;
hero H1 visible with `prefers-reduced-motion`.

### Still open

- Track D: remaining Tier 1 routes (`/programmes`, `/locations`, `/timetable`,
  `/trial`, `/contact`, …) — homepage links to them; pages may still 404.
- Track F: full ADR-002 layer-2 banner on preview builds (dev indicator exists).
- CONTENT-MODEL.md / DECISIONS.md sync for SEO-pass content types — see
  [HANDOFF-SEO.md](./HANDOFF-SEO.md).
- Owner data verification (Phase 4).

## How to resume

Read this file, then [TASKS.md](./TASKS.md). For homepage structure, start at
`src/app/page.tsx`. For content, use `@/content` only — never import
`src/content/mock/**` from components.
