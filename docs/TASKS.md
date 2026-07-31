# Task Board

Live task board for parallel Claude Code / Cursor work. See ownership rules in
[AGENTS.md](../AGENTS.md), [DECISIONS.md ADR-006](./DECISIONS.md#adr-006), and
the track/branch/dependency detail in
[IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) (which this board mirrors —
if the two ever disagree on ordering, IMPLEMENTATION-PLAN.md wins and this
board is out of date).

## Claiming protocol

1. Before editing any file outside your default ownership zone (see AGENTS.md),
   add or update a row below with your agent name and status `In progress`.
2. Only one agent may hold `In progress` on a given file/area at a time.
3. On completion, set status to `Done`, note the commit, and — if the change
   touched [CONTENT-MODEL.md](./CONTENT-MODEL.md) types or anything in
   [DECISIONS.md](./DECISIONS.md) — confirm both were updated in the same
   change.
4. If you need a file another agent has claimed, wait or explicitly hand off in
   this table; never edit a file another agent has `In progress`.
5. **Respect the dependency graph below.** "Claimable" only means the task's
   dependencies are `Done`, not that any unclaimed task can start whenever —
   see [DECISIONS.md ADR-007](./DECISIONS.md#adr-007) finding C3 for why this
   line exists (an earlier version of this board listed everything as
   parallel; several tasks are actually serial).

## Shared file hotspots (DECISIONS.md ADR-007, finding I8)

These files will be touched by more than one track. Single-writer rule
applies even more strictly here than the general claiming protocol — claim
explicitly, do the minimum edit needed, and release the claim quickly:

| File / area | Rule |
|---|---|
| `docs/TASKS.md` | Update your own rows only; don't rewrite another agent's `In progress` row. |
| `docs/HANDOFF.md` | One agent updates it per session-end; don't edit mid-session unless coordinating a handoff. |
| `docs/DECISIONS.md` | New ADRs appended only, never renumbered/reordered by a different agent than the one who added them, without discussion. |
| `src/app/layout.tsx` | Owned by whichever track is actively wiring something in (tokens import, mock banner, nav structure) — claim for that single commit, release immediately after. |
| Global CSS / tokens file | Owned by Track A (design tokens) until `Done`; no other track edits it. |
| `Header` / `Footer` / `MockDataBanner` components | Claimed explicitly per edit — these are shared across every route. |
| `src/lib/content/**` types ↔ `docs/CONTENT-MODEL.md` | Only updated together, only by the agent holding the content-model task, per Hard Rule 9. |

## Phase 0 (complete)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Governance docs (13 files) + CLAUDE.md + AGENTS.md | Claude | Done | Initial commit |

## Phase 0.5 (complete, this pass)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Reconcile CURSOR-ARCHITECTURE-REVIEW.md — verdict + doc updates for every Critical/Important finding | Claude | Done | `docs: reconcile architecture review` |

## Phase 1 — dependency-ordered (see IMPLEMENTATION-PLAN.md for full detail)

Safe parallel kickoff: **Track A ∥ Track B only.** Everything else has a hard
dependency — do not start it early "because it's unclaimed."

| Track | Task | Depends on | Owner | Status | Branch |
|---|---|---|---|---|---|
| A | Design tokens (palette, type, spacing, accent-family mapping, mobile breakpoints/nav pattern) | — (start immediately) | Cursor | Unclaimed | `phase-1/design-tokens` |
| B | Content-model types + accessor layer + Vitest setup | — (start immediately) | Claude | Unclaimed | `phase-1/content-model` |
| C | Mock data authoring per BUSINESS-DATA-STATUS.md domains | B | Claude | Unclaimed | `phase-1/mock-data` |
| D | Tier 1 route scaffolding (8 routes) + noindex + timetable SSR default + mobile timetable layout | B (hard), C (soft — can start against fixtures) | Claude | Unclaimed | `phase-1/routes` |
| E | Base Motion system (opt-in islands only, per ADR-009) | A (hard), D (soft — primitives can be built early, integration needs D's markup) | Cursor | Unclaimed | `phase-1/motion-base` |
| F | Mock-data UI banner | B | Claude (logic) + Cursor (styling), sequenced on one branch | Unclaimed | `phase-1/mock-banner` |

## Phase 2+ 

Not yet broken into per-file rows — see
[IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) Phase 2 for the three
tracks (Tier 2 routes, programme×location pages, SEO + launch-gate tests) and
their dependencies. Break down into rows here when Phase 1 exit criteria are
met.

## Standing rules (apply to every task, every phase)

- No task may mark a [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) row
  `VERIFIED` — that requires the business owner, not either agent.
- No task introduces GSAP or WebGL without a corresponding
  [DECISIONS.md](./DECISIONS.md) entry (ADR-005).
- No task changes a type in [CONTENT-MODEL.md](./CONTENT-MODEL.md) without
  updating that doc and adding/updating the relevant DECISIONS.md entry in the
  same change.
- No task renders a `tel:`/`wa.me` href or a `mapEmbedUrl` from a record
  unless `dataStatus === "verified"` (ADR-011).
- No task adds `/locations/[branch]/[programme]` pages, Tier 2 nav links, or
  any route ahead of the phase/tier it's scoped to in
  [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) without a
  `DECISIONS.md` entry explaining the reprioritization.
