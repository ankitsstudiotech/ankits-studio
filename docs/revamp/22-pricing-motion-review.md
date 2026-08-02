# 22 — Pricing motion review

**Date:** 2026-08-02  
**Skill:** emil-design-eng  
**Route:** `/pricing`  
**Dials:** variance ~4 · motion ~2 · density ~4

---

## Inventory

| Interaction | Purpose | Motion | Duration | Reduced motion | Retain/Delete |
|---|---|---|---|---|---|
| Service selection | Switch physical / home / online / wedding fields | Instant DOM via `startTransition` | 0 | Same | **Retain** |
| Branch / locality swap | Mode-appropriate fields | Instant mount/unmount | 0 | Same | **Retain** |
| Wedding detail fields | Optional event context | Instant | 0 | Same | **Retain** |
| Soft branch hint | Prompt without blocking WhatsApp | Instant status text | 0 | Same | **Retain** |
| WhatsApp CTA | Open fee enquiry | Static link | 0 | Complete | **Retain** |
| Animated price counters | Fake commercial theatre | — | — | — | **Delete** |
| SaaS tier card hover springs | Plan comparison chrome | — | — | — | **Delete** |
| `transition: all` on inputs | Sluggish forms | — | — | — | **Delete** |
| Fade-up section entrances | Repeated noise | — | — | — | **Delete** |
| Countdown / savings animations | Fake urgency | — | — | — | **Delete** |

---

## Rules check

- No `transition: all`
- No animated currency
- No springy form controls
- Essential fields never require animation
- Focus stays on the service control when mode changes
- Reduced motion: fully usable
