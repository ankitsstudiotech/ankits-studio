# V1 production handoff — Ankit’s Studio

_Last updated: 2026-08-08 — Prompt 4 visual approval + live production verification._

## Summary

Studio Pulse V1 is visually approved and live on the existing Vercel project. Production builds run **without** `ALLOW_MOCK_PUBLISH`. Canonical origin is `https://ankits-studio.vercel.app`.

| Item | Value |
|------|--------|
| Branch | `revamp/studio-pulse-production` |
| Release tag | `studio-pulse-v1.0.0-visual-approved` |
| Release SHA | `010e2170c6f94ba2b6d637ef31b738aa694122fe` |
| Prior evidence HEAD | `7bc0e9c` (final local candidate screenshots) |
| Vercel project | `anikets-projects-c8b8ce46/ankits-studio` (`prj_EKgqdkrNyE7xg3xuXjH1L6z6wzNW`) |
| Production deploy | `dpl_9TpEXUBLxntEL4xRMUR5ytipqTGb` (READY) |
| Deploy timestamp | 2026-08-08T05:50:37Z |
| Production origin | https://ankits-studio.vercel.app |
| Analytics | None wired |
| Lead provider | Unset (WhatsApp-first trial/enquiry) |

## Live URLs

| | |
|--|--|
| Production | https://ankits-studio.vercel.app |
| Sitemap | https://ankits-studio.vercel.app/sitemap.xml |
| Robots | https://ankits-studio.vercel.app/robots.txt |
| Inspect | https://vercel.com/anikets-projects-c8b8ce46/ankits-studio/9TpEXUBLxntEL4xRMUR5ytipqTGb |

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

**Hard 404:** sample blog fixtures (`/blog/sample-*`)

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
| Unit tests | 253+ (incl. not-found robots) |
| Smoke / a11y / sticky / secondary / motion E2E | 26 passed |
| Final QA probe | 0 issues |
| Screenshot dimensions | 99 local records, 0 width fails |
| Production build (`ALLOW_MOCK_PUBLISH` unset) | Pass |
| Local server | `http://127.0.0.1:3485` |

### Performance sanity (local)

CLS **0** on `/`, `/programs`, `/locations`, `/trial` (Lighthouse audits + Playwright). LCP headless ~3.2–3.6s local — not a V1 blocker.

### Visual evidence (local)

`docs/revamp/screenshots/final-production-candidate-7bc0e9c/`

### Defect counts (local → release)

| Severity | Count |
|----------|-------|
| P0 | **0** |
| P1 | **0** (P4-01 404 conflicting robots fixed in `010e217`) |
| P2 | 3 |
| P3 | 1 |

## Live verification

| Item | Result |
|------|--------|
| Live screenshots | `docs/revamp/screenshots/live-v1-visual-verification-010e217/` (50 PNGs @ 390/1440) |
| Local vs live compare | **0 fails** (width + height match on representative set) |
| Live P0 / P1 | **0 / 0** |
| Sample blog articles | Hard 404 |
| Trainers / blog / transformations | noindex,nofollow; out of sitemap |
| Canonicals | `https://ankits-studio.vercel.app…` (no localhost) |
| WhatsApp / tel / mailto | `919372402074` / `tel:+919372402074` / `mailto:ankitsstudio5@gmail.com` |
| Sticky CTA | Present on primary journeys; absent on secondary/legal/404 |

## Rollback

1. Vercel → `ankits-studio` → Deployments → promote previous successful production deployment.
2. Prefer previous production deployment over older tags unless specifically rolling back Prompt 4.
3. Keep `ALLOW_MOCK_PUBLISH` unset on Production.

## Known post-V1 backlog (not launch blockers)

- Real studio photography / video
- Official CorelDRAW SVG logo export
- Exact pricing tables
- Exact batch schedules
- Verified trainer profiles
- Member stories with permission
- Google Reviews integration
- GBP URLs
- Final membership policy copy
- Expanded Studio Notes editorial
- P2-01 SSR sticky class clear after hydrate
- P2-02 next-dev sample soft-404 vs production hard-404
- P2-03 Dual redundant `noindex` tags on 404 (Next auto + explicit; no `index,follow` conflict)
- P3-01 Soften blog sample not-found copy

## Operator next steps

1. Optional custom domain → set `NEXT_PUBLIC_SITE_URL` → redeploy.
2. Search Console: submit sitemap after the final domain is settled.
3. Keep `ALLOW_MOCK_PUBLISH` off Production forever for indexable V1.
