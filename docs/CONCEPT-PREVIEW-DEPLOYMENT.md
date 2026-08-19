# Concept preview deployment

Separate **hosted art-direction preview** for Stage 4A synthetic media — not public production, not Stage 9.

This preview exists only so Aniket and Ankit can inspect the premium media-rich direction while owner photography is pending.

---

## Two states

| | Public production | Concept preview |
|--|--|--|
| URL | https://ankits-studio.vercel.app | https://ankits-studio-concept.vercel.app |
| Deployment host | Production alias | Preview `ankits-studio-lb1il89ay-anikets-projects-c8b8ce46.vercel.app` |
| Purpose | Public V1 text-led site | Art-direction / synthetic media inspection |
| `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA` | **absent / false** | **true** |
| `ANKITS_CONCEPT_PREVIEW` | **absent / false** | **true** |
| `NEXT_PUBLIC_SITE_URL` | `https://ankits-studio.vercel.app` | `https://ankits-studio.vercel.app` (canonical public origin) |
| `ALLOW_MOCK_PUBLISH` | unset | unset |
| `ANKITS_PRODUCTION_RELEASE` | may be used for release builds | **must not** be `true` |
| Indexing | index, follow | **noindex, nofollow** |
| Sitemap | production URLs (21 locs) | **empty `<urlset>`** |
| Canonicals | production URLs | **production URLs** (never preview origin) |
| Global chrome | none | “Concept preview · AI media” |
| Per-image labels | none (no synthetic) | “AI concept preview” retained |

---

## Access note (Vercel Deployment Protection)

Preview deployments on this project currently require **Vercel Authentication** (login wall) for anonymous browsers.

- Team members signed into the Vercel project can open https://ankits-studio-concept.vercel.app directly.
- To let Ankit view without a Vercel account: Project Settings → Deployment Protection → disable protection for **Preview** (keep Production as desired). Do **not** promote this deployment to Production.
- CLI verification used `vercel curl` (generates a protection bypass token for the project).

Production alias was **not** changed.

---

## Code gates

- `isConceptPreviewEnv()` — `ANKITS_CONCEPT_PREVIEW === "true"`
- `isConceptPreview()` — **both** concept env + synthetic media true → marker + full concept mode
- `shouldNoIndex()` — also hard-noindexes when `ANKITS_CONCEPT_PREVIEW=true` (inline env read; safe for `next.config`)
- `isSyntheticMediaEnabled()` — unchanged; renders synthetic catalogue when synthetic flag is true
- Real-only slots (`about.founder`, branch heroes, trainers, transformations, reviews, credentials) **never** accept synthetic
- `assertProductionReleaseSafe()` blocks concept + synthetic flags when `VERCEL_ENV=production` or `ANKITS_PRODUCTION_RELEASE=true`

---

## How to deploy (Preview only)

Do **not** use `vercel --prod` for concept preview. Do **not** alias to `ankits-studio.vercel.app`.

```bash
npx vercel deploy --yes \
  --build-env ANKITS_CONCEPT_PREVIEW=true \
  --build-env NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true \
  --build-env NEXT_PUBLIC_SITE_URL=https://ankits-studio.vercel.app \
  --env ANKITS_CONCEPT_PREVIEW=true \
  --env NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true \
  --env NEXT_PUBLIC_SITE_URL=https://ankits-studio.vercel.app

npx vercel alias set <deployment-host> ankits-studio-concept.vercel.app
```

Never set Production project env `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true` or `ANKITS_CONCEPT_PREVIEW=true`.

---

## How to disable / remove later

1. Remove alias `ankits-studio-concept.vercel.app` and/or delete the Preview deployment in Vercel.
2. Leave Production env unchanged (`synthetic` absent/false, no concept flag).
3. When real media lands (Stage 4B-style content swap), retire this preview; public V1 stays text-led until then.

---

## Live deployment record

| Item | Value |
|------|--------|
| Public production | https://ankits-studio.vercel.app |
| Public release tag | `studio-pulse-v1.1.0-premium-public` (@ `50a4855`) |
| Concept preview URL | https://ankits-studio-concept.vercel.app |
| Concept deployment id | `dpl_63wUQkZSyTaQWoercBBBK9svsQXA` |
| Concept deployment host | https://ankits-studio-lb1il89ay-anikets-projects-c8b8ce46.vercel.app |
| Deployed at | 2026-08-10T06:15:43Z |
| Evidence screenshots | `docs/revamp/screenshots/concept-preview-hosted/` |

_Last updated: 2026-08-10_
