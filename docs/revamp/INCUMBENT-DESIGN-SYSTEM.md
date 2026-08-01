---
name: Ankit's Studio
description: Incumbent design-system snapshot — warm ivory surfaces, deep amber accent, Syne/Figtree (not approved future direction)
colors:
  surface: "oklch(97.2% 0.012 82)"
  surface-raised: "oklch(99.4% 0.004 82)"
  surface-sunken: "oklch(94.2% 0.016 82)"
  surface-inverse: "oklch(22% 0.018 55)"
  ink: "oklch(22% 0.016 55)"
  ink-muted: "oklch(40% 0.014 55)"
  ink-subtle: "oklch(38% 0.012 55)"
  ink-inverse: "oklch(97% 0.01 82)"
  accent: "oklch(46% 0.13 48)"
  accent-hover: "oklch(40% 0.12 48)"
  accent-soft: "oklch(94% 0.04 55)"
  accent-foreground: "oklch(99% 0.005 82)"
  accent-strength: "oklch(48% 0.14 42)"
  accent-strength-soft: "oklch(94% 0.035 42)"
  accent-calm: "oklch(48% 0.06 210)"
  accent-calm-soft: "oklch(94% 0.02 210)"
  accent-high-energy: "oklch(50% 0.16 25)"
  accent-high-energy-soft: "oklch(94% 0.04 25)"
  border: "oklch(88% 0.012 82)"
  border-strong: "oklch(78% 0.016 82)"
  focus-ring: "oklch(46% 0.13 48)"
  danger: "oklch(48% 0.16 25)"
  success: "oklch(45% 0.1 145)"
typography:
  display:
    fontFamily: "Syne, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.2vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  hero:
    fontFamily: "Syne, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.35rem + 3.2vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Syne, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 1.25rem + 1.4vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Syne, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-lg:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  overline:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.875rem"
  xl: "1.25rem"
spacing:
  gutter: "clamp(1rem, 0.7rem + 1.4vw, 2rem)"
  stack: "clamp(1.25rem, 1rem + 1vw, 2rem)"
  section: "clamp(3.5rem, 2.5rem + 5vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-primary-lg:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.md}"
    padding: "0 1.5rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.accent-foreground}"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
    height: "2.75rem"
---

# Design System: Ankit's Studio

> **Status: Incumbent design-system documentation. Not approved as the future creative direction.**
>
> This file records what ships today for audit and comparison. Visual choices may be replaced after the three-prototype exploration. Do not treat this document as a mandate to preserve the current look.

**Creative North Star: "Incumbent Baseline — One Studio, Many Motions"**

This is a **documentation label for the current system**, not an approved future creative direction. The implementation attempts to unify strength, yoga, dance, and kids’ programmes under one visual system with restrained programme accents (`strength` / `calm` / `high-energy`). That intent is recorded accurately here; it is **not validated or final**.

Source of truth for tokens: `src/styles/tokens.css` (canonical OKLCH). Live scan: homepage at `http://localhost:3000` (Syne display, Figtree body, amber CTAs, warm ivory atmosphere).

---

## Documentation layers

### Observed implementation

What the codebase and rendered site actually do:

- Light warm-ivory page shell with a soft multi-stop atmosphere gradient (`--atmosphere-gradient` on `.studio-shell`)
- Display face: **Syne**; body face: **Figtree** (loaded via `next/font` in root layout)
- Single brand accent: deep amber used for primary CTAs, mock banner, overlines, and focus ring
- Three programme accent families as sparse chips / tints — not separate sub-brands
- Cards: raised white surfaces, light border, soft or lift shadow; interactive cards lift slightly on hover
- Buttons: medium radius (`0.5rem`), min height 44–48px, soft shadow on primary; secondary is bordered raised surface
- Inputs: bordered raised fields, soft shadow, accent-strength border when invalid
- Motion: short reveal translate + opacity on scroll; durations/easings in CSS vars; `prefers-reduced-motion` zeros durations
- Density: moderate section spacing; max container `72rem`; narrow reading `42rem`
- Mock/preview chrome: non-dismissable amber status banner when unverified content is shown

### Intended design rationale (as stated in project docs)

