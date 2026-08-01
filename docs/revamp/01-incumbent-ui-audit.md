# Phase 1 — Incumbent UI & interaction audit

_Date: 2026-08-01_  
_Branch: `revamp/art-direction-prototypes`_  
_Base: http://localhost:3000_  
_Screenshots: `docs/revamp/screenshots/before/` (14 routes × 4 viewports)_  

**Design read (design-taste-frontend):** redesign-overhaul of a local multi-discipline fitness marketing site for mobile-first neighbourhood adults/parents; anti-AI-slop kinetic/editorial language. Incumbent ivory+amber is evidence and anti-reference, not the destination.

**Skills applied**

| Skill | Path | Influence on this audit |
|---|---|---|
| design-taste-frontend | `.agents/skills/design-taste-frontend/SKILL.md` | Anti-slop: centred heroes, equal card grids, section-layout repetition, soft-shadow chrome, pill overuse, trend typography, empty “luxury” space |
| impeccable | `.cursor/skills/impeccable/SKILL.md` | Persuade-mode UX: hierarchy, conversion clarity, responsive adaptation, a11y/audit lens, PRODUCT.md constraints |
| emil-design-eng | `.agents/skills/emil-design-eng/SKILL.md` | Motion purpose/frequency, easing quality, interruptibility, press feedback, bans on `transition: all` / scale(0) / useless reveals |

---

## Skill principles extracted (applied below)

### design-taste-frontend
- Anti-default: no AI-purple, no centred-hero-over-mesh defaults, no three equal feature cards as the only pattern
- Cards only when elevation carries hierarchy; ban section-layout repetition (same family at most once per page)
- Hero needs a real visual, not text + gradient blob
- Shape consistency lock; avoid decorative pills; ban em-dash-as-design-device clutter
- Dial baseline for overhaul: higher variance, stronger motion with intent, moderate density

### impeccable
- PRODUCT.md wins on users/constraints; DESIGN.md incumbent is not approved direction
- Mode for marketing surfaces: **Persuade** — earn trial booking without inventing proof
- Critique/audit for hierarchy, conversion, responsive, a11y, polish — not cosmetic token swaps
- Verify in bounded passes; keep server-rendered truth

### emil-design-eng
- Animate only with purpose; high-frequency actions should not be delayed by motion
- Prefer ease-out / custom curves; UI under ~300ms; never ease-in for UI
- Press feedback (`scale` ~0.97); never enter from `scale(0)`; springs when interruptible
- Specify properties (never `transition: all`); reduced-motion must remain usable

---

## Scope inspected

Routes: `/`, `/programs`, `/programs/yoga`, `/programs/strength-training`, `/locations`, `/locations/airoli`, `/locations/thane`, `/about`, `/trainers`, `/timetable`, `/pricing`, `/transformations`, `/trial` (covers `/book-a-free-trial` redirect), `/contact`.

Viewports: 390×844, 768×1024, 1440×900, 1920×1080.

Probes: keyboard tab order on home chrome; reduced-motion CSS path (ScrollReveal duration 0); Thane missing-data UI; long programme name (`weight-loss-fitness` in prior audits); mock banners present.

---

## Findings

### F01 — Generic centred / brand-forward hero with eyebrow + oversized headline

| Field | Detail |
|---|---|
| **Route** | `/` |
| **Component** | `src/components/home/Hero.tsx` (+ `Overline`, `HeroHeading`) |
| **Evidence** | Screenshot `1440x900_home.png` / `390x844_home.png`: overline “ANKIT'S STUDIO”, large Syne headline, body, dual CTAs; media is placeholder “MOCK MEDIA”, not art-directed photography |
| **Why generic** | design-taste: classic AI landing formula (eyebrow → display headline → muted paragraph → primary/secondary buttons). Hero visual is a framed placeholder, not a real crop |
| **Impact** | Weak first impression; does not signal multi-discipline energy or neighbourhood authority |
| **Skill** | design-taste-frontend |
| **Replacement to explore** | Asymmetric editorial hero; full-bleed crop with type locked to edges; programme tempo cue in first viewport |

### F02 — Predictable long marketing stack (section-layout repetition)

| Field | Detail |
|---|---|
| **Route** | `/` |
| **Component** | `src/app/(marketing)/page.tsx` composing 11 sections in fixed order |
| **Evidence** | Trust strip → programme cards → why (3 cards) → founder → transformations → branches → timetable → quotes → trial → FAQ — each largely “eyebrow + title + description + grid” |
| **Why generic** | design-taste Section-Layout-Repetition Ban: same family reused many times; reads as SaaS landing assembly |
| **Impact** | Users must scroll through sameness before branch/timetable answers; trial CTA buried late |
| **Skill** | design-taste-frontend + impeccable (hierarchy) |
| **Replacement** | Fewer layout families; early programme+branch+trial cluster; editorial story block that breaks rhythm |

### F03 — Equal programme card grids

