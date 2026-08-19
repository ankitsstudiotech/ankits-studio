# Programme motion review — Studio Pulse programmes

**Date:** 2026-08-02  
**Scope:** `/programs` and confirmed `/programs/[slug]` Pulse surfaces  
**Skills:** emil-design-eng (purpose, interruptible, reduced-motion)

| Route/component | Purpose | Trigger | Duration | Easing | Mobile behaviour | Reduced-motion behaviour | Retain/Delete |
|---|---|---|---|---|---|---|---|
| `ProgrammeLaneLink` hover translate | Optional hierarchy on pointer devices | `whileHover` | spring ~420/30 | spring | No hover; full link works | Disabled (`hoverX` ignored / reduce) | **Retain** (gated) |
| `ProgrammeLaneLink` tap scale | Press feedback | `whileTap` | spring | spring | Same | Disabled | **Retain** (gated) |
| `ProgrammePulseCta` tap scale | Confirms conversion press | `whileTap` | spring 500/24 | spring | Same | Disabled | **Retain** (gated) |
| Lane CSS cue bars | Tempo rhythm without EQ gadgets | static CSS | — | — | Visible | Static | **Retain** |
| Global section fade-up | — | — | — | — | — | — | **Delete** — not used on programme Pulse pages |
| Identical beat equalizers on all services | — | — | — | — | — | — | **Delete** — never added on programme index |
| HIT/HOLD/GROOVE labels | — | — | — | — | — | — | **Delete** — not used |
| Legacy notice page | Reading / honesty | none | — | — | Static | Static | **Retain** (no motion) |

### Principles applied
- Calm services (Yoga, Home, Online) have `hoverX: 0` — no artificial energy.  
- Motion never delays SSR text or WhatsApp links.  
- No layout-shifting entrances.  
- Richness from tempo CSS + cluster authorship, not animation count.