From `docs/DESIGN-DIRECTION.md` / ADR-004 / ADR-012 — intent behind the incumbent build, not proof of success:

- One shared system for strength and yoga/dance/kids so the site does not split into gym vs dance sub-brands
- Warm neutrals + one premium accent (not cold corporate gray, not harsh black/red gym)
- Programme differentiation via accent **family**, not seven competing palettes
- Restrained radii (“editorial, not pill-heavy”)
- Soft warm shadows rather than multi-layer neon glow
- Motion as client islands with content always readable without animation

### Known weaknesses

Recorded for comparison — do not “fix” these inside documentation:

- Component feel is **warm, soft and lightly elevated — currently approachable, but not yet distinctive enough**
- Atmosphere gradient and amber/ivory pairing risk reading as a familiar “AI fitness / warm SaaS” default if left unchallenged
- Homepage structure follows a long centred marketing stack (hero → programmes → why → …) that can feel template-like
- Reveal motion is a repeated fade/translate pattern rather than programme-specific storytelling motion
- Cards are the default container for many listings; easy to overuse nesting or soft chrome
- Light-only tokens are what ships; PRODUCT.md allows future light/dark/mixed exploration — this file documents **incumbent** light tokens only
- Brand positioning uniqueness is still unresolved with Ankit (`PRODUCT.md`); visuals cannot invent proof

### Decisions still open for the revamp

- Approved Creative North Star / art direction after three-prototype exploration
- Whether to keep Syne/Figtree, amber accent, ivory atmosphere, or replace them
- Light vs dark vs mixed editorial direction (no automatic theme switcher required)
- How substantial motion should be for storytelling vs. the current restrained reveal system
- Card vs non-card composition for programme/location discovery
- How strongly programme accents should speak without fragmenting the brand
- Unique visual differentiator once Ankit confirms product differentiation (if any)

---

## Overview

The incumbent system uses a **warm, approachable, lightly premium** visual language: geometric display typography (Syne), soft ivory surfaces, amber emphasis, moderate spacing, and restrained motion. It aims to hold strength credibility and dance/yoga energy in one coherent brand.

**This is the incumbent implementation being documented for audit and comparison.** It is not an approved redesign direction. Its visual choices may be replaced after the three-prototype exploration.

**Key Characteristics (observed):**

- Warm ivory / raised white surfaces with soft atmosphere wash
- Deep amber as the single primary action color
- Syne for headlines, Figtree for UI/body
- Soft single-family shadows; restrained corner radii
- Programme accents as sparse family tints, not sub-brands
- Explicit mock-data labelling chrome when unverified

---

## Colors

Warm, slightly yellow-tinted neutrals with one amber brand accent and three quieter programme family tints. Values below are the **canonical OKLCH tokens** from `src/styles/tokens.css` — descriptive names are observational, not brand poetry.

### Primary

- **Deep amber accent** (`oklch(46% 0.13 48)` / `--color-accent`): Primary buttons, header trial CTA, mock preview banner, overline emphasis, focus ring. Hover: `oklch(40% 0.12 48)`. Soft wash: `oklch(94% 0.04 55)`. Foreground on accent: near-white ivory `oklch(99% 0.005 82)`.

### Programme families (sparse accents)

- **Strength amber-red** (`oklch(48% 0.14 42)` + soft): Strength / PT / weight-loss chips and invalid-field emphasis
- **Calm muted teal** (`oklch(48% 0.06 210)` + soft): Yoga family tint
- **High-energy coral** (`oklch(50% 0.16 25)` + soft): Zumba / dance / kids family tint

### Neutral

- **Warm ivory surface** (`oklch(97.2% 0.012 82)`): Page background base
- **Raised white** (`oklch(99.4% 0.004 82)`): Cards, inputs, sticky bars
- **Sunken wash** (`oklch(94.2% 0.016 82)`): Hover ghost / recessed UI
- **Warm charcoal ink** (`oklch(22% 0.016 55)`): Primary text; muted/subtle variants for secondary copy
- **Inverse charcoal** (`oklch(22% 0.018 55)`): Inverse surfaces (token exists)
- **Warm border** (`oklch(88% 0.012 82)`), **stronger border** (`oklch(78% 0.016 82)`)

