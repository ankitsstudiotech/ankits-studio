# Phase 6 — Production rebuild plan

**Selected direction:** Kinetic Editorial (Direction A)  
**Prototype to promote:** `src/app/design-lab/revamp-a/` (+ `_revamp/shared.tsx` media helper)  
**Do not replace production routes in this task** — this document plans the next implementation phase.

---

## Implementation sequence (proposed)

1. **Token & font foundation** — Replace Syne/Figtree + ivory/amber tokens in `src/styles/tokens.css` / root layout with Instrument Serif + DM Sans and ink/paper/trial tokens. Keep programme family tokens only for media labelling.
2. **Shell & navigation** — Rebuild `SiteHeader` / `MobileNav` / `SiteFooter` to masthead + underline nav; preserve portals, focus traps, sticky trial behaviour (borrow sticky from C).
3. **Homepage composition** — Replace long SaaS stack with: masthead hero → programme rail → studio story → branch columns → trial ink band. Keep routes `/` content accessors unchanged.
4. **Programme surfaces** — Restyle `/programs` and detail heroes to editorial spreads; optional matrix density on index only.
5. **Location surfaces** — Editorial columns + verification flags; preserve `getBranchContactLinks`, PendingValue, map gating.
6. **Secondary pages** — About, trainers, timetable, pricing, transformations, blog, contact, trial — restyle chrome; do not invent data.
7. **Motion cleanup** — Remove default `ScrollReveal` usage from marketing pages; keep islands only where purpose-documented.
8. **Regression pass** — SEO metadata, sitemap/robots, structured data omit-unless-verified, forms, CWV, axe, reduced-motion, keyboard.

---

## Component classification

| Component | Action | Notes |
|---|---|---|
| `MockModeIndicator` | **Preserve** | Honesty chrome; restyle colors only if contrast holds |
| `forms/Field` | **Restyle** | Keep validation / aria; reduce shadow radius |
| `home/Hero` | **Replace** | Promote asymmetric editorial hero from revamp-a |
| `home/ProgrammeCard` | **Replace** | Prefer programme index cell; delete as default |
| `home/ProgrammeShowcase` | **Replace** | Horizontal rail / index |
| `home/LocationTeaserCard` | **Replace** | Editorial branch column |
| `home/BranchExplorer` | **Refactor** | New layout; same data accessors |
| `home/WhyStudio` | **Replace** | Studio story / manifesto spread |
| `home/FreeTrialCta` | **Replace** | Ink trial band |
| `home/TrustStrip` | **Delete** or **Replace** | Avoid fake-trust chrome; only keep if verified facts exist |
| `home/TimetablePreview` | **Restyle** | Keep filters honest |
| `home/CommunityTestimonials` | **Restyle** | Provenance labels required |
| `home/TestimonialCard` | **Restyle** / **Refactor** | Less card chrome |
| `home/TransformationStories` | **Restyle** | Mock disclaimer mandatory |
| `home/FaqSection` | **Restyle** | |
| `home/FounderStoryPlaceholder` | **Restyle** | No invented bio facts |
| `home/MockDisclaimer` | **Preserve** | |
| `layout/SiteChrome` | **Restyle** | Paper shell; drop atmosphere gradient |
| `layout/SiteHeader` | **Replace** | Masthead pattern |
| `layout/DesktopNav` | **Replace** | Underline links |
| `layout/MobileNav` | **Refactor** | Keep portal; new visuals |
| `layout/SiteFooter` | **Restyle** | |
| `layout/StickyCtaBar` | **Restyle** | Keep; align with trial accent |
| `layout/PageBreadcrumb` | **Restyle** | |
| `locations/*` | **Restyle** / **Refactor** | Heroes editorial; grids → lists; preserve PendingValue / ContactActionGroup safety |
| `programs/*` | **Restyle** / **Refactor** | Editorial spread; keep location links |
| `maps/MapPlaceholder` | **Preserve** | |
| `timetable/BranchTimetable` | **Restyle** | |
| `motion/ScrollReveal` | **Delete** from production pages | May keep file unused or remove after purge |
| `motion/TextReveal` | **Delete** or rare use | Not default |
| `motion/AccessibleCarousel` | **Preserve** if still needed | Prefer not as homepage crutch |
| `ui/Card` | **Refactor** | Stop using as default listing chrome |
| `ui/Button` | **Restyle** | Trial accent; less shadow; sharper |
| `ui/Badge` | **Restyle** | Provenance only |
| `ui/Container` | **Restyle** | |
| `ui/Section` | **Refactor** | Rule-based bands |
| `ui/MediaFrame` | **Replace** | Promote mock-media / crop frames |
| `ui/VideoFrame` | **Restyle** | |
| `ui/Typography` / `Overline` | **Replace** | Serif display tokens; kickers not amber pills |
| `ui/TextLink` | **Restyle** | Underline grow |

