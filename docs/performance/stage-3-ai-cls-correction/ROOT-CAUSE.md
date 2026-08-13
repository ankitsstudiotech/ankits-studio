# Stage 3 AI CLS correction — root cause

**Checkpoint:** `studio-pulse-before-cls-stability-fix` @ `66dd0be`  
**Server:** `next start` port **3006**, PID **26688**  
**Env:** `NODE_ENV=production`, `NEXT_PUBLIC_SITE_URL=https://ankits-studio.vercel.app`, `ALLOW_MOCK_PUBLISH` unset, `ANKITS_CONCEPT_PREVIEW` unset, synthetic-media flag not required.

Pre-fix CLS is recorded as **P1**. It is not “environmental noise”: Lighthouse repeatedly scores the **same 0.7095990279465371** event, and the audit names a real DOM node.

## 1. Home Lighthouse CLS — what physically moved

Lighthouse `layout-shifts` / `cls-culprits-insight` (run `perf-1786595405684.json`):

| Field | Value |
|---|---|
| Shifts found | **1** |
| Score | **0.7095990279465371** |
| Element | `body.studio-shell > div#main-content > footer.mt-auto` |
| Snippet | `<footer class="mt-auto border-t border-white/10 bg-field text-ink-inverse">` |
| Bounding rect after | top **4807**, height **901**, width **412** |

The footer is the shifted node. That means content **above** it grew after first paint, and the footer jumped from a viewport-pinned flex position to document end (~4807px).

### Flex sticky-footer mechanism (proved in DOM)

```
body.studio-shell.flex.min-h-full.flex-col
  #main-content.flex.flex-1.flex-col
    header
    div.flex.flex-1          ← grows to fill leftover viewport
    footer.mt-auto           ← pinned to the end of the flex container
```

On a Slow-4G first paint the flex column is viewport-tall before remaining layout (images, hydration, font metrics) finishes. `mt-auto` parks the footer on the **first screen**. When the page becomes thousands of pixels tall, that same footer translates to y≈4807. Impact × distance ≈ **0.71**.

Unthrottled Playwright at 390×844 after 5s: **CLS 0**. Same app, no Slow-4G first-paint race — layout completes before the observer window. That does **not** make the Lighthouse failure invalid; it explains why field-like Playwright is clean while lab CLS is 0.71.

The third Home Lighthouse run (FCP 4191 ms, CLS 0) matches this: when first paint is delayed until layout is complete, the footer never appears at the viewport bottom first.

Not the primary lab CLS source (ruled out as the 0.71 event):

- Hero image box is already reserved (`min-height: 168px`, `max-height: 200px`, client 199×390). Unsized-images audit: empty.
- Font-display audit: score 1, no swap items.
- Motion CSS uses transform/opacity for hero lines (H1 opacity 1 at 390).
- Sticky CTA body class is present on SSR (`has-sticky-cta`, padding-bottom 72px).

Hero media still has geometry debt (inline desktop `aspect-ratio: 16/9` vs mobile crop; `height: 100%` vs max-height) and must be reserved more strictly so it cannot become a second shift source.

## 2. Functional CLS

This session’s unthrottled Playwright CLS: **0**.  
This session’s Lighthouse mobile (1 run): **0**.  
Prior Prompt 3 correction run: **1.047**.

Same footer flex pattern exists on every marketing route. Functional can reproduce the Home-class footer jump under throttle when first paint wins the race. Treated as the same P1, not a separate mystery.

## 3. 20px Home width mismatch — actual overflow, not capture bug

Integrity JSON: Home `1440` PNG width **1460**, Home `1920` PNG width **1940**. Other routes at those viewports are exact **1440 / 1920**. Therefore this is **page overflow**, not a ±20 Playwright scrollbar artefact.

Playwright overflow audit (Home):

| width | overflowPx | top offender |
|---|---|---|
| 360–768 | 0 | — |
| 1024 | **20** | `div.pulse-home-module__…__heroMedia` |
| 1280 | **20** | same |
| 1440 | **20** | same |
| 1920 | **20** | same |

`--spacing-gutter` is `1.25rem` = **20px**. Desktop hero CSS:

```css
.heroMedia {
  margin-right: calc(-1 * var(--spacing-gutter, 0px));
  width: calc(100% + var(--spacing-gutter, 0px));
}
```

The hero **section has no horizontal padding**. Copy already applies gutter. The negative margin + extra width bleeds the media column 20px past `clientWidth`. Full-bleed to the viewport edge is already achieved by the grid column; the extra gutter math is leftover and wrong.

## 4. TBT / long tasks (Home mobile Lighthouse)

Top attributed long tasks (first Home run):

