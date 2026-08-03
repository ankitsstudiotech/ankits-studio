# Trainers route audit — credentials & mock profiles

**Date:** 2026-08-03  
**Route family:** `/trainers`, `/trainers/[slug]`  
**Branch:** `revamp/studio-pulse-production`  
**Scope:** Trainers only — frozen design-lab prototypes untouched  
**Status:** Audit complete — production code not modified in this commit

---

## Summary

`/trainers` is a **legacy card grid** that publicly renders **two mock illustrative trainers** (names, bios, placeholder certifications, specialty badges, branch assignments) via `getTrainers()`, which does **not** filter to verified/publishable records. Individual slug pages are statically generated for those mocks. Metadata describes an “illustrative roster” but does **not** `forceNoIndex` on live mock profiles. Sitemap always includes `/trainers` in `STATIC_ROUTES` once the sitewide gate lifts, even with zero publishable profiles.

Owner-safe fact (**15+ trainers**, count only) lives on `/about`, not on `/trainers`. Owner phrases “highly qualified”, “government approved”, and “2+ years” must **not** be published.

---

## Inventory

| File/component | Current behaviour | Accuracy/design risk | Required action |
|---|---|---|---|
| `src/app/(marketing)/trainers/page.tsx` | Card grid of all `getTrainers()`; MediaFrame placeholders; qualifications captions | Appears as a real roster despite disclaimers; fake card grid | Rebuild as honest team page; render **publishable only** |
| Same — metadata | Title “Trainers”; description mentions illustrative roster; **no `forceNoIndex`** | Indexable when sitewide gate lifts | `forceNoIndex` until readiness threshold met |
| Same — SD | `BreadcrumbList` only | Incomplete but safe (no Person) | Add `WebPage` + breadcrumbs; never Person/Employee/Credential |
| `src/app/(marketing)/trainers/[slug]/page.tsx` | Full profile: photo, bio, quals, specialties, branches | Mock people look like staff; `generateStaticParams` includes mocks | Public routes only for publishable trainers; otherwise `notFound` |
| Same — metadata | Trainer name + bio; `forceNoIndex` only when missing | Live mock profiles not per-route noindexed | Gate on publishability; noindex until profiles exist |
| `src/content/schema/trainer.ts` | Minimal provenanced shape; no publication consent / verification states | Cannot express publishability threshold | Extend readiness model |
| `src/content/mock/trainers.ts` | Two `dataStatus: "mock"` records with placeholder cert strings | **Publicly rendered today** | Stop rendering; keep empty production roster or non-public mocks only |
| `getTrainers()` / `getTrainerBySlug()` | Returns **all** merged trainers | Unlike pricing/timetable verified-only accessors | Add `getPublishableTrainers()`; public routes use that |
| `src/lib/seo/sitemap.ts` | `/trainers` always in `STATIC_ROUTES`; slug URLs only if `verified` | Index URL promises a completed trainer directory | Exclude `/trainers` until indexing threshold met |
| Footer nav `nav-footer-trainers` | Footer link to `/trainers` | Moderate discovery; not primary nav | Keep secondary; do not promote as complete roster |
| Primary nav | Trainers absent | Good — no primary promise | Retain |
| `TrainerCards` / `TrainerSection` | Design-lab only | Isolated | Do not wire into production |
| Person / Employee / Credential JSON-LD | **None** in codebase | Low current SD risk | Keep absent |
| ScrollReveal on trainers | Not used | — | Do not introduce |
| Animated counters | Not used | — | Do not introduce |
| Owner “highly qualified” / “government approved” / “2+ years” | Not on trainers page today; stored partial on commercial | High risk if copied into UI | Forbid in copy + tests |
| About team block | Honest 15+ + provenance | Correct pattern | Align trainers page with this honesty |

---

## Content that appears factual but is unsupported

| Claim / surface | Status |
|---|---|
| “Illustrative Trainer — A./B.” as card titles | Mock names — must not ship as public roster |
| “Placeholder certification — not verified” | Still reads as a qualification field | Remove from public UI |
| Specialty badges (Strength, Yoga, …) on mock cards | Invented assignments | Remove |
| Branch links on mock detail pages | Invented assignments | Remove |
| Bios describing coaching roles | Fiction with disclaimer — still misleading as cards | Remove |
| “Qualifications to be confirmed” empty state | Soft-claims a pending personal credential | Prefer team-level readiness copy |

---

## Mock records that can render publicly

Under `ALLOW_MOCK_PUBLISH=true` (and in development):

1. `/trainers` → both illustrative trainers  
2. `/trainers/illustrative-trainer-1`  
3. `/trainers/illustrative-trainer-2`  

These are labelled mock but still form a **fake profile grid**. Mock-preview must not make invented people look like the coaching team.

---

## Indexing / sitemap / navigation risks

| Signal | Risk |
|---|---|
| No `forceNoIndex` on `/trainers` or live slug pages | Becomes indexable when all content domains verify |
| `/trainers` in `STATIC_ROUTES` | Sitemap implies a finished trainer directory |
| Mock slugs excluded from sitemap (good) | Insufficient alone |
| Footer “Trainers” link | OK if page is honest and noindex until ready |

**Policy direction (to implement):** Keep `/trainers` reachable; **noindex** and **exclude from sitemap** until a publishability threshold is met; do **not** emit Person/Employee; do **not** create public slug pages without publishable profiles; do **not** redirect to `/about`.

---

## Required rebuild direction (post-audit)

1. Trainer content readiness model + publishability gate.  
2. ADR for indexing threshold.  
3. Pulse editorial `/trainers` — 15+ owner-provided, programmes/branches, readiness, WhatsApp enquiry.  
4. Empty public roster; no fake cards.  
5. Tests for forbidden claims, noindex, sitemap exclusion, SD safety.

---

## Out of scope

Homepage, programmes, locations, batch availability, pricing, about, transformations, booking/contact, frozen `/design-lab/revamp-*`.
