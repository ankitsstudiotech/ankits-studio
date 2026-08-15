# Production Bug Batch 02 — Line grammar

Checkpoint: `studio-pulse-before-production-bug-batch-02` @ `7c31d20`.
Evidence: `docs/revamp/screenshots/production-bug-batch-02/`.

Programme identity is expressed through composition/content/media, not through
random cue colours or segment counts.

## Structural divider

| Property | Value |
|---|---|
| Colour | `--rule-structural` → `--color-border-on-field` |
| Thickness | `--rule-structural-width` (`1px`) |
| Style | solid |
| Motion | none |
| Width | full shared content grid of the component |
| Inset | same start/end as the row or band |

Do not colour structural rules per programme. Do not dash them. Do not animate them.

## Programme cue

| Property | Value |
|---|---|
| Primitive | `.programme-cue` |
| Colour | `--color-accent` (`#6b2f7a`) |
| Thickness | `--cue-thickness` (`2px`) |
| Resting width | `--cue-length` (`2.35rem`, ~38px) |
| Hover / focus | `scaleX(var(--cue-hover-scale))` (`1.9`), `transform-origin: left` |
| Duration / ease | `--cue-duration` (`200ms`) / `--ease-emphasis` |
| Reduced motion | rest `scaleX(1)` immediately |
| Semantics | decorative (`aria-hidden`); focus stays on the row |

Exactly one cue per programme row, at rest and on hover.

Removed: `cueSeg`, `cueFine`, cluster colour forks, tone-specific cue duration/scale, Yoga teal, Zumba/Dance olive segments, Wedding gold second line.

## Families

- **A. Structural divider** — long 1px neutral rule
- **B. Programme accent cue** — short solid purple
- **C. Input/form border** — utility controls; keep
- **D. Decorative motion rule** — hero `.hero-accent-motion` draw uses the same `.programme-cue` anatomy; scaleX enter only

Success/open green remains where it means OPEN. It is not a programme cue.
