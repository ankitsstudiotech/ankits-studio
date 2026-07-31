# Implementation Plan

Phased delivery plan. Each phase's exit criteria gate the next phase starting.
Cross-references: [DECISIONS.md](./DECISIONS.md) for why,
[TASKS.md](./TASKS.md) for the live task board.

## Phase 0 — Governance foundation (this pass)

Docs listed in [PROJECT-BRIEF.md](./PROJECT-BRIEF.md), CLAUDE.md, AGENTS.md.
No application source files touched.

**Exit criteria**: all 13 docs + both root instruction files exist, are mutually
consistent (no contradictions between docs, or between docs and DECISIONS.md),
and [HANDOFF.md](./HANDOFF.md) reflects current state.

## Phase 1 — Design system + content model + Tier 1 scaffolding

- Finalize concrete design tokens (palette oklch values, type pairing, spacing
  scale) within the approach fixed by
  [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md).
- Implement the content-model types and mock-data accessor layer from
  [CONTENT-MODEL.md](./CONTENT-MODEL.md) (`src/content/mock/`,
  `src/lib/content/`).
- Implement the Phase-1 pieces of the launch gate from
  [DECISIONS.md ADR-002](./DECISIONS.md#adr-002): the type-level guarantee and
  the UI mock-data banner.
- Scaffold Tier 1 routes per [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md):
  `/`, `/programmes`, `/programmes/[slug]`, `/locations`, `/locations/[slug]`,
  `/timetable`, `/trial`, `/contact`.
- Motion: base reveal/hover/focus system with Motion, per
  [MOTION-SYSTEM.md](./MOTION-SYSTEM.md).

**Exit criteria**: Tier 1 routes pass the gates in
[ACCESSIBILITY-STANDARDS.md](./ACCESSIBILITY-STANDARDS.md) and
[PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md); mock banner visibly renders on
every Tier 1 route.

## Phase 2 — Tier 2 routes + SEO structured data + motion polish

- Build `/trainers`, `/trainers/[slug]`, `/pricing`, `/transformations` with the
  extra inline-disclaimer treatment required by
  [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md) Tier 2.
  `/pricing` implementation must decide and record its plan-comparison
  interaction model as a DECISIONS.md entry if it deviates from a plain table
  (data-viz-as-design-system requirement, per DESIGN-DIRECTION.md).
- Implement `LocalBusiness`/`Course` structured data per
  [SEO-STRATEGY.md](./SEO-STRATEGY.md), gated to omit until `VERIFIED`.
- Introduce any justified GSAP timelines per
  [MOTION-SYSTEM.md](./MOTION-SYSTEM.md) / ADR-005 pattern.
- Build the CI-level launch-readiness check (ADR-002 layer 3).

**Exit criteria**: Tier 2 routes pass the same accessibility/performance gates;
structured data validated against Google's Rich Results Test with mock data
correctly excluded.

## Phase 3 — Hardening + Tier 3

- Full accessibility pass across every shipped route (not just per-route gates —
  a cross-route consistency check: shared nav/footer, consistent focus order).
- Full performance pass (real device testing, not just lab Lighthouse).
- `/blog`, `/blog/[slug]` — ship as "coming soon" stub unless real content exists
  by this point, per Tier 3 guidance in
  [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md).

**Exit criteria**: every route in [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md)
exists in at least a stub or full state; all gates pass site-wide.

## Phase 4 — Business data verification + launch

- Owner reviews [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) row by row;
  each domain flips to `VERIFIED` as confirmed, content updated in the same
  change per that doc's workflow.
- NAP consistency check per [SEO-STRATEGY.md](./SEO-STRATEGY.md) once addresses
  are verified.
- Indexing-level gate (ADR-002 layer 4) flips: production becomes indexable only
  once required domains are `VERIFIED`.
- Thane branch specifically: ship live only if the owner confirms it operates;
  otherwise remains a mock/internal-only branch or is removed from the live nav.

**Exit criteria**: [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) shows
`VERIFIED` for every domain required by whichever routes are going live; launch
gate passes; site goes live.

## Explicitly out of scope for now

Writing any application source file — this plan is the roadmap those future
sessions follow, not something executed in this pass (see AGENTS.md constraint
"do not edit application source files during this task").
