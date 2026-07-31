# Decisions Log (ADR-style)

This is the authoritative "why" record for the project. CLAUDE.md and AGENTS.md
both defer to this file — if either instruction file appears to contradict an
entry here, this file wins and the instruction file is out of date and should be
corrected. New architectural or governance decisions get a new numbered entry
here; they are never just made ad hoc in a doc file.

<a id="adr-001"></a>
## ADR-001: Stack — Next.js App Router, TypeScript strict, Tailwind

**Decision**: Build on the existing scaffold — Next.js (App Router) 16, React 19,
TypeScript strict mode, Tailwind v4. All important SEO content is server-rendered
(RSC/static generation), never client-fetched-and-painted.

**Why**: Matches the owner's explicit stack requirement, and App Router's RSC
model directly supports the server-rendering requirement in
[SEO-STRATEGY.md](./SEO-STRATEGY.md). Note the repo's `AGENTS.md` breaking-changes
banner: this Next.js version may differ from training-data assumptions — the
relevant guide under `node_modules/next/dist/docs/` must be read before writing
App Router code.

**Status**: Active.

<a id="adr-002"></a>
## ADR-002: Typed mock-data strategy + multi-layer launch gate

**Decision**: Every content record carries `dataStatus: "mock" | "reference-only" | "verified"` (see
[CONTENT-MODEL.md](./CONTENT-MODEL.md)), backed by
[BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) as the ground-truth table.
Preventing an accidental production launch with mock data is enforced at four
layers, planned for Phase 1–4 implementation
([IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md)):

1. **Type-level**: a mock record cannot exist without a `mockDisclaimer` string
   (discriminated union, not just an optional field).
2. **UI-level**: a non-dismissable banner renders whenever any content on the
   current page has `dataStatus` of `"mock"` or `"reference-only"`; high-risk fields (price, phone,
   address, trainer identity) render an inline disclaimer in addition to the
   page banner.
3. **Build/CI-level**: a launch-readiness check (planned script, not yet
   implemented) reads the content layer, and fails the production build/deploy
   if any record required by a live route is still `"mock"` while the deploy
   target is production.
4. **Indexing-level**: non-production environments are unconditionally
   `noindex`; production doesn't go live/get indexed until the Phase 4 gate in
   [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) passes (see
   [SEO-STRATEGY.md](./SEO-STRATEGY.md)).

Only the business owner may flip a [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md)
row to `VERIFIED`; neither agent may infer verification.

**Why**: The owner brief is explicit that most business details are unverified
and must never be presented as real — this needs to be true structurally, not
just as a convention someone might forget mid-project.

**Status**: Active — design decided now, implementation is future work (not
built in this governance-only pass).

<a id="adr-003"></a>
## ADR-003: Route/IA structure and tiering

**Decision**: The route list and three-tier build order in
[INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md) — Tier 1 (structural,
lowest risk), Tier 2 (higher-risk domains: trainers, pricing, transformations),
Tier 3 (blog, deferrable).

**Why**: Lets development proceed immediately on mock data (per ADR-002) while
concentrating extra scrutiny on the routes where a leaked mock value would cause
the most real-world harm (fake prices, fake named trainers).

**Status**: Active.

<a id="adr-004"></a>
## ADR-004: Design system — one shared system with per-programme accent tokens

**Decision**: No sub-brand per programme family. One base visual/motion system
(per [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md)) with a per-programme accent
token (`heroAccent` on the `Programme` type) providing just enough
differentiation between strength/personal-training and yoga/Zumba/dance contexts.

**Why**: The brief requires serving both audiences "without looking visually
confused" — a full sub-brand-per-programme approach fragments the brand; a single
undifferentiated system undersells either audience. The accent-token approach is
the narrowest change that solves the stated problem.

**Status**: Active. Exact token values are a Phase 1 deliverable, not fixed here.

<a id="adr-005"></a>
## ADR-005: Motion default, GSAP for complex timelines only, no WebGL by default

**Decision**: Motion is the default animation library. GSAP is permitted only for
scroll-scrubbed pinned timelines, complex SVG path work, or heavy multi-element
orchestration — each usage justified with its own log entry below this one when
introduced. WebGL is not used unless a specific business benefit is demonstrated
and logged the same way.

**Why**: Per the owner brief directly, and to keep bundle size inside
[PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md) — defaulting to the heavier
tools everywhere would blow the budget for no craft benefit.

**Status**: Active. No GSAP or WebGL usage has been introduced yet as of this
writing (governance phase, no UI built).

<a id="adr-006"></a>
## ADR-006: Parallel Claude Code / Cursor ownership boundaries

**Decision**: See the ownership table in [AGENTS.md](../AGENTS.md) and the
claiming workflow in [TASKS.md](./TASKS.md). Summary: Claude Code owns
docs/, the content/data layer and its types, SEO/structured data, and route
scaffolding; Cursor owns component-level visual/motion implementation within
scaffolding Claude has already created. Any file must be claimed in
[TASKS.md](./TASKS.md) before either agent edits it; a data-contract change
(anything in [CONTENT-MODEL.md](./CONTENT-MODEL.md)) always requires a
DECISIONS.md entry and cannot be made unilaterally by whichever agent happens to
touch it first.

**Why**: The two tools may be used in different sessions against the same
repo; without an explicit claiming mechanism, silent conflicting edits (e.g. one
agent changing a type shape while the other is mid-implementation against the old
shape) are likely.

**Status**: Active.

## Log format for future entries

```
## ADR-NNN: <short title>

**Decision**: ...
**Why**: ...
**Status**: Active | Superseded by ADR-NNN | Reverted
```
