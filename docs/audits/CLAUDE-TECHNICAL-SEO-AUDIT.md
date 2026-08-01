# Technical & SEO Audit — Ankit's Studio

_Date: 2026-08-01_  
_Scope: read-only production-readiness audit. No application source was modified._  
_Auditor posture: Claude technical / SEO review against ADRs 002, 007, 009–012 and current codebase._

## Executive summary

The site is in a **safe mock/noindex posture**: provenance-gated contact links, omit-unless-verified JSON-LD, production build blocking without `ALLOW_MOCK_PUBLISH`, and honest lead-adapter messaging. No **critical** live-leak issues were found in the current mock mode.

Launch blockers and high-priority gaps remain:

1. **Sitemap never emits routes** once the site becomes indexable.
2. **Programme×location pair routes** from the IA are not built.
3. **ADR-002 layer-2 mock banner** is missing on preview (`ALLOW_MOCK_PUBLISH`) builds.
4. **Client chrome shell** pulls header/footer into the client graph site-wide.
5. **Test / docs drift** (`/programmes` vs `/programs`) and thin form/a11y coverage.

## Verification commands run

| Command | Result |
|---|---|
| `npm run lint` | Pass (exit 0) |
| `npm run type-check` | Pass (exit 0) |
| `npm test` | Pass — 27/27 |
| `npx vitest run --config tests/seo/vitest.config.ts` | Pass — 47/47 |
| `npx vitest run --config tests/routes/vitest.config.ts` | Pass — 31/31 |
| `npm run build` with `ALLOW_MOCK_PUBLISH` unset | **Fail (exit 1)** — mock gate blocked build as designed |
| `ALLOW_MOCK_PUBLISH=true npm run build` | Pass — 38 routes generated |

Observed route mix from successful mock-publish build: static (○), SSG with params (●), and dynamic `searchParams` routes (ƒ) for `/timetable`, `/trial`, `/contact`.

**Note:** An earlier verification pass reported `BUILD_NO_MOCK_EXIT=0` while `ALLOW_MOCK_PUBLISH` was still set in the persistent PowerShell session. Re-running with the env var cleared correctly failed the build. CI must unset `ALLOW_MOCK_PUBLISH` when asserting the gate.

---

## Architecture snapshot

| Area | Current state |
|---|---|
| Router | App Router; marketing under `src/app/(marketing)/`; programmes/locations outside the group |
| Chrome | `SiteChrome` → client `PathAwareShell` on marketing, programmes, locations |
| Client modules | 11 `"use client"` files (layout, motion, forms, `error.tsx`) |
| Structured data | Breadcrumb / Course / LocalBusiness / Article / FAQ / Organization builders; Organization unused on pages |
| Content gate | `assertMockContentSafeForBuild` in `next.config.ts`; `shouldNoIndex()` drives robots + metadata |
| Forms | Server Actions + Zod; mock vs production lead adapters |

---

## Findings

### SEO-001 — Sitemap remains empty after mock gate lifts

- **Severity:** High
- **Evidence:** `buildSitemapEntries()` returns `[]` both when `shouldNoIndex()` is true **and** when it is false. Comment still claims “No routes exist yet” despite programmes, locations, and marketing routes shipping.
- **Relevant file:** `src/lib/seo/sitemap.ts` (lines 12–22)
- **Impact:** On a fully verified production launch, `robots.txt` will allow crawling and reference `/sitemap.xml`, but the sitemap will list zero URLs — delayed discovery of local landing pages.
- **Exact recommended fix:** After `if (shouldNoIndex()) return []`, build entries from accessors: `/`, `/programs`, each `getProgrammes()` slug, `/locations`, each `getPubliclyListedBranches()` slug, plus other verified Tier 1/2 URLs. Exclude Thane (`publiclyListed: false`), blog samples unless verified, and draft legal pages until counsel-approved. Keep the `shouldNoIndex()` short-circuit.
- **Verification method:** Add a Vitest case that stubs production + zero unverified content (or mocks `shouldNoIndex` false) and asserts non-empty URLs including `/programs/yoga` and `/locations/airoli`. Confirm `/sitemap.xml` in an `ALLOW_MOCK_PUBLISH` build stays empty.

