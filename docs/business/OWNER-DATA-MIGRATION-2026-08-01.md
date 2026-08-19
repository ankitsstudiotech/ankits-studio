# Owner data migration — 2026-08-01

**Source provenance (apply to all facts in this intake):**

| Field | Value |
|---|---|
| `sourceType` | `owner_interview` |
| `sourceDate` | `2026-08-01` |
| `sourceName` | Ankit |
| `verificationLevel` | `owner_confirmed` |

Maps short links were browser-resolved on 2026-08-01. Scraped Maps address text and Maps hours/ratings are **not** treated as independently document-verified printable facts. Certification / qualification claims remain unpublished.

**Logo source file on disk:** `brand-source/ankits_studio_logo_high_resolution.pdf` (task referred to `ankits-studio-logo-original.pdf`; same official lockup asset).

---

## 1. Owner-confirmed facts

| Fact | Value | Notes |
|---|---|---|
| Official business name | Ankit’s Studio | Not “Dance & Fitness” |
| Logo descriptor | Dance & Fitness | Present in lockup; not legal name |
| Branches currently open | Airoli Sector 19; Airoli Sector 8; Ghansoli; Thane | Four operating branches |
| Central phone + WhatsApp | +91 93724 02074 | Central enquiry number; inherited by branches — not unique per branch |
| Operating window (all branches) | 06:00–22:00 | **Operating window only** — not a batch timetable |
| Trial class | Free | Primary conversion intent: book free trial via WhatsApp |
| One-time registration fee | INR 300 | Programme fees otherwise vary / pending |
| Max group batch size | 15 | |
| Ladies-only batches | Available | Audience/batch option — not automatic separate services |
| Kids-only batches | Available | Audience/batch option — not automatic separate Kids Dance product |
| Enquiries across age groups | Accepted | Do **not** claim every programme suits every age |
| Core studio services (owner list) | Functional Training; Zumba; Yoga; Dance; Wedding Choreography; Home Personal Training; Online Training | Home PT + Online are **delivery modes**, not physical branch classes |
| Core services at all branches | Reported yes for studio services | Delivery modes are not branch-floor classes |
| Differentiator (safe wording) | Machine-free, coach-led sessions adapted to individual needs and goals | No outcome promises |
| Primary conversion | WhatsApp | Secondary: call, find a branch, trial form |
| Team size | 15+ trainers | Owner-confirmed count only — no “highly qualified” |
| Media | Photos / videos / testimonials can be provided | **Not yet supplied** — keep pending |

### Maps link associations (browser-resolved 2026-08-01)

| Branch (owner label) | Short link | Resolved place title | Maps-observed address (pending printable confirmation) | Maps-observed hours (do not publish as verified) |
|---|---|---|---|---|
| Airoli Sector 19 | https://maps.app.goo.gl/NWrGtXKKYwr5xXwbA?g_st=ac | Ankit's Studio | Shop No.05, Besides Satu’s Sweets, Sector-19, Airoli, Navi Mumbai, Maharashtra 400708 | Listed “Open 24 hours” — **contradicts** owner 06:00–22:00 |
| Ghansoli | https://maps.app.goo.gl/WzhJUEhAvC67eMgR8?g_st=ac | Ankit’s Studio | Satyam Imperial, Bus Depot, Sec 11, opposite Sai baba mandir, Jijamata Nagar, Sector 11, Ghansoli, Navi Mumbai, Maharashtra 400701 | Approx. 6 am–9 pm weekdays (Maps) — **differs** from owner 22:00 close |
| Thane | https://maps.app.goo.gl/bvzahC17HkciT6QQ6?g_st=ic | Ankit’s Studio | Edulji Rd, Dhobi Ali, Charai, Thane West, Thane, Maharashtra 400601 | Approx. 6 am–9 pm / Sun 11 am–9 pm (Maps) — **differs** from owner window |
| Airoli Sector 8 | — | — | **Missing** Maps link and exact address | — |

