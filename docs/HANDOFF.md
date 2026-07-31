# Handoff

_Last updated: 2026-07-31 — Phase 0.5 complete (architecture review reconciled)._

## Current state

The full governance/planning doc set exists under `docs/`, plus root
`CLAUDE.md` and `AGENTS.md`. No application source files have been created or
modified — `src/app/` is still the stock `create-next-app` scaffold
(`layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`). `docs/audits/`
exists and is currently empty (pre-existing, unrelated to this pass).

**Architecture review reconciled (complete):** an independent staff-level
review, [CURSOR-ARCHITECTURE-REVIEW.md](./CURSOR-ARCHITECTURE-REVIEW.md), was
reconciled against the Phase 0 docs. Every Critical (C1–C4) and Important
(I1–I12) finding has an explicit accept / partial-accept / reject verdict in
[DECISIONS.md ADR-007](./DECISIONS.md#adr-007) (master table) through
[ADR-012](./DECISIONS.md#adr-012) (detailed decisions for the items that
needed real technical specification). Accepted changes have already been
applied to the affected docs — this was not a "recommendations only" pass.
Nothing was accepted just because the review raised it: see ADR-007's table
for the reasoning behind every partial-accept and reject, in particular the
YAGNI-driven rejections (no `MediaAsset.licenceNote`/`lqip` yet, no
member-count content type yet, no dual URL shape for programme×location
pages, no dark theme).

**Phase 1 may now start.** The three things the review said would block
Phase 1 (local SEO IA, Motion vs. landing budget, Phase 1 task dependencies)
are resolved: see ADR-008 (programme×location pages, scoped to Phase 2 rather
than Phase 1 — deliberately, to avoid overloading Phase 1's scope), ADR-009
(Motion opt-in-island model), and the dependency graph now in
[IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) / [TASKS.md](./TASKS.md).

## What's decided (see DECISIONS.md for full rationale)

- Stack: Next.js App Router, TypeScript strict, Tailwind (ADR-001), with App
  Router rendering/client-boundary rules now made explicit (ADR-010).
- Mock-data strategy: typed `dataStatus` field (three states — `mock` /
  `reference-only` / `verified`) + 4-layer launch gate, owner-only
  verification (ADR-002), hardened against specific leak paths — hardcoded
  facts, unrendered `mapEmbedUrl`, non-dialable mock numbers, JSON-LD
  omission, a Phase 1 `noindex` exit criterion, and named test obligations
  (ADR-011).
- Route/IA structure with 3-tier build order (ADR-003), extended with a new
  Tier 2 route family for local SEO: `/locations/[branch]/[programme]`
  (ADR-008), and a progressive/phased primary nav so Tier 2 links never
  appear before their routes exist (ADR-007 finding I12).
- Design system: one shared system, three semantic accent families
  (`strength`/`calm`/`high-energy`, not one raw token per programme,
  ADR-012), light theme only for v1 (ADR-007 finding I4).
- Motion default, opt-in client-island loading model (not a root-layout
  default) to fit the landing-page JS budget (ADR-009); GSAP for justified
  complex timelines only, no WebGL by default (ADR-005).
- Claude/Cursor ownership split + TASKS.md claiming protocol (ADR-006), now
  with a Phase 1 dependency graph and named shared-file hotspots (ADR-007
  findings C3, I8).
- Content-model refinements: `MediaAsset` type (minimal — no
  licence/blur-placeholder fields yet), deferred blog body format, semantic
  accent keys (ADR-012).

## What's next (Phase 1 — see IMPLEMENTATION-PLAN.md for full track detail)

Six tracks, two safe to start immediately in parallel, the rest gated by
dependencies — **do not start a task out of order because it looks
unclaimed**:

1. **Track A — Design tokens** (Cursor, branch `phase-1/design-tokens`,
   start now). Palette, type, spacing, the three accent-family token
   mappings, mobile breakpoints/nav pattern decision.
2. **Track B — Content-model types + accessor layer** (Claude, branch
   `phase-1/content-model`, start now, parallel with Track A). Also
   introduces Vitest (chosen for low config overhead) and the first two
   ADR-011 test obligations.
3. **Track C — Mock data authoring** (Claude, after Track B).
4. **Track D — Tier 1 route scaffolding** (Claude, after Track B; can
   overlap late Track C). Includes the Phase 1 `noindex` exit criterion and
   the `/timetable` SSR-default-plus-client-filter pattern.
5. **Track E — Base Motion system** (Cursor, after Track A; real integration
   after Track D has core routes). Opt-in islands only, per ADR-009.
6. **Track F — Mock-data UI banner** (cross-cutting, after Track B; claim
   explicitly).

Claim these in [TASKS.md](./TASKS.md) before starting.

## Open questions for the business owner (blocking Phase 4, not Phase 1)

- Does the Thane branch actually operate yet, or is it aspirational? Affects
  whether `Branch.publiclyListed` ever flips to `true` for it.
- Real branch addresses for Airoli and Ghansoli (the two Maps links are
  reference-only, not transcribed addresses, and are never embedded in the UI
  pre-verification per ADR-011).
- Real phone/WhatsApp numbers, fees, batch timings, trainer roster and
  qualifications, and whether any existing testimonials/transformation
  stories can be used with consent.
- Brand assets: is there an existing logo/photography library, or does
  Phase 1 need to proceed with fully placeholder imagery?
- Which conversion channel the owner actually wants prioritized (trial form
  vs. WhatsApp vs. phone) and which form/analytics vendor, if any — deferred
  per ADR-007 finding I1 until there's something concrete to attach the
  decision to.

None of these block Phase 1 — they block Phase 4 (launch) per ADR-002/ADR-011
and the BUSINESS-DATA-STATUS.md verification workflow.

## Consistency check performed (this pass)

Cross-checked after applying the reconciliation: route lists (including the
new `/locations/[branch]/[programme]` family) match across
INFORMATION-ARCHITECTURE.md, SEO-STRATEGY.md, IMPLEMENTATION-PLAN.md, and
TASKS.md. `dataStatus`/`mockDisclaimer`/`MediaAsset`/`ProgrammeAccentFamily`
match verbatim across CONTENT-MODEL.md, BUSINESS-DATA-STATUS.md, and
DECISIONS.md ADR-011/ADR-012. Motion's opt-in-island model matches across
MOTION-SYSTEM.md, PERFORMANCE-BUDGET.md, and DECISIONS.md ADR-009. The
`/contact` budget-bucket rationale in PERFORMANCE-BUDGET.md no longer
contradicts its own table (ADR-007 finding I11, fixed directly). The
mock-data strategy and the four-layer production-launch block are preserved
throughout — ADR-011 only adds enforcement, it removes no layer of ADR-002.
If a future change to any of these needs to diverge, update the others in the
same commit — see the ownership rules in AGENTS.md.

## How to resume

Read [PROJECT-BRIEF.md](./PROJECT-BRIEF.md) first, then this file, then
[TASKS.md](./TASKS.md) for what's currently claimed/available, then
[IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) for the track detail
behind whichever task you're picking up.