---

### SEO-002 — Programme×location pair routes missing

- **Severity:** High
- **Evidence:** IA Tier 2 lists `/locations/[branch]/[programme]` for local SEO with unique per-pair copy. No matching App Router tree exists. Bidirectional linking today is only programme↔location index cards on detail pages.
- **Relevant file:** `docs/INFORMATION-ARCHITECTURE.md` (route table + Tier 2 rules); absence under `src/app/locations/`
- **Impact:** Weakest local-SEO surface for “programme near branch” queries; no dedicated pair canonicals, metadata, or JSON-LD.
- **Exact recommended fix:** Add `src/app/locations/[slug]/[programmeSlug]/page.tsx` (or IA-aligned segment names) with `generateStaticParams` from publicly listed branch × `programmeSlugs` intersections; unique intro copy fields on content model; breadcrumbs; Course/LocalBusiness composition per SEO-STRATEGY; noindex until pair copy verified.
- **Verification method:** Build emits one HTML path per listed pair; route tests assert Thane pairs absent; metadata uniqueness test across pairs.

---

### SEO-003 — Docs/tests still encode `/programmes` while live routes are `/programs`

- **Severity:** Medium
- **Evidence:** Runtime hrefs use `/programs` (`src/content/mock/navigation.ts`, homepage, programme/location pages). Planning docs and SEO tests still use `/programmes` (e.g. `tests/seo/canonical.test.ts`, `docs/PERFORMANCE-BUDGET.md`, `docs/INFORMATION-ARCHITECTURE.md`). Live `src` has no `/programmes` hrefs.
- **Relevant file:** `tests/seo/canonical.test.ts`; `docs/INFORMATION-ARCHITECTURE.md`; `docs/HANDOFF-ROUTES.md`
- **Impact:** Future agents may scaffold wrong paths; SEO tests do not assert the real public URL shape; HANDOFF-ROUTES still claims homepage `/programmes` 404s that are already fixed.
- **Exact recommended fix:** Normalize docs + tests to `/programs` (or add redirects from `/programmes` → `/programs` **and** document the dual spelling). Update HANDOFF-ROUTES stale homepage warning.
- **Verification method:** `rg "/programmes" docs tests src` shows only intentional historical notes; smoke e2e hits `/programs`.

---

### SEO-004 — Organization JSON-LD never emitted on pages

- **Severity:** Low
- **Evidence:** `buildOrganizationJsonLd` exists and is gated on verified identity, but no page imports/calls it. Course JSON-LD inlines a minimal provider Organization via `siteConfig.name`.
- **Relevant file:** `src/lib/seo/structured-data.ts` (`buildOrganizationJsonLd`); `src/app/layout.tsx` / homepage (no call site)
- **Impact:** Missing sitewide Organization graph once identity is verified; weaker brand entity signals.
- **Exact recommended fix:** When `getBusinessIdentity().dataStatus === "verified"`, emit Organization JSON-LD from root layout or homepage only (single emission). Keep omit-unless-verified.
- **Verification method:** Structured-data test + grep of built homepage HTML for `"@type":"Organization"` only when identity stubbed verified.

---

### SEO-005 — FAQ / LocalBusiness JSON-LD correctly omitted today; Course emits for verified programmes

- **Severity:** Info (positive)
- **Evidence:** Location pages call `buildLocalBusinessJsonLd` (null for mock branches). Programme pages emit Course for verified programmes. FAQ builder filters to verified FAQs only → null with current mock FAQs. Blog samples force noindex and skip Article JSON-LD.
- **Relevant file:** `src/app/programs/[slug]/page.tsx`; `src/app/locations/[slug]/page.tsx`; `src/app/(marketing)/blog/[slug]/page.tsx`
- **Impact:** No false LocalBusiness/Article entities in mock mode — ADR-011 compliant.
- **Exact recommended fix:** None required for mock mode. Before launch, verify branch + FAQ records so LocalBusiness/FAQPage can emit without placeholders.
- **Verification method:** Existing `tests/routes/structured-data-safety.test.ts` + SEO structured-data suite; keep green.

