# Batch 04 — Root Cause 1 row-list inventory

Checkpoint: `studio-pulse-before-dead-space-row-redesign` @ `dfa7d35`.  
Source occupancy: Claude independent scanner vs live production, 1536×730 unless noted.

Scope is the shared sparse full-width row/list family. Not About/branch heroes, not `.snapshotFacts`, not Reviews.

## Mechanism

Full-width section track + content-poor row anatomy (ProgrammeRow `42rem + meta + 1fr` void, `.pulse-related-pair { width: 100% }`, stacked `.serviceList` / `.relatedList` / `.disciplineIndex`). Useful ink clusters left; the row still claims the canvas.

## Instances

| Route | Section | Current component | Occupancy (1536) | New visual variant | Reason |
|---|---|---|---|---|---|
| `/` | Choose how you want to move (`#services`) | `ProgrammeShowcase` → `ProgrammeRow` in `.lanes` (column, 1fr void ≥1200) | max row unused-right **69%**, flagged band **1311px** | **programme-discovery** — editorial matrix (featured Functional + paired Train + 3-col Move + Celebrate/Teams pair) | Eight programmes must share the field; TRAIN/MOVE/CELEBRATE/FOR TEAMS stay |
| `/` | Find your nearest studio (`#locations`) | `BranchExplorer` `.branchRows` stacked; body `36rem + actions` | max row unused-right **47%**, flagged band **512px** | **branch-discovery** — 2×2 locality index, numbering retained | Four branches do not deserve four giant sparse rows |
| `/about` | Programmes for different goals | `ol.disciplineIndex` + `.pulse-related-pair` inside `.pulse-split` | section max row unused-right **42%**, flagged band **329px** | **meta** — compact numbered 2-col editorial index | Support narrative; do not occupy a giant row track. About H1 hero is Batch 05 |
| `/programs` | Programme index (`#programmes-index`) | `ProgrammeDiscovery` → same `ProgrammeRow` stack | max row unused-right **77%**, flagged band **1750px** | **programme-index** — denser name \| descriptor/delivery columns | Related taxonomy, not a homepage clone; not eight equal cards |
| `/programs/functional-training` (and 7 siblings) | Related services + Locations | `splitFacts` 50/50 + full-width `.relatedList` | max row unused-right **51%**, flagged band **88px** (still sparse 50/50 vs 3+1 links) | **related-discovery** — one closing composition, asymmetric columns | Visual proportion follows content count |
| `/locations/airoli-sector-19` (and 8, Ghansoli, Thane) | Available at this branch | `ul.serviceList` + `.pulse-related-pair` + arrow | max row unused-right **97%**, flagged band **303px** | **compact-service-index** — 2/3-col typographic matrix | Worst instance; five short names ≠ five full-width rows |
| All four branch pages | Home, online & corporate | `ul.relatedList` + `.pulse-related-pair` + arrow | max row unused-right **91%**, flagged band **168px** | **compact-service-index** (same primitive, 3 items) | Same defective anatomy; three labels must share one band |
| `/contact` | Phone/email/studio lists | Local grid (`sm:grid-cols-2`), not ProgrammeRow / related-pair | n/a — not this primitive | **no change** | Primitive does not leak |
| `/trainers`, `/transformations` | Directory link lists | Local `.linkList`, not shared row family | n/a | **no change** | Leakage-only check; no shared component |
| `/timetable`, `/pricing` | Utility pages | Enquiry builders + directional `.linkList`; no ProgrammeRow | Audit: utility measure OK | **no change** | Defective visual primitive not used |
| `/locations` index | Branch atmosphere rows | `LocationDiscovery` + `BranchRow` + photo | WS-OK in independent audit | **no change** | Preserve photo treatment |

## Shared primitives (data vs visual)

| Primitive | Role after Batch 04 |
|---|---|
| `ProgrammeRow` | Shared **data** row (name, description, meta, cue, tone). Visual via `layout`: `featured` \| `cell` \| `index` |
| `.pulse-related-pair` | Adjacency helper only (`width: auto`). Must not stretch sparse labels through the page track |
| `serviceIndex` | Compact service matrix on branch pages |
| `relatedDiscovery` | Closing programme composition |

## Out of scope (do not treat as Batch 04)

About H1 hero, home founder counterweight, branch-page heroes, `.snapshotFacts`, odd-grid empty cells, “session may include” ragged row, single-item FAQs, Google Reviews API, new AI media.
