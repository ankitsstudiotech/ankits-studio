# Business Data Status

This is the **single source of truth** for what is real vs. mock in this project.
If this doc says a field is `MOCK`, no other doc, component, or commit message may
imply it is real. See [DECISIONS.md ADR-002](./DECISIONS.md#adr-002) for the
mechanism that enforces this at build/runtime.

Status values: `MOCK` (placeholder, invented for structure/design only),
`REFERENCE-ONLY` (owner supplied a pointer but it isn't structured/confirmed yet),
`VERIFIED` (owner confirmed this exact value for publication).

## Domains

| Domain | Status | Notes |
|---|---|---|
| Branch addresses (Airoli, Ghansoli) | MOCK | Owner supplied Google Maps pins as location references, not transcribed addresses. Do not copy text scraped from Maps into copy — treat as unverified until owner confirms the printable address string. |
| Thane branch (existence, address, everything) | MOCK / REFERENCE-ONLY | Owner flagged Thane as "known or expected" — not confirmed as operating. Build Thane as a full mock branch so IA/design work isn't blocked, but it must not go live without explicit owner confirmation the branch exists. |
| Phone / WhatsApp numbers | MOCK | Use obviously fake but correctly-formatted Indian mobile numbers (e.g. `+91 90000 00000` pattern), never a real-looking number that could be mistaken for in-service. |
| Fees / membership pricing | MOCK | Placeholder tiers only. Never publish a specific rupee figure without owner sign-off — pricing is the highest-risk domain for real-world harm if leaked as real. |
| Batch/class timetables | MOCK | Plausible slot grid per programme/branch, clearly a placeholder schedule. |
| Trainer names, qualifications, bios | MOCK | Do not use real trainer names or real certifications unless supplied and confirmed by the owner. |
| Testimonials | MOCK | Fabricated quotes must be labelled as illustrative examples, never attributed to a real, identifiable person. |
| Transformation results (before/after, numbers) | MOCK | No fabricated body-transformation photography claims. Use placeholder copy describing the *kind* of result, not a specific verifiable number, and label clearly. |
| Member counts / social proof numbers | MOCK | Do not invent specific counts ("2,400+ members") without a source. |
| Opening hours | MOCK | Placeholder hours per branch. |
| Programme list (strength, personal training, yoga, Zumba, adult dance, kids dance, weight-loss/fitness) | VERIFIED | Confirmed directly by the owner in the brief. Names/descriptions of *what programmes exist* are real; fees/timings/trainers attached to them are still MOCK. |
| Location list (Airoli, Ghansoli confirmed; Thane expected) | VERIFIED (Airoli, Ghansoli) / REFERENCE-ONLY (Thane) | See Thane row above. |

## Verification workflow

1. Owner reviews this table and supplies the real value for a domain.
2. The corresponding content record's `dataStatus` field (see
   [CONTENT-MODEL.md](./CONTENT-MODEL.md)) is flipped from `"mock"` to `"verified"`
   in the same change that updates this table.
3. This table's row is updated in the same commit — the table and the code must
   never disagree.
4. Only when **every domain required for a given route** is `VERIFIED` may that
   route be removed from the mock-data banner allowlist (see
   [DECISIONS.md ADR-002](./DECISIONS.md#adr-002)).
5. Full production launch requires all rows above to be `VERIFIED` (Thane may
   remain absent from the live site rather than being force-verified, if the
   branch turns out not to exist).

## Ownership of this document

Only the business owner (or someone relaying an explicit, quotable instruction
from them) may change a status to `VERIFIED`. Neither Claude nor Cursor may mark
a row verified on their own inference — this is a hard rule, see
[DECISIONS.md ADR-002](./DECISIONS.md#adr-002) and [TASKS.md](./TASKS.md).
