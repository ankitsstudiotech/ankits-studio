# Batch 06 — composition metrics

Human visual judgement over scanner thresholds. Occupancy is a suspicion signal, not an automatic fail.

Viewports for this table: **1536×730** unless noted. 1920 uses the site-wide left-aligned `--layout-content` (90rem) page-cap; ~80% occupancy there is the existing grammar, not an unfinished section.

Before figures are from live production (`https://ankits-studio.vercel.app`) at checkpoint `bc9075a` / tag `studio-pulse-before-batch-06-final-structural-cleanup`. After figures are from the Batch 06 implementation.

## Closing CTA bands

| Surface | Before occupancy (visual) | Before composition | After composition type | After occupancy (visual) | Human verdict |
|---|---|---|---|---|---|
| Home `#trial` | Copy+button left; unused right track (~60–70% empty field) | Left-cluster on purple band | Accent editorial close: copy left, cream CTA right | Action sits on the right of the content measure | **Pass.** Purple band still distinct from field. Cream CTA preserved. |
| About close | Heading/copy/button in left measure | Left-cluster | Field `ClosingBand` | Action counterweight on the right | **Pass.** |
| Functional close | Same | Left-cluster | Field `ClosingBand` | Same family | **Pass.** Compact (~250px), not a giant empty band. |
| Airoli 19 close | Same | Left-cluster | Field `ClosingBand` + branch-aware sentence | Same family | **Pass.** |
| `/trainers` | Same | Left-cluster | Readiness variant | Availability CTA right | **Pass.** Not a free-trial heading. |
| `/transformations` | Same | Left-cluster | Readiness / page CTA copy | Action right | **Pass.** |
| Corporate Wellness close | Enquiry copy, still left-clustered | Left-cluster | Enquiry variant of `ClosingBand` | Action right | **Pass.** No consumer trial semantics. |

Gate used: useful content entirely in ≤45% width for >220px with no action/media/counterweight → fail. After redesign the CTA is the counterweight.

## Facts

| Programme | Item count (after) | Before layout | After layout | Empty CSS-grid cells | Human verdict |
|---|---|---|---|---|---|
| Functional Training | 3 (Who / Session / Options) | Fixed 2-col snapshot; odd leftover / low occupancy | 3-col at ≥1024; 2+1 at tablet | 0 | **Pass.** Not dashboard cards. Trial stripped (hero already has it). |
| Yoga | 3 | Same 2-col family | Same content-aware primitive | 0 | **Pass.** |
| Zumba | 3 + Good to know | Same | 3 facts; 1 unique Q as Good to know | 0 | **Pass.** |
| Dance | 3 | Same | Options carries ladies/kids | 0 | **Pass.** |
| Wedding | 2 | Same | 2×1 / 2-col | 0 | **Pass.** |
| Home PT | 2 | Same | 2-col | 0 | **Pass.** |
| Online | 2 + Good to know | Same | 2-col | 0 | **Pass.** |
| Corporate Wellness | 2 | Same | 2-col; no ladies/kids Options | 0 | **Pass.** |

“What the session may include” is a CSS multi-column list (`columns: 1/2/3`), not an equal-cell grid. Functional has more items; Wedding/Online fewer. No empty cells, no invented bullets.

## FAQ

See `BATCH-06-FAQ-INVENTORY.md`. Summary: no remaining standalone 1-question “FAQ” chapter on audited routes. No questions invented.

## Other Batch 06 surfaces

| Surface | Before | After | Verdict |
|---|---|---|---|
| About Team / FAQ | 50/50 with tiny FAQ | Full-width Team; FAQ absorbed | **Pass.** |
| Related + Locations | Thin locations aside | Related takes main width; “Train near you / Find a studio” compact track (`13.5rem`) | **Pass (P2 refine).** Not a directory, not a new card. |
| Home Founder | Giant 2019 louder than the name | `ANKIT NALAWADE` display; `Founder · since 2019`; chronology kept | **Pass.** About hero 2019 untouched. |
| Getting Here | Since / Landmark repeated from hero | Hero rail kept. Getting Here: address/travel/parking/amenities + “On arrival” landmark phrasing | **Pass.** All four branches. |
| Pricing | Scanner-flagged unused field around the builder | Unchanged utility split (facts + enquiry). Visual read: efficient form, not a marketing paste | **Intentional — no change.** |
| Trial / contact / timetable | Utility routes | Same composition defect not present as P1 | **No change.** |

## Human review (prompt §28)

1. Closing CTAs no longer look pasted in the left corner. **Pass.**
2. Home purple band terminates the conversion chapter intentionally (FAQ still follows, pre-existing order). **Pass.**
3. Corporate CTAs remain enquiry-specific. **Pass.**
4. Programme facts are typographic rules, not dashboard cards. **Pass.**
5. Empty fact cells: **none.**
6. Odd counts: 3 → 3-col / 2+1. **Pass.**
7. Session-may-include accepts variable length. **Pass.**
8. Standalone one-question FAQ chapters: **none remaining.**
9. FAQ content not invented. **Pass.**
10. About Team/FAQ: full-width Team, FAQ absorbed. **Pass.**
11. Locations aside: compact action, not stranded directory. **Pass.**
12. Founder emphasizes Ankit over 2019. **Pass.**
13. Batch 05 heroes not reopened. **Pass.**
14. Getting Here no longer duplicates Since/Station/Landmark fields. **Pass.**
15. Pricing remains utility-first. **Pass.**
16. Trial/contact/timetable not unnecessarily redesigned. **Pass.**
17–20. Mobile stacks; tablet 2-col CTA; 1536 fills the measure; 1920 keeps page-cap. **Pass (confirmed in after captures).**
21. No P1 remaining in Batch 06 scope. **Pass.**
22–23. Batch 04 / 05 occupancy gates still in `e2e/composition-occupancy-gate.spec.ts`. **Must remain green.**

If any of 1, 5, 8, 10, 11, 21 had failed, this batch would not deploy.
