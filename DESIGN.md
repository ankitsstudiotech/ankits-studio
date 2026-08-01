---
name: Ankit's Studio
description: Proposed Studio Pulse production design system — rhythm-led neighbourhood studio (owner-selected; not yet production-implemented)
colors:
  field: "#0B0B0C"
  field-raised: "#141416"
  ink-inverse: "#F4F1EA"
  muted: "#9A958C"
  coral: "#FF4D2E"
  volt: "#C8FF3D"
  teal-hold: "#5EEAD4"
  strength-lane: "#FF4D2E"
  calm-lane: "#5EEAD4"
  energy-lane: "#C8FF3D"
  utility-surface: "#F4F5F6"
  utility-ink: "#14181C"
typography:
  display:
    fontFamily: "Bebas Neue, Impact, sans-serif"
    fontWeight: 400
    letterSpacing: "0.02em"
    lineHeight: 0.88
  body:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  marketing: "0"
  utility: "0.25rem"
spacing:
  gutter: "1.25rem"
  band: "clamp(2rem, 5vw, 3.5rem)"
---

# Design System: Ankit's Studio (proposed — Studio Pulse)

> **Status: Proposed production design system after owner selection of Studio Pulse.**  
> Prototype baseline: `/design-lab/revamp-b` (frozen).  
> Owner decision: `docs/revamp/06-owner-direction-decision.md` (ADR-014).  
> Historical agent pick (Kinetic Editorial) remains scored in `04-prototype-evaluation.md` and archived at `docs/revamp/KINETIC-EDITORIAL-DESIGN-SYSTEM.md`.  
> Incumbent live UI: `docs/revamp/INCUMBENT-DESIGN-SYSTEM.md`.  
> **Production routes are not yet rebuilt.**

**Creative North Star: “Feel the room’s tempo.”**

One neighbourhood studio week expressed as rhythm — strength hits, yoga holds, dance grooves — without collapsing into a boutique HIIT club or nightlife brand.

**Design read:** redesign-overhaul for mobile-first adults/parents in Airoli–Ghansoli; kinetic but tempo-zoned; anti-slop; owner-directed Pulse energy with mandatory calm/family/utility mitigations.

---

## Emotional intent

- Alive, communal, kinetic where programmes earn it
- Still trustworthy for parents and first-time visitors
- Coherent across strength, yoga, Zumba, adult dance, kids dance, and families
- Not spa beige, not gym-bro red/black only, not kids-club cartoon, not SaaS landing

---

## Tempo zones (mandatory production rule)

Do **not** make every section dark, loud, or high-tempo.

| Zone | Surfaces | Motion | Use |
|---|---|---|---|
| **High-energy** | Near-black field, coral/volt accents | Tempo lanes, beat marks, spring press | Zumba, adult dance, active training moments |
| **Strength** | Dark or charcoal with structured lanes | Confident, shorter duration — no party EQ spam | Strength, personal training |
| **Calm** | Quieter greens/teals, more space | Hold / static; minimal animation | Yoga, recovery-oriented content |
| **Community / family** | Warmer human media, readable type | Soft state feedback only | Kids dance, families, neighbourhood story |
| **Utility** | Light stone/ink, high clarity | State-only ~150ms | Trial booking, contact, timetable, pricing |

---

## Typography

**Display:** Bebas Neue (condensed) — brand marks, hero titles, lane titles.  
**Body / UI:** Space Grotesk — navigation, ledes, disclaimers, forms.

### Rules

- All-caps display is allowed in high-energy / strength bands; **prefer sentence case** in calm, community, and utility zones
- Do not set entire utility pages in Bebas
- Kickers: tracked uppercase Space Grotesk at ~0.65–0.8rem

---

## Colour system

Derived from frozen revamp-b tokens (hex locked in prototype CSS modules):

