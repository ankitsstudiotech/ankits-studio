# Handoff

_Last updated: 2026-07-31 — Phase 0 complete; independent architecture review done._

## Current state

The full governance/planning doc set exists under `docs/`, plus root
`CLAUDE.md` and `AGENTS.md`. No application source files have been created or
modified — `src/app/` is still the stock `create-next-app` scaffold
(`layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`). `docs/audits/` exists
and is currently empty (pre-existing, unrelated to this pass).

All 13 planning docs plus the two root instruction files were reviewed together
for contradictions before this handoff was written — see
[Consistency check](#consistency-check) below.

**Independent architecture review (complete):** a staff-level review of the
proposed architecture is in
[CURSOR-ARCHITECTURE-REVIEW.md](./CURSOR-ARCHITECTURE-REVIEW.md). It classifies
findings (Critical / Important / Optional / Rejected) across complexity, local
SEO, conversion, motion/performance, accessibility, App Router, content
separation, mock-data publish risk, parallelism, merge conflicts, testing,
mobile, media optimisation, thin location pages, and overengineering. Existing
planning docs were **not** rewritten by that pass — Critical/Important items
recommend which doc should change in a follow-up planning edit **before** Phase
1 application work. Do not start Phase 1 implementation until Critical findings
(especially programme×location SEO IA, Motion vs landing JS budget, Phase 1
task dependencies, and launch-gate test requirements) are addressed or
explicitly deferred in `DECISIONS.md`.

## What's decided (see DECISIONS.md for full rationale)

- Stack: Next.js App Router, TypeScript strict, Tailwind (ADR-001).
- Mock-data strategy: typed `dataStatus` field + 4-layer launch gate, owner-only
  verification (ADR-002).
- Route/IA structure with 3-tier build order (ADR-003).
- Design system: one shared system, per-programme accent tokens, not sub-brands
  (ADR-004).
- Motion default, GSAP for justified complex timelines only, no WebGL by default
  (ADR-005).
- Claude/Cursor ownership split + TASKS.md claiming protocol (ADR-006).

## What's next (Phase 1 — see IMPLEMENTATION-PLAN.md)

1. Finalize concrete design tokens (exact oklch palette, type pairing, spacing
   scale) — currently only the *approach* is fixed, not values.
2. Implement the content-model types and mock-data accessor layer
   (`src/content/mock/`, `src/lib/content/`) per CONTENT-MODEL.md.
3. Author mock data for every domain in BUSINESS-DATA-STATUS.md, each record
   carrying `dataStatus: "mock"` and a `mockDisclaimer`.
4. Scaffold the 8 Tier 1 routes.
5. Build the mock-data UI banner (ADR-002 layer 2) before any Tier 1 route is
   considered demo-ready.

Claim these in [TASKS.md](./TASKS.md) before starting.

## Open questions for the business owner (blocking Phase 4, not Phase 1)

- Does the Thane branch actually operate yet, or is it aspirational? Affects
  whether it ever gets a live route.
- Real branch addresses for Airoli and Ghansoli (the two Maps links are
  reference-only, not transcribed addresses).
- Real phone/WhatsApp numbers, fees, batch timings, trainer roster and
  qualifications, and whether any existing testimonials/transformation stories
  can be used with consent.
- Brand assets: is there an existing logo/photography library, or does Phase 1
  need to proceed with fully placeholder imagery?

None of these block Phase 1 — they block Phase 4 (launch) per ADR-002 and the
BUSINESS-DATA-STATUS.md verification workflow.

## Consistency check performed

Cross-checked: route lists match verbatim across INFORMATION-ARCHITECTURE.md,
SEO-STRATEGY.md, IMPLEMENTATION-PLAN.md, and TASKS.md. Content-model field names
(`dataStatus`, `mockDisclaimer`) match verbatim across CONTENT-MODEL.md,
BUSINESS-DATA-STATUS.md, DECISIONS.md ADR-002, and both root instruction files.
Motion/GSAP/WebGL rules match verbatim across MOTION-SYSTEM.md, DECISIONS.md
ADR-005, and AGENTS.md. No contradictions found. If a future change to any one
of these needs to diverge, update the others in the same commit — see the
ownership rules in AGENTS.md.

## How to resume

Read [PROJECT-BRIEF.md](./PROJECT-BRIEF.md) first, then this file, then
[TASKS.md](./TASKS.md) for what's currently claimed/available.
