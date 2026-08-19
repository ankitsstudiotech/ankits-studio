# Production Bug Batch 03 — Global recurrence ledger

Checkpoint: `studio-pulse-before-production-bug-batch-03-global-sweep` @ `ff079ca`.
Production at start: `ff079ca` / `dpl_D3MdkzVgJzAS9BMiUXpZfzi1n15x`.
Evidence: `docs/revamp/screenshots/production-bug-batch-03/`.

Audited 22 indexable public routes plus withheld `/trainers`, `/transformations`, `/blog` (shared chrome only) at 360 / 390 / 430 / 768 / 1024 / 1366 / 1440 / 1536 / 1920, with deep captures at 390 / 768 / 1536 / 1920.

## Defects

| ID | Route | Viewport | Family | Observed defect | Root cause | Shared/local | Severity | Fix | Evidence | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| R03-01 | `/about` | 1536 / 1920 | B | Programme name and delivery meta (`In studio` / `Home`) stretched across the pair column with 500px+ dead space | `.disciplineIndex a { justify-content: space-between }` | Shared `.pulse-related-pair` | P1 | Bounded copy + meta + 1fr breathing; meta `justify-self: start` | `after-1536-about-disciplines.png` | **FIXED** |
| R03-02 | `/locations/[slug]` (all four) | 1536 / 1920 | B | Service / related rows pin a `→` to the far edge (1200–1700px gap) | `.serviceList a` / `.relatedList a` `space-between` + full-width flex | Shared `.pulse-related-pair` | P1 | Same bounded pair; divider remains full row width | `after-1536-branch-services.png` | **FIXED** |
| R03-03 | `/about` (leak also on withheld trainers / stories) | ≤719 | D | Adjacent bands used a 2px / brighter rule instead of the 1px structural token | `.band + .band { border-top-width: 2px }` | Local copies of one anti-pattern | P1 | Remove thickness/colour override; keep `--rule-structural` | 390 About after | **FIXED** |
| R03-04 | Programme detail related links | all | D | Structural underline changed colour on hover | `.relatedLink:hover { border-bottom-color: volt }` | Local | P1 | Hover colour on text only; rule stays static | source | **FIXED** |
| R03-05 | Home, `/locations`, branch pages, `/contact`, Reviews fallback | all | Maps | “Open in Maps” / “View on Google” used owner `maps.app.goo.gl` short URLs that **302 to `/maps/dir/`** (navigation) for three of four branches | Short links are directions shares; code passed them through | Shared `getBranchMapsUrl` | P1 | Public href is the same listing’s place `cid` URL; owner short URL stays in content | `docs/revamp/GOOGLE-MAPS-LINK-VERIFICATION.md` | **FIXED** |

## Summarized OK matrix

Families with **no additional P1** after inspection (do not pad):

| Family | Result |
|---|---|
| A alignment | OK on public routes. Footer Explore/Branches is a two-column group, not a kicker/heading mismatch. Homepage Founder kicker aligns with its own H2. |
| C empty desktop | Remaining wide right fields on branch openings and utility pages are **intentional editorial whitespace**, not stranded 8/4 meta. About opening facts sit in an editorial `1.55fr / 1fr` pair (Batch 01 already accepted). |
| E programme cues | One purple `.programme-cue`, 2px, ~38px, one hover `scaleX`. No `cueSeg` / `cueFine` / cluster cue colours. Branch grey cues unchanged. |
| F contrast | Home trial inverse cream CTA intact. Programme/location purple CTAs sit on field, not on a purple band. No new inverse colour invented. |
| G measure | No 15-character columns or 150-character body lines found on representative 1536/1920 captures. |
| H crops | No new crop P1 at 390 / 768 / 1536×730 / 1920. No asset regeneration. |
| I duplication | Header/footer brand only. No duplicate logo/title/CTA in the same viewport. |
| J sticky CTA | Eligible routes only; does not persist as a second in-page duplicate. Architecture not reopened. |

Pricing / timetable keep the **narrower utility measure** (Batch 01). Not a P1.
