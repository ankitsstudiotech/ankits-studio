# Design Direction

## Brand feel

Premium · Energetic · Modern · Human · Community-driven · Strong without being a
generic bodybuilding gym.

## The core design problem

The studio spans strength training and personal training on one end and yoga,
Zumba, adult dance, and kids dance on the other. A visual system built only around
"gym" (heavy black steel, harsh red/black, aggressive slab type) alienates the
yoga/dance/kids audience. A system built only around "dance studio" (soft pastels,
airy whitespace) undersells strength credibility. The brief explicitly requires
serving both without looking visually confused.

## Resolution: one shared system, programme-level accent tokens

Do not build separate sub-brands per programme. Build one confident, premium base
system — shared type scale, shared grid, shared component library, shared motion
language — and let a single **accent token** shift per programme context
(`heroAccent` on the `Programme` type in [CONTENT-MODEL.md](./CONTENT-MODEL.md)).
The base system carries the "premium/energetic/human" identity everywhere; the
accent token carries just enough differentiation that a yoga page doesn't feel
identical to a strength page, without fragmenting the brand.

- Base palette: warm, confident neutrals (not cold corporate gray-on-white, not
  harsh black-on-black gym cliché) — an oklch-based warm charcoal/ivory pairing
  with one unifying premium accent (e.g. a deep amber/terracotta), using
  token-based CSS custom properties (design tokens as `--color-*`/`--space-*`
  variables, not hardcoded values) per the web coding-style convention this
  project follows.
- Programme accent layer: each programme maps to one of three semantic
  families defined in [CONTENT-MODEL.md](./CONTENT-MODEL.md) as
  `ProgrammeAccentFamily` (`"strength" | "calm" | "high-energy"` — see
  [DECISIONS.md ADR-012](./DECISIONS.md#adr-012)), used sparingly (hero
  gradients, active-state chips, icon tinting): strength/personal
  training/weight-loss lean toward the base warm accent at higher saturation
  (`"strength"`); yoga leans toward a calmer muted tone (`"calm"`);
  Zumba/adult-dance/kids-dance lean toward a brighter, higher-energy variant
  of the same hue family (`"high-energy"`) — three states, not seven, so it
  still reads as one brand. Content only ever names the semantic family; this
  doc (and the Phase 1 design-tokens track) owns the actual CSS token each
  family resolves to.
- Exact token values (oklch definitions, type pairing, spacing scale) are a
  Phase 1 design-system deliverable, not decided in this governance pass — see
  [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md). This doc fixes the
  *approach*, not the final hex/oklch values.
- **Theme: light only for v1.** No dark mode is built or gated on for the
  initial launch — see [DECISIONS.md ADR-007](./DECISIONS.md#adr-007)
  (finding I4). This removes a whole axis of contrast/token work that nothing
  in the brief asks for; revisit only if the owner requests it.

## Typography

Deliberate pairing, not a default font stack (per the anti-template policy this
project inherits). One expressive display face for headlines that reads as
confident/premium rather than "gym poster," paired with a highly legible text
face. Max two families. Final family selection is a Phase 1 task.

## What "not a generic bodybuilding gym" means concretely

- No stock heavy-iron/chalk-dust photography as the default hero treatment.
- No all-caps slab type as the only voice — reserve heavy weight/caps for
  strength-programme contexts specifically, not the whole site.
- Photography (once real photography exists) should represent the full
  programme range — strength, yoga, Zumba, adult and kids dance — not just
  weight-room imagery. Until then, mock imagery must be visibly placeholder
  (see [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md)), not stock photos
  presented as the studio's own.
- Community-driven tone shows up in copy and in social-proof components
  (testimonials, transformations), not just in visuals — but see
  [CONTENT-MODEL.md](./CONTENT-MODEL.md) for why those must stay clearly mock
  until verified.

## Reference input

https://schoolofmotion.com/blog/10-websites-with-great-animation-in-2026 is the
owner-supplied benchmark for animation *craft quality* — see
[MOTION-SYSTEM.md](./MOTION-SYSTEM.md) for how that translates into concrete
motion rules. It is a craft/quality bar, not a literal template to copy.

## Mobile (DECISIONS.md ADR-007, finding I10)

Breakpoint tokens and the mobile navigation pattern (e.g. priority nav +
drawer) are a named deliverable of the Phase 1 design-tokens track — not
specified here, to avoid fixing pixel values before any component exists.
See [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md) for the
corresponding `/timetable` mobile-layout deliverable (route-scaffolding
track) and [TASKS.md](./TASKS.md) for where these are tracked.

## Anti-template checklist

Every shipped surface should hit at least four of: hierarchy through scale
contrast, intentional (non-uniform) spacing rhythm, depth/layering, typography
with real character, semantic color use, designed hover/focus/active states,
grid-breaking or bento composition where it fits, texture/atmosphere where it
fits, motion that clarifies flow, and treating data viz (timetable grid, pricing
comparison) as a real design surface, not an afterthought.
