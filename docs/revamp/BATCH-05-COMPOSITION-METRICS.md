# Batch 05 — hero / narrative composition metrics

Source: Claude-style occupancy scanner (`docs/revamp/_scan-batch-05-occupancy.mjs`) against production (before) and local after the redesign. Numbers are evidence, not design instructions.

Review signals at ≥1366 (not automatic failures):

- occupancy &lt;55% **and** no media / fact / identity counterweight
- unused-right &gt;35% for ≥280px band height
- split second zone &lt;20% meaningful content

1920 occupancy ~80% with unused-right ~20% is the existing `--layout-content: 90rem` page cap — not an unused hero column.

Yoga `flagH` remaining after the fix is row-clustering vs a tall image (title/meta rows do not share the image’s vertical centre). Occupancy is 100%/80% because the image reaches the content edge. Human verdict: connected Calm pair; not the previous empty grid cell.

| Surface | Viewport | Before occ | After occ | Before unused-right | After unused-right | Before flagH | After flagH | Before maxRowRE | After maxRowRE | Counterweight | Scanner | Human |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| About opening | 1536 | 100%* | 100% | 0% | 0% | 172 | 81 | 67% | 57% | Oversized 2019 + founding rail | composed | Pass |
| About opening | 1920 | 80% | 80% | 20% | 20% | 172 | 81 | 74% | 66% | Same | composed | Pass |
| Home founder | 1536 | 100%* | 100% | 0% | 0% | 141 | 44 | 92% | 64% | Oversized 2019 + chronology | composed | Pass |
| Home founder | 1920 | 100%* | 80% | 0% | 20% | 141 | 175 | 94% | 71% | Same | composed | Pass |
| Airoli 19 hero | 1536 | 38% | 100% | 62% | 0% | 413 | 91 | 86% | 62% | Directory 01 + locality rail | composed | Pass |
| Airoli 19 hero | 1920 | 30% | 80% | 70% | 20% | 413 | 91 | 89% | 70% | Same | composed | Pass |
| Airoli 8 hero | 1536 | 38% | 100% | 62% | 0% | 413 | 91 | 86% | 62% | Directory 02 + locality rail | composed | Pass |
| Airoli 8 hero | 1920 | 30% | 80% | 70% | 20% | 413 | 91 | 89% | 70% | Same | composed | Pass |
| Ghansoli hero | 1536 | 38% | 100% | 62% | 0% | 344 | 91 | 86% | 62% | Directory 03 + locality rail | composed | Pass |
| Ghansoli hero | 1920 | 30% | 80% | 70% | 20% | 344 | 91 | 89% | 70% | Same | composed | Pass |
| Thane hero | 1536 | 38% | 100% | 62% | 0% | 344 | 91 | 86% | 62% | Directory 04 + locality rail | composed | Pass |
| Thane hero | 1920 | 30% | 80% | 70% | 20% | 344 | 91 | 89% | 70% | Same | composed | Pass |
| Yoga hero | 1536 | 100%* | 100% | 0% | 0% | **600** | **600** | 82% | 82% | Calm media filling adjacent 1fr (lede→image **92px**) | REVIEW (row cluster) | Pass — gulf removed |
| Yoga hero | 1920 | 80% | 80% | 20% | 20% | **610** | **612** | 86% | 86% | Same (lede→image **92px**) | REVIEW (row cluster) | Pass — gulf removed |

\* Span occupancy was already high on About / founder / Yoga before the fix because a right-edge leaf existed (tiny facts, or the image). **Row-empty and flagH** were the real defects: founder 92–94% row-empty; Yoga 600px flagged gulf; branch heroes a true 30–38% occupancy with no right leaf.

## Programme openings at 1536 (after)

| Programme | Family | Verdict | Note |
|---|---|---|---|
| Functional Training | structured | **PASS** | 5/4/3 title + media + meta. Media is the counterweight. |
| Home PT | service / home | **NO CHANGE** | Small media is the intimate service variant, not an empty grid cell. |
| Online | service / online | **NO CHANGE** | Same compact remote media mechanism as Home PT. |
| Zumba | fluid | **PASS** | Title + media; meta as a full-width fact row. |
| Yoga | calm | **FIXED SHARED MECHANISM** | Removed `"title ."` empty grid area, `align-self: end`, and `margin-top: 2.5rem`. Text track is `minmax(18rem, 32rem)`; media fills remaining 1fr after a 2rem breath. Measured lede→image gap **92px** at 1366/1536/1920 (was ~500–600px). |
| Dance | fluid | **PASS** | Media-forward fluid pair. |
| Wedding | service / ceremonial | **PASS** | Landscape media fills the second zone. |
| Corporate Wellness | service / corporate | **PASS** | Landscape service panel, not Home PT’s portrait. |

## Remaining scanner flags in Batch 05 scope

Yoga `flagH` ~600–612px at 1536/1920. Cause: leaf-row clustering (28px tolerance) treats the tall image as a different row from the title/meta, so title rows look right-empty even though the image occupies the adjacent column for the full hero height. Occupancy 100%/80%. Measured copy-to-image gap is 92px. Not an unused grid column.
