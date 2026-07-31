# Independent Architecture Review

_Reviewer stance: staff-level, independent of the Claude planning pass._  
_Scope: `CLAUDE.md`, `AGENTS.md`, and every file under `docs/` as of 2026-07-31._  
_Constraint honoured: no application source was modified; existing planning docs
were not rewritten — findings below recommend which doc should change later._

## Verdict

The governance set is unusually strong for a pre-code marketing site: mock-data
provenance (ADR-002), ownership boundaries (ADR-006), and per-route a11y/perf
gates are the right kind of structure. The architecture is **not ready to
execute Phase 1 as written** without corrections in three areas that will be
expensive to retrofit: **local SEO IA** (no programme×location landing surfaces),
**Motion-as-global-default vs. the 150kb landing budget**, and **Phase 1 task
dependencies** that the board currently implies can run in parallel but cannot.

Findings below are classified as Critical, Important, Optional, or Rejected
concern. Critical and Important items include problem, why it matters, exact
correction, and which planning document should change.

---

## Critical

### C1 — Local SEO intent is declared, but IA has no programme×location surfaces

**Problem.** [SEO-STRATEGY.md](./SEO-STRATEGY.md) states the primary growth
channel is “`[programme] classes in [Airoli/Ghansoli/Thane]`”-shaped intent, and
Tier 1 on-page guidance calls for “one clear H1 per page tied to
programme+branch combinations.” [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md)
only provides `/programmes/[slug]` and `/locations/[slug]` with bidirectional
links. There is no crawlable URL whose primary topic is a single programme at a
single branch.

**Why it matters.** Separate programme and location pages rarely win the
programme-in-area query; Google and users both look for a page whose H1, copy,
and internal links are about that pair. Bidirectional links are supporting
signals, not a substitute for the landing surface. This is the highest-leverage
gap relative to the stated business goal.

**Exact recommended correction.** Add a Tier 1 (or early Tier 2) route family
such as `/locations/[branch]/[programme]` **or**
`/programmes/[programme]/[branch]`, with unique server-rendered copy, NAP,
timetable excerpt, and CTA for that pair. Require a uniqueness bar (not
boilerplate with city name swapped) to avoid doorway-page risk — see also I14.
Update keyword→URL mapping so every target intent has exactly one primary URL.

**Planning document(s) that should change.** `INFORMATION-ARCHITECTURE.md`,
`SEO-STRATEGY.md`, `IMPLEMENTATION-PLAN.md`, `TASKS.md` (and a short ADR in
`DECISIONS.md` if the route shape is treated as a new decision).

---

### C2 — “Motion imported normally / needed everywhere” conflicts with landing JS budgets

**Problem.** [MOTION-SYSTEM.md](./MOTION-SYSTEM.md) makes Motion the default for
reveals, hovers, layout animation, and page transitions.
[PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md) says Motion is “imported
normally (small, needed everywhere)” while landing/marketing routes are capped
at **&lt; 150kb gzipped JS**. Motion (formerly Framer Motion) plus React
interaction islands is not “small” once scroll listeners, layout animations, and
page transitions are shared site-wide. Landing routes (`/`, `/programmes*`,
`/locations*`) are also the primary SEO/LCP surfaces.

**Why it matters.** Blowing the landing budget on animation defaults guarantees
failed Phase 1 exit criteria, or silent budget renegotiation under delivery
pressure. Animating or client-wrapping hero/LCP content also risks LCP/INP
regressions and conflicts with MOTION-SYSTEM principle 5 (never hide
server-rendered SEO content).

**Exact recommended correction.**

1. Rewrite the loading strategy: Motion is an **opt-in client island**, not a
   root-layout default. Server-render static content first; hydrate motion only
   where justified.
2. Ban page transitions and layout animations on Tier 1 SEO landings unless a
   measured budget exception is logged in `DECISIONS.md`.
3. Explicitly forbid making the LCP element (hero image/text) depend on client
   JS to become visible.
