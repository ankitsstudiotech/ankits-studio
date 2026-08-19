# Location route migration — four confirmed branches

**Date:** 2026-08-02  
**Scope:** `/locations`, `/locations/[slug]`, branch content, SEO, structured data, internal links  
**Out of scope:** programmes redesign, homepage redesign, frozen `/design-lab/revamp-*`, other route families (except necessary link/slug updates that keep them consistent)  
**Owner facts:** `docs/business/OWNER-DATA-MIGRATION-2026-08-01.md`

---

## Final public routes

| Final route | Public name | Locality |
|---|---|---|
| `/locations/airoli-sector-19` | Ankit’s Studio — Airoli Sector 19 | Airoli Sector 19 |
| `/locations/airoli-sector-8` | Ankit’s Studio — Airoli Sector 8 | Airoli Sector 8 |
| `/locations/ghansoli` | Ankit’s Studio — Ghansoli | Ghansoli |
| `/locations/thane` | Ankit’s Studio — Thane | Thane |

Index remains `/locations`.

---

## Route migration table

| Current route | Current location | Owner-confirmed status | Proposed action | Final route | Data gaps | SEO risk | Internal-link changes |
|---|---|---|---|---|---|---|---|
| `/locations` | Index of publicly listed branches | Four open branches confirmed | Rebuild discovery UI (Studio Pulse); keep path | `/locations` | Branch media pending | Low — path stable | Point teasers at final slugs; honest pending copy |
| `/locations/airoli` | Displayed as Airoli Sector 19; legacy short slug | Branch open; printable address pending; Maps short URL owner-supplied | **Permanent redirect** to descriptive slug (identity certain: same Sector 19 branch) | `/locations/airoli-sector-19` | Printable address; PIN; landmarks; parking; photos | Medium if indexed later — mitigate with 308 + updated canonicals/internal links; site currently noindex while mock content remains | Homepage, footer, programmes, contact, trial enums, trainers, FAQs, testimonials, timetable, media slot key, tests |
| `/locations/airoli-sector-19` | Does not exist yet | Same as Sector 19 above | **Create** as canonical Sector 19 route | `/locations/airoli-sector-19` | Same | Low once redirect in place | Becomes target of all Sector 19 links |
| `/locations/airoli-sector-8` | Airoli Sector 8 | Branch open; **address + Maps pending** | Keep slug; rebuild detail page with honest pending states | `/locations/airoli-sector-8` | Exact postal address; Maps URL; PIN; landmarks; parking; photos | Low — already public slug | Keep; ensure not presented as having maps/address |
| `/locations/ghansoli` | Ghansoli | Branch open; printable address pending; Maps short URL owner-supplied | Keep slug; rebuild detail | `/locations/ghansoli` | Printable address; PIN; landmarks; parking; photos | Low | Keep |
| `/locations/thane` | Thane | Branch open (was historically unlisted in early docs); Maps short URL owner-supplied | Keep slug; ensure publicly listed; rebuild detail | `/locations/thane` | Printable address; PIN; landmarks; parking; photos | Low — already listed in content | Keep; scrub stale “Thane unlisted” comments |
| Provisional “Sector 15” / three-branch assumptions | Design-lab fixtures / stale docs only | Obsolete | **Do not** invent production routes; leave frozen design-lab alone | N/A | N/A | None if production ignores fixtures | Docs/comments only |

**Redirect policy**

- Add **one** permanent redirect: `/locations/airoli` → `/locations/airoli-sector-19` (no chain).
- Do **not** redirect Sector 8, Ghansoli, or Thane.
- Do **not** delete `/locations/airoli` without the redirect — inbound homepage and footer links still use it today.
- Canonical on Sector 19 pages must be `/locations/airoli-sector-19` only.

---

## Inventory snapshot (pre-migration)

| Surface | Finding |
|---|---|
| Content | Four mock branch records; slug enum `airoli`, `airoli-sector-8`, `ghansoli`, `thane` |
| Homepage | Hardcoded four branches; Sector 19 href `/locations/airoli` |
| Programme pages | `getPubliclyListedBranches()` filtered by programme `branchSlugs` |
| Nav / footer | Primary “Locations”; footer lists all public branch slugs |
| Sitemap | `/locations` + verified public branches only (empty while `shouldNoIndex()`) |
| Structured data | `buildLocalBusinessJsonLd` → `ExerciseGym`; currently **null** (branches mock) |
| Media | `branch.airoli`, `branch.airoli-sector-8`, `branch.ghansoli`, `branch.thane` pending |
| Tests | `locations-routes`, content-rules, structured-data, sitemap, e2e `/locations/airoli` |

