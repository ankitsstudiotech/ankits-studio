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
| Branch addresses (Airoli, Ghansoli) | MOCK | Owner supplied two Google Maps pins as location references (see "Owner-supplied Maps links" below), not transcribed addresses. Do not copy text scraped from Maps into copy — treat as unverified until owner confirms the printable address string. `mapEmbedUrl` must not be rendered/embedded pre-verification — see [CONTENT-MODEL.md](./CONTENT-MODEL.md) hard rules and [DECISIONS.md ADR-011](./DECISIONS.md#adr-011). Neither Maps link is currently assigned to a specific branch in `src/content/mock/branches.ts` — see the note below on why. |
| Thane branch (existence, address, everything) | MOCK / REFERENCE-ONLY | Owner flagged Thane as "known or expected" — not confirmed as operating. Build Thane as a full mock branch (`Branch.publiclyListed = false`) so IA/design work isn't blocked, but it must not appear in public nav/footer/sitemap and must not go live without explicit owner confirmation the branch exists — see [DECISIONS.md ADR-007](./DECISIONS.md#adr-007) (finding I2) and [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md). `Branch.address` for Thane is literally `"To be confirmed"` in code (`src/content/mock/branches.ts`), not a longer placeholder sentence — kept exact so it reads unambiguously as pending. |
| Business identity (name, tagline, description) | MOCK | The business name "Ankit's Studio" itself is confirmed directly by the owner in the project brief; tagline, description, and founding year are illustrative placeholders pending review — the whole `BusinessIdentity` record stays `dataStatus: "mock"` per record-level provenance (see [CONTENT-MODEL.md](./CONTENT-MODEL.md)). |
| FAQs | MOCK | Generic, safe placeholder Q&A (booking, first-class logistics, cancellation policy) — no medical or guaranteed-outcome claims. Not reviewed or confirmed by the owner. FAQPage structured data only ever includes `verified` entries — see [SEO-STRATEGY.md](./SEO-STRATEGY.md). |
| General contact details (non-branch-specific email/phone/contact preference) | MOCK | Placeholder general email/phone and a CTA-priority ordering (trial form > WhatsApp > phone > email, per [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md)'s Conversion model). Distinct from, and does not duplicate, per-branch `Branch.phone`/`Branch.whatsapp`. |
| Primary/footer navigation structure | VERIFIED | Navigation labels/routes are a structural IA decision made directly by this project, not an owner-confirmed real-world fact — so `dataStatus: "verified"` here means "this is the site's actual current IA," not "the owner reviewed this text." Matches the phased Phase 1 nav in [INFORMATION-ARCHITECTURE.md](./INFORMATION-ARCHITECTURE.md) exactly (no Tier 2 links yet). |
| Phone / WhatsApp numbers | MOCK | Use an obviously non-dialable example pattern (e.g. reserved/placeholder digit sequences), never a plausible real-looking number. `tel:`/`wa.me` hrefs are never rendered for a mock/reference-only record — values display as plain text only. See [DECISIONS.md ADR-011](./DECISIONS.md#adr-011). |
| Fees / membership pricing | MOCK | Placeholder tiers only. Never publish a specific rupee figure without owner sign-off — pricing is the highest-risk domain for real-world harm if leaked as real. |
| Batch/class timetables | MOCK | Plausible slot grid per programme/branch, clearly a placeholder schedule. |
| Trainer names, qualifications, bios | MOCK | Do not use real trainer names or real certifications unless supplied and confirmed by the owner. |
| Testimonials | MOCK | Fabricated quotes must be labelled as illustrative examples, never attributed to a real, identifiable person. |
| Transformation results (before/after, numbers) | MOCK | No fabricated body-transformation photography claims. Use placeholder copy describing the *kind* of result, not a specific verifiable number, and label clearly. |
| Member counts / social proof numbers | MOCK | Do not invent specific counts ("2,400+ members") without a source. No content type exists for this domain and none is added speculatively — see [DECISIONS.md ADR-011](./DECISIONS.md#adr-011). Hardcoding a number anywhere is banned; if this domain is ever needed, it requires a new typed record and its own DECISIONS.md entry first. |
| Opening hours | MOCK | Placeholder hours per branch. |
| Programme list (strength, personal training, yoga, Zumba, adult dance, kids dance, weight-loss/fitness) | VERIFIED | Confirmed directly by the owner in the brief. Names/descriptions of *what programmes exist* are real; fees/timings/trainers attached to them are still MOCK. |
| Location list (Airoli, Ghansoli confirmed; Thane expected) | VERIFIED (Airoli, Ghansoli) / REFERENCE-ONLY (Thane) | See Thane row above. |

## Owner-supplied Maps links

Preserved here as source references, per docs/PROJECT-BRIEF.md — **not**
automatically treated as verified structured data for either branch:

- https://maps.app.goo.gl/NWrGtXKKYwr5xXwbA?g_st=ac
- https://maps.app.goo.gl/WzhJUEhAvC67eMgR8?g_st=ac

The owner supplied these as two location pins without labelling which is
Airoli and which is Ghansoli. Guessing an assignment would fabricate a
mapping the owner never confirmed — worse than leaving it unassigned — so
neither link is currently written into `Branch.mapEmbedUrl` in
`src/content/mock/branches.ts`. When the owner confirms which pin belongs to
which branch, populate `mapEmbedUrl` on the matching `Branch` record in the
same change that updates this note (per the verification workflow below);
it still won't be rendered/embedded until that branch's `dataStatus` is
`"verified"` (see `DECISIONS.md` ADR-011).

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
