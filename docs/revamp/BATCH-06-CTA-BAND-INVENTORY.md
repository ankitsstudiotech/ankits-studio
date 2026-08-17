# Batch 06 — closing CTA-band inventory

Shared primitive: `src/components/conversion/ClosingBand.tsx`
(`data-compose="closing-band"`). Copy mass left, action mass right.
Variants: `accent` (Home purple band, cream primary CTA) and `field` (quiet dark close).

Do not treat index footers or in-body enquiry links as this family.

| Route | Component | Conversion intent | Before composition | Eligible for shared redesign | Special considerations | After |
|---|---|---|---|---|---|---|
| `/` `#trial` | `FreeTrialCta` → `ClosingBand` accent | Consumer free trial (WhatsApp) | Heading + copy + button clustered left; unused 1fr track | Yes | Preserve purple accent band. Inverse cream CTA must remain accessible — no accent-on-accent. Registration note stays as supporting copy. Homepage FAQ still follows this band (pre-existing chapter order). | Editorial close: title/copy left, cream WhatsApp CTA right. |
| `/about` | About page → `ClosingBand` field | Consumer free trial | Heading + lede + WhatsApp in left measure | Yes | Do not reopen About hero. Team/FAQ pair handled separately. | Shared field close. |
| `/programs/functional-training` and other consumer programme details | `ProgrammeDetailView` → `ClosingBand` field | Consumer free trial | Heading + copy + button left on the dark field | Yes | One conversion sentence. No repeated WhatsApp disclaimer in the band. | Shared field close. Heading: “Enquire about a free trial”. |
| `/programs/corporate-wellness` | `ProgrammeDetailView` → `ClosingBand` field | `service-enquiry` | Same left-cluster anatomy with enquiry copy | Yes, as **enquiry variant** | Do not force “free trial”. Preserve `isServiceEnquiryProgramme`. Sticky CTA also follows enquiry. | Heading: “Planning wellness for your team?” Enquiry WhatsApp CTA. |
| `/locations/airoli-sector-19` and the other three branch details | `BranchDetailView` → `ClosingBand` field | Consumer free trial | Same left-cluster as programmes | Yes | Branch-aware sentence. Hero rail unchanged. | “Book a free trial” + “Prefer {locality}? …” |
| `/trainers` | Trainers page → `ClosingBand` field | Withheld / readiness enquiry | Heading + copy + button left | Yes | Lower-pressure. Not a named-coach directory. Secondary “Explore Programmes” link must not inherit cream fill. | “Ask about availability” + WhatsApp. |
| `/transformations` | Member stories page → `ClosingBand` field | Readiness / trial (page `ctaTitle` / `ctaBody`) | Heading + copy + button left | Yes | Keep existing page conversion copy. Secondary trial-form link is a text action, not a second primary. | Shared field close. |
| `/programs` index | `ProgrammeDiscovery` compact footer | Consumer trial + corporate note | Compact CTA row + branch link + corporate sentence | **No** | Index closer, not the unfinished heading/copy/button band. Corporate note remains enquiry-specific. | Unchanged. |
| `/locations` index | `LocationDiscovery` compact CTA row | Consumer trial | Single button under the directory | **No** | Not the CTA-band family. | Unchanged. |
| `/pricing`, `/trial`, `/contact`, `/timetable` | Utility builders / forms | Trial or fee enquiry | Utility measure, not a marketing close band | **No** | Audit only. Change only if the same left-cluster defect is present as a P1. | Unchanged after visual audit — intentional utility. |
| Sticky CTA bar | `StickyCtaBar` | Route-aware trial vs enquiry | Persistent chrome | **No** | Soft-hides against `#trial` / `#programme-closing`. | Unchanged. |
| Design-lab / legacy programme notice | Lab + `LegacyProgrammeNotice` | n/a | Not production marketing closes | **No** | Out of Batch 06 scope. | Unchanged. |

## Variants encoded

- **A. Consumer trial** — Home accent; programme/branch/About field.
- **B. Corporate service enquiry** — Corporate Wellness field close; no free-trial heading.
- **C. Withheld / readiness** — `/trainers` availability enquiry; `/transformations` uses existing page CTA copy.

Google Reviews / Places is not part of this family and was not started.
