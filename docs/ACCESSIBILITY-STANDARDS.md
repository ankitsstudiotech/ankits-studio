# Accessibility Standards

## Target

WCAG 2.2 Level AA across all routes. This is an acceptance gate, not an aspiration
— see [Acceptance gates](#acceptance-gates) below.

## Requirements

- **Keyboard**: every interactive element (nav, filters on `/timetable`, the
  `/trial` booking form, pricing plan selection) is fully operable by keyboard
  alone, in a logical tab order, with no keyboard traps.
- **Focus states**: visible, designed focus indicators on every interactive
  element (not the browser default left unstyled, and not `outline: none` without
  a replacement) — designed focus states are also a design-quality requirement
  per [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md).
- **Color contrast**: minimum 4.5:1 for body text, 3:1 for large text/UI
  components, checked against the actual accent tokens once defined (both the
  base palette and every per-programme accent variant in
  [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md) must independently pass — an
  accent that only works on a light background fails if reused on dark).
- **Reduced motion**: every animation defined in
  [MOTION-SYSTEM.md](./MOTION-SYSTEM.md) has a `prefers-reduced-motion` fallback.
- **Forms**: `/trial` booking and `/contact` forms have programmatically
  associated labels, inline error messaging tied to fields via `aria-describedby`,
  and clear success/failure states that don't rely on color alone.
- **Semantic structure**: one `<h1>` per page, logical heading order, landmark
  regions (`header`, `nav`, `main`, `footer`) — semantic HTML first, not generic
  `div` wrapper stacks.
- **Non-text content**: all meaningful images (trainer photos, transformation
  images, branch photos) have descriptive alt text; decorative motion/graphics are
  marked `aria-hidden`.
- **Data tables/grids**: the `/timetable` grid and `/pricing` comparison must be
  navigable and understandable via screen reader, not just visually (this is also
  a design-system requirement per DESIGN-DIRECTION.md's data-viz checklist item).

## Acceptance gates

A route does not ship (merge to main / move out of Tier per
[INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md)) unless:

1. Automated axe-core scan reports **zero critical or serious violations**.
2. Full keyboard-only walkthrough of the route's primary flow succeeds.
3. Both light and dark presentations (if the route supports both) independently
   pass contrast checks.
4. Reduced-motion mode is manually verified to remove/replace all non-essential
   motion.

These gates apply per-route as each route ships, not as a single end-of-project
audit — catching accessibility regressions early is cheaper than a final sweep.

## Tooling

Automated: axe-core (CI + local). Manual: keyboard walkthrough, and a screen
reader spot-check (NVDA or VoiceOver, per the project's Windows-primary
environment, NVDA is the primary manual-test tool) on Tier 1 routes before they
ship.