4. Add a “Motion bundle accounting” gate: shared motion code counts against
   every route that imports it; landing routes must stay ≤ 150kb with motion
   included, or motion must be route-split.

**Planning document(s) that should change.** `MOTION-SYSTEM.md`,
`PERFORMANCE-BUDGET.md`, optionally `DECISIONS.md` (amend ADR-005 or add
ADR-007).

---

### C3 — Phase 1 tasks are listed as parallelisable; several are serial

**Problem.** [TASKS.md](./TASKS.md) Phase 1 lists six unclaimed tasks with no
dependency edges. In practice:

| Task | Hard dependency |
|---|---|
| Mock data authoring | Content-model types + accessor layer |
| Tier 1 route scaffolding | Accessor layer + slug unions |
| Mock-data UI banner | Accessor layer + provenance fields |
| Base Motion system | Design tokens (easing/duration/colour tokens) for anything beyond throwaway prototypes |
| Route visual polish (Cursor zone) | Scaffolding exists; tokens exist |

Claude route scaffolding and Cursor motion polish on the **same component files**
will conflict if both start when scaffolding is only half-done (ADR-006 assumes
scaffolding lands first; TASKS.md does not encode that).

**Why it matters.** Parallel agents are an explicit project design (ADR-006).
Without a dependency graph, “claim and start” produces merge conflicts, type
churn, and rework — the exact failure ADR-006 was meant to prevent.

**Exact recommended correction.** Add an ordered Phase 1 dependency section to
`TASKS.md` / `IMPLEMENTATION-PLAN.md`, e.g.:

1. Design tokens (can start immediately; blocks visual polish).
2. Content-model types + accessor (blocks mock data, banner, routes).
3. Mock data authoring (after 2).
4. Tier 1 route scaffolding (after 2; can overlap late mock data for copy fill).
5. Mock banner (after 2; before any route marked demo-ready).
6. Base Motion system (after 1; only inside components Claude has scaffolded).

Mark (1) and (2) as the only safely parallel kickoff pair.

**Planning document(s) that should change.** `TASKS.md`,
`IMPLEMENTATION-PLAN.md`.

---

### C4 — No automated test requirements for the launch gate or content contracts

**Problem.** Accessibility and performance gates are specified; CLAUDE.md
correctly notes there is no test suite yet. Nowhere do the docs require tests
for:

- the ADR-002 CI launch-readiness check (false green = mock data in production),
- “UI must not import `src/content/mock/*` directly” (CONTENT-MODEL rule),
- provenance invariants (`mock`/`reference-only` ⇒ required `mockDisclaimer`),
- `noindex` on non-production builds,
- refusal to emit `LocalBusiness` JSON-LD from non-verified records.

**Why it matters.** ADR-002’s value is structural enforcement. Layers 3–4 are
scripts and config with no stated verification. A broken gate with no test is
theatre.

**Exact recommended correction.** Add a Testing requirements section (new short
doc or a section in `IMPLEMENTATION-PLAN.md` / `ACCESSIBILITY-STANDARDS.md`
companion) mandating, before Phase 2 exit:

1. Unit/contract tests for `Provenanced<T>` / accessor behaviour.
2. A lint or test that fails on imports from `src/content/mock/**` outside
   `src/lib/content/**`.
3. Golden-path tests for the launch-readiness script (mock present → fail
   production; all verified → pass).
4. A smoke test that preview/`NODE_ENV` non-prod responses include robots
   noindex.
5. Structured-data tests: mock branch pages emit no publishable NAP in JSON-LD.

Defer full e2e UI coverage if needed, but do **not** defer gate tests.

**Planning document(s) that should change.** `IMPLEMENTATION-PLAN.md`,
`DECISIONS.md` (ADR-002 implementation notes), optionally a new
`docs/TESTING-STANDARDS.md` indexed from `AGENTS.md` / `PROJECT-BRIEF.md`.

---

## Important

