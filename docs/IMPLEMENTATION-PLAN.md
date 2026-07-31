# Implementation Plan

Phased delivery plan. Each phase's exit criteria gate the next phase starting.
Cross-references: [DECISIONS.md](./DECISIONS.md) for why,
[TASKS.md](./TASKS.md) for the live task board and claiming protocol,
[CURSOR-ARCHITECTURE-REVIEW.md](./CURSOR-ARCHITECTURE-REVIEW.md) for the
independent review this plan now reconciles (see ADR-007–012).

**Branching convention** (applies from Phase 1 onward): every parallel track
gets its own branch, cut from and merged back into `master` (this repo's
current integration branch). Branch names follow `phase-<n>/<track-slug>`.
Phase 0 and Phase 0.5 were committed directly to `master` (docs-only, single
agent, no concurrent tracks — branching would have added process with nothing
to protect against).

## Phase 0 — Governance foundation (complete)

Docs listed in [PROJECT-BRIEF.md](./PROJECT-BRIEF.md), CLAUDE.md, AGENTS.md.
No application source files touched. Committed directly to `master`.

**Exit criteria** (met): all 13 docs + both root instruction files exist, are
mutually consistent, and [HANDOFF.md](./HANDOFF.md) reflects current state.

## Phase 0.5 — Architecture review reconciliation (complete, this pass)

