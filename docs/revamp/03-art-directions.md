# Phase 3 — Three art directions

_Not three palettes on one layout. Each direction changes grid, nav, type, hero, media, rhythm, density, discovery, CTA, mobile composition, and motion language._

Skills: **design-taste-frontend** (originality/composition), **impeccable** (user jobs/conversion), **emil-design-eng** (motion vocabulary).

---

## Direction A — Kinetic Editorial

**Central metaphor:** The neighbourhood studio as a printed movement magazine — stories of disciplines sharing one floor.  
**Emotional response:** Intelligent, cultural, adult — not spa, not gym-bro.  
**Audience fit:** Working adults and parents who skim on phones but respond to craft and clarity.  

| Layer | Spec |
|---|---|
| Typography | High-contrast editorial serif for display + neutral grotesque for UI (prototype: Instrument Serif + DM Sans) |
| Colour | Ink-forward canvas, paper highlights, single sharp accent for trial only |
| Layout | Asymmetric columns, overlapping type/media, magazine pacing |
| Image/video | Aggressive crops, typographic mock-media slabs (replaceable), no soft frames |
| Graphic devices | Hairlines, issue numbers, pull-quotes — not pills |
| Motion | One hero type entrance; link underline grows; sections mostly static (emil: rare = allowed) |
| Homepage | Masthead → asymmetric hero story → horizontal programme index (not cards) → studio manifesto → branch columns → trial strip |
| Programme page | Editorial spread: discipline essay + tempo sidebar |
| Location page | Place column + honest TBC block as footnote, not disabled-button soup |
| Mobile | Masthead collapses; hero becomes stacked crop-over-type; programme index becomes snap-scroll list |
| Conversion | Single ink trial bar after place trust — not four competing CTAs |
| A11y risks | Contrast on ink/paper; snap-scroll needs keyboard alternatives |
| Perf risks | Large type + webfonts — subset, limit faces |
| Anti-slop | Breaks centred SaaS hero + equal cards; type-led authority |

---

## Direction B — Studio Pulse

**Central metaphor:** The room’s tempo — strength hits, yoga holds, dance grooves — visible as rhythm.  
**Emotional response:** Alive, communal, kinetic.  
**Audience fit:** Users deciding “do I feel this energy?” especially Zumba/dance/strength seekers.  

| Layer | Spec |
|---|---|
| Typography | Condensed display + geometric sans (prototype: Bebas Neue + Space Grotesk) |
| Colour | Near-black field; coral/volt accents by tempo family; no ivory wash |
| Layout | Diagonal bands, layered strips, overlapping media lanes |
| Image/video | Layered mock-media panels with tempo bars; community energy without stock smiles |
| Graphic devices | Beat marks, lane labels, pulse meters (abstract, not charts of fake stats) |
| Motion | Programme lanes animate at different durations; button spring press; interruptible (emil springs) |
| Homepage | Pulse nav → layered hero with beat strip → tempo lanes for programmes → community pulse story → branch nodes → trial pulse CTA |
| Programme page | Tempo legend + lane detail |
| Location page | Branch as nodes on a schematic (not map embed until verified) |
| Mobile | Vertical beat stack; lanes become full-width strips |
| Conversion | Persistent pulse CTA with instant press feedback |
| A11y risks | Motion intensity — hard reduced-motion static lanes required |
| Perf risks | Multiple animated lanes — cap to transform/opacity |
| Anti-slop | Rejects soft ivory cards; energy is structural |

---

## Direction C — Movement System

**Central metaphor:** A precise movement operating system — modular, geographic, calm authority.  
**Emotional response:** Clear, premium, trustworthy.  
**Audience fit:** Parents and planners who need programme + branch + trial without theatre.  

| Layer | Spec |
|---|---|
| Typography | Modular grotesque + mono captions (prototype: IBM Plex Sans + IBM Plex Mono) |
| Colour | Cool stone surfaces, charcoal ink, precise signal accent |
| Layout | Strict modular grid, system rows, dense but scannable |
| Image/video | Technical mock frames (ratios, crop guides) — honest placeholders |
| Graphic devices | Grid indexes, mono labels, hairline modules — zero soft shadows |
| Motion | State-only 150–200ms ease-out; no scroll reveals (emil: high-frequency clarity) |
| Homepage | System nav → utility hero (job statements) → programme matrix rows → studio protocol story → geographic branch index → trial module |
| Programme page | Spec sheet rows (audience, accent family, branches) without fake metrics |
| Location page | Geo index + verification status as system flags |
| Mobile | Same modules reflow; sticky utility trial |
| Conversion | Trial module adjacent to branch selection mentally (same band) |
| A11y risks | Density — need clear headings and focus order |
| Perf risks | Low — few client islands |
| Anti-slop | Rejects card theatre and fade-ups; clarity as aesthetic |

---

## Differentiation checklist

| Dimension | A Editorial | B Pulse | C System |
|---|---|---|---|
| Grid | Asymmetric magazine | Diagonal lanes | Strict modules |
| Nav | Masthead / issue | Pulse marks | Utility system |
| Hero | Crop + serif story | Layered beat hero | Job-statement utility |
| Programmes | Horizontal index | Tempo lanes | Matrix rows |
| Branches | Editorial columns | Schematic nodes | Geo index |
| Motion | Sparse type | Tempo / spring | State-only |
| Density | Medium-low editorial | Medium kinetic | Medium-high clarity |

Proceed to Phase 4 prototypes at `/design-lab/revamp-a|b|c`.
