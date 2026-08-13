# Final production visual audit — 2026-08-13

Release-candidate evidence from a **production** `next start` build with
`ALLOW_MOCK_PUBLISH` unset, `ANKITS_CONCEPT_PREVIEW` unset, and
`NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA` not true.

Screenshots: `docs/revamp/screenshots/final-release-candidate-2026-08-13/`  
Contact sheets in that folder (data-URL raster, not `file:///` HTML).

This is a craft audit of the accepted Studio Pulse V1. It is **not** a redesign brief.

---

## 1. Does the site still look vibe-coded?

**Partly, in a contained way.** The homepage, locations PAPER chapter, and
Corporate Wellness page read as designed. Programme interiors still share one
strong Pulse grammar (kicker / display title / purple CTA / media / glance
grid), so the eight pages feel like a family rather than eight unique art
directors. That is the accepted system, not leftover assembly. Residual
vibe-code signals: desktop hero repeats the header lockup; some availability
copy is necessarily generic because exact batches are withheld.

Score as a professional studio site: **strong B / not a 10**.

## 2. Three strongest visual moments

1. Desktop home hero — copy left, illustrative training media filling the right plane, purple trial CTA in the first viewport.
2. PAPER continuation: branches → Google fallback on the same cream surface, then a hard cut to Founder on FIELD.
3. Corporate Wellness “FOR TEAMS” opening with workplace media and enquiry CTA (not trial).

## 3. Three weakest visual moments

1. Programme detail pages below the hero still rhyme too closely (glance grids, availability, closing CTA). Distinct families are readable in the hero, weaker in the body.
2. Desktop home repeats the brand lockup under the header.
3. Google fallback is honest but visually quiet — four locality rows, no quotes — which is correct for `external-links` and therefore less “premium social proof” than a live review chapter.

## 4. Is typography consistent?

**Yes.** Display headings are Bebas Neue, uppercase. Body and navigation are Space Grotesk. No heading using the wrong font in the audited public set.

## 5. Is casing consistent?

**Yes for the system.** Display titles are uppercase by CSS. Navigation is sentence-style (“Batch availability”). Kickers are uppercase. No accidental CamelCase in customer chrome.

## 6. Are gutters consistent?

**Yes** across Pulse routes (`--spacing-gutter`). Frozen `/design-lab` is out of public nav and was not restyled.

## 7. Are vertical spacing/rhythm consistent?

**Mostly yes.** Homepage chapters have deliberate FIELD / PAPER / purple trial / FIELD FAQ pacing. Programme pages use a repeating section rhythm that is consistent, if a little even.

## 8. Are dividers intentional?

**Yes.** Hero bottom rule, PAPER band edges, and programme glance separators align to the content grid. No midpoint-orphan rules found on the audited pages.

## 9. Is hybrid PAPER/FIELD treatment coherent?

**Yes.** Dark FIELD for hero, programmes, founder, FAQ. Cream PAPER for branches + Google. Purple trial band as the conversion interrupt. The Google chapter continuing PAPER after branches feels deliberate, not an accidental white slab.

## 10. Does hero feel premium?

**Yes on both 390 and 1440** once media has decoded. Mobile is copy/CTA first, then a reserved cinematic crop — not a media-only first screen. Desktop uses width on purpose.

## 11. Does motion materially improve the site?

**Yes, modestly.** Hero line mask, section reveals, programme row cues, FAQ, and drawer feel alive without becoming a showreel. Sticky CTA reveal is functional rather than decorative.

## 12. Is any animation distracting?

**No** on the production candidate. Reduced-motion paths keep content visible (e2e gates). Do not add more motion.

## 13. Are programme families genuinely distinct?

**Readable, not theatrical.**

| Family | Pages | Verdict |
|---|---|---|
| A Structured | Functional | Battle-rope / session-structure hero; densest “studio class” feel |
| B Fluid | Zumba, Dance | Energy / motion crops; still Pulse chrome |
| C Calm | Yoga | Quieter crop and lede |
| D Service | Wedding, Home PT, Online, Corporate | Service framing; Corporate uniquely FOR TEAMS / enquiry |

