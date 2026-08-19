# 30 — Member Stories motion review

**Date:** 2026-08-03  
**Route:** `/transformations` (Member Stories heading)  
**Skill:** emil-design-eng  
**Tempo:** Low — static readiness while no publishable stories exist

| Component | Purpose | Trigger | Duration | Easing | Mobile | Reduced motion | Retain/Delete |
|---|---|---|---|---|---|---|---|
| MemberStoriesCta `:active` scale | Press feedback | pointer down | 140ms | ease-out | Yes | Disabled (no transform) | **Retain** |
| Programme/branch link colour | Affordance | hover | 160ms | ease-out | Hover may be coarse | Instant color OK | **Retain** |
| PulseMediaPlate fallback | Atmosphere slot | static | — | — | Yes | Static | **Retain** (no autoplay) |
| TransformationStories list motion | Fake evidence theatre | — | — | — | — | — | **Delete** (unused on route) |
| Testimonial carousel | Quote rotation | — | — | — | — | — | **Delete** from this route |
| Before/after wipe / slider | Sensational comparison | — | — | — | — | — | **Never add** |
| Percentage / weight counters | Fake results | — | — | — | — | — | **Never add** |
| Scroll fade-up cascade | Compensate for empty content | — | — | — | — | — | **Delete / avoid** |
| Parallax portraits | Emotional motion | — | — | — | — | — | **Never add** |
| Quote auto-rotation | Fake social proof | — | — | — | — | — | **Never add** |
| Future story media reveal | When real evidence exists | first paint / in-view optional | ≤200ms | ease-out | Soft | Instant show | **Defer** until publishable media |

## Principle

While zero stories are publishable, motion must not invent presence. Prefer calm typography, factual hierarchy, and one primary WhatsApp CTA with restrained press feedback.
