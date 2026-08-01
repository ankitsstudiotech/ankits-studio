---
name: Ankit's Studio
description: Proposed Kinetic Editorial design system — ink/paper magazine composition (selected revamp direction; not yet production-implemented)
colors:
  paper: "#F3EFE6"
  paper-shade: "#E8E2D4"
  ink: "#12110F"
  ink-muted: "#5C574C"
  rule: "#C8C0B0"
  trial: "#B42318"
  trial-foreground: "#FFFFFF"
  strength-media: "#3D3428"
  calm-media: "#3A4A42"
  energy-media: "#4A2030"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.03em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  none: "0"
  sm: "0"
spacing:
  gutter: "1.25rem"
  section: "clamp(2rem, 5vw, 4rem)"
---

# Design System: Ankit's Studio (proposed)

> **Status: Proposed design system after three-prototype selection.**  
> Winner: **Kinetic Editorial** (`/design-lab/revamp-a`).  
> Production routes still ship the incumbent system. Incumbent snapshot: `docs/revamp/INCUMBENT-DESIGN-SYSTEM.md`.  
> Rebuild plan: `docs/revamp/05-production-rebuild-plan.md`.

**Creative North Star: “Seven disciplines. One floor.”**

A neighbourhood movement magazine — strength, yoga, Zumba, and dance sharing one authored visual system — never a franchise gym template, spa brochure, kids-club flyer, or SaaS landing page.

Prototype reference: `src/app/design-lab/revamp-a/`.

---

## Overview

Kinetic Editorial replaces warm-ivory/amber card stacks with **ink-on-paper editorial composition**: asymmetric heroes, hairline rules, serif display authority, and programme discovery as a **horizontal index** (not equal cards).

**Key characteristics**

- Paper canvas + ink type; single sharp **trial** accent (not amber wash everywhere)
- Instrument Serif (display) + DM Sans (UI/body)
- Magazine masthead brand signal — brand is hero-level, not nav-only
- Hairlines and issue metadata instead of pills and soft shadows
- Art-directed mock-media plates (`data-mock-media`) until real photography lands
- Sparse motion: one hero type entrance + underline/state feedback — no scroll-reveal parade

---

## Colors

### Primary surfaces

- **Paper** `#F3EFE6` — page canvas
- **Paper shade** `#E8E2D4` — hover / recessed editorial cells
- **Ink** `#12110F` — type, rules, trial strip background
- **Ink muted** `#5C574C` — secondary copy
- **Rule** `#C8C0B0` — section dividers (lighter than ink)

### Action

- **Trial** `#B42318` — primary conversion only (book trial). Do not tint every chip amber.
- Focus ring: ink on paper (2–3px offset); on ink surfaces use paper/trial-safe contrast.

### Programme media families (media plates only — not competing brand accents)

- Strength / calm / high-energy guide **mock-media gradients**, not button chrome.
- Keep programme labelling typographic (kicker text), not pill clusters.

### Named rules

**The One Trial Accent Rule.** Only the trial conversion uses the sharp red accent. Brand chrome stays ink/paper.

**The Honesty Chrome Rule.** Mock/unverified labels remain explicit; never restyle provenance into luxury chrome.

**The No Soft Shadow Rule.** Elevation comes from rules, overlap, and crop — not ambient card shadows.

---

## Typography

**Display:** Instrument Serif (or approved equivalent editorial serif) — weight 400, large clamp sizes, tight leading.  
**UI / body:** DM Sans — 400/500/600; overlines in small caps / tracked uppercase.

### Hierarchy

- **Masthead brand:** display, ~clamp(1.75rem–2.75rem)
- **Hero:** display, ~clamp(2.6rem–5.2rem), max ~11ch on desktop
- **Section titles:** display, ~clamp(1.75rem–2.5rem)
- **Programme index names:** display ~1.65rem
- **Body / lede:** sans 1–1.05rem, muted ink, max ~36–52ch
- **Kickers:** sans 0.7rem, tracked uppercase

### Named rules

**The Two-Family Rule.** Display serif + UI sans only. Do not reintroduce Syne/Figtree as defaults.

**The Brand-First Hero Rule.** Removing the nav must not remove brand authority — masthead/type carry the studio name at hero scale.

---

## Layout

- Asymmetric split heroes (copy | crop) on desktop; **crop-over-type stack** on mobile
- Hairline full-bleed rules between bands
- Programme discovery: horizontal snap rail / index cells — **not** a 3-column card grid
- Branches: editorial columns with disclaimer footnotes
- Trial: full-bleed ink band with one CTA after place trust
- Max reading width for essays ~52ch; index cells denser

### Compatible borrows from Movement System (documented)

- `dataStatus` flags on branch modules
- Sticky mobile trial when the ink strip leaves the viewport
- Optional dense matrix on `/programs` listing only — homepage stays the rail

---

## Elevation & depth

- Flat paper; depth via **overlap**, **crop**, and **ink rules**
- No `--shadow-soft` / `--shadow-lift` as default chrome
- Media may sit flush to rules; no rounded media cards in hero

---

## Shapes

- Default radius: **0** for marketing surfaces
- Forms may use minimal radius only where affordance requires (document during rebuild)
- No decorative pills; badges only for provenance / mock honesty

---

## Motion

Source skills: `emil-design-eng`. Default library: Motion for React.

| Pattern | Purpose | Props | Timing | Reduced motion |
|---|---|---|---|---|
| Hero title enter | Establish editorial voice | opacity ≥0.95→1, slight x | ~0.55s [0.16,1,0.3,1] | Instant / no offset |
| Link underline | Affordance | background-size | ~0.22s | Instant |
| Index cell hover | Feedback | background-color | ~0.2s | Instant |
| Button press | Conversion | scale ≤0.98 | ~150ms ease-out | Opacity/brightness only |

### Forbidden by default

- Fade-up on every section
- `transition: all`
- Scroll hijacking, long loaders, custom cursors, unjustified WebGL
- Parallax as decoration
- Non-interruptible sequences
- Hiding primary content until animation completes

---

## Components (target behaviours)

### Navigation

- Masthead brand + issue line; text nav with underline grow
- Mobile: collapse masthead; keep trial reachable (sticky borrow OK)

### Programme index

- Replace `ProgrammeCard` grids on marketing surfaces with index cells / rails
- Link to existing `/programs/[slug]` routes

### Branch columns

- Name + programme linkage + mock disclaimer / verification flag
- Contact actions still via `getBranchContactLinks` (null until verified)

### Trial CTA

- Ink band + trial accent button; single primary path to `/book-a-free-trial`

### Media

- Prefer `data-mock-media` compositions until real assets exist
- Aggressive crops; labelled REPLACE for handoff

### Forms / honesty

- Preserve Field validation, demonstration mode, mock banner — restyle only

---

## Do's and Don'ts

### Do

- Lead with brand + one headline + one lede + one dominant crop in the first viewport
- Use programme stories / indexes instead of equal cards
- Keep mock provenance visible
- Keep SSR content and reduced-motion usability
- Promote prototype pieces from `revamp-a` deliberately

### Don't

- Polish the old ivory/amber card system as “good enough”
- Ship Studio Pulse equalizers / diagonal club energy as the default brand
- Ship Movement System SaaS-matrix as the homepage identity
- Invent addresses, timings, prices, ratings, trainers, awards
- Nest cards, spray soft shadows, or centre every section
- Restore ScrollReveal on every block
