# Owner data migration — 2026-08-03 (round 2)

**Owner:** Ankit Nalawade  
**Intake date:** 2026-08-03  
**Branch checkpoint:** `studio-pulse-before-owner-data-round-2` @ `f5994df`  
**Status:** Audit complete — production code not modified in this commit  
**Prior intake:** `docs/business/OWNER-DATA-MIGRATION-2026-08-01.md`

## Provenance

| Field | Value |
|---|---|
| sourceType | `owner_interview` |
| sourceName | Ankit Nalawade |
| sourceDate | 2026-08-03 |
| verificationLevel | `owner_confirmed` (unless noted otherwise) |

Owner-confirmed ≠ independently documented. Credentials, medical suitability, and response-time guarantees need extra safeguards.

---

## 1. Newly owner-confirmed facts (safe to promote with care)

| Fact | Notes |
|---|---|
| Public name **Ankit’s Studio** | Already live |
| Category: Fitness Studio; logo descriptor Dance & Fitness | Already live |
| Founder **Ankit Nalawade**; role Founder | New — publishable with outcome-safe story |
| Legal/proprietor name Ankit’s Studio | Align `legalName` |
| Founded **2019** | Publishable |
| Public email **ankitsstudio5@gmail.com** | Replaces placeholder |
| Central phone/WhatsApp **+91 93724 02074** | Already live; same for all branches |
| Admin answers during studio operating hours | Safe wording only — **not** “within one minute” |
| Four printable branch addresses + Maps URLs | Unlock verified branch records + ExerciseGym |
| Operating hours 6:00 AM–10:00 PM every day, no weekly off | Already modelled; reinforce “no off day” |
| Free trial every service + every physical branch | Strengthen pricing/trial copy |
| Trial once per person | New |
| Advance booking not compulsory (check WhatsApp recommended) | New — not a walk-in guarantee |
| Registration ₹300 per person; not recharged after membership break | Extend commercial model |
| GST included in supplied prices | New — fees still pending amounts |
| Fees differ by branch | Corrects prior “do not claim fees differ by branch” |
| Discounts exist for some groups/plans; rules pending | Store, do not invent % |
| Wedding pricing basis: per couple | Amount pending |
| Home PT pricing basis: per session | Coverage/rate pending |
| Online: Zoom; one-to-one and group | Platform publishable |
| Functional Training equipment scope (bodyweight, bands, dumbbells, kettlebells, battle ropes, circuit, mobility, S&C) | Machine-free = no conventional gym machines |
| Typical session duration **1 hour** | No warm-up/workout split |
| Beginners welcome | No medical blanket claims |
| Kids Dance / Ladies Dance = Dance batch variants | Kids ages 3–8 and 8–12 |
| Corporate Fitness Sessions | Owner-confirmed but content-incomplete |
| 15+ trainers; mix employees + freelancers | Count already public |
| WhatsApp primary; phone also supported | Contact UX |

---

## 2. Partially confirmed / sequence-inferred

| Fact | Status | Rule |
|---|---|---|
| Branch opening years 2019 / 2021 / 2023 / 2026 mapped to Sector 19 → Sector 8 → Ghansoli → Thane | **owner_sequence_inferred** | Store privately; **do not publish** per-branch years until mapping confirmed |
| General amenities (parking, washroom/changing, AC, drinking water; lift N/A) | Owner general answers, **not** branch-mapped | Store as studio-level pending; **do not** put on every branch page or JSON-LD |
| Home PT covers studio offering apart from Zumba | Owner-provided | Do not invent exact home service list |
| Personalisation: group ≠ individually programmed; PT is personalised | Clarifies earlier “adapted to individual needs” overclaim | Update differentiator / About / FT copy |
| Lead trainer first names Tanvi, Deepali, Khushboo, Sandhya | Owner-provided, **unpublished** | No branch map; no profiles |

---

## 3. Evidence-pending (do not publish as verified claims)

