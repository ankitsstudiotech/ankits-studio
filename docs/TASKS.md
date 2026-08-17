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
| `src/styles/tokens.css` | Owned by Track A (design tokens) until `Done`; no other track edits it. A starting token set was laid down in the Phase 1 foundation pass — see below — refinement is still Track A's. |
| `Header` / `Footer` / `MockDataBanner` components | Claimed explicitly per edit — these are shared across every route. |
| `src/content/**` types ↔ `docs/CONTENT-MODEL.md` | Only updated together, only by the agent holding the content-model task, per Hard Rule 9. **Path correction**: the accessor lives at `src/content/index.ts`, not `src/lib/content/**` as originally sketched in `docs/IMPLEMENTATION-PLAN.md` Track B — see the Phase 1 foundation pass note below. `docs/IMPLEMENTATION-PLAN.md` itself still says `src/lib/content/**` in a few places and hasn't been corrected there (out of scope for the pass that made this note); this table is the accurate pointer. |

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
| A | Design tokens (palette, type, spacing, accent-family mapping, mobile breakpoints/nav pattern) | — (start immediately) | Cursor | **Done** — tokens + Syne/Figtree wired site-wide via root layout/`studio.css`; design-lab + homepage consume the system (`feat: create design and motion system`, `feat: integrate motion-rich homepage`) | `phase-1/design-tokens` |
| B | Content-model types + accessor layer + Vitest setup | — (start immediately) | Claude | **Done** — landed in the Phase 1 foundation pass, committed directly to `master` (see below, not on a separate branch) | — |
| C | Mock data authoring per BUSINESS-DATA-STATUS.md domains | B | Claude | **Done** — every domain has at least one mock record; landed in the same foundation pass | — |
| D | Tier 1 route scaffolding (8 routes) + noindex + timetable SSR default + mobile timetable layout | B (hard), C (soft — can start against fixtures) | Claude / Cursor | **Done** — all Tier 1 routes shipped in later passes (see `docs/HANDOFF-ROUTES.md`, `docs/HANDOFF.md`'s "Routes shipped (2026-08-01 pass)") | `phase-1/routes` |
| E | Base Motion system (opt-in islands only, per ADR-009) | A (hard), D (soft — primitives can be built early, integration needs D's markup) | Cursor | **Done** — motion islands in `src/components/motion/**`; homepage uses ScrollReveal/FadeIn only as client enhancement (`feat: create design and motion system`, `feat: integrate motion-rich homepage`) | `phase-1/motion-base` |
| F | Mock-data UI banner | B | Claude (logic) + Cursor (styling), sequenced on one branch | **Done** — `src/components/MockModeIndicator.tsx` now shows whenever unverified content exists and (`development` or `ALLOW_MOCK_PUBLISH === "true"`), closing the preview-build gap (MOCK-001, production-readiness audit-fix pass) | `phase-1/mock-banner` |

### Phase 1 foundation pass (complete, this pass)

A cross-track **shared foundation** landed in one pass, committed directly to
`master` (not split across the per-track branches above, since it was single-agent,
explicitly scoped as shared groundwork, and the individual tracks above still
have real work remaining on top of it): TypeScript strict-mode hardening,
package scripts (`type-check`/`test`/`test:watch`/`test:e2e`), the full
content-domain types + Zod schemas + mock/verified data + accessor
(`src/content/**` — see the hotspot table above for the path correction vs.
the originally-sketched `src/lib/content/**`), the mock-vs-verified content
mode module, **the production mock-content safety check** (ADR-002 layer 3 —
originally scoped to Phase 2 Track I, built now instead, verified to actually
fail `next build` without `ALLOW_MOCK_PUBLISH=true` and to actually succeed
with it while still shipping `noindex`), env validation, central metadata
config, root layout + skip link + error boundary + not-found page, a starting
design-token set, and the Vitest/Playwright/axe-core testing foundation
(16 unit tests, 5 e2e tests, all passing). Full detail:
[HANDOFF.md](./HANDOFF.md).

## Production-readiness audit-fix pass (complete, 2026-08-02)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Resolve `docs/audits/CLAUDE-TECHNICAL-SEO-AUDIT.md` + `docs/audits/CURSOR-VISUAL-BROWSER-AUDIT.md` findings, priority-ordered (critical correctness → mock-data risk → SEO → a11y → responsive → forms → performance → visual polish → optional) | Claude | Done | `fix: resolve production readiness audit findings` — full triage and per-finding resolution in `docs/DECISIONS.md` ADR-013 and both audit docs' new "Resolution status" sections; summary in `docs/HANDOFF.md`. |

## Prompt 1 — Visual system repair (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Shared visual-system repair: ProgrammeRow, tokens/studio/motion, Header/Footer/crumb, homepage Pulse surfaces, ProgrammeDiscovery wiring, logo temporary note | Cursor | In progress | Checkpoint `01a1a82` / tag `studio-pulse-deployed-v1-before-visual-repair`. Ledger: `docs/revamp/VISUAL-SYSTEM-DEFECT-LEDGER.md`. Do not touch `/design-lab/revamp-*`. |

## Prompt 2 — Visual system propagation (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Propagate Studio Pulse to programmes/locations/about/trial/contact/timetable/pricing (BranchRow, form panels, HeroReveal/RouteOpening, customer copy scrub). No design-lab; no trainers/transformations/blog/legal. | Cursor | Done | Branch `revamp/studio-pulse-production`. `npx tsc --noEmit` clean. Not committed / not deployed. |
| Prompt 2 visual acceptance defects: About band/pairGrid, ProgrammeDetailView editorial, ProgrammeDiscovery closing, StickyCtaBar soft-hide | Cursor | Done | `npx tsc --noEmit` clean. No deploy. |

## Prompt 3 — Secondary route rebuilds (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Secondary rebuilds: trainers/transformations/blog/legal/404/error/loading/LegacyProgrammeNotice + ADR-023 + tests. No homepage/core routes/design-lab. | Cursor | Done | `npx tsc --noEmit` clean. Unit tests for blog/trainers/member-stories/nav. E2E smoke added. Not committed / not deployed. |}

## Prompt 4 — Corporate Wellness AI media (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Integrate owner-approved Corporate Wellness illustrative hero + close eight-programme media acceptance. Catalogue, Service-family composition, screenshots, tests. No redesign, no Reviews, no deploy. | Cursor | Done | Branch `revamp/studio-pulse-production`. Two commits: feat integration + test acceptance gate. |

## Production Design Repair Batch 06 — Final structural composition (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Closing CTA family, variable facts, thin FAQs, About team/FAQ, related aside, founder hierarchy, Getting Here de-dupe. No heroes, no Reviews. Then production deploy. | Cursor | **Done** | Checkpoint `studio-pulse-before-batch-06-final-structural-cleanup` @ `bc9075a`. Shared `ClosingBand` + content-aware facts/FAQ. Evidence in `docs/revamp/screenshots/batch-06-final-structural-cleanup/`. Production deploy follows. |

## Production Design Repair Batch 05 — Hero + narrative composition (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Redesign About opening, Home founder, four branch heroes, and Yoga/Calm hero gap. No snapshotFacts, FAQ, Reviews, or Batch 04 matrices. Then production deploy. | Cursor | **Done** | Checkpoint `studio-pulse-before-batch-05-hero-composition-repair` @ `ec33a4e`. Implementation `f460fda` / `e1cd02c`. Evidence in this commit. Production deploy follows. |

## Production Design Repair Batch 04 — Systemic row-list composition (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Redesign Root Cause 1 sparse full-width row lists into contextual editorial variants. No About/branch hero, no snapshotFacts, no Reviews. Then production deploy. | Cursor | **Done** | Checkpoint `studio-pulse-before-dead-space-row-redesign` @ `dfa7d35`. Release `ec33a4e` / `dpl_6F7KJUpmKhqAh9J7czdYgqoMFmjj` READY → https://ankits-studio.vercel.app. |

## Production Bug Batch 03 — Global recurrence sweep + Maps semantics (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Sweep public app for Batch 01/02 recurrence P1s; fix Maps destination semantics using owner-confirmed URLs. No redesign, no Reviews fetch, no new media. Then production deploy. | Cursor | **Done** | Checkpoint `studio-pulse-before-production-bug-batch-03-global-sweep` @ `ff079ca`. Release `dfa7d35` / `dpl_5DjyjEVrdoostMX29wCtXH8KthzB` READY → https://ankits-studio.vercel.app. Evidence `docs/revamp/screenshots/production-bug-batch-03/`. |

## Production Bug Batch 02 — Programme accent cue + divider grammar (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Unify programme accent cues (one solid purple primitive, one hover model, Wedding single line). Structural dividers stay 1px solid neutral. No Maps URL batch. Then production deploy. | Cursor | **Done** | Checkpoint `studio-pulse-before-production-bug-batch-02` @ `7c31d20`. Evidence `docs/revamp/screenshots/production-bug-batch-02/`. Production deploy follows. |

## Production Bug Batch 01 — Homepage + shared desktop spatial system (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Fix human-reported P1s: hero crop, hero→programmes inset jump, wide relationship gaps, branch-row scanability, trial band contrast/measure, FAQ heading alignment. Shared primitives only. No accent-cue batch, no Maps URL batch, no Reviews fetch. Then production deploy. | Cursor | **Done** | `8cff9ce`. Checkpoint `studio-pulse-before-production-bug-batch-01` @ `d06ce99`. Production `dpl_DSVHde5ktDEdXTyTjt4PUW4aUxH4` READY → https://ankits-studio.vercel.app. Evidence `docs/revamp/screenshots/production-bug-batch-01/`. |

## Live Bugfix 02 — Layout system (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Wide-desktop density, divider grammar, dark-first Branches/Reviews surfaces. | Cursor | **Done** | Combined layout/divider/surface fix on `revamp/studio-pulse-production`. Checkpoint `studio-pulse-before-live-bugfix-02-layout-system`. Evidence `docs/revamp/screenshots/live-bugfix-02-layout-system/`. |

## Live Bugfix 01 — Homepage hero integration (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Homepage hero: remove duplicate brand lockup, blend media/content seam, align H1 to Studio Pulse `--text-hero`. No redesign, no Reviews, no new AI media, no other-route refactor. Then production deploy. | Cursor | **Done** | `f3f7d58`. Checkpoint `studio-pulse-before-live-bugfix-01-home-hero` @ `ab0646f`. Production `dpl_Gmpzqmvw19tfKZRABHhcrUQDoxM8` READY → https://ankits-studio.vercel.app |

## Prompt 6 — Final production audit, last fixes, deploy (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Production audit, launch-blocking fixes, clean production build without ALLOW_MOCK_PUBLISH, Vercel Production deploy, live verification. No redesign, no new AI media, no Places scrape. | Cursor | **Done** | Tag `studio-pulse-v1.2.0-owner-final` @ `1ec03db`. Production `dpl_43vfWXFAxxGAAjZK9ghVedmnLXQW` → https://ankits-studio.vercel.app |

## Prompt 5 — Google Reviews + Corporate Wellness sticky CTA

| Task | Owner | Status | Notes |
|---|---|---|---|
| Fix Corporate Wellness sticky CTA via programme conversion intent; add launch-safe Google social proof (Places API or external-links fallback). No scrape, no new AI media, no deploy. | Cursor | Done | Branch `revamp/studio-pulse-production`. `9ef2867` sticky conversion, `ae825de` Google proof. Checkpoint `studio-pulse-before-google-reviews-final` at `50e918f`. Launch mode `external-links`. Not deployed. |

## Phase 2+ 

Not yet broken into per-file rows — see
[IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) Phase 2 for the three
tracks (Tier 2 routes, programme×location pages, SEO + launch-gate tests) and
their dependencies. Break down into rows here when Phase 1 exit criteria are
met. Note: most of Track I's ADR-011 test-obligation list landed early, in the
Phase 1 foundation pass — see [HANDOFF.md](./HANDOFF.md) for detail. The
launch-readiness check itself was built as an assertion inside
`next.config.ts` rather than a standalone script (simpler — guaranteed to run
on every `next build` regardless of npm lifecycle hooks); items (a), (b), and
(d) are done, (c)'s golden-path behavior is covered by
`src/content/content-mode.test.ts` against that assertion function directly.
Only item (e) (mock-branch JSON-LD-omission test) remains — it can't exist
until Track H's branch/structured-data code exists.

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

## Final editorial art-direction pass (active)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Whole-application editorial art-direction per `docs/art-direction/ankits_studio_final_art_direction_pack` blueprint. Content locked to production. Map: `docs/art-direction/FINAL-IMPLEMENTATION-MAP.md`. | Cursor | Done | Checkpoint `studio-pulse-before-final-editorial-pass` @ `57264c1560722abfb7aaba2b65706c0c9f5ad044`. Visual/motion + listed art-direction docs. |
| Independent audit + self-correction of the final editorial art-direction pass. Audit: `docs/art-direction/FINAL-CLAUDE-AUDIT-BEFORE-FIX.md` (P0=0, P1=0, one P2 — hover-state contrast token). Fixing only the one confirmed P2 (`--color-accent-label` swap on 6 `:hover` declarations); no content, no new design. | Claude Code | In progress | Base commit `19939e2`. Component visual work, explicitly user-directed — cross-zone per AGENTS.md ownership table. |
