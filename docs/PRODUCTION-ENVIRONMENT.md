# Production environment contract

**Updated:** 2026-08-09 (Stage 7)

## Required for a real production release

| Variable | Required | Production value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Absolute origin, e.g. `https://ankits-studio.vercel.app` (update when custom domain ships) |
| `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA` | Must be **false / unset** | Never `"true"` on Vercel Production |
| `ALLOW_MOCK_PUBLISH` | Must be **unset / false** | Never `"true"` on Vercel Production |

## Optional / operational

| Variable | Notes |
|---|---|
| `LEAD_PROVIDER_URL` | Only if a live lead delivery provider is connected; otherwise WhatsApp remains the conversion path |
| `ANKITS_PRODUCTION_RELEASE` | Set `"true"` only to simulate the hard release gate locally (CI). Not needed on Vercel Production (`VERCEL_ENV=production` already triggers the gate) |
| `VERCEL_ENV` | Set by Vercel (`production` / `preview` / `development`) |

## Hard release gates (build-time)

Loaded from `next.config.ts`:

1. `assertMockContentSafeForBuild()` — blocks production builds with unverified launch-critical content unless `ALLOW_MOCK_PUBLISH=true` (preview only).
2. `assertProductionReleaseSafe()` — when `VERCEL_ENV=production` or `ANKITS_PRODUCTION_RELEASE=true`:
   - fails if `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true`
   - fails if `ALLOW_MOCK_PUBLISH=true`

Local synthetic preview builds remain allowed when those release markers are absent.

## Secrets

Do not commit API keys, OAuth tokens, or provider secrets. Use the host environment dashboard.