---

### SEO-006 — Canonical builder is sound; production URL depends on env

- **Severity:** Info / Low
- **Evidence:** `buildCanonicalUrl` requires leading `/`, rejects `?`/`#`/trailing slash (except `/`). Absolute URL uses `siteConfig.url` from `NEXT_PUBLIC_SITE_URL` with localhost fallback.
- **Relevant file:** `src/lib/seo/canonical.ts`; `src/lib/metadata.ts`
- **Impact:** Preview/prod misconfiguration can publish localhost or wrong-host canonicals once indexable.
- **Exact recommended fix:** Require `NEXT_PUBLIC_SITE_URL` in production CI; fail build if missing/invalid for production (env schema already validates URL shape when set).
- **Verification method:** Deploy preview HTML `<link rel="canonical">` host matches intended domain.

---

### ARCH-001 — Client `PathAwareShell` wraps site chrome and imports footer

- **Severity:** Medium
- **Evidence:** `PathAwareShell` is `"use client"` and renders `SiteHeader`, `{children}`, `SiteFooter`, `StickyCtaBar`. `SiteFooter` has no `"use client"` but is imported into the client module graph. Used by marketing, programmes, and locations layouts.
- **Relevant file:** `src/components/layout/PathAwareShell.tsx`; `src/components/layout/SiteChrome.tsx`
- **Impact:** Increases JS shipped on every marketing page vs ADR-009/PERF landing budget; footer cannot stay a pure RSC leaf.
- **Exact recommended fix:** Keep a thin client island for pathname-aware nav/sticky CTA only; render `SiteFooter` from the server `SiteChrome` sibling outside the client boundary. Optionally pass pathname via a small client `NavActiveState` child.
- **Verification method:** `@next/bundle-analyzer` or build client chunk sizes before/after; confirm footer code not in chrome client chunk.

---

### ARCH-002 — ADR-010: missing `loading.tsx` for trainers/blog; timetable not Suspense-split

- **Severity:** Medium
- **Evidence:** `loading.tsx` exists only under `programs/[slug]` and `locations/[slug]`. Trainers/blog slug trees have `not-found` but no `loading`. Timetable is a single async server page reading `searchParams` (ƒ dynamic) without a static shell + Suspense filter island as ADR-010 describes. Clients are not under `src/components/client/**`.
- **Relevant file:** `src/app/(marketing)/timetable/page.tsx`; absence of `src/app/(marketing)/trainers/[slug]/loading.tsx` and `blog/[slug]/loading.tsx`
- **Impact:** Weaker instant navigation feedback on trainers/blog; full timetable route dynamic for all visits; convention drift from ADR-010.
- **Exact recommended fix:** Add `loading.tsx` for trainers/blog segments. Split timetable into static chrome + `<Suspense>` child that reads `searchParams` (keep GET form no-JS behaviour). Document client folder convention or update ADR-010 to match current layout.
- **Verification method:** Soft-nav shows loading UI; timetable HTML still filterable with JS disabled; build still lists filtered results for query URLs.

---

### ARCH-003 — Root `error.tsx` only; no segment-level error boundaries

- **Severity:** Low
- **Evidence:** Single `src/app/error.tsx`. No nested `error.tsx` under `(marketing)`, programmes, or locations.
- **Relevant file:** `src/app/error.tsx`
- **Impact:** A render error in one segment recovers only at root; heavier UX reset than necessary.
- **Exact recommended fix:** Add lightweight `error.tsx` under `(marketing)` and optionally programmes/locations with retry + link home.
- **Verification method:** Temporary throw in a page component; confirm segment boundary catches without blanking the entire chrome if chrome is outside the boundary.

---