Phone on all three resolved Maps profiles matches **093724 02074** (same central number).

**Do not publish** Maps ratings, review counts, or review quotes from these profiles.

---

## 2. Partially confirmed facts

| Fact | Status | Why partial |
|---|---|---|
| “2+ years” experience | Partial | Subject unclear (owner? studio? trainers?) |
| “Government-approved” certifications | Partial / unpublished | No certification names, issuers, or applicable trainers |
| Commercial priority “grow fitness” | Partial | Likely Functional Training — exact meaning needs clarification |
| Printable branch addresses | Partial | Maps-observed strings exist for 3 branches; owner has not confirmed printable copy |
| Maps hours vs owner window | Conflict | Prefer owner window as operating hours; clarify Maps listings |
| “Dance” as a service | Partial | Site currently splits Adult Dance / Kids Dance |
| Functional Training vs Strength / Weight-loss / General Fitness | Partial | Taxonomy mapping unfinished |
| Home Personal Training vs Personal Training | Partial | Delivery mode vs in-studio 1:1 |
| Airoli Sector 8 | Existence confirmed; address + Maps pending | |

---

## 3. Missing facts

- Airoli Sector 8 exact address and Maps link
- Owner confirmation of printable address strings for Sector 19 / Ghansoli / Thane
- Detailed batch timetable (slots by programme/branch/day)
- Service-specific monthly / quarterly / annual pricing
- Clarification of “fitness” growth priority
- Clarification of “2+ years” subject
- Certification names, issuers, which trainers hold them
- Trainer identities / biographies
- Original photos, videos, testimonials
- Whether Strength Training, Weight-loss Training, Kids Dance, and in-studio Personal Training remain public products alongside the new owner list
- Legal entity / registered business name if different from display name
- Per-branch vs central-only enquiry policy long-term
- Email address for general enquiry (still placeholder)

---

## 4. Contradictions with current content

| Area | Current site / model | Owner intake | Action posture |
|---|---|---|---|
| Branch count / naming | `airoli`, `ghansoli`, `thane` (Thane unlisted); Airoli mock “Sector 15” | Four open: Sector 19, Sector 8, Ghansoli, Thane | Add Sector 8; rename Airoli display; list Thane; no silent redirects yet |
| Phone / WhatsApp | `+91 00000 00000` non-dialable placeholders | `+91 93724 02074` central | Promote central contact; keep dial gate honest |
| Hours | Mock weekdays to 21:00; Sat/Sun shorter; Thane empty | 06:00–22:00 all branches (window) | Replace mock hours with owner window; clear timetable slots stay mock/pending |
| Programme catalogue | Strength, PT, Yoga, Zumba, Adult Dance, Kids Dance, Weight-loss/Fitness | Functional Training, Zumba, Yoga, Dance, Wedding Choreography, Home PT, Online | Taxonomy conflict — keep old routes; add new services carefully |
| Pricing | Illustrative ₹999 / ₹2499 plans | Registration ₹300; programme fees pending | Remove reliance on fake plan prices in status docs; store registration fee; keep programme prices pending |
| Trial conversion | Primary CTA → `/trial` form | WhatsApp primary; form secondary | Reconfigure conversion; keep `/trial` |
| Thane | `publiclyListed: false`, address “To be confirmed” | Currently open | List publicly; address still pending printable confirmation |
| Maps links | Unassigned in content; two links in docs without branch labels | Three labelled links + Sector 8 missing | Associate resolved short URLs; do not embed until policy allows |
| SEO copy | Multi-programme “strength / PT / weight-loss” framing | Functional / dance / wedding / online modes | Update PRODUCT / status / metadata claims carefully — no invented SEO entities |
| Social proof | Mock testimonials labelled illustrative | Real testimonials pending | Keep mock labelled; do not invent |
| Hours vs Maps | N/A | Maps hours disagree with owner window | Document; prefer owner for site operating window |

