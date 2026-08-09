# Stage 7 — Performance baseline

**Updated:** 2026-08-09  
**Environment:** local Windows · `next start` · `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=false` · `NEXT_PUBLIC_SITE_URL=https://ankits-studio.vercel.app`  
**Limitation:** Lab numbers (Lighthouse + local Playwright) are **not** field Core Web Vitals. Mobile Lighthouse applies CPU/network throttling.

## Lighthouse (lab)

| Route | Form factor | LCP | CLS | FCP | TBT |
|---|---|---|---|---|---|
| `/` | mobile | 4.9s | 0 | 1.4s | 370ms |
| `/programs/functional-training` | mobile | 3.6s | 0 | 1.1s | 130ms |
| `/pricing` | desktop | 0.9s | 0 | 0.3s | 40ms |

Category scores were not emitted by this Lighthouse CLI run (`categories: {}`); audit metrics above are authoritative for this capture.

Home mobile LCP remains elevated under Lighthouse throttling after keeping the first headline line visible at first paint (motion park no longer hides the LCP candidate). Unthrottled Playwright FCP on `/` is ~116ms. Treat 4.9s as **lab-throttled**, not confirmed field CWV. Not scored as a release P1 without an app-owned asset/request culprit.

## Playwright navigation timing (unthrottled, 390×844)

See `docs/performance/stage-7-nav-timing.json`.

| Route | FCP (ms) | Load (ms) | Transfer (approx) |
|---|---|---|---|
| `/` | ~116 | ~143 | ~14 KB |
| `/programs` | ~64 | ~62 | ~10 KB |
| Functional | ~60 | ~57 | ~12 KB |
| `/locations` | ~40 | ~38 | ~9 KB |
| `/pricing` | ~80 | ~40 | ~11 KB |
| `/trial` | ~80 | ~96 | ~16 KB |

## Application-controlled LCP fix

Hero motion previously parked **all** masked headline lines off-screen during `html.motion-pending`, delaying LCP under throttling.

**Change:** keep the first headline line + brand mark visible at first paint; only subsequent lines park for the rise animation. Motion language otherwise unchanged.

Re-measure home mobile LCP after rebuild when capturing final evidence.

## Bundle notes

- Single motion library (`motion`) retained from Stage 3.
- No Review widgets, Maps embeds, or third-party rating scripts.
- Synthetic images not requested when flag=false.
- Fonts: Bebas Neue + Space Grotesk via `next/font` with `display: "swap"`.

## P2 follow-ups

- Further hero motion timing tuning against field data
- Optional font subset audit
- CSP (deferred — untested restrictive CSP risks Next assets)
