# Production Bug Batch 01 — Spatial audit

Checkpoint: `studio-pulse-before-production-bug-batch-01` @ `d06ce99`.
Evidence: `docs/revamp/screenshots/production-bug-batch-01/`.
Local after captures include the Next.js development-preview banner because `next dev` sets `ALLOW_MOCK_PUBLISH`. Production must not.

Measured at 1536×730 after:

| Check | Result |
|---|---|
| Hero `object-position` (short desktop) | `68% 18%` (catalogue rest `70% 28%`) |
| H1 left | 64px (`--layout-gutter`) |
| Programmes title left | 64px |
| Functional title → “All branches” gap | 28px |
| FAQ kicker / QUICK ANSWERS / questions | all x=64 |
| Trial CTA background | `rgb(244, 241, 234)` cream on purple |
| Trial copy → CTA gap | 72px |
| Branch name / hours | same column x=122 |
| Branch actions | x=726 (28px after identity column) |
| Overflow 390 / 768 / 1440 / 1536 / 1920 | 0 |

## Shared grammar (supersedes Live Bugfix 02 8/4 far-edge)

- Outer gutter: `--layout-gutter` (`clamp(1.25rem, 4.5vw, 4rem)`). Same token as homepage hero copy inset.
- Content max: `--layout-content` (`90rem`), **left-aligned** after the gutter. Do not extra-center a second inset.
- Related copy + meta at `>=1200px`: `minmax(0, --layout-copy-max)` + `minmax(--layout-meta-min, --layout-meta-max)` + optional `1fr` breathing. Meta `justify-self: start`.
- Do not pin a short phrase to the far edge of a 1400px+ track.
- Below 1200px: stack.

## Route audit (1536)

For each inspected public route: container alignment, relationship gap, heading alignment, desktop empty field, overflow.

| Route | Container alignment | Relationship gap | Heading alignment | Desktop empty field | Overflow |
|---|---|---|---|---|---|
| `/` | **FIXED** — hero and chapters share 64px gutter | **FIXED** — programme meta 28px from copy column; branch actions adjacent | **FIXED** — FAQ kicker and QUICK ANSWERS both x=64 | **FIXED** — remaining width is framing to the right of a coherent group | **OK** 0 |
| `/about` | **FIXED** — shared gutter, H1 x=64 | **OK** — no stranded 8/4 meta row | **OK** | **OK** — editorial pair grid | **OK** 0 |
| `/programs` | **FIXED** — H1 x=64 | **FIXED** — shared `ProgrammeRow` | **OK** | **OK** | **OK** 0 |
| `/programs/functional-training` | **OK** — H1 x=64 | **OK** — detail spec columns, not discovery 8/4 | **OK** | **OK** | **OK** 0 |
| `/programs/yoga` | **OK** | **OK** | **OK** | **OK** | **OK** 0 |
| `/programs/adult-dance` | **OK** | **OK** | **OK** | **OK** | **OK** 0 |
| `/locations` | **FIXED** — shared `BranchRow` | **FIXED** | **OK** — H1 x=64 | **OK** | **OK** 0 |
| `/locations/airoli-sector-19` | **OK** | **OK** | **OK** | **OK** | **OK** 0 |
| `/pricing` | **OK** — utility/narrow commercial bands kept | **OK** | **OK** — H1 in narrower utility measure (x=112) | **OK** — not a stranded discovery row | **OK** 0 |
| `/timetable` | **OK** — same utility measure as pricing | **OK** | **OK** | **OK** | **OK** 0 |
| `/trial` | **FIXED** — shared gutter, H1 x=64 | **OK** — form split, light inputs kept | **OK** | **OK** | **OK** 0 |
| `/contact` | **FIXED** — shared gutter, H1 x=64 | **OK** | **OK** | **OK** | **OK** 0 |

No new P1 invented on pricing/timetable utility bands. Those remain a narrower commercial measure by design.

## Human acceptance

1. Hero crop at 1536×730: **YES** — short-viewport focal `68% 18%`, viewport-safe min-height. Heads remain in frame; no empty bar; no overflow.
2. Hero→programmes one page: **YES** — both left edges 64px.
3. Programme metadata stranded at far edge: **NO**.
4. Functional Training + All branches one glance: **YES** (28px column gap).
5. Branch details/actions connected: **YES**.
6. Useful whitespace preserved: **YES** — breathing is to the right of the group, not between related items.
7. Free-trial CTA distinct: **YES** — cream fill, dark ink, on purple band.
8. Trial support copy uses width: **YES** — ~62ch / 636px, two lines, not a 14ch stack.
9. FAQ + QUICK ANSWERS aligned: **YES** — same start edge.
10. Other-route regression: **NO** scoped P1. Pricing/timetable keep utility measure.
11. Horizontal overflow: **0** at 390 / 768 / 1440 / 1536 / 1920.
12. CLS: verified in e2e gate (target ≤ 0.05).
13. Motion: no new animations; cue CSS untouched.
14. A11y: inverse trial CTA for contrast; accordion padding only.
15. All six reported bugs visibly resolved: **YES**.
