# Stage 2 — Mobile editorial reduction

Editorial cuts only (dedupe facts, slim FAQs, remove directory dumps, compact mobile footer). Not font/padding compression.

Viewport baseline: **390 × 844**, `deviceScaleFactor: 1`.

## Page heights (before → after)

| Route | Before px | After px | Reduction % | What was removed/merged |
| --- | ---: | ---: | ---: | --- |
| `/` | 6611 | 5038 | 23.8% | Practical Information removed; programme one-liners tightened; FAQ → 2; branch cards locality-only |
| `/about` | 5413 | 4024 | 25.7% | Opening facts → 3; approach copy shortened; FAQ → 1; directories → Explore/Find links |
| `/pricing` | 4794 | 3206 | 33.1% | Confirmed facts merged to 3; FAQ → 3 non-duplicative; programme/location directory removed |
| `/timetable` | 4594 | 3220 | 29.9% | One “batches vary” sentence; hours clarified once; FAQ → 2; directory removed |
| `/programs` | 3235 | 2935 | 9.3% | Footer denser; light editorial only |
| `/programs/functional-training` | 4730 | 3688 | 22.0% | Dropped Format & Delivery; glance/FAQ/availability deduped; locations → four-studios link |
| `/programs/yoga` | 4130 | 3222 | 22.0% | Same family cleanup; FAQ keeps ladies-only |
| `/programs/wedding-choreography` | 3921 | 3080 | 21.4% | Same family cleanup; wedding pricing FAQ kept |
| `/programs/home-personal-training` | 3810 | 3035 | 20.3% | No branch delivery list; fees link instead of batch directory |
| `/locations` | 2489 | 2188 | 12.1% | Footer denser; index left intact |
| `/trial` | 2939 | 2552 | 13.2% | Opening trim; fee bullet removed (builder owns next step) |
| `/contact` | 3252 | 2951 | 9.3% | Footer denser; Stage 1 structure retained |

Other programme routes (Zumba, Dance, Online) ~20–21% via shared detail template + footer.

## Anti-AI-slop review

| # | Check | Result |
| --- | --- | --- |
| 1 | Every possible website section on every page? | No — utility pages are builder-led |
| 2 | FAQs only for template symmetry? | No — capped; generic trial/price FAQs removed where visible above |
| 3 | Same business facts repeated on-page? | Reduced; hours/trial may still appear once in conversion context |
| 4 | Programme pages artificially identical? | Length now differs by service needs |
| 5 | Endless stacked blocks? | Materially shorter on Home/About/Pricing/Batch |
| 6 | Footer dominates? | Mobile ≤640px Explore+Branches two-column |
| 7 | Tiny content in heavy structure? | P2 watch: About “Next steps” + trial CTA still sequential |
| 8 | Useful content cut for height %? | No — founder, addresses, builders retained |

**P0 / P1:** 0 / 0 after fixes (About differentiator duplicate removed).

**P2:** Showcase still notes max group size 15 while FAQ also answers group size; acceptable secondary reinforcement.

## Screenshots

`docs/revamp/screenshots/premium-stage-2-mobile-editorial/`

- Manifest: `manifest.json` (width validation, heights)
- Heights: `heights-after.json`
- Baseline: `docs/revamp/screenshots/premium-stage-2-baseline/heights-before.json`

## Validation

- lint (changed files), typecheck, unit (262), smoke/a11y/sticky/secondary E2E
- SEO / structured-data / internal link / no-duplicate-copy tests
- Production build without `ALLOW_MOCK_PUBLISH`
- Screenshot dimension validation (`fails: 0`)
