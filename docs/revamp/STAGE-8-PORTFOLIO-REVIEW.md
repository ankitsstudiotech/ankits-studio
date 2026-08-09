# Stage 8 — Portfolio review

Can this project credibly be shown as portfolio work? **Yes — with honest framing.**  
Do not present public V1 screenshots as a photography-led fitness brand piece. Do not use local synthetic imagery in a portfolio without labelling it as **AI concept preview**.

## Release statuses

| Gate | Status | Meaning |
|---|---|---|
| A. Technically production ready | **YES** | P0/P1 clear post Stage 8 fixes; gates, SEO, a11y smoke, conversion paths hold. |
| B. Public V1 ready | **YES** | Credible text-led machine-free multi-location studio site for public deploy (`synthetic=false`). |
| C. Portfolio-final ready | **NO** | Missing real photography, founder/trainer media, and consented social proof materially limit final presentation. |

## Scores (/10)

Judged primarily against **CURRENT PUBLIC V1** unless noted. Scores are not 10/10.

| Dimension | Score | Evidence |
|---|---:|---|
| UI/UX design | **7.5** | Strong editorial system, Train/Move/Celebrate, programme families, honest utility. Deducted for empty desktop media fields and thin proof surfaces. |
| Frontend architecture | **8.5** | Next.js App Router SSR content, typed content layer, media flag architecture, launch/indexing gates (ADR-002), lead adapters fail-closed. |
| Responsive design | **8.0** | Intentional 390 / 768 / 1440 / 1920 evidence; mobile editorial reduction held; tablet solid if less celebrated. |
| Motion design | **8.0** | Designed-in Stage 3 language, reduced-motion respect, LCP-aware first-line visibility. Not a motion demo reel. |
| SEO architecture | **8.5** | Server-rendered Tier 1, conservative JSON-LD, sitemap/robots alignment, hard 404s for unknown slugs, no fake Review schema. |
| Accessibility | **8.0** | Skip link, axe smoke clean on critical routes, keyboard/nav Escape, focus on trial; residual P3 a11y-tree quirk (S8-04) non-blocking. |
| Local-business conversion | **8.0** | WhatsApp-first trial/enquiry, clear free trial + ₹300 post-join, Maps outbound, multi-branch utility. Deducted for limited social proof and enquiry-based exact fees awaiting owner tables. |

**Blended public-V1 craft:** ~**7.5–8 / 10** depending on whether the viewer weights photography. Architecture and SEO sit higher than visual “finished brand film.”

## Three states (do not conflate)

### 1. CURRENT PUBLIC V1

- `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=false` (or absent)
- Text-led heroes and PulseMediaPlate fallbacks
- Machine-free / trust-rail honesty without fake portraits or reviews
- **Show as:** production-ready local-SEO studio site with editorial craft and conversion discipline
- **Do not claim:** photography-complete or portfolio-final

### 2. LOCAL SYNTHETIC CONCEPT

- `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true` — **local / art-direction only**
- Visibly labelled **AI concept preview**
- Proves eventual media composition, motion with imagery, wide-canvas fill
- **Show as:** concept direction / media architecture proof only
- **Never** deploy publicly; never imply images depict real Ankit’s Studio people or rooms

### 3. FUTURE REAL-MEDIA VERSION

- Stage 4B-style owner asset swap into existing slots (not a redesign stage)
- Real hero/programme/branch/founder/trainer photography + consented proof
- Unlocks portfolio-final and raises UI/UX visual score without rewriting the system

## Portfolio framing guidance

| Audience | Credible claim |
|---|---|
| Design hire / peer | Bespoke editorial system + anti-template programme families + motion language on a real local business |
| Engineering hire | App Router content architecture, mock/launch gates, media feature flag, SEO/a11y per-route discipline |
| Client case study | “Public V1 shipped text-led while awaiting owner media; synthetic concept reserved for local preview” |

## What would flip portfolio-final to YES

1. Real homepage and programme photography (or video)
2. Four branch photo sets
3. Founder portrait + publishable trainer profiles with consent
4. Consented Google reviews sample and/or member stories
5. Public screenshots of that media-on state with no synthetic labels

Until then: **PUBLIC V1 = YES · PORTFOLIO-FINAL = NO.**
