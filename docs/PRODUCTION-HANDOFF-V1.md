# V1 production handoff — Ankit’s Studio

_Last updated: 2026-08-08 — Prompt 4 visual approval + production verification._

## Summary

Studio Pulse V1 is visually approved and deployed to the existing Vercel project. Production build runs **without** `ALLOW_MOCK_PUBLISH`. Canonical origin is `https://ankits-studio.vercel.app`.

| Item | Value |
|------|--------|
| Branch | `revamp/studio-pulse-production` |
| Release tag | `studio-pulse-v1.0.0-visual-approved` |
| Release SHA | `7bc0e9c4e8606fc6b4a073b479c6eecb46a3d95c` (pre-release evidence HEAD; release commit supersedes with evidence/docs) |
| Vercel project | `anikets-projects-c8b8ce46/ankits-studio` (projectId `prj_EKgqdkrNyE7xg3xuXjH1L6z6wzNW`) |
| Production origin | https://ankits-studio.vercel.app |
| Analytics | None wired |
| Lead provider | Unset (WhatsApp-first trial/enquiry) |

## Live URLs

| | |
|--|--|
| Production | https://ankits-studio.vercel.app |
| Sitemap | https://ankits-studio.vercel.app/sitemap.xml |
| Robots | https://ankits-studio.vercel.app/robots.txt |

## Environment (Production)

| Variable | Status |
|----------|--------|
| `NODE_ENV` | `production` (Vercel) |
| `NEXT_PUBLIC_SITE_URL` | `https://ankits-studio.vercel.app` |
| `ALLOW_MOCK_PUBLISH` | **Unset** |
| `LEAD_PROVIDER_URL` | **Unset** |

When attaching a custom domain, update `NEXT_PUBLIC_SITE_URL` to that origin (no trailing slash) and redeploy.

## Indexable vs withheld

**Indexable / sitemap-eligible:** `/`, `/about`, `/programs` (+ confirmed programme detail), `/locations` (+ four branches), `/timetable`, `/pricing`, `/trial`, `/contact`, `/privacy-policy`, `/terms`

**Noindex / out of sitemap:** `/trainers`, `/transformations`, `/blog`, legacy programme notice routes, `/design-lab/*`

**Hard 404:** sample blog article fixtures (`/blog/sample-*`)

## Redirects

| From | To |
|------|-----|
| `/book-a-free-trial` | `/trial` |
| `/locations/airoli` | `/locations/airoli-sector-19` |

## Frozen prototypes (do not modify)

- `/design-lab/revamp-a`
- `/design-lab/revamp-b`
- `/design-lab/revamp-c`

## Local validation (Prompt 4)

| Check | Result |
|-------|--------|
| Lint | Pass (0 errors; pre-existing warnings only) |
| Typecheck | Pass |
| Unit tests | 253 passed |
| Smoke / a11y / sticky / secondary / motion E2E | 26 passed |
| Final QA probe (copy leak, sticky, SEO, WhatsApp, maps, samples 404) | 0 issues |
| Screenshot dimensions | 99 records, 0 width fails |
| Production build (`ALLOW_MOCK_PUBLISH` unset) | Pass |
| Local server | `http://127.0.0.1:3485` @ HEAD `7bc0e9c` |

### Performance sanity (local production)

Lighthouse CLS **0** on `/`, `/programs`, `/locations`, `/trial`. LCP audits ~3.2–3.6s on local headless (not treated as V1 blocker). Playwright navigation CLS **0**.

### Visual evidence (local)

`docs/revamp/screenshots/final-production-candidate-7bc0e9c/` + `manifest.json`

### Defect counts (local gate)

| Severity | Count |
|----------|-------|
| P0 | **0** |
| P1 | **0** |
| P2 | 2 (SSR sticky class clear; next-dev sample soft-404) |
| P3 | 1 (blog sample not-found wording polish) |

## Live verification

Filled after production deploy (Prompt 4 Phases 15–17):

| Item | Path / note |
|------|-------------|
| Live screenshots | `docs/revamp/screenshots/live-v1-visual-verification-<SHA>/` |
| Live P0 / P1 | Pending deploy |
| Local vs live | Pending deploy |

## Rollback

1. In Vercel → project `ankits-studio` → Deployments → promote the previous successful production deployment.
2. Or redeploy tag/commit known-good: `studio-pulse-core-routes-approved` (`5cbc4bf`) only if visual V1 must be rolled back before Prompt 3/4 — prefer previous production deployment instead.
3. Keep `ALLOW_MOCK_PUBLISH` unset on Production.

## Known post-V1 backlog (not launch blockers)

- Real studio photography / video
- Official direct CorelDRAW SVG logo export
- Exact pricing tables
- Exact batch schedules
- Verified trainer profiles
- Member stories with permission
- Google Reviews integration
- GBP URLs
- Final membership policy copy (cancel / refund / freeze)
- Expanded Studio Notes editorial content
- Optional SSR sticky padding without hydrate clear (P2-01)
- Soften blog sample 404 copy (P3-01)

## Operator next steps

1. Optional custom domain → set `NEXT_PUBLIC_SITE_URL` → redeploy.
2. Search Console: submit sitemap after the final domain is settled.
3. Keep `ALLOW_MOCK_PUBLISH` off Production forever for indexable V1.
