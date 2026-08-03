# Visual system defect ledger — Prompt 1

**Scope:** Shared production visual system + homepage + global chrome  
**Live reference (before):** https://ankits-studio.vercel.app  
**Evidence dir:** `docs/revamp/screenshots/shared-system-homepage-repair/`  
**Checkpoint:** `01a1a82` / tag `studio-pulse-deployed-v1-before-visual-repair`

Skills applied: `design-taste-frontend`, `impeccable`, `emil-design-eng`, `visual-qa-gate`.

Design read: neighbourhood fitness marketing repair, Studio Pulse dark editorial (VARIANCE 6 / MOTION 5 / DENSITY 3).

## Before defects (P0 / P1)

| ID | Route | Viewport | Shared element | Defect | Severity | Shared fix | Status |
|----|-------|----------|----------------|--------|----------|------------|--------|
| VS-01 | / (header) | all | Logo | White rectangle around logo symbol | P1 | Transparent symbol + remove white plate | **fixed** |
| VS-02 | / #services | all | Programme titles | Mixed display uppercase vs body title-case by tempo | P1 | One ProgrammeRow title system (CSS uppercase) | **fixed** |
| VS-03 | / #services | desktop | Programme motion | Motion/hover tied to tempo + casing classes | P1 | Role-based ProgrammeRow motion | **fixed** |
| VS-04 | / #services | all | Cue lines | Incompatible lengths/heights; some near-invisible | P1 | One cue track with cluster colour only | **fixed** |
| VS-05 | / #studio | 1440 | WhyStudio | Left-heavy Machine-free section; empty right | P1 | Two-column editorial + principles list | **fixed** |
| VS-06 | / #locations | all | Branch copy | Repeated “open neighbourhood studio” | P1 | Hours + locality/address; remove phrase | **fixed** |
| VS-07 | / #practical | all | Practical band | Full-width white utility section in dark home | P1 | Dark editorial info grid | **fixed** |
| VS-08 | / #trial | all | Free trial H2 | Nearly invisible heading (low-contrast gradient) | P1 | Off-white display title; solid field | **fixed** |
| VS-09 | global | all | Footer divider | Partial divider from mid-column / weak chrome | P1 | Full-width container-aligned divider | **fixed** |
| VS-10 | global | all | Footer Explore | Trainers / Member stories / Blog promoted while withheld | P1 | Launch-ready destinations only | **fixed** |
| VS-11 | inner routes | all | Breadcrumb | White crumb strip on dark pages | P1 | Dark pulse crumb bar | **fixed** |
| VS-12 | / + /programs | all | Cards/forms/FAQ | Unrelated white accordion vs dark lanes | P1 | Shared dark accordion + ProgrammeRow | **fixed** (home FAQ + ProgrammeRow; contact form surface remains for later route pass) |
| VS-13 | / long sections | 1440 | Body text | Small/faint muted body on dark | P1 | Raise secondary text contrast + body size | **fixed** |

## After gate

| Severity | Before | After |
|----------|--------|-------|
| P0 shared | 0 | **0** |
| P1 homepage/shared chrome | 13 | **0** |

## Evidence

**Before:** `before-390-home.png`, `before-768-home.png`, `before-1440-home.png`, `before-1440-fullpage-home.png`, `before-1440-programs.png`, `before-1440-contact.png`

**After:** `after-390-home.png`, `after-768-home.png`, `after-1440-home.png`, `after-1440-fullpage-home.png`, `after-1440-programmes-shared-components.png`, `after-1440-contact-shared-chrome.png`

**Logo proofs:** `logo-on-black.png`, `logo-on-purple.png`, `logo-on-white.png`

**Interaction states:** `state-programme-hover-ft.png`, `state-programme-focus-ft.png`, `state-programme-hover-last.png`, `state-faq-open.png`, `state-mobile-menu-open.png`, `state-reduced-motion-home.png`

## Out of Prompt 1 scope (carry to later prompts)

- Contact / other routes still may use light utility form panels (e.g. “Send a general message”) — shared chrome (header, crumb, footer) repaired; full route resurfacing is not this task.
- Direct CDR vector export still unavailable; transparent symbol is temporary flood-fill.
