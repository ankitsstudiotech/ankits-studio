# Final owner requirements — normalized intake (12 August 2026)

Source: `docs/business/FINAL-OWNER-FORM-2026-08-12.csv` (151 columns, response dated 8/12/2026).  
Classifications below are **internal only** — not rendered on the public site.

Legend: `CONFIRMED_PUBLIC` · `CONFIRMED_INTERNAL` · `PUBLIC_INTENT_DATA_MISSING` · `FUTURE_BUSINESS` · `CONSENT_DEPENDENT` · `DO_NOT_PUBLISH` · `AMBIGUOUS_CONFLICT_RESOLVED`

---

## Brand & positioning

| Topic | Classification | Normalized value |
|---|---|---|
| Public name | CONFIRMED_PUBLIC | Ankit's Studio |
| Descriptor | CONFIRMED_PUBLIC | Dance & Fitness |
| Attributes | CONFIRMED_PUBLIC | Premium, energetic, professional, community-driven, dance-led, fitness-led |
| Intended feeling | CONFIRMED_PUBLIC | Minimalist, vibrant, modern, energetic, approachable, motivating, premium |
| Primary colour | CONFIRMED_PUBLIC | Purple (no theme change in this migration) |
| Primary CTA | CONFIRMED_PUBLIC | Book/enquire about free trial on WhatsApp |
| Secondary CTAs | CONFIRMED_PUBLIC | Find branch, Maps, call, reviews/stories when available |

---

## Customer promise (safe wording)

| Topic | Classification | Normalized value |
|---|---|---|
| Approachable fitness | CONFIRMED_PUBLIC | Simple, enjoyable, approachable, coach-guided, sustainable, community-oriented |
| Results orientation | AMBIGUOUS_CONFLICT_RESOLVED | Goals/progress language only — no guaranteed outcomes |
| Machine-free | CONFIRMED_PUBLIC | No conventional gym machines; bodyweight + functional equipment — not equipment-free |

---

## Service taxonomy (8 public programmes)

| Service | Classification | Notes |
|---|---|---|
| Functional Training | CONFIRMED_PUBLIC | Coach-led, machine-free, HIIT/mobility/strength themes |
| Zumba | CONFIRMED_PUBLIC | High energy, beginner-friendly; no calorie-burn claims |
| Yoga | CONFIRMED_PUBLIC | Traditional asanas; no medical claims |
| Dance | CONFIRMED_PUBLIC | Adult / ladies-only / kids-only batch variants — not separate pages |
| Wedding Choreography | CONFIRMED_PUBLIC | Per-couple pricing basis retained |
| Home Personal Training | CONFIRMED_PUBLIC | Navi Mumbai + Thane; per session |
| Online Training | CONFIRMED_PUBLIC | Zoom live; one-to-one + small group |
| Corporate Wellness | CONFIRMED_PUBLIC | Full route `/programs/corporate-wellness` (ADR-024) |
| TTEA | FUTURE_BUSINESS | Strategic intent only — no public route |

---

## Homepage intent (recorded, not visually changed)

| Section | Classification | Resolution |
|---|---|---|
| Top 3 | CONFIRMED_INTERNAL | Programmes, Google Reviews, Branches |
| Founder | CONFIRMED_INTERNAL | Compact presence in later visual prompt |
| FAQ / Free trial | CONFIRMED_PUBLIC | Yes |
| Member stories | CONSENT_DEPENDENT | Withhold until real consented data |
| Team | DO_NOT_PUBLISH | Not on homepage |
| Practical information | DO_NOT_PUBLISH | Remain absent |
| Machine-free block | CONFIRMED_INTERNAL | Supporting idea only |
| Garba/events | FUTURE_BUSINESS | Deferred |

---

## Pricing & commercial

| Topic | Classification | Normalized value |
|---|---|---|
| Exact prices | DO_NOT_PUBLISH | Enquiry-based model only |
| Fee variation | CONFIRMED_PUBLIC | By programme, branch, batch, duration, package |
| GST | CONFIRMED_PUBLIC | Included in quoted prices |
| Registration | CONFIRMED_PUBLIC | ₹300 one-time after joining — separate from free trial |
| Discounts | CONFIRMED_PUBLIC | May exist for listed groups — no invented %/dates |
| Membership policies | CONFIRMED_PUBLIC | Cancellation, refund, transfer, freeze, expiry published |
| Missed classes | AMBIGUOUS_CONFLICT_RESOLVED | Explicit NO — not published |

---

## Batch schedules

| Topic | Classification | Normalized value |
|---|---|---|
| Owner wants public schedules | PUBLIC_INTENT_DATA_MISSING | No table in form |
| Today | CONFIRMED_PUBLIC | 6 AM–10 PM operating window; batches via WhatsApp |

---

## Branches (all four)

Per-branch: station, landmark, travel note, open parking, amenities (all Yes except Lift No), new Maps URLs — **CONFIRMED_PUBLIC**. Printable postal addresses retained unless contradicted — **CONFIRMED_PUBLIC**.

Opening years: Sector 19 → 2019; Sector 8A → 2021; Ghansoli → 2023; Thane → 2026 — **CONFIRMED_PUBLIC**.

---

## Founder & coaching

| Topic | Classification | Normalized value |
|---|---|---|
| Founder story | CONFIRMED_PUBLIC | Editorial reduction of owner narrative; no “all health problems” |
| Coaching philosophy | CONFIRMED_PUBLIC | Effective, enjoyable, sustainable, inclusive |
| Certifications | DO_NOT_PUBLISH | Owner override 2026-08-12 — no individual qualifications public |

---

## Team & social proof

| Topic | Classification | Normalized value |
|---|---|---|
| Coach count | CONFIRMED_PUBLIC | 15+ coaches — no individual profiles yet |
| `/trainers` | CONFIRMED_INTERNAL | noindex until profiles/consent |
| Google reviews | CONSENT_DEPENDENT | Owner wants them — fetch in later prompt |
| Member/transformations | CONSENT_DEPENDENT | Withhold; no fake quotes |

---

## Contact & social

| Channel | Classification | Value |
|---|---|---|
| WhatsApp | CONFIRMED_PUBLIC | Primary |
| Phone +91 93724 02074 | CONFIRMED_PUBLIC | Yes |
| Email ankitsstudio5@gmail.com | CONFIRMED_PUBLIC | Yes |
| Contact form | DO_NOT_PUBLISH | No separate form |
| Response &lt;1 min | CONFIRMED_INTERNAL | Not public SLA |
| Instagram / YouTube | CONFIRMED_PUBLIC | Owner URLs in business identity |
| Custom domain | PUBLIC_INTENT_DATA_MISSING | Intent yes; no preferred name |

---

## Media

| Topic | Classification | Resolution |
|---|---|---|
| Form Drive uploads | DO_NOT_PUBLISH | Owner says existing media outdated |
| Interim art | CONFIRMED_INTERNAL | Approved illustrative/synthetic until new shoot |

---

## Motion preference (record only — no changes this migration)

**CONFIRMED_INTERNAL:** Medium — noticeable and restrained. Likes kinetic type, scroll reveals, programme motion, video hero, editorial splits. Avoid neon gym, excessive bounce, nightclub aesthetic, clutter.

---

## Growth priorities (internal only)

1. Corporate Wellness  
2. Home + Online Personal Training  
3. TTEA (future)

Do not expose B2B/revenue jargon to customers.

---

See also: `docs/business/FINAL-OWNER-CONFLICT-RESOLUTIONS-2026-08-12.md`