### MOCK-001 — ADR-002 layer-2 banner absent on preview builds

- **Severity:** Medium
- **Evidence:** `MockModeIndicator` returns null unless `NODE_ENV === "development"`. Comments explicitly defer preview-build banner to Track F. Production mock-publish builds can ship without a visible “mock content” chrome banner while still noindex.
- **Relevant file:** `src/components/MockModeIndicator.tsx` (lines 13–16); `docs/HANDOFF.md` / `docs/TASKS.md` Track F
- **Impact:** Stakeholders reviewing `ALLOW_MOCK_PUBLISH` previews may treat mock phone/pricing/schedule as real despite noindex.
- **Exact recommended fix:** Show non-dismissable banner when `siteHasUnverifiedContent` is true **and** (`development` **or** `ALLOW_MOCK_PUBLISH === "true"`). Keep production verified builds banner-free.
- **Verification method:** Extend `MockModeIndicator.test.tsx`; visual check of mock-publish preview HTML for banner text.

---

### MOCK-002 — Production mock build gate works when env is clean

- **Severity:** Info (positive) / Low (process)
- **Evidence:** With `ALLOW_MOCK_PUBLISH` unset, `next build` fails loading `next.config.ts` via `assertMockContentSafeForBuild()`. With `ALLOW_MOCK_PUBLISH=true`, build succeeds and stays noindex via `shouldNoIndex()`. Contact links use `getBranchContactLinks` (null until verified); contact page renders phone as plain text (no `tel:`).
- **Relevant file:** `src/content/content-mode.ts`; `next.config.ts`; `src/content/index.ts` (`getBranchContactLinks`); `src/app/(marketing)/contact/page.tsx`
- **Impact:** Layers 3–4 of ADR-002 are effective. Process risk: polluted CI/shell env can falsely show the gate as open.
- **Exact recommended fix:** Document CI steps to `env -u ALLOW_MOCK_PUBLISH` (or PowerShell `Remove-Item Env:...`) before negative build tests. Optionally assert gate in a dedicated CI job.
- **Verification method:** CI job expecting build exit 1 without the flag; exit 0 with the flag.

---

### MOCK-003 — Blog samples correctly forced noindex; Article JSON-LD omitted

- **Severity:** Info (positive)
- **Evidence:** Blog index/detail pass `forceNoIndex: true` into `buildPageMetadata`. Posts are `dataStatus: "mock"` with disclaimers. `buildArticleJsonLd(post)` returns null for unverified posts.
- **Relevant file:** `src/app/(marketing)/blog/page.tsx`; `src/app/(marketing)/blog/[slug]/page.tsx`; `src/content/mock/blog.ts`
- **Impact:** Sample editorial cannot enter the index even if sitewide noindex is later lifted while samples remain mock — if `forceNoIndex` stays. If samples are deleted/replaced before launch, remove force flag only for verified posts.
- **Exact recommended fix:** Keep `forceNoIndex` for any non-verified post; optionally derive force flag from `post.dataStatus !== "verified"` instead of hardcoding on the route.
- **Verification method:** Built blog HTML contains `noindex`; no `"@type":"Article"` script for samples.

---

### FORM-001 — Lead adapters fail closed; messaging is honest

- **Severity:** Info (positive)
- **Evidence:** Production adapter returns `not-configured` / `provider-error` without claiming delivery. Trial UI states mock accepts are local-only. Zod schemas validate trial + contact payloads. Server Actions redirect only to fixed `/trial` or `/contact` query strings.
- **Relevant file:** `src/lib/leads/production-adapter.ts`; `src/app/(marketing)/trial/page.tsx`; `src/app/(marketing)/trial/actions.ts`
- **Impact:** No false “we received your booking” fiction in production without a provider.
- **Exact recommended fix:** Before launch, wire a real provider behind `LEAD_PROVIDER_URL` and add adapter integration tests. Keep fail-closed default.
- **Verification method:** Unit tests for mock success vs production `not-configured`; e2e submit on preview asserts status copy.

