# 18 — Location motion review

**Date:** 2026-08-02  
**Skill:** emil-design-eng  
**Scope:** `/locations`, `/locations/[slug]` Studio Pulse surfaces  
**Dials:** variance ~5 · motion ~3 · density ~4 (place-first utility, not cinematic map theatre)

---

## Decision framework applied

Location discovery is used repeatedly for scanning branches and opening WhatsApp/Maps. Frequent actions get little or no animation. Occasional CTA press feedback is allowed. Decorative map pulses, fake coordinates, and hover-only motion are rejected.

---

## Motion inventory

| Route/component | Purpose | Trigger | Duration | Easing | Mobile | Reduced motion | Retain/Delete |
|---|---|---|---|---|---|---|---|
| `LocationPulseCta` | Confirm press on WhatsApp / primary CTA | `whileTap` | Spring ~instant | Spring stiffness 500 / damping 32 | Yes | Disabled (static link) | **Retain** |
| `LocationDiscovery` place list | None — static SSR list | — | — | — | — | N/A | **Retain** (no motion) |
| Branch row hover equalizers / map pulses | Decorative geography theatre | — | — | — | — | — | **Delete** (never added) |
| Animated fake coordinates / node graph | “Branch nodes” metaphor | — | — | — | — | — | **Delete** (never added) |
| Global fade-up on every branch section | Repeated entrance noise | scroll | — | — | — | — | **Delete** (never added) |
| Parallax on address / Maps | Would delay contact actions | scroll | — | — | — | — | **Delete** |
| Legacy `LocationTeaserCard` card hover (index) | Old card grid feedback | hover | — | — | Poor without hover | — | **Removed from production index** (component unused on `/locations`) |
| Detail page section transitions | None — content-first | — | — | — | — | — | **Retain** static |
| Maps open (external) | Browser/native Maps | click | N/A | N/A | Yes | N/A | **Retain** (no custom motion) |

---

## Summary

**Retained:** single press-scale on primary WhatsApp CTA; everything else static and keyboard-complete.

**Removed / avoided:** card-grid hover theatre, map pulses, coordinate animations, scroll fade-ups, hover-required branch feedback.
