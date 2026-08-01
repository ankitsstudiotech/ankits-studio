# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are working adults and parents in **Airoli, Ghansoli, or Thane**, usually on a **mobile phone**, trying to decide quickly:

- Is there a suitable programme for me or my child?
- Is there a trustworthy branch nearby?
- What are the timings?
- How can I book a trial?

Core audiences:

- Working adults considering strength training, personal training, yoga, or Zumba
- Women looking for welcoming group fitness, yoga, Zumba, or dance options
- Parents looking for credible kids’ dance or fitness classes
- Families who may use different programmes within the same studio

Primary conversion: **book a trial class**. Secondary: WhatsApp, call the relevant branch, view directions.

Design for **mobile-first local discovery** without feeling like a basic business-directory site.

## Product Purpose

Ankit’s Studio needs a premium, motion-capable marketing website that supports local SEO and helps neighbourhood visitors discover programmes and branches, trust the studio, check timings, and book a free trial — while most business facts remain unverified until the owner confirms them.

Success means a visitor can complete that discovery → trust → trial path on a phone without being misled by placeholder data, and without the brand reading as a generic gym, soft wellness template, or children’s dance school alone.

## Positioning

**Hypothesis (not a verified public claim — Ankit has not confirmed this wording):**

> Ankit’s Studio brings strength, fitness, yoga and dance together in one energetic neighbourhood studio experience for adults, children and families.

Intended differentiation is **coherence**: different forms of movement belong to one intentional studio community, not unrelated services dumped on one page. Availability of “many classes” alone is not the differentiator.

**Unresolved — requires confirmation from Ankit:** a truly defensible unique differentiator (methods, credentials, outcomes, tenure, member proof, etc.) is **not established**. Future work must **not invent** unique coaching methods, personalised attention, transformation outcomes, years of experience, certifications, member numbers, ratings, awards, or superior results until Ankit verifies them. Until then, treat “one coherent multi-discipline neighbourhood studio” as a positioning hypothesis only.

## Operating Context

- Local discovery around Navi Mumbai / Thane neighbourhood branches
- Programme browsing (strength, personal training, yoga, Zumba, adult dance, kids dance, weight-loss / general fitness)
- Branch pages with contact / directions gated until verified
- Illustrative timetable filters; trial booking and contact forms
- Stakeholder **mock preview** deploys (`ALLOW_MOCK_PUBLISH`) that stay visually labelled and `noindex` / `nofollow`
- Owner verification workflow via `docs/BUSINESS-DATA-STATUS.md` before anything is treated as live fact

## Capabilities and Constraints

### Confirmed capabilities

- Marketing routes for home, programmes, locations, timetable, trial, contact, plus Tier 2/3 surfaces (trainers, pricing, transformations, blog samples)
- Typed content model with provenance (`mock` / `reference-only` / `verified`)
- Server-rendered primary content; Motion as **client islands** (not full-page client shells)
- Lead adapters that fail closed / stay honest in demonstration mode
- Crawlable bidirectional links between programmes and locations
- Branch-oriented local SEO architecture (pair landings still backlog where documented)

### Hard constraints — must never break or invent

- Separation of mock, partially verified, and verified business data
- Development / mock-preview visual labels
- Mock-preview `noindex, nofollow` and `robots.txt` crawl discouragement
- Production safeguards that block publishing mock information as real
- Existing programme and location content models
- Existing route structure unless a documented UX or SEO reason justifies change
- Server-rendered primary content
- Page metadata, canonicals, sitemap, robots, and structured-data safety (omit-unless-verified)
- Crawlable internal links between programmes and locations
- WCAG 2.2 AA; keyboard navigation; reduced-motion support
- Mobile-first usability
- Core Web Vitals and performance budgets
- Form validation and lead-adapter honesty (no fake success / fake delivery)
- Trial-booking, WhatsApp, phone, and directions conversion paths
- Branch-specific local SEO architecture
- Clear handling of missing / “to be confirmed” information
- Distinction between real testimonials and presentation-only placeholders
- Ban on invented ratings, review counts, awards, prices, timings, trainer qualifications, and transformation claims

### Brand balance (non-negotiable tone)

- Must **not** become a generic bodybuilding-gym website
- Must **not** become a soft beige wellness template
- Must **not** become a children’s dance-school website alone
- Strength, yoga, Zumba, adult dance, and kids’ programmes must feel like parts of **one intentional brand**

### Architecture note — motion

“Motion as opt-in islands” means animation lives in appropriate client components so full Tier 1 pages are not forced client-rendered. It does **not** mean minimal or generic animation. Motion should be **substantial** where it improves storytelling, programme discovery, or emotional impact, while primary content remains server-rendered and usable without animation.

### Open decisions

- **Unique differentiator:** unresolved; needs Ankit’s confirmation (see Positioning).
- **Theme / editorial art direction:** Creative exploration may evaluate light, dark, or mixed editorial direction. Do **not** auto-introduce a theme switcher. Do **not** treat “light theme only” as a hard creative lock for Impeccable revamp work, even though an earlier ADR framed light-only as a v1 simplification for contrast workload. Record any chosen launch theme after exploration, with accessibility contrast checked against the chosen surfaces.
- Thane branch existence and public listing remain owner-gated.
- Real lead provider and production domain remain unset for mock preview.

## Brand Commitments

- Business name: **Ankit’s Studio** (owner-confirmed)
- Confirmed programme set: strength training, personal training, yoga, Zumba, adult dance, kids dance, weight-loss / general fitness
- Confirmed / expected locations: Airoli, Ghansoli; Thane expected but not fully defined
- Voice direction from project brief: premium, energetic, modern, human, community-driven — strong without generic gym cliché
- One shared visual system with programme-level accent families (`strength` / `calm` / `high-energy`), not per-programme sub-brands (existing design-system approach in `docs/DESIGN-DIRECTION.md`)

## Evidence on Hand

**Real / confirmed enough to structure the product:**

- Programme names listed above
- Airoli and Ghansoli as publicly listed branch names; Thane as reference-only / not publicly listed until confirmed
- Owner-supplied Google Maps pins (reference only — not assigned to branches; not printable verified addresses): see `docs/BUSINESS-DATA-STATUS.md`
- Motion benchmark reference URL supplied by owner (inspiration only)

**Must not fabricate:**

- Verified addresses, phones, WhatsApp numbers, hours, fees, trainer identities / qualifications
- Real testimonials, transformation results, member counts, ratings, awards
- Live lead delivery, analytics IDs, or production custom-domain claims in mock preview
- Any “unique method” or outcome claim until Ankit verifies

Mock and sample content is labelled in-product; sample blog posts are forced `noindex`.

## Product Principles

1. **Honesty over polish** — Never present mock or unverified facts as live studio truth; missing data stays visibly pending.
2. **One studio, many movements** — Strength and dance/yoga/kids share one coherent brand community, not a directory of unrelated services.
3. **Mobile local discovery → trial** — Phone-first path from programme/branch trust to booking a trial; secondary contact actions stay branch-honest.
4. **Server truth, motion for feeling** — Primary content and SEO surfaces stay server-rendered and usable without JS animation; motion may be bold where it earns attention.
5. **Local SEO without fake entities** — Structured data, sitemaps, and contact actions omit or gate anything unverified.

## Accessibility & Inclusion

Target **WCAG 2.2 Level AA** across routes (project acceptance gate): skip link, keyboard operability, visible focus, 44×44 touch targets, focus traps for drawers/modals, live regions for filter/form status, reduced-motion alternatives, and contrast that passes for whichever editorial theme is chosen after exploration.
