# About route audit — commercial & brand claims

**Date:** 2026-08-02  
**Route:** `/about`  
**Branch:** `revamp/studio-pulse-production`  
**Scope:** Production About page only — frozen design-lab prototypes untouched  
**Status:** Audit complete — production code not modified in this commit

---

## Summary

`/about` is still a **legacy placeholder shell**: ivory/amber `Section`/`Badge` UI, a public **founder placeholder** block with `ScrollReveal`, and **no** Studio Pulse composition, programme/location discovery, or `WebPage` JSON-LD.

Identity copy from `getBusinessIdentity()` is broadly safe. The page still surfaces an ornamental founder section that reads as incomplete narrative theatre, and it does not yet present the confirmed four-branch / multi-discipline / machine-free story with crawlable links.

---

## Inventory

| File/component | Current behaviour | Accuracy/design risk | Required action |
|---|---|---|---|
| `src/app/(marketing)/about/page.tsx` | Legacy `Section` + badge “Placeholder studio narrative”; H1 = display name; identity description; disclaimer only when identity is mock | Mixed signal: identity is `verified` so mock disclaimer is omitted, while badge still says placeholder | Rebuild as Pulse editorial page; remove placeholder badge language |
| Same — body copy | Explicitly refuses years / certs / awards / member stats | Accurate honesty note, but page has no positive verified story beyond identity paragraph | Replace with confirmed studio story; keep silence on unresolved claims |
| Same — metadata | Title “About”; description mentions “founder story placeholder” | Meta describes placeholder state — weak SEO and brand | Retitle; describe machine-free / branches / programmes |
| Same — structured data | `BreadcrumbList` only; **no** `WebPage` / `AboutPage` | Incomplete but safe (no Person/Award) | Add `WebPage` + breadcrumbs; do **not** emit Person / founder / credentials |
| `FounderStoryPlaceholder` | Public section “The story behind the studio” + placeholder media + ScrollReveal | Appears as a major section; visitors may think a founder story is “coming” as a product promise; uses generic ScrollReveal | **Omit** from production About until owner narrative exists; do not show “coming soon” as a hero block |
| `FounderStoryPlaceholder` media | `/mock-media/programme-placeholder.svg` via `MediaFrame` | Mock graphic could be read as studio photography | Use `PulseMediaPlate` fallbacks with `data-media-status="fallback"` when media slots exist; never describe as real people |
| Identity `tagline` / `description` | Machine-free, multi-branch, service list | Aligned with owner-confirmed catalogue | Reuse via content model; do not invent outcomes |
| `StudioCommercial.differentiator` | Safe machine-free wording | Not used on About today | Surface on About |
| `StudioCommercial.trainerCountNote` | “15+ trainers (owner-confirmed…)” | Not used on About; if misused with adjectives → risk | Show count-only with owner-provided provenance; no “certified/elite” |
| `StudioCommercial.experienceNotePartial` | Internal “2+ years” note | **Must not** appear publicly until subject clarified | Keep off About; assert in tests |
| Certifications / awards / member counts | Absent on About | Low current risk | Keep absent; test for forbidden phrases |
| Mission / vision / value cards | Absent | — | Do not introduce |
| Statistic counters / timelines | Absent on About (founder block is not a timeline) | ScrollReveal on founder is residual motion noise | No counters; no timeline; restrained motion only |
| Programme / location links | Absent | Missed crawlable discovery | Add confirmed programme + four-branch links |
| WhatsApp trial CTA | Absent on About | Conversion gap vs homepage | One final WhatsApp free-trial CTA via central helpers |
| About content schema | None — copy scattered in page JSX | Hard to gate founder/credentials status | Add `StudioAbout` (or equivalent) provenanced content |
| About media slots | None in `media-slots.ts` / requirements doc | Layout may depend on missing photography | Add `about.*` slots + fallbacks |
| Route / SD tests | **None** for `/about` | Regressions possible | Add honesty + metadata + SD tests |
| Mock trainers (`getTrainers`) | Not rendered on About | If linked later without labels → high risk | Do not pull mock trainer portraits onto About |
| Global Organization JSON-LD | Layout-level, identity-gated | Out of About page scope; must stay verified-central | Do not add conflicting Person/Employee on About |

---

## Unsupported claims that must not ship

| Claim type | Present on `/about` today? | Rule |
|---|---|---|
| Invented founder narrative | Placeholder labelled, not invented biography | Omit section until verified copy exists |
| Founding date / year | No | Keep null |
| Ambiguous “2+ years” | No (stored partial only) | Never render `experienceNotePartial` |
| Fake trainer qualifications | No | Never invent |
| Fake awards / member counts | No | Never invent |
| Outcome promises (“transform…”) | No | Keep banned phrases out |
| Person / Founder JSON-LD | No | Do not emit |

---

## Mock-preview (`ALLOW_MOCK_PUBLISH=true`)

- Identity and commercial records used by About are marked `verified`, so About is not currently a mock-data publisher for those domains.
- Risk remains the **founder placeholder UI** and any future wiring of mock trainers/media as if real.
- Mock-preview must keep `noindex` behaviour from site chrome; About must not invent commercial or credential terms under mock publish.

---

## Required rebuild direction (post-audit)

1. Editorial Pulse page: opening → machine-free → multi-discipline → four branches → team (15+ owner-provided) → discovery links → WhatsApp trial CTA.  
2. Central about content model with nullable founder / founding / credentials status.  
3. Omit unresolved founder section in production.  
4. Media slots with honest fallbacks.  
5. `WebPage` + `BreadcrumbList` only.  
6. Tests covering honesty, CTA, SD, metadata.

---

## Out of scope

Homepage, programmes, locations, batch availability, pricing, trainers, transformations, booking/contact, frozen `/design-lab/revamp-*`.
