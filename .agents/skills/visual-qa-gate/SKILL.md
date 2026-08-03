---
name: visual-qa-gate
description: Screenshot-first visual acceptance and design-system consistency audit for production web interfaces.
---

# Visual QA Gate

Never approve a customer-facing interface from source code, unit tests,
accessibility output or written implementation summaries alone.

## Mandatory evidence

Before changing a route, capture its rendered state.

After changing it, capture the same route again at:

- 390 × 844
- 768 × 1024 when shared responsive behaviour is affected
- 1440 × 900
- Full-page desktop screenshot

Do not claim completion without reviewing the final screenshots.

## Review dimensions

Inspect every route for:

### Global chrome

- Logo quality and transparency
- Header height and alignment
- Navigation casing and states
- Breadcrumb consistency
- Footer grid and dividers
- Sticky CTA overlap
- Mobile navigation

### Typography

- Font family
- Heading hierarchy
- Casing
- Line height
- Text width
- Contrast
- Wrapping
- Consistency across repeated components

### Layout

- Shared left and right grid
- Section padding
- Margins
- Vertical rhythm
- Unused desktop space
- Mobile density
- Horizontal overflow
- Alignment between adjacent sections

### Components

- Buttons
- Links
- Programme rows
- Location rows
- Cards
- Forms
- Accordions
- Dividers
- Decorative cues
- Focus and hover states

Repeated components must look and behave consistently across routes.

### Theme

- Background colours
- Text colours
- Borders
- Surfaces
- Accent usage
- Semantic success/error colours
- Unexpected light or legacy sections

### Content presentation

Flag public wording that sounds like:

- Internal implementation notes
- Data provenance
- Mock or development status
- Defensive legal boilerplate
- Placeholder copy
- Meaningless marketing phrases

### Motion

Motion must be based on component role, not text casing, font class or a
specific heading selector.

Verify:

- Pointer hover
- Keyboard focus
- Touch/press
- Reduced motion
- No continuous decorative animation
- No missing interaction on visually equivalent components

## Defect ledger

Before implementation create a concise table:

| Route | Viewport | Element | Defect | Severity | Proposed correction |

Severity:

- P0: blocks use or creates false information
- P1: visually broken, inconsistent or unprofessional
- P2: visible polish issue
- P3: optional improvement

Close all P0 and P1 defects before approval.

## Completion rules

Do not use statements such as:

- Looks consistent
- Visual convergence complete
- Launch-ready
- Polished
- Fixed globally

unless screenshot evidence demonstrates it.

For every completed task report:

- Screenshots reviewed
- P0 count before/after
- P1 count before/after
- Remaining visible defects
- Any route not visually inspected

Automated tests support visual acceptance; they never replace it.