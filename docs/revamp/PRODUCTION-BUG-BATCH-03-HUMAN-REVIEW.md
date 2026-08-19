# Production Bug Batch 03 — Human review

Evidence: `docs/revamp/screenshots/production-bug-batch-03/`.
Grammar: Batch 01 spatial + Batch 02 line.

## SPACING / GRID

1. Any heading accidentally misaligned with its eyebrow? **NO** (after sweep). Footer Explore/Branches is a two-column group, not a kicker.
2. Any neighbouring sections with unexplained gutter jumps? **NO** on public routes. Pricing/timetable keep the narrower utility measure by design.
3. Any related metadata stranded at the opposite edge? **NO** after R03-01 / R03-02.
4. Any branch/programme row with giant dead space between related items? **NO** after R03-01 / R03-02. Homepage programme/branch rows remain Batch 01 bounded pairs.
5. Any 1536/1920 section that looks half-rendered? **NO P1.** Branch openings and some utility bands keep intentional left measure; they are not stranded 8/4 rows.
6. Any body copy unnecessarily narrow? **NO P1.**
7. Any body copy uncomfortably wide? **NO P1.**

## LINES

8. Any structural divider dashed? **NO** on public Pulse routes (leftover dashed placeholders exist only in unused design-lab components).
9. Any structural divider randomly short? **NO** — row rules remain full shared-container width.
10. Any double structural lines? **NO P1.**
11. Any forgotten non-purple programme cue? **NO.** Branch grey cues are not programme cues.
12. Any programme with >1 cue? **NO.**
13. Any cue using old segments? **NO.**

## SURFACES / CTA

14. Any accent CTA disappearing on accent background? **NO** remaining. Home trial inverse cream remains. Programme closing CTA sits on a lightly tinted field, not a purple band.
15. Any obvious contrast mismatch? **NO P1.**
16. Any giant marketing surface that looks like a foreign design system? **NO.**

## MEDIA

17. Any important face/head cropped at 1536×730? **NO** new crop P1 (Batch 01 hero focal still in place).
18. Any important subject clipped at mobile/tablet? **NO P1.**
19. Any media causing overflow? **NO** (overflow 0 at 390 / 768 / 1536 / 1920).

## DUPLICATION

20. Any obvious duplicate logo/title/CTA/helper copy? **NO.** Header + footer brand is intentional.

## MAPS

21. Does every branch Maps link use the final owner URL? **Owner short URL remains in content. Public href is the place listing for that same destination** (required because the short URL 302s to Directions).
22. Does any link accidentally force Directions? **NO** after the place `cid` href.
23. Are review-fallback links accurate? **YES** — “View on Google”, same place hrefs.
24. Do external link attributes pass? **YES** (`target="_blank"` `rel="noopener noreferrer"`).

## REGRESSION

25. Batch 01 still intact? **YES.**
26. Batch 02 still intact? **YES.**
27. Mobile still intact? **YES.**
28. Tablet still intact? **YES.**
29. Motion/reduced-motion intact? **YES** — no new motion; cue hover unchanged.
30. Any P0/P1 remaining from these established defect families? **NO** after R03-01–R03-05.

## Skills that produced concrete fixes

- **design-taste-frontend:** related information must scan in one glance — drove `.pulse-related-pair` instead of `space-between` across 1920px.
- **impeccable:** refine the existing grammar; no new visual system; inverse cream CTA not reinvented.
- **emil-design-eng:** do not animate layout or structural rules — removed volt border-color hover on related-list dividers; cue remains `scaleX`.
- **visual-qa-gate:** production screenshots at 390 / 768 / 1536 / 1920 before calling families OK; About/branch far-edge gaps were measured, not inferred from tokens.
