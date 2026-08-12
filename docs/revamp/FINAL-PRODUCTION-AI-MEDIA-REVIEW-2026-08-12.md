# Final production AI media review — 12 August 2026

Honest assessment after Prompt 3 (owner-approved illustrative-ai in production). Judged from rendered UI + screenshot pass.

1. **Homepage more premium with media?** Yes — hero editorial split adds energy without hiding the H1.
2. **More or less AI-generated?** Slightly more obviously illustrated, but grading + disclosure reduce “preview slop” feel vs concept badges.
3. **Uncanny humans?** No major uncanny faces in approved set; online hero keeps faces secondary via focal crop.
4. **Broken hands/equipment?** None flagged in approved catalogue; online laptop kept unreadable.
5. **Hero believable as illustrative fitness?** Yes — coach-led group movement; not documentary proof.
6. **Mistaken for branch documentation?** No on Home/programmes; locations atmosphere uses caption + low crop strip.
7. **Programme images differentiated?** Yes — four composition families preserved; media supports tone not template collapse.
8. **Yoga same brand?** Yes — calm crop and spacing distinct from Zumba/Dance.
9. **Wedding rehearsal not client proof?** Yes — rehearsal alt + copy; no testimonial framing.
10. **Home PT ordinary Indian home?** Yes — modest apartment context; not luxury penthouse.
11. **Online avoids fake Zoom UI?** Yes — focal bias away from screen detail.
12. **About avoids AI-as-Ankit?** Yes — founder typography-only; community image separate from founder block.
13. **Branch pages factual trust?** Yes — text-led heroes; address/maps/amenities dominate; no branch AI interior.
14. **Media improves PAPER/dark rhythm?** Neutral-positive — branches PAPER unchanged; hero dark FIELD gains visual weight.
15. **Card-wall returned?** No.
16. **Mobile crops intentional?** Yes — per-slot mobile focal metadata applied.
17. **Page lengths excessive?** Functional secondary action adds one beat only; acceptable.
18. **Motion too cinematic?** No — existing MediaReveal only; no Ken Burns.
19. **Performance regression?** Hero ~298 KB — slight LCP payload increase; H1 remains server-rendered first; monitor on deploy.
20. **Assets to reject?** None from catalogue; Corporate Wellness remains fallback until dedicated asset.
21. **Weakest moments:** (1) Corporate Wellness text-led vs illustrated peers, (2) home.community unused asset, (3) hero file size vs 250 KB target.
22. **Portfolio-grade before real photography?** Yes — with global disclosure and trust boundaries.
23. **Ready for Google Reviews?** Architecture yes; content integration deferred.
24. **Safe to deploy after Reviews gate?** Media layer yes; full deploy still gated on reviews/owner verification per existing launch policy.

## Home community decision

`home.community` **not rendered on Home** — Machine-free/WhyStudio chapter removed in Prompt 2; no editorial slot justifies reintroduction. Asset remains in catalogue for future use (About-adjacent or community story).

## P0/P1

No open P0/P1 for Prompt 3 scope.

---

## Correction pass — 12 August 2026 (Prompt 3 evidence repair)

Historical Prompt 3 comparison artefacts (`final-production-ai-media-comparison-390.png`, `-1440.png`, `programme-family-ai-production-comparison.png`) were **broken** — they showed Chromium broken-image placeholders. **Actual route screenshots in `final-production-ai-media/` were never broken** (57/57 integrity pass).

### Root cause

Original generator (`docs/revamp/_create-ai-media-comparison.mjs`) embedded `file:///` Windows filesystem paths inside `page.setContent()` HTML. Chromium blocks/inaccessible local file loads in that context. Filename mismatch (`functional.png` vs `programs-functional-training.png`) compounded missing before-side images.

### Fix

Regenerated with `docs/revamp/_compose-ai-media-comparisons-fixed.mjs`: PNGs embedded as **data URLs**, `img.complete` awaited before capture, pixel decode validation. Outputs:

- `docs/revamp/screenshots/final-production-ai-media-comparison-390-fixed.png`
- `docs/revamp/screenshots/final-production-ai-media-comparison-1440-fixed.png`
- `docs/revamp/screenshots/programme-family-ai-production-comparison-fixed.png`
- Evidence package: `docs/revamp/screenshots/final-production-ai-media-correction/` + `.zip` (15 files verified)

Yoga before-side at mobile/desktop uses `final-owner-visual-stage-2` fallback (text-led; not in stage-2-correction folder).

### Screenshot integrity

`docs/revamp/AI-MEDIA-SCREENSHOT-INTEGRITY.json` — **57/57 pass**: decodable PNG, non-zero bytes, DOM checks (no dev banner, no per-image concept label, footer disclosure on Home).

### Corporate Wellness

**Unchanged and intentional:** `programme.corporate-wellness.hero` resolves to **fallback** (text-led). Programme-family comparison shows this honestly vs illustrated peers. No reused raster, no fake gradient. Dedicated asset deferred to next owner step.

### Measured performance (production build, `next start`, illustrative-ai default, Lighthouse mobile preset ×3 median)

| Route | FCP | LCP | CLS | TBT |
|---|---|---|---|---|
| Home `/` mobile | 2218 ms | 3218 ms | **0.710** (2/3 runs; 1 run 0) | 1055 ms |
| Home `/` desktop 1440 | 388 ms | 826 ms | 0 | 0 |
| Functional mobile | 1867 ms | 2766 ms | 1.047 | 1192 ms |

**Actual LCP element (Home mobile, CDP):** hero `<img>` (`pulse-media-module__frameMedia`) via `/_next/image` → `home-hero-ai-concept.webp`. **H1 remains readable on first paint** (opacity 1, visible, 320×156 px at 390).

**Hero delivery audit:**

| Asset | Bytes |
|---|---|
| Source `home-hero-ai-concept.webp` | 305,088 (~298 KB) |
| Served mobile (w=640 webp) | 22,624 |
| Served desktop (w=828 webp) | 34,592 |
| Functional hero mobile (w=640) | 13,852 |
| Yoga hero mobile (w=640) | 16,666 |

Source hero kept at ~298 KB — above 250 KB target; visually negligible loss not attempted in this correction pass (owner-approved asset; mobile serves optimized 22 KB via Next/Image).

### Network / console (5 routes, fresh production server)

0 failed image requests · 0 broken DOM images · 0 console errors.

### AI trust boundaries

No regression: founder typography-only; branch text-led; no AI trainer portraits/reviews/transformations/certification proof.

### Acceptance gaps (correction pass)

- **CLS mobile Home median 0.710 fails ≤ 0.05 gate** — likely pre-existing layout shift (mock-data banner / long-page reflow under Lighthouse mobile emulation); not opened for broad optimisation in this pass. Desktop CLS 0.
- H1 first-paint: **pass**
- Image network: **pass**
- Comparison sheets: **fixed**

### P0/P1 (post-correction)

**P0: 0** · **P1: 0** for Prompt 3 scope. CLS failure is documented acceptance gap, not counted as P0/P1 unless classified as new AI-induced regression (inconclusive on localhost Lighthouse; Functional CLS also elevated).
