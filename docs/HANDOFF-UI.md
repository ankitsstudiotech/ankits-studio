# UI / Design System Handoff

_Last updated: 2026-07-31 — Track A + Track E (design + motion system)._

## What shipped

Visual and motion system under Cursor-owned paths only:

| Area | Path |
|---|---|
| Tokens + motion/base CSS | `src/styles/tokens.css`, `motion.css`, `studio.css` |
| UI primitives | `src/components/ui/**` |
| Layout chrome | `src/components/layout/**` |
| Motion islands | `src/components/motion/**` |
| Home presentation | `src/components/home/**` |
| Design lab route | `src/app/design-lab/**` (`noindex`) |
| Mock media | `public/mock-media/**` |

Review surface: **`/design-lab`**

## Design decisions recorded here

- **Type:** Syne (display) + Figtree (body), loaded in `design-lab/layout.tsx` via `next/font`.
- **Theme:** Light only (ADR-007). Warm ivory surface, deep amber accent, three programme families (`strength` / `calm` / `high-energy`).
- **Motion:** `motion` package (Motion for React). Opt-in client islands only — no root-layout import. Scroll/text reveals never start at `opacity: 0`. No GSAP, no WebGL, no custom cursor, no scroll hijacking, no autoplay video.
- **Nav:** Desktop priority links + CTA; mobile drawer with focus trap, Escape, restore focus, ≥44px targets.
- **Sticky CTA:** Mobile-only bottom bar; shell uses `.has-sticky-cta` padding clearance.
- **Fixtures:** `src/app/design-lab/fixtures.ts` only — **not** a parallel content system; does not import `src/content/mock`.

## package.json change (required)

Added dependency: **`motion`** (Motion for React). Required for Track E per `docs/MOTION-SYSTEM.md` / ADR-009. No other dependency changes.

## Intentionally not modified

- `src/content/**`, `src/lib/seo/**`, sitemap/robots/manifest
- Programme / location marketing routes
- Root `src/app/layout.tsx` and `src/app/globals.css` (shared hotspots)
- Homepage `src/app/page.tsx`

## Follow-up for Claude / shared tracks

1. Wire Syne/Figtree (or agreed finals) + `studio.css` into **root** `layout.tsx` / `globals.css` when integrating chrome site-wide.
2. Mount `SiteHeader` / `SiteFooter` / `StickyCtaBar` from Tier 1 route scaffolding (Track D), feeding nav from `getNavigationItems()` — not lab fixtures.
3. Keep Motion imports inside `src/components/motion/**` (and specific client leaves), never the root layout (ADR-009/010).

## QA checklist (design-lab)

Viewports checked in Cursor browser:

| Viewport | Overflow-X | Nav | Sticky CTA |
|---|---|---|---|
| 390×844 | none | mobile drawer | visible |
| 768×1024 | none | mobile drawer | visible |
| 1440×900 | none | desktop | hidden |
| 1920×1080 | none | desktop | hidden |

Also verified: Escape closes mobile nav + focus restore; hero H1 readable without JS motion; `prefers-reduced-motion` keeps content visible; no hydration error after TextReveal fix; card/link touch targets on programme/location cards are full-card hit areas.