---

## 5. Existing routes affected

| Route | Why affected |
|---|---|
| `/` | Conversion labels/hrefs; branch/programme mentions; no redesign in this task |
| `/programs`, `/programs/[slug]` | Catalogue + taxonomy; new slugs if added |
| `/locations`, `/locations/[slug]` | Four branches; Thane listing; Sector 8; contact inheritance |
| `/timetable` | Must not treat operating window as batch rows; slots remain pending |
| `/trial`, `/book-a-free-trial` | Secondary conversion; branch/programme enums |
| `/contact` | Central WhatsApp/phone priority |
| `/pricing` | Registration fee vs fake plan prices |
| `/trainers`, `/transformations`, `/about`, `/blog` | Claim language / pending media |
| Sitemap / structured data | Branch list, contact, hours omit-until-safe rules |

Design-lab frozen prototypes (`/design-lab/revamp-*`) are **out of scope** for content mutation.

---

## 6. Mock content that must be removed or demoted

- Fake phone/WhatsApp `+91 00000 00000` on central contact (replace with owner number)
- Invented Airoli “Sector 15” / Ghansoli “Sector 9” placeholder street addresses once pending messaging is honest
- Mock opening hours that imply a real batch schedule (Sat/Sun shortened hours presented as fact)
- Illustrative pricing rupee figures presented without clear non-publish posture in status docs
- Any implication that Thane is not operating
- Unassigned Maps pins documentation that contradicts labelled owner links
- Future: mock testimonials/transformations when real assets arrive (not yet)

**Keep for now (still structurally needed):** illustrative timetable slots labelled mock; mock trainer bios; illustrative testimonials — until replacements exist.

---

## 7. SEO claims that must change

- Location count / neighbourhood framing: include Thane + two Airoli sectors when listed
- Programme entity set in metadata/copy: avoid asserting Strength / Weight-loss as definitive once Functional Training is owner-primary — until taxonomy confirmed, do not invent redirects that drop equity
- Contact `tel:` / WhatsApp / LocalBusiness fields: only emit when provenance allows (ADR-011)
- Hours in structured data: operating window ≠ class timetable; omit detailed schedule until real slots verified
- Do not emit Maps ratings/review counts
- Registration fee may be stated only as owner-confirmed fee fact — not as a full pricing table

---

## 8. Taxonomy conflicts (explicit)

| Existing / brief term | Owner intake | Conflict | Proposed handling (no silent delete) |
|---|---|---|---|
| Strength Training | Functional Training (grow “fitness”) | Overlap / possible rename | Keep `/programs/strength-training`; propose map or rename after confirmation |
| Personal Training | Home Personal Training + in-studio unclear | Delivery mode vs studio 1:1 | Keep `/programs/personal-training`; add home-PT as delivery-mode service |
| Kids Dance | Kids-only **batches** (not necessarily a named product) | Product vs audience option | Keep `/programs/kids-dance`; confirm if still a public programme |
| Weight-loss Training / General Fitness | Functional Training / grow fitness | Overlap | Keep `/programs/weight-loss-fitness`; confirm merge vs retire |
| General Fitness | Same | Same | Same |
| Functional Training | Owner core service | Missing as first-class slug today | Add `/programs/functional-training` (or confirm rename of strength) |
| Wedding Choreography | Owner core service | Missing | Add programme slug; keep Dance routes |
| Online Training | Owner delivery mode | Missing | Add as delivery-mode programme/page; not a branch class |
| Adult Dance / Dance | “Dance” | Naming | Keep adult-dance; confirm umbrella label |
| Zumba / Yoga | Match | None | Keep |

---

## 9. Proposed route migration table

