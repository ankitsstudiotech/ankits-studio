# Handoff

_Last updated: 2026-08-02 — Production-readiness audit findings resolved._

## Latest pass: production-readiness audit fixes (2026-08-02)

Read both audits in full: [CLAUDE-TECHNICAL-SEO-AUDIT.md](./audits/CLAUDE-TECHNICAL-SEO-AUDIT.md),
[CURSOR-VISUAL-BROWSER-AUDIT.md](./audits/CURSOR-VISUAL-BROWSER-AUDIT.md) —
each now carries a per-finding **Resolution status** section at the bottom.
Full triage reasoning (duplicates, rejections, accepted-fixes checklist):
[DECISIONS.md ADR-013](./DECISIONS.md#adr-013).

**Fixed:** mobile nav drawer (portal, was clipped to header height —
`backdrop-filter` containing-block bug), a dev hydration mismatch in
`ScrollReveal`, the client-chrome/footer coupling (`PathAwareShell` removed),
the preview-build mock banner (`MockModeIndicator` now also shows on
`ALLOW_MOCK_PUBLISH=true` builds), sitemap population (was always `[]`),
`/programmes`→`/programs` doc/test drift, `Organization` JSON-LD wiring,
footer touch targets, missing `<h1>`s on about/contact/trial/timetable/pricing,
expanded a11y e2e coverage, trial/contact field-level validation errors
(`useActionState`), lead schema/adapter test coverage, and the chrome-less
404 page.

**Rejected (with reasoning in ADR-013):** programme×location pair routes
(net-new scope, already tracked as Phase 2 Track H), hard-failing the build
on a missing `NEXT_PUBLIC_SITE_URL` (would break legitimate preview
deploys — indexing is already independently gated), restructuring
`/timetable` into a Suspense split (would risk its no-JS GET-filter
behaviour), mobile first-viewport density and the programme-index filter
absence (both intentional per existing IA/mock-mode design).

**Real regression found and fixed during this pass, not from the audits:**
Vitest's `@testing-library/react` auto-cleanup was silently never firing
(the project doesn't set `test.globals: true`, so the library's
global-`afterEach` auto-registration never triggers) — any future test file
with more than one `render()` call and visible output would have collided.
Fixed by adding an explicit `afterEach(cleanup)` in `vitest.setup.ts`.

**Performance:** measured actual per-route gzipped JS via a real `next
start` server (Playwright network capture — no new bundle-analyzer
dependency). Found a second self-introduced regression: the new
`TrialForm.tsx` (built for the VIS-002 fix) imported from the `@/lib/leads`
barrel, pulling zod's ~71kb gzip into the `/trial` client bundle for no
reason (fixed — `/trial` dropped 268kb → 199kb by importing from
`@/lib/leads/types` directly). Separately, **flagging for a product/
architecture decision, not fixed here**: every route ships a ~197–202kb
shared gzipped JS baseline (React 19 + Next 16 client runtime + the Motion
library, present even on routes untouched by this pass like `/pricing` and
`/blog`), which exceeds `docs/PERFORMANCE-BUDGET.md`'s 150kb "landing"
budget. This predates this session. Reducing it means either accepting the
framework floor as unavoidable (revise the budget), or scoping Motion to a
narrower set of routes than its current broad, approved usage across the
design system — a design-system-level tradeoff, not a bug to silently fix.

**Verification (this pass, all green):**

```
npm run lint
npm run type-check
npm run test                          # 144/144 (now includes former tests/seo, tests/routes)
npx playwright test --workers=1       # 10/10 (parallel workers are flaky under
                                       #   Turbopack's on-demand compile — run serially)
npm run build                         # exit 1 — still correctly blocked
ALLOW_MOCK_PUBLISH=true npm run build # exit 0 — 38 routes generate
```

**Process note (MOCK-002, documented not fixed — it's a CI hygiene item,
not a code defect):** the negative-build-gate assertion (`npm run build`
without `ALLOW_MOCK_PUBLISH` must exit 1) only proves anything if the shell
running it doesn't already have `ALLOW_MOCK_PUBLISH=true` set from a prior
step. CI must explicitly unset it (`env -u ALLOW_MOCK_PUBLISH` / PowerShell
`Remove-Item Env:ALLOW_MOCK_PUBLISH`) before asserting the negative case.

**Vitest config note:** `tests/seo/vitest.config.ts` and
`tests/routes/vitest.config.ts` (scoped configs from earlier
ownership-restricted passes) are now deleted — their globs are folded into
the root `vitest.config.mts`'s `include`, so `npm run test` covers
everything in one run.

## Current state

The marketing site now covers the remaining Tier 1–3 destinations plus about
and legal draft pages. Shared chrome (`SiteChrome`) wraps the homepage,
programme/location trees, and new marketing routes.

### Routes shipped (2026-08-01 pass)

| Path | Notes |
|---|---|
| `/about` | Founder-story placeholder; no invented years/certs |
| `/trainers`, `/trainers/[slug]` | Illustrative roster; missing quals handled |
| `/transformations` | Editorial placeholder; no fabricated before/after |
| `/timetable` | GET filters by branch/programme; works without JS |
| `/pricing` | Mock fees labelled; no discount countdowns |
| `/trial` | Typed trial form + lead adapters |
| `/book-a-free-trial` | Redirects to canonical `/trial` |
| `/contact` | Safe mock contact (no fake `tel:`); inquiry form |
| `/blog`, `/blog/[slug]` | Sample articles, **forceNoIndex** |
| `/privacy-policy`, `/terms` | Explicit draft placeholders pending legal review |

### Lead adapters

- `src/lib/leads` — `LeadAdapter` interface
- Mock adapter for development / mock-publish
- Production placeholder fails closed unless/until a real provider is wired
  (`LEAD_PROVIDER_URL`); never reports successful delivery when unconfigured

### Verification (2026-08-01 pass)

```
npm run lint
npm run type-check
npm run test
npx vitest run --config tests/seo/vitest.config.ts     # configs since deleted —
npx vitest run --config tests/routes/vitest.config.ts  #   folded into the root config, see above
ALLOW_MOCK_PUBLISH=true npm run build
```

### Still open

- ~~Track F: full ADR-002 layer-2 banner on preview builds~~ — done, see the
  latest-pass section above (MOCK-001).
- CONTENT-MODEL.md / DECISIONS.md sync for earlier schema extensions
- Owner data verification (Phase 4)
- Wire a real lead provider before production form delivery
- **New from the latest pass:** decide whether to revise
  `docs/PERFORMANCE-BUDGET.md`'s 150kb landing-route JS budget or scope
  Motion usage more narrowly — the current ~197–202kb shared React+Next+Motion
  baseline exceeds it on several routes and isn't something a bug-fix pass
  should silently redesign (see "Performance" above).

## How to resume

Read this file, then [TASKS.md](./TASKS.md). Canonical trial path is `/trial`.
Load all business data via `@/content` only.
