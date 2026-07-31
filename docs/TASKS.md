# Task Board

Live task board for parallel Claude Code / Cursor work. See ownership rules in
[AGENTS.md](../AGENTS.md) and [DECISIONS.md ADR-006](./DECISIONS.md#adr-006).

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

## Phase 0 (this pass)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Governance docs (13 files) + CLAUDE.md + AGENTS.md | Claude | Done | This commit |

## Phase 1 (not started)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Finalize design tokens (palette, type, spacing) | Unclaimed | Not started | Depends on DESIGN-DIRECTION.md approach |
| Content-model types + mock accessor layer | Unclaimed | Not started | Claude-owned zone by default (data layer) |
| Mock data authoring per BUSINESS-DATA-STATUS.md domains | Unclaimed | Not started | Must include `mockDisclaimer` per record |
| Tier 1 route scaffolding | Unclaimed | Not started | Claude-owned zone (route structure) |
| Base Motion system (reveal/hover/focus) | Unclaimed | Not started | Cursor-owned zone (component implementation) |
| Mock-data UI banner component | Unclaimed | Not started | Cross-cutting — claim explicitly before starting |

## Phase 2+ 

Not yet broken into tasks — see [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md)
Phase 2–4 for scope. Break down into rows here when Phase 1 exit criteria are met.

## Standing rules (apply to every task, every phase)

- No task may mark a [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) row
  `VERIFIED` — that requires the business owner, not either agent.
- No task introduces GSAP or WebGL without a corresponding
  [DECISIONS.md](./DECISIONS.md) entry (ADR-005).
- No task changes a type in [CONTENT-MODEL.md](./CONTENT-MODEL.md) without
  updating that doc and adding/updating the relevant DECISIONS.md entry in the
  same change.
