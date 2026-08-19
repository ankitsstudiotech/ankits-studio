# Final Art-Direction Audit — Before Fix (Independent, Claude Code)

**Audited:** live production, `https://ankits-studio.vercel.app`
**Commit at audit time:** `19939e2` ("feat: apply final editorial art direction across production routes") — confirmed via `git rev-parse HEAD`, matches the brief's stated "currently deployed" SHA.
**Auditor:** Claude Code, independent of Cursor's own self-report (`docs/art-direction/FINAL-AI-SLOP-RED-TEAM.md`, claimed P0=0/P1=0).
**Scope:** Phase A of the "Final Art-Direction Audit + Self-Correction" brief. Read-only — no application code was modified to produce this document.

## Method

- Full quantitative re-scan: 25 routes (22 main + `/trainers`, `/transformations`, `/blog`) × 8 viewports (360–1920) via `docs/visual-audit/claude-independent/scan.mjs` against live production, `reducedMotion: "reduce"`, explicit scroll-through before each capture. 200 screenshots, 0 capture errors.
- Fresh ranked flag list via `analyze.mjs` (175 flagged instances ≥1200px width) — reviewed in full, not just re-cited from prior batches.
- New site-wide trust-boundary sweep (`docs/art-direction/claude-independent/content-lock-check.mjs`): fetched live rendered text for all 27 routes (the 25 above + `/book-a-free-trial` redirect + a deliberate 404 probe) and grepped for every banned Variant/Stitch phrase in the blueprint (§2) — **full site**, not the 17-route sample Cursor's own capture script covered.
- New independent axe-core sweep (`docs/art-direction/claude-independent/axe-check.mjs`) against live production (not a local build) across 25 routes.
- Direct source review: `git show --stat 19939e2`, every touched CSS module, `src/styles/tokens.css`, grid-line utility usage, purple/accent token usage census.
- Live interaction checks via Chrome DevTools MCP: programme-matrix hover/active fill, nav underline hover, mobile matrix behaviour, header breakpoint.
- Direct visual review of fresh screenshots for the brief's priority surfaces: Home (hero, matrix, locations, founder), `/programs` (pair bands), `/locations` index, a branch detail (Airoli Sector 19), `/about`, a programme detail per family (Yoga = Calm), `/pricing`, `/trainers`, `/transformations`.
- One self-caught methodology error, disclosed for transparency: an early Chrome DevTools MCP full-page screenshot of `/programs` appeared to show 3 of 8 programme images as blank near-black boxes. Cross-checked against (a) the trusted `scan.mjs` pipeline's screenshots at 390 and 1536, both fully clean with all 8 images rendering, and (b) a fresh page load + settle wait, which showed a *different* set of images blank each time. Root-caused as a lazy-image-load race specific to that MCP tool's full-page capture timing, not a live rendering defect — **not included below as a finding**.

## Findings

| ID | Route | Section | Viewport | Finding | Severity | Why it's a problem | Reference principle | Recommended correction |
|---|---|---|---|---|---|---|---|---|
| F1 | `/about`, `/blog` (studio-notes), `/trainers`, `/transformations` (member-stories), `/privacy-policy` & `/terms` (legal), all 8 programme detail pages (`.legacyBody` in programme-pulse) | `.disciplineLink:hover`, `.linkList a:hover`, `.link:hover`, `.legacyBody a:hover` | N/A (interaction state, all viewports) | Six `:hover` CSS declarations across `about.module.css:391`, `studio-notes.module.css:91`, `trainers.module.css:166`, `member-stories.module.css:132`, `legal.module.css:76`, `programme-pulse.module.css:1271` set `color: var(--color-accent)` (raw `#6B2F7A`) directly instead of `var(--color-accent-label)`. Independently computed contrast against the `#0A0A0A` field: **~2.16:1** — confirmed via manual WCAG relative-luminance calculation, matching Cursor's own self-reported number for raw accent-on-field. Fails WCAG 2.2 AA's 4.5:1 threshold for normal text. Screenshot evidence: `docs/art-direction/claude-independent/evidence/p2-hover-contrast-about-disciplinelink.png`. | **P2** | Real, testable a11y-standard violation (`docs/ACCESSIBILITY-STANDARDS.md` requires WCAG 2.2 AA) on an interactive state. Axe-core's static analysis does not catch this because axe cannot evaluate `:hover` pseudo-states — its 0-contrast-violation result (see below) does not contradict this finding. Impact is limited (hover-only, transient, link remains legible via underline/weight at rest) so this does not block core usability. | Blueprint §3.1: purple "should not become... " implies deliberate, readable use; the project's own `--color-accent-label` token exists specifically to solve this (already correctly used for eyebrow/index labels in 6 other files). | Replace `var(--color-accent)` with `var(--color-accent-label)` in all 6 declarations. Independently verified via relative-luminance calculation: `--color-accent-label` reaches ~8.3:1 against `#0A0A0A`, comfortably clearing AA (and AAA). Zero content change, zero risk to any other system. |

