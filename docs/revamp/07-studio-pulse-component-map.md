# Studio Pulse — production component map

**Scope of this implementation pass:** visual foundations, application shell, homepage only.  
**Frozen prototypes:** do not modify `src/components/design-lab/revamp-{a,b,c}/**` or their routes.  
**Reference:** `/design-lab/revamp-b`, `DESIGN.md`, ADR-014.

---

## Classification legend

| Action | Meaning |
|---|---|
| **Preserve** | Keep behaviour and structure; tokens may cascade |
| **Promote from Revamp B** | Lift structural/visual idea from frozen B into production (new file or rewrite) — do not edit frozen source |
| **Refactor** | Keep file/API; change composition/chrome |
| **Replace** | New implementation; retire incumbent pattern |
| **Delete** | Remove from homepage / stop using as default (file may linger until later route pass) |

---

## Foundations

| Existing file | Action | Prototype source | Target | Preserve behaviour | SEO | A11y | Perf | Tests |
|---|---|---|---|---|---|---|---|---|
| `src/styles/tokens.css` | **Replace** | `revamp-b.module.css` `--rb-*` + DESIGN.md utility zone | same | Token names mapped to Pulse; programme families remain semantic | Low | Contrast on field/utility | Font subset | Snapshot token consumers |
| `src/styles/studio.css` | **Replace** | B root field; no atmosphere | same | Shell bg/selection; sticky padding | Low | Focus visible | Drop gradient paint | Visual |
| `src/styles/motion.css` | **Refactor** | B springs / reduced-motion | same | Reduce-motion zeroing; remove default `.motion-reveal` parade | Low | Reduced-motion | Drop unused | Motion |
| `src/app/globals.css` | **Refactor** | — | same | Tailwind + theme font remap | Low | — | — | — |
| `src/app/layout.tsx` fonts | **Replace** | B layout Bebas + Space Grotesk | same | Metadata, MockModeIndicator, skip link, SSR | Metadata unchanged | Skip link | Drop Syne/Figtree | Font load |

### Explicit removals (foundations)

- Incumbent **Syne / Figtree** production fonts
- **Ivory / amber** surface + accent as brand default
- **`--atmosphere-gradient`**
- **`--shadow-soft` / `--shadow-lift`** as default card elevation language
- Legacy **`.motion-reveal`** as homepage default

---

## Shell

| Existing file | Action | Prototype source | Target | Preserve | SEO | A11y | Perf | Tests |
|---|---|---|---|---|---|---|---|---|
| `layout/SiteChrome.tsx` | **Preserve** | — | same | Header/children/footer/sticky composition (server) | — | — | SSR | — |
| `layout/SiteHeader.tsx` | **Replace** | B `pulseNav` | same | Nav items from content; pathname; primary CTA | Internal links | Focus, menu button | Client island only | Header |
| `layout/DesktopNav.tsx` | **Replace** | B text links | same | Active state, CTA | — | Keyboard | — | — |
| `layout/MobileNav.tsx` | **Refactor** | B density | same | Portal drawer, trap, Escape, restore focus | — | Trap/Escape | — | Mobile nav |
| `layout/StickyCtaBar.tsx` | **Restyle→Replace chrome** | B `PulseCta` energy | same | Hide on trial paths; href `/trial` | Conversion path | 44px target | Client | Sticky |
| `layout/SiteFooter.tsx` | **Refactor** | B field footer tone | same | Groups, disclaimer | Footer links | Touch targets | SSR | — |
| `layout/PageBreadcrumb.tsx` | **Refactor** | — | same | Breadcrumb semantics | — | — | — | — |
| `MockModeIndicator.tsx` | **Preserve** (+ contrast restyle) | — | same | Non-dismissable mock banner rules | noindex context | Contrast | — | Existing tests |

**Client-island boundaries (shell):** `SiteHeader`, `MobileNav`, `StickyCtaBar` only. Footer + chrome remain server.

---

## Homepage components

