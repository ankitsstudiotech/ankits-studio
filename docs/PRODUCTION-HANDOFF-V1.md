# V1 production handoff — Ankit’s Studio

_Last updated: 2026-08-03 — Production hardening + live deploy._

## Summary

Studio Pulse V1 is live on Vercel: launch copy micro-fixes, accurate Privacy/Terms, production build without `ALLOW_MOCK_PUBLISH`, and `NEXT_PUBLIC_SITE_URL` set to the production origin.

| Item | Value |
|------|--------|
| Branch | `revamp/studio-pulse-production` |
| Git remote | **None** — add GitHub/GitLab remote for CI deploys |
| Vercel project | `anikets-projects-c8b8ce46/ankits-studio` |
| Production origin | https://ankits-studio.vercel.app |
| Analytics | None wired |
| Lead provider | Unset (WhatsApp-first trial/enquiry) |

## Live URLs

| | |
|--|--|
| Production | https://ankits-studio.vercel.app |
| Sitemap | https://ankits-studio.vercel.app/sitemap.xml |
| Robots | https://ankits-studio.vercel.app/robots.txt |
| Inspect (latest) | Vercel dashboard → project `ankits-studio` |

## Environment (Production)

| Variable | Status |
|----------|--------|
| `NODE_ENV` | `production` (Vercel) |
| `NEXT_PUBLIC_SITE_URL` | `https://ankits-studio.vercel.app` (Production) |
| `ALLOW_MOCK_PUBLISH` | **Unset** |
| `LEAD_PROVIDER_URL` | **Unset** |

When attaching a custom domain, update `NEXT_PUBLIC_SITE_URL` to that origin (no trailing slash) and redeploy.

Do not invent analytics IDs. Do not commit `.env` files with secrets.

## Indexable vs withheld

**In sitemap / indexable:** `/`, `/programs` (+ confirmed programme detail), `/locations` (+ 4 branches), `/timetable`, `/pricing`, `/about`, `/trial`, `/contact`, `/privacy-policy`, `/terms`

**Noindex / out of sitemap until ready:** trainers, transformations, sample blog, `/design-lab/*`

## Frozen prototypes (do not modify)

- `/design-lab/revamp-a`
- `/design-lab/revamp-b`
- `/design-lab/revamp-c`

## Local validation (pre-deploy)

```
npm run lint
npm run type-check
npm test
npm run build   # NEXT_PUBLIC_SITE_URL set; ALLOW_MOCK_PUBLISH unset
```

All four passed locally before deploy. Public `.next` output scanned for localhost / mock chrome / draft legal — clean when `NEXT_PUBLIC_SITE_URL` is set.

## Live smoke (2026-08-03)

- [x] Launch routes return 200
- [x] No mock/dev banner on home
- [x] No `localhost` in home HTML, robots, or sitemap
- [x] Canonical `https://ankits-studio.vercel.app`
- [x] robots: Allow `/`, Disallow `/design-lab`, Sitemap absolute production URL
- [x] Privacy + Terms: “Last updated: August 2026”; no placeholder/lorem
- [x] Pricing GST: “fee quoted by the studio”
- [x] Timetable walk-in: “Advance booking is optional…”

## Known V1 gaps (intentional)

- Exact fees and batch grids remain enquiry-based
- No photography, Google Reviews, trainers, or testimonials in V1
- Membership cancel/refund/freeze legal detail not published (awaiting counsel)
- Custom domain / DNS not attached until owner provides it
- Working tree may still have uncommitted hardening files — commit before relying on git history
- No git remote — connect repo then link Vercel for push-to-deploy

## Operator next steps

1. Optional custom domain → set `NEXT_PUBLIC_SITE_URL` → redeploy.
2. Add git remote; push `revamp/studio-pulse-production`; commit remaining hardening if not already committed.
3. Search Console: submit sitemap after the final domain is settled.
4. Keep `ALLOW_MOCK_PUBLISH` off Production forever for indexable V1.