No P0 and no P1 findings were identified anywhere in scope.

## Reviewed and cleared (documented for transparency, not fixed)

These were investigated because research surfaced them as plausible risks, or because the scanner flagged them — each was independently verified live and found **not** to be a defect:

1. **Dead/duplicate grid-line CSS** (`.editorial-guides`, `.editorial-frame` in `src/styles/studio.css`) — confirmed zero usages anywhere in `src/`. Source-level check confirms the Home hero's `.heroGuides` is the *only* implementation of the decorative vertical-guide-line device (blueprint §3.4/§7.1), and it is correctly scoped to the one whitelisted surface that uses it. The other 6 whitelisted surfaces (Home matrix, Home locations, `/programs` pair bands, `/locations` index, Reviews rail, Footer/closing) instead use plain 1px cell/column separator borders — a different, also blueprint-sanctioned pattern (§3.3 base geometry), confirmed visually on `/locations` and `/programs`. **P3** (code hygiene only — orphaned CSS, zero visual impact); not touched.
2. **Programme-hero scanner flags** (all 8 programme detail pages, top of the fresh flag list) — this is the same row-clustering tooling artifact established independently in the Batch 05 audit (a tall hero image clusters as a separate "row" from adjacent text, inflating `flaggedBandHeight` even when well-integrated). Re-confirmed this session via direct visual inspection of the Yoga hero (`programs_yoga__1536x730.png`): image and text are cleanly side-by-side, no real dead space. Not a defect.
3. **`CONTENT-REGRESSION.json`'s flagged JSON-LD diff** on `/programs/functional-training` — independently confirmed live: the rendered page has 6 `application/ld+json` script tags present. The diff was a capture-timing/innerText artifact in Cursor's own tooling, as it guessed but did not verify.
4. **Legacy Tailwind `bg-accent` components** (`LocationHero.tsx`, `ProgrammeHero.tsx`, `BenefitsSection.tsx`, `EquipmentSection.tsx`, `AvailableLocationsSection.tsx`, `ContactActionGroup.tsx`, `LocationFaq.tsx`) — grepped for all importers; confirmed reachable only from `src/app/design-lab/{locations,programs}`, an internal preview area explicitly out of scope (`docs/TASKS.md`: "do not touch `/design-lab/revamp-*`") and not part of the site's route map. Not reachable from any live marketing route. No action.
5. **About founder chronology** (`2019/2021/2023/Airoli Sector 19`, `2021/Airoli Sector 8`, `2023/Ghansoli`, `2026/Thane`, hand-authored in `about.module.css`'s page markup) — cross-checked byte-for-byte against `src/content/mock/branches.ts`'s `openingYear` fields per branch slug: exact match. Not a live inaccuracy. **P3** note only: this list isn't derived from the same data Home's founder section pulls from, so a future data change could silently desync it — not urgent, not touched.
6. **Content-lock sweep**: 0 confirmed Variant/Stitch leaks across all 27 routes. One substring false-positive on `/trainers` (`"Fitness, Yoga, Zumba & Dance"` — a genuine, real prose list joined by "&", not a merged fake programme name) — reviewed and cleared.
7. **Axe-core sweep**: 0 serious/critical violations, 0 static contrast violations across 25 live routes — independently reconfirms Cursor's own claim at the resting-state level (does not cover F1's hover-only gap, which axe cannot detect).
8. **Purple/accent census + interaction check**: hover/active fill on the Home programme-matrix module confirmed to work exactly as specified (purple fill, text contrast flips to white/cream) — matches blueprint §7.2 precisely. No overuse found; purple stays reserved for conversion, active state, and small index/label accents across the 19 files that reference it.
9. **`/pricing` and `/transformations` asymmetric two-column height** (flagged by the scanner as large right-empty bands) — visually confirmed as the normal, acceptable pattern of a shorter-but-complete sibling column (a finished form; a shorter branch list) next to a longer text column, not a dead-space defect. Consistent with the prior Batch 06 finding that Pricing has genuine, substantial content.
10. **CTA family `internal-gap>280px` flags** at 1920px (Home, About, `/trainers`, several programme/branch closings) — same normal copy-left/action-right breathing room already reviewed and accepted in the Batch 06 audit; reconfirmed, not new.

## Severity totals

- P0: **0**
- P1: **0**
- P2: **1** (F1 — hover-state contrast token)
- P3: **2** (dead CSS utility; hardcoded-but-accurate chronology) — not fixed per brief §34 ("do not chase P3")

## Scope freeze

This is the frozen scope for Phase C. Only F1 will be fixed. Nothing else in this document is in scope for code changes.
