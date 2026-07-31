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
| Landing / marketing | `/`, `/programmes`, `/programmes/[slug]`, `/locations`, `/locations/[slug]`, `/transformations` | < 150kb | < 30kb |
| App-like / interactive | `/timetable`, `/trial`, `/pricing`, `/contact` | < 300kb | < 50kb |
| Microsite-style | `/blog`, `/blog/[slug]` | < 80kb | < 15kb |

Rationale for the split: this groups routes by **runtime behavior**, not by the
IA tiering in [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md) (tiers
govern build order and mock-data risk; this table governs bundle weight). Pages
that are primarily server-rendered content with scroll/reveal motion — including
`/contact`, which is mostly static branch info despite being Tier 1, and
`/transformations`, despite being Tier 2 — get the tightest budget because they
are also the primary SEO landing targets and shouldn't carry interactive-form
weight they don't need. `/timetable`, `/trial`, and `/pricing` involve real
client-side interactivity (filters, form validation, plan selection) and get more
headroom for that reason, regardless of tier. Blog is lightweight by nature.

## Loading strategy

- Inline critical above-the-fold CSS where justified; defer the rest.
- Preload the hero image/font only, per page — not a blanket preload policy.
- Motion is imported normally (small, needed everywhere); GSAP is always
  dynamically imported into only the component that needs it, per
  [MOTION-SYSTEM.md](./MOTION-SYSTEM.md).
- Images: explicit `width`/`height`, AVIF/WebP with fallback, `loading="lazy"`
  below the fold, `fetchpriority="high"` only on the hero image.
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