---

### FORM-002 — No automated tests for lead adapters or server actions

- **Severity:** Medium
- **Evidence:** No `src/lib/leads/**/*.test.ts`; route/SEO suites do not cover trial/contact submission paths. Playwright a11y/smoke do not exercise forms.
- **Relevant file:** `src/lib/leads/` (no tests); `e2e/` (2 specs only)
- **Impact:** Regressions could reintroduce fake success messaging or break validation unnoticed.
- **Exact recommended fix:** Add Vitest coverage for `trialLeadSchema`, `contactInquirySchema`, `mockLeadAdapter`, `productionLeadAdapter`. Optional Playwright happy-path for `/trial` in development.
- **Verification method:** New tests in CI; mutation of production adapter success path fails tests.

---

### A11Y-001 — Skip link, labels, and reduced motion present; axe scope narrow

- **Severity:** Low
- **Evidence:** Skip link to `#main-content` in root layout. Form `Field` uses `htmlFor`/`id`. Consent checkboxes labelled. `ScrollReveal` uses `useReducedMotion` and never starts at `opacity: 0`. Playwright axe covers `/` and 404 only.
- **Relevant file:** `src/app/layout.tsx`; `src/components/forms/Field.tsx`; `src/components/motion/ScrollReveal.tsx`; `e2e/accessibility.spec.ts`
- **Impact:** Tier 1 interactive pages (`/trial`, `/contact`, `/timetable`, `/locations/[slug]`) lack automated axe coverage.
- **Exact recommended fix:** Extend Playwright axe to `/trial`, `/contact`, `/timetable`, `/programs/yoga`, `/locations/airoli`. Keep serious/critical threshold.
- **Verification method:** `npx playwright test e2e/accessibility.spec.ts` green with expanded URLs.

---

### A11Y-002 — Timetable filters work without JavaScript

- **Severity:** Info (positive)
- **Evidence:** Timetable uses native `<form method="get">` with branch/programme selects, Apply + Clear link, and `aria-live` result count. Mobile stacked list + desktop table.
- **Relevant file:** `src/app/(marketing)/timetable/page.tsx`
- **Impact:** Meets “accessible without JS” requirement for filters.
- **Exact recommended fix:** Preserve GET form when introducing Suspense client enhancements (progressive enhancement only).
- **Verification method:** Disable JS in browser; submit filters; confirm filtered results and URL query string.

---

### PERF-001 — Motion islands are restrained; homepage still imports multiple reveals

- **Severity:** Low / Medium (budget risk)
- **Evidence:** Only dedicated motion components import `motion/react`. Programme/location detail pages avoid ScrollReveal. Homepage and several home sections use ScrollReveal islands. Initial opacity 0.97 (LCP-safe). No GSAP/WebGL.
- **Relevant file:** `src/components/motion/ScrollReveal.tsx`; `src/app/(marketing)/page.tsx`
- **Impact:** Landing JS may approach the 150kb marketing budget once chrome client + motion combine — not measured in this audit.
- **Exact recommended fix:** Measure with bundle analyzer; consider reducing homepage reveal count or lazy-mounting below-fold reveals.
- **Verification method:** Lighthouse / Web Vitals on `/` and `/programs/[slug]`; compare JS transferred to `docs/PERFORMANCE-BUDGET.md`.

---

### PERF-002 — Images use `next/image` via MediaFrame; no remote patterns configured

- **Severity:** Info
- **Evidence:** `MediaFrame` wraps `next/image` with default/`sizes` overrides at call sites. `next.config.ts` has no `images.remotePatterns` (local/mock assets only). `VideoFrame` is poster-oriented without autoplay policy violations observed.
- **Relevant file:** `src/components/ui/MediaFrame.tsx`; `next.config.ts`
- **Impact:** Fine for mock assets; remote CMS images will fail until patterns are added.
- **Exact recommended fix:** When real media hosts are chosen, add explicit `remotePatterns` and require width/height/alt on the content schema (already present on `MediaAsset`).
- **Verification method:** Build with a sample remote image URL; confirm optimization works only for allowlisted hosts.