### I1 — Conversion strategy is route-shaped, not funnel-shaped

**Problem.** IA provides `/trial` and `/contact` and a persistent “Book a trial”
CTA, but no doc defines primary conversion channel (form vs WhatsApp vs phone),
success/failure states beyond a11y mentions, lead routing, spam protection,
analytics events, or how pricing (Tier 2, high-intent) relates to trial CTA
timing. For an Indian multi-branch studio, WhatsApp is often the real closer;
phone/WhatsApp exist on `Branch` but are not part of a conversion design.

**Why it matters.** A beautiful Tier 1 site that cannot capture or attribute
leads fails the business purpose. Ambiguity between `/trial` and `/contact`
also produces duplicate forms and split analytics.

**Exact recommended correction.** Add a short Conversion section covering:
primary CTA hierarchy (trial &gt; WhatsApp &gt; call &gt; contact), when sticky
mobile CTA appears, `/trial` vs `/contact` responsibilities, minimum form
fields, submission destination (even if “mailto / WhatsApp deep link / form
provider TBD”), and required analytics events. Decide whether `/pricing` must
ship before serious conversion optimisation.

**Planning document(s) that should change.** `INFORMATION-ARCHITECTURE.md` or
`PROJECT-BRIEF.md`, plus `IMPLEMENTATION-PLAN.md` Phase 1/2 exit criteria.

---

### I2 — Thin / near-duplicate location pages (especially Thane)

**Problem.** Three `/locations/[slug]` pages will share layout, programme lists,
and placeholder hours. Thane is REFERENCE-ONLY / unconfirmed for operation, yet
appears in primary footer nav and the branch list. SEO strategy does not define
a minimum unique-content bar per location page.

**Why it matters.** Thin location pages underperform and can look manipulative
if multiplied later into programme×location URLs. Shipping Thane in global nav
while mock also increases accidental-publication and trust risk.

**Exact recommended correction.**

1. Define a uniqueness checklist per location page (local intro, branch-specific
   programmes/timetable excerpt, facilities, directions copy — not only NAP
   swap).
2. Keep Thane out of public nav/footer/sitemap until owner confirms operation;
   allow internal/mock-only route if needed for design work.
3. If programme×location pages are added (C1), require the same uniqueness bar
   or do not generate the URL.

**Planning document(s) that should change.** `INFORMATION-ARCHITECTURE.md`,
`SEO-STRATEGY.md`, `BUSINESS-DATA-STATUS.md` (Thane publishing rule).

---

### I3 — Incomplete local SEO mechanics beyond structured-data names

**Problem.** SEO-STRATEGY covers RSC, JSON-LD types, indexing gate, NAP, and
sitemap at a high level, but omits: title/description templates per route type;
canonical URLs; Open Graph / Twitter cards; `areaServed` / geo coordinates
policy once verified; FAQ or `OpeningHoursSpecification` detail; Google Business
Profile ↔ site consistency workflow beyond “byte-identical NAP”; image SEO;
and whether Maps embeds are allowed while address is still mock/reference-only.

**Why it matters.** Without templates and embed rules, Phase 2 implementers
improvise — a common source of duplicate titles and premature local signals
(especially rendering an owner Maps pin that reveals a real address beside
“mock” UI copy).

**Exact recommended correction.** Extend SEO-STRATEGY with: metadata templates;
canonical policy; OG image rules; “no Maps embed until address `verified` OR
embed allowed only with visible reference-only disclaimer”; GBP checklist in
Phase 4; and explicit non-goals (no fabricated reviews/ratings schema).

**Planning document(s) that should change.** `SEO-STRATEGY.md`,
`IMPLEMENTATION-PLAN.md` Phase 2/4.

---

### I4 — Accessibility gaps beyond WCAG AA checklist headlines

