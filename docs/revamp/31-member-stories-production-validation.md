# 31 — Member Stories production validation

**Date:** 2026-08-03  
**Branch:** `revamp/studio-pulse-production`  
**URL:** `/transformations` (public heading: Member Stories)  
**Frozen prototypes:** untouched  
**ADR:** ADR-022 (plus ADR-021 for structured data)

---

## Previous mock evidence found

- 2 illustrative testimonials (“Illustrative member”)
- 2 mock transformation journeys rendered via `TransformationStories` under `ALLOW_MOCK_PUBLISH=true`

## Mock content treatment

- Production `mockTestimonials` / `mockTransformations` emptied
- Illustrative content moved to `src/content/fixtures/illustrative-evidence.ts` (tests/design-lab only)
- Removed from `content-mode` unverified domain list
- Route uses only `getPublishableMemberStories()` / `getPublishableTransformations()`

## Final page sequence

1. Opening — real stories, published with permission  
2. Evidence and consent standard  
3. Honest readiness state (no empty card grid)  
4. Programme discovery  
5. Branch discovery  
6. WhatsApp free-trial CTA  

## Models

- **Member Story** — first-party consented narrative (`member-story.ts`)  
- **Transformation** — stronger evidence story with timeframe/outcome (`transformation.ts`)  
- **Google Review runtime** — type-only contract; no persistence / no Places integration  

## Publication requirements

See `isMemberStoryPublishable` / `isTransformationPublishable`. Mock `dataStatus` never passes.

## Route activation threshold

Index when **≥3** publishable Member Stories **or** **≥2** publishable Transformations (`shouldIndexMemberStoriesRoute`).

## Indexing decision

Currently: **noindex / nofollow**, **excluded from sitemap**. Route remains reachable.

## Structured-data model

`WebPage` + `BreadcrumbList` only. No Review / AggregateRating / Person / MedicalEntity / ClaimReview.

## Motion retained and removed

See `docs/revamp/30-member-stories-motion-review.md` — CTA press feedback retained; carousels, counters, before/after wipes removed/avoided.

## Responsive / accessibility findings

Screenshots: `docs/revamp/screenshots/member-stories-production/` (when captured).  
Expected: no fake names/quotes/measurements; crawlable programme/branch links; WhatsApp CTA; keyboard-focusable links; reduced-motion disables CTA scale.

## Tests added

`tests/routes/member-stories-route.test.ts` — zero publishable records, fixtures isolation, noindex metadata, sitemap exclusion, safe SD, WhatsApp CTA.

## Test results

| Check | Result |
|---|---|
| Lint | Not re-run as a blocking gate (prior clean); unit suite green |
| Type check | Pass |
| Unit / route / metadata / SD / sitemap tests | Pass — **34** files, **244** tests |
| Smoke + a11y E2E | Pass |
| Production build `ALLOW_MOCK_PUBLISH=true` | Pass |
| Screenshots | `docs/revamp/screenshots/member-stories-production/` (360–1920) |

Frozen `/design-lab/revamp-a|b|c` unchanged. No Google Places / review fetch added.

## Remaining evidence needed from Ankit

1. Consented member stories (wording, display name/anonymity, programme/branch, consent date)  
2. Optional photos with photo permission  
3. For transformations: timeframe, starting point, outcome, measurement source if claimed, before/after date verification  
4. Parent/guardian consent for any children’s stories  
5. Still no Google reviews in this route (separate Places work later)

## Public stories rendered

**Zero.**
