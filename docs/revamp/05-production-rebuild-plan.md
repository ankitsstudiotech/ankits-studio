# Phase 6 — Production rebuild plan (Studio Pulse)

**Selected production direction (owner):** Studio Pulse (Direction B) — `/design-lab/revamp-b`  
**Historical agent recommendation (unchanged scores):** Kinetic Editorial — see `04-prototype-evaluation.md`  
**Owner decision record:** `docs/revamp/06-owner-direction-decision.md` (ADR-014)  
**Proposed system:** root `DESIGN.md`  
**Do not replace production routes in the freeze/prep task** — this document plans the next implementation phase on `revamp/studio-pulse-production`.

Frozen prototypes must remain unchanged during rebuild: `src/components/design-lab/revamp-{a,b,c}/**`.

---

## Implementation sequence (proposed)

1. **Token & font foundation** — Replace Syne/Figtree + ivory/amber production tokens with Bebas Neue + Space Grotesk and Pulse field/coral/volt/teal tokens **plus utility light surfaces** for booking/contact/timetable/pricing.
2. **Tempo-zone architecture** — Encode high-energy / strength / calm / community / utility section primitives so not every band is dark/loud.
3. **Shell & navigation** — Restyle `SiteHeader` / `MobileNav` / `SiteFooter` toward pulse nav; preserve portals, focus traps, sticky trial.
4. **Homepage composition** — Layered hero, tempo lanes, community story, branch nodes, pulse trial CTA (promote patterns from frozen revamp-b; add place-clarity + verification flags).
5. **Programme surfaces** — Lane/tempo detail; calm treatment for yoga; community warmth for kids dance.
6. **Location surfaces** — Named nodes + honest TBC; preserve `getBranchContactLinks` / PendingValue.
7. **Utility pages** — Trial, contact, timetable, pricing in **utility** zone (light, direct) — not nightclub chrome.
8. **Motion cleanup** — Remove default `ScrollReveal` parade; introduce documented Pulse islands with reduced-motion paths.
9. **Regression pass** — SEO, sitemap (still exclude `/design-lab`), robots disallow design-lab, forms, CWV, axe, keyboard, reduced-motion. Confirm A/B/C frozen screenshots still match.

---

## Component classification (Studio Pulse mapping)

| Component | Action | Notes |
|---|---|---|
| `MockModeIndicator` | **Preserve** | Honesty chrome; restyle if needed for contrast on dark/light |
| `forms/Field` | **Restyle** | Utility zone; keep validation |
| `home/Hero` | **Replace** | Layered Pulse hero from frozen B |
| `home/ProgrammeCard` | **Replace** | Tempo lanes |
| `home/ProgrammeShowcase` | **Replace** | Tempo lane stack |
| `home/LocationTeaserCard` | **Replace** | Branch nodes + flags |
| `home/BranchExplorer` | **Refactor** | Node layout; same accessors |
| `home/WhyStudio` | **Replace** | Community pulse story (warmer zone) |
| `home/FreeTrialCta` | **Replace** | Pulse CTA band |
| `home/TrustStrip` | **Delete** or **Replace** | No fake trust metrics |
| `home/TimetablePreview` | **Restyle** | Utility clarity |
| `home/CommunityTestimonials` | **Restyle** | Community zone; provenance required |
| `home/TestimonialCard` | **Refactor** | Less card chrome |
| `home/TransformationStories` | **Restyle** | Mock disclaimer mandatory |
| `home/FaqSection` | **Restyle** | Utility/calm |
| `home/FounderStoryPlaceholder` | **Restyle** | No invented bio |
| `home/MockDisclaimer` | **Preserve** | |
| `layout/SiteChrome` | **Restyle** | Drop ivory atmosphere; zone-aware shell |
| `layout/SiteHeader` | **Replace** | Pulse nav |
| `layout/DesktopNav` | **Replace** | |
| `layout/MobileNav` | **Refactor** | Keep portal |
| `layout/SiteFooter` | **Restyle** | |
| `layout/StickyCtaBar` | **Restyle** | Coral trial |
| `layout/PageBreadcrumb` | **Restyle** | |
| `locations/*` | **Restyle** / **Refactor** | Nodes + honesty; preserve safety helpers |
| `programs/*` | **Restyle** / **Refactor** | Tempo-aware spreads |
| `maps/MapPlaceholder` | **Preserve** | |
| `timetable/BranchTimetable` | **Restyle** | Utility zone |
| `motion/ScrollReveal` | **Delete** from marketing defaults | |
| `motion/TextReveal` | **Delete** or rare | |
| `motion/AccessibleCarousel` | **Preserve** if needed | |
| `ui/Card` | **Refactor** | Not default listing chrome |
| `ui/Button` | **Restyle** | Coral primary; press feedback |
| `ui/Badge` | **Restyle** | Provenance / tempo labels only |
| `ui/Container` / `Section` | **Refactor** | Band/zone primitives |
| `ui/MediaFrame` | **Replace** | Layered + mock-media |
| `ui/Typography` | **Replace** | Bebas + Space Grotesk tokens |

### Prototype promotion (B only)

| Frozen piece | Promote to |
|---|---|
| `revamp-b` CSS tempo/hero/lane patterns | Production tokens + section modules |
| `BeatStrip` / `TempoLane` / `PulseCta` | `src/components/motion/` or `home/` islands |
| Layered media treatment | Media primitives |
| Do **not** promote A editorial masthead or C matrix as homepage defaults | Keep as frozen alternatives |

---

## Production files likely to change (next phase)

- `src/app/layout.tsx` (fonts)
- `src/styles/tokens.css`, `src/styles/studio.css`, `src/app/globals.css`
- Marketing / programs / locations presentation components listed above
- Possibly `.impeccable/design.json`

**Must not regress**

- Content schemas / `@/content` accessors
- Mock preview banner + `noindex` while unverified
- `ALLOW_MOCK_PUBLISH` gate
- Sitemap exclusion of `/design-lab`; robots disallow design-lab when indexable
- Structured-data omit-unless-verified
- Form adapters & demonstration mode
- Frozen A/B/C routes and `src/components/design-lab/**`

---

## Animations to delete (production)

- Default `ScrollReveal` / marketing fade-up stacks
- Soft card lift as primary language
- Any Pulse gadgetry on utility pages

## Animations to add (production, documented)

- Hero beat strip (energy home only)
- Tempo lane mounts (programme discovery)
- CTA spring/press
- Always with reduced-motion static alternatives

---

## SEO / a11y / perf risks

- Heading order during hero restyle
- Client-wrapping entire pages (forbidden)
- Coral/volt contrast on black; utility light contrast
- Motion intensity for vestibular sensitivity
- Extra webfonts — subset and drop unused families
- Do not let dark homepage tokens leak into form readability

## Missing-media / verified-content limitations

- Layered mock-media is intentional until real studio assets arrive
- Branch phones/maps stay gated
- Do not invent member energy stats or fake “pulse” metrics

---

## Exit criteria for production rebuild (future task)

- [ ] Production homepage matches Studio Pulse with tempo zones
- [ ] Utility pages remain calm/direct
- [ ] Frozen A/B/C still render and pass design-lab tests
- [ ] Lint, type-check, tests, build green
- [ ] axe + keyboard + reduced-motion pass
- [ ] Owner/Ankit review of complete Pulse direction
