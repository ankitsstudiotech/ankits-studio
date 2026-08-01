# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are working adults and parents near **Airoli (Sector 19 & Sector 8), Ghansoli, or Thane**, usually on a **mobile phone**, trying to decide quickly:

- Is there a suitable programme for me or my child?
- Is there a trustworthy branch nearby?
- What are the timings?
- How can I book a free trial?

Core audiences:

- Adults considering functional training, yoga, Zumba, or dance
- Women looking for welcoming group fitness (including ladies-only batches where available)
- Parents asking about kids-only batches
- People considering wedding choreography, home personal training, or online training

Primary conversion: **book a free trial via WhatsApp**. Secondary: call the central enquiry number, find a branch, or use the trial form.

Design for **mobile-first local discovery** without feeling like a basic business-directory site.

## Product Purpose

Ankit’s Studio needs a premium, motion-capable marketing website that supports local SEO and helps neighbourhood visitors discover programmes and branches, trust the studio, check the operating window, and book a free trial — while remaining honest about addresses, batch timetables, and fees that are still pending confirmation.

Success means a visitor can complete that discovery → trust → trial path on a phone without being misled by placeholder data, and without the brand reading as a generic gym, soft wellness template, or children’s dance school alone.

## Positioning

**Owner-aligned differentiator (safe wording):**

> Machine-free, coach-led sessions adapted to individual needs and goals.

Do **not** promise outcomes. Do **not** publish certification or “highly qualified” claims until names, issuers, and applicable trainers are supplied.

Commercial priority (partial): owner wants to grow “fitness” — treat as likely Functional Training until clarified.

## Operating Context

- Local discovery around Navi Mumbai / Thane neighbourhood branches (four open locations)
- Programme browsing across owner catalogue + legacy migration-pending routes
- Branch pages with central enquiry inheritance; dial/Maps embed gated until branch records are fully verified
- Operating window 06:00–22:00 — **not** a detailed batch timetable
- Stakeholder **mock preview** deploys (`ALLOW_MOCK_PUBLISH`) that stay visually labelled and `noindex` / `nofollow`
- Owner verification workflow via `docs/BUSINESS-DATA-STATUS.md` and `docs/business/OWNER-DATA-MIGRATION-2026-08-01.md`

## Capabilities and Constraints

### Confirmed capabilities

- Marketing routes for home, programmes, locations, timetable, trial, contact, plus Tier 2/3 surfaces
- Typed content model with provenance (`mock` / `reference-only` / `verified`) plus owner-interview source metadata
- WhatsApp-primary conversion helpers with optional prefill fields
- Server-rendered primary content; Motion as **client islands**
- Lead adapters that fail closed / stay honest in demonstration mode
- Crawlable bidirectional links between programmes and locations

### Hard constraints — must never break or invent

- Separation of mock, partially verified, and verified business data
- Development / mock-preview visual labels and `noindex`
- Production safeguards that block publishing mock information as real
- No invented ratings, review counts, awards, trainer bios, or testimonials
- Do not treat Maps-scraped addresses/hours/ratings as printable verified facts
- Do not treat operating hours as batch timetable rows
- Do not claim WhatsApp delivery merely because a chat link opened
- WCAG 2.2 AA; keyboard navigation; reduced-motion support
- Mobile-first usability

### Brand balance (non-negotiable tone)

- Must **not** become a generic bodybuilding-gym website
- Must **not** become a soft beige wellness template
- Must **not** become a children’s dance-school website alone
- Strength/functional, yoga, Zumba, dance, and kids audiences must feel like parts of **one intentional brand**

### Open decisions

- Printable addresses for all branches; Sector 8 Maps link
- Taxonomy: Strength / Weight-loss / Kids Dance / in-studio PT vs Functional / Dance / Home PT
- Meaning of “grow fitness” and “2+ years”
- Certification details
- Service-specific pricing
- Real photography, video, testimonials
- Theme / editorial art direction remains Studio Pulse for production (ADR-014)

## Brand Commitments

- Business name: **Ankit’s Studio** (owner-confirmed)
- Logo descriptor: **Dance & Fitness** (lockup only — not legal name)
- Branches open: Airoli Sector 19, Airoli Sector 8, Ghansoli, Thane
- Central enquiry: **+91 93724 02074** (phone + WhatsApp)
- Operating window: **6:00 AM – 10:00 PM**
- Free trial; registration fee **INR 300**; programme fees pending
- Max group batch size **15**; ladies-only and kids-only batches available

## Evidence on Hand

**Owner-confirmed enough to structure the product:**

- Name, four open branches, central phone/WhatsApp, operating window, free trial, registration fee, batch size, audience options, service catalogue, differentiator wording, trainer count note
- Labelled Maps short links for Sector 19, Ghansoli, Thane (reference-associated after browser resolution)

**Must not fabricate:**

- Verified printable addresses, detailed batch slots, programme fee tables, trainer identities/certifications, testimonials, ratings, outcome claims

## Product Principles

1. **Honesty over polish** — Never present mock or unverified facts as live studio truth; missing data stays visibly pending.
2. **One studio, many movements** — Functional training, dance, yoga, and kids audiences share one coherent brand community.
3. **Mobile local discovery → WhatsApp trial** — Phone-first path to a free trial chat; form remains secondary; branch contact stays honest.
4. **Server truth, motion for feeling** — Primary content and SEO surfaces stay server-rendered; motion may be bold where it earns attention.
5. **Local SEO without fake entities** — Structured data, sitemaps, and contact actions omit or gate anything unverified.

## Accessibility & Inclusion

Target **WCAG 2.2 Level AA** across routes (project acceptance gate): skip link, keyboard operability, visible focus, 44×44 touch targets, focus traps for drawers/modals, live regions for filter/form status, reduced-motion alternatives, and contrast that passes for the Studio Pulse surfaces in production use.
