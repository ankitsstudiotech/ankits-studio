# 24 — About motion review

**Date:** 2026-08-02  
**Skill:** emil-design-eng  
**Route:** `/about`  
**Dials:** variance ~5 · motion ~2 · density ~4

---

## Inventory

| Component | Purpose | Trigger | Duration | Easing | Mobile | Reduced motion | Retain/Delete |
|---|---|---|---|---|---|---|---|
| Opening composition | Establish studio identity | Static SSR | 0 | — | Same | Same | **Retain** (no entrance animation) |
| Media / type split | Editorial rhythm | Layout only | 0 | — | Stack | Same | **Retain** |
| Discipline index links | Programme discovery | `:hover` / `:focus-visible` colour | CSS only | — | 48px targets | No motion required | **Retain** |
| Branch name links | Location discovery | Focus ring + underline | 0 | — | 48px | Same | **Retain** |
| WhatsApp CTA | Primary conversion feedback | Optional `:active` via native | Instant | — | 48px | Fully usable | **Retain** |
| `FounderStoryPlaceholder` + `ScrollReveal` | Former placeholder theatre | Scroll | — | — | — | — | **Delete** |
| Animated trainer / year counters | Fake credibility | — | — | — | — | — | **Delete** |
| Timeline drawing | Invented milestones | — | — | — | — | — | **Delete** |
| Global fade-up section entrances | Repeated noise | — | — | — | — | — | **Delete** |
| Parallax on long-form copy | Distracts reading | — | — | — | — | — | **Delete** |
| Equalizer / continuous background motion | Nightclub energy | — | — | — | — | — | **Delete** |
| Hover-only information | Accessibility failure | — | — | — | — | — | **Delete** |

---

## Rules check

- No `transition: all`
- No animated number counters for “15+”
- Essential content never depends on animation
- Reduced motion: fully usable (static editorial page)
- Motion does not compensate for missing photography — fallbacks are labelled plates