| Existing file | Action | Prototype source | Target | Preserve | SEO | A11y | Perf | Tests |
|---|---|---|---|---|---|---|---|---|
| `(marketing)/page.tsx` | **Replace** composition | B section rhythm + production jobs | same | Metadata, SSR content, FAQ/JSON if any | H1, copy | Landmarks | No full-page client | Metadata |
| `home/Hero.tsx` | **Replace** | B hero + `BeatStrip` + layers | same | CTAs to trial/programs; brand signal | H1 readable immediately | Reduced-motion hero | Transform-only motion | — |
| `home/ProgrammeShowcase.tsx` | **Replace** | B tempo lanes | same | Links `/programs/[slug]`; accents | Internal links | Keyboard, no-hover | Cap animations | — |
| `home/ProgrammeCard.tsx` | **Delete** from homepage | — | retire usage | — | — | — | — | — |
| `home/BranchExplorer.tsx` | **Replace** | B branch nodes | same | Listed branches; mock disclaimer | Location links | — | — | — |
| `home/LocationTeaserCard.tsx` | **Delete** from homepage | — | retire usage | — | — | — | — | — |
| `home/WhyStudio.tsx` | **Replace** | B community pulse | same | Honest framing; no invented claims | — | — | — | — |
| `home/FreeTrialCta.tsx` | **Replace** | B `PulseCta` / ctaBand | same | Single strong trial path | Conversion | Press feedback | Spring island | — |
| `home/TimetablePreview.tsx` | **Refactor** | Utility zone | same | Filters/links to `/timetable` | Entry point | Forms a11y | SSR | — |
| `home/FaqSection.tsx` | **Refactor** | Utility/calm | same | FAQ content | FAQPage JSON if present | Expandable a11y | — | — |
| `home/CommunityTestimonials.tsx` | **Refactor** | Community zone | same | Provenance / mock labels | — | — | — | — |
| `home/TestimonialCard.tsx` | **Refactor** | Less card chrome | same | — | — | — | — | — |
| `home/TransformationStories.tsx` | **Refactor** | Honest placeholder | same | Mock disclaimer | — | — | — | — |
| `home/FounderStoryPlaceholder.tsx` | **Refactor** / fold into community | — | optional merge | No invented bio | — | — | — | — |
| `home/TrustStrip.tsx` | **Delete** from homepage | — | stop using | Avoid fake trust metrics | — | — | — | — |
| `home/MockDisclaimer.tsx` | **Preserve** | — | same | Disclaimer text | Honesty | — | — | — |
| `motion/ScrollReveal.tsx` | **Delete** from homepage | — | unused on `/` | File may remain for later purge | — | — | Drop scroll JS | — |
| `motion/TextReveal.tsx` | **Delete** from homepage | — | unused on `/` | — | — | — | — | — |

### Promote from Revamp B (new production files — copies of ideas, not edits to frozen)

| Prototype | Promote to | Notes |
|---|---|---|
| `BeatStrip` | `src/components/home/pulse/BeatStrip.tsx` | Client island; reduced-motion static |
| `TempoLane` patterns | `src/components/home/pulse/TempoLane.tsx` | Keyboard link; family tempo |
| `PulseCta` | `src/components/home/pulse/PulseCta.tsx` | Trial press feedback |
| Layered mock media | `src/components/home/pulse/PulseMediaPlate.tsx` | Art-directed placeholders |
| Lane/hero CSS ideas | `src/components/home/pulse/pulse-home.module.css` | Production-scoped; may use global Pulse tokens |

**Server-rendered:** homepage page shell, programme/branch lists as server components wrapping client islands for motion only.

---

## UI primitives (this pass)

| File | Action | Notes |
|---|---|---|
| `ui/Button.tsx` | **Refactor** | Coral primary; no soft shadow; press scale |
| `ui/Card.tsx` | **Refactor** | Flat / hairline — no soft lift default (secondary routes still import) |
| `ui/Badge.tsx` | **Refactor** | Provenance / tempo, not decorative pills |
| `ui/Typography.tsx` | **Refactor** | Display → Bebas token; body → Space Grotesk |
| `ui/Section.tsx` / `Container.tsx` | **Refactor** | Band spacing; zone data-attribute support |
| `ui/MediaFrame.tsx` | **Refactor** | Sharper crops; less radius |
| `forms/Field.tsx` | **Preserve** API; token cascade | Utility contrast |

---

## Out of scope this pass (do not redesign)

`programs/**`, `locations/**`, trainers, pricing, blog, about, contact/trial **page layouts** beyond token cascade and shell chrome. Forms, SEO libs, content schemas, sitemap/robots, structured-data builders — **preserve**.

---

## Homepage target information architecture

1. Pulse hero — what the studio is  
2. Tempo programme discovery  
3. Community / philosophy framing  
4. Branch nodes  
5. Timetable entry (utility)  
6. Honest evidence / placeholder (transformations or testimonials with provenance)  
7. One strong trial band  
8. FAQ  
9. Footer (via shell)

No trial CTA after every section. No equal card grid. No TrustStrip fake metrics.
