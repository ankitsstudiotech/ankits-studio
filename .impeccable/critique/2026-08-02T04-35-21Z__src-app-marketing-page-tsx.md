---
target: revised production homepage vs Studio Pulse
total_score: 25
max_score: 32
na_heuristics: 7,9
p0_count: 0
p1_count: 1
timestamp: 2026-08-02T04-35-21Z
slug: src-app-marketing-page-tsx
---
# Critique — revised production homepage vs frozen Studio Pulse

**Target:** `src/app/(marketing)/page.tsx` (+ `src/components/home/**`)  
**Comparators:** frozen `/design-lab/revamp-b`; prior critique **20/32** (2026-08-01T15-34-04Z)  
**Mode:** Persuade  
**Live:** `http://localhost:3000/`

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Mock banner honest; WhatsApp caveats repeated; sticky trial clear |
| 2 | Match System / Real World | 4 | Customer language; no TEMPO/HIT/HOLD/GROOVE/Utility on `/` |
| 3 | User Control and Freedom | 3 | Skip link; secondary form/studio paths; WhatsApp escape via browser |
| 4 | Consistency and Standards | 3 | Nav “Timetable” vs homepage “no full timetable yet” trust nibble |
| 5 | Error Prevention | 3 | Pending Sector 8 flag; no fake proof/timetable theatre |
| 6 | Recognition Rather Than Recall | 3 | Seven named services self-explanatory; long scan remains |
| 7 | Flexibility and Efficiency | n/a | Persuade landing — power-user shortcuts not the job |
| 8 | Aesthetic and Minimalist Design | 3 | Distilled sequence; chrome + empty media plates still compete |
| 9 | Error Recovery | n/a | No form-error recovery surface on this landing |
| 10 | Help and Documentation | 3 | Short factual FAQ supports the trial decision |
| **Total** | | **25/32** | **Solid / improving** |

## Design Specificity Verdict

**LLM assessment:** Clearer and more commercial than frozen Pulse; distinctive enough vs a generic gym template, short of a fully specific *place*. Production keeps Pulse DNA (dark field, Bebas/Space Grotesk energy, sharp geometry, selective tempo motion) while dropping lab jargon. Machine-free, named Navi Mumbai neighbourhoods, logo plate, and WhatsApp-primary make it this studio’s pitch. Remaining hole: atmosphere — hero/diff media are still anonymous gradients, so brand reads as a strong type system more than a lived studio. Not a diluted clone of frozen B: B is more theatrical and weaker on first-viewport conversion; production trades theatre for readability and booking.

**Deterministic scan:** `page.tsx` exit 0 / 0 findings. `src/components/home` exit 2 / 31 findings: 1× `side-tab` warning on `ProgrammeCard.tsx` (not rendered on `/`), 30× `design-system-color` advisories in `pulse/pulse-home.module.css` (Pulse literal hex/alpha — false positives vs DESIGN.md). No detector signal for jargon or conversion hierarchy.

**Visual overlays:** No reliable user-visible detector overlay — Assessment B used a11y snapshot + DOM evidence; live inject/overlay path not completed this run.

## Overall Impression

The critique-resolution pass worked. Prior P0/P1 items that diluted persuasion are gone; WhatsApp is unmistakably primary; mobile ~390 shows brand → offer → WhatsApp CTA before media. Biggest remaining gap is emotional proof of place (real photography), not hierarchy or language.

## What's Working

1. **Conversion hierarchy** — Header, hero, climax, and sticky all lead with WhatsApp (`wa.me/919372402074`); form is secondary.
2. **Jargon / bloat cleanup** — Customer copy; short spine (hero → services → differentiator → branches → practical → trial → FAQ); no fake evidence or timetable theatre.
3. **Desktop tempo differentiation** — Selective beats; calm typography on yoga/home/online; functional/wedding marked differently.

## Priority Issues

