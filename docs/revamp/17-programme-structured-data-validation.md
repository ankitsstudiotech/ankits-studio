# 17 — Programme structured-data validation

**Date:** 2026-08-02  
**Branch:** `revamp/studio-pulse-production`  
**Scope:** Structured-data / SEO semantics only (no programme redesign, no locations redesign, frozen `/design-lab/revamp-*` untouched)  
**Prior claim:** “Course JSON-LD only on confirmed pages” (`16-programme-production-validation.md`)

---

## Verdict

**Course JSON-LD was not valid** for Ankit’s Studio’s current enquiry-based programme pages under Google Search Course guidelines and schema.org Course semantics.

Course markup has been **removed** from all programme routes. `buildCourseJsonLd` now always returns `null` (ADR-017).

---

## Course markup found → removed

| Location | Before | After |
|---|---|---|
| Confirmed `/programs/[slug]` | `BreadcrumbList` + `Course` | `BreadcrumbList` + `WebPage` |
| `/programs` | `BreadcrumbList` | `BreadcrumbList` + `CollectionPage` |
| Legacy noindex `/programs/[slug]` | `BreadcrumbList` only | Unchanged (`BreadcrumbList` only) |
| `buildCourseJsonLd` | Emitted for `dataStatus: verified` | Always `null` |

---

## Final JSON-LD type per route

Inspected from prerendered HTML after `ALLOW_MOCK_PUBLISH=true` production build (also sees sitewide `Organization` from layout — identity verified; out of programme-builder scope).

| Route | Final programme JSON-LD | Reason retained |
|---|---|---|
| `/programs` | `CollectionPage` + `BreadcrumbList` | Index of real confirmed programmes; name/description/url match visible page; no Course ItemList |
| `/programs/functional-training` | `WebPage` + `BreadcrumbList` | Accurate page type; visible title + short description + canonical URL only |
| `/programs/zumba` | Same | Same |
| `/programs/yoga` | Same | Same |
| `/programs/adult-dance` | Same | Same |
| `/programs/wedding-choreography` | Same | Same |
| `/programs/home-personal-training` | Same | Same — no ExerciseGym / PostalAddress / branch class markup |
| `/programs/online-training` | Same | Same — no physical-branch class markup |
| `/programs/strength-training` | `BreadcrumbList` only | Legacy noindex temporary taxonomy page |
| `/programs/personal-training` | `BreadcrumbList` only | Same |
| `/programs/kids-dance` | `BreadcrumbList` only | Same |
| `/programs/weight-loss-fitness` | `BreadcrumbList` only | Same |

**Not retained on any programme route:** `Course`, `Service`, `Offer`, `Event`, `AggregateRating`, `Review`, `CourseInstance`, instructor, schedule, duration, price.

---

## Unsupported properties removed

- Entire `Course` object (`name` / `description` / `url` / `provider` under wrong type)
- No speculative Service/Offer/Event properties were added as replacements

---

## Tests added / updated

- `tests/seo/programme-structured-data.test.ts` — fails if Course returns, forbidden Offer/Event/rating keys appear, prices/schedules/trainers leak, Home/Online gain branch markup, timetable fallback feeds JSON-LD, or legacy slugs remain sitemap-eligible
- `tests/routes/structured-data-safety.test.ts` — inverted: Course must be null for every programme
- Sitemap contract already excludes `taxonomyStatus: migration-pending` (`tests/seo/sitemap-and-robots.test.ts`)

---

## Validation results

| Check | Result |
|---|---|
| Lint | Pass |
| `tsc --noEmit` | Pass |
| Unit tests | **179** passed (was 169; +10 programme structured-data cases) |
| Metadata / sitemap / route tests | Pass |
| Prerendered HTML JSON-LD inspection | Course absent on all 12 programme routes; types as table above |
| Production build `ALLOW_MOCK_PUBLISH=true` | Pass |

Google Rich Results Test / Schema Markup Validator were not run against a public URL in this pass (preview remains sitewide noindex while unverified content exists). Validation is against official Course guidelines + local HTML/JSON-LD + unit regressions.

---

## Remaining SEO limitations

- Sitewide **noindex** and empty sitemap while any mock/reference-only content remains (branches, trainers, etc.)
- No Service rich result — deliberately omitted while Offer/area/price facts are enquiry-only
- No Course list carousel — content is not educational Course inventory
- Programme fees, batch times, and instructor assignments still unpublished in structured data (correct until verified)
- Legacy four routes remain temporary noindex pages, not redirects
- Organization JSON-LD may appear from layout; LocalBusiness/ExerciseGym still omitted until branches are verified

---

## Docs / decisions

- Audit: `docs/audits/PROGRAMME-STRUCTURED-DATA-AUDIT.md`
- ADR: `docs/DECISIONS.md` **ADR-017**
- Migration table updated: `docs/migrations/SERVICE-ROUTE-MIGRATION.md`
