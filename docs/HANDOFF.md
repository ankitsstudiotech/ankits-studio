# Handoff

_Last updated: 2026-07-31 — Phase 1 shared foundation implemented (Tracks B/C
done, Track A/F partial; Tracks D/E deliberately not started)._

## Current state

Application source code now exists. The stock `create-next-app` scaffold has
been extended, not replaced — `src/app/page.tsx` (the homepage) is untouched
on purpose (see [PROJECT-BRIEF.md](./PROJECT-BRIEF.md) constraints; this pass
was scoped to shared foundation, not the final homepage, final programme/
location pages, or complex animation).

### What was built (this pass)

**Content domain** — `src/content/`:
- `schema/` — Zod schemas + inferred TypeScript types for every domain in
  [CONTENT-MODEL.md](./CONTENT-MODEL.md): `Programme`, `Branch`, `Trainer`,
  `TimetableSlot`, `PricingPlan`, `Transformation`, `Testimonial`,
  `BlogPost`, `MediaAsset`, plus the shared `provenanced()` helper
  implementing the mock/reference-only/verified discriminated union from
  ADR-002/ADR-012.
- `mock/` — at least one mock record per domain (per
  [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md)); `blog.ts` is
  deliberately empty per Tier 3 guidance in
  [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md).
- `verified/` — typed, empty arrays, ready for the owner's confirmed data.
- `content-mode.ts` — computes `siteHasUnverifiedContent`, and implements
  the two remaining ADR-002 launch-gate layers: `assertMockContentSafeForBuild()`
  (layer 3) and `shouldNoIndex()` (layer 4).
- `index.ts` — the content source abstraction (merges mock + verified by
  slug/id, verified taking precedence). Exposes typed getters
  (`getProgrammes`, `getPubliclyListedBranches`, `getTimetableSlots`, etc.)
  and `getBranchContactLinks()` — the **only** sanctioned way to get a
  `tel:`/`wa.me`/map-embed value, which structurally returns `null` for
  everything unless the branch is `dataStatus === "verified"` (ADR-011).

**Path correction vs. the plan**: [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md)
Track B originally sketched the accessor at `src/lib/content/**`. It lives at
`src/content/index.ts` instead — the whole content domain (schema, mock,
verified, mode, accessor) is colocated under one `src/content/` tree per this
task's explicit structure request. No `CONTENT-MODEL.md` type shape changed,
so this doesn't need a new ADR (Hard Rule 9 triggers on type changes, not file
location) — but `IMPLEMENTATION-PLAN.md` itself still says `src/lib/content/**`
in a few places and wasn't corrected there (out of scope for this pass).
[TASKS.md](./TASKS.md)'s hotspot table has the corrected pointer.

**Production mock-content safety check (ADR-002 layer 3, accelerated)** —
originally scoped to Phase 2 Track I, built now instead: `next.config.ts`
calls `assertMockContentSafeForBuild()` at config-load time. Verified
end-to-end, not just by inspection:
- `npm run build` (no `ALLOW_MOCK_PUBLISH`) → **exits 1**, build fails with a
  clear error naming ADR-002/ADR-011.
- `ALLOW_MOCK_PUBLISH=true npm run build` → **exits 0**, succeeds, and the
  generated HTML carries `<meta name="robots" content="noindex, nofollow">`
  (checked directly in `.next/server/app/index.html`) — confirming layer 4
  (`shouldNoIndex()`) still applies even when layer 3 is explicitly overridden.

**Environment & metadata** — `src/lib/env.ts` (Zod-validated `NODE_ENV`,
`ALLOW_MOCK_PUBLISH`, `NEXT_PUBLIC_SITE_URL`, fails fast on invalid values),
`src/lib/metadata.ts` (central `siteConfig`/`baseMetadata`/`buildRobotsMeta`
— deliberately doesn't name Thane even generically, since it isn't publicly
listed yet). `.env.example` documents both variables.

**App shell** — `src/app/layout.tsx` (fonts via `next/font/google`, kept as
Geist Sans/Mono — a functional starting point, not DESIGN-DIRECTION.md's
"final family selection," which stays a Track A/Cursor decision; skip link;
root metadata; `MockModeIndicator` mount), `src/app/error.tsx` (uses this
Next.js version's `unstable_retry` prop — see the error-handling doc under
`node_modules/next/dist/docs/`, this is a v16.2 addition, not something to
assume from training data), `src/app/not-found.tsx`. `src/components/MockModeIndicator.tsx`
is a **development-only** indicator (`NODE_ENV === "development"` +
unverified content) — narrower than the full ADR-002 layer-2 banner, which
must also render on any allowed preview build, not just `next dev`; that
broader version is still open (Track F).

**Design tokens** — `src/styles/tokens.css`: a starting oklch palette (base
surface/ink/accent + the three `ProgrammeAccentFamily` tokens), a small
spacing/type scale, motion-timing reference variables. Explicitly a
*foundation*, not Track A's final deliverable — DESIGN-DIRECTION.md's
"final family selection," full spacing/type system, and the mobile
breakpoint/nav-pattern decision are still open. One real bug was caught and
fixed by the accessibility test foundation itself: the initial `--color-accent`
(oklch 62% lightness) only hit 3.78:1 contrast with white text — axe flagged
it as a serious violation on `/not-found`, dropped to 46% lightness to clear
4.5:1, re-verified green.

