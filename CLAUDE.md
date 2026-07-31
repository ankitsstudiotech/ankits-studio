@AGENTS.md

# Claude Code notes for Ankit's Studio

`AGENTS.md` (imported above) is the primary, tool-agnostic instruction file and
is also read by Cursor — treat it as authoritative. This file adds only what's
Claude-Code-specific. If anything here ever conflicts with `AGENTS.md` or
`docs/DECISIONS.md`, those two win; fix this file.

## Fastest orientation path

1. `docs/PROJECT-BRIEF.md` — what this project is.
2. `docs/HANDOFF.md` — current phase, what's next, open owner questions.
3. `docs/TASKS.md` — what's claimed, what's available to pick up.
4. `docs/DECISIONS.md` — why things are the way they are, before proposing a
   change to stack, data model, design system, or motion approach.

## The five rules most likely to matter in a given session

- **Mock data is never presented as real.** Every record in
  `docs/BUSINESS-DATA-STATUS.md`'s domains needs `dataStatus` +
  `mockDisclaimer` per `docs/CONTENT-MODEL.md`. Don't write a plausible fake
  phone number, price, or trainer name without wiring the disclaimer alongside
  it.
- **Don't flip a `BUSINESS-DATA-STATUS.md` row to `VERIFIED`.** That's the
  owner's call only — see `docs/DECISIONS.md` ADR-002.
- **Don't touch the launch-gate mechanism (ADR-002)** — type-level provenance,
  the mock banner, the CI readiness check, the indexing gate — without a new
  ADR that explicitly supersedes it.
- **Claude Code's default zone** is `docs/**`, the content/data layer
  (`src/content/**`, `src/lib/content/**`), and route scaffolding
  (`src/app/**` structure, server components, metadata, structured data).
  Component-level visual/motion polish is Cursor's default zone. Claim
  cross-zone work in `docs/TASKS.md` before starting — full table in
  `AGENTS.md`.
- **Read the Next.js docs under `node_modules/next/dist/docs/` before writing
  App Router code** — this project's Next.js version has breaking changes vs.
  training data (see the banner at the top of `AGENTS.md`).

## Working style for this project

- Prefer editing an existing doc over creating a new one; if a new governance
  doc seems needed, check it isn't better as a section in an existing doc
  first, and add it to the index in both `AGENTS.md` and
  `docs/PROJECT-BRIEF.md` if you do create one.
- Any change to `docs/CONTENT-MODEL.md` types ships with a `docs/DECISIONS.md`
  entry in the same change — not after.
- Any new GSAP or WebGL usage ships with a `docs/DECISIONS.md` entry justifying
  it against `docs/MOTION-SYSTEM.md`'s criteria, in the same change.
- Accessibility (`docs/ACCESSIBILITY-STANDARDS.md`) and performance
  (`docs/PERFORMANCE-BUDGET.md`) gates are checked per-route as it's built, not
  deferred to a final pass.
- This repo has no test suite yet (stock `create-next-app` scaffold). Don't
  assume one exists — check `package.json` before referencing test commands.
