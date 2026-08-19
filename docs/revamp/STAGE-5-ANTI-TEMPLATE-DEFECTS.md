# Stage 5 — Anti-template defect inventory

Audit: local preview with `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true` at 390 / 768 / 1440 / 1920. Judged from rendered pages, not source alone.

| ID | Sev | Route family | Visual symptom | Proposed compositional response |
|---|---|---|---|---|
| AT-01 | P0 | Programme detail (all 7) | Same hero skeleton: copy left + media rectangle + facts card right | Four composition families via `data-compose-family`; retire shared 3-col hero |
| AT-02 | P0 | Programme detail | Identical bordered summary “dashboard” card on every service | Family-specific meta: vertical rail / horizontal strip / quiet type / intimate stack — fewer boxes |
| AT-03 | P0 | Programme detail | Universal “At a glance” + bordered glance panels | Service-specific section labels + typographic facts; boxes only when grouping helps |
| AT-04 | P1 | Programme detail | Personality mainly from image/colour, not composition | Distinct grid ratios, media placement, and meta rhythm per family |
| AT-05 | P1 | Programme index `/programs` + home | Identical full-width bordered programme rows in every cluster | Controlled width/rhythm variation; Functional primary mass; Celebrate closes sequence |
| AT-06 | P1 | Home Machine-free | Reads as text block + photo + list (assembled, not composed) | One editorial story: offset media + principle rail aligned to media edge |
| AT-07 | P1 | Home locations | Four nearly identical branch cards | Numbered editorial rows; locality leads |
| AT-08 | P1 | About | Repeated same-width bands; founder not distinct | Founder typographic anchor (Founded 2019); vary band widths/pairings |
| AT-09 | P2 | Locations index | Atmosphere + four similar BranchRows feel generic | Numbered 01–04 rows; atmosphere as thin compositional strip only |
| AT-10 | P2 | Branch detail | Acceptable shared structure; risk of empty “hero hole” if media slots appear | Keep text-led; large locality identity; practical info rail — no fake media |
| AT-11 | P1 | Utility (pricing/timetable/trial/contact) | Wide left blank + form panel; leftover feel on desktop | Intentional split ratios; fee/hours facts lead into builder; no decorative media |
| AT-12 | P1 | Sitewide | Excessive bordered boxes/rows as default styling | Prefer spacing, rails, partial rules, type scale; borders intentional |
| AT-13 | P1 | Sitewide | Horizontal rules of unrelated lengths | Documented rule language: section / accent / rail / cue |
| AT-14 | P1 | Desktop 1440–1920 | Content stays narrow while canvas empties; mobile layout stretched | Offset media, multi-column facts, intentional negative space |
| AT-15 | P2 | Tablet 768 | Desktop grid squeezes awkwardly before mobile | Tablet-specific compose rules for heroes and splits |
| AT-16 | P2 | Programme detail | Section sequencing identical on all services | Family-controlled section order/weight; keep verified content only |

**Out of scope / do not fake:** branch photography, trainer portraits, invented wedding process steps, new animation libraries, Stage 6 work.
