# Transformations route audit

**Date:** 2026-08-03  
**Checkpoint before rebuild:** `studio-pulse-google-review-audit-complete` @ `3e7db77`  
**Scope:** `/transformations`, testimonials, transformation content — audit only (no production code changes in this commit)

---

## Inventory

| File/component | Current content | Production exposure | Evidence risk | Required action |
|---|---|---|---|---|
| `src/app/(marketing)/transformations/page.tsx` | “Editorial placeholder” + maps **all** `getTransformations()` into `TransformationStories` | Public route; under `ALLOW_MOCK_PUBLISH=true` **renders mock journeys** | High — illustrative summaries can read as soft evidence | Rebuild as Member Stories readiness page; publishable selectors only |
| `src/components/home/TransformationStories.tsx` | “HONEST EVIDENCE” list of summaries | Used by `/transformations` | High when fed mocks | Stop feeding mocks; retire or gate component |
| `src/content/mock/transformations.ts` | 2 qualitative illustrative journeys (`strength-training`, `weight-loss-fitness`) | Via `getTransformations()` | High under mock publish | Isolate to fixtures; never pass publish gates |
| `src/content/schema/transformation.ts` | Thin schema: slug, programmeSlug, summary, optional images/duration | Content layer | Medium — too weak for consent/evidence | Replace with evidence-gated transformation model |
| `src/content/mock/testimonials.ts` | 2 “Illustrative member” placeholder quotes | Not on homepage; still in content merge + launch gate | Medium — remount risk | Isolate to fixtures; never production selectors |
| `src/content/schema/testimonial.ts` | Quote + attributedName; no consent | Content layer | Medium — conflates with Google reviews / stories | Keep legacy type only if needed; prefer Member Story model |
| `src/components/home/CommunityTestimonials.tsx` | “VOICES” carousel section | **Unused** on `/` | Medium if remounted with mocks | Keep offline; do not wire mocks |
| `src/components/home/TestimonialCard.tsx` | Quote card + Illustrative badge | Design-lab | Low while labelled | Keep for lab only |
| `src/app/design-lab/fixtures.ts` | Duplicate illustrative testimonials | Design-lab | Low | Keep as lab fixtures; mark fictional |
| `src/app/design-lab/components/page.tsx` | “Social proof” carousel | Design-lab | Low | Unchanged; not marketing |
| `src/content/index.ts` | `getTransformations()` / `getTestimonials()` return merged mock+verified | Production accessors | High | Add publishable selectors; empty production lists |
| `src/content/content-mode.ts` | Counts mock testimonials + transformations toward unverified gate | Build/index gate | Indirect | Remove production mock arrays from domain once isolated |
| `src/lib/seo/sitemap.ts` | `/transformations` in `STATIC_ROUTES` | Empty while sitewide noindex; would include when gate clears | Medium | Exclude until Member Stories index threshold (ADR) |
| Metadata on `/transformations` | Title “Transformations”; mentions progress | Indexable only when sitewide gate clears | Medium — overclaims availability | Honest Member Stories metadata + forceNoIndex until threshold |
| Structured data | BreadcrumbList only today | Low | Keep WebPage + BreadcrumbList; no Review/AggregateRating (ADR-021) |
| Homepage `/` | No testimonials/transformations | None | None | Keep clean |
| Navigation footer | Link “Transformations” → `/transformations` | Yes | Low | Keep URL; label may become Member Stories in chrome later (optional) |

---

## Explicit risk findings

| Risk | Present? | Detail |
|---|---|---|
| Fake names | Soft | “Illustrative member” — not real people, but still fake attribution |
| Fake journeys | **Yes** | Two mock transformation summaries on `/transformations` under mock publish |
| Fake dates | No | — |
| Fake measurements | No | Summaries deliberately avoid kg/% |
| Fake quotes | **Yes** | Two mock testimonial quotes in content layer |
| Fake before/after media | No | Images unused |
| Stock / generated member imagery | No | — |
| Health / weight-loss claims | Soft | One journey tied to `weight-loss-fitness` programme slug; qualitative “energy improvements” |
| Review / rating semantics | No | No stars / AggregateRating |
| Mock reachable under `ALLOW_MOCK_PUBLISH=true` | **Yes** | `/transformations` currently maps mock transformations into visible UI |

---

## Required rebuild direction

1. Separate **Member Story**, **Transformation**, and **Google Review (runtime)** models.  
2. Publication gates; zero publishable records initially.  
3. `/transformations` URL kept; public heading **Member Stories**; honest readiness state; no empty card grid; no mock evidence.  
4. Route stays **noindex / nofollow / sitemap-excluded** until threshold (ADR).  
5. Isolate or delete production mock evidence; fixtures for tests/design-lab only.

---

## Status

Audit complete. Production code not modified in this commit.
