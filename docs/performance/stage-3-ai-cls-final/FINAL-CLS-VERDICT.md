# Final CLS verdict

**PASS.** The remaining 0.710 footer race is eliminated under Lighthouse stress and throttled Playwright. Pre-fix CLS stays recorded as **P1**. After this pass: **P0 = 0, P1 = 0**.

## Remaining 0.710 node

Same footer as the original race: `body.studio-shell > div#main-content > footer.border-t`, score **0.7095990279465371**, after-rect top **4708**. Evidence: `remaining-failing-run.json`. Not a font-swap event.

Root cause: layout-shell footer painted with the loading fallback, while the real homepage lived in hidden `S:0`. Content arriving in the hole pushed the already-painted footer from the first viewport to document end.

## Structural change

- `SiteChrome`: header + children + sticky WhatsApp CTA only
- `PageWithFooter` / `ResolvedSiteFooter`: footer in the page payload after `<main>`
- Removed `body.flex.min-h-dvh.flex-col`, `#main-content` flex column, and leftover `flex: 1` page-push rules

Sticky CTA is unchanged (fixed, eligibility reserved via `has-sticky-cta`).

## Gates

| Gate | Result |
|---|---|
| Home Lighthouse ×8 CLS | 0,0,0,0,0,0,0,0 |
| Functional Lighthouse ×4 CLS | 0,0,0,0 |
| Throttled Playwright CLS | Home 0, Functional 0 |
| Footer early/final top (Home 390) | 4806 ≥ 844 at first H1 through final |
| Overflow 360–1920 | 0 px, no offenders |
| Home PNG 1440 / 1920 | 1440 / 1920 |
| H1 first paint | visible, opacity 1 |
| LCP | hero `img.frameMedia` |
| TBT | observation only (Home lab still ~800–3300 ms) |

No Corporate Wellness media, no Google Reviews fetch, no deploy.
