# Final AI-slop red-team

Visual review of local after-pass screenshots in `docs/art-direction/screenshots/final-editorial-pass/` against blueprint §17. Next.js “1 Issue” overlay appears only on local `next dev` captures — not a production defect.

Verdict: **no P0/P1**. Remaining notes are P2.

## Checklist (must be NO)

| Question | Answer |
|---|---|
| Generic card grid? | No. Home programmes are one framed field of cells. `/programs` is paired magazine bands. Locations are directory columns. |
| Random huge number with no information value? | No. `01–08` index programmes; `01–04` index branches; About `01–03` mark chapters. Home founder has no giant 2019. |
| Empty columns only because a grid was declared? | No. Directory and matrix cells hold name + facts + actions. |
| Decorative vertical lines that do not align to content? | No. Hero gutter/split rules; cell/column separators; footer column rules. |
| Purple used as filler? | No. Conversion, active nav underline, hover fill on programme modules, index numerals. |
| Every section another 50/50 split? | No. Home hero overlap, 4×2 matrix, 2×2/4-col directories, founder 7/5, closing 8/4. About retains some editorial splits (existing narrative). |
| CTA floating in a giant empty band? | No. ClosingBand is copy-left / action-right on a purple conversion chapter. |
| Utility page over-art-directed? | No. Pricing/trial/contact keep form-first; H1 + rules only. |
| Mobile a stack of giant desktop blocks? | No. Programme modules become compact numbered rows; directories become 1-col. |
| Variant/Stitch text leak? | No. Unit gate `tests/routes/final-art-direction-content-lock.test.ts` plus visual review. |
| Fabricated imagery in factual context? | No. Atmosphere remains captioned illustrative. No fake founder/branch interiors. |
| Design removed conversion or navigation? | No. Trial, Maps, studio pages, WhatsApp labels intact. |

## Per-route

| Route | Generated? | Why / why not | P1? |
|---|---|---|---|
| `/` hero | No | Overlapped media + production H1 + compact CTA cluster | |
| `/` programmes | No | Numbered 4×2 field, taxonomy key with production cluster ledes, purple hover | |
| `/` locations | No | 2×2 framed directory, real hours/landmarks | |
| `/` reviews | No | Author-led rail, Google attribution, no quote marks | |
| `/` founder | No | Name-led split, chronology rules, no fake portrait | |
| `/` close/footer | No | Large production heading, 4-col factual footer, AI disclosure | |
| `/programs` | No | Distinct from Home; paired media/type chapters | |
| Functional | No | Structured split + fact rail | |
| Yoga | No | Calm pacing, colour media retained | |
| Zumba / Dance | No | Fluid, colour retained | |
| Wedding / Home PT / Online / Corporate | No | Service family; Corporate stays B2B | |
| `/about` | No | Chapter marks on existing story; 2019 retained here | |
| `/locations` | No | 4-col directory, atmosphere separate | |
| Branch details | No | `01–04` numeral, existing hero family | |
| `/pricing` `/trial` `/contact` `/timetable` | No | Utility-first | |
| `/privacy-policy` `/terms` | No | Calm reading | |
| `/trainers` `/transformations` `/blog` | No | Chrome only, truthful readiness | |

## P2 (not blocking)

1. Local Next overlay (“1 Issue”) in after screenshots — development only.
2. Wedding Choreography / Corporate Wellness index modules still use existing non-photographic plates — no new generation in this pass.
3. About still uses a couple of narrative splits; they are content-driven, not a universal 50/50 template.
4. Review Google avatars remain small identity marks (API-provided). Square crop; not testimonial cards.
5. `/programs` pair 2 mixes Online + Zumba because production catalogue order is preserved — not a Stitch rewrite.

## Deploy gate

P0 = 0. P1 = 0.

Gates after this pass:

- axe color-contrast on dark field: footer/labels use `--color-accent-label` (raw `#6B2F7A` is 2.16:1 on `#0b0b0c`)
- occupancy: About opening stretched; `/programs` pairs equalized; measured pair sequence not the closing CTA
- content lock: banned Variant/Stitch phrases = 0; remaining word diffs are CSS uppercase / JSON-LD in `innerText`
- Playwright 155 passed; Vitest 433 passed; `tsc --noEmit` passed

Proceed.