---

### CWV-001 — Dynamic form/timetable routes and client chrome are primary CWV risks

- **Severity:** Medium
- **Evidence:** Build marks `/timetable`, `/trial`, `/contact` as ƒ (server-rendered on demand) due to `searchParams`. Sitewide client chrome on static pages still adds hydration work. Hero uses priority media on homepage.
- **Relevant file:** Build output route table; `PathAwareShell.tsx`; trial/contact/timetable pages
- **Impact:** TTFB/hydration variance on conversion pages; INP risk if mobile nav + sticky CTA compete with form interactions.
- **Exact recommended fix:** After ARCH-001/002, measure LCP/INP on mobile for `/`, `/trial`, `/locations/airoli`. Keep LCP image priority only on true heroes; avoid layout shift from mock banners (reserve space).
- **Verification method:** CrUX or lab Lighthouse mobile; fail CI if LCP/INP regress beyond budget thresholds once budgets are encoded.

---

### SEC-001 — JSON-LD serialization escapes HTML; no open redirects in actions

- **Severity:** Info (positive)
- **Evidence:** Only `dangerouslySetInnerHTML` usages are JSON-LD via `serializeJsonLd` escaping. Trial/contact actions redirect to fixed paths. Env schema does not embed secrets; `LEAD_PROVIDER_URL` is runtime-only.
- **Relevant file:** `src/lib/seo/serialize.ts`; trial/contact `actions.ts`; `src/lib/env.ts`
- **Impact:** Low XSS/open-redirect risk in current form.
- **Exact recommended fix:** When a real lead provider is added, validate egress URL allowlist; never reflect raw user input into HTML without encoding.
- **Verification method:** Security review of provider client; XSS payload in trial message does not break out of status UI.

---

### TYPE-001 — Strict TypeScript + Zod content/forms

- **Severity:** Info (positive)
- **Evidence:** `strict` + `noUncheckedIndexedAccess` enabled. Content domains use Zod + provenance union requiring `mockDisclaimer` for non-verified records. Lead forms use Zod before adapter calls.
- **Relevant file:** `tsconfig.json`; `src/content/schema/provenance.ts`; `src/lib/leads/trial-schema.ts`
- **Impact:** Strong compile-time and parse-time safety for content/forms.
- **Exact recommended fix:** Keep provenance tests; add lead schema tests (FORM-002).
- **Verification method:** `npm run type-check`; provenance + future lead tests.

---

### TEST-001 — Coverage gaps for marketing routes, forms, and sitemap population

- **Severity:** Medium
- **Evidence:** Strong coverage for content-mode, SEO builders, programmes/locations routes, duplicate-copy guards. Gaps: about/pricing/blog/contact/trial actions, lead adapters, sitemap non-empty-when-verified, expanded axe, Playwright beyond smoke/a11y home+404.
- **Relevant file:** `tests/seo/**`; `tests/routes/**`; `e2e/**`; missing `src/lib/leads` tests
- **Impact:** Launch regressions likely in forms, sitemap, and Tier 2 pages.
- **Exact recommended fix:** Prioritize tests for SEO-001, FORM-002, A11Y-001, MOCK-001. Add route smoke assertions for `/pricing`, `/blog`, `/trial` metadata/noindex.
- **Verification method:** Coverage inventory in CI checklist; fail if new marketing route ships without a metadata or smoke test.

---

### CONTENT-001 — Thin placeholder pages are labelled and mostly noindex where appropriate

- **Severity:** Low / Info
- **Evidence:** About/transformations use explicit placeholder copy. Privacy/terms use draft badges + `forceNoIndex`. Pricing labels mock fees and avoids countdown UX. Transformations forbid fabricated before/after numbers (content + UI).
- **Relevant file:** `src/app/(marketing)/about/page.tsx`; `pricing/page.tsx`; `privacy-policy/page.tsx`; `transformations/page.tsx`
- **Impact:** Acceptable for mock phase; thin legal pages must not become indexable drafts.
- **Exact recommended fix:** Keep `forceNoIndex` on legal until counsel-approved verified content replaces drafts.
- **Verification method:** Metadata tests assert `robots` noindex for privacy/terms.