| Field | Detail |
|---|---|
| **Route** | `/`, `/programs` |
| **Component** | `ProgrammeShowcase.tsx`, `ProgrammeCard.tsx` → `Card` |
| **Evidence** | `sm:grid-cols-2 lg:grid-cols-3` equal cards with badge + title + body + tags |
| **Why generic** | Banned “N equal feature cards” pattern; no hierarchy between strength vs kids dance |
| **Impact** | Programme discovery feels like a feature matrix, not a studio floor |
| **Skill** | design-taste-frontend |
| **Replacement** | Asymmetric magazine tiles, horizontal tempo rail, or list+detail without card chrome |

### F04 — Soft shadows and rounded rectangles as default chrome

| Field | Detail |
|---|---|
| **Route** | Sitewide |
| **Component** | `Card.tsx`, `Button.tsx`, form fields, sticky CTA |
| **Evidence** | `--shadow-soft` / `--shadow-lift` on nearly every raised surface; radii md/lg everywhere |
| **Why generic** | Soft elevation + warm ivory = familiar “premium SaaS / AI fitness” default |
| **Impact** | Brand feels approachable but not distinctive (matches DESIGN.md known weakness) |
| **Skill** | design-taste-frontend |
| **Replacement** | Direction-specific shape language (sharp editorial / hard crops / modular lines) |

### F05 — Atmosphere gradient as hero substitute

| Field | Detail |
|---|---|
| **Route** | Global shell |
| **Component** | `src/styles/studio.css` `.studio-shell` + `--atmosphere-gradient` |
| **Evidence** | Soft warm radial washes behind all pages |
| **Why generic** | design-taste: text + gradient blob is not a hero; decorative mesh-like wash without photography |
| **Impact** | Pages feel “designed” without communicating place, movement, or community |
| **Skill** | design-taste-frontend |
| **Replacement** | Real or art-directed media compositions with intentional crops; gradient only if structural |

### F06 — Weak programme differentiation (accent chips only)

| Field | Detail |
|---|---|
| **Route** | `/programs/*`, homepage showcase |
| **Component** | Badge accent families + shared Card shell |
| **Evidence** | Yoga vs Strength pages share Section/Card rhythm; only soft tint differs |
| **Why generic** | Accents are labels, not interaction or composition differences |
| **Impact** | Strength and kids dance feel like CMS entries, not different studio rooms |
| **Skill** | design-taste-frontend + impeccable |
| **Replacement** | Programme-specific layout modules / motion tempo / crop language |

### F07 — Branch discovery as another card grid

| Field | Detail |
|---|---|
| **Route** | `/`, `/locations` |
| **Component** | `BranchExplorer.tsx`, `LocationTeaserCard.tsx` |
| **Evidence** | Same Card pattern as programmes; disabled contact actions until verified (good honesty, weak discovery drama) |
| **Why generic** | Geographic choice reduced to two equal teaser cards |
| **Impact** | Airoli vs Ghansoli decision lacks map/place cues; Thane honesty is clear but exploration is flat |
| **Skill** | impeccable (branch discovery job) |
| **Replacement** | Place-led composition, asymmetric branch panels, geographic index |

### F08 — Conversion hierarchy dilution

| Field | Detail |
|---|---|
| **Route** | `/` |
| **Component** | Hero CTAs + mid-page FreeTrialCta + StickyCtaBar + header Book a Trial |
| **Evidence** | Multiple “Book a trial” affordances competing with Browse programmes; sticky + banner + hero on mobile |
| **Why generic** | Conversion noise without a clear primary path; impeccable Persuade mode wants one decisive act |
| **Impact** | Mobile first viewport crowded; trial intent competes with mock banner chrome |
| **Skill** | impeccable |
| **Replacement** | One primary conversion moment per viewport band; secondary contact after branch trust |

### F09 — Repeated ScrollReveal fade/translate on every block

| Field | Detail |
|---|---|
| **Route** | `/` and most marketing sections |
| **Component** | `ScrollReveal.tsx` wrapping cards/sections with `y: 14, opacity: 0.97` |
| **Evidence** | Same whileInView recipe with staggered delays across ProgrammeShowcase, WhyStudio, BranchExplorer, etc. |
| **Why generic** | emil: no distinct purpose beyond “looks alive”; high repetition; marketing animation without narrative |
| **Impact** | Motion becomes wallpaper; does not explain studio tempo or programme energy |
| **Skill** | emil-design-eng |
| **Replacement** | Sparse, purposeful motion (press, drawer, programme tempo, one story sequence); most sections static |

### F10 — Hover lift on every interactive card

| Field | Detail |
|---|---|
| **Route** | Programme/location grids |
| **Component** | `Card` `interactive` → `hover:-translate-y-0.5` + lift shadow |
| **Evidence** | Uniform card hover language sitewide |
| **Why generic** | Decorative feedback without spatial meaning; same for yoga card and branch card |
| **Impact** | Interaction vocabulary is flat; nothing feels programme-specific |
| **Skill** | emil-design-eng + design-taste-frontend |
| **Replacement** | Directional hover (underline, crop zoom, ink bar) tied to component role |

### F11 — Desktop layouts stacked on mobile without new composition