**Problem.** [ACCESSIBILITY-STANDARDS.md](./ACCESSIBILITY-STANDARDS.md) is solid
on keyboard, contrast, reduced motion, forms, and semantics, but does not
require: skip links; `aria-live` for timetable filter results and form
submission status; minimum touch target sizes (e.g. 44×44 CSS px); modal/drawer
focus traps (mobile nav, trial dialogs); accessible names for icon-only
controls; or a decided colour-scheme policy (gates mention “if light and dark”
while DESIGN-DIRECTION never commits to dark mode).

**Why it matters.** Timetable filters and trial forms will fail real SR/mobile
use without live regions and touch targets. Ambiguous dark mode creates
contrast work that may be unnecessary.

**Exact recommended correction.** Add the missing requirements; decide
light-only vs dual theme in DESIGN-DIRECTION; if light-only, remove dual-theme
gate language. Require NVDA checks to include filter-result announcements on
`/timetable`.

**Planning document(s) that should change.** `ACCESSIBILITY-STANDARDS.md`,
`DESIGN-DIRECTION.md`.

---

### I5 — App Router rendering and boundary decisions are underspecified

**Problem.** ADR-001 correctly picks App Router + RSC for SEO content, but docs
never specify: SSG vs ISR vs dynamic per route; `generateStaticParams` for
programme/branch/trainer slugs; `searchParams` + Suspense strategy for
`/timetable` filters (needed for static/crawlable defaults); `loading.tsx` /
`error.tsx` / `not-found.tsx`; metadata API ownership (`generateMetadata` in
server route files only); and a hard rule that page files remain Server
Components with `"use client"` leaves only for interactive islands.

**Why it matters.** The most common Next.js failure mode for SEO sites is
accidentally marking a whole page client-side for animation or filters, then
discovering content is weak in view-source. Timetable URL-as-state without a
Suspense plan also fights static generation.

**Exact recommended correction.** Add an App Router implementation appendix:
default static generation for all marketing pages; `generateStaticParams` lists
from content accessors; timetable ships a fully SSR default (all/no filter)
plus client enhancements for filters; metadata only in server files; client
components only under an agreed path (e.g. `src/components/client/**`).

**Planning document(s) that should change.** `DECISIONS.md` (extend ADR-001 or
add ADR), `IMPLEMENTATION-PLAN.md`, `INFORMATION-ARCHITECTURE.md` (timetable
SSR default).

---

### I6 — Presentation tokens and media URLs live inside the content model

**Problem.** `Programme.heroAccent`, `Trainer.photoUrl`, transformation image
URLs, and `BlogPost.bodyMdx` couple presentation/format into the business
content contract ([CONTENT-MODEL.md](./CONTENT-MODEL.md)). The accessor layer
is otherwise a good separation.

**Why it matters.** Accent tokens will churn with the design system; MDX as the
storage format prejudges blog tooling; image URLs without asset metadata
(alt, width, height, blur, licence) push a11y/perf fields into components ad
hoc — weakening the “single accessor layer” story.

**Exact recommended correction.** Keep `heroAccent` as a semantic programme key
(e.g. `"strength" | "yoga" | …`) mapped to CSS tokens in the design layer, not
raw design-token names in content. Introduce a small `MediaAsset` type (`src`,
`alt`, `width`, `height`, `lqip?`, `licenceNote`) for all images. Treat blog body
format as an implementation detail behind the accessor (`body` / blocks), not a
hard MDX field, until Tier 3 is real.

**Planning document(s) that should change.** `CONTENT-MODEL.md`,
`DECISIONS.md` (same change per Hard Rule 9), `DESIGN-DIRECTION.md` (token
mapping).

---

### I7 — Residual mock-data leak paths despite strong ADR-002

**Problem.** ADR-002 is the right design. Remaining holes:

1. No rule forbidding hardcoded NAP/prices/names in components bypassing the
   content layer.
2. `mapEmbedUrl` can surface a real address from Google while UI still says mock.
3. Structured-data fallback “`@id`-only placeholder” is underspecified and easy
   to implement wrong (emitting partial NAP).
