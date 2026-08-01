# Phase 5 — Prototype evaluation & selection

Prototypes: `/design-lab/revamp-a` · `/design-lab/revamp-b` · `/design-lab/revamp-c`  
Screenshots: `docs/revamp/screenshots/prototype-{a,b,c}/`  
Skills applied independently: **design-taste-frontend**, **impeccable**, **emil-design-eng**.

Weights: Brand 25 · Programme 15 · Branch 15 · Conversion 15 · Emotion 10 · Motion 10 · Mobile 5 · A11y 3 · Perf 2.

---

## Screenshots (representative)

| Viewport | A | B | C |
|---|---|---|---|
| 1440 hero | `prototype-a/1440x900_hero.png` | `prototype-b/1440x900_hero.png` | `prototype-c/1440x900_hero.png` |
| 390 hero | `prototype-a/390x844_hero.png` | `prototype-b/390x844_hero.png` | `prototype-c/390x844_hero.png` |
| Reduced motion | `prototype-a/390x844_reduced_motion.png` | `prototype-b/390x844_reduced_motion.png` | `prototype-c/390x844_reduced_motion.png` |
| Full page | `*_full.png` in each folder | | |

Also captured: 768×1024 and 1920×1080 hero + full for each.

---

## Numerical scores

| Criterion (weight) | A Kinetic Editorial | B Studio Pulse | C Movement System |
|---|---:|---:|---:|
| Brand distinctiveness (25) | **22** | 20 | 13 |
| Programme clarity (15) | 12 | 11 | **14** |
| Branch discovery (15) | 11 | 10 | **13** |
| Conversion clarity (15) | **13** | 12 | **13** |
| Emotional impact (10) | 8 | **9** | 5 |
| Motion quality (10) | **8.5** | 7 | 8 |
| Mobile quality (5) | 4 | 3.5 | **4.5** |
| Accessibility (3) | 2.5 | 1.8 | **2.8** |
| Performance feasibility (2) | 1.7 | 1.4 | **1.9** |
| **Weighted total** | **82.7** | **75.7** | **75.2** |

---

## design-taste-frontend critique

### A
**Strengths:** Breaks centred SaaS hero; brand is masthead-scale serif; hairline magazine grid; programme **index** not card grid; ink/paper avoids ivory-amber cliché and spa beige. Aggressive mock-media crops read as art direction, not stock.  
**Weaknesses:** Can tip toward “empty premium” if sections stay too sparse on mobile; pull-quote manifesto needs real photography soon or it stays type-only.

### B
**Strengths:** High originality; diagonal layered media; tempo as structure; rejects soft cards entirely.  
**Weaknesses:** Condensed all-caps + near-black + coral/volt clusters toward nightclub / boutique HIIT — risks bodybuilding-club adjacency for a multi-discipline neighbourhood studio with kids dance. Beat equalizer can read as decorative gadgetry.

### C
**Strengths:** Zero card theatre; matrix is scannable; verification flags are honest.  
**Weaknesses:** Cool stone + mono labels risk **SaaS / ops-dashboard** reading — explicitly banned in PRODUCT.md. Emotional brand signal is weak; first viewport could belong to a logistics tool after removing the name.

---

## impeccable critique

### A
Job path is present (programme index → branches → single trial strip). Hierarchy is clear. Mock disclaimers survive. Mobile stacks crop-over-type deliberately. Conversion is one ink bar — good. Slightly less explicit than C’s numbered jobs, but still completable on a phone.

### B
Energy helps “do I feel this?” but parents scanning for kids dance + branch trust get less calm hierarchy. Branch “nodes” are weaker geographic discovery than a named place index. Persistent pulse CTA is good; motion intensity needs discipline.

### C
Best job-statement hero and programme/branch clarity for planners. Sticky mobile trial is strong. Over-clarity without cultural brand warmth undercuts “premium neighbourhood studio” purpose.

---

## emil-design-eng motion critique

### A — sparse editorial
| Animation | Purpose | Trigger | Props | Duration / easing | Interruptible | Reduced-motion | Perf |
|---|---|---|---|---|---|---|---|
| Hero title | Voice establishment | Mount | opacity, x | 0.55s [0.16,1,0.3,1] | Yes | No offset | Low |
| Nav underline | Affordance | Hover/focus | background-size | 0.22s ease | Yes | Instant | Low |
| Programme item | Feedback | Hover | background-color | 0.2s | Yes | Instant | Low |