### Prototype promotion

| Prototype piece | Promote to |
|---|---|
| `revamp-a/revamp-a.module.css` patterns | Global tokens + section CSS modules |
| `revamp-a/motion.tsx` (`EditorialHeroTitle`) | `src/components/motion/` editorial enter |
| `_revamp/shared.tsx` `MockMediaPlate` | `src/components/ui/MockMediaPlate.tsx` |
| Masthead / programme rail / trial band | New home + layout components |

Keep `revamp-b` / `revamp-c` in design-lab for reference; do not promote Pulse equalizers or System homepage matrix as defaults.

---

## Production files likely to change

- `src/app/layout.tsx` (fonts)
- `src/styles/tokens.css`, `src/styles/studio.css`
- `src/app/(marketing)/**`, `src/app/programs/**`, `src/app/locations/**`, trial/contact routes’ presentation components
- `src/components/**` per table above
- Possibly `.impeccable/design.json` to mirror proposed system

**Must not regress**

- Content schemas / accessors
- Mock preview banner + `noindex`
- `ALLOW_MOCK_PUBLISH` build gate
- Sitemap / robots / canonical / structured-data omit-unless-verified
- Form adapters & demonstration mode
- Programme ↔ location internal links

---

## Animations to delete

- Default homepage / section `ScrollReveal` wrappers
- Repeated `TextReveal` on marketing headings
- Card lift shadow hover as primary feedback language
- Any future Pulse beat-strip / multi-lane scale choreography unless a programme page explicitly needs tempo storytelling

---

## SEO regression risks

- Changing heading order or removing H1 text during hero restyle
- Client-wrapping entire pages (keep SSR primary content)
- Accidental `noindex` leakage to verified production
- Broken programme/location anchors in nav rebuild
- Image/mock-media without meaningful `alt` / `aria-label`

## Accessibility regression risks

- Serif display contrast on paper (check AA)
- Trial red on ink (check AA)
- Snap-scroll programme rail without keyboard equivalents
- Sticky CTA overlapping focusable content
- Focus rings must remain visible on paper and ink

## Performance risks

- Extra webfonts (subset Instrument Serif + DM Sans; remove Syne/Figtree)
- Full-bleed media plates — use CSS compositions until real images; then modern formats + sizes
- Avoid animating layout properties

## Missing-media / verified-content limitations

- Concepts succeed with labelled mock-media plates; **real studio photography/video still required** before calling the redesign “complete”
- Branch addresses, phones, hours, maps remain mock — UI must keep disclaimers and gated links
- Pricing, trainers, transformations stay illustrative until verified
- Do not invent founder credentials or member stats to “fill” editorial spreads

---

## Exit criteria for production rebuild (future task)

- [ ] Production homepage matches Kinetic Editorial structure (not ivory card stack)
- [ ] Lint, type-check, unit/SEO/route tests, build green
- [ ] axe + keyboard + reduced-motion pass
- [ ] Lighthouse / CWV within project budgets
- [ ] Owner media swap plan for `data-mock-media` nodes