4. “Obviously fake” numbers like `+91 90000 00000` are still dialable; better to
   use clearly reserved/example patterns and never `tel:`/`wa.me` links that
   look live on mock branches.
5. `Member counts / social proof numbers` appear in BUSINESS-DATA-STATUS but have
   no content type — likely to be hardcoded in JSX.
6. CI launch gate is Phase 2 while Tier 1 can be “demo-ready” in Phase 1 on
   preview hosts — acceptable only if noindex is implemented in Phase 1, which
   is not listed as a Phase 1 exit criterion.

**Why it matters.** Most accidental “we published fake prices” incidents come
from bypasses and embeds, not from the typed mock records themselves.

**Exact recommended correction.** Add: hardcoded business-fact ban; Maps embed
policy (I3); JSON-LD omit-entirely until verified (prefer omit over `@id`
placeholders); Phase 1 exit criterion for unconditional noindex on non-prod;
content type or explicit ban for social-proof stats; disable `tel:`/`wa.me`
hrefs unless `dataStatus === "verified"`.

**Planning document(s) that should change.** `DECISIONS.md` ADR-002,
`CONTENT-MODEL.md`, `SEO-STRATEGY.md`, `IMPLEMENTATION-PLAN.md`,
`BUSINESS-DATA-STATUS.md`.

---

### I8 — High merge-conflict files are not called out in the ownership protocol

**Problem.** ADR-006 / TASKS.md prevent two agents claiming the same task, but
do not identify hotspots: `docs/TASKS.md`, `docs/HANDOFF.md`, `docs/DECISIONS.md`,
root `layout.tsx`, global CSS/token files, shared `Header`/`Footer`/`MockBanner`,
and mirrored types (`CONTENT-MODEL.md` ↔ `src/lib/content/types.ts`).

**Why it matters.** Parallel work will serialize on these files anyway; without
naming them, agents will discover conflicts late.

**Exact recommended correction.** Add a “Shared file hotspots” subsection:
single-writer rules (e.g. only one agent updates TASKS.md claim rows per
session end); tokens file owned by the design-tokens task until Done; layout
and MockBanner claimed explicitly; type mirror updates only with the Claude
content-model task.

**Planning document(s) that should change.** `TASKS.md`, `AGENTS.md` ownership
section.

---

### I9 — Image guidance is partial; video is absent

**Problem.** PERFORMANCE-BUDGET lists width/height, AVIF/WebP, lazy loading, and
hero `fetchpriority`. It does not require `next/image` (or equivalent), max
byte weights per slot (hero / card / before-after), `sizes` attributes, or LQIP.
No doc mentions video at all despite a dance/fitness brand and a motion-craft
brief that often tempts autoplay hero video.

**Why it matters.** Unbounded hero video or full-res before/after pairs will
fail LCP on mobile regardless of JS budget. Transformations (Tier 2) are
image-heavy by nature.

**Exact recommended correction.** Mandate `next/image` (or documented
exception); set max weights (e.g. hero ≤ 200KB compressed, inline ≤ 100KB);
require `sizes`; ban autoplay video in hero unless muted, deferred past LCP,
and budgeted in DECISIONS.md; specify poster frames and captions for any video
(a11y).

**Planning document(s) that should change.** `PERFORMANCE-BUDGET.md`,
`ACCESSIBILITY-STANDARDS.md` (captions), `MOTION-SYSTEM.md` (video not a
motion-library substitute).

---

### I10 — Mobile UX is implied by Lighthouse mobile, not designed

**Problem.** Docs never specify breakpoints, mobile navigation pattern, sticky
trial CTA behaviour, timetable density on small screens, or touch-first form
UX. PERFORMANCE-BUDGET requires mobile CWV; ACCESSIBILITY does not require
touch targets (I4).

**Why it matters.** `/timetable` and multi-branch `/contact` are the routes most
likely to ship a desktop-first grid that fails usability on phones — the
primary device for local “classes near me” users.