| Existing route | Proposed public service | Keep / rename / redirect / noindex-pending | Reason | SEO risk | Confirmation still needed |
|---|---|---|---|---|---|
| `/programs/strength-training` | Functional Training **or** retain Strength | **Keep** pending | Possible owner “fitness” mapping | Medium if renamed without redirect | Exact Strength ↔ Functional mapping |
| `/programs/personal-training` | In-studio PT (if any) | **Keep** pending | Home PT is separate delivery mode | Medium if conflated with Home PT | Does in-studio PT still exist? |
| `/programs/yoga` | Yoga | **Keep** | Confirmed | Low | — |
| `/programs/zumba` | Zumba | **Keep** | Confirmed | Low | — |
| `/programs/adult-dance` | Dance (adult) | **Keep** / possible rename label | Owner says “Dance” | Low–medium | Public label “Dance” vs “Adult Dance” |
| `/programs/kids-dance` | Kids Dance **or** kids-only batches only | **Keep** / **noindex-pending** if retired | Audience option vs product | High if removed without redirect | Is Kids Dance a programme? |
| `/programs/weight-loss-fitness` | Possibly Functional / retire | **Keep** pending | Overlaps Functional | Medium | Merge vs keep |
| _(new)_ `/programs/functional-training` | Functional Training | **Add** (keep old until confirmed) | Owner core + commercial priority | Low if additive | Relationship to Strength/Weight-loss |
| _(new)_ `/programs/wedding-choreography` | Wedding Choreography | **Add** | Owner core | Low | Branch availability details |
| _(new)_ `/programs/home-personal-training` | Home Personal Training | **Add** | Delivery mode | Low | Geography covered |
| _(new)_ `/programs/online-training` | Online Training | **Add** | Delivery mode | Low | Platforms / scheduling |
| `/locations/airoli` | Airoli Sector 19 | **Keep** slug; **rename** display | Avoid breaking links | Low if display-only | Confirm slug `airoli` vs `airoli-sector-19` |
| _(new)_ `/locations/airoli-sector-8` | Airoli Sector 8 | **Add**; address **noindex-pending** fields | Owner open branch | Low | Address + Maps |
| `/locations/ghansoli` | Ghansoli | **Keep** | Confirmed open | Low | Printable address |
| `/locations/thane` | Thane | **Keep**; **list publicly** | Owner open | Medium (was unlisted) | Printable address |

No redirects executed in this migration task.

---

## 10. Questions still requiring Ankit’s response

1. Confirm printable address strings for Sector 19, Ghansoli, and Thane (Maps-observed drafts available for review).
2. Supply Airoli Sector 8 address + Maps link.
3. Confirm operating window 06:00–22:00 vs differing Google Maps hours (and “24 hours” on Sector 19 listing).
4. Map Strength Training, Weight-loss/General Fitness, and Functional Training — keep, merge, or rename?
5. Does in-studio Personal Training still exist beside Home Personal Training?
6. Is Kids Dance a named programme, or only kids-only batch options inside Dance / other services?
7. What does “grow fitness” mean exactly (Functional Training only, or broader)?
8. Clarify “2+ years” (whose experience?).
9. List certification names, issuers, and which trainers hold them — or confirm do-not-publish.
10. Confirm legal/registered name if different from Ankit’s Studio.
11. Supply photos, videos, and testimonials when ready.
12. Provide service-specific pricing (monthly / quarterly / annual).
13. Confirm whether `/locations/airoli` should permanently mean Sector 19 or redirect to a new slug.
14. Preferred WhatsApp greeting language / required fields vs optional fields for production messages.
15. General enquiry email address.

---

## 11. Implementation notes for following phases

- Prefer owner window for `openingHours`; never insert operating hours as `TimetableSlot` rows.
- Central WhatsApp/phone on `ContactDetails`; branches inherit the same number with explicit central-enquiry semantics.
- Registration fee INR 300 as a verified commercial fact; programme plan prices remain pending/mock-cleared.
- Do not weaken `ALLOW_MOCK_PUBLISH` / `noindex` / dial-link gates for unverified branch addresses or Maps embeds.
- Frozen design-lab prototypes unchanged; production homepage not redesigned in this migration.
