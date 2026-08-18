# Vertical-rule inset audit

Production bug family: a 1px vertical rule separates two content regions, but copy/media starts too close to the line.

Checkpoint: `studio-pulse-before-review-rule-spacing-fix` @ `021b2866656485524a5ca9b73f96e4fd5ac3a63b`.
Live production at audit time: `dpl_5hMvBbK6PGoedHALovgawboaJwb6` (READY, https://ankits-studio.vercel.app).

Classification:

- **A** — cell / grid boundary; inner padding already sufficient — no change
- **B** — content separator; copy/media glued to the rule — fix
- **C** — decorative / accent rule, not a content splitter — no change
- **D** — form-control border — no change

Shared token: `--spacing-rule-content: 1.5rem` (24px). Introduced because two genuine recurrences needed the same inset. Nearest existing scale (`--spacing-gutter` is 1.25rem / 20px, which was the glued-side miss).

| Route | Component | Rule type | Current inset | Visual verdict | Change | Final inset |
|---|---|---|---|---|---|---|
| `/` Reviews rail | `GoogleReviewsRail` / `.googleProofLiveItem` | Content separator (`border-right` on item; next item `padding-inline-start: 0`) | Before: 20px after the rule on the owning cell, **0px** before the next cell’s content. Last cell `padding-right: 0`. | **B** — avatars/names sit on the rule | **FIX** — `padding-inline: var(--spacing-rule-content)` on every cell; `border-inline-start` on items after the first; drop last-child `padding-right: 0` | 24px both sides of the rule; 24px at rail start/end |
| `/locations` directory @ ≥1200px | `.studioColumn` | Content separator (`border-right`; following column `padding-left: 0`) | Before: 20px after the rule, **0px** into the next column | **B** — locality names start on the rule | **FIX** — `padding-left: var(--spacing-rule-content)` on `:not(:first-child)`; keep first column on the shared left edge | 24px after first column’s rule; last column still flush-right |
| `/locations` directory @ 768 | `.studioColumn` | Content separator (odd `border-right` + 1.35rem; even `padding-left: 1.35rem`) | ~21.6px after the rule | **A** — not glued | No change | ~21.6px |
| `/` programme matrix | `.moduleMatrix` + `.row[data-layout="module"]` | Cell boundary (outer `border-left` + per-cell `padding: 1.1rem 1.15rem` + `border-right`) | ~18px inside each cell | **A** | No change | ~18px cell padding |
| `/` Branches | `.branchRows` / `.branchRow` | Cell boundary (`padding: 1.15rem 1.1rem` + `border-right`) | ~17.6px inside each cell | **A** | No change | ~17.6px |
| `/programs` pair bands | `.pairModule` | Content separator (first `padding-right: 1.5rem`; last `padding-left: 1.5rem`) | 24px both sides of the rule | **A** | No change | 24px |
| `/` Founder | `.founderGrid` | Gap only, no vertical rule | 3rem column-gap | **C** | No change | — |
| `/about` editorial splits | `.split` / `.pairGrid` | Gap only, no vertical rule | 2.5rem gap | **C** | No change | — |
| `/about` chronology | `.chronology li` | Horizontal `border-top` | 0.45rem above | **C** | No change | — |
| `/about` disciplines | `.disciplineLink` | Horizontal `border-bottom`; column-gap 1.35rem | No vertical rule | **C** | No change | — |
| Programme detail facts | `.metaRail` / `.metaItem` | Accent (`border-left: 2px` + 1rem) or compact meta (`0.85rem`) | 16px / 13.6px | **C** — accent/meta, not body-copy splitter | No change | unchanged |
| Programme related services | `.relatedIndexLink` | Horizontal rules + column-gap 1.5rem | No vertical content rule | **C** | No change | — |
| Branch related / service index | `.serviceIndexLink` | Horizontal rules + column-gap | No vertical content rule | **C** | No change | — |
| Trainers opening facts | `.openFacts` | Content separator (`border-left` + `padding-left: 1.25rem`) | 20px | **A** — not glued | No change | 20px |
| Footer | `SiteFooter` group columns | Content separator (`xl:border-r` + `xl:px-8`) | 32px | **A** | No change | 32px |
| `/` trust / diff list | `.diffList li` | Decorative accent (`border-left: 2px` + 1rem) | 16px | **C** | No change | unchanged |
| Pricing / timetable | `.control` | Form field border | 12px | **D** | No change | unchanged |
| Pricing / timetable lanes | `border-left: 3px` accent | Decorative | padded cells | **C** | No change | unchanged |
| `/trial` `/contact` | form controls | Form field border | control padding | **D** | No change | unchanged |
| Design-lab `/design-lab/revamp-*` | prototype rules | Out of production | — | Out of scope | No change | — |
| Hero guides / `.editorial-guides` | `::before`/`::after` | Decorative page-edge rules | not adjacent to copy | **C** | No change | — |

## Review rail before → after (measured)

| Viewport | Before inset | After inset |
|---|---|---|
| 390 / 768 / 1536 / 1920 | `padding-inline-start: 0`, `padding-inline-end: 20px` (last item 0), `border-right: 1px`, `scrollbar-width: thin` | `padding-inline: 24px` (`--spacing-rule-content`), `border-inline-start` on following items, `scrollbar-width: none` |

## Disclosure before → after

| Before | After |
|---|---|
| Body lede: “Reviews supplied by Google Maps. Text reviews are shown in Google relevance order, up to two per studio.” | Compact metadata: “Shown in Google relevance order · up to 2 per studio” (`0.78rem`, muted) |
| Note: “Reviews aren’t verified by Google…” | Removed from visible UI |

Google Maps text attribution is unchanged.

## Scrollbar

`.googleProofRail` keeps `overflow-x: auto`. Visual scrollbar hidden via `scrollbar-width: none`, `-ms-overflow-style: none`, and `::-webkit-scrollbar { display: none }`. Wrap remains `overflow: hidden` only as a paint containment shell around the still-scrollable rail.