An independent staff-level review
([CURSOR-ARCHITECTURE-REVIEW.md](./CURSOR-ARCHITECTURE-REVIEW.md)) was
reconciled against the Phase 0 docs. Every Critical/Important finding got an
explicit accept/partial/reject verdict in
[DECISIONS.md ADR-007](./DECISIONS.md#adr-007) through
[ADR-012](./DECISIONS.md#adr-012), with accepted changes applied directly to
the affected docs. Committed directly to `master` (docs-only, single agent).

**Acceptance criteria**:
- Every Critical (C1–C4) and Important (I1–I12) finding has a recorded verdict
  in `DECISIONS.md`.
- Every accepted or partially-accepted finding is reflected in the doc(s)
  named in its `DECISIONS.md` row.
- No new contradiction introduced between docs (spot-checked across
  CONTENT-MODEL.md ↔ BUSINESS-DATA-STATUS.md ↔ SEO-STRATEGY.md ↔
  MOTION-SYSTEM.md ↔ PERFORMANCE-BUDGET.md).
- Mock-data strategy (`dataStatus`/`mockDisclaimer`) and the four-layer launch
  gate (ADR-002) are preserved and, per ADR-011, hardened — not weakened.
- No application source file touched.

**Verification commands** (docs-only phase — verification is repo-state
inspection, not code execution):

```bash
# Confirm only docs/ and root instruction files changed — no src/ touched.
git diff --stat master~1 master   # (or the relevant commit range)

# Sanity-check every new ADR anchor resolves (no typo'd #adr-0NN reference).
grep -rn '#adr-0' docs/*.md
```

**Commit boundary**: one commit on `master`:
`docs: reconcile architecture review`.

---

## Phase 1 — Design system + content model + Tier 1 scaffolding

**Sequential gate**: does not start until Phase 0.5 exit criteria are met.

Six tracks, each its own branch, with the dependency graph below (per
[DECISIONS.md ADR-007](./DECISIONS.md#adr-007) finding C3 — this graph exists
specifically because the original Phase 1 task list implied everything could
start at once, which it cannot).

```
Track A (tokens)   Track B (content model)
     |                    |
     |         +----------+----------+---------+
     |         |          |          |         |
     |    Track C (mock) Track D (routes)  Track F (banner)
     |         |          |
     +----> Track E (motion) <-------+
```

### Track A — Design tokens

- **Branch**: `phase-1/design-tokens`
- **Owner**: Cursor (visual-system authoring; see ownership table in
  [AGENTS.md](../AGENTS.md))
- **File ownership**: `src/styles/tokens.css` (or the token section of
  `src/app/globals.css`), Tailwind config token extensions. No other track
  touches these files while this one is `In progress` (see TASKS.md hotspots).
- **Depends on**: nothing. Safe to start immediately, in parallel with
  Track B.
- **Blocks**: Track E (final motion polish needs real easing/duration/color
  tokens); final visual polish on Track D's scaffolding.
- **Acceptance criteria**: palette (oklch), type pairing, and spacing scale
  finalized per [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md); each
  `ProgrammeAccentFamily` (`strength`/`calm`/`high-energy`, ADR-012) resolves
  to a token that independently passes 4.5:1 body-text contrast and 3:1
  large-text/UI contrast on the single light theme (ADR-007 finding I4);
  mobile breakpoint tokens and the mobile nav pattern decision are recorded
  (INFORMATION-ARCHITECTURE.md, DESIGN-DIRECTION.md Mobile section).
- **Verification commands**:
  ```bash
  npm run build        # Tailwind/token compilation succeeds
  npm run lint
  ```
  Contrast is checked manually (browser devtools or a contrast checker) —
  no automated contrast CI exists yet; that gap is tracked under
  [DECISIONS.md ADR-011](./DECISIONS.md#adr-011)'s test-obligations list for
  a later phase.
- **Commit boundary**: one commit (or a small stack) on `phase-1/design-tokens`,
  merged to `master` before Track E's final polish begins.

### Track B — Content-model types + accessor layer

- **Branch**: `phase-1/content-model`
- **Owner**: Claude (content/data layer zone)
- **File ownership**: `src/lib/content/**`. If implementation reveals a
  needed correction to `docs/CONTENT-MODEL.md`, that correction lands in this
  same branch with its own `docs/DECISIONS.md` entry (Hard Rule 9) — never
  silently.
- **Depends on**: nothing. Safe to start immediately, in parallel with
  Track A.
- **Blocks**: Track C, Track D, Track F — none of them can import a content
  type or call the accessor layer until this merges.
- **Acceptance criteria**: `Provenanced<T>` implemented exactly per
  CONTENT-MODEL.md/ADR-012 (three-state `dataStatus`, `MediaAsset`, semantic
  `ProgrammeAccentFamily`, `Branch.publiclyListed`); a fixture record missing
  `mockDisclaimer` while `dataStatus` is `"mock"` or `"reference-only"` fails
  to typecheck; `mapEmbedUrl` and phone/WhatsApp accessors expose no
  helper that would let a caller render a `tel:`/`wa.me`/embed value for a
  non-verified record (ADR-011).
- **Verification commands**:
  ```bash
  npx tsc --noEmit --strict
  # Introduce a minimal test runner (Vitest — chosen for low config
  # overhead against a TS-strict Next.js project) and add the two Phase-1
  # test obligations from DECISIONS.md ADR-011:
  npx vitest run src/lib/content
  ```
- **Commit boundary**: one commit on `phase-1/content-model`, merged to
  `master` before Tracks C, D, and F begin.

### Track C — Mock data authoring

- **Branch**: `phase-1/mock-data`
- **Owner**: Claude
- **File ownership**: `src/content/mock/**`.
- **Depends on**: Track B merged.
- **Blocks**: nothing hard-blocks on this; Track D can scaffold against
  fixture stubs and overlap with late Track C for real copy fill (per the
  original dependency note, still valid).
- **Acceptance criteria**: every domain in
  [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) has at least one mock
  record; every mock/reference-only record has a `mockDisclaimer`; no mock
  `Branch` record has a populated, UI-reachable `mapEmbedUrl`; Thane's
  `Branch` record has `publiclyListed: false`.
- **Verification commands**:
  ```bash
  npx tsc --noEmit --strict
  grep -rn "mapEmbedUrl" src/content/mock   # confirm no populated value pre-verification
  ```
- **Commit boundary**: one commit on `phase-1/mock-data`, merged to `master`.

### Track D — Tier 1 route scaffolding

- **Branch**: `phase-1/routes`
- **Owner**: Claude
- **File ownership**: `src/app/**` for the eight Tier 1 routes only (`/`,
  `/programmes`, `/programmes/[slug]`, `/locations`, `/locations/[slug]`,
  `/timetable`, `/trial`, `/contact`) — **not** `/locations/[branch]/[programme]`,
  which is Tier 2 and ships in Phase 2 per
  [DECISIONS.md ADR-008](./DECISIONS.md#adr-008).
  `generateStaticParams`/`generateMetadata` per route,
  `loading.tsx`/`not-found.tsx` per dynamic segment, per
  [DECISIONS.md ADR-010](./DECISIONS.md#adr-010).
- **Depends on**: Track B merged (types). Soft-depends on Track C (needs some
  mock data to render against; can start against fixture stubs first).
- **Blocks**: Track E's real (non-prototype) integration; Track F's real
  integration.
- **Acceptance criteria**: all eight Tier 1 routes render server-side;
  Thane's branch route exists but is excluded from nav/footer/sitemap
  (`publiclyListed: false`); every response outside a production deploy
  target carries `noindex` (ADR-011, now a Phase 1 exit criterion, not
  deferred to Phase 4); `/timetable` ships a fully server-rendered
  unfiltered default view with filters as a `Suspense`-wrapped client
  enhancement (ADR-010); axe-core reports zero critical/serious violations.
- **Verification commands**:
  ```bash
  npm run build
  npm run lint
  npx tsc --noEmit --strict
  # axe-core scan per route (manual/local until CI wiring lands in Phase 2,
  # per ADR-011's test-obligations list):
  npx @axe-core/cli http://localhost:3000/ http://localhost:3000/programmes ...
  ```
- **Commit boundary**: one commit per route family is acceptable (e.g. core
  marketing routes vs. `/timetable`/`/trial`/`/contact` as a second commit),
  all landing on `phase-1/routes` before merge to `master`.

### Track E — Base Motion system

- **Branch**: `phase-1/motion-base`
- **Owner**: Cursor
- **File ownership**: shared motion primitives under
  `src/components/client/motion/**` (per ADR-010's client-component path
  convention), applied inside components Track D has scaffolded. Per
  [DECISIONS.md ADR-009](./DECISIONS.md#adr-009): never wraps a whole Tier 1
  landing page; never gates the LCP element behind client JS; no page
  transitions or shared layout animation on Tier 1 routes without a logged
  budget exception.
- **Depends on**: Track A merged (tokens). Primitive components (hover/focus/
  reveal wrappers) can be built and previewed independently before Track D
  has real markup; final integration depends on Track D having at least the
  core Tier 1 routes in place.
- **Acceptance criteria**: no Tier 1 route exceeds its
  [PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md) JS budget with motion
  included (motion bundle accounting, ADR-009); LCP element visible without
  client JS; `prefers-reduced-motion` fallback manually verified.
- **Verification commands**:
  ```bash
  npm run build
  # Informal bundle-size check until a proper CI budget gate exists
  # (tracked under DECISIONS.md ADR-011):
  du -sh .next/static/chunks/*
  ```
- **Commit boundary**: one commit on `phase-1/motion-base`, merged to
  `master` after Track D's core Tier 1 routes exist.

### Track F — Mock-data UI banner

- **Branch**: `phase-1/mock-banner`
- **Owner**: cross-cutting — claimed explicitly in
  [TASKS.md](./TASKS.md) by whichever agent starts first. Default split:
  Claude builds the data-driven trigger logic (which routes/records surface
  the banner, reading the Track B accessor); Cursor styles/renders it. Both
  sub-parts land on the same branch, sequenced, not simultaneous.
- **File ownership**: `src/components/MockDataBanner.tsx` (or equivalent) +
  its wiring into `src/app/layout.tsx` — `layout.tsx` is a named hotspot (see
  TASKS.md); this track's wiring commit is the one exception to "don't touch
  layout.tsx," claimed explicitly for that single commit.
- **Depends on**: Track B merged.
- **Acceptance criteria**: banner renders, non-dismissable, on every route
  where any visible record has `dataStatus !== "verified"`; reserves layout
  space (no CLS on mount); passes axe-core.
- **Verification commands**: same as Track D (`npm run build`, axe-core scan).
- **Commit boundary**: one commit on `phase-1/mock-banner`, merged to
  `master` before Phase 1 is declared demo-ready.

### Phase 1 exit criteria (all tracks merged)

1. All six branches above merged to `master`.
2. Every Tier 1 route + the mock banner pass their stated acceptance criteria.
3. `npx tsc --noEmit --strict` is clean across the whole `src/` tree.
4. Non-production responses carry `noindex` (ADR-011).
5. Manual sweep finds no hardcoded business fact outside
   `src/content/mock/**` (`grep -rn` for phone/price-shaped literals in
   `src/app` and `src/components`, documented as manual until the import-lint
   rule from ADR-011's test obligations is added in Phase 2).
6. Mobile nav pattern and `/timetable` mobile layout decisions (Track A,
   Track D) are recorded, not left implicit.

---

## Phase 2 — Tier 2 routes + programme×location pages + SEO structured data + launch-gate tests

**Sequential gate**: does not start until Phase 1 exit criteria are met.

Three tracks, parallel after a shared kickoff dependency:

### Track G — Tier 2 route scaffolding (trainers, pricing, transformations)

- **Branch**: `phase-2/tier2-routes`
- **Owner**: Claude
- **File ownership**: `src/app/trainers/**`, `src/app/pricing/**`,
  `src/app/transformations/**`.
- **Depends on**: Phase 1 complete (accessor layer, Tier 1 routes, tokens).
- **Acceptance criteria**: every price, trainer name, and transformation
  result renders its `mockDisclaimer` inline, not just via the page-level
  banner (per [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md)
  Tier 2 rule); primary nav adds each route's link only once that route is
  live with its disclaimer treatment in place (ADR-007 finding I12); a11y/perf
  gates pass per-route as each ships.
- **Verification commands**: same as Phase 1 Track D (`npm run build`,
  `npm run lint`, `tsc --noEmit`, axe-core per route).
- **Commit boundary**: one commit per route.

### Track H — Programme×location landing pages

- **Branch**: `phase-2/location-programme-pages`
- **Owner**: Claude
- **File ownership**: `src/app/locations/[branch]/[programme]/**`.
- **Depends on**: Phase 1 complete (needs stable branch/programme pages and
  content to link against).
- **Acceptance criteria**: generated only for valid branch×programme pairs
  (ADR-008); each page has unique server-rendered copy passing the
  uniqueness bar (no name-swapped boilerplate); `Course`/`Service` structured
  data present, gated by verification status (ADR-011); a11y/perf gates pass.
- **Verification commands**: same as Track G, plus Google's Rich Results
  Test (manual) against a sample page.
- **Commit boundary**: one commit per branch (3 branches × their valid
  programme pairs).

### Track I — SEO structured data + launch-gate tests

- **Branch**: `phase-2/seo-and-gate-tests`
- **Owner**: Claude
- **File ownership**: `LocalBusiness`/`Course`/`BreadcrumbList` JSON-LD
  emission logic (co-located with the routes it serves, coordinated with
  Tracks G/H rather than duplicated), plus the launch-readiness CI script
  (ADR-002 layer 3) and its tests (ADR-011).
- **Depends on**: Phase 1 complete; coordinates with Tracks G/H on structured
  data placement (claim in TASKS.md if touching a file either track owns).
- **Acceptance criteria**: `LocalBusiness` JSON-LD is omitted entirely (never
  `@id`-placeholder) for any non-verified branch (ADR-011); the five test
  obligations from ADR-011 items (c)–(e) exist and pass: launch-readiness
  script golden-path test, non-production `noindex` smoke test, mock-branch
  JSON-LD-omission test; the import-lint rule banning
  `src/content/mock/**` imports outside `src/lib/content/**` is added.
- **Verification commands**:
  ```bash
  npx vitest run
  npm run lint
  ```
- **Commit boundary**: one commit for structured data, one for the
  launch-readiness script + its tests.

### Phase 2 exit criteria

Tier 2 routes and programme×location pages pass the same accessibility/
performance gates as Phase 1; structured data validated against Google's
Rich Results Test with mock data correctly excluded; all ADR-011 test
obligations pass in CI, not just locally.

---

## Phase 3 — Hardening + Tier 3

**Sequential gate**: does not start until Phase 2 exit criteria are met.
Single track (no parallelism needed — this is a cross-cutting pass, not new
feature surface).

- **Branch**: `phase-3/hardening`
- **Owner**: shared (Claude for structural/content fixes, Cursor for visual/
  motion fixes found during the pass) — claimed per-fix in TASKS.md rather
  than pre-assigned, since scope is discovered during the pass.
- Full accessibility pass across every shipped route (cross-route
  consistency: shared nav/footer, consistent focus order, not just per-route
  gates already passed).
- Full performance pass (real device testing, not just lab Lighthouse).
- `/blog`, `/blog/[slug]` — ship as a "coming soon" stub unless real content
  exists by this point, per Tier 3 guidance in
  [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md). If built for
  real, `BlogPost.body`'s format (MDX vs. plain vs. blocks) is decided now,
  per [DECISIONS.md ADR-012](./DECISIONS.md#adr-012).

**Acceptance criteria**: every route in
[INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md) exists in at
least a stub or full state; all gates pass site-wide, not just per-route.

**Verification commands**: full `npm run build` + full axe-core sweep across
every route + Lighthouse CI run on representative routes per page-type
bucket in [PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md).

**Commit boundary**: incremental commits per fix category (a11y, perf,
blog), all on `phase-3/hardening`.

## Phase 4 — Business data verification + launch

**Sequential gate**: does not start until Phase 3 exit criteria are met, and
requires the business owner's input — this phase cannot run on agent
initiative alone.

- **Branch**: `phase-4/launch` (or direct commits to `master` once each
  BUSINESS-DATA-STATUS.md row is confirmed — process TBD with the owner,
  since this phase depends on external input arriving incrementally).
- Owner reviews [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) row by
  row; each domain flips to `VERIFIED` as confirmed, content updated in the
  same change per that doc's workflow.
- NAP consistency check per [SEO-STRATEGY.md](./SEO-STRATEGY.md) once
  addresses are verified.
- Indexing-level gate (ADR-002 layer 4) flips: production becomes indexable
  only once required domains are `VERIFIED`.
- Thane: `Branch.publiclyListed` flips to `true` and it enters nav/sitemap
  only if the owner confirms it operates; otherwise it stays excluded or is
  removed entirely.

**Acceptance criteria**: `BUSINESS-DATA-STATUS.md` shows `VERIFIED` for every
domain required by whichever routes are going live; launch gate (all four
ADR-002 layers) passes; site goes live.

**Verification commands**: the full launch-readiness script from Phase 2
Track I, run against the production build target — must exit non-zero if any
required record is still `mock`/`reference-only`.

**Commit boundary**: one commit per verified domain (matching
BUSINESS-DATA-STATUS.md's own workflow of updating the table and the data in
the same change), plus one final commit flipping the indexing gate.

## Explicitly out of scope for now

Writing any application source file — this plan is the roadmap those future
sessions follow. Phase 0 and Phase 0.5 are documentation-only; no `src/`
files have been touched.