| Fact | Status |
|---|---|
| Yoga cert — Yog Vidya Niketan, 2017; owner associates Ministry of Ayush | `owner_provided_evidence_pending` — **no** Ministry/gov wording publicly |
| Hiring bar: certification + 2+ years | Do not claim every trainer meets it |
| Exact programme fees / discount rules | Pending amounts |
| Membership expiry rule | Unanswered |
| Direct Google Business Profile URLs | Missing (Maps ≠ GBP) |
| Exact Home PT geography | Pending |
| Exact Online schedule/prices | Pending |
| Testimonials / Google reviews | **Deferred** — do not scrape |

---

## 4. Ambiguous answers — do not publish

| Owner reply | Risk if published |
|---|---|
| Combined “No” on pregnancy / seniors / injuries / medical conditions | Blanket exclusion or medical policy without clarity |
| “Missed classes — No” | Unclear policy |
| “Reply within one minute” (if stated) | Unverifiable SLA |

---

## 5. Medical / legal wording that must not be published

- Transform life / solve all health problems / treat health issues  
- Ministry of Ayush / government certified / government approved  
- Pregnant / senior / injury / medical acceptance policies from the ambiguous “No”  
- Final “no cancellation / no refund” as **legal terms** until customer-facing copy reviewed (`owner_confirmed_pending_legal_copy`)  
- Guaranteed walk-in accommodation  
- Fake ratings/reviews  

---

## 6. Route impact table

| Route | Existing statement | New owner information | Required correction |
|---|---|---|---|
| `/` | Addresses pending; machine-free adapted to individual needs; central WhatsApp | Printable addresses; group vs PT personalisation; founded 2019 if shown; working-professional emphasis optional | Fact-only copy; no new sections |
| `/about` | Founder pending; no founding year | Founder Ankit Nalawade; founded 2019; safe story | Enable concise founder section; **no** cert claims |
| `/trainers` | 15+; no profiles; noindex | Lead first names; employee/freelancer mix | Keep noindex; store leads unpublished |
| `/programs` | Confirmed catalogue without Corporate | Corporate Fitness Sessions confirmed incomplete | ADR: enquiry-only, **no** thin indexable page |
| `/programs/functional-training` | Generic machine-free | Equipment scope; 1 hour; beginners | Update content model |
| `/programs/adult-dance` | Kids/ladies as ask-about batches | Ages 3–8 / 8–12 for kids Dance | Document as Dance batch variants |
| `/programs/home-personal-training` | Thin delivery mode | Per-session pricing basis; not Zumba at home | Update copy; no invented list |
| `/programs/online-training` | Thin | Zoom; 1:1 and group | Update copy |
| Legacy kids-dance / PT / strength | Migration-pending | Kids = Dance batch | Keep migration posture; clarify Dance FAQ |
| `/locations` + each branch | Address pending; Sector 8 maps pending | Full addresses + Maps for all four | Verify records; remove pending banners |
| `/timetable` | Schedules pending; enquire WhatsApp | Advance booking not compulsory; check WhatsApp | Add safe wording only |
| `/pricing` | Fees vary by service; “do not claim differ by branch”; policies pending | Fees differ by branch; GST included; trial once; reg fee rule; wedding/home/online bases; policies pending legal copy | Correct commercial copy; no invented amounts |
| `/trial` | Placeholder email risk via contact | Real email; optional age/trial date fields | Update contact-driven forms |
| `/contact` | Placeholder email; pending addresses | Real email; addresses; admin hours | Update |
| Header/footer | Logo temporary; contact | Same logo unless official CDR export; email | Logo process; contact |
| Metadata / sitemap | Branch SEO without street address | Address-aware descriptions | Unique titles/descriptions |
| Structured data | WebPage only on branches (no ExerciseGym) | Eligible ExerciseGym with address + hours + central tel | ADR-018 update |
| WhatsApp builders | Trial/pricing/availability/trainer | Optional age / trial date where useful | Extend carefully; fields optional |
| Logo | PDF-derived temporary web assets | CDR zip official source | Export if tool available; else document blocker |

