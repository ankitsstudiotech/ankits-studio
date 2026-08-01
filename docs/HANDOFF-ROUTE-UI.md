# Route UI Handoff — Programme & Location Presentation

_Last updated: 2026-07-31_

## Scope

Reusable **presentation** components for programme and location detail pages.
No App Router marketing routes under `src/app/programs` or
`src/app/locations` were added (ownership boundary). No `src/content` or SEO
modules were touched.

## Surfaces

| Area | Path |
|---|---|
| Programme UI | `src/components/programs/**` |
| Location UI | `src/components/locations/**` |
| Map placeholder | `src/components/maps/**` |
| Branch timetable | `src/components/timetable/**` |
| Design lab | `/design-lab/programs`, `/design-lab/locations` |

## Behaviour notes

- **Typed props only** — page layers map content accessors → these props.
- **No direct mock imports** — lab fixtures live beside the lab pages.
- **Server components by default** — FAQ uses native `<details>`; no client
  islands required for these sections.
- **“To be confirmed”** — `PendingValue` / `isToBeConfirmed` treat blank and
  the literal `To be confirmed` as pending (italic + SR hint).
- **Contact actions** — `ContactActionGroup` disables Call/WhatsApp/Directions
  when `href` is `null` (ADR-011). Never invents `tel:` / `wa.me`.
- **Maps** — `MapPlaceholder` never iframes; accessible fallback copy points
  at address/directions sections.
- **Motion** — optional `ScrollReveal` only in design-lab wrappers; section
  components themselves stay static/SSR-friendly and respect
  `prefers-reduced-motion` on CSS transitions.

## Integration (Claude / route scaffolding)

1. Build `/programs/[slug]` and `/locations/[slug]` server pages.
2. Load records via `@/content` accessors.
3. Pass `getBranchContactLinks(branch)` results into `ContactActionGroup`
   (`href` null until verified).
4. Omit map embeds until verified; keep `MapPlaceholder` meanwhile.
5. Do not list Thane in public nav until `publiclyListed` is true.

## QA

Design-lab fixtures inspected at 390×844, 768×1024, 1440×900, 1920×1080.
Checks: lint, type-check, unit tests, build (`ALLOW_MOCK_PUBLISH=true`).