### Feedback

- **Danger / high-energy-adjacent red** (`oklch(48% 0.16 25)`): `--color-danger`
- **Success green** (`oklch(45% 0.1 145)`): `--color-success`

### Named Rules

**The One Accent Rule (incumbent).** Brand chrome and primary actions use the single `--color-accent` amber. Programme family colors are accents for labelling, not competing primaries.

**The Honesty Chrome Rule.** Mock/unverified states use the accent banner and inline disclaimers; documentation must not restyle them into “premium” chrome that hides provenance.

---

## Typography

**Display Font:** Syne (via `--font-syne` / `--font-display`)  
**Body Font:** Figtree (via `--font-figtree` / `--font-sans`)

**Character (observed):** Geometric, contemporary sans display with a readable workhorse body. Confident and modern; not a classic serif editorial pairing despite the “premium” intent language in governance docs.

### Hierarchy

- **Display** (600, `clamp(2.75rem … 4.75rem)`, lh 0.98, tracking −0.03em): Largest marketing headlines
- **Hero** (600, `clamp(2.25rem … 3.75rem)`, lh 1.02): Primary page heroes
- **Title** (600, `clamp(1.625rem … 2.25rem)`, lh 1.15): Section titles
- **Heading** (600, `clamp(1.25rem … 1.5rem)`, lh 1.25): Card / subsection headings
- **Body lg** (400, 1.125rem, lh 1.65): Lead paragraphs
- **Body** (400, 1rem, lh 1.6): Default copy
- **Caption** (400, 0.875rem, lh 1.45): Hints, disclaimers
- **Overline** (600, 0.75rem, lh 1.3, tracking 0.08em, uppercase in components): Section eyebrows

### Named Rules

**The Two-Family Rule (incumbent).** Only Syne + Figtree are wired. Do not add a third family in small polish passes without an explicit revamp decision.

---

## Layout

- Max width: `--width-container: 72rem`; narrow: `42rem`
- Horizontal gutter: `--spacing-gutter` (clamp ~1–2rem)
- Vertical section rhythm: `--spacing-section` (clamp ~3.5–7rem); stack gaps: `--spacing-stack`
- Header height token: `4.25rem`; sticky mobile CTA height: `4.5rem` with shell bottom padding on small screens
- Breakpoint references documented in tokens: 640 / 768 / 1024 / 1280 (Tailwind defaults)
- Homepage observed pattern: long vertical marketing stack with centred brand-forward hero — functional for discovery, not yet a distinctive compositional signature

---

## Elevation & Depth

Hybrid of **tonal layering** (surface / raised / sunken) and **soft warm shadows**. Shadows are ambient and light — not structural multi-layer glow.

### Shadow Vocabulary

- **Soft** (`--shadow-soft`): `0 1px 0 oklch(22% 0.016 55 / 0.04), 0 12px 32px oklch(22% 0.016 55 / 0.06)` — default card rest, primary button, inputs
- **Lift** (`--shadow-lift`): `0 1px 0 oklch(22% 0.016 55 / 0.05), 0 18px 40px oklch(22% 0.016 55 / 0.1)` — interactive card hover

Atmosphere depth also comes from `--atmosphere-gradient` (warm radial washes + soft vertical ivory gradient) on `.studio-shell`.

### Named Rules

**The Soft-By-Default Rule (incumbent).** Surfaces stay mostly flat; soft/lift shadows appear on chrome (cards, buttons, inputs) and intensify slightly on interactive hover — not as decorative glow blobs.

---

## Shapes

- Radii: `sm 0.25rem` · `md 0.5rem` (buttons, inputs, focus-adjacent controls) · `lg 0.875rem` (cards) · `xl 1.25rem`
- Borders: 1px `border` / `border-strong` on secondary buttons, cards, fields
- Comment in tokens: “restrained, editorial (not pill-heavy)” — observed practice mostly matches; avoid inventing fuller pill languages in polish without revamp approval
- Focus: 2px solid `--color-focus-ring` with 2–3px offset (utility + component classes)

---

## Components

