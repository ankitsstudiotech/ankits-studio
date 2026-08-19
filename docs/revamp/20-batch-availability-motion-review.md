# 20 — Batch availability motion review

**Date:** 2026-08-02  
**Skill:** emil-design-eng  
**Route:** `/timetable`  
**Dials:** variance ~4 · motion ~2 · density ~4 (utility Operate)

---

## Inventory

| Interaction | Purpose | Motion | Duration | Reduced motion | Retain/Delete |
|---|---|---|---|---|---|
| Service select change | Swap home/online/in-studio fields | Instant DOM swap via `startTransition` — no fade | 0 | Same | **Retain** |
| Branch field show/hide | Only for in-studio | Instant mount/unmount — no height animation | 0 | Same | **Retain** |
| Locality field for Home PT | Collect area without inventing coverage | Instant | 0 | Same | **Retain** |
| Soft branch hint | Prompt without blocking WhatsApp | Instant status text | 0 | Same | **Retain** |
| WhatsApp CTA | Open chat | No required press animation; static link | 0 | Complete | **Retain** |
| Equalizer / pulse meters | Decorative energy | — | — | — | **Delete** (never added) |
| Calendar grid transitions | Fake schedule theatre | — | — | — | **Delete** |
| Repeated fade-up sections | Entrance noise | — | — | — | **Delete** |
| `transition: all` on controls | Sluggish inputs | — | — | — | **Delete** |
| Focus steal on service change | Would move caret unexpectedly | Focus stays on service select | — | — | **Retain** (no focus move) |

---

## Rules check

- No `transition: all`
- No bouncing controls
- No delayed input feedback
- Essential fields never require animation to appear
- No layout animation that shifts the active control
- Reduced motion: page remains fully usable (static)
