# 25 — About production validation

**Date:** 2026-08-02  
**Branch:** `revamp/studio-pulse-production`  
**URL:** `/about`  
**Frozen prototypes:** untouched

---

## Previous About-page problems

- Legacy ivory/amber `Section` shell with “Placeholder studio narrative” badge  
- Public `FounderStoryPlaceholder` + `ScrollReveal` ornamental block  
- No programme/location discovery or WhatsApp trial CTA  
- Metadata described a founder placeholder  
- Breadcrumb JSON-LD only — no page `WebPage` node  
- No About content model or route honesty tests  

## Final page sequence

1. Opening — what Ankit’s Studio is  
2. Machine-free, coach-led approach  
3. Multi-discipline editorial index (crawlable programme links)  
4. Four neighbourhood branches (crawlable location links)  
5. Team and coaching (15+ owner-provided)  
6. Short factual FAQ  
7. Programme and location discovery  
8. Primary WhatsApp free-trial CTA  

## Confirmed claims displayed

- Multi-discipline dance & fitness studio  
- Machine-free, coach-led sessions adapted to individual needs and goals (no outcome promises)  
- Four branches: Airoli Sector 19, Airoli Sector 8, Ghansoli, Thane  
- Confirmed service catalogue via programme links  
- Home and online training as delivery options  
- 15+ trainers as an **owner-provided** team-size statement  

## Unsupported claims removed

- Invented founder biography / timeline  
- Ambiguous “2+ years” experience marketing  
- Certification, award, member-count, and “expert trainer” language  
- Mission/vision/value card grids  
- Animated statistics  

## Founder-story handling

- `founderStoryStatus: "pending"` — public founder section **omitted**  
- Mock-preview may show a restrained development-only pending note  
- Layout does not reserve an empty ornamental founder block  

## Team-information handling

- Static “15+” label (not an animated counter)  
- Provenance copy: owner-provided; names/qualifications unpublished  
- `trainerProfileSlugs: []` reserved for future verified profiles  

## Media slots

Added / documented: `about.hero`, `about.machine-free`, `about.community`, `about.team`, `about.disciplines`, `about.branches` — all pending with `PulseMediaPlate` fallbacks (`data-media-status="fallback"`).

Also captured missing Pricing screenshot: `docs/revamp/screenshots/pricing-production/pricing-1024x768.png` (Pricing route otherwise unchanged).

## Structured-data model

`WebPage` + `BreadcrumbList` only. No Person / Founder / Employee / Award / Review / AggregateRating / credential types.

## Motion retained and removed

See `docs/revamp/24-about-motion-review.md` — static editorial rhythm; founder ScrollReveal and counters deleted.

## Responsive findings

Screenshots under `docs/revamp/screenshots/about-production/` for 360–1920 viewports. No horizontal overflow observed in Playwright captures. Breadcrumb sits on a light utility strip for contrast on the dark field page.

## Accessibility findings

- Server-rendered H1; logical h2/h3 FAQ hierarchy  
- 44–48px link/CTA targets on discovery and conversion  
- Axe: **0 serious/critical** after breadcrumb contrast fix on About  
- Reduced motion: page remains fully usable (no required animation)  

## Tests added

`tests/routes/about-route.test.ts` (8) — pending founder/credentials, no 2+ years marketing, 15+ provenance, no FounderStoryPlaceholder, programmes/branches, WhatsApp CTA honesty, metadata, WebPage-only SD.

## Test results

| Check | Result |
|---|---|
| About route tests | **8** passed |
| Full unit suite | **221** passed |
| `tsc --noEmit` | Pass |
| Lint | 0 errors (existing warnings elsewhere) |
| Production build `ALLOW_MOCK_PUBLISH=true` | Pass |

## Remaining owner-data gaps

1. Founder story and portrait  
2. Founding date / subject of “2+ years”  
3. Trainer names, roles, qualifications, certificates  
4. Real studio / team / branch photography  
5. Legal/proprietor identity details if needed for About  

## Commits

1. `docs: audit about route and unsupported brand claims`  
2. `feat: rebuild about page with verified studio story`  
3. `feat: add honest team and multi-discipline sections`  
4. `fix: remove unsupported founder and credential claims`  
5. `chore: validate about production route`