**Testing foundation**:
- Vitest 3.2.7 (not 4.x — 4.x pulls in an experimental Rolldown native
  binding that failed to resolve in this environment; 3.x is the stable,
  well-established choice, consistent with "keep the technical approach as
  simple as possible"), `@testing-library/react`/`jest-dom`, jsdom **26.x**
  (not the newest 30.x — that pulled in an ESM-only transitive dependency
  that a still-CJS `jsdom` couldn't `require()`; 26.x is the mature,
  compatible choice). 16 unit tests across 4 files, all passing: the
  provenance discriminated union, `content-mode`'s gate logic (including the
  actual throw/no-throw/noindex behavior across dev/production/
  `ALLOW_MOCK_PUBLISH` combinations), env validation, and `MockModeIndicator`.
- Playwright + `@axe-core/playwright`. 5 e2e tests, all passing: home page
  loads with a `<main>` landmark, the skip link targets `#main-content`, home
  and `/not-found` both have zero serious/critical axe violations, and a
  smoke test confirming the `noindex` robots meta tag is actually present in
  a served response (ADR-011 test obligation (d)).
- `eslint.config.mjs` gained a `no-restricted-imports` rule: `src/app`,
  `src/components`, and `src/lib` cannot import `content/mock` or
  `content/verified` directly — only `src/content` itself is exempt
  (ADR-011 test obligation (b)).
- `tsconfig.json` gained `noUncheckedIndexedAccess` and
  `forceConsistentCasingInFileNames`.

### Verification run (this pass, all green)

```
npm run lint         # clean
npm run type-check   # clean (tsc --noEmit --strict, whole src/ tree)
npm run test         # 16/16 unit tests pass
npm run test:e2e     # 5/5 e2e tests pass (Playwright + axe-core)
npm run build                        # exits 1 — correctly blocked (mock content, no override)
ALLOW_MOCK_PUBLISH=true npm run build  # exits 0 — succeeds, ships noindex
```

### What's still open in Phase 1 (see [TASKS.md](./TASKS.md) for the full track table)

- **Track A (design tokens)** — in progress. Starting values exist and pass
  contrast; final palette/type/spacing decisions and the mobile
  breakpoint/nav-pattern decision remain.
- **Track D (Tier 1 route scaffolding)** — not started. Deliberately out of
  scope for this pass ("do not build the final homepage / final programme or
  location pages").
- **Track E (base Motion system)** — not started. Deliberately out of scope
  ("do not build complex animation").
- **Track F (mock-data banner)** — partial. The narrower dev-only indicator
  exists; the full non-dismissable cross-environment banner (ADR-002 layer 2)
  is still open.
- One ADR-011 test obligation remains: item (e), mock-branch JSON-LD-omission
  test — blocked on Track H (structured data) existing.

## What's decided (see DECISIONS.md for full rationale)

- Stack: Next.js App Router, TypeScript strict, Tailwind (ADR-001), with App
  Router rendering/client-boundary rules now made explicit (ADR-010).
- Mock-data strategy: typed `dataStatus` field (three states — `mock` /
  `reference-only` / `verified`) + 4-layer launch gate, owner-only
  verification (ADR-002), hardened against specific leak paths (ADR-011) —
  and, as of this pass, **implemented and verified**, not just designed.
- Route/IA structure with 3-tier build order (ADR-003), extended with a new
  Tier 2 route family for local SEO: `/locations/[branch]/[programme]`
  (ADR-008), and a progressive/phased primary nav (ADR-007 finding I12).
- Design system: one shared system, three semantic accent families
  (`strength`/`calm`/`high-energy`, ADR-012), light theme only for v1
  (ADR-007 finding I4).
- Motion default, opt-in client-island loading model (ADR-009); GSAP for
  justified complex timelines only, no WebGL by default (ADR-005).
- Claude/Cursor ownership split + TASKS.md claiming protocol (ADR-006), with
  a Phase 1 dependency graph and named shared-file hotspots (ADR-007
  findings C3, I8) — see the path correction noted above.

## What's next

1. **Track A** — finalize design tokens (palette, type, spacing values;
   mobile breakpoints/nav pattern). Claim in [TASKS.md](./TASKS.md).
2. **Track D** — Tier 1 route scaffolding, now unblocked (Track B/C are
   done). Build against `src/content`'s accessor functions.
3. **Track E** — base Motion system, once Track D has real markup to
   integrate against.
4. **Track F** — extend `MockModeIndicator` (or add a second component) into
   the full ADR-002 layer-2 banner that also covers allowed preview builds.
5. Phase 2 planning can start once Phase 1's remaining tracks close — see
   [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md).

## Open questions for the business owner (blocking Phase 4, not Phase 1)

- Does the Thane branch actually operate yet, or is it aspirational?
- Real branch addresses for Airoli and Ghansoli (never embedded in the UI
  pre-verification — enforced structurally by `getBranchContactLinks()` and
  the `mapEmbedUrl`/`tel:`/`wa.me` rules in
  [CONTENT-MODEL.md](./CONTENT-MODEL.md)).
- Real phone/WhatsApp numbers, fees, batch timings, trainer roster and
  qualifications, and whether any existing testimonials/transformation
  stories can be used with consent.
- Brand assets: existing logo/photography, or proceed with placeholders?
- Conversion channel priority and form/analytics vendor (ADR-007 finding I1).

None of these block Phase 1 — they block Phase 4 (launch) per ADR-002/ADR-011
and the BUSINESS-DATA-STATUS.md verification workflow.

## How to resume

Read [PROJECT-BRIEF.md](./PROJECT-BRIEF.md) first, then this file, then
[TASKS.md](./TASKS.md) for what's currently claimed/available, then
[IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) for track detail. Before
writing route code, read `src/content/index.ts`'s exported accessor
functions — don't import `src/content/mock/**` directly (the lint rule will
catch it, but it's cheaper not to).
