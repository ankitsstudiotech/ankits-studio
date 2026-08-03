# 27 — Trainers production validation

**Date:** 2026-08-03  
**Branch:** `revamp/studio-pulse-production`  
**URL:** `/trainers`  
**Frozen prototypes:** untouched  
**ADR:** ADR-019

---

## Previous Trainers-route problems

- Legacy card grid rendering two mock “Illustrative Trainer” profiles  
- Placeholder certification strings and invented programme/branch assignments  
- `getTrainers()` returned all records (including mock) to marketing routes  
- `/trainers` always in sitemap static routes once the sitewide gate lifted  
- No `forceNoIndex` on the live index while zero real profiles existed  
- Metadata described an “illustrative roster” without a readiness model  

## Final page sequence

1. Opening — the coaching team  
2. Owner-provided 15+ team-size statement  
3. Coaching across confirmed programmes (crawlable links)  
4. Four neighbourhood branches (crawlable links)  
5. Honest profile-readiness state (no empty card grid)  
6. Explore programmes and locations  
7. WhatsApp training-availability enquiry  

## Confirmed claims shown

- Team of **15+** trainers (owner-provided provenance)  
- Team supports confirmed programmes  
- Trainer availability varies by branch and programme  
- Profiles/credentials being prepared for publication  

## Unsupported claims removed

- Highly qualified / expert / certified / government-approved  
- Ambiguous “2+ years”  
- Mock names, bios, photos, specialty badges, branch assignments  
- Fake profile card grid  

## Content-readiness / indexing policy

| State | Behaviour |
|---|---|
| Below threshold (current) | `/trainers` reachable; **noindex**; **excluded from sitemap**; no public slug pages |
| `getPublishableTrainers().length >= 3` | May index `/trainers` and include publishable slug URLs |

Footer nav retains Trainers; not promoted in primary nav. No redirect to `/about`.

## Profile publication threshold

**3** complete publishable profiles (`TRAINERS_ROUTE_INDEX_THRESHOLD`).  
Per-profile gate: verified + published + consent + photo permission + role + programme/branch + safe credential/experience (ADR-019).

## Team-size treatment

Static **15+** label — not an animated counter — with owner-provided provenance note.

## Media slots

`about.team` (reuse), `trainers.coaching-action`, `trainers.portrait` (inactive until publishable). Fallbacks labelled; no generated faces.

## Structured-data output

`WebPage` + `BreadcrumbList` only. No Person / Employee / Credential / ItemList of trainers.

## Motion retained and removed

See `docs/revamp/26-trainers-motion-review.md` — static editorial; fake card cascades and counters deleted.

## Responsive findings

Screenshots: `docs/revamp/screenshots/trainers-production/` (360–1920). No fake profile links; no illustrative names.

## Accessibility findings

- Axe: **0 serious/critical**  
- Meta robots: `noindex, nofollow`  
- Server-rendered H1; 48px link targets  
- Reduced motion: fully usable  

## Tests added

- `tests/routes/trainers-route.test.ts` (7)  
- `src/content/schema/trainer-publishability.test.ts` (5)  
- Sitemap tests updated for trainers exclusion / threshold inclusion  
- Programme SD test no longer depends on mock trainer catalogue  

## Test results

| Check | Result |
|---|---|
| Full unit suite | **234** passed |
| `tsc --noEmit` | Pass |
| Production build `ALLOW_MOCK_PUBLISH=true` | Pass |
| Axe `/trainers` | Pass (0 serious/critical) |

## Remaining owner-data gaps

1. Trainer names, roles, photos, consent  
2. Programme/branch assignments per person  
3. Certification names, issuers, evidence  
4. Clarification of “2+ years” subject  
5. Whether “highly qualified” / “government-approved” can ever be used — and with what evidence  

## Commits

1. `docs: audit trainers route and unsupported credentials`  
2. `feat: add verified trainer content readiness model`  
3. `feat: rebuild trainers route with honest team presentation`  
4. `fix: gate unverified trainer profiles and indexing`  
5. `chore: validate trainers production route`
