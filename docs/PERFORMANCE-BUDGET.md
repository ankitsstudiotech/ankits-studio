# Performance Budget

## Core Web Vitals — acceptance gates

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| FCP | < 1.5s |
| TBT | < 200ms |

These are hard acceptance gates, not aspirational targets — see
[Acceptance gates](#acceptance-gates).

## Bundle budgets by page type

| Page type | Routes | JS budget (gzipped) | CSS budget |
|---|---|---|---|
| Landing / marketing | `/`, `/programs`, `/programs/[slug]`, `/locations`, `/locations/[slug]`, `/transformations`, `/trainers`, `/trainers/[slug]`, `/locations/[branch]/[programme]` | < 150kb | < 30kb |
| App-like / interactive | `/timetable`, `/trial`, `/pricing`, `/contact` | < 300kb | < 50kb |
| Microsite-style | `/blog`, `/blog/[slug]` | < 80kb | < 15kb |

Rationale for the split: this groups routes by **runtime behavior**, not by the
IA tiering in [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md) (tiers
govern build order and mock-data risk; this table governs bundle weight).
Pages that are primarily server-rendered content with scroll/reveal motion and
no real form/filter logic — `/`, `/programs*`, `/locations*` (the branch
index and single-branch detail pages), `/transformations`, `/trainers*`, and
`/locations/[branch]/[programme]` (ADR-008's local-SEO landing pages) —
despite several of these being Tier 2, get the tightest budget because they
are also the primary SEO landing targets and don't need interactive-form
weight. `/timetable`,
`/trial`, `/pricing`, and `/contact` all involve real client-side
interactivity (timetable filters, form validation and submission, plan
selection, a multi-branch contact form) and get more headroom for that
reason, regardless of tier — `/contact`'s static NAP content doesn't change
its budget class; its form island does. Blog is lightweight by nature.

## Loading strategy

- Inline critical above-the-fold CSS where justified; defer the rest.
- Preload the hero image/font only, per page — not a blanket preload policy.
- **Motion bundle accounting** (DECISIONS.md ADR-009): Motion is an opt-in
  client island, not a root-layout default — see
  [MOTION-SYSTEM.md](./MOTION-SYSTEM.md). Shared motion code counts against
  the JS budget of every route that imports it; a landing route that would
  exceed budget with motion included gets that motion route-split
  (dynamically imported per-route) rather than exempted. GSAP is always
  dynamically imported into only the component that needs it, per
  [MOTION-SYSTEM.md](./MOTION-SYSTEM.md).
- **Images** (DECISIONS.md ADR-007, finding I9): `next/image` (or a
  documented exception logged in [DECISIONS.md](./DECISIONS.md)) is required
  for all raster images. Explicit `width`/`height`, a `sizes` attribute on
  responsive images, AVIF/WebP with fallback, `loading="lazy"` below the
  fold, `fetchpriority="high"` only on the hero image. Max compressed weight:
  hero ≤ 200KB, inline/card images ≤ 100KB, before/after pairs on
  `/transformations` ≤ 100KB each.
- **Video**: no autoplay hero video by default (nothing in the brief
  demonstrates the need). If ever introduced, it must be muted, deferred
  until after LCP, have a poster frame, ship with captions (see
  [ACCESSIBILITY-STANDARDS.md](./ACCESSIBILITY-STANDARDS.md)), and be logged
  as a budget exception in [DECISIONS.md](./DECISIONS.md) before use.
- Fonts: max two families (per [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md)),
  `font-display: swap`, subset, preload only the critical weight/style.

## Acceptance gates

A route does not ship unless:

1. Lighthouse (or equivalent CI check) reports all Core Web Vitals targets above
   met on both mobile and desktop profiles.
2. Production JS/CSS bundle for that route is under its budget in the table
   above, measured post-gzip.
3. No unsized images, no layout shift from dynamically loaded content
   (skeleton/reserved space required for any async content, including
   `/timetable` data and `/trial` form validation states).
4. Third-party scripts (if any are ever introduced) load async/defer and are
   justified in [DECISIONS.md](./DECISIONS.md).

Gates are enforced per-route as it ships, consistent with the accessibility gate
policy in [ACCESSIBILITY-STANDARDS.md](./ACCESSIBILITY-STANDARDS.md).