- **Field** `#0B0B0C` — high-energy / strength canvases
- **Raised** `#141416` — lane / node surfaces
- **Ink inverse** `#F4F1EA` — type on field
- **Muted** `#9A958C` — secondary copy on field
- **Coral** `#FF4D2E` — primary trial CTA + strength tempo
- **Volt** `#C8FF3D` — high-energy tempo accent
- **Teal hold** `#5EEAD4` — calm tempo accent
- **Utility surface / ink** — light pages for booking & contact (tempo-zone mitigation; not in the dark prototype homepage alone)

**One conversion accent:** Coral for primary trial actions. Do not paint every chip coral.

---

## Grid & layout

- Pulse nav: brand + uppercase text links (not soft blur ivory header)
- Hero: split copy | **layered diagonal media** (not centred SaaS stack)
- Programmes: **tempo lanes** (not equal card grids)
- Story: media + short communal copy
- Branches: schematic **nodes** (add clearer place names + verification flags in production)
- Trial: pulse CTA band with immediate press feedback

Mobile: vertical beat stack; lanes become full-width strips; layered media stacks.

---

## Media & layering

- Layered plates with slight rotation / overlap for energy bands
- Art-directed `data-mock-media` until real photography lands
- Calm / family bands: fewer layers, gentler crops, more face/human context when media exists
- Utility: minimal or no layered hero theatre

---

## Programme behaviours

Map `heroAccent` families to tempo:

- `strength` → HIT / coral lane timing
- `calm` → HOLD / teal, longer quieter motion
- `high-energy` → GROOVE / volt

Kids dance and family messaging must still land in **community** zone chrome even if programme accent is high-energy.

---

## Navigation

- Condensed brand wordmark + tempo section anchors on marketing home
- Production: keep programme/location IA routes; restyle chrome only
- Never list `/design-lab` in public nav

---

## Buttons & forms

- Primary trial: coral, min-height 48px, spring or 150ms scale press (interruptible)
- Secondary on dark: outline / volt hairline — not soft amber pills
- Utility forms: light surfaces, clear labels, existing validation honesty preserved
- No `transition: all`

---

## Location presentation

- Branch as named place node + programme count + mock/verified flag
- Contact/WhatsApp/maps still via `getBranchContactLinks` (null until verified)
- Avoid fake map theatre

---

## Motion vocabulary (emil-design-eng)

| Pattern | Purpose | Props | Timing | Reduced motion |
|---|---|---|---|---|
| Beat strip | Tempo metaphor (hero energy only) | scaleY | ~0.4–0.72s easeOut | Static bars |
| Lane beats | Family tempo | scaleX, origin left | Family duration | Static |
| Lane hover/tap | Feedback | x / scale | Spring ~420/28 | Disabled |
| CTA tap | Conversion press | scale | Spring ~500/22 or 150ms | Brightness only |

Forbidden defaults: scroll-reveal parade, scroll hijack, long loaders, custom cursors, WebGL, non-interruptible sequences, opacity-0 content.

---

## Accessibility

- WCAG 2.2 AA on each tempo zone surface
- Focus rings: volt on dark; ink/signal on utility light
- Touch targets ≥44px
- Keyboard access to all lanes/CTAs
- Hard reduced-motion paths required for every pulse animation

---

## Performance

- Transform/opacity only for tempo motion
- Cap concurrent animated lanes
- Subset webfonts; remove Syne/Figtree when Pulse ships
- CSS mock-media until real images; then modern formats

---

## Anti-AI-slop & anti-overreach rules

**Do**

- Use tempo as structure
- Zone the site so yoga/kids/utility are not nightclub pages
- Keep mock honesty visible

**Don't**

- Soft ivory amber card grids
- Equal feature cards with glow
- Decorative equalizer on every page
- Pure black/red bodybuilding cliché without calm/family zones
- SaaS centred hero + fade-ups
- Silently restyle frozen A/C prototypes
- Invent ratings, timings, prices, trainers, awards

---

## Prototype reference files

- `src/components/design-lab/revamp-b/**`
- `src/app/design-lab/revamp-b/layout.tsx` (fonts)
- Screenshots: `docs/revamp/screenshots/frozen-b/`
