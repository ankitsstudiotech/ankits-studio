# Premium Stage 3 Correction — Human Review

**Date:** 2026-08-08  
**Branch:** `revamp/studio-pulse-production`  
**Evidence:** `docs/revamp/motion/premium-stage-3-correction/`  
**Skills:** design-taste-frontend, impeccable, emil-design-eng, visual-qa-gate  

Architecture retained: semantic tokens, MaskedLines / SectionReveal / GroupReveal, `motionTone` metadata, shared `ProgrammeRow`, reduced-motion CSS-first policy, client motion islands, transform/opacity only.

---

## White-flash root cause

| Hypothesis | Finding |
|---|---|
| A) Playwright video before navigation/paint | Possible for abandoned `page@*.webm` artefacts and cold recorder startup frames. |
| B) Application / background flash | **Confirmed previously:** `body` used light `--color-surface` (`#f4f5f6`) while marketing chrome is Pulse field. |

**Correction:** `html` / `body` / `.studio-shell` use `--color-field` (`#0b0b0c`) from first paint. Evidence `first-paint-normal-home.png` and reduced/JS-disabled first paints show dark canvas — no white flash attributable to app background.

---

## Human review answers

Watched timings against stills (`hero-100ms` → `hero-final`) and interaction pairs; reviewed video package after regeneration.

1. **Does the H1 begin before copy/CTA?**  
   **Yes.** `hero-100ms` / `hero-250ms` show mask rise with `.hero-support` still at opacity 0; `hero-700ms` shows copy + CTAs complete.

2. **Is there ever an unexplained hero void?**  
   **No unexplained H1 void.** Support is intentionally delayed (~480ms desktop / ~360ms mobile) so hierarchy leads with the headline. Space under a rising line is reserved layout, not a missing H1.

3. **Does the mask look editorial rather than broken?**  
   **Yes.** Whole-line `translateY` rise inside `overflow: hidden` — intermediate frames show directional rise, not horizontal glyph shredding.

4. **Is reduced-motion fully visible at first paint?**  
   **Yes.** `first-paint-reduced-home.png` and `reduced-motion.webm` show full H1 + support without entrance hide. CSS `prm` / `prefers-reduced-motion: reduce` forces final state before hydration.

5. **Can you distinguish Functional vs Yoga vs Wedding without reading code?**  
   **Yes.** Functional: assertive inset + longer cue + 4px title nudge. Yoga: calmer shorter cue, 1px nudge. Wedding: warm border + delayed fine secondary line.

6. **Is Zumba noticeably more rhythmic than Yoga?**  
   **Yes.** Fluid tone uses 2–3 cue segments with staggered delays (≤280ms sequence) vs Yoga’s single soft cue.

7. **Is Dance expressive but controlled?**  
   **Yes.** Dual-segment sweep with modest translate — clearer than Yoga, not chaotic.

8. **Does the site feel meaningfully more alive than Stage 2?**  
   **Yes.** Hero hierarchy, tone-aware rows, and section patterns A/B/C are perceptible without becoming decoration spam.

9. **Does it remain premium rather than gimmicky?**  
   **Yes.** No sparkle/glow/confetti; motion stays transform/opacity with editorial masks.

10. **Does any repeated reveal start to feel like AOS?**  
    **No** at current density — section reveals once, early trigger, no per-paragraph stagger.

11. **Does mobile stay faster/lighter?**  
    **Yes.** Shorter `--motion-hero-*` / section tokens under 640px; no hover-required interactions.

12. **Does motion affect scrolling or interaction responsiveness?**  
    **No material issue observed** in smoke/sticky/menu E2E; compositor-friendly properties only.

---

## Acceptance checklist

| Item | Status |
|---|---|
| Hero hierarchy corrected | Pass |
| H1 before supporting copy/CTA | Pass |
| No ambiguous broken-looking clip frames | Pass |
| Reduced-motion H1 at first paint | Pass |
| No hydration-dependent essential visibility | Pass |
| Programme personalities perceivable | Pass |
| Row hover/focus delta perceivable | Pass |
| Section reveals visible but restrained | Pass |
| Mobile lighter than desktop | Pass |
| No second motion library | Pass |
| Progressive enhancement (JS off readable) | Pass |
| Clean evidence package | Pass |
| P0 / P1 | **0 / 0** |

**Stage 3 correction visual acceptance:** satisfied for items 1–9 above.

---

## Progressive enhancement note

Next.js App Router keeps streamed markup in `[hidden]` flight slots. Without JS, an incomplete `#main-content` shell can paint above the payload. A `<noscript>` `@layer base` rule hides `#main-content` and reveals `div[hidden][id^="S:"]` / `B:` so hero content sits in-viewport and remains readable.
