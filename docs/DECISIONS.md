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

<a id="adr-007"></a>
## ADR-007: Reconciliation of the independent architecture review

**Decision**: [CURSOR-ARCHITECTURE-REVIEW.md](./CURSOR-ARCHITECTURE-REVIEW.md) (an
independent staff-level review) is reconciled against this architecture as of
2026-07-31. Every Critical (C1–C4) and Important (I1–I12) finding gets an
explicit accept / partial-accept / reject verdict below. Optional (O1–O6) and
Rejected (R1–R7) findings in that review already carry the reviewer's own
no-action verdict and are not re-litigated here, except O6 (add the review to
the doc index — done, see [PROJECT-BRIEF.md](./PROJECT-BRIEF.md) and
[AGENTS.md](../AGENTS.md)).

Reconciliation principle applied throughout: accept a finding when it closes a
real gap in the mock-data/launch-gate story, the local-SEO goal, or an actual
contradiction between docs; partially accept when the underlying problem is
real but the proposed fix adds more machinery than the project needs yet;
reject when the finding either restates something already handled correctly
or would add complexity disproportionate to a pre-code, mock-data-only phase.
No finding is accepted just because an independent reviewer raised it.

| # | Finding | Verdict | Why | Doc(s) changed |
|---|---|---|---|---|
| C1 | No programme×location landing surfaces | **Accept** | Real gap against the stated local-SEO goal; the fix is one new route family generated from data the content model already has (`Programme.branchSlugs` / `Branch.programmeSlugs`) — cheap relative to its SEO value. | [ADR-008](#adr-008), INFORMATION-ARCHITECTURE.md, SEO-STRATEGY.md, TASKS.md |
| C2 | Motion-as-global-default conflicts with the 150kb landing budget | **Accept** | Real contradiction between two existing docs (MOTION-SYSTEM.md vs. PERFORMANCE-BUDGET.md). App Router's server/client split already makes an opt-in-island model the *simpler* fix, not an added abstraction. | [ADR-009](#adr-009), MOTION-SYSTEM.md, PERFORMANCE-BUDGET.md |
| C3 | Phase 1 tasks listed as parallel but several are serial | **Accept** | Directly threatens ADR-006's own purpose (avoid silent conflicting edits). Fix is a dependency ordering, not new process. | IMPLEMENTATION-PLAN.md, TASKS.md |
| C4 | No test requirements for the launch gate or content contracts | **Accept, folded into ADR-011** | A structural gate nobody verifies is the exact "theatre" risk the reviewer names. Addressed together with the mock-data leak paths in I7 since both are "make ADR-002 actually enforced," not two separate efforts. | [ADR-011](#adr-011), IMPLEMENTATION-PLAN.md |
| I1 | Conversion strategy is route-shaped, not funnel-shaped | **Partial accept** | The CTA hierarchy and `/trial` vs `/contact` split are worth fixing now (cheap, prevents duplicate forms). Analytics events, lead routing, and spam protection are rejected *for now* — no analytics/form vendor is chosen yet, so specifying event names would be speculative detail with nothing to attach to (YAGNI); revisit in Phase 2 once a form provider is picked. | INFORMATION-ARCHITECTURE.md, IMPLEMENTATION-PLAN.md |
| I2 | Thin/near-duplicate location pages, Thane in public nav while unconfirmed | **Accept** | Directly reinforces Hard Rule 8 (production block while mock data exists) — Thane in global nav pre-confirmation is a publication-risk bug, not a style nit. | INFORMATION-ARCHITECTURE.md, SEO-STRATEGY.md, BUSINESS-DATA-STATUS.md |
| I3 | Incomplete local SEO mechanics (templates, canonical, OG, Maps embed, non-goals) | **Accept, kept terse** | Standard SEO hygiene that costs a short bullet list, not new architecture. The Maps-embed sub-point is treated as a leak path, folded into ADR-011. | SEO-STRATEGY.md |
| I4 | Accessibility gaps beyond WCAG headlines (skip links, live regions, touch targets, focus traps, icon-only names, dark-mode ambiguity) | **Accept** | Concrete, cheap, high-value checklist additions. Dark-mode ambiguity is resolved by **deciding light-only for v1** — removes a whole axis of contrast work nobody asked for (simplification, not scope growth). | ACCESSIBILITY-STANDARDS.md, DESIGN-DIRECTION.md |
| I5 | App Router rendering/boundary decisions underspecified | **Accept** | Reduces implementation ambiguity, which is a simplification (fewer decisions improvised mid-build), and is required to make ADR-009's opt-in-island model concrete. | [ADR-010](#adr-010), INFORMATION-ARCHITECTURE.md |
| I6 | Presentation tokens/media URLs inside the content model | **Partial accept** | `heroAccent` as a semantic key (not a raw design token) and deferring the blog body format are accepted — both *reduce* coupling and are strictly simpler. A `MediaAsset` type is accepted but trimmed to `src`/`alt`/`width`/`height` only; `licenceNote` and `lqip` are rejected for now — no real photography exists yet, so those fields have nothing to hold (YAGNI, revisit when Phase 2/3 sources real images). | [ADR-012](#adr-012), CONTENT-MODEL.md |
| I7 | Residual mock-data leak paths (hardcoded facts, `mapEmbedUrl`, JSON-LD placeholder ambiguity, dialable fake numbers, ungoverned member counts, missing Phase 1 noindex criterion) | **Accept, mostly — one sub-point simplified rather than expanded** | Directly protects Hard Rule 8. The JSON-LD ambiguity is resolved by **deleting** the riskier "`@id`-only placeholder" option and keeping only "omit entirely until verified" — fewer branches, not more. Member-count tracking is **rejected as a new content type** for now (no route currently needs it); instead a flat ban on hardcoding such numbers is added — closes the risk without adding a type nothing consumes yet. | [ADR-011](#adr-011), CONTENT-MODEL.md, BUSINESS-DATA-STATUS.md, SEO-STRATEGY.md |
| I8 | Shared file hotspots not named in the ownership protocol | **Accept** | Cheap, directly extends ADR-006, prevents exactly the conflict class ADR-006 exists to prevent. | TASKS.md |
| I9 | Image guidance partial; video guidance absent | **Accept, kept terse** | Transformations (Tier 2) is image-heavy and the brief invites motion-craft ambition that could tempt autoplay hero video; both are cheap to bound now before anyone builds against an unbounded assumption. | PERFORMANCE-BUDGET.md, ACCESSIBILITY-STANDARDS.md, MOTION-SYSTEM.md |
| I10 | Mobile UX implied, not designed | **Partial accept** | Touch targets are covered under I4. Breakpoints and the mobile nav/timetable-layout pattern are accepted as *named Phase 1 deliverables* (assigned to specific tracks below), not specified in detail here — inventing exact breakpoint pixel values in a governance doc before any component exists would be speculative. | DESIGN-DIRECTION.md, INFORMATION-ARCHITECTURE.md, TASKS.md |
| I11 | `/contact` budget-table placement contradicts its own rationale text | **Accept** | Genuine leftover self-contradiction from the previous reconciliation pass (rationale claimed `/contact` "gets the tightest budget" while the table keeps it in the looser bucket) — a documentation bug, fixed directly. | PERFORMANCE-BUDGET.md |
| I12 | Primary nav advertises Tier 2 routes before they exist/are safe | **Accept** | Same class of issue as I2 — prevents either dead links or pressure to ship Tier 2 early without its disclaimer treatment. | INFORMATION-ARCHITECTURE.md, IMPLEMENTATION-PLAN.md |

**Status**: Active.

<a id="adr-008"></a>
## ADR-008: Local SEO — programme×branch landing pages

**Decision**: Add one new route family, `/locations/[branch]/[programme]`,
generated **only** for valid branch×programme pairs already implied by the
content model (`Branch.programmeSlugs` ∩ `Programme.branchSlugs` — no new
relational data needed). Location-first URL shape is chosen over
programme-first (`/programmes/[programme]/[branch]`) — picking exactly one
resolves the review's own "`X` **or** `Y`" ambiguity and avoids duplicate
content between two URL shapes for the same intent. Each page requires unique,
server-rendered copy (local intro, that branch's timetable excerpt for that
programme, facilities/directions) — reusing the branch or programme page's
copy with only the name swapped is not acceptable (doorway-page risk). The
route family ships in **Phase 2, alongside Tier 2**, not Phase 1 — it depends
on both Tier 1 branch/programme pages being stable and on the uniqueness-copy
authoring effort, which is real content work, not scaffolding.

**Why**: This is the single highest-leverage gap the review identified against
the stated business goal (local "[programme] in [area]" search intent) —
bidirectional links between separate programme and location pages are a
supporting signal, not a landing surface. Generating only from existing
relational data, with one canonical URL shape, keeps this the narrowest fix
that closes the gap (no new content type, no second URL shape to maintain).

**Status**: Active. See [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md)
and [SEO-STRATEGY.md](./SEO-STRATEGY.md) for the route/uniqueness detail.

<a id="adr-009"></a>
## ADR-009: Motion loading model — opt-in client islands, not a root default

**Decision**: This amends ADR-005's framing. Motion remains the default
animation *library* (ADR-005 stands), but is no longer described or
implemented as something imported at the root layout and "needed everywhere."
Concretely:

1. Server-rendered content renders first; Motion hydrates only inside specific
   client-boundary components that need it — never wraps a whole page.
2. Page transitions and shared layout animations are **not** applied to Tier 1
   SEO landing routes by default. Adding one requires a logged budget
   exception in this file.
3. The LCP element (hero image or headline) must never depend on client JS to
   become visible — it renders in the server HTML unconditionally; motion may
   enhance it after hydration, never gate its initial visibility.
4. **Motion bundle accounting**: any shared motion code counts against the
   JS budget of every route that imports it (see
   [PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md)). If a landing route would
   exceed its budget with motion included, the motion is route-split
   (dynamically imported per-route), not exempted from the budget.

**Why**: ADR-005 and the landing-page JS budget were never actually
reconciled — "Motion is small, needed everywhere" is false once scroll
listeners, layout animation, and page transitions are shared site-wide across
the primary LCP/SEO surfaces. This is the narrower fix: it doesn't remove
Motion or add GSAP, it just makes explicit what App Router's server/client
split already implies.

**Status**: Active. Supersedes the "imported normally (small, needed
everywhere)" line in the original PERFORMANCE-BUDGET.md loading strategy.

<a id="adr-010"></a>
## ADR-010: App Router rendering and client-boundary rules

**Decision**: Extends ADR-001. All marketing/content routes (Tier 1 and Tier 2)
default to static generation; `generateStaticParams` supplies slugs from the
content accessor layer (`src/lib/content/**`), never hardcoded. `/timetable`
ships a fully server-rendered default view (no filter applied) so it has
real crawlable content and a working no-JS baseline; branch/programme filters
are a client enhancement layered on top via `searchParams`, wrapped in
`Suspense` so the static shell isn't blocked by the interactive layer.
`generateMetadata` lives only in server route files. Client components
(`"use client"`) live under an agreed path convention
(`src/components/client/**`) so "is this a client boundary" is answerable by
folder alone. `loading.tsx` / `not-found.tsx` are required per dynamic route
segment (`[slug]`, `[branch]`, `[programme]`).

**Why**: The most common Next.js SEO failure mode is a whole page accidentally
marked client-side for animation or filters, weakening `view-source` content.
This makes the boundary explicit and gives ADR-009's opt-in-island model a
concrete home. Reduces implementation-time improvisation rather than adding
new options.

**Status**: Active.

<a id="adr-011"></a>
## ADR-011: Launch-gate hardening — leak-path closure and test requirements

**Decision**: Extends ADR-002 with implementation-level rules that close
specific leak paths the review identified, and adds the minimum test
obligations needed for the gate to be more than a design on paper:

1. **No hardcoded business facts.** Prices, phone numbers, addresses, trainer
   names, or any BUSINESS-DATA-STATUS.md-governed value may never appear as a
   literal in a component — always through `src/lib/content/**`.
2. **`mapEmbedUrl` is never rendered while `dataStatus !== "verified"`.** The
   field may exist on a mock/reference-only `Branch` record (it's where the
   owner's Maps pin lives for internal reference) but the accessor/UI layer
   must not read or embed it until that record is verified — an embedded map
   pin is exactly as much of a leak as a printed address.
3. **`tel:` / `wa.me` hrefs are never rendered from a record unless
   `dataStatus === "verified"`.** Pre-verification, phone/WhatsApp values
   display as plain (non-linked) text, and use an obviously-non-dialable
   example pattern rather than a plausible live-looking number.
4. **Structured data: omit, never placeholder.** The original "or emit it
   with `@id`-only placeholder scoping" option in SEO-STRATEGY.md is deleted.
   The only rule is: `LocalBusiness` JSON-LD is omitted entirely for any
   branch that isn't `verified`. One rule, no judgment call to get wrong.
5. **Member counts / social-proof numbers get no dedicated content type
   for now.** Hardcoding such a number anywhere is banned; if a real need
   for one arises, it requires a new `Provenanced` type added via its own
   `docs/DECISIONS.md` entry first (per Hard Rule 9) — not created
   speculatively here.
6. **Unconditional `noindex` on non-production is a Phase 1 exit criterion**,
   not a Phase 2 nice-to-have — it's cheap (one metadata default) and closes
   the gap between "Tier 1 can be demo-ready in Phase 1" and "indexing is
   only gated in Phase 4."
7. **Minimum test obligations before Phase 2 exit**: a lightweight test
   runner is introduced (Vitest — chosen for minimal config against a
   TypeScript-strict Next.js project, no framework-specific test glue
   needed) covering: (a) the `Provenanced<T>` contract — a fixture missing
   `mockDisclaimer` while mock/reference-only fails to typecheck; (b) a lint
   rule or test failing on any import of `src/content/mock/**` from outside
   `src/lib/content/**`; (c) a golden-path test for the future launch-readiness
   script (mock present → fail production target; all verified → pass); (d) a
   smoke test asserting non-production responses carry `noindex`; (e) a test
   asserting mock/reference-only branch pages emit no `LocalBusiness` JSON-LD.
   Items (a)–(b) land in Phase 1 (they gate the content layer itself); (c)–(e)
   land in Phase 2 alongside the routes/structured-data they test.

**Why**: Most accidental "we published a fake price/phone/address" incidents
come from bypasses (hardcoded values, embeds, unlinked-but-rendered contact
methods) and untested gates, not from the typed provenance model itself,
which is already sound (see rejected concern R7 in
[CURSOR-ARCHITECTURE-REVIEW.md](./CURSOR-ARCHITECTURE-REVIEW.md)). Closing
paths and adding the minimum tests is proportionate; it does not add new
gate layers beyond the four ADR-002 already defines.

**Status**: Active.

<a id="adr-012"></a>
## ADR-012: Content-model refinements — semantic accent key, MediaAsset, deferred blog format

**Decision**: Three changes to [CONTENT-MODEL.md](./CONTENT-MODEL.md), required
under Hard Rule 9 because they change the types:

1. `Programme.heroAccent` changes from an implied raw design-token reference to
   a small semantic union, `ProgrammeAccentFamily = "strength" | "calm" |
   "high-energy"` (strength-training/personal-training/weight-loss-fitness →
   `"strength"`; yoga → `"calm"`; zumba/adult-dance/kids-dance →
   `"high-energy"`). The design layer (Phase 1 design-tokens track) maps each
   family to actual CSS tokens — content no longer names a design-system
   value directly.
2. A minimal `MediaAsset` type (`src`, `alt`, `width`, `height` — no more)
   replaces raw `photoUrl`/`beforeImageUrl`/`afterImageUrl` strings on
   `Trainer` and `Transformation`.
3. `BlogPost.bodyMdx: string` becomes `BlogPost.body: string`, treated as an
   opaque format decided when Tier 3 becomes real (Phase 3), not committed to
   MDX now.

**Why**: (1) decouples content from a design system that hasn't been finalized
yet — three semantic states are enough to differentiate strength vs. calm vs.
high-energy contexts (ADR-004) without content churning every time a token
value changes. (2) images without at least `alt`/`width`/`height` push
accessibility/CLS concerns into ad-hoc component code, undermining the
single-accessor-layer story; `licenceNote` and `lqip` are deliberately left
out — no real photography exists yet, so those fields would hold nothing
(YAGNI). (3) MDX is a real commitment (tooling, sanitization, rendering
pipeline) that Tier 3 doesn't need decided now; deferring is strictly simpler
than picking a format and possibly redoing it in Phase 3.

**Status**: Active.

## Log format for future entries

```
## ADR-NNN: <short title>

**Decision**: ...
**Why**: ...
**Status**: Active | Superseded by ADR-NNN | Reverted
```
