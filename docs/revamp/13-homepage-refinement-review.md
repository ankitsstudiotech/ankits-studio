# Homepage refinement review — Studio Pulse (P2/P3 + media readiness)

**Date:** 2026-08-02  
**Scope:** Narrow refinement on approved homepage structure — no art-direction reopen, no new sections, frozen A/B/C untouched.  
**Baseline critique:** `2026-08-02T04-35-21Z` (25/32). P1 atmosphere (real photography) deferred to owner media intake.

Skills applied: `design-taste-frontend`, `impeccable`, `emil-design-eng`.

---

## Motion / interaction review (changed surfaces only)

| Finding | Change | Why | Mobile result | Reduced-motion result |
|---|---|---|---|---|
| Sticky CTA duplicated hero WhatsApp | IntersectionObserver reveals sticky only after `#home-hero-primary-cta` leaves view; hides when `#trial` is visible | Emil: motion/state for current action only; remove chrome noise | Less first-viewport CTA stack; shell padding reserved → no CLS | Same reveal logic; CSS `motion-reduce:transition-none` on show/hide |
| Desktop-only beat bars | Keep selective Zumba/Dance beats on desktop; add compact `.laneCue` accents on mobile | Tempo readable without EQ gadgets on narrow screens | Cues via type, padding, cue bars | Beats static widths if shown; cues are CSS (no JS motion) |
| Lane hover translate | Retained on pointer devices only | Optional hierarchy; links work without hover | No hover dependency | `useReducedMotion` disables hover/tap scale |
| CTA tap spring | Retained on `PulseCta` | Confirms press without delaying navigation | Same | No scale |
| Decorative section reveals | None added | Photos missing — do not animate to fake atmosphere | n/a | n/a |
| Hero brand lockup + sticky on ~390 | Hide hero brand lockup &lt;768; concise mock banner on mobile | Reduce chrome tax; header keeps brand | More room for H1 + WhatsApp | n/a |

### Motion removed / avoided
- Equalizer restoration on mobile  
- HIT/HOLD/GROOVE labels  
- Extra entrance animations to “fill” empty media  
- Sticky always-on competing with hero CTA  

### Motion retained
- Selective desktop beat scaleX (Zumba/Dance)  
- CTA / lane press feedback (gated)  

---

## Service grouping

| Cluster | Services | Emphasis |
|---|---|---|
| **Train** | Functional Training, Home Personal Training, Online Training | Functional = `data-emphasis="primary"` |
| **Move** | Zumba, Yoga, Dance | Tempo CSS differentiation |
| **Celebrate** | Wedding Choreography | Warmer padding / cue |

All seven remain explicit `/programs/...` links, SSR, crawlable.

---

## Timetable honesty

- Nav label: **Batch Availability** (ADR-016)  
- Route: `/timetable` unchanged  
- Page: no invented time rows; operating window separate; WhatsApp primary  

---

## Media readiness

- Spec: `docs/media/STUDIO-MEDIA-REQUIREMENTS.md`  
- Catalogue: `src/content/media-slots.ts`  
- Plates: `data-media-slot` + `data-media-status="fallback"`  

---

## Verification checklist

- [ ] 360 / 390 / 430 / 768 / 1440 / 1920 viewports  
- [ ] Sticky does not duplicate on-screen hero/climax WhatsApp  
- [ ] Services distinguishable on mobile  
- [ ] Functional Training primary emphasis  
- [ ] No invented schedule rows  
- [ ] Mock banner remains  
- [ ] Keyboard + reduced motion  
- [ ] Lint / tsc / unit / e2e a11y / build  