| duration | url |
|---|---|
| 945 ms | document (`http://localhost:3006/`) |
| 520 ms | `/_next/static/chunks/1upe53-127sm4.js` |
| 463 ms | document |
| 377 ms | `1upe53-127sm4.js` |
| 142 ms | document |

Bootup: `1upe53-127sm4.js` **1424 ms scripting**. `25h0fewzl2kbn.js` is the Motion library (`transformPerspective` / `x` / `y`). Homepage hydrates **eight** `ProgrammeRow` `motion.a` islands plus `SectionReveal` / `GroupReveal` / `MediaReveal` immediately.

LCP element: hero `img.frameMedia` (not H1). LCP render delay **49%** (~1735 ms) — image decode/paint gated behind client media reveal hydration.

H1 remains opacity 1 / visible (Stage 7 preserved).

## 5. After-fix lab results (port 3008)

Home mobile Lighthouse ×5 (not cherry-picked):

| run | FCP | LCP | CLS | TBT |
|---|---|---|---|---|
| 1 | 2161 | 2827 | **0.710** | 1100 |
| 2 | 2170 | 2603 | 0 | 536 |
| 3 | 7705 | 7754 | 0 | 289 |
| 4 | 2218 | 2768 | 0 | 770 |
| 5 | 2277 | 2776 | 0 | 826 |
| **median** | **2218** | **2776** | **0** | **770** |

Functional mobile ×3: CLS **0 / 0 / 0**, median **0**.

Playwright 390×844 5s: Home **0**, Functional **0**.

One Home lab run still reports the same footer node at 0.710 when first paint wins a Slow-4G race. Median meets ≤0.05. Remaining lab flake is font optional-swap vs first paint, not a second geometry bug.

TBT median 770 ms (was 1400). Preferred ≤500 not reached without removing remaining chrome hydration (`SiteHeader`, `StickyCtaBar`, homepage `SectionReveal`). Motion library bootup dropped off the Home graph after `ProgrammeRow` stopped importing `motion/react`.

## 6. Remaining 0.710 after the first fix — still the footer, not fonts

The first structural pass removed `footer.mt-auto` and `html h-full`. Home Lighthouse ×5 then returned **0.710 / 0 / 0 / 0 / 0**. Median 0 hid a still-reproducible race.

Failing run `after-perf-1786597457330.json`:

| Field | Value |
|---|---|
| Score | **0.7095990279465371** (identical to the original event) |
| Element | `body.studio-shell > div#main-content > footer.border-t` |
| Snippet | `<footer class="border-t border-white/10 bg-field text-ink-inverse">` |
| After rect | top **4708**, height **901**, width **412** |
| previousRect / startTime | not emitted by Lighthouse 12.8.2 |
| Distance fraction | **1** (after-top is many viewport-heights below the 412×823 lab viewport) |
| Impact fraction | **0.71** (footer occupied most of the first viewport before the jump) |

This is the same footer node. It is not font optional-swap: the audit names `footer.border-t`, and the prerendered HTML proves a shell/payload split.

Prerendered `.next/server/app/index.html` **before** the final fix:

1. Layout shell: `header` → loading skeleton (`skelBar`) → **`footer`**
2. Hidden flight payload later: `<div hidden id="S:0"><main>…homepage…`

First paint under Slow-4G showed header + short skeleton + footer in the first viewport. When `S:0` replaced the hole, the footer jumped to y≈4708.

## 7. Final structural change

Footer left the layout shell. `SiteChrome` now renders header + page children + sticky CTA only. Each page wraps content in `PageWithFooter`, so the footer is part of the `S:0` page payload and follows `</main>` in the HTML.

Also removed leftover sticky-footer flex: `body` is no longer `flex min-h-dvh flex-col`; `#main-content` is a block; `.pulse-page` / loading `.page` no longer `flex: 1`.

After-HTML order: `header` → skeleton hole → `<div hidden id="S:0"><main>…</main><footer>`.

## 8. Stress-run result (port 3010)

Home Lighthouse mobile ×8 CLS: **0 / 0 / 0 / 0 / 0 / 0 / 0 / 0** (8/8 ≤ 0.05).

Functional Lighthouse mobile ×4 CLS: **0 / 0 / 0 / 0** (4/4 ≤ 0.05).

Throttled Playwright (Slow-4G + CPU 4×, 390×844, 5s): Home **0**, Functional **0**.

Home footer geometry under throttle: `footer.top = 4806` at first H1, 500 ms, 1000 ms, and final — already below the 844px viewport. H1 opacity 1.

TBT is unchanged-class P2 (Home lab still hundreds–thousands of ms). Not treated in this pass.

