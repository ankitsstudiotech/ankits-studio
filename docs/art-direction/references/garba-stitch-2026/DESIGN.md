---
name: Kinetic Editorial
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d1c2cf'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#9a8d99'
  outline-variant: '#4e434e'
  surface-tint: '#f3aeff'
  primary: '#f3aeff'
  on-primary: '#501360'
  primary-container: '#6b2f7a'
  on-primary-container: '#e59ef2'
  inverse-primary: '#834692'
  secondary: '#c6c7c2'
  on-secondary: '#2f312e'
  secondary-container: '#484a46'
  on-secondary-container: '#b8b9b4'
  tertiary: '#c8c6c5'
  on-tertiary: '#303030'
  tertiary-container: '#494848'
  on-tertiary-container: '#b9b7b6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#fcd6ff'
  primary-fixed-dim: '#f3aeff'
  on-primary-fixed: '#340042'
  on-primary-fixed-variant: '#692d78'
  secondary-fixed: '#e3e3de'
  secondary-fixed-dim: '#c6c7c2'
  on-secondary-fixed: '#1a1c19'
  on-secondary-fixed-variant: '#454744'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Bebas Neue
    fontSize: 120px
    fontWeight: '400'
    lineHeight: 100px
  display-lg:
    fontFamily: Bebas Neue
    fontSize: 80px
    fontWeight: '400'
    lineHeight: 72px
  headline-lg:
    fontFamily: Bebas Neue
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 44px
  headline-lg-mobile:
    fontFamily: Bebas Neue
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 30px
  headline-md:
    fontFamily: Bebas Neue
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 24px
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system is built on a "Kinetic Editorial" aesthetic, merging the high-impact urgency of fitness journalism with the precision of modern movement culture. It avoids the soft, rounded tropes of wellness apps in favor of a sharp, structured, and high-contrast visual language.

The personality is authoritative and community-driven. It utilizes **Minimalism** through heavy negative space and a restricted palette, but injects **High-Contrast/Bold** energy via massive scale and aggressive typographic hierarchy. The UI should feel like a premium digital portfolio—static elements are architectural, while interactive states should feel explosive and immediate.

## Colors

This design system utilizes a deep, high-contrast dark mode to create a premium, focus-oriented environment. 

- **Primary Accent (#6B2F7A):** Used sparingly for high-value actions, progress indicators, and active states. It represents the "energy" of the brand.
- **Background (#0A0A0A):** The core canvas. This near-black provides a heavy, grounded foundation that makes the cream typography and purple accents pop.
- **Text (#F5F5F0):** An off-white/cream used for all primary reading. This reduces the harshness of pure white on black while maintaining maximum legibility.
- **Borders/Surface (#262626):** A charcoal neutral used for structural separation, grid lines, and secondary UI containers.

## Typography

Typography is the primary visual driver of this design system. We use two contrasting voices:

1.  **Display (Bebas Neue):** All headlines and display elements must be in all-caps. This font is used to create an editorial, high-energy impact. Letter spacing should be tight for headlines but can be slightly tracked out for smaller sub-headers.
2.  **UI & Body (Space Grotesk):** A technical, monolinear sans-serif that brings a sense of precision and modernity to functional information. 

Large-scale display type should frequently bleed off-canvas or interact with imagery to reinforce the "movement culture" narrative.

## Layout & Spacing

The layout philosophy follows a **Fluid Editorial Grid**. It rejects standard centered containers in favor of asymmetrical balance.

- **Grid:** 12-column grid for desktop, 4-column for mobile.
- **Asymmetry:** Utilize "The Power Third"—offsetting key content to the left or right 2/3 of the screen while leaving the remaining third for oversized display type or vertical labels.
- **Negative Space:** Sections are separated by massive vertical gaps (`120px+`) to allow the brand to breathe and feel premium.
- **Borders:** Use thin `1px` charcoal borders (`#262626`) to define zones, mimicking the structure of a printed magazine layout.

## Elevation & Depth

This design system avoids shadows entirely. Depth is achieved through **Tonal Layering** and **Bold Outlines**:

- **Layering:** Background is `#0A0A0A`. Interactive surfaces or secondary containers use `#141414`.
- **Flatness:** All elements are strictly flat. There are no blurs, glows, or skeuomorphic shadows. 
- **Active State:** Depth is communicated through color inversion (e.g., a button turning from an outline to a solid purple fill) rather than physical lifting.
- **Visual Stacking:** Use thin borders to stack elements. A card is not a floating box; it is a region of the grid defined by its outline.

## Shapes

The shape language is strictly **Sharp (0px)**. 

To maintain the architectural and "high-energy" editorial feel, every element—from buttons and input fields to images and cards—must have hard 90-degree corners. This creates a sense of strength, stability, and professional rigor. The only exception to the "no curves" rule is the natural geometry of typography or brand marks.

## Components

### Buttons
- **Primary:** Solid Purple (#6B2F7A) background, Cream (#F5F5F0) text, Sharp corners. All-caps Space Grotesk Bold.
- **Secondary:** Transparent background, 1px Cream border, Cream text.
- **Hover State:** Invert colors immediately with no transition lag to emphasize "energy."

### Cards & Containers
- Cards are never used for simple "containment." Instead, use them as "Framed Content." 
- Thin `#262626` borders on all sides. 
- No background color change unless the card is interactive.

### Input Fields
- Underline-only style or a full 1px box. 
- Label should be `label-caps` typography, positioned above the input field.
- Focus state: Border color changes to Purple (#6B2F7A).

### Chips & Tags
- Rectangular, sharp-edged boxes.
- Small `label-caps` text.
- Used for workout categories (e.g., "HIIT", "STRENGTH").

### Lists & Tables
- Divided by horizontal 1px lines that span the full container width.
- Large numerical indices (Bebas Neue) for step-based content or leaderboards.

### Distinctive Additions
- **Vertical Text Labels:** Used on the far margins of the screen to identify sections or categories, rotated 90 degrees.
- **Strobe Indicators:** Small, non-rounded square indicators in Purple to show "Live" classes or active status.