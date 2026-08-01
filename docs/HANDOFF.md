# Handoff

_Last updated: 2026-08-01 — Initial marketing website routes completed._

## Current state

The marketing site now covers the remaining Tier 1–3 destinations plus about
and legal draft pages. Shared chrome (`SiteChrome`) wraps the homepage,
programme/location trees, and new marketing routes.

### Routes shipped this pass

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

### Verification (this pass)

```
npm run lint
npm run type-check
npm run test
npx vitest run --config tests/seo/vitest.config.ts
npx vitest run --config tests/routes/vitest.config.ts
ALLOW_MOCK_PUBLISH=true npm run build
```

### Still open

- Track F: full ADR-002 layer-2 banner on preview builds
- CONTENT-MODEL.md / DECISIONS.md sync for earlier schema extensions
- Owner data verification (Phase 4)
- Wire a real lead provider before production form delivery

## How to resume

Read this file, then [TASKS.md](./TASKS.md). Canonical trial path is `/trial`.
Load all business data via `@/content` only.
