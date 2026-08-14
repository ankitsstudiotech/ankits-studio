# Live Bugfix 02 — Studio Pulse layout rules

Checkpoint: `studio-pulse-before-live-bugfix-02-layout-system`.
These rules are the shared visual grammar for public marketing routes.
Do not reintroduce route-local max-widths, random divider lengths, or full-width pale marketing slabs.

## Container width

- Viewport backgrounds may full-bleed (`FIELD`, elevated charcoal, plum).
- Content sits in `--layout-content` (`--width-container-wide` = `80rem`), gutters `--spacing-gutter` (`1.25rem`), centered with `margin-inline: auto`.
- Shared primitive: `.pulse-wrap` and `Container` (default, not `narrow`).
- Do not add a new per-route max-width (`64rem` / `72rem` / `80rem` forks).
- `.pulse-band` is full-bleed (padding + structural top rule). Inner content uses `.pulse-wrap` / `--layout-content`.

## Desktop grid

At `>= 1200px`, major editorial rows use an implicit 12-column track inside `--layout-content`:

- Primary copy: `8fr` (title + description + accent cue)
- Secondary meta / actions: `4fr`, right-aligned, short measure (`~22ch`)

Below `1200px` (including 768 / 1024 tablet): stack to one column. Do not squeeze metadata beside copy.

Programme rows without meta stay one column. Do not invent filler to occupy `4fr`.

## Prose measure

- Body / ledes: `--layout-prose` (`65ch`) or existing `42–52ch` description caps.
- Legal reading: `72ch` on `/privacy-policy` and `/terms` is allowed.
- Do not stretch paragraphs to fill the 80rem container.

## Structural divider

One token for row and section rules on dark surfaces:

- Colour: `--rule-structural` (`--color-border-on-field`)
- Thickness: `--rule-structural-width` (`1px`)
- Style: **solid**
- Geometry: full width of the shared content grid. Same start and end as the row.

Do not use dashed structural dividers. Do not stop a structural rule at 45% / 70%. Do not give Functional (or any primary row) a different structural colour.

Light utility surfaces, if any remain, use the equivalent `--color-rule-on-paper` only on those islands.

Structural rules stay static. Do not animate them.

## Accent cue

Short personality line, not a divider:

- Length: `--cue-length` (`2.35rem`)
- Thickness: `--cue-thickness` (`3px`)
- Alignment: left of the copy stack, below description
- Motion: `transform: scaleX(...)` only (never `width`)
- Personality via colour, timing, and optional segments (`cueSeg` / `cueFine`)

Visitor grammar: **short coloured line = cue**. **Long hairline = structure**.

Reduced motion: cues render at their rest `scaleX(1)` immediately.

## Dark surface hierarchy

Public marketing / editorial routes are dark-first:

| Token | Use |
|---|---|
| `--color-field` (`#0b0b0c`) | Base canvas |
| `--color-field-raised` (`#141416`) | Elevated chapter (Branches) |
| `--color-field-plum` (`#161218`) | Adjacent chapter (Reviews on Google) |
| Accent / conversion band | Restrained purple mix already in `.pulse-accent-band` |

Do not ship a full-width near-white marketing band between dark chapters.

## Allowed light utility surfaces

KEEP light / white **controls** and small readability islands:

- Trial, pricing builder, batch availability, contact builder **inputs**
- `.pulse-form-panel` stays dark chrome; native inputs may stay light for contrast
- Legal body text on dark field (not inverted to paper)
- `--color-paper` / `.pulse-paper` reserved for utility islands, not homepage chapters

Class name `paperBand` on Branches / Reviews is historical. Its CSS is elevated dark, not paper.
