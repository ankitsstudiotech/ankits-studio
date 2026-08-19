# 28 — Owner data round 2 validation

**Date:** 2026-08-03  
**Branch:** `revamp/studio-pulse-production`  
**Audit:** `docs/business/OWNER-DATA-MIGRATION-2026-08-03.md`  
**Checkpoint before migration:** `studio-pulse-before-owner-data-round-2`  
**Frozen prototypes:** `/design-lab/revamp-a|b|c` untouched  
**Transformations:** not started

---

## Facts promoted to owner-confirmed (published carefully)

- Public identity: Ankit’s Studio; Fitness Studio; Dance & Fitness descriptor  
- Founder Ankit Nalawade; founded **2019**; outcome-safe founder story on `/about`  
- Email `ankitsstudio5@gmail.com`; central phone/WhatsApp `+91 93724 02074`  
- Admin answers during studio operating hours (no one-minute guarantee)  
- All four printable branch addresses + Maps URLs; branches `dataStatus: verified`  
- Operating hours 6:00 AM–10:00 PM every day; no weekly off  
- Free trial every service / every physical branch; once per person  
- Advance booking not compulsory; WhatsApp availability check recommended  
- Registration ₹300/person; not recharged after membership break; GST included; fees vary by branch (amounts still pending)  
- Wedding pricing basis: per couple; Home PT: per session; Online: Zoom, 1:1 and group  
- Functional Training machine-free scope + ~1 hour sessions; group vs PT personalisation distinction  
- Kids Dance / Ladies Dance as Dance batch variants; kids ages 3–8 and 8–12  
- Corporate Fitness Sessions as enquiry-only offering  
- Team 15+; workforce mix of employees and freelancers (no named public profiles)

## Facts left evidence-pending / unpublished

- Founder Yoga certification / Ministry of Ayush association  
- Hiring bar “certification + 2+ years” as proof for every trainer  
- Exact programme fees and discount rules  
- Membership expiry; missed-class policy  
- Direct Google Business Profile URLs  
- Per-branch amenities and branch opening-year mapping  
- Lead trainers Tanvi / Deepali / Khushboo / Sandhya (stored unpublished)  
- Exact Home PT coverage list and Online schedule/prices  
- Testimonials / Google reviews (research deferred — do not scrape)

## Ambiguous answers (not published)

- Combined pregnancy / seniors / injuries / medical-conditions “No”  
- “Missed classes — No”  
- Membership no-cancel / no-refund / transfer / freeze — stored as `owner_confirmed_pending_legal_copy`, not final legal terms

## Routes changed (factual only — no redesign)

| Route | Change summary |
|---|---|
| `/` | Branch explorer from verified public branches; personalisation wording; contact consistency |
| `/about` | Founder section + founded 2019; credentials unpublished |
| `/trainers` | Workforce mix note; still noindex; no lead names as profiles |
| `/programs` + programme pages | FT scope/duration; Home/Online; Dance batch framing; Corporate enquiry note |
| `/locations` + branch pages | Addresses, Maps, hours, central phone visible; amenities still omitted |
| `/timetable` | Booking not compulsory + WhatsApp recommended |
| `/pricing` | GST, fees-by-branch, trial/reg rules, Zoom/wedding/home bases; no invented amounts |
| `/trial`, `/contact` | Email/hours; optional age + trial date; WhatsApp template fields |
| Header/footer | Hours-safe disclaimer |
| Metadata / sitemap / SD | Branch metadata + ExerciseGym where eligible |

## Corporate Fitness treatment

**ADR-020:** enquiry-only on `/programs` — no thin indexable `/programs/corporate-fitness` page until content is useful.

## Branch structured-data model

- `ExerciseGym` for all four verified branches with owner-confirmed addresses  
- Eligible visible properties: name, url, PostalAddress, telephone (central), openingHoursSpecification, hasMap, parentOrganization  
- Forbidden: geo, ratings, reviews, priceRange, amenities, schedules, trainer assignments  
- `/locations` remains CollectionPage + BreadcrumbList; branch pages keep WebPage + BreadcrumbList alongside ExerciseGym  
- ADR-018 amended 2026-08-03

## Founder-story treatment

Published outcome-safe copy only. No “transform their life”, medical-outcome, or Ministry/gov certification claims. No Person / credential JSON-LD.

## Trainer treatment

- Lead first names in `src/content/pending/trainer-leads.ts` — unpublished  
- `/trainers` remains noindex / sitemap-excluded until ADR-019 threshold  
- No first-aid / CPR / rehab / nutrition / prenatal / children’s fitness claims

## Pricing / policy treatment

- Confirmed commercial facts published; exact fees pending  
- Membership policies stored pending legal copy — not shown as final terms  
- Missed-class policy unpublished

## Logo export result

- Official CDR zip preserved at `brand-source/Ankit Studio logo.cdr final.cdr.zip`  
- No CorelDRAW / reliable CDR exporter in environment → **manual export required**  
- Temporary `public/brand/*` assets remain in production  
- See `docs/brand/LOGO-SOURCE-AND-EXPORT-STATUS.md`

## Test results

| Check | Result |
|---|---|
| Lint | Pass (0 errors; existing warnings only) |
| Type check | Pass |
| Unit / route / metadata / SD / sitemap / WhatsApp tests | Pass — **33** files, **234+** tests |
| Smoke + a11y E2E | Pass |
| Production build `ALLOW_MOCK_PUBLISH=true` | Pass |

Frozen `/design-lab/revamp-a|b|c` routes remain present and unchanged in the build output.

## Remaining questions for Ankit

1. Confirm branch opening-year mapping (Sector 19 → 2019, Sector 8 → 2021, Ghansoli → 2023, Thane → 2026).  
2. Confirm amenities per branch (parking, washroom/changing, AC, drinking water, lift).  
3. Supply Yoga certificate file and exact credential wording (Ministry association?).  
4. Full names, branch maps, roles, photos, consent, programmes, and qualifications for lead trainers.  
5. Exact programme fees by branch; discount eligibility rules.  
6. Clarify pregnancy / seniors / injuries / medical policy (separate answers).  
7. Clarify missed-class and membership-expiry wording; approve legal copy for cancel/refund/transfer/freeze.  
8. Direct Google Business Profile URLs (distinct from Maps short links).  
9. Home PT geographic coverage and exact services list; Online schedule/prices.  
10. CorelDRAW export of official SVG / transparent PNG lockup and symbol.  
11. Testimonials strategy after GBP links exist (do not scrape in the interim).

## Pending research task

**Google reviews / testimonials:** deferred until GBP URLs exist and attribution/publication strategy is decided. Do not invent ratings.
