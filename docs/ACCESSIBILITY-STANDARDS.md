# Accessibility Standards

## Target

WCAG 2.2 Level AA across all routes. This is an acceptance gate, not an aspiration
— see [Acceptance gates](#acceptance-gates) below.

## Requirements

- **Skip link**: a visible-on-focus "skip to main content" link precedes the
  primary nav on every route (DECISIONS.md ADR-007, finding I4).
- **Live regions**: `/timetable` filter result counts and `/trial`/`/contact`
  form submission status announce via `aria-live="polite"` — a sighted-only
  visual update is not sufficient (finding I4).
- **Touch targets**: minimum 44×44 CSS px for all interactive elements,
  checked specifically on `/timetable` and `/contact` where dense layouts are
  most likely (finding I4, ties to the mobile guidance in
  [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md)).
- **Focus traps**: any modal/drawer (mobile nav, a trial-booking dialog if one
  is used) traps focus while open and returns focus to its trigger on close
  (finding I4).
- **Icon-only controls**: every icon-only control (e.g. a WhatsApp icon
  button) has an accessible name via `aria-label` or visually-hidden text —
  an icon alone is not a label (finding I4).
- **Keyboard**: every interactive element (nav, filters on `/timetable`, the
  `/trial` booking form, pricing plan selection) is fully operable by keyboard
  alone, in a logical tab order, with no keyboard traps.
- **Focus states**: visible, designed focus indicators on every interactive
  element (not the browser default left unstyled, and not `outline: none` without
  a replacement) — designed focus states are also a design-quality requirement
  per [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md).
- **Color contrast**: minimum 4.5:1 for body text, 3:1 for large text/UI
  components, checked against the actual accent tokens once defined — the
  base palette and each `ProgrammeAccentFamily` variant in
  [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md) must independently pass on the
  single light theme this project ships (see
  [DECISIONS.md ADR-007](./DECISIONS.md#adr-007) finding I4 — dark mode is
  explicitly out of scope for v1, so no dual-theme contrast matrix is
  required).
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
- **Video captions**: any video ever introduced (see the video policy in
  [PERFORMANCE-BUDGET.md](./PERFORMANCE-BUDGET.md)) ships with captions and a
  poster frame — non-negotiable, not deferred to a later pass.

## Acceptance gates

A route does not ship (merge to main / move out of Tier per
[INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md)) unless:

1. Automated axe-core scan reports **zero critical or serious violations**.
2. Full keyboard-only walkthrough of the route's primary flow succeeds.
3. Contrast passes on the single light theme this project ships (see
   [DECISIONS.md ADR-007](./DECISIONS.md#adr-007) finding I4).
4. Reduced-motion mode is manually verified to remove/replace all non-essential
   motion.
5. NVDA spot-check confirms `aria-live` announcements fire correctly on any
   route with filters or form submission (`/timetable`, `/trial`, `/contact`).

These gates apply per-route as each route ships, not as a single end-of-project
audit — catching accessibility regressions early is cheaper than a final sweep.

## Tooling

Automated: axe-core (CI + local). Manual: keyboard walkthrough, and a screen
reader spot-check (NVDA or VoiceOver, per the project's Windows-primary
environment, NVDA is the primary manual-test tool) on Tier 1 routes before they
ship.