---

## 7. Structured-data changes (planned)

| Surface | Current | After promotion |
|---|---|---|
| Branch pages | WebPage + BreadcrumbList | + ExerciseGym when verified + owner_confirmed address; openingHours; telephone = central (visible); Maps URL if appropriate; **no** geo/ratings/amenities/schedules |
| About | WebPage + BreadcrumbList | Keep; optional AboutPage if architecture supports; **no** Person/credentials |
| Programmes / pricing / timetable | Unchanged safe model | No Course/Offer |

---

## 8. Metadata / local SEO

- Unique branch titles/descriptions using locality + address cues without stuffing  
- Canonicals unchanged  
- `/trainers` remains noindex until ADR-019 threshold  
- Corporate Fitness: **not** added to sitemap as a thin page  

---

## 9. Corporate Fitness decision (to confirm in ADR)

**Recommendation:** Treat as **enquiry-only** offering — mention on programmes discovery / contact / WhatsApp service list where useful; **do not** create a thin indexable `/programs/corporate-fitness` until useful body content exists.

---

## 10. Testimonials research — deferred

Do **not** fetch Google reviews in this migration. Need GBP links, attribution policy, and verification first. Track as pending research task.

---

## 11. Logo-export status (pre-implementation)

| Item | Status |
|---|---|
| Source | `brand-source/Ankit Studio logo.cdr final.cdr.zip` (CorelDRAW package) |
| Inspected | Package contains `content/data/*.dat`, ICC profiles, BMP thumbnails — **not** web SVG/PNG masters |
| CorelDRAW / reliable CDR exporter on build agent | **Not available** |
| Action | Preserve CDR; keep temporary `public/brand/*` from prior PDF workflow; **do not** auto-trace BMP/PDF; document in `docs/brand/LOGO-SOURCE-AND-EXPORT-STATUS.md` |

---

## 12. Outstanding questions for Ankit

1. Confirm branch opening-year mapping (Sector 19=2019, Sector 8=2021, Ghansoli=2023, Thane=2026)?  
2. Confirm amenities apply to **each** branch (parking, washroom, AC, water)?  
3. Supply Yog Vidya Niketan certificate file + exact credential wording?  
4. Full names, photos, consent, roles, programmes, branches for Tanvi / Deepali / Khushboo / Sandhya?  
5. Clarify pregnancy / seniors / injuries / medical policy (separate answers)?  
6. Clarify “Missed classes — No”?  
7. Membership expiry rule?  
8. Exact fees by branch/service and discount rules?  
9. Direct Google Business Profile URLs?  
10. Corporate Fitness: page content vs WhatsApp-only for now?  
11. Home PT: exact services and coverage localities?  
12. Export official SVG/PNG lockups from CorelDRAW when available?

---

## 13. Implementation notes (post-audit)

1. Add `OWNER_INTERVIEW_2026_08_03` provenance constant.  
2. Promote four branches to `dataStatus: "verified"` with printable addresses + Maps + pin codes.  
3. Replace contact email; set branch `phone` to central number for dial/JSON-LD consistency.  
4. Extend commercial/policy schema for trial-once, GST, fees-by-branch, pending legal policies.  
5. Enable About founder + founding year; fix personalisation wording sitewide.  
6. Programme content updates; Corporate enquiry-only ADR.  
7. Expand `buildLocalBusinessJsonLd` for hours + central telephone + richer PostalAddress.  
8. Update BUSINESS-DATA-STATUS.md.  
9. Logo status doc; no production branding swap without official exports.  
10. Tests for addresses, ExerciseGym visibility, forbidden claims, email, pricing copy.

**Frozen prototypes `/design-lab/revamp-*` must not be modified.**
