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
layers ([IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md), refined by
[ADR-011](#adr-011) / [ADR-013](#adr-013)):

1. **Type-level**: a mock record cannot exist without a `mockDisclaimer` string
   (discriminated union via `provenanced()` in `src/content/schema/provenance.ts`).
2. **UI-level**: a non-dismissable banner (`MockModeIndicator`) renders in
   development and on `ALLOW_MOCK_PUBLISH=true` preview builds whenever any
   content is still `"mock"` or `"reference-only"`; high-risk fields (price,
   phone, address, trainer identity) also render inline disclaimers.
3. **Build/CI-level**: `assertMockContentSafeForBuild()` (called from
   `next.config.ts`) fails the production build if unverified content remains
   unless `ALLOW_MOCK_PUBLISH=true` (explicit preview escape hatch only).
4. **Indexing-level**: `shouldNoIndex()` keeps robots/metadata/`sitemap` blocked
   while any unverified content exists; production indexing only after owner
   verification clears the content layer (see [SEO-STRATEGY.md](./SEO-STRATEGY.md)).

Only the business owner may flip a [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md)
row to `VERIFIED`; neither agent may infer verification.

**Why**: The owner brief is explicit that most business details are unverified
and must never be presented as real — this needs to be true structurally, not
just as a convention someone might forget mid-project.

**Status**: Active — all four layers implemented in code as of the Phase 1–3
content/SEO foundation and the 2026-08-01/02 audit-fix pass (ADR-013).

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

<a id="adr-013"></a>
## ADR-013: Reconciliation of the technical/SEO and visual/browser production-readiness audits

**Decision**: `docs/audits/CLAUDE-TECHNICAL-SEO-AUDIT.md` and
`docs/audits/CURSOR-VISUAL-BROWSER-AUDIT.md` (both dated 2026-08-01) are
reconciled together. Every finding gets an explicit accept / partial-accept /
reject verdict, applying the same reconciliation principle as ADR-007: accept
when it closes a real correctness, safety, or accessibility gap; reject when
the finding is already-intentional design, would regress an audit-confirmed-
working property, or is net-new feature scope rather than a fix. No finding
is accepted just because an audit raised it.

**Duplicate/overlapping findings** (fixed once, not once per report):

- ARCH-001 (client chrome wraps footer) and CWV-001 (dynamic routes/client
  chrome as CWV risk) are the same root cause in one audit — fixed together.
- ARCH-001/CWV-001 (Claude, bundle/architecture) and VIS-001 (Cursor, mobile
  drawer rendering) both implicate the header/nav component family but are
  **different bugs** (one is client-bundle composition, the other is a CSS
  containing-block defect) — fixed as two distinct changes in the same files.
- A11Y-001 (narrow automated axe coverage) is the meta-finding that VIS-003
  (touch targets) and VIS-004 (missing `<h1>`) are concrete instances of —
  fixed the concrete bugs and expanded coverage so the class of regression is
  caught automatically going forward.
- FORM-002 (no adapter/schema tests) and VIS-002 (validation UX bug) are
  complementary, not duplicates — VIS-002's actual UX bug is fixed; FORM-002's
  test gap is closed on top of the fix.
- TEST-001 is a summary of the SEO-001 / FORM-002 / A11Y-001 gaps, not a
  separately actionable item.
- PERF-001 and CWV-001 both flag client-JS budget risk from the same chrome
  component — addressed together via the ARCH-001 fix, then measured once.

**Verdict table**:

| # | Finding | Verdict | Why |
|---|---|---|---|
| VIS-001 | Mobile nav drawer collapses (backdrop-filter containing block traps `position: fixed`) | **Accept** | Genuine High/Critical bug — primary mobile navigation is visually unusable for sighted users. Root cause confirmed: `SiteHeader` has `backdrop-blur-md` (`backdrop-filter`), which per spec creates a containing block for `position: fixed` descendants; `MobileNav`'s drawer is nested inside `<header>`. Fixed by portalling the drawer/overlay to `document.body`. |
| VIS-005 | Hydration mismatch overlay in dev, cites `SiteChrome`/`Overline` | **Accept** | Root cause found: `ScrollReveal.tsx` conditionally returns a plain `<div>` vs. `<motion.div>` based on `useReducedMotion()` — exactly the pattern `TextReveal.tsx`'s own code comment warns against ("Same DOM on server and client (avoids hydration mismatch)"), and which `TextReveal`/`FadeIn` already avoid correctly. `ScrollReveal` was never updated to match. Fixed by applying the same always-same-element-type pattern. |
| ARCH-001 | `PathAwareShell` (client) wraps `SiteFooter` unnecessarily | **Accept** | Directly contradicts the approved ADR-009/ADR-010 opt-in-island rule — footer has no interactivity and shouldn't be forced into the client bundle graph. Fixed by removing `PathAwareShell`; `SiteChrome` (server) now composes `SiteHeader` (client, self-contained `usePathname()`), `{children}`, `SiteFooter` (server), `StickyCtaBar` (client, self-contained `usePathname()`) directly. |
| CWV-001 | Dynamic routes + client chrome are CWV risk | **Accept, via ARCH-001** | Same root cause as ARCH-001; no separate fix needed. The `ƒ` (dynamic) marking on `/timetable`/`/trial`/`/contact` for reading `searchParams` is correct, intended Next.js behavior, not a defect — not touched. |
| PERF-001 | Homepage `ScrollReveal` count — budget risk | **Accept, measure + fix the regression found** | Measured actual gzipped JS-per-route via a real `next start` server (Playwright network capture, no new bundle-analyzer dependency) against `docs/PERFORMANCE-BUDGET.md`. Found a genuine regression introduced by this pass's own VIS-002 refactor: `TrialForm.tsx` imported from the `@/lib/leads` barrel, which re-exports the zod-based lead schemas, pulling ~71kb gzip of zod into the `/trial` client bundle for no reason — fixed by importing `ageGroupValues`/`preferredTimingValues` from `@/lib/leads/types` directly (`/trial` dropped 268kb → 199kb). Separately found a ~197–202kb shared JS baseline (React 19 + Next 16 client runtime + the Motion library) present on every route, including ones untouched by this pass (`/pricing`, `/blog`) — this exceeds the 150kb "landing" budget but predates this session and is not a regression; reducing it would mean either dropping React/Next (rejected: "don't replace working libraries") or restricting Motion's already-approved broad usage across the design system (a scope decision, not a bug fix — flagged in `docs/HANDOFF.md` for a product/architecture call, not silently redesigned here). |
| MOCK-001 | ADR-002 layer-2 banner absent on `ALLOW_MOCK_PUBLISH` preview builds | **Accept** | Directly closes a real mock-data publication risk — a stakeholder reviewing a preview build could mistake mock content for real despite `noindex`. `MockModeIndicator` now shows whenever unverified content exists **and** (`development` **or** `ALLOW_MOCK_PUBLISH === "true"`). |
| MOCK-002 | CI must unset `ALLOW_MOCK_PUBLISH` before asserting the negative-build-gate test | **Accept, documented only** | Process note, not a code defect — recorded in `docs/HANDOFF.md` verification steps. |
| SEO-001 | Sitemap always returns `[]`, even once indexable | **Accept** | `buildSitemapEntries()` now builds real entries (Tier 1/2 verified/public routes) once `shouldNoIndex()` is false, keeping the `[]` short-circuit unchanged while it's true. |
| SEO-002 | Programme×location pair routes (`/locations/[branch]/[programme]`) missing | **Reject** | This is net-new feature scope (unique per-pair copy, a new route tree, new content-model fields), not a "fix" to something broken — it's already correctly tracked as Phase 2 Track H via ADR-008 and `docs/IMPLEMENTATION-PLAN.md`. Implementing a whole route family under a production-readiness audit-fix pass would be exactly the "unsolicited redesign"/scope-creep this task was told to avoid. Stays on the backlog. |
| SEO-003 | Docs/tests still encode `/programmes`; live routes are `/programs` | **Accept** | Direct follow-up to `docs/HANDOFF-ROUTES.md`'s own flagged gap. Normalized `tests/seo/**`, `docs/INFORMATION-ARCHITECTURE.md`, `docs/PERFORMANCE-BUDGET.md`, `docs/IMPLEMENTATION-PLAN.md`, `docs/TASKS.md`, `docs/HANDOFF-ROUTES.md`, `docs/HANDOFF-ROUTE-UI.md` to `/programs` where they describe the *live* route. Left `docs/DECISIONS.md` ADR-008's and `docs/CURSOR-ARCHITECTURE-REVIEW.md`'s historical text alone — both describe a not-yet-built route pattern / a frozen past review, not the current live IA. |
| SEO-004 | `Organization` JSON-LD built but never emitted | **Accept** | Wired into the root layout, gated the same as every other builder (`dataStatus === "verified"`) — inert today (identity is mock), correct once verified. Cheap, low-risk, closes a real gap. |
| SEO-005 | FAQ/LocalBusiness correctly omitted; Course emits for verified programmes | **Superseded for programmes by ADR-017** | Course emission was later judged inaccurate for enquiry-based services — see ADR-017. |
| SEO-006 | Canonical/OG host depends on `NEXT_PUBLIC_SITE_URL`; recommend failing production builds when unset | **Partial accept** | Accepted: documented clearly in `.env.example`/`docs/HANDOFF.md` as a pre-launch requirement. Rejected: a hard build-time failure when unset, because "production" in this codebase already means "`NODE_ENV=production`", which includes legitimate `ALLOW_MOCK_PUBLISH=true` preview deploys that may not yet have a final domain — hard-failing those would break the preview pipeline ADR-002 depends on. Indexability is already independently gated by `shouldNoIndex()`; a wrong-host canonical on a `noindex` preview is not a live-leak. |
| A11Y-001 | Narrow automated axe coverage (`/` and 404 only) | **Accept** | Expanded `e2e/accessibility.spec.ts` to `/trial`, `/contact`, `/timetable`, `/programs/yoga`, `/locations/airoli`. |
| A11Y-002 | Timetable filters work without JS | **No action** | Positive finding — explicitly preserved (see ARCH-002 rejection below). |
| VIS-002 | Trial/contact validation is banner-only; no field-level errors or `aria-invalid` | **Accept** | `Field`/`TextInput` already supported `error`/`invalid` props unused by the pages. Converted both forms' Server Actions to the `useActionState` pattern (Next's own documented pattern for this exact case — see `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md`): validation failures now return field-level errors instead of a redirect-only banner; native HTML validation (`noValidate` removed) runs first. Success/`not-configured`/`provider-error` paths still redirect — those aren't per-field concerns. |
| FORM-001 | Lead adapters fail closed; honest messaging | **No action** | Positive finding. |
| FORM-002 | No tests for lead schemas/adapters/actions | **Accept** | Added `src/lib/leads/trial-schema.test.ts` and `src/lib/leads/adapters.test.ts`. |
| VIS-003 | Footer/dense text links narrower than 44px touch target | **Accept** | Added horizontal padding + `min-h-11`/`min-w-11` to `SiteFooter` links. |
| VIS-004 | Several pages have no document `<h1>` (about, contact, trial, ...) | **Accept** | Added an optional `titleAs` prop to `Section` (defaults to `"h2"`, unchanged for every existing call site) so each page's primary section can render its title as the page's one `<h1>`. Applied to about/contact/trial/timetable/pricing. |
| VIS-006 | 404 page has no site chrome | **Accept** | Root `not-found.tsx` now renders inside `SiteChrome`, matching every real route. |
| VIS-007 | Mobile first-viewport density (banner + header + hero + dual CTA + sticky bar) | **Reject** | Cosmetic, and the audit itself frames it as "intentional mock posture" — the preview banner disappears the moment mock mode ends by design (ADR-002). Restructuring hero/sticky-CTA interaction to "fix" a temporary, self-resolving state would be exactly the unsolicited visual redesign this task was told to avoid. |
| VIS-008 | Programme index has no filter controls | **Reject** | Intentional per `docs/INFORMATION-ARCHITECTURE.md` — filtering lives on `/timetable` only; the audit's own text agrees ("current ship is browse-all"). Not a defect. |
| ARCH-002 | Missing `loading.tsx` for trainers/blog; timetable "not Suspense-split" | **Partial accept** | Accepted: added `loading.tsx` under `trainers/[slug]` and `blog/[slug]` — cheap, zero-risk. Rejected: restructuring `/timetable` into a static shell + `Suspense`-wrapped `searchParams` island. The current plain `<form method="get">` is exactly what ADR-010 asks for (a working no-JS baseline) and is a **positive, audit-confirmed** finding (A11Y-002) — Next's `ƒ` (dynamic) marking for a `searchParams`-reading page is correct, standard behavior, not a defect. Restructuring it for a marginal loading-state improvement risks regressing an approved, working, explicitly-praised property for no clear benefit — rejected as disproportionate to the actual problem. |
| ARCH-003 | No segment-level `error.tsx` | **Partial accept** | Added `src/app/(marketing)/error.tsx`. Did not add one under `programs/`/`locations/` in this pass — the marketing group covers most conversion-path routes; the rest can follow the same pattern later without urgency. |
| SEC-001, MOCK-003, TYPE-001, LOCAL-001, CONTENT-001 | Various | **No action** | Positive findings, spot-checked during this pass, still correct. |

**Why**: Same reconciliation discipline as ADR-007 — an independent audit
finding a problem doesn't obligate implementing its exact prescribed fix if
that fix conflicts with already-approved architecture (ADR-009/010), would
regress an audit-confirmed-working property (A11Y-002), or is out of scope
for a "fix" pass (SEO-002, VIS-008). Every rejection above is a considered
judgment against the approved architecture and existing ADRs, not a default.

**Status**: Active.

## ADR-014: Owner selects Studio Pulse for production (overrides agent Kinetic Editorial pick)

**Decision**: Production visual redesign implements **Studio Pulse** (`/design-lab/revamp-b`), as personally selected by the owner. This **overrides** the agent-recommended Kinetic Editorial winner documented in `docs/revamp/04-prototype-evaluation.md`. Historical evaluation scores and critiques must **not** be rewritten to pretend Studio Pulse originally won.

**Why**: Owner prefers rhythm-led energy, layered media for Zumba/dance/active training, stronger emotional engagement, and wants to present this complete direction to Ankit first. Production work must still mitigate the documented boutique-HIIT / nightlife skew via tempo zones (high-energy / strength / calm / community / utility) so yoga, kids dance, families, and booking utility remain coherent — see `docs/revamp/06-owner-direction-decision.md`.

**Preservation**: Directions A and C remain frozen design-lab artefacts; do not delete or silently restyle them. Kinetic Editorial system snapshot lives at `docs/revamp/KINETIC-EDITORIAL-DESIGN-SYSTEM.md`. Root `DESIGN.md` becomes the Studio Pulse production proposal.

**Status**: Active.

## ADR-015: Owner interview 2026-08-01 — business data + WhatsApp-primary conversion

**Decision**: Promote owner-interview facts dated 2026-08-01 into the content model with explicit provenance (`owner_interview` / `owner_confirmed`). Key outcomes:

- Four open branches (Airoli Sector 19 via slug `airoli`, new `airoli-sector-8`, Ghansoli, Thane publicly listed).
- Central phone/WhatsApp `+91 93724 02074` verified on `ContactDetails`; branches inherit the same number and stay non-dialable via `getBranchContactLinks` until each branch record is fully verified (addresses pending).
- Operating window 06:00–22:00 on all branches — never used as batch timetable rows.
- Free trial + INR 300 registration fee on `StudioCommercial`; programme plan prices pending (illustrative plans removed).
- New programmes added for Functional Training, Wedding Choreography, Home Personal Training, Online Training; legacy Strength / PT / Kids Dance / Weight-loss routes kept with `taxonomyStatus: "migration-pending"` — no silent deletes or redirects.
- Primary conversion is WhatsApp (`src/lib/conversion/whatsapp.ts`); `/trial` remains secondary. Opening WhatsApp must never be described as message delivery.
- Maps short URLs associated after browser resolution as `mapsShortUrl` only; `mapEmbedUrl` remains unset until branch verification (ADR-011 intact).
- Mock-publication protections (`ALLOW_MOCK_PUBLISH`, `noindex`, launch gate) remain in force while addresses, timetable, trainers, media, and taxonomy remain incomplete.

**Why**: Owner supplied operable business facts; the site must stop advertising invented phones/hours/branch posture without weakening honesty gates for still-pending fields.

**Status**: Active.

## ADR-016: Primary nav label — Batch Availability (route stays `/timetable`)

**Decision**: Rename the primary-navigation item formerly labelled “Timetable” to **Batch Availability**. The public URL remains `/timetable` to avoid unnecessary SEO and sitemap churn. The page no longer renders illustrative or invented class time rows. It states that slots vary by branch and programme, shows the verified **6:00 AM–10:00 PM operating window separately** (never as a continuous class), and directs visitors to WhatsApp for current batch availability.

**Why**: Exact schedules are still `MOCK / PENDING` (BUSINESS-DATA-STATUS). Labelling the nav “Timetable” while the homepage honestly says schedules are unpublished created trust friction (Impeccable critique P3). “Batch Availability” matches owner and FAQ language already on the site better than a generic “Class Availability” label next to Programmes / Locations.

**Status**: Active.

## ADR-017: Programme pages use WebPage/CollectionPage + BreadcrumbList — not Course

**Decision**: Confirmed programme detail pages and `/programs` must **not** emit `schema.org/Course` JSON-LD (or Course ItemList carousels). The safe programme structured-data model is:

| Route | Allowed JSON-LD |
|---|---|
| `/programs` | `CollectionPage` (name, description, url) + `BreadcrumbList` |
| Confirmed `/programs/[slug]` | `WebPage` (name, description, url) + `BreadcrumbList` |
| Legacy `migration-pending` programme routes | `BreadcrumbList` only; remain `noindex`; stay out of the sitemap |

`buildCourseJsonLd` always returns `null` until an explicit future ADR approves a genuine educational Course content model (curriculum, outcomes, instructors, instances). Do **not** emit Service, Offer, Event, AggregateRating, Review, instructor, schedule, duration, CourseInstance, or price properties for programmes while those facts are pending, enquiry-only, or inventable from mock timetable/trainer data. Home Personal Training and Online Training must never be marked up as physical-branch class instances.

**Why**: Official Google Search Course list guidelines require educational curriculum with modules/lectures, an educational outcome, and instructor-led students. Ankit’s Studio’s confirmed programmes are enquiry-based fitness, movement, and choreography **services** without verified curricula, modules, outcomes, published schedules, assigned instructors, durations, course instances, or complete pricing. Emitting `Course` misrepresents the page and does not qualify for Google’s Course list rich result (Course Info rich results were also retired). Accuracy and Hard Rule honesty outweigh schema volume. Full audit: `docs/audits/PROGRAMME-STRUCTURED-DATA-AUDIT.md`.

**Status**: Active. Supersedes the positive SEO-005 note in ADR-013 (“Course emits for verified programmes”) for programme routes.

## ADR-018: Branch pages use ExerciseGym when printable address is owner-confirmed

**Decision**: Location structured data follows the programme honesty pattern (ADR-017), with ExerciseGym enabled only for verified printable addresses:

| Route | Allowed JSON-LD |
|---|---|
| `/locations` | `CollectionPage` (name, description, url) + `BreadcrumbList` |
| Confirmed `/locations/[slug]` | `WebPage` + `BreadcrumbList` |
| `ExerciseGym` / `LocalBusiness` | When `dataStatus === "verified"` **and** `address` is non-null with `fieldProvenance.address === "owner_confirmed"` |

Eligible ExerciseGym properties (must also be visibly rendered on the branch page):

- `name`, `url`
- `PostalAddress` (`streetAddress`, `addressLocality`, optional `postalCode` / `addressRegion` when confirmed and visible)
- `telephone` — central enquiry number when `fieldProvenance.phone === "owner_confirmed"` and shown on-page
- `openingHoursSpecification` — operating window only when hours provenance is owner-confirmed (not batch schedules)
- `hasMap` — owner-confirmed Maps URL when linked on-page
- `parentOrganization` — Ankit’s Studio when the brand relationship is visible

Do **not** emit: geo coordinates, ratings, reviews, priceRange, amenities, class schedules, trainer assignments, or Google Business Profile URLs until supplied.

Owner-confirmed Maps short URLs may also appear as visible links via `getBranchMapsUrl` independently of ExerciseGym.

Legacy `/locations/airoli` permanently redirects to `/locations/airoli-sector-19` (see `docs/migrations/LOCATION-ROUTE-MIGRATION.md`).

**Update (2026-08-03)**: Owner supplied printable addresses and Maps URLs for all four branches. ExerciseGym is therefore eligible for every publicly listed branch. Operating hours (6:00 AM–10:00 PM every day) may appear in JSON-LD because they are visible as an operating window on each branch page.

**Why**: Google Local Business / ExerciseGym markup that includes incomplete or invented addresses creates local-SEO risk. Plain WebPage + BreadcrumbList remains the fallback when address provenance is incomplete. Full audit: `docs/audits/LOCATION-STRUCTURED-DATA-AUDIT.md`.

**Status**: Active.

## ADR-019: Trainers route indexing and profile publishability

**Decision**: Individual trainer profiles and the `/trainers` marketing route follow a strict readiness gate.

### Publishability (per profile)

A trainer record must **not** become publicly visible merely because an owner supplied a name. Public rendering (`getPublishableTrainers` / profile routes) requires **all** of:

1. `dataStatus === "verified"`
2. `profilePublicationStatus === "published"`
3. `profileVerificationStatus` is `verified` or `publishable`
4. `publicationConsentStatus === "granted"`
5. Public name
6. Real photograph with `photoPublicationPermission === true`
7. Role
8. At least one confirmed programme **or** branch relationship
9. At least one safely described qualification line, structured certification, or years-of-experience value that the owner has approved for publication

Mock or draft records may exist for internal tooling but must never render on marketing routes.

### Indexing of `/trainers`

Until the threshold below is met:

- Keep `/trainers` reachable
- Mark `/trainers` `noindex` (`forceNoIndex`)
- Exclude `/trainers` from the sitemap
- Do not emit `Person`, `Employee`, `EducationalOccupationalCredential`, or trainer `ItemList` JSON-LD
- Do not generate public `/trainers/[slug]` pages for non-publishable profiles (`notFound`)
- Keep Trainers in **footer** navigation only (not a primary-nav promise of a complete roster)
- Do **not** redirect `/trainers` → `/about` (About already carries the 15+ team statement; Trainers remains the future home for verified profiles)

### Activation threshold

`/trainers` may become indexable and enter the sitemap only when:

**`getPublishableTrainers().length >= 3`** (`TRAINERS_ROUTE_INDEX_THRESHOLD`)

**Rationale:** Three complete publishable profiles make a crawlable team directory useful rather than a single-person stub. Team-level copy alone (15+ count) is already covered honestly on `/about` and on the noindexed Trainers page; indexing requires enough verified people that search visitors are not sent to an empty roster. A single “lead” profile is **not** sufficient for indexing under this ADR (it may still render on the page once publishable, behind noindex, if product later enables one-card previews — today zero profiles render).

Implementation: `shouldIndexTrainersRoute()` in `src/content/index.ts`.

### Team-size claim

Public copy may state the owner-provided **15+** team size with explicit provenance. Do not publish “highly qualified”, “government-approved”, “expert”, or ambiguous “2+ years” until evidence and subject clarification exist.

**Why**: Mock illustrative trainers were publicly rendered as a card grid; sitemap and indexing would have promised a completed directory once the sitewide mock gate lifted. Accuracy and Hard Rule honesty require a publishability gate independent of “owner mentioned a name”.

**Status**: Active.

## ADR-020: Corporate Fitness Sessions — enquiry-only until content is useful

**Decision:** Corporate Fitness Sessions are an owner-confirmed offering (2026-08-03) but remain **enquiry-only**. Do **not** create an indexable `/programs/corporate-fitness` page (or sitemap entry) until there is enough verified body content for a useful programme page.

Public treatment:

- Mention on `/programs` as an enquiry-only note with WhatsApp CTA
- May appear in WhatsApp service pickers where appropriate
- `StudioCommercial.corporateFitnessStatus: "enquiry-only"`

**Why:** A thin indexable page would over-promise an incomplete offering. ADR-017 already requires programmes to avoid invented Course/Offer semantics; the same honesty applies to incomplete catalogue entries.

**Status**: Active.

## ADR-021: No self-serving Review or AggregateRating structured data for Ankit’s Studio

**Decision:** The website is controlled by the business being reviewed. Therefore:

1. **Do not emit** `Review`, `AggregateRating`, or nested `review` / `aggregateRating` / star-rating properties on:
   - `Organization`
   - `LocalBusiness` / `ExerciseGym`
   - Any other page JSON-LD that marks up Ankit’s Studio as the reviewed entity
2. **Do not** add review or aggregate-rating properties inside branch ExerciseGym markup (ADR-018 remains address/hours/telephone/`hasMap` only).
3. Visible Google reviews (when a future Places-backed UI ships) may appear **to users** with required Maps attribution and selection disclosure, but **must not** be mirrored into self-serving review rich-result markup.
4. Embedded third-party review widgets about this business remain self-serving for rich-result purposes under Google Search Central review snippet guidelines and do not justify adding Review/AggregateRating JSON-LD.
5. First-party member testimonials and transformation stories likewise **must not** be wrapped in Review/AggregateRating JSON-LD about the studio.

**Regression requirements:**

- Keep and extend unit tests that fail if Organization / LocalBusiness / ExerciseGym / programme / about / trainers JSON-LD contains `Review`, `AggregateRating`, `aggregateRating`, `reviewRating`, or fabricated star fields.
- Any proposal to add review structured data requires a **new ADR** citing current Google Search Central eligibility for the specific schema type and a legal/product review — default remains **omit**.

**Why:** Google Search Central states that when the entity being reviewed controls the reviews about itself, pages using `LocalBusiness` or `Organization` structured data are ineligible for the star review feature (including reviews placed directly or via third-party widgets). Emitting self-serving markup creates false SEO expectations and policy risk without benefit. See [Review snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) (“Self-serving reviews aren't allowed for LocalBusiness and Organization…”).

**Status**: Active.

## Log format for future entries

```
## ADR-NNN: <short title>

**Decision**: ...
**Why**: ...
**Status**: Active | Superseded by ADR-NNN | Reverted
```