---

### LOCAL-001 — Thane handling remains correct

- **Severity:** Info (positive)
- **Evidence:** Thane is `reference-only`, `publiclyListed: false`, excluded from index/nav/timetable public lists, but still statically generated for direct URL prototyping.
- **Relevant file:** `src/content/mock/branches.ts`; `src/app/locations/[slug]/page.tsx` (`generateStaticParams`); timetable filter against publicly listed branches
- **Impact:** No accidental public promotion of an unconfirmed branch.
- **Exact recommended fix:** Keep until owner confirms; then flip `publiclyListed` + verify fields before LocalBusiness JSON-LD.
- **Verification method:** Existing locations route tests; sitemap (once implemented) must omit Thane until listed.

---

## Severity rollup

| Severity | Count | IDs |
|---|---|---|
| Critical | 0 | — |
| High | 2 | SEO-001, SEO-002 |
| Medium | 7 | SEO-003, ARCH-001, ARCH-002, MOCK-001, FORM-002, CWV-001, TEST-001 |
| Low | 4 | SEO-004, ARCH-003, A11Y-001, PERF-001, CONTENT-001 (low/info) |
| Info / positive | 9+ | SEO-005/006, MOCK-002/003, FORM-001, A11Y-002, PERF-002, SEC-001, TYPE-001, LOCAL-001 |

## Recommended fix order

1. **SEO-001** — Populate sitemap behind `shouldNoIndex()` gate  
2. **MOCK-001** — Preview-build mock banner (ADR-002 layer 2)  
3. **FORM-002 / TEST-001** — Lead + sitemap + expanded a11y tests  
4. **ARCH-001 / PERF-001 / CWV-001** — Slim client chrome; measure budgets  
5. **SEO-002** — Programme×location pair routes when unique copy exists  
6. **SEO-003 / ARCH-002** — Docs/path normalization and loading/Suspense polish  

## Out of scope / not changed

- No application source modifications in this audit pass  
- No owner data verification  
- No live CrUX/field Web Vitals capture (lab measurement recommended next)

---

## Resolution status (2026-08-01/02 — production-readiness audit-fix pass)

