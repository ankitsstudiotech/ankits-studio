# Google reviews sourcing audit

**Date:** 2026-08-03  
**Branch checkpoint:** `studio-pulse-before-review-sourcing-audit` @ `dd5fba8`  
**Scope:** Investigation and architecture only — no route rebuild, no scraping, no review publication  
**Primary sources:** [Places API policies](https://developers.google.com/maps/documentation/places/web-service/policies), [Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details), [Places REST `reviews[]`](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places), [GBP review data](https://developers.google.com/my-business/content/review-data), [GBP OAuth](https://developers.google.com/my-business/content/implement-oauth), [Google Search review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)

---

## Inventory table

| File/route | Current content | Source | Verification state | Policy risk | Recommended action |
|---|---|---|---|---|---|
| `src/content/mock/testimonials.ts` | 2 illustrative quotes; attributed “Illustrative member” | Authored mock | `mock` | Invented social proof if mounted without labels | Keep labelled; **do not** mount on marketing routes until verified consenting quotes exist |
| `src/content/schema/testimonial.ts` | Quote + attributedName + optional programme/branch; no rating | Schema | N/A | Low | Keep; extend later for first-party consent fields only |
| `src/content/verified/index.ts` | `verifiedTestimonials = []` | Empty | N/A | None | Keep empty until real consent |
| `src/components/home/CommunityTestimonials.tsx` | “VOICES” section UI | Unused on `/` | N/A | Medium if remounted with mocks | Keep offline until verified content |
| `src/components/home/TestimonialCard.tsx` | Card + Illustrative badge | Design-lab / unused homepage | mock | Low while labelled | Keep |
| `src/app/(marketing)/page.tsx` | No testimonial/review section | — | — | None | Keep clean |
| `src/content/mock/transformations.ts` | 2 qualitative “illustrative journey” summaries; no photos/kg/% | Authored mock | `mock` | Unsupported outcome implication if read as real | Keep labelled; gate public route before indexable launch |
| `src/content/schema/transformation.ts` | Qualitative summary; optional images unused | Schema | N/A | Medium if fake before/after added | Keep; require consent + media permission before images |
| `src/app/(marketing)/transformations/page.tsx` | Public Tier-2 route; BreadcrumbList only; renders mocks via `TransformationStories` | `getTransformations()` | mock journeys | **High under `ALLOW_MOCK_PUBLISH=true`** — page HTML includes illustrative journeys (site still noindex while mock gate active) | Document as preview-only; prefer verified-only filter before indexable launch; do **not** treat as Google reviews |
| `src/components/home/TransformationStories.tsx` | “HONEST EVIDENCE” list UI | Used by `/transformations` | mock data | Medium | Keep honesty copy; do not add invented numbers |
| `src/content/mock/navigation.ts` | Footer link to `/transformations` | IA | — | Low | Keep; no `/testimonials` or `/reviews` nav |
| `src/lib/seo/sitemap.ts` | `/transformations` in static routes | Sitemap empty while `shouldNoIndex()` | — | Low in preview | Do not add review routes until ready |
| `/testimonials`, `/reviews` | **Do not exist** | — | — | None | Do not create until Place IDs + policy-ready display |
| Branch / programme pages | Maps outbound links only; **no** ratings or review quotes | Owner Maps URLs | owner_confirmed maps | Low | Keep; never scrape Maps HTML |
| `src/lib/seo/structured-data.ts` | Explicitly omits ratings/reviews; ExerciseGym has no Review | Code | Guarded by tests | Low if unchanged | Keep; ADR-021 forbids self-serving Review/AggregateRating |
| `tests/seo/structured-data*.ts`, route SD tests | Forbid AggregateRating / Review / rating fields | Regression | — | None | Keep and extend under ADR-021 |
| `package.json` | No Places/GBP clients, no scrapers | — | — | None | Do not add scrapers |
| `.env.example` / `src/lib/env.ts` | No `GOOGLE_*` review keys | — | — | None | Document future env names without committing secrets |
| Privacy policy page | Draft; silent on reviews/widgets | Placeholder | — | Medium when reviews ship | Update before live Google-review UI |
| Design-lab fixtures | Duplicate illustrative quotes under “Social proof” | mock | Internal | Low if design-lab stays non-marketing | Keep; frozen revamp-a/b/c untouched |
| Owner migration docs | Testimonials deferred; no scrape | Policy | — | None | Align with this audit |

---

## Explicit findings

### Invented testimonials
- Two mock records with placeholder quotes and “Illustrative member” attribution.
- Not rendered on the live homepage today.
- Still counted in `siteHasUnverifiedContent` / launch gate.

### Unsupported transformation claims
- Two mock “journey” summaries describing kinds of outcomes programmes are “designed for.”
- No before/after photos, no named members, no numeric results — still **not** real case studies.
- **`/transformations` publishes these under `ALLOW_MOCK_PUBLISH=true`** with disclaimers; site remains noindex while mock content exists.

### Static ratings / fake member identities / review structured data
- **No** star ratings, aggregate scores, review widgets, Review JSON-LD, or AggregateRating JSON-LD found.
- **No** Google Places / GBP integration, Place IDs, API keys, or Maps scrapers in the application.

### Content that can appear publicly under `ALLOW_MOCK_PUBLISH=true`
- `/transformations` illustrative journeys (labelled).
- Mock testimonials exist in the content layer but are **not** currently mounted on `/`.
- Production robots stay `noindex` while any mock domain remains (ADR-011 gate).

---

## Scraping and unofficial methods

**Prohibited for this project (confirmed absent today):**

- Puppeteer / Playwright / Selenium scraping of Google Maps HTML  
- Unofficial Maps scraper libraries  
- Search-result scraping, proxies, CAPTCHA bypass  
- Copying reviews from third-party directories  

Application Playwright usage is limited to **site** smoke/a11y E2E — not Google Maps.

---

## Related readiness docs

- Listing identity: `docs/business/GOOGLE-LISTING-IDENTITY.md`
- Implementation plan: `docs/revamp/29-google-reviews-and-member-stories-readiness.md`
- Structured-data decision: ADR-021 in `docs/DECISIONS.md`
