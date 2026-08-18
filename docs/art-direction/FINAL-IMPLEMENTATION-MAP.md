# Final implementation map

Audit of current production (`57264c1560722abfb7aaba2b65706c0c9f5ad044`, live https://ankits-studio.vercel.app) against `docs/art-direction/ankits_studio_final_art_direction_pack/ankits_studio_final_art_direction_pack/FINAL_ART_DIRECTION_BLUEPRINT.md`.

**Priority when anything conflicts:** production truth / a11y / conversion / Google policy → blueprint → existing Studio Pulse → Variant → Stitch.

**Content lock:** every visible word stays production. Numeric indices (`01`–`08`) and existing taxonomy labels (TRAIN / MOVE / CELEBRATE / FOR TEAMS) are the only presentational additions.

---

## Global chrome

### Header

| Field | Record |
|---|---|
| Current component | `SiteHeader.tsx` + `DesktopNav.tsx` + `MobileNav.tsx` |
| Current visual | Sticky field bar, brand left, primary nav, purple trial CTA right |
| Target | Quiet three-zone header: brand / structured nav / conversion. Hard bottom rule. No shadow. No rounded CTA. Current-route underline, not a pill |
| Variant used | Header zoning + sharp CTA (screenshot 0 / 1) |
| Stitch used | Tight height, underline active state (`stitch-programmes.png`) |
| Not copied | “CLAIM FREE TRIAL”, nav labels PROGRAMMES/LOCATIONS/THE FOUNDER/COMMUNITY, glass header |
| Shared primitive | `--header-height`, `.pulse-cta` radius 0, accent fill |
| Responsive | Desktop three-zone; mobile keeps existing menu architecture |
| Risks | Changing CTA label would leak Variant copy — keep `Book a free trial on WhatsApp` |

### Footer

| Field | Record |
|---|---|
| Current component | `SiteFooter.tsx` via `ResolvedSiteFooter.tsx` |
| Current visual | Dark Pulse footer, Explore / Programmes / Branches + brand/contact |
| Target | Four-column editorial grid, 1px vertical rules, AI disclosure, optional low-contrast `ANKIT'S STUDIO` wordmark |
| Variant used | Four-column architecture (`FREE TRIAL NOW` footer screenshot) |
| Stitch used | Oversized quiet wordmark (`stitch-home.png` / `stitch-locations.png`) |
| Not copied | Facebook, Careers, Yoga & Pilates, Zumba & Dance, fake phone, “DESIGNED FOR MOVEMENT”, “MOVEMENT CULTURE” |
| Shared primitive | Footer groups from production navigation + programmes + branches |
| Responsive | 2-col mobile, 4-col xl |
| Risks | Footer must not promote withheld `/trainers` `/transformations` `/blog` |

### Closing conversion

| Field | Record |
|---|---|
| Current component | `ClosingBand.tsx` (`accent` / `field`) + Home `FreeTrialCta` |
| Current visual | Copy left, action right; Home uses purple accent band |
| Target | Large current heading ~7–8 cols, strong right action; purple band allowed for conversion |
| Variant used | Closing scale (`FREE TRIAL NOW`) |
| Stitch used | Full-width conversion chapter, not poster gimmicks |
| Not copied | INITIATE PROTOCOL, CLAIM ACCESS, WhatsApp green dual-button, invented slogans |
| Shared primitive | `ClosingBand` + production CTA labels (trial / corporate enquiry / trainer availability) |
| Responsive | Stack on mobile; no giant empty band |
| Risks | Consumer vs corporate vs trainers semantics must stay |

---

## A. HOME `/`

| Section | Current component | Current treatment | Target | Variant | Stitch | Not copied | Primitive | Responsive | Risks |
|---|---|---|---|---|---|---|---|---|---|
| Hero | `Hero.tsx` | Text-led H1; desktop media blend under copy | Full-width dark hero; H1 cols 1–8; media cols 6–12 overlap; CTA with copy; ≤2–3 faint vertical rules | Oversized type + full-field confidence (`MOVEMENT REDEFINED`) | Media/text integration, monochrome restraint | “Movement Culture”, “Movement Redefined At Scale”, purple word-block, invented manifesto | `--text-hero`, `.heroGuides`, `PulseMedia` `home.hero` | Mobile: media then copy; H1 ≤ ~3.5 lines; CTA follows copy | Do not invent headline; keep overlay readable |
| Programmes | `ProgrammeShowcase.tsx` + `ProgrammeRow` `layout="module"` | Clustered rows / evolving matrix | 8-module framed field, `01–08`, taxonomy labels, purple hover fill, 4×2 / 2×4 / 1-col | `OUR SPECIALITIES` numbered modules | Module rhythm only | Kickboxing, Yoga & Mindfulness, Zumba & Dance, Online Coaching, icons, SaaS cards | `ProgrammeRow` module + `.moduleMatrix` | 1920/1536: 4×2; 768: 2×4; 390: compact rows not 70vh tiles | Keep 8 production names + TRAIN/MOVE/CELEBRATE/FOR TEAMS |
| Locations | `BranchExplorer.tsx` | Numbered 2×2 locality rows | Editorial directory, `01–04`, large names, hours/landmark/Maps/studio | Directory typography (not METRO) | 4-col mind, Home stays 2×2 to differ from `/locations` | METRO illustration, fake branch names | `.branchRows` framed cells | 390: 1-col; 768+: 2×2 | Real hours/landmarks only |
| Reviews | `GoogleReviewProof.tsx` + `GoogleReviewsRail.tsx` | Live Places rail, Google attribution | Horizontal editorial rail, 3 visible at 1536, author-led type, 1px separators | Review strip (authors + vertical rules) | Restraint, no quote marks | Fake reviews, giant quotes, testimonial cards | Existing Places adapter; `contain: paint` | Mobile: 1 snap + Prev/Next | Google policy, no Review JSON-LD, no invented copy |
| Founder | `FounderHomeMoment.tsx` | Typography-led name + chronology | Name 5–7 cols; story/chronology secondary; no giant 2019 on Home | Photo/type *ratio* only | Vertical FOUNDER label rejected as gimmick | Fake portrait, fake quote, cream theme break | Existing founder copy from `page.tsx` | Stack on mobile | Keep Ankit Nalawade hierarchy |
| FAQ | `FaqSection.tsx` | Accordion | Utility-calm; inherit tokens/rules only | — | — | Numbering every Q | `FaqBlock` | Linear | No copy rewrite |
| CTA | `FreeTrialCta` → `ClosingBand` accent | Purple conversion band | Large type + cream primary CTA | Closing scale | — | New CTA words | `ClosingBand` | Stack | Keep WhatsApp trial label |

---

## B. ABOUT `/about`

| Field | Record |
|---|---|
| Current | `about/page.tsx` + `about.module.css` — independently passed opening, 2019 motif, founder story, team, AI visuals |
| Target | Stronger type scale; 12-col alignment; chapter markers `01–03` on major sections only; community image editorial; keep 2019 on About |
| Variant | Founder split *ratio* only |
| Stitch | Chapter cues, not fake portrait |
| Not copied | Fake founder photo/quote, cream founder slab |
| Primitive | `.chapterMark`, existing `getStudioAbout()` copy |
| Responsive | Opening grid collapses; community image stacks |
| Risks | Founder portrait remains verified-real-only (`about.founder` resolves null). Do not imply community image is staff |

---

## C. PROGRAMME DISCOVERY `/programs`

| Field | Record |
|---|---|
| Current | `ProgrammeDiscovery.tsx` — was cluster rows sharing Home DNA |
| Target | Magazine index: strong left H1 block; 4 paired bands of 2 programmes; one media-dominant / one type-dominant; alternate orientation; `01–08`; not a Home matrix clone |
| Variant | Numbered programme confidence |
| Stitch | `stitch-programmes.png` alternating media/type + vertical chapter cues |
| Not copied | BOOK SESSION, FOCUS chips, invented categories STRENGTH/CARDIO/RECOVERY, Movement Culture intro |
| Primitive | `.pairSequence` / `.pairBand` / `.pairModule`; existing programme media slots; `editorial-mono` except Yoga/Zumba/Dance |
| Responsive | Sequential compact chapters on mobile |
| Risks | Keep production short descriptions and taxonomy; pairing order follows production programme order, not Stitch’s three-discipline edit |

---

## D. PROGRAMME DETAILS `/programs/[slug]`

Shared grammar: larger H1, facts in grid not cards, media framed, compact related, `ClosingBand`. Families stay distinct.

| Route | Family | Current | Target | Variant | Stitch | Not copied | Risks |
|---|---|---|---|---|---|---|---|
| `/programs/functional-training` | STRUCTURED | Split + technical meta rail | Stronger split; facts as technical rail | Numbered editorial opening | Alternating type/media | Fake equipment theatre | Keep machine-free facts |
| `/programs/zumba` | FLUID | Media-forward, colour | Keep colour; media occupies more field | — | Motion imagery (production media only) | “Zumba & Dance” merge | Do not grayscale |
| `/programs/adult-dance` | FLUID | Related to Zumba, distinct crop | Same family, different crop/title scale | — | — | Merging with Zumba | Kids-only meta stays |
| `/programs/yoga` | CALM | Breathing room, quieter | Keep calm; do not aggressive-ize | — | Recovery module pacing only | High-intensity Stitch tone | Colour retained |
| `/programs/wedding-choreography` | SERVICE cinematic | Ceremonial type | More cinematic media, practical facts | — | — | Fake event photos | Enquiry-only truth |
| `/programs/home-personal-training` | SERVICE intimate | Compact service | Intimate, practical | — | — | “Elite coaching” Variant line | Locality enquire copy |
| `/programs/online-training` | SERVICE remote | Compact | Practical Zoom truth | — | — | “Online Coaching” / “Global standards” | |
| `/programs/corporate-wellness` | SERVICE B2B | Direct/B2B | Stay B2B; enquiry CTA not free trial | — | — | Consumer trial poster | Conversion intent lock |

Shared primitive: `ProgrammeDetailView` `data-compose-family` + `data-service-variant`. No new AI media.

---

## E. LOCATION DISCOVERY `/locations`

| Field | Record |
|---|---|
| Current | `LocationDiscovery.tsx` — atmosphere media + place rows |
| Target | Four vertical directory zones at 1536/1920; `01–04`; real address/hours/landmark; Maps + studio page; atmosphere remains a separate illustrative chapter |
| Variant | Left-directory confidence (reject METRO graphic) |
| Stitch | `stitch-locations.png` 4-column directory |
| Not copied | FLAGSHIP badges, fake amenities (STRENGTH AREA etc.), fake interiors, fake WhatsApp numbers |
| Primitive | `.studioDirectory` / `.studioColumn` |
| Responsive | Tablet 2×2; mobile 1-col numbered |
| Risks | Do not place atmosphere image inside a branch column as documentary |

---

## F. BRANCH DETAILS `/locations/{airoli-sector-19,airoli-sector-8,ghansoli,thane}`

| Field | Record |
|---|---|
| Current | `BranchDetailView.tsx` — independently passed hero family, Getting Here, available services, related |
| Target | Stronger `01–04` numeral, architectural rules, sharper type; no duplicated facts; compact service matrix |
| Variant | Directory numerals |
| Stitch | Per-branch action clarity |
| Not copied | Fake interiors, invented amenities |
| Primitive | `getBranchDirectoryNumeral()`, `.detailNum`, `.serviceIndex` |
| Responsive | Hero grid stacks; numeral shrinks on 390 |
| Risks | Address/hours/Maps/WhatsApp stay branch-true; ladies/kids guidance not duplicated as FAQ |

---

## G. REVIEWS (Home chapter; no standalone marketing route)

Covered under Home. Attribution: “Google Maps”, compact review-order metadata, per-review Maps + report links, Google avatars only when API provides them. No fake avatars.

---

## H. CONVERSION / UTILITY

| Route | Current | Target | Not copied | Risks |
|---|---|---|---|---|
| `/pricing` | `pricing.module.css` + enquiry builder | Tokens, 1px rules, 0-radius buttons, stronger H1; forms stay priority | Variant poster, visible graph-paper behind fields | Pricing/policy copy lock |
| `/timetable` | Batch availability builder | Same chrome; keep Q&A compact | Numbered editorial theatre | Availability enquire vs trial |
| `/trial` | Trial form | Utility-first; purple action | “Claim Free Trial”, Initiate Protocol | Form labels/a11y |
| `/contact` | Contact form | Utility-first | Over-designed fields | |
| `/book-a-free-trial` | Permanent redirect to `/trial` | Unchanged | — | Do not restyle a redirect |

Variant/Stitch: none as layout. Shared: header/footer/tokens only.

---

## I. LEGAL

| Route | Current | Target | Not copied | Risks |
|---|---|---|---|---|
| `/privacy-policy` | `LegalPage.tsx` | Calm measure; inherit header/footer/field/rules | Huge display type, grid wallpaper | Legal text lock |
| `/terms` | same | same | same | same |

---

## J. WITHHELD

| Route | Current | Target | Not copied | Risks |
|---|---|---|---|---|
| `/trainers` | Readiness / unavailable | Chrome + type + rules + CTA only | Fabricated trainer grid | No fake profiles |
| `/trainers/[slug]` | Detail if publishable | Same chrome | Fake portraits | Publishability gate |
| `/transformations` | Withheld | Chrome only | Fake before/after | |
| `/blog` | Studio notes readiness | Chrome only | Fake posts | |
| `/blog/[slug]` | Sample/withheld | Chrome only | Invented articles | |

---

## Design-system primitives touched

- `src/styles/tokens.css` — display/hero/title scale, `--layout-gutter` 20–64px, `--guide-line`
- `src/styles/studio.css` — `.editorial-frame`, `.editorial-guides`, `.editorial-mono`
- `ProgrammeRow` `layout="module"`
- `ClosingBand` scale
- Header underline active state
- Footer 4-col + wordmark

## Visible architectural guides (allowed locations only)

1. Home hero (≤3 vertical rules aligned to gutter / copy-media split)
2. Home programme matrix (cell 1px separators)
3. Home locations directory (cell 1px separators)
4. `/programs` pair bands (module 1px rules)
5. `/locations` 4-col separators
6. Google Reviews rail (vertical 1px between snaps)
7. Footer vertical rules

Not on: forms, legal body, every programme-detail paragraph.

## Media treatment

- Default discovery/index: grayscale + contrast, colour on hover (`editorial-mono`)
- Yoga / Zumba / Dance: keep colour
- Home hero: darkened/controlled, not dead gray
- About community: illustrative, not documentary
- Branch pages: no fabricated interiors
- No new image generation
