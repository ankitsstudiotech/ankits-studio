# Programme structured-data audit

**Date:** 2026-08-02  
**Scope:** `/programs`, confirmed `/programs/[slug]`, legacy noindex programme routes  
**Sources:** Rendered page builders (`src/app/programs/**`), `src/lib/seo/structured-data.ts`, Google Search Central [Course list](https://developers.google.com/search/docs/appearance/structured-data/course), schema.org/Course  
**Baseline claim under review:** “Course JSON-LD only on confirmed pages” (`docs/revamp/16-programme-production-validation.md`)

---

## Executive finding

**Course JSON-LD on confirmed programme pages is not an accurate semantic model** for Ankit’s Studio’s current enquiry-based fitness / movement / choreography services.

Google’s Course list guidelines require educational content that is “a series or unit of curriculum that contains lectures, lessons, or modules,” with an explicit educational outcome and instructor-led student roster. Current pages advertise WhatsApp trial enquiries, pending batch times, pending programme fees, and (for Home/Online) non-branch delivery — not formal courses with curricula, modules, durations, course instances, or assigned instructors.

Additionally, Google’s specialized **Course Info** rich result was phased out (June 2025 Search Central simplification). Remaining Google Course support is the **Course list carousel**, which still requires the educational Course definition **and** ItemList carousel markup with ≥3 courses. Emitting bare `Course` on detail pages neither matches content nor qualifies for a supported rich result.

**Recommended action:** Remove Course JSON-LD. Retain accurate BreadcrumbList. Use minimal WebPage / CollectionPage only. Do not add speculative Service, Offer, Event, AggregateRating, or Course ItemList markup.

---

## Audit table

| Route | Current JSON-LD | Accuracy | Google support | Risk | Recommended action |
|---|---|---|---|---|---|
| `/programs` | `BreadcrumbList` (Home → Programmes) | Accurate; trails match visible nav | Breadcrumb rich results still supported | Low | **Keep** BreadcrumbList. Optionally add `CollectionPage`/`WebPage` with name/description/url visible on page. **Do not** add Course ItemList carousel. |
| `/programs/functional-training` | `BreadcrumbList` + `Course` (name, description, url, provider) | Breadcrumb OK. Course **inaccurate** — no curriculum/modules/outcomes/instructors/schedule/duration | Course list carousel not eligible; Course Info retired | High — misrepresents service as educational Course | **Remove Course**. Keep BreadcrumbList. Add minimal `WebPage`. |
| `/programs/zumba` | Same | Same | Same | High | Same |
| `/programs/yoga` | Same | Same | Same | High | Same |
| `/programs/adult-dance` | Same | Same | Same | High | Same |
| `/programs/wedding-choreography` | Same | Same | Same | High | Same |
| `/programs/home-personal-training` | Same | Course especially misleading (home delivery, not classroom curriculum) | Same | High | Same; never imply branch class via schema |
| `/programs/online-training` | Same | Course especially misleading (remote delivery pending platform) | Same | High | Same |
| `/programs/strength-training` (legacy noindex) | `BreadcrumbList` only | Accurate for temporary review page | Breadcrumbs OK; page noindex | Low | **Keep** BreadcrumbList only. No Course/Service. Stay out of sitemap. |
| `/programs/personal-training` | BreadcrumbList only | Same | Same | Low | Same |
| `/programs/kids-dance` | BreadcrumbList only | Same | Same | Low | Same |
| `/programs/weight-loss-fitness` | BreadcrumbList only | Same | Same | Low | Same |
| Homepage `/` | No programme Course JSON-LD (links only) | N/A | N/A | None for Course | No change in this task |
| Organization / ExerciseGym | Not emitted from programme routes; LocalBusiness gated on verified branch | Branch records still mock → builders return null | N/A on programme pages | Low on programmes | Do not invent gym/org markup on programme pages |

---

## Property-level inspection (`buildCourseJsonLd`)

| Property | Source | Visible on page? | Verification | Notes |
|---|---|---|---|---|
| `@type: Course` | Hard-coded | Type not stated as “course” in UI | N/A | Semantic mismatch |
| `name` | `programme.name` | Yes (H1) | Owner-confirmed for confirmed catalogue | OK as page title, not as Course |
| `description` | `programme.shortDescription` | Partially (lede / long copy nearby) | Owner-confirmed short copy | OK as WebPage description |
| `url` | Canonical `/programs/{slug}` | Implicit | Path real | OK |
| `provider.name` | `siteConfig.name` | Brand visible in chrome | Business name treated as safe constant | Not sufficient to justify Course type |

**Not emitted (good):** price, Offer, AggregateRating, Review, instructor, hasCourseInstance, duration, schedule, Event.

**Still wrong:** the type itself.

---

## Alternatives considered

| Type | Verdict |
|---|---|
| `Course` | Reject — fails Google content guidelines for courses |
| `Course` + `ItemList` carousel on `/programs` | Reject — still fails educational definition; would amplify misrepresentation |
| `Event` | Reject — no verified dates/times/locations for sessions |
| `Service` / `Offer` | Defer — easy to invent Offer/price/areaServed; not required for Search |
| `FAQPage` from programme FAQ blocks | Defer — programme FAQs are page-local, not provenanced `Faq` records; FAQ rich results also narrowed by Google |
| `WebPage` / `CollectionPage` + `BreadcrumbList` | **Accept** — accurate, minimal, no invented claims |

---

## Decision pointer

See **ADR-017** in `docs/DECISIONS.md`.
