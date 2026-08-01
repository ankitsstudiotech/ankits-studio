<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all
differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ankit's Studio — Agent Instructions

This file governs any AI coding agent working in this repo (Claude Code, Cursor,
or otherwise). It is deliberately tool-agnostic. Claude Code additionally reads
`CLAUDE.md`, which restates the hard rules below concisely — the two files must
never contradict each other; if they do, `docs/DECISIONS.md` is the tiebreaker.

## What this project is

A premium, motion-rich, local-SEO website for Ankit's Studio (fitness + dance,
multi-location). Full context: `docs/PROJECT-BRIEF.md`. Current delivery phase
and next steps: `docs/HANDOFF.md`. Full doc set: `docs/` (index below).

## Hard rules (non-negotiable, apply to every session)

1. **Never invent business facts and present them as real.** Addresses, phone
   numbers, fees, timings, trainer qualifications, testimonials, transformation
   results, member counts, and opening hours are unverified per
   `docs/BUSINESS-DATA-STATUS.md`. Any content in those domains must carry
   `dataStatus: "mock"` and a `mockDisclaimer` per `docs/CONTENT-MODEL.md` — never
   write a "real-looking" placeholder without the disclaimer wired up.
2. **Never mark a `docs/BUSINESS-DATA-STATUS.md` row `VERIFIED` yourself.** Only
   the business owner (or an explicit, quotable instruction relaying their
   confirmation) can do that.
3. **Never bypass or weaken the launch gate.** The mechanism in
   `docs/DECISIONS.md` (ADR-002) — type-level provenance, the UI mock banner, the
   CI launch-readiness check, and the indexing gate — exists specifically to stop
   an accidental production launch with mock data. Do not remove, disable, or
   special-case around any layer of it without a new `docs/DECISIONS.md` entry
   explicitly superseding ADR-002.
4. **All SEO-relevant content is server-rendered.** No client-fetch-and-paint for
   programme, branch, pricing, trainer, timetable, or blog content. See
   `docs/SEO-STRATEGY.md`.
5. **Stack**: Next.js App Router, TypeScript strict mode, Tailwind. See
   `docs/DECISIONS.md` ADR-001. Read the App Router guide under
   `node_modules/next/dist/docs/` before writing route code — see banner above.
6. **Animation**: Motion is the default library, but it's an opt-in client
   island, not a root-layout default — never wrap a whole Tier 1 SEO landing
   page in it, never gate the LCP element behind client JS. GSAP only for the
   specific complex-timeline cases in `docs/MOTION-SYSTEM.md`, each usage
   logged as a `docs/DECISIONS.md` entry. No WebGL unless a demonstrated
   business benefit is logged the same way. See ADR-005 and ADR-009.
7. **Design system is one shared system**, not per-programme sub-brands — see
   `docs/DESIGN-DIRECTION.md` and ADR-004. Don't build a separate visual language
   for yoga/dance vs. strength.
8. **Accessibility and performance gates are per-route, not end-of-project.**
   See `docs/ACCESSIBILITY-STANDARDS.md` and `docs/PERFORMANCE-BUDGET.md`. A route
   isn't done until it passes its gates.
9. **Any change to `docs/CONTENT-MODEL.md` types requires a `docs/DECISIONS.md`
   entry in the same change.** Data contracts aren't changed silently.

## Ownership rules for parallel Claude Code / Cursor work

Both tools may work in this repo across different sessions. To prevent silent
conflicting edits, ownership is split by default zone, with an explicit claiming
protocol in `docs/TASKS.md` for anything crossing a zone boundary.

| Zone | Default owner | Covers |
|---|---|---|
| `docs/**` | Claude Code | All governance/planning docs |
| Content/data layer (`src/content/**`, `src/lib/content/**`, types in `docs/CONTENT-MODEL.md`) | Claude Code | Mock data, content types, the accessor layer |
| Route scaffolding (`src/app/**` file/folder structure, server components, metadata, structured data) | Claude Code | New routes, SEO wiring, App Router structure |
| Component visual/motion implementation (styling, Tailwind classes, Motion/GSAP animation code inside already-scaffolded components), and the global design-tokens file | Cursor | UI polish, interaction detail, responsive behavior, palette/type/spacing/accent tokens |

Rules:

- **Claim before you edit outside your default zone.** Add/update a row in
  `docs/TASKS.md` with your agent name and `In progress` before touching a file
  another zone owns, or a shared file (e.g. a type both layers depend on).
- **Never edit a file another agent has marked `In progress`** in
  `docs/TASKS.md`. Wait, or get an explicit handoff.
- **Data contract changes always go through Claude Code's zone** (or at minimum
  require the `docs/DECISIONS.md` entry from Hard Rule 9) — Cursor should not
  reshape `CONTENT-MODEL.md` types to make a component easier to style.
- **On completion**, mark the task `Done` in `docs/TASKS.md` with the commit
  reference.

## Route map

Full detail, tiering, and rationale: `docs/INFORMATION-ARCHITECTURE.md`. Summary:

- Tier 1 (build first): `/`, `/programs`, `/programs/[slug]`, `/locations`,
  `/locations/[slug]`, `/timetable`, `/trial`, `/contact`.
- Tier 2: `/trainers`, `/trainers/[slug]`, `/pricing`, `/transformations`.
- Tier 3 (deferrable, stub acceptable): `/blog`, `/blog/[slug]`.

## Doc index

| Doc | Purpose |
|---|---|
| `docs/PROJECT-BRIEF.md` | What this project is, constraints, doc map |
| `docs/BUSINESS-DATA-STATUS.md` | Ground truth: what's real vs. mock, verification workflow |
| `docs/CONTENT-MODEL.md` | Typed data model, mock-data strategy |
| `docs/INFORMATION-ARCHITECTURE.md` | Routes, sitemap, nav, tiering |
| `docs/SEO-STRATEGY.md` | Local SEO, structured data, indexing policy |
| `docs/DESIGN-DIRECTION.md` | Visual system, tone, palette approach |
| `docs/MOTION-SYSTEM.md` | Motion/GSAP/WebGL rules |
| `docs/ACCESSIBILITY-STANDARDS.md` | WCAG target, acceptance gates |
| `docs/PERFORMANCE-BUDGET.md` | Core Web Vitals, bundle budgets, acceptance gates |
| `docs/IMPLEMENTATION-PLAN.md` | Phased delivery plan |
| `docs/DECISIONS.md` | ADR log — authoritative "why" |
| `docs/TASKS.md` | Live task board + claiming protocol |
| `docs/HANDOFF.md` | Current state, next steps, open questions |
| `docs/LAUNCH-READINESS.md` | Final verification: mock-preview vs production readiness |
| `docs/MOCK-PREVIEW-DEPLOYMENT.md` | Stakeholder mock preview: env, Vercel, checklist |
| `docs/CURSOR-ARCHITECTURE-REVIEW.md` | Independent architecture review; reconciled in `docs/DECISIONS.md` ADR-007–012 |

Read `docs/PROJECT-BRIEF.md` and `docs/HANDOFF.md` first in any new session.
