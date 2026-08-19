# Live Bugfix 02 — Studio Pulse layout rules

Checkpoint: `studio-pulse-before-live-bugfix-02-layout-system`.
These rules are the shared visual grammar for public marketing routes.
Do not reintroduce route-local max-widths, random divider lengths, or full-width pale marketing slabs.

## Container width

- Viewport backgrounds may full-bleed (`FIELD`, elevated charcoal, plum).
- Content sits in `--layout-content` (`90rem`), gutter `--layout-gutter` (`clamp(1.25rem, 4.5vw, 4rem)`), **left-aligned** so it shares the homepage hero inset.
- Shared primitive: `.pulse-wrap`, `.pulse-band`, and `Container` (default, not `narrow`). Header/footer use `Container full`.
- Do not extra-center a second inset on top of the gutter. Do not add route-local max-width forks.
- `.pulse-band` is full-bleed (padding + structural top rule). Inner content uses `.pulse-wrap` / `--layout-content`.

## Desktop grid

At `>= 1200px`, related copy + meta use a bounded pair, not a stretched 8/4:

- Copy: `minmax(0, var(--layout-copy-max))` (`42rem`)
- Meta / actions: `minmax(var(--layout-meta-min), var(--layout-meta-max))` (`11–18rem`), `justify-self: start`
- Optional `minmax(0, 1fr)` breathing **after** the pair

Do not pin a short phrase to the far edge of a 1400px+ track.

Below `1200px` (including 768 / 1024 tablet): stack to one column.

Programme rows without meta stay one column. Do not invent filler.

Supersedes the Live Bugfix 02 `8fr + 4fr` far-edge rule. See `docs/revamp/PRODUCTION-BUG-BATCH-01-SPATIAL-AUDIT.md`.

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

One shared programme cue. Not a divider. Not programme-specific.

- Primitive: `.programme-cue`
- Colour: `--color-accent` (`#6b2f7a`) only
- Length: `--cue-length` (`2.35rem`, ~38px)
- Thickness: `--cue-thickness` (`2px`)
- Alignment: left of the copy stack, below description
- Hover/focus: `transform: scaleX(var(--cue-hover-scale))` (`1.9`) from the left
- No segments, no second line, no dashed/gradient tracks, no per-programme colour

Visitor grammar: **short purple line = cue**. **Long hairline = structure**.

Programme identity is expressed through composition, content, and media, not through cue colours or segment counts.

Reduced motion: cues render at their rest `scaleX(1)` immediately.

See `docs/revamp/PRODUCTION-BUG-BATCH-02-LINE-GRAMMAR.md`.

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