Feel (user-confirmed wording for this documentation pass): **“Warm, soft and lightly elevated — currently approachable, but not yet distinctive enough.”** Descriptions below are as implemented.

### Buttons (`src/components/ui/Button.tsx`)

- **Shape:** `rounded-md` (0.5rem); min-height 44px (`md`) / 48px (`lg`); horizontal padding 1.25rem / 1.5rem
- **Primary:** `bg-accent` / `text-accent-foreground` + `--shadow-soft`; hover `bg-accent-hover`; active scale 0.98 (disabled under reduced motion)
- **Secondary:** raised surface, ink text, border; hover stronger border + surface
- **Ghost:** transparent; hover sunken wash
- **Inverse:** raised surface on inverse contexts
- **Focus:** `outline-2` / `outline-offset-3` / `outline-focus-ring`
- **Touch:** `.touch-target` enforces 44×44 minimum

### Cards (`src/components/ui/Card.tsx`)

- **Corner:** `rounded-lg` (0.875rem)
- **Background:** `surface-raised` + `border-border`
- **Padding:** `p-5` / `sm:p-6`
- **Static:** `--shadow-soft`
- **Interactive / linked:** hover −0.5 translateY, stronger border, `--shadow-lift`

### Inputs / Fields (`src/components/forms/Field.tsx`)

- **Style:** full width, min-height 44px, `rounded-md`, border, raised background, soft shadow, ink text
- **Focus:** focus-ring outline (offset 2px)
- **Error:** `aria-invalid` drives accent-strength border; error text in accent-strength
- **Label:** `text-sm font-medium text-ink`; hints in caption / ink-muted

### Navigation

- Sticky header: translucent surface (`bg-surface/90`) + `backdrop-blur-md`, bottom border
- Desktop primary links + amber “Book a Trial” CTA
- Mobile: hamburger + portalled full-height drawer (fixed to `document.body`)
- Sticky mobile CTA bar: raised/blurred bottom bar with trial CTA (hidden on `/trial`)

### Chips / Badges

- Programme accent chips and neutral badges use soft family fills / accent-soft; used for labels (audience, mock, demonstration mode) — keep purposeful; avoid decorative pill clusters

### Motion (sidecar detail)

- Durations: fast 150ms · normal 280ms · slow 480ms
- Easings: `--ease-out-expo`, `--ease-out-quart`, `--ease-standard`
- Reveal: `.motion-reveal` starts ~0.96 opacity + slight Y translate; never opacity 0
- Reduced motion: durations forced to 0 / near-0

---

## Do's and Don'ts

### Do

- **Do** treat OKLCH values in `src/styles/tokens.css` as the canonical token source for this incumbent system.
- **Do** keep primary actions on `--color-accent` and programme family colors sparse.
- **Do** preserve mock / unverified labelling and focus-visible treatments when editing UI under this baseline.
- **Do** keep primary content readable without animation (`prefers-reduced-motion` and non-zero initial opacity).
- **Do** meet 44×44 touch targets and WCAG 2.2 AA contrast against chosen surfaces.
- **Do** mark any deliberate departure from this baseline as revamp / prototype work, not silent drift.

### Don't

- **Don't** treat this DESIGN.md as the approved future creative direction.
- **Don't** invent stronger brand metaphors, unique claims, or “distinctive” polish language the incumbent has not earned.
- **Don't** use generic AI fitness-template styling.
- **Don't** use neon cyberpunk gym aesthetics.
- **Don't** use black-and-red bodybuilding cliché.
- **Don't** use beige wellness-spa minimalism as the destination look.
- **Don't** use children’s-club cartoon styling.
- **Don't** overuse excessive rounded cards or nest cards inside cards.
- **Don't** add decorative pills without purpose.
- **Don't** add glow blobs or generic decorative gradients beyond documented atmosphere tokens without an explicit revamp decision.
- **Don't** default every new page to the same centred hero + fade-up stack merely because the homepage does.
- **Don't** use bento grids only because they are fashionable.
- **Don't** use empty whitespace to imitate luxury.
- **Don't** pick typography only because it is trending in AI-generated design.
- **Don't** fabricate ratings, awards, prices, timings, trainer credentials, or transformation proof in UI chrome.