Do not normalize them into one hero template.

## 14. Are AI images believable enough for interim use?

**Yes, with the global disclosure.** They read as editorial illustration, not branch photography. Anatomy is acceptable at rendered size. No fake studio logos in the audited crops.

## 15. Is anything visually pretending to be factual evidence?

**No.** No AI founder portrait, named trainer portraits, named branch interiors, reviewer avatars, testimonials, transformations, or certifications. Google fallback has no stars, quotes, or counts. Footer discloses illustrative AI.

## 16. Is mobile composition intentional?

**Yes at 390×844.** First viewport: logo, heading, support copy, primary WhatsApp CTA, secondary nearest-studio CTA. Sticky bar on programme pages does not cover the hero CTA. No horizontal clip in the 360–430 overflow gates.

## 17. Is tablet intentional?

**Yes at 768.** Single-column editorial with the same chrome. Not a broken desktop squeeze.

## 18. Is desktop intentional?

**Yes at 1440 and 1920.** Hero split uses the width. Programme rows and PAPER chapters are not a narrow mobile column. Empty dark hero media in an earlier capture was local image-optimizer saturation under parallel screenshot load, not a missing asset — recaptured after a fresh `next start`.

## 19. Is conversion obvious?

**Yes.** Header trial CTA, in-page purple CTAs, Corporate enquiry CTA, WhatsApp builders on trial/pricing/timetable. Phone `+919372402074` and email `ankitsstudio5@gmail.com` in footer and contact.

## 20. Is the Google fallback honest?

**Yes.** Title **Reviews on Google**. Lede: “Explore Google feedback for each of our four studios.” Actions: **View on Google**. Four branch rows. No quotes, stars, avatars, or “What members say” in this mode.

## 21. Any customer-facing developer/provenance language?

**No** on indexable production HTML. The yellow Development/Mock preview banner is absent when `NODE_ENV=production` and `ALLOW_MOCK_PUBLISH` is unset. Global AI disclosure is the allowed exception.

## 22. Any route visibly weaker than the rest?

**Withheld** `/trainers`, `/transformations`, `/blog` are correctly thin and noindex — do not promote them. Among indexable routes, **timetable** is the quietest (hours + WhatsApp, no fake grid) by policy. **Legacy programme notices** are noindex holding pages.

## 23. Any P0?

**None remaining.** Banner leak was configuration (`ALLOW_MOCK_PUBLISH=true` in the local shell / `next dev`), not a production CSS hide. Production build and Vercel Production env do not set that flag.

## 24. Any P1?

**Fixed in this task:** Google fallback heading implied quotes (`What members say`) while mode is `external-links`. Now **Reviews on Google** for fallback; live mode may still use **What members say**.

No other P1 on the audited public set.

## 25. Is this sufficiently polished to show in a professional portfolio?

**As a shipped local-business site, yes. As a photography-final case study, not yet.** Illustrative AI and the quiet Google fallback are honest interim states. Do not present them as a finished brand film.

## 26. Is this sufficiently safe to launch publicly today?

**Yes**, provided Production stays on the environment contract below (no mock-publish, no concept-preview, no synthetic flag). Launch-critical content is verified; soft mock domains stay noindex.

---

## Historical bug regression (A–H)

| Item | Verdict |
|---|---|
| A Logo | Transparent symbol, no white plate, not stretched |
| B Typography | Display uppercase + Grotesk body consistent |
| C Programme rows | Train / Move / Celebrate / For Teams with cues |
| D Section alignment | No orphan Machine-free slab; homepage order is Hero → Programmes → Branches → Google → Founder → Trial → FAQ |
| E Branch copy | No “open neighbourhood studio”; Maps/studio page actions |
| F Surface rhythm | PAPER after branches is intentional |
| G CTA visibility | Purple on dark is legible; Corporate enquiry distinct |
| H Dividers | Grid-aligned |

---

## Anti-slop (objective only)

No fake dashboards, neon leftovers, unexplained border boxes, or per-image “AI concept preview” badges. Repeated Pulse chrome on programme pages is **P2 taste**, not a launch blocker.
