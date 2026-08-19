# Batch availability route audit

**Date:** 2026-08-02  
**Scope:** `/timetable` and batch-related selectors, WhatsApp, nav, SEO  
**Baseline:** ADR-016; `docs/audits/BATCH-AVAILABILITY-CONSISTENCY-AUDIT.md`  
**Rule:** Do not modify production code until this audit is committed

---

## Executive finding

Public `/timetable` is already labelled **Batch Availability** and does **not** render fake class rows. Gaps for this rebuild:

1. No interactive enquiry builder (only a generic WhatsApp trial CTA)
2. Incumbent marketing `Section` + card-bordered lists — not Studio Pulse utility treatment
3. No FAQ or explicit ladies/kids / max-batch notes on this page
4. WhatsApp helpers lack service-aware availability templates (Home / Online / physical)
5. Stale IA/docs still describe a filterable “Timetable”
6. Unused production components (`BranchTimetable`, `BatchPreview`) can still render rows if fed slots — keep verified-only; design-lab fixtures remain isolated

---

## Audit table

| File/component | Current behaviour | Accuracy risk | Required action |
|---|---|---|---|
| `src/app/(marketing)/timetable/page.tsx` | Honest copy + operating window + programme/branch link lists + generic WhatsApp CTA; BreadcrumbList only | Low invent-schedule risk; UX incomplete (no enquiry builder); visual system is pre-Pulse marketing sections | Rebuild as Studio Pulse utility sequence with client enquiry island; add WebPage JSON-LD; keep no fake table |
| `src/content/mock/navigation.ts` | Label “Batch Availability”, path `/timetable` | Low | Keep |
| `src/content/index.ts` `getTimetableSlots()` | Verified-only → currently `[]` | Low if callers stay honest | Keep gate; tests must continue to assert empty public set |
| `src/content/mock/timetable.ts` | Mock slots with placeholder times | High **if** rendered publicly | Keep for launch-gate only; never wire into `/timetable` |
| `src/components/timetable/BranchTimetable.tsx` | Renders rows when `slots.length > 0`; empty → WhatsApp | Medium if a caller passes mock slots | Not used on production locations; do not mount on `/timetable`; optional harden later |
| `src/components/programs/BatchPreview.tsx` | Same pattern | Medium if remounted | Not used on production programmes; leave; do not use on `/timetable` |
| `src/components/home/TimetablePreview.tsx` | Illustrative table defaults | High if used on marketing | Lab/components only — do not use |
| `src/lib/conversion/whatsapp.ts` | Trial template with Preferred branch/time; no availability-specific Home/Online variants | Medium — wrong fields for delivery modes | Add availability enquiry builders (Phase 3) |
| `src/lib/seo/structured-data.ts` | No Event/Schedule on timetable | Low | Keep safe; emit WebPage + BreadcrumbList only |
| `src/lib/seo/sitemap.ts` | Includes `/timetable` when indexable | Low | Keep URL |
| `docs/INFORMATION-ARCHITECTURE.md` | Still “filterable timetable” language | Doc drift | Out of this task’s page rebuild; note residual |
| Design-lab fixtures | Placeholder schedule rows | Acceptable (noindex) | **Do not modify** frozen revamp prototypes |
| Tests (`timetable-public`, programme/location SD) | Expect empty public slots / ban Event | Positive | Extend for builder + WhatsApp variants |
| Homepage / programmes / locations | Already honest batch copy | Out of scope | **Do not redesign** |

---

## Fake-schedule probes (current)

| Probe | Result |
|---|---|
| `/timetable` renders mock start/end rows | No |
| Operating window shown as continuous class | No — caption clarifies |
| Event / Schedule JSON-LD on `/timetable` | No |
| Nav still says “Timetable” | No — Batch Availability |
| Seat counts / “live availability” | No |
| Enquiry builder with branch/service modes | **Missing** — rebuild target |

---

## Required rebuild outcomes (downstream phases)

1. Calm utility page sequence (intro → hours → builder → audience notes → CTA → FAQ → related links)
2. Service-aware WhatsApp messages (physical / home / online)
3. Studio Pulse low-tempo visuals — no calendar grid, no equalizer, no dashboard cards
4. WebPage + BreadcrumbList only
5. Tests + validation doc

**Do not modify production code until this document is committed.**