### [P1] Atmosphere gap — empty gradient media plates
- **Why it matters:** Persuade peak is undercut; visitors get clarity without bodily proof of the room or machine-free claim.
- **Fix:** Replace hero + differentiator plates with real studio/people photography; keep composition, don’t reintroduce lab theatre.
- **Suggested command:** `/impeccable colorize` or media swap under `/impeccable polish` (content asset, not art-direction rewrite)

### [P2] Mobile lane sameness
- **Why it matters:** Beat bars `display: none` under 768px; tempo story becomes mostly desktop-only.
- **Fix:** Mobile-safe tempo cues (type weight, short pace labels, or thinner beat treatment that survives narrow widths).
- **Suggested command:** `/impeccable layout` / `/impeccable typeset`

### [P2] First-viewport chrome tax
- **Why it matters:** Mock banner + hero brand reprise + sticky compress ~390 (banner is launch-gate; brand double-up is optional).
- **Fix:** Soften hero brand reprise on mobile once banner remains; keep CTA above fold.
- **Suggested command:** `/impeccable quieter` / `/impeccable distill`

### [P3] Nav Timetable vs honest “no timetable published”
- **Why it matters:** Consistency/trust friction for timetable shoppers.
- **Fix:** Rename nav, route to WhatsApp/contact honesty, or publish a minimal schedule when ready.
- **Suggested command:** `/impeccable clarify`

### [P3] Seven equal-width service rows still catalogue-like
- **Why it matters:** Despite per-tempo styling, list can feel inventory-heavy.
- **Fix:** Stronger featured/secondary grouping without reintroducing HIT/HOLD/GROOVE jargon.
- **Suggested command:** `/impeccable shape`

## Prior P0/P1 resolution checklist

| Prior finding | Status | Evidence |
|---|---|---|
| **P0** Meta / disclaimer dilution | **Resolved** | No Utility/TEMPO/HIT/HOLD/REPLACE in `/` body; honesty in mock banner + footer |
| **P1** Equal lanes / EQ gadgetry | **Mostly resolved** | Selective beats desktop; residual mobile beat hide + 7-row list |
| **P1** Section bloat | **Resolved** | Distilled seven-section spine |
| **P1** Mobile first viewport | **Resolved** | Brand + H1 + lede + WhatsApp CTA in 390 viewport; media deferred |
| **P1** Jargon | **Resolved** on `/`; still present on frozen B (reference only) |

## Explicit verification

| Check | Result |
|---|---|
| WhatsApp primary | **Pass** — 4 live `wa.me` CTAs; form secondary |
| Mobile ~390 first viewport | **Pass** — brand, offering, primary CTA above sticky |
| Distinct vs generic fitness | **Mostly yes** — machine-free + local names + display type; photo gap remains |
| Distinct vs diluted Pulse | **Pass** — Pulse translated for customers, not washed-out B theatre |

## Persona Red Flags

**Jordan (First-Timer / neighbourhood parent):** Gets clear offer and WhatsApp path; may stall without room photos (“what does it look like?”).

**Yoga / ladies-only seeker:** Dark HIIT-club read can still overpower calm until yoga lane + photography carry more weight.

**Timetable shopper:** Clicks Timetable after homepage says schedules aren’t published — trust friction.

## Minor Observations

- Frozen Revamp B still shows TEMPO LANES / HIT·HOLD·GROOVE / FEEL THE ROOM'S TEMPO — expected for frozen reference; not a production defect.
- Next.js “1 Issue” overlay in local screenshots is tooling chrome, not product UI.
- Detector `side-tab` on ProgrammeCard is real pattern elsewhere, not live homepage surface.

## Questions to Consider

1. If you strip purple CTAs and display type, does anything left prove a neighbourhood floor in Airoli — or only a competent fitness kit?
2. Was translating Pulse for customers worth losing Revamp B’s bodily first-screen punch — and when do photos earn that punch back without lab theatre?
3. Why keep Timetable in primary nav while the homepage’s honest promise is “message us — we don’t publish a full timetable yet”?
