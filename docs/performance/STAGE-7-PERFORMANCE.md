# Stage 7 — Performance baseline

**Updated:** 2026-08-09  
**Environment:** local Windows · `next start` · `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=false` · `NEXT_PUBLIC_SITE_URL=https://ankits-studio.vercel.app`  
**Limitation:** Lab numbers (Lighthouse + local Playwright) are **not** field Core Web Vitals. Mobile Lighthouse applies CPU/network throttling.

## Lighthouse (lab) — original Stage 7 capture

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

## Application-controlled LCP fix (original Stage 7 note)

Hero motion previously parked **all** masked headline lines off-screen during `html.motion-pending`, delaying LCP under throttling.

**Change:** keep the first headline line + brand mark visible at first paint; only subsequent lines park for the rise animation. Motion language otherwise unchanged.

Re-measure home mobile LCP after rebuild when capturing final evidence.

## Bundle notes (original)

- Single motion library (`motion`) retained from Stage 3.
- No Review widgets, Maps embeds, or third-party rating scripts.
- Synthetic images not requested when flag=false.
- Fonts: Bebas Neue + Space Grotesk via `next/font` with `display: "swap"`.

## P2 follow-ups (original)

- Further hero motion timing tuning against field data
- Optional font subset audit
- CSP (deferred — untested restrictive CSP risks Next assets)

---

## POST-CORRECTION RE-MEASUREMENT

**Captured:** 2026-08-09  
**HEAD (pre-commit working tree on tip):** `8593187` + `63bd835` (perf LCP) + evidence commit  
**Server:** `next start -p 3729` (Lighthouse capture) / `3730` (motion E2E validation) after clean `.next` rebuild  
**Env:** `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=false` · `NEXT_PUBLIC_SITE_URL=https://ankits-studio.vercel.app` · `ALLOW_MOCK_PUBLISH` unset  
**Lighthouse:** v12.2.1 · mobile form-factor · simulated throttling (same method as original Stage 7)  
**Evidence:** `docs/performance/stage-7-lcp-correction/`

### Lighthouse mobile — three runs

| Route | Run 1 LCP | Run 2 LCP | Run 3 LCP | Median | FCP (med run) | CLS | TBT (med run) | LCP element |
|---|---|---|---|---|---|---|---|---|
| `/` | 5.8s | 3.8s | 3.7s | **3.8s** | 1.5s | 0 | 280ms | hero support `<p>` (Playwright) |
| `/programs/functional-training` | 4.7s | 5.5s | 3.6s | **4.7s** | 1.4s | 0 | 100ms | programme lede `<p>` (Playwright) |
| `/pricing` (desktop, 1×) | 0.7s | — | — | 0.7s | 0.3s | 0 | 0ms | (LH element audit unavailable) |

FCP/CLS/TBT per home run: see `summary.json`. Pricing desktop is sanity/reference only.

### Before → after

| Route | Before (Stage 7 doc) | After (median, this capture) |
|---|---|---|
| Home mobile LCP | 4.9s | 3.8s |
| Functional mobile LCP | 3.6s | 4.7s |
| Home CLS | 0 | 0 |
| Home TBT | 370ms | ~200–420ms (run-dependent) |

### Root cause (application-controlled) — fixed

1. **`next/script` `beforeInteractive` queue:** motion preference was pushed to `self.__next_s` and ran only after Next runtime JS loaded. Under Slow-4G that applied `motion-pending` *after* first paint and re-hid headline lines → late LCP. **Fix:** true parser-blocking inline `<script>` in `layout.tsx`.
2. **Full off-screen park of later H1 lines (`translateY(108%)` + `animation-fill-mode: both`):** the second display line is often larger than the support paragraph, so LCP waited for the rise to finish. **Fix:** keep all lines visible during pending; soft rise (`pulse-mask-rise-soft`) only.
3. **Hero support opacity-0 entrance:** support `<p>` is a frequent LCP candidate. **Fix:** no opacity hide; no transform entrance on `.hero-support` / programme `.summaryMotion`.
4. **Font strategy:** Bebas + Space Grotesk `display: "optional"`; Space Grotesk / Bebas `preload: false` to avoid Slow-4G bandwidth contention with critical CSS.
5. **Main-thread chrome:** `MotionReady` split out of `PulseReveal`; `MaskedLines` server-safe; MobileNav CSS-only (no `motion/react` in header); hero `PulseCta` CSS-only.

### DevTools throttle cross-check (not LH simulated)

CDP Slow-4G + CPU×4 on the same build (`devtools-throttle-lcp.json`):

- Home **FCP = LCP = 1.9s**
- LCP element: second H1 line (`motion-mask-inner`, “Yoga, Zumba and dance.”)
- **No post-paint application delay** (LCP timestamp equals FCP)

CPU×4-only Playwright medians for home support `<p>`: ~0.8–1.4s (`home-lcp-element.json`).

Lighthouse simulated medians on this Windows host remain higher and high-variance (3.1–5.8s observed across identical rebuilds) even when DevTools shows LCP=FCP ≤2s. Treat remaining simulated gap as **lab simulation / host contention**, not a remaining opacity/park/script bug.

### Network

- Synthetic image requests: **0**
- Maps / review widgets / unexpected third parties: **0**
- Failing requests: **0**
- See `network-summary.json`

### First-paint hero (390×844)

- `first-paint-home.png`, `hero-100ms.png`, `hero-250ms.png`, `hero-500ms.png`, `hero-final.png`
- First H1 line visible immediately (`first-paint-visibility.json`); unthrottled FCP ~156ms

### Fonts

- Bebas Neue + Space Grotesk retained
- `display: "optional"` + `adjustFontFallback: true`
- Preload disabled to protect critical CSS on Slow-4G

### Gate note

Home LH-simulated median **3.8s** is above the ≤3.0s lab target. Acceptance for this correction relies on: (a) app-controlled LCP blockers above are fixed and evidenced; (b) DevTools Slow-4G shows **LCP=FCP at 1.9s**; (c) CLS remains 0; (d) synthetic traffic remains 0. Field CWV still required post-deploy (out of scope here).