**Exact recommended correction.** Add a Mobile subsection: breakpoint tokens;
header pattern (e.g. priority+drawer); sticky CTA rules; timetable as
stacked-by-day or horizontal-scroll with SR-accessible table alternative;
44px targets; WhatsApp CTA prominence on small screens.

**Planning document(s) that should change.** `DESIGN-DIRECTION.md`,
`INFORMATION-ARCHITECTURE.md`, `ACCESSIBILITY-STANDARDS.md`.

---

### I11 — Internal contradiction: `/contact` budget class vs. rationale

**Problem.** PERFORMANCE-BUDGET places `/contact` in the **app-like ≤ 300kb**
bucket, then explains contact is “mostly static branch info” and that primarily
server-rendered SEO landings should get the **tightest** budget. `/contact` is
also a Tier 1 route.

**Why it matters.** Implementers will follow the table, not the paragraph, and
may load form/validation weight unnecessarily — or the opposite, under-budget
a real form. Ambiguity undermines the gate.

**Exact recommended correction.** Split `/contact` static NAP block (landing
budget) from an interactive form island, **or** move `/contact` to the landing
budget and keep only `/trial` / `/timetable` / `/pricing` as app-like.

**Planning document(s) that should change.** `PERFORMANCE-BUDGET.md`.

---

### I12 — Primary nav advertises Tier 2 routes before they exist / before data is safe

**Problem.** Primary nav includes Pricing, Trainers, and Transformations while
those routes are Tier 2 with higher mock-data harm. Phase 1 builds Tier 1 only.

**Why it matters.** Either Phase 1 ships a nav with dead links, or Tier 2 is
pulled forward under pressure without the inline-disclaimer treatment IA
requires.

**Exact recommended correction.** Define Phase 1 nav as Tier 1 destinations +
trial CTA only; add Tier 2 links when those routes ship with inline
disclaimers. Document progressive nav in IA.

**Planning document(s) that should change.** `INFORMATION-ARCHITECTURE.md`,
`IMPLEMENTATION-PLAN.md`.

---

## Optional

### O1 — Thirteen governance docs is heavy but acceptable for dual-agent + mock-risk

Consolidation (e.g. MOTION + PERFORMANCE, or BRIEF + HANDOFF) could reduce
index overhead later. Not worth restructuring before Phase 1 execution.

**Classification:** Optional.

### O2 — `reference-only` vs `mock` adds bookkeeping without gating difference

ADR-002 treats both as launch-blocking. The distinction helps BUSINESS-DATA
STATUS honesty (Maps pins) and is worth keeping for humans; do not add separate
runtime behaviour unless needed.

**Classification:** Optional (keep; do not expand).

### O3 — BlogPost / MDX in the content model before Tier 3

Harmless if ignored; slightly noisy. Prefer a stub type or defer the interface
until Phase 3 (aligns with I6).

**Classification:** Optional.

### O4 — School of Motion benchmark link as craft bar

Fine as quality reference; risk is Cursor interpreting it as licence to add
scrollytelling/GSAP early. MOTION-SYSTEM already constrains this — reinforce in
Phase 1 task notes only if needed.

**Classification:** Optional.

### O5 — Programme accent hue family approach

Reasonable; finalize tokens in Phase 1 as planned. Watch contrast failures on
bright dance accents (already hinted in a11y doc).

**Classification:** Optional.

### O6 — Add `docs/CURSOR-ARCHITECTURE-REVIEW.md` to the doc index

When planning docs are next edited for C/I fixes, add this review to the indexes
in `AGENTS.md` and `PROJECT-BRIEF.md` so future sessions discover it.

**Classification:** Optional (index update only; content already exists).

---

## Rejected concerns

### R1 — “Four-layer launch gate is overengineered”

**Rejected.** Given explicit owner risk (fake prices, phones, trainers) and
dual-agent delivery, type + UI + CI + indexing layers are proportionate.
Gaps are incomplete enforcement (C4, I7), not excess layers.