Full reasoning, duplicate-finding analysis, and rejection rationale for every
row below: [DECISIONS.md ADR-013](../DECISIONS.md#adr-013). Commit:
`fix: resolve production readiness audit findings`.

| ID | Status | Resolution |
|---|---|---|
| SEO-001 | **Fixed** | `buildSitemapEntries()` now builds real entries (static routes + verified programmes/branches/trainers/blog posts) once `shouldNoIndex()` is false; `[]` short-circuit unchanged while true. New test: `tests/seo/sitemap-and-robots.test.ts`. |
| SEO-002 | **Rejected (backlog)** | Net-new route family (unique per-pair copy, new content-model fields, new route tree) — out of scope for an audit-fix pass; already tracked as Phase 2 Track H. |
| SEO-003 | **Fixed** | `/programmes` → `/programs` normalized across `tests/seo/**`, `docs/INFORMATION-ARCHITECTURE.md`, `docs/PERFORMANCE-BUDGET.md`, `docs/IMPLEMENTATION-PLAN.md`, `docs/TASKS.md`, `docs/SEO-STRATEGY.md`, `AGENTS.md`, `docs/HANDOFF-ROUTE-UI.md`. `docs/HANDOFF-ROUTES.md`'s historical narrative left intact with a short correction note (its stale homepage-404 warning is resolved). `docs/DECISIONS.md` ADR-008 and `docs/CURSOR-ARCHITECTURE-REVIEW.md` intentionally untouched (frozen historical record). |
| SEO-004 | **Fixed** | `buildOrganizationJsonLd` wired into the root layout, gated on `dataStatus === "verified"` — inert today (mock identity), correct once verified. |
| SEO-005 | **No action** | Confirmed still true; positive finding. |
| SEO-006 | **Partial** | `.env.example` now documents `NEXT_PUBLIC_SITE_URL` as a pre-launch requirement. Not hard-enforced at build time — `shouldNoIndex()` already independently gates indexing, so a wrong-host canonical on a noindex preview isn't a live leak, and hard-failing would break legitimate `ALLOW_MOCK_PUBLISH=true` preview deploys without a final domain. |
| ARCH-001 | **Fixed** | `PathAwareShell` removed. `SiteChrome` (server) now composes `SiteHeader`/`StickyCtaBar` (each independently client, self-contained `usePathname()`) and `SiteFooter` (server, no longer in the client graph) directly. |
| ARCH-002 | **Partial** | Added `loading.tsx` for `trainers/[slug]` and `blog/[slug]`. Timetable's Suspense-split was **not** done — it would risk the GET-form no-JS filtering behaviour (A11Y-002, explicitly worth preserving), and the `ƒ` dynamic marking for reading `searchParams` is correct Next.js behaviour, not a defect. |
| ARCH-003 | **Partial** | Added `src/app/(marketing)/error.tsx` (inherits `SiteChrome` from the layout above it). Not added under `programs/`/`locations/` — no specific failure mode there was identified beyond the general case the root `error.tsx` already covers. |
| MOCK-001 | **Fixed** | `MockModeIndicator` now shows whenever unverified content exists **and** (`development` **or** `ALLOW_MOCK_PUBLISH === "true"`). Extended test coverage in `MockModeIndicator.test.tsx` (4 cases). |
| MOCK-002 | **Documented** | Process note recorded in `docs/HANDOFF.md`: CI must unset `ALLOW_MOCK_PUBLISH` before asserting the negative-build-gate test. |
| MOCK-003 | **No action** | Confirmed still true; positive finding. |
| FORM-001 | **No action** | Confirmed still true; positive finding. |
| FORM-002 | **Fixed** | Added `src/lib/leads/trial-schema.test.ts` (18 cases), `src/lib/leads/adapters.test.ts` (11 cases, including `getLeadAdapter()` resolution), and `trial/actions.test.ts` / `contact/actions.test.ts` (validation-failure paths). |
| A11Y-001 | **Fixed** | `e2e/accessibility.spec.ts` expanded from `/` + 404 to also cover `/trial`, `/contact`, `/timetable`, `/programs/yoga`, `/locations/airoli`. |
| A11Y-002 | **No action** | Confirmed still true; positive finding — explicitly preserved (see ARCH-002). |
| PERF-001 | **Measured; regression found and fixed** | See [DECISIONS.md ADR-013](../DECISIONS.md#adr-013) for the full breakdown: a genuine ~71kb gzip zod-in-client-bundle regression (introduced by this pass's own VIS-002 refactor) was found and fixed on `/trial`. The pre-existing ~197–202kb shared React+Next+Motion baseline exceeding the 150kb landing budget on several routes predates this session and was not touched — see `docs/HANDOFF.md` for the flagged follow-up. |
| PERF-002 | **No action** | Confirmed still true; positive finding, out of scope (no remote media host chosen yet). |
| CWV-001 | **Addressed via ARCH-001** | Same root cause, no separate fix. `ƒ` dynamic marking on `/timetable`/`/trial`/`/contact` is correct, unchanged. |
| SEC-001 | **No action** | Confirmed still true; positive finding. |
| TYPE-001 | **No action** | Confirmed still true; positive finding (further reinforced by FORM-002's new lead-schema tests). |
| TEST-001 | **Addressed via SEO-001/FORM-002/A11Y-001/MOCK-001** | Summary item, not separately actionable — each underlying gap fixed individually above. |
| CONTENT-001 | **No action** | Confirmed still true; positive finding. |
| LOCAL-001 | **No action** | Confirmed still true; positive finding. |
