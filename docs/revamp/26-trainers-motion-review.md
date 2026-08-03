# 26 — Trainers motion review

**Date:** 2026-08-03  
**Skill:** emil-design-eng  
**Route:** `/trainers`  
**Dials:** variance ~4 · motion ~2 · density ~4

---

## Inventory

| Component | Purpose | Trigger | Duration | Easing | Mobile | Reduced motion | Retain/Delete |
|---|---|---|---|---|---|---|---|
| Opening composition | Establish team context | Static SSR | 0 | — | Same | Same | **Retain** |
| Programme / branch links | Discovery | `:hover` colour / focus ring | CSS | — | 48px | Fully usable | **Retain** |
| WhatsApp CTA | Conversion feedback | Native press | Instant | — | 48px | Fully usable | **Retain** |
| Publishable profile list | Future portraits | Static when data exists | 0 | — | Stack | Same | **Retain** (no entrance cascade) |
| Mock trainer card grid | Fake roster | — | — | — | — | — | **Delete** |
| Profile-card entrance cascades | Compensates for empty roster | — | — | — | — | — | **Delete** |
| Animated “15+” counters | Fake credibility | — | — | — | — | — | **Delete** |
| Portrait parallax | Distracts; no real photos | — | — | — | — | — | **Delete** |
| Certification badge animation | No real certs | — | — | — | — | — | **Delete** |
| Global fade-up / ScrollReveal | Repeated noise | — | — | — | — | — | **Delete** |
| Hover-required biography | Accessibility failure | — | — | — | — | — | **Delete** |
| Continuous background / equalizer | Nightclub energy | — | — | — | — | — | **Delete** |

---

## Rules check

- No `transition: all`
- Team-size “15+” is static text
- Essential content never depends on animation
- Reduced motion: fully usable
- Motion does not compensate for absent profiles