No scroll-reveal parade. Content opacity floor ≥0.95. **Pass.**

### B — tempo / spring
| Animation | Purpose | Trigger | Props | Duration / easing | Interruptible | Reduced-motion | Perf |
|---|---|---|---|---|---|---|---|
| Beat strip | Tempo metaphor | Mount | scaleY | 0.4–0.72s easeOut | Yes | Static bars | Low–med |
| Lane beats | Family tempo | Mount | scaleX | family duration | Yes | Static | Low–med |
| Lane hover/tap | Feedback | Pointer | x, scale | spring 420/28 | Yes | Disabled | Low |
| CTA tap | Conversion press | Tap | scale | spring 500/22 | Yes | Disabled | Low |

Purpose-led, but multiple simultaneous scale animations raise a11y cost; reduced-motion path exists and must stay mandatory in production. **Conditional pass.**

### C — state-only
| Animation | Purpose | Trigger | Props | Duration / easing | Interruptible | Reduced-motion | Perf |
|---|---|---|---|---|---|---|---|
| Matrix row | Hover affordance | Hover/focus | backgroundColor | 160ms easeOut | Yes | Duration 0 | Very low |
| CTA tap | Press confirm | Tap | scale | 150ms easeOut | Yes | Disabled | Very low |

No scroll hijack, no reveal theatre. **Strong pass** — almost too quiet for brand storytelling ambition in PRODUCT.md.

---

## Strengths / weaknesses summary

| | A | B | C |
|---|---|---|---|
| Strengths | Brand authority; anti-slop composition; coherent conversion | Energy; motion metaphor; media layering | Clarity; a11y; geo honesty |
| Weaknesses | Needs real media; density watch | Brand skew to club energy; motion load | SaaS adjacency; low emotion |
| A11y risks | Snap-scroll keyboard alternatives on rail | Motion intensity | Density / focus order |
| Perf risks | Display webfont | Many animated lanes | Low |

---

## Selected winner: **Direction A — Kinetic Editorial**

**Why it won**

1. Highest brand distinctiveness without collapsing into gym-bro, spa, kids-school, or SaaS.
2. Programme discovery as an authored index directly replaces the incumbent’s equal card grid (audit finding).
3. Conversion hierarchy stays simple and honest (one trial strip after place trust).
4. Motion is sparse and purpose-led (emil), meeting PRODUCT’s “substantial where useful” without fade-up spam.
5. Best overall weighted score; closest to “one coherent multi-discipline neighbourhood studio” positioning hypothesis.

**Why B was rejected**

High emotional score, but visual language skews boutique-HIIT/club. Accessibility and performance costs of multi-lane tempo motion are higher. Branch discovery is schematic rather than place-first. Risk of alienating parents and calm-programme seekers.

**Why C was rejected**

Excellent information design, but first-viewport identity fails the brand test (could be another product after removing the name). PRODUCT forbids SaaS-landing adjacency; C’s matrix/ops aesthetic leans that way. Emotion too low for a motion-capable studio brand.

### Compatible borrows (documented — not a hybrid)

From **C** only, where compatible with editorial metaphor:

1. **Verification / dataStatus flags** on branch modules (mono or caption footnotes already exist in A — elevate flag language).
2. **Sticky mobile trial** pattern when the editorial trial strip scrolls off-screen.
3. **Programme matrix density** as an optional treatment on `/programs` index (not homepage) — keep homepage as editorial rail.

Do **not** borrow B’s equalizer gadgetry, diagonal clip-paths, or spring-heavy lane choreography as defaults.

---

## Prototype testing notes

- Viewports 390 / 768 / 1440 / 1920: captured.
- Keyboard: skip links + focus outlines present on all three.
- Reduced motion: screenshots captured; A/C remain fully usable; B lanes stay readable static.
- Long text / missing branches: empty-state copy present when listed branches empty.
- Touch: trial CTAs ≥48px height.
- Media: `data-mock-media` plates only — no dependency on unavailable photography for concept success.
- No production routes modified.