### R2 — “One shared design system is too rigid for gym + dance”

**Rejected.** ADR-004 correctly avoids sub-brand fragmentation; accent tokens
are the right narrow mechanism.

### R3 — “Should not build any location/programme UI until data is verified”

**Rejected.** Mock-first development with a real launch gate matches the brief.
Blocking craft work on owner data would stall the project; the failure mode to
prevent is **publishing**, not **prototyping**.

### R4 — “GSAP/WebGL allowance will inevitably blow performance”

**Rejected as stated.** ADR-005’s justification-per-usage rule is sufficient
**if** Motion-default budget issues (C2) are fixed and GSAP stays dynamically
imported. The risk is Motion ubiquity, not the GSAP escape hatch.

### R5 — “Tier 3 blog stub is a waste”

**Rejected.** Deferring fabricated posts is correct; empty “coming soon” is
preferable to mock articles.

### R6 — “Ownership split Claude vs Cursor is unnecessary process”

**Rejected.** For two agents on one repo, claiming in TASKS.md is cheap
insurance. It needs dependency edges (C3) and hotspot rules (I8), not removal.

### R7 — “TypeScript discriminated unions for provenance are unnecessary”

**Rejected.** Compile-time forcing of `mockDisclaimer` is one of the strongest
ideas in the set; keep it.

---

## Overengineering summary (criterion 15)

| Area | Assessment |
|---|---|
| Doc volume | Slightly heavy (O1); acceptable |
| ADR-002 gate | Not overengineered; under-tested (C4) |
| Provenance union | Appropriate |
| Agent ownership protocol | Appropriate; missing dependencies/hotspots |
| Motion-as-default everywhere | **Over-reaching** relative to budgets (C2) |
| Programme×location omission | **Under-engineered** for stated SEO goal (C1) |
| MDX blog fields pre–Tier 3 | Mild over-spec (O3/I6) |
| `@id`-only JSON-LD idea | Clever but hazardous — prefer omit (I7) |

Net: the plan over-indexes on animation defaults and under-indexes on local SEO
URL design and testable launch-gate enforcement.

---

## Parallelism and conflict map (criteria 9–10)

**Do not run in parallel**

- Content types/accessor **vs** anything importing them (mock data, routes,
  banner).
- Design tokens **vs** final Motion/visual polish (prototypes only in parallel).
- Claude scaffolding and Cursor polish on the **same** component path before
  scaffolding is `Done`.
- CONTENT-MODEL type edits **vs** accessor implementation (single claim).

**Safe parallel kickoff**

- Design token finalisation ∥ content-model types + accessor (different files).

**Likely conflict files**

`docs/TASKS.md`, `docs/HANDOFF.md`, `docs/DECISIONS.md`, `src/app/layout.tsx`,
global CSS/tokens, `Header`/`Footer`/`MockBanner`,
`src/lib/content/**` ↔ `docs/CONTENT-MODEL.md`.

---

## Suggested fix order (for the next planning pass)

1. Resolve C1 (programme×location IA) and C2 (Motion loading model).
2. Encode C3 dependencies + I8 hotspots in TASKS/AGENTS.
3. Close I7 + C4 (mock leak paths + gate tests) before Tier 1 is called
   demo-ready.
4. Address I1 (conversion), I2/I12 (Thane/nav), I5 (App Router specifics).
5. Fold I3, I4, I9, I10, I11 into SEO/a11y/perf/design docs.
6. Leave Optional items unless touched while editing those files.

---

## Review metadata

| Field | Value |
|---|---|
| Date | 2026-07-31 |
| Inputs | `CLAUDE.md`, `AGENTS.md`, all `docs/*.md` listed in PROJECT-BRIEF (excluding this file) |
| Application source reviewed | None (stock scaffold only; not modified) |
| Planning docs modified by this review | None — recommendations only; `HANDOFF.md` notes completion separately |