| Field | Detail |
|---|---|
| **Route** | `/`, `/programs`, `/locations` |
| **Component** | Grid → single column via Tailwind breakpoints |
| **Evidence** | `390x844_*.png` vs `1440x900_*.png`: same hierarchy, just narrower |
| **Why generic** | design-taste / impeccable adapt: mobile is a stack of the desktop story, not a phone-first composition |
| **Impact** | Working adults on phones get a long SaaS scroll instead of decisive local discovery |
| **Skill** | impeccable + design-taste-frontend |
| **Replacement** | Mobile-specific order (trial + nearby branch earlier); different type scale lockups |

### F12 — Typography pairing is modern-default, not distinctive

| Field | Detail |
|---|---|
| **Route** | Sitewide |
| **Component** | Syne + Figtree via root layout / tokens |
| **Evidence** | Geometric display sans + friendly UI sans — competent, common in 2024–26 AI templates |
| **Why generic** | design-taste anti-default: trend fonts without era/POV |
| **Impact** | Does not separate Ankit’s Studio from generic fitness SaaS |
| **Skill** | design-taste-frontend |
| **Replacement** | Direction-specific type worlds (editorial serif+grotesk, condensed kinetic, modular mono+sans) |

### F13 — Empty / airy spacing reading as “premium”

| Field | Detail |
|---|---|
| **Route** | `/about`, section padding sitewide |
| **Component** | `--spacing-section` clamp 3.5–7rem |
| **Evidence** | Large vertical gaps between low-information blocks |
| **Why generic** | design-taste: empty whitespace imitating luxury without content density craft |
| **Impact** | Mobile users scroll longer for the same answers |
| **Skill** | design-taste-frontend |
| **Replacement** | Tighter information clusters; intentional negative space only around hero media |

### F14 — Mock media / weak media treatment

| Field | Detail |
|---|---|
| **Route** | `/`, programme/location heroes |
| **Component** | `MediaFrame`, Hero mock placeholder |
| **Evidence** | Grey “MOCK MEDIA” label; no crop language, no grit, no community stills |
| **Why generic** | Hero without real visual authority |
| **Impact** | Emotional impact near zero; concepts must not depend on unavailable photos later |
| **Skill** | design-taste-frontend |
| **Replacement** | Art-directed replaceable mock compositions (shapes, typography-as-media, tempo bars) |

### F15 — Accessibility / honesty positives (keep)

| Field | Detail |
|---|---|
| **Route** | Sitewide / Thane / trial |
| **Evidence** | Skip link; focus rings; ScrollReveal never opacity 0; Thane TBC labelled; trial demonstration mode; touch targets mostly ≥44px after prior fixes |
| **Why noted** | impeccable/emil: do not regress these in prototypes |
| **Impact** | Positive baseline for revamp |
| **Skill** | impeccable + emil-design-eng |
| **Replacement** | Preserve behaviours; restyle chrome only |

### F16 — Performance risk: Motion islands × many ScrollReveals

| Field | Detail |
|---|---|
| **Route** | `/` |
| **Component** | Multiple client `ScrollReveal` wrappers |
| **Evidence** | Prior audits ~197–202kb shared JS; Motion on many nodes |
| **Why risk** | emil/impeccable optimize: decorative reveals add cost without product value |
| **Impact** | CWV pressure on mobile networks |
| **Skill** | emil-design-eng + impeccable |
| **Replacement** | Fewer client islands; CSS where enough; one signature sequence max per page |

### F17 — Decorative trust / why strips as pill-like chips

| Field | Detail |
|---|---|
| **Route** | `/` |
| **Component** | `TrustStrip.tsx`, programme tags |
| **Evidence** | Horizontal keyword chips; audience tags on cards |
| **Why generic** | design-taste: decorative pills without purpose risk |
| **Impact** | Visual noise without helping trial booking |
| **Skill** | design-taste-frontend |
| **Replacement** | Integrate facts into copy lockups or remove |

### F18 — Pricing / trainers / transformations mirror card catalogue

| Field | Detail |
|---|---|
| **Route** | `/pricing`, `/trainers`, `/transformations` |
| **Evidence** | Same Section + card/list chrome; mock disclaimers correctly present |
| **Why generic** | No editorial differentiation by risk domain |
| **Impact** | High-risk domains feel as casual as programme teasers |
| **Skill** | impeccable |
| **Replacement** | Stricter typographic presentation for pricing; portrait-led trainers when verified |

---

## Cross-cutting verdict

The incumbent UI is **functionally competent and provenance-safe**, but visually and kinetically **indistinguishable from a warm Tailwind marketing template**. Soft ivory, amber CTAs, equal cards, repeated ScrollReveals, and a long centred stack fail PRODUCT.md’s brand balance (not gym / not spa / not kids-club / not SaaS) by collapsing into “friendly SaaS fitness.”

Phase 2–4 must produce three **structurally different** prototypes — not three palettes on this DOM.

---

## Screenshot index

All under `docs/revamp/screenshots/before/`, named `{viewport}_{route-slug}.png` for viewports `390x844`, `768x1024`, `1440x900`, `1920x1080` and routes listed in Scope.
