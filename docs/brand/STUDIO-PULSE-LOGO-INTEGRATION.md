# Studio Pulse × official logo integration

**Date:** 2026-08-01  
**Scope:** Brand-asset integration assessment only. **Production tokens were not modified.**  
**Comparison surface:** `/design-lab/logo-integration` (noindex)  
**Logo usage:** `docs/brand/LOGO-USAGE-TEMPORARY.md`

Skills applied for assessment only: design-taste-frontend, impeccable, emil-design-eng — not a new art-direction exercise.

---

## Options compared

### A — Keep Studio Pulse coral action

| Token role | Value |
|---|---|
| Primary action | `#FF4D2E` (current `--color-accent`) |
| Action hover | `#FF6348` |
| Warning / mock | Amber (e.g. `#E5A100`) — must stay separate |
| Logo | Temporary white-field lockup / symbol crops |

### B — Logo-derived flat action (recommended candidate)

| Token role | Value |
|---|---|
| Primary action | `#6B2F7A` (deep purple from wordmark / gradient dark) |
| Action hover | `#9E4B7B` (logo magenta average) |
| Warning / mock | Amber `#E5A100` unchanged |
| High-energy programme accent | Keep Pulse volt `#C8FF3D` (not used as CTA fill) |
| Logo | Same temporary crops |

---

## Evaluation

| Criterion | A · Coral | B · Deep purple + magenta hover |
|---|---|---|
| Brand coherence with official logo | Weak — coral is outside purple/pink lockup | Strong — action family matches wordmark/symbol |
| CTA contrast (white label on fill) | ~3.3:1 — **fails WCAG AA normal text**; marginal for large UI | ~9.1:1 — **passes AA/AAA** for text |
| CTA on dark field (`#0C0C0E`) | Coral fill is vivid; good Pulse energy | Purple fill is quieter but readable; white text strong |
| CTA on light utility surfaces | Coral-on-white ~3.3:1 weak; needs thicker type or darker coral | Purple-on-white / white-on-purple both strong |
| Mock-warning vs action differentiation | **Risk** — coral and amber both warm; easy to conflate status with CTA | **Clear** — cool/brand purple action vs amber warning |
| Dark-surface compatibility | Excellent for Pulse nightlife energy | Good if CTAs stay solid fills; logo symbol still needs white plate |
| Light-surface compatibility | Lockup works; coral CTAs under-contrast | Lockup + purple CTAs coherent |
| Mobile header legibility (24–48 px symbol) | Symbol readable on white disc; coral CTA remains loud | Same symbol treatment; purple CTA calmer beside lockup |
| 24 / 32 / 48 / larger logo usage | Full lockup only above ~120 px wide; symbol for compact | Same asset rules — independent of accent choice |
| Pulse “tempo” personality | Preserves boutique HIIT energy from Direction B | Softens club-coral heat; still dark-field capable with volt accents |

### Contrast evidence (approximate WCAG ratios)

| Pair | Ratio | Notes |
|---|---|---|
| White on coral `#FF4D2E` | ~3.3:1 | Below 4.5:1 AA for normal text |
| White on deep purple `#6B2F7A` | ~9.1:1 | Passes |
| White on logo magenta `#9E4B7B` | ~5.6:1 | Passes AA; usable as hover/secondary |
| Amber `#E5A100` on field | ~8.8:1 | Good warning chip on dark |
| Deep purple on field (as text) | ~1.9:1 | Do **not** use purple text on near-black without lightening |

---

## Design-lab observations

On `/design-lab/logo-integration`:

1. Official symbol on dark Studio Pulse chrome reads as a **white circular tile** — correct temporary behaviour; do not chroma-key yet.
2. Side-by-side, Option A still feels more “Pulse prototype,” Option B feels more “this is Ankit’s Studio’s mark.”
3. Warning amber next to coral CTAs (Option A) recreates the critique issue of status≈action hue collision.
4. Option B keeps amber clearly non-action while allowing volt to remain a **programme/energy** accent, not the trial button.

---

## Recommendation

**Adopt Option B for the next token pass (not in this task):** primary action `#6B2F7A`, hover `#9E4B7B`, keep warning amber separate, keep volt for high-energy programme accents only.

**Why:** Owner supplied an official purple/pink lockup. Coral was a prototype energy choice, not a brand-mark colour. Option B improves brand coherence and CTA contrast, and separates mock-warning from action — while Studio Pulse can retain dark fields, Bebas rhythm, and volt lane accents without repainting the whole system coral→purple overnight.

**Do not** auto-repaint production in this migration. Wire temporary logo assets into chrome only after a dedicated token PR with contrast QA on header, sticky CTA, and light utility bands.

**Until transparent/dark masters exist:** always seat the lockup/symbol on a light plate on dark Pulse surfaces (`docs/brand/LOGO-USAGE-TEMPORARY.md`).

---

## Out of scope here

- Changing `--color-accent` in `src/styles/tokens.css`
- Redesigning the production homepage
- Inventing a monochrome or glowing logo
- Scraping or inventing brand photography
