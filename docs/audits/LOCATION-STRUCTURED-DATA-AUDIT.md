# Location structured-data audit

**Date:** 2026-08-02  
**Scope:** `/locations`, `/locations/[slug]` for four confirmed branches  
**Sources:** Google Search Local Business / Organization docs, schema.org `ExerciseGym`, `WebPage`, `BreadcrumbList`, `CollectionPage`  
**Related:** `docs/migrations/LOCATION-ROUTE-MIGRATION.md`, ADR-017 (programme schema), ADR-011 (omit until verified)

---

## Executive finding

Branch records are **owner-confirmed as open** with locality names, operating window, central enquiry WhatsApp, and (for three branches) owner-supplied Maps short URLs. **Printable street addresses remain pending** for all four. Record-level `dataStatus` stays non-`verified`.

Therefore **`ExerciseGym` / `LocalBusiness` with `PostalAddress` must not emit today.** Emitting address-less LocalBusiness or inventing street text from Maps scrapes would misrepresent the page.

Safe baseline (implemented):

| Route | JSON-LD |
|---|---|
| `/locations` | `CollectionPage` + `BreadcrumbList` |
| Each `/locations/[slug]` | `WebPage` + `BreadcrumbList` |
| Legacy `/locations/airoli` | Redirect only — no independent markup |

`buildLocalBusinessJsonLd` remains gated: verified record **and** owner-confirmed printable `address`. Opening hours, geo, ratings, Offer, Event, Course, and Home/Online as branch services are never emitted.

---

## Per-route table

| Route | Current types (pre-fix) | Verified / owner-confirmed fields | Unsupported / pending fields | Recommended output |
|---|---|---|---|---|
| `/locations` | `BreadcrumbList` only | Four localities; catalogue of real branch URLs | Distances, ratings, “open now” | `CollectionPage` + `BreadcrumbList` (no ItemList of LocalBusiness) |
| `/locations/airoli-sector-19` | Was `BreadcrumbList` + gated `ExerciseGym` (null) + gated FAQ | Locality, open status, Maps URL, hours window, floor services, central WhatsApp | Street address, PIN, geo, parking, photos, batch times, ratings | `WebPage` + `BreadcrumbList`; **no** ExerciseGym until address verified |
| `/locations/airoli-sector-8` | Same | Locality, open status, hours, services, WhatsApp | Address, Maps, PIN, geo, parking, photos, schedules | Same — WebPage + BreadcrumbList |
| `/locations/ghansoli` | Same | As Sector 19 (Maps yes, address no) | Same pending set | Same |
| `/locations/thane` | Same | As Sector 19 (Maps yes, address no) | Same pending set | Same |
| `/locations/airoli` (legacy) | N/A content | Redirect to Sector 19 | — | No schema; permanent redirect |

---

## Property rules applied

1. No `PostalAddress` while textual address is pending.  
2. No `geo` without verified coordinates.  
3. No AggregateRating / Review.  
4. No `priceRange`.  
5. No branch-specific `telephone` while only central enquiry is known (and record unverified).  
6. Opening hours: visible on page as operating window; **not** in JSON-LD until ExerciseGym is eligible with full verified address (avoid partial LocalBusiness).  
7. No class schedules / Event.  
8. No Offer / Course.  
9. Home PT / Online never listed as branch-contained services in schema.  
10. All emitted properties match visible central content.

---

## Decision pointer

See **ADR-018** in `docs/DECISIONS.md`.
