# 19 — Location production validation

**Date:** 2026-08-02  
**Branch:** `revamp/studio-pulse-production`  
**Scope:** Four-branch location discovery + detail rebuild (Studio Pulse)  
**Frozen prototypes:** `/design-lab/revamp-a|b|c` untouched

---

## Final public location routes

| Route | Status |
|---|---|
| `/locations` | Public index |
| `/locations/airoli-sector-19` | Canonical Sector 19 |
| `/locations/airoli-sector-8` | Canonical Sector 8 |
| `/locations/ghansoli` | Canonical Ghansoli |
| `/locations/thane` | Canonical Thane |

## Legacy route treatment

| Route | Treatment |
|---|---|
| `/locations/airoli` | **308 permanent redirect** → `/locations/airoli-sector-19` (verified in production server QA) |

No redirect chains. No obsolete provisional branch routes in production content.

---

## Address / map status

| Branch | Address | Maps URL |
|---|---|---|
| Airoli Sector 19 | Pending (“Detailed address is being updated.”) | Owner-confirmed short URL shown |
| Airoli Sector 8 | Pending | Pending (honest “Maps link pending”) |
| Ghansoli | Pending | Owner-confirmed short URL shown |
| Thane | Pending | Owner-confirmed short URL shown |

## Structured-data model per branch

| Route | JSON-LD |
|---|---|
| `/locations` | `CollectionPage` + `BreadcrumbList` (+ sitewide Organization from layout) |
| Each confirmed branch | `WebPage` + `BreadcrumbList` |
| `ExerciseGym` | **Omitted** — printable address not owner-confirmed (ADR-018) |

## Field-level verification (summary)

Owner-confirmed: existence, names/localities, operating window 06:00–22:00, central WhatsApp, physical floor services (5), ladies/kids batch attributes, max group size 15, Maps links (3/4).  
Pending: printable addresses, PIN, Sector 8 Maps, landmarks, station, parking, facilities, photography, batch schedules, GBP URLs, geo.

## Internal links changed

- Homepage Sector 19 href → `/locations/airoli-sector-19`
- Footer / programmes / contact / trial enums follow content slugs
- Media slot keys renamed for Sector 19
- E2E a11y route updated to Sector 19 canonical

## Components

**Created**

- `src/components/locations/pulse/LocationDiscovery.tsx`
- `src/components/locations/pulse/BranchDetailView.tsx`
- `src/components/locations/pulse/LocationPulseMotion.tsx`
- `src/components/locations/pulse/location-pulse.module.css`

**Superseded on production location routes** (files retained for other consumers / PendingValue shared use; not mounted on `/locations*`)

- Card-grid index via `LocationTeaserCard`
- Legacy detail stack: `LocationHero`, `ContactActionGroup`, `AddressDirections`, `OpeningHours`, `AvailableProgrammesGrid`, `TrainerSection`, `BranchTimetable`, `ParkingTransportSection`, `BranchGallery`, `LocationFaq`, `LocationTrialCta` on branch pages

## Motion

See `docs/revamp/18-location-motion-review.md`.

**Retained:** WhatsApp CTA press scale only.  
**Removed/avoided:** map pulses, node graphs, card-grid hover theatre, scroll fade-ups.

## Responsive / accessibility findings

- Screenshots captured under `docs/revamp/screenshots/locations-production/` (360 / 390 / 768 / 1440 for index + four branches).
- Place names are H1/H2 primary; crawlable anchors present.
- Sector 8 pending map/address states read as intentional.
- Axe (production `next start`): **no serious/critical** violations on `/locations` and all four branch pages.
- Playwright suite against `localhost:3000` was flaky when a prior `next dev` held the port; re-validated on port 3456 production server.

## Test results

| Check | Result |
|---|---|
| Lint | Pass |
| Typecheck | Pass |
| Unit tests | **190** passed |
| Location / redirect / structured-data tests | Pass |
| Production build `ALLOW_MOCK_PUBLISH=true` | Pass |
| Redirect `/locations/airoli` | Lands on `/locations/airoli-sector-19` |

## Remaining owner-data gaps / questions for Ankit

1. Confirm printable street addresses for Sector 19, Ghansoli, Thane.  
2. Supply Sector 8 address + Maps link.  
3. Confirm PIN codes if they should be published.  
4. Confirm whether Maps hours listings should be updated to match 06:00–22:00.  
5. Supply branch exterior/interior photography.  
6. Confirm landmarks / station / parking copy or keep omitted.  
7. Confirm long-term central-only enquiry vs unique branch lines.

---

## Docs produced this rebuild

- `docs/migrations/LOCATION-ROUTE-MIGRATION.md`
- `docs/audits/LOCATION-STRUCTURED-DATA-AUDIT.md`
- `docs/revamp/18-location-motion-review.md`
- `docs/revamp/19-location-production-validation.md` (this file)
- ADR-018 in `docs/DECISIONS.md`