---

## Field-level verification status (all four)

| Field | Sector 19 | Sector 8 | Ghansoli | Thane |
|---|---|---|---|---|
| Existence / public name | owner_confirmed | owner_confirmed | owner_confirmed | owner_confirmed |
| Locality label | owner_confirmed | owner_confirmed | owner_confirmed | owner_confirmed |
| Complete postal address | pending | pending | pending | pending |
| PIN | pending | pending | pending | pending |
| Maps short URL | owner_confirmed (link) | pending | owner_confirmed (link) | owner_confirmed (link) |
| Maps-observed street text | externally_corroborated — **do not publish as owner wording** | — | same | same |
| Central phone / WhatsApp | owner_confirmed (central) | same | same | same |
| Branch-unique phone | N/A — central only | same | same | same |
| Operating window 06:00–22:00 | owner_confirmed | owner_confirmed | owner_confirmed | owner_confirmed |
| Batch schedule | pending | pending | pending | pending |
| Physical floor services (5) | owner_confirmed catalogue | same | same | same |
| Ladies-only / kids-only availability | owner_confirmed (studio-wide attribute) | same | same | same |
| Max group batch size 15 | owner_confirmed (studio-wide) | same | same | same |
| Landmarks / station / parking / facilities | pending | pending | pending | pending |
| Branch photography | pending | pending | pending | pending |
| GBP URL | pending | pending | pending | pending |
| Geo coordinates | pending | pending | pending | pending |
| Ratings / reviews | **never publish from Maps** | — | — | — |

**Record-level `dataStatus`:** remains non-`verified` until printable address (and policy for Maps/contact dial) clear owner verification — Hard Rule / ADR-002. Field provenance will be explicit per important field in the content model update.

---

## Physical services vs delivery modes

**On branch pages (“Available at this branch”):**

- Functional Training  
- Zumba  
- Yoga  
- Dance (`adult-dance`)  
- Wedding Choreography  

**Not inside branch service lists:**

- Home Personal Training  
- Online Training  

These may appear under “Other ways to train with Ankit’s Studio.”

---

## Structured-data posture (pre-decision; audit in Phase 6)

Until printable addresses are verified:

- Prefer `WebPage` + `BreadcrumbList`.
- Emit `ExerciseGym` / `LocalBusiness` **only** when verified fields accurately describe the branch without inventing `PostalAddress`.
- Never emit ratings, reviews, geo, class schedules, Offer, Event, Course.
- Do not list Home/Online as branch `hasOfferCatalog` / contained services.

Full audit: `docs/audits/LOCATION-STRUCTURED-DATA-AUDIT.md` (Phase 6).

---

## Internal-link change checklist

| Source | Change |
|---|---|
| Homepage `BRANCHES` | Sector 19 href → `/locations/airoli-sector-19` |
| Footer branch list | Driven by content slugs after enum update |
| Programme detail location links | Auto via content |
| Contact branch cards | Auto via content |
| Timetable branch links | Auto via content |
| Trial form branch enum | Schema slug update |
| Trainers / FAQs / testimonials / timetable mock | `airoli` → `airoli-sector-19` |
| Media slot `branch.airoli` | Rename key to `branch.airoli-sector-19` (+ exterior/interior slots) |
| E2E `/locations/airoli` | Hit final slug and assert redirect |
| Frozen design-lab | **No edits** — old `/locations/airoli` links resolve via redirect |

---

## Unresolved owner questions

1. Confirm printable street address wording for Sector 19, Ghansoli, and Thane (Maps-observed strings are not enough).
2. Supply Sector 8 exact address and Maps link.
3. Confirm PIN codes for each branch, if any should be published.
4. Confirm whether Maps short URLs may be shown publicly while printable address remains pending (recommended: yes — link only, no invented address, no embed until intentional).
5. Confirm long-term: keep central-only enquiry, or add unique branch lines later.
6. Clarify Maps listing hours vs owner 06:00–22:00 operating window (site prefers owner window; not a batch timetable).
7. Supply branch exterior/interior photography and whether Google Business Profile URLs should be published separately from Maps short links.
8. Confirm landmarks, nearest station, and parking copy per branch — or keep permanently omitted until supplied.

---

## Implementation order (this rebuild)

1. This document (commit: `docs: define four-branch location route migration`)
2. Content model + four-branch data + slug rename + redirect + tests
3. `/locations` Studio Pulse discovery
4. Four branch detail pages
5. Structured-data alignment + ADR
6. Motion review, QA screenshots, validation doc, full verification

**Do not modify production location pages until this migration document is committed.**
