# Stage 8 — Canonical route inventory

Verified against App Router + `next.config.ts` redirects + production crawl.

## PUBLIC / INDEXABLE (when site-wide index gate open)

| Path | Notes |
|---|---|
| `/` | Home |
| `/about` | |
| `/programs` | |
| `/programs/functional-training` | Confirmed |
| `/programs/home-personal-training` | Confirmed |
| `/programs/online-training` | Confirmed |
| `/programs/zumba` | Confirmed |
| `/programs/yoga` | Confirmed |
| `/programs/adult-dance` | Confirmed |
| `/programs/wedding-choreography` | Confirmed |
| `/locations` | |
| `/locations/airoli-sector-19` | |
| `/locations/airoli-sector-8` | |
| `/locations/ghansoli` | |
| `/locations/thane` | |
| `/timetable` | Batch availability |
| `/pricing` | |
| `/trial` | |
| `/contact` | |
| `/privacy-policy` | |
| `/terms` | |

## NOINDEX / WITHHELD

| Path | Behaviour |
|---|---|
| `/trainers`, `/trainers/[slug]` | Reachable; `forceNoIndex` until publishable threshold |
| `/transformations` | Reachable; noindex until member-story threshold |
| `/blog`, `/blog/[slug]` | Always noindex; non-verified posts 404 |
| `/design-lab/*` | robots disallow + page noindex |
| Legacy programmes (`strength-training`, `personal-training`, `kids-dance`, `weight-loss-fitness`) | Reachable legacy notice; `forceNoIndex`; out of sitemap |

## REDIRECTS (permanent)

| From | To |
|---|---|
| `/locations/airoli` | `/locations/airoli-sector-19` |
| `/book-a-free-trial` | `/trial` |

## 404

| Case | Expected |
|---|---|
| Invalid programme slug | Hard 404 (`dynamicParams=false`) |
| Invalid location slug | Hard 404 |
| Invalid/non-publishable trainer slug | Hard 404 |
| Sample / non-verified blog posts | Hard 404 |

## Crawl evidence

See `docs/revamp/STAGE-8-RELEASE-CRAWL.json`.
