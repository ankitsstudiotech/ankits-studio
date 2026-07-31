# Project Brief — Ankit's Studio

## What this is

A premium, motion-rich, local-SEO-focused marketing website for **Ankit's Studio**,
a multi-location fitness and dance studio. Next.js App Router, TypeScript strict,
Tailwind. Built in phases; see [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md).

## Programmes (confirmed by owner)

- Strength training
- Personal training
- Yoga
- Zumba
- Adult dance
- Kids dance
- Weight-loss and general fitness programmes

## Locations (confirmed or expected by owner)

- Airoli
- Ghansoli
- Thane

Thane is explicitly flagged by the owner as not yet fully defined — see
[BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md).

## Reference material supplied by the owner

- Google Maps pin: https://maps.app.goo.gl/NWrGtXKKYwr5xXwbA?g_st=ac
- Google Maps pin: https://maps.app.goo.gl/WzhJUEhAvC67eMgR8?g_st=ac
- Motion/animation benchmark: https://schoolofmotion.com/blog/10-websites-with-great-animation-in-2026

The two Maps links are treated as **location references only** (confirmation that a
branch exists at roughly that pin), not as a source for structured, publishable
address text. Address strings must still be verified with the owner before use —
see [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md).

## Non-negotiable constraints (from owner brief)

1. Most business details are **not yet verified**. Everything unverified must use
   clearly labelled mock data — never presented as real. See
   [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md).
2. No production UI is being written in this phase. This phase is governance and
   planning only.
3. No business facts may be invented and passed off as real. Mock data must always
   be plausible-but-obviously-placeholder and traceable back to its mock status.

## Design intent

Premium, energetic, modern, human, community-driven. Strong, but explicitly **not**
a generic bodybuilding-gym aesthetic. The site must serve strength, personal
training, yoga, Zumba, adult dance, and kids dance audiences from one coherent
system without feeling visually confused — see
[DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md).

## Governing documents

| Doc | Purpose |
|---|---|
| [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) | Ground truth on what's real vs. mock, and how mock data is verified |
| [CONTENT-MODEL.md](./CONTENT-MODEL.md) | Typed data model, mock-data strategy |
| [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md) | Routes, sitemap, nav, route tiering |
| [SEO-STRATEGY.md](./SEO-STRATEGY.md) | Local SEO, structured data, indexing policy |
| [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md) | Visual system, tone, palette, typography |
| [MOTION-SYSTEM.md](./MOTION-SYSTEM.md) | Motion vs. GSAP vs. WebGL rules |
| [ACCESSIBILITY-STANDARDS.md](./ACCESSIBILITY-STANDARDS.md) | WCAG target and acceptance gates |
| [PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md) | Core Web Vitals and bundle budgets |
| [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) | Phased delivery plan |
| [DECISIONS.md](./DECISIONS.md) | ADR log — the single source of truth for "why" |
| [TASKS.md](./TASKS.md) | Task board with agent ownership |
| [HANDOFF.md](./HANDOFF.md) | Current state, next steps, open questions |

CLAUDE.md and AGENTS.md at the repo root both point here and must never diverge
from this doc set.
