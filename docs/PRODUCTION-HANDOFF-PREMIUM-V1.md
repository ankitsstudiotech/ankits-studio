# Production handoff — Premium Public V1

Concise operator handoff for Studio Pulse **premium public V1** (Stage 8 gate).  
For earlier V1 visual-approved history see `docs/PRODUCTION-HANDOFF-V1.md`.

_Last updated: 2026-08-09_

---

## Release identity

| Item | Value |
|------|--------|
| Release SHA | `50a485551c2e31a784217ce79ac56bc13662f396` |
| Release tag | `studio-pulse-v1.1.0-premium-public` |
| Rollback tag | `studio-pulse-before-final-stage-8` |
| Freeze HEAD (Stage 8 checkpoint) | `3267969997c9806bb872ae96bf8659b01f970b8b` |
| Branch | `revamp/studio-pulse-production` |
| Production URL | https://ankits-studio.vercel.app |
| Sitemap | https://ankits-studio.vercel.app/sitemap.xml |
| Robots | https://ankits-studio.vercel.app/robots.txt |
| Deployment id | `dpl_7pB54oeMauHyxRBYCJJFrpJoRXqi` |
| Deploy URL | https://ankits-studio-aeyyeiyef-anikets-projects-c8b8ce46.vercel.app |
| Deploy timestamp | 2026-08-09T15:53:35Z |

### Gate verdicts

| Gate | Status |
|------|--------|
| Technically production ready | **YES** |
| Public V1 ready | **YES** — text-led machine-free studio site |
| Portfolio-final ready | **NO** — awaiting real photography / founder / trainers / social proof |

---

## Production environment

| Variable | Required value |
|----------|----------------|
| `NEXT_PUBLIC_SITE_URL` | `https://ankits-studio.vercel.app` (update if custom domain) |
| `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA` | **Absent / false** |
| `ALLOW_MOCK_PUBLISH` | **Unset** |
| `ANKITS_PRODUCTION_RELEASE` | `true` for release builds (as used in Stage 8 freeze) |
| `LEAD_PROVIDER_URL` | Unset (WhatsApp-first) |
| Analytics | **None** until approved — see `docs/POST-LAUNCH-MONITORING.md` |

Never deploy with synthetic media enabled.

---

## Route inventory (summary)

Full table: `docs/revamp/STAGE-8-ROUTE-INVENTORY.md`.

**Indexable:** `/`, `/about`, `/programs` + 7 programmes, `/locations` + 4 branches, `/timetable`, `/pricing`, `/trial`, `/contact`, `/privacy-policy`, `/terms`

**Noindex / withheld:** `/trainers`, `/transformations`, `/blog`, legacy programme notices, `/design-lab/*`

**Redirects:** `/locations/airoli` → `/locations/airoli-sector-19`; `/book-a-free-trial` → `/trial`

**Hard 404:** unknown programme/location/trainer slugs (`dynamicParams=false`); non-publishable blog samples

---

## Architecture (one glance)

- **Stack:** Next.js App Router, TypeScript strict, Tailwind, Studio Pulse design tokens
- **Content:** SSR accessors; mock/provenance discipline (ADR-002); no client-fetch for SEO content
- **Design system:** One shared language — no per-programme sub-brands; four programme composition families
- **Motion:** Motion library as opt-in islands; reduced-motion paths; Stage 7 LCP-safe first headline line
- **Conversion:** WhatsApp / tel / mailto primary; trial + contact forms; lead adapter fail-closed if unconfigured
- **SEO:** Conservative JSON-LD (no Review/AggregateRating/Offer fabrication); sitemap matches indexing intent

---

## Media states

| State | Flag | Use |
|-------|------|-----|
| Public production | `synthetic=false` | Text-led + media fallbacks only |
| Local art-direction concept | `synthetic=true` | Labelled AI concept preview — **never public** |
| Future real media | Owner assets into existing slots | Stage 4B-style swap; not a redesign |

Owner asset list: `docs/OWNER-INPUT-BACKLOG.md`.

---

## Rollback

1. Prefer Vercel → previous successful production deployment.
2. Or reset to tag `studio-pulse-before-final-stage-8` (`3267969…`) and redeploy if Stage 8 changes must be abandoned.
3. Keep Production env: no `ALLOW_MOCK_PUBLISH`, no synthetic media.

---

## Known P2 / P3 (not launch blockers)

From `docs/revamp/STAGE-8-FINAL-DEFECT-LEDGER.md` and prior Stage 7:

| ID | Severity | Note |
|----|----------|------|
| S8-04 | P3 | A11y-tree “Functional Training .” spacing quirk; source template OK — no code change |
| S8-05 | P3 | Empty desktop media field with synthetic off — accepted text-led production truth |
| S8-06 | P3 | Header CTA + in-page WhatsApp both above fold — intentional conversion redundancy |
| CSP | P2 (prior) | Restrictive CSP deferred — untested headers risk Next assets (`docs/performance/STAGE-7-PERFORMANCE.md`) |
| Field LCP | P2 (prior) | Lab mobile LCP throttled-elevated; confirm with field CWV before further perf surgery |
| Brand master | Backlog | Official CDR → SVG logo still owner-dependent |
| Legal | Backlog | Privacy / Terms counsel pass |

S8-01 (hard 404) and S8-02 (mobile H1 clip) were P1 and fixed for gate acceptance.

---

## Related docs

| Doc | Role |
|-----|------|
| `docs/revamp/STAGE-8-RELEASE-FREEZE.md` | Freeze snapshot |
| `docs/revamp/STAGE-8-FINAL-DEFECT-LEDGER.md` | Defect ledger |
| `docs/revamp/STAGE-8-AI-SLOP-REVIEW.md` | Craft / anti-slop answers |
| `docs/revamp/STAGE-8-PORTFOLIO-REVIEW.md` | Portfolio scores + YES/NO gates |
| `docs/OWNER-INPUT-BACKLOG.md` | Owner-only remaining inputs |
| `docs/POST-LAUNCH-MONITORING.md` | Field / Search Console / ops |

---

## Operator checklist after deploy

1. Live smoke: home, About, programmes sample, all 4 branches, pricing, timetable, trial, contact, legal, robots, sitemap
2. Confirm no synthetic labels, no mock banner, WhatsApp/tel/email/Maps live
3. Fill `HEAD_PENDING`, deployment id, timestamp; create tag `studio-pulse-v1.1.0-premium-public` only after live acceptance
4. Search Console sitemap when domain settled
5. Do not claim portfolio-final until real media lands
